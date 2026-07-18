// Artikel-Lexikon in Leichter Sprache (docs/09 Ось B / Nr. 183). Nachschlage-
// Modus zu den Kinderrechten (UN-KRK): jeder Artikel in 2-3 kurzen Sätzen,
// mit Vorlesen (BFSG). Filtern nach Bereich. Politik docs/02: keine externen
// Anfragen, diese App speichert nichts.
import { el, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { boot as bootAnzeige } from '../../packages/kinder-ui/js/anzeige.mjs';

installiereNetzwerkWaechter();
bootAnzeige();

const app = document.getElementById('app');
const daten = await fetch('daten/rechte.json').then((r) => r.json());
const bereichVon = (id) => daten.bereiche.find((b) => b.id === id);
const nrText = (nr) => (nr >= 500 ? 'GC 25' : `Artikel ${nr}`);

let filter = 'alle';

function karte(a) {
  const b = bereichVon(a.bereich);
  const vorleseText = `${a.titel}. ${a.leichteSprache}`;
  return el('section', { class: 'k-karte' },
    el('div', { style: 'display:flex;gap:0.6rem;align-items:flex-start' },
      el('span', { style: 'font-size:2.2rem' }, a.emoji),
      el('div', { style: 'flex:1' },
        el('p', { style: 'margin:0;font-size:0.85rem;color:#4b5563' }, `${b.emoji} ${b.name} · ${nrText(a.nr)}`),
        el('p', { style: 'margin:0.1rem 0;font-weight:700;font-size:1.15rem' }, a.titel),
        el('p', { style: 'margin:0.2rem 0 0;font-size:1.1rem;line-height:1.5' }, a.leichteSprache),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', style: 'margin-top:0.4rem', onclick: () => vorlesen(vorleseText) }, '🔊 Vorlesen'))));
}

function render() {
  const liste = filter === 'alle' ? daten.artikel : daten.artikel.filter((a) => a.bereich === filter);
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '📖 Kinderrechte-Lexikon'),
    el('p', { class: 'k-untertitel' }, 'Deine Rechte in Leichter Sprache. Zum Nachschlagen und Vorlesen.'),
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-weight:600;margin-top:0' }, 'Welche Rechte willst du sehen?'),
      el('div', { style: 'display:flex;gap:0.4rem;flex-wrap:wrap' },
        el('button', { class: `k-knopf k-knopf--klein ${filter === 'alle' ? '' : 'k-knopf--neutral'}`, 'aria-pressed': String(filter === 'alle'), onclick: () => { filter = 'alle'; render(); } }, '⭐ Alle'),
        ...daten.bereiche.map((b) => el('button', { class: `k-knopf k-knopf--klein ${filter === b.id ? '' : 'k-knopf--neutral'}`, 'aria-pressed': String(filter === b.id), onclick: () => { filter = b.id; render(); } }, `${b.emoji} ${b.name}`)))),
    ...liste.map(karte),
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'werbefrei · läuft offline · Leichte Sprache & Vorlesen (BFSG) · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

render();
