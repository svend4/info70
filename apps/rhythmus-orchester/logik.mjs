// Rhythmus-Orchester – reine Logik (ohne DOM/Audio), testbar mit node --test.
// Rhythmus-Bausteine nach der in Deutschland üblichen Silbensprache der
// Elementarmusikpädagogik (Orff/Kodály-Tradition): ta = ein Schlag,
// ti-ti = zwei schnelle Töne auf einem Schlag, Pause = ein Schlag Stille.
// Jeder Baustein füllt genau einen Schlag – dadurch passt das Muster immer
// exakt auf die vier Felder des visuellen Metronoms (BFSG: mitmachen ohne
// Hören). Praleska docs/10 (Kinder-Apps Nr. 7).

/** Rhythmus-Bausteine. `silben` = Anzahl der Anschläge innerhalb eines Schlags. */
export const BAUSTEINE = [
  { id: 'ta', zeichen: '♩', name: 'ta', silben: 1, schlaege: 1, erklaerung: 'ein Ton, der einen ganzen Schlag dauert' },
  { id: 'titi', zeichen: '♫', name: 'ti-ti', silben: 2, schlaege: 1, erklaerung: 'zwei schnelle Töne auf einem Schlag' },
  { id: 'pause', zeichen: '⏸', name: 'Pause', silben: 0, schlaege: 1, erklaerung: 'ein Schlag Stille – Pausen gehören zur Musik' },
];

/** Klänge der Körper-Percussion (werden in app.mjs lokal synthetisiert). */
export const KLAENGE = ['klatschen', 'stampfen', 'schnipsen'];

/** Tempi in Schlägen pro Minute. */
export const TEMPI = [
  { id: 'langsam', name: 'Langsam', bpm: 60 },
  { id: 'mittel', name: 'Mittel', bpm: 80 },
  { id: 'schnell', name: 'Schnell', bpm: 100 },
];

export const SCHLAEGE_PRO_TAKT = 4;

/** Baustein-Eintrag zu einer id, sonst null. */
export function bausteinVon(id) {
  return BAUSTEINE.find((b) => b.id === id) ?? null;
}

/** Summe der Schläge eines Musters (Liste von Baustein-ids). */
export function schlaegeVon(muster) {
  if (!Array.isArray(muster)) return 0;
  return muster.reduce((summe, id) => summe + (bausteinVon(id)?.schlaege ?? 0), 0);
}

/** Passt das Muster genau in einen Takt? */
export function passtInTakt(muster, schlaege = SCHLAEGE_PRO_TAKT) {
  return schlaegeVon(muster) === schlaege && muster.every((id) => bausteinVon(id) !== null);
}

/** Stimmen zwei Muster überein (Nachbau-Aufgabe)? */
export function musterRichtig(vorgabe, eingabe) {
  return Array.isArray(vorgabe) && Array.isArray(eingabe)
    && vorgabe.length === eingabe.length
    && vorgabe.every((id, i) => id === eingabe[i]);
}

/**
 * Anschlagszeitpunkte eines Musters in Sekunden.
 * ti-ti ergibt zwei Anschläge im halben Schlagabstand, eine Pause keinen.
 * @returns {Array<{zeit:number, schlag:number, erster:boolean}>}
 */
export function anschlaege(muster, bpm, ab = 0) {
  const schlagDauer = 60 / bpm;
  const treffer = [];
  muster.forEach((id, i) => {
    const b = bausteinVon(id);
    if (!b || b.silben === 0) return;
    for (let k = 0; k < b.silben; k++) {
      treffer.push({
        zeit: ab + (i + k / b.silben) * schlagDauer,
        schlag: i + 1,
        erster: k === 0,
      });
    }
  });
  return treffer;
}

/** Welche Stimmen spielen in dieser Phrase schon mit? (Einsatz abwarten) */
export function stimmenFuerPhrase(stimmen, phrase) {
  return (stimmen ?? []).filter((s) => phrase >= s.einsatz);
}

/**
 * Baut ein Nachbau-Muster. waehle: (liste) => Element – injizierbar für Tests.
 * Reine Stille wäre keine Aufgabe: dann wird der erste Schlag zu „ta“.
 */
export function baueMuster(waehle, laenge = SCHLAEGE_PRO_TAKT) {
  const ids = BAUSTEINE.map((b) => b.id);
  const muster = [];
  for (let i = 0; i < laenge; i++) muster.push(waehle(ids));
  if (muster.every((id) => id === 'pause')) muster[0] = 'ta';
  return muster;
}

