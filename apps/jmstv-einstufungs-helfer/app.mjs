// JMStV-Einstufungs-Helfer (für Betreiber, docs/09 Ось D Nr. 225).
// Merkmale + Interaktionsrisiken ankreuzen → empfohlene Altersstufe,
// technische Mittel und ein age-de.xml-Label zum Download.
// Politik docs/02: keine externen Anfragen; alles lokal, nur localStorage.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { empfohleneStufe, technischeMittel, stufeLabel, ageDeXml, metaTag, bericht } from './logik.mjs';

installiereNetzwerkWaechter();

const SCHLUESSEL = 'jmstv.auswahl';
const app = document.getElementById('app');
const daten = await fetch('daten/einstufung.json').then((r) => r.json());

const lade = () => JSON.parse(localStorage.getItem(SCHLUESSEL) ?? '{"merkmale":[],"interaktion":[],"url":""}');
const speichere = (s) => localStorage.setItem(SCHLUESSEL, JSON.stringify(s));

// Eingabehinweis am URL-Feld: keine Kindernamen eintragen. Sichtbar, als eigenes Element
// direkt vor dem Feld; das Feld verweist per aria-describedby darauf. Der Feldname bleibt gleich.
const KINDER_HINWEIS = 'Keine Namen von Kindern eingeben.';
const kinderHinweis = (id) => el('span', { id, style: 'display:block;font-size:0.85rem;color:#4b5563;margin:0 0 0.3rem' }, KINDER_HINWEIS);

function download(name, text, typ = 'text/plain') {
  const url = URL.createObjectURL(new Blob([text], { type: `${typ};charset=utf-8` }));
  const a = el('a', { href: url, download: name });
  a.click();
  URL.revokeObjectURL(url);
}

function checkbox(gesetzt, label, hilfe, onToggle) {
  const box = el('button', {
    class: `k-knopf k-knopf--klein${gesetzt ? '' : ' k-knopf--neutral'}`,
    role: 'checkbox', 'aria-checked': String(gesetzt), onclick: onToggle,
    style: 'text-align:start',
  }, `${gesetzt ? '☑' : '☐'} ${label}`);
  return el('div', { style: 'padding:0.35rem 0;border-top:1px solid var(--k-rand)' },
    box,
    hilfe ? el('p', { style: 'margin:0.2rem 0 0;font-size:0.82rem;color:#4b5563' }, hilfe) : null);
}

