// Erste-Wörter-Tagebuch (Praleska docs/10, Eltern-Werkzeuge Nr. 51,
// Quelle S. 29 und S. 37-39).
//
// Tragende Entscheidung, und sie dreht den Katalogeintrag um: DIESE APP
// ZÄHLT NICHT. Keine Wortzahl, keine Summe, kein Zähler je Sprache, kein
// „n Einträge". Der Grund ist fachlich und nicht technisch: „unter 50
// Wörter mit 24 Monaten" ist das Warnzeichen, auf das die Fachwelt schaut,
// wenn sie entscheidet, ob ein Kind Unterstützung braucht. Eine App, die
// eine Wortzahl neben ein Alter stellt, führt genau dieses Screening durch
// - und zwar ohne Zuständigkeit, ohne Normbezug und bei einem
// mehrsprachigen Kind ohne jede gültige Vergleichsgröße. Darum:
//
//   kein Zähler, kein Geburtsdatum, kein Alter in Monaten, keine Summe
//   über Sprachen, kein Normvergleich, kein Cut-off, keine Ampel, kein
//   Score, keine Prognose und keine Empfehlung, die aus den Daten folgt.
//
// Was bleibt, ist ein Heft: was das Kind gesagt hat, was es meinte, in
// welcher Sprache, an welchem Tag. Geordnet nach der ART des Lautes oder
// Wortes, die der Erwachsene gehört hat - nicht nach Lebensmonat (docs/02:
// eine Monatsraster-App braucht ein gespeichertes Geburtsdatum und
// behauptet einen Entwicklungsplan, den es nicht gibt).
//
// Und die Arten sind KEINE Leiter: ein allgemein anerkanntes Stufenmodell
// der frühen Lautentwicklung gibt es im deutschen Schrifttum nicht. Die
// Benennungen gehen auseinander, die einzige Leitlinie mit einer
// Zweiphasen-Einteilung ist abgelaufen, und die Quelle dieser App trennt
// zwei Gurrstufen, für die es im Deutschen nur eine gibt.

/** Die Arten von Lauten und Wörtern - geschlossene Liste. */
export const ARTEN = Object.freeze([
  'schreien', 'gurren', 'quietschen', 'lallen', 'lallen-kanonisch',
  'lallen-variierend', 'lallmonolog', 'lautmalerei', 'wort', 'zwei-woerter',
]);

/** Feldlängen. Kurz halten lädt zum Beobachten ein, nicht zum Urteilen. */
export const MAX_LAUT = 60;
export const MAX_GEMEINT = 60;
export const MAX_SPRACHE = 30;
export const MAX_WO = 80;

/**
 * Wortzahl neben Altersangabe - das Muster, das die App nicht erzeugen
 * darf. Geprüft wird der TEXT, der auf dem Bildschirm oder dem Papier
 * landet: eine Zahl zusammen mit einer Monats- oder Jahresangabe.
 */
export const ZAHL_MIT_ALTER = /\d+\s*(Wörter|Woerter|Worte)[^.]{0,40}(Monat|Jahr|Lebensmonat|alt)|(Monat|Jahr)[^.]{0,40}\d+\s*(Wörter|Woerter|Worte)/i;

/** Bewertungsvokabular. Nirgends, außer in den Feldern, die es ausschließen. */
export const BEWERTUNG = /(^|[^a-zäöüß])(Perzentil|Prozentrang|Cut-?off|Grenzwert|Punktwert|Punktzahl|Normwert|auffällig|unauffällig|Rückstand|Defizit|verzögert|im Soll|Soll-?Stand|Ampel|Score|Diagnose|Screening|Früherkennung|Prävention)/i;

/**
 * Die Wörter, die die Zweckbestimmung kippen würden. „Früherkennung" und
 * „Prävention" ordnen eine Software einer strengeren Regel zu - sie dürfen
 * auch dann nicht dastehen, wenn die App sie gar nicht leistet.
 */
export const ZWECK_KIPPT = /(Früherkennung|Frueherkennung|Prävention|Praevention|Vorsorge-?Screening|Entwicklungstest)/i;

const nichtLeer = (s) => typeof s === 'string' && s.trim().length > 0;

export function artVon(daten, id) {
  return (daten?.arten ?? []).find((a) => a.id === id) ?? null;
}

