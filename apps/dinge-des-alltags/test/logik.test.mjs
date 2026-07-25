import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PRO_SESSION, TYPEN, waehleAufgaben, richtigeOption, pruefeDaten } from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/aufgaben.json', import.meta.url), 'utf8'));
const kopie = () => JSON.parse(JSON.stringify(daten));

test('Aufgaben sind gültig', () => {
  assert.deepEqual(pruefeDaten(daten), []);
  assert.ok(daten.aufgaben.length >= 18);
});

test('Sitzungsgrenze: höchstens sechs Aufgaben, ohne Dubletten', () => {
  assert.ok(PRO_SESSION <= 6, 'für 3-5 muss die Sitzung kurz bleiben');
  for (let i = 0; i < 50; i++) {
    const runde = waehleAufgaben(daten.aufgaben);
    assert.equal(runde.length, PRO_SESSION);
    assert.equal(new Set(runde.map((a) => a.id)).size, PRO_SESSION, 'Aufgabe doppelt in einer Sitzung');
  }
  // Die Bank bleibt unberührt und über mehrere Sitzungen wechselt die Auswahl
  assert.equal(daten.aufgaben.length >= 18, true);
  const gesehen = new Set();
  for (let i = 0; i < 40; i++) for (const a of waehleAufgaben(daten.aufgaben)) gesehen.add(a.id);
  assert.ok(gesehen.size > PRO_SESSION, 'immer dieselben Aufgaben – keine Rotation');
});

test('genau eine richtige Option je Aufgabe – sonst wäre die Rückmeldung gelogen', () => {
  for (const a of daten.aufgaben) {
    assert.equal(a.optionen.filter((o) => o.richtig).length, 1, `${a.id}: nicht genau eine richtige Option`);
    assert.ok(richtigeOption(a).text, `${a.id}: richtige Option ohne Text`);
  }
  const zwei = kopie();
  zwei.aufgaben[0].optionen[1].richtig = true;
  assert.ok(pruefeDaten(zwei).some((f) => /genau EINE richtige Option/.test(f)));
  const keine = kopie();
  keine.aufgaben[0].optionen.forEach((o) => { o.richtig = false; });
  assert.ok(pruefeDaten(keine).some((f) => /genau EINE richtige Option/.test(f)));
});

test('alle sechs Aufgabentypen des Katalogs kommen vor', () => {
  for (const typ of TYPEN) {
    assert.ok(daten.aufgaben.some((a) => a.typ === typ), `typ fehlt: ${typ}`);
  }
  const fehlend = kopie();
  fehlend.aufgaben = fehlend.aufgaben.filter((a) => a.typ !== 'fahrzeug');
  assert.ok(pruefeDaten(fehlend).some((f) => /typ fahrzeug: keine einzige Aufgabe/.test(f)));
});

test('„gemacht oder gewachsen“: beide Antworten kommen vor', () => {
  const gemacht = daten.aufgaben.filter((a) => a.typ === 'gemacht');
  assert.ok(gemacht.length >= 4, 'zu wenige Sortierfragen');
  const loesungen = new Set(gemacht.map((a) => richtigeOption(a).text));
  assert.equal(loesungen.size, 2, 'sonst lernt das Kind eine Klopfregel statt einer Unterscheidung');
  for (const a of gemacht) {
    assert.equal(a.optionen.length, 2, `${a.id}: genau zwei Antworten erwartet`);
  }
  // Wäre immer dieselbe Antwort richtig, müsste der Validator meckern
  const einseitig = kopie();
  for (const a of einseitig.aufgaben.filter((x) => x.typ === 'gemacht')) {
    a.optionen.forEach((o) => { o.richtig = /gemacht/.test(o.text); });
  }
  assert.ok(pruefeDaten(einseitig).some((f) => /immer dieselbe Antwort richtig/.test(f)));
});

test('jede Aufgabe endet mit einem Gesprächsimpuls für den Erwachsenen', () => {
  for (const a of daten.aufgaben) {
    assert.ok(a.gespraech.length >= 20, `${a.id}: Impuls zu knapp`);
    assert.ok(
      a.gespraech.trim().endsWith('?') || a.gespraech.includes(':'),
      `${a.id}: Impuls soll ein Gespräch öffnen`,
    );
  }
  const ohne = kopie();
  ohne.aufgaben[0].gespraech = 'Das war es dann.';
  assert.ok(pruefeDaten(ohne).some((f) => /Gesprächsimpuls soll eine Frage/.test(f)));
});

test('Ton: kein Tadel, keine Wertung des Kindes', () => {
  const text = JSON.stringify(daten).toLowerCase();
  for (const wort of ['falsch', 'leider', 'dumm', 'blöd', 'schade', 'nicht richtig', 'fehler gemacht', 'punkte', 'gewonnen', 'verloren']) {
    assert.ok(!text.includes(wort), `unerwünschtes Wort im Datensatz: ${wort}`);
  }
});

test('die Sitzung endet offline', () => {
  assert.ok(daten.schlussIdeen.length >= 3);
  for (const i of daten.schlussIdeen) assert.ok(i.length >= 30, `Schlussidee zu knapp: ${i}`);
  const ohne = kopie();
  ohne.schlussIdeen = ['zu wenig'];
  assert.ok(pruefeDaten(ohne).some((f) => /schlussIdeen/.test(f)));
});
