// Daten-Radiergummi: das Loeschrecht sichtbar machen (8-12 Jahre).
// Phase 1: Ein (fiktives) Foto verteilt sich Station fuer Station als Kopien-
// Netz. Phase 2: Der DSGVO-Radiergummi loescht Server und Partner - aber der
// Screenshot bleibt. Kernlehre: Das Recht ist stark, Vorausdenken ist staerker.
// Politik docs/02: keine externen Anfragen, speichert NICHTS.
import { el, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { hilfeInsel, hilfeInselKnopf } from '../../packages/kinder-ui/js/hilfe-insel.mjs';
import { AUSBREITUNG, kopienZahl, radiere, LEKTIONEN, MUSTER_SATZ } from './radiergummi.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
let schritt = 0;
let geloeschtIds = new Set();

function zeige(...knoten) {
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🧽 Daten-Radiergummi'),
    el('p', { class: 'k-untertitel' }, 'Wie weit kommt dein Löschrecht? Finde es heraus.'),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · diese App speichert nichts · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
  app.querySelector('button')?.focus();
}

function netzKarten(bisSchritt) {
  return AUSBREITUNG.slice(0, bisSchritt + 1).map((k) => {
    const geloescht = geloeschtIds.has(k.id);
    const stil = geloescht
      ? 'opacity:0.45;text-decoration:line-through'
      : k.loeschbar === false && geloeschtIds.size > 0 ? 'outline:3px solid var(--k-rot);border-radius:0.5rem' : '';
    return el('div', { class: 'k-hinweis', style: `margin:0.4rem 0;${stil}` },
      el('p', { style: 'margin:0;font-weight:600' }, `${k.emoji} ${k.name} ${geloescht ? '· 🧽 gelöscht' : k.loeschbar === false && geloeschtIds.size > 0 ? '· ❌ bleibt!' : ''}`),
      el('p', { style: 'margin:0.15rem 0 0;font-size:0.85rem;color:#374151' }, k.satz));
  });
}

function startBildschirm() {
  schritt = 0;
  geloeschtIds = new Set();
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, 'Stell dir vor: Du postest ein Foto in der (erfundenen) App „GlitzerPic“. Schau zu, wohin es wandert – und teste dann deinen mächtigsten Knopf: das Löschrecht.'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: () => { schritt = 0; ausbreitungBildschirm(); } }, '📸 Foto posten (nur hier im Spiel!)'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen('Stell dir vor: Du postest ein Foto. Schau zu, wohin es wandert, und teste dann dein Löschrecht.') }, '🔊 Vorlesen'))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin:0' }, '💡 Alles hier ist Simulation: kein echtes Foto, keine echte App, nichts wird gespeichert.')),
    el('section', { class: 'k-karte' },
      hilfeInselKnopf(() => zeige(hilfeInsel({ zurueck: startBildschirm })))));
}

function ausbreitungBildschirm() {
  const fertig = schritt >= AUSBREITUNG.length - 1;
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-untertitel', style: 'margin-top:0' }, `Station ${schritt + 1} von ${AUSBREITUNG.length} · Kopien unterwegs: ${Math.max(0, schritt)}`),
      ...netzKarten(schritt),
      el('div', { class: 'k-antworten' },
        fertig
          ? el('button', { class: 'k-knopf', onclick: radierBildschirm }, `🧽 Jetzt: Löschung verlangen! (${kopienZahl()} Kopien)`)
          : el('button', { class: 'k-knopf', onclick: () => { schritt++; ausbreitungBildschirm(); } }, '➡️ Wohin wandert es weiter?'))));
}

function radierBildschirm() {
  const { geloescht, bleibt } = radiere();
  geloeschtIds = new Set(geloescht.map((k) => k.id));
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-weight:700;margin-top:0' }, '🧽 Dein Radiergummi (Artikel 17 DSGVO) hat gearbeitet:'),
      ...netzKarten(AUSBREITUNG.length - 1),
      el('div', { class: 'k-hinweis k-hinweis--richtig', style: 'margin-top:0.75rem' },
        el('p', { style: 'margin:0' }, `✅ ${geloescht.length} Kopien gelöscht: Server und Partner MÜSSEN löschen, wenn ihr es verlangt.`)),
      el('div', { class: 'k-hinweis k-hinweis--falsch' },
        el('p', { style: 'margin:0' }, `❌ ${bleibt.length} Kopie bleibt: ${bleibt[0].name}. Private Screenshots erreicht kein Gesetz-Radiergummi.`)),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: lektionBildschirm }, 'Was lerne ich daraus? ➡️'))));
}

function lektionBildschirm() {
  zeige(
    el('section', { class: 'k-karte' },
      ...LEKTIONEN.map((l) => el('p', { style: 'margin:0.5rem 0' }, l)),
      el('div', { class: 'k-hinweis' },
        el('p', { style: 'margin:0;font-size:0.9rem' }, `✍️ Muster-Satz zum Merken: „${MUSTER_SATZ}“`)),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(LEKTIONEN.join(' ')) }, '🔊 Vorlesen'),
        el('button', { class: 'k-knopf', onclick: startBildschirm }, '🔁 Nochmal von vorn'))));
}

startBildschirm();
