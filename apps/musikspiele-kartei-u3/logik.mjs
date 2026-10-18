// Musikspiele-Kartei U3 – reine Logik, ohne DOM.
// Praleska docs/10, Kita-Abschnitt, Nr. 78. Quelle: Musik der Gruppe „Малыши“,
// S. 81–86 (Aufgaben und Repertoire-Listen).
//
// TRAGENDE ENTSCHEIDUNG 1: DIE GATTUNGEN SIND EINE ZUSAMMENFASSUNG DER QUELLE.
// Die Namen fassen die Überschriften und Aufgaben der Quelle zusammen (S. 81–86). Vier
// davon (Klangnachahmung, Melodie aus Frage und Antwort, Lied mit Bewegung,
// Tierbewegungen) sind Aufgabenstichworte, keine Überschriften. Die Seiten stimmen;
// die Namen sind eigen gefasst.
//
// TRAGENDE ENTSCHEIDUNG 2: KEINE SUMME.
// Der Katalog nannte „ca. 50“, dann „46“ und „9“. Die Zahl hängt an einer Zählregel
// (Melodienamen, Liedtitel, Quellenangaben), und die Listen enden mit „и др.“. Die
// Kartei zeigt keine Gesamtzahl. `pruefeDaten` lehnt jedes Feld ab, das eine Zahl
// dieser Art trägt.
//
// TRAGENDE ENTSCHEIDUNG 3: NUR TITEL, KEINE TEXTE, KEINE NOTEN, KEINE AUTOREN.
// Ein Beispiel ist ein Titel mit Seite. Lieder-Texte und die Angaben „муз.“ und
// „сл.“ gehören nicht in die Kartei.
//
// TRAGENDE ENTSCHEIDUNG 4: KEIN FILTER NACH DAUER, GRUPPENGRÖßE ODER ORT.
// Die Quelle nennt diese Angaben bei den einzelnen Spielen nicht. Das Feld gibt
// es deshalb nicht.
//
// Politik docs/02: keine externen Anfragen, keine Speicherung.

/** Erlaubte Schlüssel einer Gattung. Keine Dauer, keine Gruppengröße, kein Ort. */
export const GATTUNG_SCHLUESSEL = Object.freeze(['id', 'gattung', 'quelle', 'prinzip', 'beispiele', 'altersHinweis']);
/** Erlaubte Schlüssel eines Beispiels: nur Titel und Seite. */
export const BEISPIEL_SCHLUESSEL = Object.freeze(['titel', 'seite']);
/** Angaben, die die Quelle bei den Spielen nicht macht. */
const VERBOTENE_FELDER = Object.freeze(['dauer', 'gruppe', 'gruppengroesse', 'ort', 'anzahl', 'gesamt', 'summe']);
/**
 * Autoren- und Notenangaben aus den Listen der Quelle. Ohne i-Flag blieb „Муз.“ stehen;
 * die Grenze davor ist „kein Buchstabe“, weil \b für Kyrillisch nicht greift.
 */
const AUTOREN = /(^|[^\p{L}])(муз|сл|обр)\./iu;
/** Eine Summe oder Zählung. „ca.“ endet mit einem Schlusszeichen, daher kein \b dahinter. */
const SUMMEN_TEXT = /(^|[^\p{L}])(ca\.|rund|insgesamt|gesamt)\s*\d+|\d+\s+(Spielprinzipien|Spielformen|Inszenierungsformen|Reigen)\b/iu;

const nichtLeer = (s) => typeof s === 'string' && s.trim().length > 0;
const seiteOk = (s) => typeof s === 'string' && /^S\. \d+(–\d+)?(, S\. \d+(–\d+)?)*$/.test(s);

/** Die Karten einer Gattung, in der Reihenfolge der Datei. */
export function gattungFuer(daten, id) {
  return daten.gattungen.find((g) => g.id === id) ?? null;
}

/** Alle Gattungen oder nur die gewählte. Keine Zufallsreihenfolge, damit der Druck reproduzierbar ist. */
export function kartenFuer(daten, { gattung = null } = {}) {
  return daten.gattungen.filter((g) => gattung === null || g.id === gattung);
}

/** Die festen Zeilen des Druckblatts. Keine Seitenangabe, kein Zeichen, keine Namenszeile. */
export const DRUCK_KOPF = 'Prinzipien: Eigenentwurf. Titel stammen aus der Quelle; Texte und Noten stehen hier nicht.';
/** Die Zeile unter dem Prinzip auf jeder gedruckten Karte. */
export const DRUCK_KARTE_FUSS = 'Prinzip: Eigenentwurf. Titel: Quelle.';
/** Das Alter, wenn die Quelle keines nennt. */
export const ALTER_OHNE_ANGABE = 'nicht angegeben (Eigenentwurf)';

