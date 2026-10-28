import { readdir } from 'node:fs/promises';
import { fundstellen } from '/home/user/info70/packages/kinderschutz/src/externe-fakten.mjs';
const W = '/home/user/info70/apps';
const out = [];
for (const slug of (await readdir(W, { withFileTypes: true })).filter((e) => e.isDirectory()).map((e) => e.name).sort()) {
  for (const f of await fundstellen(`${W}/${slug}`)) if (f.blockierend) out.push({ app: slug, datei: f.datei, zeile: f.zeile, kategorie: f.kategorie, text: f.text, quelleNahe: f.quelleNahe });
}
const rang = { recht: 0, finanzierung: 0, gesundheit: 1, sonstiges: 2 };
out.sort((a, b) => rang[a.kategorie] - rang[b.kategorie] || a.app.localeCompare(b.app) || a.datei.localeCompare(b.datei) || a.zeile - b.zeile);
console.log(JSON.stringify(out));
