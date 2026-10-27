import { test } from 'node:test';
import assert from 'node:assert/strict';
import { access, readdir, readFile } from 'node:fs/promises';
import daten from '../daten/ideen.json' with { type: 'json' };
import { kartenText } from '../logik.mjs';

// Projektregeln, für diese App geprüft: docs/02 Z. 22–24 (keine Anfragen nach außen),
// docs/02 Z. 79–82 (Druck), docs/02 Z. 141–146 (keine Bewertung von Kindern), docs/02 Z. 50
// (48 px Knöpfe). Die Speicher-, Zufalls- und Altersregeln sind Projektregeln.
// Die Druckprüfung nimmt jede Ideenkarte einzeln: das Blatt ist der Text aus blattTeile
// (logik.mjs), also genau das, was auf dem Papier steht.
// Die Testdateien selbst dürfen die verbotenen Wörter nennen, um sie zu verbieten.

const APP = new URL('../', import.meta.url);
// Der Bildschirmteil (app.mjs, index.html) trägt Emojis, und das ist erlaubt; geprüft wird,
// was ins Papier geht: das Blatt in logik.mjs, die Druckregeln in druck.css und die Funktion druckBlatt.
const CODE_DATEIEN = ['index.html', 'app.mjs', 'logik.mjs', 'druck.css', 'daten/ideen.json'];
const ALLE_DATEIEN = [...CODE_DATEIEN, 'package.json', 'README.md', 'GDD.md'];
const PFLICHT = 'Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.';

const lese = (datei) => readFile(new URL(datei, APP), 'utf8');
const code = Object.fromEntries(await Promise.all(CODE_DATEIEN.map(async (d) => [d, await lese(d)])));
const alle = Object.fromEntries(await Promise.all(ALLE_DATEIEN.map(async (d) => [d, await lese(d)])));
const druckBlatt = code['app.mjs'].match(/function druckBlatt\([\s\S]*?\n\}/)?.[0] ?? '';

// Ein Blatt je Ideenkarte: jede Karte wird gedruckt, also wird jede Karte geprüft.
const blaetter = daten.ideen.map((i) => kartenText(daten, i.id));

test('Blätter sind da: je Ideenkarte ein Blatt, und das Blatt ist nicht leer', () => {
  assert.equal(blaetter.length, daten.ideen.length);
  assert.ok(daten.ideen.length >= 6, 'zu wenige Ideenkarten');
  for (const [i, text] of blaetter.entries()) {
    assert.ok(text.length > 200, `Blatt ${i}: zu kurz`);
  }
});

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
  // fetch() lädt nur daten/ideen.json der App; das ist die einzige Anfrage.
  assert.equal((code['app.mjs'].match(/\bfetch\s*\(/g) ?? []).length, 1, 'app.mjs: genau ein fetch erwartet');
  assert.ok(code['app.mjs'].includes("fetch('daten/ideen.json')"), 'app.mjs: fetch lädt nicht die eigene Datei');
  assert.ok(!netz.test(code['logik.mjs']), 'logik.mjs: Netzaufruf gefunden');
  assert.ok(!/@import/.test(code['druck.css']), 'druck.css: @import');
});

test('Zufall nur in app.mjs: die App hat keinen Zufall; logik.mjs, Daten und Stylesheets haben keine Zufallsquelle und keine Uhr', () => {
  assert.equal((code['app.mjs'].match(/Math\.random/g) ?? []).length, 0);
  for (const d of ['logik.mjs', 'daten/ideen.json', 'index.html', 'druck.css']) {
    assert.ok(!/Math\.random|crypto|Date\.now|new Date|performance\./.test(code[d]), `${d}: Zufall oder Uhr`);
  }
});

test('die Karten kommen per JSON-Import mit Typangabe, die Oberfläche lädt nichts nach', () => {
  assert.match(code['app.mjs'], /^import \{ BEREICHE, ideeVon, materialVon, ideenFuer, karte, blattTeile, pruefeDaten \} from '\.\/logik\.mjs';$/m);
  assert.match(code['app.mjs'], /fetch\('daten\/ideen\.json'\)/);
});

