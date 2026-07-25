// Einmal-Werkzeug (kein Laufzeit-Code): holt die Bilder aus der Open-Access-
// Sammlung des Metropolitan Museum of Art, verkleinert sie und schreibt sie
// als data:-URI in daten/werke.json. Danach ist die App vollständig offline.
//
// Warum ausgerechnet das Met und warum CC0: Zwingend wäre es seit 2021
// nicht mehr – § 68 UrhG stellt klar, dass originalgetreue Reproduktionen
// gemeinfreier visueller Werke keinen eigenen Schutz genießen, und hat damit
// die frühere Rechtsprechung (BGH 2018, Reiss-Engelhorn) überholt. CC0 klärt
// aber zusätzlich die Nutzungsbedingungen der Einrichtung und liefert je Werk
// eine nachprüfbare Herkunft. Deshalb nur Open-Access-Bilder unter CC0.
//
// Aufruf: node apps/kunst-entdecker/werkzeug/bilder-bauen.mjs
import { writeFile, readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';

const BREITE = 420;
const QUALITAET = 0.72;
const require = createRequire(import.meta.url);
let chromium;
for (const pfad of ['/opt/node22/lib/node_modules/playwright/index.js', 'playwright']) {
  try { ({ chromium } = require(pfad)); break; } catch { /* nächster Versuch */ }
}
if (!chromium) {
  console.error('Playwright nicht gefunden – dieses Werkzeug läuft nur in der Entwicklungsumgebung.');
  process.exit(1);
}

const werke = JSON.parse(await readFile(new URL('../daten/werke.quelle.json', import.meta.url), 'utf8'));

async function metDaten(id) {
  const r = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`);
  if (!r.ok) throw new Error(`Met ${id}: HTTP ${r.status}`);
  return r.json();
}

const browser = await chromium.launch({ headless: true, executablePath: '/opt/pw-browsers/chromium' });
const seite = await browser.newPage();
const fertig = [];

for (const w of werke.werke) {
  const met = await metDaten(w.metId);
  if (!met.isPublicDomain) throw new Error(`${w.metId} ist NICHT Open Access – nicht verwendbar`);
  const quelle = met.primaryImageSmall || met.primaryImage;
  if (!quelle) throw new Error(`${w.metId} hat kein Bild`);
  const antwort = await fetch(quelle);
  const puffer = Buffer.from(await antwort.arrayBuffer());
  const roh = `data:image/jpeg;base64,${puffer.toString('base64')}`;
  const klein = await seite.evaluate(async ([datenUri, breite, qualitaet]) => {
    const bild = new Image();
    await new Promise((fertig, fehler) => { bild.onload = fertig; bild.onerror = fehler; bild.src = datenUri; });
    const faktor = Math.min(1, breite / bild.naturalWidth);
    const leinwand = document.createElement('canvas');
    leinwand.width = Math.round(bild.naturalWidth * faktor);
    leinwand.height = Math.round(bild.naturalHeight * faktor);
    const stift = leinwand.getContext('2d');
    stift.fillStyle = '#fff';
    stift.fillRect(0, 0, leinwand.width, leinwand.height);
    stift.drawImage(bild, 0, 0, leinwand.width, leinwand.height);
    return { uri: leinwand.toDataURL('image/jpeg', qualitaet), breite: leinwand.width, hoehe: leinwand.height };
  }, [roh, BREITE, QUALITAET]);

  fertig.push({
    ...w,
    kuenstler: w.kuenstler ?? (met.artistDisplayName || 'unbekannt'),
    jahr: w.jahr ?? met.objectDate,
    quelle: {
      einrichtung: 'The Metropolitan Museum of Art, New York',
      objektnummer: met.accessionNumber,
      lizenz: 'CC0 1.0 (Open Access)',
      seite: met.objectURL,
    },
    bild: klein.uri,
    breite: klein.breite,
    hoehe: klein.hoehe,
  });
  console.log(`${w.id}: ${klein.breite}x${klein.hoehe}, ${Math.round(klein.uri.length / 1024)} kB – ${met.artistDisplayName || 'unbekannt'}`);
}

await browser.close();
const ziel = new URL('../daten/werke.json', import.meta.url);
await writeFile(ziel, `${JSON.stringify({ ...werke, werke: fertig }, null, 2)}\n`, 'utf8');
console.log(`\ngeschrieben: ${fertig.length} Werke`);
