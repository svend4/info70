// Musik-Alltags-Begleiter für Eltern (Praleska docs/10, Nr. 57, S. 87-88).
//
// Notiert wird das Tun des ERWACHSENEN: Tag, Gelegenheit, Art – und sonst
// nichts. Es gibt kein Feld für die Reaktion des Kindes, keine Ampel, keine
// rote Stufe und keine Serie (siehe logik.mjs). Das Gerät ist in der Hand des
// Erwachsenen; das Kind sieht keinen Bildschirm, darum gibt es keine
// eltern.html. Politik docs/02: keine externen Anfragen; ein
// localStorage-Schlüssel, löschbar, und er hält nur sieben Tage.
import { el, vorlesen, lokaleStimme } from '../../packages/kinder-ui/js/komponenten.mjs';
import { datenKarte } from '../../packages/kinder-ui/js/daten-karte.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import {
  ARTEN, tagAus, fensterTage, beschneide, notizenAm, fensterSatz, bericht, druckBlatt, pruefeDaten,
} from './logik.mjs';
import daten from './daten/rituale.json' with { type: 'json' };

installiereNetzwerkWaechter();

// Die Seitenangabe der Quelle (S. 87–88) steht nur in den Daten (quelle.werk) und wird auf dem Bildschirm nicht gezeigt.
// Die ehrliche Marke steht trotzdem in der Karte „Was hier nicht drinsteht“, im Quellenabsatz an der Stelle, an der die
// Quellenzeile stünde, vor den Angaben zur Nachzählung (docs/02, Entscheidung Max 22а): kein Mensch hat die Seiten der
// Quelle geprüft. Das Druckblatt und der kopierte Rückblick tragen keine Seitenangabe und darum auch keine Marke.
const MARKE_QUELLE = 'Seitenangaben der Quelle: nicht von einem Menschen geprüft.';

const SCHLUESSEL = 'mab.notizen';
const app = document.getElementById('app');

/**
 * Der heutige Tag, bei JEDEM Aufruf neu. Die erste Fassung bildete ihn einmal
 * beim Modulladen - wer die Seite über Mitternacht offen hielt, speicherte
 * eine Notiz mit dem Datum von GESTERN, und `speichere()` beschnitt gegen ein
 * veraltetes Fenster und schrieb damit Notizen zurück, die längst aus den
 * sieben Tagen gefallen waren (Review Welle 80).
 */
const heuteJetzt = () => tagAus(new Date());

// Der Stand liegt im Arbeitsspeicher; localStorage ist die Kopie. Beim LADEN
// wird beschnitten - und das Ergebnis muss ZURÜCKGESCHRIEBEN werden. Die
// erste Fassung beschnitt nur die Liste im Speicherplatz des Programms: wer
// die Seite öffnete und nichts notierte, hatte danach die alten Einträge
// weiter im localStorage, und die Zusage „beim Öffnen gelöscht, nicht
// archiviert" war damit falsch. Gefunden hat das die Browserprobe, nicht der
// Test: eine 2020er Notiz mit einem Fremdfeld überlebte das Neuladen.
let rohText = null;
let notizen = (() => {
  try {
    rohText = localStorage.getItem(SCHLUESSEL);
    return beschneide(JSON.parse(rohText ?? '[]'), heuteJetzt(), daten);
  } catch { return []; }
})();
let speicherSperre = false;

let gelegenheit = null;
let zeigeKatalog = false;
let zeigeWarumKeineAmpel = false;
let meldung = '';

function speichere() {
  // Und beim SPEICHERN noch einmal, mit dem Tag von JETZT: sonst wächst der
  // Speicher über das Fenster hinaus, wenn die Seite lange offen bleibt.
  notizen = beschneide(notizen, heuteJetzt(), daten);
  try {
    if (!notizen.length) localStorage.removeItem(SCHLUESSEL);
    else localStorage.setItem(SCHLUESSEL, JSON.stringify(notizen));
    speicherSperre = false;
  } catch { speicherSperre = true; }
}

// Sofort nach dem Laden: hat das Beschneiden etwas verändert, gilt das auch
// auf der Platte. Unverändert wird nicht geschrieben, damit ein gesperrter
// Speicher beim reinen Lesen keine Warnung auslöst.
if (rohText !== null && JSON.stringify(notizen) !== rohText) speichere();

