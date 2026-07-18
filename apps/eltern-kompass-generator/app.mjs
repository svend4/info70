// Eltern-Kompass-Generator (für Betreiber, docs/09 Nr. 163). Strukturierte
// Angaben zum eigenen Kinderangebot → fertige Eltern-Kompass-HTML-Seite
// (Vorschau + kompletter eltern.html-Download). Formular-zu-Dokument-Engine
// wie Impressum-/Datenschutz-Generator. Politik docs/02: alles lokal.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { baueSektionen, baueSeite } from './logik.mjs';

installiereNetzwerkWaechter();

const SCHLUESSEL = 'ekg.cfg';
const app = document.getElementById('app');

const lade = () => ({ appName: '', altersgruppe: '', worum: '', lernziele: '', daten: '', interaktion: '', kostenfrei: true, hinweise: '', ...JSON.parse(localStorage.getItem(SCHLUESSEL) ?? '{}') });
const speichere = (c) => localStorage.setItem(SCHLUESSEL, JSON.stringify(c));

const zuCfg = (c) => ({ ...c, lernziele: c.lernziele.split('\n'), daten: c.daten.split('\n') });
const herunterladen = (inhalt, name, typ) => { const url = URL.createObjectURL(new Blob([inhalt], { type: typ })); const a = el('a', { href: url, download: name }); a.click(); URL.revokeObjectURL(url); };

function aktualisiere() {
  const c = zuCfg(lade());
  const vorschau = app.querySelector('#ekg-vorschau');
  const htmlFeld = app.querySelector('#ekg-html');
  if (vorschau) vorschau.innerHTML = baueSektionen(c); // eigenes, script-freies HTML aus logik.mjs
  if (htmlFeld) htmlFeld.value = baueSeite(c);
}

function eingabe(label, key, cfg, opts = {}) {
  const gem = { value: cfg[key], style: 'width:100%;padding:0.5rem;border:2px solid var(--k-rand);border-radius:0.5rem;font-size:0.95rem', 'aria-label': label, placeholder: opts.platzhalter ?? '' };
  const feld = opts.mehrzeilig ? el('textarea', { ...gem, style: gem.style + ';min-height:4rem' }) : el('input', { ...gem, type: 'text' });
  feld.addEventListener('input', () => { const c = lade(); c[key] = feld.value; speichere(c); aktualisiere(); });
  return el('label', { style: 'display:block;margin:0.5rem 0' },
    el('span', { style: 'display:block;font-weight:600;font-size:0.9rem;margin-bottom:0.2rem' }, label),
    feld,
    opts.hinweis ? el('small', { style: 'color:#4b5563' }, opts.hinweis) : '');
}

function render() {
  const cfg = lade();
  const c = zuCfg(cfg);

  const kostenBox = el('input', { type: 'checkbox', id: 'ekg-kostenfrei', style: 'width:1.4rem;height:1.4rem' });
  kostenBox.checked = cfg.kostenfrei !== false;
  kostenBox.addEventListener('change', () => { const x = lade(); x.kostenfrei = kostenBox.checked; speichere(x); render(); });

  const htmlFeld = el('textarea', { id: 'ekg-html', readonly: true, style: 'width:100%;min-height:12rem;font-family:monospace;font-size:0.74rem;border:2px solid var(--k-rand);border-radius:0.5rem;padding:0.5rem', 'aria-label': 'Vollständige eltern.html' });
  htmlFeld.value = baueSeite(c);
  const vorschau = el('div', { id: 'ekg-vorschau', style: 'padding:0.5rem;border:2px dashed var(--k-rand);border-radius:0.6rem;background:#fff;overflow-x:auto' });
  vorschau.innerHTML = baueSektionen(c);

  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '👪 Eltern-Kompass-Generator'),
    el('p', { class: 'k-untertitel' }, 'Aus Angaben zum Angebot eine fertige „Für Eltern“-Seite erzeugen (für Betreiber)'),
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-weight:600;margin-top:0' }, '📝 Angaben zum Angebot'),
      eingabe('Name des Angebots', 'appName', cfg, { platzhalter: 'z. B. Rechte-Kompass' }),
      eingabe('Altersgruppe', 'altersgruppe', cfg, { platzhalter: 'z. B. 8–12 Jahre' }),
      eingabe('Worum geht es? (kurz)', 'worum', cfg, { mehrzeilig: true, platzhalter: 'Ein bis zwei Sätze für Eltern.' }),
      eingabe('Was Ihr Kind lernt (Lernziele, eine pro Zeile)', 'lernziele', cfg, { mehrzeilig: true, platzhalter: 'Rechte kennen\nMut-Sätze üben' }),
      eingabe('Welche Daten anfallen (eine pro Zeile, leer = keine)', 'daten', cfg, { mehrzeilig: true, platzhalter: 'nur der Rekord, löschbar per Knopf', hinweis: 'Leer lassen heißt: keine personenbezogenen Daten.' }),
      eingabe('Interaktion', 'interaktion', cfg, { platzhalter: 'z. B. Keine Interaktion mit Fremden.' }),
      el('div', { style: 'display:flex;gap:0.6rem;align-items:center;margin:0.5rem 0' }, kostenBox, el('label', { for: 'ekg-kostenfrei' }, 'Kostenfrei nutzbar')),
      eingabe('Zusätzlicher Hinweis (optional)', 'hinweise', cfg, { mehrzeilig: true, platzhalter: 'z. B. Klassen-Modus für den Unterricht.' })),
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '👁️ Vorschau'),
      vorschau),
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🧩 Fertige eltern.html'),
      htmlFeld,
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--klein', onclick: (ev) => { htmlFeld.select(); navigator.clipboard?.writeText(htmlFeld.value); ev.target.textContent = '✔️ Kopiert!'; } }, '📋 Kopieren'),
        el('button', { class: 'k-knopf k-knopf--klein', onclick: () => herunterladen(htmlFeld.value, 'eltern.html', 'text/html;charset=utf-8') }, '💾 eltern.html speichern'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => { localStorage.removeItem(SCHLUESSEL); render(); } }, '🧹 Leeren'))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-size:0.85rem;color:#4b5563;margin:0' }, 'Vorlage im Stil der info70-„Für Eltern“-Seiten. Als eltern.html neben die App legen. Hilfe zur Selbsthilfe, keine Rechtsberatung.')),
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werkzeug für Erwachsene · läuft offline · Angaben bleiben auf diesem Gerät · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

render();
