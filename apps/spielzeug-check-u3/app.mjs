// Spielzeug-Check U3 (Eltern und Kindertagespflege).
// Praleska docs/10 (Eltern-Werkzeuge Nr. 56), Quelle S. 69-70.
//
// Der Gegenstand ist EIN SPIELZEUG. Es gibt keine Gesamtwertung: keinen
// Prozentwert, keine Ampel, kein „bestanden“ (siehe logik.mjs). Zwei Felder
// stehen bei jeder Zeile und sind Pflicht – wie man sie zu Hause prüft, und
// wo diese Prüfung endet. Politik docs/02: keine externen Anfragen; ein
// localStorage-Schlüssel, löschbar.
//
// Das Gerät ist in der Hand des Erwachsenen. Es gibt keinen Kinder-
// bildschirm und darum auch keine eltern.html.
import { el, vorlesen, lokaleStimme } from '../../packages/kinder-ui/js/komponenten.mjs';
import { datenKarte } from '../../packages/kinder-ui/js/daten-karte.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import {
  bereicheInReihenfolge, pruefungenIm, istAbhakbar, offenePunkte, dauerregeln, bericht, pruefeDaten,
} from './logik.mjs';

installiereNetzwerkWaechter();

const SCHLUESSEL = 'szu3.erledigt';
const app = document.getElementById('app');
const daten = await fetch('daten/pruefungen.json').then((r) => r.json());

// Der Stand liegt im Arbeitsspeicher; localStorage ist nur die Kopie. Ist
// der Speicher gesperrt (privater Modus, blockierte Website-Daten), tut jedes
// Antippen sonst sichtbar nichts, ohne zu sagen warum – wie in Nr. 50.
let erledigt = (() => {
  try {
    const roh = JSON.parse(localStorage.getItem(SCHLUESSEL) ?? '{}');
    return roh && typeof roh === 'object' && !Array.isArray(roh) ? roh : {};
  } catch { return {}; }
})();
let speicherSperre = false;

// Reine Anzeigezustände – im Speicher, nicht auf der Platte. Was jemand
// aufgeklappt hat, ist keine Beobachtung über ein Kind.
const offeneGrenzen = new Set();
let zeigeArten = false;
let zeigeAusschluss = false;
let zeigeNormhinweis = false;

function speichere() {
  try {
    // Bleibt nichts übrig, verschwindet der Schlüssel: sonst läge ein leeres
    // Objekt im Speicher und „löschbar“ wäre nur halb wahr (docs/02).
    if (!Object.keys(erledigt).length) localStorage.removeItem(SCHLUESSEL);
    else localStorage.setItem(SCHLUESSEL, JSON.stringify(erledigt));
    speicherSperre = false;
  } catch { speicherSperre = true; }
}

function umschalten(id) {
  const neu = { ...erledigt };
  if (neu[id]) delete neu[id]; else neu[id] = true;
  erledigt = neu;
  speichere();
  // Fokus zurück auf die eben getippte Zeile: ohne das landet er bei achtzehn
  // Zeilen nach jedem Haken auf <body>.
  render(`szu3-${id}`);
}

function vorleseKnopf(text, beschriftung = '🔊 Vorlesen') {
  const stimme = lokaleStimme('de');
  if (stimme === null) {
    return el('p', { class: 'k-hinweis szu3-nur-bildschirm', style: 'margin:0.6rem 0' },
      '🗣️ Auf diesem Gerät gibt es keine deutsche Stimme, die offline arbeitet. Vorlesen ist hier deshalb aus.');
  }
  return el('button', {
    class: 'k-knopf k-knopf--neutral k-knopf--klein szu3-nur-bildschirm',
    onclick: () => vorlesen(text, 'de-DE', stimme),
  }, beschriftung);
}

const hinweisKarte = (titel, ...absaetze) => el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
  el('p', { style: 'font-weight:700;margin-top:0' }, titel),
  ...absaetze.map((t) => el('p', { style: 'margin:0 0 0.3rem' }, t)));

