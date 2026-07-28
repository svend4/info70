// Grammatik-Zwerge (4-6, NUR gemeinsam mit einem Erwachsenen):
// Ortswörter, Mehrzahl und zusammengesetzte Wörter.
// Praleska docs/10 (Ko-Nutzung Nr. 14).
//
// Ko-Nutzungs-Design: Erwachsenen-Gate, höchstens PRO_SESSION Aufgaben,
// danach zwingend Schluss. Keine Punkte, kein Rekord, nichts gespeichert.
// Politik docs/02: keine externen Anfragen.
//
// Die Szenen werden GEZEICHNET (Rahmen + Fläche), nicht mit einem Emoji
// dargestellt. Zwei Emoji nebeneinander zeigen nur links und rechts –
// „in“ und „auf“ wären damit nicht auseinanderzuhalten, und die Zeichnung
// eines Emoji sieht je nach Gerät anders aus.
import { el, vorlesen, mischen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import {
  PRO_SESSION, PRAEPOSITIONEN, waehleAufgaben, istRichtig, istFastRichtig,
  ortsangabe, ortsSatz, pruefeDaten,
} from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const daten = await fetch('daten/grammatik.json').then((r) => r.json());

let aufgaben = [];
let index = 0;

function zeige(...knoten) {
  app.replaceChildren(...[
    el('h1', { class: 'k-titel' }, '🧩 Grammatik-Zwerge'),
    el('p', { class: 'k-untertitel' }, 'Für Kind und Erwachsene – zusammen.'),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · keine Namen · nichts wird gespeichert · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')),
  ].filter(Boolean));
  app.querySelector('button')?.focus();
}

function gate() {
  const intro = 'Diese App spielt ihr zusammen: ein Kind und ein Erwachsener. Ihr sucht Ortswörter, sagt, wie viele heißt, und setzt zwei Wörter zu einem zusammen. Es gibt keine Punkte.';
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '🧑‍🍼🧒'),
      el('p', { style: 'font-weight:700;text-align:center;font-size:1.2em' }, 'Bitte gemeinsam spielen.'),
      el('p', {}, 'Diese App ist für ein Kind UND einen Erwachsenen zusammen. Der Erwachsene liest vor.'),
      el('p', {}, 'Drei Spiele: Wo ist es? Wie heißt es bei vielen? Und: zwei Wörter werden eins.'),
      el('p', {}, 'Es gibt keine Punkte. Nach jeder Aufgabe redet ihr miteinander.'),
      el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => vorlesen(intro) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '👪 Ein Erwachsener ist dabei – los!'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: regelBildschirm }, '📖 Was gilt hier immer?'))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin:0' }, `👉 Höchstens ${PRO_SESSION} Aufgaben – danach spielt ihr ohne Bildschirm weiter.`)));
}

// Jede Regel steht hier zusammen mit ihrer Grenze. Eine Regel ohne ihre
// Grenze wäre für ein Kind bequemer und für den Erwachsenen falsch.
function regelBildschirm() {
  zeige(
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0' }, '📖 Was gilt hier immer?'),
      ...daten.regeln.map((r) => el('div', { style: 'margin:0.8rem 0;padding-top:0.6rem;border-top:1px solid var(--k-rand)' },
        el('p', { style: 'font-weight:700;margin:0' }, r.text),
        el('p', { style: 'margin:0.3rem 0 0;font-size:0.95em' }, `👪 Grenze der Regel: ${r.gilt}`))),
      el('button', {
        class: 'k-knopf k-knopf--neutral',
        onclick: () => vorlesen(daten.regeln.map((r) => r.text).join(' ')),
      }, '🔊 Vorlesen')),
    el('section', { class: 'k-karte' },
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '▶️ Losspielen'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: gate }, '🏠 Zum Start'))));
}

function starteRunde() {
  aufgaben = waehleAufgaben(daten.aufgaben);
  index = 0;
  frageBildschirm();
}

// ---------------------------------------------------------------- Szene
const KASTEN = 'width:4.5rem;height:3.2rem;border:3px solid var(--k-blau-dunkel);border-radius:0.4rem;background:var(--k-papier);display:flex;align-items:center;justify-content:center';

function dingSpan(a, groesse = '2rem') {
  return el('span', { style: `font-size:${groesse};line-height:1`, role: 'img', 'aria-label': a.ding.nomen }, a.ding.emoji);
}

function kasten(inhalt = null) {
  return el('div', { style: KASTEN }, inhalt);
}

