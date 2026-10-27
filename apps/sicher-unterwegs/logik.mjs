// Sicher unterwegs: reine Logik (ohne DOM), testbar. Szenario-Trainer
// zu Alltags- und Verkehrssicherheit. Praleska docs/10 (Top-30 Nr. 7).
// Das Kind wird nicht bewertet: jede Option bekommt nur eine Rückmeldung mit Erklärung.

/**
 * Rückmeldung zu einer gewählten Option (wert 2/1/0 der Daten): Emoji und Titel; `gut` färbt den Hinweis.
 * @param {{wert?: number}} option
 * @returns {{gut: boolean, emoji: string, titel: string}}
 */
export function rueckmeldungFuer(option) {
  const wert = option?.wert ?? 0;
  if (wert === 2) return { gut: true, emoji: '😊', titel: 'Genau richtig!' };
  if (wert === 1) return { gut: false, emoji: '👍', titel: 'Fast!' };
  return { gut: false, emoji: '💭', titel: 'Denk nochmal mit.' };
}
