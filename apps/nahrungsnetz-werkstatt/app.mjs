// Nahrungsnetz-Werkstatt: Ökosystem-Simulator (8-12, 5-7 in Ko-Nutzung).
// Lebensgemeinschaft wählen, eine Art verändern, sehen was als Nächstes
// passiert (ein Schritt). Bewusst vereinfachtes Modell (BNE). Praleska docs/10
// (Top-30 Nr. 21). Politik docs/02: keine externen Anfragen, speichert nichts.
import { el, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { boot as bootAnzeige } from '../../packages/kinder-ui/js/anzeige.mjs';
import { pruefeNetze, startBestand, simuliere, artName, erklaere } from './logik.mjs';

installiereNetzwerkWaechter();
bootAnzeige();

const app = document.getElementById('app');
const daten = await fetch('daten/netze.json').then((r) => r.json());
const MAX = daten.maxBestand ?? 5;

let netz = daten.netze[0];
let bestand = startBestand(netz, daten);
let letzteErklaerung = null;

const EBENE = { produzent: '🌱 Pflanze', pflanzenfresser: '🐭 Pflanzenfresser', fleischfresser: '🦊 Fleischfresser' };

function balken(wert) {
  return el('span', { 'aria-hidden': 'true', style: 'letter-spacing:2px' }, '●'.repeat(wert) + '○'.repeat(MAX - wert));
}

function artZeile(a) {
  const wert = bestand[a.id] ?? 0;
  const schutz = a.geschuetzt ? ' 🛡️' : '';
  return el('div', { style: 'padding:0.5rem 0;border-top:1px solid var(--k-rand)' },
    el('div', { style: 'display:flex;justify-content:space-between;align-items:center;gap:0.5rem;flex-wrap:wrap' },
      el('span', { style: 'font-weight:600' }, `${a.emoji} ${a.name}${schutz}`),
      el('span', { 'aria-label': `Bestand ${wert} von ${MAX}` }, balken(wert), ` ${wert}/${MAX}`)),
    el('small', { style: 'color:#4b5563' }, EBENE[a.ebene] ?? a.ebene),
    el('div', { class: 'k-antworten', style: 'margin-top:0.3rem' },
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', 'aria-label': `mehr ${a.name}`, disabled: wert >= MAX, onclick: () => schritt(a.id, +1) }, '➕ mehr'),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', 'aria-label': `weniger ${a.name}`, disabled: wert <= 0, onclick: () => schritt(a.id, -1) }, '➖ weniger')));
}

function schritt(artId, delta) {
  letzteErklaerung = erklaere(netz, bestand, artId, delta, MAX);
  bestand = simuliere(netz, bestand, artId, delta, MAX);
  render();
}

function wechsleNetz(id) {
  netz = daten.netze.find((n) => n.id === id) ?? daten.netze[0];
  bestand = startBestand(netz, daten);
  letzteErklaerung = null;
  render();
}

function render() {
  const kettenText = netz.ketten.map((k) => `${artName(netz, k.beute)} → ${artName(netz, k.fresser)}`).join(' · ');
  app.replaceChildren(...[
    el('h1', { class: 'k-titel' }, '🕸️ Nahrungsnetz-Werkstatt'),
    el('p', { class: 'k-untertitel' }, 'Verändere eine Art – und sieh, was als Nächstes passiert'),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0;font-size:0.9rem' }, daten.hinweis)),
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.05rem' }, 'Lebensgemeinschaft'),
      el('div', { class: 'k-antworten', role: 'radiogroup', 'aria-label': 'Lebensgemeinschaft' },
        ...daten.netze.map((n) => el('button', {
          class: `k-knopf k-knopf--klein ${n.id === netz.id ? '' : 'k-knopf--neutral'}`,
          role: 'radio', 'aria-checked': String(n.id === netz.id),
          onclick: () => wechsleNetz(n.id),
        }, `${n.emoji} ${n.name}`))),
      el('p', { style: 'margin:0.4rem 0 0;font-size:0.82rem;color:#4b5563' }, `Wer frisst wen: ${kettenText}`)),
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.05rem' }, `${netz.emoji} ${netz.name} – wer lebt hier?`),
      ...netz.arten.map(artZeile),
      el('div', { class: 'k-antworten', style: 'margin-top:0.5rem' },
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => wechsleNetz(netz.id) }, '↩️ Zurück ins Gleichgewicht'))),
    letzteErklaerung ? el('section', { class: 'k-karte', style: `background:${letzteErklaerung.warnung ? '#fef3c7' : '#eff6ff'}` },
      el('p', { style: 'margin:0;font-weight:700' }, `Du hast ${letzteErklaerung.richtung} ${letzteErklaerung.art} gemacht. Was passiert?`),
      letzteErklaerung.folgen.length
        ? el('ul', { style: 'margin:0.3rem 0 0;padding-inline-start:1.2rem' }, ...letzteErklaerung.folgen.map((f) => el('li', { style: 'margin:0.15rem 0' }, f)))
        : el('p', { style: 'margin:0.3rem 0 0' }, 'Diese Art hat gerade keine direkten Nachbarn im Netz, die sofort reagieren.'),
      letzteErklaerung.warnung ? el('p', { style: 'margin:0.4rem 0 0;font-weight:600;color:#b45309' }, `⚠️ ${letzteErklaerung.warnung}`) : null,
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', style: 'margin-top:0.3rem', onclick: () => vorlesen(`Du hast ${letzteErklaerung.richtung} ${letzteErklaerung.art} gemacht. ${letzteErklaerung.folgen.join(' ')} ${letzteErklaerung.warnung ?? ''}`) }, '🔊 Vorlesen')) : null,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · nichts wird gespeichert · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')),
  ].filter(Boolean));
}

const fehler = pruefeNetze(daten);
if (fehler.length) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' }, el('p', { style: 'margin:0' }, `Datenfehler: ${fehler[0]}`)));
} else {
  render();
}
