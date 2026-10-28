// Farbwörter-Schatz: Farbwörter gemeinsam anschauen, mit einem Erwachsenen. Kinder von 3 bis 5 Jahren
// nutzen die App nur gemeinsam, Kinder von 5 bis 7 Jahren auch. Der Ablauf ist eine Auswahl aus Listen:
// Gruppe wählen, Farbwort wählen, Farbkarte ansehen, vorlesen, auf Wunsch drucken. Es gibt keine
// Eingabefelder, keine Speicherung und keine Verbindung nach draußen. Eine Runde zeigt höchstens
// PRO_SITZUNG verschiedene Farbwörter, dann ist Bildschirm aus. druck.css macht aus jeder
// vorgemerkten Karte ein Blatt A4 hoch, ohne Zeichen, Seitenzahl oder Namenszeile.
// Die Reihenfolge ist die der Datei; die App braucht keinen Zufall.
import { el, vorlesen, lokaleStimme } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import daten from './daten/farbwoerter.json' with { type: 'json' };
import {
  BLATT_EIGEN, PRO_SITZUNG, alleKennungen, darfOeffnen, druckBlaetter, farbkarte, gewaehlteFarbwoerter, gruppeFuer,
  ladeFarbwoerter, merkeAngesehen, pruefeFarbwoerter, rundeVoll, umschalten, vorlesetext,
} from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const UEBERSCHRIFT = 'fws-ueberschrift';

let farbwoerter = [];
let datenFehler = null;
try {
  farbwoerter = ladeFarbwoerter(daten);
  datenFehler = pruefeFarbwoerter(daten)[0] ?? null;
  // Jedes Blatt muss druckbar sein; sonst steht der Fehler gleich auf dem Bildschirm und nicht erst beim Drucken.
  if (!datenFehler) druckBlaetter(farbwoerter.map((f) => farbkarte(f)));
} catch (fehler) {
  datenFehler = fehler.message;
}

// Der Stand liegt nur im Arbeitsspeicher der Seite und verschwindet mit dem Neuladen.
let schirm = 'start';
let gruppeId = null;
let wortId = null;
let druckVon = 'gruppen';
let angesehen = [];
let auswahl = [];

const nachId = (id) => farbwoerter.find((f) => f.id === id);
const gruppeNach = (id) => daten.gruppen.find((g) => g.id === id);

// ---------------------------------------------------------------- Bausteine

function chip(farbe) {
  return el('span', { class: 'fws-chip', style: `background:${farbe}`, 'aria-hidden': 'true' });
}

// Die Farbfläche trägt immer ihren Namen als Text: bei einem Paar unter jeder Fläche, sonst als Überschrift.
function flaechenKnoten(karte) {
  return el('div', { class: 'fws-flaechen' },
    ...karte.flaeche.map((farbe, i) => el('div', { class: 'fws-box' },
      el('div', {
        class: 'fws-flaeche',
        role: 'img',
        'aria-label': `Farbfläche ${karte.teile[i] ?? karte.name}`,
        style: `background:${farbe}`,
      }),
      karte.teile.length ? el('p', { class: 'fws-flaechenname' }, karte.teile[i]) : null)));
}

// Vorlesen läuft im Gerät. Gibt es keine deutsche Stimme ohne Netz, steht hier ein Hinweis statt des Knopfs.
// null heißt: keine solche Stimme. undefined heißt: die Liste der Stimmen ist noch nicht geladen.
function vorleseKnopf(text, kennung) {
  const stimme = lokaleStimme('de');
  if (stimme === null) {
    return el('div', { class: 'k-antworten' }, el('p', { class: 'k-hinweis' },
      'Auf diesem Gerät gibt es keine deutsche Stimme, die ohne Netz arbeitet. Vorlesen ist hier deshalb aus. Bitte lest die Wörter selbst vor.'));
  }
  return el('div', { class: 'k-antworten' }, el('button', {
    class: 'k-knopf k-knopf--neutral',
    'data-kennung': kennung,
    onclick: () => vorlesen(text, 'de-DE', stimme),
  }, 'Vorlesen'));
}

