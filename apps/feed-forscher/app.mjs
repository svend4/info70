// Feed-Forscher: erlebbarer Empfehlungsalgorithmus (8-12 Jahre).
// Das Kind tippt Videos an; ein gewichteter Zufall verstärkt das angetippte
// Thema - der Feed kippt sichtbar in eine Filterblase. Lernziel: verstehen,
// dass Algorithmen aus Klicks lernen, und dass man selbst gegensteuern kann.
// Politik: keine externen Anfragen, gespeichert wird nur die Sprachwahl.
import { el, vorlesen, mischen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { erstelleSprache } from '../../packages/kinder-ui/js/sprache.mjs';
import { leichteSpracheSchalter, basisCode } from '../../packages/kinder-ui/js/leichte-sprache.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { boot as bootAnzeige } from '../../packages/kinder-ui/js/anzeige.mjs';
import { setzeRichtung } from '../../packages/kinder-ui/js/richtung.mjs';

installiereNetzwerkWaechter();
bootAnzeige(); // Anzeige-Einstellung (Kontrast/Schrift) anwenden (BFSG)

const app = document.getElementById('app');
const kataloge = await fetch('daten/sprachen.json').then((r) => r.json());
const sprache = erstelleSprache({ kataloge, standard: 'de', speicherSchluessel: 'ff.sprache' });
setzeRichtung(sprache.aktuelle()); // Schreibrichtung nach gespeicherter Sprache (RTL-tauglich)
const t = (k, e) => sprache.t(k, e);

const THEMEN = ['katzen', 'fussball', 'weltraum', 'backen', 'dinos', 'musik'];
const EMOJI = { katzen: '🐱', fussball: '⚽', weltraum: '🚀', backen: '🧁', dinos: '🦖', musik: '🎵' };
const STIMME = { de: 'de-DE', uk: 'uk-UA', ru: 'ru-RU', en: 'en-GB' };
const RUNDEN = 10;
const FEED_GROESSE = 4;
const VERSTAERKUNG = 1.7; // so lernt "der Algorithmus"
const ALARM_ANTEIL = 0.5;

let gewichte = {};
let runde = 0;

const themaName = (id) => t(`thema_${id}`);
const stimme = () => STIMME[basisCode(sprache.aktuelle())] ?? 'de-DE';

function zeige(...knoten) {
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, t('titel')),
    el('p', { class: 'k-untertitel' }, t('untertitel')),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
  app.querySelector('button')?.focus();
}

function sprachWahl() {
  const basis = basisCode(sprache.aktuelle());
  return el('section', { class: 'k-karte' },
    el('p', { style: 'font-weight:600;margin-top:0' }, t('sprache_label')),
    el('div', { style: 'display:flex;gap:0.5rem;flex-wrap:wrap' },
      ...[['de', 'Deutsch'], ['uk', 'Українська'], ['ru', 'Русский'], ['en', 'English']].map(([code, name]) =>
        el('button', {
          class: `k-knopf k-knopf--klein ${basis === code ? '' : 'k-knopf--neutral'}`,
          'aria-pressed': String(basis === code),
          onclick: () => { sprache.setze(code); setzeRichtung(code); startBildschirm(); },
        }, name))),
    // Leichte-Sprache-Schalter (BFSG): erscheint nur, weil ein de-ls-Katalog
    // existiert. Zentral in kinder-ui gebaut - jede App mit '-ls'-Fassung nutzt ihn.
    el('div', { style: 'margin-top:0.5rem' },
      leichteSpracheSchalter({ sprache, neuZeichnen: startBildschirm })));
}

function startBildschirm() {
  zeige(
    sprachWahl(),
    el('section', { class: 'k-karte' },
      el('p', {}, t('start_intro')),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteExperiment }, t('start_knopf')),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(t('start_intro'), stimme()) }, t('vorlesen_knopf')))),
    el('section', { class: 'k-karte' },
      el('p', {}, t('daten_hinweis')),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => { localStorage.clear(); startBildschirm(); } }, t('daten_loeschen'))));
}

function starteExperiment() {
  gewichte = Object.fromEntries(THEMEN.map((th) => [th, 1]));
  runde = 0;
  feedBildschirm();
}

