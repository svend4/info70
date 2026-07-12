// Bewegungs-Schatzkiste: filterbare Karten-Kartei mit Bewegungsspiel-Ideen.
// Zielgruppe: ERWACHSENE (Fachkraefte in der Kita, Eltern) - kein Kinder-Screen.
// Konzept: die sieben Bewegungsarten aus der Bewegungspaedagogik (Praleska-
// Ableitung, docs/10). Alle Spielideen, Anleitungen und Tipps sind NEU
// formuliert; es gibt keine uebernommenen Texte und bewusst keine Liedtexte -
// die Kreis-/Ordnungsspiele sind als Spieltyp beschrieben.
// Kernfeature: druckbare Kartei (jede Idee = Karteikarte).
// Politik docs/02: CSP self + NetzwerkWaechter; KEINE Speicherung - der
// Filterzustand bleibt nur im Speicher der Seite (nicht einmal localStorage).
// Kein Score, kein Ranking, kein Kindervergleich: dies ist eine Materialkiste,
// es werden Spiele geplant, nie Kinder bewertet.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { filtereSpiele, zaehleJeKategorie } from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const daten = await fetch('daten/spiele.json').then((r) => r.json());

const ALTERSBAENDER = [
  [null, 'Alle Alter'],
  ['1-3', '🍼 1-3 Jahre'],
  ['3-5', '🧒 3-5 Jahre'],
  ['5-7', '🎒 5-7 Jahre'],
];
const ORTE = [
  [null, 'Egal wo'],
  ['drinnen', '🏠 drinnen'],
  ['draussen', '🌳 draußen'],
];

// Filterzustand: lebt nur hier im Speicher, wird nirgends gesichert.
const filter = { kategorie: null, altersband: null, ort: null };

const kategorieVon = (id) => daten.kategorien.find((k) => k.id === id);

function knopfleiste(optionen, schluessel) {
  return el('div', { style: 'display:flex;gap:0.4rem;flex-wrap:wrap' },
    ...optionen.map(([wert, name]) =>
      el('button', {
        class: `k-knopf k-knopf--klein ${filter[schluessel] === wert ? '' : 'k-knopf--neutral'}`,
        'aria-pressed': String(filter[schluessel] === wert),
        onclick: () => { filter[schluessel] = wert; render(); },
      }, name)));
}

function kategorieLeiste() {
  const zaehl = zaehleJeKategorie(daten.spiele);
  const optionen = [
    el('button', {
      class: `k-knopf k-knopf--klein ${filter.kategorie === null ? '' : 'k-knopf--neutral'}`,
      'aria-pressed': String(filter.kategorie === null),
      onclick: () => { filter.kategorie = null; render(); },
    }, `Alle Arten (${daten.spiele.length})`),
    ...daten.kategorien.map((k) =>
      el('button', {
        class: `k-knopf k-knopf--klein ${filter.kategorie === k.id ? '' : 'k-knopf--neutral'}`,
        'aria-pressed': String(filter.kategorie === k.id),
        onclick: () => { filter.kategorie = k.id; render(); },
      }, `${k.emoji} ${k.name} (${zaehl[k.id] ?? 0})`)),
  ];
  return el('div', { style: 'display:flex;gap:0.4rem;flex-wrap:wrap' }, ...optionen);
}

function marke(text) {
  return el('span', { class: 'bsk-marke' }, text);
}

function spielKarte(s) {
  const k = kategorieVon(s.kategorie);
  const orte = s.ort.map((o) => (o === 'drinnen' ? '🏠 drinnen' : '🌳 draußen')).join(' · ');
  return el('section', { class: 'k-karte bsk-karte' },
    el('h2', { style: 'margin-top:0;font-size:1.1rem' }, s.titel),
    el('p', { style: 'margin:0 0 0.4rem;font-size:0.85rem;color:#4b5563' }, `${k?.emoji ?? ''} ${k?.name ?? s.kategorie}`),
    el('div', { class: 'bsk-marken' },
      marke(`👶 ${s.altersband} Jahre`),
      marke(`⏱️ ${s.dauer}`),
      marke(orte)),
    el('p', { style: 'margin:0.2rem 0;font-size:0.9rem' }, el('strong', {}, 'Material: '), s.material),
    el('div', {},
      el('p', { style: 'margin:0.5rem 0 0.25rem;font-weight:600' }, 'So geht es:'),
      el('ol', { style: 'margin:0;padding-left:1.3rem' },
        ...s.anleitung.map((schritt) => el('li', { style: 'margin:0.2rem 0' }, schritt)))),
    el('div', { class: 'k-hinweis', style: 'margin:0.6rem 0 0' },
      el('p', { style: 'margin:0;font-size:0.9rem' }, el('strong', {}, '🔄 Drinnen / Draußen: '), s.variante)),
    el('div', { class: 'k-hinweis k-hinweis--richtig', style: 'margin:0.5rem 0 0' },
      el('p', { style: 'margin:0;font-size:0.9rem' }, el('strong', {}, '💚 Alle machen mit: '), s.inklusionsTipp)));
}

