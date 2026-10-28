// Selbststaendigkeits-Leiter (Praleska docs/10, Nr. 58, S. 94-96).
//
// Drei Stufen je Zeile, in beide Richtungen: noch nicht – manchmal – sicher.
// KEINE Gesamtstufe, keine Farbe, keine Ampel, kein Lohn (siehe logik.mjs).
// Das Kind handelt in jeder Zeile, der Erwachsene in jeder Gelegenheit.
// Das Gerät ist in der Hand des Erwachsenen; das Kind sieht keinen
// Bildschirm, darum gibt es keine eltern.html. Politik docs/02: keine
// externen Anfragen; ein localStorage-Schlüssel, löschbar.
import { el, vorlesen, lokaleStimme } from '../../packages/kinder-ui/js/komponenten.mjs';
import { datenKarte } from '../../packages/kinder-ui/js/daten-karte.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import {
  STUFEN, bereicheInReihenfolge, zeilenIm, beschneide, stufeVon, gesetzteStufe,
  inBewegung, naechsteGelegenheiten, bericht, pruefeDaten,
} from './logik.mjs';

installiereNetzwerkWaechter();

const SCHLUESSEL = 'ssl.stand';
// Die Seitenangabe der Quelle (S. 94–96) steht nur in den Daten (quelle.werk) und wird nirgends angezeigt. Die Marke steht
// trotzdem im Quellenabsatz der Ausschlussliste: die Prüfung des Repos zählt jede Nutzerdatei (docs/02, Entscheidung
// Max 22а). Wird quelle.werk einmal gezeigt, gehört die Marke direkt darunter.
const MARKE_QUELLE = 'Seitenangaben der Quelle: nicht von einem Menschen geprüft.';
const app = document.getElementById('app');
const daten = await fetch('daten/leiter.json').then((r) => r.json());

// Beim Laden wird beschnitten, und das Ergebnis wird zurückgeschrieben, wenn
// es sich geändert hat – sonst läge Fremdes weiter auf der Platte (derselbe
// Defekt, den die Browserprobe in Nr. 57 gefunden hat).
let rohText = null;
let stand = (() => {
  try {
    rohText = localStorage.getItem(SCHLUESSEL);
    return beschneide(JSON.parse(rohText ?? '{}'), daten);
  } catch { return {}; }
})();
let speicherSperre = false;

let offeneZeilen = new Set();
let zeigeAusschluss = false;
let zeigeAmtlich = false;

function speichere() {
  stand = beschneide(stand, daten);
  try {
    if (!Object.keys(stand).length) localStorage.removeItem(SCHLUESSEL);
    else localStorage.setItem(SCHLUESSEL, JSON.stringify(stand));
    speicherSperre = false;
  } catch { speicherSperre = true; }
}

if (rohText !== null && JSON.stringify(stand) !== rohText) speichere();

function setzeStufe(id, stufe) {
  // Jede Stufe lässt sich jederzeit wieder zurückstellen: nichts hier hält
  // eine einmal erreichte Stufe fest. Noch einmal auf dieselbe Stufe tippen
  // nimmt sie zurück.
  const neu = { ...stand };
  if (neu[id] === stufe) delete neu[id]; else neu[id] = stufe;
  stand = neu;
  speichere();
  render(`ssl-${id}-${stufe}`);
}

function vorleseKnopf(text, beschriftung = '🔊 Vorlesen') {
  const stimme = lokaleStimme('de');
  if (stimme === null) {
    return el('p', { class: 'k-hinweis ssl-nur-bildschirm', style: 'margin:0.6rem 0' },
      '🗣️ Auf diesem Gerät gibt es keine deutsche Stimme, die offline arbeitet. Vorlesen ist hier deshalb aus.');
  }
  return el('button', {
    class: 'k-knopf k-knopf--neutral k-knopf--klein ssl-nur-bildschirm',
    onclick: () => vorlesen(text, 'de-DE', stimme),
  }, beschriftung);
}

const hinweisKarte = (titel, ...absaetze) => el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
  el('p', { style: 'font-weight:700;margin-top:0' }, titel),
  ...absaetze.map((t) => el('p', { style: 'margin:0 0 0.3rem' }, t)));

// Die Zeichen sind FORMEN, keine Farben: ein rotes Feld wäre genau die
// Wertung, die diese App nicht vornimmt.
const STUFEN_ZEICHEN = { 'noch-nicht': '○', manchmal: '◐', sicher: '●' };

