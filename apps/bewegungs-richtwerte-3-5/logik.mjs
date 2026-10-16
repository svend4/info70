// Bewegungs-Richtwerte 3–5 – reine Logik, ohne DOM.
// Praleska docs/10, Kita-Abschnitt, Nr. 83. Quelle: Gruppe „Почемучки“, Abschnitt
// „Развитие движений“, S. 128–134. Angaben mit Maß stehen in den Aufgabenbeschreibungen je
// Lebensjahr (viertes S. 128–130, fünftes S. 131–133).
//
// TRAGENDE ENTSCHEIDUNG 1: RICHTWERTE, KEINE NORM.
// Der Text beschreibt Bewegungsaufgaben mit Maß. Er sagt nicht, dass jedes Kind sie
// erreichen soll. Die Texte dürfen keine Pflicht- oder Normsprache enthalten.
//
// TRAGENDE ENTSCHEIDUNG 2: KEIN BEWERTEN, KEIN BEOBACHTUNGSBOGEN ÜBER KINDER.
// Der Katalog wollte einen Kriterien-Check und einen Bericht-Export für einzelne
// Kinder. Das wäre eine Bewertung einzelner Kinder und wird hier nicht gebaut.
//
// TRAGENDE ENTSCHEIDUNG 3: „BALANCIEREN“ IST KEIN MASS.
// Der Text nennt Übungen im Gleichgewicht (S. 132–133), aber keine messbare Größe.
//
// Politik docs/02: keine externen Anfragen, KEIN localStorage.

export const EINTRAG_SCHLUESSEL = Object.freeze(['id', 'jahr', 'art', 'text', 'zitat', 'seite']);
export const ARTEN = Object.freeze(['Laufen', 'Springen', 'Kriechen und Klettern', 'Werfen, Rollen, Fangen']);
const KINDER_FELDER = Object.freeze(['name', 'vorname', 'kind', 'kinder', 'protokoll', 'verlauf', 'beobachtung', 'notiz', 'geburtstag', 'alter', 'bewertung', 'ergebnis', 'kriterium']);
const NORM_SPRACHE = /\bmuss\b|\bsoll jedes\b|\bNorm erreichen\b|\bPflicht\b|\bjedes Kind\b/i;
const seiteOk = (s) => typeof s === 'string' && /^S\. 1(2[89]|3[0-4])$/.test(s);
const nichtLeer = (s) => typeof s === 'string' && s.trim().length > 0;

function schluesselIn(o, acc = []) {
  if (Array.isArray(o)) o.forEach((x) => schluesselIn(x, acc));
  else if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) { acc.push(k); schluesselIn(v, acc); }
  return acc;
}

/** Die Einträge eines Lebensjahres und einer Art, in der Reihenfolge der Datei. */
export function eintraegeFuer(daten, { jahr = null, art = null } = {}) {
  return daten.eintraege.filter((e) => (jahr === null || e.jahr === jahr) && (art === null || e.art === art));
}

/** Prüft den Datensatz. Liefert Fehler; leer heißt gültig. */
export function pruefeDaten(daten) {
  const fehler = [];
  if (!/keine Norm/.test(daten?.hinweis ?? '')) fehler.push('der Hinweis muss sagen, dass die Angaben keine Norm sind');
  if (!/keine Bewertung/.test(daten?.hinweis ?? '')) fehler.push('der Hinweis muss sagen, dass keine einzelnen Kinder bewertet werden');
  if (!/Norm/.test(daten?.quelle?.abweichung ?? '') || !/Kriterien/.test(daten?.quelle?.abweichung ?? '')) {
    fehler.push('quelle.abweichung muss Norm und Kriterien-Check als Abweichung nennen');
  }
  for (const s of schluesselIn(daten)) {
    if (KINDER_FELDER.includes(s.toLowerCase())) fehler.push(`das Feld „${s}“ sieht nach Angaben über ein Kind aus`);
  }
  if (!Array.isArray(daten?.eintraege) || daten.eintraege.length < 20) {
    fehler.push(`${daten?.eintraege?.length ?? 0} Einträge – es sollen die Angaben mit Maß der Quelle sein`);
  }
  const ids = (daten?.eintraege ?? []).map((e) => e.id);
  if (new Set(ids).size !== ids.length) fehler.push('doppelte Kennungen');
  for (const e of daten?.eintraege ?? []) {
    for (const s of Object.keys(e)) if (!EINTRAG_SCHLUESSEL.includes(s)) fehler.push(`${e.id}: unbekanntes Feld „${s}“`);
    if (![4, 5].includes(e.jahr)) fehler.push(`${e.id}: Lebensjahr muss 4 oder 5 sein`);
    if (!ARTEN.includes(e.art)) fehler.push(`${e.id}: unbekannte Bewegungsart „${e.art}“`);
    if (!seiteOk(e.seite)) fehler.push(`${e.id}: Seitenangabe „${e.seite}“ liegt außerhalb von S. 128–134`);
    if (!nichtLeer(e.zitat) || e.zitat.length < 10) fehler.push(`${e.id}: russischer Wortlaut fehlt oder ist zu kurz`);
    if (!nichtLeer(e.text)) fehler.push(`${e.id}: Text fehlt`);
    if (NORM_SPRACHE.test(e.text ?? '')) fehler.push(`${e.id}: Normsprache im Text („${e.text}“)`);
    if (/Balancieren|Gleichgewicht/i.test(e.art + ' ' + e.text)) fehler.push(`${e.id}: Balancieren hat keine messbare Größe in der Quelle`);
  }
  if (NORM_SPRACHE.test(daten?.hinweis ?? '')) fehler.push('der Hinweis enthält Normsprache');
  if (daten?.quelle?.geprueft !== true) fehler.push('quelle.geprueft ist nicht true');
  return fehler;
}
