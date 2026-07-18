// Kinderrat: reine Logik (ohne DOM), testbar.
// Sitzungsmodus fuer die Beteiligung (docs/09 Nr. 31): Tagesordnung, Abstimmung
// mit Ergebnis-Begruendung und Protokoll als Datei-Export (Klassen-Koffer,
// kein Server). Kinder erleben ein formales Beteiligungsverfahren.

export const KOFFER_ART = 'kinderrat-protokoll';
export const KOFFER_VERSION = 1;

/** Abstimmungs-Ergebnis aus Stimmen. */
export function ergebnis(dafuer, dagegen) {
  if (dafuer > dagegen) return 'angenommen';
  if (dagegen > dafuer) return 'abgelehnt';
  return 'unentschieden';
}

/** Ist ein TOP fertig behandelt (abgestimmt + begruendet)? */
export function istBehandelt(top) {
  return top.abgestimmt === true && typeof top.begruendung === 'string' && top.begruendung.length > 0;
}

/**
 * Packt die Sitzung als Protokoll-Datei (Klassen-Koffer).
 * @param {{titel:string, datum:string, tops:Array<object>}} sitzung
 */
export function packeProtokoll(sitzung) {
  return JSON.stringify({
    art: KOFFER_ART,
    version: KOFFER_VERSION,
    titel: sitzung.titel,
    datum: sitzung.datum,
    tops: sitzung.tops.map((t) => ({
      thema: t.thema,
      dafuer: t.dafuer ?? 0,
      dagegen: t.dagegen ?? 0,
      enthaltung: t.enthaltung ?? 0,
      ergebnis: ergebnis(t.dafuer ?? 0, t.dagegen ?? 0),
      begruendung: t.begruendung ?? '',
    })),
  }, null, 2);
}

/** Protokoll als lesbaren Text (fuer Anzeige/Druck). */
export function protokollText(sitzung) {
  const zeilen = [
    `Protokoll: ${sitzung.titel}`,
    `Datum: ${sitzung.datum}`,
    '',
  ];
  sitzung.tops.forEach((t, i) => {
    zeilen.push(`TOP ${i + 1}: ${t.thema}`);
    zeilen.push(`  Abstimmung: ${t.dafuer ?? 0} dafür / ${t.dagegen ?? 0} dagegen / ${t.enthaltung ?? 0} Enthaltung`);
    zeilen.push(`  Ergebnis: ${ergebnis(t.dafuer ?? 0, t.dagegen ?? 0)}`);
    zeilen.push(`  Begründung: ${t.begruendung || '(keine)'}`);
    zeilen.push('');
  });
  return zeilen.join('\n');
}

/** Prueft eine eingelesene Protokoll-Datei. Leere Liste = gueltig. */
export function pruefeProtokoll(inhalt) {
  const fehler = [];
  if (typeof inhalt !== 'object' || inhalt === null) return ['Keine gültige Protokoll-Datei'];
  if (inhalt.art !== KOFFER_ART) fehler.push('Das ist keine Kinderrat-Datei');
  if (inhalt.version !== KOFFER_VERSION) fehler.push('Unbekannte Datei-Version');
  if (typeof inhalt.titel !== 'string' || !inhalt.titel) fehler.push('Titel fehlt');
  if (!Array.isArray(inhalt.tops)) fehler.push('Tagesordnung fehlt');
  else if (!inhalt.tops.every((t) => t && typeof t.thema === 'string' && t.thema.length > 0)) {
    fehler.push('Tagesordnungspunkte sind ungültig');
  }
  return fehler;
}

// Startvorschlaege fuer die Tagesordnung.
export const TOP_VORSCHLAEGE = Object.freeze([
  'Was war diese Woche gut in der Klasse?',
  'Wo gab es Streit – und was hilft?',
  'Neue Klassenregel vorschlagen',
  'Nächstes gemeinsames Projekt',
]);
