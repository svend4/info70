// Mini-Gärtner-Begleiter – reine Logik (ohne DOM), testbar mit node --test.
// Saison-Planer für Hochbeet/Kita-Garten: Welche Kultur wird in welchem Monat
// gesät/geerntet, Monatsaufgaben, Pflanztagebuch-Umfang. Praleska docs/10
// (Top-30 Nr. 29), Quelle „Arbeit in der Natur“ – Konzept adaptiert, Texte
// Eigenproduktion.

export const MONATE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

/** Monatsname für 1..12, sonst null. */
export function monatsName(monat) {
  if (!Number.isInteger(monat) || monat < 1 || monat > 12) return null;
  return MONATE[monat - 1];
}

/** Welche Kulturen kann man in diesem Monat säen bzw. ernten? */
export function kulturenImMonat(monat, kulturen) {
  return {
    saeen: kulturen.filter((k) => k.saatMonate.includes(monat)),
    ernten: kulturen.filter((k) => k.ernteMonate.includes(monat)),
  };
}

/** Status einer Kultur im Monat: 'saeen' | 'ernten' | 'saeen+ernten' | 'warten'. */
export function statusImMonat(monat, kultur) {
  const s = kultur.saatMonate.includes(monat);
  const e = kultur.ernteMonate.includes(monat);
  if (s && e) return 'saeen+ernten';
  if (s) return 'saeen';
  if (e) return 'ernten';
  return 'warten';
}

/** Anzahl der Wochenzeilen im druckbaren Pflanztagebuch (4..8). */
export function tagebuchWochen(kultur) {
  const w = Number(kultur.wartezeitWochen) || 4;
  return Math.max(4, Math.min(8, w));
}

// Kulturen, deren Sicherheits-Hinweis Pflicht ist (giftige Teile bzw.
// Bitterstoff-Risiko). Der Validator erzwingt das Stichwort im Hinweis.
const PFLICHT_HINWEIS = {
  buschbohne: /giftig/i,
  kartoffel: /giftig/i,
  zucchini: /bitter/i,
};

/** Validiert den Garten-Katalog; gibt eine Liste von Fehlertexten zurück. */
export function pruefeGarten(daten) {
  const fehler = [];
  const k = daten?.kulturen;
  if (!Array.isArray(k) || k.length !== 8) {
    fehler.push('kulturen: genau 8 Kulturen erwartet (Quelle: 8 Saatgutarten)');
    return fehler;
  }
  const ids = new Set();
  for (const kultur of k) {
    const wo = `Kultur ${kultur.id || '?'}`;
    if (!kultur.id || ids.has(kultur.id)) fehler.push(`${wo}: id fehlt oder doppelt`);
    ids.add(kultur.id);
    if (!kultur.name || !kultur.emoji) fehler.push(`${wo}: name/emoji fehlt`);
    if (!kultur.standort) fehler.push(`${wo}: standort fehlt`);
    if (!kultur.kinderTipp) fehler.push(`${wo}: kinderTipp fehlt`);
    for (const feld of ['saatMonate', 'ernteMonate']) {
      const m = kultur[feld];
      if (!Array.isArray(m) || m.length === 0 || m.some((x) => !Number.isInteger(x) || x < 1 || x > 12)) {
        fehler.push(`${wo}: ${feld} muss nicht-leere Liste aus 1..12 sein`);
      }
    }
    if (![1, 2, 3].includes(kultur.schwierigkeit)) fehler.push(`${wo}: schwierigkeit 1..3 erwartet`);
    const pflicht = PFLICHT_HINWEIS[kultur.id];
    if (pflicht && !pflicht.test(kultur.hinweis || '')) {
      fehler.push(`${wo}: Sicherheits-Hinweis (${pflicht}) ist Pflicht`);
    }
  }
  const aufgaben = daten?.monatsaufgaben || {};
  for (let m = 1; m <= 12; m++) {
    const liste = aufgaben[String(m)];
    if (!Array.isArray(liste) || liste.length < 2 || liste.some((t) => typeof t !== 'string' || !t.trim())) {
      fehler.push(`monatsaufgaben[${m}]: mindestens 2 Aufgaben erwartet`);
    }
  }
  const stufen = daten?.stufen;
  if (!Array.isArray(stufen) || stufen.length < 2) {
    fehler.push('stufen: mindestens 2 Entwicklungsstufen erwartet');
  } else {
    for (const s of stufen) {
      if (!Array.isArray(s.aufgaben) || s.aufgaben.length < 3) fehler.push(`Stufe ${s.id}: mindestens 3 Aufgaben`);
      if (!s.begleitung) fehler.push(`Stufe ${s.id}: begleitung fehlt`);
    }
    // Buchgetreu: Gießen nach Bodenzustand (Fingerprobe) gehört zur älteren Stufe.
    if (!stufen.some((s) => (s.aufgaben || []).some((a) => /Fingerprobe/.test(a)))) {
      fehler.push('stufen: „Gießen nach Bodenzustand (Fingerprobe)“ fehlt');
    }
  }
  return fehler;
}
