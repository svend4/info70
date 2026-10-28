// Wachstums- und Bewegungsbegleiter (Praleska docs/10, Nr. 62, S. 126-127).
//
// Die vier Fragen der Quelle sind umgedreht: aus „Wie ist deine Haltung?" an
// das Kind wird „Wo kann sich mein Kind bewegen?" an die Erwachsenen (siehe
// logik.mjs). Keine Ampel, keine Tagesstatistik, keine Körperdaten – und
// jede Zahl steht bei ihrer Quelle. Das Gerät ist in der Hand des
// Erwachsenen, darum keine eltern.html. Politik docs/02: keine externen
// Anfragen; gespeichert wird nur der heutige Tag, mit Löschknopf.
import { el, vorlesen, lokaleStimme } from '../../packages/kinder-ui/js/komponenten.mjs';
import { datenKarte } from '../../packages/kinder-ui/js/daten-karte.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { BLOECKE, werteFuerAlter, pruefeDaten } from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const daten = await fetch('daten/begleiter.json').then((r) => r.json());
const SCHLUESSEL = 'wbb-heute';
// Die Seitenangaben der Quelle (quelle.werk in den Daten) sind nicht von einem Menschen geprüft (docs/02, Entscheidung
// Max 22а). Die Marke steht direkt unter dem Absatz, der sie zeigt (aufgeklappte Ausschlussliste, nur Bildschirm). Der
// Zettel für die Küche zeigt keine Seitenangabe und trägt darum keine Marke; kommt quelle.werk dorthin, gehört sie mit.
const MARKE_QUELLE = 'Seitenangaben der Quelle: nicht von einem Menschen geprüft.';

/** Der heutige Tag in LOKALER Zeit – `toISOString` rechnet nach UTC und
 *  schreibt kurz nach Mitternacht noch das gestrige Datum (Review Welle 80). */
function tagHeute() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Gespeichert wird genau EIN Tag: der heutige. Kein Verlauf, keine
 *  Statistik – ein Verlauf wäre der Anfang einer Kurve über ein Kind. */
function ladeHeute() {
  try {
    const roh = JSON.parse(localStorage.getItem(SCHLUESSEL) ?? 'null');
    if (!roh || roh.tag !== tagHeute() || !Array.isArray(roh.ids)) return [];
    const bekannt = new Set(daten.gelegenheiten.map((g) => g.id));
    return roh.ids.filter((id) => bekannt.has(id));
  } catch { return []; }
}

function speichereHeute(ids) {
  try {
    if (!ids.length) localStorage.removeItem(SCHLUESSEL);
    else localStorage.setItem(SCHLUESSEL, JSON.stringify({ tag: tagHeute(), ids }));
  } catch { /* privater Modus: dann eben nicht */ }
}

let alter = null;
let zeigeBlock = null;
let zeigeAusschluss = false;

function vorleseKnopf(text, beschriftung = '🔊 Vorlesen') {
  const stimme = lokaleStimme('de');
  if (stimme === null) {
    return el('p', { class: 'k-hinweis wbb-nur-bildschirm', style: 'margin:0.6rem 0' },
      '🗣️ Auf diesem Gerät gibt es keine deutsche Stimme, die offline arbeitet. Vorlesen ist hier deshalb aus.');
  }
  return el('button', {
    class: 'k-knopf k-knopf--neutral k-knopf--klein wbb-nur-bildschirm',
    onclick: () => vorlesen(text, 'de-DE', stimme),
  }, beschriftung);
}

const hinweisKarte = (titel, ...absaetze) => el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
  el('p', { style: 'font-weight:700;margin-top:0' }, titel),
  ...absaetze.map((t) => el('p', { style: 'margin:0 0 0.3rem' }, t)));

function blockKarte(b) {
  const offen = zeigeBlock === b.id;
  return el('div', { class: 'k-karte wbb-block', style: 'margin:0.5rem 0;padding:0.7rem' },
    el('button', {
      class: 'k-knopf k-knopf--neutral wbb-nur-bildschirm',
      style: 'width:100%;text-align:start;min-height:3.2rem',
      id: `wbb-b-${b.id}`,
      'aria-expanded': String(offen),
      'aria-controls': `wbb-inhalt-${b.id}`,
      onclick: () => { zeigeBlock = offen ? null : b.id; render(`wbb-b-${b.id}`); },
    }, `${b.zeichen} ${b.name}: „${b.quellFrage}" ${offen ? '▲' : '▼'}`),
    el('div', { id: `wbb-inhalt-${b.id}`, class: offen ? '' : 'wbb-zu' },
      el('p', { style: 'margin:0.4rem 0 0.2rem;color:#4b5563' }, `📖 Was die Quelle will: ${b.wasDieQuelleWill}`),
      el('p', { style: 'margin:0.2rem 0' }, `🚫 Nicht übernommen: ${b.nichtUebernommen}`),
      el('p', { class: 'k-hinweis', style: 'margin:0.4rem 0' }, `👉 ${b.wasStattdessen}`),
      el('p', { style: 'margin:0.2rem 0 0;font-size:0.95rem' }, `🩺 ${b.woEsHingehoert}`),
      // Belegte Sätze stehen getrennt, mit ihrer Leitlinie: eine Umdrehung
      // ohne Beleg wäre eine Meinung.
      ...(daten.fachliches ?? []).filter((f) => f.block === b.id).map((f) => el('div', { class: 'k-hinweis', style: 'margin:0.4rem 0' },
        el('p', { style: 'margin:0' }, f.aussage),
        el('p', { style: 'margin:0.3rem 0 0;font-size:0.85rem;color:#4b5563' }, `📚 ${f.quelle}`))),
      offen ? vorleseKnopf([b.wasDieQuelleWill, b.nichtUebernommen, b.wasStattdessen, b.woEsHingehoert].join(' ')) : null));
}

