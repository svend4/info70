// Deepfake-Studio: konstruktionistischer Simulator (8-12 Jahre).
// Das Kind baut in 3 Schritten selbst eine Fake-Schlagzeile (WER -> WAS ->
// Beweis-Optik) und erlebt an der Stoppuhr, WIE schnell Fälschen geht.
// Danach: Erkennungs-Checkliste + AI-Act-Lektion (Kennzeichnungspflicht).
// Nur FIKTIVE Rollen aus Wolkenstadt - niemals echte Personen!
// Politik: keine externen Anfragen; diese App speichert GAR NICHTS.
import { el, vorlesen, mischen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { baueKarte, naechsterTeilenWert, dauerText, KENNZEICHNUNG } from './studio.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const daten = await fetch('daten/bausteine.json').then((r) => r.json());

let auswahl;
let startZeit;
let dauerMs;
let karte;
let tickTimer = null;

function zeige(...knoten) {
  if (tickTimer !== null) {
    clearInterval(tickTimer);
    tickTimer = null;
  }
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🎭 Deepfake-Studio'),
    el('p', { class: 'k-untertitel' }, 'Bau selbst einen Fake – und durchschau ihn für immer.'),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · diese App speichert nichts · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
  app.querySelector('button')?.focus();
}

function schritt(nummer, text) {
  return el('p', { class: 'k-untertitel', style: 'margin-top:0' }, `Schritt ${nummer} von 3 · ${text}`);
}

function startBildschirm() {
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, 'Im Internet sehen manche Nachrichten täuschend echt aus – und sind trotzdem komplett erfunden. Heute wechselst du die Seite: Du baust selbst so einen Fake. Denn wer einmal selbst gefälscht hat, erkennt Fälschungen viel schneller.'),
      el('p', {}, '⏱️ Eine Stoppuhr läuft mit. Du wirst staunen, wie schnell das geht.'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteStudio }, '🎬 Studio öffnen'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen('Im Internet sehen manche Nachrichten täuschend echt aus und sind trotzdem komplett erfunden. Heute baust du selbst so einen Fake. Denn wer einmal selbst gefälscht hat, erkennt Fälschungen viel schneller. Eine Stoppuhr läuft mit.') }, '🔊 Vorlesen'))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin:0' }, '💡 Wichtig: Hier gibt es nur Spaßfiguren aus der erfundenen Wolkenstadt. Über echte Menschen baut man KEINE Fakes – das verletzt und kann verboten sein. Und: Diese App speichert nichts – gar nichts.')));
}

function starteStudio() {
  auswahl = { werId: null, wasId: null, mitFoto: false, mitAugenzeuge: false, mitKommentaren: false, mitTeilen: false };
  karte = null;
  dauerMs = 0;
  startZeit = Date.now();
  werBildschirm();
}

function werBildschirm() {
  zeige(
    el('section', { class: 'k-karte' },
      schritt(1, 'WER soll es angeblich getan haben?'),
      el('p', {}, 'Such dir eine erfundene Person aus Wolkenstadt aus:'),
      el('div', { class: 'k-antworten' },
        ...mischen(daten.wer).map((b) =>
          el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => { auswahl.werId = b.id; wasBildschirm(); } }, `${b.emoji} ${b.text}`)),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`Schritt 1: Wer soll es angeblich getan haben? Such dir eine erfundene Person aus: ${daten.wer.map((b) => b.text).join('. Oder: ')}`) }, '🔊 Vorlesen'))));
}

function wasBildschirm() {
  zeige(
    el('section', { class: 'k-karte' },
      schritt(2, 'WAS soll angeblich passiert sein?'),
      el('p', {}, 'Such dir eine verrückte (und harmlose) Tat aus:'),
      el('div', { class: 'k-antworten' },
        ...mischen(daten.was).map((b) =>
          el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => { auswahl.wasId = b.id; beweisBildschirm(); } }, `${b.emoji} ${b.text}`)),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`Schritt 2: Was soll angeblich passiert sein? ${daten.was.map((b) => b.text).join('. Oder: ')}`) }, '🔊 Vorlesen'))));
}

const BEWEIS_OPTIONEN = [
  { schluessel: 'mitFoto', text: '📸 „Beweis“-Foto einbauen' },
  { schluessel: 'mitAugenzeuge', text: '🗣️ Augenzeugen-Stimme dazu' },
  { schluessel: 'mitKommentaren', text: '💬 Aufgeregte Kommentare dazu' },
  { schluessel: 'mitTeilen', text: '🔁 Teilen-Zähler, der hochtickt' },
];

