// Erstes-Handy-Kompass: Checkliste fuer die Handy-Uebergabe (fuer ERWACHSENE).
// Jede Position mit Warum + konkreter Anleitung; am Ende eine druckbare
// "Uebergabe-Urkunde" fuer das Kind (Name nur ins Druckformular getippt, NICHT
// gespeichert). Reine Anleitung - liest nichts vom Geraet. Fortschritt lokal.
// Politik docs/02: keine externen Anfragen.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';

installiereNetzwerkWaechter();

const SCHLUESSEL = 'ehk.status';
const app = document.getElementById('app');
const daten = await fetch('daten/checkliste.json').then((r) => r.json());

const lade = () => JSON.parse(localStorage.getItem(SCHLUESSEL) ?? '{}');
const speichere = (s) => localStorage.setItem(SCHLUESSEL, JSON.stringify(s));

function render() {
  const status = lade();
  const erledigt = daten.punkte.filter((p) => status[p.code]).length;
  const anteil = Math.round((erledigt / daten.punkte.length) * 100);

  const nameFeld = el('input', {
    type: 'text', maxlength: '30', placeholder: 'Name des Kindes (nur für den Druck)',
    style: 'width:100%;min-height:44px;border:2px solid var(--k-rand);border-radius:0.5rem;padding:0 0.6rem;font-size:1rem',
    'aria-label': 'Name des Kindes für die Urkunde',
  });
  // Name live in die Urkunde spiegeln - aber NICHT speichern (Datenvermeidung).
  nameFeld.addEventListener('input', () => {
    const ziel = app.querySelector('#ehk-urkunde-name');
    if (ziel) ziel.textContent = nameFeld.value.trim() || '________________';
  });

  app.replaceChildren(
    el('h1', { class: 'k-titel ehk-nur-bildschirm' }, '🧭 Erstes-Handy-Kompass'),
    el('p', { class: 'k-untertitel ehk-nur-bildschirm' }, 'Das erste Handy sicher übergeben – Schritt für Schritt (für Eltern)'),
    el('section', { class: 'k-karte ehk-nur-bildschirm' },
      el('p', { style: 'margin-top:0' }, 'Geht die Punkte gemeinsam durch und richtet sie auf dem echten Gerät ein. Diese App liest nichts aus – sie führt euch nur an. Am Ende gibt es eine Urkunde zum Ausdrucken.'),
      el('p', { style: 'margin:0' }, `Erledigt: ${erledigt} von ${daten.punkte.length} (${anteil} %)`),
      el('div', { class: 'k-fortschritt', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': daten.punkte.length, 'aria-valuenow': erledigt },
        el('div', { style: `width:${anteil}%` }))),
    ...daten.punkte.map((p) => punktKarte(p, Boolean(status[p.code]))),
    // Urkunde: nur im Druck sichtbar.
    urkunde(),
    el('section', { class: 'k-karte ehk-nur-bildschirm' },
      el('p', { style: 'font-weight:600;margin-top:0' }, '🏅 Übergabe-Urkunde'),
      el('p', { style: 'font-size:0.9rem' }, 'Name des Kindes eintippen (nur für den Ausdruck, wird nicht gespeichert), dann drucken:'),
      nameFeld,
      el('div', { class: 'k-antworten', style: 'margin-top:0.5rem' },
        el('button', { class: 'k-knopf', onclick: () => window.print() }, '🖨️ Urkunde drucken'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => { localStorage.removeItem(SCHLUESSEL); render(); } }, '🧹 Zurücksetzen'))),
    el('footer', { class: 'k-fuss ehk-nur-bildschirm' },
      el('span', {}, 'Werkzeug für Erwachsene · liest nichts vom Gerät · Daten bleiben auf diesem Gerät · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

function punktKarte(p, erledigt) {
  const box = el('input', { type: 'checkbox', id: `ehk-${p.code}`, style: 'width:1.5rem;height:1.5rem;flex-shrink:0;margin-top:0.15rem' });
  box.checked = erledigt;
  box.addEventListener('change', () => { const s = lade(); s[p.code] = box.checked; speichere(s); render(); });
  return el('section', { class: 'k-karte ehk-nur-bildschirm' },
    el('div', { style: 'display:flex;gap:0.6rem;align-items:flex-start' },
      box,
      el('label', { for: `ehk-${p.code}`, style: 'flex:1' },
        el('span', { style: 'font-weight:600' }, `${p.emoji} ${p.titel}`),
        el('span', { style: 'display:block;margin-top:0.25rem' }, p.warum))),
    el('details', { style: 'margin:0.4rem 0 0 2.1rem' },
      el('summary', { style: 'cursor:pointer;font-size:0.9rem;color:var(--k-blau-dunkel)' }, '🔧 So geht’s'),
      el('p', { style: 'font-size:0.9rem;margin:0.3rem 0 0;color:#374151' }, p.wie)));
}

function urkunde() {
  return el('section', { class: 'k-karte ehk-nur-druck', style: 'text-align:center' },
    el('p', { style: 'font-size:2rem;margin:0' }, '🏅'),
    el('h2', { style: 'font-size:1.6rem;margin:0.25rem 0' }, 'Handy-Führerschein'),
    el('p', { style: 'margin:0.75rem 0 0.25rem' }, 'Diese Urkunde bestätigt:'),
    el('p', { id: 'ehk-urkunde-name', style: 'font-size:1.5rem;font-weight:700;margin:0.25rem 0' }, '________________'),
    el('p', { style: 'margin:0.25rem auto;max-width:32rem' }, daten.urkundeText),
    el('ul', { style: 'text-align:left;max-width:28rem;margin:0.75rem auto;font-size:0.95rem' },
      ...daten.punkte.map((p) => el('li', { style: 'margin:0.15rem 0' }, `${p.emoji} ${p.titel}`))),
    el('p', { style: 'margin-top:1rem' }, 'Datum: ____________     Unterschrift Eltern: ____________     Unterschrift Kind: ____________'));
}

render();
