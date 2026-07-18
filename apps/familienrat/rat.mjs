// Familienrat (für ELTERN+KIND 6-15, docs/09 Ось F): reine Logik ohne DOM,
// testbar. Die Familie stimmt gemeinsam über Vorlagen ab (offene Abstimmung),
// erhält einen druckbaren Familienbeschluss und kann das Ergebnis als
// „Familien-Koffer“ als Datei exportieren/zusammenführen – ganz ohne Server.

export const KOFFER_ART = 'familienrat-beschluss';
export const KOFFER_VERSION = 1;

/** Abstimmungs-Vorlagen für den Familienrat. */
export const VORLAGEN = Object.freeze([
  { titel: 'Handyfreie Essenszeiten?', frage: 'Wollen wir bei den Mahlzeiten alle Geräte weglegen?', optionen: ['Ja, immer', 'Nur beim Abendessen', 'Erst mal testen', 'Nein'] },
  { titel: 'Neues Spiel anschaffen?', frage: 'Schaffen wir das gewünschte Spiel an?', optionen: ['Ja', 'Erst zusammen prüfen', 'Später', 'Nein'] },
  { titel: 'Bildschirmzeit am Wochenende', frage: 'Wie viel Bildschirmzeit am Wochenende pro Tag?', optionen: ['30 Minuten', '1 Stunde', '2 Stunden', 'Je nach Wetter/Plan'] },
  { titel: 'Gerätefreie Zone', frage: 'Wo sollen keine Geräte sein?', optionen: ['Kinderzimmer nachts', 'Am Esstisch', 'Auto/Unterwegs', 'Überall beim Reden'] },
]);

/** Neue Abstimmung mit Zählern auf 0. */
export function neueAbstimmung(frage, optionen) {
  const opts = [...optionen];
  return { frage: String(frage), optionen: opts, stimmen: opts.map(() => 0) };
}

/** Eine Stimme abgeben (offen, Familienrat) – unveränderlich. */
export function stimme(abstimmung, index) {
  if (index < 0 || index >= abstimmung.optionen.length) return abstimmung;
  return { ...abstimmung, stimmen: abstimmung.stimmen.map((s, i) => (i === index ? s + 1 : s)) };
}

/** Ergebnis: absteigend sortiert, Gewinner oder Gleichstand. */
export function ergebnis(abstimmung) {
  const zeilen = abstimmung.optionen
    .map((text, i) => ({ text, stimmen: abstimmung.stimmen[i] }))
    .sort((a, b) => b.stimmen - a.stimmen);
  const gesamt = abstimmung.stimmen.reduce((s, n) => s + n, 0);
  const max = zeilen.length ? zeilen[0].stimmen : 0;
  const fuehrende = zeilen.filter((z) => z.stimmen === max && max > 0);
  return {
    zeilen,
    gesamt,
    gleichstand: fuehrende.length > 1,
    gewinner: max > 0 && fuehrende.length === 1 ? fuehrende[0].text : null,
  };
}

/** Druckbarer Familienbeschluss (Text). */
export function baueBeschluss(abstimmung, { datum = '', thema = '' } = {}) {
  const e = ergebnis(abstimmung);
  const zeilen = [
    'Familienbeschluss',
    thema ? `Thema: ${thema}` : '',
    datum ? `Datum: ${datum}` : '',
    '',
    `Frage: ${abstimmung.frage}`,
    '',
    'Ergebnis:',
    ...e.zeilen.map((z) => `  ${z.text}: ${z.stimmen} Stimme(n)`),
    '',
    e.gleichstand
      ? 'Unentschieden – wir reden noch einmal und stimmen neu ab.'
      : e.gewinner
        ? `Beschlossen: ${e.gewinner}`
        : 'Noch keine Stimmen abgegeben.',
    '',
    'Unterschriften:',
    '  _______________    _______________    _______________',
    '',
    'Ein Familienrat-Beschluss – gemeinsam entschieden, gilt für alle (auch Eltern).',
  ].filter((z) => z !== '');
  return zeilen.join('\n');
}

/** Ergebnis als „Familien-Koffer“ (Datei-Export). */
export function packeFamilienKoffer(abstimmung) {
  return JSON.stringify({
    art: KOFFER_ART,
    version: KOFFER_VERSION,
    frage: abstimmung.frage,
    optionen: abstimmung.optionen,
    stimmen: abstimmung.stimmen,
  }, null, 2);
}

/** Prüft einen importierten Familien-Koffer (leere Liste = gültig). */
export function pruefeFamilienKoffer(inhalt) {
  const fehler = [];
  if (typeof inhalt !== 'object' || inhalt === null) return ['Keine gültige Familien-Koffer-Datei'];
  if (inhalt.art !== KOFFER_ART) fehler.push('Das ist keine Familienrat-Datei');
  if (inhalt.version !== KOFFER_VERSION) fehler.push('Unbekannte Datei-Version');
  if (typeof inhalt.frage !== 'string' || !inhalt.frage) fehler.push('Frage fehlt');
  if (!Array.isArray(inhalt.optionen) || inhalt.optionen.length < 2) fehler.push('Optionen fehlen');
  if (!Array.isArray(inhalt.stimmen) || !inhalt.stimmen.every((s) => Number.isInteger(s) && s >= 0)) fehler.push('Stimmen ungültig');
  else if (Array.isArray(inhalt.optionen) && inhalt.stimmen.length !== inhalt.optionen.length) fehler.push('Stimmen passen nicht zu den Optionen');
  return fehler;
}

/** Führt einen importierten Koffer mit der laufenden Abstimmung zusammen. */
export function vereinigeFamilienKoffer(laufend, importiert) {
  if (!laufend) return neueAbstimmung(importiert.frage, importiert.optionen).stimmen
    ? { frage: importiert.frage, optionen: [...importiert.optionen], stimmen: [...importiert.stimmen] }
    : null;
  const gleich = laufend.frage === importiert.frage
    && laufend.optionen.length === importiert.optionen.length
    && laufend.optionen.every((o, i) => o === importiert.optionen[i]);
  if (!gleich) return null;
  return { frage: laufend.frage, optionen: [...laufend.optionen], stimmen: laufend.stimmen.map((s, i) => s + importiert.stimmen[i]) };
}
