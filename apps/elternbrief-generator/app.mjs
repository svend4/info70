// Elternbrief-Generator Krippenjahr (für Fachkräfte, docs/10 Top-30 Nr. 17).
// Monat, Altersband und Themen wählen → fertiger Elternbrief („Was Ihr Kind
// jetzt lernt“ + bildschirmfreie Spielideen) zum Kopieren/Speichern. Immer
// über die Gruppe, nie über einzelne Kinder (keine Namen von Kindern).
// Politik docs/02: keine externen Anfragen; Auswahl lokal, löschbar.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { pruefeBausteine, baueBrief } from './logik.mjs';

installiereNetzwerkWaechter();

const SCHLUESSEL = 'ebg.auswahl';
const app = document.getElementById('app');
const daten = await fetch('daten/bausteine.json').then((r) => r.json());

const standard = () => ({
  monat: daten.monate[new Date().getMonth()] ?? daten.monate[0],
  altersband: daten.altersbaender[0].id,
  themenIds: daten.themen.slice(0, 2).map((t) => t.id),
  kitaName: '',
  gruppenName: '',
});

function lade() {
  try {
    const roh = JSON.parse(localStorage.getItem(SCHLUESSEL) ?? 'null');
    if (!roh || typeof roh !== 'object') return standard();
    return { ...standard(), ...roh, themenIds: Array.isArray(roh.themenIds) ? roh.themenIds : [] };
  } catch { return standard(); }
}
const speichere = (a) => localStorage.setItem(SCHLUESSEL, JSON.stringify(a));

function download(text) {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
  const a = el('a', { href: url, download: 'elternbrief.txt' });
  a.click();
  URL.revokeObjectURL(url);
}

function render() {
  const auswahl = lade();

  const monatWahl = el('select', {
    'aria-label': 'Monat',
    style: 'font:inherit;padding:0.5rem;border:2px solid var(--k-rand);border-radius:0.5rem',
    onchange: (ev) => { const a = lade(); a.monat = ev.target.value; speichere(a); render(); },
  }, ...daten.monate.map((m) => {
    const o = el('option', { value: m }, m);
    if (m === auswahl.monat) o.selected = true;
    return o;
  }));

  const bandWahl = el('div', { class: 'k-antworten', role: 'radiogroup', 'aria-label': 'Altersgruppe' },
    ...daten.altersbaender.map((b) => el('button', {
      class: `k-knopf k-knopf--klein ${b.id === auswahl.altersband ? '' : 'k-knopf--neutral'}`,
      role: 'radio', 'aria-checked': String(b.id === auswahl.altersband),
      onclick: () => { const a = lade(); a.altersband = b.id; speichere(a); render(); },
    }, b.name)));

  const themenWahl = el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Themen' },
    ...daten.themen.map((t) => {
      const an = auswahl.themenIds.includes(t.id);
      return el('button', {
        class: `k-knopf k-knopf--klein ${an ? '' : 'k-knopf--neutral'}`,
        role: 'checkbox', 'aria-checked': String(an),
        onclick: () => {
          const a = lade();
          a.themenIds = a.themenIds.includes(t.id) ? a.themenIds.filter((x) => x !== t.id) : [...a.themenIds, t.id];
          speichere(a); render();
        },
      }, `${an ? '☑' : '☐'} ${t.emoji} ${t.name}`);
    }));

  const feld = (label, wert, key, platzhalter) => {
    const eingabe = el('input', {
      type: 'text', maxlength: '60', value: wert, placeholder: platzhalter, 'aria-label': label,
      style: 'width:100%;padding:0.5rem;border:2px solid var(--k-rand);border-radius:0.5rem',
      oninput: (ev) => { const a = lade(); a[key] = ev.target.value; speichere(a); aktualisiereBrief(); },
    });
    return el('label', { style: 'display:block;margin:0.4rem 0;font-size:0.9rem;font-weight:600' }, label, eingabe);
  };

  const briefFeld = el('textarea', {
    readonly: true,
    style: 'width:100%;min-height:16rem;font-family:inherit;font-size:0.9rem;border:2px solid var(--k-rand);border-radius:0.5rem;padding:0.6rem;line-height:1.5',
    'aria-label': 'Fertiger Elternbrief',
  });
  function aktualisiereBrief() {
    const a = lade();
    briefFeld.value = baueBrief(daten, a) || 'Bitte oben mindestens ein Thema auswählen.';
  }

  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '✉️ Elternbrief-Generator'),
    el('p', { class: 'k-untertitel' }, '„Was Ihr Kind jetzt lernt“ – Elternbriefe fürs Krippenjahr (1–3), für Fachkräfte'),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0;font-size:0.92rem' }, daten.hinweis)),
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.05rem' }, '1. Monat & Altersgruppe'),
      el('div', { style: 'display:flex;gap:0.6rem;flex-wrap:wrap;align-items:center' }, monatWahl, bandWahl)),
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.05rem' }, '2. Themen des Monats'),
      themenWahl),
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.05rem' }, '3. Absender (optional)'),
      feld('Einrichtung', auswahl.kitaName, 'kitaName', 'z. B. Kita Sonnenblume'),
      feld('Gruppe', auswahl.gruppenName, 'gruppenName', 'z. B. Igelgruppe'),
      el('p', { style: 'margin:0.2rem 0 0;font-size:0.85rem;color:#4b5563' }, 'Bitte keine Namen von Kindern – der Brief betrifft immer die ganze Gruppe.')),
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.05rem' }, '4. Fertiger Brief'),
      briefFeld,
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--klein', onclick: (ev) => { briefFeld.select(); navigator.clipboard?.writeText(briefFeld.value); ev.target.textContent = '✔️ Kopiert!'; } }, '📋 Kopieren'),
        el('button', { class: 'k-knopf k-knopf--klein', onclick: () => download(briefFeld.value) }, '💾 Als Text speichern'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => { localStorage.removeItem(SCHLUESSEL); render(); } }, '🧹 Zurücksetzen'))),
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werkzeug für Fachkräfte · werbefrei · Auswahl bleibt auf diesem Gerät · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));

  aktualisiereBrief();
}

const fehler = pruefeBausteine(daten);
if (fehler.length) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' }, el('p', { style: 'margin:0' }, `Datenfehler: ${fehler[0]}`)));
} else {
  render();
}
