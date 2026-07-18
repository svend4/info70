import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { anforderungenFuer, gewaehlteFunktionen, baueModerationskonzept, hoechstesRisiko } from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/funktionen.json', import.meta.url), 'utf8'));

test('Katalog: Funktionen mit eindeutigen IDs, Basis-Anforderungen vorhanden', () => {
  const ids = daten.funktionen.map((f) => f.id);
  assert.equal(new Set(ids).size, ids.length, 'doppelte Funktions-IDs');
  assert.ok(daten.funktionen.length >= 4, 'mindestens 4 Interaktionsfunktionen');
  for (const pflicht of ['kommentare', 'upload', 'abstimmung']) assert.ok(ids.includes(pflicht), `Funktion fehlt: ${pflicht}`);
  assert.ok(daten.basis.length >= 4, 'Basis-Anforderungen vorhanden');
  for (const a of [...daten.basis, ...daten.funktionen.flatMap((f) => f.anforderungen)]) {
    assert.ok(a.text.length >= 20 && a.bezug, 'Anforderung braucht Text + Bezug');
  }
});

test('jede Funktion: Name, Emoji, Risiko, mindestens eine eigene Anforderung', () => {
  for (const f of daten.funktionen) {
    assert.ok(f.name && f.emoji && f.beschreibung, `${f.id}: Meta fehlt`);
    assert.match(f.risiko, /niedrig|mittel|hoch|sehr hoch/, `${f.id}: Risiko fehlt`);
    assert.ok(f.anforderungen.length >= 1, `${f.id}: keine spezifische Anforderung`);
  }
});

test('anforderungenFuer: Basis + funktionsspezifisch, dedupliziert', () => {
  const leer = anforderungenFuer(daten, []);
  assert.equal(leer.length, 0, 'ohne Auswahl keine Anforderungen');

  const komm = anforderungenFuer(daten, ['kommentare']);
  // Basis (5) + kommentare-spezifisch (3) = 8, sofern keine Textdopplung
  const erwartet = new Set([...daten.basis, ...daten.funktionen.find((f) => f.id === 'kommentare').anforderungen].map((a) => a.text));
  assert.equal(komm.length, erwartet.size, 'Basis + spezifisch zusammengeführt');
  assert.ok(komm.some((a) => /Melde-Weg/.test(a.text)), 'Basis enthalten');
  assert.ok(komm.some((a) => /Vor- oder Nachmoderation/.test(a.text)), 'spezifisch enthalten');

  // Deduplizierung: keine doppelten Texte
  const texte = komm.map((a) => a.text);
  assert.equal(new Set(texte).size, texte.length, 'keine doppelten Anforderungen');
});

test('upload ist Hochrisiko und verlangt zwingende Vormoderation', () => {
  const up = anforderungenFuer(daten, ['upload']);
  assert.ok(up.some((a) => /Vormoderation ist zwingend/.test(a.text)), 'Upload verlangt Vormoderation');
  assert.equal(hoechstesRisiko(daten, ['abstimmung', 'upload']), 'hoch', 'höchstes Risiko übernommen');
  assert.equal(hoechstesRisiko(daten, ['chat']), 'sehr hoch');
});

test('baueModerationskonzept: übernimmt Auswahl, listet Anforderungen + Ausfüllfelder', () => {
  const doc = baueModerationskonzept(daten, ['kommentare', 'upload']);
  assert.match(doc, /Kommentare/);
  assert.match(doc, /Upload/);
  assert.match(doc, /\[ \]/, 'Anforderungen als Checkliste');
  assert.match(doc, /Wer moderiert\?/, 'Ausfüllfeld Moderation');
  assert.match(doc, /Netiquette/, 'Netiquette-Feld');
  assert.match(doc, /DSA|JMStV|JuSchG/, 'Rechtsrahmen genannt');
  assert.ok(!/https?:\/\//.test(doc), 'keine externen Links');
});

test('baueModerationskonzept: ohne Auswahl trotzdem nutzbare Vorlage', () => {
  const doc = baueModerationskonzept(daten, []);
  assert.match(doc, /noch keine gewählt/);
  assert.match(doc, /erst Funktionen wählen/);
  assert.match(doc, /Wer moderiert\?/, 'Ausfüllfelder auch ohne Auswahl');
});

test('gewaehlteFunktionen behält die Katalogreihenfolge bei', () => {
  const g = gewaehlteFunktionen(daten, ['upload', 'kommentare']);
  assert.deepEqual(g.map((f) => f.id), ['kommentare', 'upload'], 'Reihenfolge = Katalog, nicht Eingabe');
});