/** Ein Eintrag aus Rohwerten - gekürzt, getrimmt, ohne Bewertung. */
export function baueEintrag({ laut, gemeint, sprache, art, wo, datum } = {}) {
  if (!nichtLeer(laut) || !ARTEN.includes(art) || !nichtLeer(datum)) return null;
  return {
    id: `${datum}-${String(laut).trim().slice(0, 12)}-${art}`,
    datum: String(datum).slice(0, 10),
    laut: String(laut).trim().slice(0, MAX_LAUT),
    gemeint: nichtLeer(gemeint) ? String(gemeint).trim().slice(0, MAX_GEMEINT) : '',
    sprache: nichtLeer(sprache) ? String(sprache).trim().slice(0, MAX_SPRACHE) : '',
    art,
    wo: nichtLeer(wo) ? String(wo).trim().slice(0, MAX_WO) : '',
  };
}

/** Nur Einträge, die dem Schema entsprechen - für den Import von Datei. */
export function istEintrag(x) {
  return Boolean(x) && typeof x === 'object'
    && nichtLeer(x.laut) && ARTEN.includes(x.art) && nichtLeer(x.datum)
    && String(x.laut).length <= MAX_LAUT
    && String(x.gemeint ?? '').length <= MAX_GEMEINT
    && String(x.sprache ?? '').length <= MAX_SPRACHE
    && String(x.wo ?? '').length <= MAX_WO
    // Kein Geburtsdatum, kein Alter, kein Name: Felder, die es nicht gibt,
    // dürfen auch nicht hereinwandern.
    && !('geburtsdatum' in x) && !('alter' in x) && !('name' in x) && !('monate' in x);
}

/** Chronologisch, neueste zuerst. Stabil bei gleichem Datum. */
export function nachDatum(eintraege) {
  return [...(eintraege ?? [])].sort((a, b) => (a.datum === b.datum ? 0 : a.datum < b.datum ? 1 : -1));
}

/**
 * Nach Art gruppiert, in der Reihenfolge der Liste. Leere Arten kommen
 * MIT - sonst wäre die Lücke ein stilles Urteil darüber, was fehlt.
 */
export function nachArt(daten, eintraege) {
  return (daten?.arten ?? []).map((a) => ({
    art: a,
    eintraege: nachDatum((eintraege ?? []).filter((e) => e.art === a.id)),
  }));
}

/**
 * Nach Sprache gruppiert. GETRENNT und ohne Summe: Vergleichsmaßstäbe
 * bestehen nur für Kinder, die einsprachig deutsch aufwachsen, und eine
 * Summe wäre wieder eine Zahl, mit der man vergleicht.
 */
export function nachSprache(eintraege) {
  const sprachen = [...new Set((eintraege ?? []).map((e) => e.sprache || '—'))].sort();
  return sprachen.map((s) => ({
    sprache: s,
    eintraege: nachDatum((eintraege ?? []).filter((e) => (e.sprache || '—') === s)),
  }));
}

/**
 * Der Export: chronologische Rohliste. Kopf sagt, was es ist und was es
 * nicht ist. Keine Summe, keine Farbe, keine Auffälligkeitsaussage, keine
 * Zahl.
 */
export function exportText(daten, eintraege, stand) {
  const zeilen = [
    daten?.export?.kopf ?? '',
    daten?.export?.hinweis ?? '',
    `Liste erstellt am ${stand}`,
    '',
  ];
  for (const e of nachDatum(eintraege)) {
    const art = artVon(daten, e.art);
    const teile = [
      e.datum,
      `„${e.laut}“`,
      e.gemeint ? `= ${e.gemeint}` : '',
      e.sprache ? `(${e.sprache})` : '',
      art ? `· ${art.name}` : '',
      e.wo ? `· ${e.wo}` : '',
    ].filter(Boolean);
    zeilen.push(teile.join(' '));
  }
  if (!(eintraege ?? []).length) zeilen.push('(noch kein Eintrag)');
  return zeilen.join('\n');
}

/** Datei-Inhalt zum Sichern und Wiedereinlesen. */
export function packe(eintraege) {
  return JSON.stringify({ art: 'erste-woerter-tagebuch', version: 1, eintraege: eintraege ?? [] }, null, 1);
}

/**
 * Prüft eine eingelesene Datei, BEVOR etwas übernommen wird. Ein Name oder
 * ein Geburtsdatum lässt sich so nicht hereinschmuggeln.
 */
export function pruefePaket(rohtext) {
  let p;
  try { p = JSON.parse(rohtext); } catch { return { ok: false, grund: 'Das ist keine Datei dieser App.' }; }
  if (p?.art !== 'erste-woerter-tagebuch') return { ok: false, grund: 'Das ist keine Datei dieser App.' };
  if (!Array.isArray(p.eintraege)) return { ok: false, grund: 'In der Datei stehen keine Einträge.' };
  const gut = p.eintraege.filter(istEintrag);
  if (!gut.length) return { ok: false, grund: 'In der Datei steht kein Eintrag, der hierher passt.' };
  return { ok: true, eintraege: gut, verworfen: p.eintraege.length - gut.length };
}

