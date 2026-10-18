// Entdecker-Karten: Tiere und Pflanzen vor der Tür (Katalogeintrag Printmaterialien (docs/10), Praleska S. 50–51).
// Zielgruppe: ERWACHSENE (Fachkräfte). Kein Kinderbildschirm, keine Eingabefelder.
// Das Werkzeug druckt ein Kartenset: Gruppe wählen, dann drucken. Sechs Karten je Blatt,
// gestrichelte Schneidelinien. Die Karten bewerten keine Kinder.
// Politik docs/02: CSP self und NetzwerkWaechter; nichts wird gespeichert.
// Der Filter lebt nur im Speicher der Seite.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import {
  FEHLER_LADEN, KARTEN_PRO_BLATT, anregungsMarke, blaettern, blattKopf, filtereKarten,
  kartenAusAntwort, kartenFuss, sicherheitsHinweis, zaehleJeGruppe,
} from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');

// Laden: Schlägt der Abruf fehl (Netz, Status, ungültiges JSON), zeigt die Seite nur die Meldung.
let daten = null;
try {
  daten = await fetch('daten/karten.json').then(kartenAusAntwort);
} catch {
  app.replaceChildren(el('p', {}, FEHLER_LADEN));
}

// Filterzustand: lebt nur hier im Speicher der Seite, wird nirgends gesichert.
const filter = { gruppe: null };

const gruppeVon = (id) => daten.gruppen.find((g) => g.id === id);

function gruppenLeiste() {
  const zaehl = zaehleJeGruppe(daten.karten);
  const optionen = [
    [null, `Alle (${daten.karten.length})`],
    ...daten.gruppen.map((g) => [g.id, `${g.name} (${zaehl[g.id] ?? 0})`]),
  ];
  return el('div', { class: 'ek-knopfzeile' },
    ...optionen.map(([wert, beschriftung]) => el('button', {
      class: `k-knopf k-knopf--klein ${filter.gruppe === wert ? '' : 'k-knopf--neutral'}`,
      'aria-pressed': String(filter.gruppe === wert),
      'data-kennung': `gruppe-${wert ?? 'alle'}`,
      onclick: () => { filter.gruppe = wert; render(); },
    }, beschriftung)));
}

// Eine Karte: Gruppe mit Seite, Titel, Anregungen mit Seite und Kennzeichnung, Fußzeile zur Herkunft.
function karte(k) {
  const g = gruppeVon(k.gruppe);
  return el('section', { class: 'k-karte ek-karte' },
    el('p', { class: 'ek-karte-kopf' }, `${g.name}, Praleska S. ${k.seite}`),
    el('h2', { class: 'ek-karte-titel' }, k.titel),
    ...k.anregungen.map((a) => el('p', { class: 'ek-anregung' },
      el('span', { class: 'ek-art' }, a.art),
      ` ${a.text} `,
      el('span', { class: 'ek-marke' }, anregungsMarke(k)))),
    el('p', { class: 'ek-fuss' }, kartenFuss(k)));
}

// Ein gedrucktes Blatt: Kopf mit Quelle und Fachkraft-Satz, darunter das Raster der Karten.
// Liegt eine Kleinteil-Karte auf dem Blatt, steht der Sicherheitssatz im Kopf.
function blatt(karten, nummer, gesamt, gruppenName) {
  const sicher = sicherheitsHinweis(karten);
  return el('section', { class: 'ek-blatt' },
    el('header', { class: 'ek-blatt-kopf' },
      el('p', { class: 'ek-blatt-titel' }, daten.titel),
      el('p', {}, blattKopf({ gruppe: gruppenName, nummer, gesamt })),
      el('p', {}, daten.sinne.text),
      el('p', {}, daten.hinweis),
      sicher ? el('p', {}, sicher) : null),
    el('div', { class: 'ek-raster' }, ...karten.map(karte)));
}

function render() {
  // Vor dem Neuaufbau merken, welcher Knopf den Fokus hat; danach denselben Knopf wieder fokussieren.
  const merken = document.activeElement?.dataset?.kennung;
  const treffer = filtereKarten(daten.karten, filter.gruppe);
  const gruppenName = filter.gruppe ? gruppeVon(filter.gruppe).name : 'Alle Gruppen';
  const blaetter = blaettern(treffer, KARTEN_PRO_BLATT);
  app.replaceChildren(
    el('h1', { class: 'k-titel ek-nur-bildschirm' }, daten.titel),
    el('p', { class: 'k-untertitel ek-nur-bildschirm' },
      'Druck-Kartenset für Fachkräfte: Tiere, Pflanzen, Stoffe und Jahreszeiten zum Beobachten draußen.'),

    el('section', { class: 'k-karte ek-nur-bildschirm' },
      el('p', { class: 'ek-label' }, 'Gruppe'),
      gruppenLeiste(),
      el('p', { class: 'ek-hinweis-text' },
        `${treffer.length} von ${daten.karten.length} Karten, ${blaetter.length} ${blaetter.length === 1 ? 'Blatt' : 'Blätter'} zum Drucken.`),
      el('p', { class: 'ek-hinweis-text' }, daten.hinweisBildschirm),
      el('div', { class: 'k-antworten' },
        el('button', {
          class: 'k-knopf',
          'data-kennung': 'drucken',
          onclick: () => window.print(),
        }, 'Kartenbogen drucken'))),

    el('div', { class: 'ek-vorschau ek-nur-bildschirm' }, ...treffer.map(karte)),

    el('div', { class: 'ek-druck ek-nur-druck' },
      ...blaetter.map((b, i) => blatt(b, i + 1, blaetter.length, gruppenName))),

    el('footer', { class: 'k-fuss ek-nur-bildschirm' },
      el('span', {}, 'Werkzeug für Fachkräfte; werbefrei; nichts wird gespeichert; keine Verbindung nach draußen. '),
      el('span', {}, 'Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft. '),
      el('a', { href: '../../impressum.html' }, 'Impressum und Datenschutz')));

  if (merken) app.querySelector(`[data-kennung="${merken}"]`)?.focus();
}

if (daten) render();
