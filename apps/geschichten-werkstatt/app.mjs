// Geschichten-Werkstatt (Prototyp): Kind wählt Held, Ort und Problem,
// die Werkstatt baut daraus eine Geschichte. Im MVP rein lokal (Vorlagen);
// die Erzeugerfunktion ist bewusst gekapselt, damit später eine sichere
// KI-Anbindung (ohne persönliche Daten, mit Inhaltsfilter, Eltern-Schalter)
// an genau dieser Stelle andocken kann - siehe README und docs/02 §3.
import { el, vorlesen, mischen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');

const HELDEN = ['eine mutige Erfinderin', 'ein schüchterner Drache', 'zwei beste Freunde', 'eine neugierige Katze', 'ein kleiner Roboter'];
const ORTE = ['auf einer Insel aus Süßigkeiten', 'in einer Stadt unter dem Meer', 'auf dem Dachboden der Schule', 'in einem Wald, der nachts leuchtet', 'auf einem fliegenden Markt'];
const PROBLEME = ['hat den Schlüssel zur Heimat verloren', 'findet eine geheimnisvolle Landkarte', 'muss ein Gewitter aus Limonade stoppen', 'will den traurigen Mond zum Lachen bringen', 'entdeckt, dass die Farben verschwinden'];

const wahl = { held: null, ort: null, problem: null };

/**
 * Erzeugt die Geschichte. Bewusst eine reine Funktion (Auswahl -> Text):
 * die einzige Stelle, die später durch einen sicheren KI-Aufruf ersetzt wird.
 */
function erzeugeGeschichte({ held, ort, problem }) {
  const anfaenge = ['Es war einmal', 'An einem ganz gewöhnlichen Dienstag', 'Niemand hätte gedacht, dass'];
  const wendungen = [
    'Zuerst schien alles unmöglich. Doch dann kam eine Idee, so hell wie ein Blitz.',
    'Ein sprechender Koffer bot seine Hilfe an - gegen drei gute Witze.',
    'Da flüsterte der Wind einen Hinweis, den nur genaue Zuhörer verstehen konnten.',
  ];
  const enden = [
    'Und wenn du heute genau hinschaust, findest du vielleicht eine Spur davon.',
    'Seitdem feiern alle diesen Tag mit einem großen Pfannkuchenfest.',
    'Und die Moral? Wer fragt und zuhört, findet immer einen Weg.',
  ];
  const [anfang] = mischen(anfaenge);
  const [wendung] = mischen(wendungen);
  const [ende] = mischen(enden);
  return `${anfang}: ${held}, ${ort}. Eines Tages passierte es: ${held} ${problem}. ${wendung} Gemeinsam mit neuen Freunden wurde gesucht, probiert und gelacht - bis die Lösung gefunden war. ${ende}`;
}

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
      el('p', { style: 'font-size:1.1rem' }, text),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => vorlesen(text) }, '🔊 Vorlesen'),
        el('button', { class: 'k-knopf', onclick: geschichteBildschirm }, '🎲 Anders erzählen'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => { wahl.held = wahl.ort = wahl.problem = null; bauBildschirm(); } }, '🧱 Neue Geschichte bauen'))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin:0' }, '💡 Weiter-Erzähl-Idee: Wie geht es danach weiter? Male ein Bild dazu oder erzähle das Ende ganz anders!')));
}

bauBildschirm();
