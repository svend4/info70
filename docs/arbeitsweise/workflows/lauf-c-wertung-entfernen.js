export const meta = {
  name: 'lauf-c-wertung-entfernen',
  description: 'Lauf C: Wertung aus 51 Kinder-Apps entfernen (Quiz-Strang А und Strang Б), je Gruppe Schreiber und unabhängiger Prüfer',
  phases: [{ title: 'Schreiben' }, { title: 'Prüfen' }, { title: 'Nachbessern' }],
}

const BRIEF = '/home/user/info70/docs/arbeitsweise/briefs/c-brief.md'
const MESS = '/tmp/info70-messung-wfc'

const GRUPPEN = [
  { id: 'A1', apps: {
    'anzeige-oder-nicht': 'Strang А (Quiz über quiz-kern): tote Reste der Wertung entfernen, siehe Brief.',
    'app-rechte-quiz': 'Strang А (Quiz über quiz-kern): tote Reste der Wertung entfernen, siehe Brief.',
    'darf-ich-posten': 'Strang А (Quiz über quiz-kern): tote Reste der Wertung entfernen, siehe Brief.',
  } },
  { id: 'A2', apps: {
    'deepfake-spuernase': 'Strang А (Quiz über quiz-kern): tote Reste der Wertung entfernen, siehe Brief.',
    'fachquiz-erstes-lebensjahr': 'Strang А (Quiz über quiz-kern): tote Reste der Wertung entfernen, siehe Brief.',
    'fake-shop-fahnder': 'Strang А (Quiz über quiz-kern): tote Reste der Wertung entfernen, siehe Brief.',
  } },
  { id: 'A3', apps: {
    'generationen-quiz': 'Strang А (Quiz über quiz-kern): tote Reste der Wertung entfernen, siehe Brief.',
    'herkunftssprachen-bruecke': 'Strang А (Quiz über quiz-kern): tote Reste der Wertung entfernen, siehe Brief.',
    'koeder-quiz': 'Strang А (Quiz über quiz-kern): tote Reste der Wertung entfernen, siehe Brief.',
  } },
  { id: 'A4', apps: {
    'koerper-entdecker': 'Strang А (Quiz über quiz-kern): tote Reste der Wertung entfernen, siehe Brief.',
    'link-kompass': 'Strang А (Quiz über quiz-kern): tote Reste der Wertung entfernen, siehe Brief.',
    'maerchen-gedicht-fabel': 'Strang А (Quiz über quiz-kern): tote Reste der Wertung entfernen, siehe Brief.',
  } },
  { id: 'A5', apps: {
    'mathe-entdecker': 'Strang А (Quiz über quiz-kern): tote Reste der Wertung entfernen, siehe Brief.',
    'mensch-tier-pflanze': 'Strang А (Quiz über quiz-kern): tote Reste der Wertung entfernen, siehe Brief.',
    'mini-rechte-entdecker': 'Strang А (Quiz über quiz-kern): tote Reste der Wertung entfernen, siehe Brief.',
  } },
  { id: 'A6', apps: {
    'nachrichten-detektive': 'Strang А (Quiz über quiz-kern): tote Reste der Wertung entfernen, siehe Brief.',
    'nachrichten-detektive-junior': 'Strang А (Quiz über quiz-kern): tote Reste der Wertung entfernen, siehe Brief.',
    'nachrichten-detektive-profi': 'Strang А (Quiz über quiz-kern): tote Reste der Wertung entfernen, siehe Brief.',
  } },
  { id: 'A7', apps: {
    'plattform-rechte-13': 'Strang А (Quiz über quiz-kern): tote Reste der Wertung entfernen, siehe Brief.',
    'reim-radar': 'Strang А (Quiz über quiz-kern): tote Reste der Wertung entfernen, siehe Brief.',
    'stark-und-gesund': 'Strang А (Quiz über quiz-kern): tote Reste der Wertung entfernen, siehe Brief.',
  } },
  { id: 'A8', apps: {
    'warum-heisst-das-so': 'Strang А (Quiz über quiz-kern): tote Reste der Wertung entfernen, siehe Brief.',
    'wer-dahinter': 'Strang А (Quiz über quiz-kern): tote Reste der Wertung entfernen, siehe Brief.',
  } },
  { id: 'B1', apps: {
    'bot-oder-buddy': 'Strang Б (Kinder-App): Wertung entfernen, Speicherregel und Migration beachten, siehe Brief.',
    'challenge-druck': 'Strang Б (Kinder-App): Wertung entfernen, Speicherregel und Migration beachten, siehe Brief.',
    'chat-check': 'Strang Б (Kinder-App): Wertung entfernen, Speicherregel und Migration beachten, siehe Brief.',
  } },
  { id: 'B2', apps: {
    'chat-rechte': 'Strang Б (Kinder-App): Wertung entfernen, Speicherregel und Migration beachten, siehe Brief.',
    'dark-pattern-detektiv': 'Strang Б (Kinder-App): Wertung entfernen, Speicherregel und Migration beachten, siehe Brief.',
    'dark-pattern-labyrinth': 'Strang Б (Kinder-App): Wertung entfernen, Speicherregel und Migration beachten, siehe Brief.',
  } },
  { id: 'B3', apps: {
    'daten-schatz': 'Strang Б (Kinder-App): Wertung entfernen, Speicherregel und Migration beachten, siehe Brief.',
    'daten-schatz-mini': 'Strang Б (Kinder-App): Wertung entfernen, Speicherregel und Migration beachten, siehe Brief.',
    'deutschland-kompass': 'Strang Б (Kinder-App): Wertung entfernen, Speicherregel und Migration beachten, siehe Brief.',
  } },
  { id: 'B4', apps: {
    'erste-woerter-lesewerkstatt': 'Strang Б (Kinder-App): Wertung entfernen, Speicherregel und Migration beachten, siehe Brief.',
    'fomo-kompass': 'Strang Б (Kinder-App): Wertung entfernen, Speicherregel und Migration beachten, siehe Brief.',
    'formular-falle': 'Strang Б (Kinder-App): Wertung entfernen, Speicherregel und Migration beachten, siehe Brief.',
  } },
  { id: 'B5', apps: {
    'freunde-in-der-gruppe': 'Strang Б (Kinder-App): Wertung entfernen, Speicherregel und Migration beachten, siehe Brief.',
    'hoeflich-fair': 'Strang Б (Kinder-App): Wertung entfernen, Speicherregel und Migration beachten, siehe Brief.',
    'ich-schaff-das': 'Strang Б (Kinder-App): Wertung entfernen, Speicherregel und Migration beachten, siehe Brief.',
  } },
  { id: 'B6', apps: {
    'klang-detektive': 'Strang Б (Kinder-App): Wertung entfernen, Speicherregel und Migration beachten, siehe Brief.',
    'kunst-entdecker': 'Strang Б (Kinder-App): Wertung entfernen, Speicherregel und Migration beachten, siehe Brief.',
    'notruf-held': 'Strang Б (Kinder-App): Wertung entfernen, Speicherregel und Migration beachten, siehe Brief.',
  } },
  { id: 'B7', apps: {
    'rechte-kompass': 'Strang Б (Kinder-App): Wertung entfernen, Speicherregel und Migration beachten, siehe Brief.',
    'sicher-unterwegs': 'Strang Б (Kinder-App): Wertung entfernen, Speicherregel und Migration beachten, siehe Brief.',
    'stark-im-chat': 'Strang Б (Kinder-App): Wertung entfernen, Speicherregel und Migration beachten, siehe Brief.',
  } },
  { id: 'B8', apps: {
    'stark-im-chat-mini': 'Strang Б (Kinder-App): Wertung entfernen, Speicherregel und Migration beachten, siehe Brief.',
    'stark-im-chat-plus': 'Strang Б (Kinder-App): Wertung entfernen, Speicherregel und Migration beachten, siehe Brief.',
    'tier-zu-gast': 'Strang Б (Kinder-App): Wertung entfernen, Speicherregel und Migration beachten, siehe Brief.',
  } },
  { id: 'B9', apps: {
    'uhr-und-kalender-kind': 'Strang Б (Kinder-App): Wertung entfernen, Speicherregel und Migration beachten, siehe Brief.',
    'wer-wohnt-wo': 'Strang Б (Kinder-App): Wertung entfernen, Speicherregel und Migration beachten, siehe Brief.',
  } },
  { id: 'S1', apps: {
    'berechtigungs-safari': 'Sonderfall 35а, siehe Brief. Strang Б.',
  } },
  { id: 'S2', apps: {
    'takt-pause': 'Sonderfall 36а, siehe Brief. Strang Б.',
  } },
]

