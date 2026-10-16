// Spielbegleiter: Vom Hantieren zum Rollenspiel – reine Logik, ohne DOM.
// Praleska docs/10, Kita-Abschnitt, Nr. 81. Quelle: Gruppe „Почемучки“ (S. 6, S. 103),
// Übergang und Gruppengröße (S. 104), Aufgaben Rollenspiel (S. 145–146).
//
// TRAGENDE ENTSCHEIDUNG 1: DIE AUFGABEN SIND DIE DER QUELLE, FÜR DIE FACHKRAFT.
// S. 145–146 formulieren „Задачи“ für den Erzieher. Der Katalog nannte Spielideen je
// Entwicklungsschritt; die stehen nicht im Text und werden hier nicht erfunden.
//
// TRAGENDE ENTSCHEIDUNG 2: KEINE VERLAUFSDOKUMENTATION, KEIN BEOBACHTEN EINZELNER KINDER.
// Die Quelle nennt keine Dokumentation des Spielverlaufs. Der Diagnoseteil (S. 146)
// betrifft das Erkennen einzelner Kinder und wird nicht übernommen.
//
// Politik docs/02: keine externen Anfragen, KEIN localStorage.

const AUFGABE_SCHLUESSEL = Object.freeze(['id', 'text', 'quelle', 'zitat']);
const FAKT_SCHLUESSEL = Object.freeze(['id', 'text', 'quelle', 'zitat']);

/**
 * Felder, die nach Angaben über ein Kind aussehen. Exakte Namen und Wortteile, damit auch
 * Varianten wie „kindername“ oder „notizen“ auffallen. „alter“ nur exakt, weil „altersBereich“
 * ein harmloses Feld ist.
 */
const KINDER_EXAKT = Object.freeze(['name', 'vorname', 'kind', 'kinder', 'alter', 'protokoll', 'verlauf', 'beobachtung', 'notiz', 'notizen', 'geburtstag', 'geschlecht', 'diagnose', 'bewertung', 'ergebnis']);
const KINDER_TEIL = Object.freeze(['kindername', 'kinder', 'notiz', 'beobacht', 'geburt', 'geschlecht', 'protokoll', 'verlauf', 'diagnos', 'bewert']);
/** Ein Muster im Wert, das wie ein Eintrag über ein Kind aussieht („Name: Mia“). */
const KINDER_WERT = /\b(Name|Vorname|Kindername|Geburtsdatum|Notiz|Beobachtung)\s*:/i;
const istKinderFeld = (s) => { const k = s.toLowerCase(); return KINDER_EXAKT.includes(k) || KINDER_TEIL.some((t) => k.includes(t)); };
function alleTexte(o, acc = []) {
  if (Array.isArray(o)) o.forEach((x) => alleTexte(x, acc));
  else if (typeof o === 'string') acc.push(o);
  else if (o && typeof o === 'object') Object.values(o).forEach((v) => alleTexte(v, acc));
  return acc;
}
const seiteOk = (s) => typeof s === 'string' && /^S\. \d+(–\d+)?$/.test(s);
const nichtLeer = (s) => typeof s === 'string' && s.trim().length > 0;

function schluesselIn(o, acc = []) {
  if (Array.isArray(o)) o.forEach((x) => schluesselIn(x, acc));
  else if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) { acc.push(k); schluesselIn(v, acc); }
  return acc;
}

/** Eine Aufgabe nach Kennung. */
export function aufgabeVon(daten, id) {
  return daten.aufgaben.find((a) => a.id === id) ?? null;
}

/** Die Karten: jede Aufgabe ist eine Karte; Reihenfolge der Datei. */
export function kartenFuer(daten) {
  return daten.aufgaben;
}

/**
 * Prüft den Datensatz. Liefert Fehler; leer heißt gültig.
 */
export function pruefeDaten(daten) {
  const fehler = [];
  if (!/nicht enthalten/.test(daten?.hinweis ?? '')) fehler.push('der Hinweis muss sagen, dass Spielideen und Verlaufsdokumentation nicht enthalten sind');
  if (!/Verlaufsdokumentation/.test(daten?.quelle?.abweichung ?? '')) fehler.push('quelle.abweichung muss die Verlaufsdokumentation als Abweichung nennen');
  for (const s of schluesselIn(daten)) {
    if (istKinderFeld(s)) fehler.push(`das Feld „${s}“ sieht nach Angaben über ein Kind aus`);
  }
  for (const t of alleTexte(daten)) {
    if (KINDER_WERT.test(t)) fehler.push(`ein Text enthält einen Eintrag über ein Kind („${t.slice(0, 40)}…“)`);
  }
  if (!Array.isArray(daten?.aufgaben) || daten.aufgaben.length !== 7) {
    fehler.push(`${daten?.aufgaben?.length ?? 0} Aufgaben – die Quelle nennt sieben auf S. 145–146`);
  }
  const ids = (daten?.aufgaben ?? []).map((a) => a.id);
  if (new Set(ids).size !== ids.length) fehler.push('doppelte Aufgaben-Kennungen');
  for (const a of daten?.aufgaben ?? []) {
    for (const s of Object.keys(a)) if (!AUFGABE_SCHLUESSEL.includes(s)) fehler.push(`${a.id}: unbekanntes Feld „${s}“`);
    if (!['S. 145', 'S. 146'].includes(a.quelle)) fehler.push(`${a.id}: Quelle muss S. 145 oder S. 146 sein`);
    if (!nichtLeer(a.zitat) || a.zitat.length < 15) fehler.push(`${a.id}: russischer Wortlaut fehlt oder ist zu kurz`);
    if (/Kinder (lernen|sollen lernen)|Lernziel des Kindes/.test(a.text ?? '')) fehler.push(`${a.id}: als Lernziel der Kinder formuliert`);
  }
  if (!Array.isArray(daten?.fakten) || daten.fakten.length !== 3) fehler.push('die Fakten brauchen genau drei Einträge');
  for (const f of daten?.fakten ?? []) {
    for (const s of Object.keys(f)) if (!FAKT_SCHLUESSEL.includes(s)) fehler.push(`${f.id}: unbekanntes Feld „${s}“`);
    if (!seiteOk(f.quelle)) fehler.push(`${f.id}: Seitenangabe „${f.quelle}“ fehlt oder ist falsch`);
    if (!nichtLeer(f.zitat)) fehler.push(`${f.id}: Wortlaut fehlt`);
  }
  const c = daten?.checkliste;
  if (!c || c.eigenentwurf !== true) fehler.push('die Checkliste ist als Eigenentwurf zu markieren');
  if (!Array.isArray(c?.fragen) || c.fragen.length < 3) fehler.push('die Checkliste braucht mindestens drei Fragen');
  if (daten?.quelle?.geprueft !== true) fehler.push('quelle.geprueft ist nicht true');
  return fehler;
}
