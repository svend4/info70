// Ornament-Werkstatt – reine Logik (ohne DOM), testbar mit node --test.
// Ornamente sind gebaute Mathematik: eine kleine Gruppe von Kacheln wird nach
// einer Regel wiederholt (Periode), und viele Vorlagen sind links wie rechts
// gleich (Spiegelachse). Genau diese beiden Ideen – Rhythmus und Symmetrie –
// üben die Kinder hier. Praleska docs/10 (Kinder-Apps Nr. 8).

/** Formen des Kachel-Vorrats (geometrisch, wie in der Ornament-Tradition). */
export const FORMEN = [
  { id: 'raute', zeichen: '◆', name: 'Raute' },
  { id: 'quadrat', zeichen: '■', name: 'Quadrat' },
  { id: 'kreis', zeichen: '●', name: 'Kreis' },
  { id: 'dreieck', zeichen: '▲', name: 'Dreieck' },
  { id: 'kreuz', zeichen: '✚', name: 'Kreuz' },
  { id: 'stern', zeichen: '✳', name: 'Stern' },
];

/** Farben mit AA-tauglichem Kontrast auf hellem Grund. */
export const FARBEN = [
  { id: 'rot', name: 'Rot', wert: '#b91c1c' },
  { id: 'blau', name: 'Blau', wert: '#1d4ed8' },
  { id: 'gruen', name: 'Grün', wert: '#15803d' },
  { id: 'braun', name: 'Braun', wert: '#92400e' },
];

/**
 * Muster-Regeln. `muster` enthält Positionen im Kachel-Vorrat und wird
 * wiederholt – die Länge des Musters ist genau die Periode.
 */
export const REGELN = [
  { id: 'wiederholung', name: 'Wiederholung', muster: [0], erklaerung: 'Immer dieselbe Kachel – wie Perlen auf einer Schnur.' },
  { id: 'wechsel', name: 'Wechsel', muster: [0, 1], erklaerung: 'Zwei Kacheln lösen sich ab: eins, zwei, eins, zwei.' },
  { id: 'rhythmus', name: 'Rhythmus', muster: [0, 0, 1], erklaerung: 'Zwei gleiche, dann eine andere – immer wieder.' },
  { id: 'spiegel', name: 'Spiegel', muster: [0, 1, 1, 0], erklaerung: 'Vier Kacheln, in der Mitte gespiegelt: außen gleich, innen gleich.' },
];

export function formVon(id) {
  return FORMEN.find((f) => f.id === id) ?? null;
}

export function farbeVon(id) {
  return FARBEN.find((f) => f.id === id) ?? null;
}

export function regelVon(id) {
  return REGELN.find((r) => r.id === id) ?? null;
}

/** Zwei Kacheln (oder leere Felder) vergleichen. */
export function kachelGleich(a, b) {
  if (!a || !b) return !a && !b;
  return a.form === b.form && a.farbe === b.farbe;
}

/** Name einer Kachel zum Vorlesen: „rote Raute“. */
export function kachelName(kachel) {
  if (!kachel) return 'leeres Feld';
  const form = formVon(kachel.form);
  const farbe = farbeVon(kachel.farbe);
  if (!form || !farbe) return 'unbekannte Kachel';
  return `${form.name} in ${farbe.name}`;
}

/** Baut eine Kachelfolge nach einer Regel. */
export function musterFolge(regelId, kacheln, laenge) {
  const regel = regelVon(regelId);
  if (!regel) return [];
  return Array.from({ length: laenge }, (unbenutzt, i) => kacheln[regel.muster[i % regel.muster.length]]);
}

/** Kleinste Periode einer Folge (1 = alles gleich). */
export function periodeVon(folge) {
  for (let p = 1; p <= folge.length; p++) {
    let passt = true;
    for (let i = p; i < folge.length; i++) {
      if (!kachelGleich(folge[i], folge[i - p])) { passt = false; break; }
    }
    if (passt) return p;
  }
  return folge.length;
}

/** Welche Kachel kommt als nächste? (Periode fortsetzen) */
export function naechsteKachel(folge) {
  if (!folge?.length) return null;
  return folge[folge.length - periodeVon(folge)];
}

/**
 * Baut eine „Muster fortsetzen“-Aufgabe.
 * waehle: (liste) => Element – injizierbar, damit Tests bestimmbar sind.
 * Die Lösung steht in `optionen` immer zuerst; die App mischt sie.
 */
