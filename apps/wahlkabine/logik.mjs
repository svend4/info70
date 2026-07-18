// Wahlkabinen-Modus „Geheime Wahl“: reine Logik (ohne DOM), testbar (docs/09
// Nr. 205). Ein Gerät wird herumgereicht; jede Stimme wird sofort als bloßer
// Zähler „versiegelt“ – es gibt technisch KEINE Zuordnung Stimme→Person. Das
// Ergebnis erscheint erst nach der letzten Stimme. UN-KRK Art. 12, privacy by
// design.

/** Startet eine Wahl mit fester Wählerzahl. */
export function neueWahl(frage, optionen, erwartet) {
  return {
    frage: String(frage),
    optionen: [...optionen],
    stimmen: optionen.map(() => 0), // nur Zähler – keine Wähler-Zuordnung
    abgegeben: 0,
    erwartet: Math.max(1, Number(erwartet) || optionen.length),
  };
}

/** Gibt eine Stimme ab (erhöht nur den Zähler der Option). */
export function stimmeAb(wahl, index) {
  if (index < 0 || index >= wahl.optionen.length || fertig(wahl)) return wahl;
  const stimmen = wahl.stimmen.map((s, i) => (i === index ? s + 1 : s));
  return { ...wahl, stimmen, abgegeben: wahl.abgegeben + 1 };
}

/** Sind alle erwarteten Stimmen abgegeben? */
export function fertig(wahl) {
  return wahl.abgegeben >= wahl.erwartet;
}

/** Wie viele Stimmen fehlen noch? */
export function offen(wahl) {
  return Math.max(0, wahl.erwartet - wahl.abgegeben);
}

/**
 * Ergebnis: Optionen absteigend nach Stimmen. Gewinner nur eindeutig, wenn er
 * allein vorne liegt (sonst gleichstand=true).
 */
export function ergebnis(wahl) {
  const zeilen = wahl.optionen.map((text, i) => ({ text, stimmen: wahl.stimmen[i] }));
  zeilen.sort((a, b) => b.stimmen - a.stimmen);
  const max = zeilen.length ? zeilen[0].stimmen : 0;
  const fuehrende = zeilen.filter((z) => z.stimmen === max);
  return {
    zeilen,
    gesamt: wahl.abgegeben,
    gleichstand: max > 0 && fuehrende.length > 1,
    gewinner: max > 0 && fuehrende.length === 1 ? fuehrende[0].text : null,
  };
}
