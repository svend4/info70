export const meta = {
  name: 'gdd-entwuerfe',
  description: 'Kurz-GDD für 10 Apps ohne GDD (26а) und 5 Einheiten der neuen Welle (11а): je Gruppe ein Schreiber und ein unabhängiger Prüfer; nur Dokumente',
  phases: [{ title: 'Schreiben' }, { title: 'Prüfen' }, { title: 'Nachbessern' }],
}

const BRIEF = '/home/user/info70/docs/arbeitsweise/briefs/gdd-brief.md'

const GRUPPEN = [
  { id: 'A1', teil: 'A', ziele: [['daten-schatz', 'apps/daten-schatz/GDD.md'], ['feed-forscher', 'apps/feed-forscher/GDD.md']] },
  { id: 'A2', teil: 'A', ziele: [['foerder-navigator', 'apps/foerder-navigator/GDD.md'], ['geschichten-werkstatt', 'apps/geschichten-werkstatt/GDD.md']] },
  { id: 'A3', teil: 'A', ziele: [['kettenbrief-stopper', 'apps/kettenbrief-stopper/GDD.md'], ['kinderrechte-entdecker', 'apps/kinderrechte-entdecker/GDD.md']] },
  { id: 'A4', teil: 'A', ziele: [['kriterien-check', 'apps/kriterien-check/GDD.md'], ['nachrichten-detektive', 'apps/nachrichten-detektive/GDD.md']] },
  { id: 'A5', teil: 'A', ziele: [['stark-im-chat', 'apps/stark-im-chat/GDD.md'], ['takt-pause', 'apps/takt-pause/GDD.md']] },
  { id: 'N1', teil: 'B', ziele: [['CON-3', 'docs/neue-welle/GDD-CON-3.md'], ['CON-6', 'docs/neue-welle/GDD-CON-6.md']] },
  { id: 'N2', teil: 'B', ziele: [['CON-9', 'docs/neue-welle/GDD-CON-9.md'], ['CON-10', 'docs/neue-welle/GDD-CON-10.md']] },
  { id: 'N3', teil: 'B', ziele: [['PRI-8', 'docs/neue-welle/GDD-PRI-8.md']] },
]

const SCHEMA_SCHREIBER = {
  type: 'object',
  properties: {
    dateien: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          pfad: { type: 'string' },
          zielgruppe: { type: 'string', enum: ['Kind', 'Erwachsene', 'beide', 'unklar', 'nicht zutreffend'] },
          belege: { type: 'array', items: { type: 'string' } },
          offene_punkte: { type: 'array', items: { type: 'string' } },
          widersprueche: { type: 'array', items: { type: 'string' } },
          geprueft: { type: 'array', items: { type: 'string' } },
        },
        required: ['pfad', 'zielgruppe', 'belege', 'offene_punkte', 'widersprueche', 'geprueft'],
      },
    },
  },
  required: ['dateien'],
}

const SCHEMA_PRUEFER = {
  type: 'object',
  properties: {
    urteile: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          pfad: { type: 'string' },
          urteil: { type: 'string', enum: ['ok', 'nachbessern', 'falsch'] },
          befunde: { type: 'array', items: { type: 'string' } },
        },
        required: ['pfad', 'urteil', 'befunde'],
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

const ziele = (g) => g.ziele.map(([name, pfad]) => `- ${name}: ${pfad}`).join('\n')

const schreiberPrompt = (g, nachbesserung) => `Du bist Schreiber der Gruppe ${g.id} (Teil ${g.teil}) im Repo /home/user/info70. Lies zuerst den Brief ${BRIEF} vollständig und halte dich an ihn.
Deine Einheiten und Zieldateien (nur diese Dateien anlegen):
${ziele(g)}
${nachbesserung ? `\nNACHBESSERUNG: Ein unabhängiger Prüfer hat Befunde gemeldet. Beheb nur diese:\n${nachbesserung}\n` : ''}
Gib den Bericht nur als JSON nach Schema zurück.`

const pruefPrompt = (g, bericht) => `Du bist unabhängiger Prüfer der Gruppe ${g.id} (Teil ${g.teil}) im Repo /home/user/info70. Lies den Brief ${BRIEF}. Du hast die Dateien nicht geschrieben: prüfe sie, vertraue dem Bericht nicht, versuche die Aussagen zu widerlegen.
Zieldateien:
${ziele(g)}
Bericht des Schreibers (zur Gegenprobe): ${JSON.stringify(bericht)}
Prüfe je Datei: (a) Sie existiert, hat die zehn Abschnitte in der Reihenfolge der Vorlage und ist die einzige Änderung der Gruppe (git status --short zeigt außer den Zieldateien nichts Neues von dieser Gruppe). (b) Teil A: jede Aussage in Abschnitt 2 und 6 stimmt mit dem Code überein (prüfe stichprobenartig, mindestens: Zielgruppe mit Beleg, Speicher und Löschknopf, Vorlesen, eltern.html, Druck, Wertungs-Stand-Eintrag, Testzahl falls genannt). Teil B: jede Quellenangabe stimmt mit dem Bauauftrag überein, kein Zitat über 6 Wörter, «(Eigenentwurf)» wo nötig, die Tore aus docs/plan-neue-welle.md sind vollständig. (c) Keine erfundenen Fakten über Recht, Geld oder Gesundheit; keine Modellnamen; docs/02 nur mit Z. 22–24, 79–82 oder 141–146. (d) node --test packages/kinderschutz/test/testzahlen.test.mjs und die Tests der App (Teil A) sind grün. (e) Die Widersprüche in Abschnitt 10 sind echt (prüfe zwei davon). Urteil je Datei: ok, nachbessern (konkrete Befunde) oder falsch. Nur JSON nach Schema.`

const ergebnisse = await pipeline(
  GRUPPEN,
  (g) => slot(() => agent(schreiberPrompt(g), { label: `schreiben:${g.id}`, phase: 'Schreiben', schema: SCHEMA_SCHREIBER })),
  (s, g) => s && slot(() => agent(pruefPrompt(g, s.dateien), { label: `pruefen:${g.id}`, phase: 'Prüfen', schema: SCHEMA_PRUEFER }))
    .then(async (p) => {
      if (!p) return { gruppe: g.id, schreiber: s, pruefer: null, nachher: null }
      const schlecht = p.urteile.filter((u) => u.urteil !== 'ok')
      if (!schlecht.length) return { gruppe: g.id, schreiber: s, pruefer: p, nachher: null }
      const text = schlecht.map((u) => `${u.pfad} (${u.urteil}): ${u.befunde.join(' | ')}`).join('\n')
      const s2 = await slot(() => agent(schreiberPrompt(g, text), { label: `nachbessern:${g.id}`, phase: 'Nachbessern', schema: SCHEMA_SCHREIBER }))
      const p2 = s2 && await slot(() => agent(pruefPrompt(g, s2.dateien), { label: `pruefen2:${g.id}`, phase: 'Nachbessern', schema: SCHEMA_PRUEFER }))
      return { gruppe: g.id, schreiber: s, pruefer: p, nachher: { schreiber: s2, pruefer: p2 } }
    }),
)

const fertig = ergebnisse.filter(Boolean)
const agenten = GRUPPEN.length * 2 + fertig.filter((e) => e.nachher).length * 2
log(`${agenten} Agenten (Gruppen ${fertig.length}/${GRUPPEN.length}, davon nachgebessert ${fertig.filter((e) => e.nachher).length})`)
return fertig
