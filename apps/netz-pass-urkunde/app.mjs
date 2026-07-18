// Netz-Pass-Urkunde: Urkunden-Generator für Kinder (docs/09 Nr. 91).
// Das Kind geht Stationen zur Internet-Sicherheit durch (zwei Stufen: 6–8
// und 8–12), hakt Gekonntes ab und druckt am Ende seinen "Netz-Pass".
// Datenvermeidung: Der Name wird NUR ins Druckformular getippt und lebt nur
// im Speicher der Seite – er landet NIE in localStorage. Gespeichert wird
// (rein optional, auf diesem Gerät) nur die gewählte Stufe + die Häkchen.
// Politik docs/02: keine externen Anfragen, werbefrei, Vorlesen.
import { el, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';

installiereNetzwerkWaechter();

const STUFE_SCHLUESSEL = 'npu.stufe';
const STATUS_SCHLUESSEL = 'npu.status';
const app = document.getElementById('app');
const daten = await fetch('daten/stationen.json').then((r) => r.json());

let kindName = ''; // nur im Speicher der Seite, NIE in localStorage (Datenvermeidung)

const ladeStufeId = () => localStorage.getItem(STUFE_SCHLUESSEL) ?? daten.stufen[0].id;
const ladeStatus = () => JSON.parse(localStorage.getItem(STATUS_SCHLUESSEL) ?? '{}');
const speichereStatus = (s) => localStorage.setItem(STATUS_SCHLUESSEL, JSON.stringify(s));
const aktuelleStufe = () => daten.stufen.find((s) => s.id === ladeStufeId()) ?? daten.stufen[0];

function stufenWahl() {
  return el('section', { class: 'k-karte npu-nur-bildschirm' },
    el('p', { style: 'font-weight:600;margin-top:0' }, 'Welcher Netz-Pass?'),
    el('div', { class: 'k-antworten' },
      ...daten.stufen.map((s) => el('button', {
        class: `k-knopf k-knopf--klein${s.id === ladeStufeId() ? '' : ' k-knopf--neutral'}`,
        onclick: () => { localStorage.setItem(STUFE_SCHLUESSEL, s.id); render(); },
      }, `${s.emoji} ${s.name} · ${s.alter}`))));
}

function stationKarte(st, status) {
  const box = el('input', { type: 'checkbox', id: `npu-${st.id}`, style: 'width:1.6rem;height:1.6rem;flex-shrink:0;margin-top:0.15rem' });
  box.checked = Boolean(status[st.id]);
  box.addEventListener('change', () => { const s = ladeStatus(); s[st.id] = box.checked; speichereStatus(s); render(); });
  return el('section', { class: 'k-karte npu-nur-bildschirm' },
    el('div', { style: 'display:flex;gap:0.6rem;align-items:flex-start' },
      box,
      el('label', { for: `npu-${st.id}`, style: 'flex:1' },
        el('span', { style: 'font-weight:600' }, `${st.emoji} ${st.text}`))),
    el('div', { style: 'margin:0.4rem 0 0 2.2rem' },
      el('p', { style: 'font-size:0.92rem;margin:0.2rem 0;color:#374151' }, st.tipp),
      el('button', { class: 'k-knopf k-knopf--klein k-knopf--neutral', onclick: () => vorlesen(`${st.text}. ${st.tipp}`) }, '🔊 Vorlesen')));
}

function urkunde(stufe, status) {
  const geschafft = stufe.stationen.filter((s) => status[s.id]);
  return el('section', { class: 'k-karte npu-nur-druck', style: 'text-align:center' },
    el('p', { style: 'font-size:2.2rem;margin:0' }, '🏅'),
    el('h2', { style: 'font-size:1.7rem;margin:0.25rem 0' }, stufe.name),
    el('p', { style: 'margin:0.75rem 0 0.25rem' }, 'Dieser Netz-Pass gehört:'),
    el('p', { id: 'npu-urkunde-name', style: 'font-size:1.6rem;font-weight:700;margin:0.25rem 0' }, kindName.trim() || '________________'),
    el('p', { style: 'margin:0.5rem auto;max-width:32rem' }, stufe.urkundeText),
    el('ul', { style: 'text-align:left;max-width:30rem;margin:0.75rem auto;font-size:0.95rem;list-style:none;padding:0' },
      ...(geschafft.length ? geschafft : stufe.stationen).map((s) => el('li', { style: 'margin:0.2rem 0' }, `✅ ${s.text}`))),
    el('p', { style: 'margin-top:1rem;font-size:0.95rem' }, 'Datum: ____________     Unterschrift: ____________'));
}

function render() {
  const stufe = aktuelleStufe();
  const status = ladeStatus();
  const geschafft = stufe.stationen.filter((s) => status[s.id]).length;
  const alle = stufe.stationen.length;

  const nameFeld = el('input', {
    type: 'text', maxlength: 24, value: kindName,
    style: 'width:100%;font-size:1.1rem;padding:0.5rem;border:2px solid var(--k-rand);border-radius:0.5rem',
    'aria-label': 'Dein Name für den Netz-Pass', placeholder: 'Dein Vorname oder Spitzname',
  });
  nameFeld.addEventListener('input', () => {
    kindName = nameFeld.value;
    const ziel = app.querySelector('#npu-urkunde-name');
    if (ziel) ziel.textContent = kindName.trim() || '________________';
  });

  app.replaceChildren(
    el('h1', { class: 'k-titel npu-nur-bildschirm' }, '🛂 Netz-Pass'),
    el('p', { class: 'k-untertitel npu-nur-bildschirm' }, 'Zeig, dass du dich im Internet auskennst – und hol dir deine Urkunde!'),
    el('section', { class: 'k-karte npu-nur-bildschirm' },
      el('p', { style: 'margin:0' }, daten.einleitung),
      el('button', { class: 'k-knopf k-knopf--klein k-knopf--neutral', style: 'margin-top:0.5rem', onclick: () => vorlesen(daten.einleitung) }, '🔊 Vorlesen')),
    stufenWahl(),
    el('section', { class: 'k-karte npu-nur-bildschirm' },
      el('p', { style: 'margin:0' }, `Geschafft: ${geschafft} von ${alle} Stationen`),
      el('div', { class: 'k-fortschritt', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': alle, 'aria-valuenow': geschafft },
        el('div', { style: `width:${Math.round((geschafft / alle) * 100)}%` }))),
    ...stufe.stationen.map((st) => stationKarte(st, status)),
    urkunde(stufe, status),
    el('section', { class: 'k-karte npu-nur-bildschirm' },
      el('p', { style: 'font-weight:600;margin-top:0' }, '🏅 Netz-Pass ausdrucken'),
      el('p', { style: 'font-size:0.92rem' }, 'Tipp deinen Namen ein (nur für den Ausdruck – er wird nicht gespeichert), dann drucken:'),
      nameFeld,
      el('div', { class: 'k-antworten', style: 'margin-top:0.6rem' },
        el('button', { class: 'k-knopf', onclick: () => window.print() }, '🖨️ Netz-Pass drucken'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => { kindName = ''; localStorage.removeItem(STATUS_SCHLUESSEL); render(); } }, '🧹 Zurücksetzen')),
      el('p', { style: 'font-size:0.85rem;color:#4b5563;margin-bottom:0' }, 'Beim Drucken erscheint nur der Netz-Pass. Dein Name wird nirgends gespeichert – nur die Häkchen bleiben auf diesem Gerät.')),
    el('footer', { class: 'k-fuss npu-nur-bildschirm' },
      el('span', {}, 'werbefrei · läuft offline · dein Name wird nicht gespeichert · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

render();
