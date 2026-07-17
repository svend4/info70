import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';

const liste = JSON.parse(await readFile(new URL('../daten/apps.json', import.meta.url), 'utf8'));
const appsDir = new URL('../../', import.meta.url);

test('Liste: sortiert, eindeutig, und jede gelistete App HAT eine eltern.html', async () => {
  assert.deepEqual([...liste.apps].sort(), liste.apps, 'Liste muss sortiert sein');
  assert.equal(new Set(liste.apps).size, liste.apps.length, 'doppelte Einträge');
  for (const name of liste.apps) {
    await assert.doesNotReject(
      access(new URL(`${name}/eltern.html`, appsDir)),
      `gelistet, aber eltern.html fehlt: apps/${name}/`);
  }
});

test('Vollständigkeit: JEDE eltern.html im Monorepo ist im Sammelband gelistet', async () => {
  const ordner = await readdir(appsDir, { withFileTypes: true });
  const vorhandene = [];
  for (const o of ordner) {
    if (!o.isDirectory()) continue;
    try {
      await access(new URL(`${o.name}/eltern.html`, appsDir));
      vorhandene.push(o.name);
    } catch { /* App ohne Eltern-Seite (Erwachsenen-Werkzeug) */ }
  }
  const fehlend = vorhandene.filter((n) => !liste.apps.includes(n));
  assert.deepEqual(fehlend, [], `eltern.html vorhanden, aber nicht im Sammelband: ${fehlend.join(', ')}`);
  assert.ok(vorhandene.length >= 30, 'Plausibilität: das Monorepo hat viele Eltern-Seiten');
});

test('Sammelband bleibt Zusammenstellung: app.mjs kopiert keine Inhalte, sondern lädt die Originale', async () => {
  const quelle = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
  assert.match(quelle, /fetch\(`\.\.\/\$\{name\}\/eltern\.html`\)/, 'Kapitel kommen live aus den Original-Seiten');
  assert.match(quelle, /DOMParser/, 'HTML wird geparst, nicht als Text eingefügt');
  assert.match(quelle, /break-before|esb-kapitel/, 'Kapitel-Struktur für den Broschüren-Druck');
});
