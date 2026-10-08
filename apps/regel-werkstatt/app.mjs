// Regel-Werkstatt: die Klasse handelt eigene Medienregeln aus (8-12).
// Beteiligung nach mitmach-arena-Muster: Vorschlaege sammeln -> dafuer stimmen
// -> Ergebnis als Klassen-Koffer-Datei sichern (Austausch ohne Server) und als
// Plakat drucken. Reine Logik in koffer.mjs. Politik docs/02: keine externen
// Anfragen; alles bleibt lokal (localStorage) und in Dateien.
import { el, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { hilfeInsel, hilfeInselKnopf } from '../../packages/kinder-ui/js/hilfe-insel.mjs';
import { sortiere, packeKoffer, pruefeKoffer, vereinigeKoffer, VORSCHLAEGE } from './koffer.mjs';

installiereNetzwerkWaechter();

const SCHLUESSEL = 'rw.werkstatt';
const app = document.getElementById('app');

const lade = () => JSON.parse(localStorage.getItem(SCHLUESSEL) ?? 'null')
  ?? { titel: 'Unsere Klasse', regeln: VORSCHLAEGE.map((text) => ({ text, stimmen: 0 })) };
const speichere = (w) => localStorage.setItem(SCHLUESSEL, JSON.stringify(w));

function zeige(...knoten) {
  app.replaceChildren(...knoten);
}

function kopf() {
  return [
    el('h1', { class: 'k-titel' }, '🛠️ Regel-Werkstatt'),
    el('p', { class: 'k-untertitel pw-nur-bildschirm' }, 'Eure Medienregeln – selbst gemacht, gemeinsam beschlossen.'),
  ];
}

function fuss() {
  return el('footer', { class: 'k-fuss pw-nur-bildschirm' },
    el('span', {}, 'Werbefrei · ohne Anmeldung · Daten bleiben auf diesem Gerät · '),
    el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
    el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz'));
}

function render() {
  const w = lade();
  const sortiert = sortiere(w.regeln);
  const maxStimmen = Math.max(1, ...w.regeln.map((r) => r.stimmen));

  const titelFeld = el('input', {
    type: 'text', value: w.titel, maxlength: '30',
    style: 'flex:1;min-height:44px;border:2px solid var(--k-rand);border-radius:0.5rem;padding:0 0.6rem;font-size:1rem',
    'aria-label': 'Name der Klasse',
  });
  titelFeld.addEventListener('change', () => { const x = lade(); x.titel = titelFeld.value.trim() || 'Unsere Klasse'; speichere(x); render(); });

  const neuFeld = el('input', {
    type: 'text', maxlength: '80', placeholder: 'Neue Regel vorschlagen …',
    style: 'flex:1;min-height:44px;border:2px solid var(--k-rand);border-radius:0.5rem;padding:0 0.6rem;font-size:1rem',
    'aria-label': 'Neue Regel vorschlagen',
  });
  const neuHinzu = () => {
    const text = neuFeld.value.trim();
    if (!text) return;
    const x = lade(); x.regeln.push({ text, stimmen: 0 }); speichere(x); render();
  };
  neuFeld.addEventListener('keydown', (e) => { if (e.key === 'Enter') neuHinzu(); });

  zeige(
    ...kopf(),
    el('section', { class: 'k-karte pw-nur-bildschirm' },
      el('p', { style: 'font-weight:600;margin-top:0' }, '1) Wie heißt eure Gruppe?'),
      el('div', { style: 'display:flex;gap:0.5rem' }, titelFeld)),
    el('section', { class: 'k-karte pw-nur-bildschirm' },
      el('p', { style: 'font-weight:600;margin-top:0' }, '2) Vorschläge sammeln'),
      el('div', { style: 'display:flex;gap:0.5rem' }, neuFeld, el('button', { class: 'k-knopf k-knopf--klein', onclick: neuHinzu }, '➕')),
      el('p', { style: 'font-size:0.9rem;color:#4b5563;margin-bottom:0' }, 'Tippt eure Ideen ein. Ein paar Vorschläge sind schon da – ihr könnt sie ändern oder löschen.')),
    el('section', { class: 'k-karte pw-nur-bildschirm' },
      el('p', { style: 'font-weight:600;margin-top:0' }, '3) Abstimmen – tippt auf 👍 für die Regeln, die ihr wollt'),
      ...sortiert.map((r) => stimmZeile(r, maxStimmen))),
    // Druck-Plakat: nur beim Drucken sichtbar.
    plakat(w.titel, sortiert),
    el('section', { class: 'k-karte pw-nur-bildschirm' },
      el('p', { style: 'font-weight:600;margin-top:0' }, '4) Ergebnis sichern'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: () => window.print() }, '🖨️ Als Plakat drucken'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => exportiere(w) }, '📤 Klassen-Koffer speichern'),
        el('label', { class: 'k-knopf k-knopf--neutral k-knopf--klein', style: 'text-align:center;cursor:pointer' },
          '📥 Koffer laden',
          el('input', { type: 'file', accept: 'application/json', style: 'display:none', onchange: importiere })))),
    el('section', { class: 'k-karte pw-nur-bildschirm' },
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => { if (confirm('Alle Regeln und Stimmen löschen?')) { localStorage.removeItem(SCHLUESSEL); render(); } } }, '🧹 Neu anfangen')),
    fuss(),
    el('section', { class: 'k-karte' },
      hilfeInselKnopf(() => zeige(hilfeInsel({ zurueck: render })))));
}

