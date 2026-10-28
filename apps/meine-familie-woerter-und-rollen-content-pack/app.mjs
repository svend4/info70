// Meine Familie: Wörter und Rollen. Karten für Kinder von 3 bis 5 Jahren, nur gemeinsam mit einer
// erwachsenen Person. Vier Themen (Rollen, Haushalt, Höflichkeit, Familienbudget): je Thema eine
// Reihe von höchstens sechs Karten zum Vorlesen. Dazu eine Runde Fragen zu den Rollen mit zwei
// Antworten und einer Erklärung danach. Nach jeder Reihe und jeder Runde kommt die Pause
// „Bildschirm aus“. Die Sitzungsgrenze steht im Ablauf: Die Runde Fragen beginnt nur auf dem
// Startbildschirm, nie mitten in einer Reihe; von einer Karte führt nur „Fertig“ in die Pause, aus
// der Pause nur „Zum Start“ (test/regeln.test.mjs prüft die Wege). Die Erwachsenen können einzelne
// Karten drucken: eine Karte je Blatt A4 hoch, ohne Namenszeile und ohne Seitenzahl. Es gibt keine
// Eingabefelder, keine Wertung, keine Speicherung und keine Verbindung nach draußen. Die Karten
// kommen per JSON-Import.
import { el, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import rollenDatei from './daten/rollen.json' with { type: 'json' };
import haushaltDatei from './daten/haushalt.json' with { type: 'json' };
import hoeflichkeitDatei from './daten/hoeflichkeit.json' with { type: 'json' };
import budgetDatei from './daten/budget.json' with { type: 'json' };
import texte from './daten/texte.json' with { type: 'json' };
import {
  FRAGEN_PRO_RUNDE, alleKartenIds, beantworteQuizFrage, druckeKarte, erzeugeRunde, findeKarte, findeModul,
  fragenAnzahlText, gewaehlteKarten, kannDrucken, kartenPosition, ladeModule, quellenText, rueckmeldungText,
  startZeilen, umschalten, vorlesetextAntwort, vorlesetextFrage, vorlesetextKarte, vorlesetextPause,
  vorlesetextStart, waehleAlle,
} from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
// Der einzige Zufall der App steht in dieser Datei; logik.mjs bekommt ihn als Parameter.
const zufall = () => Math.random();

let alleModule = [];
let bildschirm = { name: 'start' };
let runde = [];
let auswahl = new Set();
let neuerBildschirm = false;

// Ein Knopf. Die Kennung ist eindeutig je Bildschirm, damit der Fokus nach dem Neuaufbau zurückkehrt
// (bleibt der Knopf) oder auf die Überschrift des neuen Bildschirms geht (wechselt der Bildschirm).
function knopf(kennung, inhalt, aktion, klasse = 'k-knopf', extra = {}) {
  return el('button', { class: klasse, 'data-kennung': kennung, onclick: aktion, ...extra }, ...[inhalt].flat());
}

// Das Vorlesen läuft über kinder-ui; der Text kommt erst beim Klick, ohne den Bildschirm neu zu zeichnen.
function vorlesenKnopf(kennung, textFuerKlick) {
  return el('div', { class: 'k-antworten' },
    knopf(kennung, 'Vorlesen', () => vorlesen(textFuerKlick()), 'k-knopf k-knopf--neutral'));
}

function gehe(neu) {
  bildschirm = neu;
  neuerBildschirm = true;
  render();
}

const zumStart = () => gehe({ name: 'start' });

// Russische Zitate in „…“ bekommen lang="ru", damit Vorleseprogramme sie mit der passenden Sprache lesen.
function mitSprache(text) {
  const teile = [];
  let rest = text;
  for (let treffer = rest.match(/„[^„“]*\p{Script=Cyrillic}[^„“]*“/u); treffer; treffer = rest.match(/„[^„“]*\p{Script=Cyrillic}[^„“]*“/u)) {
    if (treffer.index > 0) teile.push(rest.slice(0, treffer.index));
    teile.push(el('span', { lang: 'ru' }, treffer[0]));
    rest = rest.slice(treffer.index + treffer[0].length);
  }
  if (rest) teile.push(rest);
  return teile;
}

function quelle(karte, art = 'Karte') {
  return el('p', { class: 'mfw-quelle' }, ...mitSprache(quellenText(karte, texte.seitenmarke, art)));
}

function fuss() {
  return el('footer', { class: 'k-fuss' },
    el('p', {}, 'Nur gemeinsam mit einer erwachsenen Person. Werbefrei, ohne Anmeldung, nichts wird gespeichert.'),
    el('a', { href: '../../impressum.html' }, 'Impressum und Datenschutz'));
}

function ueberschrift(text, klasse = 'k-titel') {
  return el('h1', { class: klasse, tabindex: '-1' }, text);
}

// ---------------------------------------------------------------- Bildschirme

function startBildschirm() {
  return [
    ueberschrift(texte.titel),
    el('p', { class: 'k-untertitel' }, texte.untertitel),
    el('section', { class: 'k-karte' },
      el('p', { class: 'mfw-text' }, texte.start.intro),
      el('p', { class: 'mfw-klein' }, texte.start.grenze),
      vorlesenKnopf('vorlesen-start', () => vorlesetextStart(alleModule, texte))),
    el('section', { class: 'k-karte', 'aria-labelledby': 'wahl-titel' },
      el('h2', { id: 'wahl-titel', class: 'mfw-zwischentitel' }, texte.start.wahl),
      el('div', { class: 'k-antworten' },
        ...startZeilen(alleModule).map((z) => knopf(`modul-${z.id}`,
          [el('span', { class: 'mfw-modulname' }, z.titel), ' ', el('span', { class: 'mfw-modulzahl' }, z.anzahlText)],
          () => gehe({ name: 'karte', modul: z.id, index: 0 }),
          `k-knopf k-knopf--neutral mfw-modul mfw-modul-${z.id}`)),
        // Die Runde Fragen beginnt nur hier. Auf den Karten gibt es keinen Knopf dorthin: von einer Karte führt nur „Fertig“ in die Pause.
        knopf('fragen-starten',
          [el('span', { class: 'mfw-modulname' }, texte.start.fragen), ' ', el('span', { class: 'mfw-modulzahl' }, fragenAnzahlText(FRAGEN_PRO_RUNDE))],
          starteRunde,
          'k-knopf k-knopf--neutral mfw-modul mfw-modul-rollen'))),
    el('section', { class: 'k-karte', 'aria-labelledby': 'erwachsene-titel' },
      el('h2', { id: 'erwachsene-titel', class: 'mfw-zwischentitel' }, 'Für Erwachsene'),
      el('div', { class: 'k-antworten' },
        knopf('druck-oeffnen', 'Karten drucken', () => gehe({ name: 'druck' }), 'k-knopf k-knopf--neutral'),
        knopf('hinweise-oeffnen', 'Hinweise für Erwachsene', () => gehe({ name: 'hinweise' }), 'k-knopf k-knopf--neutral'))),
  ];
}

function starteRunde() {
  runde = erzeugeRunde(findeModul(alleModule, 'rollen').karten, zufall);
  gehe({ name: 'frage', index: 0 });
}

function karteBildschirm({ modul: modulId, index }) {
  const modul = findeModul(alleModule, modulId);
  const karte = modul.karten[index];
  const pos = kartenPosition(modul, index);
  return [
    el('p', { class: 'mfw-kopf' }, `${modul.titel}, Karte ${pos.nummer} von ${pos.gesamt}`),
    ueberschrift(karte.titel),
    el('section', { class: `k-karte mfw-modul-${modulId}` },
      el('p', { class: 'mfw-satz' }, karte.erklaerung),
      vorlesenKnopf(`vorlesen-${karte.id}`, () => vorlesetextKarte(karte))),
    el('div', { class: 'mfw-reihe' },
      pos.erste ? null : knopf(`zurueck-${karte.id}`, 'Zurück', () => gehe({ name: 'karte', modul: modulId, index: index - 1 }), 'k-knopf k-knopf--neutral'),
      pos.letzte
        ? knopf(`fertig-${karte.id}`, 'Fertig', () => gehe({ name: 'pause', modul: modulId, art: 'karten' }))
        : knopf(`weiter-${karte.id}`, 'Weiter', () => gehe({ name: 'karte', modul: modulId, index: index + 1 }))),
    karte.gespraech
      ? el('section', { class: 'k-karte mfw-gespraech' },
        el('h2', { class: 'mfw-zwischentitel' }, 'Zum Weiterreden (für Erwachsene)'),
        el('p', { class: 'mfw-text' }, karte.gespraech))
      : null,
    knopf(`start-${karte.id}`, 'Zum Start', zumStart, 'k-knopf k-knopf--neutral'),
    quelle(karte),
  ];
}

function frageBildschirm({ index }) {
  const frage = runde[index];
  const nummer = index + 1;
  return [
    el('p', { class: 'mfw-kopf' }, `Rollen, Frage ${nummer} von ${runde.length}`),
    ueberschrift(frage.frage, 'k-titel mfw-frage'),
    el('section', { class: 'k-karte mfw-modul-rollen' },
      vorlesenKnopf(`vorlesen-frage-${nummer}`, () => vorlesetextFrage(frage)),
      el('div', { class: 'k-antworten' },
        ...frage.optionen.map((o) => knopf(`antwort-${nummer}-${o.id}`, o.titel,
          () => gehe({ name: 'antwort', index, gewaehlt: o.id }), 'k-knopf k-knopf--neutral mfw-antwort')))),
    knopf(`start-frage-${nummer}`, 'Zum Start', zumStart, 'k-knopf k-knopf--neutral'),
    quelle(findeKarte(alleModule, frage.id), 'Frage'),
  ];
}

function antwortBildschirm({ index, gewaehlt }) {
  const frage = runde[index];
  const nummer = index + 1;
  const antwort = beantworteQuizFrage(frage, gewaehlt);
  return [
    el('p', { class: 'mfw-kopf' }, `Rollen, Frage ${nummer} von ${runde.length}`),
    ueberschrift(frage.titel),
    el('section', { class: 'k-karte mfw-modul-rollen' },
      el('p', { class: 'mfw-rueckmeldung' }, rueckmeldungText(frage, antwort, texte)),
      el('p', { class: 'mfw-satz' }, antwort.erklaerung),
      vorlesenKnopf(`vorlesen-antwort-${nummer}`, () => vorlesetextAntwort(frage, antwort, texte))),
    index + 1 < runde.length
      ? knopf(`naechste-frage-${nummer}`, 'Nächste Frage', () => gehe({ name: 'frage', index: index + 1 }))
      : knopf('fertig-fragen', 'Fertig', () => gehe({ name: 'pause', modul: 'rollen', art: 'fragen' })),
    knopf(`start-antwort-${nummer}`, 'Zum Start', zumStart, 'k-knopf k-knopf--neutral'),
    quelle(findeKarte(alleModule, frage.id)),
  ];
}

// Die Pause: Bildschirm aus, ein paar Ideen für drinnen oder draußen. Von hier geht es nur zum Start.
function pauseBildschirm({ modul: modulId }) {
  const modul = findeModul(alleModule, modulId);
  const schluss = modul.schluss;
  return [
    el('p', { class: 'mfw-kopf' }, `${modul.titel}, Pause`),
    ueberschrift(texte.pause.ueberschrift),
    el('section', { class: `k-karte mfw-modul-${modulId}` },
      el('p', { class: 'mfw-satz' }, texte.pause.satz),
      el('ul', { class: 'mfw-ideen' }, ...schluss.ideen.map((idee) => el('li', {}, idee))),
      el('p', { class: 'mfw-quelle' }, `Ideen ${schluss.vermerk}.`),
      vorlesenKnopf('vorlesen-pause', () => vorlesetextPause(schluss, texte))),
    knopf('start-pause', 'Zum Start', zumStart),
  ];
}

function wahlKnopf(karte) {
  const gewaehlt = auswahl.has(karte.id);
  return knopf(`druck-karte-${karte.id}`,
    [el('span', {}, karte.titel), el('span', { class: 'mfw-status', 'aria-hidden': 'true' }, gewaehlt ? 'gewählt' : 'nicht gewählt')],
    () => { auswahl = umschalten(auswahl, karte.id); render(); },
    `k-knopf mfw-wahl ${gewaehlt ? '' : 'k-knopf--neutral'}`,
    { 'aria-pressed': String(gewaehlt) });
}

function druckBildschirm() {
  const gewaehlt = gewaehlteKarten(alleModule, auswahl);
  return [
    el('p', { class: 'mfw-kopf' }, 'Für Erwachsene'),
    ueberschrift('Karten drucken'),
    el('section', { class: 'k-karte' },
      el('p', { class: 'mfw-text' }, 'Wählt Karten aus. Jede gewählte Karte kommt auf ein Blatt A4 hoch, ohne Namenszeile.'),
      el('div', { class: 'mfw-reihe' },
        knopf('druck-alle', 'Alle wählen', () => { auswahl = waehleAlle(alleModule); render(); }, 'k-knopf k-knopf--neutral'),
        knopf('druck-leeren', 'Auswahl leeren', () => { auswahl = new Set(); render(); }, 'k-knopf k-knopf--neutral')),
      el('p', { class: 'mfw-zaehler' }, `Gewählt: ${gewaehlt.length} von ${alleKartenIds(alleModule).length} Karten.`),
      el('div', { class: 'k-antworten' },
        knopf('drucken', `Gewählte Karten drucken (${gewaehlt.length})`, () => window.print(), 'k-knopf', { disabled: !kannDrucken(gewaehlt) }))),
    ...alleModule.map((m) => el('section', { class: `k-karte mfw-modul-${m.id}`, 'aria-labelledby': `gruppe-${m.id}` },
      el('h2', { id: `gruppe-${m.id}`, class: 'mfw-zwischentitel' }, m.titel),
      el('div', { class: 'k-antworten' }, ...m.karten.map(wahlKnopf)))),
    knopf('start-druck', 'Zum Start', zumStart, 'k-knopf k-knopf--neutral'),
  ];
}

function hinweiseBildschirm() {
  return [
    el('p', { class: 'mfw-kopf' }, 'Für Erwachsene'),
    ueberschrift('Hinweise für Erwachsene'),
    el('section', { class: 'k-karte' }, ...texte.hinweise.map((h) => el('p', { class: 'mfw-text' }, ...mitSprache(h)))),
    knopf('start-hinweise', 'Zum Start', zumStart, 'k-knopf k-knopf--neutral'),
  ];
}

const BILDSCHIRME = {
  start: startBildschirm,
  karte: karteBildschirm,
  frage: frageBildschirm,
  antwort: antwortBildschirm,
  pause: pauseBildschirm,
  druck: druckBildschirm,
  hinweise: hinweiseBildschirm,
};

// ---------------------------------------------------------------- Druck

// Die Blätter: nur die gewählten Karten, eine je Blatt. Auf dem Bildschirm unsichtbar, im Druck das Einzige,
// was bleibt. Der Inhalt kommt aus druckeKarte: Kopf, Titel, ein Satz, Vermerk.
function druckbereich() {
  return el('div', { class: 'mfw-nur-druck', id: 'druckbereich' },
    ...gewaehlteKarten(alleModule, auswahl).map(({ modul, karte }) => {
      const blatt = druckeKarte(karte, modul.titel);
      return el('section', { class: 'k-karte mfw-karte', 'aria-labelledby': `druck-${karte.id}` },
        el('p', { class: 'mfw-druck-kopf' }, blatt.kopf),
        el('div', { class: 'mfw-druck-mitte' },
          el('h2', { id: `druck-${karte.id}`, class: 'mfw-druck-titel' }, blatt.titel),
          el('p', { class: 'mfw-druck-satz' }, blatt.satz)),
        el('p', { class: 'mfw-druck-vermerk' }, blatt.vermerk));
    }));
}

// ---------------------------------------------------------------- Neuaufbau und Fokus

// Nach dem Neuaufbau bekommt der Knopf mit derselben Kennung den Fokus zurück. Sonst landet der Fokus
// nach jedem Klick auf dem Seitenkörper.
function fokussiere(kennung) {
  if (!kennung) return;
  const ziel = [...app.querySelectorAll('button[data-kennung]')]
    .find((b) => b.dataset.kennung === kennung);
  ziel?.focus();
}

function render() {
  const merkeKennung = document.activeElement?.dataset?.kennung;
  app.replaceChildren(
    el('div', { class: 'mfw-bildschirm mfw-nur-bildschirm' },
      ...BILDSCHIRME[bildschirm.name](bildschirm).filter(Boolean), fuss()),
    druckbereich());
  // Wechselt der Bildschirm, steht der Fokus auf seiner Überschrift (tabindex -1), sonst auf demselben Knopf.
  // Der neue Bildschirm beginnt oben; ohne scrollTo bliebe die Seite an der Stelle des vorigen Knopfes stehen.
  if (neuerBildschirm) {
    neuerBildschirm = false;
    window.scrollTo(0, 0);
    app.querySelector('h1')?.focus({ preventScroll: true });
  } else {
    fokussiere(merkeKennung);
  }
}

try {
  alleModule = ladeModule([rollenDatei, haushaltDatei, hoeflichkeitDatei, budgetDatei]);
  render();
} catch (fehler) {
  app.replaceChildren(el('div', { class: 'k-hinweis' }, el('p', {}, `Die Karten konnten nicht geladen werden: ${fehler.message}`)));
}
