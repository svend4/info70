// Meine fünf Helfer – reine Logik (ohne DOM), testbar mit node --test.
// Ko-Nutzungs-App für 3-5: die fünf Sinne als „Helfer“.
// Praleska docs/10 (Ko-Nutzung Nr. 4).
//
// Wie dinge-des-alltags bewusst NICHT auf quiz-kern gebaut: kein Rekord,
// keine Punkte, keine Ränge. Die Antwortmöglichkeiten sind immer alle fünf
// Helfer – dadurch verrät die Auswahl nichts, und das Kind sucht wirklich.
import { mischen } from '../../packages/kinder-ui/js/komponenten.mjs';

/** Höchstens so viele Aufgaben pro Sitzung (BZgA: sparsame Bildschirmzeit ab 3). */
export const PRO_SESSION = 5;

export function helferVon(daten, id) {
  return daten.helfer.find((h) => h.id === id) ?? null;
}

/** Bis zu `limit` Aufgaben je Sitzung, ohne Dubletten. */
export function waehleAufgaben(bank, limit = PRO_SESSION) {
  return mischen(bank).slice(0, limit);
}

/**
 * Eine Aufgabe mit Antwortmöglichkeiten. Angeboten werden IMMER alle fünf
 * Helfer, nur in wechselnder Reihenfolge: Eine Vorauswahl wäre schon die
 * halbe Antwort.
 */
export function baueAufgabe(daten, aufgabe, mischenFn = mischen) {
  return {
    aufgabe,
    loesung: helferVon(daten, aufgabe.helfer),
    optionen: mischenFn([...daten.helfer]),
  };
}

export function istRichtig(frage, helferId) {
  return frage.aufgabe.helfer === helferId;
}

/**
 * Validiert die Daten. Tragende Regeln: genau die fünf Sinne, jede Aufgabe
 * zeigt auf einen davon, jeder Helfer kommt auch wirklich als Lösung vor
 * (sonst bliebe einer ungeübt), und der Inklusionsteil trägt seine Regel.
 */
export function pruefeDaten(daten) {
  const fehler = [];
  const { helfer, aufgaben, hilfen, hilfenRegel, schlussIdeen } = daten ?? {};
  const NOETIG = ['augen', 'nase', 'ohren', 'zunge', 'haut'];

  if (!Array.isArray(helfer) || helfer.length !== 5) fehler.push('helfer: genau 5 erwartet');
  if (Array.isArray(helfer)) {
    for (const h of helfer) {
      const wo = `Helfer ${h.id || '?'}`;
      if (!h.name || !h.emoji || !h.kann || !h.pflege || !h.spiel) fehler.push(`${wo}: name/emoji/kann/pflege/spiel fehlt`);
      if (h.spiel && !/[?.!]$/.test(h.spiel.trim())) fehler.push(`${wo}: spiel soll ein ganzer Satz sein`);
    }
    for (const id of NOETIG) {
      if (!helfer.some((h) => h.id === id)) fehler.push(`helfer: ${id} fehlt`);
    }
  }

  if (!Array.isArray(aufgaben) || aufgaben.length < 10) fehler.push('aufgaben: mindestens 10 erwartet');
  if (Array.isArray(aufgaben) && Array.isArray(helfer)) {
    const ids = new Set();
    const bekannt = new Set(helfer.map((h) => h.id));
    for (const a of aufgaben) {
      const wo = `Aufgabe ${a.id || '?'}`;
      if (!a.id || ids.has(a.id)) fehler.push(`${wo}: id fehlt oder doppelt`);
      ids.add(a.id);
      if (!a.frage || !a.erklaerung || !a.gespraech) fehler.push(`${wo}: frage/erklaerung/gespraech fehlt`);
      else if (!a.gespraech.trim().endsWith('?')) fehler.push(`${wo}: Gesprächsimpuls soll eine Frage sein`);
      if (!bekannt.has(a.helfer)) fehler.push(`${wo}: Helfer ${a.helfer} gibt es nicht`);
    }
    for (const id of bekannt) {
      const anzahl = aufgaben.filter((a) => a.helfer === id).length;
      if (anzahl < 2) fehler.push(`Helfer ${id}: nur ${anzahl} Aufgabe – zu wenig zum Üben`);
    }
  }

  if (!Array.isArray(hilfen) || hilfen.length < 4) fehler.push('hilfen: mindestens 4 Hilfsmittel erwartet');
  if (Array.isArray(hilfen)) {
    for (const h of hilfen) {
      if (!h.id || !h.emoji || !h.name || !h.text) fehler.push(`Hilfe ${h.id || '?'}: unvollständig`);
      // Hilfsmittel werden nie als Mangel beschrieben.
      else if (/kaputt|krank|arm|behindert|leidet/i.test(h.text)) {
        fehler.push(`Hilfe ${h.id}: beschreibt das Hilfsmittel als Mangel`);
      }
    }
  }
  if (typeof hilfenRegel !== 'string' || !/fragen/i.test(hilfenRegel) || !/anstarren|starren/i.test(hilfenRegel)) {
    fehler.push('hilfenRegel: muss „nicht anstarren, sondern fragen“ sagen');
  }

  if (!Array.isArray(schlussIdeen) || schlussIdeen.length < 3) {
    fehler.push('schlussIdeen: mindestens 3 erwartet (die Sitzung endet offline)');
  }
  return fehler;
}
