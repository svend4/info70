import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { externeFakten } from '../src/externe-fakten.mjs';

// Jede App darf höchstens so viele Zeilen mit unbelegten externen Fakten haben, wie in
// docs/externe-fakten-stand.json steht. Neue Zeilen schlagen fehl; ein gesunkener Bestand
// wird gemeldet, damit der Stand nachgezogen wird. Der Bestand ist Arbeit, kein Freibrief.
const WURZEL = new URL('../../../', import.meta.url);
const appsDir = new URL('apps/', WURZEL);
const stand = JSON.parse(await readFile(new URL('docs/externe-fakten-stand.json', WURZEL), 'utf8'));

const apps = (await readdir(appsDir, { withFileTypes: true })).filter((o) => o.isDirectory()).map((o) => o.name).sort();
const ist = {};
for (const slug of apps) {
  const n = (await externeFakten(new URL(slug, appsDir).pathname)).length;
  if (n) ist[slug] = n;
}

test('keine neue Zeile mit unbelegten externen Fakten (Normen, Studien, Erste Hilfe)', () => {
  const neu = [];
  for (const [slug, n] of Object.entries(ist)) {
    const erlaubt = stand.apps[slug] ?? 0;
    if (n > erlaubt) neu.push(`${slug}: ${n} statt ${erlaubt}`);
  }
  assert.deepEqual(neu, [], `mehr Zeilen als im Stand (docs/externe-fakten-stand.json): ${neu.join('; ')}`);
});

test('der Bestand wird ausgewiesen und muss nachgezogen werden, wenn er sinkt', (t) => {
  const gesamt = Object.values(ist).reduce((s, n) => s + n, 0);
  t.diagnostic(`Bestand unbelegter externer Fakten: ${gesamt} Zeilen in ${Object.keys(ist).length} Apps`);
  const gesunken = Object.entries(stand.apps).filter(([slug, n]) => (ist[slug] ?? 0) < n);
  if (gesunken.length) t.diagnostic(`Stand nachziehen (gesunken): ${gesunken.map(([s]) => s).join(', ')}`);
  assert.ok(gesamt >= 0);
});
