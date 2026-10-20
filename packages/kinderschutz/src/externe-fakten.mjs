// Externe Fakten: Normen, Studien, Rechtsverweise, Förder- und Gesundheitsangaben. Eine Zeile mit einer
// positiven Behauptung dieser Art braucht eine Fundstelle: „S. n“, „Praleska“, ein Feld quelle, bezug,
// gremium oder herkunft im selben Objekt (JSON oder JS-Literal) oder den Vermerk „Eigenentwurf, fachlich
// nicht geprüft“. Zeilen, die etwas verneinen („keine Studie“), sind keine Behauptung; Gesundheitszeilen
// sind davon ausgenommen, eine Verneinung wie „nicht für Babys“ bleibt dort eine Aussage.
// Nicht gezählt werden: Kommentare, Regex-Konstanten, inline CSS, druck.css, die Variable n im Code und
// englische Wörter wie „Who“. Blockierend sind alle Nutzerdateien (HTML, MJS, JS, Webmanifest, daten/*.json);
// README.md, GDD.md und package.json werden getrennt ausgewiesen und blockieren nicht.
import { readFile, readdir, access } from 'node:fs/promises';

export const KATEGORIEN = ['recht', 'finanzierung', 'gesundheit', 'sonstiges'];

// Gesundheit und Sicherheit: eigene Liste. Sie bildet eine Kategorie und wird im Test zusätzlich gezählt.
export const GESUNDHEIT_STICHWOERTER = [
  'Notruf', '(?<![\\d.,=\\-"\'#:/])112(?![\\d.,\\-])', 'Vergiftung', 'Verbrennung', 'Ertrink', 'Seitenlage',
  'Reanimation', 'Allerg', 'Fieber', 'Medikament', 'Dosis', '(?<!sch)Impf', 'R(?:ü|ue)ckenlage', 'Honig',
  'Erstick', 'Kleinteil', 'Knopfzelle', 'Magnet', 'Fenstersturz', 'Sonnenschutz', 'Zecke', 'Erste[- ]Hilfe',
];
const GESUNDHEIT = new RegExp(GESUNDHEIT_STICHWOERTER.join('|'), 'i');

// Großschreibung zählt: sonst träfe „en“, „din“ oder „who“ im Fließtext.
const RECHT_KURZ = /\b(?:JMStV|JuSchG|DDG|MStV|DSGVO|DSA|UWG|BFSG|UrhG|KJSG|SGB|BGB|BDSG|TTDSG|KRK)\b/;
const RECHT_WORT = /§\s*\d|Gesetz(?:e|es|en|em)?\b|Verordnung(?:en|s)?\b|Richtlinie[ns]?\b/i;
// „fördern“, „fördert“ und „förderlich“ sind Verben oder Adjektive und zählen nicht als Förderangabe.
const FINANZIERUNG = /F(?:ö|oe)rder(?!n\b|t\b|lich)|gef(?:ö|oe)rdert|Finanzier|Zusch[uü]ss|Darlehen|Eigenanteil|Eigenmittel|Beihilfe/i;
const SONSTIGES_KURZ = /\bEN \d|\bDIN \d|\bISO \d|\bAWMF\b|\bBZgA\b|\bBIÖG\b|\bWHO\b|\bG-BA\b/;
const SONSTIGES_WORT = /randomis|Gegenstimme|Studien?\b|\d\s*(?:Prozent|%)/i;
// „n = 120“ ist eine Stichprobe in Text und Daten, im Code ist n eine Schleifenvariable.
const N_WERT = /\bn\s*=\s*\d/i;

