import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Entscheidung Max 9б: kein App hat einen Service Worker. Vier frühere Apps räumen alte Registrierungen
// und Caches beim Start weg, damit Geräte, die schon einen sw.js hatten, nichts Altes ausgeliefert bekommen.
const WURZEL = fileURLToPath(new URL('../../../', import.meta.url));
const appsDir = join(WURZEL, 'apps');
const apps = readdirSync(appsDir).filter((a) => existsSync(join(appsDir, a, 'index.html')));
const FRUEHERE = ['kinderrechte-entdecker', 'koeder-quiz', 'nachrichten-detektive', 'stark-und-gesund'];

test('keine App hat eine sw.js und keine registriert einen Service Worker', () => {
  assert.ok(apps.length > 200, 'Apps nicht gefunden');
  const mit = apps.filter((a) => existsSync(join(appsDir, a, 'sw.js')));
  assert.deepEqual(mit, [], 'sw.js vorhanden');
  const registriert = apps.filter((a) => /serviceWorker\s*\.\s*register\s*\(/.test(readFileSync(join(appsDir, a, 'app.mjs'), 'utf8')));
  assert.deepEqual(registriert, [], 'registriert einen Service Worker');
});

test('die vier früheren Apps entfernen alte Registrierungen und Caches (Kontrolle: das Gegenteil wird erkannt)', () => {
  const fehlt = FRUEHERE.filter((a) => {
    const t = readFileSync(join(appsDir, a, 'app.mjs'), 'utf8');
    return !/getRegistrations\(\)[\s\S]*unregister\(\)/.test(t) || !/caches\.keys\(\)[\s\S]*caches\.delete\(/.test(t);
  });
  assert.deepEqual(fehlt, []);
  assert.equal(/getRegistrations\(\)[\s\S]*unregister\(\)/.test('const x = 1;'), false, 'Kontrolle: ohne Aufräumen wird es gemeldet');
});
