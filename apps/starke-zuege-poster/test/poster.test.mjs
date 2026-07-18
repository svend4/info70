import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { pruefePoster, posterText } from '../poster.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/poster.json', import.meta.url), 'utf8'));
const poster = daten.poster;

test('Mindestens vier Poster, jedes gültig (drei Züge, Merksatz)', () => {
  assert.ok(poster.length >= 4, 'zu wenige Poster');
  for (const p of poster) {
    assert.deepEqual(pruefePoster(p), [], `Poster ungültig: ${p.id}`);
  }
});

test('Kernthemen abgedeckt (Cybermobbing, Kettenbrief, Datenschutz, Fake-News)', () => {
  const ids = poster.map((p) => p.id);
  for (const kern of ['cybermobbing', 'kettenbrief', 'datenschatz', 'fake-news']) {
    assert.ok(ids.includes(kern), `Thema fehlt: ${kern}`);
  }
});

test('pruefePoster: erkennt fehlende Züge und kurzen Merksatz', () => {
  assert.ok(pruefePoster({ id: 'x', titel: 't', emoji: '⭐', merksatz: 'lang genug hier', schritte: [{ zug: 'a', text: 'genug text hier bitte' }] }).some((f) => /drei Züge/.test(f)));
  assert.ok(pruefePoster({ id: 'x', titel: 't', emoji: '⭐', merksatz: 'kurz', schritte: [] }).some((f) => /Merksatz/.test(f)));
});

test('posterText: enthält Titel, alle drei Züge und den Merksatz', () => {
  const t = posterText(poster[0]);
  assert.match(t, new RegExp(poster[0].titel));
  assert.match(t, /1\..*2\..*3\./s);
  assert.match(t, new RegExp(poster[0].merksatz.slice(0, 10)));
});

test('Alle referenzierten Quell-Apps existieren im Monorepo', async () => {
  for (const p of poster) {
    await assert.doesNotReject(
      access(new URL(`../../${p.quelle}/index.html`, import.meta.url)),
      `Quell-App fehlt: ${p.quelle}`);
  }
});
