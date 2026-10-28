import { test } from 'node:test';
import assert from 'node:assert/strict';
import { access, readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import daten from '../daten/himmel.json' with { type: 'json' };
import { MAX_BEOBACHTUNG, beobachtungsblaetter, blattHtml, htmlText, mondblatt } from '../logik.mjs';
import { appGruende } from '../../../packages/kinderschutz/src/bewertung-stand.mjs';
import { fundstellen } from '../../../packages/kinderschutz/src/externe-fakten.mjs';
import { appLeistungsTreffer } from '../../../packages/kinderschutz/src/leistungs-woerter.mjs';
import { speicherBefund, verletzung } from '../../../packages/kinderschutz/src/speicher-regel.mjs';
import { appBefund, hatMarke, hatSeitenangabe } from '../../../packages/kinderschutz/src/seitenmarke.mjs';

// Projektregeln, für diese App geprüft: docs/02 Z. 22–24 (keine Anfragen nach außen),
// docs/02 Z. 79–82 (Druckbögen), docs/02 Z. 141–146 (keine Bewertung von Kindern);
// die Speicherregel, die Zufallsregel, die Vorlese-Regel für Kinder-Apps und die Seitenmarke haben
// keine docs/02-Zeile, sie sind Projektregeln. Die Prüfung liest die Dateien der App (ohne test/).
// Die Testdateien selbst dürfen die verbotenen Wörter nennen, um sie zu verbieten.

const SLUG = 'himmelsgucker-sonne-mond-und-sterne';
const APP = new URL('../', import.meta.url);
const WURZEL = fileURLToPath(new URL('../../../', import.meta.url));
const APP_PFAD = fileURLToPath(APP);
const CODE_DATEIEN = ['index.html', 'app.mjs', 'logik.mjs', 'bilder.mjs', 'druck.css', 'daten/himmel.json'];
const ALLE_DATEIEN = [...CODE_DATEIEN, 'package.json', 'README.md', 'GDD.md'];
const PFLICHT = 'Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.';

const lese = (datei) => readFile(new URL(datei, APP), 'utf8');
const code = Object.fromEntries(await Promise.all(CODE_DATEIEN.map(async (d) => [d, await lese(d)])));
const alle = Object.fromEntries(await Promise.all(ALLE_DATEIEN.map(async (d) => [d, await lese(d)])));
const skripte = ['app.mjs', 'logik.mjs', 'bilder.mjs'];

// Alle Blätter, die sich wählen lassen: das Mondblatt und die drei Beobachtungsblätter, als HTML-Text (so gehen
// sie in den Druckbereich) und als Text (so liest sie das Papier).
const blaetter = [mondblatt(daten), ...beobachtungsblaetter(MAX_BEOBACHTUNG, daten)];
const blattHtmlListe = blaetter.map(blattHtml);
const blattTexte = blattHtmlListe.map(htmlText);

test('keine Eingabefelder für Kinder: kein input, textarea, select, form, contenteditable', () => {
  const muster = /<\s*(input|textarea|select|form)\b|contenteditable|(el|createElement)\(\s*['"](input|textarea|select|form)['"]/i;
  for (const d of ['index.html', 'app.mjs', 'logik.mjs', 'bilder.mjs']) {
    assert.ok(!muster.test(code[d]), `${d}: Eingabeelement gefunden`);
  }
  blattHtmlListe.forEach((html, i) => {
    assert.ok(!/<\s*(input|textarea|select|form|button)\b|contenteditable/i.test(html), `Blatt ${blaetter[i].id}: Eingabeelement im Druck`);
  });
});

test('keine Speicherung: kein localStorage, sessionStorage, IndexedDB, Cookie oder Cache; keine Karte „Daten löschen“ ohne Daten', () => {
  const muster = /localStorage|sessionStorage|indexedDB|document\.cookie|\bcaches\b|navigator\.storage/;
  for (const d of CODE_DATEIEN) {
    assert.ok(!muster.test(code[d]), `${d}: Speicher-Zugriff gefunden`);
  }
  // Die Speicherregel der Wurzel (Entscheidung Max 30б): wer nichts speichert, zeigt keine Löschkarte.
  const befund = speicherBefund(skripte.map((d) => code[d]).join('\n'));
  assert.deepEqual(befund, { speichert: false, loeschbar: false, karte: false });
  assert.equal(verletzung(befund), null);
  assert.ok(!/Meine Daten löschen|datenKarte|daten-karte/.test(code['app.mjs'] + code['daten/himmel.json']), 'Löschkarte ohne Speicher');
});

test('keine externen Adressen, keine Netzaufrufe in den Dateien der App, kein @import', () => {
  const netz = /\bfetch\s*\(|XMLHttpRequest|WebSocket|sendBeacon|EventSource|importScripts|new Worker|window\[|globalThis|wss?:/;
  for (const d of CODE_DATEIEN) {
    assert.ok(!/https?:\/\/|(?<![:\w])\/\/[\w-]+\.[a-z]{2,}/i.test(code[d]), `${d}: externe Adresse`);
  }
  for (const d of skripte) {
    assert.ok(!netz.test(code[d]), `${d}: Netzaufruf gefunden`);
  }
  assert.ok(!/@import|url\(/.test(code['druck.css']), 'druck.css: @import oder url()');
  assert.ok(!/xlink|href=/.test(code['bilder.mjs']), 'bilder.mjs: Verweis im SVG');
});

test('innerHTML nur in setzeHtml() und nur mit dem SVG-Text aus bilder.mjs und den Blättern aus logik.mjs: keine Daten und keine Eingaben, Texte werden maskiert', () => {
  const app = code['app.mjs'].replace(/\/\/.*$/gm, '');
  const zuweisungen = [...app.matchAll(/innerHTML\s*=\s*([^;]+);/g)].map((m) => m[1]);
  assert.deepEqual(zuweisungen, ['html'], 'innerHTML wird nur einmal belegt, in setzeHtml()');
  assert.match(app, /function setzeHtml\(knoten, html\) \{\s*knoten\.innerHTML = html;\s*return knoten;\s*\}/);
  // Genau diese drei Aufrufe gibt es (dazu die Definition): ein Bild, die Vorschau und der Druckbereich.
  assert.equal((app.match(/setzeHtml\(/g) ?? []).length - 1, 3, 'setzeHtml() wird für etwas anderes aufgerufen');
  for (const erlaubt of [
    "setzeHtml(el('span', { class: `hg-bild ${klasse}`.trim() }), bildSvg(id, { modus, label }))",
    "setzeHtml(el('div', { class: 'hg-vorschau-liste' }), blaetterHtml)",
    'setzeHtml(druckBox, druckBlaetterHtml(daten, druckAuswahl))',
  ]) assert.ok(app.includes(erlaubt), `Aufruf fehlt oder weicht ab: ${erlaubt}`);
  assert.match(app, /const blaetterHtml = druckBlaetterHtml\(daten, druckAuswahl\);/, 'die Vorschau nimmt den HTML-Text aus logik.mjs');
  assert.ok(!/insertAdjacentHTML|outerHTML|document\.write|eval\(|new Function/.test(app), 'andere Wege, Text als Code einzufügen');
  assert.ok(!/innerHTML/.test(code['logik.mjs'] + code['bilder.mjs']), 'innerHTML außerhalb von app.mjs');
  assert.match(code['bilder.mjs'], /const maskiere = /);
  assert.ok(code['bilder.mjs'].includes('aria-label="${maskiere(label)}"'), 'das Label wird nicht maskiert');
  // logik.mjs maskiert jeden Text der Blätter mit derselben Funktion (das Verhalten prüft test/logik.test.mjs mit einem feindlichen Text).
  assert.match(code['logik.mjs'], /^import \{ bildSvg, maskiere \} from '\.\/bilder\.mjs';$/m);
});

test('Zufall nur in app.mjs: Math.random steht genau einmal, und zwar dort; die anderen Dateien haben keine Zufallsquelle und keine Uhr', () => {
  const treffer = code['app.mjs'].match(/Math\.random/g) ?? [];
  assert.equal(treffer.length, 1, `app.mjs: ${treffer.length} Stellen mit Math.random, erwartet 1`);
  for (const d of ['logik.mjs', 'bilder.mjs', 'daten/himmel.json', 'index.html', 'druck.css']) {
    assert.ok(!/Math\.random|crypto|Date\.now|new Date|performance\./.test(code[d]), `${d}: Zufall oder Uhr`);
  }
  assert.ok(!/\bmischen\b/.test(code['app.mjs'].replace(/\/\/.*$/gm, '')), 'app.mjs ruft das gemeinsame mischen() nicht auf, das eine eigene Zufallsquelle hat');
});

test('die Daten kommen per JSON-Import mit Typangabe, die Oberfläche lädt nichts nach', () => {
  assert.match(code['app.mjs'], /^import daten from '\.\/daten\/himmel\.json' with \{ type: 'json' \};$/m);
  assert.match(code['logik.mjs'], /^import HIMMEL from '\.\/daten\/himmel\.json' with \{ type: 'json' \};$/m, 'die Standarddaten von druckeBeobachtungsblatt');
  for (const d of ['app.mjs', 'logik.mjs', 'bilder.mjs']) assert.ok(!/fetch\(|import\(/.test(code[d]), `${d} lädt nach`);
});

test('Grundgerüst: deutsch, Viewport, CSP exakt, nur eigene Stylesheets, genau das gemeinsame Favicon auf der Zeile des Stylesheets, ein Modul-Skript', () => {
  const html = code['index.html'];
  assert.match(html, /<html lang="de">/);
  assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1"/);
  assert.match(html, /<meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline'"/);
  assert.match(html, /<noscript>/);
  assert.match(html, /<title>Himmelsgucker: Sonne, Mond und Sterne<\/title>/);
  const links = [...html.matchAll(/<link rel="stylesheet"[^>]*href="([^"]+)"/g)].map((m) => m[1]);
  // Jeder andere Link ist genau das gemeinsame Favicon (gleicher Ursprung, Entscheidung Max 21а): nichts Fremdes.
  const andereLinks = [...html.matchAll(/<link(?![^>]*rel="stylesheet")[^>]*>/g)].map((m) => m[0]);
  assert.ok(andereLinks.every((l) => /^<link rel="icon" type="image\/svg\+xml" href="(?:\.\.\/\.\.\/)?packages\/kinder-ui\/img\/favicon\.svg" \/>$/.test(l)), `index.html: fremder Link ${andereLinks.join(' ')}`);
  assert.equal(andereLinks.length, 1, 'genau ein Favicon-Link');
  assert.deepEqual(links, ['../../packages/kinder-ui/css/kinder.css', 'druck.css']);
  assert.ok(html.includes('<link rel="stylesheet" href="../../packages/kinder-ui/css/kinder.css" /><link rel="icon" type="image/svg+xml" href="../../packages/kinder-ui/img/favicon.svg" />'),
    'das Favicon steht auf derselben Zeile wie das Stylesheet');
  const skriptTags = [...html.matchAll(/<script[^>]*src="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(skriptTags, ['app.mjs']);
  assert.match(html, /<script type="module" src="app\.mjs"><\/script>/);
});

test('aria-live="polite" auf dem Hauptbereich #app; der Druckbereich liegt außerhalb davon und nur der Hauptbereich ist ein Bildschirmteil', () => {
  const tag = code['index.html'].match(/<main[^>]*id="app"[^>]*>/)?.[0];
  assert.ok(tag, '<main id="app"> fehlt');
  assert.match(tag, /aria-live="polite"/);
  assert.match(tag, /class="k-app hg-nur-bildschirm"/);
  assert.match(code['index.html'], /<\/main>\s*<div class="hg-nur-druck" id="druckbereich"><\/div>/);
});

test('Netzwerk-Wächter: aus packages/kinderschutz importiert und aufgerufen', async () => {
  assert.match(code['app.mjs'], /import \{ installiereNetzwerkWaechter \} from '\.\.\/\.\.\/packages\/kinderschutz\/src\/index\.mjs';/);
  assert.match(code['app.mjs'], /^installiereNetzwerkWaechter\(\);$/m);
  await access(new URL('../../../packages/kinderschutz/src/index.mjs', import.meta.url));
});

test('kein Service Worker: weder sw.js noch eine Registrierung (Entscheidung Max 9б)', async () => {
  const dateien = await readdir(new URL('.', APP));
  assert.ok(!dateien.includes('sw.js'), 'sw.js vorhanden');
  for (const d of CODE_DATEIEN) assert.ok(!/serviceWorker/i.test(code[d]), `${d}: Service Worker`);
});

test('keine Druckzeichen: im Drucktext aller Blätter und im Quelltext keine Häkchen, Kästchen, Sternzeichen, Punkte, Pfeile, Emojis', () => {
  // Zeichenblöcke statt Aufzählung: Pfeile, Math-Zeichen, Dingbats, geometrische Formen, Emojis.
  const zeichen = /[☐☒☑✓✔✗✘✅❌★☆•●○◦·∙‧▪▫◾◽■□]|[←-⋿⌀-➿⦀-⧿⬀-⯿■-◿・]|\p{Extended_Pictographic}/u;
  assert.equal(blaetter.length, 1 + MAX_BEOBACHTUNG);
  blattHtmlListe.forEach((html, i) => {
    assert.ok(!zeichen.test(blattTexte[i]), `Blatt ${blaetter[i].id}: Druckzeichen im Drucktext`);
    assert.ok(!zeichen.test(html), `Blatt ${blaetter[i].id}: Druckzeichen im HTML-Text`);
  });
  for (const d of CODE_DATEIEN) {
    assert.ok(!zeichen.test(code[d]), `${d}: Druckzeichen gefunden`);
  }
});

test('Druckblatt ohne Namenszeile, ohne Tages- oder Wochentagsfeld, ohne Linien zum Ausfüllen', () => {
  // „Name“ auch in Zusammensetzungen (Vorname, Namensfeld); „Namen“ im Fließtext bleibt erlaubt.
  const namenUndTage = /Name(?!n\b)|Datum|Wochentag|\b(Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag|Sonntag)\b|\bTage?\b|_{3,}|…{2,}/i;
  blattTexte.forEach((text, i) => {
    assert.ok(!namenUndTage.test(text), `Blatt ${blaetter[i].id}: Namenszeile oder Tagesfeld im Druck`);
  });
  assert.ok(!/Name\s*:|_{3,}/.test(code['app.mjs'] + code['druck.css']), 'app.mjs oder druck.css: Namenszeile');
  assert.ok(!/<hr|border-bottom:\s*[\d.]+(?:pt|px)\s+(?:dotted|dashed)/.test(code['app.mjs'] + code['druck.css']), 'Schreiblinie im Druck');
});

test('keine Seitenzahl auf dem Blatt; die Seiten stehen in den Daten, die Marke steht in der Ansicht für Erwachsene bei der Quelle', async () => {
  blattTexte.forEach((text, i) => {
    assert.doesNotMatch(text, /S\. \d/, `Blatt ${blaetter[i].id}: Seitenzahl auf dem Blatt`);
    assert.ok(!hatMarke(text) && !/Menschen geprüft/.test(text), `Blatt ${blaetter[i].id}: Marke ohne Seitenzahl`);
  });
  assert.ok(hatSeitenangabe(code['daten/himmel.json']), 'die Daten tragen Seitenangaben');
  assert.ok(hatMarke(code['daten/himmel.json']), 'die Daten tragen die Marke');
  assert.equal(daten.pflichtmarkierung, PFLICHT);
  // Die Seiten werden nur in der Ansicht für Erwachsene gezeigt; dort steht die Marke im Abschnitt „Quelle“.
  const erwachsene = code['app.mjs'].match(/function ansichtErwachsene\(\) \{[\s\S]*?\n\}/)?.[0] ?? '';
  assert.match(erwachsene, /a\.art === 'quelle'/);
  assert.match(erwachsene, /absatz\(daten\.pflichtmarkierung, 'hg-marke'\)/, 'die Marke steht nicht bei der Quelle');
  const quelle = daten.texte.erwachsene.abschnitte.find((a) => a.art === 'quelle');
  assert.ok(quelle.absaetze.some((s) => /\(S\. \d+\)/.test(s)), 'der Abschnitt „Quelle“ nennt Seiten');
  const andere = daten.texte.erwachsene.abschnitte.filter((a) => a.art !== 'quelle');
  assert.ok(!andere.some((a) => a.absaetze.some((s) => hatSeitenangabe(s))), 'eine Seite steht außerhalb des Abschnitts „Quelle“');
  // Die Wurzel-Prüfung (Entscheidung Max 22а): Seiten und Marke in den Nutzerdateien, die App ist keine Ausnahme.
  const befund = await appBefund(APP_PFAD);
  assert.ok(befund.seiten.length > 0 && befund.marke, `Seiten ohne Marke: ${befund.seiten.join(', ')}`);
});

test('Pflichtmarkierung: im Wortlaut der Daten, in README und GDD unter „## Offen“; nie „von Hand geprüft“', () => {
  assert.ok(alle['README.md'].includes(PFLICHT), 'README.md: Pflichtmarkierung fehlt');
  const gdd = alle['GDD.md'];
  assert.ok(gdd.includes('## Offen'), 'GDD.md: Abschnitt „## Offen“ fehlt');
  assert.ok(gdd.slice(gdd.indexOf('## Offen')).includes(PFLICHT), 'GDD.md: Pflichtmarkierung nicht unter „## Offen“');
  const readme = alle['README.md'];
  assert.ok(readme.slice(readme.indexOf('## Offen')).includes(PFLICHT), 'README.md: Pflichtmarkierung nicht unter „## Offen“');
  for (const [d, inhalt] of Object.entries(alle)) {
    assert.ok(!/von Hand geprüft/i.test(inhalt), `${d}: „von Hand geprüft“ ist nicht belegt`);
  }
});

test('Eigenentwurf-Kennzeichnung: Blattköpfe, Übertragungen der Begriffe und die Hinweise auf den Karten sind als Eigenentwurf benannt', () => {
  assert.match(daten.blaetter.mondblatt.kopf2, /Eigenentwurf/, 'Mondblatt ohne Kennzeichnung');
  assert.match(daten.blaetter.beobachtung.kopf2, /Eigenentwurf/, 'Beobachtungsblatt ohne Kennzeichnung');
  blattTexte.forEach((text, i) => assert.match(text, /Eigenentwurf/, `Blatt ${blaetter[i].id}: ohne Kennzeichnung`));
  for (const k of daten.karten) {
    for (const begriff of k.begriffe) assert.match(begriff.deutsch, /./, `${k.id}: Übertragung fehlt`);
    assert.equal(k.eigenentwurf, true);
  }
  assert.ok(code['app.mjs'].includes('(Eigenentwurf)`'), 'app.mjs: Übertragung ohne Kennzeichnung');
  assert.match(daten.texte.karte.eigenentwurf, /Eigenentwurf/);
  assert.match(code['app.mjs'], /absatz\(T\.karte\.eigenentwurf\)/, 'die Karte nennt den Eigenentwurf nicht');
  assert.ok(daten.sprachen.includes('Eigenentwurf'), 'Sprachenvermerk ohne Eigenentwurf');
});

test('externe Fakten: der Satz zur Sonne trägt den Vermerk; das Werkzeug der Wurzel findet keine Fundstelle ohne Beleg', async () => {
  const hinweis = daten.karten.find((k) => k.id === 'sonne').erwachsene.find((s) => /direkt in die Sonne/.test(s));
  assert.ok(hinweis, 'der Sicherheitssatz zur Sonne fehlt');
  assert.match(hinweis, /\(Eigenentwurf, fachlich nicht geprüft\)\.$/, 'Sicherheitssatz ohne Vermerk');
  const abschnitt = daten.texte.erwachsene.abschnitte.find((a) => a.titel === 'Sicherheit');
  assert.ok(abschnitt.absaetze.some((s) => /direkt in die Sonne.*\(Eigenentwurf, fachlich nicht geprüft\)\.$/.test(s)), 'Sicherheit in der Ansicht für Erwachsene ohne Vermerk');
  // Normen, Studien, Zahlen und Erste-Hilfe-Angaben gibt es nicht; der Zähler der Wurzel darf für diese App nicht steigen.
  const befunde = (await fundstellen(APP_PFAD)).filter((e) => e.blockierend).map((e) => `${e.datei}:${e.zeile} ${e.kategorie}`);
  assert.deepEqual(befunde, [], `Behauptung ohne Quelle oder Vermerk: ${befunde.join(', ')}`);
});

test('druck.css: A4 hoch, Bildschirmelemente nur im Bildschirm, jedes Blatt eine eigene Seite, nie zerrissen; Titel bricht um, Fuß-Link 48 px hoch', () => {
  const css = code['druck.css'];
  assert.match(css, /@media print \{/);
  assert.match(css, /@page\s*\{\s*size: A4 portrait;/);
  assert.match(css, /\.hg-nur-bildschirm\s*\{\s*display: none !important;\s*\}/);
  assert.match(css, /\.hg-nur-druck\s*\{\s*display: none;\s*\}/);
  assert.match(css, /\.hg-nur-druck\s*\{\s*display: block;\s*\}/);
  assert.match(css, /break-inside: avoid;/);
  assert.match(css, /\.k-karte\.hg-blatt \+ \.k-karte\.hg-blatt\s*\{\s*break-before: page;/);
  // Bei 360 px: die Überschrift bricht innerhalb eines Wortes um.
  assert.match(css, /h1\.k-titel\s*\{[^}]*overflow-wrap:\s*anywhere;[^}]*word-break:\s*normal;/);
  // Fuß-Link: mindestens 48 px hoch (docs/02, touch ≥ 48 px); 44 px reichen nicht.
  assert.match(css, /\.k-fuss a\s*\{[^}]*min-height:\s*48px;/);
  assert.doesNotMatch(css, /\.k-fuss a\s*\{[^}]*min-height:\s*44px;/);
  assert.match(code['app.mjs'], /el\('a', \{ href: '\.\.\/\.\.\/impressum\.html' \}, T\.fuss\.impressum\)/);
  assert.equal(daten.texte.fuss.impressum, 'Impressum und Datenschutz');
});

// Seitenbudget des Drucks. Die Höhe eines Blatts hängt an der Schrift: kinder.css setzt die Systemschrift, und eine
// breitere Schrift (DejaVu Sans ist rund 14 % breiter als Inter) bricht Zeilen um und macht das Blatt höher. Dieser Test
// rechnet nicht mit Schriften und misst keine Seiten; er hält die Größen fest, aus denen die Reserve des Beobachtungsblatts
// entsteht. Gemessen ist das Blatt mit Chromium (page.pdf() und pdfinfo, README, Abschnitt „Drucken“): Wer eine dieser Größen
// ändert, misst neu. Diese Prüfung erkennt nur, was im Stylesheet steht, nicht den Seitenumbruch selbst.
const MM_JE_EINHEIT = { mm: 1, cm: 10, pt: 25.4 / 72, px: 25.4 / 96, in: 25.4 };
const NUTZBARE_HOEHE_MM = 269; // A4 hoch: 297 mm minus 2 mal 14 mm Rand
const KASTEN_MM = { min: 30, max: 45 }; // der Kasten zum Malen: ein großer Kasten, aber höchstens ein Sechstel der nutzbaren Höhe
const ZEILENHOEHE_MAX = 1.4; // die Bildschirmseite hat 1,5
const GRUNDSCHRIFT_MAX_PT = 12;

function druckBudget(css) {
  const probleme = [];
  const druck = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const ab = druck.indexOf('@media print');
  const block = ab >= 0 ? druck.slice(ab) : '';
  const mm = (text) => {
    const m = /^([\d.]+)(mm|cm|pt|px|in)$/.exec(String(text ?? '').trim());
    return m ? Number(m[1]) * MM_JE_EINHEIT[m[2]] : null;
  };
  const regel = (wahl) => new RegExp(`(?:^|[\\n{}])\\s*${wahl.replace(/[.+]/g, '\\$&')}\\s*\\{([^}]*)\\}`).exec(block)?.[1] ?? null;
  const wert = (wahl, eigenschaft) => regel(wahl)?.match(new RegExp(`(?:^|[;\\s])${eigenschaft}\\s*:\\s*([^;]+?)\\s*(?:;|$)`))?.[1] ?? null;

  // Seitenmaß: Das Budget gilt für A4 hoch mit mindestens 269 mm nutzbarer Höhe.
  const seite = /@page\s*\{\s*size:\s*A4 portrait;\s*margin:\s*(\S+)\s+(\S+?);\s*\}/.exec(block);
  const rand = seite ? mm(seite[1]) : null;
  if (rand === null || 297 - 2 * rand < NUTZBARE_HOEHE_MM - 0.01) probleme.push(`nutzbare Höhe unter ${NUTZBARE_HOEHE_MM} mm: Seitenrand ${seite?.[1] ?? 'fehlt'}`);
  // Grundschrift und Zeilenhöhe: Aus beiden entsteht die Höhe jeder Textzeile.
  const grund = mm(wert('html', 'font-size'));
  if (grund === null || grund > GRUNDSCHRIFT_MAX_PT * MM_JE_EINHEIT.pt + 0.01) probleme.push(`Grundschrift über ${GRUNDSCHRIFT_MAX_PT} pt: ${wert('html', 'font-size')}`);
  const zeile = Number(wert('.k-karte.hg-blatt', 'line-height'));
  if (!(zeile >= 1 && zeile <= ZEILENHOEHE_MAX)) probleme.push(`Zeilenhöhe des Blatts ${wert('.k-karte.hg-blatt', 'line-height') ?? 'fehlt'}, erlaubt 1 bis ${ZEILENHOEHE_MAX}`);
  // Der Kasten zum Malen hat nur eine Mindesthöhe in Längeneinheiten, in den Grenzen.
  const kasten = mm(wert('.hg-rahmen', 'min-height'));
  if (kasten === null || kasten < KASTEN_MM.min - 0.01 || kasten > KASTEN_MM.max + 0.01) probleme.push(`Kasten zum Malen ${wert('.hg-rahmen', 'min-height') ?? 'ohne min-height'}, erlaubt ${KASTEN_MM.min} bis ${KASTEN_MM.max} mm`);
  // Sonst setzt der Druck keine Höhe: nur min-height 0 am Blatt und die Mindesthöhe des Kastens. Eine feste Höhe an einem Feld,
  // am Blatt oder am Kasten würde das Budget umgehen.
  const hoehen = [...block.matchAll(/(?<![-\w])((?:min-)?height)\s*:\s*([^;}]+)/g)].map((m) => `${m[1]}: ${m[2].trim()}`);
  const erlaubt = new Set(['min-height: 0', `min-height: ${wert('.hg-rahmen', 'min-height')}`]);
  const fremd = hoehen.filter((h) => !erlaubt.has(h));
  if (fremd.length || hoehen.length !== 2) probleme.push(`Höhe im Druck gesetzt: ${(fremd.length ? fremd : hoehen).join(', ')}`);
  // Die Mondgestalt-Reihe steht in einer Zeile, ein langes Wort bricht in seiner Spalte um (sonst rutscht die letzte Wahl in eine zweite Zeile).
  const reihe = regel('.hg-wahlreihe--bilder') ?? '';
  if (!/display:\s*grid;/.test(reihe) || !/grid-auto-flow:\s*column;/.test(reihe)) probleme.push('Reihe der Mondgestalten darf umbrechen: kein Raster in einer Zeile');
  return probleme;
}

test('Druckbudget: A4 hoch mit 269 mm nutzbarer Höhe, Kasten zum Malen und Zeilenhöhe in den Grenzen, Mondgestalt-Reihe in einer Zeile, keine feste Höhe im Druck', () => {
  assert.deepEqual(druckBudget(code['druck.css']), []);
  // Das Beobachtungsblatt hat genau diese Reihe; das Mondblatt hat keine Wahl, die umbrechen könnte.
  blattHtmlListe.forEach((html, i) => {
    const reihen = (html.match(/class="hg-wahlreihe hg-wahlreihe--bilder"/g) ?? []).length;
    assert.equal(reihen, blaetter[i].typ === 'beobachtung' ? 1 : 0, `Blatt ${blaetter[i].id}: Zahl der Reihen mit den Mondgestalten`);
  });
  // Die Felder des Beobachtungsblatts: Wer eines hinzufügt, braucht Platz und misst neu (README, Abschnitt „Drucken“).
  assert.deepEqual(blaetter[1].felder.map((f) => f.id), ['mondgestalt', 'himmelsrichtung', 'wetter', 'malen']);
  assert.match(alle['README.md'], /269 mm/, 'README.md nennt die nutzbare Höhe nicht');
  assert.match(alle['README.md'], /Schrift/, 'README.md nennt die Abhängigkeit von der Schrift nicht');
});

test('Druckbudget, Gegenprobe: die Prüfung schlägt an, wenn der Kasten wächst, die Zeilenhöhe oder die Schrift steigt, der Rand größer wird, eine feste Höhe dazukommt oder die Reihe umbrechen darf', () => {
  const css = code['druck.css'];
  // Die Änderungen setzen einen Wert in der Regel, ohne den heutigen Wert zu kennen; sie wirken nur im Druck.
  const imDruck = (aendere) => (c) => {
    const i = c.indexOf('@media print');
    return c.slice(0, i) + aendere(c.slice(i));
  };
  const wahlMuster = (wahl) => wahl.replace(/[.+]/g, '\\$&');
  const setze = (wahl, eigenschaft, wert) => imDruck((b) => b.replace(
    new RegExp(`(${wahlMuster(wahl)}\\s*\\{[^}]*?${eigenschaft}:\\s*)[^;}]+`), (_, vor) => vor + wert));
  const entferne = (wahl, eigenschaft) => imDruck((b) => b.replace(
    new RegExp(`(${wahlMuster(wahl)}\\s*\\{[^}]*?)\\s*${eigenschaft}:[^;}]+;`), (_, vor) => vor));
  const fuegeEin = (wahl, text) => imDruck((b) => b.replace(new RegExp(`(${wahlMuster(wahl)}\\s*\\{)`), (_, vor) => `${vor} ${text}`));
  const mutanten = [
    ['Kasten 90 mm', setze('.hg-rahmen', 'min-height', '90mm'), /Kasten zum Malen 90mm/],
    ['Kasten 9 cm', setze('.hg-rahmen', 'min-height', '9cm'), /Kasten zum Malen 9cm/],
    ['Kasten in rem (keine Länge der Prüfung)', setze('.hg-rahmen', 'min-height', '12rem'), /Kasten zum Malen 12rem/],
    ['Kasten mit fester Höhe statt Mindesthöhe', imDruck((b) => b.replace(/(\.hg-rahmen\s*\{[^}]*?)min-height:/, (_, vor) => `${vor}height:`)), /Kasten zum Malen ohne min-height/],
    ['Kasten zu klein zum Malen', setze('.hg-rahmen', 'min-height', '12mm'), /Kasten zum Malen 12mm/],
    ['feste Höhe am Blatt', fuegeEin('.k-karte.hg-blatt', 'height: 300mm;'), /Höhe im Druck gesetzt: height: 300mm/],
    ['feste Höhe an einem Feld', fuegeEin('.hg-feld', 'height: 80mm;'), /Höhe im Druck gesetzt: height: 80mm/],
    ['Zeilenhöhe wie auf dem Bildschirm', setze('.k-karte.hg-blatt', 'line-height', '1.5'), /Zeilenhöhe des Blatts 1\.5/],
    ['Zeilenhöhe fehlt', entferne('.k-karte.hg-blatt', 'line-height'), /Zeilenhöhe des Blatts fehlt/],
    ['größere Grundschrift', setze('html', 'font-size', '14pt'), /Grundschrift über 12 pt/],
    ['Rand 30 mm oben und unten', imDruck((b) => b.replace(/(@page\s*\{[^}]*margin:\s*)\S+/, (_, vor) => `${vor}30mm`)), /nutzbare Höhe unter 269 mm/],
    ['Reihe ohne Raster', imDruck((b) => b.replace(/display:\s*grid;\s*grid-auto-flow:\s*column;/, 'display: flex; flex-wrap: wrap;')), /Reihe der Mondgestalten darf umbrechen/],
    ['Reihe ohne Regel', imDruck((b) => b.replace('.hg-wahlreihe--bilder {', '.hg-wahlreihe--andere {')), /Reihe der Mondgestalten darf umbrechen/],
  ];
  for (const [name, aendere, muster] of mutanten) {
    const geaendert = aendere(css);
    assert.notEqual(geaendert, css, `${name}: die Änderung greift nicht`);
    assert.match(druckBudget(geaendert).join('; '), muster, name);
  }
  // Ein Kommentar mit einer Höhe zählt nicht: Das Stylesheet wird ohne Kommentare gelesen.
  assert.deepEqual(druckBudget(css.replace('@media print {', '@media print {\n  /* height: 1mm; min-height: 90mm; */')), []);
});

test('Knöpfe mindestens 48 px hoch: die gemeinsame Klasse .k-knopf hat min-height 3rem, die Kartenknöpfe sind höher und keine Regel macht einen Knopf niedriger (docs/02, touch ≥ 48 px)', async () => {
  const kinderCss = await readFile(new URL('../../../packages/kinder-ui/css/kinder.css', import.meta.url), 'utf8');
  assert.match(kinderCss, /\.k-knopf\s*\{[^}]*min-height:\s*3rem;/);
  assert.match(code['druck.css'], /\.k-knopf\.hg-kartenknopf\s*\{[^}]*min-height:\s*5\.5rem;/);
  // Jede Regel der App, deren Wähler einen Knopf trifft, darf nur Höhen von mindestens 48 px setzen und keine feste Höhe.
  const px = (wert, einheit) => (einheit === 'rem' ? Number(wert) * 18 : Number(wert));
  for (const [, wahl, inhalt] of code['druck.css'].matchAll(/([^{}@]+)\{([^{}]*)\}/g)) {
    if (!/\.k-knopf|button/.test(wahl)) continue;
    for (const [, wert, einheit] of inhalt.matchAll(/min-height:\s*([\d.]+)(rem|px)/g)) {
      assert.ok(px(wert, einheit) >= 48, `${wahl.trim()}: min-height ${wert}${einheit} ist unter 48 px`);
    }
    assert.ok(!/(?<![-\w])(?:max-)?height:/.test(inhalt), `${wahl.trim()}: feste Höhe an einem Knopf`);
  }
});

test('Druckbereich: nur die gewählten Blätter, außerhalb von #app; der Bildschirm-Teil ist nur auf dem Bildschirm; der Knopf ruft window.print() auf', () => {
  const app = code['app.mjs'];
  assert.match(app, /const druckBox = document\.getElementById\('druckbereich'\);/);
  assert.match(app, /setzeHtml\(druckBox, druckBlaetterHtml\(daten, druckAuswahl\)\);/, 'der Druckbereich baut nicht auf der Auswahl auf');
  // Der Druckbereich wird nach dem Hauptbereich neu gesetzt, in derselben Funktion.
  assert.ok(app.indexOf('app.replaceChildren(') < app.indexOf('setzeHtml(druckBox'), 'render() setzt erst #app, dann den Druckbereich');
  assert.match(app, /class: 'hg-vorschau-liste'/, 'die Vorschau steht im Bildschirmteil');
  assert.match(code['druck.css'], /\.hg-vorschau-liste[\s,{]/, 'die Vorschau-Liste hat keine Regel in druck.css');
  assert.match(app, /onclick: \(\) => window\.print\(\)/);
  assert.match(app, /disabled: n === 0/, 'ohne Blatt ist der Druckknopf aus');
  assert.match(app, /anzahlBlaetter\(druckAuswahl\)/);
  // Das Blatt ist ein Element mit der Klasse hg-blatt; druck.css bricht zwischen zwei Blättern die Seite um.
  for (const html of blattHtmlListe) assert.ok(html.startsWith('<section class="k-karte hg-blatt">'));
  assert.ok(!/hg-blatt--vorschau|feldKnoten|blattInhalt|druckInhalt/.test(app + code['druck.css']), 'Rest des alten Aufbaus');
});

test('Fokus nach Klick: jeder Knopf entsteht in knopf() mit data-kennung, jeder Aufruf nennt eine Kennung; render() merkt sich den Fokus und setzt ihn zurück', () => {
  const app = code['app.mjs'].replace(/\/\/.*$/gm, '');
  assert.equal((app.match(/el\('button'/g) ?? []).length, 1, 'alle Knöpfe entstehen in knopf()');
  assert.equal((app.match(/'data-kennung': /g) ?? []).length, 1, 'data-kennung wird in knopf() gesetzt');
  assert.match(app, /function knopf\(kennung, beschriftung,/);
  assert.match(app, /'data-kennung': kennung,/);
  const aufrufe = [...app.matchAll(/(?<![\w.])knopf\(/g)].length - 1; // ohne die Definition
  const mitKennung = [...app.matchAll(/(?<![\w.])knopf\(\s*(['`])[a-z][a-zA-Z0-9${}.\-[\] +]*\1,/g)].length;
  assert.equal(mitKennung, aufrufe, `${aufrufe} Aufrufe, aber nur ${mitKennung} mit Kennung als erstem Argument`);
  const feste = [...app.matchAll(/(?<![\w.])knopf\(\s*'([^']+)',/g)].map((m) => m[1]);
  assert.deepEqual([...new Set(feste)].sort(), [
    'anzahl-mehr', 'anzahl-weniger', 'beobachtungsblatt', 'druck', 'drucken', 'erwachsene', 'frage', 'mondblatt',
    'vorlesen', 'weiter', 'zu-den-karten', 'zum-druck', 'zurueck',
  ].sort(), 'die festen Kennungen weichen ab');
  assert.match(app, /function fokussiere\(kennung\)/);
  assert.match(app, /button\[data-kennung\]/, 'fokussiere sucht nur Knöpfe mit data-kennung');
  assert.match(app, /function fokussiere\(kennung\) \{[^}]*\bziel\?\.focus\(\);/, 'fokussiere setzt den Fokus nicht (focus() wird nicht aufgerufen)');
  const merke = app.indexOf('const merkeKennung = document.activeElement?.dataset?.kennung;');
  const neu = app.indexOf('app.replaceChildren(');
  const zurueckSetzen = app.indexOf('fokussiere(merkeKennung);');
  assert.ok(merke > -1 && neu > merke && zurueckSetzen > neu, 'Fokus muss vor replaceChildren gemerkt und danach gesetzt werden');
  assert.match(app, /aria-disabled/, 'Knöpfe am Rand bleiben fokussierbar (aria-disabled statt entfernt)');
  // Die beiden Knöpfe der Anzahl bleiben auch am Rand fokussierbar: aria-disabled, nicht disabled (sonst verliert der Fokus den Knopf).
  for (const kennung of ['anzahl-weniger', 'anzahl-mehr']) {
    const zeile = app.split('\n').find((z) => z.includes(`knopf('${kennung}'`));
    assert.ok(zeile, `${kennung}: Knopf fehlt`);
    assert.ok(/ariaDisabled:/.test(zeile) && !/(?<![A-Za-z])disabled:/.test(zeile), `${kennung}: muss fokussierbar bleiben`);
  }
});

test('Fokus nach einem Bildschirmwechsel: die Überschrift hat tabindex="-1" und bekommt den Fokus; jeder Wechsel läuft über gehe()', () => {
  const app = code['app.mjs'].replace(/\/\/.*$/gm, '');
  assert.match(app, /const titel = \(text\) => el\('h1', \{ class: 'k-titel hg-titel', tabindex: '-1' \}, text\);/);
  assert.match(app, /function gehe\(neu\) \{\s*zustand = neu;\s*render\('titel'\);\s*\}/);
  assert.match(app, /app\.querySelector\('\.hg-titel'\)\?\.focus\(\)/);
  assert.match(app, /ziel === 'titel'/);
  // Jede Ansicht beginnt mit der Überschrift aus titel().
  for (const name of ['ansichtStart', 'ansichtKarte', 'ansichtFrage', 'ansichtAntwort', 'ansichtEnde', 'ansichtErwachsene', 'ansichtDruck']) {
    const block = app.match(new RegExp(`function ${name}\\([^)]*\\) \\{[\\s\\S]*?\\n\\}`))?.[0] ?? '';
    assert.ok(block.includes('titel('), `${name}: keine Überschrift mit tabindex`);
  }
  // Ein Wechsel der Ansicht setzt den Zustand nie ohne gehe(): außerhalb von gehe() wird zustand nicht neu belegt.
  const zuweisungen = [...app.matchAll(/^\s*zustand = /gm)].length;
  assert.equal(zuweisungen, 1, 'zustand wird nur in gehe() gesetzt');
});

test('Vorlesen für Kinder über vorlesen() aus kinder-ui, nur mit einer Stimme auf dem Gerät, ohne die Hinweise für Erwachsene', () => {
  const app = code['app.mjs'];
  assert.match(app, /import \{ el, lokaleStimme, vorlesen \} from '\.\.\/\.\.\/packages\/kinder-ui\/js\/komponenten\.mjs';/);
  assert.match(app, /const stimme = lokaleStimme\('de'\);\s*if \(stimme === null\)/);
  assert.match(app, /vorlesen\(text, 'de-DE', stimme\)/);
  assert.equal(daten.texte.knoepfe.vorlesen, 'Vorlesen');
  // Jede Ansicht für das Kind hat den Vorlese-Knopf: Start, Karte, beide Fragen, beide Antworten, Ende.
  for (const name of ['ansichtStart', 'ansichtKarte', 'ansichtFrage', 'ansichtAntwort', 'ansichtEnde']) {
    const block = app.match(new RegExp(`function ${name}\\([^)]*\\) \\{[\\s\\S]*?\\n\\}`))?.[0] ?? '';
    assert.ok(block.includes('vorleseKnopf('), `${name}: kein Vorlese-Knopf`);
  }
  assert.equal([...app.matchAll(/vorleseKnopf\(/g)].length - 1, 7, 'sieben Vorlese-Knöpfe: Start, Karte, zwei Fragen, zwei Antworten, Ende (dazu die Definition)');
  assert.match(app, /vorleseKnopf\(vorlesetext\(karte\)\)/, 'die Karte liest nur ihren Kindertext');
  assert.ok(!/erwachsene/.test(app.match(/vorleseKnopf\([^)]*\)/g).join(' ')), 'ein Hinweis für Erwachsene wird vorgelesen');
  assert.ok(!/vorleseKnopf[^\n]*pflichtmarkierung/.test(app), 'die Marke wird vorgelesen');
});

test('Antwort ohne Wertung: keine grünen oder roten Rückmeldungen, kein Fortschrittsbalken, die Wahl wird nur benannt', () => {
  const app = code['app.mjs'];
  assert.ok(!/k-knopf--richtig|k-knopf--falsch|k-hinweis--richtig|k-hinweis--falsch|k-fortschritt/.test(app + code['druck.css']), 'Wertungs-Klasse');
  assert.ok(!/richtig|falsch/i.test(daten.texte.frage.angetippt + daten.texte.frage.mondFortschritt));
  assert.equal((app.match(/rueckmeldung\.richtig/g) ?? []).length, 1, 'das Feld richtig dient nur der neutralen Zeile „angetippt“');
  assert.match(app, /const angetippt = rueckmeldung\.richtig \? null : absatz\(fuelle\(T\.frage\.angetippt/);
  assert.ok(!/(?:punkte|rang|rekord|serie|stufe|summe)\w*\s*(?:\+\+|\+=)/i.test(app), 'ein Zähler wird erhöht');
});

test('keine uk- und ru-Fassung erfunden: der Vermerk steht im Quelltext, in den Daten und im GDD', () => {
  const vermerk = 'uk und ru: nicht vorhanden, offen.';
  assert.ok(code['index.html'].includes(vermerk), 'index.html: Vermerk fehlt');
  assert.ok(daten.sprachen.includes(vermerk), 'Daten: Vermerk fehlt');
  assert.ok(alle['GDD.md'].includes(vermerk), 'GDD.md: Vermerk fehlt');
  assert.ok(!/"(uk|ru)"\s*:/.test(code['daten/himmel.json']), 'Daten: uk- oder ru-Schlüssel');
  assert.match(code['index.html'], /<html lang="de">/);
});

// Modellnamen sind Entscheidung A1 (docs/offene-punkte-kita.md), hier bewusst nicht geprüft.
test('keine KI-Begriffe in den Dateien der App', () => {
  // Wer „Vollmond“ schreibt, trifft das Muster LLM (V-o-l-l-m-ond): darum steht in den Dateien „voller Mond“.
  const muster = /\bKI\b|LLM|Sprachmodell|Chatbot|künstliche Intelligenz/i;
  for (const [d, inhalt] of Object.entries(alle)) {
    assert.ok(!muster.test(inhalt), `${d}: ${inhalt.match(muster)?.[0]}`);
  }
});

test('keine Bewertung von Kindern im Code und in den Daten: keine Punkte, Stufe, Rang, Einstufung, Note (docs/02 Z. 141–146)', () => {
  // Dokumente dürfen solche Wörter verneinen („keine Punkte“), Oberfläche und Daten nicht.
  // „Sterne“ steht hier nicht: das Wort ist als Himmelskörper ein Inhalt, es hat seinen eigenen Test unten.
  const muster = /unsicher|Selbstwert|Risiko|Diagnose|\bPunkte?\b|Rangliste|\bRang\b|Einstufung|\bStufe\b|\bPlatz\b|Prozent|\bErgebnis\b|\bNoten?\b|Rekord|geschafft|Pokal|Medaille/i;
  for (const d of CODE_DATEIEN) {
    assert.ok(!muster.test(code[d]), `${d}: ${code[d].match(muster)?.[0]}`);
  }
  // Prozentangaben in Texten (nicht die Breiten im Stylesheet).
  for (const d of ['index.html', 'daten/himmel.json']) {
    assert.ok(!/\d\s*%/.test(code[d]), `${d}: Prozentangabe`);
  }
  // Die Wortliste der Wurzel für die Wertung des Ergebnisses (Rekord, Rang, Zähler mit „n von m“).
  for (const d of ['index.html', 'app.mjs', 'logik.mjs', 'bilder.mjs', 'daten/himmel.json']) {
    assert.deepEqual(appGruende(d, code[d]), [], `${d}: Wertungs-Stand der Wurzel schlägt an`);
  }
});

test('Sterne: das Wort kommt nur als Himmelskörper vor, nur in der Seite und in den Daten, nie als Zeichen, Zähler oder Belohnung', async () => {
  // Das Werkzeug tools/leistungs-woerter.mjs meldet „Sterne“ in der Gruppe sterneUndPokale. Hier steht es für den
  // Himmelskörper (Titel der App, Titel der Karte, Kindertexte). Jeder Treffer muss genau das sein und in diesen zwei Dateien stehen.
  const treffer = (await appLeistungsTreffer(WURZEL, [SLUG]))[SLUG] ?? [];
  assert.ok(treffer.length >= 3, `nur ${treffer.length} Treffer: der Titel und die Karte nennen das Wort`);
  for (const t of treffer) {
    assert.equal(t.gruppe, 'sterneUndPokale', `${t.datei}: ${t.gruppe} ${t.wort}`);
    assert.match(t.wort, /^sterne?$/i, `${t.datei}: ${t.wort}`);
    assert.ok(['index.html', 'daten/himmel.json'].includes(t.datei), `${t.datei}: das Wort steht im Code`);
  }
  for (const d of ['app.mjs', 'logik.mjs', 'bilder.mjs', 'druck.css']) {
    assert.ok(!/\bSterne?\b/i.test(code[d]), `${d}: das Wort steht im Code`);
  }
  // Kein Zeichen und kein Emoji für Sterne, und in der Nähe des Wortes steht nichts, was nach Belohnung klingt.
  assert.ok(!/[★☆⭐🌟]/u.test(Object.values(code).join('')), 'Stern-Zeichen');
  const belohnung = /sammel|verdien|bekomm|erhalt|gewonn|Belohn|Level|Stufe|geschafft|Pokal|Preis/i;
  for (const d of ['index.html', 'daten/himmel.json']) {
    for (const m of code[d].matchAll(/\bSterne?\b/gi)) {
      const umgebung = code[d].slice(Math.max(0, m.index - 70), m.index + 70);
      assert.ok(!belohnung.test(umgebung), `${d}: Belohnung neben dem Wort: ${umgebung}`);
    }
  }
  assert.match(alle['README.md'], /sterneUndPokale/, 'README.md erklärt die Treffer der Wortliste');
  // Die Zahlen in der README stimmen mit dem Werkzeug überein.
  for (const datei of ['index.html', 'daten/himmel.json']) {
    const n = treffer.filter((t) => t.datei === datei).length;
    assert.ok(alle['README.md'].includes(`${n} Treffer in \`${datei}\``), `README.md nennt nicht „${n} Treffer in ${datei}“`);
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

test('kein toter Link: es gibt keine eltern.html, die App verlinkt nur das Impressum; die Hinweise für Erwachsene stehen in der App', async () => {
  const dateien = await readdir(new URL('.', APP));
  assert.ok(!dateien.includes('eltern.html'));
  const hrefs = [...code['app.mjs'].matchAll(/href: '([^']+)'/g)].map((m) => m[1]);
  assert.deepEqual(hrefs, ['../../impressum.html']);
  assert.ok(!/eltern\.html/.test(code['app.mjs'] + code['index.html']));
  assert.ok(code['app.mjs'].includes("knopf('erwachsene'"), 'kein Zugang zur Ansicht für Erwachsene');
});

test('Texte stehen in den Daten: jeder Textschlüssel, den app.mjs oder logik.mjs benutzt, ist da, und kein Text in den Daten bleibt ungenutzt', () => {
  const app = code['app.mjs'];
  const fehlt = [];
  for (const m of app.matchAll(/\bT\.(\w+)\.(\w+)/g)) {
    if (!(m[2] in (daten.texte[m[1]] ?? {}))) fehlt.push(`T.${m[1]}.${m[2]}`);
  }
  for (const m of app.matchAll(/\bD\.(\w+)/g)) {
    if (!(m[1] in daten.texte.druck)) fehlt.push(`D.${m[1]}`);
  }
  for (const m of code['logik.mjs'].matchAll(/\btexte\.(\w+)/g)) {
    if (!(m[1] in daten.texte.druck)) fehlt.push(`texte.${m[1]} (logik.mjs)`);
  }
  assert.deepEqual(fehlt, [], `Textschlüssel ohne Text: ${fehlt.join(', ')}`);
  const benutzt = app + code['logik.mjs'];
  const tot = [];
  for (const [gruppe, texte] of Object.entries(daten.texte)) {
    for (const schluessel of Object.keys(texte)) {
      if (!new RegExp(`\\.${schluessel}(?![\\w])`).test(benutzt)) tot.push(`${gruppe}.${schluessel}`);
    }
  }
  assert.deepEqual(tot, [], `Texte in den Daten, die niemand benutzt: ${tot.join(', ')}`);
  for (const karte of daten.karten) {
    for (const feld of ['unterzeile', 'icon', 'bildText', 'benennung']) {
      if (feld in karte) assert.ok(new RegExp(`\\.${feld}(?![\\w])`).test(benutzt) || feld === 'benennung', `Feld ${feld} ohne Verwendung`);
    }
  }
});

test('README und GDD beschreiben die Abweichungen vom Bauauftrag, die Wortliste und das Offene', () => {
  const readme = alle['README.md'];
  for (const abschnitt of ['## Was die App tut', '## Was belegt ist', '## Was Eigenentwurf ist', '## Abweichungen vom Bauauftrag', '## Wortliste der Wertung', '## Offen', '## Tests']) {
    assert.ok(readme.includes(abschnitt), `README.md: Abschnitt „${abschnitt}“ fehlt`);
  }
  assert.match(readme, /quiz-kern/, 'README.md nennt die Abweichung bei der Engine nicht');
  assert.match(readme, /ANZAHL_OPTIONEN/, 'README.md nennt die Abweichung bei der Zahl der Antworten nicht');
  assert.ok(alle['GDD.md'].includes('**Vorlesen:** gebaut'), 'GDD.md: der Vermerk zum Vorlesen fehlt');
  for (const kennung of ['CON-6', 'docs/10, Z. 453']) {
    assert.ok(readme.includes(kennung) || alle['GDD.md'].includes(kennung), `weder README noch GDD nennen ${kennung}`);
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
  assert.equal(pkg.name, `@info70/${SLUG}`);
  assert.equal(pkg.private, true);
  assert.equal(pkg.type, 'module');
  assert.equal(pkg.license, 'AGPL-3.0-only');
  assert.match(pkg.scripts?.test ?? '', /node --test/);
});
