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
let phase = 'liste';    // liste | vermuten | probieren | befund | fertig
let befund = null;      // Index des beobachteten Ergebnisses

// Fußlinks mindestens 48 px hoch (docs/02 Z. 50). kinder.css setzt dafür keine Höhe.
const FUSS_LINK = 'display:inline-block;min-height:48px;line-height:48px;padding:0 0.2rem';

// Schmuck-Emojis gehören nur auf den Bildschirm. druck.css blendet die Klasse im Druck aus.
const schmuck = (zeichen) => el('span', { class: 'ml-nur-bildschirm', 'aria-hidden': 'true' }, zeichen);

function zeige(...knoten) {
  app.replaceChildren(...[
    el('h1', { class: 'k-titel', tabindex: -1 }, schmuck('🔬 '), 'Mess-Labor'),
    el('p', { class: 'k-untertitel' }, 'Vermuten – ausprobieren – herausfinden'),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · das echte Experiment passiert ohne Bildschirm · nichts wird gespeichert · '),
      el('a', { href: 'eltern.html', style: FUSS_LINK }, schmuck('👪 '), 'Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html', style: FUSS_LINK }, 'Impressum & Datenschutz')),
  ].filter(Boolean));
  // Nach einem Bildschirmwechsel landet der Fokus auf der Überschrift des neuen Bildschirms.
  app.querySelector('h1')?.focus();
}

function schrittleiste(aktueller) {
  const teile = daten.schritte.flatMap((s, i) => [
    i > 0 ? '  ·  ' : null,
    i === aktueller ? schmuck('➡️ ') : null,
    s,
  ]);
  return el('p', { style: 'text-align:center;font-size:0.9rem;color:#4b5563;margin:0' }, ...teile);
}

function liste() {
  phase = 'liste';
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin:0;font-size:0.92rem' }, daten.hinweis)),
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.05rem' }, schmuck('🧪 '), 'Such dir ein Experiment aus'),
      ...daten.experimente.map((e) => el('button', {
        class: 'k-knopf k-knopf--neutral',
        style: 'text-align:start;width:100%;margin:0.2rem 0',
        'data-kennung': `experiment-${e.id}`,
        onclick: () => { aktiv = e; vermutung = null; befund = null; vermuten(); },
      }, schmuck(`${e.emoji} `), e.titel))));
}

function vermuten() {
  phase = 'vermuten';
  zeige(
    el('section', { class: 'k-karte' },
      schrittleiste(0),
      el('p', { class: 'k-gross', style: 'text-align:center;margin:0.3rem 0' }, schmuck(aktiv.emoji)),
      el('p', { style: 'font-weight:700;font-size:1.15em;text-align:center' }, aktiv.frage),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', 'data-kennung': 'vorlesen-frage', onclick: () => vorlesen(aktiv.frage) }, schmuck('🔊 '), 'Vorlesen'),
      el('p', { style: 'font-weight:600;margin:0.5rem 0 0.2rem' }, 'Was vermutest du?'),
      el('div', { class: 'k-antworten' },
        ...aktiv.vermutungen.map((v, i) => el('button', {
          class: 'k-knopf k-knopf--neutral',
          'data-kennung': `vermutung-${i}`,
          onclick: () => { vermutung = i; probieren(); },
        }, v))),
      el('div', { class: 'k-antworten', style: 'margin-top:0.4rem' },
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', 'data-kennung': 'andere-frage', onclick: liste }, schmuck('↩️ '), 'Andere Frage'))));
}

function probieren() {
  phase = 'probieren';
  const anleitungText = `Du brauchst: ${aktiv.material}. ${aktiv.anleitung.join(' ')}`;
  zeige(
    el('section', { class: 'k-karte', style: 'background:#fef3c7' },
      schrittleiste(1),
      el('p', { style: 'font-weight:700;font-size:1.1em;text-align:center;margin:0.4rem 0' }, schmuck('📵 '), 'Jetzt das Gerät weglegen und WIRKLICH ausprobieren!'),
      el('p', { style: 'margin:0.2rem 0' }, el('strong', {}, 'Du brauchst: '), aktiv.material),
      el('ol', { style: 'margin:0.3rem 0 0;padding-inline-start:1.3rem' },
        ...aktiv.anleitung.map((s) => el('li', { style: 'margin:0.2rem 0' }, s))),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', style: 'margin-top:0.3rem', 'data-kennung': 'vorlesen-anleitung', onclick: () => vorlesen(anleitungText) }, schmuck('🔊 '), 'Vorlesen')),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin:0 0 0.3rem;font-size:0.9rem;color:#4b5563' }, 'Komm zurück, wenn du fertig geforscht hast.'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', 'data-kennung': 'ausprobiert', onclick: befundWaehlen }, schmuck('✅ '), 'Ich habe es ausprobiert!'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', 'data-kennung': 'zurueck-vermuten', onclick: vermuten }, schmuck('↩️ '), 'Zurück'))));
}

function befundWaehlen() {
  phase = 'befund';
  zeige(
    el('section', { class: 'k-karte' },
      schrittleiste(2),
      el('p', { style: 'font-weight:700;font-size:1.1em;text-align:center' }, 'Was hast du herausgefunden?'),
      el('div', { class: 'k-antworten' },
        ...aktiv.ergebnisse.map((er, i) => el('button', {
          class: 'k-knopf k-knopf--neutral',
          'data-kennung': `befund-${i}`,
          onclick: () => { befund = i; fertig(); },
        }, er)))));
}

function fertig() {
  phase = 'fertig';
  const v = vergleicheVermutung(vermutung, befund);
  const satz = forscherSatz(aktiv, vermutung, befund);
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross', style: 'text-align:center;margin:0' }, schmuck(v.stimmte ? '🎯' : '💡')),
      el('div', { class: 'k-hinweis k-hinweis--richtig' },
        el('p', { style: 'font-weight:700;margin-top:0' }, v.botschaft),
        el('p', { style: 'margin:0.2rem 0' }, satz)),
      el('div', { class: 'k-karte', style: 'background:#eff6ff;margin-top:0.4rem' },
        el('p', { style: 'font-weight:600;margin:0 0 0.2rem' }, schmuck('🧠 '), 'Warum ist das so?'),
        el('p', { style: 'margin:0' }, aktiv.erkenntnis)),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', style: 'margin-top:0.3rem', 'data-kennung': 'vorlesen-erkenntnis', onclick: () => vorlesen(`${v.botschaft} ${satz} ${aktiv.erkenntnis}`) }, schmuck('🔊 '), 'Vorlesen'),
      el('div', { class: 'k-antworten', style: 'margin-top:0.4rem' },
        el('button', { class: 'k-knopf', 'data-kennung': 'naechstes-experiment', onclick: liste }, schmuck('🧪 '), 'Nächstes Experiment'))));
}

const fehler = pruefeExperimente(daten);
if (fehler.length) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' }, el('p', { style: 'margin:0' }, `Datenfehler: ${fehler[0]}`)));
} else {
  liste();
}
