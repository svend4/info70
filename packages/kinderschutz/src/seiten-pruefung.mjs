// Prüfung der Seitenangaben einer App gegen die Textkopie der Pralęska (Serie C, Plan 18.10 Abschnitt 7).
// Eine Seitenangabe („S. 19“, „S. 267–268“, „с. 81“, „стр. 12“) steht mit einem Zitat in derselben Zeile:
// „«Познать, чтобы воспитывать», S. 19“. Geprüft wird: liegt die Seite im Text (1 bis 320), und steht das Zitat
// auf dieser Seite (wörtlich oder nur mit denselben Wörtern)? Wird das Zitat anderswo gefunden, nennt die Prüfung
// die Seite. Das ist eine maschinelle Prüfung, keine Prüfung durch einen Menschen: Ob der Satz den Text richtig
// wiedergibt, prüft sie nicht. Verweise ohne Zitat werden nur gezählt.
// JSON-Dateien (daten/*.json) werden objektweise geprüft (pruefeJsonObjekte): Einheit ist die Wurzel oder ein
// Listenelement mit einer Seitenangabe; ein Unterobjekt zählt für sein Elternobjekt.
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

/** Seitenangabe mit optionalem Bereich. Dieselbe Form wie in seitenmarke.mjs (S., Seite, стр., с.). */
// Stand 29.10.2026 (Welle 4): der Bereich kann auch mit „bis“ geschrieben sein („S. 265 bis 267“). seitenmarke.mjs
// hat weiterhin seine eigene Form. Die bis Welle 3 gültige Zeile lautete:
// export const SEITE_RE = /(?<![\p{L}\p{N}])(?:(?<!Abs\.\s?\d+\s?)S\.|Seiten?|стр\.|с\.)\s?(\d{1,3})(?:\s?[–-]\s?(\d{1,3}))?(?![\p{L}\p{N}])/gu;
export const SEITE_RE = /(?<![\p{L}\p{N}])(?:(?<!Abs\.\s?\d+\s?)S\.|Seiten?|стр\.|с\.)\s?(\d{1,3})(?:(?:\s?[–-]\s?|\s+bis\s+)(\d{1,3}))?(?![\p{L}\p{N}])/gu;
/** Zitate in deutschen, russischen und geraden Anführungszeichen. */
export const ZITAT_RE = /[«„"“]([^«»„“”"\n]{3,160})[«»“”"]/gu;

export const MARKE_MASCHINELL = 'Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.';
const MARKE_NICHT = /nicht von einem Menschen geprüft/;
const KYRILL_RE = /\p{Script=Cyrillic}/u;
const LATEIN_RE = /\p{Script=Latin}/u;
/** Anführungsteile in « », „ “, “ ” und " ". */
const ANFUEHRUNG_RE = /[«„“"]([^«»„“”"]*)[»“”"]/gu;

/** Normalform für den Vergleich: Trennstriche am Zeilenende, Satzzeichen, Groß und Klein, Leerraum. */
export function normalisiere(s) {
  return s
    .replace(/\u00ad/g, '')
    // Stand 29.10.2026 (Welle 4): Trennstrich, Zeilenumbruch und Leerraum danach werden zusammengezogen. Die bis Welle 3
    // gültige Zeile lautete: .replace(/-\n/g, '') (dann blieb ein Wort mit Trennstrich und Einzug danach getrennt).
    .replace(/-\n\s*/g, '')
    .replace(/[.,;:!?()«»„“”"‘’'–—\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .trim();
}

/** Seiten der Textkopie: Seite n ist der Eintrag n-1 nach dem Split an Formfeed (wie tools/bauauftrag-pruefen.mjs). */
export function seitenAusText(text) {
  return text.split('\f').map((s) => normalisiere(s));
}

/** Höchstzahl der Seiten eines Bereichs, der geprüft wird (Welle 4). Größere Bereiche sind „Bereich zu groß“. */
const MAX_BEREICH = 20;

/** Seiten eines Treffers von SEITE_RE (Welle 4). Ein Bereich über MAX_BEREICH Seiten wird nicht geprüft (seiten leer). */
function bereich(m) {
  const a = Number(m[1]);
  const b = m[2] ? Number(m[2]) : a;
  const von = Math.min(a, b);
  const bis = Math.max(a, b);
  const umfang = bis - von + 1;
  const zuGross = umfang > MAX_BEREICH;
  const seiten = [];
  if (!zuGross) for (let s = von; s <= bis; s += 1) seiten.push(s);
  return { von, bis, umfang, zuGross, seiten };
}

/**
 * Position des öffnenden Anführungszeichens, das am Ende von s noch offen ist (Stand 29.10.2026, Welle 4, Fassung 6);
 * -1, wenn alle Anführungszeichen geschlossen sind. Öffner: « „ " “; Schließer: » “ ” ".
 */
function offenesZitatAb(s) {
  let offen = -1;
  for (let k = 0; k < s.length; k += 1) {
    if (offen < 0 && /[«„"“]/.test(s[k])) offen = k;
    else if (offen >= 0 && /[»“”"]/.test(s[k])) offen = -1;
  }
  return offen;
}

/**
 * Verweise einer Zeile: { text, seiten: [n…], zitate: [...] } je Seitenangabe. Die Seitenangaben kommen aus der Zeile,
 * die Zitate aus zitatText (Stand 29.10.2026, Welle 4, Fassung 6: die Zeile mit dem Kontext aus der Vorzeile; Standard: die Zeile).
 * Stand 29.10.2026, Welle 4, Fassung 7: die Zitate aus vorzeilenText gehören nur zur Seitenangabe am Zeilenanfang, das heißt
 * zu einer Seitenangabe, die in den ersten zwanzig Zeichen der Zeile beginnt.
 */
export function verweiseInZeile(zeile, zitatText = zeile, vorzeilenText = '') {
  const zitate = [...zitatText.matchAll(ZITAT_RE)].map((m) => m[1].trim());
  const amAnfang = [...vorzeilenText.matchAll(ZITAT_RE)].map((m) => m[1].trim());
  const treffer = [];
  for (const m of zeile.matchAll(SEITE_RE)) {
    // Die bis Welle 3 gültige Schleife (Stand 29.10.2026 ersetzt) ließ Bereiche ab zehn Seiten leer:
    // const von = Number(m[1]);
    // const bis = m[2] ? Number(m[2]) : von;
    // const seiten = [];
    // for (let s = von; s <= bis && bis - von < 10; s += 1) seiten.push(s);
    // treffer.push({ text: m[0], seiten, von, bis, zitate });
    const { von, bis, umfang, zuGross, seiten } = bereich(m);
    const eigene = m.index < 20 ? [...zitate, ...amAnfang] : zitate;
    treffer.push({ text: m[0], seiten, von, bis, zitate: eigene, umfang, zuGross });
  }
  return treffer;
}

// Stand 29.10.2026 (Welle 4, Fassung 5, Regel C+): Wortvergleich über den Stamm. Bis Fassung 4 galt die Teilfolge
// (jede Stelle, auch mitten im Wort: «нож» traf „множество“), und „Wörter“ galt nur für Zitatwörter ab drei Buchstaben.

/** Stamm eines Zitatworts: ohne den letzten Buchstaben, wenn es mindestens vier Buchstaben hat; sonst das ganze Wort. */
function stamm(wort) {
  const buchstaben = [...wort];
  return buchstaben.length >= 4 ? buchstaben.slice(0, -1).join('') : wort;
}

/** Zitate mit einer Zahl oder mit einem lateinischen Buchstaben in einem kyrillischen Zitat bleiben bei der alten Prüfung. */
function wieBisher(n) {
  return /\p{N}/u.test(n) || (KYRILL_RE.test(n) && LATEIN_RE.test(n));
}

// Stand 29.10.2026 (Welle 4, Fassung 5, Wortdefinition B): ein Wort ist eine Folge aus Buchstaben und Ziffern. Sonderzeichen
// wie „*“, „/“ oder „**“ trennen und zählen nicht; ein Zitat ohne Buchstaben und Ziffern ist „kein Zitat“. Bis Fassung 5 trennte
// nur das Leerzeichen; dann klebte ein Sternchen am Wort („*обучать“) und ließ es nicht beginnen.

/** Wörter eines Textes: Folgen aus Buchstaben und Ziffern (Fassung 5, Regel B). */
function woerterVon(s) {
  return s.split(/[^\p{L}\p{N}]+/u).filter((w) => w.length > 0);
}

/** Steht die Normalform n auf der Seite t wörtlich? Die Stämme der Zitatwörter folgen aufeinander; jeder trifft ein Textwort am Wortanfang. */
function wortlautAuf(n, t) {
  if (wieBisher(n)) return t.includes(n);
  // Bis Fassung 5 (Stand 29.10.2026, Regel C+ mit Leerzeichen): const staemme = n.split(' ').map(stamm);
  const staemme = woerterVon(n).map(stamm);
  if (!staemme.length || !t.includes(staemme[0])) return false;
  // Bis Fassung 5 (Stand 29.10.2026, Regel C+ mit Leerzeichen): const woerter = t.split(' ');
  const woerter = woerterVon(t);
  for (let k = 0; k + staemme.length <= woerter.length; k += 1) {
    if (staemme.every((s, i) => woerter[k + i].startsWith(s))) return true;
  }
  return false;
}

/** Steht jedes Zitatwort auf der Seite t, nicht unbedingt aufeinanderfolgend? */
function alleWoerterAuf(n, t) {
  if (wieBisher(n)) {
    const woerter = n.split(' ').filter((w) => w.length >= 3);
    return woerter.length > 0 && woerter.every((w) => t.includes(w));
  }
  // Bis Fassung 5 (Stand 29.10.2026, Regel C+ mit Leerzeichen): const woerter = t.split(' ');
  //   return n.split(' ').map(stamm).every((s) => woerter.some((w) => w.startsWith(s)));
  const woerter = woerterVon(t);
  return woerterVon(n).map(stamm).every((s) => woerter.some((w) => w.startsWith(s)));
}

/** Ergebnis eines Zitats gegen die Seiten: 'wörtlich', 'Wörter', 'nicht gefunden' oder 'kein Zitat'. */
export function pruefeZitat(zitat, seiten, seitenNummern) {
  const n = normalisiere(zitat);
  if (!n) return { ergebnis: 'kein Zitat' };
  if (!woerterVon(n).length) return { ergebnis: 'kein Zitat' };
  const auf = seitenNummern.map((s) => seiten[s - 1] ?? '');
  // Bis Fassung 4 (Stand 29.10.2026, Welle 4): if (auf.some((t) => t.includes(n))) return { ergebnis: 'wörtlich' };
  if (auf.some((t) => wortlautAuf(n, t))) return { ergebnis: 'wörtlich' };
  // Bis Fassung 4 (Stand 29.10.2026, Welle 4): const woerter = n.split(' ').filter((w) => w.length >= 3);
  //   if (woerter.length && auf.some((t) => woerter.every((w) => t.includes(w)))) return { ergebnis: 'Wörter' };
  if (auf.some((t) => alleWoerterAuf(n, t))) return { ergebnis: 'Wörter' };
  return { ergebnis: 'nicht gefunden' };
}

/** Seiten, auf denen ein Zitat wörtlich steht (höchstens fünf, zur Hinweisgabe). */
export function fundstellen(zitat, seiten) {
  const n = normalisiere(zitat);
  if (!n) return [];
  const fund = [];
  // Bis Fassung 4 (Stand 29.10.2026, Welle 4): seiten.forEach((t, i) => { if (t.includes(n) && fund.length < 5) fund.push(i + 1); });
  seiten.forEach((t, i) => { if (wortlautAuf(n, t) && fund.length < 5) fund.push(i + 1); });
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
// Stand 29.10.2026 (Welle 4): zurück kommen außerdem einheiten, einheitenZusammen, ohneEinheit, gemischt,
// nichtGefundeneAnfuehrungsteile, fehler. verweise und zusammen gelten für die Zeilenprüfung (.md, .html, .mjs);
// einheiten für die JSON-Dateien (pruefeJsonObjekte).
export async function pruefeAppSeiten(wurzel, slug, seiten) {
  const dateien = await dateienDerApp(wurzel, slug);
  const verweise = [];
  const einheiten = [];
  const nichtGefundeneAnfuehrungsteile = [];
  const bereicheZuGross = [];
  const sammelseiten = [];
  const fehler = [];
  let ohneEinheit = 0;
  let gemischt = 0;
  let marke = null;
  let textAlle = '';
  for (const datei of dateien) {
    const text = await readFile(join(wurzel, 'apps', slug, datei), 'utf8');
    textAlle += text;
    if (datei.endsWith('.json')) {
      const j = pruefeJsonObjekte(text, seiten, datei);
      if (j.fehler) fehler.push({ datei, fehler: j.fehler });
      einheiten.push(...j.einheiten);
      ohneEinheit += j.ohneEinheit;
      gemischt += j.gemischt;
      nichtGefundeneAnfuehrungsteile.push(...j.nichtGefundeneAnfuehrungsteile);
      bereicheZuGross.push(...j.bereicheZuGross);
      sammelseiten.push(...j.sammelseiten);
      continue;
    }
    // Stand 29.10.2026 (Welle 4): JSON-Dateien stehen oben. Bis Welle 3 lautete die Bedingung:
    // if (datei.endsWith('.mjs') || datei.endsWith('.html') || datei.endsWith('.json') || datei.endsWith('.md')) {
    if (datei.endsWith('.mjs') || datei.endsWith('.html') || datei.endsWith('.md')) {
      // Kommentarzeilen (JS) zählen nicht als Nutzertext, bleiben aber für die Marke im Text.
      const zeilen = text.split('\n');
      zeilen.forEach((z, i) => {
        // Ein Zitat darf in der Zeile davor beginnen (Zeilenumbruch im Absatz). Stand 29.10.2026 (Welle 4, Fassung 6): aus der
        // Zeile davor zählt nur ein offenes Zitat am Zeilenende, das die Zeile mit ihrem schließenden Zeichen beendet, und dann
        // nur der Teil ab dem öffnenden Zeichen. Alle anderen Fälle: nur die Zeile selbst. Die Seitenangaben kommen aus der Zeile.
        // Bis Fassung 5 (Stand 29.10.2026, Welle 4): const kontext = i > 0 && !/[«„“"]/.test(z) === false && !/[«„“"][^«„“"]*$/.test(zeilen[i - 1]) ? z : (i > 0 && /[«„“"][^«„“"]*$/.test(zeilen[i - 1]) && /[»“"]/.test(z) ? `${zeilen[i - 1]} ${z}` : z);
        const vorige = zeilen[i - 1] ?? '';
        const offenAb = offenesZitatAb(vorige);
        const kontext = offenAb >= 0 && /[»“”"]/.test(z) ? `${vorige.slice(offenAb)} ${z}` : z;
        // Stand 29.10.2026 (Welle 4, Fassung 7): Hat die Vorzeile keine Seitenangabe, gehören ihre abgeschlossenen Zitate und ein
        // offenes Zitat bis zum Zeilenende nur zur Seitenangabe am Zeilenanfang dieser Zeile (siehe verweiseInZeile).
        const vorzeilenText = i > 0 && !enthaeltSeite(vorige)
          ? [vorige.slice(0, offenAb >= 0 ? offenAb : vorige.length), offenAb >= 0 && !/[»“”"]/.test(z) ? `«${vorige.slice(offenAb + 1)}»` : ''].join(' ')
          : '';
        // Bis Fassung 6 (Stand 29.10.2026, Welle 4): for (const v of verweiseInZeile(z, kontext)) {
        for (const v of verweiseInZeile(z, kontext, vorzeilenText)) {
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
          // Stand 29.10.2026 (Welle 4): ein Bereich über 20 Seiten wird nicht geprüft, sondern als Befund gezählt.
          if (v.zuGross) {
            const eintrag = verweise[verweise.length - 1];
            eintrag.ergebnis = 'Bereich zu groß';
            eintrag.gefunden_auf = [];
            eintrag.zitate = eintrag.zitate.map((z) => (z.zitat ? { ...z, ergebnis: 'nicht geprüft' } : z));
            bereicheZuGross.push({ datei, zeile: i + 1, text: v.text, umfang: v.umfang });
          }
        }
      });
    }
  }
  if (markeMaschinellImText(textAlle)) marke = 'maschinell geprüft (Pflichtmarkierung)';
  else if (MARKE_NICHT.test(textAlle)) marke = 'nicht von einem Menschen geprüft (Marke, Entscheidung 22а)';
  const zusammen = {};
  for (const v of verweise) zusammen[v.ergebnis] = (zusammen[v.ergebnis] ?? 0) + 1;
  const einheitenZusammen = {};
  for (const e of einheiten) einheitenZusammen[e.ergebnis] = (einheitenZusammen[e.ergebnis] ?? 0) + 1;
  // Bis Welle 3 (HEAD): return { app: slug, dateien, marke, verweise, zusammen };
  return { app: slug, dateien, marke, verweise, zusammen, einheiten, einheitenZusammen, ohneEinheit, gemischt, nichtGefundeneAnfuehrungsteile, sammelseiten, bereicheZuGross, fehler };
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

// ---- JSON: objektweise Prüfung (Serie C, Welle 4) ----

/** Enthält eine Zeichenkette eine Seitenangabe? */
function enthaeltSeite(s) {
  return [...s.matchAll(SEITE_RE)].length > 0;
}

/** Seitenangaben einer Zeichenkette mit ihren Seiten (Bereich bis MAX_BEREICH: alle Seiten; größer: nicht geprüft). */
function seitenAngabenIn(s) {
  return [...s.matchAll(SEITE_RE)].map((m) => ({ text: m[0], ...bereich(m) }));
}

/**
 * Zitate einer Zeichenkette (Regel 3). Mit Anführung: jeder Anführungsteil mit kyrillischen Buchstaben, ohne
 * lateinische Buchstaben und ohne Seitenangabe. Ohne Anführung: eine rein kyrillische Zeichenkette ganz.
 * Gemischt (kyrillisch und lateinisch) ohne Anführung ist kein Zitat, wird aber gezählt („gemischt, ungeprüft“).
 */
export function zitateAusZeichenkette(s) {
  if (!KYRILL_RE.test(s)) return { zitate: [], gemischt: false };
  const teile = [...s.matchAll(ANFUEHRUNG_RE)].map((m) => m[1].trim()).filter((t) => t.length);
  if (teile.length) {
    const zitate = teile
      .filter((t) => KYRILL_RE.test(t) && !LATEIN_RE.test(t) && !enthaeltSeite(t))
      .map((text) => ({ text, anfuehrung: true }));
    return { zitate, gemischt: false };
  }
  if (LATEIN_RE.test(s)) return { zitate: [], gemischt: true };
  if (enthaeltSeite(s)) return { zitate: [], gemischt: false };
  return { zitate: [{ text: s.trim(), anfuehrung: false }], gemischt: false };
}

/**
 * Gesamtstatus einer Einheit in dieser Rangfolge: „Seite außerhalb des Textes“, „kein Zitat“, „belegt“ (alle Zitate
 * gefunden), „teilweise“ (einige gefunden), „nicht gefunden“ (keines). ergebnisse: die Ergebnisse von pruefeZitat.
 */
// Stand 29.10.2026 (Welle 4, Fassung 3): Rangfolge „Seite außerhalb“, „Sammeleinheit“, „kein Zitat“, „belegt“, „teilweise“,
// „nicht gefunden“. „Sammeleinheit“ hat eine Einheit ohne eigene Zitate, aber mit einer tieferen Einheit mit Zitat.
export function gesamtStatus(ergebnisse, seiteAusserhalb, hatTieferZitat = false) {
  if (seiteAusserhalb) return 'Seite außerhalb des Textes';
  // Bis Welle 4, Fassung 2: if (!ergebnisse.length) return 'kein Zitat';
  if (!ergebnisse.length) return hatTieferZitat ? 'Sammeleinheit' : 'kein Zitat';
  const gefunden = ergebnisse.filter((e) => e !== 'nicht gefunden').length;
  if (gefunden === ergebnisse.length) return 'belegt';
  return gefunden ? 'teilweise' : 'nicht gefunden';
}

/** Die ersten sechs Wörter eines Zitats (für die Liste der nicht gefundenen Anführungsteile). */
function wortlaut(text) {
  return text.split(/\s+/).slice(0, 6).join(' ');
}

/**
 * Knoten eines JSON-Werts. art: 'wurzel' (oberstes Objekt), 'listenelement', 'feld' (Objekt als Feldwert) oder
 * 'virtuell' (oberste Liste). eigen: die Zeichenketten des Knotens, auch die in Listen aus Zeichenketten.
 */
function knotenAus(wert) {
  const knoten = [];
  const objekt = (o, pfad, eltern, art) => {
    knoten.push({ pfad, eltern, art, eigen: [], feld: [] });
    const i = knoten.length - 1;
    for (const [schluessel, v] of Object.entries(o)) {
      const p = `${pfad}.${schluessel}`;
      if (typeof v === 'string') knoten[i].eigen.push({ text: v, pfad: p });
      else if (Array.isArray(v)) liste(v, p, i);
      else if (v && typeof v === 'object') knoten[i].feld.push(objekt(v, p, i, 'feld'));
    }
    return i;
  };
  const liste = (arr, pfad, i) => {
    arr.forEach((x, n) => {
      const p = `${pfad}[${n}]`;
      if (typeof x === 'string') knoten[i].eigen.push({ text: x, pfad: p });
      else if (Array.isArray(x)) liste(x, p, i);
      else if (x && typeof x === 'object') objekt(x, p, i, 'listenelement');
    });
  };
  if (Array.isArray(wert)) {
    knoten.push({ pfad: '$', eltern: -1, art: 'virtuell', eigen: [], feld: [] });
    liste(wert, '$', 0);
  } else if (wert && typeof wert === 'object') {
    objekt(wert, '$', -1, 'wurzel');
  }
  return knoten;
}

/**
 * Prüft die Seitenangaben einer JSON-Datei objektweise. Einheit ist die Wurzel oder ein Listenelement, das eine
 * Seitenangabe hat (in einem eigenen Feld oder in einem Unterobjekt). Ein Unterobjekt (Feldwert) ist keine eigene
 * Einheit; seine Seitenangaben zählen für das Elternobjekt. Die Zitate einer Einheit sind die kyrillischen Zitate ihres
 * Teilbaums ohne die Zitate tieferer Einheiten. Zeichenketten ohne Einheit werden gezählt, nicht bewertet.
 * Gibt { einheiten, ohneEinheit, gemischt, nichtGefundeneAnfuehrungsteile } zurück, bei unlesbarem JSON { fehler }.
 * Stand 29.10.2026 (Welle 4, Fassung 3): Regel 1 gilt auf jeder Ebene. Das Elternobjekt eines Seitenträgers wird selbst
 * Einheit, auch ein Feldobjekt. Zusätzlich liefert die Funktion sammelseiten (4d) und bereicheZuGross.
 */
export function pruefeJsonObjekte(text, seiten, datei) {
  let wert;
  try {
    wert = JSON.parse(text);
  } catch (e) {
    return { fehler: `JSON nicht lesbar: ${e.message}`, einheiten: [], ohneEinheit: 0, gemischt: 0, nichtGefundeneAnfuehrungsteile: [], sammelseiten: [], bereicheZuGross: [] };
  }
  const knoten = knotenAus(wert);
  const seitenZahl = seiten.length - 1;
  // Regel 1 auf jeder Ebene (Stand 29.10.2026, Welle 4, Fassung 3): eine Seite in einem Unterobjekt (Feldwert) zählt für das
  // Elternobjekt, auch wenn das Unterobjekt selbst keine Seite hat, sondern nur ein weiteres Unterobjekt mit Seite.
  const hatSeite = (i) => knoten[i].eigen.some((z) => enthaeltSeite(z.text)) || knoten[i].feld.some(hatSeite);
  // Einheit: die Wurzel oder ein Listenelement mit Seite; ein Feldobjekt, das Elternobjekt eines Seitenträgers ist, ebenso.
  const istEinheit = knoten.map((k, i) => {
    if (k.art === 'wurzel' || k.art === 'listenelement') return hatSeite(i);
    if (k.art === 'feld') return k.feld.some(hatSeite);
    return false;
  });
  const einheitVon = (i) => {
    for (let j = i; j >= 0; j = knoten[j].eltern) if (istEinheit[j]) return j;
    return -1;
  };
  // Alle Seitenangaben einer Einheit: die eigenen und die der Unterobjekte (Feldwerte), rekursiv; Listenelemente nicht.
  const angabenRek = (i) => [
    ...knoten[i].eigen.flatMap((z) => seitenAngabenIn(z.text).map((a) => ({ ...a, pfad: z.pfad }))),
    ...knoten[i].feld.flatMap(angabenRek),
  ];

  const einheiten = new Map();
  knoten.forEach((k, i) => {
    if (!istEinheit[i]) return;
    const angaben = angabenRek(i);
    const seitenNummern = [...new Set(angaben.filter((a) => !a.zuGross).flatMap((a) => a.seiten))].sort((a, b) => a - b);
    einheiten.set(i, {
      datei,
      pfad: k.pfad,
      art: k.art,
      ergebnis: '',
      seiten: seitenNummern,
      seitenAngaben: [...new Set(angaben.map((a) => a.text))],
      seite_ausserhalb: seitenNummern.some((n) => n < 1 || n > seitenZahl),
      bereicheZuGross: angaben.filter((a) => a.zuGross).map((a) => a.text),
      zitate: [],
      gemischt: 0,
    });
  });

  let ohneEinheit = 0;
  const bereicheZuGross = [];
  knoten.forEach((k, i) => {
    const e = einheitVon(i);
    for (const z of k.eigen) {
      for (const a of seitenAngabenIn(z.text)) {
        if (a.zuGross) bereicheZuGross.push({ datei, pfad: z.pfad, text: a.text, umfang: a.umfang, einheit: e < 0 ? null : knoten[e].pfad });
      }
      if (e < 0) {
        if (KYRILL_RE.test(z.text)) ohneEinheit += 1;
        continue;
      }
      const { zitate, gemischt } = zitateAusZeichenkette(z.text);
      if (gemischt) einheiten.get(e).gemischt += 1;
      // Zitat aus einem Unterobjekt oder Listenelement ohne eigene Seite (4d): es wird gegen die Seiten der Einheit geprüft.
      const absorbiert = i !== e && !istEinheit[i] && !hatSeite(i);
      for (const zi of zitate) einheiten.get(e).zitate.push({ zitat: zi.text, pfad: z.pfad, anfuehrung: zi.anfuehrung, absorbiert });
    }
  });

  // Tiefere Einheiten mit Zitat (4b, Welle 4 Fassung 3): jede Einheit, über der eine Einheit mit eigenem Zitat liegt.
  const tieferZitat = new Set();
  for (const [i, e] of einheiten) {
    if (!e.zitate.length) continue;
    for (let j = knoten[i].eltern; j >= 0; j = knoten[j].eltern) if (istEinheit[j]) tieferZitat.add(j);
  }
  for (const [i, e] of einheiten) {
    const pruefbar = e.seiten.filter((n) => n >= 1 && n <= seitenZahl);
    e.zitate = e.zitate.map((z) => {
      if (!e.seiten.length) return { ...z, ergebnis: 'nicht geprüft' };
      const { ergebnis } = pruefeZitat(z.zitat, seiten, pruefbar);
      return ergebnis === 'wörtlich' ? { ...z, ergebnis } : { ...z, ergebnis, gefunden_auf: fundstellen(z.zitat, seiten) };
    });
    // Hat die Einheit nur Bereiche über 20 Seiten, ist sie „Bereich zu groß“ (nichts davon ist prüfbar).
    e.ergebnis = !e.seiten.length && e.bereicheZuGross.length ? 'Bereich zu groß' : gesamtStatus(e.zitate.map((z) => z.ergebnis), e.seite_ausserhalb, tieferZitat.has(i));
  }
  const liste = [...einheiten.values()];
  const nichtGefundeneAnfuehrungsteile = liste.flatMap((e) => e.zitate
    .filter((z) => z.anfuehrung && z.ergebnis === 'nicht gefunden')
    .map((z) => ({ datei, pfad: z.pfad, wortlaut: wortlaut(z.zitat), seiten: e.seiten, einheit: e.pfad, ergebnis: e.ergebnis })));
  // Sammelseite mit nicht gefundenen Zitaten (4d, Welle 4 Fassung 3): Zitate aus Unterobjekten ohne eigene Seite, die auf der
  // Seite der Einheit nicht gefunden werden. Das Gesamturteil der Einheit bleibt, wie es ist; die Liste ist ein Zusatz.
  const sammelseiten = liste
    .map((e) => ({
      datei,
      einheit: e.pfad,
      seiten: e.seiten,
      ergebnis: e.ergebnis,
      zitate: e.zitate.filter((z) => z.absorbiert && z.ergebnis === 'nicht gefunden').map((z) => ({ pfad: z.pfad, zitat: wortlaut(z.zitat) })),
    }))
    .filter((s) => s.zitate.length > 0);
  return {
    einheiten: liste,
    ohneEinheit,
    gemischt: liste.reduce((n, e) => n + e.gemischt, 0),
    nichtGefundeneAnfuehrungsteile,
    sammelseiten,
    bereicheZuGross,
  };
}
