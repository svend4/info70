import { test } from 'node:test';
import assert from 'node:assert/strict';
import { access, readdir, readFile } from 'node:fs/promises';
import daten from '../daten/farbwoerter.json' with { type: 'json' };
import { PRO_SITZUNG, druckBlaetter, farbkarte, kartenText } from '../logik.mjs';

// Projektregeln, für diese App geprüft: docs/02 Z. 22–24 (keine Anfragen nach außen),
// docs/02 Z. 79–82 (Druckbögen), docs/02 Z. 141–146 (keine Bewertung von Kindern).
// Die Speicherregel, die Seitenmarke, die Vorleseregel und die Fokusregel haben keine docs/02-Zeile,
// sie sind Projektregeln. Die Prüfung liest die Dateien der App (ohne test/).
// Die Testdateien selbst dürfen die verbotenen Wörter nennen, um sie zu verbieten.
// Nach der Vorlage von apps/puppentheater-werkstatt und apps/kleine-forscher-ohne-bildschirm; es gibt
// hier keinen Zufall, kein quiz-kern und keine Pflichtmarkierung auf dem Blatt (das Blatt trägt keine Seitenangabe).

const APP = new URL('../', import.meta.url);
const CODE_DATEIEN = ['index.html', 'app.mjs', 'logik.mjs', 'druck.css', 'daten/farbwoerter.json'];
const ALLE_DATEIEN = [...CODE_DATEIEN, 'package.json', 'README.md', 'GDD.md'];
const MARKE = 'Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.';
const VERMERK_SPRACHEN = 'uk und ru: nicht vorhanden, offen.';

const lese = (datei) => readFile(new URL(datei, APP), 'utf8');
const code = Object.fromEntries(await Promise.all(CODE_DATEIEN.map(async (d) => [d, await lese(d)])));
const alle = Object.fromEntries(await Promise.all(ALLE_DATEIEN.map(async (d) => [d, await lese(d)])));
const app = code['app.mjs'];

// Die Druckblätter aller Farbwörter, so wie sie gedruckt werden.
const blaetter = druckBlaetter(daten.farbwoerter.map((f) => farbkarte(f)));

/** Der Rumpf einer Funktion der App: von „function name(“ bis zur schließenden Klammer am Zeilenanfang. */
const funktion = (name) => app.match(new RegExp(`function ${name}\\([^)]*\\) \\{[\\s\\S]*?\\n\\}\\n`))?.[0] ?? '';

