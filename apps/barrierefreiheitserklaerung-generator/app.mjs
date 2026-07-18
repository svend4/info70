// Barrierefreiheitserklärungs-Generator (für Betreiber, docs/09 Nr. 169).
// Formular ausfüllen ODER BFSG-Check-Prüfprotokoll importieren → fertige
// Erklärung zur Barrierefreiheit als Markdown/HTML (BFSG/EAA) inkl. Leichter
// Sprache und Feedback-/Durchsetzungshinweisen. Politik docs/02: alles lokal.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { baueErklaerung, leseBfsgProtokoll, KONFORMITAET } from './logik.mjs';

installiereNetzwerkWaechter();

const SCHLUESSEL = 'bfe.cfg';
const app = document.getElementById('app');

const lade = () => ({ anbieter: '', url: '', stand: '', konformitaet: 'teilweise', bekannteBarrieren: '', kontaktName: '', kontaktEmail: '', ...JSON.parse(localStorage.getItem(SCHLUESSEL) ?? '{}') });
const speichere = (c) => localStorage.setItem(SCHLUESSEL, JSON.stringify(c));

function cfgToErklaerung(c) {
  return baueErklaerung({ ...c, bekannteBarrieren: c.bekannteBarrieren.split('\n').map((s) => s.trim()).filter(Boolean) });
}

const herunterladen = (inhalt, name, typ) => { const url = URL.createObjectURL(new Blob([inhalt], { type: typ })); const a = el('a', { href: url, download: name }); a.click(); URL.revokeObjectURL(url); };

function eingabe(label, key, cfg, opts = {}) {
  const gemeinsam = { value: cfg[key], style: 'width:100%;padding:0.5rem;border:2px solid var(--k-rand);border-radius:0.5rem;font-size:0.95rem', 'aria-label': label };
  const feld = opts.mehrzeilig
    ? el('textarea', { ...gemeinsam, style: gemeinsam.style + ';min-height:4rem', placeholder: opts.platzhalter ?? '' })
    : el('input', { ...gemeinsam, type: opts.type ?? 'text', placeholder: opts.platzhalter ?? '' });
  feld.addEventListener('input', () => { const c = lade(); c[key] = feld.value; speichere(c); aktualisiereVorschau(); });
  return el('label', { style: 'display:block;margin:0.5rem 0' }, el('span', { style: 'display:block;font-weight:600;font-size:0.9rem;margin-bottom:0.2rem' }, label), feld);
}

function aktualisiereVorschau() {
  const c = lade();
  const { markdown, html } = cfgToErklaerung(c);
  const mdZiel = app.querySelector('#bfe-md');
  const htmlZiel = app.querySelector('#bfe-html');
  const vorschau = app.querySelector('#bfe-vorschau');
  if (mdZiel) mdZiel.value = markdown;
  if (htmlZiel) htmlZiel.value = html;
  if (vorschau) vorschau.innerHTML = html; // eigenes, script-freies HTML aus logik.mjs
}

