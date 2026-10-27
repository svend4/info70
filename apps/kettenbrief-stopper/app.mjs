// Kettenbrief-Stopper: erlebbare Simulation (8-12 Jahre), mehrsprachig (mini-i18n).
// Eine Kettennachricht/Mutprobe/Gerücht rast durch die Klasse; das Kind erlebt
// den Moment, in dem sie es selbst erreicht - und was sein "Stopp" verändert.
// Politik: keine externen Anfragen; diese App speichert nur die Sprachwahl
// (Schlüssel SPRACH_SCHLUESSEL, nur auf diesem Gerät) und hat dafür einen
// Löschknopf auf dem Startbildschirm. Texte in daten/sprachen.json.
import { el, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { boot as bootAnzeige } from '../../packages/kinder-ui/js/anzeige.mjs';
import { erstelleSprache } from '../../packages/kinder-ui/js/sprache.mjs';
import { loescheDaten } from '../../packages/kinder-ui/js/daten-karte.mjs';
import { setzeRichtung } from '../../packages/kinder-ui/js/richtung.mjs';
import { leichteSpracheSchalter, basisCode } from '../../packages/kinder-ui/js/leichte-sprache.mjs';
import { hilfeInsel, hilfeInselKnopf } from '../../packages/kinder-ui/js/hilfe-insel.mjs';
import { erstelleKlasse, vergleiche } from './sim.mjs';
import { NACHRICHTEN_TYPEN, baueTyp } from './nachrichten.mjs';

installiereNetzwerkWaechter();
bootAnzeige(); // Anzeige-Einstellung (Kontrast/Schrift) anwenden (BFSG)

const app = document.getElementById('app');
const kataloge = await fetch('daten/sprachen.json').then((r) => r.json());
/** Der einzige Speicherschlüssel dieser App: die Sprachwahl (auch Leichte Sprache). */
const SPRACH_SCHLUESSEL = 'ks.sprache';
const sprache = erstelleSprache({ kataloge, standard: 'de', speicherSchluessel: SPRACH_SCHLUESSEL });
const t = (k, e) => sprache.t(k, e);
setzeRichtung(sprache.aktuelle());

const SPRACHEN = [['de', 'Deutsch'], ['en', 'English']];

let aktiverTyp = NACHRICHTEN_TYPEN[0]; // Struktur; Text via baueTyp(…, t)
let gemeldet = false;
let klasse;
let erhalten;
let front;
let runde;
let entscheidungGefallen;
let stopper;
let immun;
/** Merkt über das Neuzeichnen hinweg, dass gerade gelöscht wurde: die neue Karte meldet es. */
let datenGeloescht = false;

const aktiv = () => baueTyp(aktiverTyp, t);

function zeige(...knoten) {
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, t('titel')),
    el('p', { class: 'k-untertitel' }, t('untertitel')),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, t('fuss')),
      el('a', { href: 'eltern.html' }, t('fuer_eltern')), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, t('impressum'))));
  app.querySelector('button')?.focus();
}

function sprachWahl() {
  const basis = basisCode(sprache.aktuelle());
  return el('section', { class: 'k-karte' },
    el('p', { style: 'font-weight:600;margin-top:0' }, t('sprache_label')),
    el('div', { style: 'display:flex;gap:0.5rem;flex-wrap:wrap' },
      ...SPRACHEN.map(([code, name]) => el('button', {
        class: `k-knopf k-knopf--klein ${basis === code ? '' : 'k-knopf--neutral'}`,
        'aria-pressed': String(basis === code),
        onclick: () => { sprache.setze(code); setzeRichtung(code); startBildschirm(); },
      }, name))),
    // Leichte-Sprache-Schalter (BFSG): erscheint nur, weil ein de-ls-Katalog existiert.
    el('div', { style: 'margin-top:0.5rem' },
      leichteSpracheSchalter({ sprache, neuZeichnen: startBildschirm })));
}

/** Löschknopf für die gemerkte Sprachwahl (Speicherregel: Speicher ⇒ Löschknopf). */
function datenKarte() {
  const meldung = el('p', { style: 'margin:0.4rem 0 0;font-weight:700', 'aria-live': 'polite' }, datenGeloescht ? t('daten_geloescht') : '');
  datenGeloescht = false;
  return el('section', { class: 'k-karte' },
    el('p', { style: 'margin-top:0' }, t('daten_hinweis')),
    el('button', {
      id: 'daten-loeschen',
      class: 'k-knopf k-knopf--neutral k-knopf--klein',
      onclick: () => {
        loescheDaten(SPRACH_SCHLUESSEL);
        datenGeloescht = true;
        startBildschirm();
        document.getElementById('daten-loeschen')?.focus();
      },
    }, t('daten_loeschen')),
    meldung);
}

function gitter() {
  const zellen = [];
  for (let kind = 0; kind < klasse.groesse; kind++) {
    let gesicht = '🙂';
    if (immun.has(kind)) gesicht = '🛡️';
    else if (erhalten.has(kind)) gesicht = '😨';
    const istSpieler = kind === klasse.spieler;
    if (istSpieler && !erhalten.has(kind) && !immun.has(kind)) gesicht = '🙋';
    zellen.push(el('div', {
      style: `font-size:1.6rem;text-align:center;padding:0.15rem;border-radius:0.5rem;${istSpieler ? 'outline:3px solid var(--k-blau);' : ''}`,
      'aria-label': istSpieler ? 'Das bist du' : undefined,
    }, gesicht));
  }
  return el('div', { style: 'display:grid;grid-template-columns:repeat(6,1fr);gap:0.25rem' }, ...zellen);
}