test('keine Eingabefelder für Kinder: kein input, textarea, select, form, contenteditable', () => {
  const muster = /<\s*(input|textarea|select|form)\b|contenteditable|(el|createElement)\(\s*['"](input|textarea|select|form)['"]/i;
  for (const d of ['index.html', 'app.mjs']) {
    assert.ok(!muster.test(code[d]), `${d}: Eingabeelement gefunden`);
  }
});

test('keine Speicherung: kein localStorage, sessionStorage, IndexedDB, Cookie oder Cache, und darum keine Karte „Meine Daten löschen“', () => {
  const muster = /localStorage|sessionStorage|indexedDB|document\.cookie|\bcaches\b|navigator\.storage|\.setItem\(|speicherSchluessel/;
  for (const d of CODE_DATEIEN) {
    assert.ok(!muster.test(code[d]), `${d}: Speicher-Zugriff gefunden`);
  }
  // Speicherregel (Entscheidung Max 30б): wer nichts speichert, zeigt die Karte zum Löschen nicht.
  assert.doesNotMatch(app, /datenKarte|daten-karte|loescheDaten|Meine Daten löschen|Alle Daten löschen|removeItem/);
});

test('keine externen Adressen, keine Netzaufrufe in den Dateien der App, kein @import', () => {
  const netz = /\bfetch\s*\(|XMLHttpRequest|WebSocket|sendBeacon|EventSource|importScripts|new Worker|window\[|globalThis|wss?:/;
  for (const d of CODE_DATEIEN) {
    assert.ok(!/https?:\/\/|(?<![:\w])\/\/[\w-]+\.[a-z]{2,}/i.test(code[d]), `${d}: externe Adresse`);
  }
  for (const d of ['app.mjs', 'logik.mjs']) {
    assert.ok(!netz.test(code[d]), `${d}: Netzaufruf gefunden`);
  }
  assert.ok(!/@import/.test(code['druck.css']), 'druck.css: @import');
});

test('kein Zufall und keine Uhr: Math.random, crypto, Date, performance fehlen überall; die Reihenfolge ist die der Datei', () => {
  for (const d of CODE_DATEIEN) {
    assert.ok(!/Math\.random|crypto|Date\.now|new Date|performance\.|mischen\(/.test(code[d]), `${d}: Zufall oder Uhr`);
  }
});

test('die Farbwörter kommen per JSON-Import mit Typangabe, die Oberfläche lädt nichts nach', () => {
  assert.match(app, /^import daten from '\.\/daten\/farbwoerter\.json' with \{ type: 'json' \};$/m);
});

test('Grundgerüst: deutsch, Viewport, CSP exakt, nur eigene Stylesheets und das gemeinsame Favicon auf derselben Zeile, ein Modul-Skript', () => {
  const html = code['index.html'];
  assert.match(html, /<html lang="de">/);
  assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1"/);
  assert.match(html, /<meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline'"/);
  assert.match(html, /<noscript>/);
  assert.match(html, /<title>Farbwörter-Schatz<\/title>/);
  const links = [...html.matchAll(/<link rel="stylesheet"[^>]*href="([^"]+)"/g)].map((m) => m[1]);
  // Jeder andere Link ist genau das gemeinsame Favicon (gleicher Ursprung, Entscheidung Max 21а): nichts Fremdes.
  const andereLinks = [...html.matchAll(/<link(?![^>]*rel="stylesheet")[^>]*>/g)].map((m) => m[0]);
  assert.equal(andereLinks.length, 1, 'genau ein Link, der kein Stylesheet ist: das Favicon');
  assert.ok(andereLinks.every((l) => /^<link rel="icon" type="image\/svg\+xml" href="(?:\.\.\/\.\.\/)?packages\/kinder-ui\/img\/favicon\.svg" \/>$/.test(l)), `index.html: fremder Link ${andereLinks.join(' ')}`);
  assert.deepEqual(links, ['../../packages/kinder-ui/css/kinder.css', 'druck.css']);
  // Die Zeile mit dem Stylesheet trägt auf derselben Zeile das Favicon.
  assert.match(html, /^ *<link rel="stylesheet" href="\.\.\/\.\.\/packages\/kinder-ui\/css\/kinder\.css" \/><link rel="icon" type="image\/svg\+xml" href="\.\.\/\.\.\/packages\/kinder-ui\/img\/favicon\.svg" \/>$/m);
  const skripte = [...html.matchAll(/<script[^>]*src="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(skripte, ['app.mjs']);
  assert.match(html, /<script type="module" src="app\.mjs"><\/script>/);
});

test('aria-live="polite" auf dem Hauptbereich #app', () => {
  const tag = code['index.html'].match(/<main[^>]*id="app"[^>]*>/)?.[0];
  assert.ok(tag, '<main id="app"> fehlt');
  assert.match(tag, /aria-live="polite"/);
});

test('kein Service Worker: keine sw.js im Ordner, keine Registrierung im Code', async () => {
  const dateien = await readdir(APP, { recursive: true });
  assert.deepEqual(dateien.filter((d) => /(^|\/)sw\.js$/.test(d)), []);
  for (const d of CODE_DATEIEN) assert.ok(!/serviceWorker|navigator\.serviceWorker/.test(code[d]), `${d}: Service Worker`);
});

test('Daten: beim Laden werden die Pflichtfelder, die Quellen und die Druckbarkeit aller Blätter geprüft, ein Fehler steht auf dem Bildschirm', () => {
  assert.match(app, /farbwoerter = ladeFarbwoerter\(daten\);\n  datenFehler = pruefeFarbwoerter\(daten\)\[0\] \?\? null;/);
  assert.match(app, /if \(!datenFehler\) druckBlaetter\(farbwoerter\.map\(\(f\) => farbkarte\(f\)\)\);/);
  assert.match(app, /\} catch \(fehler\) \{\n  datenFehler = fehler\.message;/);
  assert.match(funktion('bildschirm'), /if \(datenFehler\) return fehlerBildschirm\(\);/);
  assert.match(funktion('fehlerBildschirm'), /Datenfehler: \$\{datenFehler\}/);
});

test('Netzwerk-Wächter: aus packages/kinderschutz importiert und aufgerufen', async () => {
  assert.match(app, /import \{ installiereNetzwerkWaechter \} from '\.\.\/\.\.\/packages\/kinderschutz\/src\/index\.mjs';/);
  assert.match(app, /^installiereNetzwerkWaechter\(\);$/m);
  await access(new URL('../../../packages/kinderschutz/src/index.mjs', import.meta.url));
});

test('keine Druckzeichen: im Drucktext aller Farbwörter und im Quelltext keine Häkchen, Kästchen, Sterne, Punkte, Pfeile, Emojis', () => {
  // Zeichenblöcke statt Aufzählung: Pfeile, Math-Zeichen, Dingbats, geometrische Formen, Emojis.
  const zeichen = /[☐☒☑✓✔✗✘✅❌★☆•●○◦·∙‧▪▫◾◽■□]|[←-⋿⌀-➿⦀-⧿⬀-⯿■-◿・]|\p{Extended_Pictographic}/u;
  assert.equal(blaetter.length, daten.farbwoerter.length);
  for (const b of blaetter) {
    assert.ok(!zeichen.test(kartenText(b)), `Blatt ${b.id}: Druckzeichen im Drucktext`);
  }
  for (const d of CODE_DATEIEN) {
    assert.ok(!zeichen.test(code[d]), `${d}: Druckzeichen gefunden`);
  }
});

test('Druckblatt ohne Namenszeile, ohne Tages- oder Wochentagsfeld, ohne Linien zum Ausfüllen', () => {
  // „Name“ auch in Zusammensetzungen (Farbname, Vorname); „Namen“ im Fließtext bleibt erlaubt.
  const namenUndTage = /Name(?!n\b)|Datum|Wochentag|\b(Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag|Sonntag)\b|\bTage?\b|_{3,}|…{2,}/i;
  for (const b of blaetter) {
    assert.ok(!namenUndTage.test(kartenText(b)), `Blatt ${b.id}: Namenszeile oder Tagesfeld im Druck`);
  }
  assert.ok(!/Name\s*:|_{3,}/.test(app + code['druck.css']), 'app.mjs oder druck.css: Namenszeile');
});

test('keine Seitenzahl und keine Pflichtmarkierung auf dem Blatt: das Blatt trägt keine Seitenangabe (Standard für neue Apps)', () => {
  for (const b of blaetter) {
    const text = kartenText(b);
    assert.doesNotMatch(text, /S\. \d|Seite \d|Seiten \d/, `Blatt ${b.id}: Seitenzahl`);
    assert.doesNotMatch(text, /geprüft/, `Blatt ${b.id}: Pflichtmarkierung ohne Seitenangabe`);
  }
  const inhalt = funktion('blattInhalt');
  assert.ok(inhalt.length > 100, 'blattInhalt nicht gefunden');
  assert.doesNotMatch(inhalt, /pflichtmarkierung|seite|quelle/i, 'das Blatt nennt die Quelle oder trägt die Marke');
});

test('Seitenmarke: wo die App die Quelle mit Seite nennt, steht die Marke dabei; sie steht auch in den Daten, in der README und im GDD unter „## Offen“; nie „von Hand geprüft“', () => {
  assert.equal(daten.pflichtmarkierung, MARKE);
  const start = funktion('startBildschirm');
  assert.ok(start.includes('${q.seite}'), 'der Startbildschirm nennt die Seite nicht');
  assert.ok(start.includes("el('p', { class: 'fws-klein' }, daten.pflichtmarkierung)"), 'die Marke fehlt beim Quellenhinweis');
  assert.ok(start.indexOf('daten.pflichtmarkierung') > start.indexOf('${q.seite}'), 'die Marke steht nicht hinter der Seitenangabe');
  // Die Seite steht nur in diesem Bildschirm; überall sonst auf dem Bildschirm und im Druck fehlt sie.
  assert.ok(!/\.seite(?![\wäöüß])/.test(app.replace(start, '')), 'die Seite wird auch außerhalb des Startbildschirms genannt');
  assert.ok(alle['README.md'].includes(MARKE), 'README.md: Marke fehlt');
  const gdd = alle['GDD.md'];
  assert.ok(gdd.includes('## Offen'), 'GDD.md: Abschnitt „## Offen“ fehlt');
  assert.ok(gdd.slice(gdd.indexOf('## Offen')).includes(MARKE), 'GDD.md: Marke nicht unter „## Offen“');
  for (const [d, inhalt] of Object.entries(alle)) {
    assert.ok(!/von Hand geprüft/i.test(inhalt), `${d}: „von Hand geprüft“ ist nicht belegt`);
  }
});

test('Eigenentwurf-Kennzeichnung: Blatt, Farbkarte, Fuß, Quellenhinweis und Hinweise für Erwachsene nennen den Eigenentwurf', () => {
  for (const b of blaetter) assert.match(kartenText(b), /Eigenentwurf/, `Blatt ${b.id}: ohne Kennzeichnung`);
  assert.match(daten.eigenentwurf, /Farbnamen, Farbflächen, Gruppen und alle Texte sind Eigenentwurf/);
  assert.ok((app.match(/daten\.eigenentwurf/g) ?? []).length >= 2, 'Quellenhinweis und Fuß nennen den Eigenentwurf');
  assert.match(funktion('karteBildschirm'), /fws-klein' \}, BLATT_EIGEN\)/, 'die Farbkarte trägt dieselbe Kennzeichnung wie das Blatt');
  assert.match(daten.sprachen, /Eigenentwurf/);
  assert.match(daten.quelle.werk, /Titel übertragen, Eigenentwurf/);
  assert.ok(daten.start.erwachsene.some((t) => t.includes('Eigenentwurf, fachlich nicht geprüft')), 'Warm und kalt: ohne Vermerk');
  assert.ok(daten.start.erwachsene.some((t) => t.includes('Eigenentwurf, die Zahl ist offen')), 'Rundengrenze: ohne Vermerk');
});

test('druck.css: A4 hoch, Bildschirmelemente nur im Bildschirm, jede Karte ein eigenes Blatt, nie zerrissen, Flächen mit Hintergrund; Titel bricht um, Flächenname 0.85rem, Fuß-Link 48 px hoch', () => {
  const css = code['druck.css'];
  assert.match(css, /@media print \{/);
  assert.match(css, /@page\s*\{\s*size: A4 portrait;/);
  assert.match(css, /\.fws-nur-bildschirm\s*\{\s*display: none !important;\s*\}/);
  assert.match(css, /\.fws-nur-druck\s*\{\s*display: none;\s*\}/);
  assert.match(css, /\.fws-nur-druck\s*\{\s*display: block;\s*\}/);
  assert.match(css, /break-inside: avoid;/);
  assert.match(css, /\.k-karte\.fws-karte \+ \.k-karte\.fws-karte\s*\{\s*break-before: page;/);
  // Die Fläche druckt mit Hintergrund, und der Rand zeigt sie auch ohne Farbe.
  assert.match(css, /\.fws-flaeche\s*\{[^}]*print-color-adjust:\s*exact;/);
  assert.match(css, /\.fws-flaeche\s*\{[^}]*border:\s*2pt solid #000;/);
  // Bei 360 px: die Überschrift bricht innerhalb eines Wortes um.
  assert.match(css, /h1\.k-titel\s*\{[^}]*overflow-wrap:\s*anywhere;[^}]*word-break:\s*normal;/);
  // Der Name unter einer Fläche steht in 0.85rem. In 18 px (Gewicht 600) ist „aprikosenfarben“ 143 px breit, die halbe
  // Karte bei 360 px nur 131 px (bei 375 px 138 px); das Wort bräche mitten im Wort um. Die Druckregel (16pt) bleibt.
  assert.match(css, /\.fws-flaechenname\s*\{[^}]*font-size:\s*0\.85rem;/);
  // Fuß-Link: mindestens 48 px hoch (Berührziel); 44 px reichen nicht.
  assert.match(css, /\.k-fuss a\s*\{[^}]*min-height:\s*48px;/);
  assert.doesNotMatch(css, /\.k-fuss a\s*\{[^}]*min-height:\s*44px;/);
  assert.match(app, /el\('a', \{ href: '\.\.\/\.\.\/impressum\.html' \}, 'Impressum und Datenschutz'\)/);
});

test('Knöpfe mindestens 48 px hoch: die gemeinsame Klasse .k-knopf hat min-height 3rem, druck.css und app.mjs setzen keine kleinere Höhe', async () => {
  const kinderCss = await readFile(new URL('../../../packages/kinder-ui/css/kinder.css', import.meta.url), 'utf8');
  assert.match(kinderCss, /\.k-knopf\s*\{[^}]*min-height:\s*3rem;/);
  assert.match(kinderCss, /\.k-knopf--klein\s*\{[^}]*min-height:\s*3rem;/);
  assert.doesNotMatch(code['druck.css'], /\.[\w-]*knopf[^{]*\{[^}]*(?:min-|max-)?height\s*:/, 'druck.css verkleinert einen Knopf');
  // Inline-Stil gibt es nur für Farben (Fläche, Fleck), nie für einen Knopf.
  const stile = [...app.matchAll(/style: ([^\n]+)/g)].map((m) => m[1]);
  assert.ok(stile.length >= 2);
  for (const s of stile) assert.match(s, /^`background:\$\{farbe\}`/, `Inline-Stil außer der Farbe: ${s}`);
});

test('Druckbereich: nur die vorgemerkten Karten, die Vorschau ist nur auf dem Bildschirm, der Druckknopf ruft window.print()', () => {
  assert.match(app, /el\('div', \{ class: 'fws-nur-druck', id: 'druckbereich' \}, \.\.\.blaetter\.map\(druckBlatt\)\)/);
  assert.match(app, /el\('div', \{ class: 'fws-bildschirm fws-nur-bildschirm' \}, \.\.\.bildschirm\(blaetter\)\)/);
  assert.match(app, /class: 'k-karte fws-karte', 'aria-labelledby': `druck-\$\{blatt\.id\}`/);
  assert.match(app, /class: 'k-karte fws-karte-bildschirm',/);
  assert.match(app, /onclick: \(\) => window\.print\(\)/);
  assert.equal((app.match(/window\.print\(\)/g) ?? []).length, 1, 'genau ein Druckknopf');
  assert.match(app, /disabled: blaetter\.length === 0/, 'ohne Auswahl kein Druck');
  // Die Blätter kommen aus der Auswahl, nicht aus dem ganzen Satz.
  assert.match(app, /druckBlaetter\(gewaehlteFarbwoerter\(farbwoerter, auswahl\)\.map\(\(f\) => farbkarte\(f\)\)\)/);
});

test('Fokus nach Klick: jeder Knopf trägt eine data-kennung, die Kennungen sind eindeutig; render() merkt sich den Fokus und setzt ihn zurück', () => {
  const knoepfe = app.match(/el\('button'/g) ?? [];
  const kennungen = app.match(/'data-kennung': /g) ?? [];
  assert.ok(knoepfe.length >= 15, 'zu wenige Knöpfe gefunden');
  assert.equal(kennungen.length, knoepfe.length, `${knoepfe.length} Knöpfe, aber ${kennungen.length} data-kennung`);
  const feste = [...app.matchAll(/'data-kennung': '([^']+)'/g)].map((m) => m[1]);
  const vorlese = [...app.matchAll(/vorleseKnopf\([^\n]*?, '([a-z-]+)'\)/g)].map((m) => m[1]);
  assert.equal(vorlese.length, 5, 'fünf Bildschirme für Kinder, fünf Vorlese-Kennungen');
  const alleFesten = [...feste, ...vorlese];
  assert.equal(new Set(alleFesten).size, alleFesten.length, 'doppelte data-kennung');
  // Die dynamischen Kennungen tragen die Kennung des Farbworts oder der Gruppe.
  assert.match(app, /'data-kennung': `gruppe-\$\{g\.id\}`/);
  assert.match(app, /'data-kennung': `wort-\$\{f\.id\}`/);
  assert.match(app, /'data-kennung': `druck-weg-\$\{blatt\.id\}`/);
  assert.match(app, /function fokussiere\(kennung\)/);
  assert.match(app, /button\[data-kennung\]/, 'fokussiere sucht nur Knöpfe mit data-kennung');
  const merke = app.indexOf('const merkeKennung = document.activeElement?.dataset?.kennung;');
  const neu = app.indexOf('app.replaceChildren(');
  const zurueck = app.indexOf('fokussiere(merkeKennung)');
  assert.ok(merke > -1 && neu > merke && zurueck > neu, 'Fokus muss vor replaceChildren gemerkt und danach gesetzt werden');
  // Ein Knopf, der ohne Neuaufbau verschwinden könnte, wird nicht deaktiviert, sondern nicht gezeigt (focus() auf einen
  // deaktivierten Knopf tut nichts): nur der Druckknopf ist deaktivierbar, und der wird nie angeklickt, solange er es ist.
  assert.deepEqual([...app.matchAll(/disabled: ([^\n]+),/g)].map((m) => m[1]), ['blaetter.length === 0']);
});

test('Fokus nach einem Bildschirmwechsel: die Überschrift trägt tabindex="-1" und bekommt den Fokus; fällt der Knopf weg, geht der Fokus auf die Überschrift', () => {
  assert.match(funktion('ueberschrift'), /el\('h1', \{ class: 'k-titel fws-ueberschrift', id: UEBERSCHRIFT, tabindex: '-1' \}/);
  assert.match(funktion('fokussiereUeberschrift'), /document\.getElementById\(UEBERSCHRIFT\)\?\.focus\(\)/);
  // Jeder Wechsel läuft über gehe(), und gehe() ruft render(true).
  const gehe = funktion('gehe');
  assert.match(gehe, /render\(true\)/);
  assert.match(app, /if \(zurUeberschrift \|\| warUeberschrift\) fokussiereUeberschrift\(\);/);
  assert.match(app, /else if \(merkeKennung && !fokussiere\(merkeKennung\)\) fokussiereUeberschrift\(\);/);
  // Jeder Bildschirm hat genau eine Überschrift der Ebene 1 mit dieser Kennung.
  for (const name of ['startBildschirm', 'gruppenBildschirm', 'listeBildschirm', 'karteBildschirm', 'schlussBildschirm', 'druckBildschirm', 'fehlerBildschirm']) {
    const rumpf = funktion(name);
    assert.ok(rumpf.length > 50, `${name} nicht gefunden`);
    assert.equal((rumpf.match(/ueberschrift\(|\.\.\.kopf\(/g) ?? []).length, 1, `${name}: genau eine Überschrift`);
  }
  // Kein Knopf springt von sich aus zurück: jeder Wechsel zu einem anderen Bildschirm geht über gehe().
  assert.equal((app.match(/(?<![A-Za-z])schirm = /g) ?? []).length, 2, 'schirm wird nur in der Vorgabe und in gehe() gesetzt');
});

test('Vorlesen: über vorlesen() aus kinder-ui, mit der Stimme im Gerät, auf jedem Bildschirm für Kinder; ohne solche Stimme steht ein Hinweis', () => {
  assert.match(app, /import \{ el, vorlesen, lokaleStimme \} from '\.\.\/\.\.\/packages\/kinder-ui\/js\/komponenten\.mjs';/);
  const knopf = funktion('vorleseKnopf');
  assert.match(knopf, /lokaleStimme\('de'\)/);
  assert.match(knopf, /if \(stimme === null\)/, 'ohne Stimme im Gerät fehlt der Hinweis');
  assert.match(knopf, /vorlesen\(text, 'de-DE', stimme\)/, 'die ermittelte Stimme wird an vorlesen() übergeben');
  assert.match(knopf, /Vorlesen ist hier deshalb aus/);
  for (const name of ['startBildschirm', 'gruppenBildschirm', 'listeBildschirm', 'karteBildschirm', 'schlussBildschirm']) {
    assert.match(funktion(name), /vorleseKnopf\(/, `${name}: ohne Vorlesen`);
  }
  assert.doesNotMatch(funktion('druckBildschirm'), /vorleseKnopf\(/, 'die Druckvorschau ist für Erwachsene');
  assert.match(app, /speechSynthesis\.addEventListener\?\.\('voiceschanged'/, 'die Stimmenliste lädt später');
  assert.match(app, /vorlesetext\(karte\)/, 'die Farbkarte liest Name, Hinweis und Satz vor');
  assert.doesNotMatch(app, /farbkarte\([^)]*'(?:ru|uk)'/, 'kein ru oder uk auf dem Bildschirm: die deutsche Stimme läse es falsch');
});

test('uk und ru: der Vermerk steht im Quelltext, in den Daten, in der README und im GDD; uk ist überall null, ru nur ein Begriff der Quelle', () => {
  assert.ok(code['index.html'].includes(VERMERK_SPRACHEN), 'index.html: Vermerk fehlt');
  assert.ok(daten.sprachen.includes(VERMERK_SPRACHEN), 'Daten: Vermerk fehlt');
  assert.ok(alle['GDD.md'].includes(VERMERK_SPRACHEN), 'GDD.md: Vermerk fehlt');
  assert.ok(alle['README.md'].includes(VERMERK_SPRACHEN), 'README.md: Vermerk fehlt');
  assert.ok(app.includes('daten.sprachen'), 'die Oberfläche zeigt den Vermerk');
  for (const f of daten.farbwoerter) {
    assert.equal(f.uk, null, `${f.id}: uk ist nicht leer`);
    assert.ok(f.ru === null || daten.quelle.begriffe.includes(f.ru), `${f.id}: ru ist kein Begriff der Quelle`);
  }
  // Die Oberfläche liest ru und uk nicht: sie zeigt nur den deutschen Namen.
  assert.doesNotMatch(app, /\.ru(?![\wäöüß])|\.uk(?![\wäöüß])/, 'app.mjs liest ru oder uk');
});

test('kein quiz-kern und kein Zähler der Wertung: die App importiert den Motor nicht und führt nur neutrale Listen', () => {
  for (const d of ['app.mjs', 'logik.mjs']) {
    assert.doesNotMatch(code[d], /quiz-kern|starteQuiz|rekordSchluessel/, `${d}: quiz-kern`);
  }
  // Gezählt wird nur, was angesehen oder vorgemerkt ist, und es wird nur mit „Karte“ oder „Farbwort“ benannt.
  assert.match(app, /In dieser Runde angesehen: \$\{anzahl\(angesehen\.length, 'Farbwort', 'Farbwörter'\)\}\./);
  assert.match(app, /Gewählt: \$\{anzahl\(blaetter\.length, 'Karte', 'Karten'\)\}\./);
});

test('Links: nur das Impressum, kein Link auf eine eltern.html, die es nicht gibt', async () => {
  const ziele = [...app.matchAll(/href: '([^']+)'/g)].map((m) => m[1]);
  assert.deepEqual([...new Set(ziele)], ['../../impressum.html']);
  assert.ok(!(await readdir(APP)).includes('eltern.html'), 'eine eltern.html braucht einen Link und einen Test');
  await access(new URL('../../../impressum.html', import.meta.url));
});

// Modellnamen sind Entscheidung A1 (docs/offene-punkte-kita.md), hier bewusst nicht geprüft.
test('keine KI-Begriffe in den Dateien der App', () => {
  const muster = /\bKI\b|LLM|Sprachmodell|Chatbot|künstliche Intelligenz/i;
  for (const [d, inhalt] of Object.entries(alle)) {
    assert.ok(!muster.test(inhalt), `${d}: ${inhalt.match(muster)?.[0]}`);
  }
});

test('keine Bewertung von Kindern im Code und in den Daten: keine Punkte, Stufe, Rang, Einstufung, Note, kein Rekord, kein „geschafft“ (docs/02 Z. 141–146)', () => {
  // Dokumente dürfen solche Wörter verneinen („keine Punkte“), Oberfläche und Daten nicht.
  const muster = /unsicher|Selbstwert|Risiko|Diagnose|\bPunkte?\b|Rangliste|\bRang\b|Einstufung|\bStufe\b|\bPlatz\b|Prozent|\bSterne?\b|\bErgebnis\b|\bNoten?\b|Rekord|geschafft|gemeistert|bestanden|\bSerie\b|in Folge|hintereinander|Pokal|Medaille|richtig|falsch|\d\s*%/i;
  for (const d of CODE_DATEIEN) {
    assert.ok(!muster.test(code[d]), `${d}: ${code[d].match(muster)?.[0]}`);
  }
  // Die Sterne und Pokale als Zeichen stehen auch nicht auf dem Bildschirm.
  assert.doesNotMatch(app + JSON.stringify(daten), /⭐|🌟|🏆|🥇|🏅/u);
});

test('externe Fakten: Normen, Studienzahlen, Recht, Geld und Erste-Hilfe-Angaben nur mit Quelle oder mit Vermerk', () => {
  // Eine Zeile mit einer positiven Behauptung dieser Art braucht eine Fundstelle („S. n“, „Praleska“)
  // oder den Vermerk „Eigenentwurf, fachlich nicht geprüft“. Zeilen, die etwas verneinen („keine
  // Studie“, „ohne Norm“), sind keine Behauptung. Die App macht keine solche Aussage; der Test hält das fest.
  const behauptung = /\b(EN \d|DIN\b|ISO \d|AWMF|BZgA|BIÖG|WHO\b|G-BA|§\s*\d|Richtlinie|Verordnung|Gesetz|Studie|randomis|Teilnehmer|Gegenstimme|Prozent|\d+\s*%|Erste[- ]Hilfe|Giftnotruf|Notruf|amtlich|Behörde|Förder|Zuschuss|Allerg|Fieber|Honig|Kleinteil|Magnet)/i;
  const verneint = /\b(kein|keine|keinen|keiner|ohne|nicht|nie)\b/i;
  const beleg = /Eigenentwurf, fachlich nicht geprüft|\(S\. \d|Praleska/;
  const befunde = [];
  for (const d of ALLE_DATEIEN) {
    alle[d].split('\n').forEach((zeile, i) => {
      if (behauptung.test(zeile) && !verneint.test(zeile) && !beleg.test(zeile)) befunde.push(`${d}:${i + 1}`);
    });
  }
  assert.deepEqual(befunde, [], `Behauptung ohne Quelle oder Vermerk: ${befunde.join(', ')}`);
});

test('docs/02 steht in README und GDD nur mit einer der Zeilenangaben Z. 22–24, Z. 79–82 oder Z. 141–146', () => {
  for (const doc of ['README.md', 'GDD.md']) {
    const genannt = alle[doc].match(/docs\/02(?![\d])/g) ?? [];
    const richtig = alle[doc].match(/docs\/02,? Z\. (?:22–24|79–82|141–146)(?![\d–])/g) ?? [];
    assert.ok(genannt.length >= 1, `${doc} nennt docs/02 nicht`);
    assert.equal(richtig.length, genannt.length, `${doc}: docs/02 ohne eine der drei Zeilenangaben`);
  }
  for (const d of CODE_DATEIEN) assert.doesNotMatch(code[d], /docs\/02/, `${d}: docs/02 gehört in die Dokumente`);
});

test('Zitate aus der Quelle: höchstens 6 Wörter, kein ganzer Satz; kyrillischer Text steht nur in den Daten, im Quellenhinweis und in den Dokumenten', () => {
  const kyrillisch = /\p{Script=Cyrillic}/u;
  let gezaehlt = 0;
  for (const d of [...CODE_DATEIEN, 'README.md', 'GDD.md']) {
    const text = d === 'README.md' || d === 'GDD.md' ? alle[d] : code[d];
    for (const m of text.matchAll(/„([^“]+)“/g)) {
      if (!kyrillisch.test(m[1])) continue;
      gezaehlt += 1;
      const woerter = m[1].trim().split(/\s+/).length;
      assert.ok(woerter <= 6, `${d}: Zitat mit ${woerter} Wörtern: „${m[1]}“`);
    }
  }
  assert.ok(gezaehlt >= 8, `nur ${gezaehlt} Zitate gefunden`);
  for (const b of daten.quelle.begriffe) assert.ok(b.trim().split(/\s+/).length <= 6, `Begriff „${b}“ zu lang`);
  // Nur die Daten, der Quellenhinweis auf dem Startbildschirm und die Dokumente tragen kyrillischen Text.
  for (const d of ['index.html', 'logik.mjs', 'druck.css']) assert.ok(!kyrillisch.test(code[d]), `${d}: kyrillischer Text`);
  assert.ok(!/\p{Script=Cyrillic}/u.test(funktion('blattInhalt') + funktion('druckBlatt')), 'kyrillischer Text im Druck');
});

test('Farbe ist nie der einzige Träger: jede Fläche hat ein Textlabel, jeder Fleck ist für Vorlesegeräte versteckt, jeder Knopf trägt den Namen als Text', () => {
  const flaeche = funktion('flaechenKnoten');
  assert.match(flaeche, /role: 'img'/);
  assert.match(flaeche, /'aria-label': `Farbfläche \$\{karte\.teile\[i\] \?\? karte\.name\}`/);
  assert.match(flaeche, /fws-flaechenname/, 'bei einem Paar steht der Name unter jeder Fläche');
  assert.match(funktion('chip'), /'aria-hidden': 'true'/);
  assert.match(app, /el\('span', \{\}, f\.de\)/, 'Wortknopf ohne Namen als Text');
  assert.match(app, /el\('span', \{\}, g\.name\)/, 'Gruppenknopf ohne Namen als Text');
});

test('Dokumente und Daten stimmen überein: Zahl der Farbwörter je Gruppe und Zahl der Farbwörter je Runde', () => {
  const je = (g) => daten.farbwoerter.filter((f) => f.gruppe === g).length;
  const m = alle['GDD.md'].match(/(\d+) Farbwörter \(warm (\d+), kalt (\d+), kontrast (\d+), neutral (\d+)\)/);
  assert.ok(m, 'GDD.md nennt die Zahl der Farbwörter nicht');
  assert.deepEqual(m.slice(1).map(Number), [daten.farbwoerter.length, je('warm'), je('kalt'), je('kontrast'), je('neutral')]);
  for (const doc of ['README.md', 'GDD.md']) {
    const zahlen = [...alle[doc].matchAll(/[Hh]öchstens (\d+) verschiedene/g)].map((x) => Number(x[1]));
    assert.ok(zahlen.length >= 1, `${doc} nennt die Zahl der Farbwörter je Runde nicht`);
    for (const n of zahlen) assert.equal(n, PRO_SITZUNG, `${doc} nennt ${n} Farbwörter je Runde, die Grenze ist ${PRO_SITZUNG}`);
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
  assert.equal(pkg.name, '@info70/farbwoerter-schatz');
  assert.match(pkg.scripts?.test ?? '', /node --test/);
});

// ---- Quelltext-Prüfungen von app.mjs: die Runde, die Auswahl, die Farbkarte, der Kyrillisch-Wächter ----------------------
// Die Logik-Tests prüfen die Hilfsfunktionen (rundeVoll, darfOeffnen, merkeAngesehen, alleKennungen, umschalten), nicht dass
// app.mjs sie benutzt. Die Rundengrenze ist das feste Sitzungslimit für 3 bis 5 Jahre (docs/10, Rechtsrahmen Punkt 2), die
// Auswahl-Knöpfe sind die Abnahme „Zahl gedruckter Karten gleich Auswahl“; beides muss ein Test in app.mjs festhalten.

test('Runde in der App: oeffneKarte lässt ein neues Farbwort nur zu, wenn darfOeffnen es erlaubt, und merkt es; gehe führt bei voller Runde zu Bildschirm aus; „neue Runde“ setzt zurück', () => {
  const oeffne = funktion('oeffneKarte');
  assert.match(oeffne, /if \(!darfOeffnen\(angesehen, id\)\) \{\s*gehe\('schluss'\);\s*return;\s*\}/);
  assert.match(oeffne, /angesehen = merkeAngesehen\(angesehen, id\);/);
  assert.match(funktion('gehe'), /schirm = rundeVoll\(angesehen\) && \(neu === 'gruppen' \|\| neu === 'liste'\) \? 'schluss' : neu;/);
  assert.match(funktion('schlussBildschirm'), /'data-kennung': 'schluss-neue-runde',\s*onclick: \(\) => \{ angesehen = \[\]; gehe\('gruppen'\); \},/);
});

test('Auswahl zum Drucken in der App: „Alle Karten wählen“ wählt alle, „Auswahl leeren“ leert, Vormerken und „Diese Karte nicht drucken“ schalten um, „Zurück“ geht dahin, woher der Druck geöffnet wurde', () => {
  const druck = funktion('druckBildschirm');
  assert.match(druck, /auswahl = alleKennungen\(farbwoerter\); render\(\);/);
  assert.match(druck, /auswahl = \[\]; render\(\);/);
  assert.match(druck, /onclick: \(\) => \{ auswahl = umschalten\(auswahl, blatt\.id\); render\(\); \},/);
  assert.match(funktion('karteBildschirm'), /onclick: \(\) => \{ auswahl = umschalten\(auswahl, f\.id\); render\(\); \},/);
  assert.match(druck, /onclick: \(\) => gehe\(druckVon\)/);
  assert.match(funktion('oeffneDruck'), /druckVon = von;/);
  // Jeder Weg zum Druck nennt seinen eigenen Bildschirm als Herkunft.
  assert.match(funktion('gruppenBildschirm'), /onclick: \(\) => oeffneDruck\('gruppen'\)/);
  assert.match(funktion('karteBildschirm'), /onclick: \(\) => oeffneDruck\('karte'\)/);
  assert.match(funktion('schlussBildschirm'), /onclick: \(\) => oeffneDruck\('schluss'\)/);
});

test('Farbkarte und Start in der App zeigen Hinweis, Grenzfall-Satz, Hinweise für Erwachsene und den Satz für eine leere Gruppe; die Wege Start, Gruppe, Liste, Karte reichen die Wahl weiter', () => {
  const karte = funktion('karteBildschirm');
  assert.match(karte, /el\('p', \{ class: 'fws-hinweis' \}, karte\.hinweis\)/);
  assert.match(karte, /karte\.grenzfall \? el\('p', \{ class: 'k-hinweis' \}, karte\.grenzfall\) : null/);
  assert.match(funktion('startBildschirm'), /daten\.start\.erwachsene\.map\(/);
  assert.match(funktion('listeBildschirm'), /Für diese Gruppe gibt es noch keine Farbwörter\./);
  // Die Zahl der Farbwörter je Runde im Hinweis für Erwachsene kommt aus PRO_SITZUNG, nicht aus einer festen Zahl.
  assert.match(funktion('startBildschirm'), /t\.replace\('\{n\}', String\(PRO_SITZUNG\)\)/);
  // Vom Start in die Gruppen; der Gruppenknopf trägt die Gruppe in die Liste, die Liste zeigt nur diese Gruppe,
  // der Wortknopf trägt das Farbwort in die Karte, die Karte zeigt genau dieses Farbwort.
  assert.match(funktion('startBildschirm'), /'data-kennung': 'start-los',\s*onclick: \(\) => gehe\('gruppen'\),/);
  assert.match(funktion('gruppenBildschirm'), /onclick: \(\) => gehe\('liste', \{ gruppeId: g\.id \}\),/);
  assert.match(funktion('listeBildschirm'), /const liste = gruppeFuer\(farbwoerter, gruppeId\);/);
  assert.match(funktion('listeBildschirm'), /\.\.\.liste\.map\(\(f\) => el\('button', \{[\s\S]*?onclick: \(\) => oeffneKarte\(f\.id\),/);
  assert.match(funktion('oeffneKarte'), /gehe\('karte', \{ wortId: id \}\);/);
  assert.match(funktion('gehe'), /if \(extra\.wortId !== undefined\) wortId = extra\.wortId;/);
  assert.match(karte, /const f = nachId\(wortId\);\s*const karte = farbkarte\(f\);/);
  // Von der Karte geht es weiter in die Liste, bei voller Runde zu Bildschirm aus; ein Paar zeigt beide Flächen mit Namen.
  assert.match(karte, /onclick: \(\) => \(voll \? gehe\('schluss'\) : gehe\('liste'\)\),/);
  assert.match(funktion('flaechenKnoten'), /\.\.\.karte\.flaeche\.map\(\(farbe, i\) =>/);
  assert.match(funktion('flaechenKnoten'), /karte\.teile\.length \? el\('p', \{ class: 'fws-flaechenname' \}, karte\.teile\[i\]\) : null/);
});

test('kyrillischer Text: in allen Dateien der App nur die erlaubten Begriffe und Titel, nirgends ein Satz oder Auszug aus der Quelle (auch ohne Anführungszeichen)', () => {
  const erlaubt = new Set([
    'вишневый', 'салатовый', 'малиновый', 'лимонный', 'абрикосовый', 'цвет морской волны', 'и т. д.', // Begriffe, S. 178
    'Рисование', 'ПОЧЕМУЧКИ', 'НИО', 'четвертый—пятый годы жизни', // Abschnitt, Gruppe, Verlag, Altersangabe (S. 103)
    'проверено человеком', 'Контент-паки к существующим приложениям', // Regel (Seitenmarke), Abschnitt des Katalogs
  ]);
  const fremd = [];
  // Ein Lauf beginnt und endet mit einem kyrillischen Buchstaben; ein einzelner Buchstabe wie in „28а“ ist kein Lauf.
  for (const [d, text] of Object.entries(alle)) {
    for (const m of text.matchAll(/\p{Script=Cyrillic}[\p{Script=Cyrillic}\s—–.-]*\p{Script=Cyrillic}\.?/gu)) {
      const lauf = m[0].replace(/\s+/g, ' ').trim();
      if (!erlaubt.has(lauf)) fremd.push(`${d}: ${lauf}`);
    }
  }
  assert.deepEqual(fremd, [], `kyrillischer Text außerhalb der erlaubten Begriffe: ${fremd.join(' | ')}`);
});
