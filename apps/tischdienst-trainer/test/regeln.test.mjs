import { test } from 'node:test';
import assert from 'node:assert/strict';
import { access, readdir, readFile } from 'node:fs/promises';
import daten from '../daten/tischdienst.json' with { type: 'json' };
import { platzsetText, PFLICHTMARKIERUNG } from '../logik.mjs';

// Projektregeln, für diese App geprüft: docs/02 Z. 22–24 (keine Anfragen nach außen),
// docs/02 Z. 79–82 (Druck ohne Zeichen), docs/02 Z. 141–146 (keine Bewertung von Kindern),
// docs/02 Z. 50 (Mobile First, Knöpfe 48 px); die Speicher-, Eingabe- und Zufallsregel
// sind Projektregeln. Übernommen aus apps/puppentheater-werkstatt/test/regeln.test.mjs.
//
// Angepasst an diese App, mit Begründung:
//  - Bildschirm-Emojis sind erlaubt (die Druckregel gilt nur für den gedruckten Text).
//    Geprüft werden darum der Druck (platzsetText) und druck.css, nicht app.mjs.
//  - Die Druckdaten kommen aus platzsetText (logik.mjs), nicht aus einer Karten-Funktion.
//  - Verneinte Wörter („keine Punkte und keine Sterne“) sind keine Bewertung und werden vor
//    der Wortprüfung herausgenommen. Die Oberfläche sagt das im Gate ausdrücklich.
//  - Fokus: data-kennung auf jedem Knopf, zeige() stellt den Fokus wieder her.
//  - uk und ru stehen im Datensatz (dreisprachig); geprüft wird, dass kein Vorlese-Versprechen
//    für sie gemacht wird.
// Die Testdateien selbst dürfen die verbotenen Wörter nennen, um sie zu verbieten.

const APP = new URL('../', import.meta.url);
const CODE_DATEIEN = ['index.html', 'app.mjs', 'logik.mjs', 'druck.css', 'daten/tischdienst.json'];
const ALLE_DATEIEN = [...CODE_DATEIEN, 'package.json', 'README.md', 'GDD.md'];
const PFLICHT = 'Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.';

const lese = (datei) => readFile(new URL(datei, APP), 'utf8');
const code = Object.fromEntries(await Promise.all(CODE_DATEIEN.map(async (d) => [d, await lese(d)])));
const alle = Object.fromEntries(await Promise.all(ALLE_DATEIEN.map(async (d) => [d, await lese(d)])));
const app = code['app.mjs'];
const logik = code['logik.mjs'];
const druck = code['druck.css'];

// Nur die Werte zählen, nicht die JSON-Schlüssel („name“ ist kein Druckwort).
const textVon = (o) => (typeof o === 'string' ? o
  : Array.isArray(o) ? o.map(textVon).join(' ')
  : o && typeof o === 'object' ? Object.values(o).map(textVon).join(' ')
  : '');

// Der gedruckte Text jeder Variante – genau das, was die Schablone auf Papier bringt.
const blaetter = daten.varianten.map((v) => ({ id: v.id, variante: v, text: textVon(platzsetText(daten, v)) }));

const VERNEINT = /\b(keine|kein|keinen|keiner|ohne)\s+(Punkte?|Sterne?|Stern|Punkt|Rang\w*)(-\w*)?\b/gi;

