// Szenario-Trainer für Erzieher*innen zum Elterngespräch (Praleska docs/10,
// Kita-Abschnitt, Eintrag Nr. 73). EIGENENTWURF: Die Situationen und die
// Einstufung 2/1/0 stammen nicht aus der Quelle. Belegt sind die Grundsätze
// (Praleska S. 23, 25) und die Bezugspunkte der Länder und des
// Rahmenlehrplans, die in jedem Erklärtext mit Seite stehen.
//
// TRAGENDE ENTSCHEIDUNG 1: DIE EINSTUFUNG BESCHREIBT DIE ANTWORT, NICHT DIE PERSON.
// Eine Gesamtpunktzahl über alle Situationen würde aus einer Übung eine
// Bewertung der Fachkraft machen; darum gibt es keine Summe und keine Rangliste.
//
// TRAGENDE ENTSCHEIDUNG 2: DIE FALLE IST ALS FALLE GEKENNZEICHNET.
// Die 0-Antwort darf die Muster zeigen, vor denen gewarnt wird (Belehrung,
// Schuldzuweisung, Angst) - aber nur, wenn sie als Falle markiert ist. Sonst
// verbietet das Netz die Formulierung in der 1 und 2 und lässt die 0 frei.
//
// TRAGENDE ENTSCHEIDUNG 3: JEDE EINSTUFUNG HAT EINE QUELLE MIT SEITE.
// Ohne Seitenangabe wäre die Einstufung eine Meinung.

/** Die Stufen, die jede Situation trägt - genau eine je Stufe. */
export const STUFEN = Object.freeze([2, 1, 0]);

/** Die Muster, die in Antworten 1 und 2 und in Erklärungen nicht stehen dürfen.
 *  Die 0-Antwort darf sie tragen, weil sie die Falle ist. */
export const BELEHRUNG = /\bSie müssen\b|\bSo erzieht man\b|\bDas machen Sie falsch\b/i;
export const SCHULDZUWEISUNG = /\bliegt an der Erziehung\b|\bSie sind schuld\b|\bliegt an den Eltern\b/i;
export const ETIKETT = /\bDiagnose\b|\bDefizit\b|\bStörung\b|\bEntwicklungsverzögerung\b|\bProblemeltern\b|\bschwierige Eltern\b|\bbildungsferne Eltern\b/i;
export const ANGST = /\bdürfen Sie sich nicht wundern\b|\bhinterherhinkt\b/i;

/** Eine Gesamtzahl über Situationen: „von X Punkten“, „Gesamtpunkt“. */
export const GESAMTWERTUNG = /\bvon \d+ Punkten\b|\bGesamtpunkt|\bRangliste\b|\bRanking\b/i;

/** Eine Seitenangabe, die eine Quelle nennt: „S. 23“, „PDF-S. 48“. */
export const SEITE = /(?:PDF-)?S\.\s?\d+/;

const nichtLeer = (s) => typeof s === 'string' && s.trim().length > 0;

export function szenarioVon(daten, id) {
  return (daten?.szenarien ?? []).find((s) => s.id === id) ?? null;
}

/** Die Reihenfolge der drei Antworten je Situation: fest, aber nicht immer
 *  gleich (Position 2 ist nicht immer oben). Kein Zufall, damit die Ansicht
 *  reproduzierbar bleibt. */
export function reihenfolge(szenarioIndex, anzahl = 3) {
  const start = szenarioIndex % anzahl;
  return Array.from({ length: anzahl }, (_, k) => (start + k) % anzahl);
}

