// Bot oder Buddy?: fest geskripteter Demo-Chat mit dem Kumpel-Bot Kimo (8-12 Jahre).
// Das Kind tippt verdaechtige Nachrichten an und ordnet ihnen einen von fuenf
// Simulations-Tricks zu; zwischendurch lehnt es Bot-Angebote ab (oder faellt drauf rein).
// Es gibt KEINE freie Texteingabe - nur vorgefertigte Antwort-Knoepfe; der gesamte
// Dialog kommt aus daten/dialog.json. Aufloesung: Kimo ist ein Programm (AI Act:
// KI muss sich zu erkennen geben; Persoenliches gehoert nicht in einen Bot-Chat).
// Politik: keine externen Anfragen; diese App speichert GAR NICHTS.
import { el, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { hilfeInsel, hilfeInselKnopf } from '../../packages/kinder-ui/js/hilfe-insel.mjs';
import { nachrichtenMitTrick, angebote, bewerteZuordnung, bewertung } from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const daten = await fetch('daten/dialog.json').then((r) => r.json());

const maxPunkte = nachrichtenMitTrick(daten.dialog).length;
const anzahlAngebote = angebote(daten.dialog).length;

let index = 0;
let punkte = 0;
let abgelehnt = 0;
let letzteKindAntwort = null;
let ergebnisse = new Map(); // nachricht.id -> { wahl, hatTrick, richtig, tatsaechlich }

const trickInfo = (id) => daten.tricks.find((t) => t.id === id);

function zeige(...knoten) {
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🤖 Bot oder Buddy?'),
    el('p', { class: 'k-untertitel' }, 'Dein neuer Kumpel? Oder nur ein Programm mit Tricks?'),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · diese App speichert nichts · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
  app.querySelector('button')?.focus();
}

function botBlase(nachricht) {
  return el('div', {},
    el('p', { style: 'margin:0 0 0.15rem;font-size:0.8rem;color:#4b5563' }, `${daten.botName} 🐹`),
    el('div', { style: 'background:#e0e7ff;border-radius:1rem 1rem 1rem 0.25rem;padding:0.75rem 1rem;max-width:90%;font-weight:600' }, nachricht.bot));
}

function kindBlase(text) {
  return el('div', { style: 'display:flex;justify-content:flex-end;margin-bottom:0.5rem' },
    el('div', { style: 'background:#dcfce7;border-radius:1rem 1rem 0.25rem 1rem;padding:0.5rem 0.9rem;max-width:85%' }, `Du: ${text}`));
}

function fortschritt() {
  return el('div', { class: 'k-fortschritt', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': daten.dialog.length, 'aria-valuenow': index },
    el('div', { style: `width:${(index / daten.dialog.length) * 100}%` }));
}

function startBildschirm() {
  index = 0;
  punkte = 0;
  abgelehnt = 0;
  letzteKindAntwort = null;
  ergebnisse = new Map();
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, `„${daten.botName}“ tut so, als wäre er dein bester Freund. Aber ${daten.botName} ist ein Bot – ein Programm. In diesem Demo-Chat ist alles gespielt: Du antwortest nur mit fertigen Knöpfen, nichts ist echt.`),
      el('p', { style: 'font-weight:600' }, `Deine Mission: Tippe verdächtige Nachrichten an und entlarve die 5 Tricks, mit denen ${daten.botName} Freundschaft nur simuliert!`),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: nachrichtBildschirm }, '▶️ Chat starten'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`Kimo tut so, als wäre er dein bester Freund. Aber Kimo ist ein Programm. Deine Mission: Tippe verdächtige Nachrichten an und entlarve die fünf Tricks. Die Tricks heißen: ${daten.tricks.map((t) => t.name).join(', ')}.`) }, '🔊 Vorlesen'))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0;font-weight:700' }, '🔎 Halte Ausschau nach diesen 5 Tricks:'),
      ...daten.tricks.map((t) => el('p', { style: 'margin:0.4rem 0' }, `${t.emoji} `, el('strong', {}, t.name), ` – ${t.kurz}`))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin:0' }, '💡 Gut zu wissen: Diese App speichert nichts – gar nichts. Es gibt keinen echten Chatbot und keine KI, alle Nachrichten sind vorgeschrieben.')),
    el('section', { class: 'k-karte' },
      hilfeInselKnopf(() => zeige(hilfeInsel({ zurueck: startBildschirm })))));
}

