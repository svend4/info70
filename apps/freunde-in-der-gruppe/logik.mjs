// Freunde in der Gruppe: reine Logik (ohne DOM), testbar. Szenario-Trainer
// zu sozialem Verhalten in der Kindergruppe. Praleska docs/10 (Nr. 10).
// Das Kind wird nicht bewertet: jede Option bekommt nur eine Rückmeldung mit Erklärung.

/**
 * Rückmeldung zu einer gewählten Option (wert 2/1/0 der Daten): Emoji und Titel; `gut` färbt den Hinweis.
 * @param {{wert?: number}} option
 * @returns {{gut: boolean, emoji: string, titel: string}}
 */
export function rueckmeldungFuer(option) {
  const wert = option?.wert ?? 0;
  if (wert === 2) return { gut: true, emoji: '😊', titel: 'Wie freundlich!' };
  if (wert === 1) return { gut: false, emoji: '👍', titel: 'Fast!' };
  return { gut: false, emoji: '💭', titel: 'Denk nochmal mit.' };
}
