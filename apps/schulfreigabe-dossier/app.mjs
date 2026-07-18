// Schulfreigabe-Dossier „Null-Daten-Nachweis“ (für schulische Datenschutz-
// beauftragte, docs/09 Ось E). Formular -> fertiges Prüfdossier (technische
// Erklärung, Muster-Verfahrensbeschreibung, Checkliste, BFSG/EAA-Erklärung).
// Datensparsamkeit: die eingetippten Angaben bleiben NUR im Arbeitsspeicher
// und werden gedruckt, nie gespeichert. Politik docs/02: keine externen Anfragen.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { FELDER, baueDossier } from './dossier.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const werte = {}; // nur im Arbeitsspeicher – bewusst KEIN localStorage

function kopiere(text) {
  if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => fallbackKopie(text));
  else fallbackKopie(text);
}
function fallbackKopie(text) {
  const ta = el('textarea', { style: 'position:fixed;left:-9999px' }); ta.value = text;
  document.body.appendChild(ta); ta.select();
  try { document.execCommand('copy'); } catch (e) { /* ignore */ }
  ta.remove();
}

function render() {
  const felder = Object.entries(FELDER).map(([code, def]) => {
    const eingabe = el('input', {
      style: 'width:100%;padding:0.5rem;border:2px solid var(--k-rand);border-radius:0.5rem',
      placeholder: def.platzhalter, 'aria-label': def.label, maxlength: 120,
      oninput: (e) => { werte[code] = e.target.value; aktualisierePreview(); },
    });
    eingabe.value = werte[code] ?? '';
    return el('label', { style: 'display:block;margin-top:0.4rem' },
      el('span', { style: 'font-weight:600;display:block' }, def.label), eingabe);
  });

  const preview = el('pre', { id: 'sd-preview', style: 'white-space:pre-wrap;font-family:inherit;margin:0;font-size:0.95rem;line-height:1.4' }, baueDossier(werte));

  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🛡️ Schulfreigabe-Dossier'),
    el('p', { class: 'k-untertitel' }, 'Null-Daten-Nachweis für schulische Datenschutzbeauftragte – fertig zum Ausdrucken.'),
    el('section', { class: 'k-karte sd-nur-bildschirm' },
      el('p', { style: 'font-weight:600;margin-top:0' }, 'Angaben (optional – leere Felder bleiben als [Platzhalter])'),
      ...felder,
      el('p', { style: 'font-size:0.85rem;color:#4b5563;margin-bottom:0' }, '🔒 Diese Angaben bleiben nur auf diesem Gerät im Arbeitsspeicher und werden nicht gespeichert. Beim Neuladen sind sie weg.')),
    el('section', { class: 'k-karte' },
      el('h2', { class: 'sd-nur-bildschirm', style: 'margin-top:0;font-size:1.1rem' }, '📄 Dossier-Vorschau'),
      preview),
    el('section', { class: 'k-karte sd-nur-bildschirm' },
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: () => window.print() }, '🖨️ Dossier drucken'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => kopiere(baueDossier(werte)) }, '📋 Text kopieren'))),
    el('footer', { class: 'k-fuss sd-nur-bildschirm' },
      el('span', {}, 'für Schul-Datenschutz · werbefrei · läuft offline · keine Datenspeicherung · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

function aktualisierePreview() {
  const pre = document.getElementById('sd-preview');
  if (pre) pre.textContent = baueDossier(werte);
}

render();
