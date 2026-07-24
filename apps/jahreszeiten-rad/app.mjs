// Jahreszeiten-Rad: erlebbarer Jahreslauf (5-7 Ko-Nutzung, 8-12 eigenständig).
// Am Rad drehen und sehen, wie Tageslänge, Temperatur, Pflanzen, Tiere und
// Menschen sich verändern; Monats-Finder und Mini-Quiz. Praleska docs/10
// (Top-30 Nr. 22). Politik docs/02: keine externen Anfragen, speichert nichts.
import { el, vorlesen, mischen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { boot as bootAnzeige } from '../../packages/kinder-ui/js/anzeige.mjs';
import { pruefeDaten, jahreszeitFuerMonat, naechste, lichtBalken, vergleicheTage } from './logik.mjs';

installiereNetzwerkWaechter();
bootAnzeige();

const MONATE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
const app = document.getElementById('app');
const daten = await fetch('daten/jahreszeiten.json').then((r) => r.json());

let aktiv = daten.jahreszeiten[0];
let quizFrage = null;
let quizAntwort = null;

function infoZeile(emoji, titel, text) {
  return el('div', { style: 'padding:0.45rem 0;border-top:1px solid var(--k-rand)' },
    el('p', { style: 'margin:0;font-weight:600' }, `${emoji} ${titel}`),
    el('p', { style: 'margin:0.15rem 0 0;font-size:0.95rem' }, text));
}

function radKarte() {
  return el('section', { class: 'k-karte' },
    el('h2', { style: 'margin-top:0;font-size:1.05rem' }, '🎡 Dreh am Rad'),
    el('div', { class: 'k-antworten', role: 'radiogroup', 'aria-label': 'Jahreszeit' },
      ...daten.jahreszeiten.map((j) => el('button', {
        class: `k-knopf ${j.id === aktiv.id ? '' : 'k-knopf--neutral'}`,
        role: 'radio', 'aria-checked': String(j.id === aktiv.id),
        onclick: () => { aktiv = j; render(); },
      }, `${j.emoji} ${j.name}`))),
    el('div', { class: 'k-antworten', style: 'margin-top:0.3rem' },
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => { aktiv = naechste(daten, aktiv.id); render(); } }, '➡️ Weiterdrehen')));
}

function jahreszeitKarte() {
  const vorleseText = `${aktiv.name}. ${aktiv.himmel} Die Pflanzen: ${aktiv.pflanzen} Die Menschen: ${aktiv.menschen}`;
  return el('section', { class: 'k-karte' },
    el('p', { class: 'k-gross', style: 'text-align:center;margin:0' }, aktiv.emoji),
    el('h2', { style: 'margin:0.2rem 0;font-size:1.3rem;text-align:center' }, aktiv.name),
    el('p', { style: 'text-align:center;margin:0.2rem 0;letter-spacing:1px', 'aria-label': `Etwa ${aktiv.tageslaengeStunden} Stunden hell` }, lichtBalken(aktiv.tageslaengeStunden)),
    el('p', { style: 'text-align:center;margin:0;font-size:0.9rem;color:#4b5563' }, `Etwa ${aktiv.tageslaengeStunden} Stunden hell · ${aktiv.temperatur}`),
    infoZeile('🌅', 'Himmel & Licht', aktiv.himmel),
    infoZeile('🌿', 'Pflanzen', aktiv.pflanzen),
    ...daten.tiere.map((t) => infoZeile(t.emoji, `${t.name} (${t.strategie})`, aktiv.tiere[t.id])),
    infoZeile('🧑', 'Menschen', aktiv.menschen),
    el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', style: 'margin-top:0.4rem', onclick: () => vorlesen(vorleseText) }, '🔊 Vorlesen'));
}

function monatsFinder() {
  return el('section', { class: 'k-karte' },
    el('h2', { style: 'margin-top:0;font-size:1.05rem' }, '📅 Welcher Monat gehört wohin?'),
    el('div', { style: 'display:grid;grid-template-columns:repeat(3,1fr);gap:0.3rem' },
      ...MONATE.map((name, i) => {
        const j = jahreszeitFuerMonat(daten, i + 1);
        const istAktiv = j.id === aktiv.id;
        return el('button', {
          class: `k-knopf k-knopf--klein ${istAktiv ? '' : 'k-knopf--neutral'}`,
          'aria-label': `${name}: ${j.name}`,
          onclick: () => { aktiv = j; render(); },
        }, `${name.slice(0, 3)} ${j.emoji}`);
      })),
    el('p', { style: 'margin:0.4rem 0 0;font-size:0.85rem;color:#4b5563' }, 'Tippe einen Monat – das Rad springt zu seiner Jahreszeit. 3 Monate = 1 Jahreszeit, 4 Jahreszeiten = 1 Jahr.'),
    el('p', { style: 'margin:0.3rem 0 0;font-size:0.9rem' }, `💡 ${vergleicheTage(daten.jahreszeiten.find((x) => x.id === 'sommer'), daten.jahreszeiten.find((x) => x.id === 'winter'))}`));
}

function quizKarte() {
  if (!quizFrage) {
    return el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.05rem' }, '🧠 Kleines Jahreszeiten-Quiz'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: () => { quizFrage = mischen(daten.quiz)[0]; quizAntwort = null; render(); } }, '❓ Frage ziehen')));
  }
  const q = quizFrage;
  if (quizAntwort === null) {
    return el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.05rem' }, '🧠 Quiz'),
      el('p', { style: 'font-weight:600' }, q.frage),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`${q.frage} ${q.antworten.join('. Oder: ')}`) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        ...q.antworten.map((a, i) => el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => { quizAntwort = i; render(); } }, a))));
  }
  const richtig = quizAntwort === q.korrekt;
  return el('section', { class: 'k-karte' },
    el('p', { class: 'k-gross', style: 'text-align:center;margin:0' }, richtig ? '🌟' : '💭'),
    el('div', { class: `k-hinweis${richtig ? ' k-hinweis--richtig' : ''}` },
      el('p', { style: 'font-weight:700;margin-top:0' }, richtig ? 'Richtig!' : `Fast! Richtig ist: ${q.antworten[q.korrekt]}`),
      el('p', { style: 'margin-bottom:0' }, q.erklaerung)),
    el('div', { class: 'k-antworten' },
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(q.erklaerung) }, '🔊 Vorlesen'),
      el('button', { class: 'k-knopf', onclick: () => { quizFrage = mischen(daten.quiz.filter((x) => x.id !== q.id))[0]; quizAntwort = null; render(); } }, '❓ Nächste Frage')));
}

function render() {
  app.replaceChildren(...[
    el('h1', { class: 'k-titel' }, '🎡 Jahreszeiten-Rad'),
    el('p', { class: 'k-untertitel' }, 'Licht, Pflanzen, Tiere und Menschen im Lauf des Jahres'),
    el('section', { class: 'k-karte' }, el('p', { style: 'margin:0;font-size:0.9rem' }, daten.hinweis)),
    radKarte(),
    jahreszeitKarte(),
    monatsFinder(),
    quizKarte(),
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · nichts wird gespeichert · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')),
  ].filter(Boolean));
}

const fehler = pruefeDaten(daten);
if (fehler.length) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' }, el('p', { style: 'margin:0' }, `Datenfehler: ${fehler[0]}`)));
} else {
  render();
}
