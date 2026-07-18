// Vorlese-Kompass 1-3: reine Logik (ohne DOM), testbar. Content-Guide zum
// dialogischen Vorlesen. Praleska docs/10 (Top-30 Nr. 14).

/** Prüft die Kompass-Daten. Liefert Fehlerliste. */
export function pruefeKompass(daten) {
  const fehler = [];
  const schritte = daten?.methode?.schritte;
  if (!Array.isArray(schritte) || schritte.length !== 7) fehler.push('Es werden genau 7 Methoden-Schritte erwartet');
  else for (const s of schritte) if (typeof s !== 'string' || s.length < 15) fehler.push('Schritt zu kurz');
  if (!Array.isArray(daten?.altersstufen) || daten.altersstufen.length < 3) fehler.push('mindestens 3 Altersstufen');
  if (!Array.isArray(daten?.kanon) || daten.kanon.length < 4) fehler.push('mindestens 4 Kanon-Buchtypen');
  for (const a of daten?.altersstufen ?? []) {
    if (!a.was || !a.tipp) fehler.push(`Altersstufe ${a.id}: was/tipp fehlt`);
  }
  return fehler;
}

/** Vorlese-Text der Methode (für die Vorlese-Funktion). */
export function methodeText(daten) {
  return `${daten.methode.name}. ` + daten.methode.schritte.map((s, i) => `${i + 1}. ${s}`).join(' ');
}

/** Nächster Index im Kreis (für „nächster Tipp“). */
export function naechsterIndex(aktuell, laenge) {
  if (laenge <= 0) return 0;
  return (aktuell + 1) % laenge;
}
