// Erkennung für tools/quiz-durchlauf.mjs: welcher Knopf weiterführt, welcher Knopf das Ende anzeigt und
// ob eine App den Quiz-Motor nutzt. Reine Funktionen, damit die Erkennung geprüft ist (Tests in test/).
// Das Werkzeug prüft nur Quiz-Apps auf quiz-kern; andere Apps haben keinen Endbildschirm im Sinne des Werkzeugs.

// Weiter-Knöpfe beginnen mit ihrem Wort oder tragen einen Pfeil; eine Antwort kann „Ergebnis“ enthalten.
export const WEITER = /➡|^(Weiter|Zum Ergebnis|Zum Abschluss|Fertig|Ergebnis)\b/;

// Endknöpfe: Start, Neustart oder Nochmal. „Nochmal vorlesen“ ist ein Vorlese-Knopf auf jeder Karte, kein Ende.
export const ENDE = /🏠|Zum Start|Noch einmal|Noch eine|Neue Runde|Neue Klassen|(^|\s)Nochmal\b(?! vorlesen)/;

export function istWeiter(text) {
  return WEITER.test(text);
}

export function istEnde(text) {
  return ENDE.test(text);
}

/** Nutzt die App den Quiz-Motor? Geprüft wird der Quelltext von app.mjs und index.html. */
export function nutztQuizMotor(quelltext) {
  return /quiz-kern/.test(quelltext);
}

/**
 * App-Namen aus dem Aufruf: die Optionen --ausgabe und --modus samt Wert fallen weg, sonst nichts.
 * Fehlt eine Option, darf sie keinen Eintrag mitnehmen (indexOf gäbe -1 und damit den ersten Namen frei).
 */
export function appsAusArgs(args) {
  const weg = new Set();
  for (const option of ['--ausgabe', '--modus']) {
    const i = args.indexOf(option);
    if (i >= 0) {
      weg.add(i);
      weg.add(i + 1);
    }
  }
  return args.filter((_, i) => !weg.has(i));
}

/** Apps ohne Quiz-Motor: das Werkzeug lehnt sie ab, statt sie falsch zu messen. */
export function nichtQuizApps(eintraege) {
  return eintraege.filter((e) => !nutztQuizMotor(e.quelltext)).map((e) => e.slug);
}
