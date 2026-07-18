import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const daten = JSON.parse(await readFile(new URL('../daten/kriterien.json', import.meta.url), 'utf8'));
const alle = daten.bereiche.flatMap((b) => b.kriterien);

test('Katalog: AI-Act-Bereiche, eindeutige IDs, Selbst-Check-Hinweis', () => {
  assert.ok(daten.bereiche.length >= 4, 'mindestens 4 Bereiche');
  assert.match(daten.quelle, /KI-Verordnung|AI Act/, 'AI Act als Grundlage');
  assert.match(daten.hinweis, /kein offizielles|Selbst-Check/i, 'als Selbst-Check gekennzeichnet');
  const bIds = daten.bereiche.map((b) => b.id);
  assert.equal(new Set(bIds).size, bIds.length, 'doppelte Bereichs-IDs');
  const ids = alle.map((k) => k.id);
  assert.equal(new Set(ids).size, ids.length, 'doppelte Kriterien-IDs');
  assert.ok(alle.length >= 10, `mindestens 10 Kriterien (ist: ${alle.length})`);
});

test('jedes Kriterium: Aussage, Hilfe (was der AI Act erwartet), Bezug', () => {
  for (const k of alle) {
    assert.ok(k.text.length >= 40, `${k.id}: Aussage zu kurz`);
    assert.ok(k.hilfe.length >= 60, `${k.id}: Hilfe zu kurz`);
    assert.match(k.bezug, /AI Act|DSGVO|DSA|UN-KRK/, `${k.id}: Bezug fehlt`);
  }
});

test('die vier AI-Act-Pflichtfelder sind abgedeckt', () => {
  const bereiche = daten.bereiche.map((b) => b.id);
  for (const pflicht of ['verbote', 'einstufung', 'transparenz', 'dokumentation']) {
    assert.ok(bereiche.includes(pflicht), `Bereich fehlt: ${pflicht}`);
  }
});

test('inhaltliche Abdeckung der zentralen AI-Act-Themen', () => {
  const text = JSON.stringify(alle).toLowerCase();
  assert.match(text, /art\. 5/, 'Verbote nach Art. 5');
  assert.match(text, /schutzbedürftigkeit|verletzlichkeit|verletzlich/, 'Ausnutzen kindlicher Verletzlichkeit');
  assert.match(text, /hochrisiko|risikoklasse/, 'Risiko-Einstufung');
  assert.match(text, /art\. 50/, 'Transparenzpflichten Art. 50');
  assert.match(text, /roboter|maschine|künstlich|ki und nicht/, 'Chatbot-/KI-Kennzeichnung');
  assert.match(text, /datensparsam|wenige kinderdaten|training/, 'Datenschutz/Datensparsamkeit');
});

test('Verbots-Kriterien nennen konkret den Kinderschutz-Bezug (Art. 5)', () => {
  const verbote = daten.bereiche.find((b) => b.id === 'verbote').kriterien;
  assert.ok(verbote.every((k) => /Art\. 5/.test(k.bezug)), 'alle Verbots-Bezüge auf Art. 5');
  const text = JSON.stringify(verbote).toLowerCase();
  assert.match(text, /kinder/, 'Verbote nehmen ausdrücklich Kinder in den Blick');
});
