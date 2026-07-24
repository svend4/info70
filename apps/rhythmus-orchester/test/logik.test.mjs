import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  BAUSTEINE, TEMPI, SCHLAEGE_PRO_TAKT, bausteinVon, schlaegeVon, passtInTakt,
  musterRichtig, anschlaege, stimmenFuerPhrase, baueMuster, silbenGruppen,
  silbenText, sprechText, pruefeDaten,
} from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/rhythmen.json', import.meta.url), 'utf8'));

/** Minimaler gültiger Bestand für die Negativ-Proben des Validators. */
const gueltig = () => ({
  version: 1,
  verse: [1, 2, 3, 4].map((n) => ({
    id: `v${n}`,
    titel: `Vers ${n}`,
    emoji: '🥁',
    bewegung: 'Auf jeden Schlag einmal klatschen.',
    takte: [
      { bausteine: ['ta', 'ta', 'titi', 'pause'], silben: ['eins', 'zwei', 'drei', 'vier'] },
      { bausteine: ['ta', 'ta', 'ta', 'ta'], silben: ['a', 'b', 'c', 'd'] },
    ],
  })),
  stimmen: [
    { id: 's1', name: 'Stampfen', emoji: '🦶', klang: 'stampfen', muster: ['ta', 'pause', 'ta', 'pause'], einsatz: 1 },
    { id: 's2', name: 'Klatschen', emoji: '👏', klang: 'klatschen', muster: ['pause', 'ta', 'pause', 'ta'], einsatz: 2 },
    { id: 's3', name: 'Schnipsen', emoji: '🤏', klang: 'schnipsen', muster: ['titi', 'pause', 'titi', 'pause'], einsatz: 3 },
  ],
});

test('Datenbestand ist gültig: 5 Verse, 3 Stimmen, jeder Takt genau 4 Schläge', () => {
  assert.deepEqual(pruefeDaten(daten), []);
  assert.equal(daten.verse.length, 5);
  assert.equal(daten.stimmen.length, 3);
  for (const vers of daten.verse) {
    assert.equal(vers.takte.length, 2, `${vers.id}: zwei Takte`);
    for (const takt of vers.takte) assert.ok(passtInTakt(takt.bausteine), `${vers.id}: 4 Schläge`);
  }
});

test('jeder Baustein füllt genau einen Schlag – so passt das Muster aufs Metronom', () => {
  assert.equal(BAUSTEINE.length, 3);
  for (const b of BAUSTEINE) assert.equal(b.schlaege, 1, `${b.id}`);
  assert.deepEqual(BAUSTEINE.map((b) => b.silben), [1, 2, 0]);
  assert.equal(schlaegeVon(['ta', 'titi', 'pause', 'ta']), SCHLAEGE_PRO_TAKT);
  assert.equal(passtInTakt(['ta', 'ta', 'ta']), false);
  assert.equal(passtInTakt(['ta', 'ta', 'ta', 'ta', 'ta']), false);
  assert.equal(passtInTakt(['ta', 'ta', 'ta', 'halbe']), false); // unbekannter Baustein
  assert.equal(bausteinVon('halbe'), null);
  assert.deepEqual(TEMPI.map((t) => t.bpm), [60, 80, 100]);
});

test('anschlaege: ti-ti klingt zweimal im halben Schlagabstand, die Pause gar nicht', () => {
  const treffer = anschlaege(['ta', 'titi', 'pause', 'ta'], 60);
  assert.deepEqual(treffer.map((t) => t.zeit), [0, 1, 1.5, 3]);
  assert.deepEqual(treffer.map((t) => t.schlag), [1, 2, 2, 4]);
  assert.deepEqual(treffer.map((t) => t.erster), [true, true, false, true]);
  // doppeltes Tempo = halbe Zeiten, gleicher Versatz
  assert.deepEqual(anschlaege(['ta', 'titi', 'pause', 'ta'], 120, 10).map((t) => t.zeit), [10, 10.5, 10.75, 11.5]);
  // Der Katzen-Vers wartet: sein zweiter Takt beginnt mit einer Pause.
  const katze = daten.verse.find((v) => v.id === 'katze');
  assert.equal(katze.takte[1].bausteine[0], 'pause');
  assert.equal(anschlaege(katze.takte[1].bausteine, 60)[0].schlag, 2);
});

test('musterRichtig vergleicht Reihenfolge und Länge', () => {
  assert.equal(musterRichtig(['ta', 'titi', 'ta', 'pause'], ['ta', 'titi', 'ta', 'pause']), true);
  assert.equal(musterRichtig(['ta', 'titi', 'ta', 'pause'], ['ta', 'ta', 'titi', 'pause']), false);
  assert.equal(musterRichtig(['ta', 'titi'], ['ta', 'titi', 'ta']), false);
  assert.equal(musterRichtig(['ta'], null), false);
});