/** Zeichnet die Szene. Der Kasten ist das Bezugsding, das Emoji das Ding. */
function szene(a) {
  const beschriftung = el('p', { style: 'text-align:center;margin:0.4rem 0 0;font-weight:700' },
    `${a.ding.artikel} ${a.ding.nomen} und ${a.relatum.mehrzahl ? `zwei ${a.relatum.plural}` : `${a.relatum.artikel} ${a.relatum.nomen}`}`);
  const mitte = 'display:flex;flex-direction:column;align-items:center;gap:0';
  let bild;
  if (a.praeposition === 'auf') {
    bild = el('div', { style: mitte }, dingSpan(a), kasten());
  } else if (a.praeposition === 'unter') {
    bild = el('div', { style: mitte }, kasten(), dingSpan(a));
  } else if (a.praeposition === 'in') {
    bild = el('div', { style: mitte }, kasten(dingSpan(a, '1.6rem')));
  } else if (a.praeposition === 'neben') {
    bild = el('div', { style: 'display:flex;align-items:flex-end;justify-content:center;gap:0.4rem' }, kasten(), dingSpan(a));
  } else {
    bild = el('div', { style: 'display:flex;align-items:flex-end;justify-content:center;gap:0.4rem' }, kasten(), dingSpan(a), kasten());
  }
  return el('div', {
    role: 'img',
    'aria-label': `Bild: ${ortsSatz(a)}`,
    style: 'display:flex;flex-direction:column;align-items:center;padding:0.8rem 0',
  }, bild, beschriftung);
}

// ---------------------------------------------------------------- Fragen
function kopfZeile(text) {
  return [
    el('p', { class: 'k-untertitel' }, `Aufgabe ${index + 1} von ${aufgaben.length}`),
    el('div', {
      class: 'k-fortschritt', role: 'progressbar',
      'aria-valuemin': '0', 'aria-valuemax': String(aufgaben.length), 'aria-valuenow': String(index),
    }, el('div', { style: `width:${(index / aufgaben.length) * 100}%` })),
    el('p', { style: 'font-weight:700;font-size:1.3em;text-align:center' }, text),
  ];
}

function antwortKnopf(beschriftung, beiKlick, ariaLabel = null) {
  return el('button', {
    class: 'k-knopf k-knopf--neutral',
    style: 'min-height:3.6rem',
    'aria-label': ariaLabel,
    onclick: beiKlick,
  }, beschriftung);
}

function frageBildschirm() {
  const a = aufgaben[index];
  if (a.typ === 'praeposition') return ortsFrage(a);
  if (a.typ === 'plural') return mehrzahlFrage(a);
  return wortFrage(a);
}

// WICHTIG: Es wird genau EINMAL gemischt, und dieselbe Reihenfolge trägt
// Knöpfe und Vorlesetext. Läse die App die Daten roh vor, während die
// Knöpfe gemischt sind, käme die Lösung im Vorlesetext immer zuerst –
// und für ein Kind, das nicht liest, IST der Vorlesetext die Aufgabe.

function ortsFrage(a) {
  const frage = `Wo ist ${a.ding.artikel.toLowerCase()} ${a.ding.nomen}?`;
  // Es stehen IMMER alle fünf Ortswörter zur Wahl. Eine Vorauswahl wäre
  // schon die halbe Antwort.
  const optionen = mischen(PRAEPOSITIONEN);
  zeige(
    el('section', { class: 'k-karte' },
      ...kopfZeile(frage),
      szene(a),
      el('button', {
        class: 'k-knopf k-knopf--neutral',
        onclick: () => vorlesen(`${frage} ${optionen.join('? ')}?`),
      }, '🔊 Frage vorlesen'),
      el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Ortswort wählen' },
        ...optionen.map((p) => antwortKnopf(p, () => waehle(a, p))))));
}

function mehrzahlFrage(a) {
  const frage = `${gross(a.artikel)} ${a.singular} – viele …?`;
  const optionen = mischen(a.optionen);
  zeige(
    el('section', { class: 'k-karte' },
      ...kopfZeile(frage),
      el('p', { class: 'k-gross', role: 'img', 'aria-label': `drei Mal ${a.singular}` }, `${a.emoji}${a.emoji}${a.emoji}`),
      el('p', { style: 'text-align:center;margin:0' }, `Einer heißt: ${a.artikel} ${a.singular}. Und viele?`),
      el('button', {
        class: 'k-knopf k-knopf--neutral',
        onclick: () => vorlesen(`${frage} ${optionen.map((o) => `die ${o.text}`).join('? Oder: ')}?`),
      }, '🔊 Frage vorlesen'),
      el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Mehrzahl wählen' },
        ...optionen.map((o) => antwortKnopf(`die ${o.text}`, () => waehle(a, o))))));
}

