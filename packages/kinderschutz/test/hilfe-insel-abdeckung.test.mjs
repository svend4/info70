// Korpus-Audit: Wo gehört die Hilfe-Insel hin – und wo ausdrücklich nicht?
//
// docs/09 (Top-30 Nr. 26, Ось B) nennt den 116-111-Baustein
// "Safeguarding-Grundausstattung und Pflichtkriterium für Gütesiegel" und
// verlangt ihn für "jede App". Wörtlich genommen wäre das falsch: Eine
// Krisennummer auf einem Zahlen-Quiz oder einem Beobachtungsbogen für
// Fachkräfte ist Rauschen, das das Signal entwertet.
//
// Deshalb ist der Geltungsbereich hier ausgeschrieben und wird geprüft:
// Die Hilfe-Insel gehört in jede KIND-Anwendung, deren Thema ein Kind an
// eigene Not denken lassen kann – Risikothemen des Gefährdungsatlas,
// Kinderrechte und Beschwerde, sozial-emotionale Themen und Konflikte.
// Sie gehört NICHT in Fachlernen (Mathe, Uhr, Musik, Lesen, Natur, Kunst,
// Sprachform), nicht in Werkzeuge für Erwachsene und nicht in die
// 3-5-Ko-Nutzung: dort ist ein Erwachsener per Konstruktion dabei und
// direkt ansprechbar, die Nummer adressiert niemanden.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';

const appsDir = new URL('../../../apps/', import.meta.url);

/** Apps, die den Baustein tragen MÜSSEN. */
export const BRAUCHT_HILFE_INSEL = Object.freeze([
  // Risikothemen (Gefährdungsatlas)
  'anzeige-oder-nicht', 'berechtigungs-safari', 'blasen-duell', 'bot-oder-buddy',
  'challenge-druck', 'darf-ich-posten', 'dark-pattern-detektiv', 'dark-pattern-labyrinth',
  'daten-radiergummi', 'daten-schatz', 'daten-schatz-mini', 'deepfake-spuernase',
  'deepfake-studio', 'fake-shop-fahnder', 'feed-forscher', 'feed-forscher-profi',
  'filter-spiegel', 'fomo-kompass', 'formular-falle', 'foto-ampel', 'kettenbrief-stopper',
  'koeder-quiz', 'lootbox-labor', 'muenz-trick', 'nachrichten-detektive',
  'nachrichten-detektive-junior', 'nachrichten-detektive-profi', 'passwort-pruefstand',
  'smarte-ohren', 'sog-maschine', 'spiral-stopper', 'spuren-lupe', 'stark-im-chat',
  'stark-im-chat-mini', 'stark-im-chat-plus', 'takt-pause', 'verschwoerungs-werkstatt',
  'wer-dahinter', 'chat-check', 'barriere-detektive', 'impressum-detektive', 'link-kompass',
  'seiten-scanner', 'spiel-recht-balance',
  // Kinderrechte, Beschwerde, Teilhabe
  'app-rechte-quiz', 'beschwerde-lotse', 'chat-rechte', 'kinderrat', 'kinderrechte-entdecker',
  'mini-rechte-entdecker', 'netz-pass-urkunde', 'plattform-rechte-13', 'rechte-kompass',
  'rechte-lexikon', 'rechte-stationen', 'regel-werkstatt', 'wahlkabine',
  'familien-bildschirmzeit', 'mitmach-arena',
  // Sozial-emotional und Konflikt
  'freunde-in-der-gruppe', 'gefuehle-entdecker', 'hoeflich-fair', 'ich-schaff-das',
  'notruf-held', 'sicher-unterwegs',
]);

