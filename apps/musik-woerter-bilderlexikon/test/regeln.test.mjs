import { test } from 'node:test';
import assert from 'node:assert/strict';
import { access, readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import daten from '../daten/begriffe.json' with { type: 'json' };
import { blaetterFuer, blattText, fuelle } from '../logik.mjs';
import { appGruende } from '../../../packages/kinderschutz/src/bewertung-stand.mjs';
import { fundstellen } from '../../../packages/kinderschutz/src/externe-fakten.mjs';
import { appLeistungsTreffer } from '../../../packages/kinderschutz/src/leistungs-woerter.mjs';
import { speicherBefund, verletzung } from '../../../packages/kinderschutz/src/speicher-regel.mjs';
import { appBefund, hatMarke, hatSeitenangabe } from '../../../packages/kinderschutz/src/seitenmarke.mjs';

// Projektregeln, für diese App geprüft: docs/02 Z. 22–24 (keine Anfragen nach außen),
// docs/02 Z. 79–82 (Druckbögen), docs/02 Z. 141–146 (keine Bewertung von Kindern);
// die Speicherregel, die Seitenregel und die Zufallsregel haben keine docs/02-Zeile, sie sind Projektregeln
// und Entscheidungen von Max. Die Prüfung liest die Dateien der App (ohne test/).
// Die Testdateien selbst dürfen die verbotenen Wörter nennen, um sie zu verbieten.

const APP = new URL('../', import.meta.url);
const WURZEL = fileURLToPath(new URL('../../../', import.meta.url));
const APP_ORDNER = fileURLToPath(APP).replace(/\/$/, '');
const CODE_DATEIEN = ['index.html', 'app.mjs', 'logik.mjs', 'druck.css', 'daten/begriffe.json'];
const ALLE_DATEIEN = [...CODE_DATEIEN, 'package.json', 'README.md', 'GDD.md'];
const PFLICHT = 'Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.';
const VERMERK_SPRACHEN = 'uk und ru: nicht vorhanden, offen.';

const lese = (datei) => readFile(new URL(datei, APP), 'utf8');
const code = Object.fromEntries(await Promise.all(CODE_DATEIEN.map(async (d) => [d, await lese(d)])));
const alle = Object.fromEntries(await Promise.all(ALLE_DATEIEN.map(async (d) => [d, await lese(d)])));
// Code ohne Kommentare: Kommentare dürfen die Wörter nennen, die der Code nicht benutzt.
const ohneKommentare = (t) => t.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:\w])\/\/.*$/gm, '$1');
const app = ohneKommentare(code['app.mjs']);
const logik = ohneKommentare(code['logik.mjs']);