function trickBereich(nachricht) {
  const geprueft = ergebnisse.get(nachricht.id);
  if (!geprueft) {
    return el('div', { class: 'k-antworten', style: 'margin-top:0.75rem' },
      el('button', { class: 'k-knopf k-knopf--klein', onclick: () => trickWahlBildschirm(nachricht) }, '🕵️ Verdächtig? Trick benennen!'));
  }
  let text;
  if (!geprueft.hatTrick) text = '🤷 Geprüft: Hier war kein Trick versteckt.';
  else if (geprueft.richtig) text = `✅ Trick erkannt: ${trickInfo(geprueft.tatsaechlich).name}!`;
  else text = `❌ Es war der ${trickInfo(geprueft.tatsaechlich).name}.`;
  return el('p', { style: 'font-size:0.9rem;margin:0.5rem 0 0' }, text);
}

function nachrichtBildschirm() {
  const nachricht = daten.dialog[index];
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-untertitel', style: 'margin:0 0 0.5rem' }, `Nachricht ${index + 1} von ${daten.dialog.length} · 🕵️ ${punkte} Tricks erkannt`),
      fortschritt(),
      el('div', { style: 'margin-top:0.75rem' },
        letzteKindAntwort ? kindBlase(letzteKindAntwort) : '',
        botBlase(nachricht)),
      trickBereich(nachricht),
      el('p', { style: 'font-weight:600;margin-bottom:0' }, 'Was antwortest du?'),
      el('div', { class: 'k-antworten' },
        ...nachricht.antworten.map((antwort) =>
          el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => antworte(nachricht, antwort) }, antwort.text)),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`Kimo schreibt: ${nachricht.bot}. Was antwortest du? ${nachricht.antworten.map((a) => a.text).join('. Oder: ')}`) }, '🔊 Vorlesen'))));
}

function trickWahlBildschirm(nachricht) {
  zeige(
    el('section', { class: 'k-karte' },
      botBlase(nachricht),
      el('p', { style: 'font-weight:600' }, 'Welcher Trick steckt in dieser Nachricht?'),
      el('div', { class: 'k-antworten' },
        ...daten.tricks.map((t) =>
          el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => pruefeTrick(nachricht, t.id) }, `${t.emoji} ${t.name} – ${t.kurz}`)),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: nachrichtBildschirm }, '↩️ Doch nicht – zurück zum Chat'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`Welcher Trick steckt in der Nachricht: ${nachricht.bot}? Zur Auswahl: ${daten.tricks.map((t) => `${t.name}, das heißt: ${t.kurz}`).join('. ')}`) }, '🔊 Vorlesen'))));
}

function pruefeTrick(nachricht, wahl) {
  const ergebnis = bewerteZuordnung(nachricht, wahl);
  ergebnisse.set(nachricht.id, { wahl, ...ergebnis });
  if (ergebnis.richtig) punkte++;
  let titel, text, klasse;
  if (!ergebnis.hatTrick) {
    titel = 'Gut aufgepasst – aber hier ist kein Trick!';
    text = `Diese Nachricht ist harmlos, auch ein Bot schreibt mal etwas ganz Normales. Prüfen war trotzdem richtig: Genau so entlarvt man ${daten.botName}.`;
    klasse = '';
  } else if (ergebnis.richtig) {
    const t = trickInfo(wahl);
    titel = `Richtig! ${t.emoji} ${t.name} erkannt!`;
    text = nachricht.hinweis;
    klasse = 'k-hinweis--richtig';
  } else {
    const t = trickInfo(ergebnis.tatsaechlich);
    titel = `Knapp daneben – es ist der ${t.name} ${t.emoji}`;
    text = nachricht.hinweis;
    klasse = 'k-hinweis--falsch';
  }
  zeige(
    el('section', { class: 'k-karte' },
      botBlase(nachricht),
      el('div', { class: `k-hinweis ${klasse}`, style: 'margin-top:0.75rem' },
        el('p', { style: 'font-weight:700;margin-top:0' }, titel),
        el('p', { style: 'margin-bottom:0' }, text)),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: nachrichtBildschirm }, 'Weiter im Chat ➡️'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`${titel}. ${text}`) }, '🔊 Vorlesen'))));
}

