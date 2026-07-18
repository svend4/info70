// Vorsorge-Check § 24a JuSchG: reine Logik (ohne DOM), testbar (docs/09
// Nr. 175). Selbstaudit entlang der Vorsorgemaßnahmen des JuSchG mit einer
// Ampel je Kriterium (erfüllt / offen / nicht anwendbar). Ergebnis:
// Ampel-Bericht für BzKJ-Aufsicht und Förderanträge. JuSchG/DSA.

export const AMPEL = Object.freeze({ gruen: 'erfüllt', rot: 'offen', grau: 'nicht anwendbar' });
export const STANDARD = 'rot';

const symbol = (z) => ({ gruen: '🟢', rot: '🔴', grau: '⚪' }[z] ?? '🔴');

export function zaehle(alle, status) {
  const z = { gruen: 0, rot: 0, grau: 0 };
  for (const k of alle) z[status[k.id] ?? STANDARD]++;
  return z;
}

export function ampelBericht(daten, status = {}) {
  const alle = daten.bereiche.flatMap((b) => b.kriterien);
  const z = zaehle(alle, status);
  const zeilen = [
    'Vorsorge-Check § 24a JuSchG – Ampel-Bericht',
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
  zeilen.push('Hinweis: Selbstaudit, kein offizielles Ergebnis. Dokumentation für BzKJ-Aufsicht/Förderanträge.');
  return zeilen.join('\n');
}
