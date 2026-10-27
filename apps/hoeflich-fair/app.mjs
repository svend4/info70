// Höflich & Fair – Sprach-Etikette (5-7 in Ko-Nutzung, 8-12 allein):
// Szenario-Trainer mit drei Antworten je Szene zu danken, entschuldigen, gratulieren, Mitgefühl
// und Bewunderung zeigen, bitten, grüßen, Grenzen setzen.
// Praleska docs/10 (Kinder-Apps Nr. 13). Alle Szenen Eigenproduktion.
// Politik docs/02: keine externen Anfragen, die App speichert nichts. Das Kind wird nicht bewertet:
// zu jeder Antwort gibt es eine Rückmeldung mit Erklärung, am Ende „Ende der Runde“.
import { el, vorlesen, mischen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { boot as bootAnzeige } from '../../packages/kinder-ui/js/anzeige.mjs';
import { hilfeInsel, hilfeInselKnopf } from '../../packages/kinder-ui/js/hilfe-insel.mjs';
import { rueckmeldungFuer, pruefeSzenarien } from './logik.mjs';

installiereNetzwerkWaechter();
bootAnzeige();

try { localStorage.removeItem('hoeflich.rekord'); } catch {}
const RUNDE = 10;
const app = document.getElementById('app');
const daten = await fetch('daten/szenarien.json').then((r) => r.json());

let szenarien = [];
let index = 0;

function zeige(...knoten) {
  app.replaceChildren(...[
    el('h1', { class: 'k-titel' }, '🤝 Höflich & Fair'),
    el('p', { class: 'k-untertitel' }, 'Die richtigen Worte finden – und die eigenen Grenzen sagen dürfen'),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · diese App speichert nichts · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')),
  ].filter(Boolean));
  app.querySelector('button')?.focus();
}

function start() {
  const intro = `Höflich sein heißt nicht, immer brav zu sein. Es heißt: sagen können, was du meinst, ohne jemanden zu verletzen – und auch dann freundlich bleiben, wenn du Nein sagst. In ${RUNDE} Situationen suchst du die Worte, die am besten passen.`;
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '💬'),
      el('p', {}, intro),
      el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => vorlesen(intro) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '▶️ Los geht’s'))),
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.05rem' }, '👉 Die wichtigste Regel'),
      el('p', { style: 'margin:0' }, 'Freundlich sein und Nein sagen sind kein Widerspruch. Wie du jemanden begrüßt und wer dich anfassen darf, entscheidest du – auch bei Erwachsenen, die du gern hast.')),
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.05rem' }, '🗺️ Sprachbrücke'),
      el('p', { style: 'margin:0' }, 'Wenn ihr zu Hause noch eine andere Sprache sprecht: Sagt euch gegenseitig, wie „Danke“, „Bitte“, „Entschuldigung“ und der Gruß am Morgen bei euch heißen. Wer beides kann, hat doppelt so viele Worte für denselben Moment.')),
    el('section', { class: 'k-karte' },
      hilfeInselKnopf(() => zeige(hilfeInsel({ zurueck: start })))));
}

function starteRunde() {
  szenarien = mischen(daten.szenarien).slice(0, Math.min(RUNDE, daten.szenarien.length));
  index = 0;
  frage();
}

function frage() {
  const s = szenarien[index];
  const optionen = mischen(s.optionen);
  const vorleseText = `${s.situation} ${s.frage} ${optionen.map((o) => o.text).join('. Oder: ')}`;
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-untertitel' }, `Situation ${index + 1} von ${szenarien.length}`),
      el('p', { class: 'k-gross' }, s.emoji),
      el('p', { style: 'font-weight:700;font-size:1.2em;text-align:center' }, s.situation),
      el('p', { style: 'text-align:center' }, s.frage),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(vorleseText) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        ...optionen.map((o) => el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => antworte(s, o) }, o.text)))));
}

function antworte(s, option) {
  const { gut, emoji, titel } = rueckmeldungFuer(option);
  const letzte = index + 1 >= szenarien.length;
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, emoji),
      el('div', { class: `k-hinweis${gut ? ' k-hinweis--richtig' : ''}` },
        el('p', { style: 'font-weight:700;margin-top:0' }, titel),
        el('p', { style: 'margin-bottom:0' }, s.erklaerung)),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`${titel} ${s.erklaerung}`) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: weiter }, letzte ? 'Fertig 🏁' : 'Weiter ➡️'))));
}

function weiter() {
  index++;
  if (index < szenarien.length) frage();
  else ende();
}

function ende() {
  const impuls = 'Sucht euch zu Hause eine Situation aus dieser Runde aus und spielt sie einmal nach – erst so, wie es schiefgeht, dann so, wie es gut läuft. Das bleibt besser hängen als jede Regel.';
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '💬'),
      el('p', { style: 'font-weight:700;font-size:1.2em;text-align:center' }, 'Ende der Runde'),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`Ende der Runde. ${impuls}`) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '🔁 Noch einmal'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: start }, '🏠 Zum Start'))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin:0' }, `👉 ${impuls}`)));
}

const fehler = pruefeSzenarien(daten);
if (fehler.length) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' }, el('p', { style: 'margin:0' }, `Datenfehler: ${fehler[0]}`)));
} else {
  start();
}
