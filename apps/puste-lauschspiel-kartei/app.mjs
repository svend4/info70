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
// Die App speichert NICHTS: kein Haken, kein Filter, kein Eintrag im
// Browser-Speicher. Politik docs/02: keine externen Anfragen.
//
// Druck: jede Karte ist ein Blatt. Was nur auf dem Bildschirm steht, trägt
// die Klasse plk-nur-bildschirm; Emojis gehen nur über bild() und nur dort.
import { el, vorlesen, lokaleStimme } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import daten from './daten/kartei.json' with { type: 'json' };
import { REGISTER, REGISTER_NAME, spieleIm, spielText, druckBlock, pruefeDaten } from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');

// Der einzige Zustand ist die Auswahl - im Speicher, nicht auf der Platte.
let register = null;
let zeigeAusschluss = false;
// Kennung, die nach dem nächsten Aufbau den Fokus bekommt (Bildschirmwechsel).
let fokusNach = null;

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

// Ein Zeichen für den Bildschirm. Im Druck fehlt es.
const bild = (zeichen) => el('span', { class: 'plk-nur-bildschirm' }, `${zeichen} `);

function vorleseKnopf(text, beschriftung = 'Vorlesen', kennung = 'vorlesen') {
  const stimme = lokaleStimme('de');
  if (stimme === null) {
    return el('p', { class: 'k-hinweis plk-nur-bildschirm', style: 'margin:0.6rem 0' },
      bild('🗣️'), 'Auf diesem Gerät gibt es keine deutsche Stimme, die offline arbeitet. Vorlesen ist hier deshalb aus.');
  }
  return el('button', {
    class: 'k-knopf k-knopf--neutral plk-nur-bildschirm',
    'data-kennung': kennung,
    onclick: () => vorlesen(text, 'de-DE', stimme),
  }, bild('🔊'), beschriftung);
}

const hinweisKarte = (titel, text) => el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
  el('p', { style: 'font-weight:700;margin-top:0' }, titel),
  el('p', { style: 'margin:0 0 0.3rem' }, text));

// Eine Zeile auf der Karte: auf dem Bildschirm mit Zeichen, auf dem Blatt ohne.
const zeile = (klasse, zeichen, text) => el('div', { class: `k-hinweis ${klasse}`, style: 'margin:0 0 0.4rem' },
  el('p', { style: 'margin:0' }, bild(zeichen), text));

function spielKarte(s) {
  return el('section', { class: 'k-karte plk-karte' },
    el('p', { style: 'margin:0 0 0.2rem;font-size:0.85rem;color:#4b5563' },
      `Register: ${REGISTER_NAME[s.register]} (Eigenentwurf)`),
    el('h2', { style: 'margin-top:0;font-size:1.1rem' }, s.titel),
    el('p', { style: 'margin:0 0 0.4rem;font-size:0.9rem;color:#4b5563' },
      bild('🧺'), `Dafür brauchst du: ${s.material}`),
    el('p', { style: 'font-weight:700;margin:0 0 0.2rem' }, 'So geht es:'),
    el('ol', { style: 'margin:0 0 0.5rem;padding-left:1.2rem' },
      ...s.soGehts.map((x) => el('li', { style: 'margin-bottom:0.2rem' }, x))),
    // Der Satz, ohne den eine Pustekarte nicht ausdrückbar ist.
    s.keinTraining ? zeile('plk-dementi', '🚫', s.keinTraining) : null,
    s.warumSprache ? zeile('', '🗣️', s.warumSprache) : null,
    s.keinRaten ? zeile('', '🙂', s.keinRaten) : null,
    zeile('plk-sicherheit', '⚠️', `Sicherheit: ${s.sicherheit}`),
    el('p', { style: 'margin:0 0 0.4rem;font-size:0.95rem' }, bild('✋'), `Aufhören: ${s.abbruchzeichen}`),
    // Auf dem Blatt: was für jede Karte gilt. Das Vorwort wird nicht mitgedruckt.
    el('div', { class: 'plk-nur-druck' },
      ...druckBlock(daten, s.register).map((t) => el('p', { style: 'margin:0.3rem 0 0' }, t))),
    vorleseKnopf(spielText(s), 'Diese Karte vorlesen', `vorlesen-${s.id}`));
}

// Der Fokus bleibt auf dem Knopf, den man gedrückt hat. Verschwindet er,
// weil der Bildschirm wechselt, steht er auf der Überschrift des neuen Teils.
function fokussiere(kennung) {
  if (kennung) document.querySelector(`[data-kennung="${kennung}"]`)?.focus();
}

