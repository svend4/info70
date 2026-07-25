// Dinge des Alltags – reine Logik (ohne DOM), testbar mit node --test.
// Ko-Nutzungs-App für 3-5: harte Sitzungsgrenze, keine Punkte, kein Rekord.
// Praleska docs/10 (Ko-Nutzung Nr. 2).
//
// Bewusst NICHT auf quiz-kern gebaut: Der Motor bringt Punkte, Rekord im
// localStorage und Ränge mit. Für Dreijährige, die noch nicht lesen, wäre
// das ein Wettbewerb um eine Zahl, die sie nicht deuten können. Richtig und
// falsch gibt es hier trotzdem – das sind Sachfragen –, aber freundlich und
// folgenlos, und nach jeder Antwort steht ein Gesprächsimpuls für den
// Erwachsenen. Das Gespräch ist der Lernstoff.
import { mischen } from '../../packages/kinder-ui/js/komponenten.mjs';

/** Höchstens so viele Aufgaben pro Sitzung (BZgA: sparsame Bildschirmzeit ab 3). */
export const PRO_SESSION = 6;

/** Die Aufgabentypen, die der Katalog verlangt. */
export const TYPEN = ['kategorie', 'teil', 'material', 'funktion', 'gemacht', 'fahrzeug'];

/** Bis zu `limit` Aufgaben für eine Sitzung, gemischt und ohne Dubletten. */
export function waehleAufgaben(bank, limit = PRO_SESSION) {
  return mischen(bank).slice(0, limit);
}

/** Die richtige Option einer Aufgabe. */
export function richtigeOption(aufgabe) {
  return aufgabe.optionen.find((o) => o.richtig) ?? null;
}

/**
 * Validiert die Aufgaben. Tragende Regeln: genau eine richtige Option je
 * Aufgabe (sonst wäre die Rückmeldung gelogen), jede Aufgabe hat einen
 * Gesprächsimpuls in Frageform (er soll ein Gespräch öffnen, nicht es
 * beenden), und die Sortierfrage „gemacht oder gewachsen“ hat genau die
 * zwei Antworten, um die es geht.
 */
export function pruefeDaten(daten) {
  const fehler = [];
  const aufgaben = daten?.aufgaben;

  if (!Array.isArray(aufgaben) || aufgaben.length < 18) fehler.push('aufgaben: mindestens 18 erwartet');
  if (Array.isArray(aufgaben)) {
    const ids = new Set();
    for (const a of aufgaben) {
      const wo = `Aufgabe ${a.id || '?'}`;
      if (!a.id || ids.has(a.id)) fehler.push(`${wo}: id fehlt oder doppelt`);
      ids.add(a.id);
      if (!a.frage || !a.erklaerung || !a.gespraech) fehler.push(`${wo}: frage/erklaerung/gespraech fehlt`);
      else if (!a.gespraech.trim().endsWith('?') && !a.gespraech.includes(':')) {
        fehler.push(`${wo}: Gesprächsimpuls soll eine Frage oder Aufforderung sein`);
      }
      if (!TYPEN.includes(a.typ)) fehler.push(`${wo}: typ ${a.typ} unbekannt`);
      const optionen = a.optionen;
      if (!Array.isArray(optionen) || optionen.length < 2 || optionen.length > 3) {
        fehler.push(`${wo}: 2 oder 3 Optionen erwartet`);
        continue;
      }
      if (optionen.filter((o) => o.richtig).length !== 1) fehler.push(`${wo}: genau EINE richtige Option`);
      if (optionen.some((o) => !o.emoji || !o.text)) fehler.push(`${wo}: emoji/text fehlt`);
      const texte = optionen.map((o) => o.text);
      if (new Set(texte).size !== texte.length) fehler.push(`${wo}: doppelter Optionstext`);
      if (a.typ === 'gemacht') {
        if (optionen.length !== 2) fehler.push(`${wo}: „gemacht oder gewachsen“ braucht genau 2 Optionen`);
        const alle = texte.join(' ');
        if (!/gemacht/.test(alle) || !/[Gg]ewachsen/.test(alle)) {
          fehler.push(`${wo}: es müssen „gemacht“ und „gewachsen“ zur Wahl stehen`);
        }
      }
    }
    for (const typ of TYPEN) {
      if (!aufgaben.some((a) => a.typ === typ)) fehler.push(`typ ${typ}: keine einzige Aufgabe`);
    }
    // Beide Antworten müssen bei „gemacht“ vorkommen, sonst lernt das Kind
    // eine Klopfregel statt einer Unterscheidung.
    const gemacht = aufgaben.filter((a) => a.typ === 'gemacht');
    const loesungen = new Set(gemacht.map((a) => richtigeOption(a)?.text));
    if (gemacht.length && loesungen.size < 2) fehler.push('gemacht: immer dieselbe Antwort richtig');
  }

  if (!Array.isArray(daten?.schlussIdeen) || daten.schlussIdeen.length < 3) {
    fehler.push('schlussIdeen: mindestens 3 erwartet (die Sitzung endet offline)');
  }
  return fehler;
}
