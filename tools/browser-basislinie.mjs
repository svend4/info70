// Basislinie der Browser-Prüfung: schreibt docs/browser-basislinie.json aus den Messungen eines Ordners
// oder vergleicht einen Lauf damit. Die Datei darf nur kleiner werden; eine Erhöhung braucht --erweitern.
// Aufruf:
//   node tools/browser-basislinie.mjs --schreiben <messordner> --integrator [--erweitern]   (nur aus der Repo-Wurzel)
//   node tools/browser-basislinie.mjs --vergleich <messordner>
// Messordner: je App eine Datei <app>.json aus node tools/browser-pruefung.mjs <app> - <messordner>.
// Exit: 0 ok, 1 Erhöhung gefunden (bei --vergleich) bzw. Schreiben abgelehnt, 64 Aufruf oder Schreibort falsch.
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { erhoehungen, KATEGORIEN, pruefeSchreibort, pruefeSchreiben, zaehleKategorien } from '../packages/kinderschutz/src/browser-basislinie.mjs';

const WURZEL = fileURLToPath(new URL('../', import.meta.url));
const DATEI = join(WURZEL, 'docs', 'browser-basislinie.json');

const args = process.argv.slice(2);
const modus = args.includes('--schreiben') ? 'schreiben' : args.includes('--vergleich') ? 'vergleich' : null;
const ordnerIdx = args.indexOf(modus === 'schreiben' ? '--schreiben' : '--vergleich');
const ordner = ordnerIdx >= 0 ? args[ordnerIdx + 1] : null;
if (!modus || !ordner || !existsSync(ordner)) {
  console.error('Aufruf: node tools/browser-basislinie.mjs --schreiben <messordner> --integrator [--erweitern] | --vergleich <messordner>');
  process.exit(64);
}
if (modus === 'schreiben') {
  const ort = pruefeSchreibort({ cwd: process.cwd(), wurzel: WURZEL, integrator: args.includes('--integrator') });
  if (!ort.erlaubt) {
    console.error(`Schreiben abgelehnt: ${ort.grund}`);
    process.exit(64);
  }
}

// Messungen einlesen. Eine App ohne Datei im Messordner wird nicht gezählt.
// Eine Messung mit --alle-knoepfe (browser-pruefung.mjs, Befund B-13) ist Auskunft und darf die Basislinie nicht schreiben.
const aktuell = {};
const mitAlleKnoepfen = [];
for (const f of readdirSync(ordner).filter((f) => f.endsWith('.json')).sort()) {
  const messung = JSON.parse(readFileSync(join(ordner, f), 'utf8'));
  if (messung.alleKnoepfe === true) mitAlleKnoepfen.push(f);
  aktuell[f.replace(/\.json$/, '')] = zaehleKategorien(messung);
}
if (modus === 'schreiben' && mitAlleKnoepfen.length) {
  console.error(`Schreiben abgelehnt: ${mitAlleKnoepfen.length} Messung(en) mit --alle-knoepfe, z. B. ${mitAlleKnoepfen[0]}. Die Basislinie wird ohne diesen Schalter gemessen (Frage 73).`);
  process.exit(64);
}

const basis = existsSync(DATEI) ? JSON.parse(readFileSync(DATEI, 'utf8')) : null;
const liste = erhoehungen(basis ?? { apps: {} }, aktuell);

if (modus === 'vergleich') {
  for (const e of liste) console.log(`${e.app}: ${e.kategorie} ${e.basis} → ${e.aktuell}`);
  console.log(liste.length ? `${liste.length} Erhöhung(en) gegenüber der Basislinie` : 'keine Erhöhung gegenüber der Basislinie');
  process.exit(liste.length ? 1 : 0);
}

const erweitern = args.includes('--erweitern');
const pruefung = pruefeSchreiben(basis, aktuell, { erweitern });
if (!pruefung.erlaubt) {
  for (const e of pruefung.erhoehungen) console.error(`${e.app}: ${e.kategorie} ${e.basis} → ${e.aktuell}`);
  console.error(`Schreiben abgelehnt: ${pruefung.erhoehungen.length} Erhöhung(en). Mit --erweitern nur nach Entscheidung Max.`);
  process.exit(1);
}
const apps = { ...(basis?.apps ?? {}) };
for (const [app, werte] of Object.entries(aktuell)) apps[app] = Object.fromEntries(KATEGORIEN.map((k) => [k, werte[k]]));
const sortiert = Object.fromEntries(Object.keys(apps).sort().map((k) => [k, apps[k]]));
writeFileSync(DATEI, JSON.stringify({ kategorien: KATEGORIEN, apps: sortiert }, null, 2) + '\n');
console.log(`Basislinie geschrieben: ${Object.keys(sortiert).length} Apps (${Object.keys(aktuell).length} aus dem Messordner)`);
