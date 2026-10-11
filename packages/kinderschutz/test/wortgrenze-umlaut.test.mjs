import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

// `\b` ist in JavaScript ueber [A-Za-z0-9_] definiert. Umlaute und ß gehoeren
// NICHT dazu. Daraus folgen zwei tote Muster, die beide aussehen, als taeten
// sie etwas:
//
//   /\büber/    trifft am Wortanfang nie - zwischen einem Leerzeichen und „ü"
//               liegt keine Wortgrenze, weil beide Nicht-Wortzeichen sind.
//   /weiß\b/    trifft am Wortende nie - aus demselben Grund hinter „ß".
//
// Das ist keine Theorie. Beim Bau von Nr. 61 hat eine Gegenprobe gefunden,
// dass das Netz gegen das Deuten den Satz „Die Farbwahl verrät viel über das
// Kind" durchliess: im zweiten Teil stand `\büber`. Dieselbe Stelle gab es in
// Nr. 60, dort unentdeckt. Ein totes Muster in einem Schutznetz ist schlimmer
// als gar keins, weil es Sicherheit vortaeuscht.
//
// Fuer das Wortende gibt es den Ersatz `(?![\wäöüß])`, fuer den Wortanfang
// laesst man `\b` einfach weg.
//
// Die Pruefung laeuft ueber den Code OHNE Kommentare: der Kommentar, der die
// Falle erklaert, muss sie schreiben duerfen - Falle A, zwanzigstes Mal, und
// diesmal in der Pruefung selbst.
const UMLAUT = 'äöüßÄÖÜ';
// Gesucht wird die ZEICHENFOLGE Backslash-b im Quelltext. In der Vorlage wird
// aus `\\\\` ein doppelter Backslash, im Muster also ein einzelner, echter.
const NACH = new RegExp(`[${UMLAUT}]\\\\b`);
const VOR = new RegExp(`\\\\b[${UMLAUT}]`);

/**
 * WELLE 83: die Zeichenfolgen-Suche sieht nur den unmittelbaren Nachbarn. Steht
 * die Wortgrenze an einer ALTERNATIVENGRUPPE - `\b(?:über|unter)` oder
 * `(?:weiß|rot)\b` -, dann ist nur EINE Alternative tot, und die Suche findet
 * nichts. Genau in dieser Form schreiben die Netze dieses Projekts die meisten
 * ihrer Wortgrenzen; das Review hat 45 solche Stellen gezaehlt.
 *
 * `randzeichen` loest die Gruppe auf: hinter einer Wortgrenze sammelt sie das
 * ERSTE Zeichen jeder Alternative, davor das LETZTE - und meldet jedes, das
 * kein ASCII-Wortzeichen ist. Geprueft wird damit, was die Wortgrenze
 * tatsaechlich beruehrt, nicht wie sie geschrieben ist.
 */
const ASCII_WORTZEICHEN = /[A-Za-z0-9_]/;
const BUCHSTABE = /\p{L}/u;

/** Die Klammer zu `text[von]` (eine „(") finden, Escapes und Klassen achtend. */
function klammerZu(text, von) {
  let tiefe = 0;
  let inKlasse = false;
  for (let i = von; i < text.length; i += 1) {
    const c = text[i];
    if (c === '\\') { i += 1; continue; }
    if (inKlasse) { if (c === ']') inKlasse = false; continue; }
    if (c === '[') { inKlasse = true; continue; }
    if (c === '(') tiefe += 1;
    else if (c === ')') { tiefe -= 1; if (tiefe === 0) return i; }
  }
  return -1;
}

/** Die Klammer auf zu `text[bis]` (eine „)") finden. */
function klammerAuf(text, bis) {
  let tiefe = 0;
  for (let i = bis; i >= 0; i -= 1) {
    const c = text[i];
    if (i > 0 && text[i - 1] === '\\') continue;
    if (c === ')') tiefe += 1;
    else if (c === '(') { tiefe -= 1; if (tiefe === 0) return i; }
  }
  return -1;
}

