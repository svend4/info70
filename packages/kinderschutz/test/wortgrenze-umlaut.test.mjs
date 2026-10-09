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
      });
    }
  }
}

test('kein \\b neben einem Umlaut – das wäre ein totes Muster', () => {
  assert.deepEqual(befunde, [], befunde.join('\n'));
  assert.ok(geprueft > 100, `nur ${geprueft} Dateien gelesen – greift die Suche noch?`);
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
