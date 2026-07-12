// Dark-Pattern-Labyrinth: begehbare Fake-App "Glitzi" (8-12 Jahre).
// Sieben Stationen, jede mit genau EINEM Dark Pattern; das Kind klickt sich
// zum ehrlichen Ausgang. Nach jeder Wahl wird das Muster BENANNT und erklärt -
// dort passiert das Lernen. Am Ende: Muster-Lexikon aller sieben Tricks.
// Politik: keine externen Anfragen, nur Rekord (dpl.rekord) in localStorage.
import { el, vorlesen, mischen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { neuesSpiel, waehle, istVorbei, ehrlicheOption, rang, lexikon } from './spiel.mjs';

installiereNetzwerkWaechter();

const REKORD_SCHLUESSEL = 'dpl.rekord';
const app = document.getElementById('app');
const daten = await fetch('daten/stationen.json').then((r) => r.json());

// Optik der nachgebauten "Glitzi"-Bildschirme: absichtlich grell und werbig,
// damit Kinder den Unterschied zur ruhigen, ehrlichen Rahmen-App SEHEN.
const GLITZI_STIL = 'background:linear-gradient(135deg,#7c3aed,#db2777);color:#fff;border-radius:0.75rem;padding:1rem;font-weight:600';

let stand = neuesSpiel(daten.stationen.length);

function zeige(...knoten) {
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🪤 Dark-Pattern-Labyrinth'),
    el('p', { class: 'k-untertitel' }, 'Finde den ehrlichen Ausgang aus der Glitzi-App!'),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · Daten bleiben auf diesem Gerät · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
  app.querySelector('button')?.focus();
}

function startBildschirm() {
  const rekord = Number(localStorage.getItem(REKORD_SCHLUESSEL) ?? 0);
  zeige(
    el('section', { class: 'k-karte' },
      el('p', {}, `Die „Glitzi-Sammel-App“ sieht niedlich aus – aber sie steckt voller Tricks, die dich festhalten und schubsen sollen. Klick dich durch ${daten.stationen.length} Stationen zum ehrlichen Ausgang. Jeder Trick, den du durchschaust, gibt einen Punkt!`),
      el('p', {}, '🎭 Keine Sorge: Alles hier ist nur nachgebaut. Es gibt keine echte Werbung und nichts zu kaufen – nur Tricks zum Durchschauen.'),
      rekord > 0 ? el('p', {}, `Dein Rekord: ${rekord} von ${daten.stationen.length} 🕵️`) : '',
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteLauf }, '▶️ Rein ins Labyrinth'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen('Die Glitzi-Sammel-App sieht niedlich aus, aber sie steckt voller Tricks. Klick dich durch sieben Stationen zum ehrlichen Ausgang. Jeder Trick, den du durchschaust, gibt einen Punkt. Keine Sorge: Alles ist nur nachgebaut, es gibt keine echte Werbung und nichts zu kaufen.') }, '🔊 Vorlesen'))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, '💡 Solche Tricks heißen „Dark Patterns“. Für große Plattformen sind sie in der EU sogar verboten – trotzdem triffst du sie überall. Wer sie beim Namen kennt, tappt nicht mehr hinein.'),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => { localStorage.removeItem(REKORD_SCHLUESSEL); startBildschirm(); } }, 'Meine Daten löschen')));
}

function starteLauf() {
  stand = neuesSpiel(daten.stationen.length);
  stationsBildschirm();
}

