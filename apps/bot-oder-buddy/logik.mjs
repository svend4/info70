// Bot oder Buddy?: reine Logik (ohne DOM), damit sie testbar ist.
// Prueft die Trick-Zuordnung des Kindes fuer die Rueckmeldung zu jeder Antwort und zaehlt die
// Trick-Vorkommen im fest geskripteten Dialog (daten/dialog.json). Das Kind wird nicht bewertet.

/** Die fuenf Simulations-Tricks des Kumpel-Bots (feste IDs, siehe daten/dialog.json). */
export const TRICK_IDS = ['spiegeln', 'schmeichelei', 'fragen', 'erinnerung', 'koeder'];

/**
 * Zaehlt, wie oft jeder Trick im Dialog vorkommt.
 * @param {Array<{trick?: string|null}>} dialog
 * @returns {Record<string, number>} trickId -> Anzahl
 */
export function trickVorkommen(dialog) {
  const zaehler = Object.fromEntries(TRICK_IDS.map((id) => [id, 0]));
  for (const nachricht of dialog) {
    if (nachricht.trick != null) zaehler[nachricht.trick] = (zaehler[nachricht.trick] ?? 0) + 1;
  }
  return zaehler;
}

/**
 * Alle Nachrichten, in denen ein Trick steckt.
 * @param {Array<{trick?: string|null}>} dialog
 */
export function nachrichtenMitTrick(dialog) {
  return dialog.filter((nachricht) => nachricht.trick != null);
}

/**
 * Alle Bot-Angebote, die das Kind annehmen oder ablehnen muss.
 * @param {Array<{angebot?: boolean}>} dialog
 */
export function angebote(dialog) {
  return dialog.filter((nachricht) => nachricht.angebot === true);
}

/**
 * Prueft die Trick-Zuordnung des Kindes fuer eine Nachricht (Grundlage der Rueckmeldung mit Erklaerung).
 * @param {{trick?: string|null}} nachricht
 * @param {string} trickWahl gewaehlte Trick-ID
 * @returns {{hatTrick: boolean, richtig: boolean, tatsaechlich: string|null}}
 */
export function bewerteZuordnung(nachricht, trickWahl) {
  const tatsaechlich = nachricht.trick ?? null;
  return {
    hatTrick: tatsaechlich != null,
    richtig: tatsaechlich != null && tatsaechlich === trickWahl,
    tatsaechlich,
  };
}
