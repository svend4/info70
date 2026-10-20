// Datenschutzerklärung-Baukasten fuer Kinderseiten (fuer ERWACHSENE/Betreiber).
// Baustein-Auswahl -> zwei abgestimmte Texte: juristische Datenschutzerklaerung
// und Kinder-Version in einfacher Sprache (docs/09 Nr. 58). Formular-zu-Dokument-
// Engine wie Impressum-Generator. Politik docs/02: keine externen Anfragen.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { BAUSTEINE, baueDatenschutz } from './logik.mjs';

installiereNetzwerkWaechter();

const SCHLUESSEL = 'dsb.auswahl';
const app = document.getElementById('app');

const lade = () => JSON.parse(localStorage.getItem(SCHLUESSEL) ?? '[]');
const speichere = (a) => localStorage.setItem(SCHLUESSEL, JSON.stringify(a));

function render() {
  const auswahl = lade();
  const { juristisch, kinder } = baueDatenschutz(auswahl);

  const feld = (wert, label) => {
    const t = el('textarea', { readonly: true, style: 'width:100%;min-height:11rem;font-family:monospace;font-size:0.78rem;border:2px solid var(--k-rand);border-radius:0.5rem;padding:0.5rem', 'aria-label': label });
    t.value = wert;
    return t;
  };
  const jurFeld = feld(juristisch, 'Juristische Datenschutzerklärung');
  const kindFeld = feld(kinder, 'Kinder-Version');

  const herunterladen = (inhalt, name) => { const url = URL.createObjectURL(new Blob([inhalt], { type: 'text/plain;charset=utf-8' })); const a = el('a', { href: url, download: name }); a.click(); URL.revokeObjectURL(url); };

  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🔒 Datenschutz-Baukasten'),
    el('p', { class: 'k-untertitel' }, 'Zwei abgestimmte Texte für deine Kinderseite – juristisch + kindgerecht (für Betreiber)'),
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-weight:600;margin-top:0' }, '1) Welche Funktionen hat deine Seite?'),
      el('p', { style: 'font-size:0.9rem;color:#4b5563;margin-top:0' }, 'Nur ankreuzen, was wirklich zutrifft – je weniger, desto datensparsamer.'),
      ...BAUSTEINE.map((b) => {
        const box = el('input', { type: 'checkbox', id: `dsb-${b.code}`, style: 'width:3rem;height:3rem;flex-shrink:0' });
        box.checked = auswahl.includes(b.code);
        box.addEventListener('change', () => { const a = new Set(lade()); box.checked ? a.add(b.code) : a.delete(b.code); speichere([...a]); render(); });
        return el('div', { style: 'display:flex;gap:0.6rem;align-items:center;padding:0.3rem 0' }, box, el('label', { for: `dsb-${b.code}` }, b.name));
      })),
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '⚖️ Juristische Datenschutzerklärung'),
      jurFeld,
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--klein', onclick: () => herunterladen(juristisch, 'datenschutz.txt') }, '💾 Speichern'),
        el('button', { class: 'k-knopf k-knopf--klein', onclick: (ev) => { jurFeld.select(); navigator.clipboard?.writeText(juristisch); ev.target.textContent = '✔️'; } }, '📋 Kopieren'))),
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🧒 Kinder-Version (einfache Sprache)'),
      kindFeld,
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--klein', onclick: () => herunterladen(kinder, 'datenschutz-kinder.txt') }, '💾 Speichern'),
        el('button', { class: 'k-knopf k-knopf--klein', onclick: (ev) => { kindFeld.select(); navigator.clipboard?.writeText(kinder); ev.target.textContent = '✔️'; } }, '📋 Kopieren'))),
    el('section', { class: 'k-karte' },
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => { localStorage.removeItem(SCHLUESSEL); render(); } }, '🧹 Auswahl leeren'),
      el('p', { style: 'font-size:0.85rem;color:#4b5563;margin-bottom:0' }, 'Hilfe zur Selbsthilfe, keine Rechtsberatung. Die Kinder-Version ersetzt nicht die rechtlich verbindliche Erklärung, sondern ergänzt sie (Art. 12 DSGVO: verständlich, insbesondere für Kinder).')),
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werkzeug für Erwachsene · läuft offline · Auswahl bleibt auf diesem Gerät · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

render();
