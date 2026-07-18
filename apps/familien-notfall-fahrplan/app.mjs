// Familien-Notfall-Fahrplan (Familie, Eltern+Kind 6-15, docs/09 Nr. 224).
// Gemeinsam ausgefüllter, druckbarer Wenn-dann-Fahrplan für den Kühlschrank.
// Datenvermeidung: Die Kontakte leben nur im Speicher der Seite und werden
// NICHT gespeichert – der Fahrplan ist zum Ausdrucken gedacht. Politik docs/02:
// keine externen Anfragen, werbefrei.
import { el, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { SCHRITTE, baueFahrplan } from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const cfg = { vertrauensperson: '', vertrauenstel: '', elternkontakt: '', weitere: '' }; // nur im Speicher, nicht gespeichert

function feld(label, key, platz) {
  const input = el('input', { type: 'text', value: cfg[key], maxlength: 60, style: 'width:100%;padding:0.5rem;border:2px solid var(--k-rand);border-radius:0.5rem', 'aria-label': label, placeholder: platz });
  input.addEventListener('input', () => { cfg[key] = input.value; const z = app.querySelector('#fnf-vorschau'); if (z) z.textContent = baueFahrplan(cfg); });
  return el('label', { class: 'fnf-nur-bildschirm', style: 'display:block;margin:0.4rem 0' }, el('span', { style: 'display:block;font-weight:600;font-size:0.9rem;margin-bottom:0.2rem' }, label), input);
}

function render() {
  app.replaceChildren(
    el('h1', { class: 'k-titel fnf-nur-bildschirm' }, '🧊 Familien-Notfall-Fahrplan'),
    el('p', { class: 'k-untertitel fnf-nur-bildschirm' }, 'Ein Plan für den Kühlschrank: Was tun, wenn im Netz etwas passiert?'),
    el('section', { class: 'k-karte fnf-nur-bildschirm' },
      el('p', { style: 'margin-top:0' }, 'Füllt den Plan gemeinsam aus und hängt ihn sichtbar auf – zum Beispiel an den Kühlschrank. So weiß jedes Kind im Ernstfall sofort, was zu tun ist. Die Kontakte werden nur ausgedruckt und nicht gespeichert.'),
      el('button', { class: 'k-knopf k-knopf--klein k-knopf--neutral', onclick: () => vorlesen('Was tun, wenn im Netz etwas passiert? ' + SCHRITTE.map((s) => s.dann).join(' ')) }, '🔊 Schritte vorlesen')),
    el('section', { class: 'k-karte fnf-nur-bildschirm' },
      el('p', { style: 'font-weight:600;margin-top:0' }, 'Eure wichtigen Kontakte (nur für den Ausdruck):'),
      feld('Vertrauensperson (Name)', 'vertrauensperson', 'z. B. Oma Rosa'),
      feld('erreichbar unter (Telefon)', 'vertrauenstel', 'z. B. 0170 …'),
      feld('Eltern erreiche ich unter', 'elternkontakt', 'z. B. Mama: 0171 …'),
      feld('Noch jemand, dem ich vertraue', 'weitere', 'z. B. Klassenlehrkraft')),
    el('section', { class: 'k-karte' },
      el('pre', { id: 'fnf-vorschau', style: 'white-space:pre-wrap;font-family:inherit;font-size:0.95rem;margin:0;line-height:1.5' }, baueFahrplan(cfg))),
    el('section', { class: 'k-karte fnf-nur-bildschirm' },
      el('button', { class: 'k-knopf', onclick: () => window.print() }, '🖨️ Fahrplan drucken / als PDF speichern'),
      el('p', { style: 'font-size:0.85rem;color:#4b5563;margin-bottom:0' }, 'Beim Drucken erscheint nur der Fahrplan. Es wird nichts gespeichert.')),
    el('footer', { class: 'k-fuss fnf-nur-bildschirm' },
      el('span', {}, 'für Familien · werbefrei · läuft offline · nichts wird gespeichert · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

render();