function render() {
  const merke = document.activeElement?.dataset?.kennung;
  const liste = register ? spieleIm(daten, register) : [];

  app.replaceChildren(...[
    el('div', { class: 'plk-kopf plk-nur-bildschirm' },
      el('h1', { class: 'k-titel' }, bild('🫧'), 'Puste- und Lauschspiele'),
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
        'Das Wichtigste vorlesen', 'vorlesen-hinweis')),

    el('section', { class: 'k-karte plk-nur-bildschirm' },
      el('h2', { 'data-kennung': 'auswahl-titel', tabindex: '-1', style: 'margin-top:0;font-size:1.1rem' },
        bild('🎲'), 'Was möchten Sie spielen?'),
      el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Art des Spiels wählen' },
        ...REGISTER.map((r) => el('button', {
          class: `k-knopf ${r === register ? '' : 'k-knopf--neutral'}`,
          style: 'min-height:3.6rem;text-align:start',
          'data-kennung': `reg-${r}`,
          'aria-pressed': String(r === register),
          onclick: () => { register = r; render(); },
        }, `${BESCHRIFTUNG[r]} – ${UNTERTITEL[r]}`)))),

    register
      ? el('div', {},
        el('p', { class: 'k-untertitel plk-nur-bildschirm', style: 'margin-bottom:0.2rem' },
          `${BESCHRIFTUNG[register]}: ${UNTERTITEL[register]}`),
        ...liste.map(spielKarte),
        el('section', { class: 'k-karte plk-nur-bildschirm' },
          el('div', { class: 'k-antworten' },
            el('button', { class: 'k-knopf', 'data-kennung': 'drucken', onclick: () => window.print() }, '🖨️ Diese Karten drucken'),
            el('button', {
              class: 'k-knopf k-knopf--neutral',
              'data-kennung': 'andere-art',
              onclick: () => { register = null; fokusNach = 'auswahl-titel'; render(); },
            }, bild('↩️'), 'Andere Art'))))
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

    el('section', { class: 'k-karte plk-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, bild('😌'), 'Was in diesem Alter normal ist'),
      el('p', { style: 'margin:0 0 0.5rem;font-size:0.95rem' },
        'Wenn Ihr Kind so spricht, ist nichts zu tun. Das verschwindet von selbst.'),
      ...daten.physiologisch.map((p) => el('div', { style: 'padding:0.4rem 0;border-top:1px solid var(--k-rand)' },
        el('p', { style: 'margin:0;font-weight:600' }, p.was),
        el('p', { style: 'margin:0.1rem 0 0;font-size:0.95rem' }, `z. B. ${p.beispiel}`),
        el('p', { style: 'margin:0.1rem 0 0;font-size:0.9rem;color:#4b5563' }, `${p.satz} Noch normal bis ${p.normalBis}.`)))),

    el('section', { class: 'k-karte plk-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, bild('🚫'), 'Was hier nicht drinsteht – und warum'),
      el('button', {
        class: 'k-knopf k-knopf--neutral',
        'data-kennung': 'ausschluss',
        'aria-expanded': String(zeigeAusschluss),
        onclick: () => { zeigeAusschluss = !zeigeAusschluss; render(); },
      }, zeigeAusschluss ? 'Liste zuklappen' : 'Die Ausschlussliste lesen'),
      zeigeAusschluss
        ? el('div', { style: 'margin-top:0.6rem' },
          ...daten.ausgeschlossen.map((a) => el('div', { style: 'padding:0.4rem 0;border-top:1px solid var(--k-rand)' },
            el('p', { style: 'margin:0;font-weight:600' }, bild('✖️'), a.was),
            el('p', { style: 'margin:0.1rem 0 0;font-size:0.95rem' }, a.warum))),
          el('p', { style: 'margin:0.6rem 0 0;font-size:0.9rem;color:#4b5563' },
            `${daten.quelle.werk} · ${daten.quelle.rechte}`),
          el('p', { style: 'margin:0.2rem 0 0;font-size:0.9rem;color:#4b5563' }, daten.quelle.nachgezaehlt),
          el('p', { style: 'margin:0.2rem 0 0;font-size:0.9rem;color:#4b5563' }, daten.quelle.abweichung))
        : null),

    el('section', { class: 'k-karte plk-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, bild('🧭'), 'Was woanders besser steht'),
      el('ul', { style: 'margin:0;padding-left:1.2rem' },
        el('li', {}, 'Gesprächsanlässe im Alltag, dreisprachig und zum Aufhängen: ',
          el('a', { href: '../sprachbruecken-impulskarten/', style: 'display:inline-block;min-height:48px' }, 'Sprachbrücken-Impulskarten')),
        el('li', {}, 'Was Ihr Kind sagt, aufschreiben: ',
          el('a', { href: '../erste-woerter-tagebuch/', style: 'display:inline-block;min-height:48px' }, 'Erste-Wörter-Tagebuch')),
        el('li', {}, 'Für das erste Lebensjahr: ',
          el('a', { href: '../sprich-mit-mir/', style: 'display:inline-block;min-height:48px' }, 'Sprich mit mir')),
        el('li', {}, 'Ab drei selbst heraushören, was hoch und was leise ist: ',
          el('a', { href: '../klang-detektive/', style: 'display:inline-block;min-height:48px' }, 'Klang-Detektive')),
        el('li', {}, 'Dieselbe Bedienung für Bewegung: ',
          el('a', { href: '../bewegungs-schatzkiste/', style: 'display:inline-block;min-height:48px' }, 'Bewegungs-Schatzkiste')))),

    el('footer', { class: 'k-fuss plk-nur-bildschirm' },
      el('span', {}, 'Werkzeug für Erwachsene · kein Bildschirm fürs Kind · speichert nichts · '),
      el('a', { href: '../../impressum.html', style: 'display:inline-block;min-height:48px' }, 'Impressum & Datenschutz')),
  ].filter(Boolean));

  fokussiere(fokusNach ?? merke);
  fokusNach = null;
}

const fehler = pruefeDaten(daten);
if (fehler.length) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' },
    el('p', { style: 'margin:0' }, `Datenfehler: ${fehler[0]}`)));
} else {
  render();
  if ('speechSynthesis' in window) {
    speechSynthesis.addEventListener?.('voiceschanged', () => render(), { once: true });
  }
}
