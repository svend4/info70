// Leichte-Sprache-Prüfhilfe: reine, regelbasierte Textanalyse (ohne DOM),
// testbar (docs/09 Ось D Nr. 222). Keine KI, keine externen Anfragen –
// alle Regeln sind lokal und messbar. Die Treffer sind Hinweise, keine
// harten Fehler. Angelehnt an Regeln der Leichten Sprache / DIN SPEC 33429.

const WORT_RE = /[A-Za-zÄÖÜäöüßẞ]+(?:-[A-Za-zÄÖÜäöüßẞ]+)*/g;
const WERDEN = ['wird', 'werden', 'wurde', 'wurden', 'worden', 'geworden'];

/** Zerlegt Text in Sätze (an .!? mit Folgeleerzeichen und an Zeilenumbrüchen). */
export function saetzeTeilen(text) {
  return String(text)
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Wörter eines Satzes (Bindestrich-Wörter bleiben zusammen). */
export function woerter(satz) {
  return String(satz).match(WORT_RE) ?? [];
}

/** Wortlänge = längster Teil zwischen Bindestrichen (getrennte Wörter sind ok). */
export function wortLaenge(wort) {
  return Math.max(...String(wort).split('-').map((t) => t.length), 0);
}

/** Sätze über der Wortgrenze. */
export function langeSaetze(text, maxWoerter) {
  return saetzeTeilen(text)
    .map((satz) => ({ satz, anzahl: woerter(satz).length }))
    .filter((s) => s.anzahl > maxWoerter);
}

/** Eindeutige zu lange Wörter (Reihenfolge des ersten Auftretens). */
export function langeWoerter(text, maxZeichen) {
  const gesehen = new Set();
  const treffer = [];
  for (const w of String(text).match(WORT_RE) ?? []) {
    const laenge = wortLaenge(w);
    if (laenge > maxZeichen) {
      const key = w.toLowerCase();
      if (!gesehen.has(key)) { gesehen.add(key); treffer.push({ wort: w, laenge }); }
    }
  }
  return treffer;
}

/** Sätze mit Passiv-Signal (werden-Form). Heuristik – zum Prüfen. */
export function passivSignale(text) {
  const treffer = [];
  for (const satz of saetzeTeilen(text)) {
    const ws = woerter(satz).map((w) => w.toLowerCase());
    const signal = ws.find((w) => WERDEN.includes(w));
    if (signal) treffer.push({ satz, signal });
  }
  return treffer;
}

/** Eindeutige Nominalstil-Kandidaten (Substantive auf typischen Suffixen). */
export function nominalstil(text, suffixe) {
  const gesehen = new Set();
  const treffer = [];
  for (const w of String(text).match(WORT_RE) ?? []) {
    if (!/^[A-ZÄÖÜ]/.test(w)) continue; // Substantive sind großgeschrieben
    if (w.length < 6) continue;
    const low = w.toLowerCase();
    if (suffixe.some((suf) => low.endsWith(suf)) && !gesehen.has(low)) {
      gesehen.add(low);
      treffer.push(w);
    }
  }
  return treffer;
}

/** Gefundene Fremdwörter aus der Liste (mit einfacher Alternative). */
export function fremdwoerter(text, liste) {
  const wortSet = new Set((String(text).match(WORT_RE) ?? []).map((w) => w.toLowerCase()));
  const treffer = [];
  for (const eintrag of liste) {
    const fw = eintrag.wort.toLowerCase();
    let da = wortSet.has(fw);
    if (!da) for (const w of wortSet) { if (w.startsWith(fw)) { da = true; break; } }
    if (da) treffer.push(eintrag);
  }
  return treffer;
}

/**
 * Vollständige Analyse eines Textes nach den Regeln.
 * @returns Kennzahlen, Trefferlisten, Hinweise und eine Ampel.
 */
export function analysiere(text, regeln) {
  const roh = String(text ?? '');
  const saetze = saetzeTeilen(roh);
  const alleWoerter = roh.match(WORT_RE) ?? [];
  const g = regeln.grenzwerte;

  if (saetze.length === 0) {
    return {
      leer: true,
      kennzahlen: { saetze: 0, woerter: 0, schnittSatzlaenge: 0, langeSaetze: 0, langeWoerter: 0, passiv: 0, nominalstil: 0, fremdwoerter: 0 },
      langeSaetze: [], langeWoerter: [], passiv: [], nominalstil: [], fremdwoerter: [],
      hinweise: [], ampel: 'grau',
    };
  }

  const ls = langeSaetze(roh, g.satzWoerterMax);
  const lw = langeWoerter(roh, g.wortZeichenMax);
  const pv = passivSignale(roh);
  const nm = nominalstil(roh, regeln.nominalSuffixe);
  const fw = fremdwoerter(roh, regeln.fremdwoerter);

  const kennzahlen = {
    saetze: saetze.length,
    woerter: alleWoerter.length,
    schnittSatzlaenge: Math.round(alleWoerter.length / saetze.length),
    langeSaetze: ls.length,
    langeWoerter: lw.length,
    passiv: pv.length,
    nominalstil: nm.length,
    fremdwoerter: fw.length,
  };

  const t = regeln.hinweisTexte;
  const hinweise = [];
  if (ls.length) hinweise.push({ regel: 'langeSaetze', anzahl: ls.length, text: t.langeSaetze.replace('{max}', g.satzWoerterMax) });
  if (lw.length) hinweise.push({ regel: 'langeWoerter', anzahl: lw.length, text: t.langeWoerter.replace('{max}', g.wortZeichenMax) });
  if (pv.length) hinweise.push({ regel: 'passiv', anzahl: pv.length, text: t.passiv });
  if (nm.length) hinweise.push({ regel: 'nominalstil', anzahl: nm.length, text: t.nominalstil });
  if (fw.length) hinweise.push({ regel: 'fremdwoerter', anzahl: fw.length, text: t.fremdwoerter });

  const summe = ls.length + lw.length + pv.length + nm.length + fw.length;
  let ampel = 'gruen';
  if (summe > 0) ampel = 'gelb';
  if (summe >= saetze.length || ls.length >= 2) ampel = 'rot';

  return { leer: false, kennzahlen, langeSaetze: ls, langeWoerter: lw, passiv: pv, nominalstil: nm, fremdwoerter: fw, hinweise, ampel };
}

const AMPEL_TEXT = { gruen: '🟢 gut lesbar', gelb: '🟡 einige Hinweise', rot: '🔴 schwer lesbar', grau: '⚪ kein Text' };

/** Baut einen Text-Bericht der Analyse (für Export/Kopieren). */
export function bericht(text, regeln) {
  const a = analysiere(text, regeln);
  if (a.leer) return 'Leichte-Sprache-Prüfhilfe – kein Text eingegeben.';
  const k = a.kennzahlen;
  const zeilen = [
    'Leichte-Sprache-Prüfhilfe – Bericht',
    `Grundlage: ${regeln.quelle}`,
    `Ergebnis: ${AMPEL_TEXT[a.ampel]}`,
    `Sätze: ${k.saetze}   Wörter: ${k.woerter}   Ø Satzlänge: ${k.schnittSatzlaenge} Wörter`,
    '',
    '## Hinweise',
  ];
  if (!a.hinweise.length) {
    zeilen.push('Keine Regel-Treffer. Text wirkt gut lesbar.');
  } else {
    for (const h of a.hinweise) zeilen.push(`- (${h.anzahl}×) ${h.text}`);
  }
  const block = (titel, eintraege) => {
    if (!eintraege.length) return;
    zeilen.push('', `## ${titel}`);
    for (const e of eintraege) zeilen.push(`- ${e}`);
  };
  block('Zu lange Sätze', a.langeSaetze.map((s) => `(${s.anzahl} Wörter) ${s.satz}`));
  block('Zu lange Wörter', a.langeWoerter.map((w) => `${w.wort} (${w.laenge} Zeichen)`));
  block('Passiv-Signale', a.passiv.map((p) => `„${p.signal}“ in: ${p.satz}`));
  block('Nominalstil-Kandidaten', a.nominalstil);
  block('Fremdwörter', a.fremdwoerter.map((f) => `${f.wort} → ${f.einfach}`));
  zeilen.push('', 'Hinweis: regelbasierte Hilfe, keine Garantie. Sprache bleibt Ermessenssache.');
  return zeilen.join('\n');
}
