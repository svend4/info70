// Koordinator: zählt die Tests im Repo und zeigt, wo die Zahl in README und Impressum nicht stimmt.
// Aufruf: node tools/zahlen.mjs            (nur anzeigen)
//         node tools/zahlen.mjs --schreiben (README-Gesamtzahl setzen; Impressum und docs/10 von Hand,
//                                            die Zeilen stehen unten in der Ausgabe)
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const WURZEL = fileURLToPath(new URL('../', import.meta.url));

function zaehle(dir) {
  let n = 0;
  for (const e of readdirSync(dir)) {
    if (e === 'node_modules' || e.startsWith('.')) continue;
    const p = join(dir, e);
    if (statSync(p).isDirectory()) n += zaehle(p);
    else if (e.endsWith('.test.mjs')) n += (readFileSync(p, 'utf8').match(/^test\(/gm) ?? []).length;
  }
  return n;
}

const gesamt = zaehle(join(WURZEL, 'apps')) + zaehle(join(WURZEL, 'packages'));
const readme = readFileSync(join(WURZEL, 'README.md'), 'utf8');
const genannt = Number((readme.match(/Полный прогон: \*\*(\d+) тест/) ?? [])[1]);
console.log(`Tests im Repo: ${gesamt}`);
console.log(`README nennt: ${genannt}${genannt === gesamt ? ' (stimmt)' : ' (weicht ab)'}`);

if (process.argv.includes('--schreiben') && genannt !== gesamt) {
  writeFileSync(join(WURZEL, 'README.md'), readme.replace(/Полный прогон: \*\*\d+ тестов\*\*/, `Полный прогон: **${gesamt} тестов**`));
  console.log(`README auf ${gesamt} gesetzt.`);
}
console.log('Impressum und docs/10: die Zeilen zeigt `npm test` (Zählungs-Tests); bitte dort von Hand nachziehen.');
