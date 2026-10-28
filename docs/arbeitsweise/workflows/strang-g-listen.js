export const meta = {
  name: 'strang-g-listen',
  description: 'Strang Г: externe Fakten, nur Listen mit Vorschlag je Zeile (326 Zeilen, 8 Pakete, je ein Schreiber und ein Prüfer); keine Änderung im Repo',
  phases: [{ title: 'Liste' }, { title: 'Gegenprobe' }],
}

// S: Arbeitsordner der Sitzung (Pfad beim Neustart einsetzen). Die Pakete g-chunk-1..8.json entstehen aus
// docs/externe-fakten-stand.json (326 Zeilen, in 8 Pakete geteilt); sie liegen nicht im Repo.
const S = '/pfad/zum/arbeitsordner'
const BRIEF = '/home/user/info70/docs/arbeitsweise/briefs/g-brief.md'

const ZEILE = {
  type: 'object',
  properties: {
    app: { type: 'string' }, datei: { type: 'string' }, zeile: { type: 'integer' },
    handlung: { type: 'string', enum: ['quelle', 'maschinell', 'eigenentwurf', 'streichen', 'fehlalarm'] },
    quelle_vorschlag: { type: 'string' }, neuer_text: { type: 'string' }, grund: { type: 'string' }, hinweis: { type: 'string' },
  },
  required: ['app', 'datei', 'zeile', 'handlung', 'quelle_vorschlag', 'neuer_text', 'grund', 'hinweis'],
}
const SCHEMA_LISTE = { type: 'object', properties: { zeilen: { type: 'array', items: ZEILE } }, required: ['zeilen'] }
const SCHEMA_GEGEN = {
  type: 'object',
  properties: {
    korrekturen: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          app: { type: 'string' }, datei: { type: 'string' }, zeile: { type: 'integer' },
          neue_handlung: { type: 'string', enum: ['quelle', 'maschinell', 'eigenentwurf', 'streichen', 'fehlalarm'] },
          neue_quelle: { type: 'string' }, grund: { type: 'string' },
        },
        required: ['app', 'datei', 'zeile', 'neue_handlung', 'neue_quelle', 'grund'],
      },
    },
    geprueft: { type: 'integer' },
  },
  required: ['korrekturen', 'geprueft'],
}

let aktiv = 0
const wartende = []
async function slot(fn) {
  while (aktiv >= 8) await new Promise((r) => wartende.push(r))
  aktiv++
  try { return await fn() } finally { aktiv--; const w = wartende.shift(); if (w) w() }
}

const PAKETE = [1, 2, 3, 4, 5, 6, 7, 8].map((i) => ({ i, datei: `${S}/g-chunk-${i}.json` }))

const ergebnis = await pipeline(
  PAKETE,
  (p) => slot(() => agent(`Du bist Schreiber der Liste ${p.i} (Strang Г) im Repo /home/user/info70. Lies zuerst den Brief ${BRIEF} vollständig. Eingabe: ${p.datei} (JSON-Liste der Zeilen mit app, datei, zeile, kategorie, text). Die Zeilennummern beziehen sich auf den aktuellen Stand der Dateien unter apps/<app>/<datei>. Du änderst keine Datei im Repo. Gib genau einen Eintrag je Eingabezeile zurück, in der Reihenfolge der Eingabe, nur als JSON nach Schema.`, { label: `liste:${p.i}`, phase: 'Liste', schema: SCHEMA_LISTE })),
  (liste, p) => liste && slot(() => agent(`Du bist unabhängiger Prüfer der Liste ${p.i} (Strang Г) im Repo /home/user/info70. Lies den Brief ${BRIEF}. Eingabe der Zeilen: ${p.datei}. Vorschläge des Schreibers: ${JSON.stringify(liste.zeilen)}.
Prüfe zuerst die Vollständigkeit: gibt es genau einen Vorschlag je Eingabezeile? Dann widerlege die Vorschläge, in dieser Reihenfolge: (1) jede Handlung „quelle“ oder „maschinell“: stimmt die genannte Quelle, würde sie die Aussage tragen? Wenn du dir nicht sicher bist, ist die richtige Handlung „eigenentwurf“. Rufe keine Seite ab, die Maschinen nicht lesen dürfen. (2) jede Handlung „streichen“: verliert die App dabei Inhalt, den sie braucht, oder ist die Zeile Teil von Daten, die ein Test verlangt (suche in apps/<app>/test)? Dann „eigenentwurf“. (3) jede Handlung „fehlalarm“: ist die Zeile wirklich keine Behauptung über Recht, Geld oder Gesundheit? (4) Gesundheitszeilen mit Zahlen oder medizinischen Aussagen: „eigenentwurf“ oder „streichen“, nie „quelle“, außer die Quelle ist sicher. Gib nur die Korrekturen zurück (leer, wenn alles stimmt) und die Zahl der geprüften Vorschläge, nur als JSON nach Schema.`, { label: `gegenprobe:${p.i}`, phase: 'Gegenprobe', schema: SCHEMA_GEGEN })
    .then((g) => ({ i: p.i, liste, gegen: g }))),
)

const fertig = ergebnis.filter(Boolean)
const zeilen = fertig.reduce((n, e) => n + e.liste.zeilen.length, 0)
log(`${PAKETE.length * 2} Agenten, ${fertig.length}/${PAKETE.length} Pakete, ${zeilen} Zeilen vorgeschlagen, ${fertig.reduce((n, e) => n + (e.gegen?.korrekturen.length ?? 0), 0)} Korrekturen der Gegenprobe`)
return fertig
