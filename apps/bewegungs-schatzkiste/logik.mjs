// Bewegungs-Schatzkiste: reine Filter-/Gruppierlogik (ohne DOM), testbar.

/**
 * Filtert Bewegungsspiele nach Kategorie, Altersband und Ort.
 * Ein Spiel passt zum Ort, wenn seine ort-Liste den gesuchten Ort enthaelt
 * (viele Spiele sind sowohl drinnen als auch draussen moeglich).
 * @param {Array<object>} spiele
 * @param {{ kategorie?: string|null, altersband?: string|null, ort?: string|null }} [filter]
 */
export function filtereSpiele(spiele, { kategorie = null, altersband = null, ort = null } = {}) {
  return spiele.filter((s) =>
    (!kategorie || s.kategorie === kategorie)
    && (!altersband || s.altersband === altersband)
    && (!ort || (Array.isArray(s.ort) && s.ort.includes(ort))));
}

/**
 * Zaehlt, wie viele Spiele je Kategorie in der (gefilterten) Liste liegen.
 * @param {Array<object>} spiele
 * @returns {Record<string, number>}
 */
export function zaehleJeKategorie(spiele) {
  const summen = {};
  for (const s of spiele) summen[s.kategorie] = (summen[s.kategorie] ?? 0) + 1;
  return summen;
}
