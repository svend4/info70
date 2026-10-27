// Notruf-Held: reine Logik (ohne DOM), testbar. Simulierter Wähltastatur-
// Trainer für 112 (Feuerwehr/Rettung) und 110 (Polizei). KEIN echter Anruf,
// keine Datenerfassung. Praleska docs/10 (Top-30 Nr. 8).

export const NOTRUFNUMMERN = ['112', '110'];

/** Nur Ziffern behalten (Tastatur-Eingabe säubern). */
export function nurZiffern(eingabe) {
  return String(eingabe).replace(/\D/g, '');
}

/** Ist die Eingabe eine gültige Notrufnummer? */
export function istNotrufnummer(eingabe) {
  return NOTRUFNUMMERN.includes(nurZiffern(eingabe));
}

/**
 * Prüft die gewählte Nummer gegen das Ziel der Situation.
 * @returns {{gewaehlt:string, ok:boolean, istNotruf:boolean, andereNotruf:boolean}}
 */
export function pruefeAnruf(eingabe, ziel) {
  const gewaehlt = nurZiffern(eingabe);
  return {
    gewaehlt,
    ok: gewaehlt === ziel,
    istNotruf: istNotrufnummer(gewaehlt),
    andereNotruf: istNotrufnummer(gewaehlt) && gewaehlt !== ziel,
  };
}

/** Rückmeldungstext zur Wahl. */
export function rueckmeldung(eingabe, ziel, nummern) {
  const p = pruefeAnruf(eingabe, ziel);
  if (p.ok) return `Richtig! ${ziel} ist ${nummern[ziel]}.`;
  if (p.andereNotruf) return `Fast! ${p.gewaehlt} ist ${nummern[p.gewaehlt]}. Hier passt aber ${ziel} (${nummern[ziel]}) besser.`;
  return `Das ist keine Notrufnummer. Richtig ist ${ziel} – ${nummern[ziel]}.`;
}
