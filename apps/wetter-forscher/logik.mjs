// Wetter- und Jahreszeiten-Forscher – reine Logik (ohne DOM), testbar.
// Tägliches Wetterprotokoll mit Wenn-dann-Beobachtungen und
// Jahreszeiten-Merkmalen. Praleska docs/10 (Ko-Nutzung Nr. 5).
//
// Die Planer-Engine wird hier als NATURBEOBACHTUNGS-Tagebuch benutzt, nicht
// als Selbstkontrolle: Gezählt wird das Wetter, nie das Kind. Deshalb sind
// Statistiken hier ausdrücklich erlaubt – sie sagen etwas über den Himmel
// aus, nicht über das Verhalten eines Kindes.

/** So viele Tage bleiben gespeichert. Wetter ist keine Aussage über das Kind, */
/** deshalb ist ein Monatsrückblick hier vertretbar – anders als bei einem   */
/** Selbstbeobachtungs-Tagebuch, wo das Fenster bewusst eine Woche ist.      */
export const TAGE_IM_RUECKBLICK = 28;

/** Meteorologische Jahreszeiten (in Deutschland die übliche Einteilung). */
export const JAHRESZEITEN = [
  { id: 'fruehling', name: 'Frühling', emoji: '🌱', monate: [3, 4, 5] },
  { id: 'sommer', name: 'Sommer', emoji: '☀️', monate: [6, 7, 8] },
  { id: 'herbst', name: 'Herbst', emoji: '🍂', monate: [9, 10, 11] },
  { id: 'winter', name: 'Winter', emoji: '❄️', monate: [12, 1, 2] },
];

/** Lokales Datum als 'JJJJ-MM-TT' (nicht UTC, sonst kippt der Tag abends). */
export function datumsSchluessel(datum) {
  const j = datum.getFullYear();
  const m = String(datum.getMonth() + 1).padStart(2, '0');
  const t = String(datum.getDate()).padStart(2, '0');
  return `${j}-${m}-${t}`;
}

/** Die letzten `anzahl` Tagesschlüssel, aufsteigend, endend mit `heute`. */
export function letzteTage(anzahl, heute) {
  const tage = [];
  for (let i = anzahl - 1; i >= 0; i--) {
    const d = new Date(heute.getFullYear(), heute.getMonth(), heute.getDate() - i);
    tage.push(datumsSchluessel(d));
  }
  return tage;
}

/** Datensparsamkeit: alles außerhalb des Fensters fällt weg. */
export function beschneide(tage, heute, anzahl = TAGE_IM_RUECKBLICK) {
  const erlaubt = new Set(letzteTage(anzahl, heute));
  const gekuerzt = {};
  for (const [schluessel, eintrag] of Object.entries(tage || {})) {
    if (erlaubt.has(schluessel)) gekuerzt[schluessel] = eintrag;
  }
  return gekuerzt;
}

/** Meteorologische Jahreszeit zu einem Datum. */
export function jahreszeitFuer(datum) {
  const monat = datum.getMonth() + 1;
  return JAHRESZEITEN.find((j) => j.monate.includes(monat)) ?? null;
}

/**
 * Zählt, wie oft jedes Wetter im Fenster eingetragen wurde.
 * Rein beschreibend – es geht um den Himmel, nicht um das Kind.
 */
export function zaehleWetter(tage, fenster, wetterListe) {
  const zaehler = Object.fromEntries(wetterListe.map((w) => [w.id, 0]));
  let offen = 0;
  for (const schluessel of fenster) {
    const id = tage?.[schluessel]?.wetter;
    if (id && id in zaehler) zaehler[id] += 1;
    else offen += 1;
  }
  return { ...zaehler, offen };
}

/** Das häufigste Wetter im Fenster – null, wenn nichts eingetragen ist. */
export function haeufigstesWetter(tage, fenster, wetterListe) {
  const z = zaehleWetter(tage, fenster, wetterListe);
  let beste = null;
  for (const w of wetterListe) {
    if (z[w.id] > 0 && (!beste || z[w.id] > z[beste.id])) beste = w;
  }
  return beste;
}

/**
 * Wie viele Tage im Fenster tragen ein BEKANNTES Wetter?
 * Die Liste wird mitgegeben, damit ein alter oder verfälschter Eintrag im
 * Speicher nicht mitzählt – sonst meldete die App Tage, zu denen sie nichts
 * anzeigen kann.
 */
export function anzahlEintraege(tage, fenster, wetterListe) {
  const bekannt = new Set(wetterListe.map((w) => w.id));
  return fenster.filter((s) => bekannt.has(tage?.[s]?.wetter)).length;
}

/**
 * Validiert die Daten. Tragende Regeln: jedes Wetter trägt eine
 * Wenn-dann-Beobachtung (sonst wäre es reines Anklicken), jede Jahreszeit
 * hat Merkmale zum Suchen, und die vier Jahreszeiten decken alle zwölf
 * Monate lückenlos und überschneidungsfrei ab.
 */
export function pruefeDaten(daten) {
  const fehler = [];
  const { wetter, jahreszeiten } = daten ?? {};

  if (!Array.isArray(wetter) || wetter.length < 5) fehler.push('wetter: mindestens 5 Sorten erwartet');
  if (Array.isArray(wetter)) {
    const ids = new Set();
    for (const w of wetter) {
      const wo = `Wetter ${w.id || '?'}`;
      if (!w.id || ids.has(w.id)) fehler.push(`${wo}: id fehlt oder doppelt`);
      ids.add(w.id);
      if (!w.name || !w.emoji) fehler.push(`${wo}: name/emoji fehlt`);
      if (!w.beobachtung || w.beobachtung.length < 40) fehler.push(`${wo}: Wenn-dann-Beobachtung fehlt oder ist zu knapp`);
      if (w.beobachtung && !/\?/.test(w.beobachtung)) fehler.push(`${wo}: die Beobachtung soll eine Frage stellen`);
    }
  }

  if (!Array.isArray(jahreszeiten) || jahreszeiten.length !== 4) fehler.push('jahreszeiten: genau 4 erwartet');
  if (Array.isArray(jahreszeiten)) {
    const bekannt = new Set(JAHRESZEITEN.map((j) => j.id));
    for (const j of jahreszeiten) {
      const wo = `Jahreszeit ${j.id || '?'}`;
      if (!bekannt.has(j.id)) fehler.push(`${wo}: unbekannte Jahreszeit`);
      if (!Array.isArray(j.merkmale) || j.merkmale.length < 4) fehler.push(`${wo}: mindestens 4 Merkmale erwartet`);
      if (!j.impuls || !j.impuls.trim().endsWith('?')) fehler.push(`${wo}: impuls soll eine Frage sein`);
    }
    for (const id of bekannt) {
      if (!jahreszeiten.some((j) => j.id === id)) fehler.push(`jahreszeiten: ${id} fehlt`);
    }
  }

  // Die Monatszuordnung muss lückenlos und überschneidungsfrei sein.
  const belegt = new Map();
  for (const j of JAHRESZEITEN) {
    for (const m of j.monate) {
      if (belegt.has(m)) fehler.push(`Monat ${m} gehört zu zwei Jahreszeiten`);
      belegt.set(m, j.id);
    }
  }
  for (let m = 1; m <= 12; m++) if (!belegt.has(m)) fehler.push(`Monat ${m} hat keine Jahreszeit`);

  return fehler;
}