/** Silben eines Taktes den Bausteinen zuordnen: [{baustein, silben:[…]}] */
export function silbenGruppen(takt) {
  const gruppen = [];
  let i = 0;
  for (const id of takt.bausteine) {
    const anzahl = bausteinVon(id)?.silben ?? 0;
    gruppen.push({ baustein: id, silben: takt.silben.slice(i, i + anzahl) });
    i += anzahl;
  }
  return gruppen;
}

/** Anzeige-Zeile eines Taktes: „Ei-ne Wol-ke, grau und schwer,“ */
export function silbenText(takt) {
  return silbenGruppen(takt)
    .filter((g) => g.silben.length > 0)
    .map((g) => g.silben.join('-'))
    .join(' ');
}

/** Sprech-Zeile eines Taktes (für Vorlesen): „Eine Wolke, grau und schwer,“ */
export function sprechText(takt) {
  return silbenGruppen(takt)
    .filter((g) => g.silben.length > 0)
    .map((g) => g.silben.join(''))
    .join(' ');
}

/**
 * Validiert Verse und Orchester-Stimmen.
 * Kernregeln: jeder Takt füllt genau 4 Schläge, zu jedem Baustein gehört die
 * passende Silbenzahl (ti-ti = 2, ta = 1, Pause = 0), mindestens ein Vers übt
 * die Pause, und die drei Stimmen setzen nacheinander ein.
 * @returns {string[]} Fehlerliste (leer = in Ordnung)
 */
export function pruefeDaten(daten) {
  const fehler = [];
  const verse = daten?.verse;
  const stimmen = daten?.stimmen;
  if (!Array.isArray(verse) || verse.length < 4) return ['verse fehlt oder weniger als 4 Verse'];
  if (!Array.isArray(stimmen) || stimmen.length !== 3) fehler.push('stimmen: genau 3 Stimmen erwartet');

  const ids = verse.map((v) => v.id);
  if (new Set(ids).size !== ids.length) fehler.push('doppelte Vers-ids');

  for (const v of verse) {
    const wo = v.id ?? '<ohne id>';
    if (!v.id || !v.titel || !v.emoji) fehler.push(`${wo}: id/titel/emoji fehlt`);
    if (!(v.bewegung?.length >= 15)) fehler.push(`${wo}: Bewegungsidee fehlt oder zu kurz`);
    if (!Array.isArray(v.takte) || v.takte.length !== 2) {
      fehler.push(`${wo}: 2 Takte erwartet`);
      continue;
    }
    v.takte.forEach((takt, i) => {
      if (!passtInTakt(takt.bausteine ?? [])) fehler.push(`${wo} Takt ${i + 1}: muss genau ${SCHLAEGE_PRO_TAKT} Schläge haben`);
      const noetig = (takt.bausteine ?? []).reduce((s, id) => s + (bausteinVon(id)?.silben ?? 0), 0);
      if ((takt.silben ?? []).length !== noetig) {
        fehler.push(`${wo} Takt ${i + 1}: ${noetig} Silben erwartet, ${(takt.silben ?? []).length} gefunden`);
      }
      if ((takt.silben ?? []).some((s) => !s || !s.trim())) fehler.push(`${wo} Takt ${i + 1}: leere Silbe`);
    });
  }

  if (!verse.some((v) => v.takte?.some((t) => (t.bausteine ?? []).includes('pause')))) {
    fehler.push('kein Vers übt die Pause');
  }

  const einsaetze = new Set();
  for (const s of stimmen ?? []) {
    const wo = s.id ?? '<ohne id>';
    if (!s.id || !s.name || !s.emoji) fehler.push(`${wo}: id/name/emoji fehlt`);
    if (!KLAENGE.includes(s.klang)) fehler.push(`${wo}: unbekannter Klang "${s.klang}"`);
    if (!passtInTakt(s.muster ?? [])) fehler.push(`${wo}: Ostinato muss genau ${SCHLAEGE_PRO_TAKT} Schläge haben`);
    if ((s.muster ?? []).every((id) => id === 'pause')) fehler.push(`${wo}: Ostinato ist nur Stille`);
    if (!Number.isInteger(s.einsatz) || s.einsatz < 1 || s.einsatz > 3) fehler.push(`${wo}: einsatz muss 1..3 sein`);
    else einsaetze.add(s.einsatz);
  }
  if (Array.isArray(stimmen) && stimmen.length === 3) {
    if (einsaetze.size !== 3) fehler.push('die Stimmen müssen nacheinander einsetzen (drei verschiedene Einsätze)');
    if (!einsaetze.has(1)) fehler.push('eine Stimme muss in Phrase 1 beginnen');
  }
  return fehler;
}
