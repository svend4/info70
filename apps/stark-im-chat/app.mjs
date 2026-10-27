// Stark im Chat: Szenario-Training gegen Cybermobbing (8-12 Jahre).
// Fokus auf der Zuschauer-Rolle (Bystander): nicht mitmachen, melden, helfen.
// Anders als im Daten-Schatz (feste drei Antworten) hat hier jedes Szenario
// eigene Optionen mit Wert 2/1/0 - bewusst kein gemeinsamer Szenario-Kern,
// solange es nur zwei Trainer-Apps gibt (docs/05, Methode 0: Regel der zwei).
// Das Kind wird nicht bewertet: die Werte 2/1/0 steuern nur die Rueckmeldung zu jeder
// Antwort, es wird nichts addiert. Politik: keine externen Anfragen, speichert NICHTS.
import { el, vorlesen, mischen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { boot as bootAnzeige } from '../../packages/kinder-ui/js/anzeige.mjs';
import { hilfeInsel, hilfeInselKnopf } from '../../packages/kinder-ui/js/hilfe-insel.mjs';

installiereNetzwerkWaechter();
bootAnzeige(); // Anzeige-Einstellung (Kontrast/Schrift) anwenden (BFSG)

// Alter Schluessel aus frueheren Versionen: einmal beim Start entfernen.
try { localStorage.removeItem('sic.rekord'); } catch {}

const app = document.getElementById('app');
const daten = await fetch('daten/szenarien.json').then((r) => r.json());

let szenarien = [];
let index = 0;

function zeige(...knoten) {
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '💪 Stark im Chat'),
    el('p', { class: 'k-untertitel' }, 'Hinschauen. Nicht mitmachen. Helfen.'),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · diese App speichert nichts · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
  app.querySelector('button')?.focus();
}

function startBildschirm() {
  zeige(
    el('section', { class: 'k-karte' },
      el('p', {}, `Gemeine Nachrichten, fiese Gruppen, peinliche Fotos: In ${daten.szenarien.length} Chat-Situationen entscheidest du, was du tust. Kleine Züge, große Wirkung – du hast mehr Macht, als du denkst.`),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '▶️ Training starten'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen('Gemeine Nachrichten, fiese Gruppen, peinliche Fotos. In zehn Chat-Situationen entscheidest du, was du tust. Du hast mehr Macht, als du denkst.') }, '🔊 Vorlesen'))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin:0' }, '💛 Wichtig: Wirst du selbst gemobbt? Das ist NIE deine Schuld. Sprich mit Erwachsenen – oder ruf kostenlos und anonym an: Nummer gegen Kummer 116 111.')),
    el('section', { class: 'k-karte' },
      hilfeInselKnopf(() => zeige(hilfeInsel({ zurueck: startBildschirm })))));
}

function starteRunde() {
  szenarien = mischen(daten.szenarien);
  index = 0;
  szenarioBildschirm();
}

function szenarioBildschirm() {
  const s = szenarien[index];
  const optionen = mischen(s.optionen);
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-untertitel' }, `Situation ${index + 1} von ${szenarien.length}`),
      el('div', { class: 'k-fortschritt', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': szenarien.length, 'aria-valuenow': index },
        el('div', { style: `width:${(index / szenarien.length) * 100}%` })),
      el('p', { style: 'font-weight:600' }, s.situation),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`${s.situation} Was machst du? ${optionen.map((o) => o.text).join('. Oder: ')}`) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        ...optionen.map((o) =>
          el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => antworte(s, o) }, o.text)))));
}

function antworte(s, option) {
  const titel = option.wert === 2 ? 'Starker Zug! 💪💪' : option.wert === 1 ? 'Okay – aber da geht mehr! 💪' : 'Das macht es schlimmer …';
  const klasse = option.wert === 2 ? 'k-hinweis--richtig' : option.wert === 1 ? '' : 'k-hinweis--falsch';
  const beste = s.optionen.find((o) => o.wert === 2);
  zeige(
    el('section', { class: 'k-karte' },
      el('div', { class: `k-hinweis ${klasse}` },
        el('p', { style: 'font-weight:700;margin-top:0' }, titel),
        el('p', {}, s.erklaerung),
        option.wert < 2 ? el('p', { style: 'margin-bottom:0' }, `Stärkster Zug: ${beste.text}`) : ''),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`${titel} ${s.erklaerung}`) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: weiter }, index + 1 < szenarien.length ? 'Nächste Situation ➡️' : 'Zum Schluss 🏁'))));
}

function weiter() {
  index++;
  if (index < szenarien.length) szenarioBildschirm();
  else endBildschirm();
}

function endBildschirm() {
  const satz = 'Ende der Runde. Merk dir drei Züge: Nicht mitmachen. Melden und einem Erwachsenen erzählen. Der betroffenen Person schreiben, dass sie nicht allein ist.';
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '💪'),
      el('p', { class: 'k-untertitel', style: 'font-weight:700' }, 'Ende der Runde'),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(satz) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '🔁 Noch einmal'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: startBildschirm }, '🏠 Zum Start'))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin:0' }, '📌 Merk dir drei Züge: Nicht mitmachen · Melden & Erwachsenen erzählen · Der betroffenen Person schreiben, dass sie nicht allein ist.')));
}

startBildschirm();
