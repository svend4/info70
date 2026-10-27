// Daten-Schatz: Szenario-Trainer zum Datenschutz (8-12 Jahre).
// Das Kind hütet seinen "Datenschatz" und entscheidet in Alltagssituationen:
// erlauben, ablehnen oder erst Erwachsene fragen. Jede Antwort bekommt eine
// Rückmeldung mit Erklärung, das Kind wird nicht bewertet. Politik: keine
// externen Anfragen, nichts wird gespeichert.
import { el, vorlesen, mischen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { boot as bootAnzeige } from '../../packages/kinder-ui/js/anzeige.mjs';
import { hilfeInsel, hilfeInselKnopf } from '../../packages/kinder-ui/js/hilfe-insel.mjs';

installiereNetzwerkWaechter();
bootAnzeige(); // Anzeige-Einstellung (Kontrast/Schrift) anwenden (BFSG)

try { localStorage.removeItem('ds.rekord'); } catch {}
const RUNDE = 10;
const app = document.getElementById('app');
const daten = await fetch('daten/szenarien.json').then((r) => r.json());

const ANTWORTEN = [
  { code: 'geben', text: '✅ Okay, erlauben' },
  { code: 'ablehnen', text: '🚫 Nein danke!' },
  { code: 'fragen', text: '🧑‍🦱 Erst Erwachsene fragen' },
];

let szenarien = [];
let index = 0;

function zeige(...knoten) {
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🗝️ Daten-Schatz'),
    el('p', { class: 'k-untertitel' }, 'Deine Daten sind ein Schatz. Bewache sie!'),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · Daten bleiben auf diesem Gerät · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
  app.querySelector('button')?.focus();
}

function startBildschirm() {
  zeige(
    el('section', { class: 'k-karte' },
      el('p', {}, `Apps und Websites wollen deine Daten – und dein Geld. In ${RUNDE} Situationen aus einem Vorrat von ${daten.szenarien.length} (auch Kostenfallen wie Lootboxen und Abo-Tricks!) entscheidest du: erlauben, ablehnen – oder erst Erwachsene fragen?`),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '▶️ Wache übernehmen'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen('Apps und Websites fragen ständig nach deinen Daten. Du entscheidest: erlauben, ablehnen, oder erst Erwachsene fragen?') }, '🔊 Vorlesen'))),
    el('section', { class: 'k-karte' },
      el('p', {}, '🧹 Hier gibt es keine Werbung und keine Anmeldung. Es wird nichts gespeichert.')),
    el('section', { class: 'k-karte' },
      hilfeInselKnopf(() => zeige(hilfeInsel({ zurueck: startBildschirm })))));
}

function starteRunde() {
  szenarien = mischen(daten.szenarien).slice(0, RUNDE);
  index = 0;
  szenarioBildschirm();
}

function szenarioBildschirm() {
  const s = szenarien[index];
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-untertitel' }, `Situation ${index + 1} von ${szenarien.length}`),
      el('div', { class: 'k-fortschritt', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': szenarien.length, 'aria-valuenow': index },
        el('div', { style: `width:${(index / szenarien.length) * 100}%` })),
      el('p', { style: 'font-weight:600' }, s.situation),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`${s.situation} Was machst du? ${ANTWORTEN.map((a) => a.text.slice(2)).join('. Oder: ')}`) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        ...ANTWORTEN.map((a) =>
          el('button', { class: 'k-knopf', onclick: () => antworte(s, a.code) }, a.text)))));
}

function antworte(s, code) {
  const beste = code === s.beste;
  const okay = !beste && s.auchOk.includes(code);
  const titel = beste ? 'Starke Entscheidung!' : okay ? 'Auch okay!' : 'Vorsicht, Falle!';
  const klasse = beste ? 'k-hinweis--richtig' : okay ? '' : 'k-hinweis--falsch';
  const besteAntwort = ANTWORTEN.find((a) => a.code === s.beste).text;
  zeige(
    el('section', { class: 'k-karte' },
      el('div', { class: `k-hinweis ${klasse}` },
        el('p', { style: 'font-weight:700;margin-top:0' }, titel),
        el('p', {}, s.erklaerung),
        el('p', { style: 'margin-bottom:0' }, `Beste Antwort: ${besteAntwort}`)),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`${titel} ${s.erklaerung}`) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: weiter }, index + 1 < szenarien.length ? 'Nächste Situation ➡️' : 'Ende der Runde 🏁'))));
}

function weiter() {
  index++;
  if (index < szenarien.length) szenarioBildschirm();
  else endBildschirm();
}

function endBildschirm() {
  const text = `Du hast ${szenarien.length} Situationen angeschaut. Mit „Noch einmal“ kommen neue Situationen.`;
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '🗝️'),
      el('p', { class: 'k-untertitel', style: 'font-weight:700' }, 'Ende der Runde'),
      el('p', { style: 'text-align:center' }, text),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`Ende der Runde. ${text}`) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '🔁 Noch einmal'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: startBildschirm }, '🏠 Zum Start'))));
}

startBildschirm();
