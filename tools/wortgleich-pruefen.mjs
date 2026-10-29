// Wörtlich übernommene Stellen: jede Zeichenfolge aus einer App (Zitatfeld, Text, Kommentar), die auf sieben oder mehr
// aufeinanderfolgende Wörter genau so im Text der Pralęska steht. Rechtsrahmen docs/10, Punkt 1: „ни одного дословного текста“.
// Die Prüfung ist mechanisch (Normalform: Trennstriche am Zeilenende, Satzzeichen, Groß und Klein). Sie zeigt Fundstellen,
// keine Urteile: ob ein Zitat zulässig ist, entscheidet die Entscheidung Max (Frage 78).
// Aufruf:  node tools/wortgleich-pruefen.mjs <all.txt> [--json <Datei>]
//   all.txt   Textkopie aus tools/quelle-holen.sh (außerhalb des Repos)
//   --json    schreibt alle Fundstellen mit Seite in die Datei (außerhalb des Repos ablegen)
// Die Ausgabe enthält keine langen Textstellen: nur Ort, Wortzahl und Seite.
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

export const FENSTER = 7;

/** Normalform wie in packages/kinderschutz/src/seiten-pruefung.mjs. */
export function normalisiere(s) {
  return s
    .replace(/\u00ad/g, '')
    .replace(/-\n/g, '')
    .replace(/[.,;:!?()«»„“”"‘’'–—\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .trim();
}

/** Alle Fenster aus FENSTER Wörtern einer Seitenliste: Menge der Zeichenfolgen mit der Seitennummer. */
export function fensterAusSeiten(seiten) {
  const fenster = new Map();
  seiten.forEach((text, i) => {
    const w = normalisiere(text).split(' ').filter(Boolean);
    for (let k = 0; k + FENSTER <= w.length; k += 1) {
      const schluessel = w.slice(k, k + FENSTER).join(' ');
      if (!fenster.has(schluessel)) fenster.set(schluessel, i + 1);
    }
  });
  return fenster;
}

/** Ist ein Abschnitt des Textes ein wörtlich übernommener Teil? Gibt die Seite des ersten Treffers zurück oder null. */
export function wortgleich(text, fenster) {
  const w = normalisiere(text).split(' ').filter(Boolean);
  for (let k = 0; k + FENSTER <= w.length; k += 1) {
    const seite = fenster.get(w.slice(k, k + FENSTER).join(' '));
    if (seite) return seite;
  }
  return null;
}

const CYR = /[а-яё]/i;
const ZITAT = /[«“„"]([^«»„“”"]{20,600})[»“”"]/g;

function dateienDerApps(wurzel) {
  const liste = [];
  const walk = (d) => {
    for (const e of readdirSync(d)) {
      if (e === 'node_modules' || e.startsWith('.')) continue;
      const p = join(d, e);
      if (statSync(p).isDirectory()) walk(p);
      else if (/\.(md|mjs|html|json)$/.test(e)) liste.push(p);
    }
  };
  walk(join(wurzel, 'apps'));
  return liste;
}

/** Fundstellen über alle Apps: [{ app, datei, zeile, woerter, seite, text }]. Der Text bleibt intern (keine Ausgabe). */
export function pruefeApps(wurzel, quelleText) {
  const seiten = quelleText.split('\f');
  const fenster = fensterAusSeiten(seiten);
  const treffer = [];
  for (const p of dateienDerApps(wurzel)) {
    const t = readFileSync(p, 'utf8');
    for (const m of t.matchAll(ZITAT)) {
      const q = m[1];
      if (!CYR.test(q)) continue;
      const seite = wortgleich(q, fenster);
      if (!seite) continue;
      treffer.push({
        app: p.split('/apps/')[1].split('/')[0],
        datei: p.split('/apps/')[1].split('/').slice(1).join('/'),
        zeile: t.slice(0, m.index).split('\n').length,
        woerter: normalisiere(q).split(' ').filter(Boolean).length,
        seite,
        text: q.replace(/\s+/g, ' '),
      });
    }
  }
  return treffer;
}

// ---------- Aufruf ----------
const WURZEL = fileURLToPath(new URL('../', import.meta.url));
if (process.argv[1] && fileURLToPath(new URL(import.meta.url)) === process.argv[1]) {
  const args = process.argv.slice(2);
  const jsonIdx = args.indexOf('--json');
  const jsonDatei = jsonIdx >= 0 ? args[jsonIdx + 1] : null;
  const quelle = args.find((a, i) => !a.startsWith('--') && (jsonIdx < 0 || i !== jsonIdx + 1));
  if (!quelle) {
    console.error('Aufruf: node tools/wortgleich-pruefen.mjs <all.txt> [--json <Datei>]');
    process.exit(64);
  }
  const treffer = pruefeApps(WURZEL, readFileSync(quelle, 'utf8'));
  const nachApp = {};
  for (const t of treffer) nachApp[t.app] = (nachApp[t.app] ?? 0) + 1;
  console.log(`Stellen mit ${FENSTER} oder mehr gleichen Wörtern wie im Quelltext: ${treffer.length} in ${Object.keys(nachApp).length} Apps`);
  for (const [app, n] of Object.entries(nachApp).sort((a, b) => b[1] - a[1])) console.log(`  ${app.padEnd(36)} ${n}`);
  if (jsonDatei) {
    writeFileSync(jsonDatei, JSON.stringify(treffer, null, 2) + '\n');
    console.log(`Geschrieben: ${jsonDatei}`);
  }
}
