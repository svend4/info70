// Schreibt docs/sw-cache-stand.json neu. Ohne Angabe nur der Vergleich, mit --schreiben die Datei.
// Verweigert das Schreiben, wenn eine gecachte Datei geändert wurde, ohne dass der CACHE-Name
// im sw.js hochgezählt wurde. Dann zuerst den Cache-Namen hochzählen.
// Aufruf: node tools/sw-stand.mjs [--schreiben]
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { aktuellerStand, vergleiche } from '../packages/kinderschutz/src/sw-stand.mjs';

const WURZEL = fileURLToPath(new URL('../', import.meta.url));
const STAND = join(WURZEL, 'docs', 'sw-cache-stand.json');
const schreiben = process.argv.includes('--schreiben');

const aktuell = await aktuellerStand(WURZEL);
const gespeichert = JSON.parse(await readFile(STAND, 'utf8').catch(() => '{}'));
const probleme = vergleiche(gespeichert, aktuell);

const harte = probleme.filter((p) => p.includes('nicht hochgezählt'));
if (harte.length) {
  console.error('Nicht geschrieben. Erst den CACHE-Namen hochzählen:');
  for (const p of harte) console.error(`  ${p}`);
  process.exit(1);
}

if (!schreiben) {
  console.log(probleme.length ? probleme.join('\n') : 'Stand stimmt.');
  process.exit(probleme.length ? 1 : 0);
}

await writeFile(STAND, `${JSON.stringify(aktuell, null, 2)}\n`);
console.log(`docs/sw-cache-stand.json geschrieben: ${Object.keys(aktuell).length} Service Worker.`);
