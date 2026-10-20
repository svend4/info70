// Prüft alle Commits einer Sitzung: Jeder Commit darf nur apps/<slug>/ und docs/registrierung/<Kennung>.json
// ändern. Standard: alle Commits in origin/<Arbeitsbranche>..HEAD. --no-renames: ein Umbenennen zeigt
// Alt und Neu, damit das Löschen einer fremden Datei sichtbar bleibt.
// Aufruf: node tools/pfad-pruefung.mjs <slug> <Kennung> [Bereich]
//   Bereich z. B. origin/claude/children-network-programs-germany-hr0jh9..HEAD (Standard)
import { execFileSync } from 'node:child_process';

const [slug, kennung, bereich = 'origin/claude/children-network-programs-germany-hr0jh9..HEAD'] = process.argv.slice(2);
if (!slug || !kennung) {
  console.error('Aufruf: node tools/pfad-pruefung.mjs <slug> <Kennung> [Bereich]');
  process.exit(2);
}
const git = (args) => execFileSync('git', args, { encoding: 'utf8' });
const commits = git(['rev-list', bereich]).split('\n').map((c) => c.trim()).filter(Boolean);
if (commits.length === 0) {
  console.log(`keine Commits in ${bereich}`);
  process.exit(0);
}
const erlaubt = [`apps/${slug}/`, `docs/registrierung/${kennung}.json`];
const fehler = [];
for (const sha of commits) {
  const pfade = git(['show', '--name-only', '--no-renames', '--format=', sha]).split('\n').map((p) => p.trim()).filter(Boolean);
  if (pfade.length === 0) fehler.push(`${sha.slice(0, 7)}: ändert keine Dateien`);
  for (const p of pfade) {
    const ok = erlaubt.some((e) => (e.endsWith('/') ? p.startsWith(e) : p === e));
    if (!ok) fehler.push(`${sha.slice(0, 7)}: fremder Pfad ${p}`);
  }
}
if (fehler.length) {
  console.error(`Pfadprüfung fehlgeschlagen:\n  ${fehler.join('\n  ')}`);
  process.exit(1);
}
console.log(`ok: ${commits.length} Commits, alle Pfade unter apps/${slug}/ oder docs/registrierung/${kennung}.json`);