const SCHEMA_SCHREIBER = {
  type: 'object',
  properties: {
    berichte: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          app: { type: 'string' }, was_getan: { type: 'string' },
          geaendert: { type: 'array', items: { type: 'string' } },
          tests_vorher: { type: 'integer' }, tests_nachher: { type: 'integer' },
          scanner_nachher: { type: 'boolean' }, grund_ausnahme: { type: 'string' },
          entfernt: { type: 'array', items: { type: 'string' } },
          hinzugefuegt: { type: 'array', items: { type: 'string' } },
          fragen_fuer_max: { type: 'array', items: { type: 'string' } },
        },
        required: ['app', 'was_getan', 'geaendert', 'tests_vorher', 'tests_nachher', 'scanner_nachher', 'grund_ausnahme', 'entfernt', 'hinzugefuegt', 'fragen_fuer_max'],
      },
    },
  },
  required: ['berichte'],
}

const SCHEMA_PRUEFER = {
  type: 'object',
  properties: {
    urteile: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          app: { type: 'string' },
          urteil: { type: 'string', enum: ['ok', 'nachbessern', 'falsch'] },
          befunde: { type: 'array', items: { type: 'string' } },
          browser_neu: { type: 'boolean' },
        },
        required: ['app', 'urteil', 'befunde'],
      },
    },
  },
  required: ['urteile'],
}

