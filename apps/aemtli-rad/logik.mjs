// Ämtli-Rad für Klassendienste: reine Logik (ohne DOM), testbar (docs/09
// Nr. 204). Ein nachvollziehbar fairer Rotationsalgorithmus verteilt die
// Klassendienste wöchentlich neu. Lernziel: Fairness ist eine Regel, kein
// Zufall – der Algorithmus wird kindgerecht erklärt (Transparenz-Baustein,
// propädeutisch zum AI Act: Art. 12 UN-KRK).

export const STANDARD_DIENSTE = Object.freeze(['Tafel', 'Blumen', 'Energie-Detektiv', 'Austeilen', 'Aufräumen', 'Fenster']);

/**
 * Verteilt Dienste auf Kinder für eine bestimmte Woche.
 * Regel: Dienst i geht in Woche w an Kind ((i + w) mod Anzahl Kinder).
 * So rutscht jede Woche jeder Dienst um eine Position weiter – über die Zeit
 * macht jedes Kind jeden Dienst. Vollständig vorhersagbar, kein Zufall.
 * @param {string[]} kinder  Vornamen/Spitznamen
 * @param {string[]} dienste
 * @param {number} woche  Wochennummer (0-basiert)
 * @returns {{dienst:string, kind:string|null}[]}
 */
export function zuteilung(kinder, dienste, woche = 0) {
  const n = kinder.length;
  return dienste.map((dienst, i) => ({
    dienst,
    kind: n > 0 ? kinder[((i + woche) % n + n) % n] : null,
  }));
}

/** Alle Kinder, die in einer Woche einen Dienst haben (für Fairness-Prüfung). */
export function zugeteilteKinder(kinder, dienste, woche) {
  return zuteilung(kinder, dienste, woche).map((z) => z.kind);
}

/**
 * Prüft, ob über `wochen` Wochen jedes Kind jeden Dienst mindestens einmal
 * bekommt (nur sinnvoll, wenn Kinderzahl und Rotation es zulassen).
 */
export function jederDienstProKind(kinder, dienste, wochen) {
  const gesehen = new Map(kinder.map((k) => [k, new Set()]));
  for (let w = 0; w < wochen; w++) {
    for (const { dienst, kind } of zuteilung(kinder, dienste, w)) {
      if (kind) gesehen.get(kind).add(dienst);
    }
  }
  return gesehen;
}

/** Druckbarer Wochenplan als Text. */
export function baueWochenplan(kinder, dienste, woche) {
  const zeilen = [`Klassendienste – Woche ${woche + 1}`, ''];
  for (const { dienst, kind } of zuteilung(kinder, dienste, woche)) {
    zeilen.push(`${dienst}: ${kind ?? '________'}`);
  }
  zeilen.push('', 'So funktioniert das Rad: Jede Woche rückt jeder Dienst um ein Kind weiter. Nach einer Runde hatte jede*r jeden Dienst – fair und vorhersagbar, kein Zufall.');
  return zeilen.join('\n');
}
