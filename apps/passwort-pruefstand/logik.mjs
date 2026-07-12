// Passwort-Prüfstand: reine Rechenlogik (ohne DOM), damit sie testbar ist.
// Modell: Ein gedachter Knack-Computer probiert stur alle Kombinationen durch
// (Brute-Force). Der Zeichenraum ergibt sich aus den benutzten Zeichenarten,
// die Stärke aus Entropie-Bits = Länge × log2(Zeichenraum).
// Politik (docs/02): Hier wird nur gerechnet – nie gespeichert, nie gesendet.

/** Versuche pro Sekunde des gedachten Knack-Computers (10 Milliarden). */
export const VERSUCHE_PRO_SEKUNDE = 10_000_000_000;

/** Sekunden pro Jahr (365,25 Tage). */
export const SEKUNDEN_PRO_JAHR = 31_557_600;

/** Alter des Universums in Jahren (~13,8 Milliarden). */
export const UNIVERSUM_ALTER_JAHRE = 13_800_000_000;

/**
 * Zeichenraum eines Passworts: Wie viele verschiedene Zeichen kämen pro
 * Stelle in Frage, wenn man nur die benutzten Zeichenarten kennt?
 * Kleinbuchstaben 26, Großbuchstaben 26, Ziffern 10, alles andere
 * (Sonderzeichen, Umlaute …) pauschal 33.
 * @param {string} passwort
 * @returns {number}
 */
export function zeichenraum(passwort) {
  let raum = 0;
  if (/[a-z]/.test(passwort)) raum += 26;
  if (/[A-Z]/.test(passwort)) raum += 26;
  if (/[0-9]/.test(passwort)) raum += 10;
  if (/[^a-zA-Z0-9]/.test(passwort)) raum += 33;
  return raum;
}

/**
 * Entropie in Bits: Länge × log2(Zeichenraum).
 * '1234' → ~13,3 Bits (winzig); 'BlauerDachs42Regenschirm' → ~143 Bits (riesig).
 * @param {string} passwort
 * @returns {number} 0 für leere Eingabe
 */
export function entropieBits(passwort) {
  if (!passwort) return 0;
  return passwort.length * Math.log2(zeichenraum(passwort));
}

/**
 * Wie viele Sekunden braucht der Knack-Computer, um ALLE Kombinationen
 * durchzuprobieren? (2^Bits Versuche bei fester Rate.)
 * @param {number} bits
 * @param {number} [versucheProSekunde]
 * @returns {number} Sekunden
 */
export function knackSekunden(bits, versucheProSekunde = VERSUCHE_PRO_SEKUNDE) {
  return 2 ** bits / versucheProSekunde;
}

/**
 * Anschauliche Knackzeit + Ampel für Kinder (8-12).
 * Stufen: rot (bis 1 Tag), gelb (bis 100 Jahre), grün (darüber).
 * @param {number} bits
 * @returns {{ stufe: 'rot'|'gelb'|'gruen', ampel: string, text: string, sekunden: number }}
 */
export function knackzeitText(bits) {
  const sekunden = knackSekunden(bits);
  const jahre = sekunden / SEKUNDEN_PRO_JAHR;
  if (sekunden < 1) {
    return { stufe: 'rot', ampel: '🔴', sekunden, text: 'Zack – geknackt, bevor du einmal blinzeln kannst! ⚡' };
  }
  if (sekunden < 2 * 3600) {
    return { stufe: 'rot', ampel: '🔴', sekunden, text: 'Eine Schildkröte knackt das beim Mittagsschlaf. 🐢' };
  }
  if (sekunden < 24 * 3600) {
    return { stufe: 'rot', ampel: '🔴', sekunden, text: 'Über Nacht geknackt – morgen früh steht der Account offen. 🌙' };
  }
  if (jahre < 1) {
    return { stufe: 'gelb', ampel: '🟡', sekunden, text: 'Hält Tage bis Monate – vor deinem nächsten Geburtstag ist es geknackt. 📅' };
  }
  if (jahre < 100) {
    return { stufe: 'gelb', ampel: '🟡', sekunden, text: 'Hält ein paar Jahre – aber Computer werden jedes Jahr schneller. ⏳' };
  }
  if (jahre < 1_000_000) {
    return { stufe: 'gruen', ampel: '🟢', sekunden, text: 'Hält Jahrhunderte – länger, als jede Ritterburg steht. 🏰' };
  }
  if (jahre < UNIVERSUM_ALTER_JAHRE) {
    return { stufe: 'gruen', ampel: '🟢', sekunden, text: 'Der Knack-Computer müsste seit den Dinosauriern rechnen. 🦖' };
  }
  return { stufe: 'gruen', ampel: '🟢', sekunden, text: 'Länger, als das Universum alt ist – praktisch unknackbar! 🌌' };
}

/**
 * Baut aus Teilen (Wörter und Zahl) einen Passsatz:
 * Leerraum weg, erster Buchstabe jedes Teils groß, alles aneinander.
 * kombiniere(['blauer', 'dachs', 42, 'regenschirm']) → 'BlauerDachs42Regenschirm'
 * @param {Array<string|number>} teile
 * @returns {string}
 */
export function kombiniere(teile) {
  return teile
    .map((teil) => String(teil).replace(/\s+/g, ''))
    .filter((teil) => teil.length > 0)
    .map((teil) => teil[0].toUpperCase() + teil.slice(1))
    .join('');
}
