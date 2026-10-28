// Kunst-Gucken (Praleska docs/10, Nr. 60, Quelle S. 88-89).
//
// Ein Leitfaden für das gemeinsame Hinschauen – auf eine Bilderbuchseite, eine
// Holzfigur, einen Becher aus Ton, ein Stück Stoff. Fünf Achsen in der
// Reihenfolge der Quelle, zu jeder drei Sätze, die ein Gespräch anfangen statt
// es abzufragen. Hier wird NICHTS abgefragt und NICHTS über das Kind
// geschlossen (siehe logik.mjs). Das Gerät ist in der Hand des Erwachsenen,
// darum gibt es keine eltern.html. Die App speichert NICHTS: kein Haken an
// einer Achse, keine Liste – wer das Blatt behalten will, druckt es.
// Politik docs/02: keine externen Anfragen.
import { el, vorlesen, lokaleStimme } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { ACHSEN, achseVon, gegenstandVon, blatt, pruefeDaten } from './logik.mjs';

installiereNetzwerkWaechter();

// Die Seitenangaben der Quelle sind nicht von einem Menschen geprüft (docs/02, Entscheidung Max 22а). Die Marke steht
// auf dem Bildschirm an den zwei Stellen, die Seitenangaben zeigen: unter der Karte „Kein eigenes Malen und Kneten“
// (S. 89–93) und unter der Quellenzeile der Herkunft (S. 88–89). Das Druckblatt trägt keine Seitenangabe und darum
// auch keine Marke.
const MARKE_QUELLE = 'Seitenangaben der Quelle: nicht von einem Menschen geprüft.';

const app = document.getElementById('app');
const daten = await fetch('daten/achsen.json').then((r) => r.json());

// Der einzige Zustand: was gerade auf dem Tisch liegt und welche Achse offen
// ist. Im Arbeitsspeicher, nicht auf der Platte.
let gegenstand = null;
let offeneAchse = null;
let zeigeHerkunft = false;

function vorleseKnopf(text, beschriftung = '🔊 Vorlesen') {
  const stimme = lokaleStimme('de');
  if (stimme === null) {
    return el('p', { class: 'k-hinweis kg-nur-bildschirm', style: 'margin:0.6rem 0' },
      '🗣️ Auf diesem Gerät gibt es keine deutsche Stimme, die offline arbeitet. Vorlesen ist hier deshalb aus.');
  }
  return el('button', {
    class: 'k-knopf k-knopf--neutral k-knopf--klein kg-nur-bildschirm',
    onclick: () => vorlesen(text, 'de-DE', stimme),
  }, beschriftung);
}

const hinweisKarte = (titel, ...absaetze) => el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
  el('p', { style: 'font-weight:700;margin-top:0' }, titel),
  ...absaetze.map((t) => el('p', { style: 'margin:0 0 0.3rem' }, t)));

function waehlerKnopf(id, beschriftung, aktiv, onclick) {
  return el('button', {
    class: `k-knopf k-knopf--klein ${aktiv ? '' : 'k-knopf--neutral'}`,
    style: 'text-align:start;min-height:3rem',
    id,
    'aria-pressed': String(aktiv),
    onclick,
  }, beschriftung);
}

/** Eine Achse als aufklappbare Karte. Auf Papier steht sie immer offen. */
function achsenKarte(a, stark) {
  const offen = offeneAchse === a.id;
  return el('div', { class: 'k-karte kg-achse', style: 'margin:0.5rem 0;padding:0.7rem' },
    el('button', {
      class: 'k-knopf k-knopf--neutral kg-nur-bildschirm',
      style: 'width:100%;text-align:start;min-height:3rem',
      id: `kg-a-${a.id}`,
      'aria-expanded': String(offen),
      'aria-controls': `kg-inhalt-${a.id}`,
      onclick: () => { offeneAchse = offen ? null : a.id; render(`kg-a-${a.id}`); },
    }, `${a.zeichen} ${a.name}${stark ? ' · passt hier gut' : ''} ${offen ? '▲' : '▼'}`),
    el('h3', { class: 'kg-nur-druck', style: 'margin:0 0 0.3rem;font-size:1rem' },
      `${a.zeichen} ${a.name}${stark ? ' · passt hier gut' : ''}`),
    // Der Inhalt steht immer im Dokument, auf dem Bildschirm aber nur, wenn
    // die Achse offen ist: `kg-nur-druck` blendet ihn aus und im Druck wieder
    // ein. Auf Papier gibt es kein Aufklappen, also stehen dort alle fünf da.
    el('div', { class: offen ? '' : 'kg-nur-druck', id: `kg-inhalt-${a.id}` },
      el('p', { style: 'margin:0.4rem 0 0.3rem;color:#4b5563' }, `👀 ${a.worauf}`),
      el('ul', { class: 'kg-impulse', style: 'margin:0.3rem 0;padding-left:1.1rem' },
        ...(a.impulse ?? []).map((i) => el('li', { style: 'margin-bottom:0.3rem' }, i))),
      el('p', { style: 'margin:0.3rem 0 0;font-size:0.95rem' }, `🛑 ${a.grenze}`),
      offen ? vorleseKnopf([a.worauf, ...(a.impulse ?? [])].join(' '), '🔊 Diese Achse vorlesen') : null));
}

