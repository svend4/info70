// Kunst-Entdecker – reine Logik (ohne DOM), testbar mit node --test.
// Gattungen (Malerei/Grafik/Skulptur) und Genres (Porträt/Landschaft/
// Stillleben) an eingebetteten gemeinfreien Werken erkennen.
// Praleska docs/10 (Kinder-Apps Nr. 21).
//
// Die Architektur-Tafel trägt die Gattung „architektur-tafel“ und wird nie
// abgefragt: Das Blatt ist eine Zeichnung, die Architektur zeigt – es
// hätte zwei richtige Antworten. Sie steht stattdessen als Erklärkarte da.
export const TAFEL = 'architektur-tafel';

/** Alle Werke, die im Ratespiel vorkommen dürfen. */
export function ratbareWerke(daten) {
  return daten.werke.filter((w) => w.gattung !== TAFEL);
}

/** Werke, die eines der drei Genres tragen. */
export function werkeMitGenre(daten) {
  return ratbareWerke(daten).filter((w) => w.genre);
}

export function gattungVon(daten, id) {
  return daten.gattungen.find((g) => g.id === id) ?? null;
}

export function genreVon(daten, id) {
  return daten.genres.find((g) => g.id === id) ?? null;
}

/**
 * Eine Frage: entweder nach der Gattung oder nach dem Genre.
 * Die Antwortmöglichkeiten sind immer alle drei der jeweiligen Sorte –
 * dadurch verrät die Auswahl nichts über die Lösung.
 */
export function baueFrage(daten, art, zufall, mischen, vorher = null) {
  const vorrat = art === 'gattung' ? ratbareWerke(daten) : werkeMitGenre(daten);
  const auswahl = vorher ? vorrat.filter((w) => w.id !== vorher.werk.id) : vorrat;
  const werk = zufall(auswahl.length ? auswahl : vorrat);
  const sorte = art === 'gattung' ? daten.gattungen : daten.genres;
  return {
    art,
    werk,
    optionen: mischen([...sorte]),
    loesung: art === 'gattung' ? werk.gattung : werk.genre,
  };
}

/** Stimmt die gewählte Antwort? */
export function istRichtig(frage, id) {
  return frage.loesung === id;
}

/**
 * Validiert die Werkdaten. Tragende Regeln: jedes Bild liegt als data-URI
 * vor (sonst wäre die App nicht offline), jede Herkunft ist vollständig
 * belegt (Einrichtung, Objektnummer, Lizenz), jede Gattung und jedes Genre
 * ist bekannt, und jede abfragbare Sorte hat genug Werke, damit das Spiel
 * nicht aus zwei Bildern besteht.
 */
export function pruefeDaten(daten) {
  const fehler = [];
  const { gattungen, genres, werke } = daten ?? {};

  if (!Array.isArray(gattungen) || gattungen.length !== 3) fehler.push('gattungen: genau 3 erwartet');
  if (!Array.isArray(genres) || genres.length !== 3) fehler.push('genres: genau 3 erwartet');
  for (const liste of [gattungen, genres]) {
    if (!Array.isArray(liste)) continue;
    for (const s of liste) {
      if (!s.id || !s.name || !s.emoji || !s.merkmal) fehler.push(`Sorte ${s.id || '?'}: id/name/emoji/merkmal fehlt`);
      else if (s.merkmal.length < 40) fehler.push(`Sorte ${s.id}: merkmal zu knapp`);
    }
  }

  if (!Array.isArray(werke) || werke.length < 8) {
    fehler.push('werke: mindestens 8 erwartet');
    return fehler;
  }

  const gattungIds = new Set((gattungen || []).map((g) => g.id));
  const genreIds = new Set((genres || []).map((g) => g.id));
  const ids = new Set();
  for (const w of werke) {
    const wo = `Werk ${w.id || '?'}`;
    if (!w.id || ids.has(w.id)) fehler.push(`${wo}: id fehlt oder doppelt`);
    ids.add(w.id);
    if (!w.titel || !w.kuenstler || !w.hinsehen) fehler.push(`${wo}: titel/kuenstler/hinsehen fehlt`);
    else if (w.hinsehen.length < 80) fehler.push(`${wo}: hinsehen zu knapp`);
    if (typeof w.bild !== 'string' || !w.bild.startsWith('data:image/')) {
      fehler.push(`${wo}: Bild fehlt oder ist keine eingebettete data-URI`);
    }
    if (!Number.isInteger(w.breite) || !Number.isInteger(w.hoehe)) fehler.push(`${wo}: breite/hoehe fehlt`);
    const q = w.quelle;
    if (!q || !q.einrichtung || !q.objektnummer || !q.lizenz || !q.seite) {
      fehler.push(`${wo}: Herkunft unvollständig – Einrichtung, Objektnummer, Lizenz und Seite sind Pflicht`);
    } else if (!/CC0/.test(q.lizenz)) {
      fehler.push(`${wo}: Lizenz „${q.lizenz}“ ist nicht CC0 – nicht verwendbar`);
    }
    if (w.gattung !== TAFEL && !gattungIds.has(w.gattung)) fehler.push(`${wo}: Gattung ${w.gattung} gibt es nicht`);
    if (w.genre !== null && w.genre !== undefined && !genreIds.has(w.genre)) fehler.push(`${wo}: Genre ${w.genre} gibt es nicht`);
    if (w.gattung === TAFEL && w.genre) fehler.push(`${wo}: die Erklärtafel darf kein Genre tragen`);
  }

  const ratbar = werke.filter((w) => w.gattung !== TAFEL);
  for (const g of gattungIds) {
    if (!ratbar.some((w) => w.gattung === g)) fehler.push(`Gattung ${g}: kein einziges Werk`);
  }
  for (const g of genreIds) {
    const anzahl = ratbar.filter((w) => w.genre === g).length;
    if (anzahl < 2) fehler.push(`Genre ${g}: nur ${anzahl} Werk – zu wenig zum Üben`);
  }
  if (!werke.some((w) => w.gattung === TAFEL)) fehler.push('Architektur-Tafel fehlt');

  return fehler;
}
