// Stand der Service-Worker-Caches: je sw.js der Cache-Name und die Hashes der
// vorab gecachten Dateien. Ändert sich eine gecachte Datei, ohne dass der
// Cache-Name hochgezählt wird, bekommen wiederkehrende Nutzer*innen die alte
// Datei aus dem Cache. Deshalb verweigert das Schreiben des Stands diesen Fall.
import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';

const SW_NAME = 'sw.js';
const ORDNER_AUSGESCHLOSSEN = new Set(['node_modules', '.git']);

async function suche(dir, out = []) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (ORDNER_AUSGESCHLOSSEN.has(e.name) || e.name.startsWith('.')) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) await suche(p, out);
    else if (e.name === SW_NAME) out.push(p);
  }
  return out;
}

/** Liest Cache-Name und die Liste der vorab gecachten Pfade aus dem Quelltext eines sw.js. */
export function leseSw(text) {
  const cache = /const CACHE = '([^']+)'/.exec(text)?.[1] ?? null;
  const block = /addAll\(\[([\s\S]*?)\]\)/.exec(text)?.[1] ?? '';
  const pfade = [...block.matchAll(/'([^']+)'/g)].map((m) => m[1]);
  return { cache, pfade };
}

/** Der Pfad „./“ meint die Startseite des Ordners: dort liegt index.html. */
function echteDatei(verzeichnis, pfad) {
  return join(verzeichnis, pfad.endsWith('/') ? `${pfad}index.html` : pfad);
}

/** Aktueller Stand aller sw.js im Repo: { "apps/x/sw.js": { cache, dateien: { "apps/x/…": sha256 } } }. */
export async function aktuellerStand(wurzel) {
  const stand = {};
  for (const sw of (await suche(join(wurzel, 'apps'))).sort()) {
    const { cache, pfade } = leseSw(await readFile(sw, 'utf8'));
    const verzeichnis = dirname(sw);
    const dateien = {};
    for (const pfad of pfade) {
      const datei = echteDatei(verzeichnis, pfad);
      const schluessel = relative(wurzel, join(verzeichnis, pfad)).replace(/\\/g, '/');
      dateien[schluessel] = createHash('sha256').update(await readFile(datei)).digest('hex');
    }
    stand[relative(wurzel, sw).replace(/\\/g, '/')] = { cache, dateien };
  }
  return stand;
}

/**
 * Vergleicht den gespeicherten Stand mit dem aktuellen.
 * Ergebnis: Liste der Probleme. Leer heißt: alles stimmt.
 */
export function vergleiche(gespeichert, aktuell) {
  const probleme = [];
  for (const [sw, jetzt] of Object.entries(aktuell)) {
    const alt = gespeichert[sw];
    if (!alt) { probleme.push(`${sw}: nicht im Stand (node tools/sw-stand.mjs --schreiben)`); continue; }
    const geaendert = [...new Set([...Object.keys(alt.dateien), ...Object.keys(jetzt.dateien)])]
      .filter((k) => alt.dateien[k] !== jetzt.dateien[k]);
    if (alt.cache === jetzt.cache && geaendert.length === 0) continue;
    if (alt.cache === jetzt.cache) {
      probleme.push(`${sw}: ${geaendert.join(', ')} geändert, CACHE „${jetzt.cache}“ nicht hochgezählt`);
    } else {
      probleme.push(`${sw}: Stand veraltet, CACHE „${alt.cache}“ → „${jetzt.cache}“ (node tools/sw-stand.mjs --schreiben)`);
    }
  }
  for (const sw of Object.keys(gespeichert)) {
    if (!aktuell[sw]) probleme.push(`${sw}: im Stand, aber nicht mehr vorhanden`);
  }
  return probleme;
}
