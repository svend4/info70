import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { blattKopf } from '../logik.mjs';

// Prüft den Quelltext der App gegen die Projektregeln (docs/02). Gelesen werden nur
// die Ausgabe-Dateien; Tests und Kommentare dürfen die Begriffe nennen.
const APP = new URL('../', import.meta.url);
const AUSGABE = ['app.mjs', 'logik.mjs', 'index.html', 'druck.css', 'daten/karten.json'];
const lies = (datei) => readFile(new URL(datei, APP), 'utf8');

const ausgabe = await Promise.all(AUSGABE.map(async (d) => [d, await lies(d)]));
const alleText = [...ausgabe, ['README.md', await lies('README.md')], ['GDD.md', await lies('GDD.md')]];
const ausgabeVon = (datei) => ausgabe.find(([d]) => d === datei)[1];
const html = ausgabeVon('index.html');
const app = ausgabeVon('app.mjs');
const css = ausgabeVon('druck.css');
const daten = JSON.parse(ausgabeVon('daten/karten.json'));

/** Kommentare leeren, Zeilen stehen lassen. */
function ohneKommentare(q) {
  return q
    .replace(/\/\*[\s\S]*?\*\//g, (t) => t.replace(/[^\n]/g, ' '))
    .replace(/(^|[^:])\/\/[^\n]*/g, (t, vor) => vor + t.slice(vor.length).replace(/[^\n]/g, ' '));
}

/** Nur die Zeichenketten des Quelltextes: das ist der Text, den die App zeigt. */
function zeichenketten(q) {
  return [...ohneKommentare(q).matchAll(/'([^'\n]*)'|`([^`]*)`/g)].map((m) => m[1] ?? m[2] ?? '').join('\n');
}

// Muster, gebaut für die Prüfung. Modellnamen stehen hier bewusst nicht.
const MODELLKENNUNG = /\b[a-z]+(?:-[a-z]+)+-\d+(?:-\d+)*\b/i;
const KI_NENNUNG = /künstliche Intelligenz|\bAI\b|\bKI\b|LLM|Sprachmodell|Chatbot|Intelligenz/gu;
const KI_ERLAUBT = /^(?:künstliche Intelligenz|KI|LLM|Sprachmodell|Chatbot)$/i;
const DRUCKZEICHEN = /[☐☑☒✓✔✗✘★☆•●○◦·∙⋅]|\[\s+\]|\[[xX]\]|\p{Extended_Pictographic}/u;
const NAMENSFELD = /Name|_{3,}/;
const VERBOTEN = /unsicher|Selbstwert|Risiko|Diagnose|Einheit/i;
const BEWERTUNG = /Punkt|Stern|Rang|Note\b|Score|Stufe|Ampel|besser|schlechter/i;
const EXTERN = /https?:\/\/|\/\/[a-z0-9-]+\.[a-z]{2,}|src\s*=\s*["']\/\/|url\(\s*["']?\/\//i;
const SPEICHER = /localStorage|sessionStorage|indexedDB|document\.cookie|caches\./;
const EINGABE = /<(?:input|textarea|select|form)[\s>]|['"](?:input|textarea|select)['"]/i;
const NETZ = /XMLHttpRequest|WebSocket|sendBeacon|EventSource|new Worker|importScripts/;

test('Keine Felder über Kinder: die Daten kennen nur Gruppen- und Kartenfelder', () => {
  const erlaubt = {
    oben: ['titel', 'sinne', 'hinweis', 'hinweisBildschirm', 'gruppen', 'karten'],
    gruppe: ['id', 'name', 'seite', 'quelle'],
    karte: ['id', 'gruppe', 'titel', 'seite', 'anregungen'],
    anregung: ['art', 'text'],
  };
  const fremd = [];
  for (const f of Object.keys(daten)) if (!erlaubt.oben.includes(f)) fremd.push(`oben: ${f}`);
  for (const g of daten.gruppen) for (const f of Object.keys(g)) if (!erlaubt.gruppe.includes(f)) fremd.push(`gruppe: ${f}`);
  for (const k of daten.karten) {
    for (const f of Object.keys(k)) if (!erlaubt.karte.includes(f)) fremd.push(`${k.id}: ${f}`);
    for (const a of k.anregungen) for (const f of Object.keys(a)) if (!erlaubt.anregung.includes(f)) fremd.push(`${k.id}: ${f}`);
  }
  assert.deepEqual(fremd, [], `Felder ohne Erlaubnis: ${fremd.join(', ')}`);
});

test('Keine Eingabefelder im Quelltext: kein input, textarea, select oder form', () => {
  const treffer = ausgabe.filter(([, q]) => EINGABE.test(q)).map(([d]) => d);
  assert.deepEqual(treffer, [], `Eingabefelder in: ${treffer.join(', ')}`);
  assert.ok(EINGABE.test('<input type="text">'), 'Gegenprobe: ein input-Element wird erkannt');
});

test('Keine Speicherung: kein localStorage, sessionStorage, IndexedDB, Cookie oder Cache', () => {
  const treffer = ausgabe.filter(([, q]) => SPEICHER.test(q)).map(([d]) => d);
  assert.deepEqual(treffer, [], `Speicherung in: ${treffer.join(', ')}`);
});

test('Keine externen Adressen: keine http(s)-Adresse und kein Adressen-Ohne-Schema in den Ausgabe-Dateien', () => {
  const treffer = ausgabe.filter(([, q]) => EXTERN.test(q)).map(([d]) => d);
  assert.deepEqual(treffer, [], `externe Adresse in: ${treffer.join(', ')}`);
});

test('Netz: keine Netzschnittstelle außer dem einen Datenabruf, der einen Fehlerweg mit Meldung hat', () => {
  assert.equal(NETZ.test(app) || NETZ.test(ausgabeVon('logik.mjs')), false, 'XHR, WebSocket, Beacon oder Worker im Quelltext');
  const aufrufe = (app.match(/fetch\(/g) ?? []).length;
  const eigene = (app.match(/fetch\(\s*'daten\/karten\.json'\)/g) ?? []).length;
  assert.equal(aufrufe, eigene, 'fetch mit fremdem oder nicht relativem Ziel');
  assert.equal(eigene, 1, 'genau ein Datenabruf erwartet');
  assert.match(app, /fetch\('daten\/karten\.json'\)\.then\(kartenAusAntwort\)/, 'der Abruf wird nicht ausgewertet');
  assert.match(app, /\} catch \{\s*app\.replaceChildren\(el\('p', \{\}, FEHLER_LADEN\)\);/, 'kein Fehlerweg mit Meldung');
  assert.match(app, /FEHLER_LADEN,?[^;]*\} from '\.\/logik\.mjs';/, 'FEHLER_LADEN kommt nicht aus logik.mjs');
});

test('Netzwerk-Wächter: app.mjs holt installiereNetzwerkWaechter aus packages/kinderschutz und ruft ihn auf', () => {
  assert.match(app, /import \{ installiereNetzwerkWaechter \} from '\.\.\/\.\.\/packages\/kinderschutz\/src\/index\.mjs';/);
  assert.match(app, /^installiereNetzwerkWaechter\(\);$/m);
});

test('CSP: index.html setzt default-src self und style-src self unsafe-inline, keine fremden Quellen', () => {
  assert.ok(html.includes('<meta http-equiv="Content-Security-Policy" content="default-src \'self\'; style-src \'self\' \'unsafe-inline\'" />'),
    'die CSP weicht von der Projektregel ab');
  assert.deepEqual(html.match(/<script[^>]*>/gi), ['<script type="module" src="app.mjs">']);
  for (const link of html.match(/<link[^>]*>/gi) ?? []) {
    assert.ok(!/https?:|\/\//.test(link), `fremde Quelle in: ${link}`);
  }
});

test('Keine Druckzeichen: keine Häkchen, Kästchen, Sterne, Punkte-Zeichen oder Emojis in den Ausgabe-Dateien', () => {
  const treffer = ausgabe.filter(([, q]) => DRUCKZEICHEN.test(q)).map(([d]) => d);
  assert.deepEqual(treffer, [], `Druckzeichen in: ${treffer.join(', ')}`);
  assert.ok(DRUCKZEICHEN.test('☐ Karte'), 'Gegenprobe: ein Kästchen wird erkannt');
  assert.ok(!DRUCKZEICHEN.test('Fell, Ohren, Schwanz: Welche Farbe?'), 'Gegenprobe: gewöhnlicher Text bleibt frei');
});

test('Drucktext ohne Namenszeile; die Dokumente sagen nicht, der Druck enthalte nur die Karten (der Blattkopf steht darauf)', () => {
  const druckText = [
    daten.titel, daten.sinne.text, daten.hinweis, ...daten.gruppen.map((g) => g.name),
    ...daten.karten.flatMap((k) => [k.titel, ...k.anregungen.map((a) => `${a.art} ${a.text}`)]),
    blattKopf({ gruppe: 'Tiere', nummer: 1, gesamt: 2 }),
    zeichenketten(app),
  ].join('\n');
  assert.ok(!NAMENSFELD.test(druckText), 'ein Name- oder Unterstrich-Feld im Druck');
  const doku = alleText.filter(([n]) => n.endsWith('.md')).map(([, t]) => t).join('\n');
  assert.ok(!/nur die Karten/.test(doku), 'README oder GDD sagen „nur die Karten“, der Blattkopf steht aber auf dem Druck');
  assert.ok(/nur die Karten/.test('Der Druck enthält nur die Karten'), 'Gegenprobe: der falsche Satz wird erkannt');
});

test('druck.css: @media print, Bildschirmteile werden ausgeblendet, keine Zeichen als content', () => {
  assert.match(css, /@media\s+print/);
  assert.match(css, /\.ek-nur-bildschirm\s*\{\s*display:\s*none/);
  assert.match(css, /\.ek-nur-druck\s*\{\s*display:\s*none/);
  assert.match(css, /size:\s*A4/);
  assert.ok(!/content\s*:\s*["']/.test(css), 'content mit Zeichen in druck.css');
});

test('Jede ek-Klasse der App hat eine Regel in druck.css oder im Kopf der index.html', () => {
  const klassen = new Set();
  for (const m of ohneKommentare(app).matchAll(/class: '([^']+)'/g)) {
    for (const k of m[1].split(' ')) if (k.startsWith('ek-')) klassen.add(k);
  }
  assert.ok(klassen.size >= 10, `nur ${klassen.size} ek-Klassen gefunden – greift das Muster noch?`);
  const ohne = [...klassen].filter((k) => !css.includes(`.${k}`) && !html.includes(`.${k}`));
  assert.deepEqual(ohne, [], `ohne Regel: ${ohne.join(', ')}`);
});

test('aria-live="polite" steht auf #app, damit Änderungen angesagt werden', () => {
  assert.match(html, /<main class="k-app" id="app" aria-live="polite"/);
});

test('Verbotene Wörter: unsicher, Selbstwert, Risiko, Diagnose und Einheit (Katalognummer statt Seite) kommen im Quelltext nicht vor', () => {
  const treffer = ausgabe.filter(([, q]) => VERBOTEN.test(q)).map(([d]) => d);
  assert.deepEqual(treffer, [], `verbotenes Wort in: ${treffer.join(', ')}`);
  assert.ok(VERBOTEN.test('ein Risiko'), 'Gegenprobe: das Muster findet das Wort');
  assert.ok(VERBOTEN.test('Praleska, S. 50 bis 51, Einheit 4'), 'Gegenprobe: die Katalognummer wird erkannt');
});

test('Keine Bewertung: keine Punkte, Sterne, Ränge, Noten, Stufen oder Wertungswörter in den Texten', () => {
  const texte = {
    'daten/karten.json': JSON.stringify(daten),
    'app.mjs': zeichenketten(app),
    'logik.mjs': zeichenketten(ausgabeVon('logik.mjs')),
  };
  const treffer = Object.entries(texte).filter(([, t]) => BEWERTUNG.test(t)).map(([d]) => d);
  assert.deepEqual(treffer, [], `Wertungswort in: ${treffer.join(', ')}`);
  assert.ok(BEWERTUNG.test('Punkte'), 'Gegenprobe: das Muster findet das Wort');
});

test('Modellnamen-Freiheit: keine Modellkennung im Text, KI nur über allgemeine Begriffe', () => {
  const befunde = [];
  for (const [name, text] of alleText) {
    if (MODELLKENNUNG.test(text)) befunde.push(`${name}: Modellkennungsform`);
    for (const m of text.match(KI_NENNUNG) ?? []) {
      if (!KI_ERLAUBT.test(m)) befunde.push(`${name}: „${m}“ ist kein allgemeiner KI-Begriff`);
    }
  }
  assert.deepEqual(befunde, [], befunde.join(' | '));
});

test('Modellnamen-Gegenprobe: die Prüfung erkennt Kennungsform und nicht-allgemeine KI-Nennung', () => {
  assert.ok(MODELLKENNUNG.test('x-y-5-5'), 'Kennungsform wird nicht erkannt');
  assert.ok(!MODELLKENNUNG.test('entdecker-karten-natur'), 'Fehlalarm bei einem Ordnernamen');
  assert.ok(!MODELLKENNUNG.test('Fell, Ohren, Schwanz'), 'Fehlalarm bei gewöhnlichem Text');
  assert.deepEqual('künstliche Intelligenz und KI'.match(KI_NENNUNG), ['künstliche Intelligenz', 'KI']);
  assert.ok(!KI_ERLAUBT.test('Intelligenz'), 'das Wort allein ist kein allgemeiner Begriff');
});

test('Grundgerüst index.html: lang de, Viewport, noscript, Stylesheets, Modul app.mjs, Titel wie im Katalog, Footer-Link mindestens 48 px', () => {
  assert.match(html, /<html lang="de">/);
  assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1" \/>/);
  assert.match(html, /<noscript>/);
  assert.ok(html.includes('href="../../packages/kinder-ui/css/kinder.css"'), 'kinder.css fehlt');
  assert.ok(html.includes('href="druck.css"'), 'druck.css fehlt');
  assert.ok(html.includes('<script type="module" src="app.mjs"></script>'), 'app.mjs fehlt');
  assert.ok(html.includes(`<title>${daten.titel}</title>`), 'der Seitentitel weicht vom Katalogtitel ab');
  assert.match(html, /\.k-fuss a \{ display: inline-flex; align-items: center; min-height: 48px; padding: 0 8px; \}/,
    'Footer-Links ohne 48 px Mindesthöhe');
});

test('Fachkraft-Satz, Eigenentwurf-Kennzeichnung und Pflichtmarkierung der Seitenangaben stehen im Druckkopf, im Footer und im GDD unter „Offen“', () => {
  assert.ok(daten.hinweis.includes('Mit der Fachkraft draußen beobachten'), 'der Satz zur Fachkraft fehlt');
  assert.ok(daten.hinweis.includes('Eigenentwurf'), 'der Hinweis ist nicht als Eigenentwurf gekennzeichnet');
  assert.ok(daten.sinne.text.includes('S. 50') && daten.sinne.text.includes('Eigenentwurf'), 'Quelle des Ziels fehlt');
  assert.ok(app.includes('kartenFuss(k)') && ausgabeVon('logik.mjs').includes('Beobachtungsanregung: Eigenentwurf'),
    'die Fußzeile der Karten kennzeichnet die Anregung nicht als Eigenentwurf');
  const markierung = 'Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.';
  assert.ok(app.includes('PFLICHTMARKIERUNG') && ausgabeVon('logik.mjs').includes(markierung), 'der Footer trägt die Pflichtmarkierung nicht');
  const gdd = alleText.find(([n]) => n === 'GDD.md')[1];
  assert.ok((gdd.split('## Offen')[1] ?? '').includes(markierung), 'das GDD trägt die Pflichtmarkierung nicht unter „## Offen“');
  const alles = alleText.map(([, t]) => t).join('\n');
  assert.ok(!/von Hand geprüft/i.test(alles), '„von Hand geprüft“ darf nirgends stehen');
});

test('Fokus nach Neuaufbau: jeder Knopf trägt eine eindeutige data-kennung, render() stellt den Fokus wieder her', () => {
  const knoepfe = (app.match(/el\('button'/g) ?? []).length;
  const kennungen = (app.match(/'data-kennung'/g) ?? []).length;
  assert.equal(kennungen, knoepfe, `${knoepfe - kennungen} Knopf/Knöpfe ohne data-kennung`);
  const eindeutig = new Set(['gruppe-alle', 'drucken', ...daten.gruppen.map((g) => `gruppe-${g.id}`)]);
  assert.equal(eindeutig.size, daten.gruppen.length + 2, 'data-kennung-Werte sind nicht eindeutig');
  assert.match(app, /const merken = document\.activeElement\?\.dataset\?\.kennung;/, 'Kennung wird vor dem Neuaufbau nicht gemerkt');
  assert.match(app, /app\.querySelector\(`\[data-kennung="\$\{merken\}"\]`\)\?\.focus\(\);/, 'Fokus wird nach dem Neuaufbau nicht gesetzt');
});

test('Pflichtmarkierung im Druck: jedes Blatt mit Seitenangabe trägt sie im Blattfuß (Pilot 1: vorher nur im Bildschirm-Fuß)', () => {
  assert.match(app, /const markierung = blattMarkierung\(karten\);/, 'das Blatt fragt die Markierung nicht ab');
  assert.match(app, /markierung \? el\('p', \{ class: 'ek-blatt-fuss' \}, markierung\) : null/, 'der Blattfuß zeigt die Markierung nicht');
  assert.match(css, /\.ek-blatt-fuss\s*\{[^}]*color:\s*#000/, 'der Blattfuß hat keine Druckregel');
});

test('Knöpfe mindestens 48 px hoch: die gemeinsame Klasse .k-knopf hat min-height 3rem (docs/02, touch ≥ 48 px)', async () => {
  const kinderCss = await readFile(new URL('../../../packages/kinder-ui/css/kinder.css', import.meta.url), 'utf8');
  assert.match(kinderCss, /\.k-knopf\s*\{[^}]*min-height:\s*3rem;/);
});

test('Zufall nur in app.mjs: Math.random und Uhr stehen nirgends in den Ausgabe-Dateien (die Karten sind fest)', () => {
  const treffer = ausgabe.filter(([, q]) => /Math\.random|crypto|Date\.now|new Date|performance\./.test(q)).map(([d]) => d);
  assert.deepEqual(treffer, [], `Zufall oder Uhr in: ${treffer.join(', ')}`);
});
