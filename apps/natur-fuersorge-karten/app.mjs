// Natur-Fürsorge-Karten – Praleska docs/10, Kita-Abschnitt, Nr. 80.
// Werkzeug für Fachkräfte mit Kindern von 1 bis 3 Jahren. Die vier Aufgaben stehen auf
// S. 96; die drei Handlungen sind Beispiele aus dem Text; Anregungen und Checkliste sind
// Eigenentwurf. Kein Protokoll über einzelne Kinder, nichts wird gespeichert, keine
// externen Anfragen (docs/02). Der Druck zeigt nur die Karten und die Checkliste.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { kartenFuer, pruefeDaten, quelleTextVon, zielVon } from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const daten = await fetch('daten/karten.json').then((r) => r.json());

// Der einzige Zustand: welche Handlung gewählt ist. Im Speicher, nicht auf der Platte.
let handlung = null;

const nummer = (id) => daten.ziele.findIndex((z) => z.id === id) + 1;
const handlungVon = (id) => daten.handlungen.find((h) => h.id === id);

function knopf(text, aktiv, onklick, id = null) {
  return el('button', {
    class: `k-knopf k-knopf--klein${aktiv ? '' : ' k-knopf--neutral'}`,
    'aria-pressed': String(aktiv),
    ...(id ? { id } : {}),
    onclick: onklick,
  }, text);
}

function karteBild(k) {
  const h = handlungVon(k.handlung);
  return el('article', { class: 'k-karte nf-karte', id: `nf-${k.id}` },
    el('h2', { class: 'nf-kartentitel' }, h.titel),
    el('p', { class: 'nf-beispiel' }, `Im Text (${h.quelle}): „${h.beispiel}“`),
    el('p', {}, k.anregung),
    el('p', { class: 'nf-quelle' }, quelleTextVon(daten, k)));
}

function checklisteBild() {
  return el('article', { class: 'k-karte nf-karte', id: 'nf-checkliste' },
    el('h2', { class: 'nf-kartentitel' }, daten.checkliste.titel),
    el('ul', { class: 'nf-liste' }, ...daten.checkliste.fragen.map((f) => el('li', {}, f))),
    el('p', { class: 'nf-quelle' }, `Quelle: ${daten.checkliste.quelle} · Eigenentwurf der Fragen. Keine Namen, keine Notizen über Kinder.`));
}

function zeichne() {
  const karten = kartenFuer(daten, { handlung });
  app.replaceChildren(
    el('h1', { class: 'k-titel nf-nur-bildschirm' }, `🌱 ${daten.titel}`),
    el('p', { class: 'k-untertitel nf-nur-bildschirm' }, 'Pflege von Pflanzen und Tieren mit Kindern von 1 bis 3 Jahren'),
    el('section', { class: 'k-karte nf-nur-bildschirm' },
      el('p', { style: 'margin-top:0;font-weight:600' }, daten.hinweis),
      el('p', {}, daten.wasEsIst),
      el('p', { class: 'nf-quelle' }, `Quelle: ${daten.quelle.werk}`),
      el('p', { class: 'nf-quelle' }, daten.quelle.abweichung)),
    el('section', { class: 'k-karte nf-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, 'Die vier Aufgaben (S. 96)'),
      el('p', { class: 'nf-quelle' }, 'Aufgaben für die Fachkraft, nicht Fähigkeiten der Kinder.'),
      ...daten.ziele.map((z, i) => el('div', { class: 'nf-zeile' },
        el('p', { class: 'nf-name' }, `${i + 1}. ${z.text}`),
        el('p', { class: 'nf-quelle' }, `${z.quelle} · russisch: „${z.zitat}“`)))),
    el('section', { class: 'k-karte nf-nur-bildschirm' },
      el('p', { style: 'font-weight:600;margin-top:0' }, 'Handlung wählen'),
      el('div', { class: 'k-antworten' },
        knopf('Alle Handlungen', handlung === null, () => { handlung = null; zeichne(); }),
        ...daten.handlungen.map((h) => knopf(h.titel, handlung === h.id, () => {
          handlung = handlung === h.id ? null : h.id;
          zeichne();
        }, `nf-filter-${h.id}`)))),
    el('section', { class: 'nf-nur-bildschirm', style: 'margin-top:1rem' },
      el('p', { style: 'font-weight:600' }, `${karten.length} ${karten.length === 1 ? 'Karte' : 'Karten'} und die Checkliste in dieser Auswahl`),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', id: 'nf-drucken', onclick: () => window.print() }, '🖨️ Diese Karten drucken'))),
    el('section', { class: 'nf-nur-druck' },
      el('p', { style: 'font-weight:600' }, `${daten.titel} – Karten`),
      el('p', {}, 'Die Beispiele stammen aus dem Text (S. 96). Die Anregungen sind Eigenentwurf. Kein Protokoll über Kinder.')),
    ...karten.map(karteBild),
    checklisteBild(),
    el('footer', { class: 'k-fuss nf-nur-bildschirm' },
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
