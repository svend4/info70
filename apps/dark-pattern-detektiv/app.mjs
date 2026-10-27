// Dark-Pattern-Detektiv: manipulative UI-Muster erkennen und benennen (8-12).
// Szenario-Trainer (docs/09 Nr. 52) - ergaenzt das Dark-Pattern-Labyrinth
// (Simulator) um ein Benennungs-Training: Jede Aufloesung nennt das Muster
// beim Namen, damit Kinder es wiedererkennen. 2/1/0-Muster. Nutzt Hilfe-Insel.
// Politik: keine externen Anfragen, nichts wird gespeichert, das Kind wird nicht bewertet.
import { el, vorlesen, mischen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { hilfeInsel } from '../../packages/kinder-ui/js/hilfe-insel.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';

installiereNetzwerkWaechter();

try { localStorage.removeItem('dpd.rekord'); } catch {}
const app = document.getElementById('app');
const daten = await fetch('daten/szenarien.json').then((r) => r.json());

let szenarien = [];
let index = 0;
let gesammelt = [];

function zeige(...knoten) {
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🕵️ Dark-Pattern-Detektiv'),
    el('p', { class: 'k-untertitel' }, 'Erkenne die fiesen Tricks – und gib ihnen einen Namen.'),
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
      el('p', {}, `Countdown-Druck, versteckter Schließen-Knopf, Schäme-dich-Sprüche: Apps und Shops benutzen fiese Tricks („Dark Patterns“), damit du klickst oder kaufst, ohne nachzudenken. In ${daten.szenarien.length} Beispielen entlarvst du sie – und lernst ihre Namen.`),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '▶️ Los geht’s'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen('Apps und Shops benutzen fiese Tricks, damit du klickst, ohne nachzudenken. Entlarve sie und lerne ihre Namen.') }, '🔊 Vorlesen'))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, 'Lieber selbst durch eine Trick-App klicken? Probier das ', el('a', { href: '../dark-pattern-labyrinth/' }, '🪤 Dark-Pattern-Labyrinth'), '.'),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => zeige(hilfeInsel({ zurueck: startBildschirm })) }, '🆘 Ich brauche Hilfe')));
}

function starteRunde() {
  szenarien = mischen(daten.szenarien);
  index = 0;
  gesammelt = [];
  szenarioBildschirm();
}

function szenarioBildschirm() {
  const s = szenarien[index];
  const optionen = mischen(s.optionen);
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-untertitel' }, `Trick ${index + 1} von ${szenarien.length}`),
      el('div', { class: 'k-fortschritt', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': szenarien.length, 'aria-valuenow': index },
        el('div', { style: `width:${(index / szenarien.length) * 100}%` })),
      el('div', { style: 'background:#f3f0ea;border:2px solid var(--k-rand);border-radius:0.6rem;padding:0.6rem;margin:0.5rem 0' },
        el('p', { style: 'margin:0;font-weight:600' }, `📱 ${s.situation}`)),
      el('p', { style: 'font-weight:600' }, s.frage),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`${s.situation} ${s.frage} ${optionen.map((o) => o.text).join('. Oder: ')}`) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        ...optionen.map((o) =>
          el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => antworte(s, o) }, o.text)))));
}

function antworte(s, option) {
  if (option.wert === 2 && !gesammelt.includes(s.muster)) gesammelt.push(s.muster);
  const titel = option.wert === 2 ? 'Entlarvt! 🕵️✨' : option.wert === 1 ? 'Okay – aber der Trick hat dich fast.' : 'Reingefallen – aber jetzt kennst du ihn!';
  const klasse = option.wert === 2 ? 'k-hinweis--richtig' : option.wert === 1 ? '' : 'k-hinweis--falsch';
  zeige(
    el('section', { class: 'k-karte' },
      el('div', { class: `k-hinweis ${klasse}` },
        el('p', { style: 'font-weight:700;margin-top:0' }, titel),
        el('p', { style: 'margin:0' }, s.erklaerung)),
      el('div', { class: 'k-hinweis', style: 'margin-top:0.5rem' },
        el('p', { style: 'margin:0;font-weight:700' }, `🏷️ Der Trick heißt: ${s.muster}`)),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`${titel} ${s.erklaerung} Der Trick heißt: ${s.muster}`) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: weiter }, index + 1 < szenarien.length ? 'Nächster Trick ➡️' : 'Zum Ende der Runde 🏁'))));
}

function weiter() {
  index++;
  if (index < szenarien.length) szenarioBildschirm();
  else endBildschirm();
}

function endBildschirm() {
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '🕵️'),
      el('p', { class: 'k-untertitel', style: 'font-weight:700' }, 'Ende der Runde'),
      el('p', { style: 'text-align:center' }, `Du hast alle ${szenarien.length} Tricks durchgesehen.`),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '🔁 Noch einmal'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: startBildschirm }, '🏠 Zum Start'))),
    gesammelt.length ? el('section', { class: 'k-karte' },
      el('p', { style: 'font-weight:700;margin-top:0' }, `🏷️ Deine entlarvten Tricks (${gesammelt.length}):`),
      ...gesammelt.map((m) => el('p', { style: 'margin:0.3rem 0' }, `• ${m}`))) : '');
}

startBildschirm();
