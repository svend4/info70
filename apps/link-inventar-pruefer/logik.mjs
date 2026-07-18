// Link-Inventar-Prüfer: reine Logik (ohne DOM), testbar (docs/09 Nr. 166).
// Offline-Werkzeug: aus importiertem HTML werden alle Links extrahiert und
// klassifiziert; je Link folgt eine Prüfliste. KEIN Netzwerkzugriff – nur
// lokales Parsen von Text. fragFINN/Seitenstark/JMStV.

const HOST_MUSTER = [
  { art: 'video', schluessel: ['youtube.com', 'youtu.be', 'vimeo.com', 'dailymotion'] },
  { art: 'social', schluessel: ['instagram.com', 'tiktok.com', 'facebook.com', 'fb.com', 'x.com', 'twitter.com', 'snapchat', 'whatsapp'] },
  { art: 'appstore', schluessel: ['apps.apple.com', 'itunes.apple.com', 'play.google.com'] },
  { art: 'shop', schluessel: ['amazon.', 'ebay.', 'shop', 'store', 'kaufen', 'checkout'] },
];

/** Klassifiziert eine URL grob nach Muster (ohne Netzwerk). */
export function klassifiziere(url) {
  const u = String(url).trim();
  if (!u) return 'leer';
  if (u.startsWith('#')) return 'anker';
  if (u.startsWith('mailto:')) return 'mailto';
  if (u.startsWith('tel:')) return 'tel';
  if (/^(https?:)?\/\//i.test(u)) {
    const klein = u.toLowerCase();
    for (const m of HOST_MUSTER) if (m.schluessel.some((s) => klein.includes(s))) return m.art;
    return 'extern';
  }
  return 'intern';
}

/**
 * Extrahiert Links aus HTML-Text (href und src). Dedupliziert, in Fundreihenfolge.
 * @returns {{url:string, art:string, extern:boolean}[]}
 */
export function extrahiereLinks(html) {
  const treffer = [];
  const gesehen = new Set();
  const re = /(?:href|src)\s*=\s*("([^"]*)"|'([^']*)'|([^\s">]+))/gi;
  let m;
  while ((m = re.exec(String(html ?? ''))) !== null) {
    const url = (m[2] ?? m[3] ?? m[4] ?? '').trim();
    if (!url || gesehen.has(url)) continue;
    gesehen.add(url);
    const art = klassifiziere(url);
    if (art === 'leer' || art === 'anker') continue;
    treffer.push({ url, art, extern: ['extern', 'video', 'social', 'appstore', 'shop'].includes(art) });
  }
  return treffer;
}

/** Zählt externe Links nach Kategorie. */
export function statistik(links) {
  const s = { gesamt: links.length, extern: 0, kategorien: {} };
  for (const l of links) {
    if (l.extern) s.extern++;
    s.kategorien[l.art] = (s.kategorien[l.art] ?? 0) + 1;
  }
  return s;
}

/** Prüfliste je externem Link (docs/09: kindgeeignet? gekennzeichnet? …). */
export const PRUEFPUNKTE = Object.freeze([
  { id: 'kindgeeignet', text: 'Ziel ist kindgeeignet', bezug: 'fragFINN, JMStV' },
  { id: 'gekennzeichnet', text: 'Als externer Link gekennzeichnet', bezug: 'Seitenstark' },
  { id: 'neues-fenster', text: 'Öffnet bewusst (Hinweis „externe Seite“)', bezug: 'Seitenstark' },
  { id: 'kein-tracking', text: 'Kein Werbe-/Tracking-Ziel, kein Shop-Zwang', bezug: 'DSGVO, DSA' },
]);

/** Bericht mit Lücken (unbestätigte Prüfpunkte je Link). */
export function bericht(links, status = {}) {
  const s = statistik(links);
  const zeilen = [
    'Link-Inventar-Prüfer – Bericht',
    `Stand: ${new Date().toLocaleDateString('de-DE')}`,
    `Links gesamt: ${s.gesamt}, davon extern: ${s.extern}`,
    '',
  ];
  const externe = links.filter((l) => l.extern);
  if (!externe.length) {
    zeilen.push('Keine externen Links gefunden. (Interne Links wurden nicht gelistet.)');
  }
  for (const l of externe) {
    zeilen.push(`## ${l.url}  [${l.art}]`);
    for (const p of PRUEFPUNKTE) {
      const ok = status[`${l.url}::${p.id}`];
      zeilen.push(`${ok ? '[x]' : '[ ]'} ${p.text} (${p.bezug})`);
    }
    zeilen.push('');
  }
  zeilen.push('Hinweis: Lokale Selbstprüfung ohne Netzwerkzugriff. Ziele bitte manuell öffnen und prüfen.');
  return zeilen.join('\n');
}
