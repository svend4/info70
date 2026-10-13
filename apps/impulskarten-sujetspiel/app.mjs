// Impulskarten für das sujetabbildende Spiel (1–3 Jahre) – Praleska docs/10, Nr. 77.
// Werkzeug für Fachkräfte. Die Karten zeigen Situationen; die Lösung findet das Kind.
// Jede Karte trägt ihre Quelle oder die Markierung Eigenentwurf. Nichts wird
// gespeichert, keine externen Anfragen (docs/02). Der Druck zeigt nur die Karten.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { kartenFuer, pruefeDaten, quelleTextVon, zielVon } from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const daten = await fetch('daten/karten.json').then((r) => r.json());

// Der einzige Zustand: welche Aufgabe und welche Figur gerade gewählt sind.
// Im Speicher, nicht auf der Platte.
let ziel = null;
let figur = null;

const FIGUR_NAME = Object.fromEntries(daten.figuren.map((f) => [f.id, f.text]));
const nummer = (id) => daten.ziele.findIndex((z) => z.id === id) + 1;

function knopf(text, aktiv, onklick, id = null) {
  return el('button', {
    class: `k-knopf k-knopf--klein${aktiv ? '' : ' k-knopf--neutral'}`,
    'aria-pressed': String(aktiv),
    ...(id ? { id } : {}),
    onclick: onklick,
  }, text);
}

function aufgabeZeile(z, i) {
  const anzahl = kartenFuer(daten, { ziel: z.id }).length;
  return el('div', { class: 'ik-zeile' },
    el('p', { class: 'ik-name' }, `${i + 1}. ${z.text}`),
    el('p', { class: 'ik-quelle' }, `${z.quelle} · russisch: „${z.zitat}“`),
    knopf(`Karten zu dieser Aufgabe (${anzahl})`, ziel === z.id, () => {
      ziel = ziel === z.id ? null : z.id;
      zeichne();
    }, `ik-aufgabe-${z.id}`));
}

function karteBild(k) {
  const aufgabe = zielVon(daten, k.ziel);
  return el('article', { class: 'k-karte ik-karte', id: `ik-${k.id}` },
    el('h2', { class: 'ik-kartentitel' }, k.titel),
    el('p', { class: 'ik-figur' }, `Figur: ${FIGUR_NAME[k.figur]}`),
    el('p', {}, k.situation),
    el('p', { class: 'ik-quelle' }, `Aufgabe ${nummer(k.ziel)} (${aufgabe.quelle}) · ${quelleTextVon(k)}`));
}

function zeichne() {
  const karten = kartenFuer(daten, { ziel, figur });
  app.replaceChildren(
    el('h1', { class: 'k-titel ik-nur-bildschirm' }, `🃏 ${daten.titel}`),
    el('p', { class: 'k-untertitel ik-nur-bildschirm' }, 'Kleine Spielsituationen für Kinder von 1 bis 3 Jahren – mit Puppe, Stofftier oder Spielzeug'),
    el('section', { class: 'k-karte ik-nur-bildschirm' },
      el('p', { style: 'margin-top:0;font-weight:600' }, daten.hinweis),
      el('p', {}, daten.wasEsIst),
      el('p', { class: 'ik-quelle' }, `Quelle: ${daten.quelle.werk}`),
      el('p', {}, `Sujetabbildendes Spiel: ${daten.faktenZumSpiel.altersBereich} (${daten.faktenZumSpiel.quelleAlter}). Rollenspiel: ${daten.faktenZumSpiel.rollenspielAb} (${daten.faktenZumSpiel.quelleRollenspiel}).`),
      el('p', { class: 'ik-quelle' }, daten.faktenZumSpiel.hinweisTitel)),
    el('section', { class: 'k-karte ik-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, 'Die sechs Aufgaben der Quelle'),
      el('p', { class: 'ik-quelle' }, 'Aufgaben für die Fachkraft, nicht Lernziele der Kinder (S. 7, S. 68–69).'),
      ...daten.ziele.map(aufgabeZeile)),
    el('section', { class: 'k-karte ik-nur-bildschirm' },
      el('p', { style: 'font-weight:600;margin-top:0' }, 'Figur wählen'),
      el('div', { class: 'k-antworten' },
        knopf('Alle Figuren', figur === null, () => { figur = null; zeichne(); }),
        ...daten.figuren.map((f) => knopf(f.text, figur === f.id, () => {
          figur = figur === f.id ? null : f.id;
          zeichne();
        })))),
    el('section', { class: 'ik-nur-bildschirm', style: 'margin-top:1rem' },
      el('p', { style: 'font-weight:600' }, `${karten.length} ${karten.length === 1 ? 'Karte' : 'Karten'} in dieser Auswahl`),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', id: 'ik-drucken', disabled: karten.length === 0 ? true : null, onclick: () => window.print() }, '🖨️ Diese Karten drucken'))),
    el('section', { class: 'ik-nur-druck' },
      el('p', { style: 'font-weight:600' }, `${daten.titel} – Karten`),
      el('p', {}, 'Die Karten zeigen Situationen. Die Lösung findet das Kind. Ohne Quellenangabe auf der Karte: Eigenentwurf.')),
    ...(karten.length === 0
      ? [el('p', { class: 'k-hinweis ik-nur-bildschirm' }, 'Zu dieser Auswahl gibt es keine Karte.')]
      : karten.map(karteBild)),
    el('footer', { class: 'k-fuss ik-nur-bildschirm' },
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
