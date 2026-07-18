// BFSG-Check: reine Logik (ohne DOM), testbar.
// Eingebauter Offline-Kontrast-Rechner nach WCAG 2.1 (docs/09 Nr. 61): zwei
// Farben rein -> Kontrastverhaeltnis und WCAG-Stufe raus. Keine externen Tools.

/** '#rrggbb' oder 'rrggbb' -> {r,g,b} (0..255) oder null bei ungueltig. */
export function hexZuRgb(hex) {
  const m = /^#?([0-9a-fA-F]{6})$/.exec(String(hex).trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

// sRGB-Kanal (0..1) -> linear (WCAG-Formel).
function linear(c) {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

/** Relative Leuchtdichte (0..1) nach WCAG. */
export function leuchtdichte({ r, g, b }) {
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

/** Kontrastverhaeltnis zweier Hex-Farben (1..21), auf 2 Stellen gerundet. */
export function kontrast(hex1, hex2) {
  const a = hexZuRgb(hex1);
  const b = hexZuRgb(hex2);
  if (!a || !b) return null;
  const l1 = leuchtdichte(a);
  const l2 = leuchtdichte(b);
  const hell = Math.max(l1, l2);
  const dunkel = Math.min(l1, l2);
  return Math.round(((hell + 0.05) / (dunkel + 0.05)) * 100) / 100;
}

/**
 * WCAG-Bewertung eines Kontrastwerts.
 * grosseSchrift: ab ~18pt bzw. 14pt fett gelten mildere Grenzen.
 */
export function wcagStufe(verhaeltnis, grosseSchrift = false) {
  if (verhaeltnis == null) return { stufe: 'ungueltig', text: 'Farbe ungültig (bitte #rrggbb eingeben).' };
  const aa = grosseSchrift ? 3 : 4.5;
  const aaa = grosseSchrift ? 4.5 : 7;
  if (verhaeltnis >= aaa) return { stufe: 'AAA', text: `✅ Sehr guter Kontrast (${verhaeltnis}:1) – erfüllt AAA.` };
  if (verhaeltnis >= aa) return { stufe: 'AA', text: `✅ Guter Kontrast (${verhaeltnis}:1) – erfüllt AA${grosseSchrift ? ' (große Schrift)' : ''}.` };
  return { stufe: 'ungenuegend', text: `⚠️ Kontrast zu schwach (${verhaeltnis}:1) – erfüllt AA nicht. Dunklere/hellere Farbe wählen.` };
}
