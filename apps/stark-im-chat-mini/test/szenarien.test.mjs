import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const daten = JSON.parse(await readFile(new URL('../daten/szenarien.json', import.meta.url), 'utf8'));
const szenarien = daten.szenarien;

test('Zielgruppe 6-8, genug Szenarien, jedes vollständig', () => {
  assert.equal(daten.zielgruppe, '6-8');
  assert.ok(szenarien.length >= 6, `mindestens 6 Szenarien (ist: ${szenarien.length})`);
  const ids = new Set();
  for (const s of szenarien) {
    assert.ok(s.id && s.piktogramm && s.situation, `unvollständig: ${s.id}`);
    assert.ok(s.erklaerung && s.erklaerung.length >= 20, `${s.id}: Erklärung zu kurz`);
    ids.add(s.id);
  }
  assert.equal(ids.size, szenarien.length, 'IDs eindeutig');
});

test('Genau ZWEI Optionen je Szenario (6-8), eine gut (2), eine schwach (0)', () => {
  for (const s of szenarien) {
    assert.equal(s.optionen.length, 2, `${s.id}: für 6-8 genau zwei Antworten`);
    const werte = s.optionen.map((o) => o.wert).sort();
    assert.deepEqual(werte, [0, 2], `${s.id}: eine gute (2) und eine schwache (0) Antwort`);
    for (const o of s.optionen) assert.ok(o.text && o.text.length >= 5, `${s.id}: Optionstext fehlt`);
  }
});

test('Leichte Sprache: kurze Sätze in Situation und Erklärung', () => {
  for (const s of szenarien) {
    assert.ok(s.situation.length <= 90, `${s.id}: Situation für 6-8 zu lang`);
    for (const satz of s.erklaerung.split(/(?<=[.!?])\s+/)) {
      assert.ok(satz.length <= 90, `${s.id}: Satz zu lang für Leichte Sprache: ${satz}`);
    }
  }
});

test('Kernbotschaften: Stopp sagen, nett sein, Erwachsene holen', () => {
  const alles = JSON.stringify(szenarien);
  assert.match(alles, /erwachsene Person|Lehrkraft|Mama|Papa/, 'Erwachsene holen kommt vor');
  assert.match(alles, /Hör auf|Stopp|nicht mit|nett/, 'Stopp/Nett-sein kommt vor');
});
