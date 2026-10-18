import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  FEHLER_LADEN, KARTEN_PRO_BLATT, anregungsMarke, blaettern, blattKopf, filtereKarten,
  kartenAusAntwort, kartenFuss, sicherheitsHinweis, zaehleJeGruppe,
} from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/karten.json', import.meta.url), 'utf8'));

const GRUPPEN = ['tiere', 'pflanzen', 'stoffe', 'jahreszeiten'];
const PFLICHTFELDER = ['id', 'gruppe', 'titel', 'seite', 'anregungen'];

// Die Begriffe der Quelle (Praleska, S. 51), je Gruppe.
const BEGRIFFE = {
  tiere: ['Katze', 'Hund', 'Kuh', 'Huhn', 'Fuchs', 'Hase', 'Bär'],
  pflanzen: ['Baum', 'Strauch', 'Gras'],
  stoffe: ['Wasser', 'Schnee', 'Eis', 'Sand', 'Ton', 'Steine'],
  jahreszeiten: ['Herbstlaub', 'Schnee', 'Blüte'],
};

// Die erlaubten Anregungsarten je Gruppe, in dieser Reihenfolge.
const ARTEN = {
  tiere: ['sehen', 'hören', 'bewegen'],
  pflanzen: ['benennen', 'draußen suchen'],
  stoffe: ['anfassen, beobachten'],
  jahreszeiten: ['beobachten'],
};

test('Datenschema: vier Gruppen in fester Reihenfolge, eindeutige Karten-IDs, Pflichtfelder vorhanden', () => {
  assert.deepEqual(daten.gruppen.map((g) => g.id), GRUPPEN);
  const ids = daten.karten.map((k) => k.id);
  assert.equal(new Set(ids).size, ids.length, 'doppelte Karten-IDs');
  for (const k of daten.karten) {
    for (const feld of PFLICHTFELDER) {
      assert.ok(k[feld] !== undefined, `${k.id}: Pflichtfeld ${feld} fehlt`);
    }
    assert.ok(GRUPPEN.includes(k.gruppe), `${k.id}: unbekannte Gruppe ${k.gruppe}`);
  }
});

test('Kartenset: 19 Karten, je Gruppe genau die Begriffe der Quelle (7, 3, 6, 3)', () => {
  assert.equal(daten.karten.length, 19, 'es müssen 19 Karten sein');
  for (const gruppe of GRUPPEN) {
    const namen = daten.karten.filter((k) => k.gruppe === gruppe).map((k) => k.titel);
    assert.deepEqual([...namen].sort(), [...BEGRIFFE[gruppe]].sort(), `Gruppe ${gruppe}`);
  }
});

