// Musikmomente 1-3 (Praleska docs/10, Eltern-Werkzeuge Nr. 55, Quelle S. 78-80).
//
// Das Gerät ist in der Hand des Erwachsenen; das Kind sieht keinen
// Bildschirm und hört Musik aus dem Raum. Die App liefert KEIN Audio: sie
// nennt Werke, nach denen Erwachsene selbst suchen - in der Bibliothek, im
// Rundfunk, in der eigenen Sammlung. Darum gibt es hier auch keine
// Oszillatoren wie in `apps/musik-detektive` und `apps/klang-detektive`;
// die beiden synthetisieren Muster, diese App nennt Musik.
//
// Sie fragt NICHTS ab (das ist `apps/musik-detektive` ab 4 und
// `apps/klang-detektive` ab 3) und sie zählt NICHTS mit: kein Haken, keine
// Ampel, keine Tagesstatistik, kein localStorage-Schlüssel. Ein
// Hör-Ritual zu protokollieren wäre ein Protokoll über ein Kind.
// Politik docs/02: keine externen Anfragen.
import { el, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import {
  FILTER, istGemeinfrei, freiAbSatz, werkVon, werkZeile, massgeblicheTodesjahre,
  werkeZumMoment, momenteFuer, vorleseText, pruefeDaten,
} from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const daten = await fetch('daten/musik.json').then((r) => r.json());

// Der einzige Zustand ist die aktuelle Auswahl - im Speicher, nicht auf der
// Platte. Nach dem Schließen ist nichts übrig.
let band = null;
let zeigeQuelle = false;

/**
 * Vorlesen nur mit einer Stimme, die auf dem Gerät liegt. `vorlesen()` aus
 * kinder-ui wählt keine Stimme aus, und Web-Speech-Stimmen sind nicht
 * garantiert geräteintern - auf vielen Geräten sind sie netzbasiert, und
 * der NetzwerkWaechter patcht nur fetch, XMLHttpRequest und WebSocket.
 */
function lokaleStimme() {
  if (!('speechSynthesis' in globalThis)) return null;
  const stimmen = speechSynthesis.getVoices?.() ?? [];
  if (!stimmen.length) return undefined; // noch nicht geladen - der Knopf darf es versuchen
  return stimmen.find((s) => s.localService && String(s.lang ?? '').toLowerCase().startsWith('de')) ?? null;
}

function vorleseKnopf(text, beschriftung = '🔊 Vorlesen') {
  if (lokaleStimme() === null) {
    return el('p', { class: 'k-hinweis mm-nur-bildschirm', style: 'margin:0.6rem 0' },
      '🗣️ Auf diesem Gerät gibt es keine deutsche Stimme, die offline arbeitet. Vorlesen ist hier deshalb aus.');
  }
  return el('button', {
    class: 'k-knopf k-knopf--neutral mm-nur-bildschirm',
    onclick: () => vorlesen(text),
  }, beschriftung);
}

const hinweisKarte = (titel, ...absaetze) => el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
  el('p', { style: 'font-weight:700;margin-top:0' }, titel),
  ...absaetze.map((t) => el('p', { style: 'margin:0 0 0.3rem' }, t)));

/** Ein Werk als Zeile, mit der Hinhörhilfe und - falls nötig - der Zuschreibung. */
function werkKnoten(w) {
  return el('li', { style: 'margin-bottom:0.45rem' },
    el('span', { style: 'font-weight:600' }, werkZeile(w)),
    // Der Originaltitel wird ANGEZEIGT, nie vorgelesen: ohne passende
    // Gerätestimme liest eine deutsche Stimme kyrillische Schrift vor.
    w.original ? el('span', { style: 'color:#4b5563' }, ` · ${w.original}`) : null,
    el('br'),
    el('span', { style: 'font-size:0.95rem' }, w.woran),
    w.zuschreibung
      ? el('div', { class: 'k-hinweis', style: 'margin:0.3rem 0 0' },
        el('p', { style: 'margin:0;font-size:0.9rem' }, `📎 ${w.zuschreibung}`))
      : null);
}

