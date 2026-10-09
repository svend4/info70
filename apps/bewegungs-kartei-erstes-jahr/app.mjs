// Bewegungs-Kartei Babys erstes Jahr (für Eltern und Kindertagespflege).
// Praleska docs/10 (Eltern-Werkzeuge Nr. 49), Quelle S. 34-36.
//
// Das Gerät ist in der Hand des Erwachsenen; das Baby sieht keinen
// Bildschirm. Keine Karte beschreibt Säuglingsgymnastik – beschrieben wird
// die Umgebung, die Bewegung macht das Kind (siehe logik.mjs). Tragen,
// Ablegen und auf einer Karte flächiges Streichen kommen vor und werden
// nicht geleugnet: der weitere Anspruch „kein Handgriff am Kind“ ist im
// Review gefallen, weil er nicht stimmte.
//
// Die App speichert NICHTS: kein Haken, kein Zähler, kein Fortschritt und
// kein localStorage-Schlüssel. Vorbild apps/bewegungs-schatzkiste, nicht
// apps/meilenstein-begleiter – ein Fortschrittsmerker wäre hier ein
// Protokoll über ein Kind. Politik docs/02: keine externen Anfragen.
import { el, vorlesen, lokaleStimme } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { kartenFuer, karteText, fensterSatz, pruefeDaten } from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const daten = await fetch('daten/kartei.json').then((r) => r.json());

// Der einzige Zustand ist die aktuelle Auswahl – im Speicher, nicht auf der
// Platte. Nach dem Schließen ist nichts übrig.
let koennen = null;
let zeigeAusschluss = false;

/**
 * Vorlesen nur mit einer Stimme, die auf dem Gerät liegt. `vorlesen()` aus
 * kinder-ui setzt die übergebene Stimme auf die Äußerung; ohne sie wählt
 * der Browser die Standardstimme, und Web-Speech-Stimmen sind nicht
 * garantiert geräteintern – auf vielen Geräten sind sie netzbasiert, und
 * der NetzwerkWaechter patcht nur fetch, XMLHttpRequest und WebSocket.
 * Hier geht kein Kindertext und kein eingegebener Text durch die Ausgabe,
 * aber die Zusage „keine externen Anfragen“ gilt trotzdem.
 */

function vorleseKnopf(text, beschriftung = '🔊 Vorlesen') {
  const stimme = lokaleStimme('de');
  if (stimme === null) {
    return el('p', { class: 'k-hinweis bk-nur-bildschirm', style: 'margin:0.6rem 0' },
      '🗣️ Auf diesem Gerät gibt es keine deutsche Stimme, die offline arbeitet. Vorlesen ist hier deshalb aus.');
  }
  return el('button', {
    class: 'k-knopf k-knopf--neutral bk-nur-bildschirm',
    onclick: () => vorlesen(text, 'de-DE', stimme),
  }, beschriftung);
}

const hinweisKarte = (titel, ...absaetze) => el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
  el('p', { style: 'font-weight:700;margin-top:0' }, titel),
  ...absaetze.map((t) => el('p', { style: 'margin:0 0 0.3rem' }, t)));

function karteKnoten(k) {
  return el('section', { class: 'k-karte bk-karte' },
    el('h2', { style: 'margin-top:0;font-size:1.1rem' }, k.titel),
    el('p', { style: 'margin:0 0 0.4rem;font-size:0.9rem;color:#4b5563' },
      `Wenn dein Kind schon: ${(daten.koennen.find((c) => c.id === k.koennen) ?? {}).beschreibung ?? ''}`),
    el('p', { style: 'font-weight:700;margin:0 0 0.2rem' }, '🧺 Was du vorbereitest:'),
    el('ul', { style: 'margin:0 0 0.5rem;padding-left:1.2rem' },
      ...k.wasDuVorbereitest.map((s) => el('li', { style: 'margin-bottom:0.2rem' }, s))),
    el('p', { style: 'margin:0 0 0.5rem' }, `👶 ${k.wasDeinKindTut}`),
    el('div', { class: 'k-hinweis bk-sicherheit', style: 'margin:0 0 0.4rem' },
      el('p', { style: 'margin:0' }, `⚠️ ${k.sicherheit}`)),
    k.schlafhinweis
      ? el('div', { class: 'k-hinweis', style: 'margin:0 0 0.4rem' },
        el('p', { style: 'margin:0' }, `😴 ${k.schlafhinweis}`))
      : null,
    k.ohneWirkung ? el('p', { style: 'margin:0 0 0.4rem;font-size:0.9rem' }, `ℹ️ ${k.ohneWirkung}`) : null,
    k.abbruchzeichen && k.abbruchzeichen !== '–'
      ? el('p', { style: 'margin:0;font-size:0.95rem' }, `✋ Aufhören: ${k.abbruchzeichen}`)
      : null,
    vorleseKnopf(karteText(k), '🔊 Karte vorlesen'));
}

