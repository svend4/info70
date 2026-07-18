// Arbeitsblatt-Werkstatt in Leichter Sprache (für LEHRKRÄFTE / Inklusion,
// docs/09 Ось E). Reine Logik ohne DOM, testbar. Prüft die Leichte-Sprache-
// Regeln (kurze Sätze) und baut den Vorlese-Text eines Arbeitsblatts.

/** Höchstlänge eines Satzes in Leichter Sprache (Faustregel). */
export const MAX_SATZ = 100;

/** Sammelt die Vorlese-Bausteine eines Arbeitsblatts als eine Liste. */
export function vorleseStuecke(blatt) {
  const stuecke = [`Arbeitsblatt: ${blatt.titel}.`];
  for (const b of blatt.begriffe) stuecke.push(`${b.wort}. ${b.erklaerung}`);
  for (const s of blatt.saetze) stuecke.push(s);
  if (blatt.aufgabe) stuecke.push(`Aufgabe. ${blatt.aufgabe}`);
  return stuecke;
}

/** Kompletter Vorlese-Text (für die Vorlesen-Funktion). */
export function vorleseText(blatt) {
  return vorleseStuecke(blatt).join(' ');
}

/**
 * Prüft die Leichte-Sprache-Regeln eines Arbeitsblatts.
 * @returns {string[]} Verstöße (leer = ok)
 */
export function pruefeLeichteSprache(blatt, max = MAX_SATZ) {
  const fehler = [];
  if (!blatt.titel || blatt.titel.length > 30) fehler.push('Titel fehlt oder ist zu lang');
  if (!Array.isArray(blatt.begriffe) || blatt.begriffe.length < 1) fehler.push('mindestens ein Begriff nötig');
  for (const b of blatt.begriffe || []) {
    if (!b.wort || !b.piktogramm || !b.erklaerung) fehler.push(`Begriff unvollständig: ${b.wort || '?'}`);
    if (b.erklaerung && b.erklaerung.length > max * 1.6) fehler.push(`Erklärung zu lang: ${b.wort}`);
  }
  if (!Array.isArray(blatt.saetze) || blatt.saetze.length < 3) fehler.push('zu wenige Sätze');
  for (const s of blatt.saetze || []) {
    if (s.length > max) fehler.push(`Satz zu lang (> ${max}): ${s.slice(0, 30)}…`);
  }
  return fehler;
}

/** Alle Kernbegriffe (kleingeschrieben) über die ganze Sammlung. */
export function alleBegriffe(blaetter) {
  return blaetter.flatMap((b) => b.begriffe.map((x) => x.wort.toLowerCase()));
}
