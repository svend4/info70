// Familien-Bildschirmzeit-Wette (für ELTERN+KIND 8-15, docs/09 Ось F). Alle –
// auch die Eltern – setzen sich ein eigenes Ziel und notieren SELBST für jeden
// Tag, ob es erreicht war. Keine Fernüberwachung: nur Selbstauskunft, Vergleich
// im gemeinsamen Familienrat. Namen nur als Initiale oder Nummer. Alles bleibt
// lokal. Politik docs/02: keine externen Anfragen.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { hilfeInsel } from '../../packages/kinder-ui/js/hilfe-insel.mjs';
import { TAGE, AUSKUNFT, NAME_MAX, neueWette, fuegeMitglied, entferneMitglied, setzeTag, wochenBilanz } from './wette.mjs';

installiereNetzwerkWaechter();

const SCHLUESSEL = 'fbz.auskunft';
// Der frühere Schlüssel trug die Namen aller Mitglieder. Er wird gelöscht, nur der eigene Schlüssel.
const ALTER_SCHLUESSEL = 'fbz.wette';
try { localStorage.removeItem(ALTER_SCHLUESSEL); } catch (e) { /* kein Speicher: nichts zu löschen */ }

const app = document.getElementById('app');
const FOLGE = { '': 'ja', ja: 'teils', teils: 'nein', nein: '' };

const lade = () => { try { return JSON.parse(localStorage.getItem(SCHLUESSEL) ?? 'null') || neueWette(); } catch (e) { return neueWette(); } };
const speichere = (w) => localStorage.setItem(SCHLUESSEL, JSON.stringify(w));

let wette = lade();

function zyklus(mi, tag) {
  const wert = wette.mitglieder[mi].tage[tag] || '';
  const naechste = FOLGE[wert]; // '' -> ja -> teils -> nein -> ''
  if (naechste) {
    wette = setzeTag(wette, mi, tag, naechste);
  } else {
    // zurück auf „offen“: den Tag entfernen
    wette = { ...wette, mitglieder: wette.mitglieder.map((x, i) => i === mi
      ? { ...x, tage: Object.fromEntries(Object.entries(x.tage).filter(([k]) => k !== tag)) }
      : x) };
  }
  speichere(wette);
  render();
}

function tagKnopf(mi, tag) {
  const m = wette.mitglieder[mi];
  const wert = m.tage[tag] || '';
  return el('button', {
    class: 'k-knopf k-knopf--klein k-knopf--neutral',
    style: 'min-width:2.6rem;padding:0.3rem',
    'aria-label': `${tag} für ${m.name}: ${wert ? AUSKUNFT[wert].text : 'noch offen'}`,
    onclick: () => zyklus(mi, tag),
  }, wert ? AUSKUNFT[wert].kurz : '·');
}

function mitgliedKarte(m, mi) {
  const b = wochenBilanz(m);
  return el('section', { class: 'k-karte' },
    el('div', { style: 'display:flex;justify-content:space-between;align-items:baseline;gap:0.5rem' },
      el('span', { style: 'font-weight:700;font-size:1.1rem' }, m.name),
      el('button', { class: 'k-knopf k-knopf--klein k-knopf--neutral fbz-nur-bildschirm', onclick: () => { wette = entferneMitglied(wette, mi); speichere(wette); render(); } }, '🗑️')),
    m.ziel ? el('p', { style: 'margin:0.2rem 0;color:#4b5563' }, `Ziel: ${m.ziel}`) : '',
    el('div', { style: 'display:flex;gap:0.3rem;flex-wrap:wrap;margin:0.4rem 0' },
      ...TAGE.map((tag) => el('div', { style: 'text-align:center' },
        el('div', { style: 'font-size:0.8rem;color:#4b5563' }, tag),
        tagKnopf(mi, tag)))),
    el('p', { style: 'margin:0.2rem 0 0;font-weight:600' }, `Ziel erreicht: ${b.ja} · teilweise: ${b.teils} · nicht erreicht: ${b.nein}`));
}

function render() {
  const nameFeld = el('input', { style: feldStil(), placeholder: 'z. B. M. oder 1', maxlength: NAME_MAX, 'aria-label': 'Name', 'aria-describedby': 'fbz-name-hinweis' });
  const zielFeld = el('input', { style: feldStil(), placeholder: 'Mein Ziel (z. B. unter 1 Stunde, Pausen machen)', maxlength: 60, 'aria-label': 'Ziel' });

  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '⏱️ Familien-Bildschirmzeit-Wette'),
    el('p', { class: 'k-untertitel' }, 'Alle setzen sich ein eigenes Ziel – auch die Eltern. Jede*r trägt selbst ein, wie die Woche lief. Niemand kontrolliert die anderen.'),
    el('section', { class: 'k-karte fbz-nur-bildschirm' },
      el('p', { style: 'font-weight:600;margin-top:0' }, 'Mitmachen'),
      el('label', { style: 'font-weight:600' }, 'Name'), nameFeld,
      el('p', { id: 'fbz-name-hinweis', style: 'font-size:0.85rem;color:#4b5563;margin:0.2rem 0 0.4rem' }, 'Nur Initiale oder Nummer, keine vollen Namen.'),
      el('label', { style: 'font-weight:600;display:block;margin-top:0.3rem' }, 'Mein Ziel'), zielFeld,
      el('button', { class: 'k-knopf', style: 'margin-top:0.5rem', onclick: () => {
        if (!nameFeld.value.trim()) { alert('Bitte Initiale oder Nummer eingeben.'); return; }
        wette = fuegeMitglied(wette, nameFeld.value, zielFeld.value); speichere(wette); render();
      } }, '➕ Person hinzufügen')),
    wette.mitglieder.length
      ? el('section', { class: 'k-karte' }, el('p', { style: 'margin:0;font-size:0.9rem;color:#4b5563' }, 'Tippe die Tage an: · → ja → teils → nein → ·. Beim Familienrat vergleicht ihr freiwillig – jede*r zeigt nur die eigene Woche.'))
      : el('section', { class: 'k-karte' }, el('p', { style: 'margin:0;color:#4b5563' }, 'Noch niemand dabei. Fügt euch oben hinzu – am besten auch ein Elternteil.')),
    ...wette.mitglieder.map(mitgliedKarte),
    wette.mitglieder.length ? el('section', { class: 'k-karte fbz-nur-bildschirm' },
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--klein', onclick: () => window.print() }, '🖨️ Familienrat-Übersicht drucken'),
        el('button', { class: 'k-knopf k-knopf--klein k-knopf--neutral', onclick: () => { if (confirm('Neue Woche starten (alle Einträge löschen)?')) { wette = neueWette(); speichere(wette); render(); } } }, '🔁 Neue Woche'))) : '',
    hilfeInsel({ klasse: 'fbz-nur-bildschirm' }),
    el('footer', { class: 'k-fuss fbz-nur-bildschirm' },
      el('span', {}, 'für die Familie · werbefrei · läuft offline · nur Selbstauskunft, keine Fernüberwachung · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

function feldStil() { return 'width:100%;padding:0.5rem;border:2px solid var(--k-rand);border-radius:0.5rem'; }

render();
