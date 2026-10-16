// Kita-Unterstützungs-Navigator: reine Logik (ohne DOM), damit sie testbar ist.
//
// Die Checkliste fragt die Einrichtung, welche psychologisch-pädagogischen
// Unterstützungsaufgaben sie abdeckt. Gegenstand sind die Einrichtung, das
// Team, die Gruppen und die Eltern insgesamt. Einzelne Kinder, einzelne
// Familien und einzelne Fachkräfte kommen in den Fragen nicht vor; die
// Ausschlüsse mit Seitenangabe stehen unten in AUSGESCHLOSSEN.
//
// Gezählt wird je Block: wie viele Fragen auf welcher Antwort stehen. Eine
// Gesamtzahl über alle Blöcke, ein Prozentwert und ein Urteil gibt es nicht.
// Nichts wird gespeichert.

export const QUELLE = 'Praleska, Anhang „Психологическая служба в дошкольном учреждении“, S. 312–317';

/** Die vier Antworten. Eine Frage ohne Antwort wird nur gezählt, nicht beantwortet. */
export const ANTWORTEN = ['geregelt', 'teilweise', 'nicht geregelt', 'Träger oder extern'];

/** Spalten der Zählung je Block: die vier Antworten und die Zahl ohne Antwort. */
const SPALTEN = [...ANTWORTEN, 'ohne Antwort'];

const MONATE = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
];

/**
 * Die übernommenen Aufgaben, gegliedert nach den vier Blöcken der Quelle.
 * Die Fragen sind Eigenentwurf nach der jeweiligen Aufgabe; `seite` ist die
 * Seite des Anhangs, auf der die Aufgabe steht. `hinweis` ist optional.
 */
