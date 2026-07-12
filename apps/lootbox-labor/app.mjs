// Lootbox-Labor: erlebbarer Lootbox-Simulator (8-12 Jahre).
// Das Kind öffnet Glitzer-Truhen mit OFFENGELEGTEN Wahrscheinlichkeiten und
// erlebt am eigenen (Spiel-)Taschengeld, wie selten das Legendäre fällt -
// und warum die Zufalls-Belohnung zum Weiterkaufen verführt (Glücksspielmechanik).
// Politik: keine externen Anfragen; diese App speichert GAR NICHTS.
import { el, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { wahrscheinlichkeiten, ziehe, erwartungswert, pechQuantil, TRUHEN_PREIS, START_TASCHENGELD } from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');

let geld;
let ausgegeben;
let truhen;
let beute; // Map: item.id -> Anzahl
let duplikate;
let legendaerNach; // null oder Truhen-Nummer des ersten Legendärs
let letzter; // letzter Zug: { seltenheit, item, anzahl }

function zeige(...knoten) {
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🎁 Lootbox-Labor'),
    el('p', { class: 'k-untertitel' }, 'Die Wahrscheinlichkeiten liegen offen. Der Zufall trotzdem nicht auf deiner Seite.'),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · diese App speichert nichts · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
  app.querySelector('button')?.focus();
}

// Offengelegte Wahrscheinlichkeiten - groß und auf jedem Spiel-Bildschirm sichtbar.
function wahrscheinlichkeitsTafel() {
  return el('div', { class: 'k-hinweis', role: 'note', 'aria-label': 'Offengelegte Wahrscheinlichkeiten' },
    el('p', { style: 'margin:0 0 0.4rem;font-weight:700' }, '📢 Offengelegt: So fällt der Zufall'),
    el('div', { style: 'display:flex;gap:0.5rem;text-align:center' },
      ...wahrscheinlichkeiten.map((w) => el('div', { style: 'flex:1' },
        el('div', { style: 'font-size:1.6rem', 'aria-hidden': 'true' }, w.emoji),
        el('div', { style: 'font-size:1.5rem;font-weight:800' }, `${w.prozent} %`),
        el('div', { style: 'font-size:0.85rem' }, w.name)))),
    el('p', { style: 'margin:0.4rem 0 0;font-weight:600;font-size:0.95rem' }, '♻️ Duplikate möglich – auch doppelt und dreifach!'));
}

function zaehlerKasten(beschriftung, wert) {
  return el('div', { style: 'border:2px solid var(--k-blau);border-radius:0.6rem;padding:0.4rem;text-align:center' },
    el('div', { style: 'font-size:0.85rem' }, beschriftung),
    el('div', { style: 'font-size:1.2rem;font-weight:800' }, wert));
}

// Live-Zähler: ausgegeben, erhalten, Duplikate, "immer noch kein Legendär".
function zaehlerGitter() {
  return el('div', { style: 'display:grid;grid-template-columns:1fr 1fr;gap:0.4rem' },
    zaehlerKasten('💸 Ausgegeben', `${ausgegeben} €`),
    zaehlerKasten('🎁 Items erhalten', `${truhen}`),
    zaehlerKasten('♻️ Davon Duplikate', `${duplikate}`),
    legendaerNach === null
      ? zaehlerKasten('😤 Immer noch kein Legendär', `${truhen} Truhen`)
      : zaehlerKasten('💎 Legendär gefunden nach', `${legendaerNach} Truhen`));
}

function beuteKarte() {
  if (!letzter) return '';
  const { seltenheit, item, anzahl } = letzter;
  const klasse = seltenheit.id === 'legendaer' ? 'k-hinweis--richtig' : anzahl > 1 ? 'k-hinweis--falsch' : '';
  return el('div', { class: `k-hinweis ${klasse}` },
    el('p', { style: 'margin:0;text-align:center;font-size:2.2rem' }, item.emoji),
    el('p', { style: 'margin:0;text-align:center;font-weight:700' }, `${item.name} (${seltenheit.name}, ${seltenheit.prozent} %)`),
    anzahl > 1 ? el('p', { style: 'margin:0.2rem 0 0;text-align:center' }, `Schon wieder! Das ist Nummer ${anzahl} – ein Duplikat. ♻️`) : '');
}

function startBildschirm() {
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, `Willkommen im Labor! Du bekommst ${START_TASCHENGELD} € Spiel-Taschengeld. Eine Glitzer-Truhe kostet ${TRUHEN_PREIS} €. Drin ist vielleicht der legendäre Galaxie-Drache 🐉 – oder mal wieder eine einzelne Socke.`),
      wahrscheinlichkeitsTafel(),
      el('p', {}, 'Anders als echte Spiele verraten wir dir die Chancen ehrlich und GROSS. Findest du den Drachen, bevor dein Taschengeld weg ist?'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteLabor }, '▶️ Labor starten'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`Willkommen im Lootbox-Labor! Du bekommst ${START_TASCHENGELD} Euro Spiel-Taschengeld. Eine Glitzer-Truhe kostet ${TRUHEN_PREIS} Euro. Legendär fällt mit 1 Prozent, Selten mit 9 Prozent, Häufig mit 90 Prozent. Duplikate sind möglich. Findest du den Galaxie-Drachen, bevor dein Taschengeld weg ist?`) }, '🔊 Vorlesen'))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin:0' }, '💡 Gut zu wissen: Hier ist alles nur Spiel-Geld – und diese App speichert nichts. Jedes Experiment startet frisch.')));
}

function starteLabor() {
  geld = START_TASCHENGELD;
  ausgegeben = 0;
  truhen = 0;
  beute = new Map();
  duplikate = 0;
  legendaerNach = null;
  letzter = null;
  laborBildschirm();
}

