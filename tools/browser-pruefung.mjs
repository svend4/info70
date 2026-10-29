// Browser-Prüfung einer App bei 360 px: Überlauf, Berührziele, Klicks mit Fokusprüfung,
// Druckansicht und Konsolenfehler.
// Aufruf: node tools/browser-pruefung.mjs <app-ordner> [port|-] [ausgabeordner] [--alle-knoepfe]
//   app-ordner     Ordner unter apps/, z. B. tischdienst-trainer
//   port           Ohne Angabe oder "-": das Skript startet selbst einen statischen Server aus dem
//                  Repo-Root (wie tools/serve.mjs) auf einem freien Port und beendet ihn am Ende.
//                  Mit Port: nur dieser Port wird genutzt, es startet kein Server.
//   ausgabeordner  Standard: ein Ordner im Systemtemp, außerhalb des Repos.
// Ausgabe: <ausgabeordner>/<app-ordner>.json und eine Konsolenzeile:
//   "ok", "VERLETZT: <Liste>" oder "NICHTS GEMESSEN: <Grund>".
// Fehlercodes: 0 gemessen ohne Verletzung, 1 mindestens eine Verletzung,
//   2 nichts gemessen (keine Klicks und keine Berührziele) oder Lauf abgebrochen.
//
// Was gemessen wird:
//   Sichtbar heißt getClientRects().length > 0 (fixierte Elemente zählen mit).
//   Berührziele: sichtbare button, a, input (button, submit, checkbox, radio), select, summary.
//     Gemessen auf dem Startbildschirm und nach jedem Klick, der die Seite verändert hat.
//     Mindestmaß 48 px in Breite und Höhe, Toleranz 0,5 px.
//   Klicks: jeder sichtbare, aktive button[data-kennung] auf dem jeweils erreichten Bildschirm.
//     Nach jedem Klick muss der Fokus auf derselben Kennung liegen. Verschwindet der Knopf,
//     weil der Bildschirm wechselt, genügt der Fokus auf einer Überschrift mit tabindex="-1"
//     (Ergebnis "bildschirmwechsel"). Nach jedem Klick wird höchstens 500 ms auf eine Änderung
//     gewartet (MutationObserver oder Fokuswechsel). Übersprungene Knöpfe werden mit Grund gezählt.
//     Die Suche folgt den Klicks: Knöpfe auf Bildschirmen, die vorher verlassen wurden, bleiben
//     ungeklickt und erscheinen mit Grund im JSON.
//   Überlauf: scrollWidth gegen clientWidth bei 360 px, nach jedem Zustand. Jeder Wert über 0 px
//     ist eine Verletzung.
//   Konsole: pageerror und console error sind Verletzungen, außer 404 für /favicon.ico.
//   Druck: nur im Endzustand, im print-Medium. Zeichen-Muster und Emoji im sichtbaren Text sind
//     Verletzungen.
//
// Nur Auskunft im JSON, keine Verletzung: Speicher, Netzziele, Namenszeile, Bildschirmteile,
// Zahl sichtbarer Karten im Druck, Neuladen ohne Netz, Warnungen.
import { createServer } from 'node:http';
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const VIEWPORT_PX = 360;
const MINDESTMASS = 47.5; // 48 px mit 0,5 px Toleranz
const MAX_WARTEN_MS = 500;
const MAX_KLICKS = 300;
const ZIEL_SELEKTOR = 'button, a, input[type="button" i], input[type="submit" i], input[type="checkbox" i], input[type="radio" i], select, summary';
const CSP = "default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:";
const TYPEN = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webmanifest': 'application/manifest+json',
  '.md': 'text/plain; charset=utf-8',
};

function nutzung(meldung) {
  console.error(meldung);
  console.error('Aufruf: node tools/browser-pruefung.mjs <app-ordner> [port|-] [ausgabeordner] [--alle-knoepfe]');
  process.exit(2);
}

