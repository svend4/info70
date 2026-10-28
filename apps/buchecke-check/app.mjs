// Buchecke-Check – Praleska docs/10, Kita-Abschnitt, Nr. 85.
// Werkzeug für das Kita-Team. Es fragt nach Raum, Bestand, Zeit und Pflege der Gruppe, nie nach
// einzelnen Kindern. Nichts wird gespeichert; der Bericht ist eine Datei, die das Team selbst
// speichert oder druckt. Keine Anfragen nach außen (docs/02).
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { alleFragen, BESCHRIFTUNG, berichtZeilen, EIGEN, pruefeDaten, zaehle, zustandSetzen, ZUSTAENDE } from './logik.mjs';

installiereNetzwerkWaechter();

const DATEI_NAME = 'buchecke-check-team-bericht.txt';
// Die Seitenangaben sind nicht von einem Menschen geprüft (Entscheidung Max 22а). Die Marke steht im Quellenabsatz
// auf dem Bildschirm und im Bericht; Druck und Textdatei zeigen die Seitenangaben der Fragen und tragen die Marke darum auch.
const MARKE_QUELLE = 'Seitenangaben der Quelle: nicht von einem Menschen geprüft.';
const MARKE_BERICHT = 'Seitenangaben nicht von einem Menschen geprüft.';
const app = document.getElementById('app');
const status = document.getElementById('bc-status');

// Der einzige Zustand: die Antworten des Teams. Im Speicher, nicht auf der Platte.
let zustand = {};
let daten = null;

// Die Seite wird einmal aufgebaut. Eine Antwort ändert danach nur die Zustände der drei Knöpfe der
// Frage sowie Bilanz und Druckbericht. Die Knöpfe bleiben dieselben Elemente; so bleibt der Fokus,
// wo er ist, und Bildschirmleser hören nicht die ganze Seite noch einmal.
const knoepfe = new Map(); // Frage-Kennung -> { erfuellt, offen, nicht } als Schaltflächen
let bilanzBox = null;
let druckBox = null;

/** Die Meldung für Bildschirmleser. Die Region bleibt bestehen; nur ihr Text wechselt. */
function meldeStatus(text) {
  status.textContent = text;
}

function setze(frageId, wert) {
  zustand = zustandSetzen(daten, zustand, frageId, wert);
  meldeStatus('');
  aktualisiere();
}

const knopfKlasse = (aktiv) => `k-knopf k-knopf--klein${aktiv ? '' : ' k-knopf--neutral'}`;

function knopf(f, wert) {
  return el('button', {
    class: knopfKlasse(false),
    id: `bc-${f.id}-${wert}`,
    'aria-pressed': 'false',
    'aria-label': `${BESCHRIFTUNG[wert]}: ${f.text}`,
    onclick: () => setze(f.id, wert),
  }, BESCHRIFTUNG[wert]);
}

function frageBild(f) {
  const schaltflaechen = Object.fromEntries(ZUSTAENDE.map((wert) => [wert, knopf(f, wert)]));
  knoepfe.set(f.id, schaltflaechen);
  return el('fieldset', { class: 'bc-frage', id: `bc-${f.id}` },
    el('legend', { class: 'bc-legende' }, f.text),
    el('p', { class: 'bc-quelle' }, f.quelle === EIGEN
      ? 'Eigenentwurf: die Quelle nennt diesen Punkt nicht.'
      : `Quelle: ${f.quelle}`),
    f.zitat ? el('p', { class: 'bc-zitat' }, `russisch: „${f.zitat}“`) : null,
    el('div', { class: 'k-antworten' }, ...ZUSTAENDE.map((wert) => schaltflaechen[wert])));
}

/** Setzt die Zustände der Knöpfe, die Bilanz und den Druckbericht nach dem Stand der Antworten. */
function aktualisiere() {
  for (const f of alleFragen(daten)) {
    for (const wert of ZUSTAENDE) {
      const b = knoepfe.get(f.id)[wert];
      const aktiv = zustand[f.id] === wert;
      b.setAttribute('aria-pressed', String(aktiv));
      b.className = knopfKlasse(aktiv);
    }
  }
  bilanzBox.replaceChildren(...bilanzInhalt());
  druckBox.replaceChildren(...druckInhalt());
}

