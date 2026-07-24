// Ein Tier zu Gast – reine Logik (ohne DOM), testbar mit node --test.
// Szenario-Trainer 2/1/0 zur Verantwortung für Heimtiere (Meerschweinchen,
// Hamster, Kaninchen, Wellensittich). Praleska docs/10 (Kinder-Apps Nr. 4).

/** Maximalpunktzahl einer Runde. */
export function maxPunkte(anzahl) {
  return anzahl * 2;
}

/** Rang zur erreichten Punktzahl (höchster passender „ab“-Wert). */
export function rangFuer(raenge, punkte) {
  let treffer = raenge[0];
  for (const r of raenge) if (punkte >= r.ab) treffer = r;
  return treffer;
}

/** Abschluss-Satz mit Rang. */
export function ergebnisSatz(raenge, punkte, anzahl) {
  const r = rangFuer(raenge, punkte);
  return `${r.emoji} ${r.titel} – ${punkte} von ${maxPunkte(anzahl)} Tierfreund-Punkten`;
}

/**
 * Validiert die Szenarien: je Szene genau EINE 2-Punkte-Option, mindestens
 * eine 0-Punkte-Option, Erklärung vorhanden; Ränge in Rundengröße erreichbar.
 */
export function pruefeSzenarien(daten, runde) {
  const fehler = [];
  const szenarien = daten?.szenarien;
  if (!Array.isArray(szenarien) || szenarien.length < 8) {
    fehler.push('szenarien: mindestens 8 erwartet');
    return fehler;
  }
  const ids = new Set();
  for (const s of szenarien) {
    const wo = `Szene ${s.id || '?'}`;
    if (!s.id || ids.has(s.id)) fehler.push(`${wo}: id fehlt oder doppelt`);
    ids.add(s.id);
    if (!s.situation || !s.frage || !s.erklaerung || !s.emoji) fehler.push(`${wo}: situation/frage/erklaerung/emoji fehlt`);
    const werte = (s.optionen || []).map((o) => o.wert);
    if (werte.length !== 3) fehler.push(`${wo}: genau 3 Optionen erwartet`);
    if (werte.filter((w) => w === 2).length !== 1) fehler.push(`${wo}: genau EINE 2-Punkte-Option`);
    if (!werte.includes(0)) fehler.push(`${wo}: mindestens eine 0-Punkte-Option`);
    if (werte.some((w) => ![0, 1, 2].includes(w))) fehler.push(`${wo}: Werte nur 0/1/2`);
  }
  const max = maxPunkte(Math.min(runde, szenarien.length));
  for (const r of daten?.raenge || []) {
    if (r.ab > max) fehler.push(`Rang ${r.titel}: ab=${r.ab} ist mit ${max} Punkten unerreichbar`);
  }
  if (!Array.isArray(daten?.raenge) || daten.raenge.length < 3 || daten.raenge[0].ab !== 0) {
    fehler.push('raenge: mindestens 3, beginnend bei ab=0');
  }
  return fehler;
}
