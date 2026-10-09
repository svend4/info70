// Erste Künstler 1-3 (Praleska docs/10, Nr. 61, Quelle S. 101-102).
//
// Eine Ideenkartei, keine Checkliste (siehe logik.mjs): geordnet nach dem, was
// Sie gerade sehen, nicht nach Alter. Die 19 Merkmale der Quelle stehen
// vollständig im Anhang – zum Nachschlagen, nicht zum Abhaken. Die App
// speichert NICHTS und erzeugt keinen Bericht: berichtet würde hier über ein
// Kind. Gedruckt wird eine Ideenkarte. Das Gerät ist in der Hand des
// Erwachsenen, darum keine eltern.html. Politik docs/02: keine externen
// Anfragen.
import { el, vorlesen, lokaleStimme } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { BEREICHE, ideeVon, materialVon, ideenFuer, karte, pruefeDaten } from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const daten = await fetch('daten/ideen.json').then((r) => r.json());

// Der einzige Zustand: welche Karte offen ist und ob der Anhang aufgeklappt
// ist. Im Arbeitsspeicher, nicht auf der Platte.
let offeneIdee = null;
let zeigeMerkmale = false;
let zeigeAusschluss = false;

const BEREICH_NAME = {
  sprache: 'Künstlerisch-sprachliche Tätigkeit',
  musik: 'Musikalische Tätigkeit',
  kunst: 'Kunstwahrnehmung und bildnerisches Tun',
};
const EINORDNUNG_NAME = {
  ideeDa: '→ dazu gibt es hier eine Karte',
  anderesWerkzeug: '→ dazu gibt es ein anderes Werkzeug',
  nichtUebernommen: '→ nicht übernommen',
  beschreibend: '→ beschreibt das Kind, nicht das Tun des Erwachsenen',
};

function vorleseKnopf(text, beschriftung = '🔊 Vorlesen') {
  const stimme = lokaleStimme('de');
  if (stimme === null) {
    return el('p', { class: 'k-hinweis ek-nur-bildschirm', style: 'margin:0.6rem 0' },
      '🗣️ Auf diesem Gerät gibt es keine deutsche Stimme, die offline arbeitet. Vorlesen ist hier deshalb aus.');
  }
  return el('button', {
    class: 'k-knopf k-knopf--neutral k-knopf--klein ek-nur-bildschirm',
    onclick: () => vorlesen(text, 'de-DE', stimme),
  }, beschriftung);
}

const hinweisKarte = (titel, ...absaetze) => el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
  el('p', { style: 'font-weight:700;margin-top:0' }, titel),
  ...absaetze.map((t) => el('p', { style: 'margin:0 0 0.3rem' }, t)));

