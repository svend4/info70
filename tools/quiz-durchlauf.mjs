// Quiz-Durchlauf: startet ein Quiz, beantwortet jede Frage (die erste Antwort gilt) und prüft den
// Endbildschirm. Die Browser-Prüfung klickt nur Knöpfe mit data-kennung und sieht den Endbildschirm
// deshalb nicht; dieses Werkzeug schon.
// Aufruf: node tools/quiz-durchlauf.mjs <app> [<app> …] [--modus einzel|duett|alle] [--ausgabe <ordner>]
// Prüft je App und Modus:
//   - der Endbildschirm wird erreicht; beantwortete Fragen = Rundengröße (im Duett: je Person einmal)
//   - kein Muster „Zahl von Zahl“, kein richtig, kein Rekord, kein Stern- oder Pokalzeichen, kein
//     Rang-Symbol (k-gross), kein Rang-Wort, keine Punkte, kein Unentschieden, kein „liegt vorn“
//     (Regeln in packages/kinderschutz/src/quiz-ende.mjs; Sterne zählen nur im Körper, nicht im Titel)
//   - ein früher gespeicherter Rekord-Schlüssel wird beim Start entfernt; nach dem Durchlauf fehlt er
//   - „Meine Daten löschen“ ist auf dem Startbildschirm vorhanden
//   - die Druckansicht des Endbildschirms enthält keine Zeichen ☐☒☑✓✔★☆
// Nur Apps mit dem Quiz-Motor quiz-kern. Andere Apps werden abgelehnt (Exit 64), statt falsch gemessen.
// Exit: 0 alles ok, 1 mindestens eine Verletzung, 2 Endbildschirm nicht erreicht oder Lauf abgebrochen,
// 64 Aufruf falsch (keine Quiz-App).
// Der Startknopf ist je App anders beschriftet; gewählt wird der erste Knopf der ersten Karte, der nicht „Vorlesen“ heißt.
// Staffel ist nicht enthalten (Entscheidung ausstehend).
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { existsSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { druckSymbole, pruefeEndeText } from '../packages/kinderschutz/src/quiz-ende.mjs';
import { appsAusArgs, istEnde, istWeiter, nichtQuizApps } from '../packages/kinderschutz/src/quiz-durchlauf-regeln.mjs';

const WURZEL = fileURLToPath(new URL('../', import.meta.url));
const VIEWPORT_PX = 360;
const MAX_SCHRITTE = 1000;
const NAV = /^(🔊|🔁|🏠|🔍)/;
const MODI = ['einzel', 'duett', 'staffel'];
const PRUEF_REIHENFOLGE = ['zahlVonZahl', 'richtig', 'rekord', 'punkte', 'unentschieden', 'liegtVorn', 'sterneOderPokal', 'rangSymbol', 'rangWort', 'anzahl', 'druckOhneSymbole', 'schluesselEntfernt', 'keinLoeschknopf'];
const BEZEICHNUNG = {
  zahlVonZahl: 'Zahl-von-Zahl', richtig: 'richtig', rekord: 'Rekord', punkte: 'Punkte', unentschieden: 'Unentschieden',
  liegtVorn: 'liegt-vorn', sterneOderPokal: 'Stern/Pokal', rangSymbol: 'Rangsymbol', rangWort: 'Rangwort', anzahl: 'Anzahl',
  druckOhneSymbole: 'Druck-Symbole', schluesselEntfernt: 'Schlüssel', keinLoeschknopf: 'kein Löschknopf',
};

async function playwrightLaden() {
  for (const k of [process.env.PLAYWRIGHT_MODULE, 'playwright', '/opt/node22/lib/node_modules/playwright/index.js', '/opt/node-tools/node_modules/playwright/index.js'].filter(Boolean)) {
    try {
      const modul = await import(k.startsWith('/') ? 'file://' + k : k);
      return modul.default ?? modul;
    } catch { /* nächsten Kandidaten versuchen */ }
  }
  throw new Error('Playwright nicht gefunden: PLAYWRIGHT_MODULE setzen oder playwright installieren.');
}

async function freierPort() {
  return new Promise((ok) => {
    const s = createServer().listen(0, () => { const p = s.address().port; s.close(() => ok(p)); });
  });
}

async function serverStarten(port) {
  const kind = spawn(process.execPath, [join(WURZEL, 'tools', 'serve.mjs'), String(port)], { stdio: 'ignore' });
  for (let i = 0; i < 50; i++) {
    try { await fetch(`http://localhost:${port}/`); return kind; } catch { await new Promise((r) => setTimeout(r, 100)); }
  }
  kind.kill();
  throw new Error('Dev-Server startet nicht');
}

/** Quelltext von app.mjs und index.html einer App (leer, wenn es die Datei nicht gibt). */
function quelltextVon(slug) {
  return ['app.mjs', 'index.html'].map((f) => {
    const pfad = join(WURZEL, 'apps', slug, f);
    return existsSync(pfad) ? readFileSync(pfad, 'utf8') : '';
  }).join('\n');
}

/** Rekord-Schlüssel aus der App-Konfiguration; fehlt er, gibt es nichts zu prüfen. */
function rekordSchluessel(slug) {
  const quelle = readFileSync(join(WURZEL, 'apps', slug, 'app.mjs'), 'utf8');
  return quelle.match(/rekordSchluessel:\s*'([^']+)'/)?.[1] ?? null;
}