function bilanzInhalt() {
  const z = zaehle(daten, zustand);
  const g = z.gesamt;
  return [
    el('p', { style: 'margin-top:0;font-weight:600', id: 'bc-bilanz' },
      `${g.erfuellt} von ${g.gesamt} erfüllt · ${g.offen} noch offen · ${g.nicht} trifft nicht zu · ${g.ungeprueft} nicht geprüft`),
    el('ul', { class: 'bc-liste' }, ...z.bereiche.map((b) =>
      el('li', {}, `${b.titel}: ${b.erfuellt} von ${b.gesamt} erfüllt`))),
  ];
}

/** Die Zeilen des Berichts mit der Marke hinter den zwei Kopfzeilen (Titel, Hinweis); Druck und Textdatei tragen sie gleich. */
function berichtMitMarke() {
  const zeilen = berichtZeilen(daten, zustand);
  return [...zeilen.slice(0, 2), MARKE_BERICHT, ...zeilen.slice(2)];
}

function druckInhalt() {
  return [
    el('p', { class: 'bc-druckzeile', style: 'font-weight:700;font-size:12pt' }, daten.titel),
    ...berichtMitMarke().map((z) => el('p', { class: 'bc-druckzeile' }, z || ' ')),
  ];
}

function exportiere() {
  const blob = new Blob([berichtMitMarke().join('\n')], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anker = el('a', { href: url, download: DATEI_NAME });
  document.body.append(anker);
  anker.click();
  anker.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  meldeStatus('Bericht als Textdatei gespeichert. Er enthält keine Angaben über einzelne Kinder.');
}

function zusammenfassung() {
  bilanzBox = el('div');
  return el('section', { class: 'k-karte bc-nur-bildschirm', id: 'bc-stand' },
    bilanzBox,
    el('div', { class: 'k-antworten' },
      el('button', { class: 'k-knopf', id: 'bc-speichern', onclick: exportiere }, '💾 Bericht als Datei speichern'),
      el('button', { class: 'k-knopf k-knopf--neutral', id: 'bc-drucken', onclick: () => window.print() }, '🖨️ Bericht drucken')));
}

function aufbauen() {
  druckBox = el('section', { class: 'bc-nur-druck' });
  app.replaceChildren(
    el('h1', { class: 'k-titel bc-nur-bildschirm' }, `📚 ${daten.titel}`),
    el('p', { class: 'k-untertitel bc-nur-bildschirm' }, 'Raum, Bestand, Zeit und Pflege der Buchecke, für das Kita-Team'),
    el('section', { class: 'k-karte bc-nur-bildschirm' },
      el('p', { style: 'margin-top:0;font-weight:600' }, daten.hinweis),
      el('p', { class: 'bc-quelle' }, `Quelle: ${daten.quelle.werk}`),
      el('p', { class: 'bc-quelle' }, daten.quelle.abweichung),
      el('p', { class: 'bc-quelle' }, MARKE_QUELLE)),
    ...daten.bereiche.map((b) => el('section', { class: 'bc-nur-bildschirm' },
      el('h2', { class: 'bc-bereichstitel' }, b.titel),
      ...b.fragen.map(frageBild))),
    zusammenfassung(),
    druckBox,
    el('footer', { class: 'k-fuss bc-nur-bildschirm' },
      el('span', {}, 'Werkzeug für das Kita-Team · nichts wird gespeichert · keine Anfragen nach außen · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
  aktualisiere();
}

async function ladeDaten() {
  try {
    const antwort = await fetch('daten/checkliste.json');
    if (!antwort.ok) return { fehler: `Die Datei daten/checkliste.json fehlt (HTTP ${antwort.status}).` };
    return { daten: await antwort.json() };
  } catch {
    return { fehler: 'Die Datei daten/checkliste.json ist nicht lesbar.' };
  }
}

const geladen = await ladeDaten();
const fehler = geladen.fehler ? [geladen.fehler] : pruefeDaten(geladen.daten);
if (fehler.length) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' },
    el('p', { style: 'margin:0' }, `Datenfehler: ${fehler[0]}`)));
} else {
  daten = geladen.daten;
  aufbauen();
}
