// Mini-Gärtner-Begleiter (Erwachsene, Kinder 4–7): Saison-Planer für
// Hochbeet/Kita-Garten – Monatsansicht (säen/ernten/Aufgaben), Kulturen-
// Steckbriefe, Aufgaben-Checklisten je Entwicklungsstufe und druckbares
// Pflanztagebuch. Gegärtnert wird DRAUSSEN – der Bildschirm plant nur.
// Praleska docs/10 (Top-30 Nr. 29). Politik docs/02: keine externen
// Anfragen, speichert nichts.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { monatsName, kulturenImMonat, statusImMonat, tagebuchWochen, pruefeGarten } from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const daten = await (await fetch('daten/garten.json')).json();

let monat = new Date().getMonth() + 1;
let kulturId = null;           // aufgeklappter Steckbrief
let tagebuchId = 'radieschen'; // Kultur fürs druckbare Pflanztagebuch

const STATUS_TEXT = {
  'saeen': '🌱 jetzt säen',
  'ernten': '🧺 jetzt ernten',
  'saeen+ernten': '🌱🧺 säen und ernten',
  'warten': '⏳ warten',
};

function chip(text) {
  return el('span', { style: 'display:inline-block;background:#ecfdf5;border:1px solid #a7f3d0;border-radius:999px;padding:0.1rem 0.6rem;margin:0.12rem;font-size:0.9rem' }, text);
}

function monatsKarte() {
  const { saeen, ernten } = kulturenImMonat(monat, daten.kulturen);
  return el('section', { class: 'k-karte mgb-nur-bildschirm' },
    el('h2', { style: 'margin:0 0 0.3rem;font-size:1.05rem' }, '🗓️ Saison-Planer'),
    el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Monat wählen' },
      el('button', { class: 'k-knopf k-knopf--klein k-knopf--neutral', 'aria-label': 'voriger Monat', onclick: () => { monat = monat === 1 ? 12 : monat - 1; render(); } }, '◀'),
      el('span', { style: 'font-weight:700;min-width:7.5rem;text-align:center;align-self:center' }, monatsName(monat)),
      el('button', { class: 'k-knopf k-knopf--klein k-knopf--neutral', 'aria-label': 'nächster Monat', onclick: () => { monat = monat === 12 ? 1 : monat + 1; render(); } }, '▶')),
    el('p', { style: 'margin:0.5rem 0 0.1rem;font-weight:600' }, '🌱 Jetzt säen oder pflanzen:'),
    el('p', { style: 'margin:0' }, ...(saeen.length ? saeen.map((k) => chip(`${k.emoji} ${k.name}`)) : [el('span', { style: 'color:#6b7280' }, 'Draußen ist Pause – Pläne schmieden und Vögel füttern.')])),
    el('p', { style: 'margin:0.5rem 0 0.1rem;font-weight:600' }, '🧺 Jetzt ernten:'),
    el('p', { style: 'margin:0' }, ...(ernten.length ? ernten.map((k) => chip(`${k.emoji} ${k.name}`)) : [el('span', { style: 'color:#6b7280' }, 'Noch nichts reif – Geduld gehört zum Gärtnern.')])),
    el('p', { style: 'margin:0.6rem 0 0.1rem;font-weight:600' }, `📋 Aufgaben im ${monatsName(monat)} (mit den Kindern):`),
    el('ul', { style: 'margin:0.2rem 0 0;padding-left:1.2rem' },
      ...daten.monatsaufgaben[String(monat)].map((t) => el('li', { style: 'margin:0.15rem 0' }, t))));
}

function kulturenKarte() {
  const kinder = [el('h2', { style: 'margin:0 0 0.3rem;font-size:1.05rem' }, '🥕 Unsere Kulturen (kindgeeignet)'),
    el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Kultur wählen' },
      ...daten.kulturen.map((k) => el('button', {
        class: `k-knopf k-knopf--klein ${k.id === kulturId ? '' : 'k-knopf--neutral'}`,
        'aria-expanded': String(k.id === kulturId),
        onclick: () => { kulturId = k.id === kulturId ? null : k.id; render(); },
      }, `${k.emoji} ${k.name}`)))];
  const k = daten.kulturen.find((x) => x.id === kulturId);
  if (k) {
    kinder.push(el('div', { style: 'border:1px solid #e5e7eb;border-radius:0.6rem;padding:0.6rem;margin-top:0.4rem' },
      el('p', { style: 'margin:0;font-weight:700' }, `${k.emoji} ${k.name} · ${'🌱'.repeat(k.schwierigkeit)} ${k.schwierigkeit === 1 ? 'leicht' : k.schwierigkeit === 2 ? 'mittel' : 'anspruchsvoll'} · im ${monatsName(monat)}: ${STATUS_TEXT[statusImMonat(monat, k)]}`),
      el('p', { style: 'margin:0.3rem 0 0' }, el('strong', {}, 'Standort: '), k.standort),
      el('p', { style: 'margin:0.3rem 0 0' }, el('strong', {}, 'Säen: '), k.saatMonate.map(monatsName).join(', '), el('span', {}, ' · '), el('strong', {}, 'Ernten: '), k.ernteMonate.map(monatsName).join(', ')),
      el('p', { style: 'margin:0.3rem 0 0' }, el('strong', {}, 'Mit Kindern: '), k.kinderTipp),
      k.hinweis ? el('p', { class: 'k-hinweis k-hinweis--falsch', style: 'margin:0.4rem 0 0' }, `⚠️ ${k.hinweis}`) : null,
      el('div', { class: 'k-antworten', style: 'margin-top:0.4rem' },
        el('button', { class: 'k-knopf k-knopf--klein k-knopf--neutral', onclick: () => { tagebuchId = k.id; render(); } }, `📔 Pflanztagebuch für ${k.name} vorbereiten`))));
  }
  return el('section', { class: 'k-karte mgb-nur-bildschirm' }, ...kinder.filter(Boolean));
}

