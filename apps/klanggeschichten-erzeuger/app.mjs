// Reim- und Klanggeschichten-Erzeuger (Praleska docs/10, Nr. 59, S. 81/86).
//
// Der Erzeuger setzt Texte aus eigenen Bausteinen zusammen - kein
// überliefertes Fingerspiel, kein Liedtext (siehe logik.mjs). Gleiche Auswahl,
// gleicher Text. Das Gerät ist in der Hand des Erwachsenen; das Kind sieht
// keinen Bildschirm, darum gibt es keine eltern.html. Die App speichert
// NICHTS: kein Schlüssel, kein Merkzettel - wer einen Text behalten will,
// druckt ihn. Politik docs/02: keine externen Anfragen.
import { el, vorlesen, lokaleStimme } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { VARIANTEN, erzeuge, textBlock, formVon, stoffVon, pruefeDaten } from './logik.mjs';

installiereNetzwerkWaechter();

// Die Seitenangaben der Quelle sind nicht von einem Menschen geprüft (docs/02, Entscheidung Max 22а). Die Marke steht
// auf dem Bildschirm im Quellenabsatz der Ausschlussliste, dort stehen die Seitenangaben (S. 80, 81, 86). Der Druck und
// der kopierte Text tragen keine Seitenangabe und darum auch keine Marke.
const MARKE_QUELLE = 'Seitenangaben der Quelle: nicht von einem Menschen geprüft.';

const app = document.getElementById('app');
const daten = await fetch('daten/stoffe.json').then((r) => r.json());

// Der einzige Zustand ist die aktuelle Auswahl - im Arbeitsspeicher, nicht auf
// der Platte. Nach dem Schließen ist nichts übrig.
let stoff = null;
let form = null;
let umfang = null;
let variante = 0;
let zeigeAusschluss = false;

