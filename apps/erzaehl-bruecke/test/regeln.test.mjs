import { test } from 'node:test';
import assert from 'node:assert/strict';
import { access, readdir, readFile } from 'node:fs/promises';
import { baueGeruest } from '../logik.mjs';

// Projektregeln der Erzähl-Brücke, nach der Vorlage apps/puppentheater-werkstatt/test/regeln.test.mjs.
// Geprüft: docs/02 Z. 22–24 (keine Anfragen nach außen), docs/02 Z. 141–146 (keine Bewertung von Kindern),
// docs/02 Z. 42–43 (Lernziele in der README), docs/02 Z. 50 (360 px, Knöpfe 48 px). Projektregeln ohne
// docs/02-Zeile: keine Speicherung, keine Medienabfrage, keine Eingabefelder, Zufall, Seitenangaben-Vermerk,
// Eigenentwurf. Die Druckregeln (docs/02 Z. 79–82) entfallen: die App druckt nichts (Bauauftrag GEM-13, Abschnitt 6).
// Die Prüfung liest die Dateien der App (ohne test/). Die Testdateien selbst dürfen verbotene Wörter nennen.
//
// Bestand, den der Test nicht verschweigt (Stand 29.10.2026, Entscheidung offen, siehe GDD „## Offen“):
//  - Math.random steht an zwei Stellen: logik.mjs (Standardwert der Auswahl) und app.mjs („Überraschung einbauen“).
//    Der Test erlaubt genau diesen Bestand und schlägt bei jeder neuen Stelle an; der Bestand darf nur sinken.
//  - „Stufe“ meint die vier Treppenstufen des Gerüsts, keine Einstufung eines Kindes. Der Bauauftrag nennt das Wort
//    unter den verbotenen Bewertungen; das Wertungsmuster lässt es deshalb aus.
//    Stand 29.10.2026: „Stufe“ ist im Bestand erlaubt, bis Max entscheidet (Frage 66). Der Test zählt es seither in app.mjs,
//    index.html und daten/bausteine.json gegen den Bestand (Vor-GEM-13-Fassung, HEAD-Commit f1d7982) sowie seit diesem Nachtrag in logik.mjs (Bestand 2); der Satz oben beschreibt den früheren Stand.
//  - fetch lädt nur die Daten aus daten/ mit relativem Pfad (Bauauftrag GEM-13, Abschnitt 6).
//
// Korrektur Stand 29.10.2026. Die Liste oben zu docs/02 Z. 42–43 und Z. 50 ist zu berichtigen:
// Die Lernziele in der README prüft der Test „Lernziele: die README hat …“. Die 360 px prüft der Node-Test nur als
// Meta-Viewport (Test „Grundgerüst“); Überlauf und Knopfmaße misst tools/browser-tor.mjs bzw. die Eigenmessung im Browser,
// der Fokus nach Klick ist offen (Frage 67). Außerdem prüft der Node-Test die HTML-Einspeisung und eval (Test „keine
// HTML-Einspeisung“) und „Stufe“ gegen den Bestand. Nicht geprüft: die Sprachausgabe (GDD §5) und die Lesbarkeit für Kinder.
// Abweichungen von der Vorlage apps/puppentheater-werkstatt/test/regeln.test.mjs:
//  1. Druckregeln entfallen (Vorlage: Druckzeichen, Namenszeile, Druckbereich, druck.css): die App druckt nichts (Brief, Abschnitt 6).
//  2. Der Fokus-Test der Vorlage (jeder Knopf mit data-kennung, Fokus merken) entfällt: die App hat keine data-kennung.
//     Ersatz: der Weil-Knopf-Test prüft nur den neuen Knopf. Den Bestandsfokus prüft kein Node-Test (Frage 67).
//  3. Die Pflichtmarkierung (Vorlage: auf dem Blatt, im Fuß, in README und GDD unter „## Offen“) entfällt. Der Vermerk
//     steht in jeder Datei mit „S. n“ (Test „Seitenangaben“).
//  4. Die Eigenentwurf-Kennzeichnung (Vorlage: Blattkopf, Auftrag, Stückanfang) steht hier als herkunft je Liste in
//     daten/bausteine.json und als Weil-Karte im Gerüst.
//  5. Netz: Die Vorlage verbietet jeden fetch. Hier ist fetch nur mit relativem Pfad aus daten/ erlaubt (Brief).
//     @import entfällt (keine druck.css).
//  6. Daten: Die Vorlage importiert die JSON-Datei; hier lädt die App sie per fetch (Bestand).
//  7. Zufall: Die Vorlage erlaubt genau eine Math.random-Stelle, in app.mjs. Hier sind es im Bestand app.mjs 1 und logik.mjs 1;
//     der Test lässt nicht mehr zu (Frage 65).
//  8. „Stufe“: Die Vorlage zählt es im allgemeinen Wertungsmuster. Hier wird es nur gegen den Bestand gezählt (Frage 66).
//  9. Grundgerüst: Titel, Stylesheet (nur kinder.css, kein druck.css) und Favicon sind an die App angepasst.
// 10. Knopfhöhe: geprüft werden .k-knopf, .k-knopf--klein und .k-fuss a in kinder.css (Vorlage: .k-knopf und der Fußlink in druck.css).
// 11. Modellnamen: Die Vorlage prüft sie bewusst nicht (A1). Hier werden sie geprüft, weil der Bauauftrag sie verbietet.
// 12. uk und ru: Der Vermerk steht in index.html und im GDD. Die Vorlage verlangt ihn auch in den Daten (Feld sprachen);
//     daten/bausteine.json hat dieses Feld nicht.
// 13. Neu gegenüber der Vorlage: Medienabfrage (Bauauftrag Abschnitt 8), Lernziele, HTML-Einspeisung und eval, Weil-Knopf.
// Stand 29.10.2026: Ausgenommen ist nur geruest.stufen; jedes andere „Stufe“, auch nach einem Punkt, zählt.

