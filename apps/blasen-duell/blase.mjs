// Blasen-Duell (für 8-12, docs/09 Ось G, zu feed-forscher): reine Logik ohne
// DOM, testbar. Zwei Kinder tippen am selben Gerät unterschiedliche Interessen
// an – derselbe Empfehlungs-Algorithmus (gewichteter Zufall + Verstärkung)
// erzeugt zwei völlig verschiedene Feeds/Blasen. Zeigt: Personalisierung
// trennt Sichtweisen. Keine Speicherung, keine Netzwerkanfragen.

export const THEMEN = Object.freeze([
  { id: 'katzen', name: 'Katzen', emoji: '🐱' },
  { id: 'fussball', name: 'Fußball', emoji: '⚽' },
  { id: 'weltraum', name: 'Weltraum', emoji: '🚀' },
  { id: 'backen', name: 'Backen', emoji: '🧁' },
  { id: 'dinos', name: 'Dinos', emoji: '🦖' },
  { id: 'musik', name: 'Musik', emoji: '🎵' },
]);

export const VERSTAERKUNG = 1.8;

/** Neue Blase: alle Themen gleich gewichtet (1). */
export function neueBlase(themen = THEMEN) {
  return { gewichte: Object.fromEntries(themen.map((t) => [t.id, 1])) };
}

/** Ein Thema antippen: sein Gewicht wird verstärkt (unveränderlich). */
export function tippe(blase, id, verstaerkung = VERSTAERKUNG) {
  if (!(id in blase.gewichte)) return blase;
  return { gewichte: { ...blase.gewichte, [id]: blase.gewichte[id] * verstaerkung } };
}

/** Anteil eines Themas an der Gesamtgewichtung (0..1). */
export function anteil(blase, id) {
  const summe = Object.values(blase.gewichte).reduce((s, g) => s + g, 0);
  return summe === 0 ? 0 : (blase.gewichte[id] ?? 0) / summe;
}

/** Dominantes Thema (höchstes Gewicht) plus Anteil. */
export function dominant(blase) {
  const ids = Object.keys(blase.gewichte);
  const top = ids.reduce((a, b) => (blase.gewichte[a] >= blase.gewichte[b] ? a : b));
  return { id: top, anteil: anteil(blase, top) };
}

/**
 * Zieht n Themen-IDs gewichtet nach der Blase (mit Wiederholung) – der „Feed“.
 * @param {number} n
 * @param {() => number} zufall Zufallsquelle (für Tests injizierbar)
 */
export function ziehe(blase, n, zufall = Math.random) {
  const ids = Object.keys(blase.gewichte);
  const summe = ids.reduce((s, id) => s + blase.gewichte[id], 0);
  const feed = [];
  for (let k = 0; k < n; k++) {
    let los = zufall() * summe;
    let gewaehlt = ids[ids.length - 1];
    for (const id of ids) {
      los -= blase.gewichte[id];
      if (los < 0) { gewaehlt = id; break; }
    }
    feed.push(gewaehlt);
  }
  return feed;
}

/** Sind die beiden Blasen inhaltlich verschieden (anderes Leitthema)? */
export function verschieden(a, b) {
  return dominant(a).id !== dominant(b).id;
}
