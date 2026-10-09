// Puste- und Lauschspiel-Kartei (Praleska docs/10, Eltern-Werkzeuge Nr. 53).
//
// Das Gerät ist in der Hand des Erwachsenen; das Kind sieht keinen
// Bildschirm. Die Kartei VERSPRICHT KEINE BESSERE AUSSPRACHE - das ist der
// tragende Unterschied zur Vorlage, und der Grund steht in logik.mjs.
//
// Kein Quiz: „Rate mal, wer gerufen hat" ist ein Spiel. Zum
// Selber-Heraushören gibt es apps/klang-detektive (ab 3), die
// Alltags-Sprachimpulse liegen in apps/sprachbruecken-impulskarten.
//
// Die App speichert NICHTS: kein Haken, kein Filter, kein
// localStorage-Schlüssel. Politik docs/02: keine externen Anfragen.
import { el, vorlesen, lokaleStimme } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { REGISTER, spieleIm, spielText, pruefeDaten } from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const daten = await fetch('daten/kartei.json').then((r) => r.json());

// Der einzige Zustand ist die Auswahl - im Speicher, nicht auf der Platte.
let register = null;
let zeigeAusschluss = false;

const BESCHRIFTUNG = {
  pustespiel: '🌬️ Pustespiele',
  lautspiel: '🗣️ Spiele mit Lauten',
  lauschspiel: '👂 Lauschspiele',
};
const UNTERTITEL = {
  pustespiel: 'Schön – und ohne Wirkung aufs Sprechen',
  lautspiel: 'Hier ist Sprache drin',
  lauschspiel: 'Hinhören, nicht abfragen',
};


function vorleseKnopf(text, beschriftung = '🔊 Vorlesen') {
  const stimme = lokaleStimme('de');
  if (stimme === null) {
    return el('p', { class: 'k-hinweis plk-nur-bildschirm', style: 'margin:0.6rem 0' },
      '🗣️ Auf diesem Gerät gibt es keine deutsche Stimme, die offline arbeitet. Vorlesen ist hier deshalb aus.');
  }
  return el('button', { class: 'k-knopf k-knopf--neutral plk-nur-bildschirm', onclick: () => vorlesen(text, 'de-DE', stimme) }, beschriftung);
}

const hinweisKarte = (titel, ...absaetze) => el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
  el('p', { style: 'font-weight:700;margin-top:0' }, titel),
  ...absaetze.map((t) => el('p', { style: 'margin:0 0 0.3rem' }, t)));

function spielKarte(s) {
  return el('section', { class: 'k-karte plk-karte' },
    el('h2', { style: 'margin-top:0;font-size:1.1rem' }, s.titel),
    el('p', { style: 'margin:0 0 0.4rem;font-size:0.9rem;color:#4b5563' }, `🧺 ${s.material}`),
    el('p', { style: 'font-weight:700;margin:0 0 0.2rem' }, 'So geht es:'),
    el('ol', { style: 'margin:0 0 0.5rem;padding-left:1.2rem' },
      ...s.soGehts.map((x) => el('li', { style: 'margin-bottom:0.2rem' }, x))),
    // Der Satz, ohne den eine Pustekarte nicht ausdrückbar ist.
    s.keinTraining
      ? el('div', { class: 'k-hinweis plk-dementi', style: 'margin:0 0 0.4rem' },
        el('p', { style: 'margin:0' }, `🚫 ${s.keinTraining}`))
      : null,
    s.warumSprache
      ? el('div', { class: 'k-hinweis', style: 'margin:0 0 0.4rem' },
        el('p', { style: 'margin:0' }, `🗣️ ${s.warumSprache}`))
      : null,
    s.keinRaten
      ? el('div', { class: 'k-hinweis', style: 'margin:0 0 0.4rem' },
        el('p', { style: 'margin:0' }, `🙂 ${s.keinRaten}`))
      : null,
    el('div', { class: 'k-hinweis plk-sicherheit', style: 'margin:0 0 0.4rem' },
      el('p', { style: 'margin:0' }, `⚠️ ${s.sicherheit}`)),
    el('p', { style: 'margin:0;font-size:0.95rem' }, `✋ Aufhören: ${s.abbruchzeichen}`),
    vorleseKnopf(spielText(s), '🔊 Diese Karte vorlesen'));
}

