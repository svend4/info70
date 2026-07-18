// Barrierefreiheitserklärungs-Generator: reine Logik (ohne DOM), testbar
// (docs/09 Nr. 169). Formular-zu-Text-Engine mit optionalem Datei-Import des
// BFSG-Check-Prüfprotokolls. Erzeugt eine fertige Erklärung zur
// Barrierefreiheit als Markdown/HTML inkl. Leichte-Sprache-Abschnitt und
// Feedback-/Durchsetzungshinweisen (BFSG/EAA). Alles lokal, kein Request.

export const KONFORMITAET = Object.freeze({
  voll: 'vollständig konform',
  teilweise: 'teilweise konform',
  nicht: 'nicht konform',
});

/** Liest aus einem BFSG-Check-Prüfprotokoll (Text) den Erfüllungsstand. */
export function leseBfsgProtokoll(text) {
  const m = /Erfüllt:\s*(\d+)\s*von\s*(\d+)/i.exec(text ?? '');
  if (!m) return null;
  const erfuellt = Number(m[1]);
  const gesamt = Number(m[2]);
  const anteil = gesamt ? erfuellt / gesamt : 0;
  const konformitaet = anteil >= 1 ? 'voll' : anteil >= 0.5 ? 'teilweise' : 'nicht';
  return { erfuellt, gesamt, anteil, konformitaet };
}

const P = (wert, platzhalter) => (wert && String(wert).trim() ? String(wert).trim() : platzhalter);

/**
 * Baut die Erklärung zur Barrierefreiheit.
 * @param {{anbieter?:string, url?:string, stand?:string, konformitaet?:string,
 *          bekannteBarrieren?:string[], kontaktName?:string, kontaktEmail?:string}} cfg
 * @returns {{markdown:string, html:string, abschnitte:string[]}}
 */
export function baueErklaerung(cfg = {}) {
  const anbieter = P(cfg.anbieter, '[Anbieter/Verantwortliche/r – siehe Impressum]');
  const url = P(cfg.url, '[Adresse des Angebots]');
  const stand = P(cfg.stand, '[Datum]');
  const stufe = KONFORMITAET[cfg.konformitaet] ?? KONFORMITAET.teilweise;
  const barrieren = (cfg.bekannteBarrieren ?? []).map((b) => String(b).trim()).filter(Boolean);
  const kontaktName = P(cfg.kontaktName, '[Name/Funktion]');
  const kontaktEmail = P(cfg.kontaktEmail, '[E-Mail-Adresse]');

  const barrierenBlock = barrieren.length
    ? barrieren.map((b) => `- ${b}`).join('\n')
    : '- Derzeit sind keine wesentlichen Barrieren bekannt. Hinweise nehmen wir gern entgegen.';

  const md = [
    '# Erklärung zur Barrierefreiheit',
    '',
    `${anbieter} ist bemüht, sein Onlineangebot ${url} im Einklang mit dem Barrierefreiheitsstärkungsgesetz (BFSG) und dem European Accessibility Act (EAA) barrierefrei zugänglich zu machen. Maßstab sind die Anforderungen der EN 301 549 bzw. der WCAG 2.1 auf Stufe AA.`,
    '',
    '## Stand der Vereinbarkeit',
    `Dieses Angebot ist mit den genannten Anforderungen **${stufe}**.`,
    `Stand dieser Erklärung: ${stand}. Die Bewertung beruht auf einer Selbstbewertung.`,
    '',
    '## Nicht barrierefreie Inhalte',
    barrierenBlock,
    '',
    '## In einfacher Sprache',
    'Diese Seite soll für alle Menschen gut nutzbar sein – auch für Kinder, für Menschen mit Behinderung und für Menschen, die nicht so gut lesen.',
    'Wir arbeiten daran, dass man alles gut sehen, hören und bedienen kann. Wenn etwas nicht klappt, kannst du uns das sagen. Wir kümmern uns darum.',
    '',
    '## Feedback und Kontakt',
    `Sind Ihnen Mängel bei der Barrierefreiheit aufgefallen? Melden Sie sich bei uns: ${kontaktName}, ${kontaktEmail}.`,
    '',
    '## Durchsetzungsverfahren',
    'Falls wir auf Ihre Rückmeldung nicht zufriedenstellend reagieren, können Sie sich an die zuständige Durchsetzungs- bzw. Schlichtungsstelle wenden (Marktüberwachungsstelle der Länder für das BFSG bzw. die Schlichtungsstelle nach dem Behindertengleichstellungsgesetz).',
  ].join('\n');

  const html = markdownZuHtml(md);
  const abschnitte = md.split('\n').filter((z) => z.startsWith('## ')).map((z) => z.slice(3));
  return { markdown: md + '\n', html, abschnitte };
}

/** Sehr kleiner, sicherer Markdown→HTML-Wandler (nur #, ##, **, -, Absätze). */
export function markdownZuHtml(md) {
  const esc = (s) => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  const fett = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  const zeilen = md.split('\n');
  const out = [];
  let liste = false;
  const listeZu = () => { if (liste) { out.push('</ul>'); liste = false; } };
  for (const z of zeilen) {
    if (z.startsWith('# ')) { listeZu(); out.push(`<h1>${fett(z.slice(2))}</h1>`); }
    else if (z.startsWith('## ')) { listeZu(); out.push(`<h2>${fett(z.slice(3))}</h2>`); }
    else if (z.startsWith('- ')) { if (!liste) { out.push('<ul>'); liste = true; } out.push(`<li>${fett(z.slice(2))}</li>`); }
    else if (z.trim() === '') { listeZu(); }
    else { listeZu(); out.push(`<p>${fett(z)}</p>`); }
  }
  listeZu();
  return out.join('\n');
}
