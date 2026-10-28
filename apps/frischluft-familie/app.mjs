// Frischluft-Familie (Praleska docs/10, Nr. 63, Quelle S. 125).
//
// Die acht „obligatorischen Maßnahmen" der Quelle, der Reihe nach gelesen und
// eingeordnet – mit deutscher Quelle zu jeder (siehe logik.mjs). Es wird
// nichts angekreuzt und nichts ausgewertet: eine Checkliste mit Ergebnis wäre
// eine Bewertung von Familien, und bei Maßnahmen ohne Belege doppelt sinnlos.
// Die App speichert nichts. Politik docs/02: keine externen Anfragen.
import { el, vorlesen, lokaleStimme } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { pruefeDaten } from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const daten = await fetch('daten/massnahmen.json').then((r) => r.json());

let offeneMassnahme = null;
let zeigeAusschluss = false;

const FARBE = {
  belegtAnders: '#047857',
  nurEingeschraenkt: '#b45309',
  nichtUebernommen: '#6b7280',
};
const SYMBOL = {
  belegtAnders: '🟢',
  nurEingeschraenkt: '🟡',
  nichtUebernommen: '⚪',
};

function vorleseKnopf(text, beschriftung = '🔊 Vorlesen') {
  const stimme = lokaleStimme('de');
  if (stimme === null) {
    return el('p', { class: 'k-hinweis ffa-nur-bildschirm', style: 'margin:0.6rem 0' },
      '🗣️ Auf diesem Gerät gibt es keine deutsche Stimme, die offline arbeitet. Vorlesen ist hier deshalb aus.');
  }
  return el('button', {
    class: 'k-knopf k-knopf--neutral k-knopf--klein ffa-nur-bildschirm',
    onclick: () => vorlesen(text, 'de-DE', stimme),
  }, beschriftung);
}

const hinweisKarte = (titel, ...absaetze) => el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
  el('p', { style: 'font-weight:700;margin-top:0' }, titel),
  ...absaetze.map((t) => el('p', { style: 'margin:0 0 0.3rem' }, t)));

/** Eine Maßnahme. Das Symbol steht für die Einordnung, nicht für eine
 *  Bewertung der Familie – und es gibt keine Summe darüber. */
function massnahmenKarte(m) {
  const offen = offeneMassnahme === m.id;
  return el('div', { class: 'k-karte ffa-massnahme', style: 'margin:0.5rem 0;padding:0.7rem' },
    el('button', {
      class: 'k-knopf k-knopf--neutral ffa-nur-bildschirm',
      style: 'width:100%;text-align:start;min-height:3.4rem',
      id: `ffa-m-${m.id}`,
      'aria-expanded': String(offen),
      'aria-controls': `ffa-inhalt-${m.id}`,
      onclick: () => { offeneMassnahme = offen ? null : m.id; render(`ffa-m-${m.id}`); },
    }, `${SYMBOL[m.einordnung]} ${m.nr}. ${m.zeichen} ${m.quellText} ${offen ? '▲' : '▼'}`),
    // Auf dem Blatt steht der Punkt mit seinem Urteil – das ist das, was man
    // der Kita oder den Großeltern in die Hand drückt.
    el('div', { class: 'ffa-nur-druck' },
      el('p', { style: 'margin:0 0 0.2rem' },
        el('strong', {}, `${m.nr}. ${m.quellText}`), el('br'),
        el('span', {}, `${SYMBOL[m.einordnung]} ${daten.einordnungen[m.einordnung]} – ${m.warum}`))),
    el('div', { id: `ffa-inhalt-${m.id}`, class: offen ? '' : 'ffa-zu' },
      el('p', { style: `margin:0.4rem 0 0.2rem;font-weight:600;color:${FARBE[m.einordnung]}` },
        `${SYMBOL[m.einordnung]} ${daten.einordnungen[m.einordnung]}`),
      el('p', { style: 'margin:0.2rem 0' }, m.warum),
      m.wasStattdessen ? el('p', { class: 'k-hinweis', style: 'margin:0.4rem 0' }, `👉 ${m.wasStattdessen}`) : null,
      el('p', { style: 'margin:0.2rem 0 0;font-size:0.85rem;color:#4b5563' }, `📚 ${m.quelle}`),
      offen ? vorleseKnopf([m.quellText, daten.einordnungen[m.einordnung], m.warum, m.wasStattdessen ?? ''].join(' ')) : null));
}

