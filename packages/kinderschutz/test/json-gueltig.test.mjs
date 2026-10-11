import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';

// In Welle 83 ist eine `package.json` mit UNGUELTIGEM JSON in das Repository
// gelangt und durch den gesamten Lauf gekommen: im Beschreibungstext stand ein
// deutsches Anfuehrungszeichen „ und dazu ein gewoehnliches " als Schluss -
// und das beendete die JSON-Zeichenkette mitten im Satz. `npm test` lief
// weiter gruen, weil keine Regel die Manifeste liest, und `node` konnte das
// Paket nicht mehr laden.
//
// Diese Regel liest jede JSON-Datei des Projekts und parst sie. Sie prueft
// nichts ueber den Inhalt - nur, dass eine Datei, die JSON zu sein behauptet,
// auch JSON ist. Das ist die billigste Regel des Korpus und haette die
// teuerste Panne verhindert.
const wurzel = new URL('../../../', import.meta.url);
const UEBERGEHEN = new Set(['node_modules', '.git', 'dist', 'coverage']);

// Der Name wird fuer die URL kodiert: ein `#` im Dateinamen beendet sonst den
// Pfad, und die Regel liest eine ANDERE Datei - und bleibt gruen (Welle 83).
// Dasselbe gilt fuer `%` und `?`. Jeder heute vorhandene Name bleibt dabei
// unveraendert; geprueft wurde das gegen Leerzeichen, Umlaute, `+` und Klammern.
const alsUrl = (name, basis) => new URL(encodeURIComponent(name), basis);

async function sammleJson(verzeichnis, pfad = '') {
  const gefunden = [];
  for (const eintrag of await readdir(verzeichnis, { withFileTypes: true })) {
    if (UEBERGEHEN.has(eintrag.name)) continue;
    const relativ = pfad ? `${pfad}/${eintrag.name}` : eintrag.name;
    // Ein Verzeichnis kann auch ueber einen Symlink erreichbar sein; dann sagt
    // isDirectory() nein, und der Zweig wird uebersprungen.
    let istOrdner = eintrag.isDirectory();
    if (!istOrdner && eintrag.isSymbolicLink()) {
      try { istOrdner = (await stat(alsUrl(eintrag.name, verzeichnis))).isDirectory(); } catch { istOrdner = false; }
    }
    if (istOrdner) {
      gefunden.push(...await sammleJson(new URL(`${encodeURIComponent(eintrag.name)}/`, verzeichnis), relativ));
    } else if (/\.json$/i.test(eintrag.name)) {
      gefunden.push([relativ, alsUrl(eintrag.name, verzeichnis)]);
    }
  }
  return gefunden;
}

const dateien = await sammleJson(wurzel);

test('jede JSON-Datei ist gültiges JSON', async () => {
  const befunde = [];
  for (const [relativ, url] of dateien) {
    const roh = await readFile(url, 'utf8');
    try {
      // Ein Byte-Order-Mark laedt node ohne Murren; JSON.parse nicht. Die
      // Regel soll das finden, was node bricht, und nicht mehr.
      JSON.parse(roh.replace(/^\uFEFF/, ''));
    } catch (fehler) {
      // Die Stelle mitliefern: „unexpected token" allein hilft nicht.
      const stelle = /position (\d+)/.exec(fehler.message)?.[1];
      const umgebung = stelle ? roh.slice(Math.max(0, stelle - 60), Number(stelle) + 60) : '';
      befunde.push(`${relativ}: ${fehler.message}${umgebung ? ` – bei: …${umgebung}…` : ''}`);
    }
  }
  assert.deepEqual(befunde, [], befunde.join(' | '));
  // Plausibilitaet: die Regel darf nicht gruen werden, weil sie nichts findet.
  assert.ok(dateien.length >= 100, `nur ${dateien.length} JSON-Dateien gefunden – greift die Suche noch?`);
});

test('jedes package.json trägt Name, Version und Lizenz', async () => {
  const befunde = [];
  for (const [relativ, url] of dateien.filter(([r]) => r.endsWith('package.json'))) {
    let paket;
    try { paket = JSON.parse(await readFile(url, 'utf8')); } catch { continue; }
    for (const feld of ['name', 'version']) {
      if (typeof paket[feld] !== 'string' || !paket[feld]) befunde.push(`${relativ}: ${feld} fehlt`);
    }
    // Die Wurzel traegt die Lizenz fuer alle; die Arbeitsbereiche nennen sie selbst.
    if (relativ !== 'package.json' && typeof paket.license !== 'string') {
      befunde.push(`${relativ}: license fehlt`);
    }
  }
  assert.deepEqual(befunde, [], befunde.join(' | '));
});