export const BLOECKE = [
  {
    id: 'vorrang',
    quelle: 'Приоритетные задачи педагога-психолога',
    uebersetzung: 'Vorrangige Aufgaben',
    seiten: '312–313',
    aufgaben: [
      {
        id: 'v1',
        seite: 312,
        frage: 'Ist geregelt, wie alle Fachkräfte gemeinsam die Entwicklung jedes Kindes unterstützen, auch seine Kreativität und seine besonderen Anlagen?',
      },
      {
        id: 'v2',
        seite: 313,
        frage: 'Ist geregelt, wie die psychische Gesundheit von Kindern und Fachkräften in der Einrichtung gestärkt wird?',
      },
      {
        id: 'v3',
        seite: 313,
        frage: 'Ist geregelt, wie die Einrichtung die Rechte des Kindes achtet und ihre Einhaltung unterstützt, zum Beispiel beim Spiel?',
      },
      {
        id: 'v4',
        seite: 313,
        frage: 'Ist geregelt, wie alle Beteiligten in der Einrichtung psychologisches Wissen und praktische Fähigkeiten aufbauen?',
      },
    ],
  },
  {
    id: 'kinder',
    quelle: 'Работа с детьми',
    uebersetzung: 'Arbeit mit Kindern',
    seiten: '313–314',
    aufgaben: [
      {
        id: 'k1',
        seite: 313,
        frage: 'Ist geregelt, wie vorbeugende Maßnahmen geplant werden, damit jedes Kind emotional gut zurechtkommt und in der Gruppe seinen Platz findet?',
      },
      {
        id: 'k2',
        seite: 314,
        frage: 'Ist geregelt, wie Kinder beim Eingewöhnen in die Kita psychologisch-pädagogisch unterstützt werden?',
      },
      {
        id: 'k3',
        seite: 314,
        frage: 'Ist geregelt, wie Fachkräfte Entwicklungsangebote für Kinder anfordern können, wenn sie eine pädagogische Frage allein nicht lösen?',
      },
      {
        id: 'k4',
        seite: 314,
        frage: 'Ist geregelt, wie die Einrichtung zusammen mit Fachkräften und Eltern eine Umgebung gestaltet, die die Entwicklung der Kinder unterstützt?',
      },
      {
        id: 'k5',
        seite: 314,
        frage: 'Ist geregelt, wie das Spiel in den Gruppen beobachtet und ausgewertet wird und wie Fachkräfte es bei Bedarf unterstützen?',
      },
    ],
  },
  {
    id: 'eltern',
    quelle: 'Работа с родителями',
    uebersetzung: 'Arbeit mit Eltern',
    seiten: '315',
    aufgaben: [
      {
        id: 'e1',
        seite: 315,
        frage: 'Ist geregelt, wie Eltern psychologisch informiert werden, zum Beispiel über Kinderpsychologie und Erziehung in der Familie?',
      },
      {
        id: 'e2',
        seite: 315,
        frage: 'Ist geregelt, wie Eltern beim Eintritt ihres Kindes in die Kita bei der Eingewöhnung beraten werden?',
      },
      {
        id: 'e3',
        seite: 315,
        frage: 'Ist geregelt, wie Eltern in Gruppen oder im Einzelangebot unterstützt werden, damit sie ihr Kind besser verstehen und die Beziehung zu ihm stärken?',
      },
      {
        id: 'e4',
        seite: 315,
        frage: 'Ist geregelt, wie Eltern über altersabhängige Besonderheiten, Unterschiede und Temperament von Kindern informiert werden?',
      },
      {
        id: 'e5',
        seite: 315,
        frage: 'Ist geregelt, wie Eltern Anregungen für Spiel, künstlerische und praktische Tätigkeiten ihres Kindes zu Hause erhalten?',
      },
    ],
  },
  {
    id: 'team',
    quelle: 'Работа с педагогами',
    uebersetzung: 'Arbeit mit dem Team',
    seiten: '315–317',
    aufgaben: [
      {
        id: 't1',
        seite: 315,
        frage: 'Ist geregelt, wie das Team sein psychologisches Wissen vertieft, etwa zur Entwicklungs- und Sozialpsychologie?',
      },
      {
        id: 't2',
        seite: 316,
        frage: 'Ist geregelt, wie Fachkräfte Beratung zum differenzierten Umgang mit Kindern und zur Partnerschaft mit Eltern erhalten?',
      },
      {
        id: 't3',
        seite: 316,
        frage: 'Ist geregelt, wie Fachkräfte Empfehlungen zum emotionalen Klima in der Gruppe und zur Förderung der Kinder erhalten?',
      },
      {
        id: 't4',
        seite: 316,
        frage: 'Ist geregelt, wie Fachkräfte geeignete Hilfsmittel zum Verstehen von Gruppe und Familien erhalten und bei deren Auswertung unterstützt werden?',
      },
      {
        id: 't5',
        seite: 316,
        frage: 'Ist geregelt, wie Fachkräfte bei der Entwicklung von Lern- und Erziehungsangeboten unterstützt werden, auch bei den Kriterien für deren Wirksamkeit?',
      },
      {
        id: 't6',
        seite: 316,
        frage: 'Ist geregelt, wie im Team eine gemeinsame pädagogische Haltung aller Beschäftigten gefördert wird?',
      },
      {
        id: 't7',
        seite: 316,
        frage: 'Ist geregelt, wie Fachkräfte in Einzelgesprächen oder in Gruppen bei ihrer beruflichen Weiterentwicklung unterstützt werden?',
        hinweis: 'Hinweis: Gemeint ist Unterstützung. Die Frage bewertet keine einzelne Fachkraft.',
      },
      {
        id: 't8',
        seite: 317,
        frage: 'Gibt es Bedingungen, die dem emotionalen Ausbrennen von Fachkräften vorbeugen?',
        hinweis: 'Hinweis: Bei Überlastung einzelner Personen entscheiden Leitung und Träger. Dieses Werkzeug bewertet keine Person.',
      },
      {
        id: 't9',
        seite: 317,
        frage: 'Ist geregelt, dass psychologische Fragen zur Entwicklung der Kinder bei den pädagogischen Konferenzen behandelt werden?',
      },
      {
        id: 't10',
        seite: 317,
        frage: 'Ist geregelt, wie im Team ein gutes psychologisches Klima gefördert wird?',
        hinweis: 'Hinweis: Diese Frage betrifft das Klima im Team. Die Verträglichkeit einzelner Fachkräfte wird hier nicht abgefragt.',
      },
    ],
  },
];

/**
 * Ausgeschlossene Aufgaben der Quelle (vollständig nicht übernommen), mit
 * Seite und Begründung nach dem Wortlaut. Die Begründung nennt nur, was die
 * Aufgabe tut, und bewertet niemanden.
 */
export const AUSGESCHLOSSEN = [
  { seite: 313, thema: 'Soziometrische Aufgabe zur Stellung einzelner Kinder in der Gruppe', grund: 'ordnet einzelne Kinder nach ihrer Stellung in der Gruppe ein' },
  { seite: 314, thema: 'Erkennung der Begabung einzelner Kinder', grund: 'stellt Merkmale einzelner Kinder fest' },
  { seite: 314, thema: 'Diagnostik der Schulreife', grund: 'diagnostiziert einzelne Kinder' },
  { seite: 314, thema: 'Kinder mit besonderem Förderbedarf', grund: 'richtet sich an einzelne Kinder, die besondere Bildungsprogramme brauchen' },
  { seite: 314, thema: 'Kategorien einzelner Kinder mit Schwierigkeiten', grund: 'ordnet einzelne Kinder in Kategorien ein' },
  { seite: 315, thema: 'Beratung zu konkreten Familien mit besonderen Merkmalen der Kinder', grund: 'betrifft einzelne Familien und ordnet Kinder ein' },
  { seite: 316, thema: 'Typ des pädagogischen Zusammenwirkens einzelner Fachkräfte', grund: 'Lesart: ordnet einzelne Fachkräfte einem Typ zu' },
  { seite: 316, thema: 'Analyse der Arbeit einer Fachkraft im Auftrag der Verwaltung', grund: 'analysiert eine einzelne Fachkraft' },
];

