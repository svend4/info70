// Erkennung für tools/quiz-durchlauf.mjs: welcher Knopf weiterführt, welcher Knopf das Ende anzeigt und
// ob eine App den Quiz-Motor nutzt. Reine Funktionen, damit die Erkennung geprüft ist (Tests in test/).
// Das Werkzeug prüft nur Quiz-Apps auf quiz-kern; andere Apps haben keinen Endbildschirm im Sinne des Werkzeugs.
// Ob eine App den Quiz-Motor nutzt, entscheidet ein echter Import von quiz-kern in einer Code-Datei der App.
// Kommentare zählen nicht: neun Apps erwähnen quiz-kern nur in Kommentaren („bewusst NICHT auf quiz-kern“).

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ohneKommentare } from './bewertung-stand.mjs';

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

/** Nutzt die App den Quiz-Motor? Ein Import von quiz-kern (ohne Kommentare) in einer Code-Datei der App. */
export function nutztQuizMotor(quelltext) {
  return /(?:\bfrom|\bimport)\s*\(?\s*['"][^'"]*quiz-kern[^'"]*['"]/.test(ohneKommentare(quelltext));
}

/** Alle Code-Dateien einer App (.mjs, .js, .html), ohne test/ und ohne node_modules. */
export function codeDateien(appOrdner) {
  const liste = [];
  const walk = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      if (e.name === 'node_modules' || e.name === 'test') continue;
      const p = join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (/\.(mjs|js|html)$/.test(e.name)) liste.push(p);
    }
  };
  walk(appOrdner);
  return liste.sort();
}

/** Zusammengefügter Quelltext aller Code-Dateien einer App. */
export function quelltextAusOrdner(appOrdner) {
  return codeDateien(appOrdner).map((p) => readFileSync(p, 'utf8')).join('\n');
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
