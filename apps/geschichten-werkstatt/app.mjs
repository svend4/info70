// Geschichten-Werkstatt (Prototyp): Kind wählt Held, Ort und Problem,
// die Werkstatt baut daraus eine Geschichte. Im MVP rein lokal (Vorlagen);
// die Erzeugerfunktion ist bewusst gekapselt, damit später eine sichere
// KI-Anbindung (ohne persönliche Daten, mit Inhaltsfilter, Eltern-Schalter)
// an genau dieser Stelle andocken kann - siehe README und docs/02 §3.
import { el, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { HELDEN, ORTE, PROBLEME, STEMPEL, ERKLAER, erzeugeGeschichte } from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');

const wahl = { held: null, ort: null, problem: null };

function zeige(...knoten) {
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '✍️ Geschichten-Werkstatt'),
    el('p', { class: 'k-untertitel' }, 'Du wählst - die Werkstatt erzählt. Du erzählst weiter!'),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Prototyp · werbefrei · ohne Anmeldung · funktioniert ohne Internet · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

function auswahlBlock(titel, optionen, schluessel, aktualisiere) {
  return el('section', { class: 'k-karte' },
    el('p', { style: 'font-weight:600;margin-top:0' }, titel),
    el('div', { class: 'k-antworten' },
      ...optionen.map((o) =>
        el('button', {
          class: `k-knopf ${wahl[schluessel] === o ? '' : 'k-knopf--neutral'}`,
          'aria-pressed': String(wahl[schluessel] === o),
          onclick: () => { wahl[schluessel] = o; aktualisiere(); },
        }, o))));
}

function bauBildschirm() {
  const fertig = wahl.held && wahl.ort && wahl.problem;
  zeige(
    auswahlBlock('1. Wer ist dein Held?', HELDEN, 'held', bauBildschirm),
    auswahlBlock('2. Wo spielt die Geschichte?', ORTE, 'ort', bauBildschirm),
    auswahlBlock('3. Was passiert?', PROBLEME, 'problem', bauBildschirm),
    el('section', { class: 'k-karte' },
      el('button', { class: 'k-knopf', disabled: !fertig, onclick: geschichteBildschirm },
        fertig ? '✨ Geschichte bauen!' : 'Wähle Held, Ort und Ereignis …')));
}

function geschichteBildschirm() {
  const text = erzeugeGeschichte(wahl);
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin:0 0 0.5rem;font-weight:700;color:var(--k-blau-dunkel)', role: 'note' }, STEMPEL),
      el('p', { style: 'font-size:1.1rem' }, text),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => vorlesen(text) }, '🔊 Vorlesen'),
        el('button', { class: 'k-knopf', onclick: geschichteBildschirm }, '🎲 Anders erzählen'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => { wahl.held = wahl.ort = wahl.problem = null; bauBildschirm(); } }, '🧱 Neue Geschichte bauen'))),
    el('section', { class: 'k-karte' },
      el('details', {},
        el('summary', { style: 'cursor:pointer;font-weight:600' }, '🤔 So denkt die Maschine'),
        el('p', { style: 'margin:0.4rem 0 0' }, ERKLAER),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', style: 'margin-top:0.4rem', onclick: () => vorlesen(ERKLAER) }, '🔊 Vorlesen'))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin:0' }, '💡 Weiter-Erzähl-Idee: Wie geht es danach weiter? Male ein Bild dazu oder erzähle das Ende ganz anders!')));
}

bauBildschirm();
