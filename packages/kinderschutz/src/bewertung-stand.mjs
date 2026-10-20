// Stand der Ergebnis-Wertung (Rekord, Punkte, Ränge, Treffer). Zwei Ratchets:
//  - quiz-kern: je Datei die Zahl der Treffer im Code (ohne Kommentare). Der Motor führt weder Rekord
//    noch Punkte noch Ränge; die Zählung soll 0 bleiben.
//  - Apps: Liste der Apps, die Rekord, Rang, Rangliste, den Schlüssel raenge, eine Trophäe (🏆),
//    einen Zähler (punkte, treffer, richtige, quizPunkte, kindPunkte) in der Anzeige oder einen Zähler
//    mit „n von m“ im Code führen. Die Liste schrumpft nur; neue Einträge brauchen eine Entscheidung.
// Verneinungen („kein Rekord“) und Kommentare zählen nicht.
// Zwei Listen für Ausnahmen: „ausnahmen“ sind bestätigt (Max), „ausnahmen_vorgeschlagen“ sind offen und
// bleiben in der Liste, bis Max sie bestätigt.
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const KERN_WORTE = /\brekord\b|\bpunkt\w*|\braenge\b|\brang\b|localStorage\.setItem/gi;

// Wörter, die in der Anzeige oder im Code eine Wertung bedeuten.
export const APP_WORTE = /Rekord|\bRänge?\b|Rangliste|\braenge\b|🏆/g;
// Zähler, die eine Wertung führen. Bekannte Namen aus den Apps; neue Namen kommen mit der Entscheidung.
const ZAEHLER = 'punkte|treffer|richtige|quizPunkte|kindPunkte|elternPunkte';
// Zuwachs im Code: punkte++, richtige += 1
const ZUWACHS = new RegExp(`\\b(?:${ZAEHLER})\\s*(?:\\+\\+|\\+=)`);
// Anzeige: ${punkte} oder ${punkte()}
// Ohne „.length“: treffer.length ist eine Anzahl von Fundstellen, kein Zähler.
const ANZEIGE = new RegExp(`\\$\\{\\s*(?:${ZAEHLER})\\b(?!\\.length)[^}]*\\}`);
// Regulärer Ausdruck als Konstante (Prüfmuster, keine Anzeige).
const REGEX_KONSTANTE = /^\s*(?:export\s+)?const\s+\w+\s*=\s*\//;
// Vergleichsanzeige „${a} von ${b}“
const VON = /\$\{[^}]+\}\s*von\s*\$\{[^}]+\}/;
// Verneinung in derselben Zeile: die Zeile sagt, dass etwas fehlt.
const VERNEINUNG = /\b(kein|keine|keinen|keiner|ohne|nicht)\b/i;

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

/**
 * Warum eine Datei auffällt, als Liste von Gründen (leer = unauffällig).
 * Gründe: Wort (Rekord, Rang …), Anzeige (Zähler im Text), Zuwachs+von (Zähler mit Vergleichsanzeige).
 */
export function appGruende(name, text) {
  const js = /\.m?js$/.test(name);
  const quelle = js ? ohneKommentare(text) : text;
  const gruende = new Set();
  const zeilen = quelle.split('\n');
  zeilen.forEach((zeile, i) => {
    if (VERNEINUNG.test(zeile) || REGEX_KONSTANTE.test(zeile)) return;
    if ([...zeile.matchAll(APP_WORTE)].length) gruende.add('Wort');
    if (js && ANZEIGE.test(zeile)) gruende.add('Anzeige');
    if (js && ZUWACHS.test(zeile)) {
      const nah = zeilen.slice(Math.max(0, i - 3), i + 4).join('\n');
      if (VON.test(nah)) gruende.add('Zuwachs+von');
    }
  });
  return [...gruende];
}

/** Trefferzahl einer Datei (für Tests): Zeilen mit Wörtern oder Anzeigen plus Zuwächse mit „von“. */
export function appTrefferIn(name, text) {
  return appGruende(name, text).length;
}

/** Apps mit Gründen im eigenen Code oder in den Daten (ohne Tests, ohne Dokumente). */
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

/** Gründe je App (für die Liste an Max): { app: [Datei: Grund, …] }. */
export async function appGrundListe(wurzel) {
  const appsDir = join(wurzel, 'apps');
  const out = {};
  for (const slug of await appTreffer(wurzel)) {
    const dir = join(appsDir, slug);
    const dateien = [
      ...(await readdir(dir, { withFileTypes: true })).filter((e) => e.isFile() && /\.(mjs|html|json)$/.test(e.name)).map((e) => e.name),
      ...(await readdir(join(dir, 'daten'), { withFileTypes: true }).catch(() => [])).filter((e) => e.isFile() && e.name.endsWith('.json')).map((e) => `daten/${e.name}`),
    ];
    const belege = [];
    for (const f of dateien) {
      const g = appGruende(f, await readFile(join(dir, f), 'utf8'));
      if (g.length) belege.push(`${f}: ${g.join('+')}`);
    }
    out[slug] = belege;
  }
  return out;
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
  for (const a of betroffen) if (!(stand.apps ?? []).includes(a)) probleme.push(`${a}: neu mit Rekord, Rang oder Zähler im Code`);
  for (const a of stand.apps ?? []) if (!betroffen.includes(a)) probleme.push(`${a}: nicht mehr betroffen, aus dem Stand streichen`);
  for (const a of ausnahmen) if (!apps.includes(a)) probleme.push(`Ausnahme ${a}: keine Treffer mehr, Ausnahme streichen`);
  return probleme;
}
