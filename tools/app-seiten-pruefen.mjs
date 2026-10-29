// Serie C (Plan 18.10, Abschnitt 7): prüft die Seitenangaben der Apps gegen die Textkopie der Pralęska.
// Logik: packages/kinderschutz/src/seiten-pruefung.mjs. Maschinell, keine Prüfung durch einen Menschen.
// Aufruf:  node tools/app-seiten-pruefen.mjs <all.txt> [app …] [--json <datei>]
//   all.txt   Textkopie (Ausgabe von tools/quelle-holen.sh, z. B. /tmp/quelle/all.txt; nicht im Repo)
//   app       Ordnernamen unter apps/. Ohne Angabe: alle Apps mit einer Seitenangabe.
//   --json    schreibt alle Verweise mit Fundstellen in die Datei (außerhalb des Repos ablegen)
//   --json    Stand 29.10.2026 (Welle 4): zusätzlich alle Einheiten der JSON-Dateien mit Fundstellen
// Exit 0 immer (Bericht). Die Verweise mit „nicht gefunden“, „Seite außerhalb des Textes“ oder „kein Zitat“ sind
// zu lesen, bevor etwas geändert wird.
// Stand 29.10.2026 (Welle 4): JSON-Dateien werden objektweise geprüft (Einheiten mit Status); die Verweise sind die
// Zeilenprüfung von .md, .html und .mjs. Die Einheiten und die nicht gefundenen Anführungsteile sind ebenfalls zu lesen.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
// Bis Welle 3 (HEAD): import { seitenAusText, pruefeAppSeiten, hatSeitenangabe } from '../packages/kinderschutz/src/seiten-pruefung.mjs';
import { seitenAusText, pruefeAppSeiten, hatSeitenangabe, MARKE_MASCHINELL } from '../packages/kinderschutz/src/seiten-pruefung.mjs';

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

// Bis Welle 3 (HEAD), ersetzt am 29.10.2026 (Welle 4) durch die Tabelle der Einheiten unten:
// const spalten = ['wörtlich', 'Wörter', 'nicht gefunden', 'kein Zitat', 'Seite außerhalb des Textes'];
// console.log(['App'.padEnd(36), 'Verweise', ...spalten.map((s) => s.slice(0, 10).padEnd(10)), 'Marke'].join(' '));
// for (const e of ergebnisse) {
//   const z = (k) => String(e.zusammen[k] ?? 0).padEnd(10);
//   console.log([e.app.padEnd(36), String(e.verweise.length).padEnd(8), ...spalten.map(z), e.marke ?? '—'].join(' '));
// }
const status = [['belegt', 'belegt'], ['teilweise', 'teilweise'], ['nicht gefunden', 'nicht gef.'], ['kein Zitat', 'kein Zitat'], ['Sammeleinheit', 'Sammeleinh.'], ['Seite außerhalb des Textes', 'Seite a.T.'], ['Bereich zu groß', 'Bereich gr.']];
const spalte = (s, n) => String(s).padEnd(n);
console.log([spalte('App', 36), spalte('Einheiten', 9), ...status.map(([, kurz]) => spalte(kurz, 12)), spalte('ohne Einh.', 10), spalte('gemischt', 9), spalte('Zeilen', 7), 'Marke'].join(' '));
for (const e of ergebnisse) {
  const z = (k) => spalte(e.einheitenZusammen[k] ?? 0, 12);
  console.log([spalte(e.app, 36), spalte(e.einheiten.length, 9), ...status.map(([k]) => z(k)), spalte(e.ohneEinheit, 10), spalte(e.gemischt, 9), spalte(e.verweise.length, 7), e.marke ?? '—'].join(' '));
}

const summe = (feld) => {
  const s = {};
  for (const e of ergebnisse) for (const [k, v] of Object.entries(e[feld])) s[k] = (s[k] ?? 0) + v;
  return s;
};
const summiere = (feld) => ergebnisse.reduce((n, e) => n + e[feld], 0);
// Bis Welle 3 (HEAD, ersetzt am 29.10.2026):
// const summe = {};
// for (const e of ergebnisse) for (const [k, v] of Object.entries(e.zusammen)) summe[k] = (summe[k] ?? 0) + v;
// console.log(`Apps: ${ergebnisse.length} | Verweise: ${ergebnisse.reduce((n, e) => n + e.verweise.length, 0)} | ${JSON.stringify(summe)}`);
console.log(`Apps mit Verweisen: ${ergebnisse.filter((e) => e.einheiten.length || e.verweise.length).length} von ${ergebnisse.length}`);
console.log(`Einheiten (JSON): ${ergebnisse.reduce((n, e) => n + e.einheiten.length, 0)} | ${JSON.stringify(summe('einheitenZusammen'))}`);
console.log(`Zeilen-Verweise (.md, .html, .mjs): ${ergebnisse.reduce((n, e) => n + e.verweise.length, 0)} | ${JSON.stringify(summe('zusammen'))}`);
console.log(`Zeichenketten ohne Einheit: ${summiere('ohneEinheit')} | gemischt, ungeprüft: ${summiere('gemischt')} | nicht gefundene Anführungsteile: ${ergebnisse.reduce((n, e) => n + e.nichtGefundeneAnfuehrungsteile.length, 0)}`);
console.log(`Bereiche zu groß (nicht geprüft, mehr als 20 Seiten): ${ergebnisse.reduce((n, e) => n + e.bereicheZuGross.length, 0)}`);
console.log(`Sammelseiten mit nicht gefundenen Zitaten: ${ergebnisse.reduce((n, e) => n + e.sammelseiten.length, 0)}`);
for (const e of ergebnisse) {
  for (const f of e.nichtGefundeneAnfuehrungsteile) console.log(`  nicht gefunden: ${e.app} ${f.datei} ${f.pfad} «${f.wortlaut}» Seiten ${f.seiten.join(',')} (${f.ergebnis})`);
  for (const f of e.bereicheZuGross) console.log(`  Bereich zu groß (nicht geprüft): ${e.app} ${f.datei} ${f.pfad ?? `Zeile ${f.zeile}`} «${f.text}» ${f.umfang} Seiten`);
  for (const s of e.sammelseiten) console.log(`  Sammelseite mit nicht gefundenen Zitaten: ${e.app} ${s.datei} ${s.einheit} (${s.ergebnis}) Seiten ${s.seiten.join(',')}: ${s.zitate.map((z) => `${z.pfad} «${z.zitat}»`).join('; ')}`);
  for (const f of e.fehler) console.log(`  Fehler: ${e.app} ${f.datei}: ${f.fehler}`);
}

if (jsonDatei) {
  // Bis Welle 3 (HEAD): writeFileSync(jsonDatei, JSON.stringify({ quelle, seiten: seiten.length - 1, apps: ergebnisse }, null, 2) + '\n');
  writeFileSync(jsonDatei, JSON.stringify({ hinweis: MARKE_MASCHINELL, quelle, seiten: seiten.length - 1, apps: ergebnisse }, null, 2) + '\n');
  console.log(`Geschrieben: ${jsonDatei}`);
}