/** Eine Ideenkarte. Offen steht sie auf dem Bildschirm, im Druck immer. */
function ideenKarte(i) {
  const offen = offeneIdee === i.id;
  const k = karte(daten, i.id);
  return el('div', { class: `k-karte ek-idee ${offen ? 'ek-offen' : ''}`, style: 'margin:0.5rem 0;padding:0.7rem' },
    el('button', {
      class: 'k-knopf k-knopf--neutral ek-nur-bildschirm',
      style: 'width:100%;text-align:start;min-height:3.4rem',
      id: `ek-i-${i.id}`,
      'aria-expanded': String(offen),
      'aria-controls': `ek-inhalt-${i.id}`,
      onclick: () => { offeneIdee = offen ? null : i.id; render(`ek-i-${i.id}`); },
    }, `${i.zeichen} ${i.name} ${offen ? '▲' : '▼'}`),
    el('p', { class: 'ek-nur-bildschirm', style: 'margin:0.3rem 0 0;font-size:0.9rem;color:#4b5563' }, `👀 ${i.wennSie}`),
    el('h3', { class: 'ek-nur-druck', style: 'margin:0 0 0.3rem;font-size:1.1rem' }, `${i.zeichen} ${i.name}`),
    // Der Inhalt steht immer im Dokument; auf dem Bildschirm nur, wenn offen.
    el('div', { class: offen ? '' : 'ek-nur-druck', id: `ek-inhalt-${i.id}` },
      el('p', { class: 'ek-nur-druck', style: 'margin:0 0 0.3rem' }, `👀 ${i.wennSie}`),
      el('ol', { class: 'ek-schritte', style: 'margin:0.4rem 0;padding-left:1.2rem' },
        ...(i.wasSieTun ?? []).map((s) => el('li', { style: 'margin-bottom:0.35rem' }, s))),
      el('p', { style: 'margin:0.3rem 0 0' }, `✅ Es passt gerade, wenn: ${i.woranSieSehen}`),
      el('p', { style: 'margin:0.3rem 0 0' }, `🛑 Schluss ist: ${i.aufhoeren}`),
      el('p', { style: 'margin:0.3rem 0 0' }, `⚠️ ${i.grenze}`),
      el('h4', { style: 'margin:0.6rem 0 0.2rem;font-size:0.95rem' }, 'Was Sie dafür brauchen'),
      el('ul', { style: 'margin:0;padding-left:1.1rem' },
        ...k.material.map((m) => el('li', { style: 'margin-bottom:0.3rem' },
          el('strong', {}, `${m.zeichen} ${m.name}: `), el('span', {}, m.woGefunden),
          el('br'), el('span', { style: 'font-size:0.92rem' }, `🧷 ${m.sicherheit}`)))),
      // Die Regel, die immer gilt, gehoert auf das BLATT: wer die Karte
      // ausdruckt und an den Schrank haengt, sieht den Bildschirmtext nie
      // wieder. `karte()` liefert sie, gerendert wurde sie bisher nur oben.
      el('p', { class: 'k-hinweis ek-nur-druck', style: 'margin:0.5rem 0 0' }, `🧷 ${k.sicherheitImmer}`),
      offen
        ? el('div', { class: 'k-antworten ek-nur-bildschirm' },
          el('button', { class: 'k-knopf k-knopf--klein', onclick: () => window.print() }, '🖨️ Diese Karte drucken'),
          vorleseKnopf([i.wennSie, ...(i.wasSieTun ?? []), `Es passt gerade, wenn: ${i.woranSieSehen}`,
            `Schluss ist: ${i.aufhoeren}`, i.grenze].join(' '), '🔊 Karte vorlesen'))
        : null));
}

