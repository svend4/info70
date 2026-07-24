// Tonleiter-Treppe – reine Logik (ohne DOM/Audio), testbar mit node --test.
// Notenlern-Modul nach dem „Lesenka“-Prinzip: erst der erste Tetrachord
// (Do-Re-Mi-Fa), dann der zweite (Sol-La-Si-Do). Relative Solmisation plus
// deutsche Tonnamen (c–c'), Frequenzen der gleichstufigen Stimmung (C-Dur,
// eingestrichene Oktave). Praleska docs/10 (Kinder-Apps Nr. 6).

export const TONLEITER = [
  { stufe: 1, solmisation: 'Do', deutsch: 'c', hz: 261.63 },
  { stufe: 2, solmisation: 'Re', deutsch: 'd', hz: 293.66 },
  { stufe: 3, solmisation: 'Mi', deutsch: 'e', hz: 329.63 },
  { stufe: 4, solmisation: 'Fa', deutsch: 'f', hz: 349.23 },
  { stufe: 5, solmisation: 'Sol', deutsch: 'g', hz: 392.0 },
  { stufe: 6, solmisation: 'La', deutsch: 'a', hz: 440.0 },
  { stufe: 7, solmisation: 'Si', deutsch: 'h', hz: 493.88 },
  { stufe: 8, solmisation: 'Do', deutsch: 'c′', hz: 523.25 },
];

export const TETRACHORDE = {
  erster: [1, 2, 3, 4],
  zweiter: [5, 6, 7, 8],
};

/** Eintrag der Tonleiter für Stufe 1..8, sonst null. */
export function tonFuer(stufe) {
  return TONLEITER.find((t) => t.stufe === stufe) ?? null;
}

/** Welche der beiden Stufen klingt höher? (größere Stufe = höherer Ton) */
export function hoehereStufe(a, b) {
  return a >= b ? a : b;
}

/** Richtung einer Stufenfolge: 'rauf' | 'runter' | 'gemischt'. */
export function richtungVon(folge) {
  if (!Array.isArray(folge) || folge.length < 2) return 'gemischt';
  const rauf = folge.every((s, i) => i === 0 || s > folge[i - 1]);
  const runter = folge.every((s, i) => i === 0 || s < folge[i - 1]);
  if (rauf) return 'rauf';
  if (runter) return 'runter';
  return 'gemischt';
}

/** Stimmen zwei Stufenfolgen überein (Nachbau-Aufgabe)? */
export function folgeRichtig(vorgabe, eingabe) {
  return Array.isArray(vorgabe) && Array.isArray(eingabe)
    && vorgabe.length === eingabe.length
    && vorgabe.every((s, i) => s === eingabe[i]);
}

/**
 * Baut eine Aufgabe. waehle: (liste) => Element – injizierbar für Tests.
 * art 'hoeher':   zwei verschiedene Stufen → Frage „welcher Ton ist höher?“
 * art 'richtung': stufenweise Folge (Länge 3) rauf ODER runter im Tetrachord
 * art 'nachbau':  Folge der Länge `laenge` (2..4) innerhalb eines Tetrachords
 */
export function baueAufgabe(art, waehle, laenge = 3) {
  if (art === 'hoeher') {
    const a = waehle(TONLEITER).stufe;
    const b = waehle(TONLEITER.filter((t) => t.stufe !== a)).stufe;
    return { art, stufen: [a, b], richtig: hoehereStufe(a, b) };
  }
  if (art === 'richtung') {
    const tetra = waehle([TETRACHORDE.erster, TETRACHORDE.zweiter]);
    const runter = waehle([false, true]);
    const start = waehle([0, 1]); // Startindex im Tetrachord (3er-Folge passt ab 0 oder 1)
    const folge = tetra.slice(start, start + 3);
    if (runter) folge.reverse();
    return { art, stufen: folge, richtig: runter ? 'runter' : 'rauf' };
  }
  if (art === 'nachbau') {
    const tetra = waehle([TETRACHORDE.erster, TETRACHORDE.zweiter]);
    const n = Math.max(2, Math.min(4, laenge));
    const folge = [];
    for (let i = 0; i < n; i++) folge.push(waehle(tetra));
    return { art, stufen: folge, richtig: folge };
  }
  return null;
}

/** Validiert die Tonleiter: 8 Stufen, streng steigend, Oktave c→c′. */
export function pruefeTonleiter() {
  const fehler = [];
  if (TONLEITER.length !== 8) fehler.push('Tonleiter: 8 Stufen erwartet');
  for (let i = 0; i < TONLEITER.length; i++) {
    const t = TONLEITER[i];
    if (t.stufe !== i + 1) fehler.push(`Stufe ${i + 1}: falsche Nummerierung`);
    if (!t.solmisation || !t.deutsch) fehler.push(`Stufe ${t.stufe}: Namen fehlen`);
    if (i > 0 && t.hz <= TONLEITER[i - 1].hz) fehler.push(`Stufe ${t.stufe}: Frequenz nicht steigend`);
  }
  const oktave = TONLEITER[7].hz / TONLEITER[0].hz;
  if (Math.abs(oktave - 2) > 0.01) fehler.push(`Oktave: c′ muss die doppelte Frequenz von c haben (ist ×${oktave.toFixed(3)})`);
  const beide = [...TETRACHORDE.erster, ...TETRACHORDE.zweiter];
  if (beide.join(',') !== '1,2,3,4,5,6,7,8') fehler.push('Tetrachorde: müssen zusammen 1..8 ergeben');
  return fehler;
}
