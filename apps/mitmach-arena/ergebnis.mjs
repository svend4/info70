// Ergebnis der Abstimmung als neutrale Zeile: reine Logik ohne DOM, testbar.
// Gezeigt wird nur, welche Möglichkeit(en) die meisten Stimmen haben.

/**
 * Möglichkeiten mit den meisten Stimmen. Leer, solange keine Stimme abgegeben wurde.
 * @param {{optionen: string[], stimmen: number[]}} umfrage
 * @returns {string[]}
 */
export function meisteStimmen(umfrage) {
  const meiste = Math.max(0, ...umfrage.stimmen);
  return meiste > 0 ? umfrage.optionen.filter((_, i) => umfrage.stimmen[i] === meiste) : [];
}

/**
 * Zeile unter den Balken, z. B. „Meiste Stimmen: Zoo“. Leerer Text, solange keine Stimme abgegeben wurde.
 * @param {{optionen: string[], stimmen: number[]}} umfrage
 * @returns {string}
 */
export function meisteStimmenText(umfrage) {
  const vorn = meisteStimmen(umfrage);
  return vorn.length > 0 ? `Meiste Stimmen: ${vorn.join(' · ')}` : '';
}
