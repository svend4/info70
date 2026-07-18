// Schreibrichtung (RTL-Grundausbau, docs/09 Ось H): reine Logik ohne DOM,
// testbar. Bestimmt aus einem Sprachcode die Textrichtung und setzt sie am
// Wurzel-Element. Einmal gebaut, kostet jede weitere RTL-Sprache nur noch das
// Übersetzungs-Pack – die kinder-ui nutzt logische CSS-Eigenschaften, sodass
// das Layout automatisch spiegelt. Keine Netzwerkanfragen, keine externen Fonts.

/** Sprachen mit Rechts-nach-links-Schrift (Basiscodes). */
export const RTL_SPRACHEN = Object.freeze(['ar', 'he', 'fa', 'ur', 'ps', 'sd', 'yi', 'dv']);

/** Basiscode ohne Region/Variante: 'ar-EG' -> 'ar', 'de-ls' -> 'de'. */
export function basis(lang) {
  return String(lang ?? '').toLowerCase().split(/[-_]/)[0];
}

/** Ist die Sprache RTL? */
export function istRtl(lang) {
  return RTL_SPRACHEN.includes(basis(lang));
}

/** Textrichtung als 'rtl' oder 'ltr'. */
export function richtung(lang) {
  return istRtl(lang) ? 'rtl' : 'ltr';
}

/** Setzt die Richtung am Wurzel-Element (documentElement.dir). */
export function setzeRichtung(lang, root = globalThis.document?.documentElement) {
  if (root) root.dir = richtung(lang);
}
