// Meilenstein-Begleiter 1. Lebensjahr: reine Logik (ohne DOM), testbar.
// Beobachtungshilfe für Eltern, angelehnt an U3–U6. KEINE Diagnose, KEIN
// Screening, keine Kind-Daten. Praleska docs/10 (Top-30 Nr. 4).

/** Alle Meilenstein-Ids (flach). */
export function alleIds(katalog) {
  return katalog.fenster.flatMap((f) => f.meilensteine.map((m) => m.id));
}

/** Prüft den Katalog: ≥3 Fenster mit je ≥4 Meilensteinen, eindeutige Ids mit Fenster-Präfix. */
export function pruefeKatalog(katalog) {
  const k = katalog;
  if (typeof k !== 'object' || k === null || !Array.isArray(k.fenster)) return ['Kein gültiger Katalog'];
  const fehler = [];
  if (k.fenster.length < 3) fehler.push('mindestens 3 U-Fenster erwartet');
  const gesehen = new Set();
  for (const f of k.fenster) {
    if (typeof f.id !== 'string' || typeof f.name !== 'string') { fehler.push('Fenster ohne id/name'); continue; }
    if (!Array.isArray(f.meilensteine) || f.meilensteine.length < 4) { fehler.push(`${f.id}: mindestens 4 Meilensteine`); continue; }
    for (const m of f.meilensteine) {
      if (typeof m.id !== 'string' || typeof m.text !== 'string' || m.text.length < 10) { fehler.push(`${f.id}: Meilenstein ohne id/text`); continue; }
      if (gesehen.has(m.id)) fehler.push(`Meilenstein-Id doppelt: ${m.id}`);
      gesehen.add(m.id);
      if (!m.id.startsWith(`${f.id}-`)) fehler.push(`${m.id}: Kennung muss zum Fenster ${f.id} gehören`);
    }
  }
  return fehler;
}

/** Zählt beobachtete Meilensteine in einem Fenster. */
export function zaehleFenster(fenster, beobachtet = {}) {
  const b = fenster.meilensteine.filter((m) => beobachtet[m.id]).length;
  return { beobachtet: b, gesamt: fenster.meilensteine.length };
}

/** Offene (noch nicht beobachtete) Meilensteine eines Fensters. */
export function offene(fenster, beobachtet = {}) {
  return fenster.meilensteine.filter((m) => !beobachtet[m.id]);
}

const stand = () => {
  try { return new Date().toLocaleDateString('de-DE'); } catch { return ''; }
};

/**
 * Baut die Gesprächs-Vorbereitung fürs Arzt-Gespräch (Text). Für ein gewähltes
 * Fenster (oder alle) werden beobachtete und offene Meilensteine gelistet.
 */
export function bericht(katalog, beobachtet = {}, fensterId = null, datum = stand()) {
  const fenster = fensterId ? katalog.fenster.filter((f) => f.id === fensterId) : katalog.fenster;
  const zeilen = [
    'Meilenstein-Begleiter 1. Lebensjahr – Vorbereitung fürs Arzt-Gespräch',
    `Stand: ${datum}`,
    '',
    'Keine Diagnose und kein Ersatz für die U-Untersuchungen. Die Zeitangaben',
    'sind Richtwerte; Kinder entwickeln sich sehr unterschiedlich. Nehmen Sie die',
    'U-Untersuchungen wahr und sprechen Sie Beobachtungen mit der Kinderärztin',
    'bzw. dem Kinderarzt (gelbes U-Heft).',
    '',
  ];
  for (const f of fenster) {
    const z = zaehleFenster(f, beobachtet);
    zeilen.push(`## ${f.name}  (${z.beobachtet}/${z.gesamt} beobachtet)`);
    for (const m of f.meilensteine) {
      zeilen.push(`${beobachtet[m.id] ? '☑' : '☐'} [${m.bereich}] ${m.text}`);
    }
    const off = offene(f, beobachtet);
    if (off.length) zeilen.push(`→ Fürs Gespräch notieren: ${off.length} Punkt(e) noch nicht beobachtet.`);
    zeilen.push('');
  }
  zeilen.push('Bei Sorgen oder wenn mehrere Punkte deutlich später kommen: früh die Kinderärztin/den Kinderarzt ansprechen.');
  return zeilen.join('\n');
}
