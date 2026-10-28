export const meta = {
  name: 'lauf-e-neue-apps',
  description: 'Lauf E: Stufe 1 der neuen Welle (11б): vier neue Apps nach Bauauftrag (CON-3, CON-6, CON-9, CON-10); je Einheit ein Schreiber und ein unabhängiger Prüfer',
  phases: [{ title: 'Bauen' }, { title: 'Prüfen' }, { title: 'Nachbessern' }],
}

const BRIEF = '/home/user/info70/docs/arbeitsweise/briefs/e-brief.md'
const MESS = '/tmp/info70-messung-wfe'

const EINHEITEN = [
  { id: 'CON-3', slug: 'meine-familie-woerter-und-rollen-content-pack', titel: 'Meine Familie – Wörter und Rollen (Content-Pack)' },
  { id: 'CON-6', slug: 'himmelsgucker-sonne-mond-und-sterne', titel: 'Himmelsgucker: Sonne, Mond und Sterne' },
  { id: 'CON-9', slug: 'farbwoerter-schatz', titel: 'Farbwörter-Schatz' },
  { id: 'CON-10', slug: 'musik-woerter-bilderlexikon', titel: 'Musik-Wörter-Bilderlexikon' },
]

const SCHEMA_BAU = {
  type: 'object',
  properties: {
    kennung: { type: 'string' }, slug: { type: 'string' },
    was_gebaut: { type: 'array', items: { type: 'string' } },
    tests: { type: 'integer' },
    browser: { type: 'array', items: { type: 'string' } },
    abweichungen_vom_bauauftrag: { type: 'array', items: { type: 'string' } },
    offene_punkte: { type: 'array', items: { type: 'string' } },
    registrierung: { type: 'string' },
    fragen_fuer_max: { type: 'array', items: { type: 'string' } },
  },
  required: ['kennung', 'slug', 'was_gebaut', 'tests', 'browser', 'abweichungen_vom_bauauftrag', 'offene_punkte', 'registrierung', 'fragen_fuer_max'],
}

const SCHEMA_PRUEFER = {
  type: 'object',
  properties: {
    urteil: { type: 'string', enum: ['ok', 'nachbessern', 'falsch'] },
    befunde: { type: 'array', items: { type: 'string' } },
    geprueft: { type: 'array', items: { type: 'string' } },
  },
  required: ['urteil', 'befunde', 'geprueft'],
}

let aktiv = 0
const wartende = []
async function slot(fn) {
  while (aktiv >= 8) await new Promise((r) => wartende.push(r))
  aktiv++
  try { return await fn() } finally { aktiv--; const w = wartende.shift(); if (w) w() }
}

const bauPrompt = (e, nachbesserung) => `Du bist Schreiber der Einheit ${e.id} „${e.titel}“ (Lauf E) im Repo /home/user/info70. Lies zuerst den Brief ${BRIEF} vollständig und halte dich an ihn.
Deine Kennung: ${e.id}. Dein Ordner: apps/${e.slug}/ (neue App). Deine Registrierungsdatei: docs/registrierung/${e.id}.json. Der Bauauftrag: docs/bauauftraege/${e.id}-*.md. Der GDD-Entwurf: docs/neue-welle/GDD-${e.id}.md (lies seinen Abschnitt „Stand der Prüfung“ am Anfang).
${nachbesserung ? `\nNACHBESSERUNG: Ein unabhängiger Prüfer hat Befunde gemeldet. Beheb genau diese, ohne Neues zu bauen:\n${nachbesserung}\n` : ''}
Ausgabeordner für Browser-Messungen: ${MESS}/${e.id}. Gib den Bericht nur als JSON nach Schema zurück.`

