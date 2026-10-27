// Uhr- und Kalender-Kind: reine Logik (ohne DOM), testbar. Analoguhr-Winkel,
// kindgerechte Uhrzeit-Sprache (volle/halbe/Viertelstunde) und Prüfung der
// Fragenbank. Praleska docs/10 (Top-30 Nr. 24).

/** Zeigerwinkel in Grad (0° = 12 Uhr, im Uhrzeigersinn). */
export function zeigerWinkel(stunde, minute) {
  return {
    minute: minute * 6,
    stunde: ((stunde % 12) * 30) + minute * 0.5,
  };
}

/** Kindgerechte Uhrzeit: volle Stunde, halb, Viertel nach, Viertel vor. */
export function uhrText(stunde, minute) {
  const s = ((stunde - 1) % 12) + 1; // 1..12
  const naechste = (s % 12) + 1;
  if (minute === 0) return `${s} Uhr`;
  if (minute === 30) return `halb ${naechste}`;
  if (minute === 15) return `Viertel nach ${s}`;
  if (minute === 45) return `Viertel vor ${naechste}`;
  return `${s} Uhr ${minute}`;
}

/** Optionstexte einer Uhr-Frage: richtige Zeit + Ablenker (Reihenfolge wie geliefert). */
export function uhrOptionen(frage) {
  return [frage.zeit, ...frage.ablenker].map((z) => uhrText(z.stunde, z.minute));
}

/** Prüft die Fragenbank. Liefert Fehlerliste (leer = gültig). */
export function pruefeFragen(daten) {
  const fehler = [];
  if (!Array.isArray(daten?.fragen) || daten.fragen.length < 10) return ['zu wenige Fragen'];
  const ids = new Set();
  const ERLAUBT = [0, 15, 30, 45];
  for (const q of daten.fragen) {
    if (!q.id || ids.has(q.id)) fehler.push(`Id fehlt/doppelt: ${q.id}`);
    ids.add(q.id);
    if (!q.erklaerung || q.erklaerung.length < 20) fehler.push(`${q.id}: Erklärung fehlt`);
    if (q.typ === 'uhr') {
      if (!ERLAUBT.includes(q.zeit?.minute)) fehler.push(`${q.id}: Minute nur 0/15/30/45`);
      if (!Array.isArray(q.ablenker) || q.ablenker.length !== 2) fehler.push(`${q.id}: 2 Ablenker`);
      const texte = uhrOptionen(q);
      if (new Set(texte).size !== texte.length) fehler.push(`${q.id}: Ablenker klingt wie die richtige Zeit`);
    } else if (q.typ === 'kalender') {
      if (!Array.isArray(q.antworten) || q.antworten.length !== 3) fehler.push(`${q.id}: 3 Antworten`);
      if (!Number.isInteger(q.korrekt) || q.korrekt < 0 || q.korrekt > 2) fehler.push(`${q.id}: korrekt 0..2`);
    } else {
      fehler.push(`${q.id}: unbekannter Typ ${q.typ}`);
    }
  }
  const typen = new Set(daten.fragen.map((q) => q.typ));
  if (!typen.has('uhr') || !typen.has('kalender')) fehler.push('beide Typen (uhr/kalender) nötig');
  return fehler;
}
