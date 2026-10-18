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

/** Menschliche Feldbezeichnung: „Reihe 2, Spalte 3“. */
export function feldName(index, groesse = GROESSE) {
  return `Reihe ${zeileVon(index, groesse) + 1}, Spalte ${spalteVon(index, groesse) + 1}`;
}

/** Ein Feldindex ist gültig, wenn er eine ganze Zahl im Raster ist. */
function feldGueltig(index, groesse = GROESSE) {
  return Number.isInteger(index) && index >= 0 && index < felderAnzahl(groesse);
}

/**
 * Setzt ein Symbol. Dasselbe Symbol noch einmal auf dasselbe Feld nimmt es
 * wieder weg; ein anderes Symbol ersetzt das alte. Gibt einen NEUEN Plan
 * zurück und lässt den alten unberührt. Ungültiges Feld oder unbekanntes
 * Symbol: der Plan kommt unverändert zurück.
 */
export function setzeSymbol(plan, index, symbolId, symbole) {
  if (!feldGueltig(index) || !symbole.some((s) => s.id === symbolId)) return plan;
  const neu = { ...plan };
  if (neu[index] === symbolId) delete neu[index];
  else neu[index] = symbolId;
  return neu;
}

/**
 * Legt die Himmelsrichtung fest. Der Zustand ist { plan, norden }; es kommt
 * ein neuer Zustand zurück. Eine Kante, die es nicht gibt, ist ein Fehler.
 */
export function setzeNorden(zustand, kante) {
  if (!KANTEN.some((k) => k.id === kante)) throw new Error(`Unbekannte Kante: ${kante}`);
  return { ...zustand, norden: kante };
}

export function leerePlan() {
  return {};
}

/** Wie viele Felder sind belegt? */
export function anzahlGelegt(plan) {
  return Object.keys(plan || {}).length;
}

/**
 * Liest den gespeicherten Zustand aus dem Text der Quelle (null, wenn nichts da
 * ist). Übernimmt nur bekannte Symbole auf gültigen Feldern, damit ein alter
 * oder verfälschter Eintrag den Plan nicht unsichtbar verfälscht. Bei jedem
 * Lesefehler kommt ein leerer Plan mit Norden oben zurück.
 */
export function ladeZustand(text, symbole) {
  const leer = { plan: leerePlan(), norden: 'oben' };
  if (!text) return leer;
  try {
    const roh = JSON.parse(text);
    const plan = {};
    for (const [index, id] of Object.entries(roh.plan || {})) {
      const feld = Number(index);
      if (feldGueltig(feld) && symbole.some((s) => s.id === id)) plan[feld] = id;
    }
    const norden = KANTEN.some((k) => k.id === roh.norden) ? roh.norden : 'oben';
    return { plan, norden };
  } catch {
    return leer;
  }
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

/**
 * Pflichtmarkierung auf jedem gedruckten Blatt. Sie steht dort, weil die
 * Daten Seitenangaben tragen (Praleska S. 138); geprüft ist nur der Quelltext.
 */
export const PFLICHTMARKIERUNG = 'Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.';

/**
 * Der Druckbogen als Daten. Im Druck stehen keine Zeichen, nur Nummern: Jedes
 * Symbol bekommt seine Position in der Symbolliste als Nummer, und die
 * Zeichenerklärung nennt dieselbe Nummer. So bleibt der Plan lesbar, auch wenn
 * der Drucker keine Emojis kann. Seitenzahlen stehen nicht auf dem Blatt.
 */
export function druckInhalt(plan, symbole, norden, groesse = GROESSE) {
  const nummer = new Map(symbole.map((s, i) => [s.id, i + 1]));
  const kante = KANTEN.find((k) => k.id === norden) ?? KANTEN[0];
  return {
    kopf: 'Kita-Kartograph, Eigenentwurf',
    titel: 'Euer Raum',
    norden: `Norden ist ${kante.name}.`,
    felder: Array.from({ length: felderAnzahl(groesse) }, (_, i) => nummer.get(plan[i]) ?? ''),
    legende: legende(plan, symbole).map((s) => ({ nummer: nummer.get(s.id), name: s.name, anzahl: s.anzahl })),
    pflicht: PFLICHTMARKIERUNG,
  };
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