/** Der Quellenhinweis einer Karte, in einem Satz. */
export function quelleTextVon(gattung) {
  return `Quelle: ${gattung.quelle}`;
}

/**
 * Prüft den Datensatz. Liefert Fehler; leer heißt gültig.
 * Prüft die Struktur, die Seitenangaben und die vier Entscheidungen oben – nicht den Wortlaut der Quelle.
 */
export function pruefeDaten(daten) {
  const fehler = [];
  if (!Array.isArray(daten?.gattungen) || daten.gattungen.length < 10) {
    fehler.push(`${daten?.gattungen?.length ?? 0} Gattungen – die Quelle hat mehr Abschnitte`);
  }
  if (!/Eigenentwurf|eigen/.test(daten?.hinweis ?? '')) {
    fehler.push('der Hinweis muss sagen, dass die Formulierung des Prinzips eigen ist');
  }
  if (!/zusammenfass/i.test(daten?.hinweis ?? '')) {
    fehler.push('der Hinweis muss sagen, dass die Gattungsnamen eine Zusammenfassung sind');
  }
  // Autoren- und Summenprüfung über alle angezeigten Texte, nicht nur Titel und Prinzip.
  // quelle.abweichung bleibt aus: dort stehen die Katalogzahlen absichtlich als Gegenbeispiel.
  const angezeigt = [daten?.hinweis, daten?.wasEsIst, daten?.nichtInDerQuelle, daten?.quelle?.werk,
    ...(daten?.gattungen ?? []).flatMap((g) => [g.gattung, g.prinzip, g.altersHinweis ?? '', ...(g.beispiele ?? []).map((b) => b.titel)])];
  for (const t of angezeigt) {
    if (AUTOREN.test(t ?? '')) fehler.push(`„${String(t).slice(0, 40)}…“ enthält eine Autoren- oder Notenangabe`);
    if (SUMMEN_TEXT.test(t ?? '')) fehler.push(`„${String(t).slice(0, 40)}…“ enthält eine Zählung`);
  }
  if (!nichtLeer(daten?.nichtInDerQuelle) || !/Dauer.*Gruppengröße.*Ort|Dauer, Gruppengröße und Ort/.test(daten.nichtInDerQuelle)) {
    fehler.push('nichtInDerQuelle muss sagen, dass Dauer, Gruppengröße und Ort fehlen');
  }
  const ids = (daten?.gattungen ?? []).map((g) => g.id);
  if (new Set(ids).size !== ids.length) fehler.push('doppelte Gattungs-Kennungen');
  for (const g of daten?.gattungen ?? []) {
    const wo = g.id ?? '<ohne id>';
    for (const s of Object.keys(g)) {
      if (!GATTUNG_SCHLUESSEL.includes(s)) {
        fehler.push(`${wo}: unbekanntes Feld „${s}“${VERBOTENE_FELDER.includes(s) ? ' – die Quelle nennt diese Angabe bei den Spielen nicht' : ''}`);
      }
    }
    if (!nichtLeer(g.gattung)) fehler.push(`${wo}: Gattung fehlt`);
    if (!seiteOk(g.quelle)) fehler.push(`${wo}: Seitenangabe „${g.quelle}“ fehlt oder ist falsch`);
    if (!nichtLeer(g.prinzip) || g.prinzip.length < 30) fehler.push(`${wo}: Prinzip fehlt oder ist zu kurz`);
    if (SUMMEN_TEXT.test(g.prinzip ?? '')) fehler.push(`${wo}: das Prinzip enthält eine Zählung`);
    if (!Array.isArray(g.beispiele)) fehler.push(`${wo}: beispiele ist keine Liste`);
    for (const b of g.beispiele ?? []) {
      for (const s of Object.keys(b)) {
        if (!BEISPIEL_SCHLUESSEL.includes(s)) fehler.push(`${wo}: Beispiel mit fremdem Feld „${s}“ – nur Titel und Seite`);
      }
      if (!nichtLeer(b.titel)) fehler.push(`${wo}: Beispiel ohne Titel`);
      if (AUTOREN.test(b.titel ?? '')) fehler.push(`${wo}: „${b.titel}“ enthält eine Autoren- oder Notenangabe`);
      if (!/^S\. \d+$/.test(b.seite ?? '')) fehler.push(`${wo}: Beispiel „${b.titel}“ ohne Seite`);
    }
    if (g.altersHinweis !== null && g.altersHinweis !== undefined && !nichtLeer(g.altersHinweis)) {
      fehler.push(`${wo}: altersHinweis ist leer`);
    }
  }
  if (daten?.quelle?.geprueft !== true) fehler.push('quelle.geprueft ist nicht true');
  if (!/ca\. 50|46|9 Reigen/.test(daten?.quelle?.abweichung ?? '')) {
    fehler.push('quelle.abweichung nennt die Zahlen des Katalogs nicht');
  }
  return fehler;
}
