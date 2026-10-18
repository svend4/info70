// Impressum-Generator fuer Kinderseiten (fuer ERWACHSENE/Betreiber).
// Offline-Formular: Rechtsform + Felder -> fertiges Impressum als Text/HTML
// (docs/09 Nr. 57). Laeuft komplett im Browser; keine Datenspeicherung ausser
// optional lokal. Politik docs/02: keine externen Anfragen.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { FELDER, KINDER_HINWEIS, RECHTSFORMEN, rechtsform, sichtbareFelder, fehlendeFelder, baueImpressum, baueImpressumHtml, HINWEISE } from './logik.mjs';

installiereNetzwerkWaechter();

const SCHLUESSEL = 'impgen.entwurf';
const app = document.getElementById('app');

const lade = () => JSON.parse(localStorage.getItem(SCHLUESSEL) ?? '{}');
const speichere = (s) => localStorage.setItem(SCHLUESSEL, JSON.stringify(s));

let zustand = { code: 'privat', redaktionell: false, werte: {}, ...lade() };

function sichern() { speichere(zustand); }

function render() {
  const felder = sichtbareFelder(zustand.code, zustand.redaktionell);
  const fehlt = fehlendeFelder(zustand.code, zustand.redaktionell, zustand.werte);
  const text = baueImpressum(zustand.code, zustand.redaktionell, zustand.werte);

  const rfWahl = el('div', { style: 'display:flex;gap:0.4rem;flex-wrap:wrap' },
    ...RECHTSFORMEN.map((r) =>
      el('button', {
        class: `k-knopf k-knopf--klein ${zustand.code === r.code ? '' : 'k-knopf--neutral'}`,
        'aria-pressed': String(zustand.code === r.code),
        onclick: () => { zustand.code = r.code; sichern(); render(); },
      }, r.name)));

  const redBox = el('input', { type: 'checkbox', id: 'ig-red', style: 'width:1.4rem;height:1.4rem' });
  redBox.checked = zustand.redaktionell;
  redBox.addEventListener('change', () => { zustand.redaktionell = redBox.checked; sichern(); render(); });

  const feldEingaben = felder.map((f) => {
    // Eingabehinweis (Kinderdaten) als eigenes Element direkt vor dem Feld; das Feld verweist per aria-describedby.
    const hinweis = FELDER[f].hinweis === true;
    const eingabe = el(f === 'redakteur_adresse' ? 'input' : 'input', {
      type: f === 'email' ? 'email' : 'text',
      id: `ig-${f}`, value: zustand.werte[f] ?? '', placeholder: FELDER[f].platzhalter,
      style: `width:100%;min-height:44px;border:2px solid ${fehlt.includes(f) ? 'var(--k-rot)' : 'var(--k-rand)'};border-radius:0.5rem;padding:0 0.6rem;font-size:1rem`,
      'aria-label': FELDER[f].label,
      ...(hinweis ? { 'aria-describedby': `ig-hinweis-${f}` } : {}),
    });
    eingabe.addEventListener('input', () => { zustand.werte[f] = eingabe.value; sichern(); render(); });
    return el('div', { style: 'margin:0.5rem 0' },
      el('label', { for: `ig-${f}`, style: 'font-weight:600;display:block;margin-bottom:0.2rem' }, FELDER[f].label),
      hinweis ? el('span', { id: `ig-hinweis-${f}`, style: 'display:block;font-size:0.85rem;color:#4b5563;margin:0 0 0.2rem' }, KINDER_HINWEIS) : null,
      eingabe);
  });

  const berichtsFeld = el('textarea', {
    readonly: true, style: 'width:100%;min-height:12rem;font-family:monospace;font-size:0.82rem;border:2px solid var(--k-rand);border-radius:0.5rem;padding:0.5rem',
    'aria-label': 'Erzeugtes Impressum',
  });
  berichtsFeld.value = text;

  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '📄 Impressum-Generator'),
    el('p', { class: 'k-untertitel' }, 'Ein rechtssicheres Impressum für deine Kinderseite – offline erzeugt (für Betreiber)'),
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-weight:600;margin-top:0' }, '1) Rechtsform wählen'),
      rfWahl,
      el('div', { style: 'display:flex;gap:0.5rem;align-items:center;margin-top:0.6rem' },
        redBox, el('label', { for: 'ig-red' }, 'Die Seite hat journalistisch-redaktionelle Inhalte (eigene Nachrichten/Meinungen) – dann ist § 18 MStV Pflicht'))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-weight:600;margin-top:0' }, '2) Angaben ausfüllen'),
      ...feldEingaben,
      fehlt.length ? el('p', { class: 'k-hinweis k-hinweis--falsch', style: 'margin:0.5rem 0 0' }, `Noch offen: ${fehlt.map((f) => FELDER[f].label).join(', ')}`) : el('p', { class: 'k-hinweis k-hinweis--richtig', style: 'margin:0.5rem 0 0' }, '✅ Alle Pflichtangaben ausgefüllt.')),
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-weight:600;margin-top:0' }, '3) Fertiges Impressum'),
      berichtsFeld,
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--klein', onclick: () => herunterladen(text, 'impressum.txt', 'text/plain') }, '💾 Als Text speichern'),
        el('button', { class: 'k-knopf k-knopf--klein', onclick: () => herunterladen(baueImpressumHtml(zustand.code, zustand.redaktionell, zustand.werte), 'impressum.html', 'text/html') }, '💾 Als HTML speichern'),
        el('button', { class: 'k-knopf k-knopf--klein', onclick: (ev) => { berichtsFeld.select(); navigator.clipboard?.writeText(text); ev.target.textContent = '✔️ Kopiert!'; } }, '📋 Kopieren'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => { localStorage.removeItem(SCHLUESSEL); zustand = { code: 'privat', redaktionell: false, werte: {} }; render(); } }, '🧹 Leeren'))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-weight:600;margin-top:0' }, '💡 Bei Kinderseiten oft vergessen'),
      el('ul', { style: 'margin:0;padding-left:1.2rem' }, ...HINWEISE.map((h) => el('li', { style: 'margin:0.25rem 0;font-size:0.9rem' }, h))),
      el('p', { style: 'font-size:0.85rem;color:#4b5563;margin-bottom:0' }, 'Hinweis: Hilfe zur Selbsthilfe, keine Rechtsberatung. Im Zweifel juristisch prüfen lassen.')),
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werkzeug für Erwachsene · läuft offline · Entwurf bleibt auf diesem Gerät · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

function herunterladen(inhalt, name, typ) {
  const url = URL.createObjectURL(new Blob([inhalt], { type: `${typ};charset=utf-8` }));
  const a = el('a', { href: url, download: name });
  a.click();
  URL.revokeObjectURL(url);
}

render();
