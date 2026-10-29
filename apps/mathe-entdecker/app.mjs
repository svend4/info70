// Mathe-Entdecker: frühe mathematische Bildung als Vorlese-Quiz (5-7).
// Mengen, Zählen, Formen, Reihen/Muster, Vergleichen, Raumrichtung, Teilen,
// Zeit. Ablauf aus @info70/quiz-kern (inkl. Vorlesen, Klassen-/Duett-/Staffel-
// Modus). Praleska docs/10 (Top-30 Nr. 6). Alle Aufgaben Eigenproduktion.
// Politik docs/02: keine externen Anfragen, nichts gespeichert, keine Wertung.
// Seit dem 28.10.2026 zusätzlich der Modus „Reihen legen“ (GEM-8, Eigenentwurf): Logik in logik.mjs,
// hier nur Anzeige. Die Aufgaben folgen einer festen Reihe (folgeZu); der Code hat keinen Zufall.
import { starteQuiz } from '../../packages/quiz-kern/src/quiz.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { el, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { folgeZu, neueAufgabe, NAMEN, pruefeReihe } from './logik.mjs';

installiereNetzwerkWaechter();

const daten = await fetch('daten/fragen.json').then((r) => r.json());
const RUNDE = 10;

starteQuiz({
  wurzel: document.getElementById('app'),
  daten,
  rekordSchluessel: 'mathe.rekord',
  rundenGroesse: RUNDE,
  texte: {
    titel: '🔢 Mathe-Entdecker',
    untertitel: 'Zahlen, Formen und Muster entdecken (am besten gemeinsam)',
    intro: `Entdecke Mathe im Alltag! Du bekommst ${RUNDE} kleine Aufgaben zu Mengen, Zahlen, Formen und Mustern. Sprich sie ruhig laut mit – tippe dann deine Antwort.`,
    startKnopf: '▶️ Los geht’s',
    fallWort: 'Aufgabe',
    binaerFrage: 'Stimmt das?',
    binaerJa: '✅ Ja, stimmt',
    binaerNein: '🚫 Nein, stimmt nicht',
    weiterKnopf: 'Nächste Aufgabe ➡️',
    fertigTitel: 'Toll gerechnet!',
  },
});

// --- Modus „Reihen legen“. Eine Reihe hat eine freie Stelle; das Kind tippt ein Teil an und prüft.
// Rückmeldung ohne Wertung, Auflösung mit Vorlesen, kein Speicher. Die Reihe steht in der Ansicht #reihen.
const quizAnsicht = document.getElementById('app');
const reihenAnsicht = document.getElementById('reihen');
const modusLeiste = document.getElementById('modus-leiste');

const REGEL_TEXT = { groesse: 'von klein nach groß', farbe: 'von hell nach dunkel' };
const GROESSE_PX = [12, 20, 28, 36, 44];
const FARBE_HEX = ['#dbeafe', '#93c5fd', '#3b82f6', '#1d4ed8', '#1e3a8a'];

// Die Aufgabe mit der Nummer n nimmt die feste Zahlenreihe n mod 12 (folgeZu). Ohne Zufall.
let aufgabenNummer = 0;
const aufgabeZuNummer = () => neueAufgabe(folgeZu(aufgabenNummer));

let aufgabe = aufgabeZuNummer();
let gelegt = null; // das Teil auf der freien Stelle
let stand = 'arbeiten'; // 'arbeiten' | 'stimmt' | 'aufloesung'
let meldung = '';

const name = (objekt, regel) => NAMEN[regel][objekt[regel]];
const ganzeReihe = () => aufgabe.reihe.map((o, i) => (i === aufgabe.luecke ? aufgabe.richtig : o));
const aufloesungText = () => `Die ganze Reihe: ${ganzeReihe().map((o) => name(o, aufgabe.regel)).join(', ')}.`;
const vorlesetext = () => (stand === 'arbeiten'
  ? `Die Reihe geht ${REGEL_TEXT[aufgabe.regel]}. Eine Stelle ist frei. ${meldung}`
  : `${meldung} ${aufloesungText()}`).trim();

function teilBild(objekt, regel) {
  const px = regel === 'groesse' ? GROESSE_PX[objekt.groesse] : 36;
  const farbe = regel === 'groesse' ? '#1d4ed8' : FARBE_HEX[objekt.farbe];
  return el('span', { class: 'rv-teil', 'aria-hidden': 'true', style: `width:${px}px;height:${px}px;background:${farbe}` });
}

function pruefen() {
  if (!gelegt) {
    meldung = 'Lege zuerst ein Teil auf die freie Stelle.';
  } else {
    const gefuellt = aufgabe.reihe.map((o, i) => (i === aufgabe.luecke ? gelegt : o));
    if (pruefeReihe(gefuellt, aufgabe.regel).ok) {
      stand = 'stimmt';
      meldung = 'Die Reihe stimmt.';
    } else {
      meldung = 'Schau dir die Reihe noch einmal an.';
    }
  }
  reihenRender();
}

