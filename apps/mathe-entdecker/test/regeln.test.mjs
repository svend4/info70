import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Projektregeln für diese App, nach der Vorlage apps/puppentheater-werkstatt/test/regeln.test.mjs:
// docs/02 Z. 22–24 (keine Anfragen nach außen), docs/02 Z. 141–146 (keine Bewertung von Kindern),
// Eingabeverbot, Speicherverbot (außer dem Entfernen des alten Schlüssels durch quiz-kern), kein Zufall in
// den Dateien der App (die Aufgaben folgen einer festen Reihe). Geprüft werden die Dateien der App (ohne test/). Die Testdateien selbst
// dürfen die verbotenen Wörter nennen, um sie zu verbieten.
// Stand 29.10.2026 (Frage 66): „Sterne“ in m16 ist Bestand aus HEAD; die Zählung je Datei darf nicht steigen.
// Für das Zeichen ⭐ gilt dasselbe: 7 in daten/fragen.json (HEAD), sonst 0.

const APP = new URL('../', import.meta.url);
const CODE_DATEIEN = ['index.html', 'app.mjs', 'logik.mjs', 'reihen.css', 'daten/fragen.json'];
const ALLE_DATEIEN = [...CODE_DATEIEN, 'package.json', 'README.md', 'GDD.md', 'eltern.html'];
const PFLICHT = 'Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.';
const ALTER_SCHLUESSEL = /^\s*rekordSchluessel: '[^']+',\s*$/m;

const lese = (datei) => readFile(new URL(datei, APP), 'utf8');
const alle = Object.fromEntries(await Promise.all(ALLE_DATEIEN.map(async (d) => [d, await lese(d)])));
const code = Object.fromEntries(CODE_DATEIEN.map((d) => [d, alle[d]]));
const daten = JSON.parse(alle['daten/fragen.json']);