/** Apps, in denen der Baustein bewusst NICHT steht (Begründung je Eintrag). */
export const BEWUSST_OHNE = Object.freeze({
  'mathe-entdecker': 'Fachlernen Mathematik',
  'uhr-und-kalender-kind': 'Fachlernen Uhrzeit',
  'tonleiter-treppe': 'Fachlernen Musik',
  'rhythmus-orchester': 'Fachlernen Musik',
  'musik-detektive': 'Fachlernen Musik, Ko-Nutzung 4-6',
  'klang-detektive': 'Fachlernen Hören, Ko-Nutzung ab 3',
  'grammatik-zwerge': 'Fachlernen Sprachform, Ko-Nutzung 4-6',
  'woerter-sortierer': 'Fachlernen Wortbedeutung, Ko-Nutzung 4-6',
  'dinge-des-alltags': 'Ko-Nutzung 3-5, Erwachsener ist dabei',
  'gemeinsam-gesund-essen': 'Ko-Nutzung 3-5, Erwachsener ist dabei',
  'fuenf-helfer': 'Ko-Nutzung 3-5, Erwachsener ist dabei',
  'wie-bewegt-sich': 'Ko-Nutzung 3-5, Erwachsener ist dabei',
  'design-entdecker': 'Ko-Nutzung 3-7, Erwachsener ist dabei',
  'farb-labor': 'Fachlernen Farbe, Ko-Nutzung 5-7, Erwachsener ist dabei',
  'tischdienst-trainer': 'Lebenspraxis, Ko-Nutzung 4-7, nur gemeinsam',
  'tier-tanz-impulse': 'Bewegung, Ko-Nutzung 3-7, der Erwachsene bedient das Gerät',
  'geschichten-wender': 'Erzaehlen, Ko-Nutzung 5-7, nur gemeinsam',
  'kita-kartograph': 'Ko-Nutzung 5-7, Sachthema Plan',
  'reim-radar': 'Fachlernen Phonologie, Ko-Nutzung',
  'reim-werkstatt': 'Fachlernen Reim',
  'erste-woerter-lesewerkstatt': 'Fachlernen Lesen',
  'mensch-tier-pflanze': 'Sachthema Natur',
  'koerper-entdecker': 'Sachthema Körper',
  'nahrungsnetz-werkstatt': 'Sachthema Ökologie',
  'wer-wohnt-wo': 'Sachthema Lebensräume',
  'tier-zu-gast': 'Sachthema Verantwortung für Tiere',
  'jahreszeiten-rad': 'Sachthema Jahreslauf',
  'mess-labor': 'Sachthema Messen',
  'erzaehl-bruecke': 'Fachlernen Erzählen',
  'maerchen-gedicht-fabel': 'Fachlernen Textsorten',
  'kunst-entdecker': 'Fachlernen Kunst',
  'warum-heisst-das-so': 'Fachlernen Wortherkunft',
  'herkunftssprachen-bruecke': 'Fachlernen Wortschatz',
  'familien-budget': 'Sachthema Geld',
  'deutschland-kompass': 'Sachthema Karte',
  'ornament-werkstatt': 'Fachlernen Muster',
  'stark-und-gesund': 'Sachthema Gesundheit',
  'gesunder-koerper-ampel': 'Selbstbeobachtung ohne Risikothema',
  'wetter-forscher': 'Sachthema Wetter, Ko-Nutzung',
  'quiz-karten-druck': 'Druck-Werkzeug',
  'starke-zuege-poster': 'Druck-Werkzeug',
  'generationen-quiz': 'Familienspiel ohne Risikothema',
  'erfinder-werkstatt': 'Kreativ-Modul',
  'geschichten-werkstatt': 'Kreativ-Modul',
});

const eintraege = await readdir(appsDir, { withFileTypes: true });
const apps = eintraege.filter((e) => e.isDirectory()).map((e) => e.name).sort();

async function quelle(app) {
  try { return await readFile(new URL(`${app}/app.mjs`, appsDir), 'utf8'); }
  catch { return ''; }
}
const quellen = new Map();
for (const a of apps) quellen.set(a, await quelle(a));
const hatInsel = (a) => /hilfe-insel|hilfeInsel/.test(quellen.get(a)) || /hilfeInsel: true/.test(quellen.get(a));

test('die Liste nennt nur Apps, die es gibt', () => {
  const weg = [...BRAUCHT_HILFE_INSEL, ...Object.keys(BEWUSST_OHNE)].filter((a) => !apps.includes(a));
  assert.deepEqual(weg, [], `in der Liste, aber nicht im Repo: ${weg.join(', ')}`);
});

test('jede App mit Risiko-, Rechte- oder Gefühlsthema trägt die Hilfe-Insel', () => {
  const ohne = BRAUCHT_HILFE_INSEL.filter((a) => !hatInsel(a));
  assert.deepEqual(ohne, [], `Safeguarding-Baustein fehlt:\n${ohne.join('\n')}`);
});

test('die bewussten Auslassungen sind auch wirklich ausgelassen', () => {
  // Sonst steht eine Krisennummer auf einem Zahlen-Quiz und entwertet sich.
  const unerwartet = Object.keys(BEWUSST_OHNE).filter((a) => hatInsel(a));
  assert.deepEqual(unerwartet, [], `hier gehört die Hilfe-Insel nicht hin:\n${unerwartet.join('\n')}`);
});

test('der Baustein kommt aus dem Paket – keine App tippt die Nummer selbst ab', async () => {
  const eigenbau = [];
  for (const a of apps) {
    const q = quellen.get(a);
    if (/116\s?111/.test(q) && !/hilfe-insel/.test(q)) eigenbau.push(a);
  }
  assert.deepEqual(eigenbau, [], `116 111 fest eingetippt statt hilfeInsel() genutzt:\n${eigenbau.join('\n')}`);
});

test('in Druck-Apps ist die Hilfe-Insel vom Papier ausgenommen', async () => {
  const falsch = [];
  for (const a of BRAUCHT_HILFE_INSEL) {
    let druck;
    try { druck = await readFile(new URL(`${a}/druck.css`, appsDir), 'utf8'); } catch { continue; }
    const q = quellen.get(a);
    // Nur die INLINE-Variante landet im Ausdruck; hinter einem Knopf nicht.
    if (!/hilfeInsel\(\{?\s*klasse/.test(q) && /hilfeInsel\(\)/.test(q)) {
      const treffer = druck.match(/\.([a-z]+-nur-bildschirm)/);
      falsch.push(`${a} (druck.css kennt ${treffer ? treffer[1] : 'keine screen-only-Klasse'})`);
    }
  }
  assert.deepEqual(falsch, [], `Hilfe-Nummer würde mitgedruckt:\n${falsch.join('\n')}`);
});
