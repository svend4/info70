// Änderungsumfang: zeigt je App, welche entfernten Zeilen über die erlaubte Liste hinausgehen
// (Rekord, Rang, Rangliste, Punkte, Ampel, Prozent, Pokal). Nur Anzeige; entscheidet nichts.
// Aufruf: node tools/aenderungsumfang.mjs <app> [<app> …] [--gegen <stand>] [--alle]
//   --gegen   Vergleichsstand, Standard HEAD
//   --alle    alle Apps, die gegenüber dem Stand geändert sind
// Exit: 0 keine Befunde, 1 mindestens ein Befund, 64 Aufruf falsch.
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { pruefeDiff, zusammenfassung } from '../packages/kinderschutz/src/aenderungsumfang.mjs';

const WURZEL = fileURLToPath(new URL('../', import.meta.url));
const git = (...a) => execFileSync('git', a, { cwd: WURZEL, stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 * 1024 * 1024 }).toString();

const args = process.argv.slice(2);
const gegenIdx = args.indexOf('--gegen');
const gegen = gegenIdx >= 0 ? args[gegenIdx + 1] : 'HEAD';
const alle = args.includes('--alle');
const apps = args.filter((a, i) => !(a === '--alle') && !(gegenIdx >= 0 && (i === gegenIdx || i === gegenIdx + 1)) && !a.startsWith('--'));

const zuPruefen = alle
  ? [...new Set(git('diff', '--name-only', gegen, '--', 'apps').split('\n').filter(Boolean).map((p) => p.split('/')[1]))].sort()
  : apps;
if (!zuPruefen.length) {
  console.error('Aufruf: node tools/aenderungsumfang.mjs <app> [<app> …] [--gegen <stand>] [--alle]');
  process.exit(64);
}

let befunde = 0;
for (const slug of zuPruefen) {
  const diff = git('diff', '-U0', '--no-color', gegen, '--', `apps/${slug}`);
  const dateien = pruefeDiff(diff);
  const neu = git('ls-files', '--others', '--exclude-standard', '--', `apps/${slug}`).split('\n').filter(Boolean);
  const z = zusammenfassung(dateien);
  befunde += z.befunde;
  console.log(`${slug}: ${z.dateien} Dateien, −${z.entfernt} +${z.hinzu} Zeilen, neu ${neu.length}, Befunde ${z.befunde}`);
  for (const d of dateien) {
    for (const b of d.befunde) console.log(`   ${d.datei}: ${b.art}: ${b.zeile}`);
  }
  for (const n of neu) console.log(`   ${n}: neue Datei (nicht im Stand)`);
}
process.exit(befunde ? 1 : 0);
