// Familien-Bildschirmzeit-Wette (für ELTERN+KIND 8-15, docs/09 Ось F): reine
// Logik ohne DOM, testbar. Alle – ausdrücklich auch die Eltern – setzen sich
// eigene Ampel-Ziele und tragen selbst ein, wie die Woche lief. KEINE
// Fernüberwachung: es sind Selbstauskünfte, der Vergleich passiert nur im
// gemeinsamen Familienrat. Alles bleibt lokal.

export const TAGE = Object.freeze(['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']);

export const AMPEL = Object.freeze({
  gruen: { emoji: '🟢', text: 'Ziel geschafft' },
  gelb: { emoji: '🟡', text: 'fast geschafft' },
  rot: { emoji: '🔴', text: 'heute nicht geschafft' },
});

/** Leere Wette (Familienrunde). */
export function neueWette() {
  return { mitglieder: [] };
}

/** Fügt ein Familienmitglied mit eigenem Ziel hinzu (unveränderlich). */
export function fuegeMitglied(wette, name, ziel) {
  const n = String(name).trim();
  if (!n) return wette;
  return { ...wette, mitglieder: [...wette.mitglieder, { name: n, ziel: String(ziel || '').trim(), tage: {} }] };
}

/** Entfernt ein Mitglied per Index. */
export function entferneMitglied(wette, index) {
  return { ...wette, mitglieder: wette.mitglieder.filter((_, i) => i !== index) };
}

/** Setzt die Selbstauskunft (Ampel) eines Mitglieds für einen Tag. */
export function setzeTag(wette, index, tag, ampel) {
  if (!TAGE.includes(tag) || !AMPEL[ampel]) return wette;
  return {
    ...wette,
    mitglieder: wette.mitglieder.map((m, i) => (i === index ? { ...m, tage: { ...m.tage, [tag]: ampel } } : m)),
  };
}

/** Wochenbilanz eines Mitglieds: Zähler je Ampelfarbe. */
export function wochenBilanz(mitglied) {
  const bilanz = { gruen: 0, gelb: 0, rot: 0, erfasst: 0 };
  for (const tag of TAGE) {
    const a = mitglied.tage[tag];
    if (a && bilanz[a] !== undefined) { bilanz[a] += 1; bilanz.erfasst += 1; }
  }
  return bilanz;
}

/** Freundliche, wertende, aber nicht beschämende Rückmeldung. */
export function bewertung(bilanz) {
  if (bilanz.erfasst === 0) return 'Noch keine Tage eingetragen.';
  if (bilanz.gruen >= 5) return '🌟 Stark! Fast jeden Tag das Ziel geschafft.';
  if (bilanz.gruen + bilanz.gelb >= bilanz.rot) return '👍 Gut dabei – dranbleiben lohnt sich.';
  return '💪 Diese Woche war schwer. Nächste Woche neuer Versuch.';
}

/** Familien-Überblick: je Mitglied die eigene Bilanz (für den Familienrat). */
export function familienBilanz(wette) {
  return wette.mitglieder.map((m) => ({ name: m.name, ziel: m.ziel, bilanz: wochenBilanz(m), rueckmeldung: bewertung(wochenBilanz(m)) }));
}
