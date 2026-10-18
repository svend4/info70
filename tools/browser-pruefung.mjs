// Browser-Prüfung einer App bei 360 px: Überlauf, Mindesthöhen, Fokus nach Klick,
// Speicher, Netzziele, Druckansicht, Neuladen ohne Netz (F4).
// Aufruf: node tools/browser-pruefung.mjs <app-ordner> [port] [ausgabeordner]
//   app-ordner      z. B. puppentheater-werkstatt (unter apps/)
//   port            Standard 8099; der Server läuft mit: node tools/serve.mjs 8099
//   ausgabeordner   Standard: ein Ordner im Systemtemp, außerhalb des Repos
// Playwright und Chromium werden so gesucht:
//   PLAYWRIGHT_MODULE (Pfad zu index.js), sonst 'playwright', sonst die bekannten Pfade.
//   CHROMIUM_PATH, sonst /opt/pw-browsers/chromium, sonst die Standardinstallation.
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const [, , app, port = '8099', ausgabe] = process.argv;
if (!app) {
  console.error('Aufruf: node tools/browser-pruefung.mjs <app-ordner> [port] [ausgabeordner]');
  process.exit(2);
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

const pw = await playwrightLaden();
const chromium = process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium';
const startOptionen = existsSync(chromium) ? { executablePath: chromium } : {};
const ORDNER = ausgabe ?? join(tmpdir(), 'info70-pruefung');
mkdirSync(ORDNER, { recursive: true });

const adresse = `http://localhost:${port}/apps/${app}/index.html`;
const browser = await pw.chromium.launch(startOptionen);
const context = await browser.newContext({ viewport: { width: 360, height: 740 }, deviceScaleFactor: 1 });
const page = await context.newPage();
await page.addInitScript(() => {
  window.__druckAufrufe = 0;
  window.print = () => { window.__druckAufrufe += 1; };
});

const meldungen = [];
const fehlgeschlagen = [];
const hosts = new Set();
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') meldungen.push(`${m.type()}: ${m.text()}`); });
page.on('pageerror', (e) => meldungen.push(`pageerror: ${e.message}`));
page.on('response', (r) => { if (r.status() >= 400) fehlgeschlagen.push(`${r.status()} ${r.url()}`); });
page.on('request', (r) => { hosts.add(new URL(r.url()).host); });

await page.goto(adresse, { waitUntil: 'networkidle' });
const ergebnis = { app, adresse };

ergebnis.start = await page.evaluate(() => ({
  breite: document.documentElement.scrollWidth,
  sichtbreite: document.documentElement.clientWidth,
  titel: document.title,
  aria: document.getElementById('app')?.getAttribute('aria-live') ?? null,
}));

ergebnis.kleineZiele = await page.evaluate(() => {
  const out = [];
  for (const el of document.querySelectorAll('button, a')) {
    if (el.offsetParent === null) continue;
    const r = el.getBoundingClientRect();
    if (r.height < 47.5) out.push({ tag: el.tagName, text: el.textContent.trim().slice(0, 50), hoehe: Math.round(r.height) });
  }
  return out;
});

// Jeder Knopf mit data-kennung: klicken, dann prüfen, ob der Fokus auf derselben Kennung liegt.
const kennungen = await page.$$eval('button[data-kennung]', (els) => els.map((e) => e.dataset.kennung));
ergebnis.klicks = [];
// Ohne data-kennung wird nichts geklickt. Das darf nicht still als „ohne Befund“ enden.
ergebnis.klickWarnung = kennungen.length ? null : 'Keine Knöpfe mit data-kennung gefunden: Klicks und Fokus nicht gemessen.';
for (const k of kennungen) {
  // Vor jedem Auswahl-Knopf die Filter zurücksetzen, damit die Karte sichtbar ist.
  if (k.startsWith('auswahl-')) {
    for (const f of ['filter-material-alle', 'filter-sortierung-alle']) {
      const fb = await page.$(`button[data-kennung="${f}"]`);
      if (fb && (await fb.isVisible())) await fb.click();
    }
  }
  const da = await page.$(`button[data-kennung="${k}"]`);
  if (!da || !(await da.isVisible())) {
    ergebnis.klicks.push({ kennung: k, status: 'nicht sichtbar oder schon ersetzt' });
    continue;
  }
  if (!(await da.isEnabled())) {
    ergebnis.klicks.push({ kennung: k, status: 'deaktiviert (gewollt, wenn nichts gewählt ist)' });
    continue;
  }
  await da.click();
  await page.waitForTimeout(50);
  const fokus = await page.evaluate(() => document.activeElement?.dataset?.kennung ?? document.activeElement?.tagName ?? null);
  const ueberlauf = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  // Verschwindet der Knopf, weil der Bildschirm wechselt, ist der Fokus auf der Überschrift des neuen
  // Bildschirms richtig (tabindex="-1"). Das zählt als Bildschirmwechsel, nicht als Fehler.
  const verschwunden = (await page.$(`button[data-kennung="${k}"]`)) === null;
  const fokusAufUeberschrift = await page.evaluate(() => document.activeElement?.getAttribute('tabindex') === '-1');
  const fokusStimmt = fokus === k ? true : (verschwunden && fokusAufUeberschrift ? 'bildschirmwechsel' : false);
  ergebnis.klicks.push({ kennung: k, fokus, fokusStimmt, ueberlaufPx: ueberlauf });
}

ergebnis.speicher = await page.evaluate(() => ({
  localStorage: localStorage.length,
  sessionStorage: sessionStorage.length,
  cookies: document.cookie.length,
}));

// Druckansicht: sichtbarer Text, Zeichen, Namenszeile, Karten, Bildschirmteile.
await page.emulateMedia({ media: 'print' });
ergebnis.druck = await page.evaluate(() => {
  const text = document.body.innerText;
  const zeichen = /[☐☒☑✓✔✗✘★☆•●○◦·■□]|\p{Extended_Pictographic}/u.exec(text);
  // getComputedStyle prüft nur das Element selbst; in einem ausgeblendeten Bereich ist ein Kind trotzdem „block“.
  // getClientRects ist leer, wenn das Element selbst oder ein Vorfahr nicht dargestellt wird.
  const sichtbar = (el) => el.getClientRects().length > 0;
  return {
    zeichen: zeichen ? zeichen[0] : null,
    namenszeile: /Name\s*:|Vorname|Nachname|Datum|Wochentag/.test(text),
    sichtbareKarten: [...document.querySelectorAll('section, article, .k-karte')].filter(sichtbar).length,
    bildschirmSichtbar: [...document.querySelectorAll('[class*="nur-bildschirm"], [class*="karte-bildschirm"]')].filter(sichtbar).length,
    pflichtZeilen: (text.match(/noch nicht von einem Menschen geprüft/g) ?? []).length,
    zeichenanzahl: text.length,
  };
});
const pdf = await page.pdf({ format: 'A4', preferCSSPageSize: true, printBackground: false });
ergebnis.druck.pdfBytes = pdf.length;
await page.emulateMedia({ media: 'screen' });

await page.screenshot({ path: join(ORDNER, `${app}-360.png`), fullPage: true });

ergebnis.druckAufrufe = await page.evaluate(() => window.__druckAufrufe);

// Neuladen ohne Netz (F4): ohne Service Worker nicht zugesichert; hier nur gemessen.
await context.setOffline(true);
try {
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 15000 });
  ergebnis.offlineNeuladen = await page.evaluate(() => ({ kinder: document.getElementById('app')?.children.length ?? 0 }));
} catch (e) {
  ergebnis.offlineNeuladen = { fehler: e.message.split('\n')[0] };
}
await context.setOffline(false);

ergebnis.meldungen = meldungen;
ergebnis.fehlgeschlagen = fehlgeschlagen;
ergebnis.hosts = [...hosts];

writeFileSync(join(ORDNER, `${app}.json`), JSON.stringify(ergebnis, null, 2));
console.log(JSON.stringify(ergebnis, null, 2));
await browser.close();