/**
 * Aufgaben, die nur teilweise übernommen sind: der übrige Teil betrifft eine
 * einzelne Fachkraft.
 */
export const TEILWEISE_AUSGESCHLOSSEN = [
  { seite: 317, thema: 'Verträglichkeit einzelner Fachkräfte mit einer Gruppe', grund: 'bewertet einzelne Fachkräfte; übernommen ist nur der Teil zum Klima im Team' },
];

/** Anlaufstellen als Kategorien. Keine Namen, keine Adressen, keine Nummern. */
export const ANLAUFSTELLEN = [
  'Kita-Fachberatung',
  'Erziehungsberatungsstelle für Familien',
  'Frühförderstelle',
  'Schulpsychologischer Dienst',
  'Fachberatung des Trägers',
];

/**
 * Zählt die Antworten eines Blocks. `antworten` ist eine Map von Frage-Kennung
 * zu Antwort. Unbekannte Antworten und fehlende Antworten zählen als „ohne Antwort“.
 * @param {{aufgaben: {id: string}[]}} block
 * @param {Map<string, string>} antworten
 * @returns {Record<string, number>}
 */
export function zaehleBlock(block, antworten) {
  const zaehl = Object.fromEntries(SPALTEN.map((s) => [s, 0]));
  for (const aufgabe of block.aufgaben) {
    const wahl = antworten.get(aufgabe.id);
    zaehl[ANTWORTEN.includes(wahl) ? wahl : 'ohne Antwort'] += 1;
  }
  return zaehl;
}

/**
 * Anzeige je Block, z. B. „geregelt: 2, teilweise: 1, nicht geregelt: 3, Träger oder extern: 0, ohne Antwort: 4“.
 * @param {{aufgaben: {id: string}[]}} block
 * @param {Map<string, string>} antworten
 */
export function zaehlText(block, antworten) {
  const zaehl = zaehleBlock(block, antworten);
  return SPALTEN.map((s) => `${s}: ${zaehl[s]}`).join(', ');
}

/**
 * Fragen eines Blocks, die als „nicht geregelt“ markiert sind.
 * @param {{aufgaben: {id: string}[]}} block
 * @param {Map<string, string>} antworten
 */
export function offeneAufgaben(block, antworten) {
  return block.aufgaben.filter((a) => antworten.get(a.id) === 'nicht geregelt');
}

/**
 * Datum im Bericht, z. B. „16. Oktober 2026“.
 * @param {Date} datum
 */
export function standText(datum) {
  return `${datum.getDate()}. ${MONATE[datum.getMonth()]} ${datum.getFullYear()}`;
}

/**
 * Bericht als Text: Zählung je Block und die Fragen mit „nicht geregelt“.
 * Keine Namen, keine Angaben zu einzelnen Kindern, Familien oder Personen.
 * Anlaufstellen-Kontakte stehen nicht im Bericht.
 * @param {Map<string, string>} antworten
 * @param {Date} datum
 * @returns {string}
 */
export function berichtText(antworten, datum) {
  const zeilen = [
    'Kita-Unterstützungs-Navigator: Bericht',
    `Stand: ${standText(datum)}`,
    `Grundlage: ${QUELLE}. Fragen und Hinweise sind Eigenentwurf.`,
    'Dieser Bericht enthält keine Namen, keine Angaben zu einzelnen Kindern, Familien oder Personen und keine Bewertung.',
  ];
  for (const block of BLOECKE) {
    zeilen.push('', `${block.quelle} (${block.uebersetzung}), S. ${block.seiten}`, `Zählung: ${zaehlText(block, antworten)}`);
    const offen = offeneAufgaben(block, antworten);
    if (offen.length) {
      zeilen.push('Nicht geregelt:');
      for (const aufgabe of offen) zeilen.push(`- ${aufgabe.frage} (S. ${aufgabe.seite})`);
    } else {
      zeilen.push('Nicht geregelt: keine Frage in diesem Block.');
    }
  }
  return zeilen.join('\n');
}
