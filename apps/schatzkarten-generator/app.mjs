// Schatzkarten-Generator: Erwachsene erzeugen Orientierungskarten zum Drucken
// für Spiele draußen oder im Raum. Die Logik liegt in logik.mjs (ohne DOM, der
// Zufall kommt als Parameter). Diese Datei baut die Seite einmal auf und
// erneuert danach nur die Ausgabe. Eingaben liegen im Speicher der Seite;
// gespeichert wird nichts.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import {
  GITTER_MIN, GITTER_MAX, ORTE, SYMBOLE, STANDARD_GITTER, STANDARD_ZEICHEN, STANDARD_ORT,
  QUELLE_KARTEN, QUELLE_LOESUNG,
  erzeugeKarte, rasterZellen, wegkarten, loesungZeilen, legende, alsTextdatei, ortName,
} from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const zufall = () => Math.random();
let karte = null;
let loesungSichtbar = false;

// --- Eingaben (einmal aufgebaut) ---

const GROESSEN = Array.from({ length: GITTER_MAX - GITTER_MIN + 1 }, (_, i) => GITTER_MIN + i);

const groesseWahl = el('select', { id: 'sg-groesse' },
  ...GROESSEN.map((n) => el('option', { value: String(n), selected: n === STANDARD_GITTER }, `${n} × ${n} Felder`)));

const ortWahl = el('select', { id: 'sg-ort' },
  ...ORTE.map((o) => el('option', { value: o.id, selected: o.id === STANDARD_ORT }, o.name)));

const zeichenWahl = el('select', { id: 'sg-zeichen' },
  ...Array.from({ length: SYMBOLE.length + 1 }, (_, n) =>
    el('option', { value: String(n), selected: n === STANDARD_ZEICHEN }, `${n} Zeichen`)));

const feld = (text, wahl) => el('label', { class: 'sg-feld' }, el('span', {}, text), wahl);

// --- Ausgabe (wird bei jeder neuen Karte erneuert) ---

const kartenTeil = el('div', { class: 'sg-teil', 'data-teil': 'karten' });
const loesungTeil = el('div', { class: 'sg-teil sg-loesung sg-verborgen', 'data-teil': 'loesung' });

const schalter = el('button', {
  class: 'k-knopf k-knopf--neutral',
  type: 'button',
  'aria-pressed': 'false',
  onclick: () => loesungUmschalten(),
}, 'Lösung auf dem Bildschirm anzeigen (nur für Erwachsene)');

function loesungUmschalten() {
  loesungSichtbar = !loesungSichtbar;
  schalter.setAttribute('aria-pressed', String(loesungSichtbar));
  loesungTeil.classList.toggle('sg-verborgen', !loesungSichtbar);
}

function neueKarte() {
  karte = erzeugeKarte({
    groesse: Number(groesseWahl.value),
    ort: ortWahl.value,
    anzahlZeichen: Number(zeichenWahl.value),
    rng: zufall,
  });
  kartenTeil.replaceChildren(...baueKarten(karte));
  loesungTeil.replaceChildren(...baueLoesung(karte));
}

// --- Bausteine der Ausgabe ---

function baueKarten(k) {
  return [
    el('h2', { class: 'sg-decktitel' }, `Raster-Karte · ${ortName(k.ort)} · ${k.groesse} × ${k.groesse} Felder`),
    baueRaster(k, 'karte'),
    el('h2', { class: 'sg-decktitel' }, 'Zeichen'),
    baueLegende(k),
    el('h2', { class: 'sg-decktitel' }, 'Wegkarten'),
    baueWegkarten(k),
    el('p', { class: 'sg-quelle' }, QUELLE_KARTEN),
  ];
}

function baueLoesung(k) {
  return [
    el('h2', { class: 'sg-decktitel' }, 'Lösungsblatt · nur für Erwachsene'),
    el('p', { class: 'sg-warnung' }, 'Nicht an die Kinder geben. Das Blatt zeigt das Ziel und den ganzen Weg.'),
    el('h3', { class: 'sg-ueber' }, 'Raster mit Lösung'),
    baueRaster(k, 'loesung'),
    el('ul', { class: 'sg-loesung-liste' }, ...loesungZeilen(k).map((zeile) => el('li', {}, zeile))),
    el('h3', { class: 'sg-ueber' }, 'Wegkarten wie gedruckt'),
    baueWegkarten(k),
    el('p', { class: 'sg-quelle' }, QUELLE_LOESUNG),
  ];
}

function baueRaster(k, modus) {
  const zeilen = rasterZellen(k, modus);
  const name = modus === 'loesung' ? 'Lösungsraster' : 'Raster-Karte';
  return el('table', { class: 'sg-raster', 'aria-label': `${name}, ${k.groesse} mal ${k.groesse} Felder` },
    el('thead', {}, el('tr', {},
      el('th', { scope: 'col' }, ''),
      ...zeilen[0].map((z) => el('th', { scope: 'col' }, z.spalte)))),
    el('tbody', {}, ...zeilen.map((reihe) => el('tr', {},
      el('th', { scope: 'row' }, String(reihe[0].zeile)),
      ...reihe.map(zelleEl)))));
}

function zelleEl(zelle) {
  const titel = zelle.koordinate;
  switch (zelle.inhalt) {
    case 'start':
      return el('td', { class: 'sg-start', title: titel }, el('span', {}, 'Start ↑'));
    case 'ziel':
      return el('td', { class: 'sg-ziel', title: titel }, el('span', {}, 'Ziel'));
    case 'zeichen': {
      const symbol = SYMBOLE.find((s) => s.id === zelle.zeichenArt);
      return el('td', { title: titel },
        el('span', { class: 'sg-zeichen', role: 'img', 'aria-label': symbol.name }, symbol.zeichen));
    }
    case 'weg':
      return el('td', { class: 'sg-weg', title: titel }, String(zelle.schritt));
    default:
      return el('td', { title: titel }, '');
  }
}