function render(fokusElement = null) {
  const g = gegenstand ? gegenstandVon(daten, gegenstand) : null;
  const b = g ? blatt(daten, g.id) : null;

  app.replaceChildren(...[
    el('div', { class: 'kg-nur-bildschirm' },
      el('h1', { class: 'k-titel' }, '🖼️ Kunst-Gucken'),
      el('p', { class: 'k-untertitel' }, 'Zusammen hinschauen – fünf Achsen, keine Fragestunde')),
    el('section', { class: 'k-karte kg-nur-bildschirm' },
      el('div', { class: 'k-hinweis' }, el('p', { style: 'margin:0;font-weight:600' }, daten.hinweis)),
      el('p', { style: 'margin:0.6rem 0 0' }, daten.wasEsIst),
      hinweisKarte('🙅 Hier wird nichts abgefragt:', daten.keinAbfragen),
      vorleseKnopf(`${daten.hinweis} ${daten.wasEsIst} ${daten.keinAbfragen}`, '🔊 Das Wichtigste vorlesen')),
    el('section', { class: 'k-karte kg-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '1 · Was liegt auf dem Tisch?'),
      el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Gegenstand wählen' },
        ...daten.gegenstaende.map((x) => waehlerKnopf(`kg-g-${x.id}`, `${x.zeichen} ${x.name}`, x.id === gegenstand,
          () => { gegenstand = x.id === gegenstand ? null : x.id; offeneAchse = null; render(`kg-g-${x.id}`); }))),
      el('p', { style: 'margin:0.6rem 0 0;font-size:0.9rem;color:#4b5563' },
        'Nichts davon muss gekauft werden – zu jedem steht, wo er ohne Geld zu finden ist.')),
    // Ohne gewaehlten Gegenstand traegt kein Element eine Druckklasse - das
    // Blatt waere leer. Ein Satz dazu ist besser als eine weisse Seite.
    g ? null : el('p', { class: 'kg-nur-druck' }, 'Wählen Sie zuerst aus, was auf dem Tisch liegt – dann steht hier das Blatt dazu.'),
    g
      ? el('section', { class: 'k-karte kg-blatt' },
        el('h2', { style: 'margin-top:0;font-size:1.15rem' }, b.titel),
        el('p', { style: 'margin:0 0 0.3rem' }, `📍 ${g.woGefunden}`),
        el('p', { style: 'margin:0 0 0.3rem' }, `✨ ${g.besonderes}`),
        el('p', { style: 'margin:0 0 0.3rem' }, `🧭 ${g.starkeAchsenWarum}`),
        el('p', { class: 'k-hinweis', style: 'margin:0.4rem 0' }, `⚠️ ${g.grenze}`),
        el('h3', { style: 'margin:0.8rem 0 0.2rem;font-size:1.05rem' }, '2 · Woran man etwas sagen kann'),
        el('p', { class: 'kg-nur-bildschirm', style: 'margin:0 0 0.4rem;font-size:0.9rem;color:#4b5563' }, daten.reihenfolge),
        ...b.achsen.map((a) => achsenKarte(a, a.stark)),
        el('h3', { style: 'margin:0.8rem 0 0.2rem;font-size:1.05rem' }, '3 · Drei Regeln, die bleiben'),
        el('ul', { style: 'margin:0;padding-left:1.1rem' },
          ...b.regeln.map((r) => el('li', { style: 'margin-bottom:0.4rem' },
            el('strong', {}, r.was), el('br'), el('span', { style: 'font-size:0.95rem' }, r.warum)))),
        el('p', { class: 'k-hinweis', style: 'margin:0.6rem 0 0' }, `🧷 ${daten.sicherheit}`),
        el('div', { class: 'k-antworten kg-nur-bildschirm' },
          el('button', { class: 'k-knopf k-knopf--klein', onclick: () => window.print() }, '🖨️ Blatt drucken'),
          el('button', {
            class: 'k-knopf k-knopf--neutral k-knopf--klein',
            id: 'kg-alle-achsen',
            onclick: () => { offeneAchse = null; render('kg-alle-achsen'); },
          }, '▲ Achsen zuklappen')))
      : el('section', { class: 'k-karte kg-nur-bildschirm' },
        el('p', { style: 'margin:0' }, 'Wählen Sie oben, was auf dem Tisch liegt – dann stehen die fünf Achsen dazu hier, mit Sätzen zum Anfangen.')),
    el('section', { class: 'k-karte kg-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🧭 Was diese App nicht tut'),
      hinweisKarte('🔎 Keine Deutung des Kindes:', daten.keinDeuten),
      hinweisKarte('📚 Keine Buchliste:', daten.keineBuchliste),
      hinweisKarte('🛒 Keine Einkaufsliste:', daten.keinKauf),
      hinweisKarte('🏛️ Kein Museumsbesuch nötig:', daten.keinMuseum),
      hinweisKarte('🧪 Kein Wirkversprechen:', daten.keinWirkversprechen),
      hinweisKarte('🖌️ Kein eigenes Malen und Kneten:', daten.anderesThema),
      el('p', { style: 'margin:0.4rem 0 0;font-size:0.9rem;color:#4b5563' }, MARKE_QUELLE)),
    el('section', { class: 'k-karte kg-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '📖 Woher das kommt – und was nicht übernommen ist'),
      el('div', { class: 'k-antworten' },
        el('button', {
          class: 'k-knopf k-knopf--neutral k-knopf--klein', 'aria-expanded': String(zeigeHerkunft),
          id: 'kg-herkunft',
          onclick: () => { zeigeHerkunft = !zeigeHerkunft; render('kg-herkunft'); },
        }, zeigeHerkunft ? '▲ Zuklappen' : '▼ Die Herkunft und die Ausschlussliste lesen')),
      zeigeHerkunft
        ? el('div', {},
          el('p', { style: 'margin:0.6rem 0 0;font-size:0.9rem' }, daten.quelle.werk),
          el('p', { style: 'margin:0.3rem 0 0;font-size:0.9rem' }, MARKE_QUELLE),
          el('p', { style: 'margin:0.3rem 0 0;font-size:0.9rem' }, daten.quelle.rechte),
          el('p', { style: 'margin:0.3rem 0 0;font-size:0.9rem' }, daten.quelle.nachgezaehlt),
          el('p', { style: 'margin:0.3rem 0 0;font-size:0.9rem' }, daten.fuenfteilung),
          el('p', { style: 'margin:0.3rem 0 0;font-size:0.9rem' }, daten.quelle.abweichung),
          el('h3', { style: 'margin:0.8rem 0 0.2rem;font-size:1rem' }, 'Die 13 Ziele der Quelle, einzeln'),
          el('ul', { style: 'margin:0;padding-left:1.1rem;font-size:0.9rem' },
            ...daten.ziele.map((z) => el('li', { style: 'margin-bottom:0.35rem' },
              el('strong', {}, `${z.gruppe === 'allgemein' ? 'Allgemein' : 'Wahrnehmung'} ${z.nr}: `),
              el('span', {}, z.kurz),
              el('br'),
              el('span', { style: 'color:#4b5563' },
                z.einordnung === 'gebaut' ? `→ gebaut (${(z.belegtDurch ?? []).join(', ')})`
                  : z.einordnung === 'ausgeschlossen' ? `→ nicht übernommen (${(z.belegtDurch ?? []).join(', ')})`
                    : z.einordnung === 'alsGanzes' ? `→ als Ganzes eingelöst: ${z.warum}`
                      : '→ anderes Thema: das eigene Malen und Kneten')))),
          el('h3', { style: 'margin:0.8rem 0 0.2rem;font-size:1rem' }, 'Was hier nicht drinsteht – und warum'),
          el('ul', { style: 'margin:0;padding-left:1.1rem;font-size:0.9rem' },
            ...daten.ausgeschlossen.map((x) => el('li', { style: 'margin-bottom:0.5rem' },
              el('strong', {}, x.was), el('br'), el('span', {}, x.warum)))))
        : null),
    el('section', { class: 'k-karte kg-nur-bildschirm' },
      el('p', { style: 'margin:0;font-size:0.9rem' },
        'Welche Buchart passt: ', el('a', { href: '../vorlese-kompass/' }, 'Vorlese-Kompass'),
        ' · einen Gegenstand auf Sicherheit prüfen: ', el('a', { href: '../spielzeug-check-u3/' }, 'Spielzeug-Check U3'),
        ' · Texte zum Vorlesen: ', el('a', { href: '../klanggeschichten-erzeuger/' }, 'Klanggeschichten'),
        ' · Bilder abfragen, ab 5 gemeinsam: ', el('a', { href: '../kunst-entdecker/' }, 'Kunst-Entdecker')),
      el('p', { style: 'margin:0.5rem 0 0;font-size:0.9rem' }, `☎️ ${daten.elterntelefon}`)),
    el('footer', { class: 'k-fuss kg-nur-bildschirm' },
      el('span', {}, 'Werkzeug für Erwachsene · kein Bildschirm fürs Kind · speichert nichts · '),
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
  // `lokaleStimme` liefert `undefined`, solange die Stimmliste nicht geladen
  // ist - beim ersten Zeichnen der Normalfall (Review Welle 80).
  if ('speechSynthesis' in globalThis) {
    speechSynthesis.addEventListener?.('voiceschanged', () => render(), { once: true });
  }
}