let aktiv = 0
const wartende = []
async function slot(fn) {
  while (aktiv >= 8) await new Promise((r) => wartende.push(r))
  aktiv++
  try { return await fn() } finally { aktiv--; const w = wartende.shift(); if (w) w() }
}

const auftragText = (g) => Object.entries(g.apps).map(([a, t]) => `- ${a}: ${t}`).join('\n')

const schreiberPrompt = (g, nachbesserung) => `Du bist Schreiber der Gruppe ${g.id} (Lauf C) im Repo /home/user/info70. Lies zuerst den Brief ${BRIEF} vollständig und halte dich an ihn.

Deine Apps und Aufträge (nur diese Apps anfassen):
${auftragText(g)}
${nachbesserung ? `\nNACHBESSERUNG: Ein unabhängiger Prüfer hat Befunde gemeldet. Beheb nur diese, ohne anderes zu ändern:\n${nachbesserung}\n` : ''}
Gehe je App so vor: (1) Tests zählen (node --test apps/<slug>/test/*.test.mjs). (2) Scanner-Zeilen und Leistungsbericht ansehen. (3) Auftrag ausführen. (4) Texte der App angleichen. (5) Tests, Scanner, Änderungsumfang, Speicherregel prüfen; bei geändertem Code oder neuem Knopf auch die Browser-Prüfung (Ausgabeordner ${MESS}/${g.id}/<app>, jeweils nur diese App darin). (6) Bericht.
Bei Zweifel nicht ändern, sondern in fragen_fuer_max schreiben. Gib den Bericht nur als JSON nach Schema zurück.`

