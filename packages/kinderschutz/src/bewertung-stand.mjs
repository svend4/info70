// Stand der Ergebnis-Wertung (Rekord, Punkte, Ränge). Zwei Ratchets:
//  - quiz-kern: je Datei die Zahl der Treffer im Code (ohne Kommentare). Der Einzel-Ablauf ist sauber;
//    Duett und Staffel bleiben bis zur Entscheidung unverändert und stehen im Stand.
//  - Apps: Liste der Apps, die „Rekord“, „Rang“, „Rangliste“ oder den Schlüssel raenge im eigenen Code
//    führen. Die Liste wächst nur durch eine Entscheidung; wer etwas entfernt, streicht es aus dem Stand.
// Ausnahmen (Ranking von Objekten, kein Lernstand) stehen im Stand unter „ausnahmen“ mit Begründung.
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const KERN_WORTE = /\brekord\b|\bpunkt\w*|\braenge\b|\brang\b|localStorage\.setItem/gi;
export const APP_WORTE = /Rekord|\bRänge?\b|Rangliste|\braenge\b/g;

/** Quelltext ohne Kommentare, damit Erklärungen über das Verbotene nicht zählen. */
export function ohneKommentare(text) {
  return text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
}

/** Trefferzahl je Datei in quiz-kern/src. */
export async function kernTreffer(wurzel) {
  const dir = join(wurzel, 'packages', 'quiz-kern', 'src');
  const treffer = {};
  for (const f of (await readdir(dir)).filter((f) => f.endsWith('.mjs')).sort()) {
    const code = ohneKommentare(await readFile(join(dir, f), 'utf8'));
    treffer[f] = [...code.matchAll(KERN_WORTE)].length;
  }
  return treffer;
}

// Zeilen, die etwas verneinen („kein Rekord“, „keine Ränge“, „ohne Rangliste“), sind keine Funktion.
const VERNEINUNG = /\b(kein|keine|keinen|keiner|ohne|nicht)\b/i;

/** Treffer in einer Datei: JS ohne Kommentare, Zeilen mit Verneinung ausgenommen. */
export function appTrefferIn(name, text) {
  const quelle = /\.m?js$/.test(name) ? ohneKommentare(text) : text;
  return quelle.split('\n')
    .filter((zeile) => !VERNEINUNG.test(zeile))
    .reduce((n, zeile) => n + [...zeile.matchAll(APP_WORTE)].length, 0);
}

/** Apps mit Treffern im eigenen Code oder in den Daten (ohne Tests, ohne Dokumente). */
export async function appTreffer(wurzel) {
  const appsDir = join(wurzel, 'apps');
  const liste = [];
  for (const slug of (await readdir(appsDir, { withFileTypes: true })).filter((e) => e.isDirectory()).map((e) => e.name).sort()) {
    const dir = join(appsDir, slug);
    const dateien = [
      ...(await readdir(dir, { withFileTypes: true })).filter((e) => e.isFile() && /\.(mjs|html|json)$/.test(e.name)).map((e) => join(dir, e.name)),
      ...(await readdir(join(dir, 'daten'), { withFileTypes: true }).catch(() => []))
        .filter((e) => e.isFile() && e.name.endsWith('.json')).map((e) => join(dir, 'daten', e.name)),
    ];
    for (const d of dateien) {
      if (appTrefferIn(d, await readFile(d, 'utf8')) > 0) { liste.push(slug); break; }
    }
  }
  return [...new Set(liste)].sort();
}

/** Vergleich mit dem Stand: Probleme als Text, leer heißt ok. */
export function vergleiche(stand, kern, apps) {
  const probleme = [];
  const ausnahmen = Object.keys(stand.ausnahmen ?? {});
  for (const [f, n] of Object.entries(kern)) {
    const alt = stand.kern?.[f];
    if (alt === undefined) probleme.push(`quiz-kern/src/${f}: nicht im Stand`);
    else if (n !== alt) probleme.push(`quiz-kern/src/${f}: ${n} Treffer statt ${alt} im Stand`);
  }
  const betroffen = apps.filter((a) => !ausnahmen.includes(a));
  for (const a of betroffen) if (!(stand.apps ?? []).includes(a)) probleme.push(`${a}: neu mit Rekord, Rang oder raenge im Code`);
  for (const a of stand.apps ?? []) if (!betroffen.includes(a)) probleme.push(`${a}: nicht mehr betroffen, aus dem Stand streichen`);
  for (const a of ausnahmen) if (!apps.includes(a)) probleme.push(`Ausnahme ${a}: keine Treffer mehr, Ausnahme streichen`);
  return probleme;
}
