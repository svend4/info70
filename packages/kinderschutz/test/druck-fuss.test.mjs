import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Im Druck erscheint kein Fuß. Die Regel steht einmal in der gemeinsamen Stylesheet-Datei und gilt damit für
// jede App, die sie lädt. Nur der Fuß wird ausgeblendet; andere Druckregeln bleiben unangetastet.
const WURZEL = fileURLToPath(new URL('../../../', import.meta.url));
const css = readFileSync(join(WURZEL, 'packages', 'kinder-ui', 'css', 'kinder.css'), 'utf8');
const DRUCK_FUSS = /@media print\s*\{\s*\.k-fuss\s*\{\s*display:\s*none\s*!important;\s*\}\s*\}/;

test('im Druck erscheint kein Fuß: die gemeinsame Stylesheet-Datei blendet .k-fuss im Druck aus', () => {
  assert.match(css, DRUCK_FUSS);
});

test('Kontrolle: ohne die Regel schlägt die Prüfung an', () => {
  const ohne = css.replace(DRUCK_FUSS, '');
  assert.doesNotMatch(ohne, DRUCK_FUSS);
  assert.equal(ohne.length, css.length - css.match(DRUCK_FUSS)[0].length);
});

test('jede App lädt die gemeinsame Stylesheet-Datei, damit die Druckregel überall gilt', () => {
  const apps = readdirSync(join(WURZEL, 'apps')).filter((a) => existsSync(join(WURZEL, 'apps', a, 'index.html')));
  assert.ok(apps.length > 0);
  const ohneCss = apps.filter((a) => !readFileSync(join(WURZEL, 'apps', a, 'index.html'), 'utf8').includes('kinder.css'));
  assert.deepEqual(ohneCss, [], 'Apps ohne kinder.css: die Druckregel gilt dort nicht');
});