const pruefPrompt = (g, berichte) => `Du bist unabhängiger Prüfer der Gruppe ${g.id} im Repo /home/user/info70. Lies den Brief ${BRIEF}. Du hast die Arbeit nicht geschrieben: prüfe sie, vertraue dem Bericht nicht, versuche die Änderungen zu widerlegen.

Aufträge der Gruppe:
${auftragText(g)}

Bericht des Schreibers (zur Gegenprobe):
${JSON.stringify(berichte)}

Prüfe je App: (a) git diff -- apps/<slug> (Änderung gegen HEAD) liegt nur im Auftrag; nichts außerhalb von apps/<slug>, nichts Unerlaubtes entfernt (node tools/aenderungsumfang.mjs <app>). (b) node --test apps/<slug>/test/*.test.mjs grün; Tests nicht gelöscht, nur umgewandelt. (c) Scanner (node /home/user/info70/docs/arbeitsweise/werkzeuge/zeilen.mjs <app>) und leistungs-woerter: bleibt ein Treffer, ist er begründet (Ausnahme: Objekt oder Erwachsene) und stimmt der Grund im Bericht? (d) Verhalten bei Umbenennungen unverändert (Diff Zeile für Zeile). (e) Texte (README, GDD, eltern.html, index.html) stimmen mit dem Code überein, besonders der Satz über den Speicher. (f) Speicherregel: node --test packages/kinderschutz/test/speicher-regel.test.mjs; wurde eine Karte nur entfernt, wo wirklich nichts mehr gespeichert wird (setItem im App-Code und in gebundenen Bausteinen prüfen)? (g) Neue Löschknöpfe: richtiger Schlüssel, ergänzt statt ersetzt. (h) Browser-Prüfung für Apps mit neuem Code: node tools/browser-pruefung.mjs <app> - ${MESS}/${g.id}-pruefer/<app> und node tools/browser-basislinie.mjs --vergleich dieses Ordners; setze browser_neu true, wenn eine neue Verletzung gemeldet wird. (i) Quiz-Apps (Gruppen A1–A8, importieren quiz-kern): node tools/quiz-durchlauf.mjs <app> --modus alle muss mit Exit 0 enden. (j) node tools/leistungs-woerter.mjs <app>: jeder Rest ist begründet oder entfernt (neutraler Zähler des Gefundenen ist erlaubt). (k) Migration: höchstens eine Zeile removeItem mit Literal je alter Schlüssel, nicht in einer größeren Zeile.
Urteil je App: ok, nachbessern (konkrete Befunde) oder falsch (Auftrag verfehlt). Nur JSON nach Schema.`

const ergebnisse = await pipeline(
  GRUPPEN,
  (g) => slot(() => agent(schreiberPrompt(g), { label: `schreiben:${g.id}`, phase: 'Schreiben', schema: SCHEMA_SCHREIBER })),
  (s, g) => s && slot(() => agent(pruefPrompt(g, s.berichte), { label: `pruefen:${g.id}`, phase: 'Prüfen', schema: SCHEMA_PRUEFER }))
    .then(async (p) => {
      if (!p) return { gruppe: g.id, schreiber: s, pruefer: null, nachher: null }
      const schlecht = p.urteile.filter((u) => u.urteil !== 'ok')
      if (!schlecht.length) return { gruppe: g.id, schreiber: s, pruefer: p, nachher: null }
      const text = schlecht.map((u) => `${u.app} (${u.urteil}): ${u.befunde.join(' | ')}`).join('\n')
      const s2 = await slot(() => agent(schreiberPrompt(g, text), { label: `nachbessern:${g.id}`, phase: 'Nachbessern', schema: SCHEMA_SCHREIBER }))
      const p2 = s2 && await slot(() => agent(pruefPrompt(g, s2.berichte), { label: `pruefen2:${g.id}`, phase: 'Nachbessern', schema: SCHEMA_PRUEFER }))
      return { gruppe: g.id, schreiber: s, pruefer: p, nachher: { schreiber: s2, pruefer: p2 } }
    }),
)

const fertig = ergebnisse.filter(Boolean)
const agenten = GRUPPEN.length * 2 + fertig.filter((e) => e.nachher).length * 2
log(`${agenten} Agenten (Gruppen ${fertig.length}/${GRUPPEN.length}, davon nachgebessert ${fertig.filter((e) => e.nachher).length})`)
return fertig