test('Quelle: Gruppen, Karten und Ziel tragen Seitenangaben aus dem Quelltext (S. 50 und S. 51)', () => {
  assert.equal(daten.sinne.seite, 50);
  assert.ok(daten.sinne.text.includes('S. 50'), 'das Ziel nennt S. 50 nicht');
  for (const g of daten.gruppen) {
    assert.equal(g.seite, 51, `${g.id}: Gruppe nicht auf S. 51`);
    assert.ok(g.quelle.includes('S. 51'), `${g.id}: Quelltext ohne S. 51`);
    assert.ok(!/[„“"«»]/.test(g.quelle), `${g.id}: Anführungszeichen im Quellenwortlaut`);
  }
  for (const k of daten.karten) {
    assert.equal(Number.isInteger(k.seite), true, `${k.id}: Seite ist keine ganze Zahl`);
    assert.equal(k.seite, 51, `${k.id}: Karte nicht auf S. 51`);
  }
});

test('Seitenform: Anregungen haben Art und Text, Text bis 90 Zeichen, Arten je Gruppe passen', () => {
  for (const k of daten.karten) {
    assert.deepEqual(k.anregungen.map((a) => a.art), ARTEN[k.gruppe], `${k.id}: Anregungsarten`);
    for (const a of k.anregungen) {
      assert.ok(typeof a.text === 'string' && a.text.trim().length > 0, `${k.id}: leerer Text`);
      assert.ok(a.text.length <= 90, `${k.id}: Text länger als 90 Zeichen (${a.text.length})`);
    }
  }
});

test('Eigenentwurf: jede Anregung trägt Seitenangabe und Kennzeichnung, die Fußzeile trennt Quelle und Eigenentwurf', () => {
  for (const k of daten.karten) {
    assert.equal(anregungsMarke(k), `S. ${k.seite}, Eigenentwurf`, `${k.id}: Kennzeichnung`);
    const erwartet = k.gruppe === 'pflanzen'
      ? `Benennen: Quelle S. ${k.seite}; draußen suchen: Eigenentwurf`
      : `Begriff: Quelle S. ${k.seite}; Beobachtungsanregung: Eigenentwurf`;
    assert.equal(kartenFuss(k), erwartet, `${k.id}: Fußzeile`);
  }
});

test('Nicht übernommen: Igel, Eichhörnchen, Amsel und Reh stehen nicht in den Daten', () => {
  const text = JSON.stringify(daten).toLowerCase();
  for (const tier of ['igel', 'eichhörnchen', 'amsel', 'reh']) {
    assert.ok(!text.includes(tier), `${tier} darf nicht in den Daten stehen`);
  }
});

test('Pflanzen: nur benennen und draußen suchen, keine Bewegungs- oder Lautanregung', () => {
  const pflanzen = daten.karten.filter((k) => k.gruppe === 'pflanzen');
  assert.equal(pflanzen.length, 3);
  for (const k of pflanzen) {
    const arten = k.anregungen.map((a) => a.art);
    assert.ok(!arten.includes('bewegen') && !arten.includes('hören'), `${k.id}: Bewegung oder Laut`);
  }
});

test('filtereKarten: ohne Gruppe alle 19 Karten, mit Gruppe nur deren Karten', () => {
  assert.equal(filtereKarten(daten.karten).length, 19);
  assert.equal(filtereKarten(daten.karten, null).length, 19);
  for (const gruppe of GRUPPEN) {
    const treffer = filtereKarten(daten.karten, gruppe);
    assert.equal(treffer.length, BEGRIFFE[gruppe].length, `Gruppe ${gruppe}`);
    assert.ok(treffer.every((k) => k.gruppe === gruppe));
  }
});

test('zaehleJeGruppe: Summe 19 und je Gruppe die richtige Zahl', () => {
  const zaehl = zaehleJeGruppe(daten.karten);
  assert.equal(Object.values(zaehl).reduce((a, b) => a + b, 0), 19);
  assert.deepEqual(zaehl, { tiere: 7, pflanzen: 3, stoffe: 6, jahreszeiten: 3 });
});

test('blaettern: 19 Karten ergeben Blätter zu 6, 6, 6 und 1 in der Reihenfolge der Daten', () => {
  const blaetter = blaettern(daten.karten, KARTEN_PRO_BLATT);
  assert.deepEqual(blaetter.map((b) => b.length), [6, 6, 6, 1]);
  assert.deepEqual(blaetter.flat().map((k) => k.id), daten.karten.map((k) => k.id));
  assert.ok(blaetter.every((b) => b.length <= 6));
});

test('blaettern: Tiere ergeben 6 und 1, die anderen Gruppen je ein Blatt', () => {
  assert.deepEqual(blaettern(filtereKarten(daten.karten, 'tiere')).map((b) => b.length), [6, 1]);
  for (const gruppe of ['pflanzen', 'stoffe', 'jahreszeiten']) {
    assert.equal(blaettern(filtereKarten(daten.karten, gruppe)).length, 1, `Gruppe ${gruppe}`);
  }
});

test('blaettern: leere Liste ergibt kein Blatt, ungültige Blattgröße wird abgelehnt', () => {
  assert.deepEqual(blaettern([], 6), []);
  assert.throws(() => blaettern(daten.karten, 0), RangeError);
  assert.throws(() => blaettern(daten.karten, 2.5), RangeError);
});

test('blattKopf: nennt Gruppe und Blattnummer, ohne Feld für einen Namen', () => {
  const kopf = blattKopf({ gruppe: 'Tiere', nummer: 1, gesamt: 2 });
  assert.equal(kopf, 'Tiere, Blatt 1 von 2');
  assert.ok(!/Name/.test(kopf), 'die Kopfzeile darf kein Namensfeld haben');
});

test('Sicherheitshinweis: Blätter mit Steinen, Sand oder Ton tragen den Satz, alle anderen nicht', () => {
  const satz = 'Steine, Sand und Ton nur mit der Fachkraft; kleine Teile von Kleinkindern fernhalten (Eigenentwurf, keine Quellenaussage).';
  const kleinteile = ['stoff-sand', 'stoff-ton', 'stoff-steine'];
  assert.equal(sicherheitsHinweis(daten.karten.filter((k) => kleinteile.includes(k.id))), satz);
  assert.equal(sicherheitsHinweis(filtereKarten(daten.karten, 'tiere')), null, 'Tiere ohne Satz');
  assert.equal(sicherheitsHinweis(daten.karten.filter((k) => k.id === 'stoff-wasser')), null, 'Wasser ohne Satz');
  for (const blatt of blaettern(daten.karten)) {
    const traegt = blatt.some((k) => kleinteile.includes(k.id));
    assert.equal(sicherheitsHinweis(blatt) !== null, traegt, `Blatt mit ${blatt.map((k) => k.id).join(', ')}`);
  }
});

test('Fehlerweg Laden: Fehlerstatus wirft, gültige Antwort liefert die Daten, Meldung steht fest', async () => {
  assert.equal(FEHLER_LADEN, 'Die Karten konnten nicht geladen werden. Bitte die Seite neu laden.');
  await assert.rejects(kartenAusAntwort({ ok: false, status: 404, json: async () => ({}) }), /404/);
  await assert.rejects(
    kartenAusAntwort({ ok: true, status: 200, json: async () => { throw new SyntaxError('kein JSON'); } }),
    SyntaxError,
  );
  assert.deepEqual(await kartenAusAntwort({ ok: true, status: 200, json: async () => ({ a: 1 }) }), { a: 1 });
});
