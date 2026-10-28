// Bewegungs-Richtwerte 3–5 – Praleska docs/10, Kita-Abschnitt, Nr. 83.
// Nachschlageblatt für Fachkräfte mit Kindern von 4 und 5 Jahren: Angaben mit Maß aus den
// Bewegungsaufgaben der Quelle (S. 128–134), nach Lebensjahr und Bewegungsart. Keine Norm,
// keine Bewertung einzelner Kinder, keine Eingabe, nichts wird gespeichert, keine externen
// Anfragen (docs/02). Der Druck zeigt nur die Angaben.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { ARTEN, eintraegeFuer, pruefeDaten } from './logik.mjs';

installiereNetzwerkWaechter();

// Die Seitenangaben sind nicht von einem Menschen geprüft (Entscheidung Max 22а). Die Marke steht einmal im
// Quellenabsatz auf dem Bildschirm und einmal im Druckkopf über den Angaben mit Seite.
const MARKE_QUELLE = 'Seitenangaben der Quelle: nicht von einem Menschen geprüft.';
const MARKE_DRUCK = 'Seitenangaben nicht von einem Menschen geprüft.';

const app = document.getElementById('app');
const daten = await fetch('daten/richtwerte.json').then((r) => r.json());

// Der einzige Zustand: Lebensjahr und Bewegungsart der Auswahl. Im Speicher, nicht auf der Platte.
let jahr = null;
let art = null;

function knopf(text, aktiv, onklick, id = null) {
  return el('button', {
    class: `k-knopf k-knopf--klein${aktiv ? '' : ' k-knopf--neutral'}`,
    'aria-pressed': String(aktiv),
    ...(id ? { id } : {}),
    onclick: onklick,
  }, text);
}

function zeile(e) {
  return el('div', { class: 'rw-zeile', id: `rw-${e.id}` },
    el('p', { class: 'rw-name' }, `${e.jahr}. Lebensjahr · ${e.art}`),
    el('p', {}, e.text),
    el('p', { class: 'rw-quelle' }, `${e.seite} · russisch: „${e.zitat}“`));
}

function zeichne() {
  const liste = eintraegeFuer(daten, { jahr, art });
  app.replaceChildren(
    el('h1', { class: 'k-titel rw-nur-bildschirm' }, `📏 ${daten.titel}`),
    el('p', { class: 'k-untertitel rw-nur-bildschirm' }, 'Angaben mit Maß aus den Bewegungsaufgaben der Quelle, nach Lebensjahr'),
    el('section', { class: 'k-karte rw-nur-bildschirm' },
      el('p', { style: 'margin-top:0;font-weight:600' }, daten.hinweis),
      el('p', {}, daten.wasEsIst),
      el('p', { class: 'rw-quelle' }, `Quelle: ${daten.quelle.werk}`),
      el('p', { class: 'rw-quelle' }, MARKE_QUELLE),
      el('p', { class: 'rw-quelle' }, daten.quelle.abweichung)),
    el('section', { class: 'k-karte rw-nur-bildschirm' },
      el('p', { style: 'font-weight:600;margin-top:0' }, 'Lebensjahr wählen'),
      el('div', { class: 'k-antworten' },
        knopf('Alle', jahr === null, () => { jahr = null; zeichne(); }),
        knopf('4. Lebensjahr', jahr === 4, () => { jahr = jahr === 4 ? null : 4; zeichne(); }, 'rw-jahr-4'),
        knopf('5. Lebensjahr', jahr === 5, () => { jahr = jahr === 5 ? null : 5; zeichne(); }, 'rw-jahr-5')),
      el('p', { style: 'font-weight:600' }, 'Bewegungsart wählen'),
      el('div', { class: 'k-antworten' },
        knopf('Alle Arten', art === null, () => { art = null; zeichne(); }),
        ...ARTEN.map((a) => knopf(a, art === a, () => { art = art === a ? null : a; zeichne(); })))),
    el('section', { class: 'rw-nur-bildschirm', style: 'margin-top:1rem' },
      el('p', { style: 'font-weight:600' }, `${liste.length} ${liste.length === 1 ? 'Angabe' : 'Angaben'} in dieser Auswahl`),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', id: 'rw-drucken', onclick: () => window.print() }, '🖨️ Diese Angaben drucken'))),
    el('section', { class: 'rw-nur-druck' },
      el('p', { style: 'font-weight:600' }, `${daten.titel}`),
      el('p', {}, 'Richtwerte aus dem Text, keine Norm. Keine Bewertung einzelner Kinder.'),
      el('p', {}, MARKE_DRUCK)),
    liste.length === 0
      ? el('p', { class: 'k-hinweis rw-nur-bildschirm' }, 'Zu dieser Auswahl gibt es keine Angabe.')
      : el('section', { class: 'k-karte rw-karte' }, ...liste.map(zeile)),
    el('footer', { class: 'k-fuss rw-nur-bildschirm' },
      el('span', {}, 'Werkzeug für Fachkräfte · läuft offline · nichts wird gespeichert · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

const fehler = pruefeDaten(daten);
if (fehler.length) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' },
    el('p', { style: 'margin:0' }, `Datenfehler: ${fehler[0]}`)));
} else {
  zeichne();
}
