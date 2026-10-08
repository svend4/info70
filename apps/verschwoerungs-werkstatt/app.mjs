// Verschwoerungs-Werkstatt: Prebunking durch Selberbauen (13-15 Jahre).
// Jugendliche bauen aus absichtlich absurden Bausteinen eine "Verschwoerung"
// und entdecken dabei das immer gleiche Baumuster echter Erzaehlungen -
// Impfung durch Durchschauen (Inokulations-Ansatz).
// Politik docs/02: keine externen Anfragen, speichert NICHTS.
import { el, vorlesen, mischen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { hilfeInsel, hilfeInselKnopf } from '../../packages/kinder-ui/js/hilfe-insel.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const daten = await fetch('daten/bausteine.json').then((r) => r.json());

let wahl = { gruppe: null, ereignis: null, wuerze: [] };
let teilen = 0;
let teilenTimer = null;

function zeige(...knoten) {
  clearInterval(teilenTimer);
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🧪 Verschwörungs-Werkstatt'),
    el('p', { class: 'k-untertitel' }, 'Bau eine Verschwörung – und durchschau sie für immer. (ab 13)'),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · diese App speichert nichts · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

function startBildschirm() {
  wahl = { gruppe: null, ereignis: null, wuerze: [] };
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, 'Verschwörungserzählungen wirken mächtig – bis man einmal SELBST eine gebaut hat. Hier baust du in 3 Schritten eine absichtlich absurde Verschwörung und siehst danach: Echte funktionieren nach GENAU demselben Muster.'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: schritt1 }, '🔧 Werkstatt öffnen'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen('Hier baust du in drei Schritten eine absichtlich absurde Verschwörung und siehst danach: Echte funktionieren nach genau demselben Muster.') }, '🔊 Vorlesen'))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin:0' }, '💡 Alle Bausteine sind bewusst albern und erfunden – es geht ums Muster, nicht um echte Gruppen oder Themen.')),
    el('section', { class: 'k-karte' },
      hilfeInselKnopf(() => zeige(hilfeInsel({ zurueck: startBildschirm })))));
}

function auswahlSchritt(titel, optionen, istGewaehlt, beiKlick, weiterWenn, weiterAktion) {
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-weight:700;margin-top:0' }, titel),
      el('div', { class: 'k-antworten' },
        ...optionen.map((o) =>
          el('button', {
            class: `k-knopf ${istGewaehlt(o) ? '' : 'k-knopf--neutral'}`,
            'aria-pressed': String(istGewaehlt(o)),
            onclick: () => beiKlick(o),
          }, typeof o === 'string' ? o : o.text))),
      el('div', { class: 'k-antworten', style: 'margin-top:0.75rem' },
        el('button', { class: 'k-knopf', disabled: !weiterWenn(), onclick: weiterAktion },
          weiterWenn() ? 'Weiter ➡️' : 'Wähle zuerst aus …'))));
}

function schritt1() {
  auswahlSchritt('Schritt 1 – WER steckt dahinter? (Such dir eine „geheime Macht“ aus)',
    mischen(daten.gruppen).slice(0, 5),
    (o) => wahl.gruppe === o,
    (o) => { wahl.gruppe = o; schritt1(); },
    () => Boolean(wahl.gruppe),
    schritt2);
}

function schritt2() {
  auswahlSchritt('Schritt 2 – WAS „erklärt“ deine Verschwörung? (Ein ganz normales Alltags-Rätsel)',
    mischen(daten.ereignisse).slice(0, 5),
    (o) => wahl.ereignis === o,
    (o) => { wahl.ereignis = o; schritt2(); },
    () => Boolean(wahl.ereignis),
    schritt3);
}

function schritt3() {
  auswahlSchritt('Schritt 3 – Die WÜRZE: Wähle 2 Rhetorik-Zutaten (sie machen JEDEN Unsinn überzeugend)',
    daten.wuerze,
    (o) => wahl.wuerze.includes(o),
    (o) => {
      if (wahl.wuerze.includes(o)) wahl.wuerze = wahl.wuerze.filter((x) => x !== o);
      else if (wahl.wuerze.length < 2) wahl.wuerze.push(o);
      schritt3();
    },
    () => wahl.wuerze.length === 2,
    postBildschirm);
}

function postBildschirm() {
  teilen = 3;
  const text = `Leute, mir reicht's: ${wahl.ereignis} – und KEINER redet darüber?! Dahinter steckt ${wahl.gruppe}. ${wahl.wuerze[0].text} ${wahl.wuerze[1].text}`;
  const zaehler = el('p', { style: 'margin:0.25rem 0 0;font-size:0.85rem;color:#4b5563' }, '🔁 3 Mal geteilt');
  teilenTimer = setInterval(() => {
    teilen += Math.floor(Math.random() * 17) + 4;
    zaehler.textContent = `🔁 ${teilen} Mal geteilt … und es werden mehr`;
  }, 700);
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-untertitel', style: 'margin-top:0' }, 'Dein Post ist „live“ (natürlich nur hier):'),
      el('div', { class: 'k-hinweis k-hinweis--falsch' },
        el('p', { style: 'margin:0;font-weight:600' }, text),
        zaehler),
      el('p', { style: 'font-weight:700;color:var(--k-rot);text-align:center;margin:0.75rem 0 0' }, '⚠️ ERFUNDEN – gebaut in deiner Werkstatt in unter einer Minute.'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: musterBildschirm }, '🔍 Muster enthüllen'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(text) }, '🔊 Vorlesen'))));
}

function musterBildschirm() {
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-weight:700;margin-top:0' }, '🧩 Die Anatomie deiner Verschwörung – und ALLER Verschwörungen:'),
      el('div', { class: 'k-hinweis' }, el('p', { style: 'margin:0' }, `1️⃣ Eine geheime Gruppe (bei dir: ${wahl.gruppe}) – je unsichtbarer, desto unwiderlegbarer.`)),
      el('div', { class: 'k-hinweis' }, el('p', { style: 'margin:0' }, `2️⃣ Ein echtes, unbefriedigend erklärtes Alltags-Phänomen (bei dir: ${wahl.ereignis}) – der Köder, den alle kennen.`)),
      ...wahl.wuerze.map((w, i) =>
        el('div', { class: 'k-hinweis' }, el('p', { style: 'margin:0' }, `${i + 3}️⃣ „${w.text}“ – ${w.wirkung}`))),
      el('p', { style: 'margin:0.75rem 0 0' }, 'Merke: Das Muster trägt JEDEN Inhalt. Deins war albern – gefährliche Erzählungen benutzen exakt dieselben Bauteile, nur mit echten Sündenböcken. Genau deshalb erkennst du sie jetzt.'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: checklisteBildschirm }, '🛡️ Und wie erkenne ich echte?'))));
}

function checklisteBildschirm() {
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-weight:700;margin-top:0' }, '🛡️ Dein Erkennungs-Werkzeug:'),
      ...daten.checkliste.map((c) => el('p', { style: 'margin:0.5rem 0' }, c)),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(daten.checkliste.join(' ')) }, '🔊 Vorlesen'),
        el('button', { class: 'k-knopf', onclick: startBildschirm }, '🔁 Neue Verschwörung bauen'))));
}

startBildschirm();
