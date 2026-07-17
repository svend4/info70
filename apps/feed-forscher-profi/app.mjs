// Feed-Forscher Profi (13-15): erlebbare Empfehlungs-Radikalisierung.
// Ausbau von feed-forscher: Statt Themen-Blase geht es um die INTENSITAETS-
// Spirale - der Feed wird nicht falscher, er wird schaerfer. Abstrakte
// Schlagzeilen-Muster statt echter Inhalte (Politik + AI-Act-Vorsicht).
// Politik docs/02: keine externen Anfragen, speichert NICHTS.
import { el, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { STUFEN, THEMEN, START_PROFIL, neuesProfil, gegensteuern, feedStufen, blasenLage, LEKTIONEN } from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
let thema = 'nachrichten';
let profil = START_PROFIL;
let runden = 0;
let hinweis = null;

function zeige(...knoten) {
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🌀 Feed-Forscher Profi'),
    el('p', { class: 'k-untertitel' }, 'Dein Feed wird nicht falscher – er wird schärfer. (ab 13)'),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · diese App speichert nichts · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
  app.querySelector('button')?.focus();
}

function startBildschirm() {
  zeige(
    el('section', { class: 'k-karte' },
      el('p', {}, 'Du kennst den Feed-Forscher? Hier kommt die Profi-Stufe: Der simulierte Algorithmus lernt nicht nur, WAS dich interessiert – er lernt, WIE SCHARF du es magst. Und er bietet dir immer eine Spur mehr an. Wähle eine Themenwelt und beobachte, wohin die Treppe führt.'),
      el('p', { style: 'font-size:0.9rem' }, 'Alle Schlagzeilen sind erfundene MUSTER – aber du wirst sie wiedererkennen.'),
      el('div', { class: 'k-antworten' },
        ...Object.entries(THEMEN).map(([code, t]) =>
          el('button', { class: 'k-knopf', onclick: () => starteLauf(code) }, `${t.emoji} ${t.name}`))),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', style: 'margin-top:0.5rem', onclick: () => vorlesen('Der simulierte Algorithmus lernt nicht nur, was dich interessiert. Er lernt, wie scharf du es magst. Und er bietet dir immer eine Spur mehr an.') }, '🔊 Vorlesen')));
}

function starteLauf(code) {
  thema = code;
  profil = START_PROFIL;
  runden = 0;
  hinweis = null;
  feedBildschirm();
}

function stufenInfo(stufe) {
  return STUFEN.find((s) => s.stufe === stufe);
}

function feedBildschirm() {
  const lage = blasenLage(profil);
  const anteil = ((profil - 1) / 4) * 100;
  const t = THEMEN[thema];
  const karten = feedStufen(profil);
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-weight:600;margin:0 0 0.25rem' }, `Feed-Temperatur nach ${runden} Klicks:`),
      el('div', { class: 'k-fortschritt', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': Math.round(anteil) },
        el('div', { style: `width:${anteil}%;background:${stufenInfo(Math.round(profil)).farbe}` })),
      el('p', { style: 'margin:0.4rem 0 0' }, lage.text),
      hinweis ? el('div', { class: 'k-hinweis', style: 'margin-top:0.5rem' }, el('p', { style: 'margin:0;font-size:0.9rem' }, hinweis)) : ''),
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-weight:600;margin-top:0' }, `${t.emoji} Deine nächsten Empfehlungen – tippe an, was du „anschauen“ würdest:`),
      el('div', { class: 'k-antworten' },
        ...karten.map((stufe) => {
          const info = stufenInfo(stufe);
          return el('button', { class: 'k-knopf k-knopf--neutral', style: 'text-align:left', onclick: () => klick(stufe) },
            el('span', { style: `display:inline-block;padding:0.05rem 0.5rem;border-radius:0.5rem;color:#fff;background:${info.farbe};font-size:0.75rem;margin-bottom:0.2rem` }, `Stufe ${stufe}: ${info.name}`),
            el('span', { style: 'display:block' }, t.schlagzeilen[stufe]));
        })),
      el('p', { style: 'font-weight:600;margin:0.75rem 0 0.25rem' }, '🧭 Oder gegensteuern:'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--klein k-knopf--neutral', onclick: () => steuere('nicht-interessiert') }, '🚫 „Nicht interessiert“ drücken'),
        el('button', { class: 'k-knopf k-knopf--klein k-knopf--neutral', onclick: () => steuere('mix') }, '🌈 Themen-Mix anfordern'),
        el('button', { class: 'k-knopf k-knopf--klein', onclick: lektionBildschirm }, '🎓 Was passiert hier? (Auflösung)'))));
}

function klick(stufe) {
  const vorher = profil;
  profil = neuesProfil(profil, stufe);
  runden++;
  hinweis = profil > vorher
    ? `Der Algorithmus notiert: Stufe ${stufe} funktioniert bei dir. Er bietet dir jetzt Schärferes an – nicht, weil es stimmt, sondern weil es hält.`
    : 'Milder Klick registriert – die Temperatur sinkt langsam. Der Algorithmus folgt dir auch nach unten, nur träger.';
  if (blasenLage(profil).code === 'geschlossen') {
    einsichtBildschirm();
  } else {
    feedBildschirm();
  }
}

function steuere(aktion) {
  profil = gegensteuern(profil, aktion);
  runden++;
  hinweis = aktion === 'mix'
    ? 'Themen-Mix wirkt am stärksten: Der Algorithmus verliert sein scharfes Bild von dir und muss neu raten.'
    : '„Nicht interessiert“ wirkt – aber langsamer, als ein Klick nach oben zieht. Ein Hebel, kein Zauberknopf.';
  feedBildschirm();
}

function einsichtBildschirm() {
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '🔴'),
      el('p', { class: 'k-untertitel', style: 'font-weight:700' }, 'Deine Blase ist geschlossen.'),
      el('p', {}, `Nach ${runden} Klicks zeigt dir der Feed fast nur noch Feindbilder und „geheimes Wissen“. Merke: Du hast NIE Stufe 5 gesucht – du hast nur angenommen, was dir angeboten wurde. Jede Stufe fühlte sich nur ein bisschen schärfer an als die davor. Genau so funktioniert die Radikalisierungs-Treppe.`),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: lektionBildschirm }, '🎓 Zur Auflösung'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => { profil = gegensteuern(gegensteuern(profil, 'mix'), 'mix'); hinweis = 'Doppelter Themen-Mix: Die Blase ist wieder offen. Im echten Feed dauert das länger – aber es geht.'; feedBildschirm(); } }, '🌈 Blase aufbrechen und weiterforschen'))));
}

function lektionBildschirm() {
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-weight:700;margin-top:0' }, '🎓 Die Auflösung:'),
      ...LEKTIONEN.map((l) => el('p', { style: 'margin:0.5rem 0' }, l)),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(LEKTIONEN.join(' ')) }, '🔊 Vorlesen'),
        el('button', { class: 'k-knopf', onclick: () => starteLauf(thema) }, '🔁 Neuer Lauf'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: startBildschirm }, '🏠 Themenwahl'))));
}

startBildschirm();
