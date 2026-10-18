// Externe Fakten (Normen, Studien, Erste-Hilfe-Angaben): eine Zeile mit einer positiven Behauptung
// dieser Art braucht eine Fundstelle („S. n“, „Praleska“) oder den Vermerk
// „Eigenentwurf, fachlich nicht geprüft“. Zeilen, die etwas verneinen („keine Studie“), sind keine
// Behauptung. Das Muster ist eng gehalten: Wörter wie „Teilnehmer“ oder „Prozent“ allein zählen nicht.
import { readFile, readdir, access } from 'node:fs/promises';

export const BEHAUPTUNG = /(\bEN \d|\bDIN \d|\bISO \d|\bAWMF|\bBZgA|\bBIÖG|\bWHO\b|\bG-BA\b|§\s*\d|\bRichtlinie\b|\bVerordnung\b|\bStudie\b|\brandomis|\bGegenstimme|\bn\s*=\s*\d|\d+\s*Prozent|\d+\s*%|Erste[- ]Hilfe|Giftnotruf)/i;
export const VERNEINT = /\b(kein|keine|keinen|keiner|ohne|nicht|nie)\b/i;
export const BELEG = /Eigenentwurf, fachlich nicht geprüft|\(S\. \d|Praleska/;

const DATEIEN = ['index.html', 'app.mjs', 'logik.mjs', 'druck.css', 'package.json', 'README.md', 'GDD.md'];

const existiert = async (p) => { try { await access(p); return true; } catch { return false; } };

// Liefert „datei:zeile“ für jede Behauptung ohne Beleg in den Dateien einer App.
export async function externeFakten(appDir) {
  const dateien = DATEIEN.map((d) => `${appDir}/${d}`);
  if (await existiert(`${appDir}/daten`)) {
    for (const f of await readdir(`${appDir}/daten`)) if (f.endsWith('.json')) dateien.push(`${appDir}/daten/${f}`);
  }
  const treffer = [];
  for (const d of dateien) {
    if (!(await existiert(d))) continue;
    const zeilen = (await readFile(d, 'utf8')).split('\n');
    zeilen.forEach((z, i) => {
      if (BEHAUPTUNG.test(z) && !VERNEINT.test(z) && !BELEG.test(z)) treffer.push(`${d.slice(appDir.length + 1)}:${i + 1}`);
    });
  }
  return treffer;
}
