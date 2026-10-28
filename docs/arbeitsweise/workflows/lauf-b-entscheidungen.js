export const meta = {
  name: 'lauf-b-entscheidungen',
  description: 'Lauf B: Umbenennungen, Abstimmungstexte, Prüfungen der Ausnahmen, Speicherregel in 26 Apps (je Gruppe Schreiber und unabhängiger Prüfer)',
  phases: [{ title: 'Schreiben' }, { title: 'Prüfen' }, { title: 'Nachbessern' }],
}

const BRIEF = '/home/user/info70/docs/arbeitsweise/briefs/b-brief.md'
const MESS = '/tmp/info70-messung-wfb'

const GRUPPEN = [
  { id: 'B1', apps: {
    'ergebnis-plakat': 'Entscheidung 2б. Abstimmung über Plakatentwürfe; der Sieger steht mit 🏆. Ersetze 🏆 und die Siegerformulierung durch neutrale Worte („Meiste Stimmen: …“). Die App bleibt eine Ausnahme für die übrigen Treffer (bewertet werden Entwürfe, kein Kind). Prüfe das im Code.',
    'mitmach-arena': 'Entscheidung 2б. Abstimmung der Klasse über Vorschläge, 🏆 beim Sieger. Ersetze 🏆 und die Siegerformulierung durch neutrale Worte („Meiste Stimmen: …“). Bleibt Ausnahme für die übrigen Treffer (bewertet werden Vorschläge, kein Kind). Prüfe das im Code.',
    'wahlkabine': 'Entscheidung 2б. Wahlsimulation, 🏆 beim Sieger. Ersetze 🏆 und die Siegerformulierung durch neutrale Worte („Meiste Stimmen: …“). Bleibt Ausnahme für die übrigen Treffer. Der Löschknopf „Wahl löschen“ bleibt. Prüfe im Code, dass kein Kind bewertet wird.',
  } },
  { id: 'B2', apps: {
    'quiz-karten-druck': 'Entscheidung 4а, Umbenennen. Die Variable richtige ist die richtige Antwort auf der Karte („Richtig: …“), kein Zähler. Benenne sie um (z. B. loesung), Verhalten und Ausgabe bleiben gleich.',
    'tier-tanz-impulse': 'Entscheidung 4а, Umbenennen. Die Variable treffer ist die Fundstelle eines Musters in einer Fehlermeldung. Benenne sie um (z. B. fundstelle), Verhalten bleibt gleich.',
    'eltern-kompass-generator': 'Entscheidung 4а. Ein Beispieltext im Feld lautet „nur der Rekord, löschbar per Knopf“. Formuliere ihn so, dass er sagt, was die App wirklich speichert (prüfe den Code), ohne das Wort Rekord, löschbar per Knopf bleibt, wenn es stimmt. Prüfe auch, ob die App speichert und einen Löschknopf hat (Speicherregel).',
  } },
  { id: 'B3', apps: {
    'schulanfang-spiel-navigator': 'Entscheidung 4а. Das Wort „Rang“ steht im Satz „den Rang der führenden Tätigkeit“. Formuliere um (z. B. „die Reihenfolge der führenden Tätigkeit“), sonst nichts ändern.',
    'selbstcheck-paedagogik': 'Entscheidung 4а, Umbenennen. STUFEN_RANG ist die interne Ordnung der Stufen und wird nicht angezeigt. Benenne um (z. B. STUFEN_REIHENFOLGE), Verhalten bleibt gleich. Die Speicherregel meldet diese App: speichert ohne Löschknopf. Prüfe, ob ein Knopf „Alle Daten löschen“ (🧹) mit removeItem da ist; wenn ja, ist nur die Erkennung zu eng (melde das), wenn nein, ergänze den Löschknopf (nur Ergänzung).',
    'interaktions-konzept-assistent': 'Entscheidung 4а. „Rangfolge der Risikostufen“ bewertet ein Konzept, kein Kind. Benenne Code und Text um (z. B. Reihenfolge der Risikostufen), Verhalten bleibt gleich.',
  } },
  { id: 'B4', apps: {
    'kita-mitmach-boerse': 'Entscheidung 4а, Umbenennen. Die Summen der Rückmeldungen „interessiert“ und „kann mithelfen“ je Angebot stehen in einem Zähler namens summen. Benenne um (z. B. rueckmeldungen oder anzahlen), Verhalten bleibt gleich. Prüfe, dass dabei keine Kinder bewertet werden.',
    'elterngespraech-trainer': 'Entscheidung 5б: die Ausnahme „Auf Anweisung Max“ ist nicht belegt und entfällt. logik.mjs hat ein Prüfmuster GESAMTWERTUNG gegen Gesamtwertungen in den Texten. Der Scanner zählt das Wort Rangliste in diesem Muster. Streiche Rangliste aus dem Muster (der Wertungs-Stand prüft dieses Wort in allen Dateien der App ohnehin; schreibe das in einen Kommentar), behalte von N Punkten, Gesamtpunkt und Ranking. Der Test darf nicht schwächer werden: füge einen Test hinzu, der zeigt, dass ein Text mit Gesamtpunkt oder von 5 Punkten das Muster trifft. Danach darf der Scanner die App nicht mehr melden.',
    'gesunder-koerper-ampel': 'Entscheidung 5б: die Ausnahme entfällt. logik.mjs prüft mit \'raenge\' in daten, dass die Daten keine Rangtabelle haben. Ersetze die Prüfung durch eine Liste der erlaubten Schlüssel der obersten Ebene (jeder unbekannte Schlüssel ist ein Fehler, Meldung „unbekannter Schlüssel: … (diese App bewertet Kinder nicht)“). Das ist strenger, nennt das Wort nicht mehr, und der Test mit einem eingefügten Rang-Schlüssel muss weiter einen Fehler zeigen. Danach darf der Scanner die App nicht mehr melden.',
  } },
  { id: 'B5', apps: {
    'familien-datenschatz': 'Entscheidung 8б. Auf dem Ergebnisbildschirm stehen „🧒 Kind: <Antwort> — 💎💎 (2)“ und „🧑‍🦰 Eltern: <Antwort> — 💎 (1)“. Entferne 💎 und die Zahlen bei beiden und die Punktberechnung, soweit sie nur der Anzeige dient. Es bleiben die Antworten und die Sätze „Ihr wart euch einig“ und „Ihr habt unterschiedlich entschieden“. Tests werden Abwesenheits-Tests. Texte (README, GDD, eltern.html) angleichen.',
    'autonomiephase-navigator': 'Entscheidung 6а. Die App ist ein Trainer für Eltern (bewertet Entscheidungen der Eltern, kein Kind) und bleibt eine bestätigte Ausnahme. Sie zeigt „Ihr bisher bester Durchgang: N von M“ und speichert den Rekord, hat aber keinen Löschknopf (kein removeItem, kein „löschen“ im Code). Ergänze nur einen Löschknopf (datenKarte aus kinder-ui/js/daten-karte.mjs oder ein eigener Knopf mit removeItem für den gespeicherten Schlüssel), nichts entfernen. Passe den Speicher-Satz in eltern.html, README und GDD an.',
    'staerken-tagebuch': 'Entscheidung 7а. Ein Erwachsener markiert beobachtete Momente aus einer festen Liste (vier Felder zu acht Momenten); je Feld steht „Bisher N Beobachtungen in diesem Feld“. Prüfe im Code und in den Texten: gezählt wird nur die Zahl der Einträge, keine Punkte, Prozente, kein Vergleich der Felder, keine Rangfolge. Ändere am Code nichts, wenn das stimmt; es gibt eine Möglichkeit, die Daten zu löschen. Liefere den Grund für die Ausnahme. Stimmt etwas davon nicht, melde es.',
  } },
  { id: 'B6', apps: {
    'sharenting-spiegel': 'Entscheidung 3а. Werkzeug für Eltern; eine Zahl bewertet den eigenen Umgang der Eltern mit Kinderfotos. Prüfe im Code, in daten/ und in den Texten, dass nirgends ein Kind bewertet wird und die Zielgruppe Erwachsene ist. Ändere nichts, wenn das stimmt. Liefere den Grund für die Ausnahme.',
    'lehrkraefte-szenariotraining': 'Entscheidung 3а. Werkzeug für Lehrkräfte; Punkte bewerten Entscheidungen der Lehrkraft. Prüfe im Code, in daten/ und in den Texten, dass nirgends ein Kind bewertet wird. Ändere nichts, wenn das stimmt. Liefere den Grund für die Ausnahme.',
    'kita-familien-bruecke': 'Entscheidung 3а. Werkzeug für Teams von Kitas; Punkte und Ampel bewerten die Arbeit des Teams. Prüfe im Code, in daten/ und in den Texten, dass nirgends ein Kind oder eine Familie bewertet wird. Ändere nichts, wenn das stimmt. Liefere den Grund für die Ausnahme.',
  } },
  { id: 'B7', apps: {
    'foerder-navigator': 'Entscheidung 3а. Werkzeug für Erwachsene; 🏆 ist das Symbol der Kategorie „Sichtbarkeit (Preise/Siegel)“, „n von m Programmen“ ist die Zahl gefundener Programme. Prüfe im Code und in den Texten, dass kein Kind bewertet wird. Ändere nichts, wenn das stimmt. Liefere den Grund für die Ausnahme.',
    'seiten-scanner': 'Entscheidung 2б. Die App bewertet Websites („n von MAX sicher“), keine Kinder. Prüfe das im Code und in den Texten. Ändere nichts, wenn das stimmt. Liefere den Grund für die Ausnahme. Die Speicherregel prüft die App: hat sie Speicher, muss ein Löschknopf da sein (melde, wenn nicht).',
    'entwicklungs-kompass': 'Entscheidung 30б. Die App zeigt eine Karte „Meine Daten löschen“ (datenKarte), speichert aber laut Speicherregel nichts. Prüfe im Code und in den gemeinsamen Bausteinen, die die App einbindet, ob sie wirklich nichts speichert (außer der gemeinsamen Anzeige-Einstellung, die nicht zählt). Wenn ja: entferne die Karte, den Import und den Satz über das Löschen in den Texten, ergänze einen Test „kein Speicher, kein Löschknopf“. Wenn nein: ändere nichts und melde es.',
  } },
  { id: 'B8', apps: {
    'schulstart-begleiter': 'Entscheidung 30б. Die App zeigt eine Karte „Meine Daten löschen“ (datenKarte), speichert aber laut Speicherregel nichts. Prüfe im Code und in den eingebundenen gemeinsamen Bausteinen, ob sie wirklich nichts speichert (die gemeinsame Anzeige-Einstellung zählt nicht). Wenn ja: entferne die Karte, den Import und den Satz über das Löschen in den Texten, ergänze einen Test „kein Speicher, kein Löschknopf“. Wenn nein: ändere nichts und melde es.',
    'elternabend-kit': 'Entscheidung 30б und 27а-Prinzip. Die App speichert die Sprachwahl über kinder-ui/js/sprache.mjs, hat aber keinen Löschknopf. Ergänze (nur Ergänzung) einen Löschknopf für den Sprach-Schlüssel (datenKarte mit schluessel und was: „deine Sprachwahl“, oder ein eigener Knopf mit removeItem). Lies kinder-ui/js/sprache.mjs, um den Schlüssel zu finden. Texte angleichen, Test ergänzen.',
    'kettenbrief-stopper': 'Entscheidung 27а-Prinzip. Die App speichert die Sprachwahl über kinder-ui/js/sprache.mjs, hat aber keinen Löschknopf. Ergänze (nur Ergänzung) einen Löschknopf für den Sprach-Schlüssel (datenKarte mit schluessel und was: „deine Sprachwahl“, oder ein eigener Knopf mit removeItem). Lies kinder-ui/js/sprache.mjs, um den Schlüssel zu finden. Texte der App (README, GDD, eltern.html) angleichen, Test ergänzen. Das Impressum der Wurzel fasst du nicht an (macht der Integrator).',
  } },
  { id: 'B9', apps: {
    'familienschatz-reime': 'Entscheidung 30б. Die Speicherregel meldet „speichert ohne Löschknopf“. Prüfe, wie Einträge gelöscht werden (einzelner Eintrag „… löschen“?). Gibt es keine Möglichkeit, alles zu löschen, ergänze (nur Ergänzung) „Meine Daten löschen“ (datenKarte mit dem Schlüssel) und passe die Texte an. Gibt es sie schon in anderer Form, ist nur die Erkennung zu eng: melde das mit Fundstelle.',
    'stations-konfigurator': 'Entscheidung 30б. Die Speicherregel meldet „speichert ohne Löschknopf“. Es gibt einen Knopf „🧹 Alles löschen“. Prüfe, ob er die gespeicherten Daten wirklich entfernt (removeItem oder Speicher leeren). Wenn ja: nur die Erkennung ist zu eng, melde Fundstelle und Form. Wenn nein: ergänze (nur Ergänzung) das Löschen des Schlüssels.',
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

const schreiberPrompt = (g, nachbesserung) => `Du bist Schreiber der Gruppe ${g.id} im Repo /home/user/info70. Lies zuerst den Brief ${BRIEF} vollständig und halte dich an ihn.

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

Prüfe je App: (a) git diff -- apps/<slug> (Änderung gegen HEAD) liegt nur im Auftrag; nichts außerhalb von apps/<slug>, nichts Unerlaubtes entfernt (node tools/aenderungsumfang.mjs <app>). (b) node --test apps/<slug>/test/*.test.mjs grün; Tests nicht gelöscht, nur umgewandelt. (c) Scanner (node /home/user/info70/docs/arbeitsweise/werkzeuge/zeilen.mjs <app>) und leistungs-woerter: bleibt ein Treffer, ist er begründet (Ausnahme: Objekt oder Erwachsene) und stimmt der Grund im Bericht? (d) Verhalten bei Umbenennungen unverändert (Diff Zeile für Zeile). (e) Texte (README, GDD, eltern.html, index.html) stimmen mit dem Code überein, besonders der Satz über den Speicher. (f) Speicherregel: node --test packages/kinderschutz/test/speicher-regel.test.mjs; wurde eine Karte nur entfernt, wo wirklich nichts mehr gespeichert wird (setItem im App-Code und in gebundenen Bausteinen prüfen)? (g) Neue Löschknöpfe: richtiger Schlüssel, ergänzt statt ersetzt. (h) Browser-Prüfung für Apps mit neuem Code: node tools/browser-pruefung.mjs <app> - ${MESS}/${g.id}-pruefer/<app> und node tools/browser-basislinie.mjs --vergleich dieses Ordners; setze browser_neu true, wenn eine neue Verletzung gemeldet wird.
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
