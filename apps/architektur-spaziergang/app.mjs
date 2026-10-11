// Architektur-Spaziergang (Praleska docs/10, Nr. 65, Quelle S. 274-276, 278).
//
// Werkzeug fuer Erwachsene: der Spaziergang findet draussen statt, nicht hier.
// Darum kein Kinderbildschirm und keine eltern.html. Die App kennt Ihren Ort
// nicht und behauptet es nicht (siehe logik.mjs). Politik docs/02: keine
// externen Anfragen; gespeichert wird nur Ihre Kartenauswahl, mit Loeschknopf.
import { el, vorlesen, lokaleStimme } from '../../packages/kinder-ui/js/komponenten.mjs';
import { datenKarte } from '../../packages/kinder-ui/js/daten-karte.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { ARTEN, DRUCK_ABSAETZE, kartenNachArt, pruefeDaten } from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const daten = await fetch('daten/spaziergang.json').then((r) => r.json());
const SCHLUESSEL = 'asp-auswahl';

const GRUPPEN = [
  { art: 'bauform', titel: '🧱 Am Bau zu sehen', satz: 'Das Merkmal steckt im Gebäude selbst.' },
  { art: 'ausstattung', titel: '🪧 Nur an der Ausstattung', satz: 'Das Haus sagt nichts – die Sachen drumherum schon.' },
  { art: 'nichtErkennbar', titel: '❓ Nicht zu sehen', satz: 'Das Aussehen verrät es nicht. Diese Karten sind die wichtigsten.' },
  { art: 'kleineForm', titel: '💡 Kleine Formen', satz: 'Laternen, Brunnen, Zäune – von der Quelle ausdrücklich genannt.' },
  { art: 'gruen', titel: '🌳 Grün und Platz', satz: 'Auch Parks und Grünanlagen sind geplant.' },
];

/** Was Sie sich vornehmen – nicht, was Ihr Kind geschafft hat. */
function ladeAuswahl() {
  try {
    const roh = JSON.parse(localStorage.getItem(SCHLUESSEL) ?? 'null');
    if (!Array.isArray(roh)) return [];
    const bekannt = new Set(daten.karten.map((k) => k.id));
    return roh.filter((id) => bekannt.has(id));
  } catch { return []; }
}

function speichereAuswahl(ids) {
  try {
    if (!ids.length) localStorage.removeItem(SCHLUESSEL);
    else localStorage.setItem(SCHLUESSEL, JSON.stringify(ids));
  } catch { /* privater Modus: dann eben nicht */ }
}

let offeneKarte = null;
let zeigeZiele = false;
let zeigeAusschluss = false;
let zeigeVorbild = false;

function vorleseKnopf(text, beschriftung = '🔊 Vorlesen') {
  const stimme = lokaleStimme('de');
  if (stimme === null) {
    return el('p', { class: 'k-hinweis asp-nur-bildschirm', style: 'margin:0.6rem 0' },
      '🗣️ Auf diesem Gerät gibt es keine deutsche Stimme, die offline arbeitet. Vorlesen ist hier deshalb aus.');
  }
  return el('button', {
    class: 'k-knopf k-knopf--neutral k-knopf--klein asp-nur-bildschirm',
    onclick: () => vorlesen(text, 'de-DE', stimme),
  }, beschriftung);
}

const hinweisKarte = (titel, ...absaetze) => el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
  el('p', { style: 'font-weight:700;margin-top:0' }, titel),
  ...absaetze.map((t) => el('p', { style: 'margin:0 0 0.3rem' }, t)));

