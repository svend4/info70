// Reim-Werkstatt (5-8, mit 5-6 in Ko-Nutzung): Reimwörter finden,
// Reimrätsel lösen und Quatschreime bauen. Praleska docs/10
// (Kinder-Apps Nr. 20). Abgrenzung: reim-radar prüft das Hören ab
// (Reim ja/nein), hier wird selbst gereimt und gebaut.
// Politik docs/02: keine externen Anfragen, es wird nichts gespeichert.
import { el, vorlesen, mischen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { boot as bootAnzeige } from '../../packages/kinder-ui/js/anzeige.mjs';
import { baueRaetsel, baueQuatsch, quatschVielfalt, reimpartner, pruefeDaten } from './logik.mjs';

installiereNetzwerkWaechter();
bootAnzeige();

const app = document.getElementById('app');
const daten = await fetch('daten/reime.json').then((r) => r.json());
const zufall = (liste) => liste[Math.floor(Math.random() * liste.length)];

let modus = 'familien';
let offeneFamilie = null;
let raetsel = null;
let raetselAntwort = null;
let geloest = 0;
let quatsch = null;

function zeige(...knoten) {
  app.replaceChildren(...[
    el('h1', { class: 'k-titel' }, '🎵 Reim-Werkstatt'),
    el('p', { class: 'k-untertitel' }, 'Wörter, die gleich ausklingen – finden, raten, selbst bauen'),
    el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Modus' },
      ...[['familien', '👨‍👩‍👧 Reimfamilien'], ['raetsel', '🧩 Reimrätsel'], ['quatsch', '🤪 Quatschreime']].map(([id, name]) =>
        el('button', {
          class: `k-knopf k-knopf--klein ${modus === id ? '' : 'k-knopf--neutral'}`,
          'aria-pressed': String(modus === id),
          // Laufende Aufgabe verwerfen: sonst bliebe ein schon gelöstes
          // Rätsel nach dem Moduswechsel erneut anklickbar.
          onclick: () => { modus = id; raetsel = null; raetselAntwort = null; quatsch = null; render(); },
        }, name))),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · offline · nichts wird gespeichert · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')),
  ].filter(Boolean));
}

// ---------- Modus 1: Reimfamilien ----------
function familienKarten() {
  const familie = offeneFamilie ? daten.familien.find((f) => f.id === offeneFamilie) : null;
  return [
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, 'Wörter, die hinten gleich klingen, gehören zusammen – wie eine Familie. Tippe eine Endung an und höre, wer alles dazugehört.'),
      el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Reimfamilie wählen' },
        ...daten.familien.map((f) => el('button', {
          class: `k-knopf k-knopf--klein ${offeneFamilie === f.id ? '' : 'k-knopf--neutral'}`,
          'aria-pressed': String(offeneFamilie === f.id),
          onclick: () => { offeneFamilie = offeneFamilie === f.id ? null : f.id; render(); },
        }, `${f.emoji} -${f.endung}`)))),
    familie
      ? el('section', { class: 'k-karte' },
        el('h2', { style: 'margin-top:0' }, `${familie.emoji} Die -${familie.endung}-Familie`),
        el('p', { style: 'font-size:1.3rem;line-height:1.8;margin:0.3rem 0' },
          ...familie.woerter.flatMap((w, i) => [
            el('span', { style: 'display:inline-block;padding:0.1rem 0.5rem;margin:0.15rem;border:2px solid var(--k-rand);border-radius:0.6rem' }, w),
            i < familie.woerter.length - 1 ? el('span', { 'aria-hidden': 'true' }, ' ') : null,
          ].filter(Boolean))),
        el('p', { style: 'margin:0.3rem 0' }, `Alle enden auf „-${familie.endung}“. Sprich sie langsam und laut – hörst du, wie sie hinten gleich klingen?`),
        el('button', {
          class: 'k-knopf k-knopf--neutral k-knopf--klein',
          onclick: () => vorlesen(`Die ${familie.endung} Familie. ${familie.woerter.join('. ')}.`),
        }, '🔊 Alle vorlesen'))
      : el('section', { class: 'k-karte' },
        el('p', { style: 'margin:0' }, '👉 Tipp: Such dir zu Hause selbst ein Wort und klopfe die Familie ab. Reimt sich „Tür“ auf „für“? Sprich beide laut aus, dann hörst du es.')),
  ];
}

// ---------- Modus 2: Reimrätsel ----------
function neuesRaetsel() {
  raetsel = baueRaetsel(daten, zufall, mischen, raetsel);
  raetselAntwort = null;
  render();
}

function antworteRaetsel(wort) {
  const richtig = wort === raetsel.raetsel.loesung;
  if (richtig) geloest += 1;
  raetselAntwort = { wort, richtig };
  render();
}

