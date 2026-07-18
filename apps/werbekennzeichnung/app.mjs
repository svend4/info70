// Werbekennzeichnungs-Vorschau (fuer ERWACHSENE/Betreiber).
// Betreiber waehlt einen Anzeigentyp und sieht in einer Live-Vorschau, wie die
// Kennzeichnung nach JMStV/MStV korrekt aussieht - plus Negativ-Beispiele und
// Copy-Paste-HTML (docs/09 Nr. 155). Politik docs/02: keine externen Anfragen.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const daten = await fetch('daten/vorlagen.json').then((r) => r.json());
let aktiv = daten.typen[0].code;

function render() {
  const typ = daten.typen.find((t) => t.code === aktiv) ?? daten.typen[0];
  // Eigene, vertrauenswuerdige Vorlage (kein externer Inhalt) -> innerHTML ok.
  const vorschau = el('div', { style: 'border:2px dashed var(--k-rand);border-radius:0.6rem;padding:0.8rem;background:#fafafa' });
  vorschau.innerHTML = typ.richtigHtml;

  const htmlFeld = el('textarea', { readonly: true, style: 'width:100%;min-height:6rem;font-family:monospace;font-size:0.78rem;border:2px solid var(--k-rand);border-radius:0.5rem;padding:0.5rem', 'aria-label': 'HTML-Vorlage' });
  htmlFeld.value = typ.richtigHtml;

  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🏷️ Werbekennzeichnung'),
    el('p', { class: 'k-untertitel' }, 'So kennzeichnest du Werbung auf einer Kinderseite richtig (für Betreiber)'),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0;font-size:0.9rem' }, daten.hinweis),
      el('p', { style: 'font-weight:600;margin-bottom:0.4rem' }, 'Anzeigentyp wählen:'),
      el('div', { style: 'display:flex;gap:0.4rem;flex-wrap:wrap' },
        ...daten.typen.map((t) =>
          el('button', { class: `k-knopf k-knopf--klein ${aktiv === t.code ? '' : 'k-knopf--neutral'}`, 'aria-pressed': String(aktiv === t.code), onclick: () => { aktiv = t.code; render(); } }, t.name)))),
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, `✅ Richtig: ${typ.name}`),
      el('p', { style: 'font-size:0.9rem' }, typ.beschreibung),
      vorschau,
      el('p', { style: 'font-weight:600;margin:0.75rem 0 0.25rem' }, 'Die Regeln:'),
      el('ul', { style: 'margin:0;padding-left:1.2rem' }, ...typ.regeln.map((r) => el('li', { style: 'margin:0.25rem 0;font-size:0.92rem' }, r)))),
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🚫 So nicht (Negativ-Beispiele)'),
      ...typ.negativ.map((n) => el('div', { class: 'k-hinweis k-hinweis--falsch', style: 'margin:0.4rem 0' },
        el('p', { style: 'margin:0;font-weight:600' }, n.beispiel),
        el('p', { style: 'margin:0.2rem 0 0;font-size:0.9rem' }, n.warum)))),
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '📋 Vorlage zum Einbauen (Copy-Paste-HTML)'),
      htmlFeld,
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--klein', onclick: (ev) => { htmlFeld.select(); navigator.clipboard?.writeText(htmlFeld.value); ev.target.textContent = '✔️ Kopiert!'; } }, '📋 HTML kopieren'))),
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werkzeug für Erwachsene · läuft offline · speichert nichts · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

render();