function notiere(art) {
  if (!gelegenheit) return;
  const vorher = notizen.length;
  notizen = [...notizen, { tag: heuteJetzt(), gelegenheit, art }];
  speichere();
  const a = daten.arten.find((x) => x.id === art);
  const r = daten.rituale.find((x) => x.id === gelegenheit);
  // Nur melden, wenn wirklich etwas dazugekommen ist: dieselbe Art bei
  // derselben Gelegenheit am selben Tag ist EINE Notiz (`beschneide`), und
  // eine Erfolgsmeldung über einen Eintrag, den es nicht gibt, wäre eine
  // kleine Unwahrheit (Review Welle 80).
  meldung = notizen.length > vorher
    ? `Notiert: ${r?.name ?? ''} – ${a?.name ?? ''}.`
    : `Steht schon da: ${r?.name ?? ''} – ${a?.name ?? ''}.`;
  // Fokus auf den eben gedrückten Knopf. Vorher stand hier `mab-heute`, und
  // das ist eine <section> ohne tabindex: `focus()` tut darauf nichts, und
  // weil `replaceChildren` den alten Knopf zerstört, landete der Fokus auf
  // <body> - nach jedem Notieren musste man sich durch zehn Knöpfe
  // zurücktabben (Review Welle 80).
  render(`mab-a-${art}`);
}

function entferne(index) {
  notizen = notizen.filter((_, i) => i !== index);
  speichere();
  meldung = 'Notiz entfernt.';
  // Dasselbe hier: ein Knopf als Ziel, keine <section>.
  render(gelegenheit ? `mab-g-${gelegenheit}` : 'mab-katalog');
}

function vorleseKnopf(text, beschriftung = '🔊 Vorlesen') {
  const stimme = lokaleStimme('de');
  if (stimme === null) {
    return el('p', { class: 'k-hinweis mab-nur-bildschirm', style: 'margin:0.6rem 0' },
      '🗣️ Auf diesem Gerät gibt es keine deutsche Stimme, die offline arbeitet. Vorlesen ist hier deshalb aus.');
  }
  return el('button', {
    class: 'k-knopf k-knopf--neutral k-knopf--klein mab-nur-bildschirm',
    'data-kennung': 'mab-vorlesen',
    onclick: () => vorlesen(text, 'de-DE', stimme),
  }, beschriftung);
}

const hinweisKarte = (titel, ...absaetze) => el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
  el('p', { style: 'font-weight:700;margin-top:0' }, titel),
  ...absaetze.map((t) => el('p', { style: 'margin:0 0 0.3rem' }, t)));

const tagText = (tag) => new Date(`${tag}T00:00:00Z`)
  .toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit', timeZone: 'UTC' });

function katalogZeile(r) {
  return el('div', { style: 'margin-top:0.6rem;padding-top:0.5rem;border-top:1px solid var(--k-rand)' },
    el('p', { style: 'margin:0;font-weight:700' }, `${r.zeichen} ${r.name}`),
    el('p', { style: 'margin:0.2rem 0 0' }, r.wasDuTust),
    el('p', { style: 'margin:0.2rem 0 0;font-size:0.9rem;color:#4b5563' }, `💡 ${r.warumHier}`),
    el('p', { style: 'margin:0.2rem 0 0;font-size:0.9rem' }, `🧺 ${r.ohneGeraet}`),
    r.grenze ? el('div', { class: 'k-hinweis', style: 'margin:0.3rem 0 0' },
      el('p', { style: 'margin:0;font-size:0.9rem' }, `⚠️ ${r.grenze}`)) : null);
}

/**
 * Das Druckblatt. Hier steht kein Zeichen, kein Emoji und keine Namenszeile:
 * der Text kommt aus `druckBlatt` (logik.mjs), und der Test prüft ihn dort.
 * Das Blatt trägt keine Seitenangabe (A18).
 */
function druckKarte(blatt) {
  return el('section', { class: 'k-karte mab-block mab-nur-druck' },
    el('h2', { style: 'margin-top:0;font-size:1.1rem' }, blatt.titel),
    el('p', { style: 'margin:0 0 0.4rem' }, blatt.satz),
    ...blatt.tage.map((t) => el('div', { style: 'margin-bottom:0.3rem' },
      el('p', { style: 'margin:0;font-weight:700' }, `${tagText(t.tag)}${t.heute ? ', heute' : ''}`),
      el('ul', { style: 'margin:0;padding-left:1.2rem' },
        ...t.eintraege.map((e) => el('li', {}, `${e.gelegenheit} – ${e.art}`))))),
    el('p', { style: 'margin:0.4rem 0 0' }, blatt.schluss[0]),
    el('p', { style: 'margin:0.3rem 0 0' }, blatt.schluss[1]));
}

