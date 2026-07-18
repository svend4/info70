// Klassenrat-Themenpaket (docs/09 Ось G): vorgefertigte Abstimmungsvorlagen
// für den Klassenrat. Reine Daten (ohne DOM), testbar. Sofort startbar in der
// mitmach-arena, kompatibel mit dem vorhandenen Klassen-Koffer-Export.

export const KLASSENRAT_VORLAGEN = Object.freeze([
  {
    titel: 'Klassenregeln',
    frage: 'Welche Regel wollen wir neu für unsere Klasse?',
    optionen: ['Leiser im Klassenraum', 'Aufräumen nach der Pause', 'Ausreden lassen', 'Handys weg im Unterricht'],
  },
  {
    titel: 'Pausenhof',
    frage: 'Was wünschen wir uns für den Pausenhof?',
    optionen: ['Neue Spielgeräte', 'Eine Ruhe-Ecke', 'Feste Fußball-Zeiten', 'Mehr Bäume und Schatten'],
  },
  {
    titel: 'Projektwoche',
    frage: 'Welches Thema soll unsere Projektwoche haben?',
    optionen: ['Sicher im Netz', 'Umwelt & Natur', 'Sport & Bewegung', 'Kunst & Theater'],
  },
  {
    titel: 'Digitale Klassenregeln',
    frage: 'Welche digitale Klassenregel beschließen wir?',
    optionen: ['Keine Fotos ohne Erlaubnis', 'Im Klassenchat nett bleiben', 'Melden statt zuschauen', 'Kettenbriefe stoppen'],
  },
]);

/** Baut aus einer Vorlage eine startbereite Umfrage (Zähler auf 0). */
export function ausVorlage(vorlage) {
  return { frage: vorlage.frage, optionen: [...vorlage.optionen], stimmen: vorlage.optionen.map(() => 0) };
}