function karteAnsicht(k, auswahl) {
  const gewaehlt = auswahl.includes(k.id);
  const offen = offeneKarte === k.id;
  return el('div', { class: 'k-karte asp-karte', style: 'margin:0.5rem 0;padding:0.7rem' },
    el('div', { class: 'k-antworten asp-nur-bildschirm', style: 'gap:0.3rem' },
      el('button', {
        class: `k-knopf k-knopf--klein ${gewaehlt ? '' : 'k-knopf--neutral'}`,
        style: 'min-height:3rem;flex:1 1 60%;text-align:start',
        id: `asp-w-${k.id}`,
        'aria-pressed': String(gewaehlt),
        onclick: () => {
          const neu = gewaehlt ? auswahl.filter((x) => x !== k.id) : [...auswahl, k.id];
          speichereAuswahl(neu);
          render(`asp-w-${k.id}`);
        },
      }, `${gewaehlt ? '✔️' : '▫️'} ${k.zeichen} ${k.name}`),
      el('button', {
        class: 'k-knopf k-knopf--neutral k-knopf--klein',
        style: 'min-height:3rem',
        id: `asp-o-${k.id}`,
        'aria-expanded': String(offen),
        'aria-controls': `asp-i-${k.id}`,
        onclick: () => { offeneKarte = offen ? null : k.id; render(`asp-o-${k.id}`); },
      }, offen ? '▲ zu' : '▼ mehr')),
    el('div', { id: `asp-i-${k.id}`, class: offen ? '' : 'asp-zu' },
      el('p', { style: 'margin:0.4rem 0 0.2rem' }, `👀 ${k.woranMan}`),
      k.nichtAmHaus ? el('p', { style: 'margin:0.2rem 0;color:#4b5563' }, `🚪 ${k.nichtAmHaus}`) : null,
      k.warumNicht ? el('p', { style: 'margin:0.2rem 0' }, `🚫 ${k.warumNicht}`) : null,
      k.woranDoch ? el('p', { style: 'margin:0.2rem 0;color:#4b5563' }, `🔍 ${k.woranDoch}`) : null,
      k.fuerErwachsene
        ? el('div', { class: 'k-hinweis asp-nur-bildschirm', style: 'margin:0.4rem 0' },
          el('p', { style: 'margin:0;font-size:0.95rem' }, `🧑‍🏫 Für Erwachsene: ${k.fuerErwachsene}`),
          el('p', { style: 'margin:0.3rem 0 0;font-size:0.85rem;color:#4b5563' },
            `${k.sicherheit === 'belegt' ? '📚' : k.sicherheit === 'vereinfachung' ? '📐' : '❔'} ${k.sicherheitText}`),
          k.quelle ? el('p', { style: 'margin:0.2rem 0 0;font-size:0.85rem;color:#4b5563' }, `📚 ${k.quelle}`) : null)
        : null,
      k.gegenbeispiel
        ? el('p', { class: 'asp-nur-bildschirm', style: 'margin:0.2rem 0;font-size:0.95rem' }, `↩️ Gegenbeispiel: ${k.gegenbeispiel}`)
        : null),
    el('p', { class: 'asp-frage', style: 'margin:0.4rem 0 0;font-weight:600' }, `💬 „${k.impuls}“`),
    offen
      ? vorleseKnopf([k.name, k.woranMan, k.nichtAmHaus, k.warumNicht, k.woranDoch, k.impuls].filter(Boolean).join(' '))
      : null);
}

