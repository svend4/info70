// Wer wohnt wo? – Lebensraum-Häuser (5-7 kurz eigenständig, 8-12 Vertiefung):
// vier heimische Lebensräume erkunden (Wald mit Stockwerken, Wiese, Teich,
// Garten/Feld) mit Jahreszeiten-Wandel, Wohn-Quiz (Tier → Haus/Stockwerk)
// und Gast-Quiz („der Mensch ist dort nur zu Gast“). Praleska docs/10
// (Kinder-Apps Nr. 3). Politik docs/02: keine externen Anfragen, speichert
// nichts, das Kind wird nicht bewertet (zu jeder Antwort eine Erklärung, am Ende
// „Ende der Runde“).
import { el, vorlesen, mischen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { boot as bootAnzeige } from '../../packages/kinder-ui/js/anzeige.mjs';
import { JAHRESZEITEN, artikelVon, gross, bewohnerFuer, wohnFrage, stockwerkFrage, pruefeDaten } from './logik.mjs';

installiereNetzwerkWaechter();
bootAnzeige();

const app = document.getElementById('app');
const daten = await fetch('daten/lebensraeume.json').then((r) => r.json());
const WALD = daten.lebensraeume.find((r) => r.id === 'wald');
const RUNDE = 8;
const STOCKWERK_FRAGEN = 2; // zwei der acht Fragen gehen in die Wald-Stockwerke

/** „der Specht“ / „Der Specht“ – Artikel aus der Datentabelle. */
const mitArtikel = (name) => `${artikelVon(name, daten.artikel)} ${name}`;
const MitArtikel = (name) => gross(mitArtikel(name));

let modus = 'erkunden';       // erkunden | wohnquiz | gastquiz
let raumId = 'wald';
let jahreszeit = 'sommer';
// Quiz-Zustand
let aufgaben = [];
let index = 0;

function zeige(...knoten) {
  app.replaceChildren(...[
    el('h1', { class: 'k-titel' }, '🏠 Wer wohnt wo?'),
    el('p', { class: 'k-untertitel' }, 'Vier Lebensraum-Häuser – und wir sind dort nur zu Gast'),
    el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Modus' },
      ...[['erkunden', '🔍 Erkunden'], ['wohnquiz', '🏠 Wohn-Quiz'], ['gastquiz', '🤝 Gast-Quiz']].map(([id, name]) =>
        el('button', {
          class: `k-knopf k-knopf--klein ${modus === id ? '' : 'k-knopf--neutral'}`,
          'aria-pressed': String(modus === id),
          onclick: () => { modus = id; if (id === 'wohnquiz') starteWohnQuiz(); else if (id === 'gastquiz') starteGastQuiz(); else render(); },
        }, name))),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · nichts wird gespeichert · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')),
  ].filter(Boolean));
}

