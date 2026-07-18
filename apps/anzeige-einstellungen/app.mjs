// Anzeige-Einstellungen (BFSG, docs/09 Ось H): zentrale Seite für Hoher
// Kontrast und Schriftgröße. Die Wahl liegt löschbar im localStorage
// ('ui.anzeige') und wirkt in jeder App, die beim Start boot() aufruft.
// Politik docs/02: keine externen Anfragen.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { ladeEinstellung, speichere, wendeAn, naechsteSchrift, wechsleKontrast, boot } from '../../packages/kinder-ui/js/anzeige.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
boot(); // gespeicherte Wahl sofort anwenden
let e = ladeEinstellung({ prefersHoch: Boolean(window.matchMedia?.('(prefers-contrast: more)').matches) });
const SCHRIFT_LABEL = { normal: 'Normal', gross: 'Groß', 'sehr-gross': 'Sehr groß' };

function setze(neu) { e = neu; wendeAn(e); speichere(e); render(); }

function render() {
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🔎 Anzeige-Einstellungen'),
    el('p', { class: 'k-untertitel' }, 'Stell die Darstellung so ein, wie du sie am besten lesen kannst. Deine Wahl gilt für alle Apps auf diesem Gerät.'),
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-weight:600;margin-top:0' }, '🎨 Kontrast'),
      el('div', { class: 'k-antworten' },
        el('button', { class: `k-knopf ${e.kontrast === 'normal' ? '' : 'k-knopf--neutral'}`, 'aria-pressed': String(e.kontrast === 'normal'), onclick: () => setze({ ...e, kontrast: 'normal' }) }, 'Normal'),
        el('button', { class: `k-knopf ${e.kontrast === 'hoch' ? '' : 'k-knopf--neutral'}`, 'aria-pressed': String(e.kontrast === 'hoch'), onclick: () => setze({ ...e, kontrast: 'hoch' }) }, 'Hoher Kontrast'))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-weight:600;margin-top:0' }, '🔠 Schriftgröße'),
      el('div', { class: 'k-antworten' },
        ...['normal', 'gross', 'sehr-gross'].map((s) =>
          el('button', { class: `k-knopf ${e.schrift === s ? '' : 'k-knopf--neutral'}`, 'aria-pressed': String(e.schrift === s), onclick: () => setze({ ...e, schrift: s }) }, SCHRIFT_LABEL[s])))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, 'So sieht ein Beispiel-Text mit deinen Einstellungen aus:'),
      el('p', { style: 'font-weight:600' }, 'Erst prüfen, dann teilen. Melden ist kein Petzen.'),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => setze({ kontrast: 'normal', schrift: 'normal' }) }, '↩️ Zurücksetzen')),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin:0;font-size:0.9rem;color:#4b5563' }, 'ℹ️ Hoher Kontrast und größere Schrift helfen beim Lesen (BFSG/EAA). Die Einstellung wird nur auf diesem Gerät gespeichert und ist mit „Zurücksetzen“ wieder weg.')),
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'werbefrei · läuft offline · nur lokale Einstellung · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

render();
