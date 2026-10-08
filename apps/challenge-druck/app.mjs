// Challenge-Druck-Simulator: Gruppendruck als Mechanik durchschauen (8-12).
// Ein geskripteter Gruppenchat draengt zu einer riskanten Challenge. Das Kind
// benennt bei jeder Nachricht die Druck-Taktik (Druck-Messer sinkt bei
// Treffer!) und sammelt am Ende erprobte Ausstiegs-Saetze.
// Politik docs/02: keine Texteingabe, keine externen Anfragen, speichert NICHTS.
import { el, vorlesen, mischen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { hilfeInsel, hilfeInselKnopf } from '../../packages/kinder-ui/js/hilfe-insel.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const daten = await fetch('daten/szenarien.json').then((r) => r.json());
const TAKTIKEN = Object.entries(daten.taktiken).map(([code, tk]) => ({ code, ...tk }));

let szenario = null;
let schritt = 0;      // Index in chat (ab 1: Druck-Nachrichten)
let druck = 50;
let treffer = 0;
let feedback = null;

function zeige(...knoten) {
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🧲 Challenge-Druck'),
    el('p', { class: 'k-untertitel' }, 'Spür den Druck – und benenn den Trick.'),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · diese App speichert nichts · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
  app.querySelector('button')?.focus();
}

function druckMesser() {
  const farbe = druck >= 70 ? 'var(--k-rot)' : druck >= 40 ? '#f59e0b' : 'var(--k-gruen)';
  return el('div', {},
    el('p', { style: 'font-weight:600;margin-bottom:0.25rem' }, `🧲 Druck-Messer: ${druck} von 100`),
    el('div', { class: 'k-fortschritt', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': druck },
      el('div', { style: `width:${druck}%;background:${farbe}` })));
}

function startBildschirm() {
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, 'Im Gruppenchat taucht eine riskante Challenge auf – und alle schieben. Deine Aufgabe als Druck-Detektiv*in: Erkenne bei jeder Nachricht, WELCHER Trick gerade an dir zieht. Jeder erkannte Trick lässt den Druck sinken.'),
      el('p', { style: 'font-weight:600' }, 'Wähle deinen Fall:'),
      el('div', { class: 'k-antworten' },
        ...daten.szenarien.map((s) =>
          el('button', { class: 'k-knopf', onclick: () => starteSzenario(s) }, `▶️ ${s.titel}`)),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen('Im Gruppenchat taucht eine riskante Challenge auf. Erkenne bei jeder Nachricht, welcher Trick gerade an dir zieht.') }, '🔊 Vorlesen'))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin:0' }, '💡 Kein echter Chat, keine Eingabe, nichts wird gespeichert. Und klar: Die Challenges hier sind Beispiele fürs NEIN-Üben – nicht zum Nachmachen.')),
    el('section', { class: 'k-karte' },
      hilfeInselKnopf(() => zeige(hilfeInsel({ zurueck: startBildschirm })))));
}

function starteSzenario(s) {
  szenario = s;
  schritt = 1;
  druck = 50;
  treffer = 0;
  feedback = null;
  chatBildschirm();
}

function chatBildschirm() {
  if (schritt >= szenario.chat.length) return ausstiegBildschirm();
  const nachricht = szenario.chat[schritt];
  const optionen = mischen(TAKTIKEN);
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-untertitel', style: 'margin-top:0' }, `${szenario.titel} · Nachricht ${schritt} von ${szenario.chat.length - 1}`),
      druckMesser(),
      el('div', { class: 'k-hinweis', style: 'margin-top:0.75rem' },
        el('p', { style: 'margin:0;font-size:0.9rem;color:#4b5563' }, `💬 ${szenario.chat[0].von}: „${szenario.chat[0].text}“`),
        el('p', { style: 'margin:0.5rem 0 0;font-weight:600' }, `💬 ${nachricht.von}: „${nachricht.text}“`)),
      feedback ? el('div', { class: `k-hinweis ${feedback.richtig ? 'k-hinweis--richtig' : 'k-hinweis--falsch'}`, style: 'margin-top:0.5rem' },
        el('p', { style: 'margin:0;font-size:0.9rem' }, feedback.text)) : '',
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`${nachricht.text}. Welcher Druck-Trick ist das?`) }, '🔊 Vorlesen'),
      el('p', { style: 'font-weight:600' }, 'Welcher Druck-Trick ist das?'),
      el('div', { class: 'k-antworten' },
        ...optionen.map((tk) =>
          el('button', {
            class: 'k-knopf k-knopf--neutral',
            onclick: () => {
              const richtig = tk.code === nachricht.taktik;
              const echte = daten.taktiken[nachricht.taktik];
              if (richtig) { treffer++; druck = Math.max(0, druck - 12); }
              else { druck = Math.min(100, druck + 8); }
              feedback = {
                richtig,
                text: richtig
                  ? `Trick durchschaut! ${echte.emoji} ${echte.name}: ${echte.erklaerung}`
                  : `Das war ${echte.emoji} ${echte.name}: ${echte.erklaerung}`,
              };
              schritt++;
              chatBildschirm();
            },
          }, `${tk.emoji} ${tk.name}`)))));
}

function ausstiegBildschirm() {
  const stark = treffer >= 4;
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, stark ? '🦸' : '🧲'),
      el('p', { class: 'k-untertitel', style: 'font-weight:700' }, `${treffer} von 5 Tricks durchschaut · Druck am Ende: ${druck}`),
      feedback ? el('div', { class: `k-hinweis ${feedback.richtig ? 'k-hinweis--richtig' : 'k-hinweis--falsch'}` },
        el('p', { style: 'margin:0;font-size:0.9rem' }, feedback.text)) : '',
      el('p', { style: 'font-weight:600' }, 'Und jetzt der wichtigste Teil – so steigst du aus:'),
      ...daten.ausstiege.map((a) => el('p', { style: 'margin:0.4rem 0' }, `🗣️ ${a}`)),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`So steigst du aus: ${daten.ausstiege.join(' Oder: ')}`) }, '🔊 Vorlesen')),
    el('section', { class: 'k-karte' },
      ...daten.lektionen.map((l) => el('p', {}, l)),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: startBildschirm }, '🔁 Nächster Fall'))));
}

startBildschirm();
