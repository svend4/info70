// Filter-Spiegel: Beauty-Filter durchschauen (13-15 Jahre).
// Ein Comic-Avatar (SVG, KEIN Kamerabild - keine personenbezogenen Daten!)
// laesst sich mit typischen Beauty-Filtern stapeln; der Realitaets-Abstand
// waechst sichtbar mit. A/B-Vergleich, Wahrheit hinter jedem Filter, Lektionen.
// Politik docs/02: keine externen Anfragen, speichert NICHTS.
import { el, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { hilfeInsel, hilfeInselKnopf } from '../../packages/kinder-ui/js/hilfe-insel.mjs';
import { FILTER, abstandGesamt, einordnung, LEKTIONEN } from './filter.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
let aktive = [];
let zeigeOriginal = false;
let letzteWahrheit = null;

function zeige(...knoten) {
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🪞 Filter-Spiegel'),
    el('p', { class: 'k-untertitel' }, 'Stapel Filter auf ein Gesicht – und sieh zu, wie es verschwindet. (ab 13)'),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · keine Kamera · diese App speichert nichts · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

// Comic-Avatar als Inline-SVG. Bewusst KEIN Kamerabild: Das Muster ist das
// Thema, kein echtes Gesicht. Filter veraendern Attribute/Transforms.
function avatar() {
  const an = (code) => !zeigeOriginal && aktive.includes(code);
  const hautFarbe = an('haut') ? '#ffe8d6' : '#f2c9a0';
  const glowOpacity = an('glow') ? 0.35 : 0;
  const augenScale = an('augen') ? 1.35 : 1;
  const gesichtScaleX = an('schmal') ? 0.85 : 1;
  const zahnFarbe = an('zaehne') ? '#ffffff' : '#f3e9d8';
  const sommersprossenOpacity = an('haut') ? 0 : 0.5;
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 200 220');
  svg.setAttribute('width', '200');
  svg.setAttribute('height', '220');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', zeigeOriginal ? 'Avatar ohne Filter' : `Avatar mit ${aktive.length} Filtern`);
  svg.innerHTML = `
    <g transform="translate(100,0) scale(${gesichtScaleX},1) translate(-100,0)">
      <ellipse cx="100" cy="120" rx="70" ry="85" fill="${hautFarbe}" stroke="#8a5a3b" stroke-width="3"/>
      <path d="M 35 90 Q 100 20 165 90 Q 150 55 100 50 Q 50 55 35 90 Z" fill="#6b4226"/>
      <g opacity="${sommersprossenOpacity}">
        <circle cx="70" cy="140" r="2" fill="#c98a5b"/><circle cx="80" cy="147" r="2" fill="#c98a5b"/>
        <circle cx="126" cy="142" r="2" fill="#c98a5b"/><circle cx="134" cy="148" r="2" fill="#c98a5b"/>
        <circle cx="75" cy="152" r="2" fill="#c98a5b"/><circle cx="122" cy="152" r="2" fill="#c98a5b"/>
      </g>
      <g transform="translate(72,112) scale(${augenScale}) translate(-72,-112)">
        <ellipse cx="72" cy="112" rx="11" ry="13" fill="#fff"/><circle cx="72" cy="114" r="6" fill="#4a3728"/>
      </g>
      <g transform="translate(128,112) scale(${augenScale}) translate(-128,-112)">
        <ellipse cx="128" cy="112" rx="11" ry="13" fill="#fff"/><circle cx="128" cy="114" r="6" fill="#4a3728"/>
      </g>
      <path d="M 96 130 Q 100 138 104 132" fill="none" stroke="#b07a52" stroke-width="3" stroke-linecap="round"/>
      <path d="M 75 165 Q 100 185 125 165 L 121 172 Q 100 188 79 172 Z" fill="${zahnFarbe}" stroke="#a4553f" stroke-width="3"/>
      <rect x="20" y="20" width="160" height="190" rx="80" fill="#ffb35c" opacity="${glowOpacity}"/>
    </g>`;
  return svg;
}

function render() {
  const abstand = zeigeOriginal ? 0 : abstandGesamt(aktive);
  const stufe = einordnung(abstand);
  const farbe = abstand >= 80 ? 'var(--k-rot)' : abstand >= 40 ? '#f59e0b' : abstand > 0 ? '#eab308' : 'var(--k-gruen)';
  zeige(
    el('section', { class: 'k-karte', style: 'text-align:center' },
      el('div', {}, avatar()),
      el('p', { style: 'font-weight:600;margin:0.5rem 0 0.25rem' }, `Realitäts-Abstand: ${abstand} von 100`),
      el('div', { class: 'k-fortschritt', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': abstand },
        el('div', { style: `width:${abstand}%;background:${farbe}` })),
      el('p', { style: 'margin:0.5rem 0 0' }, stufe.satz),
      aktive.length > 0 ? el('button', {
        class: 'k-knopf k-knopf--neutral k-knopf--klein',
        style: 'margin-top:0.5rem',
        onclick: () => { zeigeOriginal = !zeigeOriginal; render(); },
      }, zeigeOriginal ? '🎭 Mit Filtern zeigen' : '🙂 Original zeigen (A/B)') : ''),
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-weight:600;margin-top:0' }, 'Stapel deine Filter:'),
      el('div', { class: 'k-antworten' },
        ...FILTER.map((f) =>
          el('button', {
            class: `k-knopf ${aktive.includes(f.code) ? '' : 'k-knopf--neutral'}`,
            'aria-pressed': String(aktive.includes(f.code)),
            onclick: () => {
              if (aktive.includes(f.code)) { aktive = aktive.filter((c) => c !== f.code); letzteWahrheit = null; }
              else { aktive = [...aktive, f.code]; letzteWahrheit = f; }
              zeigeOriginal = false;
              render();
            },
          }, `${f.emoji} ${f.name} – ${f.verspricht}`))),
      letzteWahrheit ? el('div', { class: 'k-hinweis k-hinweis--falsch', style: 'margin-top:0.5rem' },
        el('p', { style: 'margin:0;font-size:0.9rem' }, `🔍 Was ${letzteWahrheit.name} WIRKLICH tut: ${letzteWahrheit.wahrheit}`)) : '',
      abstand >= 80 ? el('div', { class: 'k-antworten', style: 'margin-top:0.5rem' },
        el('button', { class: 'k-knopf', onclick: lektionBildschirm }, '🪞 Und was heißt das für meinen Feed?')) : ''),
    el('section', { class: 'k-karte' },
      hilfeInselKnopf(() => zeige(hilfeInsel({ zurueck: render })))));
}

function lektionBildschirm() {
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-weight:700;margin-top:0' }, '🪞 Der Zerrspiegel-Effekt:'),
      ...LEKTIONEN.map((l) => el('p', { style: 'margin:0.5rem 0' }, l)),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(LEKTIONEN.join(' ')) }, '🔊 Vorlesen'),
        el('button', { class: 'k-knopf', onclick: () => { aktive = []; letzteWahrheit = null; zeigeOriginal = false; render(); } }, '🔁 Zurück zum Spiegel'))));
}

render();
