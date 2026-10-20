import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { aktuellerStand, leseSw, vergleiche } from '../src/sw-stand.mjs';

// Ein sw.js liefert gecachte Dateien „zuerst aus dem Cache“. Ändert sich eine davon, muss der
// CACHE-Name im sw.js hochgezählt werden, sonst bekommen wiederkehrende Nutzer*innen die alte Datei.
// docs/sw-cache-stand.json hält den Stand; node tools/sw-stand.mjs --schreiben aktualisiert ihn.
const WURZEL = fileURLToPath(new URL('../../../', import.meta.url));

test('Service-Worker-Caches: Stand stimmt, jede geänderte gecachte Datei hat einen neuen CACHE-Namen', async () => {
  const gespeichert = JSON.parse(await readFile(join(WURZEL, 'docs', 'sw-cache-stand.json'), 'utf8'));
  const aktuell = await aktuellerStand(WURZEL);
  assert.ok(Object.keys(aktuell).length > 0, 'kein sw.js gefunden');
  assert.deepEqual(vergleiche(gespeichert, aktuell), []);
});

test('leseSw: liest CACHE-Name und die vorab gecachten Pfade aus dem Quelltext', () => {
  const text = "const CACHE = 'kq-v2';\nself.addEventListener('install', (e) => {\n  e.waitUntil(caches.open(CACHE).then((c) => c.addAll([\n    './',\n    './app.mjs',\n    '../../packages/kinder-ui/css/kinder.css',\n  ])));\n});";
  assert.deepEqual(leseSw(text), {
    cache: 'kq-v2',
    pfade: ['./', './app.mjs', '../../packages/kinder-ui/css/kinder.css'],
  });
});

test('vergleiche: Änderung ohne neuen CACHE-Namen wird gemeldet, mit neuem Namen verlangt es den neuen Stand', () => {
  const alt = { 'apps/x/sw.js': { cache: 'x-v1', dateien: { 'apps/x/a.mjs': 'h1' } } };
  const gleich = { 'apps/x/sw.js': { cache: 'x-v1', dateien: { 'apps/x/a.mjs': 'h1' } } };
  const geaendert = { 'apps/x/sw.js': { cache: 'x-v1', dateien: { 'apps/x/a.mjs': 'h2' } } };
  const hochgezaehlt = { 'apps/x/sw.js': { cache: 'x-v2', dateien: { 'apps/x/a.mjs': 'h2' } } };
  assert.deepEqual(vergleiche(alt, gleich), []);
  assert.match(vergleiche(alt, geaendert)[0], /nicht hochgezählt/);
  assert.match(vergleiche(alt, hochgezaehlt)[0], /Stand veraltet/);
});

test('vergleiche: neu hinzugekommene oder entfernte gecachte Datei zählt als Änderung', () => {
  const alt = { 'apps/x/sw.js': { cache: 'x-v1', dateien: { 'apps/x/a.mjs': 'h1' } } };
  const mehr = { 'apps/x/sw.js': { cache: 'x-v1', dateien: { 'apps/x/a.mjs': 'h1', 'apps/x/b.mjs': 'h3' } } };
  assert.match(vergleiche(alt, mehr)[0], /apps\/x\/b\.mjs geändert/);
});