function beweisBildschirm() {
  zeige(
    el('section', { class: 'k-karte' },
      schritt(3, 'Beweis-Optik – so wirkt der Fake „echt“'),
      el('p', {}, 'Echte Beweise hast du natürlich keine. Aber Fälscher*innen bauen Dinge ein, die nur so AUSSEHEN wie Beweise. Tippe an, was du einbauen willst:'),
      el('div', { class: 'k-antworten' },
        ...BEWEIS_OPTIONEN.map((o) =>
          el('button', {
            class: 'k-knopf k-knopf--neutral',
            'aria-pressed': auswahl[o.schluessel] ? 'true' : 'false',
            onclick: () => { auswahl[o.schluessel] = !auswahl[o.schluessel]; beweisBildschirm(); },
          }, `${auswahl[o.schluessel] ? '✅' : '⬜'} ${o.text}`)),
        el('button', {
          class: 'k-knopf',
          onclick: () => {
            dauerMs = Date.now() - startZeit;
            karte = baueKarte(auswahl, daten);
            karteBildschirm();
          },
        }, '🚀 Fake veröffentlichen (nur zum Schein!)'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen('Schritt 3: Beweis-Optik. Echte Beweise hast du keine. Aber Fälscherinnen und Fälscher bauen Dinge ein, die nur so aussehen wie Beweise: ein Foto, Augenzeugen, aufgeregte Kommentare oder einen Teilen-Zähler. Tippe an, was du einbauen willst.') }, '🔊 Vorlesen'))));
}

function newsKarte() {
  const teile = [
    el('div', { style: 'display:flex;justify-content:space-between;align-items:center;gap:0.5rem;border-bottom:3px solid var(--k-rot);padding-bottom:0.3rem;margin-bottom:0.5rem;flex-wrap:wrap' },
      el('strong', { style: 'font-family:Georgia,serif;letter-spacing:0.05em' }, daten.zeitung.toUpperCase()),
      el('span', { style: 'background:var(--k-rot);color:#fff;font-weight:700;padding:0.1rem 0.4rem;border-radius:0.25rem;font-size:0.75rem' }, '+++ EILMELDUNG +++')),
    el('h2', { style: 'font-family:Georgia,serif;margin:0.3rem 0;line-height:1.25' }, karte.schlagzeile),
  ];
  if (karte.fotoEmojis) {
    teile.push(el('figure', { style: 'margin:0.5rem 0;text-align:center;background:#e5e7eb;border-radius:0.5rem;padding:0.75rem' },
      el('div', { style: 'font-size:3rem', 'aria-hidden': 'true' }, karte.fotoEmojis),
      el('figcaption', { style: 'font-size:0.75rem;color:#4b5563' }, 'Foto: angeblich vom Ort des Geschehens')));
  }
  if (karte.augenzeuge) teile.push(el('p', { style: 'font-style:italic;margin:0.5rem 0' }, `🗣️ ${karte.augenzeuge}`));
  if (karte.kommentare.length > 0) {
    teile.push(el('p', { style: 'margin:0.5rem 0 0.25rem;font-size:0.85rem;color:#4b5563' }, '💬 Kommentare:'));
    for (const k of karte.kommentare) {
      teile.push(el('p', { style: 'margin:0.15rem 0;font-size:0.9rem' }, el('strong', {}, `${k.name}: `), k.text));
    }
  }
  if (karte.teilen !== null) {
    teile.push(el('p', { style: 'font-weight:700;margin:0.5rem 0 0' }, '🔁 ', el('span', { id: 'teilen-zaehler' }, String(karte.teilen)), '-mal geteilt · gerade eben'));
  }
  const stempel = el('div', {
    role: 'note',
    'aria-label': `Kennzeichnung: Diese Meldung ist ${KENNZEICHNUNG.toLowerCase()}`,
    style: 'position:absolute;top:45%;left:50%;transform:translate(-50%,-50%) rotate(-12deg);border:5px solid var(--k-rot);color:var(--k-rot);font-weight:900;font-size:1.9rem;padding:0.15rem 0.9rem;border-radius:0.5rem;background:rgba(255,255,255,0.8);letter-spacing:0.08em;pointer-events:none',
  }, KENNZEICHNUNG);
  return el('section', { class: 'k-karte', style: 'position:relative' }, ...teile, stempel);
}

