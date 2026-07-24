// Bewegungspausen-Generator (Fiskultminutki): reine Logik (ohne DOM), testbar.
// Erzeugt aus der Baustein-Kartei sofort einsetzbare 7–10-Minuten-Skripte für
// Kita und „Bewegte Schule“. Isolierte Generator-Funktion mit injizierbarem
// Zufall (Muster: geschichten-werkstatt/erzeugeGeschichte). Praleska docs/10
// (Top-30 Nr. 16). Alle Übungen/Verse sind Eigenproduktion.

/** Ziel-Korridor der Pause in Minuten. */
export const ZIEL_MIN = 7;
export const ZIEL_MAX = 10;

/** Feste Phasen-Reihenfolge eines Skripts. */
export const ABLAUF = Object.freeze(['aufwachen', 'power', 'koordination', 'ruhe']);

const zufall = (liste) => liste[Math.floor(Math.random() * liste.length)];

/** Prüft die Baustein-Bank. Liefert Fehlerliste (leer = gültig). */
export function pruefeBausteine(daten) {
  const fehler = [];
  if (!Array.isArray(daten?.phasen) || !Array.isArray(daten?.bausteine)) return ['Keine gültige Baustein-Bank'];
  const phasenIds = new Set(daten.phasen.map((p) => p.id));
  for (const ph of ABLAUF) if (!phasenIds.has(ph)) fehler.push(`Phase ${ph} fehlt`);
  const ids = new Set();
  for (const b of daten.bausteine) {
    if (!b.id || ids.has(b.id)) fehler.push(`Baustein-Id fehlt/doppelt: ${b.id}`);
    ids.add(b.id);
    if (!phasenIds.has(b.phase)) fehler.push(`${b.id}: unbekannte Phase`);
    if (!Number.isInteger(b.minuten) || b.minuten < 1 || b.minuten > 4) fehler.push(`${b.id}: Minuten 1–4 erwartet`);
    if (!Array.isArray(b.anleitung) || b.anleitung.length < 2) fehler.push(`${b.id}: Anleitung zu kurz`);
    if (!b.vers || b.vers.length < 15) fehler.push(`${b.id}: Vers fehlt`);
  }
  for (const ph of ABLAUF) {
    const n = daten.bausteine.filter((b) => b.phase === ph).length;
    if (n < 2) fehler.push(`Phase ${ph}: mindestens 2 Bausteine (ist ${n})`);
  }
  return fehler;
}

/** Bausteine einer Phase. */
export function bausteineFuer(daten, phase) {
  return daten.bausteine.filter((b) => b.phase === phase);
}

/** Gesamtdauer einer Baustein-Liste. */
export function gesamtMinuten(skript) {
  return skript.reduce((s, b) => s + b.minuten, 0);
}

/**
 * Erzeugt ein Pausen-Skript: je Phase des ABLAUFs ein Baustein; liegt die
 * Summe unter ZIEL_MIN, wird ein zweiter Power-Baustein ergänzt (falls
 * verfügbar und der Korridor es erlaubt). Der Waehler ist injizierbar, damit
 * die Funktion deterministisch testbar bleibt.
 * @param {object} daten bausteine.json
 * @param {(liste: object[]) => object} [waehle]
 * @returns {object[]} Bausteine in Ablauf-Reihenfolge
 */
export function erzeugePause(daten, waehle = zufall) {
  const skript = [];
  for (const phase of ABLAUF) {
    const kandidaten = bausteineFuer(daten, phase);
    if (kandidaten.length) skript.push(waehle(kandidaten));
  }
  if (gesamtMinuten(skript) < ZIEL_MIN) {
    const schonDrin = new Set(skript.map((b) => b.id));
    const extra = bausteineFuer(daten, 'power').filter((b) => !schonDrin.has(b.id)
      && gesamtMinuten(skript) + b.minuten <= ZIEL_MAX);
    if (extra.length) {
      const zusatz = waehle(extra);
      const powerIndex = skript.findIndex((b) => b.phase === 'power');
      skript.splice(powerIndex + 1, 0, zusatz);
    }
  }
  return skript;
}

const stand = () => {
  try { return new Date().toLocaleDateString('de-DE'); } catch { return ''; }
};

/** Baut das Skript als kopierbaren Text (mit Versen und Minutenangaben). */
export function skriptText(daten, skript, datum = stand()) {
  const phasenName = new Map(daten.phasen.map((p) => [p.id, `${p.emoji} ${p.name}`]));
  const zeilen = [
    `Bewegungspause (${gesamtMinuten(skript)} Minuten) – ${datum}`,
    'Ohne Material, am Platz. Eigenproduktion (info70), frei nutzbar (AGPL/OER).',
    '',
  ];
  skript.forEach((b, i) => {
    zeilen.push(`${i + 1}. ${b.titel} · ${b.minuten} Min · ${phasenName.get(b.phase) ?? b.phase}`);
    for (const schritt of b.anleitung) zeilen.push(`   – ${schritt}`);
    zeilen.push(`   🎵 „${b.vers}“`, '');
  });
  zeilen.push('Tipp: Denselben Ablauf ruhig mehrmals in der Woche nutzen – Wiederholung gibt Sicherheit.');
  return zeilen.join('\n');
}