// --alle-knoepfe (Befund B-13, 29.10.2026): auch Knöpfe ohne data-kennung klicken, z. B. „↩️ Zurück“. Sie bekommen
// im Lauf die Kennung „auto:<Text>#<Nummer>“. Ohne den Schalter bleibt alles wie bisher; die Basislinie wird
// mit diesem Schalter nicht geschrieben (Auskunft, kein Tor).
const ALLE_KNOEPFE = process.argv.includes('--alle-knoepfe');
const [, , app, portArg, ausgabeArg] = process.argv.filter((a) => a !== '--alle-knoepfe');
if (!app) nutzung('Kein App-Ordner angegeben.');
if (!/^[a-z0-9][a-z0-9-]*$/.test(app) || !existsSync(join(ROOT, 'apps', app, 'index.html'))) {
  nutzung(`Keine App „${app}“ mit index.html unter apps/.`);
}
let port = null;
if (portArg !== undefined && portArg !== '-' && portArg !== '') {
  if (!/^\d+$/.test(portArg) || Number(portArg) < 1 || Number(portArg) > 65535) nutzung(`Ungültiger Port „${portArg}“.`);
  port = Number(portArg);
}

// Statischer Server wie tools/serve.mjs, aber im Prozess und auf einem freien Port.
function statischerServer() {
  const server = createServer((req, res) => {
    try {
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.writeHead(405).end('Method Not Allowed');
        return;
      }
      const pfad = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '');
      let datei = join(ROOT, pfad);
      if (!datei.startsWith(ROOT)) {
        res.writeHead(403).end('Forbidden');
        return;
      }
      if (existsSync(datei) && statSync(datei).isDirectory()) datei = join(datei, 'index.html');
      const inhalt = readFileSync(datei);
      res.writeHead(200, {
        'content-type': TYPEN[extname(datei)] ?? 'application/octet-stream',
        'content-security-policy': CSP,
      });
      res.end(inhalt);
    } catch {
      res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      res.end('404 – nicht gefunden');
    }
  });
  return new Promise((ok, fehler) => {
    server.once('error', fehler);
    server.listen(0, () => ok(server));
  });
}

async function playwrightLaden() {
  const kandidaten = [
    process.env.PLAYWRIGHT_MODULE,
    'playwright',
    '/opt/node22/lib/node_modules/playwright/index.js',
    '/opt/node-tools/node_modules/playwright/index.js',
  ].filter(Boolean);
  for (const k of kandidaten) {
    try {
      const modul = await import(k.startsWith('/') ? 'file://' + k : k);
      return modul.default ?? modul;
    } catch { /* nächsten Kandidaten versuchen */ }
  }
  throw new Error('Playwright nicht gefunden: PLAYWRIGHT_MODULE setzen oder playwright installieren.');
}

// Läuft vor jedem Dokument: zählt Änderungen am DOM, Fokuswechsel und Navigation im Seiten-Hash,
// ohne selbst etwas zu verändern. Druck wird abgefangen, damit kein Dialog hängen bleibt.
const INIT = () => {
  const z = (window.__pruef = { mut: 0, fok: 0, nav: 0, druck: 0 });
  new MutationObserver(() => { z.mut += 1; })
    .observe(document, { subtree: true, childList: true, attributes: true, characterData: true });
  document.addEventListener('focusin', () => { z.fok += 1; }, true);
  window.addEventListener('hashchange', () => { z.nav += 1; });
  window.addEventListener('popstate', () => { z.nav += 1; });
  window.print = () => { z.druck += 1; };
};

async function zaehlerLesen(seite) {
  return seite.evaluate(() => ({ ...window.__pruef }));
}

