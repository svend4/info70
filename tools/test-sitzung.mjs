// Tests für eine Sitzung: alle Testdateien im Repo, mit SITZUNG=1. Die Zählungs-Tests
// (Testzahlen, Datenschutz-Zahlen) sind dann übersprungen, weil der Koordinator die Zahlen setzt.
// Alle anderen Tests der Datenschutz-Datei (Löschen, eigene Schlüssel, Impressum, Eltern-Link) laufen.
// Aufruf: npm run test:sitzung
import { spawnSync } from 'node:child_process';
import { readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const WURZEL = fileURLToPath(new URL('../', import.meta.url));

function suche(dir, out = []) {
  for (const e of readdirSync(dir)) {
    if (e === 'node_modules' || e.startsWith('.')) continue;
    const p = join(dir, e);
    if (statSync(p).isDirectory()) suche(p, out);
    else if (e.endsWith('.test.mjs')) out.push(relative(WURZEL, p));
  }
  return out;
}

const dateien = [...suche(join(WURZEL, 'apps')), ...suche(join(WURZEL, 'packages'))].sort();
const lauf = spawnSync(process.execPath, ['--test', ...dateien], {
  cwd: WURZEL,
  stdio: 'inherit',
  env: { ...process.env, SITZUNG: '1' },
});
console.log(`\n${dateien.length} Testdateien mit SITZUNG=1 (Zählungs-Tests übersprungen).`);
process.exit(lauf.status ?? 1);
