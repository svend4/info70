// Erzeugt docs/bauauftraege/index.json aus der Tabelle in docs/plan-praleska-umsetzung.md.
// Aufruf: node tools/bauauftrag-index.mjs
// Die Tabelle ist der Stand nach Welle 91. Die Änderungen der Wellen 92 und 93 stehen
// unten in STATUS_AB_WELLE_92 und werden hier angewendet, nicht still im Plan.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const ROOT = new URL('../', import.meta.url);
const PLAN = readFileSync(new URL('docs/plan-praleska-umsetzung.md', ROOT), 'utf8');

// Abschnitt im Plan -> Kürzel für die Kennung
const ABSCHNITT = [
  ['Kinder-Apps', 'KIN'],
  ['Gemeinsame Apps', 'GEM'],
  ['Eltern-Werkzeuge', 'ELT'],
  ['Kita-Werkzeuge', 'KIT'],
  ['Content-Pakete', 'CON'],
  ['Printmaterialien', 'PRI'],
];

// Welle 92 und 93: offen -> teilweise. Quelle: docs/10 „Stand Welle 92/93“ und die Registrierung.
const STATUS_AB_WELLE_92 = {
  'CON-2': 'teilweise', // Spielideen-Kartei Baby (Welle 92)
  'CON-5': 'teilweise', // Tierkinder-Vorlesen (Welle 92)
  'CON-11': 'teilweise', // Kindertänze Europas (Welle 92)
  'CON-12': 'teilweise', // Puppentheater-Werkstatt (Welle 93)
  'CON-18': 'teilweise', // Theater zuhause (Welle 93)
  'PRI-7': 'teilweise', // Fühl- und Sortier-Werkstatt (Welle 93)
  'PRI-8': 'gebaut', // Kleine Forscher ohne Bildschirm (Etappe 3, docs/registrierung/PRI-8.json)
  'GEM-17': 'gebaut', // Tischdienst-Trainer (docs/registrierung/GEM-17.json)
  'CON-3': 'gebaut', // Meine Familie: Wörter und Rollen (Stufe 1, Lauf E, docs/registrierung/CON-3.json)
  'CON-6': 'gebaut', // Himmelsgucker (Stufe 1, Lauf E)
  'CON-9': 'gebaut', // Farbwörter-Schatz (Stufe 1, Lauf E)
  'CON-10': 'gebaut', // Musik-Wörter-Bilderlexikon (Stufe 1, Lauf E)
};

// Blockaden. A7 (Rekord und Rang im Motor quiz-kern) war bis zum 27.10.2026 die einzige Blockade für dreizehn Einheiten.
// A7 ist umgesetzt (Entscheidung Max, Variante a): der Motor kennt keinen Rekord, keine Punkte und keine Ränge mehr.
// Neue Blockaden werden hier mit der Kennung der Einheit eingetragen.
const BLOCKADE = {};

// Apps aus Welle 92 und 93: der Plan nennt sie noch nicht, die Apps existieren.
const APP_AB_WELLE_92 = {
  'CON-2': 'baby-spielideen-kartei',
  'CON-5': 'tierkinder-vorlesen',
  'CON-11': 'kindertaenze-europa',
  'CON-12': 'puppentheater-werkstatt',
  'CON-18': 'theater-zuhause-heft',
  'PRI-7': 'fuehl-sortier-werkstatt',
  'PRI-8': 'kleine-forscher-ohne-bildschirm',
  'CON-3': 'meine-familie-woerter-und-rollen-content-pack',
  'CON-6': 'himmelsgucker-sonne-mond-und-sterne',
  'CON-9': 'farbwoerter-schatz',
  'CON-10': 'musik-woerter-bilderlexikon',
};

const zeilen = PLAN.split('\n').filter((l) => /^\| \d+ \| /.test(l));
const eintraege = [];
for (const z of zeilen) {
  const s = z.split('|').slice(1, -1).map((x) => x.trim());
  const [nr, abschnittText, einheit, status, app, fakten, schritt] = s;
  const kuerzel = ABSCHNITT.find(([anfang]) => abschnittText.startsWith(anfang))?.[1];
  if (!kuerzel) throw new Error('Unbekannter Abschnitt: ' + abschnittText);
  const id = `${kuerzel}-${nr}`;
  eintraege.push({
    id,
    abschnitt: abschnittText,
    nr: Number(nr),
    einheit,
    status_plan_w91: status,
    status: STATUS_AB_WELLE_92[id] ?? status,
    app: APP_AB_WELLE_92[id] ?? (app === '–' ? null : app),
    faktenstand: fakten,
    naechster_schritt: schritt,
    blockiert: BLOCKADE[id] ?? [],
  });
}

const soll = eintraege.filter((e) => e.status === 'teilweise' || e.status === 'offen');
const unklar = eintraege.filter((e) => e.status === 'unklar');
const nichtBauen = eintraege.filter((e) => e.status === 'nicht bauen');
const gebaut = eintraege.filter((e) => e.status.startsWith('gebaut'));

const zaehl = (liste, feld) => liste.reduce((m, e) => ((m[e[feld]] = (m[e[feld]] ?? 0) + 1), m), {});
const bilanz = {
  gesamt: eintraege.length,
  gebaut: gebaut.length,
  teilweise: eintraege.filter((e) => e.status === 'teilweise').length,
  offen: eintraege.filter((e) => e.status === 'offen').length,
  unklar: unklar.length,
  nicht_bauen: nichtBauen.length,
  bauauftraege_noetig: soll.length,
  davon_blockiert: soll.filter((e) => e.blockiert.length > 0).map((e) => e.id),
};

const out = {
  erzeugt: 'tools/bauauftrag-index.mjs',
  stand: 'Plan Welle 91 plus Welle 92 und 93 (siehe STATUS_AB_WELLE_92)',
  bilanz,
  pro_abschnitt: zaehl(eintraege, 'abschnitt'),
  bauauftraege: soll,
  // Gebaute Einheiten, deren Bauauftrag im Ordner bleibt (Verlauf); der Prüfer der Bauaufträge erwartet auch sie.
  gebaut_mit_bauauftrag: eintraege.filter((e) => STATUS_AB_WELLE_92[e.id] === 'gebaut').map((e) => ({ id: e.id, einheit: e.einheit, status: e.status, app: e.app })),
  ohne_bauauftrag: [...unklar, ...nichtBauen].map((e) => ({ id: e.id, einheit: e.einheit, status: e.status })),
};

mkdirSync(new URL('docs/bauauftraege/', ROOT), { recursive: true });
writeFileSync(new URL('docs/bauauftraege/index.json', ROOT), JSON.stringify(out, null, 2) + '\n');

console.log('Gesamt', bilanz.gesamt, '| gebaut', bilanz.gebaut, '| teilweise', bilanz.teilweise, '| offen', bilanz.offen,
  '| unklar', bilanz.unklar, '| nicht bauen', bilanz.nicht_bauen);
console.log('Bauaufträge nötig:', bilanz.bauauftraege_noetig, '| davon blockiert:', bilanz.davon_blockiert.join(', '));