// Zahl mit Einzahl oder Mehrzahl: 1 Karte, 3 Karten.
const anzahl = (n, einzahl, mehrzahl) => `${n} ${n === 1 ? einzahl : mehrzahl}`;

function ueberschrift(text) {
  return el('h1', { class: 'k-titel fws-ueberschrift', id: UEBERSCHRIFT, tabindex: '-1' }, text);
}

// Auf jedem Bildschirm außer dem Start steht der Name der App klein über der Überschrift des Bildschirms.
function kopf(titel) {
  return [el('p', { class: 'fws-appname' }, daten.titel), ueberschrift(titel)];
}

function fuss() {
  return el('footer', { class: 'k-fuss' },
    el('p', {}, 'Werkzeug zum gemeinsamen Schauen. Nichts wird gespeichert, es gibt keine Verbindung nach draußen.'),
    el('p', {}, daten.eigenentwurf),
    el('a', { href: '../../impressum.html' }, 'Impressum und Datenschutz'));
}

const mitKomma = (knoten) => knoten.flatMap((k, i) => (i ? [', ', k] : [k]));

// Der Inhalt eines Blatts. Auf dem Bildschirm (Vorschau) und im Druck ist es derselbe Text.
function blattInhalt(praefix, blatt) {
  const z = blatt.zeilen;
  return [
    el('p', { class: 'fws-kopf' }, z.kopf),
    flaechenKnoten({ flaeche: blatt.flaeche, teile: z.teile, name: z.name }),
    el('h2', { id: `${praefix}-${blatt.id}`, class: 'fws-name' }, z.name),
    el('p', { class: 'fws-hinweis' }, z.hinweis),
    el('p', { class: 'fws-satz' }, z.satz),
    z.grenzfall ? el('p', { class: 'fws-satz' }, z.grenzfall) : null,
    el('p', { class: 'fws-eigen' }, z.eigen),
  ];
}

function druckBlatt(blatt) {
  return el('section', { class: 'k-karte fws-karte', 'aria-labelledby': `druck-${blatt.id}` },
    ...blattInhalt('druck', blatt));
}

// ---------------------------------------------------------------- Bildschirme

function startBildschirm() {
  const q = daten.quelle;
  const begriffe = q.begriffe.map((b) => el('span', { lang: 'ru' }, `„${b}“`));
  return [
    ueberschrift(daten.titel),
    el('section', { class: 'k-karte', 'aria-labelledby': UEBERSCHRIFT },
      el('p', { class: 'fws-untertitel' }, 'Am besten gemeinsam.'),
      el('p', { class: 'fws-text' }, daten.start.text),
      vorleseKnopf(`Am besten gemeinsam. ${daten.start.text}`, 'start-vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', {
          class: 'k-knopf',
          'data-kennung': 'start-los',
          onclick: () => gehe('gruppen'),
        }, 'Wir sind zusammen – los!'))),
    el('section', { class: 'k-karte' },
      el('p', { class: 'fws-steuertitel' }, 'Für Erwachsene'),
      ...daten.start.erwachsene.map((t) => el('p', { class: 'fws-text' }, t.replace('{n}', String(PRO_SITZUNG))))),
    el('section', { class: 'k-karte' },
      el('p', { class: 'fws-steuertitel' }, 'Quelle'),
      el('p', { class: 'fws-text' }, `Quelle: ${q.werk}. Abschnitt ${q.abschnitt}, Gruppe ${q.gruppe}, ${q.seite}.`),
      el('p', { class: 'fws-text' },
        'Die Seite nennt als Aufgabe bildhafte Farbnamen: ', ...mitKomma(begriffe),
        ` (${q.seite}). Die Aufzählung ist offen („${q.offeneListe}“, ${q.seite}). Dazu nennt die Seite warme und kalte, kontrastierende, im Ton nahe und neutrale Farben (${q.seite}).`),
      el('p', { class: 'fws-text' }, daten.eigenentwurf),
      el('p', { class: 'fws-klein' }, daten.pflichtmarkierung),
      el('p', { class: 'fws-klein' }, daten.sprachen)),
    fuss(),
  ];
}