const BELEG = /Eigenentwurf, fachlich nicht geprüft|\bS\.\s?\d|Praleska/;
const VERNEINT = /\b(?:kein|keine|keinen|keiner|ohne|nicht|nie)\b/i;
// Quellenfeld als Schlüssel mit nicht leerem Wert. Im Objekt: Groß-/Kleinschreibung des Schlüssels zählt.
// Auf Zeilenebene zusätzlich „Quelle:“ als Beschriftung im Text.
const QUELLE_OBJEKT = /(?:^|[\s,{[(;])["'`]?(?:quelle|bezug|gremium|herkunft)["'`]?\s*:\s*(?:(["'`])(?:\\.|(?!\1)[^\\])+\1|\[\s*(?!\])|(?!(?:null|undefined|false)\b)[^\s,}\]"'`:])/;
const QUELLE_ZEILE = new RegExp(QUELLE_OBJEKT.source, 'i');
const QUELLE_NAHE = /\b(?:quelle|quellen|bezug|gremium|herkunft|fundstelle|beleg)\b|\bS\.\s?\d|Praleska/i;

// Stil-Zeichenketten: style-Attribute, style-Zuweisungen, svg-Maße. Danach CSS-Deklarationen.
const STIL_WERT = [
  /\bstyle\s*[:=]\s*(?:"[^"\n]*"|'[^'\n]*'|`[^`]*`)/gi,
  /\bstyle\.[a-z]+\s*=\s*[^;\n]*/gi,
  /\b(?:width|height)\s*=\s*(?:"[^"\n]*"|'[^'\n]*')/gi,
];
const CSS_EIGENSCHAFT = '(?:min-|max-)?(?:width|height)|font(?:-[a-z]+)?|(?:padding|margin|border|background|flex|grid|outline|inset)(?:-[a-z]+)*|color|gap|transform|position|text-align|display|line-height|box-sizing|justify-content|align-items|opacity|letter-spacing|z-index|overflow|rotate|translate|(?:top|left|right|bottom)(?=\\s*:\\s*-?[\\d.]+\\s*(?:%|px|rem|em|vh|vw))';
const CSS_DEKL = new RegExp(`(?:^|[\\s;{"'\`(,])(?:${CSS_EIGENSCHAFT})\\s*:[^;"'\`\\n]{0,80}`, 'gi');

const DATEI_ART = { md: 'md', json: 'json', js: 'js', html: 'html' };

// Art einer Datei, null für Dateien, die nicht geprüft werden (CSS, Tests, Sonstiges).
export function dateiArt(datei) {
  const name = datei.split('/').pop();
  if (name.endsWith('.md')) return DATEI_ART.md;
  if (name === 'package.json' || name.endsWith('.json') || name.endsWith('.webmanifest')) return DATEI_ART.json;
  if (name.endsWith('.mjs') || name.endsWith('.js')) return DATEI_ART.js;
  if (name.endsWith('.html')) return DATEI_ART.html;
  return null;
}

// README.md, GDD.md und package.json blockieren nicht.
export function blockierend(datei) {
  const name = datei.split('/').pop();
  return !(name.endsWith('.md') || name === 'package.json');
}

// Gruppe für die Aufteilung nach Dateiart im Stand.
export function dateiGruppe(datei) {
  if (datei.startsWith('daten/')) return 'daten/*.json';
  const name = datei.split('/').pop();
  if (['app.mjs', 'logik.mjs', 'index.html', 'eltern.html', 'README.md', 'GDD.md', 'package.json'].includes(name)) return name;
  return dateiArt(datei) === 'md' ? 'andere Dokumente' : 'weitere Code-Dateien';
}

const kuerzen = (s) => (s.length > 220 ? `${s.slice(0, 219)}…` : s);

const regexStartet = (letzt, out) => letzt === ''
  || '(,=:[!&|?{};+-*%<>~^'.includes(letzt)
  || /(?:^|[^\w$])(?:return|typeof|case|do|else|in|of|new|delete|void|throw|yield|await)\s*$/.test(out.slice(-30));

// JS- und JSON-Text. clean: Kommentare und Regex-Literale sind durch Leerraum bzw. einen Platzhalter ersetzt,
// Strings bleiben. prose: wie clean, aber ohne Code außerhalb von Strings (Bezeichner, Zahlen, Operatoren).
// Zeilenumbrüche bleiben in beiden erhalten, damit die Zeilennummern stimmen.
function saeubernJs(text, json = false) {
  let out = "";
  let prose = "";
  const regex = new Set();
  let zeile = 0;
  let letzt = "";
  const n = text.length;
  let i = 0;
  const nl = () => { out += "\n"; prose += "\n"; zeile += 1; };
  const str = (c) => { out += c; prose += c; };
  const code = (c) => { out += c; prose += " "; };
  const leer = (c) => { out += " "; prose += " "; };
  while (i < n) {
    const c = text[i];
    const d = text[i + 1];
    if (c === "\n") { nl(); i += 1; continue; }
    if (!json && c === "/" && d === "/") {
      while (i < n && text[i] !== "\n") { leer(text[i]); i += 1; }
      continue;
    }
    if (!json && c === "/" && d === "*") {
      leer("/"); leer("*"); i += 2;
      while (i < n && !(text[i] === "*" && text[i + 1] === "/")) {
        if (text[i] === "\n") nl(); else leer(text[i]);
        i += 1;
      }
      if (i < n) { leer("*"); leer("/"); i += 2; }
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      str(c); i += 1;
      while (i < n && text[i] !== c) {
        if (text[i] === "\\") {
          str(text[i]); i += 1;
          if (i < n) { if (text[i] === "\n") nl(); else str(text[i]); i += 1; }
          continue;
        }
        if (text[i] === "\n") { if (c !== "`") break; nl(); i += 1; continue; }
        str(text[i]); i += 1;
      }
      if (i < n && text[i] === c) { str(c); i += 1; }
      letzt = c;
      continue;
    }
    if (!json && c === "/" && regexStartet(letzt, out)) {
      let j = i + 1;
      let klasse = false;
      let gefunden = false;
      while (j < n && text[j] !== "\n") {
        const e = text[j];
        if (e === "\\") {
          if (text[j + 1] === "\n") break;
          j += 2;
          continue;
        }
        if (e === "[") klasse = true;
        else if (e === "]") klasse = false;
        else if (e === "/" && !klasse) { gefunden = true; break; }
        j += 1;
      }
      if (gefunden) {
        j += 1;
        while (j < n && /[a-z]/i.test(text[j])) j += 1;
        out += "/_/";
        prose += "   ";
        regex.add(zeile);
        i = j;
        letzt = ")";
        continue;
      }
    }
    code(c);
    i += 1;
    if (c !== " " && c !== "\t" && c !== "\r") letzt = c;
  }
  return { clean: out, prose, regex, js: new Set() };
}

// HTML: Kommentare, style-Blöcke und style-Attribute werden geleert. Skriptinhalte gehen durch den JS-Lexer.
function saeubernHtml(text) {
  const leer = (m) => m.replace(/[^\n]/g, " ");
  const t = text.replace(/<!--[\s\S]*?-->/g, leer).replace(/<style\b[\s\S]*?<\/style\s*>/gi, leer);
  const regex = new Set();
  const js = new Set();
  const skript = /(<script\b[^>]*>)([\s\S]*?)(<\/script\s*>)/gi;
  const kopf = (ganz, off, auf) => ganz.slice(0, off).split("\n").length - 1 + (auf.split("\n").length - 1);
  const clean = t.replace(skript, (m, auf, body, zu, off, ganz) => {
    const start = kopf(ganz, off, auf);
    const r = saeubernJs(body);
    r.regex.forEach((z) => regex.add(start + z));
    for (let k = 0; k < body.split("\n").length; k += 1) js.add(start + k);
    return auf + r.clean + zu;
  });
  const prose = t.replace(skript, (m, auf, body, zu) => auf + saeubernJs(body).prose + zu);
  const stil = [/\bstyle\s*=\s*"[^"]*"/gi, /\bstyle\s*=\s*'[^']*'/gi];
  const ohneStil = (x) => stil.reduce((acc, r) => acc.replace(r, leer), x);
  return { clean: ohneStil(clean), prose: ohneStil(prose), regex, js };
}

// Markdown: wie HTML, zusätzlich Code-Blöcke in ``` ausgenommen.
function saeubernMd(text) {
  const r = saeubernHtml(text);
  const ohneZaun = (x) => {
    let zaun = false;
    return x.split("\n").map((z) => {
      if (/^\s*```/.test(z)) { zaun = !zaun; return ""; }
      return zaun ? "" : z;
    }).join("\n");
  };
  return { clean: ohneZaun(r.clean), prose: ohneZaun(r.prose), regex: new Set(), js: new Set() };
}

// Objekte in JS- und JSON-Text: je Zeile das innerste Objekt, und ob es ein Quellenfeld direkt trägt.
function objekte(clean) {
  const stapel = [];
  const felder = new Map();
  const tiefe = [];
  const objZeile = [];
  let id = 0;
  let zeile = 0;
  let str = null;
  const neueZeile = () => {
    tiefe[zeile] = stapel.length;
    objZeile[zeile] = stapel.length ? stapel[stapel.length - 1] : null;
  };
  const anhaengen = (s) => {
    if (stapel.length) {
      const k = stapel[stapel.length - 1];
      felder.set(k, felder.get(k) + s);
    }
  };
  neueZeile();
  for (let i = 0; i < clean.length; i += 1) {
    const c = clean[i];
    if (str) {
      if (c === '\n') {
        zeile += 1;
        neueZeile();
        if (str !== '`') str = null;
        anhaengen(c);
        continue;
      }
      if (c === '\\') { anhaengen(c + (clean[i + 1] ?? '')); i += 1; continue; }
      if (c === str) str = null;
      anhaengen(c);
      continue;
    }
    if (c === '\n') { zeile += 1; neueZeile(); anhaengen(c); continue; }
    if (c === '"' || c === "'" || c === '`') { str = c; anhaengen(c); continue; }
    if (c === '{') {
      id += 1;
      stapel.push(id);
      felder.set(id, '');
      if (stapel.length > (tiefe[zeile] ?? 0)) {
        tiefe[zeile] = stapel.length;
        objZeile[zeile] = id;
      }
      continue;
    }
    if (c === '}') { stapel.pop(); continue; }
    anhaengen(c);
  }
  const belegt = new Map([...felder].map(([k, v]) => [k, QUELLE_OBJEKT.test(v)]));
  return { objZeile, belegt };
}

// Stil-Zeichenketten und CSS-Deklarationen werden vor der Prüfung geleert. Kleingeschriebene Kennungen in
// Anführungszeichen (IDs, Dateinamen, Schlüssel wie 'stoff-steine' oder 'foerder-fristen.ics') sind keine Fakten.
const KENNUNG = /(["'`])[a-z0-9_.:/-]+\1/g;
// Base64-Bilddaten und Prozentwerte als CSS-Größe in Anführungszeichen (z. B. '100%') sind keine Fakten.
const DATEN_URI = /data:[a-z/+.-]+;base64,[A-Za-z0-9+/=]+/g;
const CSS_GROESSE = /(["'`])\s*-?\d+(?:[.,]\d+)?\s*%\s*\1/g;
function maskiere(z) {
  let t = z;
  for (const r of STIL_WERT) t = t.replace(r, ' ');
  return t.replace(CSS_DEKL, ' ').replace(DATEN_URI, ' ').replace(CSS_GROESSE, ' ').replace(KENNUNG, ' ');
}

function kategorie(t, js) {
  if (GESUNDHEIT.test(t)) return 'gesundheit';
  if (RECHT_KURZ.test(t) || RECHT_WORT.test(t)) return 'recht';
  if (FINANZIERUNG.test(t)) return 'finanzierung';
  if (SONSTIGES_KURZ.test(t) || SONSTIGES_WORT.test(t) || (!js && N_WERT.test(t))) return 'sonstiges';
  return null;
}

// Prüft den Text einer Datei. Liefert je Fundstelle ohne Beleg einen Eintrag. Mit { alle: true } auch die
// belegten und verneinten Zeilen, mit dem Grund in „grund“ (verneint, beleg-zeile, quelle-objekt).
export function pruefeDatei(datei, text, { alle = false } = {}) {
  const art = dateiArt(datei);
  if (!art) return [];
  const istBlockierend = blockierend(datei);
  const s = art === 'md' ? saeubernMd(text) : art === 'html' ? saeubernHtml(text) : saeubernJs(text, art === 'json');
  const roh = text.split('\n');
  const clean = s.clean.split('\n');
  // Geprüft wird die Prosa (ohne Code) in JS und HTML, sonst der Text selbst.
  const pruefZeilen = art === 'js' || art === 'html' ? s.prose.split('\n') : clean;
  const obj = art === 'js' || art === 'json' ? objekte(s.clean) : null;
  const eintraege = [];
  for (let i = 0; i < clean.length; i += 1) {
    if (!clean[i].trim() || s.regex.has(i)) continue;
    const t = maskiere(pruefZeilen[i]);
    const kat = kategorie(t, art === 'js' || s.js.has(i));
    if (!kat) continue;
    const objBelegt = obj && obj.objZeile[i] != null && obj.belegt.get(obj.objZeile[i]);
    // Verneinung entlastet keine Gesundheitszeile: „nicht für Babys unter einem Jahr“ bleibt eine Aussage.
    const grund = VERNEINT.test(t) && kat !== 'gesundheit' ? 'verneint'
      : BELEG.test(t) || QUELLE_ZEILE.test(t) ? 'beleg-zeile'
        : objBelegt ? 'quelle-objekt' : null;
    if (grund && !alle) continue;
    const nahe = [i - 2, i - 1, i + 1, i + 2]
      .filter((k) => k >= 0 && k < clean.length)
      .some((k) => QUELLE_NAHE.test(clean[k]));
    eintraege.push({
      datei,
      zeile: i + 1,
      text: kuerzen(roh[i].trim()),
      kategorie: kat,
      quelleNahe: nahe,
      blockierend: istBlockierend,
      grund,
    });
  }
  return eintraege;
}

const existiert = async (p) => { try { await access(p); return true; } catch { return false; } };

// Dateien einer App, die geprüft werden: Dateien im Wurzelordner und daten/*.json.
export async function dateienVon(appDir) {
  const liste = [];
  const wurzel = await readdir(appDir, { withFileTypes: true }).catch(() => []);
  for (const e of wurzel) if (e.isFile() && dateiArt(e.name)) liste.push(e.name);
  if (await existiert(`${appDir}/daten`)) {
    for (const f of await readdir(`${appDir}/daten`)) if (f.endsWith('.json')) liste.push(`daten/${f}`);
  }
  return liste.sort();
}

// Alle Fundstellen einer App, auch die nicht blockierenden.
export async function fundstellen(appDir) {
  const out = [];
  for (const d of await dateienVon(appDir)) {
    out.push(...pruefeDatei(d, await readFile(`${appDir}/${d}`, 'utf8')));
  }
  return out;
}

// Blockierende Fundstellen als „datei:zeile“.
export async function externeFakten(appDir) {
  return (await fundstellen(appDir)).filter((e) => e.blockierend).map((e) => `${e.datei}:${e.zeile}`);
}

// Zählt Fundstellen nach Gesamt, blockierend, Kategorie, Gesundheit und Dateiart.
export function zaehle(eintraege) {
  const r = {
    gesamt: eintraege.length,
    blockierend: 0,
    dokumentation: 0,
    gesundheit: 0,
    kategorien: Object.fromEntries(KATEGORIEN.map((k) => [k, 0])),
    dateiart: {},
  };
  for (const e of eintraege) {
    if (e.blockierend) r.blockierend += 1; else r.dokumentation += 1;
    if (e.blockierend && e.kategorie === 'gesundheit') r.gesundheit += 1;
    r.kategorien[e.kategorie] += 1;
    const g = dateiGruppe(e.datei);
    r.dateiart[g] = (r.dateiart[g] ?? 0) + 1;
  }
  return r;
}
