// Kinderrat: Sitzungsmodus fuer die Klasse (8-12, Beteiligung).
// Tagesordnung, Redeliste, Abstimmung mit Ergebnis-Begruendung, Protokoll als
// Datei-Export in den Klassen-Koffer (kein Server). Formales Beteiligungs-
// verfahren zum Erleben (docs/09 Nr. 31). Reine Logik in koffer.mjs.
// Politik docs/02: keine externen Anfragen; alles lokal + in Dateien.
// Druck (druck.css): Bedienung und Zeichen (Emoji, Mittelpunkte) tragen die
// Klasse nur-bildschirm und fehlen auf dem Ausdruck.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { hilfeInsel } from '../../packages/kinder-ui/js/hilfe-insel.mjs';
import { ergebnis, packeProtokoll, protokollText, pruefeProtokoll, TOP_VORSCHLAEGE } from './koffer.mjs';

installiereNetzwerkWaechter();

const SCHLUESSEL = 'kr.sitzung';
const app = document.getElementById('app');

const FELD = 'flex:1;min-width:0;min-height:44px;border:2px solid var(--k-rand);border-radius:0.5rem;padding:0 0.6rem;font-size:1rem';
const UEBERSCHRIFT = 'font-size:1rem;font-weight:600;margin:0 0 0.5rem';
const FUSS_LINK = 'display:inline-flex;align-items:center;min-height:48px;min-width:48px;padding:0 0.5rem';

const heute = () => new Date().toLocaleDateString('de-DE');
const neu = () => ({ titel: 'Klassenrat', datum: heute(), tops: [], redeliste: [] });
const neuerTop = (thema) => ({ thema, dafuer: 0, dagegen: 0, enthaltung: 0, abgestimmt: false, begruendung: '' });
const lade = () => { const s = JSON.parse(localStorage.getItem(SCHLUESSEL) ?? 'null'); return s ?? neu(); };
const speichere = (s) => localStorage.setItem(SCHLUESSEL, JSON.stringify(s));

// Dekoratives Zeichen: am Bildschirm sichtbar, im Druck und für Vorlesetechnik ausgeblendet.
const deko = (zeichen) => el('span', { class: 'nur-bildschirm', 'aria-hidden': 'true' }, `${zeichen} `);
const trenner = () => el('span', { class: 'nur-bildschirm', 'aria-hidden': 'true' }, ' · ');

// Schaltfläche mit Kennung: id und data-kennung sind gleich. Bedienung gehört nicht auf den Ausdruck.
function knopf(kennung, klasse, attrs, ...kinder) {
  return el('button', { ...attrs, id: kennung, 'data-kennung': kennung, class: `${klasse} nur-bildschirm`, style: 'min-width:3rem' }, ...kinder);
}

