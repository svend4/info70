// OER-Bausteinvorlage „info70-Unterrichtsstunde“ (für LEHRKRÄFTE, docs/09 Ось E).
// Standardisierte CC-BY-Vorlage, aus der alle Stundenentwürfe gebaut werden:
// Blueprint der Abschnitte, 45-/90-Minuten-Phasenraster, Kompetenz-Mapping
// (Medienkompetenzrahmen NRW / KMK), JSON-Schema und ein druckbares Blanko-
// Formular zum Ausfüllen von Hand. Speichert NICHTS, keine externen Anfragen.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const v = await fetch('daten/vorlage.json').then((r) => r.json());

function karte(titel, ...kinder) {
  return el('section', { class: 'k-karte' }, el('h2', { style: 'margin-top:0;font-size:1.1rem' }, titel), ...kinder);
}

function blankoZeile(label) {
  return el('div', { style: 'padding:0.35rem 0;border-bottom:1px dashed var(--k-rand)' },
    el('span', { style: 'font-weight:700' }, label + ': '),
    el('span', { style: 'color:#9ca3af;overflow-wrap:anywhere' }, '________________________________________'));
}

function render() {
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, `📐 ${v.titel}`),
    el('p', { class: 'k-untertitel' }, v.untertitel),
    el('section', { class: 'k-karte ov-nur-bildschirm' },
      el('p', { style: 'margin:0' }, 'Vorlage und Raster für eigene Stundenentwürfe. '),
      el('button', { class: 'k-knopf k-knopf--klein', style: 'margin-top:0.4rem', onclick: () => window.print() }, '🖨️ Blanko-Vorlage drucken')),
    karte('🧩 Aufbau eines info70-Stundenentwurfs',
      el('ul', {}, ...v.abschnitte.map((a) => el('li', { style: 'margin:0.3rem 0' },
        el('strong', {}, a.feld), ' – ', a.hinweis)))),
    karte('🕒 Phasenraster (45 oder 90 Minuten)',
      ...v.phasen.map((p) => el('div', { style: 'padding:0.3rem 0;border-bottom:1px solid var(--k-rand)' },
        el('div', { style: 'display:flex;justify-content:space-between' },
          el('span', { style: 'font-weight:600' }, p.phase),
          el('span', { style: 'color:#4b5563' }, `${p.minuten} min`)),
        el('p', { style: 'margin:0.15rem 0 0' }, p.zweck)))),
    karte('🎯 Kompetenz-Mapping',
      ...v.kompetenzrahmen.map((k) => el('div', { style: 'margin:0.3rem 0' },
        el('p', { style: 'font-weight:600;margin:0.2rem 0' }, k.name),
        el('p', { style: 'margin:0;color:#4b5563;font-size:0.95rem' }, k.bereiche.join(' · '))))),
    karte('📝 Blanko-Vorlage (zum Ausdrucken & Ausfüllen)',
      ...v.abschnitte.map((a) => blankoZeile(a.feld)),
      el('p', { style: 'margin-top:0.5rem;font-size:0.9rem;color:#4b5563' }, `Lizenz: ${v.lizenz}`)),
    karte('🧑‍💻 JSON-Schema für digitale Entwürfe',
      el('p', { style: 'margin:0.2rem 0' }, `Datei: ${v.schema.datei}`),
      el('p', { style: 'font-weight:600;margin:0.4rem 0 0.2rem' }, 'Felder:'),
      el('ul', {}, ...v.schema.felder.map((f) => el('li', { style: 'font-family:monospace;font-size:0.9rem' }, f))),
      el('p', { style: 'font-weight:600;margin:0.4rem 0 0.2rem' }, 'Regeln:'),
      el('ul', {}, ...v.schema.regeln.map((r) => el('li', { style: 'margin:0.2rem 0' }, r)))),
    karte('📚 Beispiele im Baukasten',
      el('div', { class: 'k-antworten' }, ...v.beispiele.map((b) =>
        el('a', { class: 'k-knopf k-knopf--klein k-knopf--neutral ov-nur-bildschirm', style: 'text-decoration:none', href: `../${b.app}/` }, `📖 ${b.titel}`)))),
    el('footer', { class: 'k-fuss ov-nur-bildschirm' },
      el('span', {}, 'für Lehrkräfte · OER (CC-BY) · werbefrei · läuft offline · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

render();
