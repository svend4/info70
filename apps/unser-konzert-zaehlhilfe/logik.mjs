// Unser Konzert – Zählhilfe für die Fachkraft: reine Logik ohne DOM, damit sie
// testbar ist.
//
// Die Fachkraft sammelt Vorschläge für Lieder, Tänze und Festprogramme für ein
// Kita-Fest und zählt je Vorschlag, wie viele Handzeichen gezeigt wurden. Gezählt
// wird je Vorschlag, nie je Kind. Eine Summe über alle Vorschläge gibt es nicht.
// Die Programmliste ordnet nach der Zählung und zeigt nur die Titel.

/** Höchstens so viele Vorschläge. */
export const MAX_VORSCHLAEGE = 12;

/** Höchstens so viele Zeichen im Titel. */
export const MAX_TITEL_ZEICHEN = 60;

/** Arten der Vorschläge (Eigenentwurf). */
export const ARTEN = Object.freeze([
  Object.freeze({ id: 'lied', name: 'Lied' }),
  Object.freeze({ id: 'tanz', name: 'Tanz' }),
  Object.freeze({ id: 'festprogramm', name: 'Festprogramm' }),
]);

/** Die Art, die beim Öffnen der Seite vorgewählt ist. */
export const STANDARD_ART = 'lied';

/** Name der Textdatei beim Herunterladen der Programmliste. */
export const DATEI_NAME = 'programmliste-unser-konzert.txt';

/** Alle festen Texte der Oberfläche. Eigenentwurf, sofern nicht anders vermerkt. */
export const TEXTE = Object.freeze({
  titel: 'Unser Konzert – Zählhilfe für die Fachkraft',
  untertitel: 'Vorschläge für Lieder und Tänze für ein Kita-Fest sammeln und Handzeichen je Vorschlag zählen. Keine Namen, nichts wird gespeichert.',
  hinweisTitel: 'Bitte vor dem Zählen lesen',
  hinweis: 'Ob Kinder mitentscheiden, entscheidet der Träger bzw. das Team. Das Werkzeug hilft nur nach einer Abstimmung in der Gruppe. Handzeichen sind für die Gruppe sichtbar, die Abstimmung ist also offen. Die Zählung ordnet keine Stimme einem Kind zu und hält keine Namen fest.',
  eigenentwurf: 'Eigenentwurf',
  titelFeld: 'Titel des Vorschlags',
  titelHinweis: 'Nur der Titel, höchstens 60 Zeichen. Keine Namen.',
  artFeld: 'Art des Vorschlags (Eigenentwurf)',
  zaehlTitel: 'Vorschläge zählen',
  zaehlHilfe: 'Tippen Sie auf + für jedes Handzeichen zu einem Vorschlag. Mit − nehmen Sie eines weg. Die Zählung geht nie unter null.',
  zaehlLeer: 'Noch keine Vorschläge. Oben einen Titel eintragen.',
  programmTitel: 'Programmliste',
  programmHilfe: 'Die Titel stehen in der Reihenfolge der Handzeichen. Bei Gleichstand gilt die Reihenfolge der Eingabe. Auf der Liste stehen keine Zahlen.',
  programmLeer: 'Die Programmliste ist noch leer.',
  zuruecksetzenFrage: 'Alle Handzeichen auf null setzen? Die Vorschläge bleiben erhalten.',
  zuruecksetzenJa: 'Ja, Zählung zurücksetzen',
  abbrechen: 'Abbrechen',
  anregungenTitel: 'Anregungen (keine Vorgaben)',
  anregungenHilfe: 'Sinngemäß aus der Quelle Praleska übernommen (umformuliert), als Anregung und nicht als Vorgabe.',
  fussText: 'Werkzeug für Fachkräfte · ohne Konto · nichts wird gespeichert · Eigenentwurf',
  impressum: 'Impressum & Datenschutz',
});

/** Meldungen zum Formular, je Grund. */
export const FEHLER_TEXTE = Object.freeze({
  leer: 'Bitte einen Titel eintragen.',
  'zu-lang': `Der Titel ist zu lang. Höchstens ${MAX_TITEL_ZEICHEN} Zeichen.`,
  doppelt: 'Diesen Titel gibt es schon in der Liste.',
  art: 'Bitte eine Art wählen: Lied, Tanz oder Festprogramm.',
  voll: `Die Liste ist voll. Mehr als ${MAX_VORSCHLAEGE} Vorschläge gehen nicht.`,
});

/** Texte der Druckbögen. Auf den Bögen stehen keine Zahlen, keine Kästchen und keine Zeile für einen Namen. */
export const BOGEN_TEXTE = Object.freeze({
  zaehlbogen: Object.freeze({
    titel: 'Zählbogen Unser Konzert',
    hinweise: Object.freeze([
      'Vorschläge von Hand eintragen. Handzeichen als Striche festhalten.',
      'Nur nach einer Abstimmung in der Gruppe nutzen. Keine Namen auf dem Blatt.',
      'Die Zählung ordnet keine Stimme einem Kind zu.',
    ]),
  }),
  programm: Object.freeze({
    titel: 'Programmliste Unser Konzert',
    hinweis: 'Die Titel in der Reihenfolge der Handzeichen. Bei Gleichstand gilt die Reihenfolge der Eingabe.',
    fuss: 'Eigenentwurf. Keine Namen auf dem Blatt.',
  }),
});

/**
 * Anregungen aus der Quelle (Praleska, Volltext). Als Anregung gekennzeichnet,
 * nicht als Vorgabe. Der Text ist umformuliert, kein Zitat.
 */