function filterText() {
  const teile = [];
  if (filter.kategorie) teile.push(kategorieVon(filter.kategorie)?.name);
  if (filter.altersband) teile.push(`${filter.altersband} Jahre`);
  if (filter.ort) teile.push(filter.ort === 'drinnen' ? 'drinnen' : 'draußen');
  return teile.length ? teile.join(' · ') : 'Alle Bewegungsspiele';
}

function render() {
  const treffer = filtereSpiele(daten.spiele, filter);
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🧺 Bewegungs-Schatzkiste'),
    el('p', { class: 'k-untertitel bsk-nur-bildschirm' },
      'Kartei mit Bewegungsspiel-Ideen für die Kita (1-7 Jahre) - für Fachkräfte & Eltern'),

    // Kopf nur fuer den Ausdruck:
    el('p', { class: 'bsk-nur-druck', style: 'text-align:center;font-size:1.05rem;font-weight:700;margin:0' },
      `Bewegungs-Kartei: ${filterText()}`),
    el('p', { class: 'bsk-nur-druck', style: 'text-align:center;font-size:0.85rem;margin:0 0 0.4rem' },
      `${treffer.length} Spielidee${treffer.length === 1 ? '' : 'n'} · zum Ausschneiden und in die Materialkiste legen`),

    el('section', { class: 'k-karte bsk-nur-bildschirm' },
      el('p', { style: 'font-weight:600;margin-top:0' }, 'Bewegungsart'),
      kategorieLeiste(),
      el('p', { style: 'font-weight:600;margin-bottom:0.3rem' }, 'Alter'),
      knopfleiste(ALTERSBAENDER, 'altersband'),
      el('p', { style: 'font-weight:600;margin-bottom:0.3rem' }, 'Ort'),
      knopfleiste(ORTE, 'ort'),
      el('p', { style: 'font-size:0.85rem;color:#4b5563;margin:0.6rem 0 0' },
        `${treffer.length} von ${daten.spiele.length} Ideen · Stand ${daten.stand}`),
      el('div', { class: 'k-antworten' },
        el('button', {
          class: 'k-knopf',
          onclick: () => window.print(),
        }, '🖨️ Kartei drucken'),
        (filter.kategorie || filter.altersband || filter.ort)
          ? el('button', {
              class: 'k-knopf k-knopf--neutral k-knopf--klein',
              onclick: () => { filter.kategorie = null; filter.altersband = null; filter.ort = null; render(); },
            }, '↺ Filter zurücksetzen')
          : '')),

    ...(treffer.length
      ? treffer.map(spielKarte)
      : [el('section', { class: 'k-karte bsk-nur-bildschirm' },
          el('p', { style: 'margin:0' }, 'Für diese Kombination gibt es keine Idee. Setze einen Filter zurück.'))]),

    el('p', { class: 'bsk-nur-druck', style: 'text-align:center;font-size:0.72rem;color:#333;margin-top:0.4rem' },
      'Bewegungs-Schatzkiste - werbefrei, ohne Konto, ohne Datenspeicherung. Alle Spiele beobachten und begleiten, sie bewerten keine Kinder.'),

    el('footer', { class: 'k-fuss bsk-nur-bildschirm' },
      el('span', {}, 'Werkzeug für Erwachsene · werbefrei · alles bleibt lokal, es wird nichts gespeichert · '),
      el('a', { href: 'eltern.html' }, '👪 Hinweise für Fachkräfte & Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

render();
