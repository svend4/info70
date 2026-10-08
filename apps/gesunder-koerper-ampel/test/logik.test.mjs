import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  TAGE_IM_RUECKBLICK, STUFEN_IDS, datumsSchluessel, letzteTage, beschneide,
  zaehleStufen, alleBeantwortet, pruefeFaktoren,
} from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/faktoren.json', import.meta.url), 'utf8'));

test('Faktor-Daten sind gültig', () => {
  assert.deepEqual(pruefeFaktoren(daten), []);
  assert.equal(daten.faktoren.length, 6);
  assert.deepEqual(daten.stufen.map((s) => s.id), STUFEN_IDS);
});

test('die Katalog-Faktoren sind vollständig abgebildet', () => {
  const ids = daten.faktoren.map((f) => f.id);
  for (const noetig of ['bewegung', 'ruhe', 'essen', 'luft', 'sauberkeit', 'bildschirmfrei']) {
    assert.ok(ids.includes(noetig), `Faktor fehlt: ${noetig}`);
  }
  for (const f of daten.faktoren) {
    assert.ok(f.impuls.length >= 150, `${f.id}: Impuls zu knapp (${f.impuls.length})`);
    assert.match(f.frage, /\?$/, `${f.id}: Frage endet nicht mit Fragezeichen`);
  }
});

test('kein Scoring: keine Punkte, kein Rot, keine Ränge', () => {
  // Punktwerte an einer Stufe machen die Selbstbeobachtung zur Bewertung
  const mitPunkten = JSON.parse(JSON.stringify(daten));
  mitPunkten.stufen[0].punkte = 2;
  assert.ok(pruefeFaktoren(mitPunkten).some((f) => /vergibt keine Punkte/.test(f)));
  // Ein ruhiger Tag ist kein Fehler – das dritte Feld darf nicht rot sein
  const mitRot = JSON.parse(JSON.stringify(daten));
  mitRot.stufen[2].emoji = '🔴';
  assert.ok(pruefeFaktoren(mitRot).some((f) => /kein Rot/.test(f)));
  // Ränge würden Kinder in eine Reihenfolge bringen
  const mitRaengen = { ...JSON.parse(JSON.stringify(daten)), raenge: [{ ab: 0, titel: 'x' }] };
  assert.ok(pruefeFaktoren(mitRaengen).some((f) => /bewertet Kinder nicht/.test(f)));
  // und im echten Datensatz steht nichts davon
  assert.ok(!('raenge' in daten));
  for (const s of daten.stufen) {
    assert.ok(!('punkte' in s) && !('wert' in s), `Stufe ${s.id} trägt einen Zahlenwert`);
  }
});

test('datumsSchluessel nutzt das lokale Datum, nicht UTC', () => {
  // 23:30 Ortszeit gehört noch zum selben Tag – bei UTC-Umrechnung wäre es der nächste
  const spaet = new Date(2026, 6, 24, 23, 30, 0);
  assert.equal(datumsSchluessel(spaet), '2026-07-24');
  const frueh = new Date(2026, 0, 5, 0, 15, 0);
  assert.equal(datumsSchluessel(frueh), '2026-01-05');
});

test('letzteTage liefert aufsteigende Tage und endet heute – auch über Monatsgrenzen', () => {
  const heute = new Date(2026, 6, 3);
  const tage = letzteTage(TAGE_IM_RUECKBLICK, heute);
  assert.equal(tage.length, 7);
  assert.equal(tage.at(-1), '2026-07-03');
  assert.equal(tage[0], '2026-06-27', 'Monatswechsel muss stimmen');
  assert.deepEqual(tage, [...tage].sort(), 'aufsteigend');
  // Schaltjahr-Grenze
  assert.equal(letzteTage(2, new Date(2028, 2, 1))[0], '2028-02-29');
});

test('beschneide wirft alles außerhalb des Fensters weg und verändert das Original nicht', () => {
  const heute = new Date(2026, 6, 24);
  const tage = {
    '2026-07-24': { bewegung: 'viel' },
    '2026-07-18': { bewegung: 'etwas' },
    '2026-07-17': { bewegung: 'viel' },
    '2025-01-01': { bewegung: 'viel' },
  };
  const gekuerzt = beschneide(tage, heute);
  assert.deepEqual(Object.keys(gekuerzt).sort(), ['2026-07-18', '2026-07-24']);
  assert.equal(Object.keys(tage).length, 4, 'Original bleibt unverändert');
  assert.deepEqual(beschneide(undefined, heute), {}, 'leerer Speicher ist kein Fehler');
});

test('zaehleStufen zählt beschreibend und meldet fehlende Tage als offen', () => {
  const fenster = letzteTage(3, new Date(2026, 6, 24));
  const tage = {
    '2026-07-22': { bewegung: 'viel', essen: 'etwas' },
    '2026-07-24': { bewegung: 'nochNicht' },
  };
  assert.deepEqual(zaehleStufen(tage, 'bewegung', fenster), { viel: 1, etwas: 0, nochNicht: 1, offen: 1 });
  assert.deepEqual(zaehleStufen(tage, 'essen', fenster), { viel: 0, etwas: 1, nochNicht: 0, offen: 2 });
  // unbekannte Stufen zählen als offen, nicht als Treffer
  assert.deepEqual(zaehleStufen({ '2026-07-24': { bewegung: 'super' } }, 'bewegung', fenster).offen, 3);
});

