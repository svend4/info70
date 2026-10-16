// Tagesblick Fachkraft: reine Logik (ohne DOM), damit sie testbar ist.
//
// Die Fachkraft hält am Tag ihre EIGENEN Handlungen fest (Häkchen). Kinder
// kommen in dieser App nicht vor: keine Namen, keine Kürzel, keine Bewertung,
// keine Summe über Kinder. Gezählt wird nur, wie viele eigene Handlungen je
// Bereich erledigt sind. Eine Gesamtzahl gibt es bewusst nicht.

/** Schlüssel der früheren Fassung im Browser. Die App entfernt ihn nur. */
export const ALTER_SCHLUESSEL = 'wa.daten';

/**
 * Die Handlungen der Fachkraft, gegliedert in Bereiche.
 * Eigenentwurf, aus den bisherigen Impuls-Texten der früheren Fassung
 * umformuliert. `frage` ist die Beschriftung für Hilfstechnik am Knopf;
 * sie enthält den Namen der Handlung wörtlich.
 */
export const BEREICHE = [
  {
    id: 'zeit',
    name: 'Zeit und Mitsprache',
    handlungen: [
      {
        id: 'einzelzeit',
        name: 'Einzelzeit angeboten',
        frage: 'Hast du heute Einzelzeit angeboten?',
        hilfe: 'Kurze 1:1-Momente beim Ankommen, Spielen oder Abholen anbieten.',
      },
      {
        id: 'mitsprache',
        name: 'Kindern Mitsprache gegeben',
        frage: 'Hast du heute Kindern Mitsprache gegeben?',
        hilfe: 'Bei einer Entscheidung im Alltag, zum Beispiel bei Spielwahl oder Ruhezeit, nach der Meinung des Kindes fragen.',
      },
    ],
  },
  {
    id: 'beschwerde',
    name: 'Beschwerde und Gespräch',
    handlungen: [
      {
        id: 'beschwerdeweg',
        name: 'Beschwerdeweg erklärt',
        frage: 'Hast du heute den Beschwerdeweg erklärt?',
        hilfe: 'Dem Kind zeigen, wem es sagen kann, wenn etwas nicht gut ist.',
      },
      {
        id: 'elterngespraech',
        name: 'Elterngespräch angeboten',
        frage: 'Hast du heute ein Elterngespräch angeboten?',
        hilfe: 'Den Eltern ein Gespräch anbieten: Was hat sich zu Hause verändert? Was hilft dem Kind gerade?',
      },
    ],
  },
  {
    id: 'team',
    name: 'Team und Fachberatung',
    handlungen: [
      {
        id: 'teamgespraech',
        name: 'Teamgespräch geführt',
        frage: 'Hast du heute ein Teamgespräch geführt?',
        hilfe: 'Im Team besprechen und gemeinsam weiter im Blick behalten.',
      },
      {
        id: 'fachberatung',
        name: 'Fachberatung eingeholt',
        frage: 'Hast du heute Fachberatung eingeholt?',
        hilfe: 'Bei anhaltender Sorge, die im Team allein nicht geklärt werden kann, Fachberatung hinzuziehen.',
      },
    ],
  },
];

const WOCHENTAGE = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
const MONATE = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
];

/**
 * Lokaler Tagesschlüssel "JJJJ-MM-TT" (keine UTC-Verschiebung).
 * @param {Date} [datum]
 */
export function tagesSchluessel(datum = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${datum.getFullYear()}-${p(datum.getMonth() + 1)}-${p(datum.getDate())}`;
}

/**
 * Lesbares Datum zu einem Tagesschlüssel, z. B. "Freitag, 16. Oktober 2026".
 * @param {string} tagKey "JJJJ-MM-TT"
 */
export function tagesLabel(tagKey) {
  const [j, m, t] = tagKey.split('-').map(Number);
  const wochentag = WOCHENTAGE[new Date(j, m - 1, t).getDay()];
  return `${wochentag}, ${t}. ${MONATE[m - 1]} ${j}`;
}

/**
 * Wie viele eigene Handlungen eines Bereichs sind erledigt?
 * Unbekannte Kennungen zählen nicht; Handlungen anderer Bereiche auch nicht.
 * @param {{handlungen: {id: string}[]}} bereich
 * @param {Set<string>} erledigt Kennungen der erledigten Handlungen
 * @returns {{erledigt: number, gesamt: number}}
 */
export function zaehleBereich(bereich, erledigt) {
  const gesamt = bereich.handlungen.length;
  const anzahl = bereich.handlungen.filter((h) => erledigt.has(h.id)).length;
  return { erledigt: anzahl, gesamt };
}

/**
 * Anzeige je Bereich, z. B. "erledigt: 1 von 2".
 * @param {{handlungen: {id: string}[]}} bereich
 * @param {Set<string>} erledigt
 */
export function bilanzText(bereich, erledigt) {
  const { erledigt: anzahl, gesamt } = zaehleBereich(bereich, erledigt);
  return `erledigt: ${anzahl} von ${gesamt}`;
}