async function durchlauf(browser, slug, port, modus) {
  const schluessel = rekordSchluessel(slug);
  const duett = modus === 'duett';
  const ergebnis = { slug, modus, ende: false, beantwortet: 0, runde: null, pruefungen: {}, tasten: [] };
  const context = await browser.newContext({ viewport: { width: VIEWPORT_PX, height: 740 }, deviceScaleFactor: 1 });
  const seite = await context.newPage();
  const fehler = [];
  seite.on('pageerror', (e) => fehler.push(String(e)));
  try {
    await seite.goto(`http://localhost:${port}/apps/${slug}/index.html`, { waitUntil: 'load' });
    if (schluessel && modus === 'einzel') {
      // Ein früherer Rekord soll beim Start entfernt werden.
      await seite.evaluate((k) => localStorage.setItem(k, '9'), schluessel);
      ergebnis.schluesselGesetzt = '9';
      await seite.reload({ waitUntil: 'load' });
      // Der Start läuft je App nach einem eigenen Ladeschritt (z. B. fetch der Fragen): erst lesen, wenn der Startbildschirm steht.
      await seite.locator('main#app section.k-karte button').filter({ hasNotText: /Vorlesen/ }).first().waitFor({ timeout: 10000 });
      ergebnis.schluesselNachStart = await seite.evaluate((k) => localStorage.getItem(k), schluessel);
    }

    if (duett) {
      await seite.locator('main#app button').filter({ hasText: /Duett-Modus starten/ }).first().click();
      await seite.locator('main#app button').filter({ hasText: /Los/ }).first().click();
    } else if (modus === 'staffel') {
      await seite.locator('main#app button').filter({ hasText: /Geschwister-Staffel starten/ }).first().click();
    } else {
      await seite.locator('main#app section.k-karte').first().locator('button').filter({ hasNotText: /Vorlesen/ }).first().click();
    }

    for (let i = 0; i < MAX_SCHRITTE; i++) {
      const knoepfeEnde = await seite.evaluate(() => [...document.querySelectorAll('main#app button')].map((b) => b.textContent.trim()));
      if (knoepfeEnde.some((t) => istEnde(t))) { ergebnis.ende = true; break; }
      const text = await seite.locator('main#app').innerText();
      const von = text.match(/(\d+) von (\d+)/);
      if (von && ergebnis.runde === null) ergebnis.runde = Number(von[2]);
      const knoepfe = await seite.evaluate(() => [...document.querySelectorAll('main#app .k-antworten button')].map((b) => b.textContent.trim()));
      // Weiter-Knöpfe beginnen mit ihrem Wort oder tragen einen Pfeil; eine Antwort kann „Ergebnis“ enthalten.
      const weiter = knoepfe.findIndex((t) => istWeiter(t));
      if (weiter >= 0) { await seite.locator('main#app .k-antworten button').nth(weiter).click(); continue; }
      const antwort = knoepfe.findIndex((t) => !NAV.test(t));
      if (antwort >= 0) {
        // „Los“ startet die nächste Person und ist keine Antwort.
        if (!/^▶️?\s*Los\b/.test(knoepfe[antwort])) ergebnis.beantwortet++;
        await seite.locator('main#app .k-antworten button').nth(antwort).click();
        continue;
      }
      break;
    }

    if (ergebnis.ende) {
      const ende = await seite.locator('main#app').innerText();
      ergebnis.endeText = ende;
      // Der Titel der App (h1) und der Fuß stehen auf jedem Bildschirm. Sterne im Titel zählen nicht als Ergebnis;
      // Wörter wie richtig oder Rekord zählen überall, also auch im Titel.
      const { titel, fuss } = await seite.evaluate(() => ({
        titel: document.querySelector('main#app h1')?.innerText ?? '',
        fuss: document.querySelector('main#app footer')?.innerText ?? '',
      }));
      const koerper = ende.replace(titel, '').replace(fuss, '');
      const gesamt = pruefeEndeText(ende);
      const koerperPruef = pruefeEndeText(koerper);
      const p = { ...gesamt, sterneOderPokal: koerperPruef.sterneOderPokal };
      p.rangSymbol = (await seite.locator('main#app .k-gross').count()) === 0;
      const erwartet = ergebnis.runde === null ? null : (duett ? 2 * ergebnis.runde : ergebnis.runde);
      p.anzahl = erwartet !== null && ergebnis.beantwortet === erwartet;
      // Druckansicht des Endbildschirms (nur Text, der im Druck sichtbar bleibt).
      await seite.emulateMedia({ media: 'print' });
      const druck = await seite.locator('main#app').innerText();
      await seite.emulateMedia({ media: 'screen' });
      ergebnis.druckZeichen = druckSymbole(druck);
      p.druckOhneSymbole = ergebnis.druckZeichen.length === 0;
      ergebnis.pruefungen = p;
      // Zurück zum Start: dort muss die Daten-Löschen-Taste stehen, und der Schlüssel darf nicht zurückkommen.
      await seite.locator('main#app button').filter({ hasText: /Zum Start|🏠/ }).first().click();
      const tasten = await seite.evaluate(() => [...document.querySelectorAll('main#app button')].map((b) => b.textContent.trim()));
      ergebnis.tasten = tasten;
      // Entscheidung Max: die Karte und der Knopf „Meine Daten löschen“ sind aus dem Motor entfernt.
      p.keinLoeschknopf = !tasten.some((t) => /Meine Daten löschen/.test(t));
      if (schluessel) {
        ergebnis.schluesselNachLauf = await seite.evaluate((k) => localStorage.getItem(k), schluessel);
        if (modus === 'einzel') p.schluesselEntfernt = ergebnis.schluesselGesetzt === '9' && ergebnis.schluesselNachStart === null && ergebnis.schluesselNachLauf === null;
      } else {
        p.schluesselEntfernt = true;
      }
    }
  } finally {
    ergebnis.fehler = fehler;
    await context.close();
  }
  return ergebnis;
}