function wortFrage(a) {
  const frage = `${a.teil1} und ${a.teil2} – wie heißt das zusammen?`;
  const optionen = mischen(a.optionen);
  zeige(
    el('section', { class: 'k-karte' },
      ...kopfZeile(frage),
      el('p', { class: 'k-gross', role: 'img', 'aria-label': `${a.teil1} und ${a.teil2}` }, `${a.emoji1} ➕ ${a.emoji2}`),
      el('button', {
        class: 'k-knopf k-knopf--neutral',
        onclick: () => vorlesen(`${frage} ${optionen.map((o) => o.text).join('? Oder: ')}?`),
      }, '🔊 Frage vorlesen'),
      el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Wort wählen' },
        ...optionen.map((o) => antwortKnopf(o.text, () => waehle(a, o))))));
}

function gross(wort) {
  return wort.charAt(0).toUpperCase() + wort.slice(1);
}

// --------------------------------------------------------------- Antwort
function loesungsText(a) {
  if (a.typ === 'praeposition') return `${ortsangabe(a)}. ${ortsSatz(a)}`;
  if (a.typ === 'plural') return `${a.artikel} ${a.singular} – die ${a.plural}.`;
  return `${a.genus} ${a.wort}. ${a.istEin}`;
}

function waehle(a, antwort) {
  const richtig = istRichtig(a, antwort);
  // Eine regelhaft gedachte Mehrzahl ist kein Fehler, sondern ein
  // Denkschritt. Sie bekommt deshalb keinen roten Kasten, sondern ein Lob.
  const fast = istFastRichtig(a, antwort);
  const kopf = richtig ? '🌟 Ja, genau!' : fast ? '👍 Fast – gut gedacht!' : '🔎 Schau mal:';
  const satz = richtig
    ? a.erklaerung
    : fast
      ? (a.nachvollziehbarText
        ? `${a.nachvollziehbarText} ${loesungsText(a)}`
        : `Du hast dir eine Regel überlegt, und die gibt es wirklich. Bei diesem Wort sagt man aber: ${loesungsText(a)}`)
      : `${loesungsText(a)} ${a.erklaerung}`;
  const letzte = index + 1 >= aufgaben.length;
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, richtig ? '🌟' : fast ? '👍' : '🔎'),
      el('div', { class: `k-hinweis${richtig ? ' k-hinweis--richtig' : ''}` },
        el('p', { style: 'font-weight:700;margin-top:0' }, kopf),
        el('p', { style: 'margin-bottom:0' }, satz)),
      a.typ === 'kompositum' && a.fuge
        ? el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
          el('p', { style: 'font-weight:700;margin-top:0' }, '⚠️ Hier stimmt „Wort + Wort“ nicht ganz:'),
          el('p', { style: 'margin-bottom:0' }, `Zwischen ${a.teil1} und ${a.teil2} rutscht noch ein ${a.fuge} dazwischen. Das kann man nicht ausrechnen – das merkt man sich.`))
        : null,
      el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
        el('p', { style: 'font-weight:700;margin-top:0' }, '👪 Für Erwachsene – redet zusammen:'),
        el('p', { style: 'margin-bottom:0' }, a.gespraech)),
      el('button', {
        class: 'k-knopf k-knopf--neutral',
        onclick: () => vorlesen(`${kopf} ${satz} Für Erwachsene: ${a.gespraech}`),
      }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: weiter }, letzte ? 'Fertig 🏁' : 'Weiter ➡️'))));
}

function weiter() {
  index++;
  if (index < aufgaben.length) frageBildschirm();
  else schluss();
}

function schluss() {
  const ideen = daten.schlussIdeen;
  const text = `Bildschirm aus – jetzt spielt ihr selbst! ${ideen.join(' ')}`;
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '🗣️'),
      el('p', { style: 'font-weight:700;font-size:1.3em;text-align:center;margin-bottom:0' }, 'Bildschirm aus –'),
      el('p', { style: 'font-weight:700;font-size:1.3em;text-align:center;margin-top:0' }, 'jetzt spielt ihr selbst!'),
      el('p', { style: 'text-align:center' }, 'Drei Ideen für euch beide:'),
      el('ul', {}, ...ideen.map((i) => el('li', { style: 'margin-bottom:0.5rem' }, i))),
      el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => vorlesen(text) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '🔁 Noch einmal'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: regelBildschirm }, '📖 Die Regeln ansehen'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: gate }, '🏠 Zum Start'))));
}

const fehler = pruefeDaten(daten);
if (fehler.length) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' }, el('p', { style: 'margin:0' }, `Datenfehler: ${fehler[0]}`)));
} else {
  gate();
}
