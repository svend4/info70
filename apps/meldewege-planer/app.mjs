// Meldewege-Planer (für Betreiber, docs/09 Nr. 177). Führt durch den Aufbau
// eines kindgerechten Meldewegs (Auslöser, Erreichbarkeit, Rückmeldung, Hilfe)
// und exportiert (a) kindgerechte Melde-Texte in de/uk/ru und (b) eine
// Prozess-Dokumentation. DSA/JuSchG/UN-KRK. Politik docs/02: keine externen
// Anfragen; die Konfiguration bleibt lokal.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { baueMeldetexte, baueProzessDoku } from './logik.mjs';

installiereNetzwerkWaechter();

const SCHLUESSEL = 'mwp.cfg';
const app = document.getElementById('app');
const daten = await fetch('daten/meldewege.json').then((r) => r.json());
const SPRACHEN = [['de', 'Deutsch'], ['uk', 'Українська'], ['ru', 'Русский']];

const lade = () => ({ gruende: [], reaktion: '24h', bestaetigung: true, rueckmeldung: false, ansprechpartner: '', sprache: 'de', ...JSON.parse(localStorage.getItem(SCHLUESSEL) ?? '{}') });
const speichere = (c) => localStorage.setItem(SCHLUESSEL, JSON.stringify(c));

const herunterladen = (inhalt, name) => { const url = URL.createObjectURL(new Blob([inhalt], { type: 'text/plain;charset=utf-8' })); const a = el('a', { href: url, download: name }); a.click(); URL.revokeObjectURL(url); };

function feld(wert, label, min) {
  const t = el('textarea', { readonly: true, style: `width:100%;min-height:${min};font-family:monospace;font-size:0.8rem;border:2px solid var(--k-rand);border-radius:0.5rem;padding:0.5rem`, 'aria-label': label });
  t.value = wert;
  return t;
}

function render() {
  const cfg = lade();
  const doku = baueProzessDoku(daten, cfg);
  const melde = baueMeldetexte(daten, cfg.sprache);
  const dokuFeld = feld(doku, 'Prozess-Dokumentation', '14rem');
  const meldeFeld = feld(melde, 'Kindgerechte Melde-Texte', '10rem');

  const knopf = (aktiv, label, onclick) => el('button', { class: `k-knopf k-knopf--klein${aktiv ? '' : ' k-knopf--neutral'}`, 'aria-pressed': String(aktiv), onclick }, label);

  const nameFeld = el('input', { type: 'text', value: cfg.ansprechpartner, maxlength: 60, style: 'width:100%;padding:0.5rem;border:2px solid var(--k-rand);border-radius:0.5rem', 'aria-label': 'Ansprechperson (Rolle/Redaktion, kein Kindername)', placeholder: 'z. B. „Redaktion Kinderseite“' });
  nameFeld.addEventListener('input', () => { const c = lade(); c.ansprechpartner = nameFeld.value; speichere(c); const z = app.querySelector('#mwp-doku'); if (z) z.value = baueProzessDoku(daten, c); });

  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '📮 Meldewege-Planer'),
    el('p', { class: 'k-untertitel' }, 'Einen kindgerechten Meldeweg aufbauen – und fertige Texte + Prozess-Doku erhalten (für Betreiber)'),
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-weight:600;margin-top:0' }, '1) Was soll gemeldet werden können?'),
      ...daten.ausloeser.map((a) => {
        const box = el('input', { type: 'checkbox', id: `mwp-${a.id}`, style: 'width:1.5rem;height:1.5rem;flex-shrink:0;margin-top:0.15rem' });
        box.checked = cfg.gruende.includes(a.id);
        box.addEventListener('change', () => { const c = lade(); const s = new Set(c.gruende); box.checked ? s.add(a.id) : s.delete(a.id); c.gruende = [...s]; speichere(c); render(); });
        return el('div', { style: 'display:flex;gap:0.6rem;align-items:flex-start;padding:0.3rem 0' }, box, el('label', { for: `mwp-${a.id}` }, el('span', { style: 'font-weight:600' }, a.name), el('small', { style: 'display:block;color:#4b5563' }, `Kind sieht: „${a.kinder}“`)));
      })),
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-weight:600;margin-top:0' }, '2) Wie schnell reagiert ihr?'),
      el('div', { class: 'k-antworten' }, ...daten.reaktionszeiten.map((r) => knopf(r.id === cfg.reaktion, r.name, () => { const c = lade(); c.reaktion = r.id; speichere(c); render(); }))),
      el('p', { style: 'font-weight:600;margin:0.8rem 0 0.3rem' }, 'Ansprechperson (Rolle, kein Kindername):'),
      nameFeld),
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-weight:600;margin-top:0' }, '3) Rückmeldung an das Kind'),
      ...[['bestaetigung', 'Eingang bestätigen („Danke, wir haben deine Meldung“)'], ['rueckmeldung', 'Über das Ergebnis zurückmelden']].map(([k, label]) => {
        const box = el('input', { type: 'checkbox', id: `mwp-${k}`, style: 'width:1.5rem;height:1.5rem;flex-shrink:0' });
        box.checked = Boolean(cfg[k]);
        box.addEventListener('change', () => { const c = lade(); c[k] = box.checked; speichere(c); render(); });
        return el('div', { style: 'display:flex;gap:0.6rem;align-items:center;padding:0.3rem 0' }, box, el('label', { for: `mwp-${k}` }, label));
      })),
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🧒 Kindgerechte Melde-Texte'),
      el('div', { class: 'k-antworten', style: 'margin-bottom:0.5rem' }, ...SPRACHEN.map(([code, name]) => knopf(code === cfg.sprache, name, () => { const c = lade(); c.sprache = code; speichere(c); render(); }))),
      meldeFeld,
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--klein', onclick: () => herunterladen(melde, `melde-texte-${cfg.sprache}.txt`) }, '💾 Speichern'),
        el('button', { class: 'k-knopf k-knopf--klein', onclick: (ev) => { meldeFeld.select(); navigator.clipboard?.writeText(melde); ev.target.textContent = '✔️'; } }, '📋 Kopieren'))),
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '📋 Prozess-Dokumentation'),
      Object.assign(dokuFeld, { id: 'mwp-doku' }),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--klein', onclick: () => herunterladen(app.querySelector('#mwp-doku').value, 'meldeweg-konzept.txt') }, '💾 Als Datei speichern'),
        el('button', { class: 'k-knopf k-knopf--klein', onclick: (ev) => { const z = app.querySelector('#mwp-doku'); z.select(); navigator.clipboard?.writeText(z.value); ev.target.textContent = '✔️ Kopiert!'; } }, '📋 Kopieren'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => { localStorage.removeItem(SCHLUESSEL); render(); } }, '🧹 Zurücksetzen'))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-size:0.85rem;color:#4b5563;margin:0' }, 'Grundlage: DSA Art. 16/20 (Melde- und Beschwerdeverfahren), § 24a JuSchG (Vorsorge), UN-KRK Art. 12/19. Hilfe zur Selbsthilfe, keine Rechtsberatung.')),
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werkzeug für Erwachsene · läuft offline · Konfiguration bleibt auf diesem Gerät · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

render();
