// Impulskarten für das sujetabbildende Spiel (1–3 Jahre) – reine Logik, ohne DOM.
// Praleska docs/10, Kita-Abschnitt, Nr. 77. Quellen: S. 6–7 (Adressat, Aufgaben),
// S. 44 (Gruppe „Малыши“), S. 68–69 (Aufgaben des Abschnitts), S. 100 und
// S. 99–100 und S. 104 (Altersangaben zum sujetabbildenden und zum Rollenspiel).
//
// TRAGENDE ENTSCHEIDUNG 1: DIE SECHS ZIELE SIND AUFGABEN FÜR DIE FACHKRAFT.
// Die Quelle formuliert sie als „Задачи“ (S. 7 und S. 68–69) – als Aufgaben
// des Erziehers, nicht als Lernziele der Kinder. Der Katalog nannte sie
// Lernziele; das wird hier nicht übernommen.
//
// TRAGENDE ENTSCHEIDUNG 2: KEINE KARTE ENTHÄLT EINE LÖSUNG FÜR DEN ERWACHSENEN.
// Das Kind findet den Ausweg (S. 69). Deshalb kennt das Datenfeld keine
// Lösungsspalte, und die Prüfung lehnt jeden fremden Schlüssel ab.
//
// TRAGENDE ENTSCHEIDUNG 3: DER TITEL „ROLLENSPIEL“ FÄLLT WEG.
// Die Quelle ordnet das sujetabbildende Spiel den Jahren bis zum Ende des
// dritten Lebensjahres zu (Merkmal „к трем годам“, S. 99–100); den Übergang zum
// Rollenspiel nennt sie am Ende des vierten Lebensjahres (S. 104). Eine Kartei für 1–3 Jahre heißt deshalb anders.
//
// Die Karten sind ein Eigenentwurf (außer Karte k06, dem Beispiel auf S. 100).
// Die Lösungsprüfung erkennt häufige Formulierungen, nicht jede Lösung: das steht so in GDD und README.
// Die Zahl 6 gilt nur für die sechs Aufgaben der Quelle, nicht für die Kartei.
// Politik docs/02: keine externen Anfragen, KEIN localStorage.

/** Erlaubte Schlüssel einer Karte. `loesung` gibt es nicht. */
export const KARTEN_SCHLUESSEL = Object.freeze(['id', 'titel', 'figur', 'situation', 'ziel', 'quelle', 'eigenentwurf']);
export const FIGUREN = Object.freeze(['puppe', 'stofftier', 'spielzeug', 'kind']);

/**
 * Muster, die eine Lösung für den Erwachsenen verraten. Das sind die häufigsten Formen,
 * keine Garantie: ob eine Situation eine Lösung verrät, prüft die Fachkraft beim Lesen der Karte.
 */
const LOESUNG_TEXT = /\b(Fachkraft|Erzieher(in)?|Erwachsene[rn]?|Pädagog(e|in)|Sie)\s+(löst|lösen|hilft|helfen|gibt|bringt|zeigt|reicht)\b|\bLösung\b|\bso (geht|macht) (es|man)\b|\bdient als\b|\bnimmt (einen|den|die|das) \w+ als\b|\bman (nimmt|gibt|bringt|legt|nutzt)\b/i;

const nichtLeer = (s) => typeof s === 'string' && s.trim().length > 0;
const seiteOk = (s) => typeof s === 'string' && /^S\. \d+(–\d+)?$/.test(s);

/** Die Aufgaben-Ziele nach Kennung. */
export function zielVon(daten, id) {
  return daten.ziele.find((z) => z.id === id) ?? null;
}

/**
 * Filter für die Anzeige. `ziel` und `figur` sind optional; ohne sie kommen alle Karten.
 * Die Reihenfolge bleibt die der Datei – keine Zufallsreihenfolge, damit das Druckblatt reproduzierbar ist.
 */
export function kartenFuer(daten, { ziel = null, figur = null } = {}) {
  return daten.karten.filter((k) => (ziel === null || k.ziel === ziel) && (figur === null || k.figur === figur));
}

/** Der Quellenhinweis einer Karte, in einem Satz. */
export function quelleTextVon(karte) {
  if (karte.eigenentwurf === true) return karte.quelle ? `Quelle: ${karte.quelle} (Beispiel), sonst Eigenentwurf` : 'Eigenentwurf';
  return `Quelle: ${karte.quelle}`;
}

/**
 * Prüft den Datensatz. Liefert Fehler; leer heißt gültig.
 * Prüft die Struktur, die Quellenangaben und die Regeln oben – nicht den Wortlaut der Quelle.
 */
