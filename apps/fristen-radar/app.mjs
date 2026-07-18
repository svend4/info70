// Fristen-Radar mit ICS-Export (für Betreiber, docs/09 Nr. 246). Zeigt die
// geprüften Förder-/Preis-Programme nach Einreichfrist sortiert und erzeugt
// lokal eine .ics-Kalenderdatei zum Download – kein Server, keine externen
// Requests. Datenquelle: der Förder-Navigator (gemeinsame programme.json).
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { sortiereNachFrist, mitTermin, tageBis, baueICS } from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const daten = await fetch('../foerder-navigator/daten/programme.json').then((r) => r.json());

// Heutiges Datum als ISO (nur für die Tage-bis-Anzeige; kein Netzwerk).
const jetzt = new Date();
const heuteISO = jetzt.toISOString().slice(0, 10);
const dtstamp = jetzt.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');

function fristKarte(p) {
  const tage = tageBis(p.naechsteFrist, heuteISO);
  const dringlich = tage < 0 ? '#6b7280' : tage <= 14 ? '#dc2626' : tage <= 45 ? '#ca8a04' : '#16a34a';
  const label = tage < 0 ? 'vorbei' : tage === 0 ? 'heute!' : `noch ${tage} Tage`;
  return el('section', { class: 'k-karte', style: `border-left:6px solid ${dringlich}` },
    el('div', { style: 'display:flex;justify-content:space-between;gap:0.5rem;flex-wrap:wrap' },
      el('h2', { style: 'margin:0;font-size:1.05rem' }, p.name),
      el('span', { style: `font-weight:700;color:${dringlich}` }, `${p.naechsteFrist} · ${label}`)),
    el('p', { style: 'margin:0.3rem 0;font-size:0.9rem;color:#4b5563' }, p.fristText),
    el('p', { style: 'margin:0;font-size:0.85rem' }, `Träger: ${p.traeger}`));
}

function render() {
  const termine = sortiereNachFrist(daten.programme);
  const ohneTermin = daten.programme.filter((p) => !mitTermin(daten.programme).includes(p));

  const ics = baueICS(daten.programme, { dtstamp });
  const herunterladen = () => {
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
    const a = el('a', { href: url, download: 'foerder-fristen.ics' });
    a.click();
    URL.revokeObjectURL(url);
  };

  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '📅 Fristen-Radar'),
    el('p', { class: 'k-untertitel' }, 'Förder- und Preis-Fristen nach Termin sortiert – als Kalender exportierbar (für Betreiber)'),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, `${termine.length} Programme mit festem Einreichtermin. Lade sie als Kalenderdatei (.ics) in deinen Kalender – so verpasst du kein Einreichfenster. Alles bleibt lokal, kein Server.`),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: herunterladen }, '📥 Kalender (.ics) herunterladen'),
        el('a', { class: 'k-knopf k-knopf--neutral k-knopf--klein', style: 'text-decoration:none;text-align:center', href: '../foerder-navigator/' }, '🔎 Zum Förder-Navigator'))),
    ...termine.map(fristKarte),
    ohneTermin.length
      ? el('section', { class: 'k-karte' },
          el('h2', { style: 'margin-top:0;font-size:1.05rem' }, 'Ohne festen Termin (laufend / erwartet / geschlossen)'),
          el('ul', { style: 'margin:0' }, ...ohneTermin.map((p) => el('li', { style: 'margin:0.25rem 0' }, `${p.name} – ${p.fristText}`))))
      : '',
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werkzeug für Erwachsene · läuft offline · kein Netzwerkzugriff · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

render();
