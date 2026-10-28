export const meta = {
  name: 'lauf-d-seitenmarke',
  description: 'Lauf D: ehrliche Marke „Seitenangaben nicht von einem Menschen geprüft“ in 31 alten Apps (Entscheidung Max 22а); je Gruppe Schreiber und unabhängiger Prüfer',
  phases: [{ title: 'Schreiben' }, { title: 'Prüfen' }, { title: 'Nachbessern' }],
}

const BRIEF = '/home/user/info70/docs/arbeitsweise/briefs/d-brief.md'
const MESS = '/tmp/info70-messung-wfd'

const GRUPPEN = [
  ['D1', ['architektur-spaziergang', 'avv-checkliste-hosting', 'bewegungs-kartei-erstes-jahr']],
  ['D2', ['bewegungs-richtwerte-3-5', 'buchecke-check', 'elterngespraech-trainer']],
  ['D3', ['elterngespraech-uebergang', 'entwicklungs-kompass', 'erste-woerter-tagebuch']],
  ['D4', ['fachquiz-erstes-lebensjahr', 'frischluft-familie', 'impulskarten-sujetspiel']],
  ['D5', ['kita-mitmach-boerse', 'kita-unterstuetzungs-navigator', 'kita-wochenplaner']],
  ['D6', ['klanggeschichten-erzeuger', 'kunst-gucken', 'mess-labor']],
  ['D7', ['mini-oper-baukasten', 'morgenkreis-wochenplaner-u3', 'musik-alltags-begleiter']],
  ['D8', ['musik-jahresplaner', 'musikmomente-1-3', 'puste-lauschspiel-kartei']],
  ['D9', ['schatzkarten-generator', 'schulanfang-spiel-navigator', 'selbststaendigkeits-leiter']],
  ['D10', ['spielbegleiter-rollenspiel', 'spielzeug-check-u3', 'sprich-mit-mir']],
  ['D11', ['wachstums-bewegungs-begleiter']],
].map(([id, apps]) => ({ id, apps }))

const SCHEMA_SCHREIBER = {
  type: 'object',
  properties: {
    berichte: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          app: { type: 'string' },
          wo_sichtbar: { type: 'array', items: { type: 'string' } },
          ergaenzt: { type: 'array', items: { type: 'string' } },
          marke_wortlaut: { type: 'string' },
          tests_vorher: { type: 'integer' }, tests_nachher: { type: 'integer' },
          marke_true: { type: 'boolean' },
          fragen_fuer_max: { type: 'array', items: { type: 'string' } },
        },
        required: ['app', 'wo_sichtbar', 'ergaenzt', 'marke_wortlaut', 'tests_vorher', 'tests_nachher', 'marke_true', 'fragen_fuer_max'],
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

const schreiberPrompt = (g, nachbesserung) => `Du bist Schreiber der Gruppe ${g.id} (Lauf D) im Repo /home/user/info70. Lies zuerst den Brief ${BRIEF} vollständig und halte dich an ihn.
Deine Apps (nur diese anfassen): ${g.apps.join(', ')}
${nachbesserung ? `\nNACHBESSERUNG: Ein unabhängiger Prüfer hat Befunde gemeldet. Beheb nur diese:\n${nachbesserung}\n` : ''}
Gib den Bericht nur als JSON nach Schema zurück.`

const pruefPrompt = (g, berichte) => `Du bist unabhängiger Prüfer der Gruppe ${g.id} (Lauf D) im Repo /home/user/info70. Lies den Brief ${BRIEF}. Du hast die Arbeit nicht geschrieben: prüfe sie, vertraue dem Bericht nicht, versuche sie zu widerlegen.
Apps: ${g.apps.join(', ')}
Bericht des Schreibers: ${JSON.stringify(berichte)}
Prüfe je App: (a) git diff -- apps/<slug>: nur Ergänzungen der Marke (Zeilen kommen hinzu; entfernt oder umformuliert wird nichts außer dem, was für den Einbau der Marke in dieselbe Zeile nötig ist); nichts außerhalb von apps/<slug>. (b) Der Wortlaut der Marke ist genau „Seitenangaben nicht von einem Menschen geprüft.“ oder „Seitenangaben der Quelle: nicht von einem Menschen geprüft.“; nirgends die Behauptung „maschinell geprüft“. (c) Die Marke steht dort, wo die Seitenangaben gesehen werden (prüfe selbst: app.mjs, logik.mjs, daten, index.html, eltern.html, druck.css; werden die Angaben angezeigt oder gedruckt? Stimmt das wo_sichtbar des Schreibers?). Steht die Seitenangabe im Druck, steht dort auch die Marke, nicht nur auf dem Bildschirm. (d) node --test apps/<slug>/test/*.test.mjs grün; die Druckregeln der App (keine Emojis oder Zeichen ☐☒☑✓✔★☆ im Druck) bleiben erfüllt. (e) appBefund liefert marke: true: node -e "import('/home/user/info70/packages/kinderschutz/src/seitenmarke.mjs').then(async m => console.log(JSON.stringify(await m.appBefund('/home/user/info70/apps/<slug>'))))". (f) Wenn app.mjs oder index.html geändert wurden: node tools/browser-tor.mjs <slug> --ausgabe ${MESS}/${g.id}-pruefer (Exit 0, keine Erhöhung). (g) node tools/leistungs-woerter.mjs <slug> zeigt keinen neuen Treffer durch die Ergänzung. Urteil je App: ok, nachbessern (konkrete Befunde) oder falsch. Nur JSON nach Schema.`

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
