// Wörter-Sortierer – reine Logik (ohne DOM), testbar mit node --test.
// Ko-Nutzungs-App für 4-6: Oberbegriffe, Gegensätze, Mehrdeutigkeit.
// Praleska docs/10 (Ko-Nutzung Nr. 12).
//
// Wie die anderen Apps dieses Abschnitts bewusst NICHT auf quiz-kern:
// kein Rekord, keine Punkte, keine Ränge. Richtig und falsch gibt es,
// aber folgenlos und freundlich.
import { mischen } from '../../packages/kinder-ui/js/komponenten.mjs';

/** Höchstens so viele Aufgaben pro Sitzung. */
export const PRO_SESSION = 6;

/** Die drei Sortierungen aus dem Katalog. */
export const TYPEN = ['oberbegriff', 'gegenteil', 'mehrdeutig'];

/** Bis zu `limit` Aufgaben je Sitzung, gemischt und ohne Dubletten. */
export function waehleAufgaben(bank, limit = PRO_SESSION) {
  return mischen(bank).slice(0, limit);
}

/** Die richtige Option einer Gegenteil-Aufgabe. */
export function richtigeOption(aufgabe) {
  return (aufgabe.optionen ?? []).find((o) => o.richtig) ?? null;
}

/** Stimmt die Antwort? Binäre Typen antworten mit 'ja'/'nein'. */
export function istRichtig(aufgabe, antwort) {
  if (aufgabe.typ === 'gegenteil') return Boolean(antwort?.richtig);
  return aufgabe.korrekt === antwort;
}

/**
 * Validiert die Aufgaben. Tragende Regeln: Bei den binären Typen müssen
 * BEIDE Antworten vorkommen – sonst lernt das Kind „immer ja“ statt einer
 * Unterscheidung. Und Gegenteil-Aufgaben brauchen genau eine richtige
 * Option, sonst wäre die Rückmeldung gelogen.
 */
export function pruefeDaten(daten) {
  const fehler = [];
  const aufgaben = daten?.aufgaben;

  if (!Array.isArray(aufgaben) || aufgaben.length < 15) fehler.push('aufgaben: mindestens 15 erwartet');
  if (Array.isArray(aufgaben)) {
    const ids = new Set();
    const bilder = new Set();
    for (const a of aufgaben) {
      const wo = `Aufgabe ${a.id || '?'}`;
      if (!a.id || ids.has(a.id)) fehler.push(`${wo}: id fehlt oder doppelt`);
      ids.add(a.id);
      // Das Emoji ist die EINZIGE Bebilderung des gefragten Dings. Dasselbe
      // Zeichen zweimal hieße: zwei verschiedene Dinge sehen gleich aus.
      for (const bild of [a.emoji, a.zweitEmoji].filter(Boolean)) {
        if (bilder.has(bild)) fehler.push(`${wo}: Zeichen ${bild} steht schon für etwas anderes`);
        bilder.add(bild);
      }
      if (!TYPEN.includes(a.typ)) fehler.push(`${wo}: typ ${a.typ} unbekannt`);
      if (!a.frage || !a.erklaerung || !a.gespraech || !a.emoji) fehler.push(`${wo}: frage/erklaerung/gespraech/emoji fehlt`);
      else if (!a.gespraech.trim().endsWith('?')) fehler.push(`${wo}: Gesprächsimpuls soll eine Frage sein`);
      if (a.typ === 'gegenteil') {
        const optionen = a.optionen;
        if (!Array.isArray(optionen) || optionen.length !== 3) fehler.push(`${wo}: genau 3 Optionen erwartet`);
        else {
          if (optionen.filter((o) => o.richtig).length !== 1) fehler.push(`${wo}: genau EINE richtige Option`);
          const texte = optionen.map((o) => o.text);
          if (new Set(texte).size !== texte.length) fehler.push(`${wo}: doppelter Optionstext`);
        }
      } else if (!['ja', 'nein'].includes(a.korrekt)) {
        fehler.push(`${wo}: korrekt muss ja oder nein sein`);
      }
      if (a.typ === 'mehrdeutig' && (!a.wort || !a.zweitEmoji)) fehler.push(`${wo}: wort/zweitEmoji fehlt`);
    }
    for (const typ of TYPEN) {
      const davon = aufgaben.filter((a) => a.typ === typ);
      if (davon.length < 4) fehler.push(`typ ${typ}: nur ${davon.length} Aufgaben – zu wenig`);
      // Bei den binären Typen müssen beide Antworten vorkommen.
      if (typ !== 'gegenteil' && davon.length) {
        const antworten = new Set(davon.map((a) => a.korrekt));
        if (antworten.size < 2) fehler.push(`typ ${typ}: immer dieselbe Antwort richtig – das Kind lernt „immer ja“`);
      }
    }
  }

  if (!Array.isArray(daten?.schlussIdeen) || daten.schlussIdeen.length < 3) {
    fehler.push('schlussIdeen: mindestens 3 erwartet (die Sitzung endet offline)');
  }
  return fehler;
}
