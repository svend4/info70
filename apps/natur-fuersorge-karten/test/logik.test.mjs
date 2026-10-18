import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { checklisteInhalt, kartenFuer, kartenInhalt, pruefeDaten, quelleTextVon, zielVon } from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/karten.json', import.meta.url), 'utf8'));
const kopie = (x) => JSON.parse(JSON.stringify(x));

test('die Daten sind in Ordnung', () => {
  assert.deepEqual(pruefeDaten(daten), []);
});

test('vier Aufgaben auf S. 96, je mit einem Begriff aus der Quelle (höchstens 6 Wörter)', () => {
  assert.equal(daten.ziele.length, 4);
  for (const z of daten.ziele) {
    assert.equal(z.quelle, 'S. 96', z.id);
    assert.ok(z.begriff.split(/\s+/).length <= 6, z.id);
  }
});

test('die Aufgaben sind Aufgaben für die Fachkraft, keine Fähigkeiten der Kinder', () => {
  assert.doesNotMatch(JSON.stringify(daten.ziele), /Kinder können|Kinder lernen|Lernziel des Kindes/);
});

test('die drei Handlungen sind Beispiele des Textes auf S. 96', () => {
  assert.deepEqual(daten.handlungen.map((h) => h.titel), ['Gießen', 'Vögel und Fische füttern', 'Gemüse ernten']);
  for (const h of daten.handlungen) assert.equal(h.quelle, 'S. 96', h.id);
});

test('jede Karte ist als Eigenentwurf markiert und zu einer Handlung gehörig', () => {
  assert.equal(daten.karten.length, daten.handlungen.length);
  for (const k of daten.karten) {
    assert.equal(k.eigenentwurf, true, k.id);
    assert.ok(daten.handlungen.some((h) => h.id === k.handlung), k.id);
  }
});

test('kein Protokoll über einzelne Kinder: keine Felder dieser Art, und der Hinweis sagt es', () => {
  const text = JSON.stringify(daten);
  assert.doesNotMatch(text, /"(name|vorname|kind|kinder|protokoll|verlauf|beobachtung|notiz|geburtstag|alter)"\s*:/i);
  assert.match(daten.hinweis, /kein Protokoll/);
  assert.match(daten.quelle.abweichung, /Protokoll/);
});

test('die Altersangabe folgt dem Text: 1 bis 3 Jahre, nicht 2–3', () => {
  assert.match(daten.zielgruppe, /1 bis 3 Jahren/);
  assert.match(daten.quelle.abweichung, /1 bis 3 Jahre/);
});

test('der Filter nach Handlung liefert die passende Karte', () => {
  assert.deepEqual(kartenFuer(daten, { handlung: 'h2' }).map((k) => k.id), ['k02']);
  assert.equal(kartenFuer(daten).length, 3);
});

test('der Hinweis auf der Karte nennt das Beispiel aus dem Text und die Anregung als Eigenentwurf, ohne Seitenangabe', () => {
  const t = quelleTextVon(daten, daten.karten[0]);
  assert.match(t, /Anregung: Eigenentwurf/);
  assert.doesNotMatch(t, /S\. \d/);
});

test('der Karteninhalt liefert Titel, Beispiel aus dem Text und Anregung', () => {
  const i = kartenInhalt(daten, daten.karten[0]);
  assert.equal(i.titel, 'Gießen');
  assert.equal(i.beispiel, 'Im Text: „полить комнатные растения, растения на грядках“');
  assert.equal(i.anregung, daten.karten[0].anregung);
});

test('die Checkliste liefert Titel und Fragen, ohne Seitenangabe im Druckinhalt', () => {
  const c = checklisteInhalt(daten);
  assert.equal(c.fragen.length, daten.checkliste.fragen.length);
  assert.doesNotMatch(c.hinweis, /S\. \d/);
});

test('zielVon findet eine Aufgabe und liefert null bei unbekannter Kennung', () => {
  assert.equal(zielVon(daten, 'z4').quelle, 'S. 96');
  assert.equal(zielVon(daten, 'zz'), null);
});

test('ein Begriff mit mehr als sechs Wörtern wird abgewiesen (keine ganzen Sätze aus der Quelle)', () => {
  const d = kopie(daten);
  d.ziele[0].begriff = 'развивать интерес к наблюдению за трудом взрослого по уходу';
  assert.ok(pruefeDaten(d).some((f) => /z1: Begriff hat mehr als 6 Wörter/.test(f)));
});

test('ein Handlungsbeispiel mit mehr als sechs Wörtern wird abgewiesen', () => {
  const d = kopie(daten);
  d.handlungen[0].beispiel = 'а один два три четыре пять шесть семь';
  assert.ok(pruefeDaten(d).some((f) => /h1: Beispiel hat mehr als 6 Wörter/.test(f)));
});

test('ein Feld „protokoll“ wird abgewiesen', () => {
  const d = kopie(daten);
  d.karten[0].protokoll = 'Mia hat gegossen';
  assert.ok(pruefeDaten(d).some((f) => /protokoll/.test(f)));
});

test('ein Kindername im Datensatz wird abgewiesen', () => {
  const d = kopie(daten);
  d.checkliste.fragen.push('Name: Mia');
  d.checkliste.name = 'Mia';
  assert.ok(pruefeDaten(d).some((f) => /„name“/.test(f)));
});

test('eine Karte ohne Eigenentwurf-Markierung wird abgewiesen', () => {
  const d = kopie(daten);
  d.karten[1].eigenentwurf = false;
  assert.ok(pruefeDaten(d).some((f) => /Eigenentwurf/.test(f)));
});

test('ein Ziel außerhalb von S. 96 wird abgewiesen', () => {
  const d = kopie(daten);
  d.ziele[0].quelle = 'S. 94';
  assert.ok(pruefeDaten(d).some((f) => /z1: Quelle muss S\. 96 sein/.test(f)));
});

test('eine Karte fehlt: die Anzahl stimmt nicht mit den Handlungen', () => {
  const d = kopie(daten);
  d.karten.pop();
  assert.ok(pruefeDaten(d).some((f) => /genau eine Karte je Handlung/.test(f)));
});

test('der Hinweis ohne „kein Protokoll“ wird abgewiesen', () => {
  const d = kopie(daten);
  d.hinweis = 'Eine Kartei für Fachkräfte.';
  assert.ok(pruefeDaten(d).some((f) => /kein Protokoll/.test(f)));
});

test('ein Feldname mit Kinderbezug in einer Variante wird abgewiesen („kindername“, „notizen“)', () => {
  const d = kopie(daten);
  d.quelle.kindername = 'Mia';
  assert.ok(pruefeDaten(d).some((f) => /kindername/.test(f)));
  const e = kopie(daten);
  e.checkliste.notizen = 'nichts';
  assert.ok(pruefeDaten(e).some((f) => /notizen/.test(f)));
});

test('ein Text mit „Name: …“ wird abgewiesen, auch ohne verdächtigen Feldnamen', () => {
  const d = kopie(daten);
  d.karten[0].anregung = 'Name: Mia gießt heute ihre Pflanze, und sie hat dabei zugeschaut.';
  assert.ok(pruefeDaten(d).some((f) => /Eintrag über ein Kind/.test(f)));
});
