// Familien-Bildschirmzeit-Wette (für ELTERN+KIND 8-15, docs/09 Ось F): reine
// Logik ohne DOM, testbar. Alle – ausdrücklich auch die Eltern – setzen sich
// ein eigenes Ziel und notieren selbst, ob es an einem Tag erreicht war. Die
// Auskunft ist ein Wort, ohne Farbe und ohne Wertung. KEINE Fernüberwachung:
// es sind Selbstauskünfte, der Vergleich passiert nur im gemeinsamen
// Familienrat. Namen sind Initialen oder eine Nummer. Alles bleibt lokal.

export const TAGE = Object.freeze(['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']);

/** Höchstens so viele Zeichen für einen Namen: Initiale oder Nummer. */
export const NAME_MAX = 3;

/** Die Auskunft je Tag: kurz für den Knopf, ausführlich für die Beschriftung. */
export const AUSKUNFT = Object.freeze({
  ja: Object.freeze({ kurz: 'ja', text: 'Ziel erreicht' }),
  teils: Object.freeze({ kurz: 'teils', text: 'teilweise erreicht' }),
  nein: Object.freeze({ kurz: 'nein', text: 'nicht erreicht' }),
});

/** Leere Wette (Familienrunde). */
export function neueWette() {
  return { mitglieder: [] };
}

/** Fügt ein Familienmitglied mit eigenem Ziel hinzu (unveränderlich). */
export function fuegeMitglied(wette, name, ziel) {
  const n = String(name).trim().slice(0, NAME_MAX);
  if (!n) return wette;
  return { ...wette, mitglieder: [...wette.mitglieder, { name: n, ziel: String(ziel || '').trim(), tage: {} }] };
}

/** Entfernt ein Mitglied per Index. */
export function entferneMitglied(wette, index) {
  return { ...wette, mitglieder: wette.mitglieder.filter((_, i) => i !== index) };
}

/** Setzt die Selbstauskunft eines Mitglieds für einen Tag. */
export function setzeTag(wette, index, tag, auskunft) {
  if (!TAGE.includes(tag) || !Object.hasOwn(AUSKUNFT, auskunft)) return wette;
  return {
    ...wette,
    mitglieder: wette.mitglieder.map((m, i) => (i === index ? { ...m, tage: { ...m.tage, [tag]: auskunft } } : m)),
  };
}

/** Zählt die Auskünfte eines Mitglieds und die erfassten Tage. */
export function wochenBilanz(mitglied) {
  const bilanz = { ja: 0, teils: 0, nein: 0, erfasst: 0 };
  for (const tag of TAGE) {
    const a = mitglied.tage[tag];
    if (a && Object.hasOwn(AUSKUNFT, a)) { bilanz[a] += 1; bilanz.erfasst += 1; }
  }
  return bilanz;
}

/** Familien-Überblick: je Mitglied die eigene Zählung (für den Familienrat), ohne Rückmeldung. */
export function familienBilanz(wette) {
  return wette.mitglieder.map((m) => ({ name: m.name, ziel: m.ziel, bilanz: wochenBilanz(m) }));
}
