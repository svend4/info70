// Musik-Jahresplaner für Fachkräfte (Praleska, Musikteil der Gruppe «ПОЧЕМУЧКИ», S. 160–174;
// Katalog docs/10, Nr. 87).
//
// Dieser Kern ist ohne DOM und ohne Zufall. Aus der Quelle stammen nur die fünf
// Bereiche mit Überschrift und Seite und die fünf Festbeispiele von S. 174. Alles
// andere ist Eigenentwurf: die deutschen Bereichsnamen, die Übersetzungen der
// Festnamen, die Festvorschläge, die Monatsübersicht, die vier Herkunftsoptionen
// und der Druckbogen. Ein Stück aus dem Buch steht hier nicht; die Stückliste
// gehört der Fachkraft.
//
// Die einzigen Zahlen, die die App zeigt, sind die eigenen Einträge je Monat.
// Eine Gesamtzahl wird nicht gebildet.

/** localStorage-Schlüssel der Fachkraft-Daten: nur die Häkchen, nie die Titel. */
export const SCHLUESSEL = 'mjp.stand';
export const TITEL_MAX = 120;
const MAX_STUECKE = 500;

export const MONATE = Object.freeze([
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
]);

/**
 * Die fünf Bereiche. `quelle` ist die Überschrift wörtlich aus der Quelle, `seiten`
 * die Seitenspanne (gedruckte Seitenzahl). `name` ist Eigenbenennung.
 */
export const BEREICHE = Object.freeze([
  Object.freeze({ id: 'hoeren', name: 'Hören', quelle: 'Слушание музыки', seiten: '160–162' }),
  Object.freeze({ id: 'singen', name: 'Singen', quelle: 'Пение', seiten: '162–165' }),
  Object.freeze({
    id: 'rhythmus',
    name: 'Musikalisch-rhythmische Tätigkeit und Tanz',
    quelle: 'Музыкально-ритмическая деятельность',
    seiten: '166–170',
  }),
  Object.freeze({
    id: 'instrumente',
    name: 'Spiel auf Instrumenten',
    quelle: 'Обучение элементам нотной грамоты, игре на музыкальных инструментах',
    seiten: '170–172',
  }),
  Object.freeze({ id: 'alltag', name: 'Musik im Alltag', quelle: 'Музыка в повседневной жизни', seiten: '172–174' }),
]);

/**
 * Herkunft eines eigenen Stücks: feste Optionen, nur gewählt, nie geprüft. Die App
 * sagt über keinen Urheber, ob ein Werk gemeinfrei ist; sie fragt nur nach der Herkunft.
 */
export const HERKUNFT = Object.freeze([
  Object.freeze({ id: 'eigenes-lied', text: 'eigenes Lied' }),
  Object.freeze({ id: 'volkslied', text: 'Volkslied, Fachkraft prüft die Gemeinfreiheit' }),
  Object.freeze({ id: 'lizenziert', text: 'lizenziert, Fachkraft prüft' }),
  Object.freeze({ id: 'andere', text: 'andere Herkunft, Fachkraft notiert' }),
]);

/** Die Festbeispiele aus der Quelle (S. 174), wörtlich, mit Eigenübersetzung. */
export const FESTE_QUELLE = Object.freeze([
  Object.freeze({ name: 'Новый год', deutsch: 'Neujahr' }),
  Object.freeze({ name: 'Мамин день — 8 Марта', deutsch: 'Mamas Tag am 8. März' }),
  Object.freeze({ name: 'Осень золотая', deutsch: 'Goldener Herbst' }),
  Object.freeze({ name: 'Праздник урожая', deutsch: 'Erntefest' }),
  Object.freeze({ name: 'Весна-красна', deutsch: 'Frühling, du Schöne' }),
]);
export const FEST_SEITE = 174;
export const FESTE_VORSCHLAEGE = Object.freeze(['Erntedank', 'St. Martin', 'Advent', 'Fasching', 'Frühlingsfest']);
export const KENNZEICHNUNG_VORSCHLAG = 'Vorschlag, nicht aus der Quelle';
export const KENNZEICHNUNG_UEBERSETZUNG = 'Übersetzung: Eigenentwurf';

const BEREICH_IDS = BEREICHE.map((b) => b.id);
const HERKUNFT_IDS = HERKUNFT.map((h) => h.id);
const STUECK_FELDER = ['id', 'titel', 'bereich', 'monat', 'herkunft'];
const HAKEN_MUSTER = /^(1[0-2]|[1-9]):([a-z]+)$/;

/** Ein leerer Stand: keine Stücke, keine Häkchen. */
export function leererStand() {
  return { stuecke: [], haken: {} };
}

export function gueltigerMonat(monat) {
  return Number.isInteger(monat) && monat >= 1 && monat <= 12;
}

export function bereichName(id) {
  return BEREICHE.find((b) => b.id === id)?.name ?? '';
}

export function herkunftText(id) {
  return HERKUNFT.find((h) => h.id === id)?.text ?? '';
}

/**
 * Prüft die Eingabe für ein eigenes Stück. Gibt entweder das bereinigte Stück
 * (ohne Nummer) oder die Liste der Fehler zurück. Keine Angabe wird still ergänzt.
 */
export function pruefeStueck(eingabe) {
  const fehler = [];
  const titel = typeof eingabe?.titel === 'string' ? eingabe.titel.trim() : '';
  if (!titel) fehler.push('Bitte einen Titel eintragen.');
  else if (titel.length > TITEL_MAX) fehler.push(`Der Titel ist länger als ${TITEL_MAX} Zeichen.`);
  if (!BEREICH_IDS.includes(eingabe?.bereich)) fehler.push('Bitte einen Bereich wählen.');
  if (!gueltigerMonat(eingabe?.monat)) fehler.push('Bitte einen Monat wählen.');
  if (!HERKUNFT_IDS.includes(eingabe?.herkunft)) fehler.push('Bitte die Herkunft wählen.');
  if (fehler.length) return { ok: false, fehler };
  return { ok: true, stueck: { titel, bereich: eingabe.bereich, monat: eingabe.monat, herkunft: eingabe.herkunft } };
}