test('keine Eingabefelder für Kinder: kein input, textarea, select, form, contenteditable', () => {
  const muster = /<\s*(input|textarea|select|form)\b|contenteditable|(el|createElement)\(\s*['"](input|textarea|select|form)['"]/i;
  for (const d of ['index.html', 'app.mjs', 'logik.mjs']) {
    assert.ok(!muster.test(code[d]), `${d}: Eingabeelement gefunden`);
  }
});

test('keine Speicherung: kein localStorage, sessionStorage, IndexedDB, Cookie oder Cache in den Dateien der App', () => {
  const muster = /localStorage|sessionStorage|indexedDB|document\.cookie|\bcaches\b|navigator\.storage/;
  for (const d of CODE_DATEIEN) {
    assert.ok(!muster.test(code[d]), `${d}: Speicher-Zugriff gefunden`);
  }
  // Die Migration (alter Schlüssel mathe.rekord) macht quiz-kern beim Start; die App selbst fasst den Speicher nicht an.
  assert.match(code['app.mjs'], ALTER_SCHLUESSEL, 'der alte Schlüssel steht als Konfiguration für quiz-kern');
});

test('keine externen Adressen, Netzaufrufe nur für daten/fragen.json, kein @import', () => {
  for (const d of CODE_DATEIEN) {
    assert.ok(!/https?:\/\/|(?<![:\w])\/\/[\w-]+\.[a-z]{2,}|\bwww\./i.test(code[d]), `${d}: externe Adresse`);
  }
  const netz = /XMLHttpRequest|WebSocket|sendBeacon|EventSource|importScripts|new Worker|wss?:/;
  for (const d of ['app.mjs', 'logik.mjs']) {
    assert.ok(!netz.test(code[d]), `${d}: Netzaufruf gefunden`);
  }
  const aufrufe = [...code['app.mjs'].matchAll(/\bfetch\s*\(\s*(['"`])([^'"`]*)\1/g)].map((m) => m[2]);
  assert.deepEqual(aufrufe, ['daten/fragen.json'], 'fetch nur mit einem Pfad in Anführungszeichen unter daten/');
  assert.equal((code['app.mjs'].match(/\bfetch\s*\(/g) ?? []).length, 1, 'mehr als ein fetch-Aufruf');
  assert.ok(!/@import/.test(code['reihen.css']), 'reihen.css: @import');
});

test('ohne Zufall: kein Math.random, kein crypto, kein mischen() und keine Uhr in den Dateien der App; die Aufgaben kommen aus folgeZu', () => {
  const muster = /Math\.random|crypto|getRandomValues|mischen|Date\.now|new Date|performance\./;
  for (const d of CODE_DATEIEN) {
    assert.ok(!muster.test(code[d]), `${d}: Zufall, mischen() oder Uhr gefunden`);
  }
  assert.ok(code['app.mjs'].includes('folgeZu(aufgabenNummer)'), 'app.mjs: die Aufgaben kommen aus der festen Folge');
});

test('logik.mjs ist rein: kein DOM, kein Fenster, kein Speicher, kein Abruf', () => {
  assert.ok(!/document\.|window\.|globalThis|localStorage|fetch\(/.test(code['logik.mjs']), 'logik.mjs: DOM, Fenster, Speicher oder Abruf');
});

test('Grundgerüst: deutsch, Viewport, CSP exakt, nur kinder.css und reihen.css als Stylesheets, ein Modul-Skript', () => {
  const html = code['index.html'];
  assert.match(html, /<html lang="de">/);
  assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1" \/>/);
  assert.match(html, /<meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline'" \/>/);
  assert.match(html, /<noscript>/);
  const links = [...html.matchAll(/<link rel="stylesheet"[^>]*href="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(links, ['../../packages/kinder-ui/css/kinder.css', 'reihen.css']);
  const skripte = [...html.matchAll(/<script[^>]*src="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(skripte, ['app.mjs']);
});

test('aria-live="polite" auf dem Quiz (#app) und auf dem Modus (#reihen)', () => {
  const html = code['index.html'];
  assert.match(html.match(/<main[^>]*id="app"[^>]*>/)?.[0] ?? '', /aria-live="polite"/);
  assert.match(html.match(/<section[^>]*id="reihen"[^>]*>/)?.[0] ?? '', /aria-live="polite"/);
});

test('Netzwerk-Wächter: aus packages/kinderschutz importiert und aufgerufen', async () => {
  assert.match(code['app.mjs'], /import \{ installiereNetzwerkWaechter \} from '\.\.\/\.\.\/packages\/kinderschutz\/src\/index\.mjs';/);
  assert.match(code['app.mjs'], /^installiereNetzwerkWaechter\(\);$/m);
});

test('Knöpfe mindestens 48 px hoch: die gemeinsame Klasse .k-knopf hat min-height 3rem (docs/02, touch ≥ 48 px)', async () => {
  const kinderCss = await readFile(new URL('../../../packages/kinder-ui/css/kinder.css', import.meta.url), 'utf8');
  assert.match(kinderCss, /\.k-knopf\s*\{[^}]*min-height:\s*3rem;/);
});

test('Fokus: jeder Knopf trägt eine data-kennung, die festen Kennungen sind eindeutig; der Modus setzt den Fokus zurück', () => {
  const app = code['app.mjs'];
  const knoepfe = app.match(/el\('button'/g) ?? [];
  const kennungen = app.match(/'data-kennung': /g) ?? [];
  assert.equal(kennungen.length, knoepfe.length, `${knoepfe.length} Knöpfe, aber ${kennungen.length} data-kennung`);
  const feste = [...app.matchAll(/'data-kennung': '([^']+)'/g)].map((m) => m[1]);
  assert.equal(new Set(feste).size, feste.length, 'doppelte data-kennung');
  assert.match(code['index.html'], /<button[^>]*data-kennung="modus-reihen"/, 'Einstiegsknopf ohne data-kennung');
  assert.match(app, /const merke = document\.activeElement\?\.dataset\?\.kennung;/, 'der Fokus wird vor dem Neuaufbau gemerkt');
  assert.match(app, /id: 'reihen-titel', class: 'k-titel', tabindex: '-1'/, 'Überschrift des Modus ist ein Fokusziel');
});

test('Die bestehenden Quiz-Modi bleiben: starteQuiz wird unverändert mit der Fragenbank aufgerufen', () => {
  const app = code['app.mjs'];
  assert.match(app, /starteQuiz\(\{\s*\n\s*wurzel: document\.getElementById\('app'\),\s*\n\s*daten,/);
  assert.match(app, /rundenGroesse: RUNDE,/);
});

test('Anzeige ohne Text „null“: der Aufbau des Modus filtert leere Teile aus, wie quiz-kern es tut', () => {
  assert.match(code['app.mjs'], /reihenAnsicht\.replaceChildren\(\.\.\.\[[\s\S]*\]\.filter\(\(k\) => k != null\)\);/,
    'replaceChildren ohne Filter: ein null wird als Text angezeigt');
});

test('Rückmeldung des Modus ohne Wertung: die festen Sätze stehen im Code', () => {
  assert.ok(code['app.mjs'].includes('Die Reihe stimmt.'), 'Satz „Die Reihe stimmt.“ fehlt');
  assert.ok(code['app.mjs'].includes('Schau dir die Reihe noch einmal an.'), 'Satz „Schau dir die Reihe noch einmal an.“ fehlt');
});

test('keine Bewertung von Kindern im Code und in den Daten: keine Punkte, Stufe, Rang, Einstufung, Note (docs/02 Z. 141–146)', () => {
  // Dokumente dürfen solche Wörter verneinen („keine Punkte“), Oberfläche und Daten nicht.
  const muster = /unsicher|Selbstwert|Risiko|Diagnose|\bPunkte?\b|Rangliste|\bRang\b|Einstufung|\bStufe\b|\bPlatz\b|Prozent|\bSterne?\b|\bErgebnis\b|\bNoten?\b|\bSerie\b|Pokal|geschafft|in Folge/i;
  const ohneMigration = code['app.mjs'].replace(ALTER_SCHLUESSEL, '');
  for (const d of ['index.html', 'logik.mjs', 'reihen.css']) {
    assert.ok(!muster.test(code[d]), `${d}: ${code[d].match(muster)?.[0]}`);
  }
  assert.ok(!muster.test(ohneMigration), `app.mjs: ${ohneMigration.match(muster)?.[0]}`);
  assert.ok(!/rekord/i.test(ohneMigration), 'app.mjs: Rekord außer dem alten Schlüssel');
});

test('Kindertexte ohne „Stufe“ (auch nicht als Wortteil): index.html, app.mjs, daten/fragen.json; der Bestand in eltern.html bleibt', () => {
  for (const d of ['index.html', 'app.mjs', 'daten/fragen.json']) {
    assert.doesNotMatch(code[d], /stuf/i, `${d}: „Stufe“ oder ein Wortteil davon`);
  }
});

test('Fragenbank: Sterne nur im Bestand m16; das Wort „Sterne“ und das Zeichen ⭐ je Datei nicht über den Stand in HEAD (Frage 66)', () => {
  // Bestand aus HEAD (git show HEAD:apps/mathe-entdecker/<datei>), gezählt mit STERNE, Stand 29.10.2026.
  // Das Muster verlangt eine Wortgrenze: „Mustern“ in app.mjs zählt nicht (vor dem Stamm steht ein Buchstabe).
  const STERNE = /(?<!\p{L})stern(?:e|en|es)?(?!\p{L})/giu;
  const bestand = { 'index.html': 0, 'app.mjs': 0, 'daten/fragen.json': 3 };
  for (const [d, n] of Object.entries(bestand)) {
    const zahl = (alle[d] ?? '').match(STERNE)?.length ?? 0;
    assert.ok(zahl <= n, `${d}: ${zahl} „Sterne“, Bestand aus HEAD ${n}`);
  }
  assert.ok(/Mustern/.test(alle['app.mjs']) && (alle['app.mjs'].match(STERNE) ?? []).length === 0, '„Mustern“ in app.mjs ist kein Treffer (Wortgrenze)');
  // Das Zeichen ⭐ (U+2B50): Bestand aus HEAD, 7 in daten/fragen.json (m16); in index.html, app.mjs und logik.mjs 0 (logik.mjs fehlt in HEAD).
  const bestandZeichen = { 'index.html': 0, 'app.mjs': 0, 'logik.mjs': 0, 'daten/fragen.json': 7 };
  for (const [d, n] of Object.entries(bestandZeichen)) {
    const zahl = (alle[d] ?? '').match(/\u2B50/g)?.length ?? 0;
    assert.ok(zahl <= n, `${d}: ${zahl} Zeichen ⭐, Bestand aus HEAD ${n}`);
  }
  const mit = daten.fragen.filter((f) => /Stern|⭐/.test(JSON.stringify(f))).map((f) => f.id);
  assert.ok(mit.every((id) => id === 'm16'), `Sterne in einer anderen Frage als m16: ${mit.join(', ')}`);
  const ohneM16 = JSON.stringify(daten.fragen.filter((f) => f.id !== 'm16'));
  assert.doesNotMatch(ohneM16, /\bPunkte?\b|\bRang\b|Rekord|Prozent|Pokal|geschafft|\bNoten?\b|\bStufe\b/i);
  assert.doesNotMatch(alle['daten/fragen.json'], /"raenge"|"punkte"|"rekord"/i);
});

test('Externe Fakten: keine Aussagen über Recht, Geld oder Gesundheit in den Dateien der App', () => {
  const behauptung = /\b(EN \d|DIN\b|ISO \d|AWMF|BZgA|BIÖG|WHO\b|G-BA|§\s*\d|Richtlinie|Verordnung|Studie|Notruf|Erste[- ]Hilfe|Prozent|\d+\s*%|Versicherung|Gesetz)/i;
  for (const d of CODE_DATEIEN) {
    assert.ok(!behauptung.test(code[d]), `${d}: ${code[d].match(behauptung)?.[0]}`);
  }
});

test('Pflichtmarkierung: Seitenangaben nur mit dem Vermerk im selben Dokument; die Datei trägt ihn als Feld', () => {
  assert.equal(daten.pflichtmarkierung, PFLICHT);
  for (const d of ['README.md', 'GDD.md']) {
    if (/S\.\s?\d/.test(alle[d])) assert.ok(alle[d].includes(PFLICHT), `${d}: Seitenangabe ohne Vermerk`);
  }
  for (const [d, inhalt] of Object.entries(alle)) {
    assert.ok(!/von Hand geprüft/i.test(inhalt), `${d}: „von Hand geprüft“ ist nicht belegt`);
  }
});

test('Eigenentwurf-Kennzeichnung: README und GDD benennen den Eigenentwurf; jede Frage ist als Eigenentwurf markiert', () => {
  assert.ok(alle['README.md'].includes('(Eigenentwurf)'), 'README.md: ohne Eigenentwurf-Kennzeichnung');
  assert.ok(alle['GDD.md'].includes('(Eigenentwurf)'), 'GDD.md: ohne Eigenentwurf-Kennzeichnung');
  for (const f of daten.fragen) assert.equal(daten.quellen[f.id]?.eigenentwurf, true, `${f.id}: ohne eigenentwurf`);
});

test('Lernziele als Liste in der README: sechs Ziele (Bauauftrag GEM-8, Abschnitt 2)', () => {
  const ziele = alle['README.md'].match(/^\d\. Kind /gm) ?? [];
  assert.equal(ziele.length, 6, `${ziele.length} Lernziele in der README`);
});

test('Themen in der README: Linienarten, Wochentage und Jahreszeiten, links und rechts', () => {
  for (const wort of ['Linienarten', 'Wochentage', 'Jahreszeiten', 'links und rechts']) {
    assert.ok(alle['README.md'].includes(wort), `README.md: ${wort} fehlt`);
  }
});

// Modellnamen sind Entscheidung A1 (docs/offene-punkte-kita.md), hier bewusst nicht geprüft.
test('keine KI-Begriffe in den Dateien der App', () => {
  const muster = /\bKI\b|LLM|Sprachmodell|Chatbot|künstliche Intelligenz/i;
  for (const [d, inhalt] of Object.entries(alle)) {
    assert.ok(!muster.test(inhalt), `${d}: ${inhalt.match(muster)?.[0]}`);
  }
});

test('Testzahl: README und GDD nennen die Zahl der Tests, die in test/ tatsächlich stehen', async () => {
  const dateien = (await readdir(new URL('test/', APP))).filter((d) => d.endsWith('.test.mjs'));
  let echt = 0;
  for (const d of dateien) {
    echt += ((await readFile(new URL(`test/${d}`, APP), 'utf8')).match(/^test\(/gm) ?? []).length;
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

test('package.json: privat, ES-Modul, Testskript führt alle drei Testdateien aus', () => {
  const pkg = JSON.parse(alle['package.json']);
  assert.equal(pkg.private, true);
  assert.equal(pkg.type, 'module');
  assert.equal(pkg.scripts?.test, 'node --test test/fragen.test.mjs test/logik.test.mjs test/regeln.test.mjs');
});

test('keine HTML-Einspeisung und kein eval im Quelltext der App: innerHTML, outerHTML, insertAdjacentHTML, document.write, eval', () => {
  // Geprüft werden der Code und das Elternblatt. Die Dokumente bleiben außen vor, weil sie diese Muster erläutern.
  const muster = /\binnerHTML\b|\bouterHTML\b|\binsertAdjacentHTML\b|\bdocument\.write\b|\beval\s*\(/;
  for (const d of [...CODE_DATEIEN, 'eltern.html']) {
    assert.ok(!muster.test(alle[d]), `${d}: ${alle[d].match(muster)?.[0]}`);
  }
});

test('Seitenangaben: jede Datei der App mit „S. n“ (auch Kommentare in .mjs) trägt den Vermerk im selben Dokument', async () => {
  const wurzel = fileURLToPath(APP);
  const alleDateien = async (ordner) => {
    const liste = [];
    for (const e of await readdir(ordner, { withFileTypes: true })) {
      if (e.name === 'node_modules') continue;
      const p = join(ordner, e.name);
      if (e.isDirectory()) liste.push(...(await alleDateien(p)));
      else liste.push(p);
    }
    return liste;
  };
  const seitenangabe = /\bS\.\s?\d/;
  const ohneVermerk = [];
  for (const p of await alleDateien(wurzel)) {
    const text = await readFile(p, 'utf8');
    if (seitenangabe.test(text) && !text.includes(PFLICHT)) ohneVermerk.push(p.slice(wurzel.length));
  }
  assert.deepEqual(ohneVermerk, [], `„S. n“ ohne den Vermerk im selben Dokument: ${ohneVermerk.join(', ')}`);
});
