// Münz-Trick: erlebbare Kostenfalle "Spiel-Währung" (8-12 Jahre).
// Das Kind waehlt ein Wunsch-Item, sieht den Preis in Juwelen - und deckt
// dann den WAHREN Preis in Euro auf: welche Pakete es kaufen muss, was das
// echt kostet und welcher "Rest" uebrig bleibt. Reine Logik in logik.mjs.
// Politik docs/02: keine externen Anfragen, speichert NICHTS.
import { el, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { PAKETE, ITEMS, preisPro100, wahrerPreis, cent, LEKTIONEN } from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
let aufgedeckt = null; // item-code, dessen Echtpreis gezeigt wird

function zeige(...knoten) {
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '💎 Münz-Trick'),
    el('p', { class: 'k-untertitel' }, 'Juwelen, Coins, V-Bucks – wie viel echtes Geld steckt dahinter?'),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · diese App speichert nichts · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
  app.querySelector('button')?.focus();
}

function paketeText(pakete) {
  return Object.entries(pakete)
    .sort((a, b) => Number(b[0]) - Number(a[0]))
    .map(([jw, n]) => `${n}× ${jw} 💎`)
    .join(' + ');
}

function render() {
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, 'Im Shop stehen Preise in 💎 Juwelen – nicht in Euro. Tippe ein Item an und deck den echten Preis auf.'),
      el('div', { class: 'k-antworten' },
        ...ITEMS.map((it) =>
          el('button', {
            class: `k-knopf ${aufgedeckt === it.code ? '' : 'k-knopf--neutral'}`,
            onclick: () => { aufgedeckt = it.code; render(); },
          }, `${it.emoji} ${it.name} – ${it.juwelen} 💎`)))),
    aufgedeckt ? echtpreisKarte(ITEMS.find((i) => i.code === aufgedeckt)) : '',
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-weight:600;margin-top:0' }, '🏷️ Die Juwelen-Pakete im Shop:'),
      el('table', { style: 'width:100%;border-collapse:collapse;font-size:0.9rem' },
        el('thead', {}, el('tr', {},
          el('th', { style: 'text-align:left;border-bottom:2px solid var(--k-rand);padding:0.3rem' }, 'Paket'),
          el('th', { style: 'text-align:right;border-bottom:2px solid var(--k-rand);padding:0.3rem' }, 'Preis'),
          el('th', { style: 'text-align:right;border-bottom:2px solid var(--k-rand);padding:0.3rem' }, 'pro 100 💎'))),
        el('tbody', {},
          ...PAKETE.map((p) =>
            el('tr', {},
              el('td', { style: 'border-bottom:1px solid var(--k-rand);padding:0.3rem' }, `${p.juwelen} 💎 ${p.lockung ? `(${p.lockung})` : ''}`),
              el('td', { style: 'border-bottom:1px solid var(--k-rand);padding:0.3rem;text-align:right' }, cent(p.cent)),
              el('td', { style: 'border-bottom:1px solid var(--k-rand);padding:0.3rem;text-align:right;color:#4b5563' }, cent(Math.round(preisPro100(p)))))))),
      el('p', { style: 'font-size:0.85rem;margin-bottom:0;color:#4b5563' }, 'Fällt dir auf? Je größer das Paket, desto „billiger“ pro Juwel – so sollst du mehr kaufen, als du brauchst.')),
    aufgedeckt ? el('section', { class: 'k-karte' },
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: lektionBildschirm }, '🎓 Warum ist das so? (Auflösung)'))) : '');
}

function echtpreisKarte(item) {
  const w = wahrerPreis(item);
  return el('section', { class: 'k-karte' },
    el('p', { style: 'font-weight:700;margin-top:0' }, `${item.emoji} ${item.name}`),
    el('p', { style: 'margin:0.25rem 0' }, 'Shop-Preis: ', el('strong', {}, w.scheinPreis)),
    el('div', { class: 'k-hinweis k-hinweis--falsch', style: 'margin:0.5rem 0' },
      el('p', { style: 'margin:0 0 0.25rem' }, 'So musst du an die Juwelen kommen (günstigster Weg):'),
      el('p', { style: 'margin:0 0 0.25rem' }, paketeText(w.pakete)),
      el('p', { style: 'margin:0;font-size:1.15rem' }, 'Echter Preis: ', el('strong', {}, w.centText))),
    el('p', { style: 'margin:0.25rem 0' }, `Du bekommst ${w.erhalten} 💎 und brauchst ${item.juwelen} 💎.`),
    el('div', { class: 'k-hinweis', style: 'margin-top:0.25rem' },
      el('p', { style: 'margin:0' }, `🪝 Rest: ${w.rest} 💎 – zu wenig fürs Nächste, aber genug, dass du bald „nur ein kleines Paket noch“ kaufst.`)),
    el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', style: 'margin-top:0.5rem', onclick: () => vorlesen(`${item.name} kostet ${item.juwelen} Juwelen. Echter Preis: ${w.centText}. Es bleiben ${w.rest} Juwelen übrig.`) }, '🔊 Vorlesen'));
}

function lektionBildschirm() {
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-weight:700;margin-top:0' }, '🎓 Der Münz-Trick – aufgedeckt:'),
      ...LEKTIONEN.map((l) => el('p', { style: 'margin:0.5rem 0' }, l)),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(LEKTIONEN.join(' ')) }, '🔊 Vorlesen'),
        el('button', { class: 'k-knopf', onclick: () => { aufgedeckt = null; render(); } }, '🔁 Zurück zum Shop'))));
}

render();
