// Kita-Wochenplaner: reine Plan-Logik (ohne DOM), damit sie testbar ist.
// Wichtig (AI Act / docs/02): Der Check bewertet den PLAN, nie Kinder -
// kein Score, kein Ranking, kein Vergleich. Alle Hinweise sind Empfehlungen.

export const TAGE = [
  { id: 'mo', name: 'Montag' },
  { id: 'di', name: 'Dienstag' },
  { id: 'mi', name: 'Mittwoch' },
  { id: 'do', name: 'Donnerstag' },
  { id: 'fr', name: 'Freitag' },
];

/** Zufällige, kollisionsarme Kennung für ein Angebot. */
export function neueId() {
  return `a-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Summe der geplanten Minuten je Bildungsbereich.
 * @param {Array<{bereich: string, dauer: number}>} angebote
 * @returns {Record<string, number>}
 */
export function minutenJeBereich(angebote) {
  const summen = {};
  for (const a of angebote) summen[a.bereich] = (summen[a.bereich] ?? 0) + a.dauer;
  return summen;
}

/**
 * Angebote eines Wochentags in Eintragsreihenfolge.
 * @param {Array<{tag: string}>} angebote
 * @param {string} tagId
 */
export function angeboteFuerTag(angebote, tagId) {
  return angebote.filter((a) => a.tag === tagId);
}

/**
 * Ausgewogenheits-Check über den Wochenplan. Liefert Hinweise (Empfehlungen):
 * - typ 'dauer': ein Angebot ist länger als der Richtwert seiner Altersgruppe,
 * - typ 'tageslast': mehr als maxAngeboteProTag an einem Tag (Freispiel-Vorrang),
 * - typ 'leerer-bereich': ein Bildungsbereich kommt in der Woche nicht vor
 *   (nur gemeldet, wenn überhaupt schon etwas geplant ist).
 * @param {Array<{id: string, tag: string, bereich: string, alter: string, dauer: number, titel: string}>} angebote
 * @param {{bereiche: Array<{id: string, name: string, emoji: string}>,
 *          altersgruppen: Array<{id: string, maxMinutenProAngebot: number, warntext: string}>,
 *          tagesHinweis: {maxAngeboteProTag: number, warntext: string},
 *          wochenHinweis: {warntext: string}}} daten
 * @returns {Array<{typ: string, text: string}>}
 */
export function pruefePlan(angebote, daten) {
  const hinweise = [];

  for (const a of angebote) {
    const gruppe = daten.altersgruppen.find((g) => g.id === a.alter);
    if (gruppe && a.dauer > gruppe.maxMinutenProAngebot) {
      const tag = TAGE.find((t) => t.id === a.tag);
      const bereich = daten.bereiche.find((b) => b.id === a.bereich);
      const name = a.titel || bereich?.name || a.bereich;
      hinweise.push({
        typ: 'dauer',
        angebotId: a.id,
        text: `${tag ? `${tag.name}, ` : ''}„${name}“ (${a.dauer} min): ${gruppe.warntext}`,
      });
    }
  }

  for (const tag of TAGE) {
    const anzahl = angeboteFuerTag(angebote, tag.id).length;
    if (anzahl > daten.tagesHinweis.maxAngeboteProTag) {
      hinweise.push({
        typ: 'tageslast',
        tag: tag.id,
        text: `${tag.name} (${anzahl} Angebote): ${daten.tagesHinweis.warntext}`,
      });
    }
  }

  if (angebote.length > 0) {
    const summen = minutenJeBereich(angebote);
    for (const b of daten.bereiche) {
      if (!summen[b.id]) {
        hinweise.push({
          typ: 'leerer-bereich',
          bereich: b.id,
          text: daten.wochenHinweis.warntext.replace('{bereich}', `${b.emoji} ${b.name}`),
        });
      }
    }
  }

  return hinweise;
}
