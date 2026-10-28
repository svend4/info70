import { test } from 'node:test';
import assert from 'node:assert/strict';
import { access, readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import rollenDatei from '../daten/rollen.json' with { type: 'json' };
import haushaltDatei from '../daten/haushalt.json' with { type: 'json' };
import hoeflichkeitDatei from '../daten/hoeflichkeit.json' with { type: 'json' };
import budgetDatei from '../daten/budget.json' with { type: 'json' };
import texte from '../daten/texte.json' with { type: 'json' };
import { FRAGEN_PRO_RUNDE, MAX_PRO_DURCHGANG, blattText, druckeKarte, gewaehlteKarten, ladeModule } from '../logik.mjs';
import { appGruende } from '../../../packages/kinderschutz/src/bewertung-stand.mjs';
import { fundstellen, zaehle } from '../../../packages/kinderschutz/src/externe-fakten.mjs';
import { appLeistungsTreffer } from '../../../packages/kinderschutz/src/leistungs-woerter.mjs';
import { appBefund } from '../../../packages/kinderschutz/src/seitenmarke.mjs';
import { speicherBefund } from '../../../packages/kinderschutz/src/speicher-regel.mjs';

// Projektregeln, für diese App geprüft: docs/02 Z. 22–24 (keine Anfragen nach außen),
// docs/02 Z. 79–82 (Druckbögen), docs/02 Z. 141–146 (keine Bewertung von Kindern).
// Die Altersregel (Kinder von 3 bis 5 nur gemeinsam mit Erwachsenen), die Speicherregel, die Zufallsregel
// und die Regeln zu Seitenangaben haben keine docs/02-Zeile; sie sind Projektregeln und Entscheidungen von Max.
// Die Prüfung liest die Dateien der App (ohne test/). Die Testdateien selbst dürfen die verbotenen Wörter nennen.

const APP = new URL('../', import.meta.url);
const APP_PFAD = fileURLToPath(APP).replace(/\/$/, '');
const WURZEL = fileURLToPath(new URL('../../../', import.meta.url));
const SLUG = 'meine-familie-woerter-und-rollen-content-pack';
const DATEN = ['daten/rollen.json', 'daten/haushalt.json', 'daten/hoeflichkeit.json', 'daten/budget.json', 'daten/texte.json'];
const CODE_DATEIEN = ['index.html', 'app.mjs', 'logik.mjs', 'druck.css', ...DATEN];
const ALLE_DATEIEN = [...CODE_DATEIEN, 'package.json', 'README.md', 'GDD.md'];

const lese = (datei) => readFile(new URL(datei, APP), 'utf8');
const code = Object.fromEntries(await Promise.all(CODE_DATEIEN.map(async (d) => [d, await lese(d)])));
const alle = Object.fromEntries(await Promise.all(ALLE_DATEIEN.map(async (d) => [d, await lese(d)])));
const app = code['app.mjs'];

// Alle 17 Blätter, wie sie gedruckt werden.
const alleModule = ladeModule([rollenDatei, haushaltDatei, hoeflichkeitDatei, budgetDatei]);
const blaetter = alleModule.flatMap((m) => m.karten.map((k) => ({ id: k.id, text: blattText(druckeKarte(k, m.titel)) })));

// Zeichenblöcke statt Aufzählung: Pfeile, Rechenzeichen, technische Zeichen, Formen, Dingbats, Punkte, Emojis.
const DRUCKZEICHEN = /[\u{2190}-\u{22FF}\u{2300}-\u{27BF}\u{2980}-\u{29FF}\u{2B00}-\u{2BFF}\u{25A0}-\u{25FF}\u{30FB}\u{00B7}\u{2022}\u{2023}\u{2027}\u{2043}]|\p{Extended_Pictographic}/u;

// Der Rumpf einer Funktion der App: von „function name(“ bis zur nächsten Funktion oder Konstante auf oberster Ebene.
const rumpf = (name) => {
  const start = app.indexOf(`function ${name}(`);
  assert.ok(start > -1, `Funktion ${name} fehlt`);
  const ende = app.slice(start + 1).search(/\n(?:function |const |let |try )/);
  return app.slice(start, ende < 0 ? undefined : start + 1 + ende);
};

test('Dateien der App: alle Pflichtdateien sind da, genau die fünf Datendateien, kein sw.js', async () => {
  const oberste = await readdir(APP);
  for (const datei of ['GDD.md', 'README.md', 'app.mjs', 'daten', 'druck.css', 'index.html', 'logik.mjs', 'package.json', 'test']) {
    assert.ok(oberste.includes(datei), `${datei} fehlt`);
  }
  assert.ok(!oberste.includes('sw.js'), 'sw.js vorhanden');
  assert.deepEqual((await readdir(new URL('daten/', APP))).sort(), ['budget.json', 'haushalt.json', 'hoeflichkeit.json', 'rollen.json', 'texte.json']);
  const tests = (await readdir(new URL('test/', APP))).sort();
  assert.deepEqual(tests, ['logik.test.mjs', 'regeln.test.mjs']);
});

test('keine Eingabefelder für Kinder: kein input, textarea, select, form, contenteditable', () => {
  const muster = /<\s*(input|textarea|select|form)\b|contenteditable|(el|createElement)\(\s*['"](input|textarea|select|form)['"]/i;
  for (const d of ['index.html', 'app.mjs']) {
    assert.ok(!muster.test(code[d]), `${d}: Eingabeelement gefunden`);
  }
});

test('keine Speicherung: kein localStorage, sessionStorage, IndexedDB, Cookie, Cache; deshalb auch keine Karte „Meine Daten löschen“', () => {
  const muster = /localStorage|sessionStorage|indexedDB|document\.cookie|\bcaches\b|navigator\.storage/;
  for (const d of CODE_DATEIEN) {
    assert.ok(!muster.test(code[d]), `${d}: Speicher-Zugriff gefunden`);
  }
  assert.ok(!/datenKarte|daten-karte|Meine Daten löschen|loescheDaten|\.setItem\(|\.removeItem\(|speicherSchluessel/.test(app + code['logik.mjs']), 'Löschkarte oder Schreibzugriff ohne Speicher');
  // Die Speicherregel des Projekts (Speicher gleich Löschknopf, kein Speicher gleich keine Karte), mit dem Werkzeug des Projekts geprüft.
  const quelltext = `${app}\n${code['logik.mjs']}`;
  assert.deepEqual(speicherBefund(quelltext), { speichert: false, loeschbar: false, karte: false });
});

test('kein Service Worker: keine sw.js, keine Registrierung, kein Cache', async () => {
  assert.ok(!(await readdir(APP)).includes('sw.js'), 'sw.js vorhanden');
  for (const d of CODE_DATEIEN) assert.ok(!/serviceWorker|navigator\.serviceWorker|sw\.js/.test(code[d]), `${d}: Service Worker`);
});

test('keine externen Adressen in allen Dateien; keine Netzaufrufe in Code und Logik; kein @import und kein url() in druck.css', () => {
  const netz = /\bfetch\s*\(|XMLHttpRequest|WebSocket|sendBeacon|EventSource|importScripts|new Worker|window\[|globalThis|wss?:/;
  for (const [d, inhalt] of Object.entries(alle)) {
    assert.ok(!/https?:\/\//i.test(inhalt), `${d}: externe Adresse`);
  }
  for (const d of ['app.mjs', 'logik.mjs']) {
    assert.ok(!netz.test(code[d]), `${d}: Netzaufruf gefunden`);
  }
  assert.ok(!/@import|url\(/.test(code['druck.css']), 'druck.css: @import oder url()');
});

test('Zufall nur in app.mjs: Math.random steht genau einmal, dort; Logik, Daten, Seite und Stil haben keine Zufallsquelle und keine Uhr', () => {
  const treffer = app.match(/Math\.random/g) ?? [];
  assert.equal(treffer.length, 1, `app.mjs: ${treffer.length} Stellen mit Math.random, erwartet 1`);
  for (const d of ['logik.mjs', 'index.html', 'druck.css', ...DATEN]) {
    assert.ok(!/Math\.random|crypto|Date\.now|new Date|performance\./.test(code[d]), `${d}: Zufall oder Uhr`);
  }
  assert.match(app, /erzeugeRunde\(findeModul\(alleModule, 'rollen'\)\.karten, zufall\)/, 'der Zufall wird der Logik als Parameter übergeben');
  assert.ok(!/mischen/.test(app.replace(/^import[\s\S]*?;\n/gm, '')), 'app.mjs mischt selbst statt über die Logik mit dem Zufall-Parameter');
});

test('Importe: nur relative Pfade; die Karten und Texte kommen per JSON-Import mit Typangabe, nicht per Abruf', () => {
  for (const d of ['app.mjs', 'logik.mjs']) {
    for (const [, pfad] of code[d].matchAll(/from '([^']+)'/g)) {
      assert.ok(pfad.startsWith('.'), `${d}: Import ohne relativen Pfad: ${pfad}`);
    }
  }
  const json = [...app.matchAll(/^import (\w+) from '\.\/daten\/(\w+)\.json' with \{ type: 'json' \};$/gm)].map((m) => m[2]);
  assert.deepEqual(json, ['rollen', 'haushalt', 'hoeflichkeit', 'budget', 'texte']);
  assert.match(app, /import \{ el, vorlesen \} from '\.\.\/\.\.\/packages\/kinder-ui\/js\/komponenten\.mjs';/);
});

test('Grundgerüst: deutsch, Viewport, CSP exakt, noscript, Titel, nur eigene Stylesheets und das gemeinsame Favicon auf der Zeile des Stylesheets', () => {
  const html = code['index.html'];
  assert.match(html, /<html lang="de">/);
  assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1"/);
  assert.match(html, /<meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline'"/);
  assert.match(html, /<noscript>/);
  assert.match(html, /<title>Meine Familie: Wörter und Rollen<\/title>/);
  const links = [...html.matchAll(/<link rel="stylesheet"[^>]*href="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(links, ['../../packages/kinder-ui/css/kinder.css', 'druck.css']);
  // Jeder andere Link ist genau das gemeinsame Favicon (gleicher Ursprung, Entscheidung Max 21а): nichts Fremdes.
  const andereLinks = [...html.matchAll(/<link(?![^>]*rel="stylesheet")[^>]*>/g)].map((m) => m[0]);
  assert.deepEqual(andereLinks, ['<link rel="icon" type="image/svg+xml" href="../../packages/kinder-ui/img/favicon.svg" />']);
  assert.ok(html.includes('<link rel="stylesheet" href="../../packages/kinder-ui/css/kinder.css" /><link rel="icon" type="image/svg+xml" href="../../packages/kinder-ui/img/favicon.svg" />'), 'das Favicon steht nicht auf derselben Zeile wie das Stylesheet');
  const skripte = [...html.matchAll(/<script[^>]*src="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(skripte, ['app.mjs']);
  assert.match(html, /<script type="module" src="app\.mjs"><\/script>/);
});

test('aria-live="polite" auf dem Hauptbereich #app; der Netzwerk-Wächter ist importiert, aufgerufen und vorhanden', async () => {
  const tag = code['index.html'].match(/<main[^>]*id="app"[^>]*>/)?.[0];
  assert.ok(tag, '<main id="app"> fehlt');
  assert.match(tag, /aria-live="polite"/);
  assert.match(app, /import \{ installiereNetzwerkWaechter \} from '\.\.\/\.\.\/packages\/kinderschutz\/src\/index\.mjs';/);
  assert.match(app, /^installiereNetzwerkWaechter\(\);$/m);
  await access(new URL('../../../packages/kinderschutz/src/index.mjs', import.meta.url));
});

test('keine Druckzeichen: keine Häkchen, Kästchen, Sterne, Punkte als Zeichen, keine Emojis, weder auf den Blättern noch im Code', () => {
  assert.equal(blaetter.length, 17);
  for (const b of blaetter) {
    assert.ok(!DRUCKZEICHEN.test(b.text), `${b.id}: Druckzeichen im Drucktext`);
  }
  for (const d of CODE_DATEIEN) {
    assert.ok(!DRUCKZEICHEN.test(code[d]), `${d}: Druckzeichen gefunden`);
  }
  assert.ok(DRUCKZEICHEN.test('Haken \u{2713}') && DRUCKZEICHEN.test('Sterne \u{2B50}') && DRUCKZEICHEN.test('Kästchen \u{2610}') && DRUCKZEICHEN.test('Gesicht \u{1F600}'), 'die Prüfung erkennt die Zeichen nicht');
});

test('Druckblatt ohne Namenszeile und ohne Tages- oder Wochentagsfeld; app.mjs und druck.css ohne Namenszeile', () => {
  // „Name“ auch in Zusammensetzungen (Vorname, Nachname, Namensfeld); „Namen“ im Fließtext bleibt erlaubt.
  const namenUndTage = /Name(?!n\b)|Datum|Wochentag|\b(Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag|Sonntag)\b|\bTage?\b|_{3,}|…{2,}/i;
  for (const b of blaetter) {
    assert.ok(!namenUndTage.test(b.text), `${b.id}: Namenszeile oder Tagesfeld im Druck`);
  }
  assert.ok(!/Name\s*:|_{3,}/.test(app + code['druck.css']), 'app.mjs oder druck.css: Namenszeile');
});

test('Blatt ohne Seitenzahl (A18-Standard) und ohne Marke: auf dem Papier steht keine Seitenangabe, im Druck zählt keine Pflichtzeile', () => {
  for (const b of blaetter) {
    assert.ok(!/S\. ?\d|Seite \d|стр|Praleska/.test(b.text), `${b.id}: Seitenangabe oder Quelle auf dem Blatt`);
    assert.ok(!/Menschen geprüft/.test(b.text), `${b.id}: Marke auf einem Blatt ohne Seitenangabe`);
  }
  const druck = rumpf('druckbereich');
  assert.ok(!/quelle\(|quellenText|seitenmarke/.test(druck), 'der Druckbereich baut die Quellenzeile mit Seite');
  assert.match(druck, /druckeKarte\(karte, modul\.titel\)/, 'das Blatt kommt nicht aus druckeKarte');
});

test('Seitenmarke (Entscheidung Max 22а): wo Seitenangaben in den Nutzerdateien stehen, steht die Marke dort, wo die Quelle genannt wird', async () => {
  const befund = await appBefund(APP_PFAD);
  assert.ok(befund.seiten.length > 0, 'die App führt Seitenangaben in den Daten');
  assert.ok(befund.seiten.every((d) => d.startsWith('daten/')), `Seitenangabe außerhalb der Daten: ${befund.seiten.join(', ')}`);
  assert.equal(befund.marke, true, 'Seitenangaben ohne Marke in einer Nutzerdatei');
  assert.equal(texte.seitenmarke, 'Seitenangaben nicht von einem Menschen geprüft.');
  // Auf jedem Bildschirm mit Kartentext steht die Quellenzeile, und sie führt die Marke aus den Daten.
  assert.equal((app.match(/\bquelle\(/g) ?? []).length - 1, 3, 'Quellenzeile auf Karte, Frage und Antwort');
  assert.match(app, /quellenText\(karte, texte\.seitenmarke, art\)/);
  for (const h of texte.hinweise.filter((x) => /S\. \d+/.test(x))) {
    assert.ok(h.includes(texte.seitenmarke), `Hinweis mit Seitenangabe ohne Marke: ${h}`);
  }
  // Nichts behauptet, die Seiten seien von Hand oder von einem Menschen geprüft.
  for (const [d, inhalt] of Object.entries(alle)) {
    assert.ok(!/von Hand geprüft/i.test(inhalt), `${d}: „von Hand geprüft“ ist nicht belegt`);
    assert.ok(!/(?<!nicht |noch nicht )von einem Menschen geprüft/.test(inhalt), `${d}: „von einem Menschen geprüft“ ohne „nicht“`);
  }
});

test('Eigenentwurf-Kennzeichnung: jede Karte, jedes Blatt, jede Pause und die Hinweise sagen, was nicht aus der Quelle stammt', () => {
  for (const b of blaetter) assert.match(b.text, /Eigenentwurf/, `${b.id}: Blatt ohne Kennzeichnung`);
  for (const b of blaetter.filter((x) => x.id.startsWith('budget-'))) assert.match(b.text, /\(Eigenentwurf, fachlich nicht geprüft\)/, `${b.id}: Geld ohne Vermerk`);
  for (const m of alleModule) assert.match(m.schluss.vermerk, /^\(Eigenentwurf/);
  assert.ok(texte.hinweise.some((h) => /Alle Texte der Karten sind Eigenentwurf/.test(h)), 'die Hinweise nennen nicht, dass alle Texte Eigenentwurf sind');
  assert.match(app, /`Ideen \$\{schluss\.vermerk\}\.`/, 'die Pause trägt den Vermerk der Ideen');
});

test('druck.css: A4 hoch, Bildschirmelemente nur im Bildschirm, jede Karte auf eigenem Blatt mit Luft zum Rand; Titel bricht um, Fuß-Link 48 px hoch', () => {
  const css = code['druck.css'];
  assert.match(css, /@media print \{/);
  assert.match(css, /@page\s*\{\s*size: A4 portrait;/);
  assert.match(css, /\.mfw-nur-bildschirm\s*\{\s*display: none !important;\s*\}/);
  assert.match(css, /\.mfw-nur-druck\s*\{\s*display: none;\s*\}/);
  assert.match(css, /\.mfw-nur-druck\s*\{\s*display: block;\s*\}/);
  assert.match(css, /break-after: page;/);
  assert.match(css, /page-break-after: always;/);
  assert.match(css, /break-inside: avoid;/);
  assert.match(css, /\.k-karte\.mfw-karte:last-child\s*\{\s*break-after: auto;/);
  const hoehe = Number(css.match(/\.k-karte\.mfw-karte\s*\{[^}]*height:\s*(\d+)mm;/)?.[1]);
  assert.ok(hoehe > 150 && hoehe <= 262, `Höhe des Blatts ${hoehe} mm passt nicht in die Seite (A4 mit Rand 14 mm: 269 mm)`);
  // Bei 360 px: die Überschrift bricht innerhalb eines Wortes um.
  assert.match(css, /h1\.k-titel\s*\{[^}]*overflow-wrap:\s*anywhere;[^}]*word-break:\s*normal;/);
  // Fuß-Link: mindestens 48 px hoch (Berührziel); 44 px reichen nicht.
  assert.match(css, /\.k-fuss a\s*\{[^}]*min-height:\s*48px;/);
  assert.doesNotMatch(css, /min-height:\s*44px/);
  assert.match(app, /el\('a', \{ href: '\.\.\/\.\.\/impressum\.html' \}, 'Impressum und Datenschutz'\)/);
  assert.ok(!/\.mfw-druck-[a-z]+\s*\{[^}]*display:\s*none/.test(css), 'ein Teil des Blatts ist im Druck ausgeblendet');
});

test('Knöpfe mindestens 48 px hoch: .k-knopf hat min-height 3rem, eigene Knopfhöhen liegen darüber, es gibt keinen kleinen Knopf', async () => {
  const kinderCss = await readFile(new URL('../../../packages/kinder-ui/css/kinder.css', import.meta.url), 'utf8');
  assert.match(kinderCss, /\.k-knopf\s*\{[^}]*min-height:\s*3rem;/);
  for (const [, auswahl, hoehe] of code['druck.css'].matchAll(/([^{}]*\.k-knopf[^{}]*)\{[^}]*min-height:\s*([\d.]+)rem/g)) {
    assert.ok(Number(hoehe) >= 3, `${auswahl.trim()}: min-height ${hoehe}rem unter 3rem`);
  }
  assert.ok(!/k-knopf--klein/.test(app), 'kleiner Knopf: seine Breite folgt dem Text und kann unter 48 px liegen');
  assert.ok(!/(?<!min-)height:\s*\d+(px|rem)/.test(code['druck.css'].replace(/@media print[\s\S]*$/, '')), 'feste Höhe auf dem Bildschirm');
});

test('Druckbereich: nur die gewählten Karten, auf jedem Bildschirm vorhanden, nur im Druck sichtbar; der Bildschirm steckt in einer Hülle nur für den Bildschirm', () => {
  const render = rumpf('render');
  assert.match(render, /el\('div', \{ class: 'mfw-bildschirm mfw-nur-bildschirm' \}/);
  assert.match(render, /druckbereich\(\)\)/, 'der Druckbereich fehlt im Neuaufbau');
  const druck = rumpf('druckbereich');
  assert.match(druck, /el\('div', \{ class: 'mfw-nur-druck', id: 'druckbereich' \}/);
  assert.match(druck, /gewaehlteKarten\(alleModule, auswahl\)\.map\(/);
  assert.match(druck, /class: 'k-karte mfw-karte'/);
  assert.ok(!/el\('(section|article)'/.test(druck.replace("el('section', { class: 'k-karte mfw-karte'", '')), 'ein weiterer Abschnitt im Druckbereich würde als Karte mitgezählt');
  assert.match(app, /\(\) => window\.print\(\)/);
  assert.match(app, /disabled: !kannDrucken\(gewaehlt\)/, 'ohne Auswahl darf der Druckknopf nicht laufen');
  // n gewählte Karten ergeben n Blätter, mit denselben Funktionen, die die App benutzt.
  const ids = alleModule.flatMap((m) => m.karten.map((k) => k.id));
  for (let n = 0; n <= ids.length; n++) assert.equal(gewaehlteKarten(alleModule, ids.slice(0, n)).length, n);
});

test('Fokus nach Klick: jeder Knopf trägt eine data-kennung, die Kennungen sind eindeutig; render() merkt sich den Fokus und setzt ihn zurück', () => {
  const knoepfe = app.match(/el\('button'/g) ?? [];
  const kennungen = app.match(/'data-kennung': /g) ?? [];
  assert.equal(knoepfe.length, 1, 'alle Knöpfe entstehen in der einen Funktion knopf()');
  assert.equal(kennungen.length, knoepfe.length, `${knoepfe.length} Knöpfe, aber ${kennungen.length} data-kennung`);
  // Jeder Aufruf nennt die Kennung als ersten Wert: ein Text oder eine Vorlage, nur die Hilfsfunktionen reichen sie als Variable weiter.
  const aufrufe = [...app.matchAll(/(?<![\w.])(knopf|vorlesenKnopf)\(\s*([^,)]+)[,)]/g)].filter((m) => !app.slice(Math.max(0, m.index - 9), m.index).includes('function'));
  assert.ok(aufrufe.length >= 20, `nur ${aufrufe.length} Aufrufe gefunden`);
  const roh = aufrufe.map((m) => m[2].trim());
  const variable = roh.filter((r) => !/^['`]/.test(r));
  assert.deepEqual(variable, ['kennung'], 'ein Knopf ohne Kennung als Text oder Vorlage');
  const feste = roh.filter((r) => /^'/.test(r));
  assert.equal(new Set(feste).size, feste.length, 'doppelte feste data-kennung');
  const vorlagen = roh.filter((r) => /^`/.test(r)).map((r) => r.replace(/\$\{[^}]*\}/g, '#'));
  assert.equal(new Set(vorlagen).size, vorlagen.length, `doppelte Vorlage für eine data-kennung: ${vorlagen.join(' ')}`);
  // Die Kennung der Knöpfe auf einem Bildschirm, die den Bildschirm wechseln, kehrt auf dem nächsten nicht wieder: sie trägt die Karte oder die Frage.
  for (const r of roh.filter((x) => /^`/.test(x))) assert.match(r, /\$\{(karte\.id|nummer|z\.id)\}/, `Kennung ohne Karte, Frage oder Modul: ${r}`);
  assert.match(app, /function fokussiere\(kennung\)/);
  assert.match(app, /button\[data-kennung\]/, 'fokussiere sucht nur Knöpfe mit data-kennung');
  const merke = app.indexOf('const merkeKennung = document.activeElement?.dataset?.kennung;');
  const neu = app.indexOf('app.replaceChildren(');
  const zurueck = app.indexOf('fokussiere(merkeKennung);');
  assert.ok(merke > -1 && neu > merke && zurueck > neu, 'Fokus muss vor replaceChildren gemerkt und danach gesetzt werden');
});

test('Fokus nach einem Bildschirmwechsel: die Überschrift des neuen Bildschirms (h1 mit tabindex -1) bekommt den Fokus, jeder Bildschirm hat genau eine', () => {
  assert.match(rumpf('ueberschrift'), /el\('h1', \{ class: klasse, tabindex: '-1' \}/);
  const render = rumpf('render');
  assert.match(render, /if \(neuerBildschirm\) \{\s*neuerBildschirm = false;\s*window\.scrollTo\(0, 0\);\s*app\.querySelector\('h1'\)\?\.focus\(\{ preventScroll: true \}\);\s*\} else \{\s*fokussiere\(merkeKennung\);\s*\}/);
  assert.match(rumpf('gehe'), /neuerBildschirm = true;\s*render\(\);/);
  const namen = ['start', 'karte', 'frage', 'antwort', 'pause', 'druck', 'hinweise'];
  for (const n of namen) {
    const f = rumpf(`${n}Bildschirm`);
    assert.equal((f.match(/ueberschrift\(/g) ?? []).length, 1, `${n}Bildschirm: nicht genau eine Überschrift`);
    assert.match(app, new RegExp(`\\b${n}: ${n}Bildschirm,`), `${n}Bildschirm fehlt in der Zuordnung`);
  }
  // Die Knöpfe, die Zustand halten (Auswahl zum Druck), zeichnen neu, ohne den Bildschirm zu wechseln: der Fokus bleibt auf dem Knopf.
  assert.match(rumpf('wahlKnopf'), /auswahl = umschalten\(auswahl, karte\.id\); render\(\);/);
  assert.ok(!/gehe\(/.test(rumpf('wahlKnopf')), 'die Auswahl wechselt den Bildschirm');
});

test('Vorlesen für Kinder-Bildschirme: aus kinder-ui, ein Knopf auf Start, Karte, Frage, Antwort und Pause; Druck und Hinweise sind Erwachsenen-Bildschirme', () => {
  assert.match(app, /vorlesen\(textFuerKlick\(\)\)/);
  const erwartet = {
    start: "vorlesenKnopf('vorlesen-start'",
    karte: 'vorlesenKnopf(`vorlesen-${karte.id}`',
    frage: 'vorlesenKnopf(`vorlesen-frage-${nummer}`',
    antwort: 'vorlesenKnopf(`vorlesen-antwort-${nummer}`',
    pause: "vorlesenKnopf('vorlesen-pause'",
  };
  for (const [name, muster] of Object.entries(erwartet)) {
    assert.ok(rumpf(`${name}Bildschirm`).includes(muster), `${name}Bildschirm: kein Vorlesen-Knopf`);
  }
  for (const name of ['druck', 'hinweise']) assert.ok(!/vorlesenKnopf/.test(rumpf(`${name}Bildschirm`)), `${name}Bildschirm: für Erwachsene, ohne Vorlesen`);
  // Der Text kommt erst beim Klick; das Vorlesen zeichnet nichts neu und nimmt dem Knopf den Fokus nicht.
  assert.ok(!/render\(\)/.test(rumpf('vorlesenKnopf')));
});

test('Sitzungsgrenze für 3 bis 5: höchstens sechs Karten oder Fragen am Stück, danach die Pause „Bildschirm aus“, aus der es nur zum Start geht', () => {
  assert.ok(MAX_PRO_DURCHGANG <= 6 && FRAGEN_PRO_RUNDE <= 6);
  assert.ok(alleModule.every((m) => m.karten.length <= MAX_PRO_DURCHGANG));
  assert.match(rumpf('karteBildschirm'), /knopf\(`fertig-\$\{karte\.id\}`, 'Fertig', \(\) => gehe\(\{ name: 'pause', modul: modulId, art: 'karten' \}\)\)/);
  assert.match(rumpf('antwortBildschirm'), /knopf\('fertig-fragen', 'Fertig', \(\) => gehe\(\{ name: 'pause', modul: 'rollen', art: 'fragen' \}\)\)/);
  const pause = rumpf('pauseBildschirm');
  assert.deepEqual([...pause.matchAll(/(?<![\w.])knopf\('([^']+)'/g)].map((m) => m[1]), ['start-pause'], 'aus der Pause führt nur ein Knopf: zum Start');
  assert.ok(!/Noch einmal|nochmal|Nochmal|Wiederholen/.test(app + JSON.stringify(texte)), 'eine Wiederholung ohne Pause');
  assert.match(code['index.html'], /nur gemeinsam mit einer erwachsenen Person/);
  assert.ok(texte.start.grenze.includes('Höchstens sechs'));
});

test('Sitzungsgrenze nicht zu umgehen: von einer Kartenreihe führt nur „Fertig“ in die Pause, die Runde Fragen beginnt nur auf dem Startbildschirm, aus der Pause geht es nur zum Start', () => {
  // Die Wege zwischen den Bildschirmen, aus dem Quelltext gelesen: Wohin führt ein Knopf auf jedem Bildschirm?
  // gehe({ name: … }) führt zum genannten Bildschirm, zumStart zum Start, starteRunde zur ersten Frage.
  const ziele = (name) => {
    const f = rumpf(`${name}Bildschirm`);
    const z = new Set([...f.matchAll(/gehe\(\{ name: '(\w+)'/g)].map((m) => m[1]));
    if (/\bzumStart\b/.test(f)) z.add('start');
    if (/\bstarteRunde\b/.test(f)) z.add('frage');
    return [...z].sort();
  };
  const wege = Object.fromEntries(['start', 'karte', 'frage', 'antwort', 'pause', 'druck', 'hinweise'].map((n) => [n, ziele(n)]));
  assert.deepEqual(wege, {
    start: ['druck', 'frage', 'hinweise', 'karte'],
    karte: ['karte', 'pause', 'start'],
    frage: ['antwort', 'start'],
    antwort: ['frage', 'pause', 'start'],
    pause: ['start'],
    druck: ['start'],
    hinweise: ['start'],
  });
  // Von einer Karte führt kein Knopf in die Fragen (der Befund: auf jeder Rollenkarte stand „Fragen zu den Rollen“, sechs Karten und
  // sechs Fragen kamen ohne Pause hintereinander). Der Weg in die Fragen steht genau einmal im Quelltext, auf dem Startbildschirm.
  assert.ok(!/starteRunde/.test(rumpf('karteBildschirm')), 'karteBildschirm führt in die Fragen');
  assert.ok(!/knopf\(`fragen-/.test(app), 'ein Knopf „fragen-<Karte>“ auf den Karten');
  assert.equal((app.match(/\bstarteRunde\b/g) ?? []).length, 2, 'starteRunde: die Definition und der eine Eintrag auf dem Startbildschirm');
  assert.match(rumpf('startBildschirm'), /knopf\('fragen-starten',[\s\S]*?starteRunde,/);
  // Die Reihe bleibt in ihrem Thema: Zurück und Weiter führen zu einer Karte desselben Moduls, nie zu einem anderen Thema.
  const innerhalb = [...rumpf('karteBildschirm').matchAll(/gehe\(\{ name: 'karte', ([^}]*)\}\)/g)].map((m) => m[1].trim());
  assert.deepEqual(innerhalb, ['modul: modulId, index: index - 1', 'modul: modulId, index: index + 1']);
  // Die Pause erreicht man nur über „Fertig“: am Ende der Reihe und am Ende der Runde, an keiner anderen Stelle.
  assert.equal((app.match(/gehe\(\{ name: 'pause'/g) ?? []).length, 2, 'ein weiterer Weg in die Pause');
  assert.equal((app.match(/knopf\((?:`fertig-\$\{karte\.id\}`|'fertig-fragen'), 'Fertig', \(\) => gehe\(\{ name: 'pause'/g) ?? []).length, 2);
  // „Zum Start“ ist der Ausgang, keine Fortsetzung: Er steht auf jedem Bildschirm, führt zum Startbildschirm und zählt nichts mit.
  for (const n of ['karte', 'frage', 'antwort', 'pause', 'druck', 'hinweise']) assert.ok(wege[n].includes('start'), `${n}: kein Ausgang zum Start`);
  assert.match(app, /const zumStart = \(\) => gehe\(\{ name: 'start' \}\);/);
});

test('Hinweise für Erwachsene: Gebrauch zu zweit, Pause, Familienvielfalt, keine Wertung und Speicherung, Drucken, Quelle mit Marke, Sprachen', () => {
  const hinweise = texte.hinweise.join('\n');
  assert.match(hinweise, /Kind von 3 bis 5 Jahren und eine erwachsene Person gemeinsam/);
  assert.match(hinweise, /Höchstens sechs Karten oder Fragen am Stück/);
  assert.match(hinweise, /Die Fragen zu den Rollen beginnen auf dem Startbildschirm, nicht mitten in einer Kartenreihe\. Eine Kartenreihe und eine Runde Fragen sollten nicht ohne Pause aufeinander folgen\./);
  assert.match(hinweise, /Familien sind verschieden\. In den Karten steht „Mama oder Papa“\./);
  assert.match(hinweise, /nichts bewertet und nichts gespeichert/);
  assert.match(hinweise, /ohne Namenszeile und ohne Seitenangabe/);
  assert.match(hinweise, /Kopf- und Fußzeilen ausschalten/);
  assert.match(hinweise, /Praleska, S\. 117/);
  assert.match(hinweise, /Seitenangaben nicht von einem Menschen geprüft\./);
  assert.match(hinweise, /uk und ru: nicht vorhanden, offen\./);
  assert.match(rumpf('hinweiseBildschirm'), /texte\.hinweise\.map/);
  // Die Hinweise sagen auch, wofür der Bildschirm nicht gedacht ist: kein Bildschirm für Kinder allein.
  assert.match(code['index.html'], /gemeinsam mit einer erwachsenen Person/);
});

test('uk und ru: keine Fassung erfunden; der Vermerk steht im Quelltext, in den Daten und im GDD; russische Zitate tragen lang="ru"', () => {
  const vermerk = 'uk und ru: nicht vorhanden, offen.';
  assert.ok(code['index.html'].includes(vermerk), 'index.html: Vermerk fehlt');
  assert.ok(texte.sprachen.includes(vermerk), 'Daten: Vermerk fehlt');
  assert.ok(alle['GDD.md'].includes(vermerk), 'GDD.md: Vermerk fehlt');
  assert.ok(alle['README.md'].includes(vermerk), 'README.md: Vermerk fehlt');
  const schluessel = [];
  const sammle = (wert) => {
    if (Array.isArray(wert)) wert.forEach(sammle);
    else if (wert && typeof wert === 'object') for (const [k, v] of Object.entries(wert)) { schluessel.push(k); sammle(v); }
  };
  for (const d of [rollenDatei, haushaltDatei, hoeflichkeitDatei, budgetDatei, texte]) sammle(d);
  assert.ok(!schluessel.some((k) => /^(uk|ru)(_|$)/i.test(k)), 'Sprachfeld in den Daten');
  assert.match(rumpf('mitSprache'), /el\('span', \{ lang: 'ru' \}/);
});

// Modellnamen sind Entscheidung A1 (docs/offene-punkte-kita.md), hier bewusst nicht geprüft.
test('Keine KI-Begriffe in keiner Datei der App', () => {
  const muster = /\bKI\b|LLM|Sprachmodell|Chatbot|künstliche Intelligenz/i;
  for (const [d, inhalt] of Object.entries(alle)) {
    assert.ok(!muster.test(inhalt), `${d}: ${inhalt.match(muster)?.[0]}`);
  }
});

test('keine Bewertung von Kindern im Code und in den Daten: keine Punkte, Stufe, Rang, Einstufung, Note, Sterne, Prozent (docs/02 Z. 141–146)', () => {
  // Dokumente dürfen solche Wörter verneinen („keine Punkte“), Oberfläche und Daten nicht.
  const muster = /unsicher|Selbstwert|Risiko|Diagnose|\bPunkte?\b|Rekord|Rangliste|\bRang\b|Einstufung|\bStufe\b|\bPlatz\b|Prozent|\bSterne?\b|\bErgebnis\b|\bNoten?\b|geschafft|bestanden|Pokal|Medaille|Serie/i;
  for (const d of CODE_DATEIEN) {
    assert.ok(!muster.test(code[d]), `${d}: ${code[d].match(muster)?.[0]}`);
  }
  // Keine Rückmeldung mit Urteil über das Kind: weder in den Daten noch in der Oberfläche (die Antwort heißt in der Logik „richtig“, auf dem Bildschirm kommt das Wort nicht vor).
  const urteil = /falsch|leider|Fehler|nicht ganz|schade|richtig|gut gemacht|bravo|Super/;
  for (const d of ['index.html', 'app.mjs', ...DATEN]) {
    assert.ok(!urteil.test(code[d]), `${d}: Urteil in der Oberfläche: ${code[d].match(urteil)?.[0]}`);
  }
});

test('Werkzeuge des Projekts: Wertungswörter und Wertungs-Stand der App ohne Treffer, Seitenmarke nicht im Stand der Ausnahmen nötig', async () => {
  assert.deepEqual(await appLeistungsTreffer(WURZEL, [SLUG]), {}, 'Wörter der Leistungsbewertung gefunden (node tools/leistungs-woerter.mjs)');
  for (const d of CODE_DATEIEN.filter((x) => /\.(mjs|html|json)$/.test(x))) {
    assert.deepEqual(appGruende(d, code[d]), [], `${d}: Rekord, Rang oder Zähler (node tools/bewertung-stand.mjs)`);
  }
});

test('externe Fakten: Recht, Geld und Gesundheit nur mit Quelle aus dem Bauauftrag oder mit dem Vermerk; keine blockierende Fundstelle der Projektprüfung', async () => {
  const z = zaehle(await fundstellen(APP_PFAD));
  assert.equal(z.blockierend, 0, 'blockierende Fundstellen externer Fakten');
  assert.equal(z.gesundheit, 0, 'Gesundheitszeilen ohne Beleg');
  // Dieselbe Regel als Zeilenprüfung über alle Dateien, auch README und GDD: Behauptungen dieser Art brauchen eine Fundstelle oder den Vermerk.
  const behauptung = /\b(EN \d|DIN\b|ISO \d|AWMF|BZgA|BIÖG|WHO\b|G-BA|§\s*\d|Richtlinie|Verordnung|Studie|randomis|Teilnehmer|Gegenstimme|Prozent|\d+\s*%|Erste[- ]Hilfe|Giftnotruf|Notruf|amtlich|Behörde)/i;
  const verneint = /\b(kein|keine|keinen|keiner|ohne|nicht|nie)\b/i;
  const beleg = /Eigenentwurf, fachlich nicht geprüft|\(S\. \d|Praleska/;
  const befunde = [];
  for (const d of ALLE_DATEIEN) {
    alle[d].split('\n').forEach((zeile, i) => {
      if (behauptung.test(zeile) && !verneint.test(zeile) && !beleg.test(zeile)) befunde.push(`${d}:${i + 1}`);
    });
  }
  assert.deepEqual(befunde, [], `Behauptung ohne Quelle oder Vermerk: ${befunde.join(', ')}`);
  // Geld ohne Beträge: die Karten des Familienbudgets nennen nur Wörter, keine Zahlen.
  for (const k of budgetDatei.karten) assert.ok(!/\d|€/.test(`${k.erklaerung} ${k.gespraech}`), `${k.id}: Zahl im Familienbudget`);
});

test('docs/02: jeder Verweis nennt eine der drei belegten Zeilenangaben (22–24, 79–82, 141–146); keine „Regel 3/4/5“', () => {
  const erlaubt = ['22–24', '79–82', '141–146'];
  for (const d of ['README.md', 'GDD.md', ...CODE_DATEIEN]) {
    for (const m of alle[d].matchAll(/docs\/02(?: Z\. (\d+–\d+))?/g)) {
      assert.ok(m[1] && erlaubt.includes(m[1]), `${d}: Verweis „${m[0]}“ ist keine belegte Zeile`);
    }
    assert.ok(!/Regel [345]\b/.test(alle[d]), `${d}: Verweis auf „Regel 3/4/5“`);
  }
});

test('Zitate: kein russisches Zitat über sechs Wörter in irgendeiner Datei; russischer Text steht nur in Anführungszeichen oder im Feld begriff', () => {
  const zitate = [];
  for (const [d, inhalt] of Object.entries(alle)) {
    for (const m of inhalt.matchAll(/[„«]([^“»\n]*\p{Script=Cyrillic}[^“»\n]*)[“»]/gu)) zitate.push([d, m[1]]);
  }
  for (const k of alleModule.flatMap((m) => m.karten)) zitate.push([`${k.id}: quelle.begriff`, k.quelle.begriff]);
  assert.ok(zitate.length >= 30, `nur ${zitate.length} Zitate gefunden`);
  for (const [d, text] of zitate) {
    const woerter = text.trim().split(/\s+/).length;
    assert.ok(woerter <= 6, `${d}: „${text}“ hat ${woerter} Wörter`);
  }
  // Außerhalb von Anführungszeichen steht in Seite, Code und Stil kein russischer Text, in den Daten nur im Feld begriff.
  for (const d of ['index.html', 'app.mjs', 'logik.mjs', 'druck.css']) {
    assert.ok(!/\p{Script=Cyrillic}/u.test(code[d].replace(/„[^“]*“/g, '')), `${d}: russischer Text außerhalb eines Zitats`);
  }
  const pruefe = (wert, schluessel, wo) => {
    if (Array.isArray(wert)) wert.forEach((x) => pruefe(x, schluessel, wo));
    else if (wert && typeof wert === 'object') for (const [k, v] of Object.entries(wert)) pruefe(v, k, wo);
    else if (typeof wert === 'string' && schluessel !== 'begriff') {
      assert.ok(!/\p{Script=Cyrillic}/u.test(wert.replace(/„[^“]*“/g, '')), `${wo}: russischer Text außerhalb eines Zitats im Feld ${schluessel}`);
    }
  };
  for (const [wo, d] of Object.entries({ rollen: rollenDatei, haushalt: haushaltDatei, hoeflichkeit: hoeflichkeitDatei, budget: budgetDatei, texte })) pruefe(d, '', wo);
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

test('package.json: privat, ES-Modul, Testskript vorhanden, Lizenz wie im Projekt', () => {
  const pkg = JSON.parse(alle['package.json']);
  assert.equal(pkg.name, `@info70/${SLUG}`);
  assert.equal(pkg.private, true);
  assert.equal(pkg.type, 'module');
  assert.equal(pkg.license, 'AGPL-3.0-only');
  assert.match(pkg.scripts?.test ?? '', /node --test/);
});
