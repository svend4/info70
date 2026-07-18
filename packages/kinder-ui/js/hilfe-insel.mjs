// kinder-ui: Hilfe-Insel - einheitlicher "Ich brauche Hilfe"-Baustein.
//
// Jede App kann diesen ruhigen Screen einbinden: eine kurze Ermutigung
// ("Du hast das Recht auf Hilfe"), die Nummer gegen Kummer 116 111 und
// Vorlesen - ohne Chat, ohne externen Request. Standardisiert, was der
// Kinderrechte-Entdecker begonnen hat, als Pflicht-Baustein des
// Kriterienkatalogs (docs/09 Nr. 113). Einmal gebaut - jede App nutzt ihn.
import { el, vorlesen } from './komponenten.mjs';

export const HILFE_NUMMER = '116 111';
export const ELTERN_NUMMER = '0800 111 0 550';

export const HILFE_TEXTE = Object.freeze({
  ermutigung: 'Du hast das Recht auf Hilfe. Sich Hilfe zu holen ist mutig – nicht peinlich.',
  wasTun: 'Sprich mit einem Erwachsenen, dem du vertraust: Eltern, Lehrkraft oder Trainer*in. Oder ruf kostenlos und anonym an.',
  nummerName: 'Nummer gegen Kummer, für Kinder und Jugendliche',
  nummer: HILFE_NUMMER,
  hinweis: 'Das Gespräch ist kostenlos, anonym und vertraulich. Du musst deinen Namen nicht sagen.',
  eltern: `Für Erwachsene: Elterntelefon ${ELTERN_NUMMER} (kostenlos, anonym).`,
});

/**
 * Baut die Hilfe-Insel als ruhige Karte (section.k-karte). Optional ein
 * Zurueck-Knopf, der zum Aufrufer zurueckfuehrt.
 * @param {{ zurueck?: () => void }} [optionen]
 * @returns {HTMLElement}
 */
export function hilfeInsel({ zurueck } = {}) {
  const t = HILFE_TEXTE;
  const vorleseText = `${t.ermutigung} ${t.wasTun} ${t.nummerName}: ${t.nummer}. ${t.hinweis}`;
  return el('section', { class: 'k-karte', style: 'text-align:center' },
    el('p', { style: 'font-size:2rem;margin:0', 'aria-hidden': 'true' }, '💛'),
    el('p', { style: 'font-weight:700;font-size:1.15rem;margin:0.25rem 0' }, t.ermutigung),
    el('p', { style: 'margin:0.5rem 0' }, t.wasTun),
    el('p', { style: 'font-size:1.4rem;font-weight:700;margin:0.5rem 0' }, `📞 ${t.nummer}`),
    el('p', { style: 'font-size:0.9rem;color:#4b5563;margin:0' }, `${t.nummerName}. ${t.hinweis}`),
    el('p', { style: 'font-size:0.85rem;color:#4b5563;margin:0.25rem 0 0' }, t.eltern),
    el('div', { class: 'k-antworten' },
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(vorleseText) }, '🔊 Vorlesen'),
      zurueck ? el('button', { class: 'k-knopf k-knopf--klein', onclick: zurueck }, '↩️ Zurück') : ''));
}

/**
 * Kleiner Auslöse-Knopf "Ich brauche Hilfe", den eine App in ihr Menü setzt.
 * @param {() => void} beimOeffnen
 * @returns {HTMLElement}
 */
export function hilfeInselKnopf(beimOeffnen) {
  return el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: beimOeffnen }, '🆘 Ich brauche Hilfe');
}