function stationsBildschirm() {
  const s = daten.stationen[stand.index];
  const optionen = mischen(s.optionen);
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-untertitel' }, `Station ${stand.index + 1} von ${stand.anzahl}`),
      el('div', { class: 'k-fortschritt', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': stand.anzahl, 'aria-valuenow': stand.index },
        el('div', { style: `width:${(stand.index / stand.anzahl) * 100}%` })),
      glitziBildschirm(s, optionen),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', style: 'margin-top:0.75rem', onclick: () => vorlesen(`${s.situation} Was tust du? ${optionen.map((o) => o.text).join('. Oder: ')}`) }, '🔊 Vorlesen')));
}

/**
 * Baut den nachgemachten Glitzi-Bildschirm einer Station.
 * Sonderfall s04 (versteckter Schließen-Knopf): Hier IST die Optik das Muster -
 * riesige Köder-Knöpfe, dazu ein winziges, blasses ✕ in der Ecke. Bewusste,
 * dokumentierte Ausnahme von "Touch >= 48px" (die Tipp-Fläche bleibt >= 44px,
 * mit aria-label; das Vorlesen nennt alle Optionen). Siehe GDD.md, Punkt 6.
 */
function glitziBildschirm(s, optionen) {
  if (s.id !== 's04') {
    return el('div', {},
      el('div', { style: GLITZI_STIL }, s.situation),
      el('div', { class: 'k-antworten' },
        ...optionen.map((o) =>
          el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => antworte(s, o) }, o.text))));
  }
  const ehrlich = ehrlicheOption(s);
  return el('div', { style: 'position:relative' },
    el('div', { style: `${GLITZI_STIL};padding-top:2.8rem;padding-right:3rem` }, s.situation),
    el('div', { class: 'k-antworten' },
      ...optionen.filter((o) => o.istFalle).map((o) =>
        el('button', { class: 'k-knopf', style: 'background:linear-gradient(135deg,#db2777,#f59e0b);font-size:1.15rem', onclick: () => antworte(s, o) }, o.text))),
    el('button', {
      style: 'position:absolute;top:0;right:0;min-width:44px;min-height:44px;padding:0.5rem;background:none;border:none;color:rgba(255,255,255,0.45);font-size:0.7rem;cursor:pointer',
      'aria-label': 'Winziges Kreuz in der Ecke: Werbung schließen',
      onclick: () => antworte(s, ehrlich),
    }, '✕'));
}

function antworte(station, option) {
  stand = waehle(stand, option.istFalle);
  const gut = !option.istFalle;
  const ehrlich = ehrlicheOption(station);
  zeige(
    el('section', { class: 'k-karte' },
      el('div', { class: `k-hinweis ${gut ? 'k-hinweis--richtig' : 'k-hinweis--falsch'}` },
        el('p', { style: 'font-weight:700;margin-top:0' }, gut ? 'Stark! Du hast den Trick durchschaut 🕵️' : 'Zack – das war die Falle! 🪤'),
        el('p', {}, el('strong', {}, `🎭 Dieser Trick heißt: ${station.name}`)),
        el('p', {}, station.erklaerung),
        gut ? '' : el('p', { style: 'margin-bottom:0' }, `Der ehrliche Ausweg wäre: ${ehrlich.text}`)),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`Dieser Trick heißt ${station.name}. ${station.erklaerung}`) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: weiter }, istVorbei(stand) ? 'Zum Ausgang 🏁' : 'Nächste Station ➡️'))));
}

function weiter() {
  if (istVorbei(stand)) endBildschirm();
  else stationsBildschirm();
}

function endBildschirm() {
  const rekord = Math.max(stand.punkte, Number(localStorage.getItem(REKORD_SCHLUESSEL) ?? 0));
  localStorage.setItem(REKORD_SCHLUESSEL, String(rekord));
  const r = rang(stand.punkte, daten.raenge);
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, r.emoji),
      el('p', { class: 'k-untertitel', style: 'font-weight:700' }, r.titel),
      el('p', { style: 'text-align:center' }, `🚪 Du hast den ehrlichen Ausgang erreicht: ${stand.punkte} von ${stand.anzahl} Tricks durchschaut · Rekord: ${rekord}`),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`Du hast den ehrlichen Ausgang erreicht und ${stand.punkte} von ${stand.anzahl} Tricks durchschaut. Dein Rang: ${r.titel}`) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteLauf }, '🔁 Noch einmal ins Labyrinth'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: startBildschirm }, '🏠 Zum Start'))),
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '📖 Dein Muster-Lexikon'),
      el('p', {}, `Diese ${stand.anzahl} Tricks kennst du jetzt beim Namen – tippe zum Nachlesen:`),
      ...lexikon(daten.stationen).map((eintrag) =>
        el('details', { style: 'margin:0.5rem 0' },
          el('summary', { style: 'font-weight:600;cursor:pointer;padding:0.6rem 0' }, eintrag.name),
          el('p', { style: 'margin:0.25rem 0 0' }, eintrag.erklaerung)))));
}

startBildschirm();
