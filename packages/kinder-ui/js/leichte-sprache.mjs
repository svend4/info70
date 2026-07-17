// kinder-ui: Leichte Sprache als Zusatz-Locale (BFSG/EAA, Barrierefreiheit).
//
// Leichte Sprache ist ein geregeltes, stark vereinfachtes Deutsch: kurze
// Saetze, ein Gedanke pro Satz, bekannte Woerter, direkte Anrede. Sie hilft
// Kindern, die noch nicht sicher lesen, Menschen mit Lernschwierigkeiten und
// Familien, die gerade erst Deutsch lernen.
//
// Umsetzung: eine Leichte-Sprache-Fassung wird als Locale mit dem Suffix '-ls'
// gefuehrt (z. B. 'de-ls'), also ganz normal von erstelleSprache() getragen.
// Dieses Modul liefert nur (1) reine Helfer rund um das Suffix, (2) einen
// Vollstaendigkeits-Pruefer fuer Tests und (3) einen sichtbaren Schalter.
// Einmal gebaut, profitiert jede App - sie braucht nur einen '-ls'-Katalog.

import { el } from './komponenten.mjs';

export const LS_SUFFIX = '-ls';

/** Ist dieser Locale-Code eine Leichte-Sprache-Fassung? (de-ls -> true) */
export function istLeichteSprache(code) {
  return typeof code === 'string' && code.endsWith(LS_SUFFIX);
}

/** Leichte-Sprache-Code zu einem Basis-Code (de -> de-ls). */
export function lsCode(basis) {
  return `${basis}${LS_SUFFIX}`;
}

/** Basis-Code zu einem Locale (de-ls -> de; unveraendert, wenn keine LS). */
export function basisCode(code) {
  return istLeichteSprache(code) ? code.slice(0, -LS_SUFFIX.length) : code;
}

/**
 * Prueft, dass jeder '-ls'-Katalog GENAU die Schluessel seines Basis-Katalogs
 * traegt. Reiner (DOM-freier) Helfer fuer Tests.
 * @param {Record<string, Record<string, unknown>>} kataloge
 * @returns {Record<string, {basis: string, fehlend: string[], ueberzaehlig: string[]}>}
 */
export function pruefeLeichteSpracheAbdeckung(kataloge) {
  const bericht = {};
  for (const code of Object.keys(kataloge)) {
    if (!istLeichteSprache(code)) continue;
    const basis = basisCode(code);
    const basisSchluessel = Object.keys(kataloge[basis] ?? {});
    const lsSchluessel = new Set(Object.keys(kataloge[code]));
    const basisMenge = new Set(basisSchluessel);
    bericht[code] = {
      basis,
      fehlend: basisSchluessel.filter((k) => !lsSchluessel.has(k)),
      ueberzaehlig: [...lsSchluessel].filter((k) => !basisMenge.has(k)),
    };
  }
  return bericht;
}

/**
 * Sichtbarer Schalter (DOM-Knopf), der die App zwischen Standard-Deutsch und
 * Leichter Sprache umschaltet. Erscheint NUR, wenn zur aktuellen Basissprache
 * ein '-ls'-Katalog vorhanden ist (sonst leerer String, also nichts).
 * @param {{ sprache: {aktuelle:()=>string, setze:(c:string)=>boolean, verfuegbare:()=>string[]}, neuZeichnen: ()=>void }} optionen
 * @returns {HTMLElement|''}
 */
export function leichteSpracheSchalter({ sprache, neuZeichnen }) {
  const jetzt = sprache.aktuelle();
  const basis = basisCode(jetzt);
  const ziel = lsCode(basis);
  if (!sprache.verfuegbare().includes(ziel)) return '';
  const an = istLeichteSprache(jetzt);
  return el('button', {
    class: `k-knopf k-knopf--klein ${an ? '' : 'k-knopf--neutral'}`,
    'aria-pressed': String(an),
    lang: 'de',
    title: 'Leichte Sprache: kurze Sätze, einfache Wörter',
    onclick: () => { sprache.setze(an ? basis : ziel); neuZeichnen(); },
  }, an ? '🟦 Leichte Sprache ist AN' : '🟦 Leichte Sprache');
}
