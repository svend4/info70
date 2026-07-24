// Familien-Budget: klein anfangen (8-12). Einfacher Einnahmen/Ausgaben-
// Simulator mit Spielgeld: feste Kosten sind bezahlt, mit dem freien Rest
// Bedürfnisse, Wünsche und Sparen abwägen. Keine echten Käufe, keine Werbung.
// Praleska docs/10 (Top-30 Nr. 23). Politik docs/02: keine externen Anfragen,
// speichert nichts.
import { el, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { boot as bootAnzeige } from '../../packages/kinder-ui/js/anzeige.mjs';
import { pruefeBudget, festeSumme, frei, summe, gewaehlte, bewerteAuswahl } from './logik.mjs';

installiereNetzwerkWaechter();
bootAnzeige();

const app = document.getElementById('app');
const daten = await fetch('daten/budget.json').then((r) => r.json());
const BUDGET = frei(daten);
const ART = { beduerfnis: '🧡 wird gebraucht', wunsch: '⭐ Wunsch', sparen: '🐷 Sparen' };

let auswahl = [];
let ergebnis = null;

function toggle(id) {
  auswahl = auswahl.includes(id) ? auswahl.filter((x) => x !== id) : [...auswahl, id];
  ergebnis = null;
  render();
}

function festeKostenKarte() {
  return el('section', { class: 'k-karte' },
    el('h2', { style: 'margin-top:0;font-size:1.05rem' }, '1. Was schon bezahlt ist'),
    el('p', { style: 'margin:0 0 0.3rem;font-size:0.9rem' }, `Die Familie hat im Monat ${daten.einkommen} € Einkommen. Davon gehen feste Kosten ab:`),
    ...daten.festeKosten.map((f) => el('div', { style: 'display:flex;justify-content:space-between;padding:0.15rem 0;font-size:0.92rem' },
      el('span', {}, `${f.emoji} ${f.name}`), el('span', {}, `${f.betrag} €`))),
    el('div', { style: 'display:flex;justify-content:space-between;border-top:2px solid var(--k-rand);margin-top:0.3rem;padding-top:0.3rem;font-weight:700' },
      el('span', {}, 'Bleibt frei für diesen Monat'), el('span', {}, `${BUDGET} €`)));
}

function postenKarte() {
  const ausgegeben = summe(gewaehlte(daten, auswahl));
  const rest = BUDGET - ausgegeben;
  return el('section', { class: 'k-karte' },
    el('h2', { style: 'margin-top:0;font-size:1.05rem' }, '2. Du planst mit: Was nimmt die Familie?'),
    ...daten.posten.map((p) => {
      const an = auswahl.includes(p.id);
      return el('div', { style: 'padding:0.35rem 0;border-top:1px solid var(--k-rand)' },
        el('button', {
          class: `k-knopf k-knopf--klein ${an ? '' : 'k-knopf--neutral'}`,
          role: 'checkbox', 'aria-checked': String(an), style: 'text-align:start;width:100%',
          onclick: () => toggle(p.id),
        }, `${an ? '☑' : '☐'} ${p.emoji} ${p.name} — ${p.preis} €`),
        el('small', { style: 'color:#4b5563' }, ART[p.art]));
    }),
    el('div', { style: `margin-top:0.5rem;padding:0.5rem;border-radius:0.5rem;font-weight:700;background:${rest < 0 ? '#fee2e2' : '#dcfce7'}` },
      `Ausgesucht: ${ausgegeben} € · ${rest < 0 ? `Es fehlen ${-rest} €!` : `Noch übrig: ${rest} €`}`),
    el('div', { class: 'k-antworten', style: 'margin-top:0.4rem' },
      el('button', { class: 'k-knopf', onclick: () => { ergebnis = bewerteAuswahl(daten, auswahl); render(); } }, '✅ Monat abschließen'),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => { auswahl = []; ergebnis = null; render(); } }, '🧹 Neu planen')));
}

function ergebnisKarte() {
  if (!ergebnis) return null;
  const FARBE = { super: '#dcfce7', gut: '#eff6ff', ueberlegen: '#fef3c7', ueberzogen: '#fee2e2' };
  const TITEL = { super: '🌟 Super geplant!', gut: '👍 Gut geplant!', ueberlegen: '🤔 Überleg nochmal', ueberzogen: '⚠️ Das reicht nicht' };
  return el('section', { class: 'k-karte', style: `background:${FARBE[ergebnis.stufe]}` },
    el('p', { style: 'margin:0;font-weight:700;font-size:1.1rem' }, TITEL[ergebnis.stufe]),
    el('ul', { style: 'margin:0.3rem 0 0;padding-inline-start:1.2rem' },
      ...ergebnis.hinweise.map((h) => el('li', { style: 'margin:0.2rem 0' }, h))),
    el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', style: 'margin-top:0.3rem', onclick: () => vorlesen(ergebnis.hinweise.join(' ')) }, '🔊 Vorlesen'));
}

function render() {
  app.replaceChildren(...[
    el('h1', { class: 'k-titel' }, '💶 Familien-Budget'),
    el('p', { class: 'k-untertitel' }, 'Klein anfangen: Bedürfnisse, Wünsche und Sparen abwägen (8–12)'),
    el('section', { class: 'k-karte' }, el('p', { style: 'margin:0;font-size:0.9rem' }, daten.hinweis)),
    festeKostenKarte(),
    postenKarte(),
    ergebnisKarte(),
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · Spielgeld, keine echten Käufe · nichts wird gespeichert · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')),
  ].filter(Boolean));
}

const fehler = pruefeBudget(daten);
if (fehler.length) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' }, el('p', { style: 'margin:0' }, `Datenfehler: ${fehler[0]}`)));
} else {
  render();
}
