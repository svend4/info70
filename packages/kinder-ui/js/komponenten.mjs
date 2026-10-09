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
  // Falsy Kinder (null/undefined/false) überspringen – erlaubt bedingtes
  // Rendern per `bedingung && el(...)` bzw. `bedingung ? el(...) : null`,
  // ohne dass ein "null"/"false"-Textknoten erscheint.
  knoten.append(...kinder.filter((k) => k != null && k !== false));
  return knoten;
}

/**
 * Die erste Stimme, die auf dem GERÄT liegt und zur Sprache passt.
 *
 * `localService === true` heißt: die Synthese läuft im Gerät. Stimmen mit
 * `false` sind netzbasiert - auf Android ist die Google-Stimme für de-DE
 * typischerweise die Standardstimme und netzbasiert. Das ist der Grund,
 * warum diese Funktion existiert: `installiereNetzwerkWaechter()` patcht
 * nur `fetch`, `XMLHttpRequest` und `WebSocket`, die Sprachausgabe geht
 * daran vorbei.
 *
 * @returns {SpeechSynthesisVoice|null|undefined} null = keine lokale
 *   Stimme vorhanden; undefined = Liste noch nicht geladen (Chromium
 *   liefert sie asynchron, bis dahin ist nichts entschieden).
 */
export function lokaleStimme(lang = 'de') {
  if (!('speechSynthesis' in globalThis)) return null;
  const stimmen = speechSynthesis.getVoices?.() ?? [];
  if (!stimmen.length) return undefined;
  const praefix = String(lang).toLowerCase().slice(0, 2);
  return stimmen.find((s) => s.localService && String(s.lang ?? '').toLowerCase().startsWith(praefix)) ?? null;
}

/**
 * Text vorlesen (Web Speech API, läuft lokal im Browser, offline-fähig).
 * Für Kinder, die noch nicht sicher lesen. Bricht laufende Ausgabe ab.
 *
 * WICHTIG, und das war bis zur Welle 79 ein echter Defekt: eine Utterance
 * OHNE `voice` lässt den Browser die Standardstimme der Sprache wählen -
 * und die kann netzbasiert sein. Sechs Apps hatten eine Funktion, die eine
 * geräteinterne Stimme sucht, benutzten das Ergebnis aber nur, um den Knopf
 * anzuzeigen; GDD und README versprachen dagegen „Vorlesen nur mit einer
 * Stimme mit localService === true". Die Zusage ging weiter als der Code.
 *
 * Darum wird jetzt eine Stimme GESETZT: entweder die übergebene oder, wenn
 * keine kommt, die erste geräteinterne zur Sprache. Nur wenn es keine gibt,
 * bleibt `voice` leer und der Browser entscheidet wie vorher.
 *
 * @param {string} text
 * @param {string} [lang] BCP-47-Code, z. B. 'de-DE', 'uk-UA', 'ru-RU'
 * @param {SpeechSynthesisVoice|null} [stimme] ausdrücklich gewählte Stimme
 */
export function vorlesen(text, lang = 'de-DE', stimme = null) {
  if (!('speechSynthesis' in globalThis)) return false;
  speechSynthesis.cancel();
  const aeusserung = new SpeechSynthesisUtterance(text);
  aeusserung.lang = lang;
  aeusserung.rate = 0.9;
  const gewaehlt = stimme ?? lokaleStimme(lang);
  if (gewaehlt) {
    aeusserung.voice = gewaehlt;
    // Die Sprache der Stimme gewinnt: eine de-AT-Stimme mit lang='de-DE'
    // zu fahren ist unnötig und in manchen Browsern ein Fehlerfall.
    if (gewaehlt.lang) aeusserung.lang = gewaehlt.lang;
  }
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
