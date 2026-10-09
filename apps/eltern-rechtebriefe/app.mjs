// Eltern-Rechtebriefe (für Eltern/Fachkräfte, docs/09 Nr. 189). Musterbrief-
// Sammlung zum Ausüben der DSGVO-Rechte: Auskunft (Art. 15), Löschung
// (Art. 17), Widerruf der Einwilligung (Art. 7) – mit Ausfüllhilfe und
// Kopier-Funktion. Datenvermeidung: die Angaben leben nur im Speicher der
// Seite und werden NICHT gespeichert. Politik docs/02: keine externen Anfragen.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { BRIEFE, findeBrief, baueBrief } from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const cfg = { empfaenger: '', dienst: '', absender: '', adresse: '', datum: '', betroffene: '', einwilligung: '' }; // nur im Speicher, nicht gespeichert
let aktuell = BRIEFE[0].id;

function aktualisiere() {
  const feld = app.querySelector('#erb-brief');
  if (feld) feld.value = baueBrief(aktuell, cfg);
}

function eingabe(label, key, platz) {
  const input = el('input', { type: 'text', value: cfg[key], maxlength: 80, style: 'width:100%;padding:0.5rem;border:2px solid var(--k-rand);border-radius:0.5rem', 'aria-label': label, placeholder: platz });
  input.addEventListener('input', () => { cfg[key] = input.value; aktualisiere(); });
  return el('label', { style: 'display:block;margin:0.4rem 0' }, el('span', { style: 'display:block;font-weight:600;font-size:0.9rem;margin-bottom:0.2rem' }, label), input);
}

function render() {
  const b = findeBrief(aktuell);
  const briefFeld = el('textarea', { id: 'erb-brief', readonly: true, style: 'width:100%;min-height:16rem;font-family:monospace;font-size:0.82rem;border:2px solid var(--k-rand);border-radius:0.5rem;padding:0.5rem', 'aria-label': 'Fertiger Brief' });
  briefFeld.value = baueBrief(aktuell, cfg);

  const herunterladen = () => { const url = URL.createObjectURL(new Blob([briefFeld.value], { type: 'text/plain;charset=utf-8' })); const a = el('a', { href: url, download: `${aktuell}-dsgvo.txt` }); a.click(); URL.revokeObjectURL(url); };

  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '✉️ Eltern-Rechtebriefe'),
    el('p', { class: 'k-untertitel' }, 'Fertige Musterbriefe für die DSGVO-Rechte Ihres Kindes – ausfüllen, kopieren, absenden'),
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-weight:600;margin-top:0' }, '1) Welches Recht möchten Sie ausüben?'),
      el('div', { class: 'k-antworten' }, ...BRIEFE.map((x) => el('button', {
        class: `k-knopf k-knopf--klein${x.id === aktuell ? '' : ' k-knopf--neutral'}`, 'aria-pressed': String(x.id === aktuell),
        onclick: () => { aktuell = x.id; render(); },
      }, `${x.name} (${x.artikel})`)))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-weight:600;margin-top:0' }, '2) Angaben (nur für den Brief, werden nicht gespeichert)'),
      eingabe('Verantwortliche Stelle / Empfänger', 'empfaenger', 'z. B. Datenschutz der KinderApp GmbH'),
      eingabe('Dienst / Angebot', 'dienst', 'z. B. name-der-app.de'),
      eingabe('Ihr Name', 'absender', 'z. B. Erika Musterfrau'),
      eingabe('Ihre Anschrift', 'adresse', 'Straße, PLZ Ort'),
      eingabe('Ort, Datum', 'datum', 'z. B. Köln, 18.07.2026'),
      eingabe('Name des Kindes / der betroffenen Person', 'betroffene', 'z. B. Max Musterkind'),
      aktuell === 'widerruf' ? eingabe('Zweck der Einwilligung (für den Widerruf)', 'einwilligung', 'z. B. Newsletter-Versand') : ''),
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, `📄 ${b.name}`),
      briefFeld,
      // Ein <textarea> druckt in den meisten Browsern nur seinen sichtbaren
      // Ausschnitt. Der Brief steht darum zusaetzlich in einem <pre>, das nur
      // im Druck erscheint.
      el('pre', { class: 'erb-nur-druck' }, briefFeld.value),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--klein', onclick: (ev) => { briefFeld.select(); navigator.clipboard?.writeText(briefFeld.value); ev.target.textContent = '✔️ Kopiert!'; } }, '📋 Kopieren'),
        el('button', { class: 'k-knopf k-knopf--klein', onclick: herunterladen }, '💾 Als .txt speichern'),
        el('button', { class: 'k-knopf k-knopf--klein', onclick: () => window.print() }, '🖨️ Drucken'))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-size:0.85rem;color:#4b5563;margin:0' }, 'Muster ohne Gewähr, keine Rechtsberatung. Am besten per Einschreiben oder E-Mail senden und eine Kopie aufbewahren. Bei Nichtreaktion: Beschwerde bei der Datenschutz-Aufsichtsbehörde (Art. 77 DSGVO).')),
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werkzeug für Erwachsene · läuft offline · nichts wird gespeichert · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
  aktualisiere();
}

render();