function render() {
  const cfg = lade();
  const { markdown, html } = cfgToErklaerung(cfg);

  const datei = el('input', { type: 'file', accept: '.txt,text/plain', style: 'display:block;margin-top:0.3rem', 'aria-label': 'BFSG-Prüfprotokoll importieren' });
  datei.addEventListener('change', async () => {
    const f = datei.files?.[0];
    if (!f) return;
    const text = await f.text();
    const gelesen = leseBfsgProtokoll(text);
    const meldung = app.querySelector('#bfe-import-status');
    if (gelesen) {
      const c = lade(); c.konformitaet = gelesen.konformitaet; speichere(c);
      if (meldung) meldung.textContent = `✔️ Übernommen: Erfüllt ${gelesen.erfuellt} von ${gelesen.gesamt} → „${KONFORMITAET[gelesen.konformitaet]}“.`;
      render();
    } else if (meldung) {
      meldung.textContent = '⚠️ Kein BFSG-Prüfprotokoll erkannt (Zeile „Erfüllt: X von Y“ fehlt).';
    }
  });

  const konformitaetWahl = el('div', { class: 'k-antworten' },
    ...Object.entries(KONFORMITAET).map(([k, label]) => el('button', {
      class: `k-knopf k-knopf--klein${cfg.konformitaet === k ? '' : ' k-knopf--neutral'}`, 'aria-pressed': String(cfg.konformitaet === k),
      onclick: () => { const c = lade(); c.konformitaet = k; speichere(c); render(); },
    }, label)));

  const mdFeld = el('textarea', { id: 'bfe-md', readonly: true, style: 'width:100%;min-height:12rem;font-family:monospace;font-size:0.78rem;border:2px solid var(--k-rand);border-radius:0.5rem;padding:0.5rem', 'aria-label': 'Erklärung als Markdown' });
  mdFeld.value = markdown;
  const htmlFeld = el('textarea', { id: 'bfe-html', readonly: true, style: 'width:100%;min-height:9rem;font-family:monospace;font-size:0.74rem;border:2px solid var(--k-rand);border-radius:0.5rem;padding:0.5rem', 'aria-label': 'Erklärung als HTML' });
  htmlFeld.value = html;
  const vorschau = el('div', { id: 'bfe-vorschau', style: 'padding:0.8rem;border:2px dashed var(--k-rand);border-radius:0.6rem;background:#fff;overflow-x:auto' });
  vorschau.innerHTML = html;

  const kopiere = (feld, ev) => { feld.select(); navigator.clipboard?.writeText(feld.value); ev.target.textContent = '✔️ Kopiert!'; };

  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '♿ Barrierefreiheits-Erklärung'),
    el('p', { class: 'k-untertitel' }, 'Fertige Erklärung zur Barrierefreiheit (BFSG/EAA) – ausfüllen oder BFSG-Protokoll importieren (für Betreiber)'),
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-weight:600;margin-top:0' }, '📥 Optional: BFSG-Check-Protokoll importieren'),
      el('p', { style: 'font-size:0.88rem;color:#4b5563;margin-top:0' }, 'Die im BFSG-Check gespeicherte Datei hier laden – der Konformitätsstand wird übernommen.'),
      datei,
      el('p', { id: 'bfe-import-status', style: 'font-size:0.88rem;margin:0.4rem 0 0;color:var(--k-blau-dunkel)' }, '')),
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-weight:600;margin-top:0' }, '📝 Angaben'),
      eingabe('Anbieter / Verantwortliche/r', 'anbieter', cfg, { platzhalter: 'z. B. Kinder-Werkstatt e. V.' }),
      eingabe('Adresse des Angebots (URL)', 'url', cfg, { platzhalter: 'https://…' }),
      eingabe('Stand der Erklärung (Datum)', 'stand', cfg, { platzhalter: 'z. B. 18.07.2026' }),
      el('span', { style: 'display:block;font-weight:600;font-size:0.9rem;margin:0.5rem 0 0.2rem' }, 'Stand der Vereinbarkeit'),
      konformitaetWahl,
      eingabe('Bekannte Barrieren (eine pro Zeile)', 'bekannteBarrieren', cfg, { mehrzeilig: true, platzhalter: 'z. B. Ein Video hat noch keine Untertitel.' }),
      eingabe('Kontakt für Feedback (Name/Funktion)', 'kontaktName', cfg, { platzhalter: 'z. B. Redaktion' }),
      eingabe('Kontakt-E-Mail', 'kontaktEmail', cfg, { type: 'email', platzhalter: 'kontakt@…' })),
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '👁️ Vorschau'),
      vorschau),
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '📄 Markdown'),
      mdFeld,
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--klein', onclick: (ev) => kopiere(mdFeld, ev) }, '📋 Kopieren'),
        el('button', { class: 'k-knopf k-knopf--klein', onclick: () => herunterladen(mdFeld.value, 'barrierefreiheitserklaerung.md', 'text/markdown;charset=utf-8') }, '💾 .md speichern'))),
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🧩 HTML'),
      htmlFeld,
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--klein', onclick: (ev) => kopiere(htmlFeld, ev) }, '📋 Kopieren'),
        el('button', { class: 'k-knopf k-knopf--klein', onclick: () => herunterladen(htmlFeld.value, 'barrierefreiheitserklaerung.html', 'text/html;charset=utf-8') }, '💾 .html speichern'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => { localStorage.removeItem(SCHLUESSEL); render(); } }, '🧹 Leeren'))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-size:0.85rem;color:#4b5563;margin:0' }, 'Vorlage nach BFSG/EAA (EN 301 549, WCAG 2.1 AA). Bitte an das eigene Angebot anpassen. Hilfe zur Selbsthilfe, keine Rechtsberatung.')),
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werkzeug für Erwachsene · läuft offline · Angaben bleiben auf diesem Gerät · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

render();
