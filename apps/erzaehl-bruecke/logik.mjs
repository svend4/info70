// Erzähl-Brücke: reine Logik (ohne DOM), testbar. Baut ein Erzähl-Gerüst aus
// Held + Ort + Problem und der vier-stufigen „Erzähl-Treppe“. Das Kind erzählt
// mündlich – die App liefert nur das Gerüst, NICHTS wird aufgenommen oder
// gespeichert. Injizierbarer Zufall (Muster geschichten-werkstatt). Praleska
// docs/10 (Top-30 Nr. 19). Alle Bausteine sind Eigenproduktion.

const zufall = (liste) => liste[Math.floor(Math.random() * liste.length)];

/** Prüft die Baustein-Bank. Liefert Fehlerliste (leer = gültig). */
export function pruefeBausteine(daten) {
  const fehler = [];
  for (const feld of ['helden', 'orte', 'probleme', 'extraImpulse']) {
    if (!Array.isArray(daten?.[feld]) || daten[feld].length < 4) fehler.push(`${feld}: mindestens 4 Einträge`);
  }
  if (!Array.isArray(daten?.treppe) || daten.treppe.length !== 4) fehler.push('treppe braucht genau 4 Stufen');
  for (const s of daten?.treppe ?? []) {
    if (!s.titel || !s.impuls) fehler.push(`Treppe ${s.id}: titel/impuls fehlt`);
  }
  const reihenfolge = (daten?.treppe ?? []).map((s) => s.id).join(',');
  if (reihenfolge !== 'anfang,los,aber,ende') fehler.push('treppe: Reihenfolge anfang, los, aber, ende');
  if (!/nichts[^.]*aufgenommen|kein Aufnehmen|keine Aufnahme/i.test(daten?.hinweis ?? '')) fehler.push('hinweis: „nichts wird aufgenommen“ fehlt');
  if (!Array.isArray(daten?.weilSaetze) || daten.weilSaetze.length < 4) fehler.push('weilSaetze: mindestens 4 Einträge');
  for (const satz of daten?.weilSaetze ?? []) {
    if (!/\bweil …$/.test(satz)) fehler.push(`weilSaetze: „${satz}“ endet nicht auf „weil …“`);
  }
  return fehler;
}

/**
 * Wählt Held, Ort und Problem (injizierbarer Wähler für Testbarkeit).
 * @returns {{held: string, ort: string, problem: string}}
 */
export function waehleElemente(daten, waehle = zufall) {
  return {
    held: waehle(daten.helden),
    ort: waehle(daten.orte),
    problem: waehle(daten.probleme),
  };
}

/** Einleitungssatz aus den Elementen (das Kind erzählt selbst weiter). */
export function startSatz(elemente) {
  return `Es war einmal ${elemente.held} ${elemente.ort}. Und ${elemente.problem}.`;
}

/**
 * Baut das komplette Erzähl-Gerüst: Startsatz + die vier Treppenstufen mit
 * ihren Impulsen. Reines Anzeige-Objekt, keine fertige Geschichte.
 */
export function baueGeruest(daten, elemente) {
  return {
    start: startSatz(elemente),
    stufen: daten.treppe.map((s) => ({ ...s })),
  };
}

/**
 * Weil-Satz-Anstoß Nummer n, zyklisch durch die Liste. Ohne Zufall: der Anstoß
 * endet auf „weil …“, das Kind ergänzt den Grund.
 */
export function weilSatz(daten, nummer) {
  return daten.weilSaetze[nummer % daten.weilSaetze.length];
}
