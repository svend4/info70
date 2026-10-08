// Kinderrat: Sitzungsmodus fuer die Klasse (8-12, Beteiligung).
// Tagesordnung, Redeliste, Abstimmung mit Ergebnis-Begruendung, Protokoll als
// Datei-Export in den Klassen-Koffer (kein Server). Formales Beteiligungs-
// verfahren zum Erleben (docs/09 Nr. 31). Reine Logik in koffer.mjs.
// Politik docs/02: keine externen Anfragen; alles lokal + in Dateien.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { hilfeInsel } from '../../packages/kinder-ui/js/hilfe-insel.mjs';
import { ergebnis, packeProtokoll, protokollText, pruefeProtokoll, TOP_VORSCHLAEGE } from './koffer.mjs';

installiereNetzwerkWaechter();

const SCHLUESSEL = 'kr.sitzung';
const app = document.getElementById('app');

const heute = () => new Date().toLocaleDateString('de-DE');
const neu = () => ({ titel: 'Klassenrat', datum: heute(), tops: [], redeliste: [] });
const lade = () => { const s = JSON.parse(localStorage.getItem(SCHLUESSEL) ?? 'null'); return s ?? neu(); };
const speichere = (s) => localStorage.setItem(SCHLUESSEL, JSON.stringify(s));