function render() {
  const liste = koennen ? kartenFuer(daten, koennen) : [];

  const wahl = el('div', { class: 'k-antworten bk-nur-bildschirm', role: 'group', 'aria-label': 'Was kann dein Kind schon?' },
    ...daten.koennen.map((c) => el('button', {
      class: `k-knopf ${c.id === koennen ? '' : 'k-knopf--neutral'}`,
      style: 'min-height:3.4rem;text-align:start',
      'aria-pressed': String(c.id === koennen),
      onclick: () => { koennen = c.id; render(); },
    }, `${c.name} – ${c.beschreibung}`)));

  app.replaceChildren(...[
    el('div', { class: 'bk-kopf' },
      el('h1', { class: 'k-titel' }, '🧸 Bewegungs-Kartei · erstes Jahr'),
      el('p', { class: 'k-untertitel' }, 'Du bereitest die Umgebung vor – die Bewegung macht dein Kind')),
    el('section', { class: 'k-karte bk-nur-bildschirm' },
      el('div', { class: 'k-hinweis' }, el('p', { style: 'margin:0;font-weight:600' }, daten.hinweis)),
      hinweisKarte('📵 Für wen der Bildschirm ist:', daten.geraet),
      hinweisKarte('🎯 Kein Plan, keine Haken:', daten.keinPlan, daten.abbruch),
      hinweisKarte('🛟 Wenn es zu viel wird:', daten.schuetteln),
      hinweisKarte('🩺 Was diese Kartei nicht ist:', daten.zustaendigkeit),
      vorleseKnopf(`${daten.hinweis} ${daten.geraet} ${daten.keinPlan} ${daten.abbruch}`, '🔊 Das Wichtigste vorlesen')),
    el('section', { class: 'k-karte bk-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '👀 Was kann dein Kind schon?'),
      el('p', { style: 'margin:0 0 0.4rem;font-size:0.95rem' },
        'Nicht „wie alt ist es“ – sondern was du gerade siehst. Die Kartei ist danach geordnet.'),
      wahl),
    koennen
      ? el('div', {},
        el('p', { class: 'k-untertitel bk-nur-bildschirm', style: 'margin-bottom:0.2rem' },
          `${liste.length} ${liste.length === 1 ? 'Idee' : 'Ideen'} dazu`),
        // Die Bodenregel gilt für JEDE Karte und stand nur im Vorwort, das
        // nicht mitgedruckt wird – auf dem Papier fehlte sie damit ganz.
        el('section', { class: 'k-karte bk-karte bk-nur-druck' },
          el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '⚠️ Gilt für jede Karte'),
          el('p', { style: 'margin:0' }, daten.bodenregel),
          el('p', { style: 'margin:0.3rem 0 0' }, daten.abbruch)),
        ...liste.map(karteKnoten),
        el('section', { class: 'k-karte bk-nur-bildschirm' },
          el('div', { class: 'k-antworten' },
            el('button', { class: 'k-knopf', onclick: () => window.print() }, '🖨️ Diese Karten drucken'),
            el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => { koennen = null; render(); } }, '↩️ Andere Stufe'))))
      : null,
    el('section', { class: 'k-karte bk-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🛣️ Es gibt mehr als einen Weg'),
      el('p', { style: 'margin:0 0 0.5rem' }, daten.wege),
      el('p', { style: 'margin:0 0 0.3rem;font-size:0.95rem' }, daten.whoFenster.hinweis),
      el('ul', { style: 'margin:0;padding-left:1.2rem' },
        ...daten.whoFenster.schritte.map((s) => el('li', { style: 'margin-bottom:0.2rem' }, fensterSatz(daten, s.id)))),
      el('p', { style: 'margin:0.4rem 0 0;font-size:0.85rem;color:#4b5563' }, daten.whoFenster.quelle)),
    el('section', { class: 'k-karte bk-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🚫 Was hier nicht drinsteht – und warum'),
      el('p', { style: 'margin:0 0 0.4rem' }, daten.quelle.bilanz),
      el('div', { class: 'k-antworten' },
        el('button', {
          class: 'k-knopf k-knopf--neutral', 'aria-expanded': String(zeigeAusschluss),
          onclick: () => { zeigeAusschluss = !zeigeAusschluss; render(); },
        }, zeigeAusschluss ? '▲ Liste zuklappen' : '▼ Die Ausschlussliste lesen')),
      zeigeAusschluss
        ? el('ul', { style: 'margin:0.5rem 0 0;padding-left:1.2rem' },
          ...daten.ausgeschlossen.map((a) => el('li', { style: 'margin-bottom:0.5rem' },
            el('strong', {}, a.was), el('br'), el('span', {}, a.grund))))
        : null,
      el('p', { style: 'margin:0.6rem 0 0.2rem;font-weight:700' }, '🏠 Was nicht in die Wohnung gehört:'),
      el('ul', { style: 'margin:0;padding-left:1.2rem' },
        ...daten.nichtImHaus.map((n) => el('li', { style: 'margin-bottom:0.3rem' }, `${n.was} – ${n.warum}`))),
      el('p', { style: 'margin:0.6rem 0 0;font-size:0.9rem;color:#4b5563' }, daten.quelle.uebernommen)),
    el('footer', { class: 'k-fuss bk-nur-bildschirm' },
      el('span', {}, 'Werkzeug für Erwachsene · kein Bildschirm fürs Kind · speichert nichts · '),
      el('a', { href: '../meilenstein-begleiter/' }, 'Meilensteine beobachten'), el('span', {}, ' · '),
      el('a', { href: '../bewegungs-schatzkiste/' }, 'Bewegungsspiele ab 1 Jahr'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')),
  ].filter(Boolean));
}

const fehler = pruefeDaten(daten);
if (fehler.length) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' },
    el('p', { style: 'margin:0' }, `Datenfehler: ${fehler[0]}`)));
} else {
  render();
}
