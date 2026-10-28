// Spielbegleiter: Vom Hantieren zum Rollenspiel – Praleska docs/10, Kita-Abschnitt, Nr. 81.
// Werkzeug für Fachkräfte mit Kindern von 3 bis 5 Jahren. Die sieben Aufgaben stehen auf
// S. 145–146; die Fakten auf S. 6 und S. 104; die Checkliste ist Eigenentwurf. Keine
// Verlaufsdokumentation, kein Beobachten einzelner Kinder, nichts wird gespeichert,
// keine externen Anfragen (docs/02). Der Druck zeigt nur die Karten.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { kartenFuer, pruefeDaten } from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const daten = await fetch('daten/karten.json').then((r) => r.json());

function aufgabeKarte(a, i) {
  return el('article', { class: 'k-karte sr-karte', id: `sr-${a.id}` },
    el('h2', { class: 'sr-kartentitel' }, `Aufgabe ${i + 1}`),
    el('p', {}, a.text),
    el('p', { class: 'sr-quelle' }, `${a.quelle} · russisch: „${a.zitat}“`));
}

function faktKarte() {
  return el('article', { class: 'k-karte sr-karte', id: 'sr-fakten' },
    el('h2', { class: 'sr-kartentitel' }, 'Fakten zum Übergang'),
    ...daten.fakten.map((f) => el('p', {}, `${f.text} (${f.quelle}) · russisch: „${f.zitat}“`)));
}

function checklisteKarte() {
  return el('article', { class: 'k-karte sr-karte', id: 'sr-checkliste' },
    el('h2', { class: 'sr-kartentitel' }, daten.checkliste.titel),
    el('ul', { class: 'sr-liste' }, ...daten.checkliste.fragen.map((f) => el('li', {}, f))),
    el('p', { class: 'sr-quelle' }, `Quelle: ${daten.checkliste.quelle} · Eigenentwurf. Keine Namen, keine Notizen über Kinder.`));
}

function zeichne() {
  app.replaceChildren(
    el('h1', { class: 'k-titel sr-nur-bildschirm' }, `🧩 ${daten.titel}`),
    el('p', { class: 'k-untertitel sr-nur-bildschirm' }, 'Vom Spiel mit Dingen zum Rollenspiel: Kinder von 3 bis 5 Jahren'),
    el('section', { class: 'k-karte sr-nur-bildschirm' },
      el('p', { style: 'margin-top:0;font-weight:600' }, daten.hinweis),
      el('p', {}, daten.wasEsIst),
      el('p', { class: 'sr-quelle' }, `Quelle: ${daten.quelle.werk}`),
      el('p', { class: 'sr-quelle' }, daten.quelle.abweichung),
      // Ehrliche Marke an den Seitenangaben (docs/02, Entscheidung Max 22а): kein Mensch hat sie geprüft.
      el('p', { class: 'sr-quelle' }, 'Seitenangaben der Quelle: nicht von einem Menschen geprüft.')),
    el('section', { class: 'k-karte sr-nur-bildschirm' },
      el('p', { style: 'font-weight:600;margin-top:0' }, `${kartenFuer(daten).length} Aufgaben, Fakten und Checkliste`),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', id: 'sr-drucken', onclick: () => window.print() }, '🖨️ Diese Karten drucken'))),
    el('section', { class: 'sr-nur-druck' },
      el('p', { style: 'font-weight:600' }, `${daten.titel} – Karten`),
      el('p', {}, 'Die Aufgaben stehen auf S. 145–146 der Quelle. Die Checkliste ist Eigenentwurf. Keine Namen, keine Notizen über Kinder.'),
      // Die gedruckten Karten tragen Seitenangaben, darum steht die Marke auch im Druckinhalt (kein Bildschirmteil).
      el('p', {}, 'Seitenangaben der Quelle: nicht von einem Menschen geprüft.')),
    faktKarte(),
    ...kartenFuer(daten).map(aufgabeKarte),
    checklisteKarte(),
    el('footer', { class: 'k-fuss sr-nur-bildschirm' },
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
