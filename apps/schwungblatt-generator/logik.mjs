// Schwungblatt-Generator: reine Logik (ohne DOM), testbar. Erzeugt SVG-Pfade
// für Schwungübungen (Graphomotorik) in wählbarer Progression – als reine
// Druck-Funktion: Das Kind übt mit Stift auf PAPIER, nicht am Bildschirm.
// Praleska docs/10 (Top-30 Nr. 28).

/** Muster-Katalog mit Progressions-Stufen (1 = große Bögen … 3 = feine Formen). */
export const MUSTER = Object.freeze([
  { id: 'welle', name: 'Große Wellen', emoji: '🌊', stufe: 1 },
  { id: 'berge', name: 'Runde Berge', emoji: '⛰️', stufe: 1 },
  { id: 'girlande', name: 'Girlanden (Schalen)', emoji: '🎪', stufe: 2 },
  { id: 'zickzack', name: 'Zickzack', emoji: '⚡', stufe: 2 },
  { id: 'schleifen', name: 'Schleifen', emoji: '➰', stufe: 3 },
  { id: 'kreise', name: 'Kreise-Kette', emoji: '🔗', stufe: 3 },
]);

/** Breite einer Muster-Einheit in SVG-Einheiten. */
export const EINHEIT = 60;
/** Höhe der Zeichenfläche einer Zeile. */
export const HOEHE = 70;

/** Alle Muster einer Stufe (aufsteigend als Progression). */
export function musterFuerStufe(stufe) {
  return MUSTER.filter((m) => m.stufe === stufe);
}

/**
 * SVG-Pfad (d-Attribut) eines Musters über `einheiten` Wiederholungen.
 * Grundlinie liegt bei y = HOEHE - 15; alle Werte sind ganzzahlig/endlich.
 */
export function pfad(musterId, einheiten) {
  const y = HOEHE - 15; // Grundlinie
  const teile = [`M 0 ${y}`];
  for (let i = 0; i < einheiten; i++) {
    switch (musterId) {
      case 'welle':
        teile.push(`q 15 -50 30 0 q 15 50 30 0`);
        break;
      case 'berge':
        teile.push(`a 30 30 0 0 1 60 0`);
        break;
      case 'girlande':
        teile.push(`q 15 40 30 0 q 15 -40 30 0`);
        break;
      case 'zickzack':
        teile.push(`l 15 -45 l 15 45 l 15 -45 l 15 45`);
        break;
      case 'schleifen':
        teile.push(`c 5 -55 35 -55 30 -15 c -4 30 -22 20 -10 5 q 10 -12 40 10`);
        break;
      case 'kreise':
        teile.push(`a 15 15 0 1 1 30 0 a 15 15 0 1 0 30 0`);
        break;
      default:
        return null;
    }
  }
  return teile.join(' ');
}

/**
 * Komplette SVG-Zeile als String (selbst erzeugt, keine externen Ressourcen).
 * Heller Strich zum Nachspuren + grüner Startpunkt.
 */
export function zeilenSVG(musterId, einheiten) {
  const d = pfad(musterId, einheiten);
  if (!d) return null;
  const breite = einheiten * EINHEIT;
  const y = HOEHE - 15;
  return [
    `<svg viewBox="0 0 ${breite} ${HOEHE}" width="100%" height="${HOEHE}" role="img" aria-label="Schwungübung zum Nachspuren" preserveAspectRatio="none">`,
    `<path d="${d}" fill="none" stroke="#9ca3af" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1 7"/>`,
    `<circle cx="0" cy="${y}" r="6" fill="#16a34a"/>`,
    `</svg>`,
  ].join('');
}

/** Prüft den Muster-Katalog (eindeutige Ids, jede Stufe ≥2 Muster, Pfade gültig). */
export function pruefeMuster() {
  const fehler = [];
  const ids = new Set();
  for (const m of MUSTER) {
    if (ids.has(m.id)) fehler.push(`doppelt: ${m.id}`);
    ids.add(m.id);
    const d = pfad(m.id, 2);
    if (!d || /NaN|undefined/.test(d)) fehler.push(`${m.id}: Pfad ungültig`);
  }
  for (const stufe of [1, 2, 3]) {
    if (musterFuerStufe(stufe).length < 2) fehler.push(`Stufe ${stufe}: mindestens 2 Muster`);
  }
  return fehler;
}
