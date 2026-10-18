import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

// Eingabefelder (input, select, textarea) gibt es nur in Apps für Erwachsene oder in Kinder-Apps
// mit einem Eintrag in docs/kinder-apps-mit-eingabe.json. Jede App mit Eingabefeld steht in genau
// einer der beiden Listen. Der Test schlägt an, wenn eine App fehlt, doppelt steht oder keines
// mehr hat, und wenn ein Eintrag noch nicht geprüft ist. Offene Entscheidungen und fehlende
// Hinweise zählt er und gibt die Zahl aus, damit der Stand sichtbar bleibt.
const WURZEL = new URL('../../../', import.meta.url);
const appsDir = new URL('apps/', WURZEL);
const PAT = /'input'|"input"|<input\b|'select'|"select"|<select\b|'textarea'|"textarea"|<textarea\b/;
const DATEIEN = ['app.mjs', 'logik.mjs', 'index.html'];

const hatEingabe = async (slug) => {
  for (const f of DATEIEN) {
    try {
      const s = await readFile(new URL(`${slug}/${f}`, appsDir), 'utf8');
      if (PAT.test(s)) return true;
    } catch { /* Datei fehlt in dieser App */ }
  }
  return false;
};

const erwachsene = JSON.parse(await readFile(new URL('docs/erwachsenen-apps.json', WURZEL), 'utf8'));
const kinder = JSON.parse(await readFile(new URL('docs/kinder-apps-mit-eingabe.json', WURZEL), 'utf8'));
const listeE = erwachsene.apps.map((a) => a.slug);
const listeK = kinder.apps.map((a) => a.slug);
const gelistet = new Set([...listeE, ...listeK]);

const alleApps = (await readdir(appsDir, { withFileTypes: true }))
  .filter((o) => o.isDirectory()).map((o) => o.name).sort();
const mitEingabe = new Set();
for (const slug of alleApps) if (await hatEingabe(slug)) mitEingabe.add(slug);

test('jede App mit Eingabefeld steht in einer der beiden Listen', () => {
  const fehlt = [...mitEingabe].filter((s) => !gelistet.has(s));
  assert.deepEqual(fehlt, [], `Eingabefeld ohne Eintrag: ${fehlt.join(', ')}`);
});

test('keine App steht doppelt, und kein Eintrag verweist auf eine App ohne Eingabefeld', () => {
  const doppelt = listeE.filter((s) => listeK.includes(s));
  assert.deepEqual(doppelt, [], `in beiden Listen: ${doppelt.join(', ')}`);
  const ohne = [...gelistet].filter((s) => !mitEingabe.has(s));
  assert.deepEqual(ohne, [], `Eintrag ohne Eingabefeld (streichen): ${ohne.join(', ')}`);
});

test('kein Eintrag ist ungeprüft', (t) => {
  const ungeprueft = [...erwachsene.apps, ...kinder.apps].filter((a) => a.zielgruppeGeprueft !== true);
  t.diagnostic(`ungeprüfte Einträge: ${ungeprueft.length}`);
  assert.deepEqual(ungeprueft.map((a) => a.slug), [], 'ungeprüfte Einträge (Feld zielgruppeGeprueft)');
});

test('offene Punkte: fehlende Hinweise und Entscheidungen werden gezählt und ausgegeben', (t) => {
  const hinweisFehlt = erwachsene.apps.filter((a) => a.hinweisFehlt).map((a) => a.slug);
  const entscheidung = kinder.apps.filter((a) => a.status === 'entscheidung offen').map((a) => a.slug);
  t.diagnostic(`Erwachsenen-Apps mit Freitext ohne Hinweis: ${hinweisFehlt.length}`);
  t.diagnostic(`Kinder-Apps mit offener Entscheidung: ${entscheidung.length} (${entscheidung.join(', ')})`);
  assert.ok(Array.isArray(hinweisFehlt) && Array.isArray(entscheidung));
});

const HINWEIS = 'Keine Namen von Kindern eingeben.';
test('Erwachsenen-Apps mit Freitext: der Hinweis steht im Quelltext, Ausnahmen mit Begründung', async () => {
  const fehlt = [];
  for (const a of erwachsene.apps) {
    if (!a.freierText) continue;
    if (a.ausnahme) {
      assert.ok(a.ausnahme.length > 30, `${a.slug}: Ausnahme ohne Begründung`);
      continue;
    }
    let text = '';
    for (const f of DATEIEN) {
      try { text += await readFile(new URL(`${a.slug}/${f}`, appsDir), 'utf8'); } catch { /* fehlt */ }
    }
    if (!text.includes(HINWEIS)) fehlt.push(a.slug);
  }
  assert.deepEqual(fehlt, [], `Freitext ohne Hinweis „${HINWEIS}“: ${fehlt.join(', ')}`);
});
