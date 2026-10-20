// Prüft den letzten Commit einer Sitzung: Er darf nur apps/<slug>/ und docs/registrierung/<Kennung>.json ändern.
// Aufruf: node tools/pfad-pruefung.mjs <slug> <Kennung> [Revision]   (Standard: HEAD)
// Exit 1, wenn ein fremder Pfad im Commit steht. Verhindert ungeplante Commits (Fall PRI-5).
import { execFileSync } from 'node:child_process';

const [slug, kennung, revision = 'HEAD'] = process.argv.slice(2);
if (!slug || !kennung) {
  console.error('Aufruf: node tools/pfad-pruefung.mjs <slug> <Kennung> [Revision]');
  process.exit(2);
}
const pfade = execFileSync('git', ['show', '--name-only', '--format=', revision], { encoding: 'utf8' })
  .split('\n').map((p) => p.trim()).filter(Boolean);
const erlaubt = [`apps/${slug}/`, `docs/registrierung/${kennung}.json`];
const fremd = pfade.filter((p) => !erlaubt.some((e) => (e.endsWith('/') ? p.startsWith(e) : p === e)));
if (pfade.length === 0) { console.error(`Commit ${revision} ändert keine Dateien.`); process.exit(1); }
if (fremd.length) {
  console.error(`Fremde Pfade im Commit ${revision}:\n  ${fremd.join('\n  ')}`);
  process.exit(1);
}
console.log(`ok: ${pfade.length} Dateien, alle unter apps/${slug}/ oder docs/registrierung/${kennung}.json`);
