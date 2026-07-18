// Barriere-Spürnasen: reine Logik (ohne DOM), testbar (docs/09 Nr. 154).
// Kleiner Simulator: dieselbe Beispielseite mit/ohne Barrierefreiheits-
// Merkmale. Kinder (8-12) schalten die Merkmale einzeln ein und sehen den
// Unterschied. Lernziel: gute Kinderseiten funktionieren für ALLE Kinder
// (UN-KRK Art. 23, BFSG/EAA).

export const MERKMALE = Object.freeze([
  {
    id: 'kontrast', emoji: '🌗', name: 'Guter Kontrast',
    aus: 'Blasse Schrift auf blassem Grund – kaum zu lesen.',
    ein: 'Kräftiger Kontrast – gut zu lesen.',
    warum: 'Manche Kinder sehen blasse Farben fast gar nicht. Guter Kontrast hilft allen.',
  },
  {
    id: 'schrift', emoji: '🔠', name: 'Große, klare Schrift',
    aus: 'Winzige Schrift, eng gedrängt.',
    ein: 'Große, klare Schrift mit Luft dazwischen.',
    warum: 'Winzige Schrift ist für viele Kinder schwer oder gar nicht lesbar.',
  },
  {
    id: 'vorlesen', emoji: '🔊', name: 'Vorlese-Funktion',
    aus: 'Es gibt keine Vorlese-Taste.',
    ein: 'Ein Klick liest den Text vor.',
    warum: 'Wer noch nicht gut liest oder nicht gut sieht, kann so alles hören.',
  },
  {
    id: 'bild', emoji: '🖼️', name: 'Bildbeschreibung',
    aus: 'Das Bild hat keine Beschreibung.',
    ein: 'Das Bild hat eine Beschreibung (Alt-Text).',
    warum: 'Ein Screenreader liest die Beschreibung vor – ohne sie fehlt das Bild ganz.',
  },
]);

/** Anzahl eingeschalteter Merkmale. */
export function zaehleAktiv(status = {}) {
  return MERKMALE.filter((m) => status[m.id]).length;
}

/** Ist ein bestimmtes Merkmal aktiv? */
export function istAn(status, id) {
  return Boolean((status ?? {})[id]);
}

/**
 * Bewertung der aktuellen Seite.
 * @returns {{aktiv:number, gesamt:number, fertig:boolean, text:string}}
 */
export function bewertung(status = {}) {
  const aktiv = zaehleAktiv(status);
  const gesamt = MERKMALE.length;
  let text;
  if (aktiv === 0) text = 'So ist die Seite für viele Kinder kaum nutzbar. Schalte die Merkmale ein!';
  else if (aktiv < gesamt) text = `Schon besser! Noch ${gesamt - aktiv} Merkmal(e) fehlen, damit die Seite für alle passt.`;
  else text = 'Stark! Jetzt funktioniert die Seite für ALLE Kinder. Genau das verlangt das Recht auf Teilhabe (UN-KRK Art. 23).';
  return { aktiv, gesamt, fertig: aktiv === gesamt, text };
}

/** Alle Merkmale einschalten (für „alles an“-Knopf). */
export function allesAn() {
  return Object.fromEntries(MERKMALE.map((m) => [m.id, true]));
}
