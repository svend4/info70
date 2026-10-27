// Bericht: Wörter der Leistungsbewertung (Rekord, Punkte, Serien, Prozent, „richtig von“, „geschafft“, Sterne, Pokale,
// Tages- und Wochenvergleich) in den Dateien der Apps. Entscheidung Max 37в: ein neutraler Zähler des Gefundenen ist erlaubt.
// Aufruf: node tools/leistungs-woerter.mjs [<app> …] [--zaehlen]
// Ohne App: alle. Mit --zaehlen nur Summen je Gruppe und die Zahl der Apps. Exit 0 immer (Bericht, kein Tor).
import { fileURLToPath } from 'node:url';
import { appLeistungsTreffer } from '../packages/kinderschutz/src/leistungs-woerter.mjs';

const WURZEL = fileURLToPath(new URL('../', import.meta.url));
const args = process.argv.slice(2);
const slugs = args.filter((a) => !a.startsWith('--'));
const treffer = await appLeistungsTreffer(WURZEL, slugs.length ? slugs : undefined);
const apps = Object.keys(treffer);

if (args.includes('--zaehlen')) {
  const summe = {};
  for (const liste of Object.values(treffer)) for (const t of liste) summe[t.gruppe] = (summe[t.gruppe] ?? 0) + 1;
  console.log(JSON.stringify({ apps: apps.length, summe }, null, 2));
} else {
  for (const slug of apps) {
    const je = {};
    for (const t of treffer[slug]) (je[`${t.datei}: ${t.gruppe}`] ??= new Set()).add(t.wort);
    console.log(`${slug}`);
    for (const [k, v] of Object.entries(je)) console.log(`  ${k} → ${[...v].join(', ')}`);
  }
  console.log(apps.length ? `${apps.length} App(s) mit Treffern` : 'keine Treffer');
}