test('Grundgerüst: deutsch, Viewport, CSP exakt, nur eigene Stylesheets und ein Modul-Skript', () => {
  const html = code['index.html'];
  assert.match(html, /<html lang="de">/);
  assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1"/);
  assert.match(html, /<meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline'"/);
  assert.match(html, /<noscript>/);
  const links = [...html.matchAll(/<link rel="stylesheet"[^>]*href="([^"]+)"/g)].map((m) => m[1]);
  // Jeder andere Link ist genau das gemeinsame Favicon (gleicher Ursprung, Entscheidung Max 21а): nichts Fremdes.
  const andereLinks = [...html.matchAll(/<link(?![^>]*rel="stylesheet")[^>]*>/g)].map((m) => m[0]);
  assert.ok(andereLinks.every((l) => /^<link rel="icon" type="image\/svg\+xml" href="(?:\.\.\/\.\.\/)?packages\/kinder-ui\/img\/favicon\.svg" \/>$/.test(l)), `index.html: fremder Link ${andereLinks.join(' ')}`);
  assert.deepEqual(links, ['../../packages/kinder-ui/css/kinder.css', 'druck.css']);
  const skripte = [...html.matchAll(/<script[^>]*src="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(skripte, ['app.mjs']);
});

test('aria-live="polite" auf dem Hauptbereich #app', () => {
  const tag = code['index.html'].match(/<main[^>]*id="app"[^>]*>/)?.[0];
  assert.ok(tag, '<main id="app"> fehlt');
  assert.match(tag, /aria-live="polite"/);
});

test('Netzwerk-Wächter: aus packages/kinderschutz importiert und aufgerufen', async () => {
  assert.match(code['app.mjs'], /import \{ installiereNetzwerkWaechter \} from '\.\.\/\.\.\/packages\/kinderschutz\/src\/index\.mjs';/);
  assert.match(code['app.mjs'], /^installiereNetzwerkWaechter\(\);$/m);
  await access(new URL('../../../packages/kinderschutz/src/index.mjs', import.meta.url));
});

test('keine Druckzeichen im Blatt: keine Häkchen, Kästchen, Sterne, Punkte als Zeichen, keine Emojis, keine Pfeile', () => {
  // Zeichenblöcke statt Aufzählung: Pfeile, Math-Zeichen, Dingbats, geometrische Formen, Emojis.
  const zeichen = /[☐☒☑✓✔✗✘✅❌★☆•●○◦·∙‧▪▫◾◽■□]|[←-⋿⌀-➿⦀-⧿⬀-⯿■-◿・]|\p{Extended_Pictographic}/u;
  for (const [i, text] of blaetter.entries()) {
    assert.ok(!zeichen.test(text), `Blatt ${i}: Druckzeichen im Drucktext: ${text.match(zeichen)?.[0]}`);
  }
  assert.ok(!/\p{Extended_Pictographic}/u.test(druckBlatt), 'druckBlatt: Emoji im Code des Blatts');
  assert.ok(!/\p{Extended_Pictographic}/u.test(code['druck.css']), 'druck.css: Emoji');
});

test('Druckblatt ohne Namenszeile und ohne Tages- oder Wochentagsfeld', () => {
  // „Name“ auch in Zusammensetzungen; „Namen“ im Fließtext bleibt erlaubt.
  const namenUndTage = /Name(?!n\b)|Datum|Wochentag|\b(Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag|Sonntag)\b|\bTage?\b|_{3,}|…{2,}/i;
  for (const [i, text] of blaetter.entries()) {
    assert.ok(!namenUndTage.test(text), `Blatt ${i}: Namenszeile oder Tagesfeld im Druck: ${text.match(namenUndTage)?.[0]}`);
  }
  assert.ok(!/Name\s*:|_{3,}/.test(code['app.mjs'] + code['druck.css']), 'app.mjs oder druck.css: Namenszeile');
});

test('Pflichtmarkierung: auf jedem Blatt, in README und GDD unter „## Offen“; nie „von Hand geprüft“', () => {
  assert.equal(daten.pflichtmarkierung, PFLICHT);
  for (const [i, text] of blaetter.entries()) {
    assert.ok(text.includes(PFLICHT), `Blatt ${i}: Pflichtmarkierung fehlt im Druck`);
  }
  assert.match(druckBlatt, /el\('p', \{ class: 'ek-pflicht' \}, t\.pflicht\)/, 'das Blatt rendert die Pflichtmarkierung nicht');
  assert.ok(alle['README.md'].includes(PFLICHT), 'README.md: Pflichtmarkierung fehlt');
  const gdd = alle['GDD.md'];
  assert.ok(gdd.includes('## Offen'), 'GDD.md: Abschnitt „## Offen“ fehlt');
  assert.ok(gdd.slice(gdd.indexOf('## Offen')).includes(PFLICHT), 'GDD.md: Pflichtmarkierung nicht unter „## Offen“');
  for (const [d, inhalt] of Object.entries(alle)) {
    assert.ok(!/von Hand geprüft/i.test(inhalt), `${d}: „von Hand geprüft“ ist nicht belegt`);
  }
});

test('Eigenentwurf-Kennzeichnung: Blattkopf und jedes Blatt nennen den Eigenentwurf', () => {
  assert.match(daten.blattkopf, /Eigenentwurf/, 'Blattkopf ohne Eigenentwurf-Kennzeichnung');
  for (const [i, text] of blaetter.entries()) {
    assert.match(text, /Eigenentwurf/, `Blatt ${i}: ohne Kennzeichnung`);
  }
});

test('druck.css: A4 hoch, Bildschirmelemente nur im Bildschirm, das Blatt wird nicht zerrissen; Fußlink 48 px hoch', () => {
  const css = code['druck.css'];
  assert.match(css, /@media print \{/);
  assert.match(css, /@page\s*\{\s*size: A4 portrait;/);
  assert.match(css, /\.ek-nur-bildschirm\s*\{\s*display: none !important;\s*\}/);
  assert.match(css, /\.ek-nur-druck\s*\{\s*display: block !important;\s*\}/);
  assert.match(css, /break-inside: avoid;/);
  assert.match(css, /\.k-fuss a\s*\{[^}]*min-height: 48px;/);
  assert.match(css, /\.ek-verweis\s*\{[^}]*min-height: 48px;/, 'Verweise auf Nachbar-Apps: unter 48 px');
  assert.match(code['app.mjs'], /el\('a', \{ href: '\.\.\/\.\.\/impressum\.html' \}, 'Impressum & Datenschutz'\)/);
});

test('Knöpfe mindestens 48 px hoch: die gemeinsame Klasse .k-knopf hat min-height 3rem (docs/02, Touch ≥ 48 px)', async () => {
  const kinderCss = await readFile(new URL('../../../packages/kinder-ui/css/kinder.css', import.meta.url), 'utf8');
  assert.match(kinderCss, /\.k-knopf\s*\{[^}]*min-height:\s*3rem;/);
});

test('Druckbereich: nur das eine Blatt der offenen Karte, der Bildschirm wird nicht gedruckt', () => {
  const app = code['app.mjs'];
  assert.match(app, /el\('article', \{ class: 'ek-blatt ek-nur-druck', id: 'druckbereich' \}/);
  assert.match(app, /: druckBlatt\(offeneIdee\),/);
  assert.match(app, /onclick: \(\) => window\.print\(\)/);
});

test('keine uk- und ru-Fassung erfunden: der Vermerk steht im GDD', () => {
  assert.ok(alle['GDD.md'].includes('uk und ru'), 'GDD.md: Vermerk zu uk und ru fehlt');
  assert.ok(!/"(uk|ru)"\s*:/.test(code['daten/ideen.json']), 'Daten: uk- oder ru-Schlüssel');
});

// Modellnamen sind Entscheidung A1 (docs/offene-punkte-kita.md), hier bewusst nicht geprüft.
test('keine KI-Begriffe in den Dateien der App', () => {
  const muster = /\bKI\b|\bLLM\b|Sprachmodell|Chatbot|künstliche Intelligenz/i;
  for (const [d, inhalt] of Object.entries(alle)) {
    assert.ok(!muster.test(inhalt), `${d}: ${inhalt.match(muster)?.[0]}`);
  }
});

test('keine Bewertung von Kindern im Code und in den Daten: keine Punkte, Stufe, Rang, Einstufung, Note (docs/02 Z. 141–146)', () => {
  // Eine Wertung des Kindes: Zahl mit Punkten, Rang, Stufe, Note. „der Punkt“ im Sinn von
  // „die Sache“ und „zwei Punkte“ als Angabe über die Quelle sind keine Wertung. Die Einstufung
  // selbst prüft logik.test.mjs mit EINSTUFUNG. „Kein vorzeigbares Ergebnis“ verneint ein Ergebnis.
  const muster = /unsicher|Selbstwert|Risiko|(?<!kein )Diagnose|\b\d+\s+Punkte?\b|Punktzahl|Rangliste|\bRang\b|Einstufung|\bStufe\b|\bPlatz\b|Prozent|\bSterne?\b|\bErgebnis\b|\bNoten?\b/i;
  for (const d of ['app.mjs', 'druck.css', 'daten/ideen.json']) {
    const text = code[d]
      .replace(/(?:Kein|kein|ein) vorzeigbares Ergebnis/g, '')
      .replace(/die Einstufung, die diese App nicht macht/g, '');
    assert.ok(!muster.test(text), `${d}: ${text.match(muster)?.[0]}`);
  }
});

test('externe Fakten: jeder Satz mit Norm-, Studien-, Behörden- oder Erste-Hilfe-Angabe trägt eine Fundstelle oder den Vermerk', () => {
  // Wie in puppentheater-werkstatt, aber je SATZ statt je Zeile: eine Zeile der JSON-Datei ist oft ein
  // ganzer Absatz, und ein Vermerk am Ende würde die Sätze davor decken. Auch eine Verneinung („keine
  // Referenzliste“) ist eine Aussage über die Welt draußen und braucht die Fundstelle oder den Vermerk.
  // Ohne /i: der Schlüssel „elterntelefon“ im Code ist keine Behauptung; Prozent nur als Prosa („50 %“).
  const behauptung = /(?<![\wÄÖÜäöüß])(?:EN \d|DIN\b|ISO \d|AWMF|BZgA|BIÖG|BIOeG|WHO\b|G-BA|Gemeinsamen? Bundesausschuss|Kinder-Richtlinie|U[78]a?\b|Leitlinie|Richtlinie|Verordnung|Gesetz|Studie|Erste[- ]Hilfe|Kinderklinik|Notruf|[Aa]mtlich|Warnung|Behörde|Ärzt|Elterntelefon|0800|Prozent)|\d+ ?% (?=\s)|\d{1,2}\.\s*(?:Monat|Lebensmonat)/;
  const beleg = /Eigenentwurf, fachlich nicht geprüft|Praleska|\(S\. \d/;
  // JSON-Werte einzeln lesen, damit kein Satz über die Grenze eines Feldes hinweg läuft.
  const werte = (x) => typeof x === 'string' ? [x]
    : Array.isArray(x) ? x.flatMap(werte)
      : x && typeof x === 'object' ? Object.values(x).flatMap(werte) : [];
  const befunde = [];
  for (const d of ALLE_DATEIEN) {
    const texte = d.endsWith('.json') ? werte(JSON.parse(alle[d])) : [alle[d]];
    for (const text of texte) {
      // Der Punkt in „24. Monat“, „S. 96“ und „U7“ endet keinen Satz.
      for (const satz of text.replace(/\s+/g, ' ').split(/(?<![\dSZ])[.!?]\s+/)) {
        if (behauptung.test(satz) && !beleg.test(satz)) befunde.push(`${d}: ${satz.slice(0, 80)}`);
      }
    }
  }
  assert.deepEqual(befunde, [], `Behauptung ohne Quelle oder Vermerk:\n${befunde.join('\n')}`);
});

test('Testzahl: README und GDD nennen die Zahl der Tests, die in test/ tatsächlich stehen', async () => {
  const dateien = (await readdir(new URL('test/', APP))).filter((d) => d.endsWith('.test.mjs'));
  let echt = 0;
  for (const d of dateien) {
    const quelle = await readFile(new URL(`test/${d}`, APP), 'utf8');
    echt += (quelle.match(/^test\(/gm) ?? []).length;
  }
  assert.ok(echt >= 20, `nur ${echt} Tests gefunden`);
  // README nennt die Zahl als „N тест“, die GDD als „N Tests“.
  const nennungen = {
    'README.md': [...alle['README.md'].matchAll(/(\d+)\s+тест/g)].map((m) => Number(m[1])),
    'GDD.md': [...alle['GDD.md'].matchAll(/(?<![\d,.])(\d+)\s+Tests?(?![\wäöüß])/g)].map((m) => Number(m[1])),
  };
  for (const [doc, zahlen] of Object.entries(nennungen)) {
    assert.ok(zahlen.length >= 1, `${doc} nennt keine Testzahl`);
    for (const n of zahlen) {
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
