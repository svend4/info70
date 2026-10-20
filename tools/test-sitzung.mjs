// Tests für eine Sitzung: alle Testdateien im Repo ohne die zwei Zählungs-Tests.
// Die Zählungs-Tests (Testzahlen und Impressum) schlagen nach jeder Welle absichtlich an,
// bis der Koordinator die Zahlen setzt. Aufruf: npm run test:sitzung
import { spawnSync } from 'node:child_process';
import { readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const WURZEL = fileURLToPath(new URL('../', import.meta.url));
const AUSNAHMEN = ['packages/kinderschutz/test/testzahlen.test.mjs', 'packages/kinderschutz/test/datenschutz-zusage.test.mjs'];

function suche(dir, out = []) {
  for (const e of readdirSync(dir)) {
    if (e === 'node_modules' || e.startsWith('.')) continue;
    const p = join(dir, e);
    if (statSync(p).isDirectory()) suche(p, out);
    else if (e.endsWith('.test.mjs')) out.push(relative(WURZEL, p));
  }
  return out;
}

const dateien = [...suche(join(WURZEL, 'apps')), ...suche(join(WURZEL, 'packages'))]
  .filter((d) => !AUSNAHMEN.includes(d)).sort();
const lauf = spawnSync(process.execPath, ['--test', ...dateien], { cwd: WURZEL, stdio: 'inherit' });
console.log(`\n${dateien.length} Testdateien; ohne ${AUSNAHMEN.length} Zählungs-Tests.`);
process.exit(lauf.status ?? 1);
