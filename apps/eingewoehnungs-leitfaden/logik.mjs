// Eingewöhnungs-Tagebuch: reine Logik (ohne DOM), testbar. Ampel-Verlaufslog
// zur Eingewöhnung (Berliner/Münchener Modell) für Fachkräfte. Kinder nur als
// Kürzel; nur strukturierte Felder (Phase, Ampel, Trennung) – keine Freitexte,
// kein Score/keine Rangfolge (EU AI Act, docs/02). Praleska docs/10 (Nr. 3).

export const MAX_KUERZEL = 3;

export function normalisiereKuerzel(roh) {
  if (typeof roh !== 'string') return '';
  return roh.trim().slice(0, MAX_KUERZEL);
}

export function kuerzelOk(kuerzel) {
  if (typeof kuerzel !== 'string') return false;
  const k = kuerzel.trim();
  return k.length >= 1 && k.length <= MAX_KUERZEL;
}

const ids = (liste) => new Set(liste.map((x) => x.id));

/** Prüft die Config: Phasen, Ampeln, Trennungen vorhanden und mit id/text. */
export function pruefeConfig(config) {
  const fehler = [];
  for (const feld of ['phasen', 'ampeln', 'trennungen']) {
    if (!Array.isArray(config?.[feld]) || config[feld].length < 2) fehler.push(`${feld} fehlen`);
  }
  if (Array.isArray(config?.ampeln) && !['gut', 'wackelig', 'schwer'].every((a) => ids(config.ampeln).has(a))) {
    fehler.push('Ampel-Stufen gut/wackelig/schwer erwartet');
  }
  return fehler;
}

/** Prüft einen Tag-Eintrag gegen die Config. Liefert Fehlerliste. */
export function pruefeEintrag(config, e) {
  const fehler = [];
  if (!e || typeof e !== 'object') return ['Kein Eintrag'];
  if (!Number.isInteger(e.tag) || e.tag < 1) fehler.push('Tag-Nummer fehlt');
  if (!ids(config.phasen).has(e.phase)) fehler.push('Phase ungültig');
  if (!ids(config.ampeln).has(e.ampel)) fehler.push('Ampel ungültig');
  if (!ids(config.trennungen).has(e.trennung)) fehler.push('Trennung ungültig');
  return fehler;
}

const AMPEL_WERT = { gut: 2, wackelig: 1, schwer: 0 };

/**
 * Trend aus den letzten bis zu 3 Einträgen: vergleicht deren Ampel-Schnitt mit
 * dem der davorliegenden. Ergebnis: 'aufwaerts' | 'stabil' | 'schwierig' |
 * 'zu-wenig' (weniger als 2 Einträge). Kein Score des Kindes – nur Verlaufshilfe.
 */
export function trend(eintraege) {
  const e = [...eintraege].sort((a, b) => a.tag - b.tag);
  if (e.length < 2) return 'zu-wenig';
  const letzte = e.slice(-3);
  const davor = e.slice(0, -letzte.length);
  const schnitt = (arr) => arr.reduce((s, x) => s + (AMPEL_WERT[x.ampel] ?? 0), 0) / arr.length;
  const letzteS = schnitt(letzte);
  if (letzte.some((x) => x.ampel === 'schwer' || x.trennung === 'abbruch') && letzteS < 1) return 'schwierig';
  if (davor.length === 0) return letzteS >= 1.5 ? 'aufwaerts' : 'stabil';
  const diff = letzteS - schnitt(davor);
  if (diff >= 0.4) return 'aufwaerts';
  if (diff <= -0.4) return 'schwierig';
  return 'stabil';
}

/** Empfehlung zum letzten Eintrag (Trennungsabbruch hat Vorrang vor der Ampel). */
export function empfehlung(config, eintraege) {
  const e = [...eintraege].sort((a, b) => a.tag - b.tag);
  if (e.length === 0) return '';
  const letzter = e[e.length - 1];
  const schluessel = letzter.trennung === 'abbruch' ? 'abbruch' : letzter.ampel;
  return config.empfehlungen?.[schluessel] ?? '';
}

const text = (liste, id) => liste.find((x) => x.id === id)?.text ?? liste.find((x) => x.id === id)?.name ?? id;

const stand = () => {
  try { return new Date().toLocaleDateString('de-DE'); } catch { return ''; }
};

/** Verlaufszeilen (chronologisch) als Text-Array. */
export function verlaufZeilen(config, eintraege) {
  return [...eintraege].sort((a, b) => a.tag - b.tag).map((e) => {
    const phase = text(config.phasen, e.phase);
    const ampel = text(config.ampeln, e.ampel);
    const trenn = text(config.trennungen, e.trennung);
    return `Tag ${e.tag}: ${ampel} · ${phase} · ${trenn}`;
  });
}

/** Baut den Elterngespräch-Bericht (Text). */
export function bericht(config, kuerzel, eintraege, datum = stand()) {
  const zeilen = [
    'Eingewöhnungs-Tagebuch – Verlauf für das Elterngespräch',
    `Kind (Kürzel): ${kuerzel}`,
    `Stand: ${datum}`,
    '',
    'Beobachtung, keine Diagnose. Strukturierter Verlauf der Eingewöhnung',
    '(Berliner/Münchener Modell), ohne Wertung und ohne Vergleich mit anderen Kindern.',
    '',
    '## Tagesverlauf',
  ];
  const verlauf = verlaufZeilen(config, eintraege);
  if (verlauf.length === 0) zeilen.push('(noch keine Tage erfasst)');
  else zeilen.push(...verlauf);
  zeilen.push('');
  const TREND_TEXT = {
    aufwaerts: 'Der Verlauf zeigt zuletzt eine positive Tendenz.',
    stabil: 'Der Verlauf ist zuletzt stabil.',
    schwierig: 'Der Verlauf ist zuletzt belastet – bitte behutsam vorgehen.',
    'zu-wenig': 'Noch zu wenige Tage für eine Tendenz.',
  };
  zeilen.push('## Tendenz', TREND_TEXT[trend(eintraege)]);
  const emp = empfehlung(config, eintraege);
  if (emp) zeilen.push('', '## Nächster Schritt', emp);
  zeilen.push('', 'Für das Elterngespräch: gemeinsame Absprachen zu Tempo, Trennungen und Ritualen.');
  return zeilen.join('\n');
}