const APP = new URL('../', import.meta.url);
const CODE_DATEIEN = ['index.html', 'app.mjs', 'logik.mjs', 'daten/bausteine.json'];
const ALLE_DATEIEN = [...CODE_DATEIEN, 'package.json', 'README.md', 'GDD.md', 'eltern.html'];
const PFLICHT = 'Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.';

const lese = (datei) => readFile(new URL(datei, APP), 'utf8');
const code = Object.fromEntries(await Promise.all(CODE_DATEIEN.map(async (d) => [d, await lese(d)])));
const alle = Object.fromEntries(await Promise.all(ALLE_DATEIEN.map(async (d) => [d, await lese(d)])));
const daten = JSON.parse(code['daten/bausteine.json']);

// Kommentare weg, damit nur der Text zählt, den das Kind sieht oder der in den Daten steht.
function ohneKommentare(datei, text) {
  if (datei.endsWith('.html')) return text.replace(/<!--[\s\S]*?-->/g, '');
  if (datei.endsWith('.json')) return text;
  return text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(?<![:\w])\/\/.*$/gm, '');
}

test('keine Eingabefelder für Kinder: kein input, textarea, select, form, contenteditable', () => {
  const muster = /<\s*(input|textarea|select|form)\b|contenteditable|(el|createElement)\(\s*['"](input|textarea|select|form)['"]/i;
  for (const d of ['index.html', 'app.mjs', 'logik.mjs']) {
    assert.ok(!muster.test(code[d]), `${d}: Eingabeelement gefunden`);
  }
});

test('keine Speicherung: kein localStorage, sessionStorage, IndexedDB, Cookie oder Cache', () => {
  const muster = /localStorage|sessionStorage|indexedDB|document\.cookie|\bcaches\b|navigator\.storage/;
  for (const d of CODE_DATEIEN) {
    assert.ok(!muster.test(code[d]), `${d}: Speicher-Zugriff gefunden`);
  }
});

test('keine Anfragen nach außen: keine fremden Adressen; fetch nur mit relativem Pfad aus daten/; kein anderer Netzaufruf', () => {
  for (const d of CODE_DATEIEN) {
    assert.ok(!/https?:\/\/|(?<![:\w])\/\/[\w-]+\.[a-z]{2,}/i.test(code[d]), `${d}: externe Adresse`);
  }
  const aufrufe = code['app.mjs'].match(/\bfetch\s*\(/g) ?? [];
  const relativ = code['app.mjs'].match(/\bfetch\(\s*'(?:daten\/|\.\/)[^']*'\s*\)/g) ?? [];
  assert.equal(relativ.length, aufrufe.length, 'fetch ohne relativen Pfad aus daten/');
  const netz = /XMLHttpRequest|WebSocket|sendBeacon|EventSource|importScripts|new Worker|window\[|globalThis|wss?:/;
  for (const d of ['app.mjs', 'logik.mjs']) {
    assert.ok(!netz.test(code[d]), `${d}: Netzaufruf gefunden`);
  }
});

test('keine Medienabfrage: kein Mikrofon-, Kamera- oder Geräte-Zugriff im Quelltext (Bauauftrag GEM-13, Abschnitt 8)', () => {
  const muster = /getUserMedia|mediaDevices|MediaRecorder|getDisplayMedia|enumerateDevices/;
  for (const d of CODE_DATEIEN) {
    assert.ok(!muster.test(code[d]), `${d}: Medienabfrage gefunden`);
  }
});

test('Zufall: Math.random nur am Bestand (darf nur sinken), keine crypto-Quelle, keine Uhr; die Weil-Satz-Funktion ist ohne Zufall', () => {
  const bestand = { 'app.mjs': 1, 'logik.mjs': 1 };
  for (const [d, n] of Object.entries(bestand)) {
    const treffer = (code[d].match(/Math\.random/g) ?? []).length;
    assert.ok(treffer <= n, `${d}: ${treffer} Stellen mit Math.random, Bestand ${n}`);
  }
  for (const d of CODE_DATEIEN) {
    assert.ok(!/crypto|Date\.now|new Date|performance\./.test(code[d]), `${d}: Zufall oder Uhr`);
  }
  const weil = code['logik.mjs'].match(/export function weilSatz[\s\S]*?\n\}/)?.[0] ?? '';
  assert.ok(weil.length > 0, 'weilSatz fehlt');
  assert.ok(!/Math\.random/.test(weil), 'weilSatz nutzt Zufall');
});

test('Daten: die Bank wird per fetch aus daten/bausteine.json geladen (relativer Pfad)', () => {
  assert.match(code['app.mjs'], /fetch\('daten\/bausteine\.json'\)/);
});

test('Grundgerüst: deutsch, Viewport, CSP exakt, nur kinder.css und das gemeinsame Favicon, ein Modul-Skript', () => {
  const html = code['index.html'];
  assert.match(html, /<html lang="de">/);
  assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1"/);
  assert.match(html, /<meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline'"/);
  assert.match(html, /<noscript>/);
  assert.match(html, /<title>Erzähl-Brücke 🌉<\/title>/);
  const links = [...html.matchAll(/<link rel="stylesheet"[^>]*href="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(links, ['../../packages/kinder-ui/css/kinder.css']);
  const andereLinks = [...html.matchAll(/<link(?![^>]*rel="stylesheet")[^>]*>/g)].map((m) => m[0]);
  assert.ok(andereLinks.every((l) => /^<link rel="icon" type="image\/svg\+xml" href="(?:\.\.\/\.\.\/)?packages\/kinder-ui\/img\/favicon\.svg" \/>$/.test(l)), `index.html: fremder Link ${andereLinks.join(' ')}`);
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
  assert.match(code['app.mjs'], /import \{ installiereNetzwerkWaechter \} from '\.\.\/\.\.\/packages\/kinderschutz\/src\/index\.mjs';/);
  assert.match(code['app.mjs'], /^installiereNetzwerkWaechter\(\);$/m);
  await access(new URL('../../../packages/kinderschutz/src/index.mjs', import.meta.url));
});

test('Knöpfe und Fußlink mindestens 48 px hoch (docs/02 Z. 50): .k-knopf, .k-knopf--klein und .k-fuss a je 3rem', async () => {
  const kinderCss = await readFile(new URL('../../../packages/kinder-ui/css/kinder.css', import.meta.url), 'utf8');
  assert.match(kinderCss, /\.k-knopf\s*\{[^}]*min-height:\s*3rem;/);
  assert.match(kinderCss, /\.k-knopf--klein\s*\{[^}]*min-height:\s*3rem;/);
  assert.match(kinderCss, /\.k-fuss a\s*\{[^}]*min-height:\s*3rem;/);
});

test('Seitenangaben: jede Datei mit „S. n“ trägt den Vermerk im selben Dokument; „von Hand geprüft“ ist nicht belegt', () => {
  for (const [d, inhalt] of Object.entries(alle)) {
    if (/S\. \d/.test(inhalt)) assert.ok(inhalt.includes(PFLICHT), `${d}: „S. n“ ohne Vermerk`);
    assert.ok(!/von Hand geprüft/i.test(inhalt), `${d}: „von Hand geprüft“ ist nicht belegt`);
  }
});

test('Eigenentwurf-Kennzeichnung: jede Liste der Daten hat eine Herkunft mit eigenentwurf; Treppe und Weil-Sätze nennen S. 143; die Weil-Karte ist als Eigenentwurf benannt', () => {
  const herkunft = daten.herkunft ?? {};
  for (const feld of ['helden', 'orte', 'probleme', 'treppe', 'extraImpulse', 'weilSaetze']) {
    assert.equal(herkunft[feld]?.eigenentwurf, true, `herkunft.${feld}: eigenentwurf fehlt`);
  }
  assert.equal(herkunft.treppe.quelle?.seite, 'S. 143');
  assert.equal(herkunft.weilSaetze.quelle?.seite, 'S. 143');
  assert.equal(daten.seitenhinweis, PFLICHT);
  assert.match(code['app.mjs'], /💬 Weil-Satz \(Eigenentwurf\)/, 'Weil-Karte ohne Kennzeichnung');
  assert.match(alle['README.md'], /\(Eigenentwurf/, 'README: kein (Eigenentwurf)');
  assert.match(alle['GDD.md'], /\(Eigenentwurf/, 'GDD: kein (Eigenentwurf)');
});

test('keine Bewertung von Kindern: keine Punkte, Rang, Einstufung, Note, Prozent (docs/02 Z. 141–146); auch nicht in den erzeugten Gerüst-Texten; „Stufe“ nur im Bestand (Frage 66)', () => {
  // „Stufe“ fehlt im Muster: es meint die Treppenstufen des Gerüsts (siehe Kopf dieser Datei).
  // Stand 29.10.2026: „Stufe“ wird unten gegen den Bestand gezählt (Frage 66).
  const muster = /unsicher|Selbstwert|Risiko|Diagnose|\bPunkte?\b|Rangliste|\bRang\b|Einstufung|\bPlatz\b|Prozent|\bSterne?\b|\bErgebnis\b|\bNoten?\b|\bPokal|🏆/i;
  for (const d of CODE_DATEIEN) {
    assert.ok(!muster.test(code[d]), `${d}: ${code[d].match(muster)?.[0]}`);
  }
  const g = baueGeruest(daten, { held: daten.helden[0], ort: daten.orte[0], problem: daten.probleme[0] });
  const texte = [g.start, ...g.stufen.flatMap((s) => [s.titel, s.impuls]), ...daten.weilSaetze, ...daten.extraImpulse];
  for (const t of texte) assert.ok(!muster.test(t), `Text im Gerüst: ${t}`);
  // Stand 29.10.2026: „Stufe“ ist im Bestand erlaubt, bis Max entscheidet (Frage 66). Gezählt wird der Stamm „stufe“
  // (ohne Groß- und Kleinschreibung, ohne Kommentare, nicht nach einem Punkt wie bei geruest.stufen). Bestand: HEAD
  // der Vor-GEM-13-Fassung (f1d7982). Je Datei darf die Zahl nicht steigen.
  // Stand 29.10.2026 (Nachtrag): logik.mjs gehört seit dieser Entscheidung dazu (Bestand 2). Die Meldung „treppe braucht
  // genau 4 Stufen“ erscheint in app.mjs auf dem Bildschirm („Datenfehler: …“), wenn die Daten kaputt sind; sie ist also kindsichtbarer Text.
  // Stand 29.10.2026: Ausgenommen ist nur geruest.stufen. Ein „Stufe“ nach einem
  // Punkt im Text, z. B. „Schritt.Stufe“ oder „Schritt.stufen“, zählt. Die Angabe „nicht nach einem Punkt“ oben beschreibt den früheren Stand.
  const stufeBestand = { 'app.mjs': 2, 'index.html': 2, 'logik.mjs': 2, 'daten/bausteine.json': 0 };
  for (const [d, n] of Object.entries(stufeBestand)) {
    const treffer = (ohneKommentare(d, code[d]).replace(/geruest\.stufen\b/g, '').match(/stufe/gi) ?? []).length;
    assert.ok(treffer <= n, `${d}: ${treffer} Stellen mit „Stufe“, Bestand ${n}`);
  }
});

test('externe Fakten: Normen, Studienzahlen und Prozentangaben nur mit Fundstelle oder Vermerk', () => {
  // Eine Zeile mit einer positiven Behauptung dieser Art braucht eine Fundstelle („S. n“, „Praleska“)
  // oder den Vermerk „Eigenentwurf, fachlich nicht geprüft“. Zeilen, die etwas verneinen, sind keine Behauptung.
  const behauptung = /\b(EN \d|DIN\b|ISO \d|AWMF|BZgA|BIÖG|WHO\b|G-BA|§\s*\d|Richtlinie|Verordnung|Studie|randomis|Teilnehmer|Prozent|\d+\s*%|Erste[- ]Hilfe|Notruf|amtlich|Behörde)/i;
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

test('package.json: privat, ES-Modul, Testskript mit node --test', () => {
  const pkg = JSON.parse(alle['package.json']);
  assert.equal(pkg.private, true);
  assert.equal(pkg.type, 'module');
  assert.match(pkg.scripts?.test ?? '', /node --test/);
});

test('keine KI-Begriffe und keine Modellnamen in den Dateien der App (Bauauftrag GEM-13, Abschnitt 6)', () => {
  const ki = /\bKI\b|LLM|Sprachmodell|Chatbot|künstliche Intelligenz/i;
  const modelle = /\b(claude|anthropic|haiku|sonnet|opus|gpt-?\d*|gemini|llama|mistral)\b/i;
  for (const [d, inhalt] of Object.entries(alle)) {
    assert.ok(!ki.test(inhalt), `${d}: KI-Begriff ${inhalt.match(ki)?.[0]}`);
    assert.ok(!modelle.test(inhalt), `${d}: Modellname ${inhalt.match(modelle)?.[0]}`);
  }
});

test('uk und ru: nicht vorhanden, offen; der Vermerk steht im Quelltext und im GDD, die Daten haben keine uk- oder ru-Schlüssel', () => {
  const vermerk = 'uk und ru: nicht vorhanden, offen.';
  assert.ok(code['index.html'].includes(vermerk), 'index.html: Vermerk fehlt');
  assert.ok(alle['GDD.md'].includes(vermerk), 'GDD.md: Vermerk fehlt');
  assert.ok(!/"(uk|ru)"\s*:/.test(code['daten/bausteine.json']), 'Daten: uk- oder ru-Schlüssel');
});

test('Weil-Satz: „Anderer Weil-Satz“ tauscht den Text an Ort und Stelle, der Knopf baut den Bildschirm nicht neu auf', () => {
  const app = code['app.mjs'];
  assert.match(app, /weilText\.textContent = weilSatz\(daten, weilNr\)/);
  const zeile = app.split('\n').find((z) => z.includes('Anderer Weil-Satz'));
  assert.ok(zeile, 'Knopf „Anderer Weil-Satz“ fehlt');
  assert.ok(!/zeigeGeruest\(\)|wuerfeln\(\)|start\(\)/.test(zeile), 'der Knopf baut den Bildschirm neu auf');
});

test('keine HTML-Einspeisung und kein eval im Quelltext der App: innerHTML, outerHTML, insertAdjacentHTML, document.write, eval', () => {
  // Geprüft werden der Code und das Elternblatt. Die Dokumente bleiben außen vor, weil sie diese Muster erläutern.
  const muster = /\binnerHTML\b|\bouterHTML\b|\binsertAdjacentHTML\b|\bdocument\.write\b|\beval\s*\(/;
  for (const d of [...CODE_DATEIEN, 'eltern.html']) {
    assert.ok(!muster.test(alle[d]), `${d}: ${alle[d].match(muster)?.[0]}`);
  }
});

test('Lernziele: die README hat den Abschnitt „Lernziele“ mit drei nummerierten Zielen, jedes gekennzeichnet; der Vermerk steht im Abschnitt (docs/02 Z. 42–43)', () => {
  const abschnitt = alle['README.md'].match(/^## Lernziele\n([\s\S]*?)(?=^## )/m)?.[1] ?? '';
  assert.ok(abschnitt.length > 0, 'README: kein Abschnitt „Lernziele“');
  const ziele = abschnitt.match(/^\d+\. .+$/gm) ?? [];
  assert.equal(ziele.length, 3, `README: ${ziele.length} Lernziele statt 3`);
  for (const z of ziele) assert.match(z, /Eigenentwurf/, `Lernziel ohne Kennzeichnung: ${z}`);
  assert.ok(abschnitt.includes(PFLICHT), 'Lernziele: Vermerk fehlt im Abschnitt');
});
