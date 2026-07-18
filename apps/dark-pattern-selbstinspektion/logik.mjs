// Dark-Pattern-Selbstinspektion: reine Logik (ohne DOM), testbar
// (docs/09 Ось D Nr. 228). UI-Prüfliste mit vier Zuständen je Muster;
// der Bericht dokumentiert Befunde und Abstellmaßnahmen (faire Alternative).

export const ZUSTAENDE = Object.freeze({
  ungeprueft: { symbol: '⚪', label: 'ungeprüft' },
  gefunden: { symbol: '🔴', label: 'gefunden' },
  frei: { symbol: '🟢', label: 'frei' },
  behoben: { symbol: '🔵', label: 'behoben' },
});

/** Standard, solange ein Muster nicht bewertet wurde. */
export const STANDARD = 'ungeprueft';

/** Alle Muster flach über die Kategorien. */
export function alleMuster(daten) {
  return daten.kategorien.flatMap((k) => k.muster);
}

/** Zählt die Zustände über alle Muster. */
export function zaehle(alle, status = {}) {
  const z = { ungeprueft: 0, gefunden: 0, frei: 0, behoben: 0 };
  for (const m of alle) z[status[m.id] ?? STANDARD]++;
  return z;
}

/** Muster im Zustand „gefunden“ (offene Befunde). */
export function befunde(daten, status = {}) {
  return alleMuster(daten).filter((m) => (status[m.id] ?? STANDARD) === 'gefunden');
}

/** Muster im Zustand „behoben“. */
export function behobene(daten, status = {}) {
  return alleMuster(daten).filter((m) => status[m.id] === 'behoben');
}

const stand = () => {
  try { return new Date().toLocaleDateString('de-DE'); } catch { return ''; }
};

/** Text-Bericht: Zählung, offene Befunde mit Abstellmaßnahme, behobene Punkte. */
export function bericht(daten, status = {}) {
  const alle = alleMuster(daten);
  const z = zaehle(alle, status);
  const zeilen = [
    'Dark-Pattern-Selbstinspektion – Bericht',
    `Grundlage: ${daten.quelle}`,
    `Stand: ${stand()}`,
    `🔴 gefunden: ${z.gefunden}   🔵 behoben: ${z.behoben}   🟢 frei: ${z.frei}   ⚪ ungeprüft: ${z.ungeprueft}   (von ${alle.length})`,
    '',
  ];
  const offen = befunde(daten, status);
  if (offen.length) {
    zeilen.push('## Offene Befunde – Abstellmaßnahmen');
    for (const m of offen) {
      zeilen.push(`🔴 ${m.name} (${m.bezug})`);
      zeilen.push(`   Wirkung auf Kinder: ${m.kindWirkung}`);
      zeilen.push(`   Abstellmaßnahme: ${m.faireAlternative}`);
    }
    zeilen.push('');
  }
  const fix = behobene(daten, status);
  if (fix.length) {
    zeilen.push('## Behoben');
    for (const m of fix) zeilen.push(`🔵 ${m.name}`);
    zeilen.push('');
  }
  if (!offen.length && !fix.length) {
    zeilen.push('Noch keine Befunde markiert. Bitte Screen für Screen durchgehen.', '');
  }
  zeilen.push('Hinweis: Selbstinspektion, kein offizielles Ergebnis und kein Rechtsrat.');
  return zeilen.join('\n');
}
