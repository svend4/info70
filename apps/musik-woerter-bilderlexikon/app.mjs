// Musik-Wörter-Bilderlexikon: Kinder blättern allein oder mit einer erwachsenen Person durch 23 Wörter aus der
// Musik. Ansichten: start, liste, karte, instrumente, druck, erwachsene. Jede Auswahl ist ein Knopf aus einer
// Liste, es gibt keinen Freitext. Zu jedem Wort gehören ein Bild, eine kurze Erklärung und das Vorlesen.
// Gedruckt wird je gewähltem Wort ein Blatt A4 hoch (druck.css), ohne Zeichen, Namenszeile, Datum oder Seitenzahl.
// Es gibt keine Eingabefelder, keine Speicherung, keine Wertung eines Kindes (docs/02 Z. 141–146), keinen Zufall
// und keine Verbindung nach draußen (docs/02 Z. 22–24). Die Wörter kommen per JSON-Import.
import { el, lokaleStimme, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import daten from './daten/begriffe.json' with { type: 'json' };
import {
  alleGewaehlt, alleVorlesetext, begriffKarte, begriffMitId, begriffeFuer, blaetterFuer, fuelle, gewaehlteBegriffe,
  gewaehltText, kannDrucken, ladeBegriffe, listeVorlesetext, nachbar, pruefeBegriffe, schalte, schalteKategorie, sprachStuecke,
  vorlesetext,
} from './logik.mjs';

installiereNetzwerkWaechter();

const BEGRIFFE = ladeBegriffe(daten);
const T = daten.texte;
const app = document.getElementById('app');
const druckBox = document.getElementById('druckbereich');

// Ansicht und Auswahl liegen nur im Arbeitsspeicher der Seite.
let zustand = { ansicht: 'start' };
let auswahl = new Set();

const kategorie = (id) => daten.kategorien.find((k) => k.id === id);

// Ein Text mit Titeln der Quelle: die kyrillischen Stücke tragen lang="ru".
const mitSprache = (text) => sprachStuecke(text).map((s) => (s.lang ? el('span', { lang: s.lang }, s.text) : s.text));

// ---------------------------------------------------------------------------------------------
// Bausteine

// Jeder Knopf der App entsteht hier und trägt eine data-kennung. Die Kennung ist je Ansicht eindeutig; ein
// Knopf, der beim Wechsel der Ansicht verschwindet, gibt den Fokus an die Überschrift der neuen Ansicht ab.
function knopf(kennung, inhalt, { onclick, neutral = false, klein = false, pressed, ariaDisabled = false, disabled = false, klasse = '', label } = {}) {
  return el('button', {
    class: ['k-knopf', neutral && 'k-knopf--neutral', klein && 'k-knopf--klein', klasse].filter(Boolean).join(' '),
    'data-kennung': kennung,
    'aria-pressed': pressed === undefined ? null : String(pressed),
    'aria-disabled': ariaDisabled ? 'true' : null,
    'aria-label': label ?? null,
    disabled,
    onclick: () => { if (!ariaDisabled) onclick?.(); },
  }, ...(Array.isArray(inhalt) ? inhalt : [inhalt]));
}

// Die Überschrift einer Ansicht. Nach einem Wechsel der Ansicht bekommt sie den Fokus.
const titel = (text) => el('h1', { class: 'k-titel lk-titel', tabindex: '-1' }, text);

// Ein Bild aus dem Ordner bilder/. Ohne Text ist es reiner Schmuck: das Wort steht immer daneben als Text.
const bild = (pfad, text, klasse) => el('img', { class: klasse, src: pfad, alt: text ?? '', width: '200', height: '200' });

// Der Fuß steht am Ende jeder Ansicht. Er trägt auch den Vermerk zum Eigenentwurf, denn jede Ansicht zeigt Wörter, Bilder
// oder Erklärungen, und die stammen nicht aus der Quelle.
function fuss() {
  return el('footer', { class: 'k-fuss' },
    el('p', {}, T.fuss.text),
    el('p', {}, `${T.fuss.quelle} ${daten.pflichtmarkierung}`),
    el('p', {}, daten.eigenentwurf),
    el('a', { href: '../../impressum.html' }, T.fuss.impressum));
}

// Vorlesen läuft über kinder-ui und nur mit einer Stimme, die auf dem Gerät liegt (kein Netz, docs/02 Z. 22–24).
// Gibt es keine, steht ein Hinweis statt des Knopfs.
// Der Name des Knopfs (label) nennt das Wort, damit mehrere Knöpfe „Vorlesen“ auf einer Ansicht unterscheidbar sind.
function vorleseKnopf(kennung, text, beschriftung = T.knoepfe.vorlesen, label) {
  const stimme = lokaleStimme('de');
  if (stimme === null) return el('p', { class: 'k-hinweis lk-hinweis' }, T.stimme.keine);
  return knopf(kennung, beschriftung, { neutral: true, label, onclick: () => vorlesen(text, 'de-DE', stimme) });
}

const zurueck = (kennung, beschriftung, ziel) => el('div', { class: 'k-antworten' },
  knopf(kennung, beschriftung, { neutral: true, onclick: () => gehe(ziel) }));

// Ein Blatt A4 hoch: Wort, Bild, Erklärung. Dieselbe Funktion baut die Vorschau und den Druckbereich.
function blattKnoten(blatt) {
  return el('section', { class: 'lk-blatt' },
    el('p', { class: 'lk-blatt-kopf' }, daten.titel),
    el('p', { class: 'lk-blatt-thema' }, fuelle(T.karte.thema, { name: blatt.thema })),
    el('h2', { class: 'lk-blatt-wort' }, blatt.wort),
    bild(blatt.bild, blatt.bildText, 'lk-blatt-bild'),
    el('p', { class: 'lk-blatt-text' }, blatt.erklaerung),
    el('p', { class: 'lk-blatt-vermerk' }, daten.eigenentwurf));
}

// ---------------------------------------------------------------------------------------------
// Ansichten

function ansichtStart() {
  const S = T.start;
  return [
    titel(daten.titel),
    el('p', { class: 'k-untertitel' }, S.untertitel),
    el('section', { class: 'k-karte lk-text lk-kompakt', 'aria-label': S.aufforderung },
      el('p', { class: 'lk-aufforderung' }, S.aufforderung),
      vorleseKnopf('vorlesen', S.vorlesen),
      el('div', { class: 'lk-liste' }, ...daten.kategorien.map((k) => knopf(`thema-${k.id}`, [
        bild(k.bild, '', 'lk-bild-klein'),
        el('span', { class: 'lk-knopftext' },
          el('span', { class: 'lk-knopftitel' }, k.name),
          el('span', { class: 'lk-unterzeile' }, fuelle(S.wortzahl, { n: begriffeFuer(BEGRIFFE, k.id).length }))),
      ], { neutral: true, klasse: 'lk-bildknopf', onclick: () => gehe({ ansicht: 'liste', kategorie: k.id }) })))),
    // Für Erwachsene: Karten drucken, Hinweise zur Quelle und alle Instrumente zusammen zum Zeigen.
    el('section', { class: 'k-karte lk-text' },
      el('p', { class: 'lk-erwachsene' }, S.erwachseneHinweis),
      el('div', { class: 'k-antworten' },
        knopf('start-drucken', T.knoepfe.karten, { neutral: true, onclick: () => gehe({ ansicht: 'druck' }) }),
        knopf('start-erwachsene', T.knoepfe.erwachsene, { neutral: true, onclick: () => gehe({ ansicht: 'erwachsene' }) }),
        knopf('start-instrumente', S.instrumente, { neutral: true, onclick: () => gehe({ ansicht: 'instrumente' }) }))),
    fuss(),
  ];
}

function ansichtListe(id) {
  const k = kategorie(id);
  const woerter = begriffeFuer(BEGRIFFE, id);
  return [
    titel(k.name),
    el('p', { class: 'k-untertitel' }, fuelle(T.liste.untertitel, { n: woerter.length })),
    el('section', { class: 'k-karte lk-text lk-kompakt', 'aria-label': k.name },
      vorleseKnopf('vorlesen', listeVorlesetext(T.liste.vorlesen, k.name, woerter.map((b) => b.de))),
      el('div', { class: 'lk-liste' }, ...woerter.map((b) => knopf(`wort-${b.id}`, [
        bild(b.bild, '', 'lk-bild-klein'),
        el('span', { class: 'lk-knopftext' }, el('span', { class: 'lk-knopftitel' }, b.de)),
      ], { neutral: true, klasse: 'lk-bildknopf', onclick: () => gehe({ ansicht: 'karte', id: b.id }) }))),
      id === 'instrument'
        ? knopf('liste-instrumente', T.liste.instrumente, { neutral: true, onclick: () => gehe({ ansicht: 'instrumente' }) })
        : null),
    zurueck('liste-zurueck', T.knoepfe.zurueckThemen, { ansicht: 'start' }),
    fuss(),
  ];
}

function ansichtKarte(id) {
  const b = begriffMitId(BEGRIFFE, id);
  const karte = begriffKarte(b, 'de');
  const gewaehlt = auswahl.has(b.id);
  const n = gewaehlteBegriffe(BEGRIFFE, auswahl).length;
  // Vorheriges und nächstes Wort lassen den Fokus auf dem Knopf: es ist dieselbe Ansicht mit anderem Inhalt.
  const springe = (schritt) => gehe({ ansicht: 'karte', id: nachbar(BEGRIFFE, b.id, schritt).id }, 'knopf');
  return [
    el('p', { class: 'lk-thema' }, fuelle(T.karte.thema, { name: kategorie(b.kategorie).name })),
    titel(karte.wort),
    el('section', { class: 'k-karte lk-text', 'aria-label': karte.wort },
      bild(karte.bild, b.bildText, 'lk-bild-gross'),
      el('p', { class: 'lk-erklaerung' }, karte.erklaerung),
      vorleseKnopf('vorlesen', vorlesetext(karte)),
      el('div', { class: 'k-antworten' },
        knopf('karte-weiter', T.knoepfe.weiter, { onclick: () => springe(1) }),
        knopf('karte-vorher', T.knoepfe.vorher, { neutral: true, onclick: () => springe(-1) }),
        knopf('karte-zur-liste', T.knoepfe.zurListe, { neutral: true, onclick: () => gehe({ ansicht: 'liste', kategorie: b.kategorie }) }))),
    el('section', { class: 'k-karte lk-text' },
      el('h2', { class: 'lk-gruppe' }, T.karte.erwachsene),
      el('div', { class: 'k-antworten' },
        knopf('karte-waehlen', gewaehlt ? T.karte.gewaehlt : T.karte.waehlen, {
          neutral: !gewaehlt,
          pressed: gewaehlt,
          onclick: () => { auswahl = schalte(auswahl, b.id); render(); },
        }),
        knopf('karte-drucken', n > 0 ? fuelle(T.karte.zumDruckMitZahl, { n }) : T.karte.zumDruck, {
          neutral: true,
          onclick: () => gehe({ ansicht: 'druck' }),
        }))),
    fuss(),
  ];
}

function ansichtInstrumente() {
  const instrumente = begriffeFuer(BEGRIFFE, 'instrument');
  const karten = instrumente.map((b) => begriffKarte(b, 'de'));
  return [
    titel(T.instrumente.titel),
    el('p', { class: 'k-untertitel' }, T.instrumente.einleitung),
    el('section', { class: 'k-karte lk-text' },
      vorleseKnopf('vorlesen-alle', alleVorlesetext(karten), T.instrumente.alleVorlesen)),
    ...instrumente.map((b, i) => el('section', { class: 'k-karte lk-text', 'aria-labelledby': `instrument-${b.id}` },
      bild(b.bild, b.bildText, 'lk-bild-mittel'),
      el('h2', { id: `instrument-${b.id}`, class: 'lk-wort' }, karten[i].wort),
      el('p', { class: 'lk-erklaerung' }, karten[i].erklaerung),
      vorleseKnopf(`vorlesen-${b.id}`, vorlesetext(karten[i]), T.knoepfe.vorlesen, fuelle(T.instrumente.vorlesenLabel, { wort: karten[i].wort })))),
    zurueck('instrumente-zurueck', T.knoepfe.zurueckThemen, { ansicht: 'start' }),
    fuss(),
  ];
}

function ansichtDruck() {
  const D = T.druck;
  const gewaehlte = gewaehlteBegriffe(BEGRIFFE, auswahl);
  const n = gewaehlte.length;
  const blaetter = blaetterFuer(daten, auswahl);
  return [
    titel(D.titel),
    el('section', { class: 'k-karte lk-text' },
      el('p', { class: 'lk-erwachsene' }, D.einleitung),
      el('p', { class: 'lk-erwachsene' }, D.hinweis)),
    ...daten.kategorien.map((k) => {
      const woerter = begriffeFuer(BEGRIFFE, k.id);
      const alle = alleGewaehlt(auswahl, BEGRIFFE, k.id);
      return el('section', { class: 'k-karte lk-text', 'aria-labelledby': `druck-gruppe-${k.id}` },
        el('h2', { id: `druck-gruppe-${k.id}`, class: 'lk-gruppe' }, k.name),
        knopf(`druck-alle-${k.id}`, fuelle(alle ? D.alleAbwaehlen : D.alleWaehlen, { n: woerter.length }), {
          neutral: !alle,
          pressed: alle,
          onclick: () => { auswahl = schalteKategorie(auswahl, BEGRIFFE, k.id); render(); },
        }),
        el('div', { class: 'lk-chips' }, ...woerter.map((b) => knopf(`druck-wort-${b.id}`, b.de, {
          neutral: !auswahl.has(b.id),
          klein: true,
          pressed: auswahl.has(b.id),
          onclick: () => { auswahl = schalte(auswahl, b.id); render(); },
        }))));
    }),
    el('section', { class: 'k-karte lk-text' },
      el('p', { class: 'lk-zaehler' }, gewaehltText(D, n)),
      el('div', { class: 'k-antworten' },
        knopf('drucken', fuelle(D.drucken, { n }), { disabled: !kannDrucken(gewaehlte), onclick: () => window.print() }),
        // aria-disabled statt disabled: der Knopf bleibt fokussierbar, der Fokus geht beim Leeren nicht verloren.
        knopf('druck-leeren', D.leeren, {
          neutral: true,
          ariaDisabled: n === 0,
          onclick: () => { auswahl = new Set(); render(); },
        }))),
    n > 0
      // Die Vorschau zeigt nur, was gewählt ist (die Knöpfe oben nennen es schon): für Hilfstechnik verborgen, damit nicht
      // bei jeder Auswahl alle Blätter vorgelesen werden.
      ? el('section', { class: 'lk-vorschau', 'aria-hidden': 'true' },
        el('h2', { class: 'lk-gruppe' }, D.vorschau),
        ...blaetter.map(blattKnoten))
      : null,
    zurueck('druck-zurueck', T.knoepfe.zurueckThemen, { ansicht: 'start' }),
    fuss(),
  ];
}

function ansichtErwachsene() {
  const E = T.erwachsene;
  return [
    titel(E.titel),
    ...E.abschnitte.map((a) => el('section', { class: 'k-karte lk-text' },
      el('h2', { class: 'lk-gruppe' }, a.titel),
      ...a.absaetze.map((text) => el('p', {}, ...mitSprache(fuelle(text, { ...daten.quelle, sprachen: daten.sprachen })))),
      // Die Marke steht dort, wo die Seiten der Quelle stehen.
      a.marke ? el('p', { class: 'lk-marke' }, daten.pflichtmarkierung) : null)),
    zurueck('erwachsene-zurueck', T.knoepfe.zurueckThemen, { ansicht: 'start' }),
    fuss(),
  ];
}

function ansicht() {
  switch (zustand.ansicht) {
    case 'liste': return ansichtListe(zustand.kategorie);
    case 'karte': return ansichtKarte(zustand.id);
    case 'instrumente': return ansichtInstrumente();
    case 'druck': return ansichtDruck();
    case 'erwachsene': return ansichtErwachsene();
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
// Sonst bekommt der Knopf mit derselben Kennung den Fokus zurück.
function render(ziel) {
  const merkeKennung = document.activeElement?.dataset?.kennung;
  const aufTitel = Boolean(document.activeElement?.classList?.contains('lk-titel'));
  app.replaceChildren(...ansicht().filter(Boolean));
  // Der Druckbereich liegt außerhalb von #app (einer Live-Region): ändert er sich, wird nichts vorgelesen.
  druckBox.replaceChildren(...blaetterFuer(daten, auswahl).map(blattKnoten));
  if (ziel === 'titel' || (aufTitel && !merkeKennung)) app.querySelector('.lk-titel')?.focus();
  else fokussiere(merkeKennung);
}

function gehe(neu, ziel = 'titel') {
  // Was gerade vorgelesen wird, gehört zur alten Ansicht.
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  zustand = neu;
  render(ziel);
}

const fehler = pruefeBegriffe(daten);
if (fehler.length) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' }, el('p', {}, `Datenfehler: ${fehler[0]}`)));
} else {
  render();
  // Die Stimmen des Geräts laden oft erst nach dem Start; dann entscheidet sich, ob der Vorlese-Knopf erscheint.
  if ('speechSynthesis' in window) {
    window.speechSynthesis.addEventListener?.('voiceschanged', () => render(), { once: true });
  }
}
