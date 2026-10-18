import { test } from 'node:test';
import assert from 'node:assert/strict';
import { access, readdir, readFile } from 'node:fs/promises';
import daten from '../daten/kartei.json' with { type: 'json' };
import { spieleIm, kartenDruckText, druckBlock } from '../logik.mjs';
import { fileURLToPath } from 'node:url';
import { externeFakten } from '../../../packages/kinderschutz/src/externe-fakten.mjs';

// Projektregeln, für diese App geprüft: docs/02 Z. 22–24 (keine Anfragen nach außen),
// docs/02 Z. 79–82 (Druckbögen), docs/02 Z. 141–146 (keine Bewertung von Kindern);
// die Speicherregel und die Zufallsregel haben keine docs/02-Zeile, sie sind Projektregeln.
// Die Prüfung liest die Dateien der App (ohne test/). Die Testdateien selbst dürfen
// die verbotenen Wörter nennen, um sie zu verbieten.

const APP = new URL('../', import.meta.url);
const CODE_DATEIEN = ['index.html', 'app.mjs', 'logik.mjs', 'druck.css', 'daten/kartei.json'];
const ALLE_DATEIEN = [...CODE_DATEIEN, 'package.json', 'README.md', 'GDD.md'];

const lese = (datei) => readFile(new URL(datei, APP), 'utf8');
const code = Object.fromEntries(await Promise.all(CODE_DATEIEN.map(async (d) => [d, await lese(d)])));
const alle = Object.fromEntries(await Promise.all(ALLE_DATEIEN.map(async (d) => [d, await lese(d)])));
const app = code['app.mjs'];
const logik = code['logik.mjs'];
const druck = code['druck.css'];

// Das Blatt jeder Karte: genau der Text, den kartenDruckText liefert. Jedes Spiel ergibt
// ein Blatt; ein Register mit drei Spielen druckt drei Blätter.
const blaetter = daten.spiele.map((s) => kartenDruckText(daten, s));

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