/**
 * Eine Zeile. `wieZuPruefen` steht immer da – das ist der Wert dieser App.
 * Die Grenze steht einen Tipp entfernt, aber sie steht, und auf dem Papier
 * steht sie bei jeder kritischen Zeile mit.
 */
function pruefZeile(p) {
  const an = !!erledigt[p.id];
  const abhakbar = istAbhakbar(p);
  const grenzeOffen = offeneGrenzen.has(p.id);
  const geprueft = p.quelle?.geprueft === true;
  return el('div', { class: 'szu3-zeile', style: 'padding:0.6rem 0;border-top:1px solid var(--k-rand)' },
    abhakbar
      ? el('button', {
        class: `k-knopf k-knopf--klein ${an ? '' : 'k-knopf--neutral'}`,
        role: 'checkbox', 'aria-checked': String(an),
        id: `szu3-${p.id}`,
        style: 'text-align:start;width:100%;min-height:3rem',
        onclick: () => umschalten(p.id),
        // Das Häkchen-Zeichen gehört nicht aufs Papier (docs/02) – eigene
        // Klasse, damit druck.css es wegnehmen kann.
      }, el('span', { class: 'szu3-marke' }, an ? '☑ ' : '☐ '), `${p.kritisch ? '❗ ' : ''}${p.was}`)
      // Dauerregeln sind nicht abhakbar: ein Haken würde eine Regel für
      // jedes Spielen als erledigt ausgeben.
      : el('p', { style: 'margin:0;font-weight:600' }, `🔁 ${p.kritisch ? '❗ ' : ''}${p.was}`),
    el('p', { style: 'margin:0.3rem 0 0;font-size:0.9rem;color:#4b5563' }, p.warum),
    el('p', { style: 'margin:0.3rem 0 0;font-size:0.95rem' }, el('strong', {}, '🔎 So prüfst du das: '), p.wieZuPruefen),
    el('button', {
      class: 'k-knopf k-knopf--neutral k-knopf--klein szu3-nur-bildschirm',
      style: 'margin-top:0.3rem;text-align:start',
      'aria-expanded': String(grenzeOffen),
      id: `szu3-grenze-${p.id}`,
      onclick: () => {
        if (grenzeOffen) offeneGrenzen.delete(p.id); else offeneGrenzen.add(p.id);
        render(`szu3-grenze-${p.id}`);
      },
    }, grenzeOffen ? '▲ Grenze zuklappen' : '⛔ Wo diese Prüfung endet'),
    grenzeOffen
      ? el('div', { class: 'k-hinweis', style: 'margin-top:0.3rem' },
        el('p', { style: 'margin:0;font-size:0.9rem' }, p.prueferGrenze),
        el('p', { style: 'margin:0.3rem 0 0;font-size:0.8rem;color:#4b5563' },
          `${geprueft ? '📘 nachgelesen: ' : '📙 nicht nachgelesen: '}${p.quelle?.gremium ?? ''}`))
      : null,
    el('p', { style: 'margin:0.2rem 0 0;font-size:0.8rem;color:#6b7280' },
      abhakbar ? 'Einmal an diesem Spielzeug' : 'Regel für jedes Spielen'));
}