const pruefPrompt = (e, bericht) => `Du bist unabhängiger Prüfer der Einheit ${e.id} „${e.titel}“ (Lauf E) im Repo /home/user/info70. Lies den Brief ${BRIEF} und den Bauauftrag docs/bauauftraege/${e.id}-*.md. Du hast die App nicht gebaut: prüfe sie, vertraue dem Bericht nicht, versuche sie zu widerlegen.
App: apps/${e.slug}/ (neu), Registrierung docs/registrierung/${e.id}.json. Bericht des Schreibers: ${JSON.stringify(bericht)}
Prüfe: (1) Umfang: git status --short zeigt von dieser Einheit nur apps/${e.slug}/ und docs/registrierung/${e.id}.json (andere Pfade gehören anderen Agenten; melde nur, wenn deine Einheit etwas Fremdes angefasst hat). (2) Der Bauauftrag Abschnitt 2 bis 8 ist erfüllt: Dateien, Funktion, Daten, Pseudocode, Regeln, Tests, Abnahme; jede Abweichung ist im Bericht begründet. (3) node --test apps/${e.slug}/test/*.test.mjs grün; Tests sind nicht schwach (prüfe, ob sie wirklich etwas verbieten: ändere zur Probe eine Kopie, nicht das Original, und sieh, dass ein Test rot wird). (4) Alle Regeln aus dem Brief: keine Wertung (node tools/leistungs-woerter.mjs ${e.slug}), Speicherregel (node --test packages/kinderschutz/test/speicher-regel.test.mjs), Favicon nur auf der Stylesheet-Zeile, kein Service Worker, externe Fakten (node --test packages/kinderschutz/test/externe-fakten.test.mjs), Seitenmarke (node --test packages/kinderschutz/test/seitenmarke.test.mjs; die App darf dort nicht neu auftauchen), Wertungs-Stand (node tools/bewertung-stand.mjs), Testzahlen (node --test packages/kinderschutz/test/testzahlen.test.mjs), docs/02 nur mit Z. 22–24, 79–82, 141–146. (5) Quellen: jedes Zitat höchstens 6 Wörter mit Seite, gegen die Textkopie ${'/tmp/info70-quelle/all.txt'} geprüft (stichprobenartig mindestens fünf selbst nachschlagen); alles Eigene als „(Eigenentwurf)“; keine ganzen Sätze aus dem Buch; keine Fakten über Recht, Geld, Gesundheit ohne Quelle oder Vermerk. (6) Browser: node tools/browser-tor.mjs ${e.slug} --ausgabe ${MESS}/${e.id}-pruefer (für eine neue App zählt jede Verletzung; Ziel Exit 0); sieh dir die Druckansicht selbst an (druck.zeichen leer, keine Namenszeile, Zahl der Karten gleich Auswahl). (7) Zielgruppe und Vorlesen stimmen mit dem Bauauftrag überein; Kinder-Texte sind sachlich, ohne Urteil über das Kind. (8) Die Registrierungsdatei hat alle Felder wie docs/registrierung/PRI-8.json, der Zeilentext für Hub und README passt zur App, tests_app stimmt. Urteil: ok, nachbessern (konkrete Befunde) oder falsch. Nur JSON nach Schema.`

const ergebnisse = await pipeline(
  EINHEITEN,
  (e) => slot(() => agent(bauPrompt(e), { label: `bauen:${e.id}`, phase: 'Bauen', schema: SCHEMA_BAU })),
  (b, e) => b && slot(() => agent(pruefPrompt(e, b), { label: `pruefen:${e.id}`, phase: 'Prüfen', schema: SCHEMA_PRUEFER }))
    .then(async (p) => {
      if (!p) return { einheit: e.id, bau: b, pruefer: null, nachher: null }
      if (p.urteil === 'ok') return { einheit: e.id, bau: b, pruefer: p, nachher: null }
      const b2 = await slot(() => agent(bauPrompt(e, p.befunde.join('\n')), { label: `nachbessern:${e.id}`, phase: 'Nachbessern', schema: SCHEMA_BAU }))
      const p2 = b2 && await slot(() => agent(pruefPrompt(e, b2), { label: `pruefen2:${e.id}`, phase: 'Nachbessern', schema: SCHEMA_PRUEFER }))
      return { einheit: e.id, bau: b, pruefer: p, nachher: { bau: b2, pruefer: p2 } }
    }),
)

const fertig = ergebnisse.filter(Boolean)
const agenten = EINHEITEN.length * 2 + fertig.filter((e) => e.nachher).length * 2
log(`${agenten} Agenten (Einheiten ${fertig.length}/${EINHEITEN.length}, davon nachgebessert ${fertig.filter((e) => e.nachher).length})`)
return fertig
