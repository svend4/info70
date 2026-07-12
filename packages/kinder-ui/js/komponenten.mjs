// kinder-ui: kleine DOM- und Sprachhelfer ohne Abhängigkeiten.

/**
 * DOM-Konstruktor: el('button', {class: 'k-knopf', onclick: fn}, 'Text', kind …)
 * @param {string} tag
 * @param {Record<string, unknown>} [attrs]
 * @param {...(Node|string)} kinder
 * @returns {HTMLElement}
 */
export function el(tag, attrs = {}, ...kinder) {
  const knoten = document.createElement(tag);
  for (const [name, wert] of Object.entries(attrs)) {
    if (name.startsWith('on') && typeof wert === 'function') {
      knoten.addEventListener(name.slice(2), wert);
    } else if (wert !== false && wert != null) {
      knoten.setAttribute(name, String(wert));
    }
  }
  knoten.append(...kinder);
  return knoten;
}

/**
 * Text vorlesen (Web Speech API, läuft lokal im Browser, offline-fähig).
 * Für Kinder, die noch nicht sicher lesen. Bricht laufende Ausgabe ab.
 * @param {string} text
 */
export function vorlesen(text) {
  if (!('speechSynthesis' in globalThis)) return false;
  speechSynthesis.cancel();
  const aeusserung = new SpeechSynthesisUtterance(text);
  aeusserung.lang = 'de-DE';
  aeusserung.rate = 0.9;
  speechSynthesis.speak(aeusserung);
  return true;
}

/**
 * Array mischen (Fisher-Yates), ohne das Original zu verändern.
 * @template T @param {T[]} liste @returns {T[]}
 */
export function mischen(liste) {
  const kopie = [...liste];
  for (let i = kopie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [kopie[i], kopie[j]] = [kopie[j], kopie[i]];
  }
  return kopie;
}