function zeileKnoten(z) {
  // `jetzt` ist die ausdrücklich gesetzte Stufe oder null: beim ersten Öffnen
  // ist KEINE Stufe gedrückt, denn „noch nicht angetippt" ist nicht dasselbe
  // wie „hingesehen und noch nicht gesehen" (Review Welle 80).
  const jetzt = gesetzteStufe(stand, z.id);
  const offen = offeneZeilen.has(z.id);
  return el('div', { class: 'ssl-zeile', style: 'padding:0.6rem 0;border-top:1px solid var(--k-rand)' },
    el('p', { style: 'margin:0;font-weight:600' }, `${z.was}`),
    el('div', { class: 'k-antworten ssl-nur-bildschirm', role: 'group', 'aria-label': `Stufe für: ${z.was}` },
      ...STUFEN.map((s) => el('button', {
        class: `k-knopf k-knopf--klein ${jetzt === s ? '' : 'k-knopf--neutral'}`,
        id: `ssl-${z.id}-${s}`,
        style: 'min-height:3rem',
        'aria-pressed': String(jetzt === s),
        onclick: () => setzeStufe(z.id, s),
      }, `${STUFEN_ZEICHEN[s]} ${daten.stufenTexte[s]}`))),
    el('button', {
      class: 'k-knopf k-knopf--neutral k-knopf--klein ssl-nur-bildschirm',
      style: 'margin-top:0.3rem;text-align:start',
      'aria-expanded': String(offen),
      id: `ssl-mehr-${z.id}`,
      onclick: () => {
        if (offen) offeneZeilen.delete(z.id); else offeneZeilen.add(z.id);
        render(`ssl-mehr-${z.id}`);
      },
    }, offen ? '▲ Zuklappen' : '💡 Gelegenheit dazu'),
    offen
      ? el('div', { class: 'k-hinweis', style: 'margin-top:0.3rem' },
        el('p', { style: 'margin:0;font-size:0.95rem' }, z.gelegenheit),
        z.grenze ? el('p', { style: 'margin:0.4rem 0 0;font-size:0.9rem' }, `⚠️ ${z.grenze}`) : null,
        z.amtlich
          // Die Einordnung „späte Grenze" steht hier MIT, nicht nur in dem
          // Abschnitt weiter unten: der startet zugeklappt und kommt nicht
          // aufs Papier, dieses Detail schon (Review Welle 80).
          ? el('p', { style: 'margin:0.4rem 0 0;font-size:0.85rem;color:#4b5563' },
            `📘 Dieser Satz steht wörtlich in der Kinder-Richtlinie, bei der ${z.amtlich.untersuchung} `
            + `(${z.amtlich.zeitraum}, Toleranz ${z.amtlich.toleranz}) – und dort in der Rubrik `
            + `„${z.amtlich.rubrik}“, nicht unter „Selbstständigkeit“. Ein solches Fenster ist eine SPÄTE `
            + 'Grenze und kein Durchschnitt: wer es als Normalerwartung liest, dreht seinen Sinn um.')
          : null,
        z.eigen
          ? el('p', { style: 'margin:0.4rem 0 0;font-size:0.85rem;color:#6b7280' }, `ℹ️ ${z.eigen}`)
          : null)
      : null);
}