function stufenKarte() {
  return el('section', { class: 'k-karte mgb-nur-bildschirm' },
    el('h2', { style: 'margin:0 0 0.3rem;font-size:1.05rem' }, '✅ Aufgaben-Checkliste je Entwicklungsstufe'),
    ...daten.stufen.map((s) => el('div', { style: 'margin-top:0.4rem' },
      el('p', { style: 'margin:0;font-weight:700' }, `${s.emoji} ${s.name}`),
      el('ul', { style: 'margin:0.2rem 0;padding-left:1.2rem' },
        ...s.aufgaben.map((a) => el('li', { style: 'margin:0.15rem 0' }, a))),
      el('p', { style: 'margin:0 0 0.2rem;font-size:0.88rem;color:#4b5563' }, `Begleitung: ${s.begleitung}`))));
}

function tagebuchKarte() {
  const k = daten.kulturen.find((x) => x.id === tagebuchId) || daten.kulturen[0];
  const wochen = tagebuchWochen(k);
  const zeilen = [];
  for (let i = 1; i <= wochen; i++) {
    zeilen.push(el('div', { style: 'border:1px solid #9ca3af;border-radius:0.4rem;padding:0.35rem 0.5rem;margin-top:0.35rem;break-inside:avoid' },
      el('p', { style: 'margin:0;font-weight:600' }, `Woche ${i} · Datum: ____________`),
      el('div', { style: 'display:flex;gap:0.6rem;align-items:stretch;margin-top:0.25rem' },
        el('div', { style: 'flex:1;border:1px dashed #9ca3af;border-radius:0.3rem;min-height:4.2rem;padding:0.2rem;color:#6b7280;font-size:0.8rem' }, 'So sieht meine Pflanze aus (malen):'),
        el('div', { style: 'width:11rem;font-size:0.85rem' },
          el('p', { style: 'margin:0' }, 'So groß: ______ cm'),
          el('p', { style: 'margin:0.3rem 0 0' }, 'Ich habe:'),
          el('p', { style: 'margin:0.1rem 0 0' }, '☐ gegossen'),
          el('p', { style: 'margin:0.1rem 0 0' }, '☐ gelockert · ☐ gejätet')))));
  }
  return el('section', { class: 'k-karte mgb-blatt' },
    // Keine Zeile fuer den Namen: ein Druckblatt mit Namensfeld ist der
    // Anfang eines Vergleichs von Kindern auf Papier (docs/02).
    el('div', { style: 'display:flex;justify-content:space-between;gap:1rem;align-items:baseline;flex-wrap:wrap' },
      el('p', { style: 'margin:0;font-weight:700;font-size:1.1rem' }, `📔 Mein Pflanztagebuch: ${k.emoji} ${k.name}`),),
    el('p', { style: 'margin:0.3rem 0 0' }, 'Ich habe gesät am: ____________'),
    ...zeilen,
    el('p', { style: 'margin:0.5rem 0 0' }, '🧺 Geerntet habe ich am: ____________ · So viele: ________'),
    el('p', { style: 'margin:0.4rem 0 0;font-size:0.8rem;color:#6b7280' }, 'info70-Pflanztagebuch · frei nutzbar (OER) · wird auf Papier ausgefüllt'));
}

function render() {
  app.replaceChildren(...[
    el('h1', { class: 'k-titel mgb-nur-bildschirm' }, '🌱 Mini-Gärtner-Begleiter'),
    el('p', { class: 'k-untertitel mgb-nur-bildschirm' }, 'Hochbeet & Kita-Garten mit Kindern – gegärtnert wird draußen, der Bildschirm plant nur'),
    monatsKarte(),
    kulturenKarte(),
    stufenKarte(),
    el('section', { class: 'k-karte mgb-nur-bildschirm' },
      el('h2', { style: 'margin:0 0 0.3rem;font-size:1.05rem' }, '📔 Druckbares Pflanztagebuch'),
      el('p', { style: 'margin:0 0 0.4rem;font-size:0.92rem' }, 'Unten steht das Tagebuch für die gewählte Kultur (über die Steckbriefe wechselbar). Drucken – die Kinder malen, messen und haken auf Papier ab.'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: () => window.print() }, '🖨️ Pflanztagebuch drucken'))),
    tagebuchKarte(),
    el('footer', { class: 'k-fuss mgb-nur-bildschirm' },
      el('span', {}, 'Werkzeug für Fachkräfte & Familien (Kinder 4–7 gärtnern draußen) · nichts wird gespeichert · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')),
  ].filter(Boolean));
}

const fehler = pruefeGarten(daten);
if (fehler.length) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' }, el('p', { style: 'margin:0' }, `Datenfehler: ${fehler[0]}`)));
} else {
  render();
}