function render(fokusElement = null) {
  const offen = offenePunkte(daten, erledigt);
  const regeln = dauerregeln(daten);
  const heute = new Date().toLocaleDateString('de-DE');
  const berichtsFeld = el('textarea', {
    readonly: true,
    style: 'width:100%;min-height:12rem;font-family:monospace;font-size:0.8rem;border:2px solid var(--k-rand);border-radius:0.5rem;padding:0.5rem',
    'aria-label': 'Liste der offenen Eigenschaften',
  });
  berichtsFeld.value = bericht(daten, erledigt, heute);

  app.replaceChildren(...[
    el('div', { class: 'szu3-nur-bildschirm' },
      el('h1', { class: 'k-titel' }, '🧸 Spielzeug-Check U3'),
      el('p', { class: 'k-untertitel' }, 'Ein Blick auf EIN Spielzeug – nicht auf dein Kind')),
    el('section', { class: 'k-karte szu3-nur-bildschirm' },
      el('div', { class: 'k-hinweis' }, el('p', { style: 'margin:0;font-weight:600' }, daten.hinweis)),
      el('p', { style: 'margin:0.6rem 0 0' }, daten.keinErgebnis),
      hinweisKarte('🏷️ Keine Marke, kein Modell:', daten.keineMarken),
      hinweisKarte('🧪 Kein Wirkversprechen:', daten.keinWirkversprechen),
      hinweisKarte('🏠 Was zu Hause nicht geht:', daten.wasImHausNichtGeht),
      vorleseKnopf(`${daten.hinweis} ${daten.keinErgebnis} ${daten.wasImHausNichtGeht}`, '🔊 Das Wichtigste vorlesen')),
    ...bereicheInReihenfolge(daten).map((b) => {
      const drin = pruefungenIm(daten, b.id);
      if (!drin.length) return null;
      return el('section', { class: `k-karte szu3-block ${drin.some((p) => p.kritisch) ? 'szu3-kritisch' : ''}` },
        el('h2', { style: 'margin-top:0;font-size:1.1rem' }, `${b.zeichen} ${b.name}`),
        b.vorspann ? el('div', { class: 'k-hinweis' }, el('p', { style: 'margin:0;font-weight:600' }, b.vorspann)) : null,
        ...drin.map(pruefZeile),
        vorleseKnopf(drin.map((p) => `${p.was} ${p.warum} So prüfst du das: ${p.wieZuPruefen}`).join(' '),
          `🔊 ${b.name} vorlesen`));
    }),
    // Auf dem Papier steht die Offen-Liste als Text. Die Klickliste oben
    // trägt Häkchen-Zeichen, die auf einem Druckblatt nichts zu suchen haben
    // (docs/02) – gedruckt wird dieser Block hier. Bei den kritischen Zeilen
    // steht die Hausprüfung mit: ein Zettel, auf dem nur „kein Kleinteil“
    // steht, sagt nicht, wie man das herausfindet.
    el('section', { class: 'k-karte szu3-block szu3-nur-druck' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '📋 Spielzeug-Check U3 – offene Eigenschaften'),
      el('p', { style: 'margin:0 0 0.4rem' }, daten.keinErgebnis),
      offen.filter((p) => p.kritisch).length
        ? el('div', {},
          el('p', { style: 'margin:0 0 0.2rem;font-weight:700' }, 'Das zuerst:'),
          el('ul', { style: 'margin:0 0 0.5rem;padding-left:1.2rem' },
            ...offen.filter((p) => p.kritisch).map((p) => el('li', { style: 'margin-bottom:0.3rem' },
              el('strong', {}, p.was), el('br'),
              el('span', {}, `So prüfen: ${p.wieZuPruefen}`), el('br'),
              el('span', {}, `Grenze: ${p.prueferGrenze}`)))))
        : null,
      offen.filter((p) => !p.kritisch).length
        ? el('div', {},
          el('p', { style: 'margin:0 0 0.2rem;font-weight:700' }, 'Noch offen:'),
          el('ul', { style: 'margin:0 0 0.5rem;padding-left:1.2rem' },
            ...offen.filter((p) => !p.kritisch).map((p) => el('li', { style: 'margin-bottom:0.2rem' },
              el('strong', {}, p.was), el('br'), el('span', {}, `So prüfen: ${p.wieZuPruefen}`)))))
        : null,
      !offen.length ? el('p', { style: 'margin:0 0 0.5rem' }, 'Aus dieser Liste ist gerade nichts offen.') : null,
      el('p', { style: 'margin:0 0 0.2rem;font-weight:700' }, 'Regeln für jedes Spielen (nicht abhakbar):'),
      el('ul', { style: 'margin:0 0 0.5rem;padding-left:1.2rem' },
        ...regeln.map((p) => el('li', {}, p.was))),
      el('p', { style: 'margin:0 0 0.3rem' }, daten.nichtFertig),
      el('p', { style: 'margin:0' }, daten.keinEinkaufszettel)),
    el('section', { class: 'k-karte szu3-block szu3-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '📋 Was noch offen ist'),
      speicherSperre
        ? el('div', { class: 'k-hinweis k-hinweis--falsch' },
          el('p', { style: 'margin:0' },
            '⚠️ Dieser Browser kann gerade nichts behalten (privater Modus oder blockierte Website-Daten). '
            + 'Die Haken gelten, solange die Seite offen bleibt – druck die Liste aus, bevor du sie schließt.'))
        : null,
      // Kein Zähler über die Gesamtmenge: die Zahl sagt, wie viele Zeilen
      // offen sind, nie „x von y erledigt“.
      el('p', { style: 'margin:0 0 0.4rem' },
        offen.length
          ? `${offen.length} ${offen.length === 1 ? 'Eigenschaft ist' : 'Eigenschaften sind'} noch offen, die wichtigsten zuerst.`
          : 'Aus dieser Liste ist gerade nichts offen.'),
      el('div', { class: 'k-hinweis' }, el('p', { style: 'margin:0;font-weight:600' }, daten.nichtFertig)),
      el('p', { style: 'margin:0.5rem 0 0' }, `🧾 ${daten.keinEinkaufszettel}`),
      berichtsFeld,
      el('div', { class: 'k-antworten' },
        el('button', {
          class: 'k-knopf k-knopf--klein',
          // Die Erfolgsmeldung darf nicht unbedingt hinter einem Aufruf
          // stehen, den Optional Chaining verschluckt: ohne secure context
          // ist `navigator.clipboard` undefined (Nr. 50, gleiche Stelle).
          onclick: (ev) => {
            const knopf = ev.currentTarget;
            berichtsFeld.select();
            const melde = (text) => { knopf.textContent = text; };
            try {
              const p = navigator.clipboard?.writeText(berichtsFeld.value);
              if (!p) { melde('⚠️ Kopieren geht hier nicht – Text ist markiert'); return; }
              p.then(() => melde('✔️ Kopiert!'))
                .catch(() => melde('⚠️ Kopieren hat nicht geklappt – Text ist markiert'));
            } catch {
              melde('⚠️ Kopieren geht hier nicht – Text ist markiert');
            }
          },
        }, '📋 Liste kopieren'),
        el('button', { class: 'k-knopf k-knopf--klein', onclick: () => window.print() }, '🖨️ Liste drucken'),
        el('button', {
          class: 'k-knopf k-knopf--neutral k-knopf--klein',
          onclick: () => {
            if (globalThis.confirm?.('Alle Haken auf diesem Gerät löschen?')) {
              erledigt = {};
              speichere();
              render();
            }
          },
        }, '🧹 Haken löschen'))),
    el('section', { class: 'k-karte szu3-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🧩 Was Kinder damit tun'),
      el('p', { style: 'margin:0 0 0.4rem' }, daten.keinWirkversprechen),
      el('div', { class: 'k-antworten' },
        el('button', {
          class: 'k-knopf k-knopf--neutral k-knopf--klein', 'aria-expanded': String(zeigeArten),
          id: 'szu3-arten',
          onclick: () => { zeigeArten = !zeigeArten; render('szu3-arten'); },
        }, zeigeArten ? '▲ Liste zuklappen' : '▼ Die sechs Arten lesen')),
      zeigeArten
        ? el('div', {}, ...daten.arten.map((a) => el('div', { style: 'margin-top:0.6rem;padding-top:0.4rem;border-top:1px solid var(--k-rand)' },
          el('p', { style: 'margin:0;font-weight:700' }, a.name),
          el('p', { style: 'margin:0.2rem 0 0;font-size:0.85rem;color:#4b5563' }, `🗓️ ${a.spanne}`),
          el('p', { style: 'margin:0.2rem 0 0' }, `👶 ${a.wasKinderTun}`),
          a.selbstkorrektur ? el('p', { style: 'margin:0.2rem 0 0;font-size:0.9rem' }, `🔁 ${a.selbstkorrektur}`) : null,
          el('p', { style: 'margin:0.2rem 0 0;font-size:0.9rem' }, `⚠️ ${a.sicherheit}`),
          a.statt ? el('p', { style: 'margin:0.2rem 0 0;font-size:0.8rem;color:#6b7280' }, `ℹ️ ${a.statt}`) : null)))
        : null),
    el('section', { class: 'k-karte szu3-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🚫 Was hier nicht drinsteht – und warum'),
      el('div', { class: 'k-antworten' },
        el('button', {
          class: 'k-knopf k-knopf--neutral k-knopf--klein', 'aria-expanded': String(zeigeAusschluss),
          id: 'szu3-aus',
          onclick: () => { zeigeAusschluss = !zeigeAusschluss; render('szu3-aus'); },
        }, zeigeAusschluss ? '▲ Liste zuklappen' : '▼ Die Ausschlussliste lesen')),
      zeigeAusschluss
        ? el('ul', { style: 'margin:0.5rem 0 0;padding-left:1.2rem' },
          ...daten.ausgeschlossen.map((a) => el('li', { style: 'margin-bottom:0.5rem' },
            el('strong', {}, a.was), el('br'), el('span', {}, a.warum))))
        : null,
      el('div', { class: 'k-antworten', style: 'margin-top:0.5rem' },
        el('button', {
          class: 'k-knopf k-knopf--neutral k-knopf--klein', 'aria-expanded': String(zeigeNormhinweis),
          id: 'szu3-norm',
          onclick: () => { zeigeNormhinweis = !zeigeNormhinweis; render('szu3-norm'); },
        }, zeigeNormhinweis ? '▲ Normhinweis zuklappen' : '📘 Woher die Maße kommen')),
      zeigeNormhinweis
        ? el('div', { class: 'k-hinweis', style: 'margin-top:0.4rem' },
          el('p', { style: 'margin:0;font-size:0.9rem' }, daten.quelle.norm))
        : null),
    el('section', { class: 'k-karte szu3-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🚑 Wenn etwas passiert ist'),
      el('div', { class: 'k-hinweis k-hinweis--falsch' }, el('p', { style: 'margin:0;font-weight:600' }, daten.notfall)),
      el('p', { style: 'margin:0.5rem 0 0' }, `☎️ ${daten.elterntelefon}`)),
    datenKarte({
      schluessel: SCHLUESSEL,
      was: 'welche Zeilen du abgehakt hast – keine Angabe über dein Kind, kein Alter, kein Name',
      nachLoeschen: () => { erledigt = {}; render(); },
      knopfId: 'szu3-daten-loeschen',
    }),
    el('section', { class: 'k-karte szu3-nur-bildschirm' },
      el('p', { style: 'margin:0;font-size:0.9rem' },
        'Für den Raum statt für ein Ding: ', el('a', { href: '../sicherer-krabbelraum-check/' }, 'Sicherer-Krabbelraum-Check'),
        ' · für Spiele ohne Material: ', el('a', { href: '../bewegungs-kartei-erstes-jahr/' }, 'Bewegungs-Kartei erstes Jahr'),
        ' · für Bücher: ', el('a', { href: '../vorlese-kompass/' }, 'Vorlese-Kompass'))),
    el('footer', { class: 'k-fuss szu3-nur-bildschirm' },
      el('span', {}, 'Werkzeug für Erwachsene · kein Bildschirm fürs Kind · keine Gesamtwertung · '),
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
