// Barriere-Detektive: reine Logik (ohne DOM), testbar.
// Idee (docs/09 Nr. 17): Kinder pruefen ihre Lieblings-Apps/-Seiten mit einer
// Kinder-Checkliste zur Barrierefreiheit und kueren die fairste App. Lernziel:
// Barrierefreiheit als FAIRNESS verstehen (Perspektivwechsel). Grundlage:
// BFSG/EAA, sinngemaess. Diese Datei traegt Checkliste, Punkte und Rangliste.

export const CHECKLISTE = Object.freeze([
  { code: 'vorlesen', frage: 'Kann man sich Texte vorlesen lassen?', warum: 'Hilft Kindern, die noch nicht sicher lesen, und blinden Menschen.', fuer: '🗣️ Vorlesen' },
  { code: 'kontrast', frage: 'Sieht man alles gut – kräftige Farben, große Schrift?', warum: 'Hilft bei schlechtem Licht und Menschen, die schlecht sehen.', fuer: '👀 Gut sichtbar' },
  { code: 'ohne_ton', frage: 'Versteht man es auch OHNE Ton (mit Untertiteln oder Bildern)?', warum: 'Hilft gehörlosen Menschen und überall dort, wo man leise sein muss.', fuer: '🔇 Ohne Ton' },
  { code: 'schrift_groesser', frage: 'Kann man die Schrift größer machen?', warum: 'Hilft allen, die kleine Schrift schwer lesen.', fuer: '🔠 Schrift größer' },
  { code: 'einfach', frage: 'Ist die Bedienung einfach und klar (nicht verwirrend)?', warum: 'Hilft jüngeren Kindern und Menschen mit Lernschwierigkeiten.', fuer: '🧭 Einfach' },
  { code: 'einfache_sprache', frage: 'Gibt es leichte, einfache Sprache?', warum: 'Hilft beim Deutschlernen und bei Lernschwierigkeiten.', fuer: '💬 Leichte Sprache' },
]);

export const MAX_PUNKTE = CHECKLISTE.length;

/** Zählt die mit "ja" beantworteten Kriterien. */
export function punkte(antworten = {}) {
  return CHECKLISTE.filter((k) => antworten[k.code] === true).length;
}

/** Einordnung eines App-Ergebnisses für die Anzeige. */
export function einordnung(p) {
  if (p >= 5) return { stufe: 'fair', emoji: '🌟', text: 'Sehr fair – hier können viele mitmachen!' };
  if (p >= 3) return { stufe: 'mittel', emoji: '🙂', text: 'Geht so – ein paar Hürden bleiben.' };
  return { stufe: 'unfair', emoji: '😟', text: 'Viele Hürden – manche Kinder werden ausgeschlossen.' };
}

/**
 * Rangliste geprüfter Apps, fairste zuerst. Stabil: bei Gleichstand bleibt
 * die Eingabe-Reihenfolge erhalten.
 * @param {Array<{name:string, antworten:Record<string,boolean>}>} apps
 */
export function rangliste(apps) {
  return apps
    .map((a, i) => ({ name: a.name, punkte: punkte(a.antworten), i }))
    .sort((x, y) => (y.punkte - x.punkte) || (x.i - y.i))
    .map(({ name, punkte: p }) => ({ name, punkte: p, ...einordnung(p) }));
}

export const LEKTIONEN = Object.freeze([
  '🕵️ Ihr habt Barrieren gejagt: Eine „Barriere“ ist eine Hürde, die manche Kinder aussperrt – zum Beispiel, wenn man Texte nicht vorlesen lassen kann oder ohne Ton nichts versteht.',
  '🤝 Barrierefrei heißt fair: Wenn eine App auch für blinde, gehörlose oder jüngere Kinder funktioniert, können ALLE mitmachen. Das ist kein Extra, sondern Fairness.',
  '🌍 Es betrifft mehr Menschen, als du denkst: Mal ist das Licht zu grell, mal muss man leise sein, mal lernt jemand gerade erst Deutsch. Barrierefreiheit hilft dann allen.',
  '📣 Ihr könnt etwas bewegen: Sagt Anbietern, was fehlt – gute Kinderangebote wollen fair sein. In Deutschland müssen viele digitale Angebote seit 2025 barrierefrei sein (Barrierefreiheitsstärkungsgesetz).',
]);