function raetselKarten() {
  if (!raetsel) {
    return [el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, 'Zwei Zeilen, das letzte Wort fehlt. Nur eines der drei Wörter klingt hinten so wie das Ende der ersten Zeile.'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: neuesRaetsel }, '🧩 Erstes Rätsel')))];
  }
  const r = raetsel.raetsel;
  const geloestText = `${r.zeile1}, ${r.zeile2Vor} ${r.loesung}.`;
  return [
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, raetsel.familie.emoji),
      el('p', { style: 'font-size:1.2rem;text-align:center;line-height:1.7;margin:0.3rem 0' },
        r.zeile1, el('br', {}),
        r.zeile2Vor, ' ',
        el('span', { style: 'border-bottom:3px dotted var(--k-tinte);padding:0 1.2rem' },
          raetselAntwort ? raetselAntwort.wort : el('span', { 'aria-label': 'hier fehlt das Reimwort' }, '?'))),
      el('button', {
        class: 'k-knopf k-knopf--neutral k-knopf--klein',
        onclick: () => vorlesen(`${r.zeile1}. ${r.zeile2Vor} … Was passt: ${raetsel.optionen.join('. Oder: ')}?`),
      }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Reimwort wählen' },
        ...(raetselAntwort
          ? [el('button', { class: 'k-knopf', onclick: neuesRaetsel }, 'Nächstes Rätsel ➡️')]
          : raetsel.optionen.map((w) => el('button', {
            class: 'k-knopf k-knopf--neutral',
            onclick: () => antworteRaetsel(w),
          }, w)))),
      raetselAntwort
        ? el('div', { class: `k-hinweis${raetselAntwort.richtig ? ' k-hinweis--richtig' : ''}` },
          el('p', { style: 'margin:0 0 0.3rem;font-weight:700' },
            raetselAntwort.richtig ? '🌟 Das reimt sich!' : '💭 Das klingt hinten anders.'),
          el('p', { style: 'margin:0' },
            `„${r.loesung}“ passt: Es klingt genauso aus wie „${(r.zeile1.split(/\s+/).pop() || '').replace(/[^\wÄÖÜäöüß]+$/u, '')}“ – beide enden auf „-${raetsel.familie.endung}“.`),
          el('button', {
            class: 'k-knopf k-knopf--neutral k-knopf--klein',
            style: 'margin-top:0.5rem',
            onclick: () => vorlesen(geloestText),
          }, '🔊 Ganzen Vers hören'))
        : null,
      el('p', { style: 'text-align:center;margin:0.5rem 0 0' }, `Gelöste Rätsel: ${geloest}`)),
  ];
}

// ---------- Modus 3: Quatschreime ----------
function neuerQuatsch() {
  quatsch = baueQuatsch(daten, zufall, quatsch);
  render();
}

function quatschKarten() {
  if (!quatsch) {
    return [el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, `Ein Reim muss keinen Sinn ergeben – lustig darf er sein. Die Werkstatt baut dir einen Anfang und eine Reimzeile dazu, ${quatschVielfalt(daten)} Möglichkeiten hat sie.`),
      el('p', {}, 'Danach bist du dran: Denk dir eine eigene zweite Zeile aus, die genauso ausklingt.'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: neuerQuatsch }, '🤪 Ersten Quatschreim bauen')))];
  }
  const vers = `${quatsch.rahmen.zeile1}, ${quatsch.endung}`;
  const partner = reimpartner(daten, quatsch.familie.woerter[0]);
  return [
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, quatsch.familie.emoji),
      el('p', { style: 'font-size:1.25rem;text-align:center;line-height:1.7;margin:0.3rem 0' },
        quatsch.rahmen.zeile1, ',', el('br', {}), quatsch.endung),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(vers) }, '🔊 Vorlesen'),
        el('button', { class: 'k-knopf', onclick: neuerQuatsch }, '🎲 Noch einen'))),
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.05rem' }, '✏️ Jetzt du'),
      el('p', { style: 'margin-top:0' }, `Denk dir eine andere zweite Zeile aus. Sie muss auf „-${quatsch.familie.endung}“ enden. Diese Wörter passen:`),
      el('p', { style: 'font-size:1.15rem;margin:0.2rem 0' }, quatsch.familie.woerter.join(' · ')),
      el('p', { style: 'margin:0.4rem 0 0' }, 'Sag sie laut auf. Wenn es hinten gleich klingt, hast du gereimt – auch wenn der Satz Quatsch ist.'),
      partner ? el('button', {
        class: 'k-knopf k-knopf--neutral k-knopf--klein',
        style: 'margin-top:0.5rem',
        onclick: () => vorlesen(`Diese Wörter reimen sich: ${quatsch.familie.woerter.join('. ')}.`),
      }, '🔊 Reimwörter hören') : null),
  ];
}

function render() {
  const karten = modus === 'familien' ? familienKarten() : modus === 'raetsel' ? raetselKarten() : quatschKarten();
  zeige(...karten.filter(Boolean));
}

const fehler = pruefeDaten(daten);
if (fehler.length) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' }, el('p', { style: 'margin:0' }, `Datenfehler: ${fehler[0]}`)));
} else {
  render();
}
