// Serie C (Plan 18.10, Abschnitt 7): prüft die Seitenangaben der Apps gegen die Textkopie der Pralęska.
// Logik: packages/kinderschutz/src/seiten-pruefung.mjs. Maschinell, keine Prüfung durch einen Menschen.
// Aufruf:  node tools/app-seiten-pruefen.mjs <all.txt> [app …] [--json <datei>]
//   all.txt   Textkopie (Ausgabe von tools/quelle-holen.sh, z. B. /tmp/quelle/all.txt; nicht im Repo)
//   app       Ordnernamen unter apps/. Ohne Angabe: alle Apps mit einer Seitenangabe.
//   --json    schreibt alle Verweise mit Fundstellen in die Datei (außerhalb des Repos ablegen)
// Exit 0 immer (Bericht). Die Verweise mit „nicht gefunden“, „Seite außerhalb des Textes“ oder „kein Zitat“ sind
// zu lesen, bevor etwas geändert wird.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { seitenAusText, pruefeAppSeiten, hatSeitenangabe } from '../packages/kinderschutz/src/seiten-pruefung.mjs';

const WURZEL = fileURLToPath(new URL('../', import.meta.url));
const args = process.argv.slice(2);
const jsonIdx = args.indexOf('--json');
const jsonDatei = jsonIdx >= 0 ? args[jsonIdx + 1] : null;
const ohneOptionen = args.filter((a, i) => a !== '--json' && !(jsonIdx >= 0 && i === jsonIdx + 1));
const [quelle, ...apps] = ohneOptionen;
if (!quelle) {
  console.error('Aufruf: node tools/app-seiten-pruefen.mjs <all.txt> [app …] [--json <datei>]');
  process.exit(64);
}

const seiten = seitenAusText(readFileSync(quelle, 'utf8'));
console.log(`Textkopie: ${seiten.length - 1} Seiten`);

const liste = apps.length
  ? apps
  : readdirSync(new URL('../apps/', import.meta.url), { withFileTypes: true })
    .filter((e) => e.isDirectory()).map((e) => e.name).sort();
const ergebnisse = [];
for (const slug of liste) {
  if (!apps.length && !(await hatSeitenangabe(WURZEL, slug))) continue;
  ergebnisse.push(await pruefeAppSeiten(WURZEL, slug, seiten));
}

const spalten = ['wörtlich', 'Wörter', 'nicht gefunden', 'kein Zitat', 'Seite außerhalb des Textes'];
console.log(['App'.padEnd(36), 'Verweise', ...spalten.map((s) => s.slice(0, 10).padEnd(10)), 'Marke'].join(' '));
for (const e of ergebnisse) {
  const z = (k) => String(e.zusammen[k] ?? 0).padEnd(10);
  console.log([e.app.padEnd(36), String(e.verweise.length).padEnd(8), ...spalten.map(z), e.marke ?? '—'].join(' '));
}
const summe = {};
for (const e of ergebnisse) for (const [k, v] of Object.entries(e.zusammen)) summe[k] = (summe[k] ?? 0) + v;
console.log(`Apps: ${ergebnisse.length} | Verweise: ${ergebnisse.reduce((n, e) => n + e.verweise.length, 0)} | ${JSON.stringify(summe)}`);

if (jsonDatei) {
  writeFileSync(jsonDatei, JSON.stringify({ quelle, seiten: seiten.length - 1, apps: ergebnisse }, null, 2) + '\n');
  console.log(`Geschrieben: ${jsonDatei}`);
}
