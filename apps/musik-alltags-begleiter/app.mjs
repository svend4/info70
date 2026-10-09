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
  ARTEN, tagAus, fensterTage, beschneide, notizenAm, fensterSatz, bericht, pruefeDaten,
} from './logik.mjs';

installiereNetzwerkWaechter();

const SCHLUESSEL = 'mab.notizen';
const app = document.getElementById('app');
const daten = await fetch('daten/rituale.json').then((r) => r.json());

const heute = tagAus(new Date());

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
    return beschneide(JSON.parse(rohText ?? '[]'), heute, daten);
  } catch { return []; }
})();
let speicherSperre = false;

let gelegenheit = null;
let zeigeKatalog = false;
let zeigeWarumKeineAmpel = false;
let meldung = '';

function speichere() {
  // Und beim SPEICHERN noch einmal: wer die Seite über Mitternacht offen
  // hält, schreibt sonst einen achten Tag in den Speicher.
  notizen = beschneide(notizen, heute, daten);
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
  notizen = [...notizen, { tag: heute, gelegenheit, art }];
  speichere();
  const a = daten.arten.find((x) => x.id === art);
  const r = daten.rituale.find((x) => x.id === gelegenheit);
  meldung = `Notiert: ${r?.name ?? ''} – ${a?.name ?? ''}.`;
  render('mab-heute');
}

function entferne(index) {
  notizen = notizen.filter((_, i) => i !== index);
  speichere();
  meldung = 'Notiz entfernt.';
  render('mab-heute');
}

function vorleseKnopf(text, beschriftung = '🔊 Vorlesen') {
  const stimme = lokaleStimme('de');
  if (stimme === null) {
    return el('p', { class: 'k-hinweis mab-nur-bildschirm', style: 'margin:0.6rem 0' },
      '🗣️ Auf diesem Gerät gibt es keine deutsche Stimme, die offline arbeitet. Vorlesen ist hier deshalb aus.');
  }
  return el('button', {
    class: 'k-knopf k-knopf--neutral k-knopf--klein mab-nur-bildschirm',
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

function render(fokusElement = null) {
  const heuteNotizen = notizenAm(notizen, heute);
  const berichtsFeld = el('textarea', {
    readonly: true,
    style: 'width:100%;min-height:10rem;font-family:monospace;font-size:0.8rem;border:2px solid var(--k-rand);border-radius:0.5rem;padding:0.5rem',
    'aria-label': 'Rückblick über sieben Tage',
  });
  berichtsFeld.value = bericht(daten, notizen, heute);

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
          onclick: (ev) => {
            const knopf = ev.currentTarget;
            berichtsFeld.select();
            const melde = (text) => { knopf.textContent = text; };
            try {
              const p = navigator.clipboard?.writeText(berichtsFeld.value);
              if (!p) { melde('⚠️ Kopieren geht hier nicht – Text ist markiert'); return; }
              p.then(() => melde('✔️ Kopiert!')).catch(() => melde('⚠️ Kopieren hat nicht geklappt – Text ist markiert'));
            } catch { melde('⚠️ Kopieren geht hier nicht – Text ist markiert'); }
          },
        }, '📋 Rückblick kopieren'),
        el('button', { class: 'k-knopf k-knopf--klein', onclick: () => window.print() }, '🖨️ Rückblick drucken'))),
    // Auf dem Papier steht der Rückblick als Text – ohne Häkchen, ohne Farbe,
    // ohne Namenszeile (docs/02).
    el('section', { class: 'k-karte mab-block mab-nur-druck' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🎶 Musik im Alltag – sieben Tage'),
      el('p', { style: 'margin:0 0 0.4rem' }, fensterSatz(notizen, heute)),
      ...fensterTage(heute).filter((tag) => notizenAm(notizen, tag).length).map((tag) => el('div', { style: 'margin-bottom:0.3rem' },
        el('p', { style: 'margin:0;font-weight:700' }, tagText(tag)),
        el('ul', { style: 'margin:0;padding-left:1.2rem' },
          ...notizenAm(notizen, tag).map((n) => {
            const r = daten.rituale.find((x) => x.id === n.gelegenheit);
            const a = daten.arten.find((x) => x.id === n.art);
            return el('li', {}, `${r?.name ?? ''} – ${a?.name ?? ''}`);
          })))),
      el('p', { style: 'margin:0.4rem 0 0' }, daten.keinZiel),
      el('p', { style: 'margin:0.3rem 0 0' }, daten.keineReaktion)),
    el('section', { class: 'k-karte mab-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '📋 Zehn Gelegenheiten im Tag'),
      el('p', { style: 'margin:0 0 0.4rem;font-size:0.95rem' },
        'Keine Aufgabenliste – eine Sammlung von Stellen, an denen Musik ohnehin hineinpasst.'),
      el('div', { class: 'k-antworten' },
        el('button', {
          class: 'k-knopf k-knopf--neutral k-knopf--klein', 'aria-expanded': String(zeigeKatalog),
          id: 'mab-katalog',
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
      el('p', { style: 'margin:0.6rem 0 0;font-size:0.9rem;color:#4b5563' },
        `${daten.quelle.nachgezaehlt} ${daten.zielAlsGanzes.warum}`)),
    el('section', { class: 'k-karte mab-nur-bildschirm' },
      el('p', { style: 'margin:0' }, `☎️ ${daten.elterntelefon}`)),
    datenKarte({
      schluessel: SCHLUESSEL,
      was: 'was Sie an den letzten sieben Tagen selbst getan haben – nichts über Ihr Kind, kein Name, kein Alter',
      nachLoeschen: () => { notizen = []; meldung = ''; render(); },
      knopfId: 'mab-daten-loeschen',
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
}
