// Ergebnis-Plakat (docs/09 Ось G, zu mitmach-arena): reine Logik ohne DOM,
// testbar. Aus einer Abstimmung (Klassen-Koffer der mitmach-arena) wird ein
// großformatiges Balkendiagramm fürs Klassenzimmer – rein clientseitig.

/**
 * Baut die Balken-Daten aus einer Umfrage.
 * @param {{frage:string, optionen:string[], stimmen:number[]}} umfrage
 * @returns {{frage:string, gesamt:number, balken:Array<{text:string,stimmen:number,prozent:number,gewinner:boolean}>, gewinner:string|null, gleichstand:boolean}}
 */
export function baueBalken(umfrage) {
  const optionen = umfrage.optionen ?? [];
  const stimmen = umfrage.stimmen ?? [];
  const gesamt = stimmen.reduce((s, n) => s + n, 0);
  const max = stimmen.length ? Math.max(...stimmen) : 0;
  const fuehrende = optionen.filter((_, i) => stimmen[i] === max && max > 0);
  const balken = optionen
    .map((text, i) => ({
      text,
      stimmen: stimmen[i] ?? 0,
      prozent: gesamt === 0 ? 0 : Math.round(((stimmen[i] ?? 0) / gesamt) * 100),
      gewinner: (stimmen[i] ?? 0) === max && max > 0,
    }))
    .sort((a, b) => b.stimmen - a.stimmen);
  return {
    frage: umfrage.frage ?? '',
    gesamt,
    balken,
    gewinner: max > 0 && fuehrende.length === 1 ? fuehrende[0] : null,
    gleichstand: fuehrende.length > 1,
  };
}

/**
 * Fußzeile des Plakats, neutral formuliert: nennt die Möglichkeit mit den meisten Stimmen,
 * ohne Siegerwort und ohne Symbol.
 * @param {{gesamt:number, gewinner:string|null, gleichstand:boolean}} p Ergebnis von baueBalken
 * @returns {string}
 */
export function fussText(p) {
  if (p.gleichstand) return `🤝 Unentschieden – ${p.gesamt} Stimmen insgesamt.`;
  if (p.gewinner) return `Meiste Stimmen: ${p.gewinner} · ${p.gesamt} Stimmen insgesamt.`;
  return 'Noch keine Stimmen abgegeben.';
}