// Die Attributobjekte aller Aufrufe el('tag', { ... }) im Quelltext, mit Klammerzählung (auch verschachtelte Objekte).
function elementLiterale(quelle) {
  const funde = [];
  for (const m of quelle.matchAll(/el\('([a-z0-9]+)', \{/g)) {
    let tiefe = 1;
    let i = m.index + m[0].length;
    const start = i;
    while (i < quelle.length && tiefe > 0) {
      if (quelle[i] === '{') tiefe += 1;
      else if (quelle[i] === '}') tiefe -= 1;
      i += 1;
    }
    funde.push({ tag: m[1], attribute: quelle.slice(start, i - 1) });
  }
  return funde;
}

// Der Aufruf knopf(<Kennung> …) samt Klammern, mit Klammerzählung. Die Kennung steht so im Quelltext, zum Beispiel
// "'druck-leeren'" oder eine Vorlage mit Platzhalter. Leer, wenn es den Aufruf nicht gibt: dann schlägt jede Prüfung an.
function knopfAufruf(quelle, kennung) {
  const start = quelle.indexOf(`knopf(${kennung}`);
  if (start < 0) return '';
  let tiefe = 0;
  for (let i = start + 'knopf'.length; i < quelle.length; i += 1) {
    if (quelle[i] === '(') tiefe += 1;
    else if (quelle[i] === ')') {
      tiefe -= 1;
      if (tiefe === 0) return quelle.slice(start, i + 1);
    }
  }
  return '';
}

// Alle 23 Blätter, so wie sie gedruckt werden.
const kennungen = daten.begriffe.map((b) => b.id);
const blaetter = blaetterFuer(daten, kennungen);
const blattTexte = blaetter.map((b) => blattText(b, daten));

test('keine Eingabefelder für Kinder: kein input, textarea, select, form, contenteditable', () => {
  const muster = /<\s*(input|textarea|select|form)\b|contenteditable|(el|createElement)\(\s*['"](input|textarea|select|form)['"]/i;
  for (const d of ['index.html', 'app.mjs']) {
    assert.ok(!muster.test(code[d]), `${d}: Eingabeelement gefunden`);
  }
  assert.ok(!/<img[^>]*\sonerror|\sonload=/i.test(code['index.html']));
});

test('keine Speicherung: kein localStorage, sessionStorage, IndexedDB, Cookie oder Cache', () => {
  const muster = /localStorage|sessionStorage|indexedDB|document\.cookie|\bcaches\b|navigator\.storage|\.setItem\(|speicherSchluessel/;
  for (const d of CODE_DATEIEN) {
    assert.ok(!muster.test(code[d]), `${d}: Speicher-Zugriff gefunden`);
  }
});

test('Speicherregel: die App speichert nichts, darum hat sie keine Karte „Meine Daten löschen“ (Befund aus packages/kinderschutz)', () => {
  const befund = speicherBefund(`${code['app.mjs']}\n${code['logik.mjs']}`);
  assert.deepEqual(befund, { speichert: false, loeschbar: false, karte: false });
  assert.equal(verletzung(befund), null);
  assert.ok(!/daten-karte|datenKarte|Meine Daten löschen|Alle Daten löschen|Alles löschen|removeItem|localStorage\.clear/.test(code['app.mjs'] + code['logik.mjs']));
  // Kontrolle: das Gegenteil wird erkannt.
  assert.equal(verletzung(speicherBefund("localStorage.setItem('x', '1');")), 'speichert ohne Löschknopf');
});

test('keine externen Adressen, keine Netzaufrufe in den Dateien der App, kein @import', () => {
  const netz = /\bfetch\s*\(|XMLHttpRequest|WebSocket|sendBeacon|EventSource|importScripts|new Worker|window\[|globalThis|wss?:/;
  for (const d of CODE_DATEIEN) {
    assert.ok(!/https?:\/\/|(?<![:\w])\/\/[\w-]+\.[a-z]{2,}/i.test(code[d]), `${d}: externe Adresse`);
  }
  for (const d of ['app.mjs', 'logik.mjs']) {
    assert.ok(!netz.test(code[d]), `${d}: Netzaufruf gefunden`);
  }
  assert.ok(!/@import|url\(/.test(code['druck.css']), 'druck.css: @import oder url()');
});

test('kein Zufall und keine Uhr in der ganzen App: weder Math.random noch crypto, Date, Zeitgeber', () => {
  const muster = /Math\.random|crypto|Date\.now|new Date|performance\.|setTimeout|setInterval|requestAnimationFrame/;
  for (const d of CODE_DATEIEN) {
    assert.ok(!muster.test(code[d]), `${d}: Zufall oder Uhr`);
  }
  // Die Reihenfolge ist die der Datei: die Auswahl sortiert nach Datei, nicht nach Klickreihenfolge.
  assert.ok(logik.includes('begriffe.filter((b) => gewaehlt.has(b.id))'));
});

test('die Wörter kommen per JSON-Import mit Typangabe, die Oberfläche lädt nichts nach', () => {
  assert.match(code['app.mjs'], /^import daten from '\.\/daten\/begriffe\.json' with \{ type: 'json' \};$/m);
  assert.ok(!/\bimport\(/.test(app), 'kein dynamischer Import');
});

test('Grundgerüst: deutsch, Viewport, CSP exakt, nur eigene Stylesheets, Favicon auf der Zeile des Stylesheets, ein Modul-Skript', () => {
  const html = code['index.html'];
  assert.match(html, /<html lang="de">/);
  assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1"/);
  assert.match(html, /<meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline'"/);
  assert.match(html, /<noscript>/);
  assert.match(html, /<title>Musik-Wörter-Bilderlexikon<\/title>/);
  const links = [...html.matchAll(/<link rel="stylesheet"[^>]*href="([^"]+)"/g)].map((m) => m[1]);
  // Jeder andere Link ist genau das gemeinsame Favicon (gleicher Ursprung, Entscheidung Max 21а): nichts Fremdes.
  const andereLinks = [...html.matchAll(/<link(?![^>]*rel="stylesheet")[^>]*>/g)].map((m) => m[0]);
  assert.ok(andereLinks.every((l) => /^<link rel="icon" type="image\/svg\+xml" href="(?:\.\.\/\.\.\/)?packages\/kinder-ui\/img\/favicon\.svg" \/>$/.test(l)), `index.html: fremder Link ${andereLinks.join(' ')}`);
  assert.equal(andereLinks.length, 1, 'genau ein Favicon');
  assert.deepEqual(links, ['../../packages/kinder-ui/css/kinder.css', 'druck.css']);
  assert.ok(html.split('\n').includes('  <link rel="stylesheet" href="../../packages/kinder-ui/css/kinder.css" /><link rel="icon" type="image/svg+xml" href="../../packages/kinder-ui/img/favicon.svg" />'), 'Stylesheet und Favicon auf derselben Zeile');
  const skripte = [...html.matchAll(/<script[^>]*src="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(skripte, ['app.mjs']);
  assert.match(html, /<script type="module" src="app\.mjs"><\/script>/);
  assert.ok(!/<img|<iframe|<object|<embed|<video|<audio|<source/i.test(html), 'index.html lädt kein Medium; die Bilder setzt die App aus den Daten');
});

test('aria-live="polite" auf #app; der Hauptbereich ist ein Bildschirmteil, der Druckbereich liegt außerhalb davon', () => {
  const tag = code['index.html'].match(/<main[^>]*id="app"[^>]*>/)?.[0];
  assert.ok(tag, '<main id="app"> fehlt');
  assert.match(tag, /aria-live="polite"/);
  assert.match(tag, /class="[^"]*lk-nur-bildschirm/);
  const nachMain = code['index.html'].split('</main>')[1];
  assert.match(nachMain, /<div class="lk-nur-druck" id="druckbereich"><\/div>/, 'der Druckbereich steht hinter dem Hauptbereich');
});

test('Netzwerk-Wächter: aus packages/kinderschutz importiert und aufgerufen', async () => {
  assert.match(code['app.mjs'], /import \{ installiereNetzwerkWaechter \} from '\.\.\/\.\.\/packages\/kinderschutz\/src\/index\.mjs';/);
  assert.match(code['app.mjs'], /^installiereNetzwerkWaechter\(\);$/m);
  await access(new URL('../../../packages/kinderschutz/src/index.mjs', import.meta.url));
});

test('keine Druckzeichen: keine Häkchen, Kästchen, Sterne, Punkte als Zeichen, Pfeile, keine Emojis (Blätter und Dateien)', () => {
  // Zeichenblöcke statt Aufzählung: Pfeile, Math-Zeichen, Dingbats, geometrische Formen, Emojis.
  const zeichen = /[☐☒☑✓✔✗✘✅❌★☆•●○◦·∙‧▪▫◾◽■□]|[←-⋿⌀-➿⦀-⧿⬀-⯿■-◿・]|\p{Extended_Pictographic}/u;
  assert.equal(blattTexte.length, 23);
  for (const [i, text] of blattTexte.entries()) {
    assert.ok(!zeichen.test(text), `Blatt ${i} (${blaetter[i].wort}): Druckzeichen im Drucktext`);
  }
  for (const d of CODE_DATEIEN) {
    assert.ok(!zeichen.test(code[d]), `${d}: Druckzeichen gefunden`);
  }
  // Kontrolle: die Prüfung findet, was sie finden soll.
  for (const schlecht of ['☐', '✓', '★', '·', '→', '🎵']) assert.ok(zeichen.test(schlecht), schlecht);
});

test('Druckblatt ohne Namenszeile und ohne Tages- oder Wochentagsfeld', () => {
  // „Name“ auch in Zusammensetzungen (Vorname, Nachname, Namensfeld); „Namen“ im Fließtext bleibt erlaubt.
  const namenUndTage = /Name(?!n\b)|Datum|Wochentag|\b(Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag|Sonntag)\b|\bTage?\b|_{3,}|…{2,}/i;
  for (const [i, text] of blattTexte.entries()) {
    assert.ok(!namenUndTage.test(text), `Blatt ${i} (${blaetter[i].wort}): Namenszeile oder Tagesfeld im Druck`);
  }
  assert.ok(!/Name\s*:|_{3,}/.test(code['app.mjs'] + code['druck.css']), 'app.mjs oder druck.css: Namenszeile');
  // Das Blatt hat genau diese Teile: Kopf, Thema, Wort, Bild, Erklärung, Vermerk; kein Feld zum Beschriften.
  const blatt = app.match(/function blattKnoten\([\s\S]*?\n\}/)?.[0] ?? '';
  assert.deepEqual([...blatt.matchAll(/'(lk-blatt[a-z-]*)'/g)].map((m) => m[1]), ['lk-blatt', 'lk-blatt-kopf', 'lk-blatt-thema', 'lk-blatt-wort', 'lk-blatt-bild', 'lk-blatt-text', 'lk-blatt-vermerk']);
});

test('keine Seitenzahl der Quelle auf dem Blatt (A18-Standard) und darum keine Pflichtmarkierung auf dem Blatt', () => {
  for (const [i, text] of blattTexte.entries()) {
    assert.ok(!hatSeitenangabe(text), `Blatt ${i}: Seitenangabe auf dem Blatt`);
    assert.ok(!hatMarke(text), `Blatt ${i}: Marke ohne Seitenangabe`);
  }
  const blatt = app.match(/function blattKnoten\([\s\S]*?\n\}/)?.[0] ?? '';
  assert.ok(!/quelle|seite|pflichtmarkierung/i.test(blatt), 'blattKnoten liest keine Quelle');
  assert.ok(!/quelle|seite|pflichtmarkierung/i.test(logik.match(/export function blattText[\s\S]*?\n\}/)?.[0] ?? ''), 'blattText liest keine Quelle');
});

test('Marke bei der Quelle: Fuß und Ansicht für Erwachsene tragen sie dort, wo die Seiten stehen; nie „von Hand geprüft“', () => {
  assert.equal(daten.pflichtmarkierung, PFLICHT);
  // Der Fuß steht auf jedem Bildschirm und nennt die Quelle mit Seite zusammen mit der Marke in einem Absatz.
  assert.match(app, /el\('p', \{\}, `\$\{T\.fuss\.quelle\} \$\{daten\.pflichtmarkierung\}`\)/, 'Fuß: Quelle und Marke in einem Absatz');
  assert.match(daten.texte.fuss.quelle, /Praleska, S\. 260/);
  assert.equal(`${daten.texte.fuss.quelle} ${daten.pflichtmarkierung}`, 'Quelle der Wortliste: Praleska, S. 260. Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.');
  // In der Ansicht für Erwachsene steht die Marke bei jedem Abschnitt mit einer Seitenangabe.
  const ansicht = app.match(/function ansichtErwachsene\([\s\S]*?\n\}/)?.[0] ?? '';
  assert.match(ansicht, /a\.marke \? el\('p', \{ class: 'lk-marke' \}, daten\.pflichtmarkierung\) : null/);
  for (const a of daten.texte.erwachsene.abschnitte) {
    const text = a.absaetze.map((t) => fuelle(t, { ...daten.quelle, sprachen: daten.sprachen })).join(' ');
    assert.equal(Boolean(a.marke), hatSeitenangabe(text), `Abschnitt „${a.titel}“: Marke und Seitenangabe passen nicht zusammen`);
  }
  assert.ok(daten.texte.erwachsene.abschnitte.some((a) => a.marke), 'mindestens ein Abschnitt trägt die Marke');
  for (const [d, inhalt] of Object.entries(alle)) {
    assert.ok(!/von Hand geprüft/i.test(inhalt), `${d}: „von Hand geprüft“ ist nicht belegt`);
  }
});

test('Pflichtmarkierung in README und GDD (unter „## Offen“); die Prüfung des Pakets findet die Marke bei den Seitenangaben', async () => {
  assert.ok(alle['README.md'].includes(PFLICHT), 'README.md: Pflichtmarkierung fehlt');
  const gdd = alle['GDD.md'];
  assert.ok(gdd.includes('## Offen'), 'GDD.md: Abschnitt „## Offen“ fehlt');
  assert.ok(gdd.slice(gdd.indexOf('## Offen')).includes(PFLICHT), 'GDD.md: Pflichtmarkierung nicht unter „## Offen“');
  // Dieselbe Prüfung wie packages/kinderschutz/test/seitenmarke.test.mjs: die App steht nicht in docs/seitenmarke-stand.json.
  const befund = await appBefund(APP_ORDNER);
  assert.ok(befund.seiten.includes('daten/begriffe.json'), 'die Seiten stehen in den Daten');
  assert.equal(befund.marke, true, 'die Marke fehlt in den Nutzerdateien');
  const stand = JSON.parse(await readFile(new URL('../../../docs/seitenmarke-stand.json', import.meta.url), 'utf8'));
  assert.ok(!('musik-woerter-bilderlexikon' in stand.apps) && !('musik-woerter-bilderlexikon' in (stand.ausnahmen ?? {})), 'die App braucht keinen Eintrag im Stand');
});

test('Eigenentwurf-Kennzeichnung: jedes Blatt und jede Ansicht (im Fuß) nennt den Eigenentwurf; Wort, Erklärung und Bild sind nicht aus der Quelle', () => {
  for (const [i, text] of blattTexte.entries()) {
    assert.match(text, /Eigenentwurf, fachlich nicht geprüft/, `Blatt ${i}: ohne Kennzeichnung`);
  }
  assert.equal(daten.eigenentwurf, 'Wort, Erklärung und Bild: Eigenentwurf, fachlich nicht geprüft.');
  assert.match(app, /el\('p', \{ class: 'lk-blatt-vermerk' \}, daten\.eigenentwurf\)/, 'der Vermerk steht im Blatt');
  // Der Fuß trägt den Vermerk und schließt jede Ansicht ab. Auch Start, Liste und Instrumente zeigen Wörter, Bilder und
  // Erklärungen, die nicht aus der Quelle sind; die erwachsene Person liest die Instrumente vor (Lernziel 2).
  const fussRumpf = app.match(/function fuss\(\) \{[\s\S]*?\n\}\n/)?.[0] ?? '';
  assert.match(fussRumpf, /el\('footer', \{ class: 'k-fuss' \}/);
  assert.match(fussRumpf, /el\('p', \{\}, daten\.eigenentwurf\)/, 'der Vermerk steht im Fuß');
  const ansichten = [...app.matchAll(/function (ansicht\w+)\([^)]*\) \{([\s\S]*?)\n\}\n/g)];
  assert.deepEqual(ansichten.map((m) => m[1]), ['ansichtStart', 'ansichtListe', 'ansichtKarte', 'ansichtInstrumente', 'ansichtDruck', 'ansichtErwachsene']);
  for (const [, name, rumpf] of ansichten) {
    assert.match(rumpf, /\n    fuss\(\),\n  \];$/, `${name}: ohne Fuß und damit ohne den Vermerk`);
  }
  // Im Code steht der Vermerk an genau zwei Stellen, im Blatt und im Fuß: keine Ansicht baut ihn ein zweites Mal.
  assert.equal((app.match(/daten\.eigenentwurf/g) ?? []).length, 2, 'der Vermerk steht nur im Blatt und im Fuß');
  assert.ok(daten.begriffe.every((b) => b.eigenentwurf === true));
  assert.match(JSON.stringify(daten.texte.erwachsene), /Eigenentwurf, fachlich nicht geprüft/);
  assert.ok(daten.sprachen.includes('nicht vorhanden'));
});

test('druck.css: A4 hoch, Bildschirmteile nur im Bildschirm, jedes Blatt eine Seite; Titel bricht um, Fuß-Link 48 px hoch', () => {
  const css = code['druck.css'];
  assert.match(css, /@media print \{/);
  assert.match(css, /@page\s*\{\s*size: A4 portrait;/);
  assert.match(css, /\.lk-nur-bildschirm\s*\{\s*display: none !important;\s*\}/);
  assert.match(css, /\.lk-nur-druck\s*\{\s*display: none;\s*\}/);
  assert.match(css, /\.lk-nur-druck\s*\{\s*display: block;\s*\}/);
  assert.match(css, /break-after: page;/);
  assert.match(css, /page-break-after: always;/);
  assert.match(css, /break-inside: avoid;/);
  assert.match(css, /\.lk-blatt:last-child\s*\{[^}]*break-after: auto;/, 'nach dem letzten Blatt kein Umbruch');
  // Bei 360 px: die Überschrift bricht innerhalb eines Wortes um.
  assert.match(css, /h1\.k-titel\s*\{[^}]*overflow-wrap:\s*anywhere;[^}]*word-break:\s*normal;/);
  // Fuß-Link: mindestens 48 px hoch (Touch-Ziel); 44 px reichen nicht.
  assert.match(css, /\.k-fuss a\s*\{[^}]*min-height:\s*48px;/);
  assert.doesNotMatch(css, /\.k-fuss a\s*\{[^}]*min-height:\s*44px;/);
  assert.match(code['app.mjs'], /el\('a', \{ href: '\.\.\/\.\.\/impressum\.html' \}, T\.fuss\.impressum\)/);
  assert.equal(daten.texte.fuss.impressum, 'Impressum und Datenschutz');
});

test('Knöpfe mindestens 48 px hoch: .k-knopf hat min-height 3rem, keine Regel dieser App macht einen Knopf niedriger (Touch-Ziel)', async () => {
  const kinderCss = await readFile(new URL('../../../packages/kinder-ui/css/kinder.css', import.meta.url), 'utf8');
  assert.match(kinderCss, /\.k-knopf\s*\{[^}]*min-height:\s*3rem;/);
  assert.match(kinderCss, /\.k-knopf--klein\s*\{[^}]*min-height:\s*3rem;/);
  const css = code['druck.css'].replace(/\/\*[\s\S]*?\*\//g, '');
  const niedrig = [];
  for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (!/k-knopf|button|lk-bildknopf|lk-chips/.test(m[1])) continue;
    for (const h of m[2].matchAll(/(?:^|[;\s])((?:min-|max-)?height)\s*:\s*([\d.]+)(rem|px)/g)) {
      const px = h[3] === 'rem' ? Number(h[2]) * 18 : Number(h[2]);
      if (px < 48) niedrig.push(`${m[1].trim()}: ${h[1]} ${h[2]}${h[3]}`);
    }
  }
  assert.deepEqual(niedrig, [], 'ein Knopf ist niedriger als 48 px');
  assert.match(css, /\.k-knopf\.lk-bildknopf\s*\{[^}]*min-height:\s*4rem;/, 'die Bildknöpfe sind mindestens 4rem hoch');
  // Der Knopf ist ein Knopf: nicht ein Link, kein Absatz und kein Bild mit Klick.
  const mitKlick = elementLiterale(app).filter((e) => /onclick/.test(e.attribute)).map((e) => e.tag);
  assert.deepEqual(mitKlick, ['button'], `nur der Knopf in knopf() trägt onclick, gefunden: ${mitKlick.join(', ')}`);
  // Kontrolle: das Gegenteil wird erkannt.
  assert.deepEqual(elementLiterale("el('div', { onclick: () => f() }, 'x')").map((e) => e.tag), ['div']);
});

test('Instrumentenansicht: zeigt genau die sieben Instrumente der Quelle, je mit Bild, Erklärung und Vorlesen; sie ist von der Liste und vom Start aus erreichbar', () => {
  const ansicht = app.match(/function ansichtInstrumente\([\s\S]*?\n\}\n/)?.[0] ?? '';
  assert.match(ansicht, /const instrumente = begriffeFuer\(BEGRIFFE, 'instrument'\);/);
  assert.match(ansicht, /\.\.\.instrumente\.map\(\(b, i\) =>/);
  for (const teil of ["bild(b.bild, b.bildText, 'lk-bild-mittel')", 'karten[i].erklaerung', 'vorleseKnopf(`vorlesen-${b.id}`', "el('h2', { id: `instrument-${b.id}`"]) {
    assert.ok(ansicht.includes(teil), `Instrumentenansicht ohne ${teil}`);
  }
  const sieben = daten.begriffe.filter((b) => b.kategorie === 'instrument' && b.quelle?.seite === 'S. 260');
  assert.equal(sieben.length, 7, 'sieben Instrumente mit S. 260');
  // Zugänge: Start (Kasten für Erwachsene) und Liste der Instrumente.
  assert.match(app, /knopf\('start-instrumente', S\.instrumente, \{ neutral: true, onclick: \(\) => gehe\(\{ ansicht: 'instrumente' \}\) \}\)/);
  assert.match(app, /id === 'instrument'\s*\n\s*\? knopf\('liste-instrumente'/);
  assert.equal(daten.texte.start.instrumente, daten.texte.liste.instrumente);
});

test('Druckbereich: nur die gewählten Blätter, die Vorschau ist nur im Hauptbereich; Drucken ist aus, solange nichts gewählt ist', () => {
  assert.match(app, /druckBox\.replaceChildren\(\.\.\.blaetterFuer\(daten, auswahl\)\.map\(blattKnoten\)\);/);
  assert.match(app, /const druckBox = document\.getElementById\('druckbereich'\);/);
  assert.match(app, /\.\.\.blaetter\.map\(blattKnoten\)\)\s*\n\s*: null,/, 'die Vorschau baut dieselben Blätter');
  assert.match(app, /disabled: !kannDrucken\(gewaehlte\), onclick: \(\) => window\.print\(\)/);
  assert.equal((app.match(/window\.print\(\)/g) ?? []).length, 1, 'ein Druckknopf');
  assert.match(app, /ariaDisabled: n === 0/, '„Auswahl leeren“ bleibt fokussierbar');
  // Eine Karte ohne Auswahl macht kein Blatt: die Auswahl liegt nur im Arbeitsspeicher.
  assert.match(app, /^let auswahl = new Set\(\);$/m);
  // Die Vorschau ist für Hilfstechnik verborgen: die Blätter stehen schon im Druckbereich, und die Knöpfe oben nennen die Auswahl.
  assert.match(app, /el\('section', \{ class: 'lk-vorschau', 'aria-hidden': 'true' \},/, 'die Vorschau trägt aria-hidden');
  // Jede Auswahl ändert die Menge im Arbeitsspeicher und baut die Ansicht neu auf. Der Browser-Lauf (tools/browser-tor.mjs)
  // klickt „Für den Druck wählen“ und „Auswahl leeren“ nicht; darum steht hier, was ihr Klick tut.
  const waehlen = knopfAufruf(app, "'karte-waehlen'");
  assert.match(waehlen, /onclick: \(\) => \{ auswahl = schalte\(auswahl, b\.id\); render\(\); \}/, '„Für den Druck wählen“ schaltet dieses Wort um');
  const wort = knopfAufruf(app, '`druck-wort-${b.id}`');
  assert.match(wort, /onclick: \(\) => \{ auswahl = schalte\(auswahl, b\.id\); render\(\); \}/, 'der Knopf eines Wortes schaltet dieses Wort um');
  const alleWaehlen = knopfAufruf(app, '`druck-alle-${k.id}`');
  assert.match(alleWaehlen, /onclick: \(\) => \{ auswahl = schalteKategorie\(auswahl, BEGRIFFE, k\.id\); render\(\); \}/, '„Alle wählen“ schaltet die Wörter dieses Themas um');
  const leeren = knopfAufruf(app, "'druck-leeren'");
  assert.match(leeren, /onclick: \(\) => \{ auswahl = new Set\(\); render\(\); \}/, '„Auswahl leeren“ leert die Auswahl');
  // „Karten drucken“ auf der Karte führt zur Druckseite (der Browser-Lauf klickt auch diesen Knopf nicht).
  assert.match(knopfAufruf(app, "'karte-drucken'"), /onclick: \(\) => gehe\(\{ ansicht: 'druck' \}\)/, '„Karten drucken“ auf der Karte öffnet die Druckseite');
  // Kontrolle: der Hilfsaufruf findet den Knopf samt Klick und liefert leer, wenn es ihn nicht gibt.
  assert.equal(knopfAufruf("knopf('a', 'x', { onclick: () => { f(); } }), knopf('b')", "'a'"), "knopf('a', 'x', { onclick: () => { f(); } })");
  assert.equal(knopfAufruf('knopf(\'a\')', "'b'"), '');
});

test('Fokus nach Klick: jeder Knopf entsteht in knopf() und trägt eine data-kennung; die Kennungen sind je Ansicht eindeutig; render() merkt sich den Fokus und setzt ihn zurück', () => {
  const knoepfe = app.match(/el\('button'/g) ?? [];
  const kennungen = app.match(/'data-kennung': /g) ?? [];
  assert.equal(knoepfe.length, 1, 'alle Knöpfe entstehen in knopf()');
  assert.equal(kennungen.length, knoepfe.length, `${knoepfe.length} Knöpfe, aber ${kennungen.length} data-kennung`);
  assert.match(app, /'data-kennung': kennung,/);
  // Kennungen je Ansicht: feste eindeutig, die mit Platzhalter haben ein eigenes Präfix.
  const ansichten = [...app.matchAll(/function (ansicht\w+)\([^)]*\) \{([\s\S]*?)\n\}\n/g)];
  assert.ok(ansichten.length >= 6, `nur ${ansichten.length} Ansichten gefunden`);
  const praefixe = new Map();
  for (const [, name, rumpf] of ansichten) {
    const feste = [];
    for (const m of rumpf.matchAll(/(?:knopf|vorleseKnopf|zurueck)\(\s*(['`])([^'`]+)\1/g)) {
      if (m[2].includes('${')) {
        const p = m[2].replace(/\$\{[^}]*\}.*$/, '');
        assert.ok(p.length >= 4, `${name}: Kennung „${m[2]}“ ohne eigenes Präfix`);
        praefixe.set(`${name}:${p}`, (praefixe.get(`${name}:${p}`) ?? 0) + 1);
      } else {
        feste.push(m[2]);
      }
    }
    assert.equal(new Set(feste).size, feste.length, `${name}: doppelte feste data-kennung (${feste.join(', ')})`);
    assert.ok(feste.length + [...praefixe.keys()].filter((k) => k.startsWith(`${name}:`)).length >= 1, `${name}: kein Knopf mit Kennung`);
  }
  // Kennungen mit demselben Wort auf zwei Ansichten gibt es nur bei „vorlesen“ (ein Klick ändert die Ansicht nicht).
  const alleFesten = ansichten.flatMap(([, , rumpf]) => [...rumpf.matchAll(/(?:knopf|zurueck)\(\s*'([^'$]+)'/g)].map((m) => m[1]));
  const doppelt = alleFesten.filter((k, i) => alleFesten.indexOf(k) !== i);
  assert.deepEqual([...new Set(doppelt)], [], 'dieselbe feste Kennung auf zwei Ansichten');
  assert.match(app, /function fokussiere\(kennung\)/);
  assert.match(app, /button\[data-kennung\]/, 'fokussiere sucht nur Knöpfe mit data-kennung');
  const merke = app.indexOf('const merkeKennung = document.activeElement?.dataset?.kennung;');
  const neu = app.indexOf('app.replaceChildren(');
  const zurueck = app.indexOf('fokussiere(merkeKennung);');
  assert.ok(merke > -1 && neu > merke && zurueck > neu, 'Fokus muss vor replaceChildren gemerkt und danach gesetzt werden');
});

test('Fokus nach einem Wechsel der Ansicht: die Überschrift trägt tabindex -1 und bekommt den Fokus; Wechsel zwischen Wörtern lässt ihn auf dem Knopf', () => {
  assert.match(app, /const titel = \(text\) => el\('h1', \{ class: 'k-titel lk-titel', tabindex: '-1' \}, text\);/);
  assert.match(app, /if \(ziel === 'titel' \|\| \(aufTitel && !merkeKennung\)\) app\.querySelector\('\.lk-titel'\)\?\.focus\(\);/);
  assert.match(app, /function gehe\(neu, ziel = 'titel'\)/);
  assert.match(app, /render\(ziel\);/);
  // Jede Ansicht beginnt mit einer Überschrift der Klasse lk-titel (die Karte mit einer Themenzeile davor).
  const ansichten = [...app.matchAll(/function (ansicht\w+)\([^)]*\) \{([\s\S]*?)\n\}\n/g)].filter(([, n]) => n !== 'ansicht');
  for (const [, name, rumpf] of ansichten) assert.ok(/\btitel\(/.test(rumpf), `${name}: keine Überschrift`);
  // Nur „Vorheriges“ und „Nächstes Wort“ bleiben auf dem Knopf; alle anderen Wechsel gehen auf die Überschrift.
  assert.deepEqual([...app.matchAll(/gehe\([^;]*?, 'knopf'\)/g)].length, 1, 'ein Aufruf mit Ziel „knopf“ (springe)');
  assert.match(app, /const springe = \(schritt\) => gehe\(\{ ansicht: 'karte', id: nachbar\(BEGRIFFE, b\.id, schritt\)\.id \}, 'knopf'\);/);
  // Was vorgelesen wird, gehört zur alten Ansicht.
  assert.match(app, /window\.speechSynthesis\.cancel\(\);/);
});

test('Vorlesen: Kinder-App, vorlesen() aus kinder-ui nur mit einer Stimme auf dem Gerät, ein Knopf auf jeder Ansicht für das Kind, nur Deutsch', () => {
  assert.match(code['app.mjs'], /import \{ el, lokaleStimme, vorlesen \} from '\.\.\/\.\.\/packages\/kinder-ui\/js\/komponenten\.mjs';/);
  assert.equal((app.match(/lokaleStimme\('de'\)/g) ?? []).length, 1, 'die Stimme wird an einer Stelle gesucht');
  assert.match(app, /if \(stimme === null\) return el\('p', \{ class: 'k-hinweis lk-hinweis' \}, T\.stimme\.keine\);/);
  assert.equal((app.match(/vorlesen\(text, 'de-DE', stimme\)/g) ?? []).length, 1);
  // Dieselbe Prüfung wie packages/kinder-ui/test/vorlesen.test.mjs: wer die Stimme sucht, gibt sie an vorlesen() weiter.
  assert.match(app, /vorlesen\([^)]*,\s*stimme\s*\)/);
  assert.ok(!/function\s+lokaleStimme\s*\(/.test(app), 'lokaleStimme steht in kinder-ui');
  // Ein Knopf (oder der Hinweis ohne Stimme) auf Start, Liste, Karte und Instrumenten; die Druckvorschau ist für Erwachsene.
  for (const name of ['ansichtStart', 'ansichtListe', 'ansichtKarte', 'ansichtInstrumente']) {
    const rumpf = app.match(new RegExp(`function ${name}\\([^)]*\\) \\{[\\s\\S]*?\\n\\}\\n`))?.[0] ?? '';
    assert.ok(rumpf.includes('vorleseKnopf('), `${name}: kein Vorlesen`);
  }
  assert.ok(daten.texte.stimme.keine.includes('ohne Netz'));
  // Außer cancel() und dem Ladeereignis der Stimmen berührt die App die Sprachausgabe nicht.
  const sprach = [...app.matchAll(/speechSynthesis[^;\n]*/g)].map((m) => m[0]);
  assert.ok(sprach.every((z) => /in window|\.cancel\(\)|\.addEventListener\?\.\('voiceschanged'/.test(z)), `Sprachausgabe: ${sprach.join(' | ')}`);
  assert.ok(!/SpeechSynthesisUtterance|\.speak\(/.test(app), 'gesprochen wird nur über vorlesen() aus kinder-ui');
});

test('uk und ru: die Oberfläche zeigt weder ru noch uk; der Vermerk steht im Quelltext, in den Daten und im GDD', () => {
  assert.ok(code['index.html'].includes(VERMERK_SPRACHEN), 'index.html: Vermerk fehlt');
  assert.equal(daten.sprachen, VERMERK_SPRACHEN);
  assert.ok(alle['GDD.md'].includes(VERMERK_SPRACHEN), 'GDD.md: Vermerk fehlt');
  assert.ok(alle['README.md'].includes(VERMERK_SPRACHEN), 'README.md: Vermerk fehlt');
  assert.match(JSON.stringify(daten.texte.erwachsene), /\{sprachen\}/, 'die Ansicht für Erwachsene nennt den Vermerk');
  // Die Karte zeigt nur das deutsche Wort; ru und uk liegen in den Daten, werden aber nicht angezeigt.
  assert.deepEqual([...app.matchAll(/begriffKarte\([^)]*\)/g)].map((m) => m[0]), ["begriffKarte(b, 'de')", "begriffKarte(b, 'de')"]);
  assert.ok(!/\.(ru|uk)\b|\[['"](ru|uk)['"]\]|['"](ru|uk)['"]/.test(app), 'app.mjs benutzt ru oder uk');
  assert.ok(!/ru-RU|uk-UA/.test(app + logik), 'kein Vorlesen auf Russisch oder Ukrainisch');
  assert.ok(daten.begriffe.every((b) => b.uk === null));
});

// Modellnamen sind Entscheidung A1 (docs/offene-punkte-kita.md), hier bewusst nicht geprüft.
test('KI-Begriffe: in keiner Datei der App allgemeine KI-Begriffe', () => {
  const muster = /\bKI\b|LLM|Sprachmodell|Chatbot|künstliche Intelligenz/i;
  for (const [d, inhalt] of Object.entries(alle)) {
    assert.ok(!muster.test(inhalt), `${d}: ${inhalt.match(muster)?.[0]}`);
  }
});

test('keine Bewertung von Kindern im Code und in den Daten: keine Punkte, Stufe, Rang, Einstufung, Sterne, Prozent (docs/02 Z. 141–146)', () => {
  // Dokumente dürfen solche Wörter verneinen („keine Punkte“), Oberfläche und Daten nicht. „Noten“ gehört zur Musik
  // und ist keine Schulnote: geprüft wird auf Schulnote, Zeugnisnote und „Note 1“ bis „Note 6“.
  const muster = /unsicher|Selbstwert|Risiko|Diagnose|\bPunkte?\b|Rangliste|\bRang\b|Einstufung|\bStufe\b|\bPlatz\b|Prozent|\bSterne?\b|\bErgebnis\b|Schulnote|Zeugnisnote|\bNote\s+[1-6]\b/i;
  for (const d of CODE_DATEIEN) {
    const inhalt = d.endsWith('.mjs') ? ohneKommentare(code[d]) : code[d];
    assert.ok(!muster.test(inhalt), `${d}: ${inhalt.match(muster)?.[0]}`);
  }
  // Kontrolle: das Gegenteil wird erkannt, und „Noten“ in der Musik bleibt frei.
  assert.ok(muster.test('Du hast 5 Punkte') && muster.test('Dein Rang') && muster.test('Note 2'));
  assert.ok(!muster.test('schreibt sie in Noten auf'));
});

test('Wortliste der Wertung (tools/leistungs-woerter.mjs) und Stand der Wertung: keine Treffer, kein Eintrag nötig', async () => {
  const treffer = await appLeistungsTreffer(WURZEL, ['musik-woerter-bilderlexikon']);
  assert.deepEqual(treffer, {}, `Treffer der Wortliste: ${JSON.stringify(treffer)}`);
  for (const d of ['index.html', 'app.mjs', 'logik.mjs', 'daten/begriffe.json']) {
    assert.deepEqual(appGruende(d, code[d]), [], `${d}: Befund im Stand der Wertung`);
  }
  const stand = JSON.parse(await readFile(new URL('../../../docs/bewertung-stand.json', import.meta.url), 'utf8'));
  assert.ok(!stand.apps.includes('musik-woerter-bilderlexikon') && !('musik-woerter-bilderlexikon' in stand.ausnahmen), 'die App steht nicht im Stand');
  // Der einzige Zähler zeigt, was gewählt ist; er hat kein „von“ und keine Wertung.
  for (const t of ['gewaehltNull', 'gewaehltEins', 'gewaehltViele', 'drucken']) assert.ok(!/\bvon\b/.test(daten.texte.druck[t]), t);
});

test('externe Fakten: Normen, Studienzahlen und Erste-Hilfe-Angaben nur mit Quelle aus dem Praleska-Buch oder mit Vermerk', () => {
  // Eine Zeile mit einer positiven Behauptung dieser Art braucht eine Fundstelle („S. n“, „Praleska“)
  // oder den Vermerk „Eigenentwurf, fachlich nicht geprüft“. Zeilen, die etwas verneinen („keine
  // Studie“, „ohne Norm“), sind keine Behauptung. Die Liste der Muster wächst mit den Befunden.
  const behauptung = /\b(EN \d|DIN\b|ISO \d|AWMF|BZgA|BIÖG|WHO\b|G-BA|§\s*\d|Richtlinie|Verordnung|Studie|randomis|Teilnehmer|Gegenstimme|Prozent|\d+\s*%|Erste[- ]Hilfe|Giftnotruf|Notruf|amtlich|Behörde)/i;
  const verneint = /\b(kein|keine|keinen|keiner|ohne|nicht|nie)\b/i;
  const beleg = /Eigenentwurf, fachlich nicht geprüft|\(S\. \d|Praleska/;
  const befunde = [];
  // druck.css hat keine Aussagen, nur Maße (zum Beispiel 100 % Breite); das Paket prüft CSS ebenfalls nicht.
  for (const d of ALLE_DATEIEN.filter((x) => x !== 'druck.css')) {
    alle[d].split('\n').forEach((zeile, i) => {
      if (behauptung.test(zeile) && !verneint.test(zeile) && !beleg.test(zeile)) befunde.push(`${d}:${i + 1}`);
    });
  }
  assert.deepEqual(befunde, [], `Behauptung ohne Quelle oder Vermerk: ${befunde.join(', ')}`);
});

test('externe Fakten (Prüfung des Pakets): die App hat keine Fundstelle, auch nicht in README und GDD; keine Aussage über Recht, Geld oder Gesundheit', async () => {
  const funde = await fundstellen(APP_ORDNER);
  assert.deepEqual(funde.map((f) => `${f.datei}:${f.zeile} ${f.kategorie}`), [], 'Fundstellen der externen Fakten');
  // Die Erklärungen sind Musikwörter; sie sagen nichts über Gesundheit, Sicherheit, Recht oder Geld.
  const heikel = /Gesundheit|(?<![a-zäöüß])Gehör(?![a-zäöüß])|Hörschaden|laut genug|Lautstärke|Dezibel|Verletz|Sicherheit|Gesetz|Recht auf|Euro|Geld|Preis|kostet/;
  for (const b of daten.begriffe) assert.ok(!heikel.test(b.erklaerung), `${b.id}: ${b.erklaerung.match(heikel)?.[0]}`);
});

test('kein Service Worker, kein Import von quiz-kern, keine Hilfe-Insel (Fachlernen Musik): die App nutzt nur kinder-ui und kinderschutz', async () => {
  const dateien = await readdir(new URL('.', APP));
  assert.ok(!dateien.includes('sw.js'), 'sw.js vorhanden');
  assert.ok(!/serviceWorker/.test(code['app.mjs'] + code['index.html']), 'registriert einen Service Worker');
  assert.ok(!/quiz-kern/.test(code['app.mjs'] + code['logik.mjs']), 'Import von quiz-kern (Bauauftrag Abschnitt 7)');
  assert.ok(!/116\s?111|hilfe-insel|hilfeInsel/.test(code['app.mjs'] + code['logik.mjs']), 'die Hilfe-Insel ist hier nicht vorgesehen');
  const importe = [...code['app.mjs'].matchAll(/from '([^']+)'/g)].map((m) => m[1]);
  assert.deepEqual(importe, [
    '../../packages/kinder-ui/js/komponenten.mjs',
    '../../packages/kinderschutz/src/index.mjs',
    './daten/begriffe.json',
    './logik.mjs',
  ]);
  assert.deepEqual([...code['logik.mjs'].matchAll(/^import /gm)], [], 'logik.mjs importiert nichts');
});

test('kein toter Link: es gibt keine eltern.html, die App verlinkt nur das Impressum; die Hinweise für Erwachsene stehen in der App', async () => {
  const dateien = await readdir(new URL('.', APP));
  assert.ok(!dateien.includes('eltern.html'));
  const hrefs = [...code['app.mjs'].matchAll(/href: '([^']+)'/g)].map((m) => m[1]);
  assert.deepEqual(hrefs, ['../../impressum.html']);
  assert.ok(!/eltern\.html/.test(code['app.mjs'] + code['index.html']));
  await access(new URL('../../../impressum.html', import.meta.url));
  assert.match(app, /knopf\('start-erwachsene', T\.knoepfe\.erwachsene/, 'kein Zugang zur Ansicht für Erwachsene');
});

test('Bilder im App-Ordner: img-Elemente nur mit Pfaden aus den Daten, kein url() im CSS, keine Bilder von außen', () => {
  const bildFunktion = app.match(/const bild = \(pfad, text, klasse\) => el\('img'[^\n]*/)?.[0] ?? '';
  assert.match(bildFunktion, /src: pfad, alt: text \?\? ''/, 'bild() setzt src aus dem Pfad und immer ein alt');
  assert.equal((app.match(/el\('img'/g) ?? []).length, 1, 'ein einziger Ort für Bilder');
  assert.ok(!/new Image|background-image|createElementNS|innerHTML|insertAdjacentHTML/.test(app), 'keine andere Art, Bilder oder Markup einzusetzen');
  assert.ok(!/url\(|background-image/.test(code['druck.css']));
  // Jeder Aufruf von bild() bekommt Pfad und Text aus den Daten oder ein leeres alt für Schmuck.
  const aufrufe = [...app.matchAll(/(?<![\w.])bild\(([^)]*)\)/g)].map((m) => m[1]);
  assert.ok(aufrufe.length >= 5, `nur ${aufrufe.length} Aufrufe von bild()`);
  for (const a of aufrufe) assert.ok(/(k|b|blatt|karte)\.bild/.test(a), `bild(${a}): der Pfad kommt nicht aus den Daten`);
  // Schmuck (kleine Bilder in Knöpfen) hat ein leeres alt, denn das Wort steht als Text daneben.
  assert.ok(aufrufe.filter((a) => /lk-bild-klein/.test(a)).every((a) => /, ''/.test(a)), 'kleine Bilder in Knöpfen haben alt=""');
});

test('Sprache der Teile: Titel der Quelle in der Ansicht für Erwachsene tragen lang="ru", sonst gibt es kein anderes lang', () => {
  assert.match(app, /const mitSprache = \(text\) => sprachStuecke\(text\)\.map\(\(s\) => \(s\.lang \? el\('span', \{ lang: s\.lang \}, s\.text\) : s\.text\)\);/);
  const ansicht = app.match(/function ansichtErwachsene\([\s\S]*?\n\}\n/)?.[0] ?? '';
  assert.match(ansicht, /\.\.\.mitSprache\(fuelle\(text, \{ \.\.\.daten\.quelle, sprachen: daten\.sprachen \}\)\)/);
  assert.deepEqual([...app.matchAll(/lang: ([^,}]+)/g)].map((m) => m[1].trim()), ['s.lang'], 'nur dieses lang');
  assert.match(code['index.html'], /<html lang="de">/);
  // Alle kyrillischen Stücke der Texte stehen in diesen Abschnitten (die Oberfläche hat sonst keinen kyrillischen Text).
  const sonst = JSON.stringify({ ...daten.texte, erwachsene: null });
  assert.ok(!/[\u0400-\u04FF]/.test(sonst), 'kyrillischer Text außerhalb der Ansicht für Erwachsene');
});

test('Texte stehen in den Daten: jeder Textschlüssel, den app.mjs benutzt, ist da, und kein Text in den Daten bleibt ungenutzt', () => {
  const fehlt = [];
  for (const m of app.matchAll(/\bT\.(\w+)\.(\w+)/g)) {
    if (!(m[2] in (daten.texte[m[1]] ?? {}))) fehlt.push(`T.${m[1]}.${m[2]}`);
  }
  for (const [alias, abschnitt] of [['S', 'start'], ['D', 'druck'], ['E', 'erwachsene']]) {
    for (const m of app.matchAll(new RegExp(`(?<![\\w.])${alias}\\.(\\w+)`, 'g'))) {
      if (!(m[1] in daten.texte[abschnitt])) fehlt.push(`${alias}.${m[1]} (${abschnitt})`);
    }
  }
  assert.deepEqual(fehlt, [], `Textschlüssel ohne Text: ${fehlt.join(', ')}`);
  const ungenutzt = [];
  for (const [abschnitt, texte] of Object.entries(daten.texte)) {
    for (const schluessel of Object.keys(texte)) {
      if (!new RegExp(`(?<![\\w])${schluessel}(?![\\w])`).test(app + logik)) ungenutzt.push(`${abschnitt}.${schluessel}`);
    }
  }
  assert.deepEqual(ungenutzt, [], `Texte in den Daten, die kein Code benutzt: ${ungenutzt.join(', ')}`);
  for (const k of ['titel', 'pflichtmarkierung', 'eigenentwurf', 'sprachen', 'quelle', 'kategorien', 'begriffe', 'texte']) {
    assert.ok(new RegExp(`daten\\.${k}\\b`).test(app + logik) || k === 'begriffe' || k === 'texte', `daten.${k} wird nicht benutzt`);
  }
});

test('docs/02: jeder Verweis nennt eine der drei belegten Zeilenangaben (22–24, 79–82, 141–146); keine „Regel 3/4/5“', () => {
  const erlaubt = ['22–24', '79–82', '141–146'];
  for (const d of ['README.md', 'GDD.md', 'app.mjs', 'logik.mjs']) {
    for (const m of alle[d].matchAll(/docs\/02(?: Z\. (\d+–\d+))?/g)) {
      assert.ok(m[1] && erlaubt.includes(m[1]), `${d}: Verweis „${m[0]}“ ist keine belegte Zeile`);
    }
    assert.ok(!/Regel [345]\b/.test(alle[d]), `${d}: Verweis auf „Regel 3/4/5“`);
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

test('package.json: privat, ES-Modul, Name, Lizenz, Testskript vorhanden', () => {
  const pkg = JSON.parse(alle['package.json']);
  assert.equal(pkg.name, '@info70/musik-woerter-bilderlexikon');
  assert.equal(pkg.private, true);
  assert.equal(pkg.type, 'module');
  assert.equal(pkg.license, 'AGPL-3.0-only');
  assert.match(pkg.scripts?.test ?? '', /node --test/);
  assert.ok(pkg.scripts.test.includes('test/logik.test.mjs') && pkg.scripts.test.includes('test/regeln.test.mjs'));
});