/** Die nächste freie Nummer: größte vorhandene plus eins. Kein Zufall. */
export function naechsteId(stuecke) {
  return stuecke.reduce((groesste, s) => Math.max(groesste, s.id), 0) + 1;
}

/** Nimmt ein geprüftes Stück auf. Gibt bei Fehlern den Stand unverändert zurück. */
export function fuegeStueckHinzu(stand, eingabe) {
  const pruef = pruefeStueck(eingabe);
  if (!pruef.ok) return { stand, fehler: pruef.fehler };
  if (stand.stuecke.length >= MAX_STUECKE) {
    return { stand, fehler: [`Mehr als ${MAX_STUECKE} Stücke passen nicht in diese Liste.`] };
  }
  const id = naechsteId(stand.stuecke);
  return { stand: { ...stand, stuecke: [...stand.stuecke, { id, ...pruef.stueck }] }, fehler: [] };
}

export function entferneStueck(stand, id) {
  return { ...stand, stuecke: stand.stuecke.filter((s) => s.id !== id) };
}

export function hakenSchluessel(monat, bereich) {
  return `${monat}:${bereich}`;
}

export function istHaken(stand, monat, bereich) {
  return stand.haken[hakenSchluessel(monat, bereich)] === true;
}

/** Setzt oder löst das Häkchen eines Monats und Bereichs. Ungültige Angaben bleiben ohne Wirkung. */
export function umschalteHaken(stand, monat, bereich) {
  if (!gueltigerMonat(monat) || !BEREICH_IDS.includes(bereich)) return stand;
  const schluessel = hakenSchluessel(monat, bereich);
  const haken = { ...stand.haken };
  if (haken[schluessel]) delete haken[schluessel];
  else haken[schluessel] = true;
  return { ...stand, haken };
}

/** Anzahl der eigenen Stücke je Monat. Index 0 ist Januar. */
export function zaehleProMonat(stand) {
  return Array.from({ length: 12 }, (_, i) => stand.stuecke.filter((s) => s.monat === i + 1).length);
}

/** „1 Stück“, sonst „n Stücke“. */
export function zaehlWort(n) {
  return n === 1 ? '1 Stück' : `${n} Stücke`;
}

/**
 * Was in den Speicher darf: nur die Häkchen. Titel stehen nie im Speicher, weil sie frei sind
 * und einen Namen enthalten könnten.
 */
export function gespeicherterStand(stand) {
  return { stuecke: [], haken: { ...stand.haken } };
}

export function istLeer(stand) {
  return stand.stuecke.length === 0 && Object.keys(stand.haken).length === 0;
}

/** Stücke nach Monat, dann nach Bereich, dann nach Titel. Gibt eine Kopie zurück. */
export function sortiereStuecke(stuecke) {
  const reihenfolge = (id) => BEREICH_IDS.indexOf(id);
  return [...stuecke].sort((a, b) => (a.monat - b.monat)
    || (reihenfolge(a.bereich) - reihenfolge(b.bereich))
    || a.titel.localeCompare(b.titel, 'de'));
}

/**
 * Macht aus beliebigem Gespeicherten einen gültigen Stand. Fremde Felder fallen weg,
 * ungültige Stücke ebenso, doppelte Nummern und Häkchen mit unbekanntem Schlüssel auch.
 */
export function normalisiereStand(roh) {
  if (!roh || typeof roh !== 'object' || Array.isArray(roh)) return leererStand();
  const stuecke = [];
  const gesehen = new Set();
  for (const s of Array.isArray(roh.stuecke) ? roh.stuecke : []) {
    if (stuecke.length >= MAX_STUECKE) break;
    if (!s || typeof s !== 'object' || Array.isArray(s)) continue;
    if (Object.keys(s).some((k) => !STUECK_FELDER.includes(k))) continue;
    if (!Number.isInteger(s.id) || s.id < 1 || gesehen.has(s.id)) continue;
    const pruef = pruefeStueck(s);
    if (!pruef.ok) continue;
    gesehen.add(s.id);
    stuecke.push({ id: s.id, ...pruef.stueck });
  }
  const haken = {};
  if (roh.haken && typeof roh.haken === 'object' && !Array.isArray(roh.haken)) {
    for (const [schluessel, wert] of Object.entries(roh.haken)) {
      const m = HAKEN_MUSTER.exec(schluessel);
      if (wert === true && m && BEREICH_IDS.includes(m[2])) haken[schluessel] = true;
    }
  }
  return { stuecke, haken };
}

/** Liest den gespeicherten Text. Fehlt er oder ist er kaputt, gilt der leere Stand. */
export function ladeStand(text) {
  if (typeof text !== 'string') return leererStand();
  try {
    return normalisiereStand(JSON.parse(text));
  } catch {
    return leererStand();
  }
}

/**
 * Die Gliederung des Jahresbogens: zwölf Monate, je fünf Bereiche mit Titel und
 * Seitenspanne. Mit Absicht ohne Zählung und ohne Angaben der Fachkraft.
 */
export function druckGliederung() {
  return MONATE.map((name, i) => ({
    monat: i + 1,
    name,
    bereiche: BEREICHE.map((b) => ({ id: b.id, name: b.name, seiten: b.seiten })),
  }));
}
