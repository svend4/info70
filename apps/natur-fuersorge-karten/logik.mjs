// Natur-Fürsorge-Karten – reine Logik, ohne DOM.
// Praleska docs/10, Kita-Abschnitt, Nr. 80. Quelle: Gruppe „Малыши“, Unterabschnitt
// „Труд в природе“, S. 96 (Aufgaben); Altersangabe S. 6 und S. 44.
//
// TRAGENDE ENTSCHEIDUNG 1: DIE VIER ZIELE SIND AUFGABEN FÜR DIE FACHKRAFT.
// Die Quelle formuliert sie als „Задачи“ auf S. 96: Der Erwachsene soll Interesse
// wecken, Freude ermöglichen, zum Selbsttun anregen und den Zeitpunkt erkennen.
//
// TRAGENDE ENTSCHEIDUNG 2: KEIN PROTOKOLL ÜBER EINZELNE KINDER.
// Der Katalog wollte ein Mini-Protokoll „welches Kind welche Handlung selbstständig
// zeigt“. Die Quelle sieht dafür in diesem Abschnitt keine Dokumentation vor, und
// Angaben über einzelne Kinder gehören nicht ins Gerät. Die Prüfung lehnt Felder ab,
// die nach einem Kind aussehen.
//
// TRAGENDE ENTSCHEIDUNG 3: DIE HANDLUNGEN SIND DIE DES TEXTES, DIE ANREGUNGEN EIGEN.
// Gießen, Füttern und Ernten nennt S. 96 als Beispiele; jede Anregung auf einer
// Karte ist als Eigenentwurf markiert.
//
// Politik docs/02: keine externen Anfragen, KEIN localStorage.

const KARTEN_SCHLUESSEL = Object.freeze(['id', 'handlung', 'anregung', 'eigenentwurf']);
const HANDLUNG_SCHLUESSEL = Object.freeze(['id', 'titel', 'beispiel', 'quelle', 'ziel']);
const ZIEL_SCHLUESSEL = Object.freeze(['id', 'text', 'quelle', 'zitat']);
/** Felder, die nach Angaben über ein Kind aussehen. Keines davon darf in den Daten vorkommen. */

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

/** Alle Schlüssel eines Objekts, rekursiv. */
function schluesselIn(o, acc = []) {
  if (Array.isArray(o)) o.forEach((x) => schluesselIn(x, acc));
  else if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) { acc.push(k); schluesselIn(v, acc); }
  return acc;
}

/** Ein Ziel nach Kennung. */
export function zielVon(daten, id) {
  return daten.ziele.find((z) => z.id === id) ?? null;
}

/** Die Karten für eine Handlung oder alle; Reihenfolge der Datei. */
export function kartenFuer(daten, { handlung = null } = {}) {
  return daten.karten.filter((k) => handlung === null || k.handlung === handlung);
}

/** Der Quellenhinweis einer Karte, in einem Satz. */
export function quelleTextVon(daten, karte) {
  const h = daten.handlungen.find((x) => x.id === karte.handlung);
  return `Quelle: ${h?.quelle ?? '–'} · Aufgabe ${daten.ziele.findIndex((z) => z.id === h?.ziel) + 1} · Anregung: Eigenentwurf`;
}

/**
 * Prüft den Datensatz. Liefert Fehler; leer heißt gültig.
 */
export function pruefeDaten(daten) {
  const fehler = [];
  if (!/kein Protokoll/.test(daten?.hinweis ?? '')) fehler.push('der Hinweis muss sagen, dass es kein Protokoll über einzelne Kinder gibt');
  if (!/Protokoll/.test(daten?.quelle?.abweichung ?? '')) fehler.push('quelle.abweichung muss das Protokoll als Abweichung nennen');
  for (const s of schluesselIn(daten)) {
    if (istKinderFeld(s)) fehler.push(`das Feld „${s}“ sieht nach Angaben über ein Kind aus`);
  }
  for (const t of alleTexte(daten)) {
    if (KINDER_WERT.test(t)) fehler.push(`ein Text enthält einen Eintrag über ein Kind („${t.slice(0, 40)}…“)`);
  }
  if (!Array.isArray(daten?.ziele) || daten.ziele.length !== 4) {
    fehler.push(`${daten?.ziele?.length ?? 0} Ziele – die Quelle nennt vier auf S. 96`);
  }
  const zielIds = (daten?.ziele ?? []).map((z) => z.id);
  if (new Set(zielIds).size !== zielIds.length) fehler.push('doppelte Ziel-Kennungen');
  for (const z of daten?.ziele ?? []) {
    for (const s of Object.keys(z)) if (!ZIEL_SCHLUESSEL.includes(s)) fehler.push(`${z.id}: unbekanntes Feld „${s}“`);
    if (z.quelle !== 'S. 96') fehler.push(`${z.id}: Quelle muss S. 96 sein`);
    if (!nichtLeer(z.zitat) || z.zitat.length < 20) fehler.push(`${z.id}: russischer Wortlaut fehlt oder ist zu kurz`);
  }
  const handlungIds = (daten?.handlungen ?? []).map((h) => h.id);
  if (new Set(handlungIds).size !== handlungIds.length) fehler.push('doppelte Handlungs-Kennungen');
  for (const h of daten?.handlungen ?? []) {
    for (const s of Object.keys(h)) if (!HANDLUNG_SCHLUESSEL.includes(s)) fehler.push(`${h.id}: unbekanntes Feld „${s}“`);
    if (!nichtLeer(h.beispiel)) fehler.push(`${h.id}: Beispiel fehlt`);
    if (h.quelle !== 'S. 96') fehler.push(`${h.id}: Quelle muss S. 96 sein`);
    if (!zielIds.includes(h.ziel)) fehler.push(`${h.id}: Ziel „${h.ziel}“ gibt es nicht`);
  }
  const karten = daten?.karten ?? [];
  if (karten.length !== (daten?.handlungen ?? []).length) fehler.push('es muss genau eine Karte je Handlung geben');
  for (const k of karten) {
    for (const s of Object.keys(k)) if (!KARTEN_SCHLUESSEL.includes(s)) fehler.push(`${k.id}: unbekanntes Feld „${s}“`);
    if (!handlungIds.includes(k.handlung)) fehler.push(`${k.id}: Handlung „${k.handlung}“ gibt es nicht`);
    if (!nichtLeer(k.anregung) || k.anregung.length < 30) fehler.push(`${k.id}: Anregung fehlt oder ist zu kurz`);
    if (k.eigenentwurf !== true) fehler.push(`${k.id}: die Anregung ist als Eigenentwurf zu markieren`);
  }
  const c = daten?.checkliste;
  if (!c || c.eigenentwurf !== true) fehler.push('die Checkliste ist als Eigenentwurf zu markieren');
  if (!Array.isArray(c?.fragen) || c.fragen.length < 3) fehler.push('die Checkliste braucht mindestens drei Fragen');
  if (!seiteOk(c?.quelle?.split(',')[0]?.trim() ?? '')) fehler.push('die Checkliste nennt keine Seite der Quelle');
  if (daten?.quelle?.geprueft !== true) fehler.push('quelle.geprueft ist nicht true');
  return fehler;
}