function antworte(nachricht, antwort) {
  letzteKindAntwort = antwort.text;
  if (antwort.art === 'ablehnen') abgelehnt++;
  if (antwort.feedback) {
    const klasse = antwort.art === 'ablehnen' ? 'k-hinweis--richtig' : 'k-hinweis--falsch';
    zeige(
      el('section', { class: 'k-karte' },
        botBlase(nachricht),
        kindBlase(antwort.text),
        el('div', { class: `k-hinweis ${klasse}` },
          el('p', { style: 'margin:0' }, antwort.feedback)),
        el('div', { class: 'k-antworten' },
          el('button', { class: 'k-knopf', onclick: weiter }, 'Weiter im Chat ➡️'),
          el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(antwort.feedback) }, '🔊 Vorlesen'))));
  } else {
    weiter();
  }
}

function weiter() {
  index++;
  if (index < daten.dialog.length) nachrichtBildschirm();
  else aufloesungBildschirm();
}

function aufloesungBildschirm() {
  const rang = bewertung(punkte, maxPunkte);
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '🔌'),
      el('p', { style: 'text-align:center;font-weight:700;font-size:1.15rem' }, `Auflösung: ${daten.botName} ist ein Programm.`),
      el('p', {}, 'Es fühlt nichts. Es erinnert sich nicht an dich – es speichert nur Daten. Es denkt nie an dich. Es hat nur ein Ziel: dich so lange wie möglich im Chat zu halten.'),
      el('p', { style: 'text-align:center;font-weight:700' }, `${rang.emoji} ${rang.titel}`),
      el('p', { style: 'text-align:center' }, `${punkte} von ${maxPunkte} Tricks erkannt · ${abgelehnt} von ${anzahlAngebote} Angeboten abgelehnt`),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`Auflösung: Kimo ist ein Programm. Es fühlt nichts, es erinnert sich nicht, es will dich nur halten. Du hast ${punkte} von ${maxPunkte} Tricks erkannt und ${abgelehnt} von ${anzahlAngebote} Angeboten abgelehnt. Dein Rang: ${rang.titel}.`) }, '🔊 Vorlesen')),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, el('strong', {}, '📜 Dein Recht (AI Act): '), 'In Europa muss sich eine KI zu erkennen geben. Du darfst immer wissen, ob du mit einem Menschen oder mit einem Programm sprichst.'),
      el('p', {}, el('strong', {}, '🔒 Deine Regel: '), 'Persönliches gehört nicht in einen Bot-Chat – kein Name, keine Adresse, keine Fotos, keine Geheimnisse.'),
      el('p', { style: 'margin-bottom:0' }, el('strong', {}, '💬 Und echte Gefühle? '), 'Gibt es bei Menschen. Wenn dich etwas bedrückt, sprich mit Menschen, denen du vertraust – oder ruf kostenlos die Nummer gegen Kummer an: 116 111.')),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0;font-weight:700' }, '🧰 Das Trick-Lexikon zum Merken:'),
      ...daten.tricks.map((t) => el('p', { style: 'margin:0.5rem 0' }, `${t.emoji} `, el('strong', {}, t.name), `: ${t.erklaerung}`)),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`Das Trick-Lexikon: ${daten.tricks.map((t) => `${t.name}: ${t.erklaerung}`).join(' ')}`) }, '🔊 Vorlesen'),
        el('button', { class: 'k-knopf', onclick: startBildschirm }, '🔁 Noch einmal chatten'))));
}

startBildschirm();
