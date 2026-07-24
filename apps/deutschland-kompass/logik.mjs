// Deutschland-Kompass – reine Logik (ohne DOM), testbar mit node --test.
// Plan-Simulator (Ortsplan als Raster, vier Himmelsrichtungen) und
// Karten-Quiz. Praleska docs/10 (Kinder-Apps Nr. 18).
//
// Konvention wie auf jeder Landkarte: Norden ist oben. Zeile 0 ist also
// die nördlichste Reihe, Spalte 0 die westlichste – daher dz = -1 für
// Norden. Genau hier entstehen die klassischen Vorzeichenfehler,
// deshalb hängt ein eigener Test daran.
export const RICHTUNGEN = [
  { id: 'norden', name: 'Norden', kurz: 'N', emoji: '⬆️', dz: -1, ds: 0 },
  { id: 'osten', name: 'Osten', kurz: 'O', emoji: '➡️', dz: 0, ds: 1 },
  { id: 'sueden', name: 'Süden', kurz: 'S', emoji: '⬇️', dz: 1, ds: 0 },
  { id: 'westen', name: 'Westen', kurz: 'W', emoji: '⬅️', dz: 0, ds: -1 },
];

export const MERKSATZ = 'Nie ohne Seife waschen – Norden, Osten, Süden, Westen im Uhrzeigersinn.';

export function richtungVon(id) {
  return RICHTUNGEN.find((r) => r.id === id) ?? null;
}

/** Die Richtung, die im Uhrzeigersinn als nächste kommt. */
export function imUhrzeigersinn(id, schritte = 1) {
  const i = RICHTUNGEN.findIndex((r) => r.id === id);
  if (i < 0) return null;
  return RICHTUNGEN[(i + schritte % 4 + 4) % 4];
}

/** Die Gegenrichtung. */
export function gegenrichtung(id) {
  return imUhrzeigersinn(id, 2);
}

export function verschiebe(pos, richtungId, schritte) {
  const r = richtungVon(richtungId);
  if (!r) return null;
  return { zeile: pos.zeile + r.dz * schritte, spalte: pos.spalte + r.ds * schritte };
}

export function imFeld(pos, groesse) {
  return pos.zeile >= 0 && pos.zeile < groesse && pos.spalte >= 0 && pos.spalte < groesse;
}

export function ortAn(orte, pos) {
  return orte.find((o) => o.zeile === pos.zeile && o.spalte === pos.spalte) ?? null;
}

/**
 * Alle Aufgaben, die überhaupt aufgehen: von einem Ort aus geradeaus in
 * eine Richtung, und am Ende steht wieder ein benannter Ort. Dadurch ist
 * jede erzeugte Aufgabe lösbar – die Lösbarkeit wird nicht gehofft,
 * sondern aufgezählt.
 */
export function alleAufgaben(orte, groesse) {
  const treffer = [];
  for (const start of orte) {
    for (const r of RICHTUNGEN) {
      for (let schritte = 1; schritte < groesse; schritte++) {
        const ziel = verschiebe(start, r.id, schritte);
        if (!imFeld(ziel, groesse)) break;
        const ort = ortAn(orte, ziel);
        if (ort && ort.id !== start.id) {
          treffer.push({ startId: start.id, richtungId: r.id, schritte, zielId: ort.id });
        }
      }
    }
  }
  return treffer;
}

/** Eine Aufgabe samt drei Antwortmöglichkeiten. `vorher` wird gemieden. */
export function baueAufgabe(daten, zufall, mischen, vorher = null) {
  const moeglich = alleAufgaben(daten.orte, daten.groesse);
  const auswahl = vorher
    ? moeglich.filter((a) => !(a.startId === vorher.start.id && a.richtungId === vorher.richtung.id && a.schritte === vorher.schritte))
    : moeglich;
  const roh = zufall(auswahl.length ? auswahl : moeglich);
  const start = daten.orte.find((o) => o.id === roh.startId);
  const ziel = daten.orte.find((o) => o.id === roh.zielId);
  // Die Ablenker müssen gezogen werden, nicht der Dateireihenfolge folgen:
  // Sonst könnten die hinteren Orte nie falsche Antwort sein, und sobald
  // einer von ihnen auftaucht, wäre er ohne Nachdenken als Lösung erkennbar.
  const ablenker = mischen(daten.orte.filter((o) => o.id !== ziel.id && o.id !== start.id)).slice(0, 2);
  return {
    start,
    richtung: richtungVon(roh.richtungId),
    schritte: roh.schritte,
    ziel,
    optionen: mischen([ziel, ...ablenker]),
  };
}