function render(fokusElement = null) {
  app.replaceChildren(...[
    el('div', { class: 'ek-nur-bildschirm' },
      el('h1', { class: 'k-titel' }, '🎨 Erste Künstler'),
      el('p', { class: 'k-untertitel' }, 'Kritzeln, formen, kleben, bauen – Ideen für 1 bis 3, ohne Checkliste')),
    el('section', { class: 'k-karte ek-nur-bildschirm' },
      el('div', { class: 'k-hinweis' }, el('p', { style: 'margin:0;font-weight:600' }, daten.hinweis)),
      el('p', { style: 'margin:0.6rem 0 0' }, daten.wasEsIst),
      hinweisKarte('📋 Warum hier nichts abgehakt wird:', daten.keinMeilenstein, daten.wasStattdessen),
      vorleseKnopf(`${daten.hinweis} ${daten.wasEsIst} ${daten.keinMeilenstein}`, '🔊 Das Wichtigste vorlesen')),
    el('section', { class: 'k-karte ek-nur-bildschirm k-hinweis' },
      el('p', { style: 'margin:0' }, `🧷 ${daten.sicherheitImmer}`)),
    el('section', { class: 'k-karte ek-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, 'Was sehen Sie gerade?'),
      el('p', { style: 'margin:0 0 0.4rem;font-size:0.9rem;color:#4b5563' },
        'Die Karten sind nach der Gelegenheit geordnet, nicht nach Alter. Suchen Sie die Zeile, die auf Ihr Kind gerade passt.')),
    // Ohne offene Karte traegt kein Element eine Druckklasse - das Blatt
    // waere leer. Ein Satz dazu ist besser als eine weisse Seite.
    offeneIdee === null
      ? el('p', { class: 'ek-nur-druck' }, 'Wählen Sie zuerst eine Idee aus – dann steht hier die Karte dazu.')
      : null,
    ...daten.ideen.map((i) => ideenKarte(i)),
    el('section', { class: 'k-karte ek-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🧭 Was diese App nicht tut'),
      hinweisKarte('🔎 Keine Deutung:', daten.keinDeuten),
      hinweisKarte('🧪 Kein Wirkversprechen:', daten.keinWirkversprechen),
      hinweisKarte('🖼️ Kein vorzeigbares Ergebnis:', daten.keinErgebnis),
      hinweisKarte('📵 Kein Bildschirm fürs Kind:', daten.keinBildschirm)),
    el('section', { class: 'k-karte ek-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '📖 Die 19 Merkmale der Quelle – zum Nachschlagen'),
      el('p', { style: 'margin:0 0 0.4rem;font-size:0.9rem;color:#4b5563' }, daten.zeitpunkt),
      el('div', { class: 'k-antworten' },
        el('button', {
          class: 'k-knopf k-knopf--neutral k-knopf--klein', 'aria-expanded': String(zeigeMerkmale),
          id: 'ek-merkmale',
          onclick: () => { zeigeMerkmale = !zeigeMerkmale; render('ek-merkmale'); },
        }, zeigeMerkmale ? '▲ Zuklappen' : '▼ Die 19 Merkmale lesen')),
      zeigeMerkmale
        ? el('div', {},
          ...BEREICHE.map((b) => el('div', {},
            el('h3', { style: 'margin:0.8rem 0 0.2rem;font-size:1rem' }, BEREICH_NAME[b]),
            el('ol', { style: 'margin:0;padding-left:1.2rem;font-size:0.9rem' },
              ...daten.merkmale.filter((m) => m.bereich === b).map((m) => el('li', { style: 'margin-bottom:0.4rem' },
                el('span', {}, m.text), el('br'),
                el('span', { style: 'color:#4b5563' },
                  m.einordnung === 'ideeDa'
                    ? `${EINORDNUNG_NAME.ideeDa}: ${ideenFuer(daten, m.id).map((i) => i.name).join(', ')}`
                    : m.einordnung === 'anderesWerkzeug'
                      ? `${EINORDNUNG_NAME.anderesWerkzeug}: ${(m.apps ?? []).join(', ')}`
                      : `${EINORDNUNG_NAME[m.einordnung]}: ${m.warum}`)))))),
          el('p', { style: 'margin:0.8rem 0 0;font-size:0.9rem' }, daten.quelle.nachgezaehlt),
          el('p', { style: 'margin:0.3rem 0 0;font-size:0.9rem' }, daten.quelle.abweichung),
          el('p', { style: 'margin:0.3rem 0 0;font-size:0.9rem' }, daten.quelle.werk),
          el('p', { style: 'margin:0.3rem 0 0;font-size:0.9rem' }, daten.quelle.rechte))
        : null),
    el('section', { class: 'k-karte ek-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🚫 Was hier nicht drinsteht – und warum'),
      el('div', { class: 'k-antworten' },
        el('button', {
          class: 'k-knopf k-knopf--neutral k-knopf--klein', 'aria-expanded': String(zeigeAusschluss),
          id: 'ek-aus',
          onclick: () => { zeigeAusschluss = !zeigeAusschluss; render('ek-aus'); },
        }, zeigeAusschluss ? '▲ Liste zuklappen' : '▼ Die Ausschlussliste lesen')),
      zeigeAusschluss
        ? el('ul', { style: 'margin:0.5rem 0 0;padding-left:1.2rem' },
          ...daten.ausgeschlossen.map((a) => el('li', { style: 'margin-bottom:0.5rem' },
            el('strong', {}, a.was), el('br'), el('span', {}, a.warum))))
        : null),
    el('section', { class: 'k-karte ek-nur-bildschirm' },
      el('p', { style: 'margin:0;font-size:0.9rem' },
        'Zusammen hinschauen: ', el('a', { href: '../kunst-gucken/' }, 'Kunst-Gucken'),
        ' · Reime und Lieder: ', el('a', { href: '../familienschatz-reime/' }, 'Familienschatz'),
        ' · Musik zum Zuhören: ', el('a', { href: '../musikmomente-1-3/' }, 'Musikmomente 1–3'),
        ' · Texte zum Vorlesen: ', el('a', { href: '../klanggeschichten-erzeuger/' }, 'Klanggeschichten'),
        ' · welche Buchart passt: ', el('a', { href: '../vorlese-kompass/' }, 'Vorlese-Kompass'),
        ' · ein Material auf Kleinteile prüfen: ', el('a', { href: '../spielzeug-check-u3/' }, 'Spielzeug-Check U3')),
      el('p', { style: 'margin:0.5rem 0 0;font-size:0.9rem' }, `☎️ ${daten.elterntelefon}`)),
    el('footer', { class: 'k-fuss ek-nur-bildschirm' },
      el('span', {}, 'Werkzeug für Erwachsene · kein Bildschirm fürs Kind · speichert nichts · kein Bericht über Ihr Kind · '),
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