function render(fokusElement = null) {
  const heute = ladeHeute();
  const werte = alter === null ? [] : werteFuerAlter(daten, alter);

  app.replaceChildren(...[
    el('div', { class: 'wbb-nur-bildschirm' },
      el('h1', { class: 'k-titel' }, '📏 Wachsen und Bewegen'),
      el('p', { class: 'k-untertitel' }, 'Vier Fragen – umgedreht: nicht an das Kind, sondern an uns')),
    el('section', { class: 'k-karte wbb-nur-bildschirm' },
      el('div', { class: 'k-hinweis' }, el('p', { style: 'margin:0;font-weight:600' }, daten.hinweis)),
      el('p', { style: 'margin:0.6rem 0 0' }, daten.wasEsIst),
      hinweisKarte('🔄 Warum umgedreht:', daten.warumUmgedreht),
      vorleseKnopf(`${daten.hinweis} ${daten.wasEsIst} ${daten.warumUmgedreht}`, '🔊 Das Wichtigste vorlesen')),

    el('section', { class: 'k-karte wbb-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, 'Die vier Fragen'),
      ...daten.bloecke.map(blockKarte)),

    el('section', { class: 'k-karte wbb-werte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🧭 Orientierungswerte – für Altersgruppen, nicht für Ihr Kind'),
      el('div', { class: 'k-antworten wbb-nur-bildschirm', role: 'group', 'aria-label': 'Alter wählen' },
        ...[3, 4, 5, 6, 7].map((j) => el('button', {
          class: `k-knopf k-knopf--klein ${j === alter ? '' : 'k-knopf--neutral'}`,
          style: 'min-height:3rem',
          id: `wbb-a-${j}`,
          'aria-pressed': String(j === alter),
          onclick: () => { alter = j === alter ? null : j; render(`wbb-a-${j}`); },
        }, `${j} Jahre`))),
      alter === null
        ? el('p', { class: 'wbb-nur-bildschirm', style: 'margin:0.6rem 0 0' },
          'Wählen Sie ein Alter – dann steht hier, welche Empfehlung dafür gilt und von wem sie stammt.')
        : el('div', {},
          el('p', { style: 'margin:0.6rem 0 0.2rem;font-weight:600' }, `Für ${alter} Jahre gilt:`),
          ...werte.map((w) => el('div', { class: 'k-hinweis wbb-wert', style: 'margin:0.4rem 0' },
            el('p', { style: 'margin:0;font-weight:600' }, `${w.alter}: ${w.wert}`),
            el('p', { style: 'margin:0.3rem 0 0;font-size:0.9rem' }, `📚 ${w.quelle}`),
            el('p', { style: 'margin:0.2rem 0 0;font-size:0.9rem;color:#4b5563' }, `⚖️ ${w.einschraenkung}`))),
          werte.length > 1
            ? el('p', { style: 'margin:0.4rem 0 0;font-size:0.9rem' }, `🔀 ${daten.werteHinweise.ueberschneidung}`)
            : null),
      el('p', { style: 'margin:0.6rem 0 0;font-size:0.9rem;color:#4b5563' }, daten.werteHinweise.keinGrenzwert),
      el('p', { class: 'wbb-nur-bildschirm', style: 'margin:0.3rem 0 0;font-size:0.9rem;color:#4b5563' }, daten.werteHinweise.stand),
      el('p', { class: 'wbb-nur-bildschirm', style: 'margin:0.3rem 0 0;font-size:0.9rem;color:#4b5563' }, daten.werteHinweise.bioeg)),

    el('section', { class: 'k-karte wbb-gelegenheiten' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '✅ Was wir heute möglich gemacht haben'),
      el('p', { class: 'wbb-nur-bildschirm', style: 'margin:0 0 0.4rem;font-size:0.9rem;color:#4b5563' },
        'Angekreuzt wird, was SIE ermöglicht haben – nicht, was Ihr Kind geleistet hat. Gespeichert wird nur der heutige Tag; morgen steht die Liste wieder leer.'),
      ...daten.gelegenheiten.map((g) => {
        const an = heute.includes(g.id);
        return el('button', {
          class: `k-knopf k-knopf--klein ${an ? '' : 'k-knopf--neutral'} wbb-nur-bildschirm`,
          style: 'display:block;width:100%;text-align:start;min-height:3rem;margin:0.25rem 0',
          id: `wbb-g-${g.id}`,
          'aria-pressed': String(an),
          onclick: () => {
            const neu = an ? heute.filter((x) => x !== g.id) : [...heute, g.id];
            speichereHeute(neu);
            render(`wbb-g-${g.id}`);
          },
        }, `${an ? '✔️' : '▫️'} ${g.zeichen} ${g.text}`);
      }),
      // Auf Papier ohne Haken: ein Blatt mit Haken wäre eine Bewertung
      // (docs/02). Gedruckt wird die Liste als Erinnerung.
      el('ul', { class: 'wbb-nur-druck', style: 'margin:0;padding-left:1.1rem' },
        ...daten.gelegenheiten.map((g) => el('li', { style: 'margin-bottom:0.3rem' }, `${g.zeichen} ${g.text}`))),
      el('div', { class: 'k-antworten wbb-nur-bildschirm' },
        el('button', { class: 'k-knopf k-knopf--klein', onclick: () => window.print() }, '🖨️ Zettel für die Küche drucken'))),

    el('section', { class: 'k-karte wbb-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🧭 Was diese App nicht tut'),
      hinweisKarte('🚦 Keine Ampel:', daten.keineAmpel),
      hinweisKarte('👟 Kein Schrittzähler:', daten.keinSchrittzaehler),
      hinweisKarte('📐 Keine Körperdaten:', daten.keinKoerperdatum),
      hinweisKarte('🌱 Kein Wachstumstrick:', daten.keinWachstumstrick)),

    el('section', { class: 'k-karte wbb-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🚫 Was hier nicht drinsteht – und warum'),
      el('div', { class: 'k-antworten' },
        el('button', {
          class: 'k-knopf k-knopf--neutral k-knopf--klein', 'aria-expanded': String(zeigeAusschluss),
          id: 'wbb-aus',
          onclick: () => { zeigeAusschluss = !zeigeAusschluss; render('wbb-aus'); },
        }, zeigeAusschluss ? '▲ Liste zuklappen' : '▼ Die Ausschlussliste lesen')),
      zeigeAusschluss
        ? el('div', {},
          el('ul', { style: 'margin:0.5rem 0 0;padding-left:1.2rem' },
            ...daten.ausgeschlossen.map((a) => el('li', { style: 'margin-bottom:0.5rem' },
              el('strong', {}, a.was), el('br'), el('span', {}, a.warum)))),
          el('p', { style: 'margin:0.6rem 0 0;font-size:0.9rem' }, daten.quelle.werk),
          el('p', { style: 'margin:0.2rem 0 0;font-size:0.9rem' }, MARKE_QUELLE),
          el('p', { style: 'margin:0.2rem 0 0;font-size:0.9rem' }, daten.quelle.rechte),
          el('p', { style: 'margin:0.2rem 0 0;font-size:0.9rem' }, daten.quelle.nachgezaehlt),
          el('p', { style: 'margin:0.2rem 0 0;font-size:0.9rem' }, daten.quelle.abweichung))
        : null),

    el('div', { class: 'wbb-nur-bildschirm' },
      datenKarte({
        schluessel: SCHLUESSEL,
        was: 'die heutige Liste der Gelegenheiten (nur dieses Gerät, nur der heutige Tag, keine Angaben über Ihr Kind)',
        nachLoeschen: () => render(),
        knopfId: 'wbb-loeschen',
        klasse: 'wbb-nur-bildschirm',
      })),

    el('section', { class: 'k-karte wbb-nur-bildschirm' },
      el('p', { style: 'margin:0;font-size:0.9rem' },
        'Bewegungsspiele für drinnen: ', el('a', { href: '../bewegungs-schatzkiste/' }, 'Bewegungs-Schatzkiste'),
        ' · kurze Pausen: ', el('a', { href: '../bewegungspausen-generator/' }, 'Bewegungspausen'),
        ' · sicher wohnen mit kleinen Kindern: ', el('a', { href: '../sicherer-krabbelraum-check/' }, 'Krabbelraum-Check')),
      el('p', { style: 'margin:0.5rem 0 0;font-size:0.9rem' }, `☎️ ${daten.elterntelefon}`)),

    el('footer', { class: 'k-fuss wbb-nur-bildschirm' },
      el('span', {}, 'Werkzeug für Erwachsene · kein Bildschirm fürs Kind · keine Körperdaten · '),
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
