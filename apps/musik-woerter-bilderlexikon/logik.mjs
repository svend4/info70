// Musik-Wörter-Bilderlexikon: reine Logik ohne DOM, testbar.
// Die Wörter stehen in daten/begriffe.json. Hier wird geprüft, gefiltert, gewählt und als Text für
// Karte, Vorlesen und Druckblatt zusammengesetzt. Kein Zufall und keine Uhr: die Reihenfolge ist die
// der Datei. Keine Speicherung, keine Bewertung eines Kindes (docs/02 Z. 141–146).

export const KATEGORIEN = ['musik', 'orchester', 'instrument'];
export const SPRACHEN = ['de', 'ru', 'uk'];
// Alle Wörter dieser App stehen in der Quelle auf dieser Seite (Bauauftrag CON-10, Abschnitt 1).
export const SEITE_QUELLE = 'S. 260';
export const ANZAHL_FACHWOERTER = 16;
export const ANZAHL_INSTRUMENTE = 7;
// Zitate aus der Quelle sind Begriffe und Titel, höchstens sechs Wörter.
export const MAX_ZITAT_WOERTER = 6;
export const MAX_SAETZE = 2;
export const MAX_SATZ_WOERTER = 25;

// Bilder liegen im Ordner bilder/ dieser App: ein relativer Pfad, kein Schema, kein Laufwerk, kein „..“.
const BILD_PFAD = /^bilder\/[a-z0-9]+(?:-[a-z0-9]+)*\.svg$/;

// Zeichen, die auf einem Druckblatt nicht stehen: Kästchen, Haken, Sterne, Punkte als Zeichen, Pfeile,
// Dingbats, geometrische Formen und Emojis (docs/02 Z. 79–82, Liste in docs/druck-symbole-liste.md).
// Geschrieben mit Escapes, damit die Datei selbst kein solches Zeichen trägt.
export const DRUCKZEICHEN = new RegExp(
  '[\\u2610\\u2612\\u2611\\u2713\\u2714\\u2717\\u2718\\u2705\\u274C\\u2605\\u2606\\u2022\\u25CF\\u25CB\\u25E6\\u00B7\\u2219\\u2027\\u25AA\\u25AB\\u25FE\\u25FD\\u25A0\\u25A1]'
  + '|[\\u2190-\\u22FF\\u2300-\\u27BF\\u2980-\\u29FF\\u2B00-\\u2BFF\\u25A0-\\u25FF\\u30FB]'
  + '|\\p{Extended_Pictographic}',
  'u',
);

// Namenszeile und Tagesfelder auf dem Druckblatt: verboten (docs/02 Z. 79–82).
export const NAMENSZEILE_ODER_TAG = /Name(?!n\b)|Datum|Wochentag|\b(?:Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag|Sonntag)\b|\bTage?\b|_{3,}/i;

// Eine Seitenangabe der Quelle („S. 260“) steht nicht auf dem Blatt (A18-Standard für neue Apps).
const SEITENANGABE = /(?<![\p{L}\p{N}])S\.\s?\d+/u;

/** Prüft einen Bildpfad: nur ein SVG unter bilder/ in dieser App, nichts von außen. */
export function istBildPfad(pfad) {
  return typeof pfad === 'string' && BILD_PFAD.test(pfad);
}

/**
 * Lädt die Begriffe aus dem Inhalt von daten/begriffe.json. Jeder Eintrag braucht Kennung, deutsches Wort,
 * Kategorie, Bild und Erklärung. Bricht ab bei einem Fehler, auch wenn das Bild nicht im Ordner bilder/
 * dieser App liegt (keine externen Medien). Gibt die Einträge in der Reihenfolge der Datei zurück.
 * @param {{ begriffe: object[] }} daten
 * @returns {object[]}
 */
export function ladeBegriffe(daten) {
  const liste = daten?.begriffe;
  if (!Array.isArray(liste) || liste.length === 0) throw new Error('begriffe fehlt oder ist leer');
  const ids = new Set();
  for (const b of liste) {
    const wo = `Begriff ${b?.id ?? '?'}`;
    if (!b || typeof b !== 'object') throw new Error(`${wo}: kein Objekt`);
    for (const feld of ['id', 'de', 'kategorie', 'bild', 'erklaerung']) {
      if (typeof b[feld] !== 'string' || !b[feld].trim()) throw new Error(`${wo}: ${feld} fehlt`);
    }
    if (!KATEGORIEN.includes(b.kategorie)) throw new Error(`${wo}: Kategorie „${b.kategorie}“ ist keine von ${KATEGORIEN.join(', ')}`);
    if (!istBildPfad(b.bild)) throw new Error(`${wo}: Bild „${b.bild}“ liegt nicht unter bilder/ in dieser App`);
    if (ids.has(b.id)) throw new Error(`${wo}: doppelte Kennung`);
    ids.add(b.id);
    for (const sprache of ['ru', 'uk']) {
      if (b[sprache] !== null && typeof b[sprache] !== 'string') throw new Error(`${wo}: ${sprache} ist weder Text noch null`);
    }
  }
  return [...liste];
}