// Nach jedem Neuaufbau bekommt der Fokus ein Ziel: derselbe Knopf, sonst der Ersatz, sonst die Hauptüberschrift.
function render(fokus, ersatz) {
  const s = lade();

  const titelFeld = el('input', { type: 'text', value: s.titel, maxlength: '30', style: FELD, 'aria-label': 'Titel der Sitzung' });
  titelFeld.addEventListener('change', () => { const x = lade(); x.titel = titelFeld.value.trim() || 'Klassenrat'; speichere(x); render(); });

  const topFeld = el('input', { type: 'text', maxlength: '80', placeholder: 'Tagesordnungspunkt …', style: FELD, 'aria-label': 'Tagesordnungspunkt' });
  const topHinzu = () => { const t = topFeld.value.trim(); if (!t) return; const x = lade(); x.tops.push(neuerTop(t)); speichere(x); render('top-hinzu'); };
  topFeld.addEventListener('keydown', (e) => { if (e.key === 'Enter') topHinzu(); });

  const vorschlag = (v, n) => knopf(`vorschlag-${n}`, 'k-knopf k-knopf--neutral k-knopf--klein', {
    onclick: () => { const x = lade(); x.tops.push(neuerTop(v)); speichere(x); render(`vorschlag-${n}`, `top-${x.tops.length - 1}-titel`); },
  }, v);

  app.replaceChildren(
    el('h1', { class: 'k-titel', tabindex: '-1' }, deko('🗳️'), 'Kinderrat'),
    el('p', { class: 'k-untertitel' }, 'Eure Sitzung: Tagesordnung, Reden, Abstimmen, Protokoll.'),
    el('section', { class: 'k-karte' },
      el('h2', { style: UEBERSCHRIFT }, deko('📋'), 'Sitzung'),
      el('div', { style: 'display:flex;gap:0.5rem' }, titelFeld),
      el('p', { style: 'font-size:0.85rem;color:#4b5563;margin:0.4rem 0 0' }, `Datum: ${s.datum}`)),
    redelisteKarte(s),
    el('section', { class: 'k-karte' },
      el('h2', { style: UEBERSCHRIFT }, deko('📝'), 'Tagesordnung'),
      el('div', { class: 'nur-bildschirm', style: 'display:flex;gap:0.5rem' },
        topFeld,
        knopf('top-hinzu', 'k-knopf k-knopf--klein', { 'aria-label': 'Tagesordnungspunkt hinzufügen', onclick: topHinzu }, '➕')),
      s.tops.length === 0 ? el('div', { class: 'nur-bildschirm', style: 'margin-top:0.5rem' },
        el('p', { style: 'font-size:0.85rem;color:#4b5563;margin:0 0 0.3rem' }, 'Vorschläge:'),
        el('div', { style: 'display:flex;gap:0.4rem;flex-wrap:wrap' }, ...TOP_VORSCHLAEGE.map(vorschlag))) : ''),
    ...s.tops.map((t, i) => topKarte(t, i)),
    s.tops.length ? protokollKarte(s) : '',
    el('section', { class: 'k-karte nur-bildschirm' },
      knopf('neue-sitzung', 'k-knopf k-knopf--neutral k-knopf--klein', {
        onclick: () => { if (confirm('Neue Sitzung starten? Die alte wird gelöscht.')) { localStorage.removeItem(SCHLUESSEL); render('neue-sitzung'); } },
      }, '🧹 Neue Sitzung')),
    hilfeKarte(),
    el('footer', { class: 'k-fuss', style: 'display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:0.25rem 0.5rem' },
      el('span', {}, 'Werbefrei'), trenner(), el('span', {}, 'ohne Anmeldung'), trenner(), el('span', {}, 'Daten bleiben auf diesem Gerät'),
      el('a', { href: 'eltern.html', style: FUSS_LINK }, deko('👪'), 'Für Lehrkräfte'),
      el('a', { href: '../../impressum.html', style: FUSS_LINK }, 'Impressum & Datenschutz')));

  if (fokus) {
    const ziel = document.getElementById(fokus) ?? (ersatz ? document.getElementById(ersatz) : null) ?? app.querySelector('h1');
    ziel.focus({ preventScroll: true });
  }
}

// Hilfe-Insel aus kinder-ui: die Karte ist nur am Bildschirm sichtbar, ihr Knopf bekommt eine Kennung.
function hilfeKarte() {
  const karte = hilfeInsel({ klasse: 'nur-bildschirm' });
  for (const b of karte.querySelectorAll('button')) {
    b.id = 'hilfe-vorlesen';
    b.dataset.kennung = 'hilfe-vorlesen';
  }
  return karte;
}

function redelisteKarte(s) {
  const nameFeld = el('input', { type: 'text', maxlength: '3', placeholder: 'Name auf die Redeliste …', style: FELD, 'aria-label': 'Name auf die Redeliste', 'aria-describedby': 'redeliste-hinweis' });
  const hinzu = () => { const n = nameFeld.value.trim(); if (!n) return; const x = lade(); x.redeliste.push(n); speichere(x); render('redeliste-hinzu'); };
  nameFeld.addEventListener('keydown', (e) => { if (e.key === 'Enter') hinzu(); });
  return el('section', { class: 'k-karte' },
    el('h2', { id: 'redeliste-titel', tabindex: '-1', style: UEBERSCHRIFT }, deko('🙋'), 'Redeliste – wer ist dran?'),
    el('p', { id: 'redeliste-hinweis', style: 'font-size:0.85rem;color:#4b5563;margin:0 0 0.4rem' }, 'Nur Initiale oder Nummer, keine Namen.'),
    el('div', { class: 'nur-bildschirm', style: 'display:flex;gap:0.5rem' }, nameFeld, el('button', { id: 'redeliste-hinzu', 'data-kennung': 'redeliste-hinzu', class: 'k-knopf k-knopf--klein nur-bildschirm', style: 'min-width:3rem', 'aria-label': 'Name auf die Redeliste setzen', onclick: hinzu }, '➕')),
    s.redeliste.length
      ? el('ol', { style: 'padding-left:1.4rem;margin:0.5rem 0 0' },
          ...s.redeliste.map((n, i) => el('li', { style: 'margin:0.25rem 0;display:flex;align-items:center;gap:0.5rem' },
            el('span', { style: i === 0 ? 'font-weight:700' : '' }, n, i === 0 ? el('span', {}, ' ', deko('🎤'), '(dran)') : ''),
            knopf(`redeliste-erledigt-${i}`, 'k-knopf k-knopf--neutral k-knopf--klein', {
              'aria-label': `${n} hat gesprochen`,
              onclick: () => { const x = lade(); x.redeliste.splice(i, 1); speichere(x); render(`redeliste-erledigt-${i}`, 'redeliste-titel'); },
            }, '✓'))))
      : el('p', { style: 'font-size:0.85rem;color:#4b5563;margin:0.5rem 0 0' }, 'Noch niemand gemeldet. Die erste Person auf der Liste ist dran und darf ausreden.'));
}

