// Daten-Radiergummi: reine Logik (ohne DOM), testbar.
// Modell: Ein gepostetes Foto verteilt sich als Kopien-Netz. Das Loeschrecht
// (DSGVO Art. 17) erreicht Server und Partner - aber nicht jede Kopie.

export const AUSBREITUNG = Object.freeze([
  { id: 'du', name: 'Dein Handy', emoji: '📱', typ: 'du', loeschbar: null, satz: 'Du postest das Foto in der (erfundenen) App „GlitzerPic“.' },
  { id: 'server', name: 'GlitzerPic-Server', emoji: '🖥️', typ: 'server', loeschbar: true, satz: 'Die App speichert dein Foto auf ihrem Server - sonst könnte es niemand sehen.' },
  { id: 'backup', name: 'Backup-Server', emoji: '💾', typ: 'server', loeschbar: true, satz: 'Der Server macht automatisch Sicherheitskopien - dein Foto liegt jetzt doppelt.' },
  { id: 'werbe1', name: 'Werbepartner A', emoji: '📢', typ: 'partner', loeschbar: true, satz: 'GlitzerPic teilt Daten mit Werbefirmen (steht klein in den AGB) - Kopie Nummer vier.' },
  { id: 'analyse', name: 'Analyse-Dienst', emoji: '📊', typ: 'partner', loeschbar: true, satz: 'Ein Statistik-Dienst wertet aus, wie gut dein Foto „läuft“ - Kopie Nummer fünf.' },
  { id: 'screenshot', name: 'Screenshot bei Sam', emoji: '📸', typ: 'kopie', loeschbar: false, satz: 'Sam aus der Parallelklasse macht einen Screenshot. Diese Kopie kennt keine Löschtaste.' },
]);

/** Anzahl Kopien ausserhalb deines Handys. */
export function kopienZahl() {
  return AUSBREITUNG.filter((k) => k.typ !== 'du').length;
}

/**
 * Wendet das Loeschrecht an: Server und Partner muessen loeschen,
 * private Kopien (Screenshots) erreicht es nicht.
 */
export function radiere() {
  const geloescht = AUSBREITUNG.filter((k) => k.loeschbar === true);
  const bleibt = AUSBREITUNG.filter((k) => k.loeschbar === false);
  return { geloescht, bleibt };
}

export const LEKTIONEN = Object.freeze([
  '🧽 Dein Löschrecht ist ECHT: Nach Artikel 17 der DSGVO müssen App-Server UND ihre Partner deine Daten löschen, wenn ihr es verlangt (Eltern helfen beim Schreiben).',
  '📸 Aber: Screenshots und private Kopien erreicht kein Radiergummi der Welt. Was einmal bei anderen Menschen ist, bleibt dort vielleicht für immer.',
  '🛡️ Darum die goldene Reihenfolge: ERST denken („Würde ich das auf ein Plakat am Schultor kleben?“), DANN posten. Der beste Radiergummi ist der, den man nie braucht.',
  '🗣️ Schon passiert? Kein Drama draus machen - aber handeln: Erwachsenen sagen, Löschung verlangen, bei Ärger hilft die Nummer gegen Kummer 116 111.',
]);

export const MUSTER_SATZ = 'Hallo, ich bin unter 16. Bitte löscht alle Daten und Bilder von mir nach Artikel 17 DSGVO. Bitte bestätigt mir die Löschung. (Absenden am besten zusammen mit deinen Eltern.)';
