// Deepfake-Studio: reine Logik (ohne DOM), damit sie testbar ist.
// Baut aus Bausteinen (WER + WAS + Beweis-Optik) die Daten einer Fake-News-Karte.
// Politik (docs/02): Die Karte trägt IMMER die Kennzeichnung "ERFUNDEN" -
// die App hält sich selbst an die Regel, die sie lehrt (AI Act, Art. 50).

/** Pflicht-Kennzeichnung jeder erzeugten Fälschung (AI-Act-Lektion). */
export const KENNZEICHNUNG = 'ERFUNDEN';

/**
 * Ersten Buchstaben groß schreiben (für den Satzanfang der Schlagzeile).
 * @param {string} text
 */
export function grossAnfang(text) {
  return text.length === 0 ? text : text[0].toLocaleUpperCase('de-DE') + text.slice(1);
}

/**
 * Baut die Schlagzeile: "Der Bürgermeister von Wolkenstadt hat ... gefüllt!"
 * @param {string} werText Rolle in Kleinschreibung mit Artikel ("der ...", "eine ...")
 * @param {string} wasText Prädikat ("hat ... gefüllt")
 */
export function baueSchlagzeile(werText, wasText) {
  return `${grossAnfang(werText.trim())} ${wasText.trim()}!`;
}

/**
 * Baut die Daten der News-Karte aus der Auswahl des Kindes.
 * @param {{ werId: string, wasId: string, mitFoto?: boolean, mitAugenzeuge?: boolean, mitKommentaren?: boolean, mitTeilen?: boolean }} auswahl
 * @param {{ wer: Array<{id: string, text: string, emoji: string}>, was: Array<{id: string, text: string, emoji: string}>, augenzeugen: string[], kommentare: Array<{name: string, text: string}> }} daten
 * @param {() => number} [zufall] injizierbar für deterministische Tests
 * @returns {{ schlagzeile: string, fotoEmojis: string|null, augenzeuge: string|null, kommentare: Array<{name: string, text: string}>, teilen: number|null, kennzeichnung: string }}
 */
export function baueKarte(auswahl, daten, zufall = Math.random) {
  const wer = daten.wer.find((b) => b.id === auswahl.werId);
  const was = daten.was.find((b) => b.id === auswahl.wasId);
  if (!wer || !was) throw new Error('baueKarte: unbekannter Baustein');
  const wahl = (liste) => liste[Math.floor(zufall() * liste.length)];
  const kommentare = [];
  if (auswahl.mitKommentaren) {
    const uebrig = [...daten.kommentare];
    while (kommentare.length < 2 && uebrig.length > 0) {
      kommentare.push(uebrig.splice(Math.floor(zufall() * uebrig.length), 1)[0]);
    }
  }
  return {
    schlagzeile: baueSchlagzeile(wer.text, was.text),
    fotoEmojis: auswahl.mitFoto ? `${wer.emoji}${was.emoji}` : null,
    augenzeuge: auswahl.mitAugenzeuge ? wahl(daten.augenzeugen) : null,
    kommentare,
    teilen: auswahl.mitTeilen ? 12 + Math.floor(zufall() * 30) : null,
    kennzeichnung: KENNZEICHNUNG,
  };
}

/**
 * Nächster Wert des hochtickenden Teilen-Zählers (wächst immer um 1-6).
 * @param {number} wert @param {() => number} [zufall]
 */
export function naechsterTeilenWert(wert, zufall = Math.random) {
  return wert + 1 + Math.floor(zufall() * 6);
}

/**
 * Stoppuhr-Text: "7 Sekunden" / "1 Sekunde" (mindestens 1 Sekunde).
 * @param {number} ms
 */
export function dauerText(ms) {
  const sekunden = Math.max(1, Math.round(ms / 1000));
  return `${sekunden} ${sekunden === 1 ? 'Sekunde' : 'Sekunden'}`;
}

/**
 * Schema-Prüfung der Bausteinbank (für Tests und Datenpflege).
 * @param {unknown} daten geparster Inhalt von daten/bausteine.json
 * @returns {string[]} Liste der Fehler; leer = gültig
 */
export function pruefeBausteine(daten) {
  const fehler = [];
  if (typeof daten !== 'object' || daten === null) return ['Wurzel ist kein Objekt'];
  const d = /** @type {Record<string, any>} */ (daten);
  if (typeof d.version !== 'number') fehler.push('version fehlt');
  if (typeof d.zeitung !== 'string' || d.zeitung.length === 0) fehler.push('zeitung fehlt');

  for (const feld of ['wer', 'was']) {
    const liste = d[feld];
    if (!Array.isArray(liste) || liste.length < 4) {
      fehler.push(`${feld}: mindestens 4 Bausteine nötig`);
      continue;
    }
    const ids = new Set();
    liste.forEach((b, i) => {
      if (typeof b.id !== 'string' || b.id.length === 0) fehler.push(`${feld}[${i}]: id fehlt`);
      if (ids.has(b.id)) fehler.push(`${feld}[${i}]: id "${b.id}" doppelt`);
      ids.add(b.id);
      if (typeof b.text !== 'string' || b.text.length < 5) fehler.push(`${feld}[${i}]: text fehlt/zu kurz`);
      else if (b.text[0] !== b.text[0].toLocaleLowerCase('de-DE')) fehler.push(`${feld}[${i}]: text muss klein beginnen (wird zur Schlagzeile zusammengesetzt)`);
      if (typeof b.emoji !== 'string' || b.emoji.length === 0) fehler.push(`${feld}[${i}]: emoji fehlt`);
    });
  }

  if (!Array.isArray(d.augenzeugen) || d.augenzeugen.length < 2) fehler.push('augenzeugen: mindestens 2 nötig');
  else d.augenzeugen.forEach((a, i) => {
    if (typeof a !== 'string' || a.length < 10) fehler.push(`augenzeugen[${i}]: zu kurz`);
  });

  if (!Array.isArray(d.kommentare) || d.kommentare.length < 3) fehler.push('kommentare: mindestens 3 nötig');
  else d.kommentare.forEach((k, i) => {
    if (typeof k.name !== 'string' || k.name.length === 0) fehler.push(`kommentare[${i}]: name fehlt`);
    if (typeof k.text !== 'string' || k.text.length === 0) fehler.push(`kommentare[${i}]: text fehlt`);
  });

  return fehler;
}
