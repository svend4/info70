// Mess-Labor der kleinen Forscher (5-7 gemeinsam / 8-12): Vermutung →
// echtes Ausprobieren OHNE Bildschirm → Schlussfolgerung. Die App ist nur
// das Sprungbrett und das Forschungs-Heft. Praleska docs/10 (Top-30 Nr. 27).
// Politik docs/02: keine externen Anfragen, speichert nichts.
import { el, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { boot as bootAnzeige } from '../../packages/kinder-ui/js/anzeige.mjs';
import { pruefeExperimente, vergleicheVermutung, forscherSatz } from './logik.mjs';

installiereNetzwerkWaechter();
bootAnzeige();

const app = document.getElementById('app');
const daten = await fetch('daten/experimente.json').then((r) => r.json());

let aktiv = null;       // gewähltes Experiment
let vermutung = null;   // Index
let phase = 'liste';    // liste | vermuten | probieren | ergebnis | fertig
let ergebnis = null;    // Index

function zeige(...knoten) {
  app.replaceChildren(...[
    el('h1', { class: 'k-titel' }, '🔬 Mess-Labor'),
    el('p', { class: 'k-untertitel' }, 'Vermuten – ausprobieren – herausfinden'),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · das echte Experiment passiert ohne Bildschirm · nichts wird gespeichert · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')),
  ].filter(Boolean));
  app.querySelector('button')?.focus();
}

function schrittleiste(aktueller) {
  return el('p', { style: 'text-align:center;font-size:0.9rem;color:#4b5563;margin:0' },
    daten.schritte.map((s, i) => (i === aktueller ? `➡️ ${s}` : s)).join('  ·  '));
}

function liste() {
  phase = 'liste';
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin:0;font-size:0.92rem' }, daten.hinweis)),
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.05rem' }, '🧪 Such dir ein Experiment aus'),
      ...daten.experimente.map((e) => el('button', {
        class: 'k-knopf k-knopf--neutral',
        style: 'text-align:start;width:100%;margin:0.2rem 0',
        onclick: () => { aktiv = e; vermutung = null; ergebnis = null; vermuten(); },
      }, `${e.emoji} ${e.titel}`))));
}

function vermuten() {
  phase = 'vermuten';
  zeige(
    el('section', { class: 'k-karte' },
      schrittleiste(0),
      el('p', { class: 'k-gross', style: 'text-align:center;margin:0.3rem 0' }, aktiv.emoji),
      el('p', { style: 'font-weight:700;font-size:1.15em;text-align:center' }, aktiv.frage),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(aktiv.frage) }, '🔊 Vorlesen'),
      el('p', { style: 'font-weight:600;margin:0.5rem 0 0.2rem' }, 'Was vermutest du?'),
      el('div', { class: 'k-antworten' },
        ...aktiv.vermutungen.map((v, i) => el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => { vermutung = i; probieren(); } }, v))),
      el('div', { class: 'k-antworten', style: 'margin-top:0.4rem' },
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: liste }, '↩️ Andere Frage'))));
}

function probieren() {
  phase = 'probieren';
  const anleitungText = `Du brauchst: ${aktiv.material}. ${aktiv.anleitung.join(' ')}`;
  zeige(
    el('section', { class: 'k-karte', style: 'background:#fef3c7' },
      schrittleiste(1),
      el('p', { style: 'font-weight:700;font-size:1.1em;text-align:center;margin:0.4rem 0' }, '📵 Jetzt das Gerät weglegen und WIRKLICH ausprobieren!'),
      el('p', { style: 'margin:0.2rem 0' }, el('strong', {}, 'Du brauchst: '), aktiv.material),
      el('ol', { style: 'margin:0.3rem 0 0;padding-inline-start:1.3rem' },
        ...aktiv.anleitung.map((s) => el('li', { style: 'margin:0.2rem 0' }, s))),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', style: 'margin-top:0.3rem', onclick: () => vorlesen(anleitungText) }, '🔊 Vorlesen')),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin:0 0 0.3rem;font-size:0.9rem;color:#4b5563' }, 'Komm zurück, wenn du fertig geforscht hast.'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: ergebnisWaehlen }, '✅ Ich habe es ausprobiert!'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: vermuten }, '↩️ Zurück'))));
}

function ergebnisWaehlen() {
  phase = 'ergebnis';
  zeige(
    el('section', { class: 'k-karte' },
      schrittleiste(2),
      el('p', { style: 'font-weight:700;font-size:1.1em;text-align:center' }, 'Was hast du herausgefunden?'),
      el('div', { class: 'k-antworten' },
        ...aktiv.ergebnisse.map((er, i) => el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => { ergebnis = i; fertig(); } }, er)))));
}

function fertig() {
  phase = 'fertig';
  const v = vergleicheVermutung(vermutung, ergebnis);
  const satz = forscherSatz(aktiv, vermutung, ergebnis);
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross', style: 'text-align:center;margin:0' }, v.stimmte ? '🎯' : '💡'),
      el('div', { class: 'k-hinweis k-hinweis--richtig' },
        el('p', { style: 'font-weight:700;margin-top:0' }, v.botschaft),
        el('p', { style: 'margin:0.2rem 0' }, satz)),
      el('div', { class: 'k-karte', style: 'background:#eff6ff;margin-top:0.4rem' },
        el('p', { style: 'font-weight:600;margin:0 0 0.2rem' }, '🧠 Warum ist das so?'),
        el('p', { style: 'margin:0' }, aktiv.erkenntnis)),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', style: 'margin-top:0.3rem', onclick: () => vorlesen(`${v.botschaft} ${satz} ${aktiv.erkenntnis}`) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten', style: 'margin-top:0.4rem' },
        el('button', { class: 'k-knopf', onclick: liste }, '🧪 Nächstes Experiment'))));
}

const fehler = pruefeExperimente(daten);
if (fehler.length) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' }, el('p', { style: 'margin:0' }, `Datenfehler: ${fehler[0]}`)));
} else {
  liste();
}