/** Fließtext der Aufgabe – auch für die Vorlesefunktion. */
export function aufgabenText(aufgabe) {
  const feld = aufgabe.schritte === 1 ? 'ein Feld' : `${aufgabe.schritte} Felder`;
  return `Du stehst ${aufgabe.start.wo}. Gehe ${feld} nach ${aufgabe.richtung.name}. Wo bist du?`;
}

/** Validiert Ortsplan, Quizfragen und die Länderkarte. */
export function pruefeDaten(daten) {
  const fehler = [];
  const { groesse, orte, quiz, laender } = daten ?? {};

  if (!Number.isInteger(groesse) || groesse < 4) fehler.push('groesse: mindestens 4 erwartet');

  if (!Array.isArray(orte) || orte.length < 6) fehler.push('orte: mindestens 6 erwartet');
  if (Array.isArray(orte)) {
    const vorherigeFehler = fehler.length;
    const ids = new Set();
    const felder = new Set();
    for (const o of orte) {
      const wo = `Ort ${o.id || '?'}`;
      if (!o.id || ids.has(o.id)) fehler.push(`${wo}: id fehlt oder doppelt`);
      ids.add(o.id);
      if (!o.name || !o.emoji || !o.wo) fehler.push(`${wo}: name/emoji/wo fehlt`);
      if (!Number.isInteger(o.zeile) || !Number.isInteger(o.spalte)) fehler.push(`${wo}: zeile/spalte fehlt`);
      else if (!imFeld(o, groesse)) fehler.push(`${wo}: liegt außerhalb des Plans`);
      const feld = `${o.zeile}|${o.spalte}`;
      if (felder.has(feld)) fehler.push(`${wo}: zwei Orte auf demselben Feld`);
      felder.add(feld);
    }
    // Nur zählen, wenn der Plan selbst heil ist – sonst wäre die Zahl Zufall.
    if (fehler.length === vorherigeFehler && alleAufgaben(orte, groesse).length < 12) {
      fehler.push('orte: zu wenige lösbare Wege – der Plan liefert kaum Aufgaben');
    }
  }

  if (!Array.isArray(quiz) || quiz.length < 10) fehler.push('quiz: mindestens 10 Fragen erwartet');
  if (Array.isArray(quiz)) {
    const ids = new Set();
    const bereiche = new Set();
    for (const q of quiz) {
      const wo = `Frage ${q.id || '?'}`;
      if (!q.id || ids.has(q.id)) fehler.push(`${wo}: id fehlt oder doppelt`);
      ids.add(q.id);
      if (!q.frage || !q.erklaerung) fehler.push(`${wo}: frage/erklaerung fehlt`);
      else if (q.erklaerung.length < 80) fehler.push(`${wo}: Erklärung zu knapp`);
      if (!Array.isArray(q.antworten) || q.antworten.length !== 3) fehler.push(`${wo}: genau 3 Antworten erwartet`);
      else if (new Set(q.antworten).size !== 3) fehler.push(`${wo}: doppelte Antwort`);
      if (!Number.isInteger(q.korrekt) || q.korrekt < 0 || q.korrekt >= (q.antworten?.length ?? 0)) {
        fehler.push(`${wo}: korrekt zeigt ins Leere`);
      }
      if (!['deutschland', 'welt', 'himmelsrichtungen'].includes(q.bereich)) fehler.push(`${wo}: bereich unbekannt`);
      bereiche.add(q.bereich);
    }
    for (const noetig of ['deutschland', 'welt', 'himmelsrichtungen']) {
      if (!bereiche.has(noetig)) fehler.push(`quiz: Bereich ${noetig} fehlt`);
    }
  }

  if (!Array.isArray(laender) || laender.length < 2) fehler.push('laender: mindestens 2 Länderkarten erwartet');
  if (Array.isArray(laender)) {
    for (const l of laender) {
      const wo = `Land ${l.id || '?'}`;
      if (!l.id || !l.name || !l.emoji) fehler.push(`${wo}: id/name/emoji fehlt`);
      if (!Array.isArray(l.fakten) || l.fakten.length < 4) fehler.push(`${wo}: mindestens 4 Fakten erwartet`);
    }
  }

  return fehler;
}