function startBildschirm() {
  zeige(
    sprachWahl(),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, t('start_hinweis')),
      ...NACHRICHTEN_TYPEN.map((struktur) => {
        const typ = baueTyp(struktur, t);
        return el('div', { style: 'border:1px solid var(--k-rand);border-radius:0.6rem;padding:0.6rem;margin:0.5rem 0' },
          el('p', { style: 'font-weight:700;margin:0 0 0.3rem' }, `${typ.emoji} ${typ.titel}`),
          el('div', { class: 'k-hinweis k-hinweis--falsch' }, el('p', { style: 'margin:0;font-weight:600' }, typ.nachricht)),
          el('div', { class: 'k-antworten' },
            el('button', { class: 'k-knopf', onclick: () => starteExperiment(struktur) }, t('experiment_starten', { titel: typ.titel })),
            el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`${typ.intro} ${typ.nachricht}`, stimme()) }, t('vorlesen'))));
      })),
    datenKarte(),
    el('section', { class: 'k-karte' },
      hilfeInselKnopf(() => zeige(hilfeInsel({ zurueck: startBildschirm })))));
}

const stimme = () => (sprache.aktuelle() === 'en' ? 'en-GB' : 'de-DE');

function starteExperiment(struktur) {
  aktiverTyp = struktur;
  gemeldet = false;
  klasse = erstelleKlasse();
  erhalten = new Set([klasse.start]);
  front = [klasse.start];
  runde = 0;
  entscheidungGefallen = false;
  stopper = new Set();
  immun = new Set();
  simulationsBildschirm();
}

function naechsteRunde() {
  const neu = new Set();
  for (const kind of front) {
    if (stopper.has(kind)) continue;
    for (const ziel of klasse.ziele[kind]) {
      if (!erhalten.has(ziel) && !immun.has(ziel)) neu.add(ziel);
    }
  }
  for (const kind of neu) erhalten.add(kind);
  front = [...neu];
  runde++;
  if (neu.has(klasse.spieler) && !entscheidungGefallen) entscheidungsBildschirm();
  else if (neu.size === 0) endBildschirm();
  else simulationsBildschirm();
}

function simulationsBildschirm() {
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-untertitel', style: 'margin-top:0' }, t('runde_status', { runde, n: erhalten.size, gesamt: klasse.groesse })),
      gitter(),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: naechsteRunde }, t('naechste_runde')))));
}

function stoppeAusbreitung() {
  stopper.add(klasse.spieler);
  for (const ziel of klasse.ziele[klasse.spieler]) immun.add(ziel);
  for (let kind = 0; kind < klasse.groesse && immun.size < klasse.ziele[klasse.spieler].length + 1; kind++) {
    if (kind !== klasse.spieler && !erhalten.has(kind)) immun.add(kind);
  }
}

function entscheidungsBildschirm() {
  const typ = aktiv();
  const optionen = [
    el('button', { class: 'k-knopf', onclick: () => { entscheidungGefallen = true; simulationsBildschirm(); } }, typ.weiter),
    el('button', { class: 'k-knopf k-knopf--richtig', onclick: () => { entscheidungGefallen = true; stoppeAusbreitung(); simulationsBildschirm(); } }, typ.stopp),
  ];
  if (typ.melden) {
    optionen.push(el('button', { class: 'k-knopf k-knopf--richtig', onclick: () => { entscheidungGefallen = true; gemeldet = true; stoppeAusbreitung(); simulationsBildschirm(); } }, typ.melden));
  }
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-untertitel', style: 'margin-top:0' }, t('erreicht_dich', { runde })),
      el('div', { class: 'k-hinweis k-hinweis--falsch' }, el('p', { style: 'margin:0;font-weight:600' }, typ.nachricht)),
      typ.quellenHinweis ? el('p', { style: 'background:#eff6ff;border-radius:0.5rem;padding:0.5rem;margin:0.4rem 0' }, `🔎 ${typ.quellenHinweis}`) : '',
      el('p', { style: 'font-weight:600' }, typ.frage),
      el('div', { class: 'k-antworten' },
        ...optionen,
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`${typ.nachricht}. ${typ.frage}`, stimme()) }, t('vorlesen')))));
}

function endBildschirm() {
  const typ = aktiv();
  const { alleLeitenWeiter } = vergleiche(klasse);
  const gestoppt = stopper.has(klasse.spieler);
  const gerettet = Math.max(0, alleLeitenWeiter - erhalten.size);
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, gestoppt ? (gemeldet ? '📣' : '🦸') : typ.emoji),
      el('p', { style: 'text-align:center;font-weight:700' },
        gestoppt
          ? t('ende_gestoppt', { aktion: gemeldet ? t('aktion_melden_stopp') : t('aktion_stopp'), n: erhalten.size, alle: alleLeitenWeiter, gerettet })
          : t('ende_alle', { n: erhalten.size, gesamt: klasse.groesse })),
      gitter()),
    el('section', { class: 'k-karte' },
      gemeldet ? el('p', { style: 'font-weight:600' }, t('gemeldet_lob')) : '',
      ...typ.lernpunkte.map((p) => el('p', {}, p)),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(typ.lernpunkte.join(' '), stimme()) }, t('vorlesen')),
        el('button', { class: 'k-knopf', onclick: () => starteExperiment(aktiverTyp) }, t('noch_ein_experiment')),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: startBildschirm }, t('zum_start')))));
}

startBildschirm();