// Zustand des aktuellen Bildschirms: Titel, Knöpfe mit Kennung, Überlauf bei 360 px.
async function zustandMessen(seite) {
  return seite.evaluate((alle) => {
    const sichtbar = (el) => el.getClientRects().length > 0;
    const html = document.documentElement;
    if (alle) {
      // Knöpfe ohne Kennung bekommen eine Kennung aus Text und Nummer je Bildschirm; bereits vergebene bleiben.
      // Zustandszeichen (☐ ☑ ✓ …) und Zahlen fallen aus dem Text, sonst wird ein Schalter nach jedem Klick ein
      // „neuer“ Knopf, und die Suche klickt ihn endlos (Lauf 1, familien-budget: 300 Klicks auf einen Schalter).
      const zaehler = new Map();
      for (const b of document.querySelectorAll('button:not([data-kennung])')) {
        const text = (b.textContent || b.getAttribute('aria-label') || '').replace(/[☐☑☒✓✔□■▢▣]/gu, '').replace(/\d+/g, '0')
          .trim().replace(/\s+/g, ' ').slice(0, 40);
        const n = zaehler.get(text) ?? 0;
        zaehler.set(text, n + 1);
        b.dataset.kennung = `auto:${text}#${n}`;
      }
    }
    const titel = ([...document.querySelectorAll('h1, h2, [role="heading"]')].find(sichtbar)?.textContent ?? '').trim().slice(0, 60);
    const knoepfe = [...document.querySelectorAll('button[data-kennung]')].map((b) => ({
      kennung: b.dataset.kennung,
      sichtbar: sichtbar(b),
      aktiv: !(b.disabled || b.getAttribute('aria-disabled') === 'true'),
    }));
    const sichtbareKennungen = knoepfe.filter((k) => k.sichtbar).map((k) => k.kennung).join(',');
    return {
      titel,
      schluessel: `${titel}|${sichtbareKennungen}`,
      knoepfe,
      breite: html.scrollWidth,
      sichtbreite: html.clientWidth,
      ueberlaufPx: html.scrollWidth - html.clientWidth,
    };
  }, ALLE_KNOEPFE);
}

// Berührziele: alle sichtbaren Ziele mit Maß, Auswahl der zu kleinen erfolgt im Node-Teil.
async function beruehrzieleMessen(seite) {
  return seite.evaluate(({ selektor, min }) => {
    const sichtbar = (el) => el.getClientRects().length > 0;
    const beschreibe = (el) => {
      if (el.dataset.kennung) return `${el.tagName.toLowerCase()}[data-kennung="${el.dataset.kennung}"]`;
      const teile = [];
      for (let e = el; e && e.nodeType === 1 && e !== document.body && teile.length < 5; e = e.parentElement) {
        let s = e.tagName.toLowerCase();
        if (e.id) {
          teile.unshift(`${s}#${e.id}`);
          break;
        }
        if (e.classList.length) s += [...e.classList].slice(0, 2).map((c) => `.${c}`).join('');
        const gleiche = e.parentElement ? [...e.parentElement.children].filter((c) => c.tagName === e.tagName) : [];
        if (gleiche.length > 1) s += `:nth-of-type(${gleiche.indexOf(e) + 1})`;
        teile.unshift(s);
      }
      return teile.join(' > ');
    };
    return [...document.querySelectorAll(selektor)].filter(sichtbar).map((el) => {
      const r = el.getBoundingClientRect();
      return {
        selektor: beschreibe(el),
        text: (el.textContent || el.value || el.getAttribute('aria-label') || '').trim().slice(0, 40),
        breite: Math.round(r.width * 100) / 100,
        hoehe: Math.round(r.height * 100) / 100,
        zuKlein: r.width < min || r.height < min,
      };
    });
  }, { selektor: ZIEL_SELEKTOR, min: MINDESTMASS });
}

// Fokus und Vorhandensein des Knopfes nach dem Klick.
async function nachKlickLesen(seite, kennung) {
  return seite.evaluate((k) => {
    const a = document.activeElement;
    return {
      knopfDa: [...document.querySelectorAll('button[data-kennung]')]
        .some((b) => b.dataset.kennung === k && b.getClientRects().length > 0),
      fokusKennung: a?.dataset?.kennung ?? null,
      fokusTag: a ? a.tagName.toLowerCase() : null,
      fokusTabindex: a?.getAttribute('tabindex') ?? null,
      fokusUeberschrift: !!a && (/^h[1-6]$/i.test(a.tagName) || a.getAttribute('role') === 'heading'),
    };
  }, kennung);
}