function topKarte(t, i) {
  const setze = (feld, delta) => {
    const x = lade(); x.tops[i][feld] = Math.max(0, (x.tops[i][feld] ?? 0) + delta); speichere(x);
    render(`top-${i}-${feld}-${delta > 0 ? 'mehr' : 'weniger'}`, `top-${i}-titel`);
  };
  const erg = ergebnis(t.dafuer ?? 0, t.dagegen ?? 0);
  const begrFeld = el('textarea', { style: 'width:100%;min-height:3rem;border:2px solid var(--k-rand);border-radius:0.5rem;padding:0.4rem;font-size:0.95rem', placeholder: 'Warum dieses Ergebnis? (Begründung fürs Protokoll)', 'aria-label': 'Begründung' });
  begrFeld.value = t.begruendung ?? '';
  begrFeld.addEventListener('change', () => { const x = lade(); x.tops[i].begruendung = begrFeld.value.trim(); x.tops[i].abgestimmt = (x.tops[i].dafuer + x.tops[i].dagegen + x.tops[i].enthaltung) > 0; speichere(x); render(); });
  const stimme = (feld, label, zeichen) => el('div', { style: 'text-align:center' },
    el('div', { style: 'font-size:0.8rem' }, deko(zeichen), label),
    el('div', { style: 'display:flex;align-items:center;gap:0.3rem;justify-content:center' },
      knopf(`top-${i}-${feld}-weniger`, 'k-knopf k-knopf--neutral k-knopf--klein', { 'aria-label': `${label} weniger`, onclick: () => setze(feld, -1) }, '➖'),
      el('span', { style: 'min-width:1.5rem;font-weight:700' }, String(t[feld] ?? 0)),
      knopf(`top-${i}-${feld}-mehr`, 'k-knopf k-knopf--klein', { 'aria-label': `${label} mehr`, onclick: () => setze(feld, 1) }, '➕')));
  return el('section', { class: 'k-karte' },
    el('div', { style: 'display:flex;justify-content:space-between;gap:0.5rem' },
      el('h2', { id: `top-${i}-titel`, tabindex: '-1', style: 'margin:0;font-size:1.05rem;min-width:0;overflow-wrap:anywhere' }, `TOP ${i + 1}: ${t.thema}`),
      knopf(`top-${i}-entfernen`, 'k-knopf k-knopf--neutral k-knopf--klein', {
        'aria-label': `TOP ${i + 1} entfernen`,
        onclick: () => { const x = lade(); x.tops.splice(i, 1); speichere(x); render(`top-${i}-entfernen`, i > 0 ? `top-${i - 1}-titel` : null); },
      }, '✕')),
    el('p', { style: 'font-weight:600;margin:0.5rem 0 0.25rem' }, deko('✋'), 'Abstimmen:'),
    el('div', { style: 'display:flex;flex-wrap:wrap;gap:1rem;justify-content:space-around' },
      stimme('dafuer', 'dafür', '👍'), stimme('dagegen', 'dagegen', '👎'), stimme('enthaltung', 'enthalten', '✋')),
    el('p', { style: 'text-align:center;margin:0.5rem 0;font-weight:700' }, `Ergebnis: ${erg}`),
    begrFeld);
}

function protokollKarte(s) {
  const feld = el('textarea', { readonly: true, style: 'width:100%;min-height:8rem;font-family:monospace;font-size:0.75rem;border:2px solid var(--k-rand);border-radius:0.5rem;padding:0.5rem', 'aria-label': 'Protokoll' });
  feld.value = protokollText(s);
  const datei = el('input', { type: 'file', accept: 'application/json', style: 'display:none', onchange: importiere });
  return el('section', { class: 'k-karte' },
    el('h2', { style: UEBERSCHRIFT }, deko('🗂️'), 'Protokoll'),
    feld,
    el('div', { class: 'k-antworten' },
      knopf('protokoll-speichern', 'k-knopf k-knopf--klein', { onclick: () => exportiere(s) }, '📤 Protokoll speichern (Koffer)'),
      knopf('protokoll-laden', 'k-knopf k-knopf--neutral k-knopf--klein', { onclick: () => datei.click() }, '📥 Protokoll laden'),
      datei));
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
    render('protokoll-laden');
  };
  leser.readAsText(datei);
}

render();
