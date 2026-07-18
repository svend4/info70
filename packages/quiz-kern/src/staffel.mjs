// quiz-kern Geschwister-Staffel: reine Wertungs-Logik (ohne DOM), testbar.
// Zwei Geschwister lösen abwechselnd Fragen am selben Gerät und punkten als
// EIN Team; nach der Antwort des jüngeren Kindes darf das ältere erklären.
// Kooperativ (kein Gegeneinander), Ergebnisse bleiben lokal, kein Rekord.

/** Wer ist bei Frage i dran? Gerade Index -> jüngeres, ungerade -> älteres. */
export function amZug(index) {
  return index % 2 === 0 ? 'jung' : 'alt';
}

/**
 * Team-Wertung aus den Einträgen.
 * @param {Array<{spieler:'jung'|'alt', richtig:boolean}>} eintraege
 * @returns {{team:number, gesamt:number, jung:{richtig:number,gesamt:number}, alt:{richtig:number,gesamt:number}}}
 */
export function staffelWertung(eintraege = []) {
  const zaehler = { jung: { richtig: 0, gesamt: 0 }, alt: { richtig: 0, gesamt: 0 } };
  let team = 0;
  for (const e of eintraege) {
    const seite = e.spieler === 'alt' ? 'alt' : 'jung';
    zaehler[seite].gesamt += 1;
    if (e.richtig) { zaehler[seite].richtig += 1; team += 1; }
  }
  return { team, gesamt: eintraege.length, jung: zaehler.jung, alt: zaehler.alt };
}

/** Freundlicher Team-Satz. */
export function staffelSatz(wertung) {
  if (wertung.gesamt === 0) return 'Noch keine Fragen gelöst.';
  return `Als Team: ${wertung.team} von ${wertung.gesamt} geschafft! (Jüngere*r ${wertung.jung.richtig}/${wertung.jung.gesamt}, Ältere*r ${wertung.alt.richtig}/${wertung.alt.gesamt})`;
}
