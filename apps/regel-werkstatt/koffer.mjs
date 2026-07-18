// Regel-Werkstatt: reine Logik (ohne DOM), testbar.
// Die Klasse handelt eigene Medienregeln aus: Vorschlaege sammeln, dafuer
// stimmen, Ergebnis als "Klassen-Koffer"-Datei sichern und als Plakat drucken.
// Nach mitmach-arena-Muster: Austausch ueber Dateien statt Server/Konten.

export const KOFFER_ART = 'regel-werkstatt-regeln';
export const KOFFER_VERSION = 1;

/** Regeln nach Stimmen sortiert (meiste zuerst); stabil bei Gleichstand. */
export function sortiere(regeln) {
  return regeln
    .map((r, i) => ({ ...r, i }))
    .sort((a, b) => (b.stimmen - a.stimmen) || (a.i - b.i))
    .map(({ i, ...r }) => r);
}

/** @param {{titel: string, regeln: Array<{text:string, stimmen:number}>}} werkstatt */
export function packeKoffer(werkstatt) {
  return JSON.stringify({
    art: KOFFER_ART,
    version: KOFFER_VERSION,
    titel: werkstatt.titel,
    regeln: werkstatt.regeln.map((r) => ({ text: r.text, stimmen: r.stimmen })),
  }, null, 2);
}

/** Prueft eine eingelesene Koffer-Datei. Leere Liste = gueltig. */
export function pruefeKoffer(inhalt) {
  const fehler = [];
  if (typeof inhalt !== 'object' || inhalt === null) return ['Keine gültige Koffer-Datei'];
  const k = inhalt;
  if (k.art !== KOFFER_ART) fehler.push('Das ist keine Regel-Werkstatt-Datei');
  if (k.version !== KOFFER_VERSION) fehler.push('Unbekannte Datei-Version');
  if (!Array.isArray(k.regeln) || k.regeln.length === 0) {
    fehler.push('Regeln fehlen');
  } else if (!k.regeln.every((r) => r && typeof r.text === 'string' && r.text.length > 0
      && Number.isInteger(r.stimmen) && r.stimmen >= 0)) {
    fehler.push('Regeln sind ungültig');
  }
  return fehler;
}

/**
 * Fuehrt einen importierten Koffer mit den laufenden Regeln zusammen.
 * Gleicher Regeltext -> Stimmen addieren; neue Regeln -> anhaengen.
 * @param {Array<{text:string, stimmen:number}>} laufend
 * @param {{regeln: Array<{text:string, stimmen:number}>}} importiert
 */
export function vereinigeKoffer(laufend, importiert) {
  const ergebnis = laufend.map((r) => ({ ...r }));
  for (const imp of importiert.regeln) {
    const treffer = ergebnis.find((r) => r.text === imp.text);
    if (treffer) treffer.stimmen += imp.stimmen;
    else ergebnis.push({ text: imp.text, stimmen: imp.stimmen });
  }
  return ergebnis;
}

// Startvorschlaege - die Klasse kann sie behalten, aendern oder loeschen.
export const VORSCHLAEGE = Object.freeze([
  'Beim Essen sind Handys aus.',
  'Vor dem Schlafen kein Bildschirm.',
  'Wir fragen, bevor wir ein Foto von jemandem posten.',
  'Bei Problemen im Netz holen wir Hilfe.',
  'Wir sagen niemandem unser Passwort.',
]);