export const ANREGUNGEN = Object.freeze([
  Object.freeze({
    seite: 262,
    text: 'Ein Repertoire der Lieblingslieder aufbauen, für die Gruppe und für kleinere Gruppen darin.',
  }),
  Object.freeze({
    seite: 265,
    text: 'Besonders geliebte Tänze im Repertoire sammeln.',
  }),
  Object.freeze({
    seite: 272,
    text: 'Feste wie Neujahr und der 8. März; Unterhaltungen etwa ein- bis zweimal im Monat, im Sommer wöchentlich.',
  }),
]);

/** Gehört die Kennung zu einer der drei Arten? */
export function istGueltigeArt(id) {
  return ARTEN.some((art) => art.id === id);
}

/** Anzeigename einer Art, z. B. "Lied". Unbekannte Kennung ergibt "". */
export function artName(id) {
  return ARTEN.find((art) => art.id === id)?.name ?? '';
}

/**
 * Darf bei dieser Anzahl noch ein Vorschlag dazukommen?
 * @param {number} anzahl
 */
export function darfHinzugefuegtWerden(anzahl) {
  return Number.isInteger(anzahl) && anzahl >= 0 && anzahl < MAX_VORSCHLAEGE;
}

/**
 * Prüft den Titel. Nur Leerraum am Rand fällt weg, ein Titel muss Text haben.
 * Die Prüfung kann Namen nicht erkennen; dafür steht der Hinweis am Feld.
 * @param {unknown} roh
 * @param {{titel: string}[]} [vorhandene]
 * @returns {{ok: true, titel: string} | {ok: false, grund: 'leer' | 'zu-lang' | 'doppelt'}}
 */
export function pruefeTitel(roh, vorhandene = []) {
  const titel = typeof roh === 'string' ? roh.normalize('NFC').replace(/\s+/g, ' ').trim() : '';
  if (titel === '' || !/[\p{L}\p{N}]/u.test(titel)) return { ok: false, grund: 'leer' };
  if ([...titel].length > MAX_TITEL_ZEICHEN) return { ok: false, grund: 'zu-lang' };
  const schluessel = titel.toLocaleLowerCase('de-DE');
  if (vorhandene.some((v) => v.titel.toLocaleLowerCase('de-DE') === schluessel)) {
    return { ok: false, grund: 'doppelt' };
  }
  return { ok: true, titel };
}

/**
 * Legt einen neuen Vorschlag an, wenn Titel, Art und Platz stimmen.
 * Der Eintrag beginnt ohne Handzeichen. Die Kennung vergibt die Seite.
 * @param {unknown} roh Titel aus dem Feld
 * @param {string} art Kennung der Art
 * @param {{titel: string}[]} [vorhandene]
 * @returns {{ok: true, eintrag: {titel: string, art: string, handzeichen: number}}
 *   | {ok: false, grund: 'voll' | 'leer' | 'zu-lang' | 'doppelt' | 'art'}}
 */
export function neuerVorschlag(roh, art, vorhandene = []) {
  if (!darfHinzugefuegtWerden(vorhandene.length)) return { ok: false, grund: 'voll' };
  const titel = pruefeTitel(roh, vorhandene);
  if (!titel.ok) return titel;
  if (!istGueltigeArt(art)) return { ok: false, grund: 'art' };
  return { ok: true, eintrag: { titel: titel.titel, art, handzeichen: 0 } };
}

/**
 * Ein Handzeichen mehr (richtung > 0) oder weniger (richtung < 0).
 * Die Zählung wird nie negativ: unter null bleibt sie bei null.
 * @param {number} anzahl
 * @param {number} richtung
 * @returns {number}
 */
export function zaehleHandzeichen(anzahl, richtung) {
  const schritt = richtung < 0 ? -1 : 1;
  return Math.max(0, anzahl + schritt);
}

/** Anzeige der Zählung je Vorschlag, z. B. "Handzeichen: 3". */
export function zaehlText(anzahl) {
  return `Handzeichen: ${anzahl}`;
}

/**
 * Reihenfolge der Programmliste: nach Handzeichen absteigend, bei Gleichstand
 * in der Reihenfolge der Eingabe. Zurück kommen nur die Titel, ohne Zahlen.
 * @param {{titel: string, handzeichen: number}[]} liste
 * @returns {string[]}
 */
export function programmTitel(liste) {
  return liste
    .map((eintrag, reihenfolge) => ({ eintrag, reihenfolge }))
    .sort((a, b) => (b.eintrag.handzeichen - a.eintrag.handzeichen) || (a.reihenfolge - b.reihenfolge))
    .map(({ eintrag }) => eintrag.titel);
}

/**
 * Inhalt der Textdatei: eine Kopfzeile, eine Leerzeile, dann je Zeile ein Titel.
 * Keine Zahlen, keine Stimmen, keine Angaben zu Kindern.
 * @param {{titel: string, handzeichen: number}[]} liste
 * @returns {string}
 */
export function programmTextdatei(liste) {
  return ['Programmliste: Unser Konzert', '', ...programmTitel(liste), ''].join('\n');
}

/**
 * Die leeren Zeilen des Zählbogens. Jede Zeile hat ein Feld für den Titel und
 * ein Feld für die Striche, beide ohne Inhalt.
 * @returns {{titel: string, strich: string}[]}
 */
export function zaehlbogenZeilen() {
  return Array.from({ length: MAX_VORSCHLAEGE }, () => ({ titel: '', strich: '' }));
}
