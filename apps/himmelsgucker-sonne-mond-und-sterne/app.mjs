// Himmelsgucker: Kinder von 5 bis 7 Jahren schauen zusammen mit einer erwachsenen Person auf Sonne, Mond und Sternenhimmel.
// Ablauf am Bildschirm: Start mit drei Karten, Karte wählen, vorlesen, eine Frage, Erklärung, nächste Frage
// oder Ende. Ablauf im Druck: Blatt wählen, Vorschau, drucken; druck.css macht aus jedem gewählten Blatt
// eine Seite A4 hoch, ohne Zeichen, Kästchen, Namenszeile oder Tagesfelder.
// Es gibt keine Eingabefelder, keine Speicherung, keine Wertung eines Kindes und keine Verbindung nach
// draußen. Die Daten kommen per JSON-Import; alle Texte stehen in daten/himmel.json.
import { el, lokaleStimme, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import daten from './daten/himmel.json' with { type: 'json' };
import { bildSvg } from './bilder.mjs';
import {
  MAX_BEOBACHTUNG, MODUL_HIMMEL, STARTAUSWAHL, aendereAnzahl, anzahlBlaetter, beantworteMondphase, beantworteTageszeit,
  druckBlaetterHtml, fuelle, gewaehltText, karteMitId, kartenImModul, ladeHimmel, mondphasenRunde, schalteBeobachtung,
  schalteMond, tageszeitFrage, vorlesetext,
} from './logik.mjs';

installiereNetzwerkWaechter();

const KARTEN = ladeHimmel(daten);
const T = daten.texte;
const app = document.getElementById('app');
const druckBox = document.getElementById('druckbereich');

// Der einzige Zufall der App steht in dieser Datei; logik.mjs bekommt ihn als Parameter.
const zufall = () => Math.random();

// Ansichten: start, karte, frage, antwort, ende, erwachsene, druck. Alles liegt nur im Arbeitsspeicher.
let zustand = { ansicht: 'start' };
let druckAuswahl = STARTAUSWAHL;

// ---------------------------------------------------------------------------------------------
// Bausteine

// Jeder Knopf der App entsteht hier und trägt eine data-kennung. Die Kennung ist je Ansicht eindeutig.
function knopf(kennung, beschriftung, { onclick, neutral = false, klein = false, pressed, ariaDisabled = false, disabled = false, klasse = '' } = {}) {
  return el('button', {
    class: ['k-knopf', neutral && 'k-knopf--neutral', klein && 'k-knopf--klein', klasse].filter(Boolean).join(' '),
    'data-kennung': kennung,
    'aria-pressed': pressed === undefined ? null : String(pressed),
    'aria-disabled': ariaDisabled ? 'true' : null,
    disabled,
    onclick: () => { if (!ariaDisabled) onclick?.(); },
  }, ...(Array.isArray(beschriftung) ? beschriftung : [beschriftung]));
}

// Die einzige Stelle, an der Text zu Elementen wird. Hinein kommt nur HTML-Text aus dieser App: der feste SVG-Text
// aus bilder.mjs und die Druckblätter aus logik.mjs. Beide maskieren jeden Text; es kommen keine Eingaben
// und keine fremden Daten hinein.
function setzeHtml(knoten, html) {
  knoten.innerHTML = html;
  return knoten;
}

// Ein Bild aus bilder.mjs. Ohne label ist es reiner Schmuck (aria-hidden).
const bild = (id, { label = null, modus = 'bildschirm', klasse = '' } = {}) =>
  setzeHtml(el('span', { class: `hg-bild ${klasse}`.trim() }), bildSvg(id, { modus, label }));

// Die Überschrift einer Ansicht. Nach einem Bildschirmwechsel bekommt sie den Fokus.
const titel = (text) => el('h1', { class: 'k-titel hg-titel', tabindex: '-1' }, text);

function fuss() {
  return el('footer', { class: 'k-fuss' },
    el('p', {}, T.fuss.text),
    el('a', { href: '../../impressum.html' }, T.fuss.impressum));
}

// Vorlesen läuft über kinder-ui und nur mit einer Stimme, die auf dem Gerät liegt.
function vorleseKnopf(text) {
  const stimme = lokaleStimme('de');
  if (stimme === null) return el('p', { class: 'k-hinweis' }, T.stimme.keine);
  return knopf('vorlesen', T.knoepfe.vorlesen, {
    neutral: true,
    klein: true,
    onclick: () => vorlesen(text, 'de-DE', stimme),
  });
}

const absatz = (text, klasse) => el('p', klasse ? { class: klasse } : {}, text);
const zurueck = (beschriftung, ziel) => el('div', { class: 'k-antworten' },
  knopf('zurueck', beschriftung, { neutral: true, onclick: () => gehe(ziel) }));

function bildText(karte) {
  return karte.bildText ?? karte.titel;
}

// Der Zustand innerhalb einer Runde (Frage oder Antwort): nur das, was die Ansicht braucht.
const rundenZustand = (z, ansicht, extra = {}) => ({ ansicht, art: z.art, runde: z.runde, index: z.index, karte: z.karte, ...extra });

// ---------------------------------------------------------------------------------------------
// Ansichten

function ansichtStart() {
  const karten = kartenImModul(KARTEN, MODUL_HIMMEL);
  return [
    titel(T.start.titel),
    el('p', { class: 'k-untertitel' }, daten.untertitel),
    el('section', { class: 'k-karte hg-text', 'aria-label': T.start.aufforderung },
      absatz(T.start.aufforderung, 'hg-aufforderung'),
      vorleseKnopf(T.start.vorlesen),
      el('div', { class: 'hg-kartenliste' }, ...karten.map((k) => knopf(`karte-${k.id}`, [
        bild(k.icon ?? k.bild, { klasse: 'hg-bild--klein' }),
        el('span', { class: 'hg-kartentext' },
          el('span', { class: 'hg-kartentitel' }, k.titel),
          el('span', { class: 'hg-unterzeile' }, k.unterzeile)),
      ], { neutral: true, klasse: 'hg-kartenknopf', onclick: () => gehe({ ansicht: 'karte', id: k.id }) })))),
    el('section', { class: 'k-karte hg-text' },
      absatz(T.start.hinweis, 'hg-erwachsene'),
      el('div', { class: 'k-antworten' },
        knopf('druck', T.knoepfe.druck, { neutral: true, onclick: () => gehe({ ansicht: 'druck' }) }),
        knopf('erwachsene', T.knoepfe.erwachsene, { neutral: true, onclick: () => gehe({ ansicht: 'erwachsene' }) }))),
    fuss(),
  ];
}

function ansichtKarte(karte) {
  const istMond = karte.id === 'mond';
  const beschriftung = istMond ? T.knoepfe.frageMond : T.knoepfe.frageSonneSterne;
  const frageStarten = () => {
    if (istMond) gehe({ ansicht: 'frage', art: 'mond', runde: mondphasenRunde(KARTEN, zufall), index: 0 });
    else gehe({ ansicht: 'frage', art: 'tageszeit', runde: [tageszeitFrage(karte, zufall)], index: 0, karte: karte.id });
  };
  return [
    titel(karte.titel),
    el('section', { class: 'k-karte hg-text', 'aria-label': karte.titel },
      bild(karte.bild, { label: bildText(karte), klasse: istMond ? 'hg-bild--breit' : 'hg-bild--gross' }),
      ...karte.text.map((satz) => absatz(satz)),
      vorleseKnopf(vorlesetext(karte)),
      el('div', { class: 'k-antworten' }, knopf('frage', beschriftung, { onclick: frageStarten }))),
    el('section', { class: 'k-hinweis hg-erwachsenenbox' },
      el('h2', {}, T.karte.erwachseneKopf),
      ...karte.erwachsene.map((satz) => absatz(satz)),
      absatz(T.karte.eigenentwurf)),
    zurueck(T.knoepfe.zurueckKarten, { ansicht: 'start' }),
    fuss(),
  ];
}

function ansichtFrage(z) {
  const frage = z.runde[z.index];
  if (z.art === 'mond') {
    const karte = karteMitId(KARTEN, frage.id);
    const nr = z.index + 1;
    return [
      titel(fuelle(T.frage.mondTitel, { nr })),
      el('p', { class: 'k-untertitel' }, fuelle(T.frage.mondFortschritt, { nr, von: z.runde.length })),
      el('section', { class: 'k-karte hg-text', 'aria-label': T.frage.mondAufgabe },
        bild(karte.bild, { label: T.frage.mondBildLabel, klasse: 'hg-bild--gross' }),
        absatz(T.frage.mondAufgabe, 'hg-aufgabe'),
        vorleseKnopf(`${T.frage.mondAufgabe} ${frage.optionen.join('. ')}.`),
        el('div', { class: 'k-antworten', role: 'group', 'aria-label': T.frage.antwortenLabel },
          ...frage.optionen.map((option, i) => knopf(`antwort-${frage.optionenIds[i]}`, option, {
            neutral: true,
            onclick: () => gehe(rundenZustand(z, 'antwort', { auswahl: option })),
          })))),
      zurueck(T.knoepfe.zurueckKarte, { ansicht: 'karte', id: 'mond' }),
      fuss(),
    ];
  }
  const karte = karteMitId(KARTEN, z.karte);
  return [
    titel(karte.frage.titel),
    el('section', { class: 'k-karte hg-text', 'aria-label': frage.frage },
      bild(karte.bild, { label: bildText(karte), klasse: 'hg-bild--gross' }),
      absatz(frage.frage, 'hg-aufgabe'),
      vorleseKnopf(`${frage.frage} ${frage.optionen.join('. ')}.`),
      el('div', { class: 'k-antworten', role: 'group', 'aria-label': T.frage.antwortenLabel },
        ...frage.optionen.map((option, i) => knopf(`antwort-${i + 1}`, option, {
          neutral: true,
          onclick: () => gehe(rundenZustand(z, 'antwort', { auswahl: option })),
        })))),
    zurueck(T.knoepfe.zurueckKarte, { ansicht: 'karte', id: karte.id }),
    fuss(),
  ];
}

function ansichtAntwort(z) {
  const frage = z.runde[z.index];
  const beantworte = z.art === 'mond' ? beantworteMondphase : beantworteTageszeit;
  const rueckmeldung = beantworte(frage, z.auswahl);
  const letzte = z.index === z.runde.length - 1;
  const weiter = () => gehe(letzte ? { ansicht: 'ende' } : rundenZustand({ ...z, index: z.index + 1 }, 'frage'));
  // Ein anderes Wort wird nur benannt, nicht bewertet.
  const angetippt = rueckmeldung.richtig ? null : absatz(fuelle(T.frage.angetippt, { auswahl: z.auswahl }));
  if (z.art === 'mond') {
    const karte = karteMitId(KARTEN, frage.id);
    return [
      titel(frage.benennung),
      el('section', { class: 'k-karte hg-text', 'aria-label': frage.benennung },
        bild(karte.bild, { label: karte.titel, klasse: 'hg-bild--gross' }),
        absatz(rueckmeldung.erklaerung),
        angetippt,
        vorleseKnopf(`${frage.benennung} ${rueckmeldung.erklaerung}`),
        el('div', { class: 'k-antworten' }, knopf('weiter', T.knoepfe.weiter, { onclick: weiter }))),
      fuss(),
    ];
  }
  const karte = karteMitId(KARTEN, z.karte);
  return [
    titel(frage.antwortTitel),
    el('section', { class: 'k-karte hg-text', 'aria-label': frage.antwortTitel },
      bild(karte.bild, { label: bildText(karte), klasse: 'hg-bild--gross' }),
      absatz(rueckmeldung.erklaerung),
      angetippt,
      vorleseKnopf(`${frage.antwortTitel} ${rueckmeldung.erklaerung}`),
      el('div', { class: 'k-antworten' }, knopf('weiter', T.knoepfe.weiter, { onclick: weiter }))),
    fuss(),
  ];
}

function ansichtEnde() {
  return [
    titel(T.ende.titel),
    el('section', { class: 'k-karte hg-text', 'aria-label': T.ende.titel },
      absatz(T.ende.text),
      vorleseKnopf(`${T.ende.titel} ${T.ende.text}`),
      el('div', { class: 'k-antworten' },
        knopf('zu-den-karten', T.knoepfe.zurueckKarten, { onclick: () => gehe({ ansicht: 'start' }) }),
        knopf('zum-druck', T.knoepfe.druck, { neutral: true, onclick: () => gehe({ ansicht: 'druck' }) }))),
    fuss(),
  ];
}

// Eine Zeile mit einem Begriff der Quelle: Wortlaut, Seite und deutsche Übertragung (Eigenentwurf).
const begriffZeile = (b) => `„${b.quelltext}“ (${b.seite}): ${b.deutsch} (Eigenentwurf)`;

function ansichtErwachsene() {
  const abschnitte = T.erwachsene.abschnitte.map((a) => {
    const inhalt = [el('h2', {}, a.titel), ...a.absaetze.map((satz) => absatz(satz))];
    if (a.art === 'quelle') {
      inhalt.push(
        absatz(T.erwachsene.begriffeKopf),
        el('ul', { class: 'hg-liste' },
          el('li', {}, daten.quelle.begriffe.map(begriffZeile).join('; ')),
          ...KARTEN.filter((k) => k.begriffe?.length).map((k) => el('li', {}, `${k.titel}: ${k.begriffe.map(begriffZeile).join('; ')}`))),
        // Die Marke steht dort, wo die Seiten der Quelle stehen.
        absatz(daten.pflichtmarkierung, 'hg-marke'));
    }
    return el('section', { class: 'k-karte hg-text' }, ...inhalt);
  });
  return [
    titel(T.erwachsene.titel),
    ...abschnitte,
    zurueck(T.knoepfe.zurueckKarten, { ansicht: 'start' }),
    fuss(),
  ];
}

function ansichtDruck() {
  const blaetterHtml = druckBlaetterHtml(daten, druckAuswahl);
  const n = anzahlBlaetter(druckAuswahl);
  const D = T.druck;
  const aendern = (schritt) => { druckAuswahl = aendereAnzahl(druckAuswahl, schritt); render(); };
  return [
    titel(D.titel),
    el('section', { class: 'k-karte hg-text' }, absatz(D.einleitung, 'hg-erwachsene')),
    el('section', { class: 'k-karte hg-text' },
      el('h2', {}, D.mondblattTitel),
      absatz(D.mondblattText),
      knopf('mondblatt', druckAuswahl.mond ? D.mondblattGewaehlt : D.mondblattWaehlen, {
        neutral: !druckAuswahl.mond,
        pressed: druckAuswahl.mond,
        onclick: () => { druckAuswahl = schalteMond(druckAuswahl); render(); },
      })),
    el('section', { class: 'k-karte hg-text' },
      el('h2', {}, D.beobachtungTitel),
      absatz(D.beobachtungText),
      knopf('beobachtungsblatt', druckAuswahl.beobachtung ? D.beobachtungGewaehlt : D.beobachtungWaehlen, {
        neutral: !druckAuswahl.beobachtung,
        pressed: druckAuswahl.beobachtung,
        onclick: () => { druckAuswahl = schalteBeobachtung(druckAuswahl); render(); },
      }),
      // Die Zahl lässt sich ändern, sobald das Beobachtungsblatt gewählt ist. Die Knöpfe bleiben immer da
      // (aria-disabled statt entfernt), damit sich die Ansicht beim Wählen nicht umbaut und der Fokus bleibt.
      el('div', { class: 'hg-anzahl', role: 'group', 'aria-label': D.anzahlKopf },
        absatz(D.anzahlKopf, 'hg-anzahl-kopf'),
        el('div', { class: 'hg-anzahl-zeile' },
          knopf('anzahl-weniger', D.weniger, { neutral: true, klein: true, ariaDisabled: !druckAuswahl.beobachtung || druckAuswahl.anzahl <= 1, onclick: () => aendern(-1) }),
          el('span', { class: 'hg-anzahl-wert' }, fuelle(D.anzahlAnzeige, { n: druckAuswahl.anzahl })),
          knopf('anzahl-mehr', D.mehr, { neutral: true, klein: true, ariaDisabled: !druckAuswahl.beobachtung || druckAuswahl.anzahl >= MAX_BEOBACHTUNG, onclick: () => aendern(1) })))),
    el('section', { class: 'k-karte hg-text' },
      absatz(gewaehltText(D, n), 'hg-zaehler'),
      el('div', { class: 'k-antworten' },
        knopf('drucken', fuelle(D.drucken, { n }), { disabled: n === 0, onclick: () => window.print() })),
      absatz(D.hinweis, 'hg-erwachsene')),
    n > 0
      ? el('section', { class: 'hg-vorschau', 'aria-label': D.vorschau },
        el('h2', { class: 'hg-vorschau-titel' }, D.vorschau),
        setzeHtml(el('div', { class: 'hg-vorschau-liste' }), blaetterHtml))
      : null,
    zurueck(T.knoepfe.zurueckKarten, { ansicht: 'start' }),
    fuss(),
  ];
}

function ansicht() {
  switch (zustand.ansicht) {
    case 'karte': return ansichtKarte(karteMitId(KARTEN, zustand.id));
    case 'frage': return ansichtFrage(zustand);
    case 'antwort': return ansichtAntwort(zustand);
    case 'ende': return ansichtEnde();
    case 'erwachsene': return ansichtErwachsene();
    case 'druck': return ansichtDruck();
    default: return ansichtStart();
  }
}

// ---------------------------------------------------------------------------------------------
// Anzeige und Fokus

// Nach dem Neuaufbau bekommt der Knopf mit derselben Kennung den Fokus zurück.
// Sonst landet der Fokus nach jedem Klick auf dem Seitenkörper.
function fokussiere(kennung) {
  if (!kennung) return;
  const ziel = [...app.querySelectorAll('button[data-kennung]')]
    .find((b) => b.dataset.kennung === kennung);
  ziel?.focus();
}

// ziel 'titel': die Ansicht hat gewechselt, der Fokus geht auf die Überschrift der neuen Ansicht.
function render(ziel) {
  const merkeKennung = document.activeElement?.dataset?.kennung;
  const aufTitel = Boolean(document.activeElement?.classList?.contains('hg-titel'));
  app.replaceChildren(...ansicht().filter(Boolean));
  // Das Druckblatt liegt außerhalb von #app (eine Live-Region): ändert es sich, wird nichts vorgelesen.
  setzeHtml(druckBox, druckBlaetterHtml(daten, druckAuswahl));
  if (ziel === 'titel' || (aufTitel && !merkeKennung)) app.querySelector('.hg-titel')?.focus();
  else fokussiere(merkeKennung);
}

function gehe(neu) {
  zustand = neu;
  render('titel');
}

render();
// Die Stimmen des Geräts laden oft erst nach dem Start; dann entscheidet sich, ob der Vorlese-Knopf erscheint.
if ('speechSynthesis' in window) {
  window.speechSynthesis.addEventListener('voiceschanged', () => render(), { once: true });
}