/** Zahl der Wörter eines Textes (durch Leerraum getrennt). */
export function zaehleWoerter(text) {
  return String(text).trim().split(/\s+/).filter(Boolean).length;
}

/** Sätze eines Textes: getrennt hinter Punkt, Ausrufe- oder Fragezeichen. */
export function saetze(text) {
  return String(text).trim().split(/(?<=[.!?])\s+/).filter(Boolean);
}

/**
 * Prüft die Wörter gegen die Regeln des Bauauftrags. Gibt eine Liste von Fehlern zurück; leer heißt in Ordnung.
 * - 16 Fachwörter (nicht Instrument) und 7 Instrumente tragen die Seite der Quelle.
 * - Jeder Eintrag hat entweder eine Seite der Quelle oder eigenentwurf: true.
 * - Jede Erklärung hat höchstens zwei Sätze, jedes Zitat der Quelle höchstens sechs Wörter.
 * @param {{ begriffe: object[] }} daten
 * @returns {string[]}
 */
export function pruefeBegriffe(daten) {
  const fehler = [];
  const liste = daten?.begriffe ?? [];
  const ausQuelle = (b) => b.quelle?.seite === SEITE_QUELLE;
  const fach = liste.filter((b) => ausQuelle(b) && b.kategorie !== 'instrument');
  const instrumente = liste.filter((b) => ausQuelle(b) && b.kategorie === 'instrument');
  if (fach.length !== ANZAHL_FACHWOERTER) {
    fehler.push(`Fachwörter mit ${SEITE_QUELLE}: ${fach.length} statt ${ANZAHL_FACHWOERTER}`);
  }
  if (instrumente.length !== ANZAHL_INSTRUMENTE) {
    fehler.push(`Instrumente mit ${SEITE_QUELLE}: ${instrumente.length} statt ${ANZAHL_INSTRUMENTE}`);
  }
  for (const b of liste) {
    if (!b.quelle?.seite && b.eigenentwurf !== true) {
      fehler.push(b.kategorie === 'instrument'
        ? `${b.id}: Instrument ohne Quelle ohne eigenentwurf: true`
        : `${b.id}: weder quelle.seite noch eigenentwurf: true`);
    }
    const anzahl = saetze(b.erklaerung ?? '').length;
    if (anzahl < 1 || anzahl > MAX_SAETZE) fehler.push(`${b.id}: Erklärung mit ${anzahl} Sätzen, erlaubt sind 1 bis ${MAX_SAETZE}`);
    for (const satz of saetze(b.erklaerung ?? '')) {
      if (zaehleWoerter(satz) > MAX_SATZ_WOERTER) fehler.push(`${b.id}: ein Satz der Erklärung hat mehr als ${MAX_SATZ_WOERTER} Wörter`);
    }
    if (b.quelle?.text && zaehleWoerter(b.quelle.text) > MAX_ZITAT_WOERTER) {
      fehler.push(`${b.id}: Zitat der Quelle hat mehr als ${MAX_ZITAT_WOERTER} Wörter`);
    }
  }
  return fehler;
}

/**
 * Alle Wörter einer Kategorie in der Reihenfolge der Datei.
 * @param {object[]} begriffe
 * @param {string} kategorie
 * @returns {object[]}
 */
export function begriffeFuer(begriffe, kategorie) {
  return begriffe.filter((b) => b.kategorie === kategorie);
}

/**
 * Das Wort mit dieser Kennung oder undefined.
 * @param {object[]} begriffe
 * @param {string} id
 */
export function begriffMitId(begriffe, id) {
  return begriffe.find((b) => b.id === id);
}

/**
 * Das vorige (schritt -1) oder nächste (schritt 1) Wort in derselben Kategorie. Am Ende geht es von vorn weiter,
 * so gibt es keinen toten Knopf.
 * @param {object[]} begriffe
 * @param {string} id
 * @param {number} schritt
 * @returns {object}
 */
export function nachbar(begriffe, id, schritt) {
  const aktuell = begriffMitId(begriffe, id);
  if (!aktuell) throw new RangeError(`Kein Wort mit der Kennung ${id}`);
  const gruppe = begriffeFuer(begriffe, aktuell.kategorie);
  const i = gruppe.indexOf(aktuell);
  return gruppe[(i + schritt + gruppe.length) % gruppe.length];
}

