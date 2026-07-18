// Spiel-Recht-Balance: reine Logik (ohne DOM), testbar.
// Erweiterung des takt-pause-Gedankens (docs/09 Nr. 34): Der Tag ist nicht nur
// "Bildschirmzeit-Ampel", sondern eine Balance DREIER Rechte - Spiel/Medien,
// Ruhe und Draussen/Freunde. Erholung, Spiel und freie Zeit sind ein eigenes
// Kinderrecht (Art. 31 UN-KRK). Das Kind reguliert selbst, statt dass
// Erwachsene verbieten. Diese Datei wertet die selbst eingeschaetzten Werte aus.

export const RECHTE = Object.freeze([
  { code: 'medien', name: 'Spiel & Medien', emoji: '🎮', artikel: 'Art. 31: Recht auf Spiel', farbe: '#6d28d9' },
  { code: 'ruhe', name: 'Ruhe & Schlaf', emoji: '😴', artikel: 'Art. 31: Recht auf Ruhe', farbe: '#2563eb' },
  { code: 'draussen', name: 'Draußen & Freunde', emoji: '🌳', artikel: 'Art. 31: Recht auf Freizeit', farbe: '#15803d' },
]);

// Selbst-Einschaetzung je Recht, bewusst grob (kein Minuten-Tracking).
export const STUFEN = Object.freeze([
  { wert: 0, label: 'gar nicht' },
  { wert: 1, label: 'wenig' },
  { wert: 2, label: 'genug' },
  { wert: 3, label: 'viel' },
]);

/** Ein Recht kam "zu kurz", wenn es heute gar nicht oder nur wenig dran war. */
export function zuKurz(wert) {
  return wert <= 1;
}

/**
 * Wertet die drei selbst eingeschaetzten Werte aus.
 * @param {{medien?:number, ruhe?:number, draussen?:number}} werte
 * @returns {{ imGleichgewicht:boolean, zuKurz:string[], viel:string[], satz:string }}
 */
export function auswertung(werte) {
  const w = { medien: werte.medien ?? 0, ruhe: werte.ruhe ?? 0, draussen: werte.draussen ?? 0 };
  const kurz = RECHTE.filter((r) => zuKurz(w[r.code])).map((r) => r.code);
  const viel = RECHTE.filter((r) => w[r.code] === 3).map((r) => r.code);
  const imGleichgewicht = kurz.length === 0;

  let satz;
  if (imGleichgewicht) {
    satz = '🌟 Schöne Balance! Heute kamen alle drei zu ihrem Recht – Spiel, Ruhe und Zeit draußen.';
  } else if (viel.includes('medien') && kurz.includes('draussen') && kurz.includes('ruhe')) {
    satz = '🎮 Heute stand Medien im Mittelpunkt. Ruhe und Draußen kamen zu kurz. Beide sind auch dein Recht – plane morgen etwas dafür ein.';
  } else {
    const namen = kurz.map((c) => RECHTE.find((r) => r.code === c).name);
    satz = `Heute kam zu kurz: ${namen.join(' und ')}. Das ist auch dein Recht. Was tust du morgen dafür?`;
  }
  return { imGleichgewicht, zuKurz: kurz, viel, satz };
}

/** Konkreter Selbst-Plan-Vorschlag fuer ein zu kurz gekommenes Recht. */
export function vorschlag(code) {
  return {
    medien: 'Nimm dir morgen bewusst Zeit für dein Lieblingsspiel – geplant, nicht nebenbei.',
    ruhe: 'Plane morgen eine echte Pause ohne Bildschirm ein: raus aus dem Zimmer, einfach mal nichts.',
    draussen: 'Verabrede dich morgen zum Draußen-Spielen oder geh eine Runde an die frische Luft.',
  }[code] ?? '';
}

export const LEKTIONEN = Object.freeze([
  '⚖️ Dein Tag hat drei Rechte, nicht nur eins: Spielen und Medien gehören dazu – aber Ruhe und Zeit draußen genauso. Keins ist „gut“ oder „böse“, es geht um die Mischung.',
  '📜 Erholung ist ein Recht: In der Kinderrechtskonvention steht (Artikel 31), dass du ein Recht auf Ruhe, Freizeit und Spiel hast. Es geht nicht nur um Verbote von Erwachsenen – du darfst selbst darauf achten.',
  '🧭 Du bestimmst die Balance: Wenn ein Recht mehrere Tage zu kurz kommt, steuere selbst gegen. Das ist stärker als jede Bildschirm-Sperre – weil es deine Entscheidung ist.',
]);
