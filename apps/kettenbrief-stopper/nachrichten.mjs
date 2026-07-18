// Nachrichtentypen für den Ausbreitungs-Simulator (docs/09 Ось G/H).
// Reine STRUKTUR ohne Text (ohne DOM), testbar. Die Texte liegen mehrsprachig
// in daten/sprachen.json (mini-i18n); baueTyp() setzt Struktur + Übersetzung
// zusammen. So kostet jede weitere Sprache nur noch ein Übersetzungs-Pack.

export const NACHRICHTEN_TYPEN = Object.freeze([
  { id: 'kettenbrief', emoji: '⛓️', hatMelden: false, hatQuellen: false },
  { id: 'mutprobe', emoji: '🔥', hatMelden: true, hatQuellen: false },
  { id: 'geruecht', emoji: '🗣️', hatMelden: true, hatQuellen: true },
]);

/** Findet einen Nachrichtentyp per id (Fallback: der erste). */
export function typNach(id) {
  return NACHRICHTEN_TYPEN.find((t) => t.id === id) ?? NACHRICHTEN_TYPEN[0];
}

/**
 * Baut den vollständigen, übersetzten Typ aus Struktur + Übersetzer.
 * @param {{id:string, emoji:string, hatMelden:boolean, hatQuellen:boolean}} struktur
 * @param {(schluessel:string)=>any} t Übersetzer (kinder-ui/sprache)
 */
export function baueTyp(struktur, t) {
  const p = `typ_${struktur.id}_`;
  return {
    id: struktur.id,
    emoji: struktur.emoji,
    titel: t(p + 'titel'),
    intro: t(p + 'intro'),
    nachricht: t(p + 'nachricht'),
    frage: t(p + 'frage'),
    weiter: t(p + 'weiter'),
    stopp: t(p + 'stopp'),
    melden: struktur.hatMelden ? t(p + 'melden') : null,
    quellenHinweis: struktur.hatQuellen ? t(p + 'quellenHinweis') : null,
    lernpunkte: t(p + 'lernpunkte'),
  };
}