/**
 * Was die Karte eines Wortes zeigt: Wort in der gewählten Sprache, Erklärung (deutsch), Bild.
 * Hat das Wort in dieser Sprache keinen Wert (null), ist wort null. uk ist leer, bis eine Übersetzung geprüft ist.
 * @param {object} begriff
 * @param {'de'|'ru'|'uk'} [sprache]
 * @returns {{ wort: string|null, erklaerung: string, bild: string, sprache: string }}
 */
export function begriffKarte(begriff, sprache = 'de') {
  if (!SPRACHEN.includes(sprache)) throw new RangeError(`Sprache „${sprache}“ ist keine von ${SPRACHEN.join(', ')}`);
  return {
    wort: begriff[sprache] ?? null,
    erklaerung: begriff.erklaerung,
    bild: begriff.bild,
    sprache,
  };
}

/**
 * Prüft ein Druckblatt: kein Zeichen der Sperrliste, kein Emoji, keine Namenszeile, kein Tagesfeld, keine Seitenzahl der Quelle.
 * @param {{ wort: string, erklaerung: string, bildText?: string, thema?: string }} blatt
 * @returns {string[]} Fehler, leer heißt in Ordnung
 */
export function pruefeBlatt(blatt) {
  const fehler = [];
  for (const [feld, text] of Object.entries({ wort: blatt.wort, erklaerung: blatt.erklaerung, bildText: blatt.bildText ?? '', thema: blatt.thema ?? '' })) {
    if (DRUCKZEICHEN.test(text)) fehler.push(`${feld}: Zeichen der Sperrliste oder Emoji`);
    if (NAMENSZEILE_ODER_TAG.test(text)) fehler.push(`${feld}: Namenszeile oder Tagesfeld`);
    if (SEITENANGABE.test(text)) fehler.push(`${feld}: Seitenangabe der Quelle (nicht auf dem Blatt)`);
  }
  return fehler;
}

/**
 * Ein Blatt A4 hoch je Karte mit Wort, Bild und Erklärung. Karten ohne Wort (etwa uk, solange es leer ist) werden
 * übersprungen. Ein Blatt hat keine Namenszeile, kein Datum und keine Seitenzahl; darum trägt es auch keine
 * Pflichtmarkierung (sie gehört nur zu einer Seitenangabe). Bricht ab, wenn ein Text ein verbotenes Zeichen trägt.
 * @param {Array<{ wort: string|null, erklaerung: string, bild: string, bildText?: string, thema?: string }>} karten
 * @returns {Array<{ wort: string, erklaerung: string, bild: string, bildText: string, thema: string }>}
 */
export function druckBlaetter(karten) {
  const blaetter = [];
  for (const k of karten) {
    if (!k || k.wort == null) continue;
    const blatt = {
      wort: k.wort,
      erklaerung: k.erklaerung,
      bild: k.bild,
      bildText: k.bildText ?? '',
      thema: k.thema ?? '',
    };
    const fehler = pruefeBlatt(blatt);
    if (fehler.length) throw new Error(`Blatt „${blatt.wort}“: ${fehler.join('; ')}`);
    blaetter.push(blatt);
  }
  return blaetter;
}

/**
 * Der Text zum Vorlesen: das Wort, dann die Erklärung. Leer, wenn die Karte kein Wort hat.
 * @param {{ wort: string|null, erklaerung: string }} karte
 * @returns {string}
 */
export function vorlesetext(karte) {
  if (karte.wort == null) return '';
  return `${karte.wort}. ${karte.erklaerung}`;
}

// Kyrillische Stücke eines Textes (zum Beispiel Titel der Quelle) bekommen die Sprache ru, damit eine Sprachausgabe sie
// nicht mit einer deutschen Stimme liest. Wörter, die ein Leerzeichen oder ein Gedankenstrich verbindet, bleiben ein Stück.
const KYRILLISCH = /[\u0400-\u04FF]+(?:[\s\u2014-]+[\u0400-\u04FF]+)*/g;

/**
 * Teilt einen Text in Stücke mit und ohne Sprachangabe: kyrillische Stücke tragen lang 'ru', alles andere lang null.
 * @param {string} text
 * @returns {Array<{ text: string, lang: 'ru'|null }>}
 */
export function sprachStuecke(text) {
  const t = String(text);
  const stuecke = [];
  let ab = 0;
  for (const m of t.matchAll(KYRILLISCH)) {
    if (m.index > ab) stuecke.push({ text: t.slice(ab, m.index), lang: null });
    stuecke.push({ text: m[0], lang: 'ru' });
    ab = m.index + m[0].length;
  }
  if (ab < t.length) stuecke.push({ text: t.slice(ab), lang: null });
  return stuecke;
}