function momentKnoten(m) {
  const werke = werkeZumMoment(daten, m.id);
  return el('section', { class: 'k-karte mm-karte' },
    el('h2', { style: 'margin-top:0;font-size:1.1rem' }, m.titel),
    el('p', { style: 'margin:0 0 0.4rem;font-size:0.85rem;color:#4b5563' }, `Für ${m.altersband} Jahre`),
    el('p', { style: 'font-weight:700;margin:0 0 0.2rem' }, '🫱 Was du tust:'),
    el('ul', { style: 'margin:0 0 0.5rem;padding-left:1.2rem' },
      ...m.wasDuTust.map((s) => el('li', { style: 'margin-bottom:0.2rem' }, s))),
    el('p', { style: 'margin:0 0 0.5rem' }, `👶 ${m.wasDeinKindVielleichtTut}`),
    werke.length
      ? el('div', {},
        el('p', { style: 'font-weight:700;margin:0 0 0.2rem' }, '🎼 Dazu passt:'),
        el('ul', { style: 'margin:0 0 0.5rem;padding-left:1.2rem' }, ...werke.map(werkKnoten)))
      : null,
    m.sicherheit
      ? el('div', { class: 'k-hinweis mm-sicherheit', style: 'margin:0 0 0.4rem' },
        el('p', { style: 'margin:0' }, `⚠️ ${m.sicherheit}`))
      : null,
    el('p', { style: 'margin:0;font-size:0.95rem' }, `✋ Aufhören: ${m.abbruchzeichen}`),
    vorleseKnopf(vorleseText(daten, m.id), '🔊 Diesen Moment vorlesen'));
}

function kontrastKnoten(k) {
  const [a, b] = k.paar.map((id) => werkVon(daten, id));
  return el('section', { class: 'k-karte mm-karte' },
    el('h2', { style: 'margin-top:0;font-size:1.05rem' }, `${k.eigenschaft}`),
    el('ul', { style: 'margin:0 0 0.4rem;padding-left:1.2rem' }, werkKnoten(a), werkKnoten(b)),
    el('p', { style: 'margin:0 0 0.3rem' }, `👂 ${k.wasDuBemerkst}`),
    el('p', { style: 'margin:0' }, `🤲 ${k.ohneWorte}`));
}