function baueLegende(k) {
  return el('dl', { class: 'sg-legende' },
    el('dt', { class: 'sg-zeichen', 'aria-hidden': 'true' }, '↑'),
    el('dd', {}, 'Start: Pfeil zeigt nach vorn'),
    ...legende(k).flatMap((s) => [
      el('dt', { class: 'sg-zeichen', role: 'img', 'aria-label': s.name }, s.zeichen),
      el('dd', {}, s.name),
    ]));
}

function baueWegkarten(k) {
  return el('ol', { class: 'sg-wegkarten' }, ...wegkarten(k).map((w) =>
    el('li', { class: 'sg-wegkarte' },
      el('p', { class: 'sg-titel' }, w.titel),
      el('p', { class: 'sg-satz' }, w.text))));
}

// --- Drucken und Speichern ---

function drucke(teil) {
  if (!karte) return;
  document.body.dataset.druck = teil;
  const aufraeumen = () => {
    delete document.body.dataset.druck;
    window.removeEventListener('afterprint', aufraeumen);
  };
  window.addEventListener('afterprint', aufraeumen);
  window.print();
}

function ladeTextHerunter(teil) {
  if (!karte) return;
  const blob = new Blob([alsTextdatei(karte, teil)], { type: 'text/plain;charset=utf-8' });
  const adresse = URL.createObjectURL(blob);
  const link = el('a', {
    href: adresse,
    download: teil === 'karten' ? 'schatzkarte-karten.txt' : 'schatzkarte-loesung.txt',
  });
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(adresse), 1000);
}

// --- Seite aufbauen (einmal) ---

const einstellungen = el('section', { class: 'k-karte sg-nur-bildschirm', 'aria-labelledby': 'sg-einst' },
  el('h2', { id: 'sg-einst', class: 'sg-ueber' }, 'Einstellungen'),
  feld('Gittergröße', groesseWahl),
  feld('Ort (erscheint als Überschrift auf der Karte)', ortWahl),
  feld('Anzahl der Zeichen', zeichenWahl),
  el('div', { class: 'k-antworten' },
    el('button', { class: 'k-knopf', type: 'button', onclick: () => neueKarte() }, 'Neue Karte erzeugen')));

const drucken = el('section', { class: 'k-karte sg-nur-bildschirm', 'aria-labelledby': 'sg-druck' },
  el('h2', { id: 'sg-druck', class: 'sg-ueber' }, 'Drucken und speichern'),
  el('div', { class: 'k-antworten' },
    el('button', { class: 'k-knopf', type: 'button', onclick: () => drucke('karten') }, 'Karten drucken'),
    el('button', { class: 'k-knopf k-knopf--neutral', type: 'button', onclick: () => drucke('loesung') },
      'Lösungsblatt drucken (nur für Erwachsene)'),
    el('button', { class: 'k-knopf k-knopf--neutral', type: 'button', onclick: () => ladeTextHerunter('karten') },
      'Karten als Textdatei speichern'),
    el('button', { class: 'k-knopf k-knopf--neutral', type: 'button', onclick: () => ladeTextHerunter('loesung') },
      'Lösungsblatt als Textdatei speichern (nur für Erwachsene)'),
    schalter));

const erklaerung = el('section', { class: 'k-karte sg-nur-bildschirm', 'aria-labelledby': 'sg-erkl' },
  el('h2', { id: 'sg-erkl', class: 'sg-ueber' }, 'So funktioniert es'),
  el('p', {}, 'Start und Ziel setzt der Zufall. Die Wegkarten sagen, wie man geht: geradeaus, rechts, links oder umdrehen. '
    + 'Rechts und links gelten immer von dem Kind aus, das auf dem Start steht und nach vorn schaut (Pfeil am Start).'),
  el('p', {}, 'Spielnamen aus der Quelle (Programm «Пралеска», S. 246, eigene Übersetzung): '
    + '«С картой в путь» heißt „Mit der Karte unterwegs“, «Спрячь предмет и опиши путь к нему» heißt '
    + '„Versteck den Gegenstand und beschreibe den Weg“.'),
  el('p', {}, 'Eigenentwurf der App, nicht aus der Quelle: Raster, Zeichen, Wegkarten, Lösungsblatt und der Ablauf. '
    + 'Die Quelle nennt nur die Spielnamen.'),
  el('p', {}, 'Vorschlag, nicht aus der Quelle: vor dem Spiel ein Feld festlegen, zum Beispiel als einen großen Schritt. '
    + 'Den Gegenstand auf dem Ziel verstecken.'),
  el('p', {}, 'Gestaltungsentscheidung der App: Das Werkzeug erzeugt nur Papier. Gespielt wird draußen oder im Raum.'));

app.replaceChildren(
  el('h1', { class: 'k-titel sg-nur-bildschirm' }, '🧭 Schatzkarten-Generator'),
  el('p', { class: 'k-untertitel sg-nur-bildschirm' },
    'Für Erwachsene: Orientierungskarten zum Drucken für Spiele draußen oder im Raum. Nichts wird gespeichert.'),
  einstellungen,
  drucken,
  erklaerung,
  kartenTeil,
  loesungTeil,
  el('footer', { class: 'k-fuss sg-nur-bildschirm' },
    el('span', {}, 'werbefrei · läuft offline · speichert nichts · '),
    el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));

neueKarte();
