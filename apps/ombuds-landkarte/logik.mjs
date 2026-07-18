// Ombuds-Landkarte: reine Logik (ohne DOM), testbar.
// Filtert die statisch gepflegten Stellen nach Thema. Keine externen Anfragen.

/** Stellen, die zum gewaehlten Thema passen (null = alle). */
export function filtereStellen(stellen, thema) {
  if (!thema) return stellen;
  return stellen.filter((s) => s.themen.includes(thema));
}

/** Kurzer Wegweiser-Satz je Thema fuer die Anzeige. */
export function themaHinweis(code) {
  return {
    amt: 'Bei Problemen mit dem Jugendamt oder einer Einrichtung hilft die unabhängige Ombudsstelle Jugendhilfe.',
    rechte: 'Für allgemeine Kinderrechts-Fragen sind Kinderbeauftragte und die Monitoring-Stelle zuständig.',
    daten: 'Bei Datenmissbrauch: Beschwerde bei der Datenschutzbehörde (kostenlos, DSGVO Art. 77).',
    internet: 'Illegale/gefährdende Inhalte bei jugendschutz.net melden; Plattform-Verstöße bei der Bundesnetzagentur (DSA).',
    kosten: 'Bei Kostenfallen und Abo-Fallen hilft die Verbraucherzentrale.',
    notlage: 'Bei akuter Sorge sofort anrufen: Nummer gegen Kummer 116 111 (Kinder) · 0800 111 0 550 (Eltern).',
  }[code] ?? '';
}
