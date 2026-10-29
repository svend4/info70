// Erzeugt den Stand der 131 Einheiten der Gruppe 2 aus den Quellen im Repository (Logik: packages/kinderschutz/src/gruppe-2-stand.mjs).
// Ausgabe: docs/status-gruppe-2-2026-10-29.json (nur mit --schreiben) und die Statuszeilen für docs/10 (mit --docs10).
// Aufruf:  node tools/gruppe-2-stand.mjs                 Bericht und Prüfung, schreibt nichts
//          node tools/gruppe-2-stand.mjs --schreiben     schreibt die JSON-Datei (nur wenn alle Prüfungen stimmen)
//          node tools/gruppe-2-stand.mjs --docs10        gibt die Zeilen für docs/10 aus, schreibt nichts
// Exit: 0 wenn alle Prüfungen stimmen, 1 sonst.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { erzeugeGruppe2Stand, docs10Zeilen } from '../packages/kinderschutz/src/gruppe-2-stand.mjs';

const WURZEL = fileURLToPath(new URL('../', import.meta.url));
const { ausgabe, fehler } = erzeugeGruppe2Stand(WURZEL);

if (process.argv.includes('--docs10')) {
  const zeilen = docs10Zeilen(ausgabe);
  for (const [kennung, text] of Object.entries(zeilen)) console.log(`${kennung}:\n${text}\n`);
  process.exit(fehler.length ? 1 : 0);
}

const z = ausgabe.zahlen;
console.log(`Einheiten: ${z.gesamt} | gebaut ${z.gebaut}, teilweise ${z.teilweise}, unklar ${z.unklar}, nicht bauen ${z.nicht_bauen}, davon Variante A ${z.davon_variante_a}`);
console.log(`Stufe 1: ${z.stufe_1} | Stufe 2: ${z.stufe_2} | Stufe 3: ${z.stufe_3} (geprüft ${z.stufe_3_faktengeprueft}, Katalogtext ${z.stufe_3_nur_katalogtext}, nicht prüfbar ${z.stufe_3_quelle_nicht_pruefbar})`);

if (fehler.length) {
  console.log(`Prüfungen mit Abweichung: ${fehler.length}`);
  for (const f of fehler) console.log(`  - ${f}`);
  console.log('Nicht geschrieben.');
  process.exit(1);
}
console.log('Alle Prüfungen stimmen.');

if (process.argv.includes('--schreiben')) {
  writeFileSync(join(WURZEL, 'docs/status-gruppe-2-2026-10-29.json'), JSON.stringify(ausgabe, null, 2) + '\n');
  console.log('Geschrieben: docs/status-gruppe-2-2026-10-29.json');
}
