// Speicherregel (SESSION-ANLEITUNG Zeile 12, Entscheidung Max 30б): Eine App mit Speicher hat einen
// Löschknopf; eine App ohne Speicher hat keinen („Meine Daten löschen“ ohne Daten ist irreführend).
// Statische Prüfung des App-Codes. Zählt nur den eigenen Speicher der App: die gemeinsame Anzeige-Einstellung
// (kinder-ui/anzeige.mjs, Schrift und Kontrast) ist keine Nutzerdaten-Speicherung der App.
// Der Stand docs/speicher-stand.json führt die Apps, die die Regel noch verletzen; er schrumpft nur.
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ohneKommentare } from './bewertung-stand.mjs';

// Schreibzugriff im App-Code oder die Sprachwahl der gemeinsamen Komponente, wenn die App ihr einen speicherSchluessel gibt
// (ohne Schlüssel speichert die Komponente nichts).
const SPEICHERT = /\.setItem\(|speicherSchluessel\s*:/;
// Möglichkeit zu löschen (weit gefasst): die gemeinsame Karte, ein Aufruf zum Löschen oder ein removeItem/clear.
const LOESCHBAR = /kinder-ui\/js\/daten-karte\.mjs|loescheDaten\(|\.removeItem\(|localStorage\.clear\(/;
// Karte oder Knopf „Daten löschen“ (eng gefasst): die gemeinsame Karte (Import aus kinder-ui/js/daten-karte.mjs), ein Aufruf zum
// Löschen oder die Beschriftung. Ein removeItem allein (Migration beim Start) und eine eigene Funktion namens datenKarte, die nur
// einen Hinweis zeigt, sind kein Knopf.
const KARTE = /kinder-ui\/js\/daten-karte\.mjs|loescheDaten\(|Meine Daten löschen|Alle Daten löschen|Alles löschen/;

/** Befund aus dem Quelltext einer App (alle .mjs im App-Ordner, ohne Kommentare, zusammengefügt). */
export function speicherBefund(code) {
  const text = ohneKommentare(code);
  return { speichert: SPEICHERT.test(text), loeschbar: LOESCHBAR.test(text), karte: KARTE.test(text) };
}

/** Verletzung der Regel: 'speichert ohne Löschknopf' oder 'Löschknopf ohne Speicher'; sonst null. */
export function verletzung({ speichert, loeschbar, karte }) {
  if (speichert && !loeschbar) return 'speichert ohne Löschknopf';
  if (!speichert && karte) return 'Löschknopf ohne Speicher';
  return null;
}

/** Verletzungen aller Apps: { app: Grund }. */
export async function appVerletzungen(wurzel) {
  const appsDir = join(wurzel, 'apps');
  const out = {};
  for (const e of (await readdir(appsDir, { withFileTypes: true })).filter((e) => e.isDirectory())) {
    const dir = join(appsDir, e.name);
    const dateien = (await readdir(dir)).filter((f) => f.endsWith('.mjs'));
    if (!dateien.length) continue;
    const code = (await Promise.all(dateien.map((f) => readFile(join(dir, f), 'utf8')))).join('\n');
    const v = verletzung(speicherBefund(code));
    if (v) out[e.name] = v;
  }
  return out;
}

/** Vergleich mit dem Stand: Probleme als Text, leer heißt ok. Der Stand schrumpft nur. */
export function vergleiche(stand, aktuell) {
  const probleme = [];
  for (const [a, grund] of Object.entries(aktuell)) {
    if (!(a in stand)) probleme.push(`${a}: neu mit Regelverletzung (${grund})`);
  }
  for (const a of Object.keys(stand)) {
    if (!(a in aktuell)) probleme.push(`${a}: Regel erfüllt, aus docs/speicher-stand.json streichen`);
  }
  return probleme;
}
