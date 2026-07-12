// Gemeinsam gesund essen: Bild-Entscheidungsspiel zu Essen, Trinken und
// Bewegung fuer 3-5 Jahre - AUSSCHLIESSLICH zur gemeinsamen Nutzung von Kind
// UND Erwachsenem (Ko-Nutzung). Konzept aus dem Praleska-Baukasten (docs/10):
// gesunde Alltagsgewohnheiten im Vorschulalter - alle Szenen, Fragen und
// Gespraechsimpulse sind neu formuliert.
//
// Bewusst OHNE richtig/falsch, ohne Punkte, ohne Ranking, ohne Kind-Vergleich
// (AI Act: Beobachtung, keine Diagnose). Nach JEDER Wahl gibt es KEINE Wertung,
// sondern einen Gespraechsimpuls fuer den Erwachsenen - beide getippten Emojis
// fuehren zum selben Impuls. Hoechstens PRO_SESSION (6) Bilder pro Sitzung,
// danach ZWINGEND Schluss: Bildschirm aus, ab in die Kueche.
// NICHTS wird gespeichert (kein localStorage). Politik docs/02: keine externen
// Anfragen (CSP default-src 'self' + Netzwerk-Waechter).
import { el, vorlesen, mischen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { PRO_SESSION, waehleSzenen } from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const daten = await fetch('daten/szenen.json').then((r) => r.json());

let szenen = [];
let index = 0;

function zeige(...knoten) {
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🍎 Gemeinsam gesund essen'),
    el('p', { class: 'k-untertitel' }, 'Für Kind und Erwachsene – zusammen.'),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · keine Namen · nichts wird gespeichert · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
  app.querySelector('button')?.focus();
}

// Erwachsenen-Gate: Start nur nach ausdrücklicher Bestätigung, dass ein
// Erwachsener mitspielt. Diese App ist reine Ko-Nutzung.
function gateBildschirm() {
  const intro = 'Diese App spielt ihr zusammen: ein Kind und ein Erwachsener. Ihr schaut kleine Bilder an und redet danach miteinander. Es gibt keine Fehler und keine Punkte.';
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '🧑‍🍼🧒'),
      el('p', { style: 'font-weight:700;text-align:center;font-size:1.2em' }, 'Bitte gemeinsam spielen.'),
      el('p', {}, 'Diese App ist für ein Kind UND einen Erwachsenen zusammen.'),
      el('p', {}, 'Ihr schaut kleine Bilder an. Danach redet ihr miteinander.'),
      el('p', {}, 'Es gibt keine Fehler und keine Punkte.'),
      el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => vorlesen(intro) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '👪 Ein Erwachsener ist dabei – los!'))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin:0' }, `👉 Höchstens ${PRO_SESSION} Bilder – danach geht es gemeinsam in die Küche.`)));
}

function starteRunde() {
  szenen = waehleSzenen(daten.szenen);
  index = 0;
  szeneBildschirm();
}

function szeneBildschirm() {
  const s = szenen[index];
  const optionen = mischen(s.optionen);
  const vorleseText = `${s.frage} ${optionen.map((o) => o.text).join(' oder ')}?`;
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-untertitel' }, `Bild ${index + 1} von ${szenen.length}`),
      el('div', { class: 'k-fortschritt', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': szenen.length, 'aria-valuenow': index },
        el('div', { style: `width:${(index / szenen.length) * 100}%` })),
      el('p', { style: 'font-weight:700;font-size:1.4em;text-align:center' }, s.frage),
      el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => vorlesen(vorleseText) }, '🔊 Frage vorlesen'),
      el('div', { class: 'k-antworten' },
        ...optionen.map((o) =>
          el('button', {
            class: 'k-knopf k-knopf--neutral',
            style: 'min-height:6rem',
            'aria-label': o.text,
            onclick: () => waehle(s),
          },
            el('span', { style: 'font-size:2.8em;display:block;line-height:1.1' }, o.emoji),
            el('span', {}, o.text))))));
}

// Nach der Wahl: KEIN richtig/falsch, sondern ein Gespraechsimpuls fuer den
// Erwachsenen. Egal welches Emoji das Kind getippt hat.
function waehle(s) {
  const vorleseText = `Für Erwachsene. ${s.gespraech}`;
  const letzte = index + 1 >= szenen.length;
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '💬'),
      el('div', { class: 'k-hinweis' },
        el('p', { style: 'font-weight:700;margin-top:0' }, '👪 Für Erwachsene – redet zusammen:'),
        el('p', { style: 'margin-bottom:0' }, s.gespraech)),
      el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => vorlesen(vorleseText) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: weiter }, letzte ? 'Fertig 🏁' : 'Weiter ➡️'))));
}

function weiter() {
  index++;
  if (index < szenen.length) szeneBildschirm();
  else endBildschirm();
}

// Zwingender Schluss nach PRO_SESSION Bildern: Bildschirm aus, ab in die Kueche.
function endBildschirm() {
  const ideen = daten.kuecheIdeen;
  const schluss = `Bildschirm aus – jetzt gemeinsam in die Küche! ${ideen.join(' ')}`;
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '🍳'),
      el('p', { style: 'font-weight:700;font-size:1.3em;text-align:center' }, 'Bildschirm aus –'),
      el('p', { style: 'font-weight:700;font-size:1.3em;text-align:center;margin-top:0' }, 'jetzt gemeinsam in die Küche!'),
      el('p', { style: 'text-align:center' }, '3 Ideen für euch beide:'),
      el('ul', {}, ...ideen.map((i) => el('li', { style: 'margin-bottom:0.5rem' }, i))),
      el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => vorlesen(schluss) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '🔁 Noch einmal'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: gateBildschirm }, '🏠 Zum Start'))));
}

gateBildschirm();