test('alleBeantwortet erkennt den vollständigen Tag', () => {
  const voll = Object.fromEntries(daten.faktoren.map((f) => [f.id, 'etwas']));
  assert.equal(alleBeantwortet(voll, daten.faktoren), true);
  const { bewegung, ...ohne } = voll;
  assert.equal(alleBeantwortet(ohne, daten.faktoren), false);
  assert.equal(alleBeantwortet(undefined, daten.faktoren), false);
});

test('Ton: keine Beschämung, keine Diät- oder Körperbewertung, keine Diagnosen', () => {
  const text = JSON.stringify(daten).toLowerCase();
  for (const wort of ['dick', 'übergewicht', 'abnehmen', 'diät', 'kalorien', 'ungesund', 'faul', 'schäm', 'schlecht']) {
    assert.ok(!text.includes(wort), `unerwünschtes Wort im Datensatz: ${wort}`);
  }
  // "verboten" darf nur in der Verneinung vorkommen, nie als Verbot
  for (const treffer of text.match(/.{18}verboten/g) || []) {
    assert.match(treffer, /kein essen ist /, `Verbot im Datensatz: „…${treffer}“`);
  }
  for (const wort of ['diagnose', 'medikament', 'krankheit hast', 'therapie']) {
    assert.ok(!text.includes(wort), `App darf nicht medizinisch beraten: ${wort}`);
  }
  // Essen wird ausdrücklich nicht in gut und böse geteilt
  assert.match(daten.faktoren.find((f) => f.id === 'essen').impuls, /Kein Essen ist verboten/);
});

test('der Bildschirm-Faktor fragt nach der freien Zeit, nicht nach der Bildschirmzeit', () => {
  // Tragend: Die Ampel läuft in eine Richtung – 🟢 „heute viel“ ist das gute
  // Ende. Eine Frage nach der Bildschirm-DAUER würde diese Richtung umdrehen
  // und das Kind seinen Medienkonsum benoten lassen. Deshalb steht die Regel
  // im Validator und nicht nur in der Redaktion.
  const f = daten.faktoren.find((x) => x.id === 'bildschirmfrei');
  assert.ok(f, 'Faktor bildschirmfrei fehlt');
  assert.match(f.frage, /ohne Bildschirm/);
  assert.doesNotMatch(f.frage, /wie (lange|viel|oft)/i);
  assert.match(f.impuls, /zählt keine Minuten/);

  // Umgedrehte Frage: muss abgelehnt werden.
  const gedreht = JSON.parse(JSON.stringify(daten));
  gedreht.faktoren.find((x) => x.id === 'bildschirmfrei').frage = 'Wie lange warst du heute am Tablet?';
  const fehler = pruefeFaktoren(gedreht);
  assert.ok(fehler.some((e) => /nennt das Gerät/.test(e)), fehler.join(' | '));
  assert.ok(fehler.some((e) => /fragt nicht nach Dauer/.test(e)), fehler.join(' | '));

  // Und eine Geräte-Frage ohne „ohne“ ebenso.
  const nurGeraet = JSON.parse(JSON.stringify(daten));
  nurGeraet.faktoren.find((x) => x.id === 'bildschirmfrei').frage = 'Hattest du heute Fernsehen?';
  assert.ok(pruefeFaktoren(nurGeraet).some((e) => /nennt das Gerät/.test(e)));

  // Das Wort „Gerät“ selbst stand erst nicht auf der Liste – eine
  // umgedrehte Frage rutschte damit vollständig durch.
  const ueberGeraet = JSON.parse(JSON.stringify(daten));
  ueberGeraet.faktoren.find((x) => x.id === 'bildschirmfrei').frage = 'Wie lange warst du heute am Gerät?';
  assert.ok(pruefeFaktoren(ueberGeraet).some((e) => /nennt das Gerät/.test(e)));

  // Und geprüft wird auch `name`: der beschriftet die Spalte im
  // Wochenrückblick, ein „Bildschirmzeit“ dort hätte dieselbe Wirkung.
  for (const wert of ['Bildschirmzeit', 'Zeit am Tablet']) {
    const spalte = JSON.parse(JSON.stringify(daten));
    spalte.faktoren.find((x) => x.id === 'bildschirmfrei').name = wert;
    assert.ok(pruefeFaktoren(spalte).some((e) => /\.name: nennt das Gerät/.test(e)), wert);
  }

  // Der `impuls` darf dagegen benennen, was die App NICHT tut.
  assert.match(f.impuls, /wie lange ein Bildschirm an war/);
  assert.deepEqual(pruefeFaktoren(daten), []);

  // Die anderen Faktoren dürfen von der Regel nicht erfasst werden.
  for (const andere of daten.faktoren.filter((x) => x.id !== 'bildschirmfrei')) {
    assert.doesNotMatch(andere.frage, /Bildschirm|Handy|Tablet|Fernseh|Konsole/i, `${andere.id}`);
  }
});