function render(fokusElement = null) {
  const bewegung = inBewegung(daten, stand);
  const naechste = naechsteGelegenheiten(daten, stand);
  const berichtsFeld = el('textarea', {
    readonly: true,
    style: 'width:100%;min-height:10rem;font-family:monospace;font-size:0.8rem;border:2px solid var(--k-rand);border-radius:0.5rem;padding:0.5rem',
    'aria-label': 'Zettel zum Mitnehmen',
  });
  berichtsFeld.value = bericht(daten, stand);

  app.replaceChildren(...[
    el('div', { class: 'ssl-nur-bildschirm' },
      el('h1', { class: 'k-titel' }, '🪜 Ich kann das schon'),
      el('p', { class: 'k-untertitel' }, 'Was Ihr Kind selbst tut – und wo eine Gelegenheit fehlt')),
    el('section', { class: 'k-karte ssl-nur-bildschirm' },
      el('div', { class: 'k-hinweis' }, el('p', { style: 'margin:0;font-weight:600' }, daten.hinweis)),
      el('p', { style: 'margin:0.6rem 0 0' }, daten.wasEsIst),
      el('p', { style: 'margin:0.4rem 0 0' }, daten.wozuDasGut),
      hinweisKarte('○ Was „noch nicht“ heißt:', daten.keinRueckstand),
      hinweisKarte('🩺 Kein Entwicklungstest:', daten.keinScreening),
      hinweisKarte('🔢 Warum hier fast kein Alter steht:', daten.keineZahlen),
      vorleseKnopf(`${daten.wasEsIst} ${daten.keinRueckstand} ${daten.keineZahlen}`, '🔊 Das Wichtigste vorlesen')),
    speicherSperre
      ? el('div', { class: 'k-hinweis k-hinweis--falsch ssl-nur-bildschirm' },
        el('p', { style: 'margin:0' },
          '⚠️ Dieser Browser kann gerade nichts behalten (privater Modus oder blockierte Website-Daten). '
          + 'Die Stufen gelten, solange die Seite offen bleibt – druck den Zettel aus, bevor du sie schließt.'))
      : null,
    ...bereicheInReihenfolge(daten).map((b) => {
      const drin = zeilenIm(daten, b.id);
      if (!drin.length) return null;
      return el('section', { class: 'k-karte ssl-block' },
        el('h2', { style: 'margin-top:0;font-size:1.1rem' }, `${b.zeichen} ${b.name}`),
        b.vorspann ? el('div', { class: 'k-hinweis' }, el('p', { style: 'margin:0;font-weight:600' }, b.vorspann)) : null,
        ...drin.map(zeileKnoten));
    }),
    el('section', { class: 'k-karte ssl-block ssl-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '💡 Wo gerade Bewegung ist'),
      // Keine Zahl über die Liste: die Aufzählung IST die Ausgabe.
      bewegung.length
        ? el('div', {},
          el('p', { style: 'margin:0 0 0.2rem;font-weight:700' }, 'Geht manchmal – hier hilft eine Gelegenheit:'),
          el('ul', { style: 'margin:0 0 0.5rem;padding-left:1.2rem' },
            ...bewegung.map((z) => el('li', { style: 'margin-bottom:0.3rem' },
              el('strong', {}, z.was), el('br'), el('span', {}, z.gelegenheit)))))
        : null,
      naechste.length
        ? el('div', {},
          el('p', { style: 'margin:0 0 0.2rem;font-weight:700' }, 'Könnte als Nächstes eine Gelegenheit brauchen:'),
          el('ul', { style: 'margin:0 0 0.5rem;padding-left:1.2rem' },
            ...naechste.map((z) => el('li', { style: 'margin-bottom:0.3rem' },
              el('strong', {}, z.was), el('br'), el('span', {}, z.gelegenheit)))))
        : null,
      !bewegung.length && !naechste.length
        ? el('p', { style: 'margin:0 0 0.5rem' }, 'Hier steht gerade nichts – das ist kein Befund.')
        : null,
      el('div', { class: 'k-hinweis' }, el('p', { style: 'margin:0;font-weight:600' }, daten.keinLohn)),
      berichtsFeld,
      el('div', { class: 'k-antworten' },
        el('button', {
          class: 'k-knopf k-knopf--klein',
          onclick: (ev) => {
            const knopf = ev.currentTarget;
            berichtsFeld.select();
            const melde = (text) => { knopf.textContent = text; };
            try {
              const pr = navigator.clipboard?.writeText(berichtsFeld.value);
              if (!pr) { melde('⚠️ Kopieren geht hier nicht – Text ist markiert'); return; }
              pr.then(() => melde('✔️ Kopiert!')).catch(() => melde('⚠️ Kopieren hat nicht geklappt – Text ist markiert'));
            } catch { melde('⚠️ Kopieren geht hier nicht – Text ist markiert'); }
          },
        }, '📋 Zettel kopieren'),
        el('button', { class: 'k-knopf k-knopf--klein', onclick: () => window.print() }, '🖨️ Zettel drucken'))),
    // Auf dem Papier: nur die Gelegenheiten und die Absagen. Keine Stufen,
    // kein Haken, keine Namenszeile – ein Zettel, der nicht wie ein Befund
    // aussieht (docs/02).
    el('section', { class: 'k-karte ssl-block ssl-nur-druck' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🪜 Selbstständigkeit – was ich gerade sehe'),
      el('p', { style: 'margin:0 0 0.4rem' }, daten.keinRueckstand),
      bewegung.length
        ? el('div', {},
          el('p', { style: 'margin:0 0 0.2rem;font-weight:700' }, 'Geht manchmal:'),
          el('ul', { style: 'margin:0 0 0.5rem;padding-left:1.2rem' },
            ...bewegung.map((z) => el('li', {}, `${z.was} – ${z.gelegenheit}`))))
        : null,
      naechste.length
        ? el('div', {},
          el('p', { style: 'margin:0 0 0.2rem;font-weight:700' }, 'Könnte eine Gelegenheit brauchen:'),
          el('ul', { style: 'margin:0 0 0.5rem;padding-left:1.2rem' },
            ...naechste.map((z) => el('li', {}, `${z.was} – ${z.gelegenheit}`))))
        : null,
      el('p', { style: 'margin:0' }, daten.keinScreening)),
    el('section', { class: 'k-karte ssl-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '📘 Die drei amtlichen Sätze'),
      el('div', { class: 'k-antworten' },
        el('button', {
          class: 'k-knopf k-knopf--neutral k-knopf--klein', 'aria-expanded': String(zeigeAmtlich),
          id: 'ssl-amtlich',
          onclick: () => { zeigeAmtlich = !zeigeAmtlich; render('ssl-amtlich'); },
        }, zeigeAmtlich ? '▲ Zuklappen' : '▼ Was dort steht und wie es zu lesen ist')),
      zeigeAmtlich
        ? el('div', {},
          el('p', { style: 'margin:0.4rem 0 0' }, daten.amtlichErklaert),
          el('ul', { style: 'margin:0.4rem 0 0;padding-left:1.2rem' },
            ...daten.zeilen.filter((z) => z.amtlich).map((z) => el('li', { style: 'margin-bottom:0.3rem' },
              el('strong', {}, `„${z.amtlich.wortlaut}“`), el('br'),
              el('span', {}, `${z.amtlich.untersuchung}, ${z.amtlich.zeitraum} (Toleranz ${z.amtlich.toleranz}), `
                + `Rubrik „${z.amtlich.rubrik}“`)))),
          el('p', { style: 'margin:0.5rem 0 0;font-size:0.9rem;color:#4b5563' }, daten.quelle.amtlich))
        : null),
    el('section', { class: 'k-karte ssl-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🚑 Erste Hilfe steht hier nicht'),
      el('div', { class: 'k-hinweis k-hinweis--falsch' },
        el('p', { style: 'margin:0;font-weight:600' }, daten.keineErsteHilfe)),
      el('p', { style: 'margin:0.5rem 0 0' }, `☎️ ${daten.elterntelefon}`)),
    el('section', { class: 'k-karte ssl-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🚫 Was hier nicht drinsteht – und warum'),
      el('div', { class: 'k-antworten' },
        el('button', {
          class: 'k-knopf k-knopf--neutral k-knopf--klein', 'aria-expanded': String(zeigeAusschluss),
          id: 'ssl-aus',
          onclick: () => { zeigeAusschluss = !zeigeAusschluss; render('ssl-aus'); },
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
    datenKarte({
      schluessel: SCHLUESSEL,
      was: 'welche Stufe Sie bei welcher Zeile angetippt haben – kein Name, kein Alter, kein Datum',
      nachLoeschen: () => { stand = {}; render(); },
      knopfId: 'ssl-daten-loeschen',
      // Ohne die Nur-Bildschirm-Klasse druckt die Daten-Karte mit, und ein
      // Druckblatt traegt keinen Loeschknopf (docs/02, Review Welle 80).
      klasse: 'ssl-nur-bildschirm',
    }),
    el('section', { class: 'k-karte ssl-nur-bildschirm' },
      el('p', { style: 'margin:0;font-size:0.9rem' },
        'Für die Entwicklung im ersten Jahr: ', el('a', { href: '../meilenstein-begleiter/' }, 'Meilenstein-Begleiter'),
        ' · für die Sicherheit im Raum: ', el('a', { href: '../sicherer-krabbelraum-check/' }, 'Sicherer-Krabbelraum-Check'),
        ' · für ein einzelnes Spielzeug: ', el('a', { href: '../spielzeug-check-u3/' }, 'Spielzeug-Check U3'))),
    el('footer', { class: 'k-fuss ssl-nur-bildschirm' },
      el('span', {}, 'Werkzeug für Erwachsene · kein Bildschirm fürs Kind · keine Gesamtstufe · '),
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
  // `lokaleStimme` liefert `undefined`, solange der Browser die Stimmliste
  // noch nicht geladen hat - das ist beim ersten Zeichnen der Normalfall.
  // Ohne diesen Neuaufbau bliebe der Vorlese-Knopf stumm oder liefe mit der
  // Standardstimme, die netzbasiert sein kann (Review Welle 80; Muster aus
  // apps/erste-woerter-tagebuch).
  if ('speechSynthesis' in globalThis) {
    speechSynthesis.addEventListener?.('voiceschanged', () => render(), { once: true });
  }
}
