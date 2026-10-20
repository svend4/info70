// Prüfung des Endbildschirms eines Quiz im Einzel-Modus. Reine Funktionen: tools/quiz-durchlauf.mjs
// führt das Quiz im Browser bis zum Ende und gibt den Text hierher; die Tests prüfen die Muster selbst.
export const SYMBOLE = /[☐☒☑✓✔★☆]/u;
export const STERNE = /[⭐🏆🥇🥈🥉🎖🏅🌟]/u;
export const RANG_WORT = /\bRang\b|Rangliste|Rangstufe|Rängen?\b/i;

/** Verletzungen auf dem Endbildschirm: true heißt ok. */
export function pruefeEndeText(text) {
  return {
    zahlVonZahl: !/\d+\s*von\s*\d+/i.test(text),
    richtig: !/richtig/i.test(text),
    rekord: !/rekord/i.test(text),
    sterneOderPokal: !STERNE.test(text),
    rangWort: !RANG_WORT.test(text),
  };
}

/** Zeichen aus SYMBOLE, die im Druck stehen würden. */
export function druckSymbole(text) {
  return [...new Set(text.match(new RegExp(SYMBOLE.source, 'gu')) ?? [])];
}