function gruppenBildschirm() {
  const namen = daten.gruppen.map((g) => g.name).join('. ');
  return [
    ...kopf('Welche Farben suchen wir?'),
    el('section', { class: 'k-karte' },
      el('p', { class: 'fws-text' }, 'Tippt auf eine Gruppe.'),
      el('div', { class: 'k-antworten' },
        ...daten.gruppen.map((g) => el('button', {
          class: 'k-knopf k-knopf--neutral fws-wortknopf fws-gruppenknopf',
          'data-kennung': `gruppe-${g.id}`,
          onclick: () => gehe('liste', { gruppeId: g.id }),
        },
        el('span', { class: 'fws-chips' },
          ...gruppeFuer(farbwoerter, g.id).flatMap((f) => farbkarte(f).flaeche).slice(0, 3).map(chip)),
        el('span', {}, g.name)))),
      vorleseKnopf(`Welche Farben suchen wir? ${namen}.`, 'gruppen-vorlesen')),
    angesehen.length || auswahl.length
      ? el('section', { class: 'k-karte' },
        angesehen.length
          ? el('p', { class: 'fws-klein' }, `In dieser Runde angesehen: ${anzahl(angesehen.length, 'Farbwort', 'Farbwörter')}.`)
          : null,
        el('div', { class: 'k-antworten' },
          angesehen.length
            ? el('button', {
              class: 'k-knopf k-knopf--neutral',
              'data-kennung': 'gruppen-fertig',
              onclick: () => gehe('schluss'),
            }, 'Fertig – Bildschirm aus')
            : null,
          auswahl.length
            ? el('button', {
              class: 'k-knopf k-knopf--neutral',
              'data-kennung': 'gruppen-druck',
              onclick: () => oeffneDruck('gruppen'),
            }, `Für Erwachsene: Karten drucken (${auswahl.length})`)
            : null))
      : null,
    fuss(),
  ];
}

function listeBildschirm() {
  const g = gruppeNach(gruppeId);
  const liste = gruppeFuer(farbwoerter, gruppeId);
  return [
    ...kopf(g.name),
    el('section', { class: 'k-karte' },
      el('p', { class: 'fws-text' }, g.text),
      liste.length
        ? el('div', { class: 'k-antworten' },
          ...liste.map((f) => el('button', {
            class: 'k-knopf k-knopf--neutral fws-wortknopf',
            'data-kennung': `wort-${f.id}`,
            onclick: () => oeffneKarte(f.id),
          },
          el('span', { class: 'fws-chips' }, ...farbkarte(f).flaeche.map(chip)),
          el('span', {}, f.de))))
        : el('p', { class: 'k-hinweis' }, 'Für diese Gruppe gibt es noch keine Farbwörter.'),
      liste.length ? vorleseKnopf(`${g.name}. ${liste.map((f) => f.de).join('. ')}.`, 'liste-vorlesen') : null,
      el('div', { class: 'k-antworten' },
        el('button', {
          class: 'k-knopf k-knopf--neutral',
          'data-kennung': 'liste-gruppen',
          onclick: () => gehe('gruppen'),
        }, 'Andere Farbgruppe'))),
    fuss(),
  ];
}

