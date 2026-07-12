// Takt-Pause: die Bildschirmzeit-Ampel (8-12 Jahre).
// Selbstbeobachtung statt Fremdkontrolle: Das Kind plant selbst, wie lange
// es Medien nutzt, die Ampel zeigt den Takt, die Pause wird gefeiert.
// Bewusst OHNE Push-Benachrichtigungen (keine Berechtigungs-Abfragen,
// Privacy by default) - das Signal ist sichtbar und optional hörbar (Vorlesen).
// Politik: keine externen Anfragen; localStorage nur Tagesstatistik + laufende Sitzung.
import { el, vorlesen, mischen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { ampelFarbe, formatZeit, aktualisiereTag } from './logik.mjs';

installiereNetzwerkWaechter();

const TAG_SCHLUESSEL = 'tp.heute';
const LAUFEND_SCHLUESSEL = 'tp.laufend';
const app = document.getElementById('app');

const AKTIVITAETEN = [
  { code: 'video', name: 'Videos schauen', emoji: '🎬' },
  { code: 'spielen', name: 'Spielen', emoji: '🎮' },
  { code: 'chatten', name: 'Chatten', emoji: '💬' },
  { code: 'lernen', name: 'Lernen & Stöbern', emoji: '📚' },
];
const DAUERN = [15, 30, 45, 60];
const PAUSEN_IDEEN = [
  '🪟 Fenster auf und dreimal tief durchatmen',
  '💧 Ein großes Glas Wasser trinken',
  '🤸 Zehn Hampelmänner',
  '👀 Augen-Trick: 20 Sekunden aus dem Fenster in die Ferne schauen',
  '🚶 Einmal durch die ganze Wohnung laufen',
  '🎧 Ein Lied lang tanzen – ohne Bildschirm',
  '🐢 Schultern kreisen, Nacken strecken – wie eine Schildkröte',
  '🍎 Einen Snack holen und in Ruhe essen',
];

const FARBEN = { gruen: '#15803d', gelb: '#f59e0b', rot: '#b91c1c' };

let tickTimer = null;
let rotGemeldet = false;

const ladeTag = () => JSON.parse(localStorage.getItem(TAG_SCHLUESSEL) ?? 'null');
const ladeLaufend = () => JSON.parse(localStorage.getItem(LAUFEND_SCHLUESSEL) ?? 'null');

function zeige(...knoten) {
  clearInterval(tickTimer);
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🚦 Takt-Pause'),
    el('p', { class: 'k-untertitel' }, 'Du bestimmst den Takt – die Ampel hilft dir.'),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · Daten bleiben auf diesem Gerät · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
  app.querySelector('button')?.focus();
}

function startBildschirm() {
  const tag = aktualisiereTag(ladeTag(), {});
  const wahl = { aktivitaet: null, dauer: null };

  const render = () => {
    zeige(
      el('section', { class: 'k-karte' },
        el('p', { style: 'font-weight:600;margin-top:0' }, '1. Was hast du vor?'),
        el('div', { class: 'k-antworten' },
          ...AKTIVITAETEN.map((a) =>
            el('button', {
              class: `k-knopf ${wahl.aktivitaet === a.code ? '' : 'k-knopf--neutral'}`,
              'aria-pressed': String(wahl.aktivitaet === a.code),
              onclick: () => { wahl.aktivitaet = a.code; render(); },
            }, `${a.emoji} ${a.name}`))),
        el('p', { style: 'font-weight:600' }, '2. Wie lange soll dein Takt sein?'),
        el('div', { style: 'display:flex;gap:0.5rem;flex-wrap:wrap' },
          ...DAUERN.map((min) =>
            el('button', {
              class: `k-knopf k-knopf--klein ${wahl.dauer === min ? '' : 'k-knopf--neutral'}`,
              'aria-pressed': String(wahl.dauer === min),
              onclick: () => { wahl.dauer = min; render(); },
            }, `${min} min`))),
        el('div', { class: 'k-antworten' },
          el('button', {
            class: 'k-knopf',
            disabled: !(wahl.aktivitaet && wahl.dauer),
            onclick: () => starteTakt(wahl.aktivitaet, wahl.dauer),
          }, wahl.aktivitaet && wahl.dauer ? '🚦 Takt starten!' : 'Wähle Aktivität und Zeit …'))),
      el('section', { class: 'k-karte' },
        el('p', { style: 'margin-top:0' }, `Heute: ${tag.geplantMin} Minuten geplant · ${tag.pausen} Pause${tag.pausen === 1 ? '' : 'n'} geschafft ${tag.pausen >= 3 ? '🏆' : tag.pausen >= 1 ? '💪' : ''}`),
        el('p', { style: 'font-size:0.9rem' }, '💡 Takt-Regel: Erst planen, dann losschauen – und die Pause gehört dazu wie das Ausatmen zum Atmen.'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => { localStorage.clear(); startBildschirm(); } }, 'Meine Daten löschen')));
  };
  render();
}

