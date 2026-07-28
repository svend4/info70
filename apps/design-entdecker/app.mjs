// Design-Entdecker: praktisch und schön (3-5 gemeinsam, 5-7 kurz allein).
// Warum hat die Tasse einen Henkel? Und welches Dach gefällt dir besser?
// Praleska docs/10 (Ko-Nutzung Nr. 16).
//
// Der ganze Aufbau hängt an einer Unterscheidung: Fragen nach dem Nutzen
// haben eine Antwort, Fragen nach dem Geschmack nicht. Deshalb gibt es
// hier ZWEI verschiedene Bildschirme statt eines mit einem Schalter –
// die Geschmacksfrage kann technisch gar nicht als Quiz erscheinen.
// Politik docs/02: keine externen Anfragen.
import { el, vorlesen, mischen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import {
  PRO_SESSION, waehleFragen, hatLoesung, istRichtig,
  amHausErkennbar, nichtAmHaus, pruefeDaten,
} from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const daten = await fetch('daten/design.json').then((r) => r.json());

let fragen = [];
let index = 0;

function zeige(...knoten) {
  app.replaceChildren(...[
    el('h1', { class: 'k-titel' }, '☕ Design-Entdecker'),
    el('p', { class: 'k-untertitel' }, 'Praktisch und schön – für Kind und Erwachsene.'),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · keine Namen · nichts wird gespeichert · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')),
  ].filter(Boolean));
  app.querySelector('button')?.focus();
}

function gate() {
  const intro = 'Diese App schaut ihr euch zusammen an. Ihr fragt: Wozu ist das gut? Manches könnt ihr ausprobieren. Manches haben Menschen einfach so ausgemacht. Und manches ist Geschmack – da gibt es keine richtige Antwort. Es gibt keine Punkte.';
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '🧑‍🍼🧒'),
      el('p', { style: 'font-weight:700;text-align:center;font-size:1.2em' }, 'Am besten gemeinsam.'),
      el('p', {}, 'Ihr schaut euch Alltagsdinge und Häuser an und fragt: Wozu ist das gut? Und wie ist es gebaut?'),
      el('p', {}, 'Es gibt drei Sorten von Fragen – die App sagt jedes Mal dazu, welche Sorte gerade dran ist.'),
      el('div', { class: 'k-hinweis' },
        ...Object.entries(daten.geltungTexte).map(([, text]) => el('p', { style: 'margin:0.2rem 0' }, text))),
      el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => vorlesen(intro) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '👪 Wir sind zusammen – los!'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => hausBildschirm(0) }, '🏠 Nur die Häuser anschauen'))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin:0' }, `👉 Höchstens ${PRO_SESSION} Fragen, danach noch die vier Häuser – dann ist Schluss.`)));
}

function starteRunde() {
  fragen = waehleFragen(daten.fragen);
  index = 0;
  frageBildschirm();
}

function kopfZeile(f) {
  return [
    el('p', { class: 'k-untertitel' }, `Frage ${index + 1} von ${fragen.length}`),
    el('div', {
      class: 'k-fortschritt', role: 'progressbar',
      'aria-valuemin': '0', 'aria-valuemax': String(fragen.length), 'aria-valuenow': String(index),
    }, el('div', { style: `width:${(index / fragen.length) * 100}%` })),
    // Die Sorte der Frage steht IMMER dabei, vor der Antwort.
    el('p', {
      class: 'k-hinweis',
      style: 'text-align:center;font-weight:700;margin:0.4rem 0',
    }, daten.geltungTexte[f.geltung]),
    el('p', { class: 'k-gross', role: 'img', 'aria-label': f.frage }, f.emoji),
    el('p', { style: 'font-weight:700;font-size:1.25em;text-align:center' }, f.frage),
  ];
}

function frageBildschirm() {
  const f = fragen[index];
  return hatLoesung(f) ? raetselFrage(f) : geschmacksFrage(f);
}

// Bildschirm mit Lösung: prüfbar oder ausgemacht.
// Es wird genau EINMAL gemischt: Knöpfe und Vorlesetext müssen dieselbe
// Reihenfolge haben. Für ein Kind, das nicht liest, IST der Vorlesetext
// die Aufgabe – läse die App die Daten roh vor, käme die Lösung dort
// immer zuerst.
function raetselFrage(f) {
  const optionen = mischen(f.optionen);
  zeige(
    el('section', { class: 'k-karte' },
      ...kopfZeile(f),
      el('button', {
        class: 'k-knopf k-knopf--neutral',
        onclick: () => vorlesen(`${f.frage} ${optionen.map((o) => o.text).join('? Oder: ')}?`),
      }, '🔊 Frage vorlesen'),
      el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Antwort wählen' },
        ...optionen.map((o) => el('button', {
          class: 'k-knopf k-knopf--neutral',
          style: 'min-height:4rem',
          onclick: () => waehle(f, o),
        }, o.text)))));
}