function stimmZeile(r, maxStimmen) {
  const anteil = Math.round((r.stimmen / maxStimmen) * 100);
  return el('div', { style: 'display:flex;align-items:center;gap:0.5rem;padding:0.3rem 0;border-bottom:1px solid var(--k-rand)' },
    el('button', { class: 'k-knopf k-knopf--klein', style: 'flex-shrink:0', 'aria-label': `Für „${r.text}“ stimmen`, onclick: () => { const x = lade(); const t = x.regeln.find((q) => q.text === r.text); if (t) { t.stimmen++; speichere(x); render(); } } }, `👍 ${r.stimmen}`),
    el('div', { style: 'flex:1' },
      el('span', {}, r.text),
      el('div', { class: 'k-fortschritt', style: 'margin-top:0.2rem' }, el('div', { style: `width:${anteil}%` }))),
    el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', style: 'flex-shrink:0', 'aria-label': `„${r.text}“ entfernen`, onclick: () => { const x = lade(); x.regeln = x.regeln.filter((q) => q.text !== r.text); speichere(x); render(); } }, '✕'));
}

function plakat(titel, sortiert) {
  const top = sortiert.filter((r) => r.stimmen > 0).slice(0, 8);
  const liste = top.length ? top : sortiert.slice(0, 8);
  return el('section', { class: 'k-karte pw-nur-druck' },
    el('h2', { style: 'text-align:center;font-size:1.6rem;margin:0 0 0.25rem' }, '📱 Unsere Medienregeln'),
    el('p', { style: 'text-align:center;margin:0 0 0.75rem;font-weight:600' }, titel),
    el('ol', { style: 'font-size:1.2rem;line-height:1.7;padding-left:1.5rem' },
      ...liste.map((r) => el('li', { style: 'margin:0.3rem 0' }, r.text))),
    el('p', { style: 'text-align:center;margin-top:1rem;font-size:0.9rem' }, 'Gemeinsam beschlossen · Datum: ____________ · Unterschriften: ____________'));
}

function exportiere(w) {
  const url = URL.createObjectURL(new Blob([packeKoffer(w)], { type: 'application/json' }));
  const a = el('a', { href: url, download: 'regel-werkstatt-klasse.json' });
  a.click();
  URL.revokeObjectURL(url);
}

function importiere(ev) {
  const datei = ev.target.files?.[0];
  if (!datei) return;
  const leser = new FileReader();
  leser.onload = () => {
    let inhalt;
    try { inhalt = JSON.parse(String(leser.result)); } catch { alert('Datei konnte nicht gelesen werden.'); return; }
    const fehler = pruefeKoffer(inhalt);
    if (fehler.length) { alert(fehler.join('\n')); return; }
    const x = lade();
    x.regeln = vereinigeKoffer(x.regeln, inhalt);
    speichere(x);
    render();
  };
  leser.readAsText(datei);
}

render();