function render(fokusElement = null) {
  app.replaceChildren(...[
    el('div', { class: 'ffa-nur-bildschirm' },
      el('h1', { class: 'k-titel' }, '🌬️ Frischluft-Familie'),
      el('p', { class: 'k-untertitel' }, 'Acht Abhärtungsregeln – nachgelesen, was davon trägt')),

    el('section', { class: 'k-karte ffa-bilanz' },
      el('div', { class: 'k-hinweis ffa-nur-bildschirm' }, el('p', { style: 'margin:0;font-weight:600' }, daten.hinweis)),
      el('p', { class: 'ffa-nur-bildschirm', style: 'margin:0.6rem 0 0' }, daten.wasEsIst),
      el('h2', { style: 'margin:0.8rem 0 0.2rem;font-size:1.1rem' }, '⚖️ Die ehrliche Bilanz'),
      el('p', { style: 'margin:0 0 0.3rem' }, daten.dieEhrlicheBilanz),
      el('p', { style: 'margin:0 0 0.3rem' }, daten.keinVersaeumnis),
      el('p', { class: 'ffa-nur-bildschirm', style: 'margin:0.3rem 0 0;font-size:0.95rem;color:#4b5563' }, daten.warumTrotzdem),
      vorleseKnopf(`${daten.dieEhrlicheBilanz} ${daten.keinVersaeumnis}`, '🔊 Die Bilanz vorlesen')),

    el('section', { class: 'k-karte ffa-punkte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, 'Die acht Punkte der Quelle'),
      el('p', { class: 'ffa-nur-bildschirm', style: 'margin:0 0 0.4rem;font-size:0.9rem;color:#4b5563' },
        `${SYMBOL.belegtAnders} ${daten.einordnungen.belegtAnders} · ${SYMBOL.nurEingeschraenkt} ${daten.einordnungen.nurEingeschraenkt} · ${SYMBOL.nichtUebernommen} ${daten.einordnungen.nichtUebernommen}`),
      ...daten.massnahmen.map(massnahmenKarte)),

    el('section', { class: 'k-karte ffa-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🤔 Was oft dazugezählt wird – und in der Quelle gar nicht steht'),
      ...daten.oftDazugezaehlt.map((d) => el('div', { class: 'k-hinweis', style: 'margin:0.4rem 0' },
        el('p', { style: 'margin:0;font-weight:700' }, `${d.zeichen} ${d.was}: ${d.urteil}`),
        el('p', { style: 'margin:0.3rem 0 0' }, d.warum),
        el('p', { style: 'margin:0.2rem 0 0;font-size:0.85rem;color:#4b5563' }, `📚 ${d.quelle}`)))),

    el('section', { class: 'k-karte ffa-hilft' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '✅ Was in Deutschland belegt gegen Infekte hilft'),
      ...daten.wasWirklichHilft.map((h) => el('div', { style: 'margin:0.5rem 0' },
        el('p', { style: 'margin:0;font-weight:700' }, `${h.zeichen} ${h.was}`),
        el('p', { style: 'margin:0.2rem 0 0' }, h.warum),
        el('p', { style: 'margin:0.2rem 0 0;font-size:0.9rem;color:#4b5563' }, `⚖️ ${h.einschraenkung}`),
        el('p', { class: 'ffa-nur-bildschirm', style: 'margin:0.2rem 0 0;font-size:0.85rem;color:#4b5563' }, `📚 ${h.quelle}`))),
      el('div', { class: 'k-antworten ffa-nur-bildschirm' },
        el('button', { class: 'k-knopf k-knopf--klein', onclick: () => window.print() }, '🖨️ Die Bilanz drucken'))),

    el('section', { class: 'k-karte ffa-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🧭 Was diese App nicht tut'),
      hinweisKarte('📋 Keine Bewertung:', daten.keineBewertung)),

    el('section', { class: 'k-karte ffa-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🚫 Was hier nicht drinsteht – und warum'),
      el('div', { class: 'k-antworten' },
        el('button', {
          class: 'k-knopf k-knopf--neutral k-knopf--klein', 'aria-expanded': String(zeigeAusschluss),
          id: 'ffa-aus',
          onclick: () => { zeigeAusschluss = !zeigeAusschluss; render('ffa-aus'); },
        }, zeigeAusschluss ? '▲ Liste zuklappen' : '▼ Die Ausschlussliste lesen')),
      zeigeAusschluss
        ? el('div', {},
          el('ul', { style: 'margin:0.5rem 0 0;padding-left:1.2rem' },
            ...daten.ausgeschlossen.map((a) => el('li', { style: 'margin-bottom:0.5rem' },
              el('strong', {}, a.was), el('br'), el('span', {}, a.warum)))),
          el('p', { style: 'margin:0.6rem 0 0;font-size:0.9rem' }, daten.quelle.werk),
          // Ehrliche Marke an der Seitenangabe der Quellenzeile (docs/02, Entscheidung Max 22а): kein Mensch hat die Seite geprüft.
          el('p', { style: 'margin:0.2rem 0 0;font-size:0.9rem' }, 'Seitenangaben der Quelle: nicht von einem Menschen geprüft.'),
          el('p', { style: 'margin:0.2rem 0 0;font-size:0.9rem' }, daten.quelle.rechte),
          el('p', { style: 'margin:0.2rem 0 0;font-size:0.9rem' }, daten.quelle.nachgezaehlt),
          el('p', { style: 'margin:0.2rem 0 0;font-size:0.9rem' }, daten.quelle.abweichung))
        : null),

    el('section', { class: 'k-karte ffa-nur-bildschirm' },
      el('p', { style: 'margin:0;font-size:0.9rem' },
        'Bewegung und Orientierungswerte: ', el('a', { href: '../wachstums-bewegungs-begleiter/' }, 'Wachsen und Bewegen'),
        ' · draußen mit kleinen Kindern: ', el('a', { href: '../mini-gaertner-begleiter/' }, 'Mini-Gärtner'),
        ' · Bewegungsspiele: ', el('a', { href: '../bewegungs-schatzkiste/' }, 'Bewegungs-Schatzkiste')),
      el('p', { style: 'margin:0.5rem 0 0;font-size:0.9rem' }, `☎️ ${daten.elterntelefon}`)),

    el('footer', { class: 'k-fuss ffa-nur-bildschirm' },
      el('span', {}, 'Werkzeug für Erwachsene · speichert nichts · keine Bewertung · '),
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