/** Die Alternativen einer Gruppe, oberste Ebene. */
function alternativen(inhalt) {
  const teile = [];
  let tiefe = 0;
  let inKlasse = false;
  let akt = '';
  for (let i = 0; i < inhalt.length; i += 1) {
    const c = inhalt[i];
    if (c === '\\') { akt += c + (inhalt[i + 1] ?? ''); i += 1; continue; }
    if (inKlasse) { akt += c; if (c === ']') inKlasse = false; continue; }
    if (c === '[') { akt += c; inKlasse = true; continue; }
    if (c === '(') tiefe += 1;
    if (c === ')') tiefe -= 1;
    if (c === '|' && tiefe === 0) { teile.push(akt); akt = ''; continue; }
    akt += c;
  }
  teile.push(akt);
  return teile;
}

const gruppenKopf = /^\(\?(?::|<?[=!]|<[A-Za-z_$][\w$]*>)?/;

/** Das erste bzw. letzte LITERALE Zeichen eines Teilmusters. */
function literalRand(teil, welche) {
  let t = teil;
  if (welche === 'erst') {
    t = t.replace(gruppenKopf, '');
    for (let i = 0; i < t.length; i += 1) {
      const c = t[i];
      if (c === '\\') return t[i + 1] ?? '';
      if ('([^$'.includes(c)) return '';
      return c;
    }
    return '';
  }
  // letztes Zeichen: Quantoren und Gruppenenden abstreifen
  t = t.replace(/[*+?]$|\{\d+(?:,\d*)?\}$/, '');
  const c = t.at(-1) ?? '';
  if (')]'.includes(c)) return '';
  if (t.length >= 2 && t.at(-2) === '\\') return '';
  return c;
}

export function randzeichen(code) {
  const befunde = [];
  for (let i = 0; i < code.length - 1; i += 1) {
    if (!(code[i] === '\\' && code[i + 1] === 'b')) continue;
    if (i > 0 && code[i - 1] === '\\') continue; // \\b ist ein Backslash plus b
    // --- was folgt der Wortgrenze?
    const nachIdx = i + 2;
    let folgende = [];
    if (code[nachIdx] === '(') {
      const zu = klammerZu(code, nachIdx);
      if (zu > 0) folgende = alternativen(code.slice(nachIdx, zu + 1).slice(1, -1).replace(/^\?(?::|<?[=!])/, ''))
        .map((t) => literalRand(t, 'erst'));
    } else folgende = [code[nachIdx] ?? ''];
    // --- was steht davor?
    let vorige = [];
    if (code[i - 1] === ')') {
      const auf = klammerAuf(code, i - 1);
      if (auf >= 0) vorige = alternativen(code.slice(auf + 1, i - 1).replace(/^\?(?::|<?[=!])/, ''))
        .map((t) => literalRand(t, 'letzt'));
    } else vorige = [code[i - 1] ?? ''];
    const tot = (c) => c && BUCHSTABE.test(c) && !ASCII_WORTZEICHEN.test(c);
    for (const c of folgende) if (tot(c)) befunde.push(`\\b vor „${c}" – trifft am Wortanfang nie`);
    for (const c of vorige) if (tot(c)) befunde.push(`„${c}" vor \\b – trifft am Wortende nie`);
  }
  return befunde;
}

/**
 * Kommentare unkenntlich machen, OHNE Zeilen zu verschieben: jedes Zeichen
 * eines Kommentars wird zu einem Leerzeichen, Zeilenumbrueche bleiben stehen.
 * Sonst zeigt die gemeldete Zeilennummer auf eine andere Zeile als die, in der
 * der Fund steckt - beim Bau genau einmal passiert.
 */
export function nurCode(quelle) {
  const leeren = (treffer) => treffer.replace(/[^\n]/g, ' ');
  return quelle
    .replace(/\/\*[\s\S]*?\*\//g, leeren)
    .replace(/(^|[^:])\/\/[^\n]*/g, (t, vor) => vor + leeren(t.slice(vor.length)));
}

const wurzel = new URL('../../../', import.meta.url);
const befunde = [];
let geprueft = 0;

for (const ordner of ['apps', 'packages']) {
  const basis = new URL(`${ordner}/`, wurzel);
  for (const eintrag of await readdir(basis, { withFileTypes: true })) {
    if (!eintrag.isDirectory()) continue;
    const appDir = new URL(`${eintrag.name}/`, basis);
    for (const datei of await readdir(appDir, { recursive: true })) {
      if (!datei.endsWith('.mjs') || datei.includes('node_modules')) continue;
      geprueft += 1;
      const roh = await readFile(new URL(datei, appDir), 'utf8');
      const zeilenRoh = roh.split('\n');
      nurCode(roh).split('\n').forEach((zeile, n) => {
        const wo = `${ordner}/${eintrag.name}/${datei}:${n + 1}`;
        // Eine Zeile, die die Falle ABSICHTLICH vorführt - eine Gegenprobe in
        // einem Test -, trägt die Marke. Ohne Ausnahme müsste man die Falle
        // ungeprüft behaupten.
        if (/wortgrenze-ok/.test(zeilenRoh[n] ?? '')) return;
        if (NACH.test(zeile)) befunde.push(`${wo}: Umlaut oder ß direkt vor \\b – trifft am Wortende nie`);
        if (VOR.test(zeile)) befunde.push(`${wo}: \\b direkt vor einem Umlaut – trifft am Wortanfang nie`);
        // Und durch die Gruppe hindurch (Welle 83).
        for (const f of randzeichen(zeile)) befunde.push(`${wo}: ${f}`);
      });
    }
  }
}

test('kein \\b neben einem Umlaut – das wäre ein totes Muster', () => {
  assert.deepEqual(befunde, [], befunde.join('\n'));
  assert.ok(geprueft > 100, `nur ${geprueft} Dateien gelesen – greift die Suche noch?`);
});

test('die Prüfung sieht auch durch eine Alternativengruppe', () => {
  // Nur EINE Alternative ist tot - die Zeichenfolgen-Suche findet das nicht.
  const durchGruppe = String.raw`const N = /\b(?:über|unter)/;`; // wortgrenze-ok
  assert.equal(VOR.test(durchGruppe), false, 'die alte Suche findet es nicht – darum gibt es die neue');
  assert.ok(randzeichen(durchGruppe).some((f) => /Wortanfang/.test(f)), durchGruppe);
  const hinten = String.raw`const N = /(?:weiß|rot)\b/;`; // wortgrenze-ok
  assert.ok(randzeichen(hinten).some((f) => /Wortende/.test(f)), hinten);
  // Und was in Ordnung ist, bleibt in Ordnung.
  for (const gut of [
    String.raw`/\b(?:Kind|Eltern)\b/`,
    String.raw`/schul(?:fähig|reif|bereit)(?![\wäöüß])/`,
    String.raw`/\b(?:sollte|müsste|muss)\s+/`,
    String.raw`/\bverrät\b/`,
    String.raw`/\b\d+\s*Jahre\b/`,
    String.raw`/\b(?:in|aus)\s+(?:Halle|Münster)\b/`,
  ]) assert.deepEqual(randzeichen(gut), [], gut);
});

test('die Prüfung findet die Falle wirklich', () => {
  // Ohne diese Gegenprobe wäre die Regel grün, weil sie nichts sucht.
  const schlecht = String.raw`export const N = /weiß\b|\büber/;`; // wortgrenze-ok
  assert.ok(NACH.test(nurCode(schlecht)), 'der Fall „Umlaut vor \\b" wird nicht erkannt');
  assert.ok(VOR.test(nurCode(schlecht)), 'der Fall „\\b vor Umlaut" wird nicht erkannt');
  // Ein erklärender Kommentar darf die Falle nennen, ohne anzuschlagen.
  assert.ok(!NACH.test(nurCode(String.raw`// so nicht: /weiß\b/ trifft nie`))); // wortgrenze-ok
  assert.ok(!VOR.test(nurCode(String.raw`  /* auch nicht /\büber/ */`))); // wortgrenze-ok
  // Die Zeilennummer darf sich durch das Leeren nicht verschieben.
  assert.equal(nurCode('a\n/* x\ny */\nb').split('\n').length, 4);
});

test('das Verhalten selbst, damit die Begründung nachprüfbar bleibt', () => {
  // Wortanfang mit Umlaut: tot.
  assert.equal(/\büber/.test('viel über das Kind'), false); // wortgrenze-ok
  assert.equal(/über/.test('viel über das Kind'), true);
  // Wortende mit ß: tot.
  assert.equal(/weiß\b/.test('weiß nicht'), false); // wortgrenze-ok
  assert.equal(/weiß(?![\wäöüß])/.test('weiß nicht'), true);
  // Und die Gegenrichtung, damit niemand zu viel in die Regel hineinliest:
  // ein Wort mit Umlaut in der MITTE ist unproblematisch.
  assert.equal(/\bverrät\b/.test('verrät viel'), true);
});
