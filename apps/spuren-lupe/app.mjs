// Spuren-Lupe: was eine Seite ueber dich "sieht" - rein lokal (8-12 Jahre).
// Liest echte, harmlose Browser-Signale (Bildschirm, Sprache, Zeitzone,
// Zeigegeraet, Farbschema) und misst live Verweildauer + Klicks. Der
// Netzwerk-Waechter beweist: nichts davon wird gesendet. Lernziel: Daten
// entstehen auch ohne Eingabe. Politik docs/02: keine externen Anfragen.
import { el, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { hilfeInsel, hilfeInselKnopf } from '../../packages/kinder-ui/js/hilfe-insel.mjs';
import { dauerText, geraeteEinschaetzung, SIGNALE, LEKTIONEN } from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const start = Date.now();
let klicks = 0;
let ticker = null;

// Echte, harmlose Signale auslesen - alles bleibt hier im Browser.
function liesWert(code) {
  switch (code) {
    case 'geraet': return geraeteEinschaetzung(matchMedia('(pointer: coarse)').matches);
    case 'bildschirm': return `${screen.width} × ${screen.height} Punkte`;
    case 'sprache': return navigator.language || 'unbekannt';
    case 'zeitzone': return Intl.DateTimeFormat().resolvedOptions().timeZone || 'unbekannt';
    case 'farbschema': return matchMedia('(prefers-color-scheme: dark)').matches ? 'Dunkel-Modus' : 'Hell-Modus';
    case 'dauer': return dauerText((Date.now() - start) / 1000);
    case 'klicks': return `${klicks} ${klicks === 1 ? 'Klick' : 'Klicks'} auf dieser Seite`;
    default: return '—';
  }
}

function zeige(...knoten) {
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🔍 Spuren-Lupe'),
    el('p', { class: 'k-untertitel' }, 'Du tippst nichts ein – und trotzdem sieht diese Seite schon einiges.'),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · sendet nichts · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
  app.querySelector('button')?.focus();
}

function signalKarte() {
  return el('section', { class: 'k-karte' },
    el('p', { style: 'font-weight:600;margin-top:0' }, '👀 Das könnte diese Seite gerade über dich sehen:'),
    el('div', {},
      ...SIGNALE.map((s) =>
        el('div', { style: 'display:flex;gap:0.6rem;align-items:flex-start;padding:0.4rem 0;border-bottom:1px solid var(--k-rand)' },
          el('span', { style: 'font-size:1.3rem', 'aria-hidden': 'true' }, s.emoji),
          el('div', {},
            el('p', { style: 'margin:0;font-weight:600' }, `${s.name}: `, el('span', { style: 'font-weight:400' }, liesWert(s.code))),
            el('details', { style: 'margin-top:0.15rem' },
              el('summary', { style: 'cursor:pointer;font-size:0.85rem;color:var(--k-blau-dunkel)' }, 'Warum ist das wichtig?'),
              el('p', { style: 'font-size:0.85rem;margin:0.25rem 0 0;color:#374151' }, s.bedeutung)))))),
    el('p', { style: 'font-size:0.85rem;color:#4b5563;margin-bottom:0' }, 'Dauer und Klicks zählen live mit – ganz ohne dass du etwas eingibst.'));
}

function render() {
  clearInterval(ticker);
  zeige(
    el('section', { class: 'k-karte k-hinweis--richtig' },
      el('p', { style: 'margin:0' }, '🛡️ Wichtig: Diese App sendet nichts. Alles unten bleibt auf deinem Gerät (der Netzwerk-Wächter blockiert jede Verbindung). Es zeigt nur, was andere Seiten sehen KÖNNTEN.')),
    signalKarte(),
    el('section', { class: 'k-karte' },
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen('Du tippst nichts ein, und trotzdem sieht diese Seite schon dein Gerät, deine Sprache, deine Zeitzone und wie lange du bleibst.') }, '🔊 Vorlesen'),
        el('button', { class: 'k-knopf', onclick: lektionBildschirm }, '🎓 Was heißt das? (Auflösung)'))),
    el('section', { class: 'k-karte' },
      hilfeInselKnopf(() => zeige(hilfeInsel({ zurueck: render })))));
  // Live-Aktualisierung: Dauer und Klicks zählen sichtbar hoch (nur Anzeige,
  // nichts wird gespeichert oder gesendet). Die Signal-Karte ist die zweite
  // Karte (nach dem Hinweis) und wird an Ort und Stelle neu gezeichnet.
  ticker = setInterval(() => {
    const karten = app.querySelectorAll('section.k-karte');
    if (karten[1]) karten[1].replaceWith(signalKarte());
  }, 1000);
}

function lektionBildschirm() {
  clearInterval(ticker);
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-weight:700;margin-top:0' }, '🎓 Spuren-Lupe – aufgedeckt:'),
      ...LEKTIONEN.map((l) => el('p', { style: 'margin:0.5rem 0' }, l)),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(LEKTIONEN.join(' ')) }, '🔊 Vorlesen'),
        el('button', { class: 'k-knopf', onclick: render }, '🔁 Zurück zur Lupe'))));
}

// Klicks global zählen - das IST eine Verhaltensspur (und genau das zeigen wir).
document.addEventListener('click', () => { klicks++; });

render();