function render() {
  const s = lade();

  const titelFeld = el('input', { type: 'text', value: s.titel, maxlength: '30',
    style: 'flex:1;min-height:44px;border:2px solid var(--k-rand);border-radius:0.5rem;padding:0 0.6rem;font-size:1rem', 'aria-label': 'Titel der Sitzung' });
  titelFeld.addEventListener('change', () => { const x = lade(); x.titel = titelFeld.value.trim() || 'Klassenrat'; speichere(x); render(); });

  const topFeld = el('input', { type: 'text', maxlength: '80', placeholder: 'Tagesordnungspunkt …',
    style: 'flex:1;min-height:44px;border:2px solid var(--k-rand);border-radius:0.5rem;padding:0 0.6rem;font-size:1rem', 'aria-label': 'Tagesordnungspunkt' });
  const topHinzu = () => { const t = topFeld.value.trim(); if (!t) return; const x = lade(); x.tops.push({ thema: t, dafuer: 0, dagegen: 0, enthaltung: 0, abgestimmt: false, begruendung: '' }); speichere(x); render(); };
  topFeld.addEventListener('keydown', (e) => { if (e.key === 'Enter') topHinzu(); });

  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🗳️ Kinderrat'),
    el('p', { class: 'k-untertitel' }, 'Eure Sitzung: Tagesordnung, Reden, Abstimmen, Protokoll.'),
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-weight:600;margin-top:0' }, '📋 Sitzung'),
      el('div', { style: 'display:flex;gap:0.5rem' }, titelFeld),
      el('p', { style: 'font-size:0.85rem;color:#4b5563;margin:0.4rem 0 0' }, `Datum: ${s.datum}`)),
    redelisteKarte(s),
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-weight:600;margin-top:0' }, '📝 Tagesordnung'),
      el('div', { style: 'display:flex;gap:0.5rem' }, topFeld, el('button', { class: 'k-knopf k-knopf--klein', onclick: topHinzu }, '➕')),
      s.tops.length === 0 ? el('div', { style: 'margin-top:0.5rem' },
        el('p', { style: 'font-size:0.85rem;color:#4b5563;margin:0 0 0.3rem' }, 'Vorschläge:'),
        el('div', { style: 'display:flex;gap:0.4rem;flex-wrap:wrap' },
          ...TOP_VORSCHLAEGE.map((v) => el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => { const x = lade(); x.tops.push({ thema: v, dafuer: 0, dagegen: 0, enthaltung: 0, abgestimmt: false, begruendung: '' }); speichere(x); render(); } }, v)))) : ''),
    ...s.tops.map((t, i) => topKarte(t, i)),
    s.tops.length ? protokollKarte(s) : '',
    el('section', { class: 'k-karte' },
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => { if (confirm('Neue Sitzung starten? Die alte wird gelöscht.')) { localStorage.removeItem(SCHLUESSEL); render(); } } }, '🧹 Neue Sitzung')),
    hilfeInsel(),
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · Daten bleiben auf diesem Gerät · '),
      el('a', { href: 'eltern.html' }, '👪 Für Lehrkräfte'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

function redelisteKarte(s) {
  const nameFeld = el('input', { type: 'text', maxlength: '20', placeholder: 'Name auf die Redeliste …',
    style: 'flex:1;min-height:44px;border:2px solid var(--k-rand);border-radius:0.5rem;padding:0 0.6rem;font-size:1rem', 'aria-label': 'Name auf die Redeliste' });
  const hinzu = () => { const n = nameFeld.value.trim(); if (!n) return; const x = lade(); x.redeliste.push(n); speichere(x); render(); };
  nameFeld.addEventListener('keydown', (e) => { if (e.key === 'Enter') hinzu(); });
  return el('section', { class: 'k-karte' },
    el('p', { style: 'font-weight:600;margin-top:0' }, '🙋 Redeliste – wer ist dran?'),
    el('div', { style: 'display:flex;gap:0.5rem' }, nameFeld, el('button', { class: 'k-knopf k-knopf--klein', onclick: hinzu }, '➕')),
    s.redeliste.length
      ? el('ol', { style: 'padding-left:1.4rem;margin:0.5rem 0 0' },
          ...s.redeliste.map((n, i) => el('li', { style: 'margin:0.25rem 0;display:flex;align-items:center;gap:0.5rem' },
            el('span', { style: i === 0 ? 'font-weight:700' : '' }, i === 0 ? `${n} 🎤 (dran)` : n),
            el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', 'aria-label': `${n} hat gesprochen`, onclick: () => { const x = lade(); x.redeliste.splice(i, 1); speichere(x); render(); } }, '✓'))))
      : el('p', { style: 'font-size:0.85rem;color:#4b5563;margin:0.5rem 0 0' }, 'Noch niemand gemeldet. Die erste Person auf der Liste ist dran und darf ausreden.'));
}

function topKarte(t, i) {
  const setze = (feld, delta) => { const x = lade(); x.tops[i][feld] = Math.max(0, (x.tops[i][feld] ?? 0) + delta); speichere(x); render(); };
  const erg = ergebnis(t.dafuer ?? 0, t.dagegen ?? 0);
  const begrFeld = el('textarea', { style: 'width:100%;min-height:3rem;border:2px solid var(--k-rand);border-radius:0.5rem;padding:0.4rem;font-size:0.95rem', placeholder: 'Warum dieses Ergebnis? (Begründung fürs Protokoll)', 'aria-label': 'Begründung' });
  begrFeld.value = t.begruendung ?? '';
  begrFeld.addEventListener('change', () => { const x = lade(); x.tops[i].begruendung = begrFeld.value.trim(); x.tops[i].abgestimmt = (x.tops[i].dafuer + x.tops[i].dagegen + x.tops[i].enthaltung) > 0; speichere(x); render(); });
  const stimme = (feld, label) => el('div', { style: 'text-align:center' },
    el('div', { style: 'font-size:0.8rem' }, label),
    el('div', { style: 'display:flex;align-items:center;gap:0.3rem;justify-content:center' },
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', 'aria-label': `${label} weniger`, onclick: () => setze(feld, -1) }, '➖'),
      el('span', { style: 'min-width:1.5rem;font-weight:700' }, String(t[feld] ?? 0)),
      el('button', { class: 'k-knopf k-knopf--klein', 'aria-label': `${label} mehr`, onclick: () => setze(feld, 1) }, '➕')));
  return el('section', { class: 'k-karte' },
    el('div', { style: 'display:flex;justify-content:space-between;gap:0.5rem' },
      el('h2', { style: 'margin:0;font-size:1.05rem' }, `TOP ${i + 1}: ${t.thema}`),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', 'aria-label': 'TOP entfernen', onclick: () => { const x = lade(); x.tops.splice(i, 1); speichere(x); render(); } }, '✕')),
    el('p', { style: 'font-weight:600;margin:0.5rem 0 0.25rem' }, '✋ Abstimmen:'),
    el('div', { style: 'display:flex;gap:1rem;justify-content:space-around' }, stimme('dafuer', '👍 dafür'), stimme('dagegen', '👎 dagegen'), stimme('enthaltung', '✋ enthalten')),
    el('p', { style: 'text-align:center;margin:0.5rem 0;font-weight:700' }, `Ergebnis: ${erg}`),
    begrFeld);
}

function protokollKarte(s) {
  const feld = el('textarea', { readonly: true, style: 'width:100%;min-height:8rem;font-family:monospace;font-size:0.75rem;border:2px solid var(--k-rand);border-radius:0.5rem;padding:0.5rem', 'aria-label': 'Protokoll' });
  feld.value = protokollText(s);
  return el('section', { class: 'k-karte' },
    el('p', { style: 'font-weight:600;margin-top:0' }, '🗂️ Protokoll'),
    feld,
    el('div', { class: 'k-antworten' },
      el('button', { class: 'k-knopf k-knopf--klein', onclick: () => exportiere(s) }, '📤 Protokoll speichern (Koffer)'),
      el('label', { class: 'k-knopf k-knopf--neutral k-knopf--klein', style: 'text-align:center;cursor:pointer' }, '📥 Protokoll laden',
        el('input', { type: 'file', accept: 'application/json', style: 'display:none', onchange: importiere }))));
}

function exportiere(s) {
  const url = URL.createObjectURL(new Blob([packeProtokoll(s)], { type: 'application/json' }));
  const a = el('a', { href: url, download: 'kinderrat-protokoll.json' });
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
    const fehler = pruefeProtokoll(inhalt);
    if (fehler.length) { alert(fehler.join('\n')); return; }
    speichere({ titel: inhalt.titel, datum: inhalt.datum ?? heute(), tops: inhalt.tops.map((t) => ({ ...t, abgestimmt: true })), redeliste: [] });
    render();
  };
  leser.readAsText(datei);
}

render();
