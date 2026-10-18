// Prüft die Bauaufträge in docs/bauauftraege/ gegen die Arbeitskopie der Pralęska.
// Aufruf: node tools/bauauftrag-pruefen.mjs [Pfad-zu-all.txt]
// Standard: die Arbeitskopie im Scratchpad (nicht im Repo). Ohne sie bricht das Skript ab.
// Geprüft wird: Abschnitte der Vorlage vorhanden; jedes Zitat „…“ (S. n) steht auf Seite n;
// keine Modellnamen; Dateiname und Kennung passen zu index.json.
import { readFileSync, readdirSync, existsSync } from 'node:fs';

const ROOT = new URL('../', import.meta.url);
const QUELLE = process.argv[2] ?? '/tmp/claude-0/-home-user-info70/82efcec1-ea77-5994-8396-327e19ae1cef/scratchpad/quelle/all.txt';
const ORDNER = new URL('docs/bauauftraege/', ROOT);

if (!existsSync(QUELLE)) {
  console.error('Arbeitskopie fehlt:', QUELLE);
  process.exit(2);
}

// Seite n = Index n-1 nach dem Split an Formfeed (siehe docs/plan-praleska-umsetzung.md, Abschnitt 1).
const seiten = readFileSync(QUELLE, 'utf8').split('\f');

// Vergleich: Zeilenumbrüche und Trennstriche am Zeilenende entfernen, Anführungszeichen und Groß/Klein ignorieren.
const norm = (s) => s
  .replace(/-\n/g, '')
  .replace(/\s+/g, ' ')
  .replace(/[«»„“”"‘’']/g, '')
  .replace(/[–—]/g, '-')
  .toLowerCase()
  .trim();

const MODELLE = /\b(claude|anthropic|haiku|sonnet|opus|gpt-?\d*|gemini|llama|mistral)\b/i;
const SEKTIONEN = ['## 1. Quelle', '## 2. Zielgruppe', '## 3. Funktion', '## 4. Daten', '## 5. Pseudocode',
  '## 6. Regeln', '## 7. Tests', '## 8. Abnahme', '## 9. Offen'];

const index = JSON.parse(readFileSync(new URL('index.json', ORDNER), 'utf8'));
const erwartet = new Map(index.bauauftraege.map((e) => [e.id, e]));

const dateien = readdirSync(ORDNER).filter((d) => /^[A-Z]+-\d+-.*\.md$/.test(d));
let fehler = 0;
const bericht = [];

for (const datei of dateien) {
  const id = datei.match(/^([A-Z]+-\d+)/)[1];
  const text = readFileSync(new URL(datei, ORDNER), 'utf8');
  const probleme = [];

  if (!erwartet.has(id)) probleme.push('Kennung nicht in index.json');
  for (const s of SEKTIONEN) if (!text.includes(s)) probleme.push(`Abschnitt fehlt: ${s}`);
  if (!/^Blockiert durch: .+$/m.test(text)) probleme.push('Zeile „Blockiert durch:“ fehlt');
  if (MODELLE.test(text)) probleme.push(`Modellname: ${text.match(MODELLE)[0]}`);

  // Zitate: „…“ (S. n) mit Seite n abgleichen. Mit … getrennte Teile einzeln prüfen.
  const zitate = [...text.matchAll(/„([^“]+)“\s*\(S\.\s*(\d+)\)/g)];
  let geprueft = 0;
  for (const [, zitat, seiteText] of zitate) {
    const seite = Number(seiteText);
    if (seite < 1 || seite > seiten.length) {
      probleme.push(`Seite ${seite} außerhalb des Quelltextes (1–${seiten.length}): „${zitat.slice(0, 40)}…“`);
      continue;
    }
    const seitenText = norm(seiten[seite - 1]);
    for (const teil of zitat.split('…').map((t) => norm(t)).filter(Boolean)) {
      if (!seitenText.includes(teil)) {
        probleme.push(`S. ${seite}: Zitat nicht gefunden: „${teil.slice(0, 60)}“`);
      }
    }
    geprueft += 1;
  }

  if (zitate.length === 0) probleme.push('kein Zitat mit Seitenangabe gefunden');

  if (probleme.length) fehler += 1;
  bericht.push({ datei, zitate: zitate.length, geprueft, probleme });
}

for (const b of bericht) {
  const kopf = `${b.probleme.length ? 'FEHLER' : 'ok    '} ${b.datei} (Zitate ${b.zitate})`;
  console.log(kopf);
  for (const p of b.probleme) console.log('     -', p);
}

const fehlen = [...erwartet.keys()].filter((id) => !dateien.some((d) => d.startsWith(id + '-')));
console.log(`\nDateien: ${dateien.length} von ${erwartet.size} erwarteten; fehlend: ${fehlen.length ? fehlen.join(', ') : 'keine'}`);
console.log(`Mit Problemen: ${fehler}`);
process.exit(fehler || fehlen.length ? 1 : 0);