function render() {
  const s = lade();
  const stufe = empfohleneStufe(daten, s.merkmale, s.interaktion);

  const toggle = (feld, id) => {
    const cur = lade();
    cur[feld] = cur[feld].includes(id) ? cur[feld].filter((x) => x !== id) : [...cur[feld], id];
    speichere(cur); render();
  };

  const merkmalKarten = el('section', { class: 'k-karte' },
    el('h2', { style: 'margin-top:0;font-size:1.05rem' }, '1. Inhaltsmerkmale'),
    ...daten.merkmale.map((m) => checkbox(s.merkmale.includes(m.id), `${m.text} (ab ${m.minStufe})`, m.hilfe, () => toggle('merkmale', m.id))));

  const interaktionKarten = el('section', { class: 'k-karte' },
    el('h2', { style: 'margin-top:0;font-size:1.05rem' }, '2. Interaktion & Risiken'),
    ...daten.interaktion.map((i) => checkbox(s.interaktion.includes(i.id), i.text, i.mittel, () => toggle('interaktion', i.id))));

  const urlFeld = el('input', {
    type: 'text', value: s.url ?? '', placeholder: 'https://meine-kinderseite.example',
    'aria-label': 'URL des Angebots (für das age-de.xml-Label)', 'aria-describedby': 'jmstv-hinweis-url',
    style: 'width:100%;padding:0.5rem;border:2px solid var(--k-rand);border-radius:0.5rem',
    oninput: (ev) => { const cur = lade(); cur.url = ev.target.value; speichere(cur); ergebnisNeu(); },
  });

  const ergebnis = el('div', { id: 'ergebnis' });

  function ergebnisNeu() {
    const cur = lade();
    const st = empfohleneStufe(daten, cur.merkmale, cur.interaktion);
    if (st === null) {
      ergebnis.replaceChildren(el('section', { class: 'k-karte' }, el('p', { style: 'margin:0' }, 'Bitte oben mindestens ein Inhaltsmerkmal ankreuzen.')));
      return;
    }
    const mittel = technischeMittel(daten, st, cur.interaktion);
    const xml = ageDeXml(st, cur.url || 'https://example.org');
    const berichtText = bericht(daten, cur.merkmale, cur.interaktion, cur.url || 'https://example.org');

    const xmlFeld = el('textarea', {
      readonly: true,
      style: 'width:100%;min-height:9rem;font-family:monospace;font-size:0.78rem;border:2px solid var(--k-rand);border-radius:0.5rem;padding:0.5rem',
      'aria-label': 'age-de.xml',
    });
    xmlFeld.value = xml;

    ergebnis.replaceChildren(
      el('section', { class: 'k-karte', style: 'background:#eff6ff' },
        el('h2', { style: 'margin-top:0;font-size:1.1rem' }, 'Empfohlene Altersstufe'),
        el('p', { style: 'font-size:1.3rem;font-weight:700;margin:0.2rem 0' }, stufeLabel(daten, st)),
        st >= 18 ? el('p', { style: 'margin:0.3rem 0 0;color:#b91c1c;font-weight:600' }, '⚠️ Für Kinderangebote grundsätzlich unzulässig – dringend rechtlich prüfen.') : null),
      el('section', { class: 'k-karte' },
        el('h2', { style: 'margin-top:0;font-size:1.05rem' }, 'Technische Mittel (JMStV)'),
        el('ul', { style: 'margin:0;padding-inline-start:1.2rem;font-size:0.92rem' }, ...mittel.map((m) => el('li', { style: 'margin:0.25rem 0' }, m)))),
      el('section', { class: 'k-karte' },
        el('h2', { style: 'margin-top:0;font-size:1.05rem' }, 'age-de.xml-Label'),
        xmlFeld,
        el('p', { style: 'margin:0.3rem 0;font-size:0.85rem' }, `Meta-Tag: `, el('code', {}, metaTag(st))),
        el('div', { class: 'k-antworten' },
          el('button', { class: 'k-knopf k-knopf--klein', onclick: () => download('age-de.xml', xml, 'application/xml') }, '💾 age-de.xml'),
          el('button', { class: 'k-knopf k-knopf--klein', onclick: () => download('jmstv-einstufung.txt', berichtText) }, '💾 Prüfbericht'),
          el('button', { class: 'k-knopf k-knopf--klein', onclick: (ev) => { navigator.clipboard?.writeText(xml); ev.target.textContent = '✔️ Kopiert!'; } }, '📋 XML kopieren'))));
  }

  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🔞 JMStV-Einstufungs-Helfer'),
    el('p', { class: 'k-untertitel' }, 'Alterskennzeichnung nach JMStV bestimmen und age-de.xml-Label erzeugen (für Betreiber)'),
    el('section', { class: 'k-karte' }, el('p', { style: 'margin:0;font-size:0.9rem' }, daten.hinweis)),
    merkmalKarten,
    interaktionKarten,
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.05rem' }, '3. URL des Angebots'),
      kinderHinweis('jmstv-hinweis-url'),
      urlFeld,
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => { localStorage.removeItem(SCHLUESSEL); render(); } }, '🧹 Zurücksetzen'))),
    ergebnis,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werkzeug für Erwachsene · kein Rechtsrat · Daten bleiben auf diesem Gerät · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));

  ergebnisNeu();
}

render();
