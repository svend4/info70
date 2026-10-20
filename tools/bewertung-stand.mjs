// Stand der Ergebnis-Wertung schreiben oder prüfen. docs/bewertung-stand.json.
// Aufruf: node tools/bewertung-stand.mjs            (nur prüfen, Exit 1 bei Abweichung)
//         node tools/bewertung-stand.mjs --schreiben (schreibt; verweigert neue Treffer,
//                                                    die Liste wächst nur durch Entscheidung)
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { appTreffer, kernTreffer, vergleiche } from '../packages/kinderschutz/src/bewertung-stand.mjs';

const WURZEL = fileURLToPath(new URL('../', import.meta.url));
const STAND = join(WURZEL, 'docs', 'bewertung-stand.json');
const schreiben = process.argv.includes('--schreiben');

const stand = JSON.parse(await readFile(STAND, 'utf8').catch(() => '{}'));
const kern = await kernTreffer(WURZEL);
const apps = await appTreffer(WURZEL);
const probleme = vergleiche(stand, kern, apps);

// Erster Stand darf alles setzen. Danach wächst nichts ohne Entscheidung.
const ausnahmenListe = Object.keys(stand.ausnahmen ?? {});
const erhoeht = stand.kern ? Object.entries(kern).filter(([f, n]) => n > (stand.kern[f] ?? 0)).map(([f, n]) => `quiz-kern/src/${f}: ${n} statt ${stand.kern[f] ?? 0}`) : [];
const neueApps = stand.apps ? apps.filter((a) => !ausnahmenListe.includes(a) && !stand.apps.includes(a)).map((a) => `${a}: neu mit Rekord, Rang oder raenge im Code`) : [];
const neu = [...erhoeht, ...neueApps];
if (schreiben && neu.length) {
  console.error('Nicht geschrieben. Neue Treffer brauchen eine Entscheidung, nicht ein Schreiben:');
  for (const p of neu) console.error(`  ${p}`);
  process.exit(1);
}

if (!schreiben) {
  console.log(probleme.length ? probleme.join('\n') : 'Stand stimmt.');
  process.exit(probleme.length ? 1 : 0);
}

const ausnahmen = stand.ausnahmen ?? {};
await writeFile(STAND, `${JSON.stringify({ kern, apps: apps.filter((a) => !Object.keys(ausnahmen).includes(a)), ausnahmen }, null, 2)}\n`);
console.log(`docs/bewertung-stand.json geschrieben: quiz-kern ${Object.values(kern).reduce((s, n) => s + n, 0)} Treffer, ${apps.length} Apps.`);
