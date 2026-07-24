// Erfinder-Werkstatt: Neue Dinge gestalten (8-12 eigenständig).
// Zwei Modi: Alltagsgegenstände nach Veränderungskarten neu entwerfen,
// und Natur-Technik-Paare erkunden – mit der Unterscheidung zwischen
// „wirklich abgeschaut“ und „sieht nur ähnlich aus“.
// Praleska docs/10 (Kinder-Apps Nr. 16). Politik docs/02: keine externen
// Anfragen, werbefrei, es wird nichts gespeichert.
import { el, vorlesen, mischen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { boot as bootAnzeige } from '../../packages/kinder-ui/js/anzeige.mjs';
import { baueAuftrag, auftragsVielfalt, baueBionikFrage, pruefeDaten } from './logik.mjs';

installiereNetzwerkWaechter();
bootAnzeige();

const app = document.getElementById('app');
const daten = await fetch('daten/werkstatt.json').then((r) => r.json());
const zufall = (liste) => liste[Math.floor(Math.random() * liste.length)];

let modus = 'entwerfen';
let auftrag = null;
let bionik = null;
let bionikAntwort = null;
let geloeste = 0;

function zeige(...knoten) {
  app.replaceChildren(...[
    el('h1', { class: 'k-titel' }, '🛠️ Erfinder-Werkstatt'),
    el('p', { class: 'k-untertitel' }, 'Bekanntes umbauen – und nachsehen, was die Natur schon konnte'),
    el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Modus' },
      ...[['entwerfen', '✏️ Neu entwerfen'], ['natur', '🌿 Natur & Technik']].map(([id, name]) =>
        el('button', {
          class: `k-knopf k-knopf--klein ${modus === id ? '' : 'k-knopf--neutral'}`,
          'aria-pressed': String(modus === id),
          // Beim Wechsel die laufende Aufgabe verwerfen, sonst bliebe eine
          // schon aufgelöste Bionik-Frage erneut anklickbar.
          onclick: () => { modus = id; auftrag = null; bionik = null; bionikAntwort = null; render(); },
        }, name))),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · offline · nichts wird gespeichert · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')),
  ].filter(Boolean));
}

// ---------- Modus 1: Neu entwerfen ----------
function neuerAuftrag() {
  auftrag = baueAuftrag(daten, zufall, auftrag);
  render();
}

function entwerfenKarten() {
  if (!auftrag) {
    return [
      el('section', { class: 'k-karte' },
        el('p', { style: 'margin-top:0' }, 'Erfinden heißt selten, etwas aus dem Nichts zu erschaffen. Meistens nimmt man etwas, das es schon gibt, und ändert genau eine Sache daran. Genau das machen Designerinnen und Designer den ganzen Tag.'),
        el('p', {}, `Die Werkstatt zieht dir einen Gegenstand und eine Veränderungskarte – ${auftragsVielfalt(daten)} Aufträge sind möglich. Halte Papier und Stift bereit: Gezeichnet wird auf Papier, nicht hier.`),
        el('div', { class: 'k-antworten' },
          el('button', { class: 'k-knopf', onclick: neuerAuftrag }, '🎲 Ersten Auftrag ziehen'))),
      designerKarte(),
    ];
  }
  const { gegenstand, karte, fragen } = auftrag;
  const vorleseText = `${karte.name}. ${gegenstand.name}. ${karte.anweisung} ${fragen.join(' ')}`;
  return [
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-untertitel', style: 'margin-top:0' }, 'Dein Auftrag'),
      el('p', { class: 'k-gross' }, `${gegenstand.emoji} ${karte.emoji}`),
      el('p', { style: 'font-weight:700;font-size:1.25em;text-align:center;margin:0.2rem 0' }, `${karte.name}: ${gegenstand.name}`),
      el('p', { style: 'text-align:center;margin:0.2rem 0' }, gegenstand.alltag),
      el('div', { class: 'k-hinweis' },
        el('p', { style: 'margin:0 0 0.4rem;font-weight:700' }, `${karte.emoji} ${karte.name}`),
        el('p', { style: 'margin:0' }, karte.anweisung)),
      el('h2', { style: 'font-size:1.05rem;margin:0.8rem 0 0.3rem' }, 'Diese vier Fragen helfen dir'),
      el('ul', { style: 'margin:0;padding-left:1.2rem' }, ...fragen.map((f) => el('li', {}, f))),
      el('p', { style: 'margin:0.7rem 0 0' }, karte.beispiel ? `Beispiel zum Anwärmen: ${karte.beispiel}` : null),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(vorleseText) }, '🔊 Auftrag vorlesen'),
        el('button', { class: 'k-knopf', onclick: neuerAuftrag }, '🎲 Nächster Auftrag'))),
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.05rem' }, '📏 Wann ist ein Entwurf fertig?'),
      el('p', { style: 'margin:0' }, 'Wenn du jemandem in drei Sätzen sagen kannst, was dein Ding tut, für wen es ist und warum es besser ist als das alte. Schöner aussehen allein reicht nicht – es muss auch funktionieren.')),
    designerKarte(),
  ];
}

