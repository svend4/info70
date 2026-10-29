// Prüfung der Seitenangaben einer App gegen die Textkopie der Pralęska (Serie C, Plan 18.10 Abschnitt 7).
// Eine Seitenangabe („S. 19“, „S. 267–268“, „с. 81“, „стр. 12“) steht mit einem Zitat in derselben Zeile:
// „«Познать, чтобы воспитывать», S. 19“. Geprüft wird: liegt die Seite im Text (1 bis 320), und steht das Zitat
// auf dieser Seite (wörtlich oder nur mit denselben Wörtern)? Wird das Zitat anderswo gefunden, nennt die Prüfung
// die Seite. Das ist eine maschinelle Prüfung, keine Prüfung durch einen Menschen: Ob der Satz den Text richtig
// wiedergibt, prüft sie nicht. Verweise ohne Zitat werden nur gezählt.
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

/** Seitenangabe mit optionalem Bereich. Dieselbe Form wie in seitenmarke.mjs (S., Seite, стр., с.). */
export const SEITE_RE = /(?<![\p{L}\p{N}])(?:(?<!Abs\.\s?\d+\s?)S\.|Seiten?|стр\.|с\.)\s?(\d{1,3})(?:\s?[–-]\s?(\d{1,3}))?(?![\p{L}\p{N}])/gu;
/** Zitate in deutschen, russischen und geraden Anführungszeichen. */
export const ZITAT_RE = /[«„"“]([^«»„“”"\n]{3,160})[«»“”"]/gu;

export const MARKE_MASCHINELL = 'Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.';
const MARKE_NICHT = /nicht von einem Menschen geprüft/;

/** Normalform für den Vergleich: Trennstriche am Zeilenende, Satzzeichen, Groß und Klein, Leerraum. */
export function normalisiere(s) {
  return s
    .replace(/\u00ad/g, '')
    .replace(/-\n/g, '')
    .replace(/[.,;:!?()«»„“”"‘’'–—\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .trim();
}

/** Seiten der Textkopie: Seite n ist der Eintrag n-1 nach dem Split an Formfeed (wie tools/bauauftrag-pruefen.mjs). */
export function seitenAusText(text) {
  return text.split('\f').map((s) => normalisiere(s));
}

/** Verweise einer Zeile: { text, seiten: [n…], zitate: [...] } je Seitenangabe. */
export function verweiseInZeile(zeile) {
  const zitate = [...zeile.matchAll(ZITAT_RE)].map((m) => m[1].trim());
  const treffer = [];
  for (const m of zeile.matchAll(SEITE_RE)) {
    const von = Number(m[1]);
    const bis = m[2] ? Number(m[2]) : von;
    const seiten = [];
    for (let s = von; s <= bis && bis - von < 10; s += 1) seiten.push(s);
    treffer.push({ text: m[0], seiten, von, bis, zitate });
  }
  return treffer;
}

/** Ergebnis eines Zitats gegen die Seiten: 'wörtlich', 'Wörter', 'nicht gefunden' oder 'kein Zitat'. */
export function pruefeZitat(zitat, seiten, seitenNummern) {
  const n = normalisiere(zitat);
  if (!n) return { ergebnis: 'kein Zitat' };
  const auf = seitenNummern.map((s) => seiten[s - 1] ?? '');
  if (auf.some((t) => t.includes(n))) return { ergebnis: 'wörtlich' };
  const woerter = n.split(' ').filter((w) => w.length >= 3);
  if (woerter.length && auf.some((t) => woerter.every((w) => t.includes(w)))) return { ergebnis: 'Wörter' };
  return { ergebnis: 'nicht gefunden' };
}

/** Seiten, auf denen ein Zitat wörtlich steht (höchstens fünf, zur Hinweisgabe). */
export function fundstellen(zitat, seiten) {
  const n = normalisiere(zitat);
  if (!n) return [];
  const fund = [];
  seiten.forEach((t, i) => { if (t.includes(n) && fund.length < 5) fund.push(i + 1); });
  return fund;
}

/** Dateien einer App, die Nutzer oder Leser sehen: README, GDD und die Nutzerdateien. */
async function dateienDerApp(wurzel, slug) {
  const dir = join(wurzel, 'apps', slug);
  const liste = [];
  for (const f of ['README.md', 'GDD.md', 'index.html', 'eltern.html', 'app.mjs', 'logik.mjs']) {
    try { await readFile(join(dir, f)); liste.push(f); } catch { /* fehlt */ }
  }
  for (const f of (await readdir(join(dir, 'daten')).catch(() => []))) {
    if (f.endsWith('.json')) liste.push(`daten/${f}`);
  }
  return liste;
}

/** Prüft alle Seitenangaben einer App. Gibt { app, dateien, marke, verweise, zusammen } zurück. */
export async function pruefeAppSeiten(wurzel, slug, seiten) {
  const dateien = await dateienDerApp(wurzel, slug);
  const verweise = [];
  let marke = null;
  let textAlle = '';
  for (const datei of dateien) {
    const text = await readFile(join(wurzel, 'apps', slug, datei), 'utf8');
    textAlle += text;
    if (datei.endsWith('.mjs') || datei.endsWith('.html') || datei.endsWith('.json') || datei.endsWith('.md')) {
      // Kommentarzeilen (JS) zählen nicht als Nutzertext, bleiben aber für die Marke im Text.
      const zeilen = text.split('\n');
      zeilen.forEach((z, i) => {
        // Ein Zitat darf in der Zeile davor beginnen (Zeilenumbruch im Absatz): dann gilt die Zeile davor als Kontext.
        const kontext = i > 0 && !/[«„“"]/.test(z) === false && !/[«„“"][^«„“"]*$/.test(zeilen[i - 1]) ? z : (i > 0 && /[«„“"][^«„“"]*$/.test(zeilen[i - 1]) && /[»“"]/.test(z) ? `${zeilen[i - 1]} ${z}` : z);
        for (const v of verweiseInZeile(kontext)) {
          const ergebnisse = v.zitate.length
            ? v.zitate.map((zitat) => ({ zitat, ...pruefeZitat(zitat, seiten, v.seiten) }))
            : [{ zitat: null, ergebnis: 'kein Zitat' }];
          const beste = ergebnisse.find((e) => e.ergebnis === 'wörtlich') ?? ergebnisse.find((e) => e.ergebnis === 'Wörter') ?? ergebnisse[0];
          const seitenFehler = v.seiten.filter((s) => s < 1 || s > seiten.length - 1);
          verweise.push({
            datei,
            zeile: i + 1,
            text: z.trim().slice(0, 200),
            seiten: v.seiten,
            seite_ausserhalb: seitenFehler.length > 0,
            zitate: ergebnisse,
            ergebnis: seitenFehler.length ? 'Seite außerhalb des Textes' : beste.ergebnis,
            gefunden_auf: beste.zitat && beste.ergebnis !== 'wörtlich' ? fundstellen(beste.zitat, seiten) : [],
          });
        }
      });
    }
  }
  if (markeMaschinellImText(textAlle)) marke = 'maschinell geprüft (Pflichtmarkierung)';
  else if (MARKE_NICHT.test(textAlle)) marke = 'nicht von einem Menschen geprüft (Marke, Entscheidung 22а)';
  const zusammen = {};
  for (const v of verweise) zusammen[v.ergebnis] = (zusammen[v.ergebnis] ?? 0) + 1;
  return { app: slug, dateien, marke, verweise, zusammen };
}

function markeMaschinellImText(text) {
  return text.includes(MARKE_MASCHINELL);
}

/** Enthält die App überhaupt eine Seitenangabe (für die Auswahl der Apps). */
export async function hatSeitenangabe(wurzel, slug) {
  for (const datei of await dateienDerApp(wurzel, slug)) {
    const text = await readFile(join(wurzel, 'apps', slug, datei), 'utf8');
    if (verweiseInZeile(text).length) return true;
  }
  return false;
}