// ---------- Erkunden ----------
function erkunden() {
  const raum = daten.lebensraeume.find((r) => r.id === raumId);
  const bewohner = bewohnerFuer(raum.id, daten.bewohner);
  const jz = JAHRESZEITEN.find((j) => j.id === jahreszeit);
  const vorleseText = `${raum.name}. ${raum.beschreibung} Im ${jz.name}: ${raum.jahreszeiten[jahreszeit]}`;
  zeige(
    el('section', { class: 'k-karte' },
      el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Lebensraum wählen' },
        ...daten.lebensraeume.map((r) => el('button', {
          class: `k-knopf k-knopf--klein ${r.id === raumId ? '' : 'k-knopf--neutral'}`,
          'aria-pressed': String(r.id === raumId),
          onclick: () => { raumId = r.id; render(); },
        }, `${r.emoji} ${r.name}`))),
      el('p', { class: 'k-gross' }, raum.emoji),
      el('p', { style: 'margin:0.2rem 0' }, raum.beschreibung),
      el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Jahreszeit wählen', style: 'margin-top:0.4rem' },
        ...JAHRESZEITEN.map((j) => el('button', {
          class: `k-knopf k-knopf--klein ${j.id === jahreszeit ? '' : 'k-knopf--neutral'}`,
          'aria-pressed': String(j.id === jahreszeit),
          onclick: () => { jahreszeit = j.id; render(); },
        }, `${j.emoji} ${j.name}`))),
      el('div', { class: 'k-hinweis' },
        el('p', { style: 'margin:0' }, `${jz.emoji} ${raum.jahreszeiten[jahreszeit]}`)),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(vorleseText) }, '🔊 Vorlesen'),
      el('p', { style: 'margin:0.5rem 0 0.1rem;font-weight:600' }, 'Hier wohnen:'),
      el('p', { style: 'margin:0' }, ...bewohner.map((b) =>
        el('span', { style: 'display:inline-block;background:#ecfdf5;border:1px solid #a7f3d0;border-radius:999px;padding:0.1rem 0.6rem;margin:0.12rem' }, `${b.emoji} ${b.name}`)))),
    raum.id === 'wald' ? el('section', { class: 'k-karte' },
      el('h2', { style: 'margin:0 0 0.3rem;font-size:1.05rem' }, '🏢 Die Stockwerke des Waldes'),
      ...WALD.stockwerke.map((s) => el('div', { style: 'border:1px solid #e5e7eb;border-radius:0.6rem;padding:0.4rem 0.6rem;margin-top:0.3rem' },
        el('p', { style: 'margin:0;font-weight:600' }, `${s.emoji} ${s.name} – ${s.bewohner.join(', ')}`),
        el('p', { style: 'margin:0.15rem 0 0;font-size:0.9rem;color:#4b5563' }, s.info)))) : null);
}

// ---------- Wohn-Quiz (Tier → Haus, dazu zwei Fragen nach dem Stockwerk) ----------
function starteWohnQuiz() {
  const tiere = mischen(daten.bewohner).slice(0, RUNDE - STOCKWERK_FRAGEN)
    .map((b) => ({ art: 'raum', ...wohnFrage([b], (l) => l[0]) }));
  const stockwerke = [];
  const genutzt = new Set();
  while (stockwerke.length < STOCKWERK_FRAGEN) {
    const frage = stockwerkFrage(WALD, (liste) => mischen(liste.filter((x) => !genutzt.has(x.name)))[0]);
    genutzt.add(frage.name);
    stockwerke.push({ art: 'stockwerk', ...frage });
  }
  aufgaben = mischen([...tiere, ...stockwerke]);
  index = 0;
  render();
}

function wohnQuizKarte() {
  if (index >= aufgaben.length) return quizErgebnis('🏠', 'Ende der Runde', starteWohnQuiz);
  const a = aufgaben[index];
  return a.art === 'stockwerk' ? stockwerkKarte(a) : raumKarte(a);
}

function frageRahmen(emoji, frageText, ...antworten) {
  return el('section', { class: 'k-karte' },
    el('p', { class: 'k-untertitel' }, `Frage ${index + 1} von ${aufgaben.length}`),
    el('p', { class: 'k-gross' }, emoji),
    el('p', { style: 'font-weight:700;font-size:1.2em;text-align:center' }, frageText),
    el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(frageText) }, '🔊 Vorlesen'),
    el('div', { class: 'k-antworten' }, ...antworten));
}

function raumKarte(a) {
  return frageRahmen(a.bewohner.emoji, `Wo wohnt ${mitArtikel(a.bewohner.name)}?`,
    ...daten.lebensraeume.map((r) => el('button', {
      class: 'k-knopf k-knopf--neutral',
      onclick: () => beantworteWohn(a, r.id),
    }, `${r.emoji} ${r.name}`)));
}

function stockwerkKarte(a) {
  return frageRahmen('🏢', `In welchem Stockwerk des Waldes ist ${mitArtikel(a.name)} zu Hause?`,
    ...WALD.stockwerke.map((s) => el('button', {
      class: 'k-knopf k-knopf--neutral',
      onclick: () => beantworteStockwerk(a, s.id),
    }, `${s.emoji} ${s.kurz}`)));
}