function starteTeilenTicker() {
  if (karte.teilen === null) return;
  if (globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
  tickTimer = setInterval(() => {
    karte.teilen = naechsterTeilenWert(karte.teilen);
    const ziel = document.getElementById('teilen-zaehler');
    if (ziel) ziel.textContent = String(karte.teilen);
    if (karte.teilen > 500 && tickTimer !== null) {
      clearInterval(tickTimer);
      tickTimer = null;
    }
  }, 800);
}

function karteBildschirm() {
  zeige(
    newsKarte(),
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '⏱️'),
      el('p', { style: 'text-align:center;font-weight:700' }, `Du hast nur ${dauerText(dauerMs)} gebraucht – so schnell geht Fälschen!`),
      el('p', {}, 'Kein Beweis war echt: kein Foto, keine Augenzeugen, keine Kommentare. Trotzdem sieht die Meldung aus wie eine richtige Nachricht. Genau so schnell bauen andere Leute Fakes, die DIR im Netz begegnen.'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: checklisteBildschirm }, '🔍 Wie fliegt so ein Fake auf?'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`Deine Schlagzeile: ${karte.schlagzeile} Du hast nur ${dauerText(dauerMs)} gebraucht. So schnell geht Fälschen! Kein Beweis war echt. Trotzdem sieht die Meldung aus wie eine richtige Nachricht.`) }, '🔊 Vorlesen'))));
  starteTeilenTicker();
}

function checklisteBildschirm() {
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-untertitel', style: 'margin-top:0' }, '🔍 Fake-Check: 4 Fragen, die Fälschungen entlarven'),
      el('div', { class: 'k-hinweis' }, el('p', { style: 'margin:0' }, el('strong', {}, '1. Quelle? '), `Wer berichtet das eigentlich? Den „${daten.zeitung}“ gibt es gar nicht – so wie viele Fake-Seiten.`)),
      el('div', { class: 'k-hinweis' }, el('p', { style: 'margin:0' }, el('strong', {}, '2. Andere Medien? '), 'Berichten bekannte Nachrichtenseiten dasselbe? Eine echte Riesen-Meldung steht nie nur an EINER Stelle.')),
      el('div', { class: 'k-hinweis' }, el('p', { style: 'margin:0' }, el('strong', {}, '3. Rückwärtssuche? '), 'Bilder kann man rückwärts suchen (frag Erwachsene, wie das geht). Oft stammt das „Beweis“-Foto aus einem ganz anderen Zusammenhang.')),
      el('div', { class: 'k-hinweis' }, el('p', { style: 'margin:0' }, el('strong', {}, '4. Kennzeichnung? '), 'Steht irgendwo, dass der Inhalt erfunden oder mit KI gemacht ist? Fehlt jede Kennzeichnung, ist das ein Warnsignal.')),
      el('p', {}, 'Und denk an deinen eigenen Fake: Augenzeugen, Kommentare und Teilen-Zahlen konntest du frei erfinden – die beweisen also GAR NICHTS.'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: lektionBildschirm }, '⚖️ Und was sagt das Gesetz?'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen('Fake-Check mit vier Fragen. Erstens: Quelle? Wer berichtet das eigentlich? Zweitens: Berichten andere bekannte Nachrichtenseiten dasselbe? Drittens: Rückwärtssuche. Bilder kann man rückwärts suchen, oft stammt das Foto aus einem ganz anderen Zusammenhang. Viertens: Kennzeichnung. Steht irgendwo, dass der Inhalt erfunden oder mit KI gemacht ist? Fehlt jede Kennzeichnung, ist das ein Warnsignal.') }, '🔊 Vorlesen'))));
}

function lektionBildschirm() {
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '⚖️'),
      el('p', { class: 'k-untertitel', style: 'font-weight:700' }, 'Die KI-Regel der EU (AI Act)'),
      el('p', {}, 'In Europa gilt ein Gesetz für Künstliche Intelligenz. Eine seiner Regeln: Wenn Bilder, Stimmen oder Videos mit KI erzeugt oder verfälscht sind (Deepfakes), muss das klar gekennzeichnet sein – man darf Menschen damit nicht täuschen.'),
      el('div', { class: 'k-hinweis k-hinweis--richtig' },
        el('p', { style: 'margin:0' }, `Ist dir der große Stempel „${KENNZEICHNUNG}“ auf deiner News-Karte aufgefallen? Diese App hält sich selbst an die Regel: Jede Fälschung wird gekennzeichnet. Ohne Stempel wäre deine Karte eine Täuschung – mit Stempel ist sie ein Lernspiel.`)),
      el('p', {}, '🧡 Und noch etwas Wichtiges: Hier gab es nur Spaßfiguren aus Wolkenstadt. Fakes über ECHTE Menschen – auch über Mitschüler*innen – verletzen, können strafbar sein und sind nie ein Witz.'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen('In Europa gilt ein Gesetz für Künstliche Intelligenz. Wenn Bilder, Stimmen oder Videos mit KI erzeugt oder verfälscht sind, muss das klar gekennzeichnet sein. Darum trägt deine News-Karte den großen Stempel Erfunden. Und ganz wichtig: Fakes über echte Menschen verletzen, können strafbar sein und sind nie ein Witz.') }, '🔊 Vorlesen'),
        el('button', { class: 'k-knopf', onclick: starteStudio }, '🔁 Noch einen Fake bauen'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: startBildschirm }, '🏠 Zum Start'))));
}

startBildschirm();