export function pruefeDaten(daten) {
  const fehler = [];
  const szenarien = daten?.szenarien ?? [];

  if (szenarien.length < 5) fehler.push(`${szenarien.length} Situationen – mindestens fünf`);
  const ids = new Set();
  for (const s of szenarien) {
    const wo = `Situation ${s.id ?? '?'}`;
    if (!nichtLeer(s.id)) fehler.push(`${wo}: id fehlt`);
    else { if (ids.has(s.id)) fehler.push(`${wo}: doppelt`); ids.add(s.id); }
    if (!nichtLeer(s.titel)) fehler.push(`${wo}: titel fehlt`);
    if (!nichtLeer(s.situation) || s.situation.length < 20) fehler.push(`${wo}: situation fehlt oder zu kurz`);

    const opt = s.optionen ?? [];
    if (opt.length !== 3) fehler.push(`${wo}: ${opt.length} Antworten – genau drei`);
    const werte = opt.map((o) => o.wert).sort();
    if (JSON.stringify(werte) !== JSON.stringify([0, 1, 2])) {
      fehler.push(`${wo}: die Stufen sind ${JSON.stringify(opt.map((o) => o.wert))} – genau je eine 2, 1 und 0`);
    }
    for (const o of opt) {
      if (!nichtLeer(o.text)) fehler.push(`${wo}: eine Antwort ist leer`);
      if (o.wert === 0 && o.falle !== true) fehler.push(`${wo}: die 0-Antwort ist nicht als Falle markiert`);
      if (o.wert !== 0 && o.falle) fehler.push(`${wo}: nur die 0-Antwort darf Falle sein`);
      if (o.wert !== 0) {
        if (BELEHRUNG.test(o.text)) fehler.push(`${wo}: Belehrung in einer Antwort ${o.wert}`);
        if (SCHULDZUWEISUNG.test(o.text)) fehler.push(`${wo}: Schuldzuweisung in einer Antwort ${o.wert}`);
        if (ETIKETT.test(o.text)) fehler.push(`${wo}: Etikett in einer Antwort ${o.wert}`);
        if (ANGST.test(o.text)) fehler.push(`${wo}: Angstmache in einer Antwort ${o.wert}`);
      }
    }
    if (!nichtLeer(s.erklaerung) || s.erklaerung.length < 60) fehler.push(`${wo}: erklaerung fehlt oder zu kurz`);
    if (!SEITE.test(s.erklaerung ?? '') && !SEITE.test(s.quelle ?? '')) {
      fehler.push(`${wo}: keine Seitenangabe – eine Einstufung ohne Seite ist eine Meinung`);
    }
    if (!nichtLeer(s.quelle)) fehler.push(`${wo}: quelle fehlt`);
    if (BELEHRUNG.test(s.erklaerung ?? '')) fehler.push(`${wo}: Belehrung in der Erklärung`);
  }

  if (daten?.quelle?.geprueft !== true) fehler.push('quelle.geprueft ist nicht true');
  if (!nichtLeer(daten?.quelle?.abweichung)) fehler.push('quelle.abweichung fehlt – der Katalog behauptet Trainingssituationen, die Quelle nicht hat');
  if (!/keine|nicht/i.test(daten?.quelle?.abweichung ?? '')) fehler.push('quelle.abweichung sagt nicht, dass die Situationen nicht aus der Quelle stammen');
  if (!nichtLeer(daten?.hinweis) || !/Eigenentwurf/.test(daten.hinweis)) fehler.push('hinweis muss den Eigenentwurf benennen');
  if (!nichtLeer(daten?.keinePunktesumme)) fehler.push('keinePunktesumme fehlt');
  // Nur der BEHAUPTENDE Text wird geprüft: „keine Gesamtpunktzahl“ ist eine
  // Verneinung und darf das Wort tragen (Falle A).
  if (GESAMTWERTUNG.test(daten?.wasEsIst ?? '')) {
    fehler.push('wasEsIst nennt eine Gesamtwertung, die es nicht gibt');
  }
  if ((daten?.grundhaltungen ?? []).length < 4) fehler.push('zu wenige Grundhaltungen');
  for (const g of daten?.grundhaltungen ?? []) {
    if (!nichtLeer(g.quelle) || !SEITE.test(g.quelle)) fehler.push(`Grundhaltung „${g.titel ?? '?'}“ ohne Seitenangabe`);
  }
  if ((daten?.verweise ?? []).length < 3) fehler.push('zu wenige Verweise');
  return fehler;
}
