// Erzähl-Brücke: Erzähl-Gerüst zum freien, MÜNDLICHEN Erzählen (5-8, gern
// gemeinsam). Held + Ort + Problem würfeln, dann die vier Stufen der Erzähl-
// Treppe als Impulse – das Kind erzählt LAUT, die App liefert nur das Gerüst.
// KEIN Mikrofon, KEINE Aufnahme, NICHTS wird gespeichert. Praleska docs/10
// (Top-30 Nr. 19). Politik docs/02: keine externen Anfragen.
import { el, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { pruefeBausteine, waehleElemente, baueGeruest } from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const daten = await fetch('daten/bausteine.json').then((r) => r.json());
let geruest = null;
let extra = null;

function zeige(...knoten) {
  // replaceChildren filtert (anders als el()) keine falsy Kinder – daher filtern.
  app.replaceChildren(...[
    el('h1', { class: 'k-titel' }, '🌉 Erzähl-Brücke'),
    el('p', { class: 'k-untertitel' }, 'Erzähl deine eigene Geschichte – ganz laut!'),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · kein Mikrofon · nichts wird aufgenommen oder gespeichert · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')),
  ].filter(Boolean));
  app.querySelector('button')?.focus();
}

function start() {
  geruest = null;
  const intro = 'Hier erfindest du eine Geschichte und erzählst sie laut. Der Computer nimmt nichts auf. Am schönsten erzählst du einem großen Menschen, der zuhört. Tippe auf Würfeln!';
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '📖'),
      el('p', {}, 'Du bist die Erzählerin oder der Erzähler!'),
      el('p', {}, 'Wir würfeln einen Helden, einen Ort und ein Abenteuer. Den Rest erzählst du – ganz laut.'),
      el('p', { style: 'font-size:0.9rem;color:#4b5563' }, 'Der Computer hört nicht zu und nimmt nichts auf. Erzähl in jeder Sprache, die du magst.'),
      el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => vorlesen(intro) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: wuerfeln }, '🎲 Geschichte würfeln'))));
}

function wuerfeln() {
  geruest = baueGeruest(daten, waehleElemente(daten));
  extra = null;
  zeigeGeruest();
}

function zeigeGeruest() {
  zeige(
    el('section', { class: 'k-karte', style: 'background:#eff6ff' },
      el('p', { style: 'margin:0;font-weight:700;font-size:1.15rem' }, geruest.start),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', style: 'margin-top:0.3rem', onclick: () => vorlesen(geruest.start) }, '🔊 Vorlesen')),
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.05rem' }, '🪜 Deine Erzähl-Treppe'),
      el('p', { style: 'font-size:0.9rem;color:#4b5563;margin-top:0' }, 'Erzähl Stufe für Stufe – so lange und so wild du magst!'),
      ...geruest.stufen.map((s) => el('div', { style: 'padding:0.5rem 0;border-top:1px solid var(--k-rand)' },
        el('p', { style: 'margin:0;font-weight:700' }, `${s.emoji} ${s.titel}`),
        el('p', { style: 'margin:0.2rem 0 0;font-size:0.95rem' }, s.impuls),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', style: 'margin-top:0.2rem', onclick: () => vorlesen(`${s.titel}. ${s.impuls}`) }, '🔊')))),
    extra ? el('section', { class: 'k-karte', style: 'background:#fef3c7' },
      el('p', { style: 'margin:0;font-weight:600' }, `✨ Überraschung: ${extra}`),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', style: 'margin-top:0.2rem', onclick: () => vorlesen(extra) }, '🔊 Vorlesen')) : null,
    el('div', { class: 'k-antworten' },
      el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => { extra = daten.extraImpulse[Math.floor(Math.random() * daten.extraImpulse.length)]; zeigeGeruest(); } }, '✨ Überraschung einbauen'),
      el('button', { class: 'k-knopf', onclick: wuerfeln }, '🎲 Neue Geschichte'),
      el('button', { class: 'k-knopf k-knopf--neutral', onclick: start }, '🏠 Start')));
}

const fehler = pruefeBausteine(daten);
if (fehler.length) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' }, el('p', { style: 'margin:0' }, `Datenfehler: ${fehler[0]}`)));
} else {
  start();
}