test('baueMuster ist mit injiziertem Wähler bestimmbar und nie nur Stille', () => {
  assert.deepEqual(baueMuster((liste) => liste[1]), ['titi', 'titi', 'titi', 'titi']);
  assert.deepEqual(baueMuster((liste) => liste[0], 2), ['ta', 'ta']);
  // Reine Pausen wären keine Aufgabe: der erste Schlag wird hörbar.
  assert.deepEqual(baueMuster((liste) => liste[2]), ['ta', 'pause', 'pause', 'pause']);
  for (let i = 0; i < 50; i++) {
    const muster = baueMuster((liste) => liste[Math.floor(Math.random() * liste.length)]);
    assert.ok(passtInTakt(muster));
    assert.ok(muster.some((id) => id !== 'pause'));
  }
});

test('Silben gehören zu ihren Bausteinen: ti-ti bekommt zwei, die Pause keine', () => {
  const regen = daten.verse.find((v) => v.id === 'regen');
  assert.equal(silbenText(regen.takte[0]), 'Ei-ne Wol-ke, dun-kel, schwer,');
  assert.equal(sprechText(regen.takte[0]), 'Eine Wolke, dunkel, schwer,');
  const zaehl = daten.verse.find((v) => v.id === 'zaehlvers');
  const gruppen = silbenGruppen(zaehl.takte[1]);
  assert.deepEqual(gruppen.map((g) => g.silben.length), [2, 1, 1, 0]);
  assert.deepEqual(gruppen.at(-1), { baustein: 'pause', silben: [] });
  assert.equal(silbenText(zaehl.takte[1]), 'al-le sind hier');
});

test('stimmenFuerPhrase: die Stimmen setzen nacheinander ein', () => {
  assert.deepEqual(daten.stimmen.map((s) => s.einsatz), [1, 2, 3]);
  assert.deepEqual(stimmenFuerPhrase(daten.stimmen, 1).map((s) => s.id), ['stampfen']);
  assert.deepEqual(stimmenFuerPhrase(daten.stimmen, 2).map((s) => s.id), ['stampfen', 'klatschen']);
  assert.equal(stimmenFuerPhrase(daten.stimmen, 4).length, 3);
  assert.deepEqual(stimmenFuerPhrase(daten.stimmen, 0), []);
  assert.deepEqual(stimmenFuerPhrase(null, 2), []);
});

test('pruefeDaten schlägt bei falschen Takten, Silben und Einsätzen an', () => {
  assert.deepEqual(pruefeDaten(gueltig()), []);

  const zuLang = gueltig();
  zuLang.verse[0].takte[0].bausteine = ['ta', 'ta', 'ta', 'ta', 'ta'];
  assert.ok(pruefeDaten(zuLang).some((f) => f.includes('4 Schläge')));

  const silbenFalsch = gueltig();
  silbenFalsch.verse[1].takte[1].silben = ['a', 'b', 'c'];
  assert.ok(pruefeDaten(silbenFalsch).some((f) => f.includes('4 Silben erwartet, 3 gefunden')));

  const leereSilbe = gueltig();
  leereSilbe.verse[2].takte[1].silben = ['a', ' ', 'c', 'd'];
  assert.ok(pruefeDaten(leereSilbe).some((f) => f.includes('leere Silbe')));

  const ohnePause = gueltig();
  for (const v of ohnePause.verse) {
    v.takte[0].bausteine = ['ta', 'ta', 'titi', 'ta'];
    v.takte[0].silben = ['eins', 'zwei', 'drei', 'vier', 'fünf'];
  }
  assert.ok(pruefeDaten(ohnePause).some((f) => f.includes('kein Vers übt die Pause')));

  const gleicherEinsatz = gueltig();
  gleicherEinsatz.stimmen[2].einsatz = 2;
  assert.ok(pruefeDaten(gleicherEinsatz).some((f) => f.includes('nacheinander einsetzen')));

  const ohneErstenEinsatz = gueltig();
  ohneErstenEinsatz.stimmen[0].einsatz = 3;
  ohneErstenEinsatz.stimmen[2].einsatz = 2;
  assert.ok(pruefeDaten(ohneErstenEinsatz).some((f) => f.includes('Phrase 1 beginnen')));

  const stilleStimme = gueltig();
  stilleStimme.stimmen[1].muster = ['pause', 'pause', 'pause', 'pause'];
  assert.ok(pruefeDaten(stilleStimme).some((f) => f.includes('nur Stille')));

  const falscherKlang = gueltig();
  falscherKlang.stimmen[0].klang = 'trommel';
  assert.ok(pruefeDaten(falscherKlang).some((f) => f.includes('unbekannter Klang')));

  const kurzeBewegung = gueltig();
  kurzeBewegung.verse[3].bewegung = 'hüpfen';
  assert.ok(pruefeDaten(kurzeBewegung).some((f) => f.includes('Bewegungsidee')));

  assert.deepEqual(pruefeDaten({ verse: [], stimmen: [] }), ['verse fehlt oder weniger als 4 Verse']);
});
