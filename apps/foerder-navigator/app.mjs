// Förder-Navigator: Programme, Preise und Siegel für Kindermedien-Projekte.
// Zielgruppe: ERWACHSENE (Betreiber, Produzent*innen, Antragstellende).
// Datenbasis: verifizierte Recherche des Monorepos (docs/06), jede Karte
// verlinkt ihre Originalquelle. Keine externen Anfragen; Filterzustand
// bleibt nur im Speicher der Seite (nicht einmal localStorage).
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { filtereProgramme, sortiereNachFrist, istAbgelaufen, anteilsRechnung } from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const daten = await fetch('daten/programme.json').then((r) => r.json());
const heute = new Date().toISOString().slice(0, 10);

const BEDARFE = [
  [null, 'Alles'],
  ['digital', '💻 Digitales Kinderangebot'],
  ['game', '🎮 Spiel'],
  ['film', '🎬 Film/Serie'],
  ['drehbuch', '✍️ Stoff/Drehbuch'],
  ['sichtbarkeit', '🏆 Sichtbarkeit (Preise/Siegel)'],
];
const SITZE = [
  [null, 'Egal / bundesweit'],
  ['bayern', 'Bayern'],
  ['nrw', 'NRW'],
  ['mitteldeutschland', 'Sachsen / Sachsen-Anhalt / Thüringen'],
];
const STATUS_BADGE = {
  termin: ['📅 Frist', 'k-hinweis--richtig'],
  erwartet: ['🔭 erwartet', ''],
  laufend: ['♾️ laufend', 'k-hinweis--richtig'],
  geschlossen: ['⛔ Fenster zu', 'k-hinweis--falsch'],
};

const filter = { bedarf: null, sitz: null };

function knopfleiste(optionen, schluessel) {
  return el('div', { style: 'display:flex;gap:0.4rem;flex-wrap:wrap' },
    ...optionen.map(([wert, name]) =>
      el('button', {
        class: `k-knopf k-knopf--klein ${filter[schluessel] === wert ? '' : 'k-knopf--neutral'}`,
        'aria-pressed': String(filter[schluessel] === wert),
        onclick: () => { filter[schluessel] = wert; render(); },
      }, name)));
}

function programmKarte(p) {
  const [badge, badgeKlasse] = STATUS_BADGE[p.fristStatus];
  const abgelaufen = istAbgelaufen(p, heute) && p.fristStatus === 'termin';
  return el('section', { class: 'k-karte' },
    el('h2', { style: 'margin-top:0;font-size:1.05rem' }, p.name),
    el('p', { style: 'margin:0 0 0.5rem;font-size:0.85rem;color:#4b5563' }, p.traeger),
    el('div', { class: `k-hinweis ${abgelaufen ? 'k-hinweis--falsch' : badgeKlasse}`, style: 'margin-bottom:0.6rem' },
      el('p', { style: 'margin:0;font-size:0.9rem' }, `${abgelaufen ? '⌛ abgelaufen · ' : `${badge} · `}${p.fristText}`)),
    el('p', { style: 'font-size:0.9rem;margin:0.25rem 0' }, `💶 ${p.art} — ${p.hoehe}`),
    el('p', { style: 'font-size:0.9rem;margin:0.25rem 0' }, `⚖️ ${p.eigenanteil}`),
    el('p', { style: 'font-size:0.9rem;margin:0.25rem 0' }, `👤 ${p.wer}`),
    p.beratung && p.beratung !== '-' ? el('p', { style: 'font-size:0.9rem;margin:0.25rem 0' }, `🗣️ ${p.beratung}`) : '',
    p.sitz ? el('p', { style: 'font-size:0.9rem;margin:0.25rem 0' }, `📍 Sitz erforderlich: ${SITZE.find(([w]) => w === p.sitz)[1]}`) : '',
    el('p', { style: 'font-size:0.85rem;margin:0.5rem 0 0' },
      el('a', { href: p.quelle, rel: 'noopener', style: 'display:inline-flex;align-items:center;min-height:3rem;min-width:3rem;box-sizing:border-box' }, 'Originalquelle prüfen ↗')));
}

function rechner() {
  const eingabe = el('input', {
    type: 'number', min: '0', step: '1000', placeholder: 'z. B. 50000',
    style: 'width:100%;font:inherit;padding:0.6rem;border-radius:0.5rem;border:2px solid var(--k-rand)',
    'aria-label': 'Gesamtkosten des Projekts in Euro',
  });
  const ausgabe = el('p', { style: 'margin-bottom:0' }, 'Gib die geplanten Gesamtkosten ein.');
  eingabe.addEventListener('input', () => {
    const kosten = Number(eingabe.value);
    if (!kosten) { ausgabe.textContent = 'Gib die geplanten Gesamtkosten ein.'; return; }
    const { foerderung, eigenanteil } = anteilsRechnung(kosten);
    ausgabe.textContent = `Bei 80 % Förderquote: max. ${foerderung.toLocaleString('de-DE')} € Zuschuss, mind. ${eigenanteil.toLocaleString('de-DE')} € Eigenanteil. Achtung (BzKJ): vorhandene Infrastruktur und Stammpersonal zählen nicht als Eigenanteil.`;
  });
  return el('section', { class: 'k-karte' },
    el('h2', { style: 'margin-top:0;font-size:1.05rem' }, '🧮 Eigenanteil-Rechner (Anteilsfinanzierung 80/20)'),
    eingabe, ausgabe);
}

function render() {
  const treffer = sortiereNachFrist(filtereProgramme(daten.programme, filter), heute);
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🧭 Förder-Navigator'),
    el('p', { class: 'k-untertitel' }, 'Förderung, Preise und Siegel für Kindermedien-Projekte (für Erwachsene)'),
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-weight:600;margin-top:0' }, 'Was suchst du?'),
      knopfleiste(BEDARFE, 'bedarf'),
      el('p', { style: 'font-weight:600' }, 'Wo sitzt der Träger?'),
      knopfleiste(SITZE, 'sitz'),
      el('p', { style: 'font-size:0.85rem;color:#4b5563;margin-bottom:0' },
        `${treffer.length} von ${daten.programme.length} Programmen · Stand ${daten.stand} · ${daten.hinweis}`)),
    ...treffer.map(programmKarte),
    rechner(),
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werkzeug für Erwachsene · keine Datenspeicherung · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

render();