// Klickt den ersten sichtbaren, aktiven Knopf mit dieser Kennung.
async function klicken(seite, kennung) {
  const handle = await seite.evaluateHandle((k) => [...document.querySelectorAll('button[data-kennung]')]
    .find((b) => b.dataset.kennung === k && b.getClientRects().length > 0
      && !(b.disabled || b.getAttribute('aria-disabled') === 'true')) ?? null, kennung);
  const el = handle.asElement();
  if (!el) return { status: 'nicht mehr vorhanden' };
  try {
    await el.click({ timeout: 2000 });
    return { status: 'geklickt' };
  } catch (e) {
    return { status: 'klickfehler', fehler: e.message.split('\n')[0].slice(0, 160) };
  }
}

// Wartet höchstens 500 ms auf eine Änderung (DOM oder Fokus). Ohne Änderung geht es weiter.
async function aenderungAbwarten(seite, nach) {
  await seite.waitForFunction(([m, f]) => window.__pruef.mut !== m || window.__pruef.fok !== f,
    [nach.mut, nach.fok], { timeout: MAX_WARTEN_MS, polling: 20 }).catch(() => {});
}

// Druck nur im Endzustand: Zeichen-Muster und Emoji im sichtbaren Text, Karten, Bildschirmteile.
async function druckMessen(seite) {
  await seite.emulateMedia({ media: 'print' });
  try {
    return await seite.evaluate(() => {
      const text = document.body.innerText;
      const sichtbar = (el) => el.getClientRects().length > 0;
      const nachZeichen = new Map();
      for (const m of text.matchAll(/[☐☒☑✓✔✗✘★☆•●○◦·■□]|\p{Extended_Pictographic}/gu)) {
        const z = m[0];
        const eintrag = nachZeichen.get(z) ?? {
          zeichen: z,
          codepoint: 'U+' + z.codePointAt(0).toString(16).toUpperCase().padStart(4, '0'),
          anzahl: 0,
          kontext: text.slice(Math.max(0, m.index - 20), m.index + 20).replace(/\s+/g, ' '),
        };
        eintrag.anzahl += 1;
        nachZeichen.set(z, eintrag);
      }
      return {
        zeichen: [...nachZeichen.values()],
        sichtbareKarten: [...document.querySelectorAll('article, section, .k-karte')].filter(sichtbar).length,
        bildschirmSichtbar: [...document.querySelectorAll('[class*="nur-bildschirm"], [class*="karte-bildschirm"]')].filter(sichtbar).length,
        namenszeile: /Name\s*:|Vorname|Nachname|Datum|Wochentag/.test(text),
        pflichtZeilen: (text.match(/noch nicht von einem Menschen geprüft/g) ?? []).length,
        zeichenanzahl: text.length,
      };
    });
  } finally {
    await seite.emulateMedia({ media: 'screen' });
  }
}

// Favicon-404 ist keine Verletzung. Alle anderen console.error sind Verletzungen.
function istFaviconFehler(m) {
  const url = m.location()?.url ?? '';
  return /404/.test(m.text()) && (/\/favicon\.ico(\?|$)/.test(url) || /favicon\.ico/.test(m.text()));
}

