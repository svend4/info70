// Gemeinsam gesund essen: Sitzungs-Logik.
// Harte Obergrenze: hoechstens 6 Bild-Entscheidungen pro Sitzung. Bewusst
// sehr kurz fuer 3-5-Jaehrige (BZgA: nur sparsame, begleitete Bildschirmzeit).
// Die Konstante ist die eine Wahrheitsquelle fuer das Limit - App und Test
// beziehen sich beide darauf.
import { mischen } from '../../packages/kinder-ui/js/komponenten.mjs';

/** Maximale Anzahl Bild-Entscheidungen pro Sitzung (harte Konstante, <= 6). */
export const PRO_SESSION = 6;

/**
 * Waehlt fuer eine Sitzung hoechstens `limit` Szenen aus der Bank aus.
 * Rotation durch Mischen (Fisher-Yates), damit ueber mehrere Sitzungen
 * unterschiedliche Szenen erscheinen. Verändert die Bank nicht.
 * @param {Array} bank alle verfuegbaren Szenen
 * @param {number} [limit] Obergrenze (Standard: PRO_SESSION)
 * @returns {Array} bis zu `limit` Szenen ohne Dubletten
 */
export function waehleSzenen(bank, limit = PRO_SESSION) {
  return mischen(bank).slice(0, limit);
}
