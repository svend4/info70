// Interaktions-Konzept-Assistent: reine Logik (ohne DOM), testbar (docs/09
// Nr. 162). Aus den gewählten Interaktionsfunktionen entstehen (a) die
// geltenden Schutz-Anforderungen (Basis + funktionsspezifisch, dedupliziert)
// und (b) eine ausfüllbare Moderationskonzept-Vorlage. fragFINN/DSA/JMStV/UN-KRK.

/** Gewählte Funktionsobjekte (in Katalogreihenfolge). */
export function gewaehlteFunktionen(daten, ids = []) {
  return daten.funktionen.filter((f) => ids.includes(f.id));
}

/**
 * Alle geltenden Anforderungen für die Auswahl: Basis + funktionsspezifisch,
 * dedupliziert nach Text. Basis nur, wenn überhaupt etwas gewählt ist.
 */
export function anforderungenFuer(daten, ids = []) {
  const gewaehlt = gewaehlteFunktionen(daten, ids);
  if (!gewaehlt.length) return [];
  const liste = [...daten.basis, ...gewaehlt.flatMap((f) => f.anforderungen)];
  const gesehen = new Set();
  return liste.filter((a) => (gesehen.has(a.text) ? false : gesehen.add(a.text)));
}

/** Höchstes Risiko in der Auswahl (für einen Hinweis). */
export function hoechstesRisiko(daten, ids = []) {
  const rang = { niedrig: 1, mittel: 2, hoch: 3, 'sehr hoch': 4 };
  return gewaehlteFunktionen(daten, ids).reduce((max, f) => (rang[f.risiko] > rang[max] ? f.risiko : max), 'niedrig');
}

/** Ausfüllbare Moderationskonzept-Vorlage als Text. */
export function baueModerationskonzept(daten, ids = []) {
  const gewaehlt = gewaehlteFunktionen(daten, ids);
  const anforderungen = anforderungenFuer(daten, ids);
  const z = [
    'Moderationskonzept (Vorlage)',
    `Stand: ${new Date().toLocaleDateString('de-DE')}`,
    'Rechtsrahmen: JMStV, DSA (Art. 16/20/28), JuSchG § 24a, DSGVO, UN-KRK.',
    '',
    '1) Geplante Interaktionsfunktionen:',
    ...(gewaehlt.length ? gewaehlt.map((f) => `   - ${f.name} (Risiko: ${f.risiko})`) : ['   - (noch keine gewählt)']),
    '',
    '2) Geltende Schutz-Anforderungen (Checkliste):',
    ...(anforderungen.length ? anforderungen.map((a) => `   [ ] ${a.text} (${a.bezug})`) : ['   (erst Funktionen wählen)']),
    '',
    '3) Organisation der Moderation (bitte ausfüllen):',
    '   - Wer moderiert? _______________________________',
    '   - Vor- oder Nachmoderation? ____________________',
    '   - Reaktionszeit / Erreichbarkeit? ______________',
    '   - Eskalation bei Gefahr (wer, wie)? ____________',
    '   - Umgang mit Wiederholungstätern? ______________',
    '',
    '4) Netiquette (Kurzfassung in einfacher Sprache): _____________________',
    '',
    'Hinweis: Vorlage, keine Rechtsberatung. An das eigene Angebot anpassen.',
  ];
  return z.join('\n');
}