function designerKarte() {
  return el('section', { class: 'k-karte' },
    el('h2', { style: 'margin-top:0;font-size:1.05rem' }, '🎨 Was macht eigentlich ein Designer?'),
    el('p', { style: 'margin:0' }, 'Designerinnen und Designer entscheiden, wie ein Ding aussieht – vor allem aber, wie es sich benutzen lässt: Wo greift die Hand an? Versteht man ohne Anleitung, wo vorne ist? Passt es auch für jemanden, der nur eine Hand frei hat? Ein Ding, das gut aussieht und trotzdem niemand bedienen kann, ist schlecht gestaltet.'));
}

// ---------- Modus 2: Natur & Technik ----------
function neueBionik() {
  const uebrig = bionik ? daten.bionik.filter((p) => p.id !== bionik.paar.id) : daten.bionik;
  bionik = baueBionikFrage(zufall(uebrig), mischen);
  bionikAntwort = null;
  render();
}

function antworteBionik(wahl) {
  const richtig = wahl === bionik.paar.vorbild;
  if (richtig) geloeste += 1;
  bionikAntwort = { wahl, richtig };
  render();
}

function naturKarten() {
  if (!bionik) {
    return [
      el('section', { class: 'k-karte' },
        el('p', { style: 'margin-top:0' }, 'Manche Erfindungen sind bei Tieren und Pflanzen abgeschaut. Andere sehen nur zufällig ähnlich aus – und ein paar Dinge hat die Natur überhaupt nicht erfunden.'),
        el('p', {}, 'Rate, wovon die Erfindung abgeschaut ist. Aufpassen: Manchmal ist die richtige Antwort „von niemandem“.'),
        el('div', { class: 'k-antworten' },
          el('button', { class: 'k-knopf', onclick: neueBionik }, '🌿 Erste Erfindung'))),
    ];
  }
  const p = bionik.paar;
  const abgeschaut = p.art === 'abgeschaut';
  return [
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, p.emoji),
      el('p', { style: 'font-weight:700;font-size:1.2em;text-align:center;margin:0.2rem 0' }, p.erfindung),
      el('p', { style: 'text-align:center;margin:0.2rem 0 0.6rem' }, 'Wovon ist das abgeschaut?'),
      el('button', {
        class: 'k-knopf k-knopf--neutral k-knopf--klein',
        onclick: () => vorlesen(`${p.erfindung}. Wovon ist das abgeschaut? ${bionik.optionen.join('. Oder: ')}`),
      }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Vorbild wählen' },
        ...(bionikAntwort
          ? [el('button', { class: 'k-knopf', onclick: neueBionik }, 'Nächste Erfindung ➡️')]
          : bionik.optionen.map((o) => el('button', {
            class: 'k-knopf k-knopf--neutral',
            onclick: () => antworteBionik(o),
          }, o))))),
    bionikAntwort
      ? el('section', { class: 'k-karte' },
        el('div', { class: `k-hinweis${bionikAntwort.richtig ? ' k-hinweis--richtig' : ''}` },
          el('p', { style: 'font-weight:700;margin-top:0' },
            `${bionikAntwort.richtig ? '🌟 Richtig' : '💭 Knapp daneben'} – ${p.vorbild}`),
          el('p', { style: 'margin:0' }, p.erklaerung)),
        el('p', { style: 'margin:0.6rem 0 0;font-weight:700' },
          abgeschaut ? '✅ Wirklich abgeschaut' : '🔶 Sieht nur ähnlich aus'),
        abgeschaut ? el('p', { style: 'margin:0.2rem 0 0' }, p.beleg) : null,
        el('button', {
          class: 'k-knopf k-knopf--neutral k-knopf--klein',
          style: 'margin-top:0.5rem',
          onclick: () => vorlesen(`${p.vorbild}. ${p.erklaerung} ${abgeschaut ? p.beleg : ''}`),
        }, '🔊 Erklärung vorlesen'),
        el('p', { style: 'text-align:center;margin:0.6rem 0 0' }, `Erkannte Vorbilder: ${geloeste}`))
      : null,
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.05rem' }, '🔶 Ähnlich ist nicht abgeschaut'),
      el('p', { style: 'margin:0' }, 'Zwei Dinge können dieselbe Aufgabe lösen, ohne voneinander zu wissen: Ein U-Boot taucht wie ein Fisch, arbeitet aber ganz anders. „Abgeschaut“ sagen wir nur, wenn wirklich jemand hingesehen und es nachgebaut hat.')),
  ];
}

function render() {
  zeige(...(modus === 'entwerfen' ? entwerfenKarten() : naturKarten()).filter(Boolean));
}

const fehler = pruefeDaten(daten);
if (fehler.length) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' }, el('p', { style: 'margin:0' }, `Datenfehler: ${fehler[0]}`)));
} else {
  render();
}
