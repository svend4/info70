import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  STUFEN, BELEHRUNG, SCHULDZUWEISUNG, ETIKETT, ANGST, GESAMTWERTUNG, SEITE,
  reihenfolge, szenarioVon, pruefeDaten,
} from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/szenarien.json', import.meta.url), 'utf8'));
const kopie = () => JSON.parse(JSON.stringify(daten));

test('die Daten sind in Ordnung', () => {
  assert.deepEqual(pruefeDaten(daten), []);
});

test('jede Situation hat genau eine 2, eine 1 und eine 0 - und die 0 ist die Falle', () => {
  for (const s of daten.szenarien) {
    const werte = s.optionen.map((o) => o.wert).sort();
    assert.deepEqual(werte, [0, 1, 2], s.id);
    const falle = s.optionen.find((o) => o.wert === 0);
    assert.equal(falle.falle, true, s.id);
    assert.ok(s.optionen.filter((o) => o.wert !== 0).every((o) => !o.falle), s.id);
  }
  assert.deepEqual([...STUFEN], [2, 1, 0]);
});

test('jede Einstufung trägt eine Seitenangabe', () => {
  for (const s of daten.szenarien) assert.match(`${s.erklaerung} ${s.quelle}`, SEITE, s.id);
  for (const g of daten.grundhaltungen) assert.match(g.quelle, SEITE, g.titel);
});

test('die Stufe 2 und 1 tragen keine Belehrung, keine Schuldzuweisung, keine Etiketten, keine Angst', () => {
  for (const s of daten.szenarien) {
    for (const o of s.optionen.filter((x) => x.wert !== 0)) {
      assert.equal(BELEHRUNG.test(o.text), false, `${s.id}: ${o.text}`);
      assert.equal(SCHULDZUWEISUNG.test(o.text), false, `${s.id}: ${o.text}`);
      assert.equal(ETIKETT.test(o.text), false, `${s.id}: ${o.text}`);
      assert.equal(ANGST.test(o.text), false, `${s.id}: ${o.text}`);
    }
    assert.equal(BELEHRUNG.test(s.erklaerung), false, s.id);
  }
});

test('die Falle darf die Muster zeigen – und genau dort stehen sie', () => {
  // Die 0-Antworten sind die Gegenbeispiele; ohne sie gäbe es nichts zu zeigen.
  const fallen = daten.szenarien.map((s) => s.optionen.find((o) => o.wert === 0).text);
  assert.ok(fallen.some((t) => BELEHRUNG.test(t)), 'keine Belehrung als Falle');
  assert.ok(fallen.some((t) => SCHULDZUWEISUNG.test(t)), 'keine Schuldzuweisung als Falle');
  assert.ok(fallen.some((t) => ANGST.test(t)), 'keine Angstmache als Falle');
});

test('Belehrung in einer 2-Antwort fällt auf', () => {
  const d = kopie();
  d.szenarien[0].optionen.find((o) => o.wert === 2).text = 'Sie müssen mir jetzt zuhören.';
  assert.ok(pruefeDaten(d).some((f) => /Belehrung in einer Antwort 2/.test(f)));
});

test('eine 0-Antwort ohne Falle-Markierung fällt auf', () => {
  const d = kopie();
  delete d.szenarien[0].optionen.find((o) => o.wert === 0).falle;
  assert.ok(pruefeDaten(d).some((f) => /nicht als Falle markiert/.test(f)));
});

test('eine Einstufung ohne Seite ist eine Meinung und fällt auf', () => {
  const d = kopie();
  d.szenarien[1].erklaerung = d.szenarien[1].erklaerung.replace(/\(?S\.\s?\d+\)?/g, '').replace(/PDF-/g, '');
  d.szenarien[1].quelle = 'Irgendeine Quelle.';
  assert.ok(pruefeDaten(d).some((f) => /keine Seitenangabe/.test(f)));
});

test('keine Gesamtpunktzahl, keine Rangliste - im Text und im Code', async () => {
  const app = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
  // Nur der behauptende Text: „keine Gesamtpunktzahl“ ist eine Verneinung (Falle A).
  assert.equal(GESAMTWERTUNG.test(daten.wasEsIst), false);
  // Ganze Wörter: der Feldname `keinePunktesumme` enthält „summe“ als Teil.
  assert.equal(/\bSumme\b|\bGesamt\w*|punkte\s*\+=/i.test(app.replace(/keine Gesamt/gi, '')), false,
    'die App rechnet offenbar eine Summe');
  const d = kopie();
  d.wasEsIst += ' Am Ende steht eine Gesamtpunktzahl.';
  assert.ok(pruefeDaten(d).some((f) => /Gesamtwertung/.test(f)));
});

test('das Prüfmuster trifft Gesamtpunkt, „von N Punkten“ und Ranking, aber keinen neutralen Text', () => {
  for (const text of [
    'Am Ende steht eine Gesamtpunktzahl.',
    'Sie erreichen 4 von 5 Punkten.',
    'Das Ranking der Gruppe steht unten.',
  ]) {
    assert.equal(GESAMTWERTUNG.test(text), true, `nicht getroffen: ${text}`);
    const d = kopie();
    d.wasEsIst += ` ${text}`;
    assert.ok(pruefeDaten(d).some((f) => /Gesamtwertung/.test(f)), `pruefeDaten meldet nichts: ${text}`);
  }
  // Das Wort für eine Tabelle der Plätze ist nicht Teil des Musters; der Wertungs-Stand prüft es in allen Dateien.
  assert.equal(GESAMTWERTUNG.test('Jede Antwort hat eine Stufe mit Erklärung zur Haltung.'), false);
  assert.equal(GESAMTWERTUNG.test('Es gibt keine Gesamtzahl, nur die Stufe je Antwort.'), false);
});

test('die Reihenfolge der Antworten ist deterministisch und deckt alle Plätze ab', () => {
  for (let i = 0; i < 5; i += 1) {
    const r = reihenfolge(i);
    assert.deepEqual([...r].sort(), [0, 1, 2]);
    assert.deepEqual(reihenfolge(i), r);
  }
  const erste = new Set(Array.from({ length: 5 }, (_, i) => reihenfolge(i)[0]));
  assert.ok(erste.size > 1, 'die 2 steht immer an derselben Stelle');
});

test('der Eigenentwurf ist benannt, und die Quelle wird nicht falsch zugeschrieben', () => {
  assert.match(daten.hinweis, /Eigenentwurf/);
  assert.match(daten.quelle.abweichung, /nicht/);
  assert.equal(szenarioVon(daten, 's3').titel.includes('Entwicklungsstörung'), true);
  assert.equal(szenarioVon(daten, 'gibt-es-nicht'), null);
});