function render(fokusElement = null) {
  const auswahl = ladeAuswahl();
  // Ein leeres Blatt waere kein Blatt: ohne Auswahl wird alles gedruckt
  // (Review Welle 81).
  const zuDrucken = auswahl.length ? daten.karten.filter((k) => auswahl.includes(k.id)) : daten.karten;

  app.replaceChildren(...[
    el('div', { class: 'asp-nur-bildschirm' },
      el('h1', { class: 'k-titel' }, '🏛️ Architektur-Spaziergang'),
      el('p', { class: 'k-untertitel' }, 'Suchaufträge für draußen – keine Liste berühmter Bauwerke')),

    el('section', { class: 'k-karte asp-nur-bildschirm' },
      el('div', { class: 'k-hinweis' }, el('p', { style: 'margin:0;font-weight:600' }, daten.hinweis)),
      el('p', { style: 'margin:0.6rem 0 0' }, daten.wasEsIst),
      el('div', { class: 'k-antworten' },
        el('button', {
          class: 'k-knopf k-knopf--neutral k-knopf--klein', id: 'asp-vorbild',
          'aria-expanded': String(zeigeVorbild),
          onclick: () => { zeigeVorbild = !zeigeVorbild; render('asp-vorbild'); },
        }, zeigeVorbild ? '▲ zuklappen' : '▼ Warum keine Liste berühmter Bauwerke?')),
      zeigeVorbild ? hinweisKarte('🗺️ Die vierzehn Baudenkmäler der Quelle:', daten.keineVorbildliste, daten.eigeneListe) : null,
      vorleseKnopf(`${daten.hinweis} ${daten.wasEsIst}`, '🔊 Das Wichtigste vorlesen')),

    el('section', { class: 'k-karte asp-sicherheit' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🚸 Unterwegs'),
      el('p', { style: 'margin:0' }, daten.sicherheitImmer)),

    el('section', { class: 'k-karte asp-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🧭 Nur manchmal verrät die Form den Zweck'),
      el('p', { style: 'margin:0' }, daten.nurManchmal),
      el('p', { style: 'margin:0.5rem 0 0;font-size:0.95rem;color:#4b5563' }, daten.dreiArten)),

    el('section', { class: 'k-karte asp-karten' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' },
        `🗂️ ${daten.karten.length} Karten${auswahl.length ? ` · ${auswahl.length} für den nächsten Spaziergang gewählt` : ''}`),
      el('p', { class: 'asp-nur-bildschirm', style: 'margin:0 0 0.5rem;font-size:0.9rem;color:#4b5563' },
        'Wählen Sie aus, worauf Sie diesmal schauen wollen – drei oder vier sind genug. Ohne Auswahl werden alle Karten gedruckt.'),
      ...GRUPPEN.map((g) => {
        const karten = kartenNachArt(daten, g.art);
        if (!karten.length) return null;
        return el('div', { style: 'margin:0.8rem 0 0' },
          el('h3', { style: 'margin:0;font-size:1rem' }, g.titel),
          el('p', { style: 'margin:0.1rem 0 0;font-size:0.9rem;color:#4b5563' }, g.satz),
          ...karten.map((k) => karteAnsicht(k, auswahl)));
      }),
      el('div', { class: 'k-antworten asp-nur-bildschirm' },
        el('button', { class: 'k-knopf k-knopf--klein', id: 'asp-druck', onclick: () => window.print() },
          `🖨️ Zettel für den Spaziergang drucken (${zuDrucken.length} Karten)`))),

    // Das Blatt: nur die gewaehlten Karten, ohne Haken, ohne Namenszeile.
    el('section', { class: 'asp-nur-druck asp-blatt' },
      el('h2', { style: 'margin:0 0 2mm' }, '🏛️ Unser Architektur-Spaziergang'),
      ...zuDrucken.map((k) => el('p', { style: 'margin:0 0 2mm' },
        el('strong', {}, `${k.zeichen} ${k.name}: `), el('span', {}, k.woranMan),
        el('br'), el('em', {}, `„${k.impuls}“`))),
      ...DRUCK_ABSAETZE.map((feld) => el('p', { style: 'margin:3mm 0 0;font-size:9.5pt' }, daten[feld]))),

    el('section', { class: 'k-karte asp-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🧭 Was diese App nicht tut'),
      hinweisKarte('💬 Die Fragen prüfen nichts:', daten.impulseSindOffen),
      hinweisKarte('📋 Keine Liste über Ihr Kind:', daten.keinUrteil),
      hinweisKarte('📍 Wohin mit Fragen:', daten.wohinMitFragen)),

    el('section', { class: 'k-karte asp-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, `📖 Die ${daten.ziele.length} Ziele der Quelle – was daraus wurde`),
      el('div', { class: 'k-antworten' },
        el('button', {
          class: 'k-knopf k-knopf--neutral k-knopf--klein', id: 'asp-ziele',
          'aria-expanded': String(zeigeZiele),
          onclick: () => { zeigeZiele = !zeigeZiele; render('asp-ziele'); },
        }, zeigeZiele ? '▲ zuklappen' : '▼ Alle Ziele mit Einordnung lesen')),
      zeigeZiele
        ? el('ol', { style: 'margin:0.5rem 0 0;padding-left:1.3rem' },
          ...daten.ziele.map((z) => el('li', { style: 'margin-bottom:0.6rem' },
            el('span', {}, z.kurz), el('br'),
            el('strong', {}, {
              gebaut: '✅ gebaut: ',
              nurEingeschraenkt: '⚠️ nur eingeschränkt: ',
              anderesThema: '➡️ anderes Thema: ',
              nichtUebernommen: '🚫 nicht übernommen: ',
            }[z.einordnung]),
            el('span', {}, z.warum))))
        : null),

    el('section', { class: 'k-karte asp-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🚫 Was hier nicht drinsteht – und warum'),
      el('div', { class: 'k-antworten' },
        el('button', {
          class: 'k-knopf k-knopf--neutral k-knopf--klein', id: 'asp-aus',
          'aria-expanded': String(zeigeAusschluss),
          onclick: () => { zeigeAusschluss = !zeigeAusschluss; render('asp-aus'); },
        }, zeigeAusschluss ? '▲ Liste zuklappen' : '▼ Die Ausschlussliste lesen')),
      zeigeAusschluss
        ? el('div', {},
          el('ul', { style: 'margin:0.5rem 0 0;padding-left:1.2rem' },
            ...daten.ausgeschlossen.map((a) => el('li', { style: 'margin-bottom:0.5rem' },
              el('strong', {}, a.was), el('br'), el('span', {}, a.warum)))),
          el('p', { style: 'margin:0.6rem 0 0;font-size:0.9rem' }, daten.quelle.werk),
          el('p', { style: 'margin:0.2rem 0 0;font-size:0.9rem' }, daten.quelle.rechte),
          el('p', { style: 'margin:0.2rem 0 0;font-size:0.9rem' }, daten.quelle.nachgezaehlt),
          el('p', { style: 'margin:0.2rem 0 0;font-size:0.9rem' }, daten.quelle.abweichung))
        : null),

    el('div', { class: 'asp-nur-bildschirm' },
      datenKarte({
        schluessel: SCHLUESSEL,
        was: 'Ihre Kartenauswahl für den nächsten Spaziergang (nur dieses Gerät, keine Angaben über Ihr Kind)',
        nachLoeschen: () => render(),
        knopfId: 'asp-loeschen',
        klasse: 'asp-nur-bildschirm',
      })),

    el('section', { class: 'k-karte asp-nur-bildschirm' },
      el('p', { style: 'margin:0;font-size:0.9rem' },
        'Dinge anschauen und ausprobieren: ', el('a', { href: '../design-entdecker/' }, 'Design-Entdecker'),
        ' · Bilder betrachten: ', el('a', { href: '../kunst-gucken/' }, 'Kunst gucken'),
        ' · den eigenen Raum zeichnen: ', el('a', { href: '../kita-kartograph/' }, 'Kita-Kartograph')),
      el('p', { style: 'margin:0.5rem 0 0;font-size:0.9rem' }, `☎️ ${daten.elterntelefon}`)),

    el('footer', { class: 'k-fuss asp-nur-bildschirm' },
      el('span', {}, 'Werkzeug für Erwachsene · kein Bildschirm fürs Kind · keine Karte, kein Standort · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')),
  ].filter(Boolean));

  if (fokusElement) document.getElementById(fokusElement)?.focus();
}

const fehler = pruefeDaten(daten);
if (fehler.length) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' },
    el('p', { style: 'margin:0' }, `Datenfehler: ${fehler[0]}`)));
} else {
  render();
  if ('speechSynthesis' in globalThis) {
    speechSynthesis.addEventListener?.('voiceschanged', () => render(), { once: true });
  }
}
