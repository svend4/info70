// Familien-Budget: reine Logik (ohne DOM), testbar. Einfacher Einnahmen/
// Ausgaben-Simulator: feste Kosten sind schon bezahlt, mit dem freien Rest
// werden Bedürfnisse, Wünsche und Sparen abgewogen. Spielgeld – nichts wird
// wirklich gekauft. Praleska docs/10 (Top-30 Nr. 23).

/** Prüft die Budget-Daten. Liefert Fehlerliste (leer = gültig). */
export function pruefeBudget(daten) {
  const fehler = [];
  if (!Number.isInteger(daten?.einkommen) || daten.einkommen <= 0) fehler.push('Einkommen fehlt');
  if (!Array.isArray(daten?.festeKosten) || daten.festeKosten.length < 4) fehler.push('feste Kosten fehlen');
  for (const f of daten?.festeKosten ?? []) {
    if (!Number.isInteger(f.betrag) || f.betrag <= 0) fehler.push(`${f.name}: Betrag ungültig`);
  }
  if (!Array.isArray(daten?.posten) || daten.posten.length < 6) fehler.push('zu wenige Posten');
  const ids = new Set();
  const arten = { beduerfnis: 0, wunsch: 0, sparen: 0 };
  for (const p of daten?.posten ?? []) {
    if (!p.id || ids.has(p.id)) fehler.push(`Posten-Id fehlt/doppelt: ${p.id}`);
    ids.add(p.id);
    if (!Number.isInteger(p.preis) || p.preis <= 0) fehler.push(`${p.id}: Preis ungültig`);
    if (!(p.art in arten)) fehler.push(`${p.id}: unbekannte Art ${p.art}`);
    else arten[p.art]++;
  }
  if (arten.beduerfnis < 3) fehler.push('mindestens 3 Bedürfnisse');
  if (arten.wunsch < 3) fehler.push('mindestens 3 Wünsche');
  if (arten.sparen < 1) fehler.push('mindestens 1 Spar-Posten');
  // das freie Budget muss knapper sein als alle Posten zusammen (sonst gibt es nichts abzuwägen)
  if (frei(daten) >= summe(daten.posten)) fehler.push('Budget zu üppig – Abwägen entfällt');
  if (frei(daten) <= 0) fehler.push('kein freies Budget');
  return fehler;
}

/** Summe der festen Kosten. */
export function festeSumme(daten) {
  return daten.festeKosten.reduce((s, f) => s + f.betrag, 0);
}

/** Frei verfügbares Budget nach festen Kosten. */
export function frei(daten) {
  return daten.einkommen - festeSumme(daten);
}

/** Preissumme einer Posten-Liste. */
export function summe(posten) {
  return posten.reduce((s, p) => s + p.preis, 0);
}

/** Gewählte Posten (Ids → Objekte). */
export function gewaehlte(daten, ids) {
  return daten.posten.filter((p) => ids.includes(p.id));
}

/**
 * Bewertet eine Auswahl. Reine Funktion.
 * @returns {{rest:number, ueberzogen:boolean, offeneBeduerfnisse:object[], stufe:string, hinweise:string[]}}
 */
export function bewerteAuswahl(daten, ids) {
  const wahl = gewaehlte(daten, ids);
  const budget = frei(daten);
  const rest = budget - summe(wahl);
  const ueberzogen = rest < 0;
  const offeneBeduerfnisse = daten.posten.filter((p) => p.art === 'beduerfnis' && !ids.includes(p.id));
  const wuenscheGewaehlt = wahl.filter((p) => p.art === 'wunsch');
  const gespart = wahl.some((p) => p.art === 'sparen');

  const hinweise = [];
  let stufe;
  if (ueberzogen) {
    stufe = 'ueberzogen';
    hinweise.push(`Das Geld reicht so nicht: Es fehlen ${-rest} €. Leg etwas zurück ins Regal – was ist am wenigsten wichtig?`);
  } else {
    if (offeneBeduerfnisse.length === 0) {
      hinweise.push('Stark: Alle Bedürfnisse sind versorgt – das, was wirklich gebraucht wird, kommt zuerst.');
    } else if (wuenscheGewaehlt.length > 0) {
      hinweise.push(`Überleg nochmal: ${offeneBeduerfnisse.map((p) => p.emoji).join(' ')} wird wirklich gebraucht, ${wuenscheGewaehlt[0].emoji} ist „nur“ ein Wunsch. Was ist wichtiger?`);
    } else {
      hinweise.push('Noch sind Bedürfnisse offen – schau, ob das Budget dafür reicht.');
    }
    if (gespart) hinweise.push('Klug: Etwas im Spartopf hilft bei Überraschungen – und für große Träume.');
    else if (rest > 0) hinweise.push(`Du hast ${rest} € übrig gelassen – auch das ist Sparen!`);
    if (offeneBeduerfnisse.length === 0 && (gespart || rest > 0)) stufe = 'super';
    else if (offeneBeduerfnisse.length === 0) stufe = 'gut';
    else stufe = 'ueberlegen';
  }
  return { rest, ueberzogen, offeneBeduerfnisse, stufe, hinweise };
}