function starteTakt(aktivitaet, dauerMin) {
  localStorage.setItem(TAG_SCHLUESSEL, JSON.stringify(aktualisiereTag(ladeTag(), { geplantMin: dauerMin })));
  localStorage.setItem(LAUFEND_SCHLUESSEL, JSON.stringify({
    aktivitaet,
    dauerMin,
    ende: Date.now() + dauerMin * 60 * 1000,
  }));
  rotGemeldet = false;
  laufBildschirm();
}

function laufBildschirm() {
  const laufend = ladeLaufend();
  if (!laufend) return startBildschirm();
  const akt = AKTIVITAETEN.find((a) => a.code === laufend.aktivitaet) ?? AKTIVITAETEN[0];
  const gesamtSek = laufend.dauerMin * 60;

  const zeitAnzeige = el('p', { class: 'k-gross', style: 'font-variant-numeric:tabular-nums' }, '–:––');
  const ampel = el('div', {
    style: 'width:5rem;height:5rem;border-radius:50%;margin:0 auto;border:4px solid var(--k-rand);transition:background 0.5s',
    role: 'img', 'aria-label': 'Zeit-Ampel',
  });
  const balken = el('div', { class: 'k-fortschritt' }, el('div', { style: 'width:0%' }));
  const hinweis = el('p', { style: 'text-align:center;min-height:1.5rem' }, '');

  const tick = () => {
    const restSek = (laufend.ende - Date.now()) / 1000;
    const anteil = (gesamtSek - restSek) / gesamtSek;
    const farbe = ampelFarbe(anteil);
    zeitAnzeige.textContent = formatZeit(restSek);
    ampel.style.background = FARBEN[farbe];
    balken.firstChild.style.width = `${Math.min(100, Math.round(anteil * 100))}%`;
    if (farbe === 'gelb') hinweis.textContent = '🟡 Gleich ist Pausen-Zeit – such dir einen guten Stopp-Punkt!';
    if (farbe === 'rot' && !rotGemeldet) {
      rotGemeldet = true;
      vorlesen('Rot! Zeit für deine Pause. Du schaffst das!');
      clearInterval(tickTimer);
      pauseBildschirm();
    }
  };

  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-untertitel', style: 'margin-top:0' }, `${akt.emoji} ${akt.name} · ${laufend.dauerMin} Minuten geplant`),
      ampel,
      zeitAnzeige,
      balken,
      hinweis,
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--richtig', onclick: () => { clearInterval(tickTimer); pauseBildschirm(); } }, '⏸️ Ich mach JETZT schon Pause (stark!)'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => { localStorage.removeItem(LAUFEND_SCHLUESSEL); clearInterval(tickTimer); startBildschirm(); } }, 'Abbrechen'))));
  tick();
  tickTimer = setInterval(tick, 1000);
}

function pauseBildschirm() {
  localStorage.removeItem(LAUFEND_SCHLUESSEL);
  const ideen = mischen(PAUSEN_IDEEN).slice(0, 3);
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '🧘'),
      el('p', { style: 'text-align:center;font-weight:700' }, 'Pausen-Zeit! Such dir eine Idee aus:'),
      ...ideen.map((i) => el('p', {}, i)),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`Pausenzeit! ${ideen.join('. ')}`) }, '🔊 Vorlesen'),
        el('button', {
          class: 'k-knopf',
          onclick: () => {
            localStorage.setItem(TAG_SCHLUESSEL, JSON.stringify(aktualisiereTag(ladeTag(), { pausen: 1 })));
            fertigBildschirm();
          },
        }, '✅ Pause gemacht!'))));
}

function fertigBildschirm() {
  const tag = aktualisiereTag(ladeTag(), {});
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, tag.pausen >= 3 ? '🏆' : '💪'),
      el('p', { style: 'text-align:center;font-weight:700' }, `Stark! Das war Pause Nummer ${tag.pausen} heute.`),
      el('p', { style: 'text-align:center' }, 'Wie fühlt sich dein Kopf jetzt an? Frischer? Genau dafür sind Pausen da.'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: startBildschirm }, '🚦 Neuen Takt planen'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: startBildschirm }, '🏁 Fertig für jetzt'))));
}

// Laufende Sitzung überlebt ein Neuladen der Seite
const laufend = ladeLaufend();
if (laufend && laufend.ende > Date.now()) laufBildschirm();
else if (laufend) pauseBildschirm();
else startBildschirm();