// Nach dem Neuaufbau bekommt der Knopf mit derselben Kennung den Fokus zurück. Gibt es ihn nicht mehr,
// landet der Fokus auf der Überschrift des Modus (tabindex -1), nicht auf dem Seitenkörper.
function reihenRender() {
  const merke = document.activeElement?.dataset?.kennung;
  const { regel, luecke } = aufgabe;
  const zeile = aufgabe.reihe.map((o, i) => (i === luecke ? (stand === 'arbeiten' ? gelegt : aufgabe.richtig) : o));
  const beschreibung = zeile.map((o) => (o ? name(o, regel) : 'freie Stelle')).join(', ');
  // replaceChildren filtert nicht: ein null würde als Text „null“ erscheinen (wie in quiz-kern).
  reihenAnsicht.replaceChildren(...[
    el('h2', { id: 'reihen-titel', class: 'k-titel', tabindex: '-1' }, 'Reihen legen'),
    el('section', { class: 'k-karte' },
      el('p', {}, 'Eine Reihe hat eine freie Stelle. Tippe das Teil an, das dorthin gehört, und prüfe dann die Reihe.'),
      el('p', { style: 'font-weight:600' }, `Die Reihe geht ${REGEL_TEXT[regel]}.`),
      el('div', { class: 'rv-reihe', role: 'img', 'aria-label': `Die Reihe: ${beschreibung}` },
        ...zeile.map((o) => (o ? teilBild(o, regel) : el('span', { class: 'rv-stelle' }))))),
    stand === 'arbeiten'
      ? el('section', { class: 'k-karte' },
        el('div', { class: 'k-antworten' },
          ...aufgabe.objekte.map((o, k) => el('button', {
            class: 'k-knopf k-knopf--neutral',
            'data-kennung': `objekt-${k}`,
            'aria-pressed': String(o === gelegt),
            onclick: () => { gelegt = o; meldung = ''; reihenRender(); },
          }, el('span', { class: 'rv-zeile' }, teilBild(o, regel), el('span', {}, `In die Lücke legen: ${name(o, regel)}`))))))
      : null,
    el('section', { class: 'k-karte' },
      meldung ? el('p', { class: stand === 'stimmt' ? 'k-hinweis k-hinweis--richtig' : 'k-hinweis', role: 'status' }, meldung) : null,
      stand !== 'arbeiten' ? el('p', { class: 'k-hinweis' }, aufloesungText()) : null,
      el('div', { class: 'k-antworten' },
        stand === 'arbeiten' && gelegt
          ? el('button', { class: 'k-knopf k-knopf--neutral', 'data-kennung': 'zuruecknehmen', onclick: () => { gelegt = null; meldung = ''; reihenRender(); } }, 'Teil zurücknehmen')
          : null,
        stand === 'arbeiten'
          ? el('button', { class: 'k-knopf', 'data-kennung': 'pruefen', onclick: pruefen }, 'Reihe prüfen')
          : null,
        stand === 'arbeiten'
          ? el('button', { class: 'k-knopf k-knopf--neutral', 'data-kennung': 'aufloesung', onclick: () => { stand = 'aufloesung'; meldung = ''; reihenRender(); } }, 'Auflösung zeigen')
          : null,
        stand !== 'arbeiten'
          ? el('button', { class: 'k-knopf', 'data-kennung': 'neue-reihe', onclick: () => { aufgabenNummer += 1; aufgabe = aufgabeZuNummer(); gelegt = null; stand = 'arbeiten'; meldung = ''; reihenRender(); } }, 'Neue Reihe')
          : null,
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', 'data-kennung': 'vorlesen', 'aria-label': 'Text vorlesen', onclick: () => vorlesen(vorlesetext()) }, '🔊 Vorlesen'))),
    el('div', { class: 'k-antworten' },
      el('button', { class: 'k-knopf k-knopf--neutral', 'data-kennung': 'modus-quiz', onclick: () => zeigeModus('quiz') }, 'Zum Quiz')),
    el('footer', { class: 'k-fuss' },
      el('a', { href: 'eltern.html' }, 'Für Eltern'),
      el('a', { href: '../../impressum.html' }, 'Impressum und Datenschutz')),
  ].filter((k) => k != null));
  const ziel = merke ? reihenAnsicht.querySelector(`button[data-kennung="${merke}"]`) : null;
  (ziel ?? document.getElementById('reihen-titel')).focus();
}

// Wechsel zwischen Quiz und Reihen: die Schaltfläche, die den Wechsel auslöst, verschwindet. Deshalb geht der
// Fokus auf die Überschrift des neuen Bildschirms.
function zeigeModus(modus) {
  const reihen = modus === 'reihen';
  quizAnsicht.style.display = reihen ? 'none' : '';
  modusLeiste.style.display = reihen ? 'none' : '';
  reihenAnsicht.hidden = !reihen;
  if (reihen) {
    reihenRender();
  } else {
    const titel = quizAnsicht.querySelector('h1');
    titel.setAttribute('tabindex', '-1');
    titel.focus();
  }
}

modusLeiste.querySelector('button').addEventListener('click', () => zeigeModus('reihen'));