function render() {
  const liste = register ? spieleIm(daten, register) : [];

  app.replaceChildren(...[
    el('div', { class: 'plk-kopf' },
      el('h1', { class: 'k-titel' }, '🫧 Puste- und Lauschspiele'),
      el('p', { class: 'k-untertitel' }, 'Spiele für zwei- und dreijährige Kinder – ohne Übungsversprechen')),

    el('section', { class: 'k-karte plk-nur-bildschirm' },
      el('div', { class: 'k-hinweis' }, el('p', { style: 'margin:0;font-weight:600' }, daten.hinweis)),
      hinweisKarte('🚫 Was diese Kartei nicht verspricht:', daten.keinTrainingsversprechen),
      hinweisKarte('🫶 Was bleibt:', daten.wasBleibt),
      hinweisKarte('🙂 Hier wird nichts abgefragt:', daten.keinQuiz),
      hinweisKarte('✋ Aufhören ist die Regel:', daten.abbruch),
      hinweisKarte('🩺 Wenn Sie sich Sorgen machen:', daten.wennSorge),
      hinweisKarte('🌍 Nur auf Deutsch:', daten.keineUebersetzung),
      vorleseKnopf(`${daten.hinweis} ${daten.keinTrainingsversprechen} ${daten.wasBleibt} ${daten.keinQuiz} ${daten.abbruch} ${daten.wennSorge}`,
        '🔊 Das Wichtigste vorlesen')),

    el('section', { class: 'k-karte plk-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🎲 Was möchten Sie spielen?'),
      el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Art des Spiels wählen' },
        ...REGISTER.map((r) => el('button', {
          class: `k-knopf ${r === register ? '' : 'k-knopf--neutral'}`,
          style: 'min-height:3.6rem;text-align:start',
          'aria-pressed': String(r === register),
          onclick: () => { register = r; render(); },
        }, `${BESCHRIFTUNG[r]} – ${UNTERTITEL[r]}`)))),

    register
      ? el('div', {},
        el('p', { class: 'k-untertitel plk-nur-bildschirm', style: 'margin-bottom:0.2rem' },
          `${BESCHRIFTUNG[register]}: ${UNTERTITEL[register]}`),
        // Auf dem Papier muss das Tragende mitkommen: das Vorwort wird nicht
        // mitgedruckt, und ohne diesen Block fehlte die ganze Einordnung.
        el('section', { class: 'k-karte plk-karte plk-nur-druck' },
          el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '⚠️ Gilt für jede Karte'),
          el('p', { style: 'margin:0' }, daten.keinTrainingsversprechen),
          el('p', { style: 'margin:0.3rem 0 0' }, daten.abbruch),
          el('p', { style: 'margin:0.3rem 0 0' }, daten.wennSorge)),
        register === 'pustespiel'
          ? el('section', { class: 'k-karte plk-karte' },
            el('h2', { style: 'margin-top:0;font-size:1.05rem' }, daten.pusteRegister.titel),
            el('p', { style: 'margin:0' }, daten.pusteRegister.text))
          : null,
        register === 'lauschspiel'
          ? el('section', { class: 'k-karte plk-karte' },
            el('p', { style: 'margin:0' }, `🔈 ${daten.lautstaerke}`))
          : null,
        ...liste.map(spielKarte),
        el('section', { class: 'k-karte plk-nur-bildschirm' },
          el('div', { class: 'k-antworten' },
            el('button', { class: 'k-knopf', onclick: () => window.print() }, '🖨️ Diese Karten drucken'),
            el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => { register = null; render(); } }, '↩️ Andere Art'))))
      : null,

    el('section', { class: 'k-karte plk-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, daten.lauterwerb.titel),
      el('p', { style: 'margin:0 0 0.5rem' }, daten.lauterwerb.hinweis),
      el('p', { style: 'margin:0 0 0.5rem' }, daten.mehrsprachig),
      el('ul', { style: 'margin:0 0 0.5rem;padding-left:1.2rem' },
        el('li', {}, el('strong', {}, 'Früh: '), daten.lauterwerb.frueh),
        el('li', {}, el('strong', {}, 'Später: '), daten.lauterwerb.spaeter),
        el('li', {}, el('strong', {}, 'Spät: '), daten.lauterwerb.spaet),
        el('li', {}, daten.lauterwerb.verbindungen)),
      el('div', { class: 'k-hinweis' }, el('p', { style: 'margin:0;font-weight:600' }, daten.lauterwerb.keinZiel))),

    el('section', { class: 'k-karte plk-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '😌 Was in diesem Alter normal ist'),
      el('p', { style: 'margin:0 0 0.5rem;font-size:0.95rem' },
        'Wenn Ihr Kind so spricht, ist nichts zu tun. Das verschwindet von selbst.'),
      ...daten.physiologisch.map((p) => el('div', { style: 'padding:0.4rem 0;border-top:1px solid var(--k-rand)' },
        el('p', { style: 'margin:0;font-weight:600' }, p.was),
        el('p', { style: 'margin:0.1rem 0 0;font-size:0.95rem' }, `z. B. ${p.beispiel}`),
        el('p', { style: 'margin:0.1rem 0 0;font-size:0.9rem;color:#4b5563' }, `${p.satz} Noch normal bis ${p.normalBis}.`)))),

    el('section', { class: 'k-karte plk-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🚫 Was hier nicht drinsteht – und warum'),
      el('button', {
        class: 'k-knopf k-knopf--neutral',
        'aria-expanded': String(zeigeAusschluss),
        onclick: () => { zeigeAusschluss = !zeigeAusschluss; render(); },
      }, zeigeAusschluss ? 'Liste zuklappen' : 'Die Ausschlussliste lesen'),
      zeigeAusschluss
        ? el('div', { style: 'margin-top:0.6rem' },
          ...daten.ausgeschlossen.map((a) => el('div', { style: 'padding:0.4rem 0;border-top:1px solid var(--k-rand)' },
            el('p', { style: 'margin:0;font-weight:600' }, `✖️ ${a.was}`),
            el('p', { style: 'margin:0.1rem 0 0;font-size:0.95rem' }, a.warum))),
          el('p', { style: 'margin:0.6rem 0 0;font-size:0.9rem;color:#4b5563' },
            `${daten.quelle.werk} · ${daten.quelle.rechte}`),
          el('p', { style: 'margin:0.2rem 0 0;font-size:0.9rem;color:#4b5563' }, daten.quelle.nachgezaehlt),
          el('p', { style: 'margin:0.2rem 0 0;font-size:0.9rem;color:#4b5563' }, daten.quelle.abweichung))
        : null),

    el('section', { class: 'k-karte plk-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🧭 Was woanders besser steht'),
      el('ul', { style: 'margin:0;padding-left:1.2rem' },
        el('li', {}, 'Gesprächsanlässe im Alltag, dreisprachig und zum Aufhängen: ',
          el('a', { href: '../sprachbruecken-impulskarten/' }, 'Sprachbrücken-Impulskarten')),
        el('li', {}, 'Was Ihr Kind sagt, aufschreiben: ',
          el('a', { href: '../erste-woerter-tagebuch/' }, 'Erste-Wörter-Tagebuch')),
        el('li', {}, 'Für das erste Lebensjahr: ',
          el('a', { href: '../sprich-mit-mir/' }, 'Sprich mit mir')),
        el('li', {}, 'Ab drei selbst heraushören, was hoch und was leise ist: ',
          el('a', { href: '../klang-detektive/' }, 'Klang-Detektive')),
        el('li', {}, 'Dieselbe Bedienung für Bewegung: ',
          el('a', { href: '../bewegungs-schatzkiste/' }, 'Bewegungs-Schatzkiste')))),

    el('footer', { class: 'k-fuss plk-nur-bildschirm' },
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
  if ('speechSynthesis' in globalThis) {
    speechSynthesis.addEventListener?.('voiceschanged', () => render(), { once: true });
  }
}
