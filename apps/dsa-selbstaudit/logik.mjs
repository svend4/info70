// DSA-Selbstaudit Minderjährigenschutz: reine Logik (ohne DOM), testbar
// (docs/09 Nr. 168). Anders als eine Ja/Nein-Checkliste nutzt dieses Audit
// eine AMPEL mit drei Zuständen je Kriterium: erfüllt (grün), offen (rot),
// nicht anwendbar (grau). Ergebnis ist ein Ampel-Bericht. DSA/JuSchG.

export const AMPEL = Object.freeze({
  gruen: 'erfüllt',
  rot: 'offen',
  grau: 'nicht anwendbar',
});

/** Standardwert, wenn ein Kriterium noch nicht bewertet wurde: offen. */
export const STANDARD = 'rot';

const symbol = (z) => ({ gruen: '🟢', rot: '🔴', grau: '⚪' }[z] ?? '🔴');

/** Zählt die Zustände über alle Kriterien. */
export function zaehle(alle, status) {
  const z = { gruen: 0, rot: 0, grau: 0 };
  for (const k of alle) z[status[k.id] ?? STANDARD]++;
  return z;
}

/**
 * Baut den Ampel-Bericht.
 * @param {object} daten  kriterien.json (mit .bereiche)
 * @param {Record<string,'gruen'|'rot'|'grau'>} status
 */
export function ampelBericht(daten, status = {}) {
  const alle = daten.bereiche.flatMap((b) => b.kriterien);
  const z = zaehle(alle, status);
  const zeilen = [
    'DSA-Selbstaudit Minderjährigenschutz – Ampel-Bericht',
    `Grundlage: ${daten.quelle}`,
    `Stand: ${new Date().toLocaleDateString('de-DE')}`,
    `🟢 erfüllt: ${z.gruen}   🔴 offen: ${z.rot}   ⚪ nicht anwendbar: ${z.grau}   (von ${alle.length})`,
    '',
  ];
  for (const b of daten.bereiche) {
    zeilen.push(`## ${b.name}`);
    for (const k of b.kriterien) {
      const zustand = status[k.id] ?? STANDARD;
      zeilen.push(`${symbol(zustand)} [${AMPEL[zustand]}] ${k.text} (${k.bezug})`);
    }
    zeilen.push('');
  }
  const offen = alle.filter((k) => (status[k.id] ?? STANDARD) === 'rot');
  if (offen.length) {
    zeilen.push('## Offen – als Nächstes umsetzen');
    for (const k of offen) zeilen.push(`- ${k.text}`);
    zeilen.push('');
  }
  zeilen.push('Hinweis: Selbstaudit, kein offizielles DSA-Konformitätsergebnis.');
  return zeilen.join('\n');
}
