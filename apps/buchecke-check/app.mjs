// Buchecke-Check – Praleska docs/10, Kita-Abschnitt, Nr. 85.
// Werkzeug für das Kita-Team. Es fragt nach Raum, Bestand, Zeit und Pflege der Gruppe, nie nach
// einzelnen Kindern. Nichts wird gespeichert; der Bericht ist eine Datei, die das Team selbst
// speichert oder druckt. Keine Anfragen nach außen (docs/02).
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { BESCHRIFTUNG, berichtZeilen, EIGEN, pruefeDaten, zaehle, zustandSetzen, ZUSTAENDE } from './logik.mjs';

installiereNetzwerkWaechter();

const DATEI_NAME = 'buchecke-check-team-bericht.txt';
const app = document.getElementById('app');
const daten = await fetch('daten/checkliste.json').then((r) => r.json());

// Der einzige Zustand: die Antworten des Teams und eine Meldung. Im Speicher, nicht auf der Platte.
let zustand = {};
let meldung = null;

function setze(frageId, wert) {
  zustand = zustandSetzen(daten, zustand, frageId, wert);
  meldung = null;
  zeichne();
}

function knopf(text, aktiv, onklick, id) {
  return el('button', {
    class: `k-knopf k-knopf--klein${aktiv ? '' : ' k-knopf--neutral'}`,
    'aria-pressed': String(aktiv),
    id,
    onclick: onklick,
  }, text);
}

function frageBild(f) {
  return el('fieldset', { class: 'bc-frage', id: `bc-${f.id}` },
    el('legend', { class: 'bc-legende' }, f.text),
    el('p', { class: 'bc-quelle' }, f.quelle === EIGEN
      ? 'Eigenentwurf: die Quelle nennt diesen Punkt nicht.'
      : `Quelle: ${f.quelle}`),
    f.zitat ? el('p', { class: 'bc-zitat' }, `russisch: „${f.zitat}“`) : null,
    el('div', { class: 'k-antworten' },
      ...ZUSTAENDE.map((wert) => knopf(BESCHRIFTUNG[wert], zustand[f.id] === wert,
        () => setze(f.id, wert), `bc-${f.id}-${wert}`))));
}

function exportiere() {
  const blob = new Blob([berichtZeilen(daten, zustand).join('\n')], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anker = el('a', { href: url, download: DATEI_NAME });
  document.body.append(anker);
  anker.click();
  anker.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  meldung = 'Bericht als Textdatei gespeichert. Er enthält keine Angaben über einzelne Kinder.';
  zeichne();
}

function zusammenfassung() {
  const z = zaehle(daten, zustand);
  const g = z.gesamt;
  return el('section', { class: 'k-karte bc-nur-bildschirm', id: 'bc-stand' },
    el('p', { style: 'margin-top:0;font-weight:600', id: 'bc-bilanz' },
      `${g.erfuellt} von ${g.gesamt} erfüllt · ${g.offen} noch offen · ${g.nicht} trifft nicht zu · ${g.ungeprueft} nicht geprüft`),
    el('ul', { class: 'bc-liste' }, ...z.bereiche.map((b) =>
      el('li', {}, `${b.titel}: ${b.erfuellt} von ${b.gesamt} erfüllt`))),
    el('div', { class: 'k-antworten' },
      el('button', { class: 'k-knopf', id: 'bc-speichern', onclick: exportiere }, '💾 Bericht als Datei speichern'),
      el('button', { class: 'k-knopf k-knopf--neutral', id: 'bc-drucken', onclick: () => window.print() }, '🖨️ Bericht drucken')),
    meldung ? el('p', { class: 'k-hinweis', role: 'status', style: 'margin:0.8rem 0 0' }, meldung) : null);
}

function zeichne() {
  app.replaceChildren(
    el('h1', { class: 'k-titel bc-nur-bildschirm' }, `📚 ${daten.titel}`),
    el('p', { class: 'k-untertitel bc-nur-bildschirm' }, 'Raum, Bestand, Zeit und Pflege der Buchecke, für das Kita-Team'),
    el('section', { class: 'k-karte bc-nur-bildschirm' },
      el('p', { style: 'margin-top:0;font-weight:600' }, daten.hinweis),
      el('p', { class: 'bc-quelle' }, `Quelle: ${daten.quelle.werk}`),
      el('p', { class: 'bc-quelle' }, daten.quelle.abweichung)),
    ...daten.bereiche.map((b) => el('section', { class: 'bc-nur-bildschirm' },
      el('h2', { class: 'bc-bereichstitel' }, b.titel),
      ...b.fragen.map(frageBild))),
    zusammenfassung(),
    el('section', { class: 'bc-nur-druck' },
      el('p', { class: 'bc-druckzeile', style: 'font-weight:700;font-size:12pt' }, daten.titel),
      ...berichtZeilen(daten, zustand).map((z) => el('p', { class: 'bc-druckzeile' }, z || ' '))),
    el('footer', { class: 'k-fuss bc-nur-bildschirm' },
      el('span', {}, 'Werkzeug für das Kita-Team · nichts wird gespeichert · keine Anfragen nach außen · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

const fehler = pruefeDaten(daten);
if (fehler.length) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' },
    el('p', { style: 'margin:0' }, `Datenfehler: ${fehler[0]}`)));
} else {
  zeichne();
}