/** Gewichteter Zufall: n verschiedene Themen proportional zu ihren Gewichten. */
function ziehungen(n) {
  const gewaehlt = [];
  const kandidaten = new Set(THEMEN);
  while (gewaehlt.length < n && kandidaten.size > 0) {
    const summe = [...kandidaten].reduce((s, th) => s + gewichte[th], 0);
    let los = Math.random() * summe;
    for (const th of kandidaten) {
      los -= gewichte[th];
      if (los <= 0) {
        gewaehlt.push(th);
        kandidaten.delete(th);
        break;
      }
    }
  }
  return gewaehlt;
}

function dominantesThema() {
  const summe = THEMEN.reduce((s, th) => s + gewichte[th], 0);
  const top = THEMEN.reduce((a, b) => (gewichte[a] >= gewichte[b] ? a : b));
  return { thema: top, anteil: gewichte[top] / summe };
}

function mischungsAnzeige() {
  const summe = THEMEN.reduce((s, th) => s + gewichte[th], 0);
  return el('div', {},
    el('p', { style: 'font-weight:600;margin-bottom:0.25rem' }, t('blase_label')),
    ...[...THEMEN].sort((a, b) => gewichte[b] - gewichte[a]).map((th) => {
      const anteil = Math.round((gewichte[th] / summe) * 100);
      return el('div', { style: 'display:flex;align-items:center;gap:0.5rem;margin:0.2rem 0' },
        el('span', { style: 'width:2rem', 'aria-hidden': 'true' }, EMOJI[th]),
        el('div', { class: 'k-fortschritt', style: 'flex:1' }, el('div', { style: `width:${anteil}%` })),
        el('span', { style: 'width:3.2rem;text-align:right;font-size:0.85rem' }, `${anteil} %`));
    }));
}

function feedBildschirm(mitMischHinweis = false) {
  if (runde >= RUNDEN) return lektionBildschirm();
  const feed = ziehungen(FEED_GROESSE);
  const { thema, anteil } = dominantesThema();
  const vorlagen = ['vorlage_1', 'vorlage_2', 'vorlage_3'];
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-untertitel' }, t('runde', { nr: runde + 1, von: RUNDEN })),
      el('p', { style: 'font-weight:600' }, t('feed_frage')),
      el('div', { class: 'k-antworten' },
        ...feed.map((th) =>
          el('button', {
            class: 'k-knopf k-knopf--neutral',
            onclick: () => {
              gewichte[th] *= VERSTAERKUNG;
              runde++;
              feedBildschirm();
            },
          }, `${EMOJI[th]} ${t(mischen(vorlagen)[0], { thema: themaName(th) })}`))),
      el('div', { class: 'k-antworten' },
        el('button', {
          class: 'k-knopf',
          onclick: () => {
            gewichte = Object.fromEntries(THEMEN.map((th) => [th, 1]));
            feedBildschirm(true);
          },
        }, t('misch_knopf')))),
    mitMischHinweis ? el('section', { class: 'k-karte' }, el('div', { class: 'k-hinweis k-hinweis--richtig' }, el('p', { style: 'margin:0' }, t('misch_erklaerung')))) : '',
    anteil > ALARM_ANTEIL && !mitMischHinweis
      ? el('section', { class: 'k-karte' },
          el('div', { class: 'k-hinweis' }, el('p', { style: 'margin:0' }, t('blase_alarm', { thema: themaName(thema) }))))
      : '',
    el('section', { class: 'k-karte' }, mischungsAnzeige()));
}

function lektionBildschirm() {
  const { thema, anteil } = dominantesThema();
  const prozent = Math.round(anteil * 100);
  const lektionen = [t('lektion_1'), t('lektion_2'), t('lektion_3')];
  const ergebnis = t('lektion_ergebnis', { runden: RUNDEN, anteil: prozent, thema: themaName(thema) });
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-weight:700' }, t('lektion_titel')),
      el('p', {}, `${EMOJI[thema]} ${ergebnis}`),
      mischungsAnzeige()),
    el('section', { class: 'k-karte' },
      ...lektionen.map((l) => el('p', {}, l)),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`${ergebnis} ${lektionen.join(' ')}`, stimme()) }, t('vorlesen_knopf')),
        el('button', { class: 'k-knopf', onclick: starteExperiment }, t('nochmal_knopf')),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: startBildschirm }, t('zum_start_knopf')))));
}

startBildschirm();