test('keine externen Adressen, keine Netzaufrufe; die Daten kommen per JSON-Import', () => {
  const netz = /\bfetch\s*\(|XMLHttpRequest|WebSocket|sendBeacon|EventSource|importScripts|new Worker|window\[|globalThis|wss?:/;
  for (const d of CODE_DATEIEN) {
    assert.ok(!/https?:\/\/|(?<![:\w])\/\/[\w-]+\.[a-z]{2,}/i.test(code[d]), `${d}: externe Adresse`);
  }
  for (const d of ['app.mjs', 'logik.mjs']) {
    assert.ok(!netz.test(code[d]), `${d}: Netzaufruf gefunden`);
  }
  assert.ok(!/@import/.test(druck), 'druck.css: @import');
  assert.match(app, /^import daten from '\.\/daten\/kartei\.json' with \{ type: 'json' \};$/m);
});

test('Zufall nur in app.mjs: logik.mjs, Daten, Oberfläche und Druckregeln haben keine Zufallsquelle und keine Uhr', () => {
  for (const d of ['logik.mjs', 'daten/kartei.json', 'index.html', 'druck.css']) {
    assert.ok(!/Math\.random|crypto|Date\.now|new Date|performance\./.test(code[d]), `${d}: Zufall oder Uhr`);
  }
  assert.doesNotMatch(logik, /Math\.random/);
});

test('Grundgerüst: deutsch, Viewport, CSP exakt, nur eigene Stylesheets und ein Modul-Skript', () => {
  const html = code['index.html'];
  assert.match(html, /<html lang="de">/);
  assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1"/);
  assert.match(html, /<meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline'"/);
  assert.match(html, /<noscript>/);
  assert.match(html, /<title>Puste- und Lauschspiele<\/title>/);
  const links = [...html.matchAll(/<link[^>]*href="([^"]+)"/g)].map((m) => m[1]);
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
  assert.match(app, /import \{ installiereNetzwerkWaechter \} from '\.\.\/\.\.\/packages\/kinderschutz\/src\/index\.mjs';/);
  assert.match(app, /^installiereNetzwerkWaechter\(\);$/m);
  await access(new URL('../../../packages/kinderschutz/src/index.mjs', import.meta.url));
});

test('keine Druckzeichen auf dem Blatt: keine Häkchen, Kästchen, Sterne, Pfeile, Emojis', () => {
  // Zeichenblöcke statt Aufzählung: Pfeile, Math-Zeichen, Dingbats, geometrische Formen, Emojis.
  const zeichen = /[☐☒☑✓✔✗✘✅❌★☆•●○◦·∙‧▪▫◾◽■□]|[←-⋿⌀-➿⦀-⧿⬀-⯿■-◿・]|\p{Extended_Pictographic}/u;
  for (const [i, text] of blaetter.entries()) {
    assert.ok(!zeichen.test(text), `Blatt ${i}: Druckzeichen im Drucktext`);
  }
  for (const d of ['logik.mjs', 'druck.css']) {
    assert.ok(!zeichen.test(code[d]), `${d}: Druckzeichen gefunden`);
  }
});

test('Emojis in app.mjs nur dort, wo sie nicht gedruckt werden', () => {
  // Jede Zeile mit einem Emoji muss eine Bildschirm-Markierung tragen. Das Blatt
  // holt sein Zeichen über bild(), dessen Klasse im Druck ausgeblendet wird.
  const bildschirm = /bild\(|zeile\(|plk-nur-bildschirm|BESCHRIFTUNG|UNTERTITEL|vorleseKnopf|hinweisKarte\(|k-knopf|'🫧/;
  const emoji = /\p{Extended_Pictographic}/u;
  // Die Tabellen BESCHRIFTUNG und UNTERTITEL stehen nur auf Knöpfen und Überschriften des Bildschirms.
  let inTabelle = false;
  app.split('\n').forEach((zeile, i) => {
    if (/^const (BESCHRIFTUNG|UNTERTITEL) = \{/.test(zeile)) inTabelle = true;
    const tabelle = inTabelle;
    if (inTabelle && /^\};/.test(zeile)) inTabelle = false;
    if (!emoji.test(zeile) || tabelle) return;
    if (/^\s*\/\//.test(zeile)) return;
    assert.ok(bildschirm.test(zeile), `app.mjs Zeile ${i + 1}: Emoji ohne Bildschirm-Markierung: ${zeile.trim().slice(0, 70)}`);
  });
});

test('Druckblatt ohne Namenszeile und ohne Tages- oder Wochentagsfeld', () => {
  // „Name“ auch in Zusammensetzungen; „Namen“ im Fließtext bleibt erlaubt.
  // „namentlich“ ist ein Wort im Fließtext; das Muster trifft nur ganze Wörter.
  const namenUndTage = /\b(Vor|Nach)?Name\b|Namenszeile|Namensfeld|Datum|Wochentag|\b(Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag|Sonntag)\b|\bTage?\b|_{3,}|…{2,}/i;
  for (const [i, text] of blaetter.entries()) {
    assert.ok(!namenUndTage.test(text), `Blatt ${i}: Namenszeile oder Tagesfeld im Druck`);
  }
  assert.ok(!/Name\s*:|_{3,}/.test(app + druck), 'app.mjs oder druck.css: Namenszeile');
});

test('Druckblatt ohne Seitenangabe: die Karte trägt keine Quellenseite', () => {
  // Standard für neue Apps (A18): keine Seitenzahl auf dem Blatt. Die Seitenangaben
  // stehen auf dem Bildschirm in der Ausschlussliste und in den Daten im Feld quelle.
  for (const [i, text] of blaetter.entries()) {
    assert.doesNotMatch(text, /S\. \d|Seite \d/, `Blatt ${i}: Seitenangabe auf dem Blatt`);
  }
});

test('Jedes Blatt nennt den Registerhinweis und ist als Eigenentwurf gekennzeichnet', () => {
  for (const s of daten.spiele) {
    const text = kartenDruckText(daten, s);
    assert.match(text, /^Register: .+ \(Eigenentwurf\)/, s.id);
  }
});

test('Jedes Blatt trägt das, was für jede Karte gilt: kein Übungsversprechen, Aufhören, Weg bei Sorge', () => {
  for (const s of daten.spiele) {
    const block = druckBlock(daten, s.register);
    assert.ok(block.includes(daten.keinTrainingsversprechen), s.id);
    assert.ok(block.includes(daten.abbruch), s.id);
    assert.ok(block.includes(daten.wennSorge), s.id);
    assert.match(kartenDruckText(daten, s), /verspricht keine bessere Aussprache/, s.id);
  }
  // Die Lautstärke gehört zu den Lauschspielen, nicht zu jeder Karte.
  for (const s of spieleIm(daten, 'lauschspiel')) {
    assert.ok(druckBlock(daten, 'lauschspiel').includes(daten.lautstaerke), s.id);
  }
  assert.ok(!druckBlock(daten, 'pustespiel').includes(daten.lautstaerke));
});

test('Pustespiel-Blätter tragen das Trainings-Dementi', () => {
  for (const s of spieleIm(daten, 'pustespiel')) {
    assert.match(s.keinTraining, /trainiert|übt keine|kein Training|keine Übung|ist ein Spiel/i, s.id);
    assert.ok(kartenDruckText(daten, s).includes(s.keinTraining), s.id);
  }
});

test('Eigenentwurf-Kennzeichnung: Registerhinweis steht auf jedem Blatt, im Quelltext der Karte auch', () => {
  assert.match(app, /\(Eigenentwurf\)/);
  assert.match(logik, /\(Eigenentwurf\)/);
});

test('Die Marke steht vollständig: keine Kurzform mit Doppelpunkt in den Dateien der App', () => {
  // Statt „Eigenentwurf: …“ steht die volle Marke am Satz. Der Registerhinweis „(Eigenentwurf)“
  // ist ein Etikett des Blatts und keine Aussage über eine Norm, Studie oder Erste Hilfe.
  for (const [d, inhalt] of Object.entries(alle)) {
    assert.ok(!/Eigenentwurf\s*:/.test(inhalt), `${d}: Kurzform statt der vollen Marke`);
  }
});

test('druck.css: A4 hoch, Bildschirmteile ausgeblendet, eine Karte je Blatt, Knöpfe und Links 48 px', () => {
  assert.match(druck, /@media print \{/);
  assert.match(druck, /@page \{ size: A4 portrait;/);
  assert.match(druck, /\.plk-nur-bildschirm \{ display: none !important; \}/);
  assert.match(druck, /\.plk-nur-druck \{ display: block !important; \}/);
  assert.match(druck, /\.plk-karte \+ \.plk-karte \{ break-before: page;/);
  assert.match(druck, /\.plk-karte \{[^}]*break-inside: avoid;/);
  // Kommentare dürfen die verbotenen Wörter nennen, um sie zu verbieten.
  const regeln = druck.replace(/\/\*[\s\S]*?\*\//g, '');
  for (const verboten of ['Haken', 'Häkchen', 'Stern', 'Urkunde', 'Name:', 'Punkte']) {
    assert.ok(!regeln.includes(verboten), `eine Druckregel erzeugt „${verboten}“`);
  }
  assert.doesNotMatch(regeln, /content:\s*["'][^"']*[☐☑★⭐✔]/);
});

test('Links auf dem Bildschirm sind mindestens 48 px hoch', () => {
  for (const zeile of app.split('\n').filter((z) => /el\('a'/.test(z))) {
    assert.match(zeile, /min-height:48px/, zeile.trim().slice(0, 80));
  }
});

test('Knöpfe mindestens 48 px hoch: die gemeinsame Klasse .k-knopf hat min-height 3rem (docs/02)', async () => {
  const kinderCss = await readFile(new URL('../../../packages/kinder-ui/css/kinder.css', import.meta.url), 'utf8');
  assert.match(kinderCss, /\.k-knopf\s*\{[^}]*min-height:\s*3rem;/);
});

test('Fokus nach Klick: jeder Knopf trägt eine data-kennung, die Kennungen sind eindeutig; render() merkt sich den Fokus', () => {
  // Jeder Knopf trägt eine Kennung; dazu kommt die Überschrift des Auswahl-Bildschirms,
  // die den Fokus bekommt, wenn der Knopf „Andere Art“ verschwindet.
  const anzahlKnoepfe = (app.match(/el\('button'/g) ?? []).length;
  const anzahlKennungen = (app.match(/'data-kennung': /g) ?? []).length;
  assert.equal(anzahlKennungen, anzahlKnoepfe + 1, `${anzahlKnoepfe} Knöpfe, ${anzahlKennungen} Kennungen (erwartet: Knöpfe + Überschrift)`);
  const feste = [...app.matchAll(/'data-kennung': (?:'|`)([^'`]+)(?:'|`)/g)].map((m) => m[1]);
  assert.equal(new Set(feste).size, feste.length, 'doppelte data-kennung');
  const merke = app.indexOf('const merke = document.activeElement?.dataset?.kennung;');
  const neu = app.indexOf('app.replaceChildren(');
  const zurueck = app.indexOf('fokussiere(fokusNach ?? merke);');
  assert.ok(merke > -1 && neu > merke && zurueck > neu, 'Fokus muss vor replaceChildren gemerkt und danach gesetzt werden');
  assert.match(app, /tabindex: '-1'/, 'die Überschrift des Auswahl-Bildschirms muss fokussierbar sein');
});

test('Ausschluss-Liste: die Lippenübung (слижем с губ варенье) ist ausgeschlossen, mit Begründung', () => {
  const lippen = daten.ausgeschlossen.find((a) => /Marmelade von den Lippen/.test(a.was));
  assert.ok(lippen, 'die Lippenübung fehlt in der Ausschlussliste');
  assert.match(lippen.warum, /nicht wirksam|sollen nicht angewendet/);
  assert.match(daten.quelle.nachgezaehlt, /слижем с губ варенье/);
});

test('keine uk- und ru-Fassung erfunden: kein Sprachschlüssel, keine Übersetzung im Quelltext', () => {
  assert.doesNotMatch(JSON.stringify(daten), /"(uk|ru)"\s*:/);
  assert.match(daten.keineUebersetzung, /nur auf Deutsch/);
});

// Modellnamen sind Entscheidung A1 (docs/offene-punkte-kita.md), hier bewusst nicht geprüft.
test('keine KI-Begriffe in den Dateien der App', () => {
  const muster = /\bKI\b|LLM|Sprachmodell|Chatbot|künstliche Intelligenz/i;
  for (const [d, inhalt] of Object.entries(alle)) {
    assert.ok(!muster.test(inhalt), `${d}: ${inhalt.match(muster)?.[0]}`);
  }
});

test('keine Bewertung von Kindern auf der Oberfläche (docs/02 Z. 141–146)', () => {
  // Die Oberfläche sagt nichts über ein Kind. logik.mjs und die Daten nennen die Wörter
  // dagegen als Prüfmuster oder verneint („keine Punkte“), darum sind sie hier nicht dabei.
  const muster = /unsicher|Selbstwert|Risiko|Diagnose|\bPunkte?\b|Rangliste|\bRang\b|Einstufung|\bStufe\b|\bPlatz\b|Prozent|\bSterne?\b|\bErgebnis\b|\bNoten?\b/i;
  // Die Verneinung („keine Punkte“) ist erlaubt; sie wird vor der Prüfung herausgenommen.
  const verneint = (t) => t.replace(/\bkeine? (Punkte?|Sterne?|Noten?|Ergebnis\w*|Rangliste|Stufe)\b/gi, '');
  for (const d of ['index.html', 'app.mjs', 'druck.css']) {
    const text = verneint(code[d]).replace(/\/\*[\s\S]*?\*\//g, '');
    assert.ok(!muster.test(text), `${d}: ${text.match(muster)?.[0]}`);
  }
});

test('Testzahl: README und GDD nennen die Zahl der Tests, die in test/ tatsächlich stehen', async () => {
  const dateien = (await readdir(new URL('test/', APP))).filter((d) => d.endsWith('.test.mjs'));
  let echt = 0;
  for (const d of dateien) {
    const quelle = await readFile(new URL(`test/${d}`, APP), 'utf8');
    echt += (quelle.match(/^test\(/gm) ?? []).length;
  }
  assert.ok(echt >= 40, `nur ${echt} Tests gefunden`);
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

test('externe Fakten: jede Zeile mit Norm, Studie oder Erste Hilfe trägt Fundstelle oder Vermerk', async () => {
  // Die Prüfung steht im Paket packages/kinderschutz und läuft hier für diese App mit,
  // damit die App-Kopie sie selbst trägt.
  const pfad = fileURLToPath(APP).replace(/\/$/, '');
  assert.deepEqual(await externeFakten(pfad), []);
});
