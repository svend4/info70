// Interaktions-Konzept-Assistent (für Betreiber, docs/09 Nr. 162). Geplante
// Interaktionsfunktion(en) wählen → geltende Schutz-Anforderungen als
// Checkliste + ausfüllbare Moderationskonzept-Vorlage zum Export. Gefilterte
// Karten nach foerder-navigator-Muster. fragFINN/DSA/JMStV/UN-KRK.
// Politik docs/02: keine externen Anfragen; Auswahl bleibt lokal.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { anforderungenFuer, gewaehlteFunktionen, baueModerationskonzept, hoechstesRisiko } from './logik.mjs';

installiereNetzwerkWaechter();

const SCHLUESSEL = 'ika.auswahl';
const app = document.getElementById('app');
const daten = await fetch('daten/funktionen.json').then((r) => r.json());
const RISIKO_FARBE = { niedrig: '#16a34a', mittel: '#ca8a04', hoch: '#ea580c', 'sehr hoch': '#dc2626' };

const lade = () => JSON.parse(localStorage.getItem(SCHLUESSEL) ?? '[]');
const speichere = (a) => localStorage.setItem(SCHLUESSEL, JSON.stringify(a));

const herunterladen = (inhalt, name) => { const url = URL.createObjectURL(new Blob([inhalt], { type: 'text/plain;charset=utf-8' })); const a = el('a', { href: url, download: name }); a.click(); URL.revokeObjectURL(url); };

function render() {
  const auswahl = lade();
  const anforderungen = anforderungenFuer(daten, auswahl);
  const gewaehlt = gewaehlteFunktionen(daten, auswahl);
  const konzept = baueModerationskonzept(daten, auswahl);

  const funktionsKarten = daten.funktionen.map((f) => {
    const aktiv = auswahl.includes(f.id);
    return el('label', { for: `ika-${f.id}`, style: `display:block;padding:0.6rem;border:2px solid ${aktiv ? 'var(--k-blau-dunkel)' : 'var(--k-rand)'};border-radius:0.6rem;margin:0.4rem 0;cursor:pointer;background:${aktiv ? '#eff6ff' : '#fff'}` },
      el('div', { style: 'display:flex;gap:0.6rem;align-items:flex-start' },
        Object.assign(el('input', { type: 'checkbox', id: `ika-${f.id}`, style: 'width:1.5rem;height:1.5rem;flex-shrink:0;margin-top:0.15rem' }), { checked: aktiv, onchange: () => { const s = new Set(lade()); aktiv ? s.delete(f.id) : s.add(f.id); speichere([...s]); render(); } }),
        el('div', {},
          el('span', { style: 'font-weight:600' }, `${f.emoji} ${f.name}`),
          el('span', { style: `margin-left:0.5rem;font-size:0.8rem;font-weight:600;color:${RISIKO_FARBE[f.risiko]}` }, `Risiko: ${f.risiko}`),
          el('span', { style: 'display:block;font-size:0.9rem;color:#4b5563' }, f.beschreibung))));
  });

  const konzeptFeld = el('textarea', { readonly: true, style: 'width:100%;min-height:14rem;font-family:monospace;font-size:0.8rem;border:2px solid var(--k-rand);border-radius:0.5rem;padding:0.5rem', 'aria-label': 'Moderationskonzept-Vorlage' });
  konzeptFeld.value = konzept;

  const risiko = hoechstesRisiko(daten, auswahl);

  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🧩 Interaktions-Konzept-Assistent'),
    el('p', { class: 'k-untertitel' }, 'Interaktionsfunktion wählen → Schutz-Anforderungen + Moderationskonzept-Vorlage (für Betreiber)'),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, daten.hinweis),
      ...funktionsKarten,
      gewaehlt.length ? el('p', { style: `margin-bottom:0;font-weight:600;color:${RISIKO_FARBE[risiko]}` }, `Höchstes Risiko der Auswahl: ${risiko}${risiko === 'sehr hoch' ? ' – bitte besonders sorgfältig absichern.' : ''}`) : ''),
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, `📋 Geltende Schutz-Anforderungen${anforderungen.length ? ` (${anforderungen.length})` : ''}`),
      anforderungen.length
        ? el('ul', { style: 'margin:0;padding-left:1.2rem' }, ...anforderungen.map((a) => el('li', { style: 'margin:0.35rem 0' }, el('span', {}, a.text), el('small', { style: 'display:block;color:#4b5563' }, a.bezug))))
        : el('p', { style: 'color:#4b5563;margin:0' }, 'Wähle oben mindestens eine Funktion.')),
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '📝 Moderationskonzept-Vorlage'),
      konzeptFeld,
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--klein', onclick: () => herunterladen(konzept, 'moderationskonzept.txt') }, '💾 Als Datei speichern'),
        el('button', { class: 'k-knopf k-knopf--klein', onclick: (ev) => { konzeptFeld.select(); navigator.clipboard?.writeText(konzept); ev.target.textContent = '✔️ Kopiert!'; } }, '📋 Kopieren'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => { localStorage.removeItem(SCHLUESSEL); render(); } }, '🧹 Zurücksetzen'))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-size:0.85rem;color:#4b5563;margin:0' }, 'Verwandte Werkzeuge: Meldewege-Planer (kindgerechter Meldeweg), DSA-Selbstaudit. Hilfe zur Selbsthilfe, keine Rechtsberatung.')),
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werkzeug für Erwachsene · läuft offline · Auswahl bleibt auf diesem Gerät · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

render();