export function pruefeDaten(daten) {
  const fehler = [];
  if (!nichtLeer(daten?.hinweis) || !/Eigenentwurf/.test(daten.hinweis)) {
    fehler.push('der Hinweis muss sagen, dass die Karten ein Eigenentwurf sind');
  }
  if (!nichtLeer(daten?.titel) || /Rollenspiel/.test(daten.titel)) {
    fehler.push('der Titel nennt „Rollenspiel“ – die Quelle ordnet das für 1–3 Jahre nicht zu (S. 100, S. 104)');
  }
  if (!/sujetabbildend/.test(JSON.stringify(daten?.faktenZumSpiel ?? {}))) {
    fehler.push('faktenZumSpiel nennt das sujetabbildende Spiel nicht');
  }
  if (!/^S\. 99–100$/.test(daten?.faktenZumSpiel?.quelleAlter ?? '') || daten?.faktenZumSpiel?.quelleRollenspiel !== 'S. 104') {
    fehler.push('faktenZumSpiel verweist nicht auf S. 99–100 und S. 104');
  }
  if (!Array.isArray(daten?.ziele) || daten.ziele.length !== 6) {
    fehler.push(`${daten?.ziele?.length ?? 0} Ziele – die Quelle nennt sechs Aufgaben auf S. 68–69`);
  }
  const zielIds = (daten?.ziele ?? []).map((z) => z.id);
  if (new Set(zielIds).size !== zielIds.length) fehler.push('doppelte Ziel-Kennungen');
  for (const z of daten?.ziele ?? []) {
    if (!/^S\. 6[89]$/.test(z.quelle ?? '')) fehler.push(`${z.id}: Quelle muss S. 68 oder S. 69 sein`);
    if (!nichtLeer(z.zitat) || z.zitat.length < 10) fehler.push(`${z.id}: russischer Wortlaut fehlt`);
    if (/Kinder (lernen|sollen lernen)|Lernziel des Kindes/.test(z.text ?? '')) fehler.push(`${z.id}: als Lernziel der Kinder formuliert – es sind Aufgaben für die Fachkraft`);
  }
  if (!Array.isArray(daten?.figuren) || daten.figuren.map((f) => f.id).join() !== FIGUREN.join()) {
    fehler.push('die Figuren weichen von der Liste ab');
  }
  const karten = daten?.karten ?? [];
  if (karten.length < 8) fehler.push(`nur ${karten.length} Karten – mindestens acht`);
  const kartenIds = karten.map((k) => k.id);
  if (new Set(kartenIds).size !== kartenIds.length) fehler.push('doppelte Karten-Kennungen');
  for (const k of karten) {
    const wo = k.id ?? '<ohne id>';
    for (const s of Object.keys(k)) {
      if (!KARTEN_SCHLUESSEL.includes(s)) fehler.push(`${wo}: unbekanntes Feld „${s}“${s === 'loesung' ? ' – eine Karte enthält keine Lösung für den Erwachsenen' : ''}`);
    }
    if (!nichtLeer(k.titel) || /Rollenspiel/.test(k.titel)) fehler.push(`${wo}: Titel fehlt oder nennt „Rollenspiel“`);
    if (LOESUNG_TEXT.test(k.titel ?? '')) fehler.push(`${wo}: der Titel enthält eine Lösung für die Fachkraft`);
    if (!FIGUREN.includes(k.figur)) fehler.push(`${wo}: unbekannte Figur „${k.figur}“`);
    if (!zielIds.includes(k.ziel)) fehler.push(`${wo}: Ziel „${k.ziel}“ gibt es nicht`);
    if (!nichtLeer(k.situation) || k.situation.length < 20) fehler.push(`${wo}: Situation fehlt oder ist zu kurz`);
    if (LOESUNG_TEXT.test(k.situation ?? '')) fehler.push(`${wo}: die Situation enthält eine Lösung für die Fachkraft`);
    if (typeof k.eigenentwurf !== 'boolean') fehler.push(`${wo}: eigenentwurf muss ja oder nein sein`);
    if (k.eigenentwurf === false && !seiteOk(k.quelle)) fehler.push(`${wo}: ohne Eigenentwurf-Markierung braucht die Karte eine Seite der Quelle`);
    if (k.quelle !== undefined && !seiteOk(k.quelle)) fehler.push(`${wo}: Quelle „${k.quelle}“ ist keine Seitenangabe`);
  }
  for (const z of daten?.ziele ?? []) {
    if (!karten.some((k) => k.ziel === z.id)) fehler.push(`${z.id}: keine Karte zu dieser Aufgabe`);
  }
  if (daten?.quelle?.geprueft !== true) fehler.push('quelle.geprueft ist nicht true');
  return fehler;
}