// Bildschirm ohne Lösung: Geschmack. Kein Häkchen, kein Kreuz, keine
// Zählung – und diese Funktion kennt gar keinen Begriff von „richtig“.
function geschmacksFrage(f) {
  zeige(
    el('section', { class: 'k-karte' },
      ...kopfZeile(f),
      el('p', { style: 'text-align:center;margin:0' }, 'Hier gibt es nichts zu treffen. Sag einfach, was du magst.'),
      el('button', {
        class: 'k-knopf k-knopf--neutral',
        onclick: () => vorlesen(`${f.frage} Hier gibt es keine richtige Antwort.`),
      }, '🔊 Frage vorlesen'),
      el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Deine Wahl' },
        ...f.optionen.map((o) => el('button', {
          class: 'k-knopf k-knopf--neutral',
          style: 'min-height:4rem',
          onclick: () => geschmackAngenommen(f),
        }, o.text)))));
}

function letzteFrage() {
  return index + 1 >= fragen.length;
}

function abschlussKnoepfe() {
  return el('div', { class: 'k-antworten' },
    el('button', { class: 'k-knopf', onclick: weiter }, letzteFrage() ? 'Fertig 🏁' : 'Weiter ➡️'));
}

function erwachsenenKarte(f) {
  return el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
    el('p', { style: 'font-weight:700;margin-top:0' }, '👪 Für Erwachsene – redet zusammen:'),
    el('p', { style: 'margin-bottom:0' }, f.gespraech));
}

function waehle(f, gewaehlt) {
  const richtig = istRichtig(f, gewaehlt);
  const kopf = richtig ? '🌟 Ja, genau!' : '🔎 Schau mal:';
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, richtig ? '🌟' : '🔎'),
      el('div', { class: `k-hinweis${richtig ? ' k-hinweis--richtig' : ''}` },
        el('p', { style: 'font-weight:700;margin-top:0' }, kopf),
        el('p', { style: 'margin-bottom:0' }, f.antwortText)),
      // Ein Ding erfüllt mehrere Anforderungen zugleich. „Der Grund“ wäre
      // gelogen – deshalb stehen hier immer mindestens zwei.
      f.gruende
        ? el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
          el('p', { style: 'font-weight:700;margin-top:0' }, 'Ein Grund ist … und noch einer ist …'),
          el('ul', { style: 'margin:0;padding-left:1.2rem' }, ...f.gruende.map((g) => el('li', {}, g))))
        : null,
      f.grenze
        ? el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
          el('p', { style: 'font-weight:700;margin-top:0' }, '⚖️ Und was kann es schlecht?'),
          el('p', { style: 'margin-bottom:0' }, f.grenze))
        : null,
      f.gegenbeispiel
        ? el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
          el('p', { style: 'font-weight:700;margin-top:0' }, '⚠️ Das ist nicht immer so:'),
          el('p', { style: 'margin-bottom:0' }, f.gegenbeispiel))
        : null,
      f.probe
        ? el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
          el('p', { style: 'font-weight:700;margin-top:0' }, '🔬 Probiert es aus:'),
          el('p', { style: 'margin:0' }, f.probe),
          f.maxGrad ? el('p', { style: 'margin:0.2rem 0' }, `👉 Nur handwarmes Wasser, höchstens ${f.maxGrad} Grad. Kein heißes Wasser, kein Herd.`) : null,
          el('p', { style: 'margin:0.2rem 0' }, `Ihr solltet merken: ${f.erwartet}`),
          el('p', { style: 'margin-bottom:0' }, f.wennAnders))
        : null,
      f.geltungsbereich
        ? el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
          el('p', { style: 'font-weight:700;margin-top:0' }, '👪 Wo gilt das?'),
          el('p', { style: 'margin-bottom:0' }, f.geltungsbereich))
        : null,
      erwachsenenKarte(f),
      el('button', {
        class: 'k-knopf k-knopf--neutral',
        onclick: () => vorlesen(`${kopf} ${f.antwortText} ${(f.gruende ?? []).join(' ')} ${f.probe ?? ''}`),
      }, '🔊 Vorlesen'),
      abschlussKnoepfe()));
}

function geschmackAngenommen(f) {
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '💛'),
      el('div', { class: 'k-hinweis' },
        el('p', { style: 'font-weight:700;margin-top:0' }, '💛 Danke – das ist deine Antwort.'),
        el('p', { style: 'margin-bottom:0' }, 'Hier gibt es nichts Richtiges. Andere Menschen mögen etwas anderes, und das ist genauso in Ordnung. Diese App zählt das nicht mit.')),
      erwachsenenKarte(f),
      el('button', {
        class: 'k-knopf k-knopf--neutral',
        onclick: () => vorlesen(`Danke, das ist deine Antwort. Hier gibt es nichts Richtiges. ${f.gespraech}`),
      }, '🔊 Vorlesen'),
      abschlussKnoepfe()));
}

function weiter() {
  index++;
  if (index < fragen.length) frageBildschirm();
  else hausBildschirm(0);
}

