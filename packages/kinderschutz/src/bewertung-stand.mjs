// Stand der Ergebnis-Wertung (Rekord, Punkte, Ränge, Treffer, Rangfolgen). Zwei Ratchets:
//  - quiz-kern: je Datei die Zahl der Treffer im Code (ohne Kommentare). Der Motor führt weder Rekord
//    noch Punkte noch Ränge; die Zählung soll 0 bleiben.
//  - Apps: Liste der Apps mit einem Befund: Wort (Rekord, Rang, Rangliste, raenge, Rangfolge, Pokal-Symbol 🏆),
//    Anzeige eines Zählers (punkte, treffer, richtige, quizPunkte, kindPunkte) oder ein
//    Zähler mit „n von m“. Die Liste schrumpft nur; neue Einträge brauchen eine Entscheidung (--erweitern).
// Verneinung: ein Verneinungswort (kein, keine, ohne, nicht, nie) hebt einen Begriff nur auf, wenn es
// höchstens drei Wörter davor steht und kein Satz-, Kommentar- oder Klammerzeichen dazwischen liegt.
// Kommentare zählen nicht. Die Konfiguration rekordSchluessel: '…' allein ist Migration und zählt nicht.
// Ausnahmen: „ausnahmen“ sind bestätigt (Max), „ausnahmen_vorgeschlagen“ bleiben in der Liste, bis Max sie
// bestätigt.
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

// Wortgrenze, die auch nach einem Escape \b in Prüfmustern gilt: davor steht entweder kein Buchstabe
// oder der Escape „\b“ selbst.
const GRENZE = '(?:(?<![a-zäöüß])|(?<=\\\\b))';
const ENDE = '(?![a-zäöüß])';

// Begriffe mit Wertung. Ohne Rücksicht auf Groß- und Kleinschreibung (REKORD, rekord, Rekord).
// „rekord“ zählt auch als Teil eines Namens (REKORD_SCHLUESSEL). Englisch „range“ zählt nicht.
export const APP_WORTE = new RegExp(
  `rekord|${GRENZE}(?:rang|ränge|raenge)${ENDE}|rangliste|rangfolge|🏆`,
  'gi',
);
// Zähler, die eine Wertung führen. Bekannte Namen aus den Apps; neue Namen kommen mit der Entscheidung.
const ZAEHLER = 'punkte|treffer|richtige|quizPunkte|kindPunkte|elternPunkte|summen';
// Zuwachs im Code: punkte++, richtige += 1
const ZUWACHS = new RegExp(`\\b(?:${ZAEHLER})\\s*(?:\\+\\+|\\+=)`, 'g');
// Anzeige: ${punkte}, ${punkte()} oder ${fn(summen[id])}: der Zähler steht irgendwo im Ausdruck.
// Ohne „.length“, das ist eine Anzahl von Fundstellen.
const ANZEIGE = new RegExp(`\\$\\{[^}]*\\b(?:${ZAEHLER})\\b(?!\\.length)[^}]*\\}`, 'g');
// Vergleichsanzeige „${a} von ${b}“
const VON = /\$\{[^}]+\}\s*von\s*\$\{[^}]+\}/;
// Migration: nur die Konfigurationszeile allein, nicht eine Zeile mit weiteren Zugriffen.
const MIGRATION = /^\s*rekordSchluessel\s*:\s*'[^']*'\s*,?\s*$/;
// Verneinungswörter. Das Fenster ist auf drei Wörter und auf den Satzteil davor begrenzt.
const VERNEINT_WORT = /^(kein|keine|keinen|keiner|keines|ohne|nicht|nie)$/i;
const WORTFENSTER = 3;
// Zeichen, die einen Satzteil beenden: Verneinung wirkt nicht darüber hinweg.
const SATZTEIL = /[.;:!?,()[\]{}"„“|]/;

/** Quelltext ohne Kommentare, damit Erklärungen über das Verbotene nicht zählen. */
export function ohneKommentare(text) {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split('\n')
    .map((z) => (/^\s*\/\//.test(z) ? '' : z.replace(/(?<![:\w])\/\/.*$/, '')))
    .join('\n');
}

/** Zahl der Treffer je Datei in quiz-kern/src. */
export async function kernTreffer(wurzel) {
  const dir = join(wurzel, 'packages', 'quiz-kern', 'src');
  const treffer = {};
  for (const f of (await readdir(dir)).filter((f) => f.endsWith('.mjs')).sort()) {
    treffer[f] = kernTrefferIn(await readFile(join(dir, f), 'utf8'));
  }
  return treffer;
}
export const KERN_WORTE = /rekord|\bpunkt\w*|\braenge\b|\brang\b|localStorage\.setItem/gi;

/**
 * Zahl der Treffer im Quelltext des Motors. Aus jeder Zeile wird nur der Name rekordSchluessel
 * herausgenommen, nicht die ganze Zeile übersprungen: localStorage.setItem(rekordSchluessel, String(punkte))
 * zählt 2, localStorage.removeItem(rekordSchluessel) zählt 0 (die einmalige Entfernung des alten Schlüssels).
 */
export function kernTrefferIn(quelle) {
  let n = 0;
  for (const zeile of ohneKommentare(quelle).split('\n')) {
    n += [...zeile.replace(/rekordSchluessel/gi, '').matchAll(KERN_WORTE)].length;
  }
  return n;
}

/**
 * Zahl der Treffer einer Zeile, ohne die, vor denen ein Verneinungswort im selben Satzteil und in den
 * drei Wörtern davor steht. Escapes wie \b zählen nicht als Wort.
 */
export function zaehleTreffer(zeile, muster) {
  let n = 0;
  const flags = muster.flags.includes('g') ? muster.flags : `${muster.flags}g`;
  for (const m of zeile.matchAll(new RegExp(muster.source, flags))) {
    const davor = zeile.slice(0, m.index).replace(/\\[a-zA-Z]/g, ' ');
    const satzteil = davor.split(SATZTEIL).pop();
    const woerter = satzteil.match(/[\p{L}\p{N}]+/gu) ?? [];
    const verneint = woerter.slice(-WORTFENSTER).some((w) => VERNEINT_WORT.test(w));
    if (!verneint) n += 1;
  }
  return n;
}

/**
 * Warum eine Datei auffällt, als Liste von Gründen (leer = unauffällig).
 * Gründe: Wort, Anzeige (Zähler im Text), Zuwachs+von (Zähler mit Vergleichsanzeige im Umfeld).
 */
export function appGruende(name, text) {
  const js = /\.m?js$/.test(name);
  const quelle = js ? ohneKommentare(text) : text;
  const gruende = new Set();
  const zeilen = quelle.split('\n');
  zeilen.forEach((zeile, i) => {
    if (js && MIGRATION.test(zeile)) return;
    if (zaehleTreffer(zeile, APP_WORTE) > 0) gruende.add('Wort');
    if (js && zaehleTreffer(zeile, ANZEIGE) > 0) gruende.add('Anzeige');
    if (js && zaehleTreffer(zeile, ZUWACHS) > 0) {
      const nah = zeilen.slice(Math.max(0, i - 3), i + 4).join('\n');
      if (VON.test(nah)) gruende.add('Zuwachs+von');
    }
  });
  return [...gruende];
}

/** Trefferzahl einer Datei (für Tests): Zahl der Gründe. */
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
