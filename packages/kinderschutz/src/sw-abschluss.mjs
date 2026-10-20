// Vollständigkeit der Service-Worker-Caches: jeder lokale Modul- und Stylesheet-Pfad, den index.html und
// app.mjs eines Apps erreichen, muss in der Liste addAll ihres sw.js stehen. Sonst lädt die App offline
// nicht: der fetch-Handler holt nur, was im Cache liegt, und lädt nichts nach.
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, normalize, relative } from 'node:path';

const rel = (root, p) => relative(root, normalize(p)).replace(/\\/g, '/');

/** Alle lokalen Dateien, die von index.html und app.mjs aus erreichbar sind (Repo-relative Pfade). */
export function erreichbareDateien(appDir, root) {
  const besucht = new Set();
  const warte = [];
  const indexHtml = readFileSync(join(appDir, 'index.html'), 'utf8');
  for (const m of indexHtml.matchAll(/<(?:script|link)[^>]*?(?:src|href)=["']([^"']+)["']/g)) warte.push(join(appDir, m[1]));
  warte.push(join(appDir, 'app.mjs'));
  while (warte.length) {
    const p = normalize(warte.pop());
    if (besucht.has(p) || /^https?:/.test(p) || !existsSync(p) || !statSync(p).isFile()) continue;
    besucht.add(p);
    const t = readFileSync(p, 'utf8');
    if (/\.m?js$/.test(p)) {
      for (const m of t.matchAll(/(?:from|import)\s*\(?\s*['"](\.{1,2}\/[^'"]+)['"]/g)) warte.push(join(dirname(p), m[1]));
      for (const m of t.matchAll(/import\s+['"](\.{1,2}\/[^'"]+)['"]/g)) warte.push(join(dirname(p), m[1]));
    }
    if (/\.html$/.test(p)) {
      for (const m of t.matchAll(/(?:src|href)=["']([^"'#?]+)["']/g)) if (!/^(https?:|data:|mailto:)/.test(m[1])) warte.push(join(dirname(p), m[1]));
    }
    if (/\.css$/.test(p)) {
      for (const m of t.matchAll(/url\(["']?(\.{1,2}\/[^"')]+)["']?\)/g)) warte.push(join(dirname(p), m[1]));
      for (const m of t.matchAll(/@import\s+["'](\.{1,2}\/[^"']+)["']/g)) warte.push(join(dirname(p), m[1]));
    }
  }
  return [...besucht].map((p) => rel(root, p)).sort();
}

/** Repo-relative Pfade, die im addAll-Block des sw.js stehen. */
export function addAllDateien(appDir, root) {
  const swText = readFileSync(join(appDir, 'sw.js'), 'utf8');
  const block = /addAll\(\[([\s\S]*?)\]\)/.exec(swText)?.[1] ?? '';
  const eintraege = [...block.matchAll(/'([^']+)'/g)].map((m) => m[1]);
  return eintraege.map((e) => (e.endsWith('/') ? rel(root, join(appDir, e, 'index.html')) : rel(root, join(appDir, e))));
}

/** Erreichbare Dateien, die im addAll fehlen. Leer heißt: der Cache ist vollständig. */
export function fehlendeImAddAll(appDir, root) {
  const im = new Set(addAllDateien(appDir, root));
  return erreichbareDateien(appDir, root).filter((p) => !im.has(p));
}