function zeile(e) {
  const kopf = `${e.slug} [${e.modus}]`;
  if (!e.ende) return `${kopf} | Endbildschirm NICHT erreicht (${e.beantwortet} Antworten)`;
  const p = e.pruefungen;
  const haken = (ok) => (ok ? 'ok' : 'FEHLT');
  const teile = PRUEF_REIHENFOLGE.filter((k) => k in p).map((k) => `${BEZEICHNUNG[k]} ${haken(p[k])}`);
  const menge = `Antworten ${e.beantwortet} (Runde ${e.runde ?? '?'}${e.modus === 'duett' ? ', je Person' : ''})`;
  const druck = e.druckZeichen?.length ? ` (${e.druckZeichen.join(' ')})` : '';
  return [kopf, menge, ...teile].join(' | ') + druck;
}

function bewerte(e) {
  if (!e.ende) return 2;
  return Object.values(e.pruefungen).every(Boolean) ? 0 : 1;
}

async function main() {
  const args = process.argv.slice(2);
  const ausIdx = args.indexOf('--ausgabe');
  const modIdx = args.indexOf('--modus');
  const ausgabe = ausIdx >= 0 ? args[ausIdx + 1] : join(tmpdir(), 'quiz-durchlauf');
  const modusWahl = modIdx >= 0 ? args[modIdx + 1] : 'einzel';
  if (modusWahl !== 'alle' && !MODI.includes(modusWahl)) { console.error(`--modus: einzel, duett oder alle, nicht „${modusWahl}“`); process.exit(64); }
  const modi = modusWahl === 'alle' ? MODI : [modusWahl];
  const apps = appsAusArgs(args);
  if (!apps.length) { console.error('Aufruf: node tools/quiz-durchlauf.mjs <app> [<app> …] [--modus einzel|duett|alle] [--ausgabe <ordner>]'); process.exit(64); }
  const keineQuiz = nichtQuizApps(apps.map((slug) => ({ slug, quelltext: quelltextVon(slug) })));
  if (keineQuiz.length) {
    console.error(`Keine Quiz-App auf quiz-kern: ${keineQuiz.join(', ')}. Das Werkzeug prüft nur Quiz-Apps und ist für diese Apps nicht anzuwenden.`);
    process.exit(64);
  }
  mkdirSync(ausgabe, { recursive: true });

  const port = await freierPort();
  const server = await serverStarten(port);
  const pw = await playwrightLaden();
  const chromiumPfad = process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium';
  const browser = await pw.chromium.launch(existsSync(chromiumPfad) ? { executablePath: chromiumPfad, args: ['--no-sandbox'] } : { args: ['--no-sandbox'] });
  let schlecht = 0;
  try {
    for (const slug of apps) {
      for (const modus of modi) {
        const e = await durchlauf(browser, slug, port, modus).catch((err) => ({ slug, modus, ende: false, beantwortet: 0, runde: null, fehlerText: String(err) }));
        writeFileSync(join(ausgabe, `${slug}.${modus}.json`), JSON.stringify(e, null, 2));
        if (e.fehlerText) { console.log(`${slug} [${modus}] | Lauf abgebrochen: ${e.fehlerText.split('\n')[0]}`); schlecht = Math.max(schlecht, 2); continue; }
        console.log(zeile(e));
        schlecht = Math.max(schlecht, bewerte(e));
      }
    }
  } finally {
    await browser.close();
    server.kill();
  }
  process.exit(schlecht);
}

main().catch((e) => { console.error(e); process.exit(2); });
