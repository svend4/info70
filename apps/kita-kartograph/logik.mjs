// Kita-Kartograph – reine Logik (ohne DOM), testbar mit node --test.
// Kinder legen mit Symbolen einen Plan ihres Raumes.
// Praleska docs/10 (Ko-Nutzung Nr. 10).
//
// Abgrenzung zu deutschland-kompass: Dort wird ein fertiger Plan GELESEN,
// hier wird einer GEBAUT. Der eigentliche kartographische Gedanke ist die
// Zeichenerklärung: Ein Plan funktioniert nur, wenn danebensteht, wofür
// die Zeichen stehen – deshalb baut sie sich hier automatisch aus dem auf,
// was wirklich liegt.

/** Kantenlänge des Rasters. */
export const GROESSE = 6;

/** Die vier Himmelsrichtungen als Kanten des Plans. */
export const KANTEN = [
  { id: 'oben', name: 'oben' },
  { id: 'rechts', name: 'rechts' },
  { id: 'unten', name: 'unten' },
  { id: 'links', name: 'links' },
];

export function felderAnzahl(groesse = GROESSE) {
  return groesse * groesse;
}

export function zeileVon(index, groesse = GROESSE) {
  return Math.floor(index / groesse);
}

export function spalteVon(index, groesse = GROESSE) {
  return index % groesse;
}

/** Menschliche Feldbezeichnung: „Reihe 2, Platz 3“. */
export function feldName(index, groesse = GROESSE) {
  return `Reihe ${zeileVon(index, groesse) + 1}, Platz ${spalteVon(index, groesse) + 1}`;
}

/**
 * Setzt ein Symbol. Dasselbe Symbol noch einmal auf dasselbe Feld nimmt es
 * wieder weg; ein anderes Symbol ersetzt das alte. Gibt einen NEUEN Plan
 * zurück und lässt den alten unberührt.
 */
export function setzeSymbol(plan, index, symbolId) {
  const neu = { ...plan };
  if (neu[index] === symbolId) delete neu[index];
  else neu[index] = symbolId;
  return neu;
}

export function leerePlan() {
  return {};
}

/** Wie viele Felder sind belegt? */
export function anzahlGelegt(plan) {
  return Object.keys(plan || {}).length;
}

/**
 * Die Zeichenerklärung: nur die Symbole, die wirklich im Plan liegen,
 * mit ihrer Anzahl – in der Reihenfolge der Symbolliste, damit sie sich
 * nicht bei jedem Antippen umsortiert.
 */
export function legende(plan, symbole) {
  const zaehler = new Map();
  for (const id of Object.values(plan || {})) zaehler.set(id, (zaehler.get(id) ?? 0) + 1);
  return symbole
    .filter((s) => zaehler.has(s.id))
    .map((s) => ({ ...s, anzahl: zaehler.get(s.id) }));
}

/** Plan als Text – zum Vorlesen und zum Abtippen in den Klassen-Koffer. */
export function planText(plan, symbole, groesse = GROESSE) {
  const eintraege = legende(plan, symbole);
  if (!eintraege.length) return 'Der Plan ist noch leer.';
  const nach = symbole.reduce((m, s) => m.set(s.id, s), new Map());
  const zeilen = [];
  for (const [index, id] of Object.entries(plan)) {
    const s = nach.get(id);
    if (s) zeilen.push({ index: Number(index), text: `${feldName(Number(index), groesse)}: ${s.name}` });
  }
  zeilen.sort((a, b) => a.index - b.index);
  return `${eintraege.map((s) => `${s.name} (${s.anzahl}×)`).join(', ')}. ${zeilen.map((z) => z.text).join('. ')}.`;
}

/** Validiert die Symboldaten. */
export function pruefeDaten(daten) {
  const fehler = [];
  const { symbole, fragen } = daten ?? {};

  if (!Array.isArray(symbole) || symbole.length < 8) fehler.push('symbole: mindestens 8 erwartet');
  if (Array.isArray(symbole)) {
    const ids = new Set();
    const emojis = new Set();
    for (const s of symbole) {
      const wo = `Symbol ${s.id || '?'}`;
      if (!s.id || ids.has(s.id)) fehler.push(`${wo}: id fehlt oder doppelt`);
      ids.add(s.id);
      if (!s.name || !s.emoji) fehler.push(`${wo}: name/emoji fehlt`);
      // Zwei Dinge mit demselben Zeichen wären auf einem Plan nicht
      // auseinanderzuhalten – genau das soll die Zeichenerklärung leisten.
      if (s.emoji && emojis.has(s.emoji)) fehler.push(`${wo}: Zeichen ${s.emoji} wird schon für etwas anderes benutzt`);
      emojis.add(s.emoji);
    }
    if (symbole.length > felderAnzahl()) fehler.push('symbole: mehr Symbole als Felder');
  }

  if (!Array.isArray(fragen) || fragen.length < 4) fehler.push('fragen: mindestens 4 Gesprächsimpulse erwartet');
  for (const f of fragen || []) {
    if (typeof f !== 'string' || !f.trim().endsWith('?')) fehler.push(`Impuls „${f}“: soll eine Frage sein`);
  }
  return fehler;
}
