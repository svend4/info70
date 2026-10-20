import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fehlendeImAddAll } from '../src/sw-abschluss.mjs';

// Jede App mit sw.js muss alles vorab cachen, was index.html und app.mjs erreichen.
// Kontrollfall: eine Kopie mit absichtlich fehlendem Modul muss rot werden (Werkzeug-Gegenprobe).
const WURZEL = fileURLToPath(new URL('../../../', import.meta.url));
const appsDir = join(WURZEL, 'apps');

test('jeder Service Worker cacht alles, was die App erreicht (kein Modul fehlt im addAll)', () => {
  const mit = readdirSync(appsDir).filter((a) => existsSync(join(appsDir, a, 'sw.js')));
  assert.ok(mit.length > 0, 'kein sw.js gefunden');
  const fehlend = {};
  for (const a of mit) {
    const f = fehlendeImAddAll(join(appsDir, a), WURZEL);
    if (f.length) fehlend[a] = f;
  }
  assert.deepEqual(fehlend, {}, `fehlt im addAll: ${JSON.stringify(fehlend, null, 2)}`);
});

test('Kontrollfall: ein absichtlich fehlendes Modul in einer Kopie wird gemeldet', () => {
  const tmp = mkdtempSync(join(tmpdir(), 'sw-kontrolle-'));
  try {
    const app = join(tmp, 'apps', 'probe');
    mkdirSync(join(app, 'lib'), { recursive: true });
    writeFileSync(join(app, 'index.html'), '<script type="module" src="app.mjs"></script>');
    writeFileSync(join(app, 'app.mjs'), "import { x } from './lib/helfer.mjs';\nconsole.log(x);\n");
    writeFileSync(join(app, 'lib', 'helfer.mjs'), 'export const x = 1;\n');
    writeFileSync(join(app, 'sw.js'), "const CACHE = 'probe-v1';\ne.waitUntil(caches.open(CACHE).then((c) => c.addAll([\n  './',\n  './index.html',\n  './app.mjs',\n])));\n");
    const f = fehlendeImAddAll(app, tmp);
    assert.deepEqual(f, ['apps/probe/lib/helfer.mjs'], 'das fehlende Modul muss gemeldet werden');
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});
