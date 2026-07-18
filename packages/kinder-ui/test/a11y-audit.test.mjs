// Screenreader- und Tastatur-Audit-Pack (docs/09 Ось H): automatisiertes
// Struktur-Audit ALLER App-Seiten gegen die Grundlagen von WCAG 2.2 /
// EN 301 549 – ohne externe Abhängigkeiten. Findet Regressionen zentral:
// fehlt einer neuen App lang/title/viewport/Landmark, schlägt der Lauf fehl.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';

const appsDir = new URL('../../../apps/', import.meta.url);
const eintraege = await readdir(appsDir, { withFileTypes: true });
const apps = eintraege.filter((e) => e.isDirectory()).map((e) => e.name).sort();

async function liesSeite(app, datei) {
  try { return await readFile(new URL(`${app}/${datei}`, appsDir), 'utf8'); }
  catch (e) { return null; }
}

test('Alle Apps haben eine index.html', () => {
  assert.ok(apps.length > 50, 'unerwartet wenige Apps gefunden');
});

test('Jede index.html: lang, title, viewport, CSP und Landmark (WCAG 2.2)', async () => {
  const fehler = [];
  for (const app of apps) {
    const html = await liesSeite(app, 'index.html');
    if (html === null) { fehler.push(`${app}: keine index.html`); continue; }
    if (!/<html[^>]*\slang=["'][a-z]{2}/i.test(html)) fehler.push(`${app}: <html lang> fehlt`);
    if (!/<title>\s*\S[^<]*<\/title>/i.test(html)) fehler.push(`${app}: <title> fehlt/leer`);
    if (!/name=["']viewport["']/i.test(html)) fehler.push(`${app}: viewport-Meta fehlt (Zoom/Tastatur)`);
    if (!/Content-Security-Policy/i.test(html)) fehler.push(`${app}: CSP-Meta fehlt`);
    if (!/<main[\s>]/i.test(html)) fehler.push(`${app}: <main>-Landmark fehlt`);
    if (!/<noscript>/i.test(html)) fehler.push(`${app}: <noscript>-Hinweis fehlt`);
  }
  assert.deepEqual(fehler, [], `Barrierefreiheits-Mängel:\n${fehler.join('\n')}`);
});

test('Live-Region: die App-Wurzel (#app) meldet Änderungen (aria-live)', async () => {
  const ohne = [];
  for (const app of apps) {
    const html = await liesSeite(app, 'index.html');
    if (html === null) continue;
    // die dynamisch gerenderten Apps nutzen <main id="app" aria-live=...>
    if (/id=["']app["']/.test(html) && !/aria-live=/.test(html)) ohne.push(app);
  }
  assert.deepEqual(ohne, [], `#app ohne aria-live (Screenreader verpasst Updates): ${ohne.join(', ')}`);
});

test('Jede eltern.html: lang und title vorhanden', async () => {
  const fehler = [];
  for (const app of apps) {
    const html = await liesSeite(app, 'eltern.html');
    if (html === null) continue; // nicht jede App hat eine
    if (!/<html[^>]*\slang=["'][a-z]{2}/i.test(html)) fehler.push(`${app}/eltern.html: lang fehlt`);
    if (!/<title>\s*\S[^<]*<\/title>/i.test(html)) fehler.push(`${app}/eltern.html: title fehlt`);
  }
  assert.deepEqual(fehler, [], `eltern.html-Mängel:\n${fehler.join('\n')}`);
});