/** Zusammenführen ohne Dubletten, ohne Zählung nach außen. */
export function vereinige(alt, neu) {
  const bekannt = new Set((alt ?? []).map((e) => e.id));
  return [...(alt ?? []), ...(neu ?? []).filter((e) => !bekannt.has(e.id))];
}

/**
 * Validiert die Texte der App. Was hier steht, ist die Zusicherung: die
 * App bewertet nicht, zählt nicht und nennt kein Alter.
 */
export function pruefeDaten(daten) {
  const fehler = [];
  const arten = daten?.arten ?? [];

  if (arten.length !== ARTEN.length) fehler.push(`arten: ${arten.length} aufgeführt, ${ARTEN.length} erwartet`);
  for (const a of arten) {
    const wo = `Art ${a.id ?? '?'}`;
    if (!ARTEN.includes(a.id)) fehler.push(`${wo}: unbekannte id`);
    if (!nichtLeer(a.name)) fehler.push(`${wo}: name fehlt`);
    if (!nichtLeer(a.erklaerung)) fehler.push(`${wo}: erklaerung fehlt`);
    if (!nichtLeer(a.beispiel)) fehler.push(`${wo}: beispiel fehlt – ohne Beispiel ist die Art nicht erkennbar`);
    // Kein Alter in der Art: das wäre die Monatsleiter durch die Hintertür.
    if (/\d\s*(Monat|Woche|Jahr)|\bab \d|\bmit \d/i.test(`${a.name} ${a.erklaerung} ${a.beispiel}`)) {
      fehler.push(`${wo}: Altersangabe in der Art – geordnet wird nach dem, was zu hören ist`);
    }
  }
  for (const id of ARTEN) {
    if (!arten.some((a) => a.id === id)) fehler.push(`Art ${id}: fehlt in den Daten`);
  }

  // Bewertungsvokabular: nur die Felder, die es AUSSCHLIESSEN, dürfen es
  // nennen. Ein Netz auf das nackte Wort träfe die eigene Ausnahmeklausel.
  const ausnahmeFelder = new Set(['keinScreening', 'keineZahl', 'keinAlter', 'keinStufenmodell',
    'wasEsIst', 'mehrsprachig', 'mehrsprachigKeinRisiko', 'keineSumme', 'nurEltern', 'fragebogen']);
  for (const [feld, wert] of Object.entries(daten ?? {})) {
    if (typeof wert !== 'string' || ausnahmeFelder.has(feld)) continue;
    if (BEWERTUNG.test(wert)) fehler.push(`${feld}: Bewertungsvokabular – diese App bewertet nicht`);
  }
  for (const a of arten) {
    const text = `${a.name} ${a.erklaerung} ${a.beispiel}`;
    if (BEWERTUNG.test(text)) fehler.push(`Art ${a.id}: Bewertungsvokabular`);
    if (ZWECK_KIPPT.test(text)) fehler.push(`Art ${a.id}: „Früherkennung“ oder „Prävention“ – das kippt die Zweckbestimmung`);
  }

  // Keine Wortzahl neben einer Altersangabe, nirgends.
  for (const [feld, wert] of Object.entries(daten ?? {})) {
    if (typeof wert === 'string' && ZAHL_MIT_ALTER.test(wert)) {
      fehler.push(`${feld}: eine Wortzahl neben einer Altersangabe – genau das fachliche Warnzeichen`);
    }
  }

  // Pflichtsätze: was die App über sich selbst sagen MUSS.
  const pflicht = [
    ['hinweis', /in Ihrer Hand/, 'das Gerät gehört dem Erwachsenen'],
    ['hinweis', /sieht keinen Bildschirm/, 'der Kind-Screen muss ausgeschlossen sein'],
    ['wasEsIst', /kein Test/, 'dass es kein Test ist, muss zuerst dastehen'],
    ['wasEsIst', /nichts (wird )?gezählt|nichts gezählt/, 'die fehlende Zählung muss ausgesprochen sein'],
    ['keinScreening', /Kinderarztpraxis/, 'die zuständige Stelle muss benannt sein'],
    ['keineZahl', /bewusste Entscheidung/, 'die fehlende Zählung darf nicht wie eine Lücke aussehen'],
    ['keinAlter', /kein Geburtsdatum/, 'das fehlende Geburtsdatum muss ausgesprochen sein'],
    ['keinStufenmodell', /keine Leiter/, 'die Arten dürfen nicht als Stufen gelesen werden'],
    ['keinStufenmodell', /gibt es im deutschen Fachschrifttum nicht/, 'das fehlende Stufenmodell muss benannt sein'],
    ['mehrsprachig', /über alle seine Sprachen zusammen aber nicht weniger/, 'der Grund für die getrennte Erfassung muss dastehen'],
    ['mehrsprachigKeinRisiko', /nicht häufiger/, 'die fachliche Lage zur Mehrsprachigkeit muss genau dastehen'],
    ['mehrsprachigKeinRisiko', /alle Sprachen/, 'und dass eine Störung alle Sprachen betrifft'],
    ['keineSumme', /getrennt geführt/, 'die fehlende Summe muss begründet sein'],
    ['nurEltern', /nicht für die Kindertagespflege/, 'die Abgrenzung muss ausgesprochen sein'],
    ['speicherGrenzen', /privates Fenster/, 'die technischen Grenzen müssen sichtbar sein'],
    ['speicherGrenzen', /einzige Sicherung/, 'und dass der Export die einzige Sicherung ist'],
    ['speichernAufKnopf', /erst, wenn/, 'dass erst auf Knopfdruck gespeichert wird'],
    ['ueberDritte', /anderen Elternteil/, 'der Hinweis zu Dritten muss konkret sein'],
    ['tastaturHinweis', /Tastatur/, 'die Tastaturlern-Grenze muss benannt sein'],
    ['fragebogen', /baut keinen davon nach/, 'die Abgrenzung zu den Fachfragebogen muss dastehen'],
  ];
  for (const [feld, muster, warum] of pflicht) {
    if (!muster.test(String(daten?.[feld] ?? ''))) fehler.push(`${feld}: ${warum}`);
  }

  // Mehrsprachigkeit: BEIDE falschen Richtungen sind verboten. Die
  // fachliche Lage ist „nicht häufiger, aber möglich, und dann in allen
  // Sprachen" - „unbedenklich" ist so falsch wie „verursacht".
  const mehr = String(daten?.mehrsprachigKeinRisiko ?? '');
  if (/unbedenklich|harmlos|völlig normal und ohne/.test(mehr)) {
    fehler.push('mehrsprachigKeinRisiko: „unbedenklich“ ist zu stark – möglich ist eine Störung, nur nicht häufiger');
  }
  if (/verursacht|führt zu|löst .{0,20}aus|verzögert/.test(mehr)) {
    fehler.push('mehrsprachigKeinRisiko: Mehrsprachigkeit als Ursache – das ist fachlich falsch');
  }

  // Keine Fundstelle ohne Prüfvermerk, und kein Paragraf, keine
  // Leitliniennummer, kein Jahr in den Oberflächentexten: die Rechtslage um
  // ein solches Heft ist in Bewegung, und eine gedruckte Paragrafenangabe
  // veraltet schneller als die App gepflegt wird.
  if (!daten?.quelle?.geprueft) fehler.push('quelle.geprueft fehlt – eine Seitenangabe steht nur mit Prüfvermerk');
  if (!/Eigenproduktion/.test(daten?.quelle?.rechte ?? '')) fehler.push('quelle.rechte muss „Eigenproduktion“ aussprechen');
  if (!/eine Gurrphase|nur eine Gurrphase/.test(daten?.quelle?.abweichung ?? '')) {
    fehler.push('quelle.abweichung muss die zusammengelegte Gurrphase benennen');
  }
  if (!/Warnzeichen/.test(daten?.quelle?.abweichung ?? '')) {
    fehler.push('quelle.abweichung muss sagen, warum die Wortzahl der Quelle nicht übernommen ist');
  }
  const oberflaeche = Object.entries(daten ?? {})
    .filter(([f, w]) => typeof w === 'string' && f !== 'quelle').map(([, w]) => w).join(' ');
  if (/§\s*\d|Art\.\s*\d+\s*(DSGVO|MDR)|AWMF|S2k|S3-Leitlinie|Register-?Nr/i.test(oberflaeche)) {
    fehler.push('Oberflächentext nennt Paragrafen oder Leitliniennummern – das veraltet und gehört nicht auf einen Elternzettel');
  }
  if (ZWECK_KIPPT.test(oberflaeche.replace(/[^.!?]*(kein|nicht|keine)[^.!?]*[.!?]/g, ''))) {
    fehler.push('Oberflächentext nennt „Früherkennung“ oder „Prävention“ außerhalb einer Verneinung');
  }
  return fehler;
}
