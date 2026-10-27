// Ein Tier zu Gast – reine Logik (ohne DOM), testbar mit node --test.
// Szenario-Trainer 2/1/0 zur Verantwortung für Heimtiere (Meerschweinchen,
// Hamster, Kaninchen, Wellensittich). Praleska docs/10 (Kinder-Apps Nr. 4).
// Die Werte 2/1/0 gehören zur Antwortoption und steuern nur die Rückmeldung
// mit Erklärung; das Kind wird nicht bewertet, es wird nichts addiert.

/**
 * Validiert die Szenarien: je Szene genau EINE Option mit Wert 2, mindestens
 * eine Option mit Wert 0, Erklärung vorhanden.
 */
export function pruefeSzenarien(daten) {
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
    if (werte.filter((w) => w === 2).length !== 1) fehler.push(`${wo}: genau EINE Option mit Wert 2`);
    if (!werte.includes(0)) fehler.push(`${wo}: mindestens eine Option mit Wert 0`);
    if (werte.some((w) => ![0, 1, 2].includes(w))) fehler.push(`${wo}: Werte nur 0/1/2`);
  }
  return fehler;
}