function karteBildschirm() {
  const f = nachId(wortId);
  const karte = farbkarte(f);
  const vorgemerkt = auswahl.includes(f.id);
  const voll = rundeVoll(angesehen);
  return [
    ...kopf(karte.name),
    el('section', { class: 'k-karte', 'aria-labelledby': UEBERSCHRIFT },
      flaechenKnoten(karte),
      el('p', { class: 'fws-hinweis' }, karte.hinweis),
      el('p', { class: 'fws-text' }, karte.satz),
      karte.grenzfall ? el('p', { class: 'k-hinweis' }, karte.grenzfall) : null,
      el('p', { class: 'fws-text' }, karte.teile.length
        ? 'Schaut euch um: Seht ihr etwas in diesen Farben?'
        : 'Schaut euch um: Seht ihr etwas in dieser Farbe?'),
      el('p', { class: 'fws-klein' }, BLATT_EIGEN),
      vorleseKnopf(vorlesetext(karte), 'karte-vorlesen'),
      voll
        ? el('p', { class: 'k-hinweis' }, 'Das war das letzte Farbwort dieser Runde. Jetzt ist Bildschirm aus.')
        : null),
    el('section', { class: 'k-karte' },
      el('p', { class: 'fws-steuertitel' }, 'Für Erwachsene'),
      el('div', { class: 'k-antworten' },
        auswahl.length
          ? el('button', {
            class: 'k-knopf k-knopf--neutral',
            'data-kennung': 'karte-druck',
            onclick: () => oeffneDruck('karte'),
          }, `Karten drucken (${auswahl.length})`)
          : null,
        el('button', {
          class: `k-knopf ${vorgemerkt ? '' : 'k-knopf--neutral'}`,
          'aria-pressed': String(vorgemerkt),
          'data-kennung': 'karte-vormerken',
          onclick: () => { auswahl = umschalten(auswahl, f.id); render(); },
        }, vorgemerkt ? 'Zum Drucken vorgemerkt' : 'Karte zum Drucken vormerken'))),
    el('div', { class: 'fws-weiter' },
      el('button', {
        class: 'k-knopf',
        'data-kennung': 'karte-weiter',
        onclick: () => (voll ? gehe('schluss') : gehe('liste')),
      }, voll ? 'Bildschirm aus' : 'Weitere Farbwörter'),
      voll
        ? null
        : el('button', {
          class: 'k-knopf k-knopf--neutral',
          'data-kennung': 'karte-gruppen',
          onclick: () => gehe('gruppen'),
        }, 'Andere Farbgruppe')),
    fuss(),
  ];
}

function schlussBildschirm() {
  const namen = angesehen.map((id) => nachId(id)?.de).filter(Boolean);
  const text = 'Sucht jetzt im Zimmer oder draußen etwas, das so aussieht wie eines eurer Farbwörter. Zeigt es einander und sagt den Namen dazu.';
  return [
    ...kopf('Bildschirm aus'),
    el('section', { class: 'k-karte' },
      el('p', { class: 'fws-text' }, text),
      namen.length ? el('p', { class: 'fws-text' }, `Das habt ihr angeschaut: ${namen.join(', ')}.`) : null,
      vorleseKnopf(`Bildschirm aus. ${text}`, 'schluss-vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', {
          class: 'k-knopf k-knopf--neutral',
          'data-kennung': 'schluss-druck',
          onclick: () => oeffneDruck('schluss'),
        }, 'Für Erwachsene: Karten zum Drucken'),
        el('button', {
          class: 'k-knopf k-knopf--neutral',
          'data-kennung': 'schluss-neue-runde',
          onclick: () => { angesehen = []; gehe('gruppen'); },
        }, 'Für Erwachsene: neue Runde'))),
    fuss(),
  ];
}

function druckBildschirm(blaetter) {
  return [
    ...kopf('Karten zum Drucken'),
    el('section', { class: 'k-karte' },
      el('p', { class: 'fws-text' },
        'Für Erwachsene. Jede gewählte Karte kommt auf ein eigenes Blatt A4 hoch. Im Druckdialog Kopf- und Fußzeilen ausschalten, sonst können Datum oder Adresse der Seite auf dem Blatt erscheinen.'),
      el('p', { class: 'fws-klein' }, `Gewählt: ${anzahl(blaetter.length, 'Karte', 'Karten')}.`),
      el('div', { class: 'k-antworten' },
        el('button', {
          class: 'k-knopf',
          'data-kennung': 'druck-drucken',
          disabled: blaetter.length === 0,
          onclick: () => window.print(),
        }, 'Drucken'),
        el('button', {
          class: 'k-knopf k-knopf--neutral',
          'data-kennung': 'druck-alle',
          onclick: () => { auswahl = alleKennungen(farbwoerter); render(); },
        }, 'Alle Karten wählen'),
        blaetter.length
          ? el('button', {
            class: 'k-knopf k-knopf--neutral',
            'data-kennung': 'druck-leeren',
            onclick: () => { auswahl = []; render(); },
          }, 'Auswahl leeren')
          : null,
        el('button', {
          class: 'k-knopf k-knopf--neutral',
          'data-kennung': 'druck-zurueck',
          onclick: () => gehe(druckVon),
        }, 'Zurück'))),
    ...blaetter.map((blatt) => el('section', {
      class: 'k-karte fws-karte-bildschirm',
      'aria-labelledby': `vorschau-${blatt.id}`,
    },
    ...blattInhalt('vorschau', blatt),
    el('button', {
      class: 'k-knopf k-knopf--neutral k-knopf--klein',
      'data-kennung': `druck-weg-${blatt.id}`,
      onclick: () => { auswahl = umschalten(auswahl, blatt.id); render(); },
    }, 'Diese Karte nicht drucken'))),
    fuss(),
  ];
}