function render(fokusElement = null) {
  const heute = heuteJetzt();
  const heuteNotizen = notizenAm(notizen, heute);
  const berichtText = bericht(daten, notizen, heute);
  // Ein Textblock statt eines Eingabefelds: der Rückblick ist nur zum
  // Kopieren da, und ein Eingabefeld gibt es in dieser App nicht (docs/02).
  const berichtsFeld = el('pre', {
    class: 'mab-bericht',
    role: 'region',
    'aria-label': 'Rückblick über sieben Tage',
  }, berichtText);

  app.replaceChildren(...[
    el('div', { class: 'mab-nur-bildschirm' },
      el('h1', { class: 'k-titel' }, '🎶 Musik im Alltag'),
      el('p', { class: 'k-untertitel' }, 'Ein Zettel über Ihr eigenes Tun – nicht über Ihr Kind')),
    el('section', { class: 'k-karte mab-nur-bildschirm' },
      el('div', { class: 'k-hinweis' }, el('p', { style: 'margin:0;font-weight:600' }, daten.hinweis)),
      el('p', { style: 'margin:0.6rem 0 0' }, daten.wasEsIst),
      hinweisKarte('🙈 Kein Feld für Ihr Kind:', daten.keineReaktion),
      hinweisKarte('📵 Bildschirme:', daten.bildschirm),
      vorleseKnopf(`${daten.hinweis} ${daten.wasEsIst} ${daten.keineReaktion}`, '🔊 Das Wichtigste vorlesen')),
    el('section', { class: 'k-karte mab-nur-bildschirm', id: 'mab-heute' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, `✏️ Heute, ${tagText(heute)}`),
      speicherSperre
        ? el('div', { class: 'k-hinweis k-hinweis--falsch' },
          el('p', { style: 'margin:0' },
            '⚠️ Dieser Browser kann gerade nichts behalten (privater Modus oder blockierte Website-Daten). '
            + 'Die Notizen gelten, solange die Seite offen bleibt.'))
        : null,
      el('p', { style: 'margin:0 0 0.4rem;font-size:0.95rem' }, 'Erst die Gelegenheit, dann was Sie getan haben. Ein Tipp – fertig.'),
      el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Gelegenheit wählen' },
        ...daten.rituale.map((r) => el('button', {
          class: `k-knopf k-knopf--klein ${r.id === gelegenheit ? '' : 'k-knopf--neutral'}`,
          style: 'text-align:start;min-height:3rem',
          id: `mab-g-${r.id}`,
          'data-kennung': `mab-g-${r.id}`,
          'aria-pressed': String(r.id === gelegenheit),
          onclick: () => { gelegenheit = r.id === gelegenheit ? null : r.id; meldung = ''; render(`mab-g-${r.id}`); },
        }, `${r.zeichen} ${r.name}`))),
      gelegenheit
        ? el('div', { style: 'margin-top:0.6rem' },
          el('p', { style: 'margin:0 0 0.3rem;font-weight:700' },
            `${(daten.rituale.find((r) => r.id === gelegenheit) ?? {}).name}: Was haben SIE getan?`),
          el('p', { style: 'margin:0 0 0.4rem;font-size:0.9rem;color:#4b5563' },
            (daten.rituale.find((r) => r.id === gelegenheit) ?? {}).wasDuTust),
          el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Art wählen' },
            ...ARTEN.map((id) => daten.arten.find((a) => a.id === id)).filter(Boolean).map((a) => el('button', {
              class: 'k-knopf k-knopf--klein',
              style: 'text-align:start;min-height:3rem',
              id: `mab-a-${a.id}`,
              'data-kennung': `mab-a-${a.id}`,
              onclick: () => notiere(a.id),
            }, `${a.zeichen} ${a.name}`))))
        : null,
      meldung ? el('p', { style: 'margin:0.5rem 0 0;font-weight:700', 'aria-live': 'polite' }, `✔️ ${meldung}`) : null,
      heuteNotizen.length
        ? el('ul', { style: 'margin:0.6rem 0 0;padding-left:1.2rem' },
          ...heuteNotizen.map((n) => {
            const index = notizen.indexOf(n);
            const r = daten.rituale.find((x) => x.id === n.gelegenheit);
            const a = daten.arten.find((x) => x.id === n.art);
            return el('li', { style: 'margin-bottom:0.4rem' },
              el('span', {}, `${r?.name ?? ''} – ${a?.name ?? ''} `),
              el('button', {
                class: 'k-knopf k-knopf--neutral k-knopf--klein',
                style: 'min-height:2.6rem',
                // Eigene Beschriftung je Knopf: bei sechs Notizen am Tag
                // hieße sonst jeder Knopf gleich (Review Welle 80).
                'aria-label': `Notiz entfernen: ${r?.name ?? ''} – ${a?.name ?? ''}`,
                'data-kennung': `mab-entfernen-${index}`,
                onclick: () => entferne(index),
              }, '✕ entfernen'));
          }))
        : el('p', { style: 'margin:0.6rem 0 0;font-size:0.95rem;color:#4b5563' },
          'Heute steht hier noch nichts. Muss auch nicht.')),
    el('section', { class: 'k-karte mab-block mab-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🗓️ Die letzten sieben Tage'),
      el('p', { style: 'margin:0 0 0.5rem' }, fensterSatz(notizen, heute)),
      el('div', {},
        ...fensterTage(heute).map((tag) => {
          const drin = notizenAm(notizen, tag);
          return el('div', { style: 'padding:0.35rem 0;border-top:1px solid var(--k-rand)' },
            el('p', { style: 'margin:0;font-weight:600;font-size:0.95rem' },
              `${tag === heute ? '📍 ' : ''}${tagText(tag)}`),
            drin.length
              ? el('p', { style: 'margin:0.1rem 0 0;font-size:0.9rem' },
                drin.map((n) => {
                  const r = daten.rituale.find((x) => x.id === n.gelegenheit);
                  const a = daten.arten.find((x) => x.id === n.art);
                  return `${a?.zeichen ?? ''} ${r?.name ?? ''}`;
                }).join(' · '))
              // Kein Zeichen für „nichts“: kein Kreuz, kein Punkt, keine
              // Farbe. Ein leerer Tag ist kein Befund.
              : el('p', { style: 'margin:0.1rem 0 0;font-size:0.9rem;color:#6b7280' }, '—'));
        })),
      el('p', { style: 'margin:0.6rem 0 0;font-size:0.9rem' }, `🗃️ ${daten.wasDasFensterIst}`),
      el('div', { class: 'k-antworten', style: 'margin-top:0.5rem' },
        el('button', {
          class: 'k-knopf k-knopf--neutral k-knopf--klein', 'aria-expanded': String(zeigeWarumKeineAmpel),
          id: 'mab-warum',
          'data-kennung': 'mab-warum',
          onclick: () => { zeigeWarumKeineAmpel = !zeigeWarumKeineAmpel; render('mab-warum'); },
        }, zeigeWarumKeineAmpel ? '▲ Zuklappen' : '🚦 Warum hier keine Ampel steht')),
      zeigeWarumKeineAmpel
        ? el('div', {},
          hinweisKarte('🚦 Keine Ampel:', daten.keineAmpel),
          hinweisKarte('🔗 Keine Serie:', daten.keineSerie),
          hinweisKarte('🎯 Kein Soll:', daten.keinZiel))
        : null,
      berichtsFeld,
      el('div', { class: 'k-antworten' },
        el('button', {
          class: 'k-knopf k-knopf--klein',
          'data-kennung': 'mab-kopieren',
          onclick: (ev) => {
            const knopf = ev.currentTarget;
            const melde = (text) => { knopf.textContent = text; };
            // Ohne Zwischenablage bleibt der Text markiert, damit er von Hand kopiert werden kann.
            const markiere = () => {
              const bereich = document.createRange();
              bereich.selectNodeContents(berichtsFeld);
              window.getSelection().removeAllRanges();
              window.getSelection().addRange(bereich);
            };
            try {
              const p = navigator.clipboard?.writeText(berichtText);
              if (!p) { markiere(); melde('⚠️ Kopieren geht hier nicht – Text ist markiert'); return; }
              p.then(() => melde('✔️ Kopiert!')).catch(() => { markiere(); melde('⚠️ Kopieren hat nicht geklappt – Text ist markiert'); });
            } catch { markiere(); melde('⚠️ Kopieren geht hier nicht – Text ist markiert'); }
          },
        }, '📋 Rückblick kopieren'),
        el('button', {
          class: 'k-knopf k-knopf--klein',
          'data-kennung': 'mab-drucken',
          onclick: () => window.print(),
        }, '🖨️ Rückblick drucken'))),
    // Das Druckblatt: Text ohne Häkchen, ohne Farbe, ohne Namenszeile (docs/02).
    druckKarte(druckBlatt(daten, notizen, heute)),
    el('section', { class: 'k-karte mab-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '📋 Zehn Gelegenheiten im Tag'),
      el('p', { style: 'margin:0 0 0.4rem;font-size:0.95rem' },
        'Keine Aufgabenliste – eine Sammlung von Stellen, an denen Musik ohnehin hineinpasst.'),
      el('div', { class: 'k-antworten' },
        el('button', {
          class: 'k-knopf k-knopf--neutral k-knopf--klein', 'aria-expanded': String(zeigeKatalog),
          id: 'mab-katalog',
          'data-kennung': 'mab-katalog',
          onclick: () => { zeigeKatalog = !zeigeKatalog; render('mab-katalog'); },
        }, zeigeKatalog ? '▲ Liste zuklappen' : '▼ Die Gelegenheiten lesen')),
      zeigeKatalog ? el('div', {}, ...daten.rituale.map(katalogZeile)) : null),
    el('section', { class: 'k-karte mab-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🎵 Welche Musik? Nicht hier.'),
      el('p', { style: 'margin:0 0 0.4rem' }, daten.keineLiederliste),
      el('p', { style: 'margin:0 0 0.4rem;font-size:0.95rem' }, daten.keineUebersetzung),
      el('p', { style: 'margin:0 0 0.4rem;font-size:0.9rem;color:#4b5563' }, `⏱️ ${daten.minutenInDerQuelle}`),
      el('p', { style: 'margin:0' },
        'Hör-Ideen mit freien Werken: ', el('a', { href: '../musikmomente-1-3/' }, 'Musikmomente 1–3'),
        ' · Reime, Kniereiter und Wiegenlieder: ', el('a', { href: '../familienschatz-reime/' }, 'Familienschatz'))),
    el('section', { class: 'k-karte mab-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🚫 Was hier nicht drinsteht – und warum'),
      el('ul', { style: 'margin:0;padding-left:1.2rem' },
        ...daten.ausgeschlossen.map((a) => el('li', { style: 'margin-bottom:0.5rem' },
          el('strong', {}, a.was), el('br'), el('span', {}, a.warum)))),
      el('p', { style: 'margin:0.6rem 0 0;font-size:0.9rem;color:#4b5563' }, MARKE_QUELLE),
      el('p', { style: 'margin:0.6rem 0 0;font-size:0.9rem;color:#4b5563' },
        `${daten.quelle.nachgezaehlt} ${daten.zielAlsGanzes.warum}`)),
    el('section', { class: 'k-karte mab-nur-bildschirm' },
      el('p', { style: 'margin:0' }, `☎️ ${daten.elterntelefon}`)),
    datenKarte({
      schluessel: SCHLUESSEL,
      was: 'was Sie an den letzten sieben Tagen selbst getan haben – nichts über Ihr Kind, kein Name, kein Alter',
      nachLoeschen: () => { notizen = []; meldung = ''; render(); },
      knopfId: 'mab-daten-loeschen',
      // Ohne die Nur-Bildschirm-Klasse druckt die Daten-Karte mit, und ein
      // Druckblatt traegt keinen Loeschknopf (docs/02, Review Welle 80).
      klasse: 'mab-nur-bildschirm',
    }),
    el('footer', { class: 'k-fuss mab-nur-bildschirm' },
      el('span', {}, 'Werkzeug für Erwachsene · kein Bildschirm fürs Kind · keine Ampel · sieben Tage, dann weg · '),
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
  if ('speechSynthesis' in window) {
    speechSynthesis.addEventListener?.('voiceschanged', () => render(), { once: true });
  }
}
