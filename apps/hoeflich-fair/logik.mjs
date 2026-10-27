// Höflich & Fair – reine Logik (ohne DOM), testbar mit node --test.
// Szenario-Trainer zur Sprach-Etikette: danken, entschuldigen,
// gratulieren, Mitgefühl und Bewunderung zeigen, bitten, grüßen, Grenzen
// setzen. Praleska docs/10 (Kinder-Apps Nr. 13).
// Das Kind wird nicht bewertet: jede Antwort bekommt nur eine Rückmeldung mit Erklärung.

/**
 * Rückmeldung zu einer gewählten Option (wert 2/1/0 der Daten): Emoji und Titel; `gut` färbt den Hinweis.
 * @param {{wert?: number}} option
 * @returns {{gut: boolean, emoji: string, titel: string}}
 */
export function rueckmeldungFuer(option) {
  const wert = option?.wert ?? 0;
  if (wert === 2) return { gut: true, emoji: '😊', titel: 'Genau die richtigen Worte!' };
  if (wert === 1) return { gut: false, emoji: '👍', titel: 'Fast – geht noch freundlicher.' };
  return { gut: false, emoji: '💭', titel: 'Schau nochmal hin.' };
}

/**
 * Validiert die Szenarien: je Szene genau EINE beste Option (wert 2), genau eine
 * mittlere (wert 1), genau eine ungünstige (wert 0), Erklärung vorhanden;
 * Kategorien eindeutig.
 */
export function pruefeSzenarien(daten) {
  const fehler = [];
  const szenarien = daten?.szenarien;
  if (!Array.isArray(szenarien) || szenarien.length < 10) {
    fehler.push('szenarien: mindestens 10 erwartet');
    return fehler;
  }
  const ids = new Set();
  const kategorien = new Set();
  for (const s of szenarien) {
    const wo = `Szene ${s.id || '?'}`;
    if (!s.id || ids.has(s.id)) fehler.push(`${wo}: id fehlt oder doppelt`);
    ids.add(s.id);
    if (!s.situation || !s.frage || !s.erklaerung || !s.emoji || !s.kategorie) {
      fehler.push(`${wo}: situation/frage/erklaerung/emoji/kategorie fehlt`);
    }
    if (s.kategorie && kategorien.has(s.kategorie)) fehler.push(`${wo}: Kategorie ${s.kategorie} doppelt`);
    kategorien.add(s.kategorie);
    const werte = (s.optionen || []).map((o) => o.wert);
    if (werte.length !== 3) fehler.push(`${wo}: genau 3 Optionen erwartet`);
    if (werte.filter((w) => w === 2).length !== 1) fehler.push(`${wo}: genau EINE beste Option (wert 2)`);
    if (werte.filter((w) => w === 1).length !== 1) fehler.push(`${wo}: genau EINE mittlere Option (wert 1)`);
    if (werte.filter((w) => w === 0).length !== 1) fehler.push(`${wo}: genau EINE ungünstige Option (wert 0)`);
    if (werte.some((w) => ![0, 1, 2].includes(w))) fehler.push(`${wo}: Werte nur 0/1/2`);
    const texte = (s.optionen || []).map((o) => o.text);
    if (new Set(texte).size !== texte.length) fehler.push(`${wo}: doppelte Optionstexte`);
  }
  return fehler;
}