function fehlerBildschirm() {
  return [
    ...kopf('Die Daten stimmen nicht'),
    el('p', { class: 'k-hinweis' }, `Datenfehler: ${datenFehler}`),
    fuss(),
  ];
}

function bildschirm(blaetter) {
  if (datenFehler) return fehlerBildschirm();
  switch (schirm) {
    case 'gruppen': return gruppenBildschirm();
    case 'liste': return listeBildschirm();
    case 'karte': return karteBildschirm();
    case 'schluss': return schlussBildschirm();
    case 'druck': return druckBildschirm(blaetter);
    default: return startBildschirm();
  }
}

// ---------------------------------------------------------------- Ablauf

function gehe(neu, extra = {}) {
  if (extra.gruppeId !== undefined) gruppeId = extra.gruppeId;
  if (extra.wortId !== undefined) wortId = extra.wortId;
  // Ist die Runde voll, führt der Weg zu einer neuen Auswahl zu Bildschirm aus.
  schirm = rundeVoll(angesehen) && (neu === 'gruppen' || neu === 'liste') ? 'schluss' : neu;
  render(true);
}

function oeffneKarte(id) {
  if (!darfOeffnen(angesehen, id)) {
    gehe('schluss');
    return;
  }
  angesehen = merkeAngesehen(angesehen, id);
  gehe('karte', { wortId: id });
}

function oeffneDruck(von) {
  druckVon = von;
  gehe('druck');
}

// Nach dem Neuaufbau bekommt der Knopf mit derselben Kennung den Fokus zurück. Sonst landet der Fokus nach
// jedem Klick auf dem Seitenkörper. Findet sich der Knopf nicht mehr, liefert die Funktion false.
function fokussiere(kennung) {
  if (!kennung) return false;
  const ziel = [...app.querySelectorAll('button[data-kennung]')]
    .find((b) => b.dataset.kennung === kennung);
  ziel?.focus();
  return Boolean(ziel);
}

// Nach einem Bildschirmwechsel steht der Fokus auf der Überschrift des neuen Bildschirms.
function fokussiereUeberschrift() {
  document.getElementById(UEBERSCHRIFT)?.focus();
}

function render(zurUeberschrift = false) {
  const merkeKennung = document.activeElement?.dataset?.kennung;
  const warUeberschrift = document.activeElement?.id === UEBERSCHRIFT;
  const blaetter = datenFehler
    ? []
    : druckBlaetter(gewaehlteFarbwoerter(farbwoerter, auswahl).map((f) => farbkarte(f)));
  app.replaceChildren(
    el('div', { class: 'fws-bildschirm fws-nur-bildschirm' }, ...bildschirm(blaetter)),
    el('div', { class: 'fws-nur-druck', id: 'druckbereich' }, ...blaetter.map(druckBlatt)));
  if (zurUeberschrift || warUeberschrift) fokussiereUeberschrift();
  else if (merkeKennung && !fokussiere(merkeKennung)) fokussiereUeberschrift();
}

render();
// Die Liste der Stimmen lädt in manchen Browsern erst nach dem ersten Zeichnen.
if (typeof speechSynthesis !== 'undefined') {
  speechSynthesis.addEventListener?.('voiceschanged', () => render(), { once: true });
}