function render() {
  const momente = band ? momenteFuer(daten, band) : [];
  const alleWerke = daten.werke ?? [];

  if (!band) {
    app.replaceChildren(...[
      el('h1', { class: 'k-titel' }, '🎵 Musikmomente · 1 bis 3'),
      el('p', { class: 'k-untertitel' }, 'Gemeinsam hören – ohne Bildschirm, ohne Abfrage'),
      el('section', { class: 'k-karte' },
        el('div', { class: 'k-hinweis' }, el('p', { style: 'margin:0;font-weight:600' }, daten.hinweis)),
        hinweisKarte('🎯 Was diese Seite nicht verspricht:', daten.keinVersprechen),
        hinweisKarte('🙂 Hier wird nichts abgefragt:', daten.keinQuiz),
        hinweisKarte('🔈 Leise ist richtig:', daten.lautstaerke),
        hinweisKarte('✋ Aufhören ist die Regel:', daten.abbruch),
        vorleseKnopf(`${daten.hinweis} ${daten.keinVersprechen} ${daten.keinQuiz} ${daten.lautstaerke} ${daten.abbruch}`,
          '🔊 Das Wichtigste vorlesen')),
      el('section', { class: 'k-karte' },
        el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '👶 Wie alt ist dein Kind?'),
        el('p', { style: 'margin:0 0 0.4rem;font-size:0.95rem' },
          'Das ist nur ein Filter für die Vorschläge. Es wird nichts erwartet und nichts bewertet.'),
        el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Altersband wählen' },
          ...FILTER.map((f) => el('button', {
            class: 'k-knopf', style: 'min-height:3.4rem;text-align:start',
            onclick: () => { band = f; render(); },
          }, f === 'alle' ? 'Alles zeigen' : `${f} Jahre`)))),
      el('footer', { class: 'k-fuss' },
        el('span', {}, 'Werkzeug für Erwachsene · kein Bildschirm fürs Kind · speichert nichts · '),
        el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')),
    ].filter(Boolean));
    return;
  }

  app.replaceChildren(...[
    el('div', { class: 'mm-kopf' },
      el('h1', { class: 'k-titel' }, '🎵 Musikmomente · 1 bis 3'),
      el('p', { class: 'k-untertitel' }, band === 'alle' ? 'Alle Momente' : `Momente für ${band} Jahre`)),

    // Auf dem Papier muss das Tragende mitkommen: die Druckseite wird ohne
    // das Vorwort gedruckt, und dann fehlten Lautstaerke und Abbruch ganz.
    el('section', { class: 'k-karte mm-karte mm-nur-druck' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '⚠️ Gilt für jeden Moment'),
      el('p', { style: 'margin:0' }, daten.lautstaerke),
      el('p', { style: 'margin:0.3rem 0 0' }, daten.abbruch),
      el('p', { style: 'margin:0.3rem 0 0' }, daten.keineAufnahme)),

    el('p', { class: 'k-untertitel mm-nur-bildschirm', style: 'margin-bottom:0.2rem' },
      `${momente.length} ${momente.length === 1 ? 'Moment' : 'Momente'}`),
    ...momente.map(momentKnoten),

    el('section', { class: 'k-karte mm-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🔁 Zwei Stücke nebeneinander'),
      el('p', { style: 'margin:0 0 0.5rem' },
        'Ein Unterschied wird hörbar, wenn er neben seinem Gegenteil steht. '
        + 'Machen Sie zu jedem Stück immer dieselbe Bewegung – dann trägt der Körper den Unterschied, nicht das Wort.')),
    ...daten.kontraste.map(kontrastKnoten),

    el('section', { class: 'k-karte mm-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🥁 Zwei Instrumente, weit auseinander'),
      el('p', { style: 'margin:0 0 0.5rem' },
        'Die Quelle beginnt mit Paaren, deren Abstand so groß ist, dass ein Einjähriger ihn hört.'),
      ...daten.instrumentenPaare.map((p) => el('div', { style: 'padding:0.4rem 0;border-top:1px solid var(--k-rand)' },
        el('p', { style: 'margin:0;font-weight:600' }, `${p.hoch} ↔ ${p.tief}`),
        el('p', { style: 'margin:0.15rem 0 0;font-size:0.95rem' }, p.warum),
        el('div', { class: 'k-hinweis mm-sicherheit', style: 'margin:0.3rem 0 0' },
          el('p', { style: 'margin:0;font-size:0.9rem' }, `⚠️ ${p.sicherheit}`))))),

    el('section', { class: 'k-karte mm-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🔎 Wenn Sie das sehen, können Sie weitergehen'),
      el('p', { style: 'margin:0 0 0.5rem;font-size:0.95rem' },
        'Keine Stufen und keine Einteilung: jede Vertiefung hängt an einer Handlung, die Sie gerade beobachtet haben.'),
      ...daten.vertiefungen.map((v) => el('div', { style: 'padding:0.4rem 0;border-top:1px solid var(--k-rand)' },
        el('p', { style: 'margin:0;font-weight:600' }, `👀 ${v.wennDuSiehst}`),
        el('p', { style: 'margin:0.15rem 0 0' }, `➡️ ${v.dannProbiere}`),
        el('p', { style: 'margin:0.15rem 0 0;font-size:0.9rem;color:#4b5563' }, `🚫 ${v.nichtAls}`)))),

    el('section', { class: 'k-karte mm-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '📜 Alle Stücke, und warum sie hier stehen dürfen'),
      el('p', { style: 'margin:0 0 0.4rem' }, daten.stand.regel),
      el('p', { style: 'margin:0 0 0.4rem;font-weight:600' }, freiAbSatz(daten)),
      el('ul', { style: 'margin:0 0 0.5rem;padding-left:1.2rem' },
        ...alleWerke.map((w) => el('li', { style: 'margin-bottom:0.3rem' },
          el('span', { style: 'font-weight:600' }, werkZeile(w)),
          el('span', { style: 'font-size:0.9rem;color:#4b5563' },
            w.art === 'komposition' ? ` · gestorben ${w.todesjahr}`
              : w.art === 'unbekannter-urheber' ? ` · erschienen ${w.erscheinungsjahr}`
                : ' · Volksweise ohne benannten Satz'),
          // Bei einem Lied zaehlt der Laengstlebende von Komponist und
          // Textdichter (§ 65 Abs. 3 UrhG) - darum steht der Text mit da.
          typeof w.textlage === 'object'
            ? el('span', { style: 'font-size:0.9rem;color:#4b5563' },
              ` · Text: ${w.textlage.dichter}, gestorben ${w.textlage.todesjahr}`)
            : w.textlage === 'volksgut'
              ? el('span', { style: 'font-size:0.9rem;color:#4b5563' }, ' · Text: Volksgut')
              : null,
          el('span', { style: 'font-size:0.9rem;color:#4b5563' },
            ` · maßgeblich ${massgeblicheTodesjahre(w).length ? Math.max(...massgeblicheTodesjahre(w)) : '–'}`),
          // Die Angabe wird GERECHNET. Ein Werk, das die App nicht als frei
          // ausrechnen kann, laedt gar nicht erst (siehe pruefeDaten).
          el('span', { style: 'font-size:0.9rem' }, istGemeinfrei(w, daten) ? ' · gemeinfrei ✔️' : ' · NICHT frei ❌')))),
      el('div', { class: 'k-hinweis' }, el('p', { style: 'margin:0' }, `💿 ${daten.keineAufnahme}`)),
      el('p', { style: 'margin:0.4rem 0 0;font-size:0.95rem' }, `🛒 ${daten.keineEmpfehlung}`)),

    el('section', { class: 'k-karte mm-nur-bildschirm' },
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: () => window.print() }, '🖨️ Diese Seite drucken'),
        el('button', {
          class: 'k-knopf k-knopf--neutral',
          'aria-expanded': String(zeigeQuelle),
          onclick: () => { zeigeQuelle = !zeigeQuelle; render(); },
        }, zeigeQuelle ? '📖 Quelle zuklappen' : '📖 Was aus der Quelle wurde'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => { band = null; render(); } }, '↩️ Anderes Alter'))),

    zeigeQuelle
      ? el('section', { class: 'k-karte mm-nur-bildschirm' },
        el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '📖 Was aus der Quelle wurde'),
        el('p', { style: 'margin:0 0 0.4rem;font-size:0.95rem' }, daten.quelle.werk),
        el('p', { style: 'margin:0 0 0.4rem;font-size:0.95rem' }, daten.quelle.rechte),
        el('p', { style: 'margin:0 0 0.4rem;font-size:0.95rem' }, daten.quelle.nachgezaehlt),
        el('p', { style: 'margin:0 0 0.2rem;font-weight:600' },
          `Von ${daten.quelle.zahlen.zieleQuelle} Zielen sind ${daten.quelle.zahlen.zieleUebernommen} übernommen, `
          + `${daten.quelle.zahlen.zieleNichtUebernommen} nicht. `
          + `Von ${daten.quelle.zahlen.repertoireQuelle} Stücken stehen ${daten.quelle.zahlen.repertoireUebernommen} hier.`),
        el('ul', { style: 'margin:0 0 0.5rem;padding-left:1.2rem' },
          ...daten.ziele.map((z) => el('li', { style: 'margin-bottom:0.25rem' },
            el('span', {}, z.uebernommen ? '✔️ ' : '✖️ '),
            el('span', {}, z.was),
            z.anmerkung ? el('span', { style: 'font-size:0.9rem;color:#4b5563' }, ` – ${z.anmerkung}`) : null,
            z.warum ? el('span', { style: 'font-size:0.9rem;color:#4b5563' }, ` – ${z.warum}`) : null))),
        el('div', { class: 'k-hinweis' }, el('p', { style: 'margin:0' }, `Ё ${daten.quelleAnmerkung}`)))
      : null,

    el('section', { class: 'k-karte mm-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🧭 Was woanders besser steht'),
      el('ul', { style: 'margin:0;padding-left:1.2rem' },
        el('li', {}, 'Selbst singen und Reime sammeln: ', el('a', { href: '../familienschatz-reime/' }, 'Familienschatz Reime')),
        el('li', {}, 'Bewegung zur Musik, ab einem Jahr: ', el('a', { href: '../bewegungs-schatzkiste/' }, 'Bewegungs-Schatzkiste')),
        el('li', {}, 'Ab 3 selbst heraushören, was hoch und was leise ist: ', el('a', { href: '../klang-detektive/' }, 'Klang-Detektive')),
        el('li', {}, 'Ab 4 gemeinsam: Lied, Marsch oder Tanz? ', el('a', { href: '../musik-detektive/' }, 'Musik-Detektive')),
        el('li', {}, 'Später, ab 5: ', el('a', { href: '../tonleiter-treppe/' }, 'Tonleiter-Treppe'), ' und ', el('a', { href: '../rhythmus-orchester/' }, 'Rhythmus-Orchester')))),

    el('footer', { class: 'k-fuss mm-nur-bildschirm' },
      el('span', {}, 'Werkzeug für Erwachsene · kein Bildschirm fürs Kind · speichert nichts · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')),
  ].filter(Boolean));
}

const fehler = pruefeDaten(daten);
if (fehler.length) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' },
    el('p', { style: 'margin:0' }, `Datenfehler: ${fehler[0]}`)));
} else {
  render();
  // Stimmen kommen in Chromium erst asynchron - einmal neu zeichnen, wenn
  // sie da sind, sonst steht der Hinweis „keine Stimme" dauerhaft falsch.
  if ('speechSynthesis' in globalThis) {
    speechSynthesis.addEventListener?.('voiceschanged', () => render(), { once: true });
  }
}