function vorleseKnopf(text, beschriftung = '🔊 Vorlesen') {
  const stimme = lokaleStimme('de');
  if (stimme === null) {
    return el('p', { class: 'k-hinweis kge-nur-bildschirm', style: 'margin:0.6rem 0' },
      '🗣️ Auf diesem Gerät gibt es keine deutsche Stimme, die offline arbeitet. Vorlesen ist hier deshalb aus.');
  }
  return el('button', {
    class: 'k-knopf k-knopf--neutral k-knopf--klein kge-nur-bildschirm',
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

function render(fokusElement = null) {
  const f = form ? formVon(daten, form) : null;
  const s = stoff ? stoffVon(daten, stoff) : null;
  // Der Umfang wird zurückgesetzt, wenn er zur neuen Form nicht gehört -
  // sonst stünde ein Knopf gedrückt da, den diese Form nicht kennt.
  const moeglich = f?.umfaenge ?? [];
  if (umfang !== null && !moeglich.includes(umfang)) umfang = null;
  const fertig = s && f && umfang !== null;
  const text = fertig ? erzeuge(daten, { stoff, form, umfang, variante }) : null;
  const block = fertig ? textBlock(daten, { stoff, form, umfang, variante }) : '';
  const feld = el('textarea', {
    readonly: true,
    style: 'width:100%;min-height:11rem;font-family:monospace;font-size:0.85rem;border:2px solid var(--k-rand);border-radius:0.5rem;padding:0.5rem',
    'aria-label': 'Der erzeugte Text',
  });
  feld.value = block;

  app.replaceChildren(...[
    el('div', { class: 'kge-nur-bildschirm' },
      el('h1', { class: 'k-titel' }, '🎭 Klanggeschichten'),
      el('p', { class: 'k-untertitel' }, 'Kurze Mitmach-Texte zum Vorlesen – hier erzeugt, nicht abgeschrieben')),
    el('section', { class: 'k-karte kge-nur-bildschirm' },
      el('div', { class: 'k-hinweis' }, el('p', { style: 'margin:0;font-weight:600' }, daten.hinweis)),
      el('p', { style: 'margin:0.6rem 0 0' }, daten.wasEsIst),
      hinweisKarte('✍️ Woher die Zeilen kommen:', daten.eigenproduktion),
      vorleseKnopf(`${daten.hinweis} ${daten.wasEsIst}`, '🔊 Das Wichtigste vorlesen')),
    el('section', { class: 'k-karte kge-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '1 · Wovon soll es gehen?'),
      el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Stoff wählen' },
        ...daten.stoffe.map((x) => waehlerKnopf(`kge-s-${x.id}`, `${x.zeichen} ${x.name}`, x.id === stoff,
          () => { stoff = x.id === stoff ? null : x.id; variante = 0; render(`kge-s-${x.id}`); })))),
    el('section', { class: 'k-karte kge-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '2 · Welche Form?'),
      el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Form wählen' },
        ...daten.formen.map((x) => waehlerKnopf(`kge-f-${x.id}`, `${x.zeichen} ${x.name}`, x.id === form,
          () => { form = x.id === form ? null : x.id; variante = 0; render(`kge-f-${x.id}`); }))),
      f
        ? el('div', {},
          el('p', { style: 'margin:0.6rem 0 0' }, `👩‍👦 ${f.wasSieTun}`),
          el('p', { style: 'margin:0.3rem 0 0;font-size:0.95rem;color:#4b5563' }, `👀 Es passt, wenn: ${f.woranSieSehen}`),
          el('h3', { style: 'margin:0.6rem 0 0.3rem;font-size:1rem' }, '3 · Wie lang?'),
          el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Umfang wählen' },
            ...moeglich.map((n) => waehlerKnopf(`kge-u-${n}`,
              form === 'frage-antwort' ? `${n} Fragen` : form === 'kettenreim' ? `${n} Glieder` : `${n} Bilder`,
              n === umfang, () => { umfang = n === umfang ? null : n; variante = 0; render(`kge-u-${n}`); }))))
        : null),
    fertig
      ? el('section', { class: 'k-karte kge-block' },
        el('h2', { style: 'margin-top:0;font-size:1.1rem' }, text.titel),
        ...text.zeilen.map((z) => el('p', { style: 'margin:0 0 0.4rem;font-size:1.05rem' }, z)),
        text.klaenge.length
          ? el('p', { style: 'margin:0.4rem 0 0;font-size:0.9rem;color:#4b5563' },
            `🖐️ Klänge: ${[...new Set(text.klaenge)].join(' · ')}`)
          : null,
        el('div', { class: 'k-antworten kge-nur-bildschirm' },
          el('button', {
            class: 'k-knopf k-knopf--klein',
            id: 'kge-noch-eine',
            // Die Variante läuft im Kreis: nach der letzten kommt wieder die
            // erste, und dieselbe Auswahl gibt immer denselben Text.
            onclick: () => { variante = (variante + 1) % VARIANTEN; render('kge-noch-eine'); },
          }, '🔄 Noch eine'),
          vorleseKnopf(text.zeilen.join(' '), '🔊 Text vorlesen'),
          el('button', { class: 'k-knopf k-knopf--klein', onclick: () => window.print() }, '🖨️ Drucken')),
        el('p', { class: 'kge-nur-bildschirm', style: 'margin:0.5rem 0 0;font-size:0.85rem;color:#6b7280' },
          `Variante ${variante + 1} von ${VARIANTEN} · dieselbe Auswahl gibt immer denselben Text`),
        el('div', { class: 'kge-nur-bildschirm' },
          feld,
          el('div', { class: 'k-antworten' },
            el('button', {
              class: 'k-knopf k-knopf--klein',
              onclick: (ev) => {
                const knopf = ev.currentTarget;
                feld.select();
                const melde = (t) => { knopf.textContent = t; };
                try {
                  const p = navigator.clipboard?.writeText(feld.value);
                  if (!p) { melde('⚠️ Kopieren geht hier nicht – Text ist markiert'); return; }
                  p.then(() => melde('✔️ Kopiert!')).catch(() => melde('⚠️ Kopieren hat nicht geklappt – Text ist markiert'));
                } catch { melde('⚠️ Kopieren geht hier nicht – Text ist markiert'); }
              },
            }, '📋 Text kopieren'))))
      : el('section', { class: 'k-karte kge-nur-bildschirm' },
        el('p', { style: 'margin:0' }, 'Wählen Sie Stoff, Form und Länge – dann steht der Text hier.')),
    el('section', { class: 'k-karte kge-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🧭 Was diese App nicht tut'),
      hinweisKarte('🙅 Keine Einteilung:', daten.keinNiveau),
      hinweisKarte('🧪 Kein Wirkversprechen:', daten.keinWirkversprechen),
      hinweisKarte('⏱️ Keine Dauer:', daten.keineDauer),
      hinweisKarte('🔊 Lautstärke:', daten.lautstaerke),
      hinweisKarte('🥄 Kein Instrument nötig:', daten.instrumente),
      hinweisKarte('🌍 Keine Übersetzung:', daten.keineUebersetzung)),
    el('section', { class: 'k-karte kge-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🚫 Was hier nicht drinsteht – und warum'),
      el('div', { class: 'k-antworten' },
        el('button', {
          class: 'k-knopf k-knopf--neutral k-knopf--klein', 'aria-expanded': String(zeigeAusschluss),
          id: 'kge-aus',
          onclick: () => { zeigeAusschluss = !zeigeAusschluss; render('kge-aus'); },
        }, zeigeAusschluss ? '▲ Liste zuklappen' : '▼ Die Ausschlussliste lesen')),
      zeigeAusschluss
        ? el('div', {},
          el('ul', { style: 'margin:0.5rem 0 0;padding-left:1.2rem' },
            ...daten.ausgeschlossen.map((a) => el('li', { style: 'margin-bottom:0.5rem' },
              el('strong', {}, a.was), el('br'), el('span', {}, a.warum)))),
          el('p', { style: 'margin:0.6rem 0 0;font-size:0.9rem;color:#4b5563' },
            `${daten.quelle.nachgezaehlt} ${daten.quelle.abweichung}`),
          el('p', { style: 'margin:0.3rem 0 0;font-size:0.9rem;color:#4b5563' }, MARKE_QUELLE))
        : null),
    el('section', { class: 'k-karte kge-nur-bildschirm' },
      el('p', { style: 'margin:0;font-size:0.9rem' },
        'Reime, Kniereiter und Wiegenlieder: ', el('a', { href: '../familienschatz-reime/' }, 'Familienschatz'),
        ' · Musik zum Zuhören: ', el('a', { href: '../musikmomente-1-3/' }, 'Musikmomente 1–3'),
        ' · Gelegenheiten im Tag: ', el('a', { href: '../musik-alltags-begleiter/' }, 'Musik im Alltag'),
        ' · ein Instrument prüfen: ', el('a', { href: '../spielzeug-check-u3/' }, 'Spielzeug-Check U3')),
      el('p', { style: 'margin:0.5rem 0 0;font-size:0.9rem' }, `☎️ ${daten.elterntelefon}`)),
    el('footer', { class: 'k-fuss kge-nur-bildschirm' },
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