// --------------------------------------------------------------- Häuser
function hausBildschirm(nr) {
  const liste = amHausErkennbar(daten.gebaeude);
  const g = liste[nr];
  const letztes = nr + 1 >= liste.length;
  const frage = `Woran erkennst du: ${g.name}?`;
  // Einmal mischen für Knöpfe UND Vorlesetext – siehe raetselFrage.
  const optionen = mischen(g.optionen);
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-untertitel' }, `Haus ${nr + 1} von ${liste.length}`),
      el('p', { class: 'k-gross', role: 'img', 'aria-label': g.name }, g.emoji),
      el('p', { style: 'font-weight:700;font-size:1.25em;text-align:center' }, frage),
      el('button', {
        class: 'k-knopf k-knopf--neutral',
        onclick: () => vorlesen(`${frage} ${optionen.map((o) => o.text).join('? Oder: ')}?`),
      }, '🔊 Frage vorlesen'),
      el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Antwort wählen' },
        ...optionen.map((o) => el('button', {
          class: 'k-knopf k-knopf--neutral',
          style: 'min-height:4rem',
          onclick: () => hausAntwort(g, o, nr, letztes),
        }, o.text)))));
}

function hausAntwort(g, gewaehlt, nr, letztes) {
  const richtig = Boolean(gewaehlt.richtig);
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross', role: 'img', 'aria-label': g.name }, g.emoji),
      el('div', { class: `k-hinweis${richtig ? ' k-hinweis--richtig' : ''}` },
        el('p', { style: 'font-weight:700;margin-top:0' }, richtig ? '🌟 Ja, genau!' : '🔎 Schau mal:'),
        el('p', { style: 'margin-bottom:0' }, g.merkmal)),
      el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
        el('p', { style: 'font-weight:700;margin-top:0' }, '⚠️ Das ist nicht immer so:'),
        el('p', { style: 'margin-bottom:0' }, g.gegenbeispiel)),
      g.vertiefung
        ? el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
          el('p', { style: 'margin:0' }, `💡 ${g.vertiefung}`))
        : null,
      g.suchauftrag
        ? el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
          el('p', { style: 'margin:0' }, `🔎 ${g.suchauftrag}`))
        : null,
      erwachsenenKarte(g),
      el('button', {
        class: 'k-knopf k-knopf--neutral',
        onclick: () => vorlesen(`${g.merkmal} ${g.gegenbeispiel} ${g.vertiefung ?? ''}`),
      }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: () => (letztes ? grenzBildschirm() : hausBildschirm(nr + 1)) },
          letztes ? 'Weiter ➡️' : 'Nächstes Haus ➡️'))));
}

// Die Grenze des Formwissens – ausdrücklich gezeigt, nie abgefragt.
function grenzBildschirm() {
  const liste = nichtAmHaus(daten.gebaeude);
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '🤔'),
      el('p', { style: 'font-weight:700;font-size:1.2em;text-align:center' }, 'Und das hier sieht man dem Haus NICHT an:'),
      ...liste.map((g) => el('div', { style: 'margin:0.8rem 0;padding-top:0.6rem;border-top:1px solid var(--k-rand)' },
        el('p', { style: 'font-weight:700;margin:0' }, `${g.emoji} ${g.name}`),
        el('p', { style: 'margin:0.2rem 0' }, g.warumNicht),
        el('p', { style: 'margin:0' }, `👀 Erkennen kann man es an: ${g.merkmal}`),
        el('p', { style: 'margin:0.2rem 0 0;font-size:0.95em' }, `👪 ${g.gespraech}`))),
      el('button', {
        class: 'k-knopf k-knopf--neutral',
        onclick: () => vorlesen(liste.map((g) => `${g.name}. ${g.warumNicht}`).join(' ')),
      }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: schluss }, 'Weiter ➡️'))));
}

function schluss() {
  const ideen = daten.schlussIdeen;
  const text = `Bildschirm aus – jetzt schaut ihr selbst! ${ideen.join(' ')}`;
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '👀'),
      el('p', { style: 'font-weight:700;font-size:1.3em;text-align:center;margin-bottom:0' }, 'Bildschirm aus –'),
      el('p', { style: 'font-weight:700;font-size:1.3em;text-align:center;margin-top:0' }, 'jetzt schaut ihr selbst!'),
      el('p', { style: 'text-align:center' }, 'Drei Ideen für euch beide:'),
      el('ul', {}, ...ideen.map((i) => el('li', { style: 'margin-bottom:0.5rem' }, i))),
      el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => vorlesen(text) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '🔁 Noch einmal'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => hausBildschirm(0) }, '🏠 Häuser anschauen'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: gate }, '🏡 Zum Start'))));
}

const fehler = pruefeDaten(daten);
if (fehler.length) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' }, el('p', { style: 'margin:0' }, `Datenfehler: ${fehler[0]}`)));
} else {
  gate();
}
