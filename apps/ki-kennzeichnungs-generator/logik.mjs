// KI-Kennzeichnungs-Generator: reine Logik (ohne DOM), testbar.
// Aus Typ (Chatbot/Bild/Text/Medien) + Altersstufe (6-8/8-12/13-15) +
// Sprache (de/uk/ru) entsteht ein fertiger, kindgerechter Kennzeichnungstext
// und ein einbindbares, in sich abgeschlossenes HTML/CSS-Badge (docs/09 Nr. 172,
// Art. 50 AI Act). Kein externer Request, kein Script im erzeugten Snippet.

const FARBEN = {
  chatbot: { rand: '#2563eb', flaeche: '#eff6ff', tinte: '#1e3a8a' },
  bild: { rand: '#7c3aed', flaeche: '#f5f3ff', tinte: '#5b21b6' },
  text: { rand: '#0891b2', flaeche: '#ecfeff', tinte: '#155e75' },
  medien: { rand: '#dc2626', flaeche: '#fef2f2', tinte: '#991b1b' },
};

/** Schlüssel im Sprachkatalog. */
export function textSchluessel(typ, stufe) {
  return `${typ}_${stufe}`;
}

/**
 * Baut Kennzeichnungstext + HTML-Badge.
 * @param {object} daten  geladenes texte.json
 * @param {{typ:string, stufe:string, sprache:string}} wahl
 * @returns {{text:string, html:string, emoji:string}}
 */
export function baueKennzeichnung(daten, { typ, stufe, sprache }) {
  const typInfo = daten.typen.find((t) => t.id === typ) ?? daten.typen[0];
  const katalog = daten.texte[sprache] ?? daten.texte.de;
  const text = katalog[textSchluessel(typInfo.id, stufe)] ?? '';
  const emoji = typInfo.emoji;
  const f = FARBEN[typInfo.id] ?? FARBEN.chatbot;
  const stil = [
    'display:inline-flex', 'gap:0.45em', 'align-items:center',
    'max-width:100%', 'box-sizing:border-box', 'padding:0.45em 0.8em',
    `border:2px solid ${f.rand}`, 'border-radius:0.7em', `background:${f.flaeche}`,
    `color:${f.tinte}`, 'font:600 0.95em/1.35 system-ui,-apple-system,sans-serif',
  ].join(';');
  const html = `<p role="note" aria-label="KI-Hinweis" lang="${sprache}" style="${stil}"><span aria-hidden="true">${emoji}</span>${escapeHtml(text)}</p>`;
  return { text, html, emoji };
}

/** Minimales HTML-Escaping, damit das Snippet sicher einzubetten ist. */
export function escapeHtml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}