async function pruefe(pw, adresse, ergebnis) {
  const chromiumPfad = process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium';
  const browser = await pw.chromium.launch(existsSync(chromiumPfad) ? { executablePath: chromiumPfad } : {});
  let messen = true;
  try {
    const context = await browser.newContext({ viewport: { width: VIEWPORT_PX, height: 740 }, deviceScaleFactor: 1 });
    await context.addInitScript(INIT);
    const seite = await context.newPage();

    const konsoleFehler = new Set();
    const konsoleWarnungen = new Set();
    const seitenFehler = new Set();
    const antwortFehler = new Set();
    const hosts = new Set();
    seite.on('console', (m) => {
      if (!messen) return;
      if (m.type() === 'error' && !istFaviconFehler(m)) konsoleFehler.add(m.text());
      if (m.type() === 'warning') konsoleWarnungen.add(m.text());
    });
    seite.on('pageerror', (e) => { if (messen) seitenFehler.add(e.message); });
    seite.on('response', (r) => { if (r.status() >= 400) antwortFehler.add(`${r.status()} ${r.url()}`); });
    seite.on('request', (r) => { hosts.add(new URL(r.url()).hostname); });

    await seite.goto(adresse, { waitUntil: 'networkidle', timeout: 20000 });
    await seite.waitForFunction(() => document.querySelector('button, a, input, select, summary, h1') !== null,
      null, { timeout: 5000 }).catch(() => {});
    const ausgangsOrt = seite.url().split('#')[0];

    const verletzungen = [];
    const zustaende = [];
    const klicks = [];
    const gesehen = new Map(); // Kennung -> zuletzt gesehener Zustand
    const beruehrung = { messungen: 0, ziele: 0, verletzungen: [] };
    const beruehrSchluessel = new Set();
    const geklickt = new Set();
    let abbruchGrund = null;

    async function beruehrungPruefen(titel) {
      const ziele = await beruehrzieleMessen(seite);
      beruehrung.messungen += 1;
      beruehrung.ziele += ziele.length;
      const zuKlein = ziele.filter((z) => z.zuKlein);
      for (const z of zuKlein) {
        const schluessel = `${z.selektor}|${z.breite}|${z.hoehe}`;
        if (beruehrSchluessel.has(schluessel)) continue;
        beruehrSchluessel.add(schluessel);
        beruehrung.verletzungen.push({ selektor: z.selektor, text: z.text, breite: z.breite, hoehe: z.hoehe, bildschirm: titel });
      }
      return zuKlein.length;
    }

    function zustandAufnehmen(z, schritt) {
      zustaende.push({ schritt, titel: z.titel, breite: z.breite, sichtbreite: z.sichtbreite, ueberlaufPx: z.ueberlaufPx });
      for (const k of z.knoepfe) gesehen.set(k.kennung, { sichtbar: k.sichtbar, aktiv: k.aktiv });
    }

    // Startbildschirm
    let jetzt = await zustandMessen(seite);
    zustandAufnehmen(jetzt, 0);
    const startZuKlein = await beruehrungPruefen(jetzt.titel);
    ergebnis.start = { titel: jetzt.titel, breite: jetzt.breite, sichtbreite: jetzt.sichtbreite, ueberlaufPx: jetzt.ueberlaufPx, knoepfeMitKennung: jetzt.knoepfe.length, zuKleineZiele: startZuKlein };
    if (jetzt.knoepfe.length === 0) {
      verletzungen.push('Keine Knöpfe mit data-kennung auf dem Startbildschirm: Klicks nicht gemessen.');
    }

    // Klick-Suche: auf dem aktuellen Bildschirm der erste sichtbare, aktive, noch nicht geklickte Knopf.
    for (let schritt = 1; ; schritt += 1) {
      const kandidat = jetzt.knoepfe.find((k) => k.sichtbar && k.aktiv
        && !geklickt.has(`${jetzt.schluessel}\u0001${k.kennung}`));
      if (!kandidat) break;
      if (klicks.filter((k) => k.status === 'geklickt').length >= MAX_KLICKS) {
        abbruchGrund = `Klickgrenze ${MAX_KLICKS} erreicht`;
        break;
      }
      geklickt.add(`${jetzt.schluessel}\u0001${kandidat.kennung}`);
      const bildschirmVorher = jetzt.titel;
      const vorher = await zaehlerLesen(seite);
      const erg = await klicken(seite, kandidat.kennung);
      if (erg.status === 'nicht mehr vorhanden') {
        klicks.push({ schritt, kennung: kandidat.kennung, status: 'übersprungen', grund: 'nicht mehr vorhanden' });
        continue;
      }
      if (erg.status !== 'geklickt') {
        klicks.push({ schritt, kennung: kandidat.kennung, status: 'klickfehler', fehler: erg.fehler });
        verletzungen.push(`Klick auf „${kandidat.kennung}“ nicht möglich: ${erg.fehler}`);
        continue;
      }
      const nach = await zaehlerLesen(seite);
      try {
        await aenderungAbwarten(seite, nach);
      } catch { /* Navigation während des Wartens, unten geprüft */ }
      if (seite.url().split('#')[0] !== ausgangsOrt) {
        klicks.push({ schritt, kennung: kandidat.kennung, status: 'geklickt', seitenwechsel: true });
        abbruchGrund = 'Seitenwechsel per Klick';
        break;
      }
      const fokus = await nachKlickLesen(seite, kandidat.kennung);
      const danach = await zaehlerLesen(seite);
      const geaendert = danach.mut !== vorher.mut || danach.nav !== vorher.nav;
      let fokusStimmt;
      if (fokus.knopfDa) fokusStimmt = fokus.fokusKennung === kandidat.kennung;
      else fokusStimmt = fokus.fokusUeberschrift && fokus.fokusTabindex === '-1' ? 'bildschirmwechsel' : false;
      if (fokusStimmt === false) {
        verletzungen.push(`Fokus nach Klick auf „${kandidat.kennung}“ liegt auf ${fokus.fokusTag}${fokus.fokusKennung ? ` (${fokus.fokusKennung})` : ''}, erwartet ${kandidat.kennung}`);
      }
      jetzt = await zustandMessen(seite);
      zustandAufnehmen(jetzt, schritt);
      const beruehrZuKlein = geaendert ? await beruehrungPruefen(jetzt.titel) : null;
      klicks.push({
        schritt,
        kennung: kandidat.kennung,
        status: 'geklickt',
        bildschirm: bildschirmVorher,
        fokusStimmt,
        seitenaenderung: geaendert,
        ueberlaufPx: jetzt.ueberlaufPx,
        zuKleineZieleNachKlick: beruehrZuKlein,
      });
    }

    const geklicktKennungen = new Set(klicks.filter((k) => k.status === 'geklickt').map((k) => k.kennung));
    const uebersprungen = [];
    for (const [kennung, letzter] of gesehen) {
      if (geklicktKennungen.has(kennung)) continue;
      const grund = !letzter.sichtbar ? 'nicht sichtbar'
        : !letzter.aktiv ? 'deaktiviert'
          : abbruchGrund ?? 'auf verlassenem Bildschirm nicht geklickt';
      uebersprungen.push({ kennung, grund });
    }
    ergebnis.uebersprungen = uebersprungen;
    ergebnis.abbruch = abbruchGrund;

    ergebnis.druck = await druckMessen(seite);
    ergebnis.druck.druckAufrufe = await seite.evaluate(() => window.__pruef.druck);
    ergebnis.speicher = await seite.evaluate(() => {
      try {
        return { localStorage: localStorage.length, sessionStorage: sessionStorage.length, cookies: document.cookie.length };
      } catch (e) {
        return { fehler: String(e) };
      }
    });

    // Neuladen ohne Netz: nur Auskunft. Ab hier zählen Konsole und Seitenfehler nicht mehr.
    messen = false;
    await context.setOffline(true);
    try {
      await seite.reload({ waitUntil: 'domcontentloaded', timeout: 15000 });
      ergebnis.offlineNeuladen = { textlaenge: await seite.evaluate(() => document.body.innerText.trim().length) };
    } catch (e) {
      ergebnis.offlineNeuladen = { fehler: e.message.split('\n')[0] };
    } finally {
      await context.setOffline(false);
    }

    // Verletzungen zusammenstellen. Überlauf je Wert und Bildschirm nur einmal, sonst eine Zeile je Fund.
    const meldungen = [...verletzungen];
    const ueberlaufSchon = new Set();
    for (const u of zustaende) {
      const schluessel = `${u.ueberlaufPx}|${u.titel}`;
      if (u.ueberlaufPx <= 0 || ueberlaufSchon.has(schluessel)) continue;
      ueberlaufSchon.add(schluessel);
      meldungen.push(`Überlauf bei ${VIEWPORT_PX} px: ${u.ueberlaufPx} px (scrollWidth ${u.breite}, Bildschirm „${u.titel}“, Schritt ${u.schritt})`);
    }
    for (const b of beruehrung.verletzungen) {
      meldungen.push(`Berührziel zu klein: ${b.selektor} „${b.text}“ ${b.breite}×${b.hoehe} px (Mindestmaß 48 px, Bildschirm „${b.bildschirm}“)`);
    }
    for (const e of seitenFehler) meldungen.push(`Seitenfehler: ${e}`);
    for (const e of konsoleFehler) meldungen.push(`Konsolenfehler: ${e}`);
    for (const z of ergebnis.druck.zeichen) {
      meldungen.push(`Druck: ${z.anzahl}× „${z.zeichen}“ (${z.codepoint}) im sichtbaren Text, z. B. „…${z.kontext}…“`);
    }
    ergebnis.verletzungen = [...new Set(meldungen)];

    ergebnis.zustaende = zustaende;
    ergebnis.klicks = klicks;
    ergebnis.beruehrung = { messungen: beruehrung.messungen, zielAnzahl: beruehrung.ziele, zuKleine: beruehrung.verletzungen };
    ergebnis.konsole = { fehler: [...konsoleFehler], warnungen: [...konsoleWarnungen], seitenfehler: [...seitenFehler] };
    ergebnis.antwortFehler = [...antwortFehler];
    ergebnis.netz = { hosts: [...hosts], fremd: [...hosts].filter((h) => !['localhost', '127.0.0.1', '[::1]', ''].includes(h)) };
    // beruehrziele ist die Summe der gemessenen Ziele über alle Messungen (Ziele auf mehreren Bildschirmen zählen mehrfach).
    ergebnis.zusammenfassung = {
      zustaende: zustaende.length,
      geklickt: geklicktKennungen.size,
      klicksInsgesamt: klicks.filter((k) => k.status === 'geklickt').length,
      uebersprungen: uebersprungen.length,
      beruehrmessungen: beruehrung.messungen,
      beruehrziele: beruehrung.ziele,
    };
  } finally {
    await browser.close();
  }
}

