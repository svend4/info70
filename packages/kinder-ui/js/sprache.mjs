// kinder-ui/sprache: Mini-Mehrsprachigkeit ohne Abhängigkeiten.
// Hintergrund: Mehrsprachigkeit kindgerechter Angebote (u. a. für Kinder mit
// Migrationsgeschichte) war explizites Ziel des BKM-Programms von 2017 und
// bleibt Monorepo-Ziel (docs/04, Etappe 3). Die gewählte Sprache ist kein
// personenbezogenes Datum; sie wird optional in localStorage gemerkt.

/**
 * @param {{ kataloge: Record<string, Record<string, unknown>>, standard?: string, speicherSchluessel?: string|null }} optionen
 */
export function erstelleSprache({ kataloge, standard = 'de', speicherSchluessel = null }) {
  const speicher = speicherSchluessel ? globalThis.localStorage : null;
  let code = speicher?.getItem(speicherSchluessel) ?? standard;
  if (!kataloge[code]) code = standard;

  return {
    /** Text zum Schlüssel in aktueller Sprache; {platzhalter} werden ersetzt. */
    t(schluessel, ersetzungen = {}) {
      let text = kataloge[code]?.[schluessel] ?? kataloge[standard]?.[schluessel] ?? schluessel;
      if (typeof text !== 'string') return text;
      for (const [k, v] of Object.entries(ersetzungen)) text = text.replaceAll(`{${k}}`, String(v));
      return text;
    },
    setze(neu) {
      if (!kataloge[neu]) return false;
      code = neu;
      speicher?.setItem(speicherSchluessel, neu);
      return true;
    },
    aktuelle: () => code,
    verfuegbare: () => Object.keys(kataloge),
  };
}