/** Setzt {n}, {name} und {liste} in einem Text ein. */
export function fuelle(text, werte = {}) {
  return String(text).replace(/\{(\w+)\}/g, (ganz, schluessel) => (schluessel in werte ? String(werte[schluessel]) : ganz));
}

/** Der Text zum Vorlesen einer Liste: Name der Kategorie, dann die Wörter. */
export function listeVorlesetext(vorlage, name, woerter) {
  return fuelle(vorlage, { name, liste: woerter.join(', ') });
}

/** Der Text zum Vorlesen aller Instrumente: jedes Wort mit seiner Erklärung. */
export function alleVorlesetext(karten) {
  return karten.map(vorlesetext).filter(Boolean).join(' ');
}

// ---------------------------------------------------------------------------------------------
// Auswahl für den Druck. Sie lebt nur im Arbeitsspeicher der Seite und wird nirgends gespeichert.

/**
 * Schaltet ein Wort um. Liefert eine neue Menge; das Original bleibt unverändert.
 * @param {Iterable<string>} auswahl
 * @param {string} id
 * @returns {Set<string>}
 */
export function schalte(auswahl, id) {
  const neu = new Set(auswahl);
  if (neu.has(id)) neu.delete(id);
  else neu.add(id);
  return neu;
}

/** Sind alle Wörter dieser Kategorie gewählt? Eine Kategorie ohne Wörter gilt als nicht gewählt. */
export function alleGewaehlt(auswahl, begriffe, kategorie) {
  const gruppe = begriffeFuer(begriffe, kategorie);
  const gewaehlt = new Set(auswahl);
  return gruppe.length > 0 && gruppe.every((b) => gewaehlt.has(b.id));
}

/**
 * Wählt alle Wörter einer Kategorie, oder wählt sie alle ab, wenn sie schon alle gewählt waren.
 * @returns {Set<string>}
 */
export function schalteKategorie(auswahl, begriffe, kategorie) {
  const ids = begriffeFuer(begriffe, kategorie).map((b) => b.id);
  const neu = new Set(auswahl);
  if (alleGewaehlt(auswahl, begriffe, kategorie)) {
    for (const id of ids) neu.delete(id);
  } else {
    for (const id of ids) neu.add(id);
  }
  return neu;
}

/**
 * Die gewählten Wörter in der Reihenfolge der Datei. Unbekannte Kennungen werden ignoriert, jedes Wort kommt höchstens einmal vor.
 * @param {object[]} begriffe
 * @param {Iterable<string>} auswahl
 * @returns {object[]}
 */
export function gewaehlteBegriffe(begriffe, auswahl) {
  const gewaehlt = new Set(auswahl);
  return begriffe.filter((b) => gewaehlt.has(b.id));
}

/** Druck ist möglich, sobald mindestens eine Karte gewählt ist. */
export function kannDrucken(gewaehlte) {
  return gewaehlte.length > 0;
}

/** Der Satz zur Zahl der gewählten Karten (Zähler des Gewählten, keine Wertung). */
export function gewaehltText(druckTexte, n) {
  if (n === 0) return druckTexte.gewaehltNull;
  if (n === 1) return druckTexte.gewaehltEins;
  return fuelle(druckTexte.gewaehltViele, { n });
}

/**
 * Die Blätter für eine Auswahl, so wie sie gedruckt werden: je gewähltem Wort ein Blatt, in der Reihenfolge der Datei.
 * @param {{ begriffe: object[], kategorien: Array<{ id: string, name: string }> }} daten
 * @param {Iterable<string>} auswahl
 * @param {'de'|'ru'|'uk'} [sprache]
 */
export function blaetterFuer(daten, auswahl, sprache = 'de') {
  const karten = gewaehlteBegriffe(daten.begriffe, auswahl).map((b) => ({
    ...begriffKarte(b, sprache),
    bildText: b.bildText ?? '',
    thema: daten.kategorien.find((k) => k.id === b.kategorie)?.name ?? '',
  }));
  return druckBlaetter(karten);
}

/**
 * Der gesamte Text eines Blattes, so wie er gedruckt wird: Kopf, Thema, Wort, Erklärung, Vermerk.
 * @param {{ wort: string, erklaerung: string, thema: string }} blatt
 * @param {{ titel: string, eigenentwurf: string }} daten
 * @returns {string}
 */
export function blattText(blatt, daten) {
  return [daten.titel, blatt.thema, blatt.wort, blatt.erklaerung, daten.eigenentwurf].filter(Boolean).join('\n');
}