async function hauptlauf() {
  const ORDNER = ausgabeArg ? ausgabeArg : join(tmpdir(), 'info70-pruefung');
  const ergebnis = { app, viewportPx: VIEWPORT_PX };
  let server = null;
  let abbruch = null;
  try {
    mkdirSync(ORDNER, { recursive: true });
    const pw = await playwrightLaden();
    if (port === null) {
      server = await statischerServer();
      port = server.address().port;
    }
    ergebnis.port = port;
    ergebnis.eigenerServer = server !== null;
    ergebnis.alleKnoepfe = ALLE_KNOEPFE;
    const adresse = `http://localhost:${port}/apps/${app}/index.html`;
    ergebnis.adresse = adresse;
    await pruefe(pw, adresse, ergebnis);
  } catch (e) {
    abbruch = e.message.split('\n')[0];
    ergebnis.abbruch = `Lauf abgebrochen: ${abbruch}`;
  } finally {
    if (server) {
      server.closeAllConnections();
      await new Promise((ok) => server.close(() => ok()));
    }
  }

  const gemessen = (ergebnis.zusammenfassung?.klicksInsgesamt ?? 0) > 0 || (ergebnis.zusammenfassung?.beruehrziele ?? 0) > 0;
  const verletzungen = ergebnis.verletzungen ?? [];
  const status = abbruch || !gemessen ? 2 : verletzungen.length ? 1 : 0;
  ergebnis.status = status;
  try {
    writeFileSync(join(ORDNER, `${app}.json`), JSON.stringify(ergebnis, null, 2));
  } catch (e) {
    console.log(`ABGEBROCHEN: Ausgabedatei nicht schreibbar: ${e.message.split('\n')[0]}`);
    process.exitCode = 2;
    return;
  }

  if (abbruch) {
    console.log(`ABGEBROCHEN: ${abbruch}`);
  } else if (!gemessen) {
    console.log(`NICHTS GEMESSEN: keine Klicks und keine Berührziele${verletzungen.length ? ` | VERLETZT: ${verletzungen.join(' | ')}` : ''}`);
  } else if (verletzungen.length) {
    console.log(`VERLETZT: ${verletzungen.join(' | ')}`);
  } else {
    console.log('ok');
  }
  process.exitCode = status;
}

await hauptlauf();