export function baueAufgabe(waehle, laenge = 6) {
  const regel = waehle(REGELN);
  const formA = waehle(FORMEN);
  const farbeA = waehle(FARBEN);
  const formB = waehle(FORMEN.filter((f) => f.id !== formA.id));
  const farbeB = waehle(FARBEN.filter((f) => f.id !== farbeA.id));
  const kachelA = { form: formA.id, farbe: farbeA.id };
  const kachelB = { form: formB.id, farbe: farbeB.id };
  const folge = musterFolge(regel.id, [kachelA, kachelB], laenge + 1);
  const gezeigt = folge.slice(0, laenge);
  const loesung = folge[laenge];
  // Ablenker: die jeweils andere Kachel und zwei „Beinahe“-Mischungen aus
  // Form und Farbe. Keine davon kann zufällig richtig sein, weil sich Form
  // und Farbe der beiden Kacheln unterscheiden.
  const andere = kachelGleich(loesung, kachelA) ? kachelB : kachelA;
  const optionen = [
    loesung,
    andere,
    { form: formB.id, farbe: farbeA.id },
    { form: formA.id, farbe: farbeB.id },
  ];
  return { regel: regel.id, gezeigt, loesung, optionen };
}

/** Aktive Felder einer Vorlage: raster-Zeilen aus '#' (Feld) und '.' (leer). */
export function aktiveFelder(vorlage) {
  return vorlage.raster.flatMap((zeile) => [...zeile].map((z) => z === '#'));
}

/** Gespiegelte Position (links/rechts) im Raster. */
export function spiegelIndex(index, spalten) {
  const zeile = Math.floor(index / spalten);
  const spalte = index % spalten;
  return zeile * spalten + (spalten - 1 - spalte);
}

/** Ist das gelegte Muster links wie rechts gleich? */
export function istSymmetrisch(zellen, spalten) {
  for (let i = 0; i < zellen.length; i++) {
    if (!kachelGleich(zellen[i] ?? null, zellen[spiegelIndex(i, spalten)] ?? null)) return false;
  }
  return true;
}

/**
 * Validiert die Vorlagen. Wichtigste Regel: die Umrisse müssen selbst
 * spiegelsymmetrisch sein – sonst könnte der Spiegel-Schalter eine Kachel auf
 * ein Feld setzen, das es gar nicht gibt.
 * @returns {string[]} Fehlerliste (leer = in Ordnung)
 */
export function pruefeVorlagen(daten) {
  const fehler = [];
  const vorlagen = daten?.vorlagen;
  if (!Array.isArray(vorlagen) || vorlagen.length < 4) return ['vorlagen fehlt oder weniger als 4 Vorlagen'];

  const ids = vorlagen.map((v) => v.id);
  if (new Set(ids).size !== ids.length) fehler.push('doppelte Vorlagen-ids');

  for (const v of vorlagen) {
    const wo = v.id ?? '<ohne id>';
    if (!v.id || !v.name || !v.emoji) fehler.push(`${wo}: id/name/emoji fehlt`);
    if (!(v.idee?.length >= 15)) fehler.push(`${wo}: Gestaltungsidee fehlt oder zu kurz`);
    if (!Array.isArray(v.raster) || v.raster.length < 1 || v.raster.length > 8) {
      fehler.push(`${wo}: raster braucht 1 bis 8 Zeilen`);
      continue;
    }
    if (!Number.isInteger(v.spalten) || v.spalten < 3 || v.spalten > 10) {
      fehler.push(`${wo}: spalten muss 3 bis 10 sein (Handy-Breite)`);
      continue;
    }
    if (v.raster.some((zeile) => zeile.length !== v.spalten)) {
      fehler.push(`${wo}: jede raster-Zeile braucht ${v.spalten} Zeichen`);
      continue;
    }
    if (v.raster.some((zeile) => [...zeile].some((z) => z !== '#' && z !== '.'))) {
      fehler.push(`${wo}: raster darf nur '#' und '.' enthalten`);
      continue;
    }
    const felder = aktiveFelder(v);
    if (felder.filter(Boolean).length < 6) fehler.push(`${wo}: mindestens 6 Felder zum Legen`);
    for (let i = 0; i < felder.length; i++) {
      if (felder[i] !== felder[spiegelIndex(i, v.spalten)]) {
        fehler.push(`${wo}: der Umriss ist nicht spiegelsymmetrisch`);
        break;
      }
    }
  }
  return fehler;
}
