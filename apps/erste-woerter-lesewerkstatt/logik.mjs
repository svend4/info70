// Erste-Wörter-Lesewerkstatt: reine Logik (ohne DOM), testbar. Drei Stufen
// nach der Silbenmethode: Vokale hören → Silben hören → lautgetreue Wörter
// lesen (Bild-Selbstkontrolle). Praleska docs/10 (Top-30 Nr. 25).

const zufall = (liste) => liste[Math.floor(Math.random() * liste.length)];

/** Erlaubte Buchstaben für lautgetreue Wörter (Silbenmethode + wenige Zusätze). */
export const ERLAUBTE_BUCHSTABEN = new Set([
  'A', 'E', 'I', 'O', 'U',
  'M', 'L', 'S', 'N', 'R', 'T', 'P', 'F',
  'B', 'D', 'G', 'H', 'K', 'W',
]);

/** Lautgetreu-Prüfung: nur erlaubte Buchstaben, kein Dehnungs-h, keine Doppelbuchstaben. */
export function istLautgetreu(wort) {
  const w = String(wort);
  if (!/^[A-Z]{2,7}$/.test(w)) return false;
  for (const b of w) if (!ERLAUBTE_BUCHSTABEN.has(b)) return false;
  for (let i = 1; i < w.length; i++) {
    if (w[i] === w[i - 1]) return false; // Doppelbuchstabe
    if (w[i] === 'H' && 'AEIOU'.includes(w[i - 1])) return false; // Dehnungs-h
  }
  return true;
}

/** Prüft das Material. Liefert Fehlerliste (leer = gültig). */
export function pruefeMaterial(daten) {
  const fehler = [];
  if (!Array.isArray(daten?.vokale) || daten.vokale.length !== 5) fehler.push('5 Vokale erwartet');
  if (!Array.isArray(daten?.konsonanten) || daten.konsonanten.length !== 8) fehler.push('8 Konsonanten erwartet');
  if (!Array.isArray(daten?.silben) || daten.silben.length < 10) fehler.push('mindestens 10 Silben');
  for (const s of daten?.silben ?? []) {
    if (!/^[A-Z]{2}$/.test(s)) { fehler.push(`Silbe ${s}: 2 Buchstaben`); continue; }
    if (!daten.konsonanten.includes(s[0])) fehler.push(`Silbe ${s}: Konsonant ${s[0]} nicht in der 8er-Liste`);
    if (!daten.vokale.includes(s[1])) fehler.push(`Silbe ${s}: ${s[1]} ist kein Vokal`);
  }
  if (!Array.isArray(daten?.woerter) || daten.woerter.length < 10) fehler.push('mindestens 10 Wörter');
  const gesehen = new Set();
  for (const w of daten?.woerter ?? []) {
    if (!w.wort || gesehen.has(w.wort)) fehler.push(`Wort fehlt/doppelt: ${w.wort}`);
    gesehen.add(w.wort);
    if (!w.emoji) fehler.push(`${w.wort}: Bild (Emoji) fehlt`);
    if (!istLautgetreu(w.wort)) fehler.push(`${w.wort}: nicht lautgetreu`);
  }
  return fehler;
}

/**
 * Optionen für eine Hör-Aufgabe (Vokal oder Silbe): richtige + 2 Ablenker aus
 * demselben Vorrat. Injizierbarer Wähler für Testbarkeit.
 * @returns {string[]} 3 eindeutige Optionen, richtige an Position 0
 */
export function hoerOptionen(richtig, vorrat, waehle = zufall) {
  const optionen = [richtig];
  const rest = vorrat.filter((x) => x !== richtig);
  while (optionen.length < 3 && rest.length) {
    const wahl = waehle(rest);
    optionen.push(wahl);
    rest.splice(rest.indexOf(wahl), 1);
  }
  return optionen;
}

/**
 * Bild-Optionen für ein Wort: richtiges Emoji + 2 Ablenker-Emojis anderer Wörter.
 * @returns {{emoji: string, richtig: boolean}[]} richtige an Position 0
 */
export function bildOptionen(wort, alle, waehle = zufall) {
  const andere = alle.filter((w) => w.wort !== wort.wort);
  const optionen = [{ emoji: wort.emoji, richtig: true }];
  const rest = [...andere];
  while (optionen.length < 3 && rest.length) {
    const wahl = waehle(rest);
    rest.splice(rest.indexOf(wahl), 1);
    if (optionen.some((o) => o.emoji === wahl.emoji)) continue;
    optionen.push({ emoji: wahl.emoji, richtig: false });
  }
  return optionen;
}

/** Silbenbögen: Wort in Sprechsilben (einfaches KV-Muster: Trennung vor Konsonant+Vokal). */
export function silbenTeilen(wort) {
  const w = String(wort);
  const istVokal = (c) => 'AEIOU'.includes(c);
  const teile = [];
  let aktuell = '';
  for (let i = 0; i < w.length; i++) {
    aktuell += w[i];
    const naechster = w[i + 1];
    const uebernaechster = w[i + 2];
    // Schnitt nach Vokal, wenn danach Konsonant+Vokal folgt (O|MA, TO|MA|TE)
    if (istVokal(w[i]) && naechster && !istVokal(naechster) && uebernaechster && istVokal(uebernaechster)) {
      teile.push(aktuell);
      aktuell = '';
    }
  }
  if (aktuell) teile.push(aktuell);
  return teile;
}