test('keine Eingabefelder für Kinder: kein input, textarea, select, form, contenteditable', () => {
  const muster = /<\s*(input|textarea|select|form)\b|contenteditable|(el|createElement)\(\s*['"](input|textarea|select|form)['"]/i;
  for (const d of ['index.html', 'app.mjs']) {
    assert.ok(!muster.test(code[d]), `${d}: Eingabeelement gefunden`);
  }
});

test('keine Speicherung: kein localStorage, sessionStorage, IndexedDB, Cookie oder Cache', () => {
  const muster = /localStorage|sessionStorage|indexedDB|document\.cookie|\bcaches\b|navigator\.storage/;
  for (const d of CODE_DATEIEN) {
    assert.ok(!muster.test(code[d]), `${d}: Speicher-Zugriff gefunden`);
  }
});

test('keine externen Adressen, keine Netzaufrufe in den Dateien der App, kein @import', () => {
  const netz = /\bfetch\s*\(|XMLHttpRequest|WebSocket|sendBeacon|EventSource|importScripts|new Worker|window\[|globalThis|wss?:/;
  for (const d of CODE_DATEIEN) {
    assert.ok(!/https?:\/\/|(?<![:\w])\/\/[\w-]+\.[a-z]{2,}/i.test(code[d]), `${d}: externe Adresse`);
  }
  for (const d of ['app.mjs', 'logik.mjs']) {
    assert.ok(!netz.test(code[d]), `${d}: Netzaufruf gefunden`);
  }
  assert.ok(!/@import/.test(druck), 'druck.css: @import');
});

test('Zufall nur über den Parameter: logik.mjs hat keine Imports, keine Zufallsquelle und keine Uhr', () => {
  assert.ok(!/^import\s/m.test(logik), 'logik.mjs importiert etwas – Zufall würde von dort kommen');
  for (const d of ['logik.mjs', 'daten/tischdienst.json', 'index.html', 'druck.css']) {
    assert.ok(!/Math\.random|crypto|Date\.now|new Date|performance\./.test(code[d]), `${d}: Zufall oder Uhr`);
  }
  // app.mjs ist die einzige Stelle, die mischt, und reicht `mischen` hinein.
  assert.match(app, /import \{ el, vorlesen, mischen \} from '\.\.\/\.\.\/packages\/kinder-ui\/js\/komponenten\.mjs';/);
  assert.match(app, /waehleLage\(daten, mischen\)/);
  assert.match(app, /angeboteneSchritte\(variante, \[\], mischen\)/);
});

test('die Daten kommen per JSON-Import mit Typangabe, die Oberfläche lädt nichts nach', () => {
  assert.match(app, /^import daten from '\.\/daten\/tischdienst\.json' with \{ type: 'json' \};$/m);
  assert.ok(!/\bfetch\s*\(/.test(app), 'app.mjs: fetch statt Import');
});

test('Grundgerüst: deutsch, Viewport, CSP exakt, nur eigene Stylesheets und ein Modul-Skript', () => {
  const html = code['index.html'];
  assert.match(html, /<html lang="de">/);
  assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1"/);
  assert.match(html, /<meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline'"/);
  assert.match(html, /<noscript>/);
  assert.match(html, /<title>Tischdienst-Trainer 🍽️<\/title>/);
  const links = [...html.matchAll(/<link rel="stylesheet"[^>]*href="([^"]+)"/g)].map((m) => m[1]);
  // Jeder andere Link ist genau das gemeinsame Favicon (gleicher Ursprung, Entscheidung Max 21а): nichts Fremdes.
  const andereLinks = [...html.matchAll(/<link(?![^>]*rel="stylesheet")[^>]*>/g)].map((m) => m[0]);
  assert.ok(andereLinks.every((l) => /^<link rel="icon" type="image\/svg\+xml" href="(?:\.\.\/\.\.\/)?packages\/kinder-ui\/img\/favicon\.svg" \/>$/.test(l)), `index.html: fremder Link ${andereLinks.join(' ')}`);
  assert.deepEqual(links, ['../../packages/kinder-ui/css/kinder.css', 'druck.css']);
  const skripte = [...html.matchAll(/<script[^>]*src="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(skripte, ['app.mjs']);
  assert.match(html, /<script type="module" src="app\.mjs"><\/script>/);
});

test('aria-live="polite" auf dem Hauptbereich #app', () => {
  const tag = code['index.html'].match(/<main[^>]*id="app"[^>]*>/)?.[0];
  assert.ok(tag, '<main id="app"> fehlt');
  assert.match(tag, /aria-live="polite"/);
});

test('Netzwerk-Wächter: aus packages/kinderschutz importiert und aufgerufen', async () => {
  assert.match(app, /import \{ installiereNetzwerkWaechter \} from '\.\.\/\.\.\/packages\/kinderschutz\/src\/index\.mjs';/);
  assert.match(app, /^installiereNetzwerkWaechter\(\);$/m);
  await access(new URL('../../../packages/kinderschutz/src/index.mjs', import.meta.url));
});

test('keine Druckzeichen: im gedruckten Text, in druck.css und in logik.mjs keine Häkchen, Kästchen, Sterne, Punkte-Zeichen, Pfeile, Emojis', () => {
  // Zeichenblöcke statt Aufzählung: Pfeile, Math-Zeichen, Dingbats, geometrische Formen, Emojis.
  const zeichen = /[☐☒☑✓✔✗✘✅❌★☆•●○◦·∙‧▪▫◾◽■□]|[←-⋿⌀-➿⦀-⧿⬀-⯿■-◿・]|\p{Extended_Pictographic}/u;
  for (const b of blaetter) {
    assert.ok(!zeichen.test(b.text), `${b.id}: Druckzeichen im Drucktext`);
  }
  for (const d of ['druck.css', 'logik.mjs']) {
    assert.ok(!zeichen.test(code[d]), `${d}: Druckzeichen gefunden`);
  }
});

test('Druckblatt ohne Namenszeile und ohne Tages- oder Wochentagsfeld', () => {
  // „Name“ auch in Zusammensetzungen (Vorname, Nachname, Namensfeld); „Namen“ im Fließtext bleibt erlaubt.
  const namenUndTage = /Name(?!n\b)|Datum|Wochentag|\b(Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag|Sonntag)\b|\bTage?\b|_{3,}|…{2,}/i;
  for (const b of blaetter) {
    assert.ok(!namenUndTage.test(b.text), `${b.id}: Namenszeile oder Tagesfeld im Druck`);
  }
  assert.ok(!/Name\s*:|_{3,}/.test(app + druck), 'app.mjs oder druck.css: Namenszeile');
});

test('Druck über alle Einträge: jeder Schritt jeder Variante steht auf dem gedruckten Platzset', () => {
  for (const { variante, text } of blaetter) {
    for (const s of variante.schritte) {
      assert.ok(text.includes(s.name), `${variante.id}: „${s.name}“ fehlt auf dem Druck`);
    }
    assert.ok(text.includes(daten.blickrichtung), `${variante.id}: Raumlage fehlt auf dem Druck`);
  }
});

test('Pflichtmarkierung: auf jedem Druckblatt, in README und GDD unter „## Offen“; nie „von Hand geprüft“', () => {
  assert.equal(daten.pflichtmarkierung, PFLICHT);
  assert.equal(PFLICHTMARKIERUNG, PFLICHT);
  for (const b of blaetter) {
    assert.ok(b.text.includes(PFLICHT), `${b.id}: Pflichtmarkierung fehlt im Druck`);
  }
  assert.ok(alle['README.md'].includes(PFLICHT), 'README.md: Pflichtmarkierung fehlt');
  const gdd = alle['GDD.md'];
  assert.ok(gdd.includes('## Offen'), 'GDD.md: Abschnitt „## Offen“ fehlt');
  assert.ok(gdd.slice(gdd.indexOf('## Offen')).includes(PFLICHT), 'GDD.md: Pflichtmarkierung nicht unter „## Offen“');
  for (const [d, inhalt] of Object.entries(alle)) {
    assert.ok(!/von Hand geprüft/i.test(inhalt), `${d}: „von Hand geprüft“ ist nicht belegt`);
  }
});

test('Eigenentwurf und Seitenangabe: Schablone und Druck nennen Eigenentwurf und S. 187', () => {
  assert.match(daten.platzset.kopf, /Eigenentwurf/, 'Kopf ohne Eigenentwurf-Kennzeichnung');
  assert.match(daten.platzset.kopf, /S\. 187/, 'Kopf ohne Seitenangabe');
  for (const b of blaetter) {
    assert.match(b.text, /Eigenentwurf/, `${b.id}: ohne Kennzeichnung`);
    assert.match(b.text, /S\. 187/, `${b.id}: ohne Seitenangabe`);
  }
});

test('druck.css: A4 hoch, Bildschirmelemente nur im Bildschirm, das Blatt wird nicht zerrissen; Fuß-Link 48 px hoch', () => {
  assert.match(druck, /@media print \{/);
  assert.match(druck, /@page\s*\{\s*size: A4 portrait;/);
  assert.match(druck, /\.tdt-nur-bildschirm\s*\{\s*display: none !important;\s*\}/);
  assert.match(druck, /break-inside: avoid;/);
  // Fuß-Link: mindestens 48 px hoch (docs/02, Touch-Ziele); 44 px reichen nicht.
  assert.match(druck, /\.k-fuss a\s*\{[^}]*min-height:\s*48px;/);
  assert.doesNotMatch(druck, /\.k-fuss a\s*\{[^}]*min-height:\s*44px;/);
  assert.match(app, /el\('a', \{ href: '\.\.\/\.\.\/impressum\.html' \}, 'Impressum & Datenschutz'\)/);
});

test('Knöpfe mindestens 48 px hoch: die gemeinsame Klasse .k-knopf hat min-height 3rem (docs/02, touch ≥ 48 px)', async () => {
  const kinderCss = await readFile(new URL('../../../packages/kinder-ui/css/kinder.css', import.meta.url), 'utf8');
  assert.match(kinderCss, /\.k-knopf\s*\{[^}]*min-height:\s*3rem;/);
});

test('Druckbereich: das Platzset ist der einzige Druckteil, Bildschirmhinweise sind als solche markiert', () => {
  assert.match(app, /class: 'k-karte tdt-platzset'/);
  assert.match(app, /class: 'tdt-nur-bildschirm'/);
  assert.match(app, /onclick: \(\) => window\.print\(\)/);
});

test('Fokus nach Klick: jeder Knopf trägt eine data-kennung, die Kennungen sind eindeutig; zeige() stellt den Fokus wieder her', () => {
  const knoepfe = [...(app.match(/el\('button'/g) ?? []), ...(app.match(/createElement\('button'\)/g) ?? [])];
  const kennungen = app.match(/'data-kennung': /g) ?? [];
  assert.equal(kennungen.length, knoepfe.length, `${knoepfe.length} Knöpfe, aber ${kennungen.length} data-kennung`);
  const feste = [...app.matchAll(/'data-kennung': '([^']+)'/g)].map((m) => m[1]);
  assert.equal(new Set(feste).size, feste.length, 'doppelte data-kennung');
  assert.match(app, /document\.activeElement\?\.dataset\?\.kennung/, 'zeige() merkt sich die Kennung nicht');
  assert.match(app, /button\[data-kennung="\$\{merke\}"\]/, 'zeige() stellt den Fokus nicht auf dieselbe Kennung');
  const merke = app.indexOf('const merke = document.activeElement');
  const neu = app.indexOf('app.replaceChildren(');
  const zurueck = app.indexOf('const gleicher = merke');
  assert.ok(merke > -1 && neu > merke && zurueck > neu, 'Fokus muss vor replaceChildren gemerkt und danach gesetzt werden');
});

test('kein Vorlese-Versprechen für uk und ru: die Vorlesefunktion bekommt nie eine Sprache außer Deutsch', () => {
  assert.doesNotMatch(app, /vorlesen\([^)]*'(uk|ru)[-_A-Z]*'/i);
  assert.doesNotMatch(app, /'(uk|ru)-[A-Z]{2}'/);
  for (const w of daten.woerter) {
    assert.ok(w.uk && w.ru, `Wort ${w.de}: uk oder ru fehlt – dreisprachig ist es nur vollständig`);
  }
});

// Modellnamen sind Entscheidung A1 (docs/offene-punkte-kita.md), hier bewusst nicht geprüft.
test('keine KI-Begriffe in den Dateien der App', () => {
  const muster = /\bKI\b|LLM|Sprachmodell|Chatbot|künstliche Intelligenz/i;
  for (const [d, inhalt] of Object.entries(alle)) {
    assert.ok(!muster.test(inhalt), `${d}: ${inhalt.match(muster)?.[0]}`);
  }
});

test('keine Bewertung von Kindern im Code und in den Daten: keine Punkte, Stufe, Rang, Einstufung, Note (docs/02 Z. 141–146)', () => {
  // Verneinte Wörter („keine Punkte“) sind keine Bewertung. Alles andere zählt.
  const muster = /unsicher|Selbstwert|Risiko|Diagnose|\bPunkte?\b|Rangliste|\bRang\b|Rangplatz|Einstufung|\bStufe\b|Prozent|\bSterne?\b|\bErgebnis\b|\bNoten?\b/i;
  for (const d of CODE_DATEIEN) {
    const ohneVerneinung = code[d].replace(VERNEINT, '');
    assert.ok(!muster.test(ohneVerneinung), `${d}: ${ohneVerneinung.match(muster)?.[0]}`);
  }
});

test('Testzahl: README und GDD nennen die Zahl der Tests, die in test/ tatsächlich stehen', async () => {
  const dateien = (await readdir(new URL('test/', APP))).filter((d) => d.endsWith('.test.mjs'));
  let echt = 0;
  for (const d of dateien) {
    const quelle = await readFile(new URL(`test/${d}`, APP), 'utf8');
    echt += (quelle.match(/^test\(/gm) ?? []).length;
  }
  assert.ok(echt >= 15, `nur ${echt} Tests gefunden`);
  for (const doc of ['README.md', 'GDD.md']) {
    const nennungen = [...alle[doc].matchAll(/(?<![\d,.])(\d+)\s+Tests?(?![\wäöüß])/g)].map((m) => Number(m[1]));
    assert.ok(nennungen.length >= 1, `${doc} nennt keine Testzahl`);
    for (const n of nennungen) {
      assert.equal(n, echt, `${doc} nennt ${n} Tests, es sind ${echt}`);
    }
  }
});

test('package.json: privat, ES-Modul, Testskript vorhanden', () => {
  const pkg = JSON.parse(alle['package.json']);
  assert.equal(pkg.private, true);
  assert.equal(pkg.type, 'module');
  assert.match(pkg.scripts?.test ?? '', /node --test/);
});