function oeffneTruhe() {
  geld -= TRUHEN_PREIS;
  ausgegeben += TRUHEN_PREIS;
  truhen++;
  const zug = ziehe();
  const anzahl = (beute.get(zug.item.id) ?? 0) + 1;
  beute.set(zug.item.id, anzahl);
  if (anzahl > 1) duplikate++;
  if (zug.seltenheit.id === 'legendaer' && legendaerNach === null) legendaerNach = truhen;
  letzter = { ...zug, anzahl };
  if (geld < TRUHEN_PREIS) endBildschirm();
  else laborBildschirm();
}

function laborBildschirm() {
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-untertitel', style: 'margin-top:0;font-size:1.3rem;font-weight:800' }, `💰 Taschengeld: ${geld} €`),
      beuteKarte(),
      zaehlerGitter(),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: oeffneTruhe }, `🎁 Glitzer-Truhe öffnen (${TRUHEN_PREIS} €)`),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: endBildschirm }, '🛑 Aufhören & Auswertung'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`Du hast noch ${geld} Euro Taschengeld. ${ausgegeben} Euro ausgegeben, ${truhen} Items erhalten, davon ${duplikate} Duplikate. ${legendaerNach === null ? 'Immer noch kein Legendär.' : `Legendär gefunden nach ${legendaerNach} Truhen.`}`) }, '🔊 Vorlesen')),
      wahrscheinlichkeitsTafel()));
}

function endBildschirm() {
  const geldLeer = geld < TRUHEN_PREIS;
  const ew = erwartungswert();
  const pechTruhen = pechQuantil();
  const pechKosten = pechTruhen * TRUHEN_PREIS;
  const reflexion = geldLeer
    ? `Dein Taschengeld ist weg – ${ausgegeben} € für ${truhen} Truhen. Im echten Spiel wäre das ECHTES Geld – und der Nachschub-Knopf führt zum Konto deiner Eltern.`
    : `Du hast selbst gestoppt – mit ${geld} € in der Tasche. Genau dieses Aufhören fällt im echten Spiel so schwer, denn dort lockt immer der Nachschub-Knopf. Und der führt zum Konto deiner Eltern.`;
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, geldLeer ? '💸' : '🛑'),
      el('p', { style: 'text-align:center;font-weight:700;font-size:1.2rem' }, geldLeer ? 'Taschengeld leer!' : 'Du hast aufgehört!'),
      beuteKarte(),
      zaehlerGitter(),
      legendaerNach !== null
        ? el('p', {}, '🍀 Du hattest RIESIGES Glück: Nur ungefähr 1 von 10 Kindern findet das Legendäre in 10 Truhen. Glück ist kein Plan – beim nächsten Mal zahlt der Zufall nicht zurück.')
        : ''),
    el('section', { class: 'k-karte' },
      el('div', { class: 'k-hinweis k-hinweis--falsch' },
        el('p', { style: 'margin:0;font-weight:700' }, `🪙 ${reflexion}`)),
      el('div', { class: 'k-hinweis' },
        el('p', { style: 'margin:0 0 0.3rem;font-weight:700' }, '🧮 Mathe-Box: Was kostet ein Legendär wirklich?'),
        el('p', { style: 'margin:0' }, `Legendär fällt mit ${wahrscheinlichkeiten[0].prozent} %. Im Mittel brauchst du dafür ${ew.truhen} Truhen – das sind ${ew.kosten} €! Und der Zufall kennt kein Mitleid: Jedes zehnte Kind braucht sogar mehr als ${pechTruhen} Truhen (über ${pechKosten} €). Eine Garantie gibt es nie – und Duplikate zahlst du voll mit.`)),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`${reflexion} Mathe-Box: Legendär fällt mit 1 Prozent. Im Mittel brauchst du ${ew.truhen} Truhen, das sind ${ew.kosten} Euro. Jedes zehnte Kind braucht sogar mehr als ${pechTruhen} Truhen, über ${pechKosten} Euro. Eine Garantie gibt es nie.`) }, '🔊 Vorlesen')),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, '🎰 Lootboxen funktionieren wie ein Glücksspiel-Automat: Du bezahlst fest, aber was du bekommst, entscheidet allein der Zufall.'),
      el('p', {}, '🧠 Genau das ist der Trick: Die Belohnung fällt zufällig, dein Kopf denkt „beim nächsten Mal bestimmt!“ – und du kaufst weiter. Spiele-Firmen bauen das absichtlich so.'),
      el('p', {}, '⚖️ Darum streiten Fachleute und Politik (Jugendschutzgesetz), ob Lootboxen Glücksspiel sind. In manchen Ländern sind sie für Kinder schon verboten; in Deutschland zählen solche Kostenfallen bei der Alterskennzeichnung mit.'),
      el('p', {}, '💬 Deine starke Regel: Bevor in einem Spiel echtes Geld fließt, sprich mit deinen Eltern – und rechne vorher aus, was das „Glück“ im Mittel kostet.'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen('Lootboxen funktionieren wie ein Glücksspiel-Automat: Du bezahlst fest, aber was du bekommst, entscheidet der Zufall. Die Belohnung fällt zufällig, damit du weiterkaufst. Darum streiten Fachleute und Politik, ob Lootboxen Glücksspiel sind. Bevor echtes Geld fließt: Sprich mit deinen Eltern.') }, '🔊 Vorlesen'),
        el('button', { class: 'k-knopf', onclick: starteLabor }, '🔁 Noch ein Experiment'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: startBildschirm }, '🏠 Zum Start'))));
}

startBildschirm();
