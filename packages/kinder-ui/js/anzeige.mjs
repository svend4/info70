// Anzeige-Einstellungen (BFSG, docs/09 Ось H): Hoher Kontrast + Schriftgröße.
// Reine Zustands-Logik (testbar) plus ein optionaler Schalter (DOM). Die
// Einstellung liegt löschbar im localStorage ('ui.anzeige') und wirkt – einmal
// per boot() angewandt – in jeder App über data-Attribute am <html>. Keine
// Netzwerkanfragen.
import { el } from './komponenten.mjs';

const SCHLUESSEL = 'ui.anzeige';
export const SCHRIFT_STUFEN = Object.freeze(['normal', 'gross', 'sehr-gross']);
export const STANDARD = Object.freeze({ kontrast: 'normal', schrift: 'normal' });

const SCHRIFT_LABEL = { normal: 'Normal', gross: 'Groß', 'sehr-gross': 'Sehr groß' };

/** Nächste Schriftgröße im Zyklus normal → gross → sehr-gross → normal. */
export function naechsteSchrift(stufe) {
  const i = SCHRIFT_STUFEN.indexOf(stufe);
  return SCHRIFT_STUFEN[(i + 1) % SCHRIFT_STUFEN.length];
}

/** Kontrast umschalten (normal ↔ hoch). */
export function wechsleKontrast(kontrast) {
  return kontrast === 'hoch' ? 'normal' : 'hoch';
}

/** Normalisiert eine (evtl. kaputte) Einstellung auf gültige Werte. */
export function normalisiere(einstellung) {
  const e = einstellung && typeof einstellung === 'object' ? einstellung : {};
  return {
    kontrast: e.kontrast === 'hoch' ? 'hoch' : 'normal',
    schrift: SCHRIFT_STUFEN.includes(e.schrift) ? e.schrift : 'normal',
  };
}

/**
 * Lädt die Einstellung aus dem Speicher; ohne gespeicherte Wahl wird hoher
 * Kontrast über prefers-contrast vorausgewählt.
 * @param {{speicher?: {getItem(k:string):string|null}, prefersHoch?: boolean}} [opt]
 */
export function ladeEinstellung({ speicher = globalThis.localStorage, prefersHoch = false } = {}) {
  let roh = null;
  try { roh = JSON.parse(speicher?.getItem(SCHLUESSEL) ?? 'null'); } catch (e) { roh = null; }
  if (roh) return normalisiere(roh);
  return normalisiere({ kontrast: prefersHoch ? 'hoch' : 'normal', schrift: 'normal' });
}

/** Speichert die Einstellung (oder löscht sie bei Standard). */
export function speichere(einstellung, speicher = globalThis.localStorage) {
  const e = normalisiere(einstellung);
  try {
    if (e.kontrast === 'normal' && e.schrift === 'normal') speicher?.removeItem(SCHLUESSEL);
    else speicher?.setItem(SCHLUESSEL, JSON.stringify(e));
  } catch (err) { /* Speicher nicht verfügbar – ignorieren */ }
}

/** Wendet die Einstellung auf das Wurzel-Element (documentElement) an. */
export function wendeAn(einstellung, root = globalThis.document?.documentElement) {
  if (!root || !root.dataset) return;
  const e = normalisiere(einstellung);
  if (e.kontrast === 'hoch') root.dataset.kontrast = 'hoch';
  else delete root.dataset.kontrast;
  if (e.schrift !== 'normal') root.dataset.schrift = e.schrift;
  else delete root.dataset.schrift;
}

/** Startet die Anzeige-Einstellungen: laden + anwenden. Gibt die Einstellung zurück. */
export function boot(opt = {}) {
  const prefersHoch = opt.prefersHoch ?? Boolean(globalThis.matchMedia?.('(prefers-contrast: more)').matches);
  const einstellung = ladeEinstellung({ speicher: opt.speicher, prefersHoch });
  wendeAn(einstellung, opt.root);
  return einstellung;
}

/**
 * Baut einen kleinen Anzeige-Schalter (DOM). onAendern wird nach jeder Änderung
 * mit der neuen Einstellung aufgerufen (z. B. um die Ansicht neu zu zeichnen).
 */
export function anzeigeSchalter({ onAendern } = {}) {
  let e = ladeEinstellung({ prefersHoch: Boolean(globalThis.matchMedia?.('(prefers-contrast: more)').matches) });
  const behaelter = el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Anzeige-Einstellungen' });
  const zeichne = () => {
    wendeAn(e); speichere(e);
    behaelter.replaceChildren(
      el('button', { class: 'k-knopf k-knopf--klein k-knopf--neutral', 'aria-pressed': String(e.kontrast === 'hoch'),
        onclick: () => { e = { ...e, kontrast: wechsleKontrast(e.kontrast) }; zeichne(); onAendern?.(e); } },
        `🎨 Kontrast: ${e.kontrast === 'hoch' ? 'hoch' : 'normal'}`),
      el('button', { class: 'k-knopf k-knopf--klein k-knopf--neutral',
        onclick: () => { e = { ...e, schrift: naechsteSchrift(e.schrift) }; zeichne(); onAendern?.(e); } },
        `🔠 Schrift: ${SCHRIFT_LABEL[e.schrift]}`));
  };
  zeichne();
  return behaelter;
}