function beantworteWohn(a, wahl) {
  const gut = wahl === a.richtig;
  const raum = daten.lebensraeume.find((r) => r.id === a.richtig);
  const text = `${MitArtikel(a.bewohner.name)} wohnt ${raum.wo} ${raum.emoji}. ${a.bewohner.tipp}`;
  zeige(feedbackKarte(gut, text, () => { index++; render(); }));
}

function beantworteStockwerk(a, wahl) {
  const gut = wahl === a.richtig;
  const s = WALD.stockwerke.find((x) => x.id === a.richtig);
  const text = `${MitArtikel(a.name)} ist in der ${s.kurz} zu Hause ${s.emoji}. ${s.info}`;
  zeige(feedbackKarte(gut, text, () => { index++; render(); }));
}

// ---------- Gast-Quiz ----------
function starteGastQuiz() {
  aufgaben = mischen(daten.gastRegeln).slice(0, RUNDE);
  index = 0;
  render();
}

function gastQuizKarte() {
  if (index >= aufgaben.length) return quizErgebnis('🤝', 'Du bist ein guter Gast in der Natur!', starteGastQuiz);
  const g = aufgaben[index];
  const frageText = `Stimmt das? ${g.aussage}`;
  return el('section', { class: 'k-karte' },
    el('p', { class: 'k-untertitel' }, `Aussage ${index + 1} von ${aufgaben.length}`),
    el('p', { class: 'k-gross' }, '🤝'),
    el('p', { style: 'font-weight:700;font-size:1.15em;text-align:center' }, g.aussage),
    el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(frageText) }, '🔊 Vorlesen'),
    el('div', { class: 'k-antworten' },
      el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => beantworteGast(g, true) }, '✅ Stimmt'),
      el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => beantworteGast(g, false) }, '❌ Stimmt nicht')));
}

function beantworteGast(g, wahl) {
  const gut = wahl === g.richtig;
  zeige(feedbackKarte(gut, g.erklaerung, () => { index++; render(); }));
}

// ---------- gemeinsame Bausteine ----------
function feedbackKarte(gut, text, weiter) {
  const titel = gut ? 'Genau richtig!' : 'Gut, dass wir drüber reden!';
  return el('section', { class: 'k-karte' },
    el('p', { class: 'k-gross' }, gut ? '✅' : '💭'),
    el('div', { class: `k-hinweis${gut ? ' k-hinweis--richtig' : ''}` },
      el('p', { style: 'font-weight:700;margin-top:0' }, titel),
      el('p', { style: 'margin-bottom:0' }, text)),
    el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`${titel} ${text}`) }, '🔊 Vorlesen'),
    el('div', { class: 'k-antworten' },
      el('button', { class: 'k-knopf', onclick: weiter }, 'Weiter ➡️')));
}

const AUSBLICK = 'Und jetzt: raus und echte Tiere beobachten – als leiser Gast!';

function quizErgebnis(emoji, titel, nochmal) {
  return el('section', { class: 'k-karte' },
    el('p', { class: 'k-gross' }, emoji),
    el('p', { style: 'font-weight:700;font-size:1.2em;text-align:center' }, titel),
    el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`${titel} ${AUSBLICK}`) }, '🔊 Vorlesen'),
    el('div', { class: 'k-antworten' },
      el('button', { class: 'k-knopf', onclick: nochmal }, '🔁 Noch einmal'),
      el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => { modus = 'erkunden'; render(); } }, '🔍 Zurück zum Erkunden')),
    el('p', { style: 'margin:0.5rem 0 0;text-align:center;color:#4b5563;font-size:0.9rem' }, `${AUSBLICK} 🌿`));
}

function render() {
  if (modus === 'erkunden') return erkunden();
  if (modus === 'wohnquiz') return zeige(wohnQuizKarte());
  if (modus === 'gastquiz') return zeige(gastQuizKarte());
}

const fehler = pruefeDaten(daten);
if (fehler.length) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' }, el('p', { style: 'margin:0' }, `Datenfehler: ${fehler[0]}`)));
} else {
  render();
}
