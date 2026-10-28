// Seitenangaben und ihre Marke (docs/02: eine Seitenangabe steht nur mit der Markierung „von einem Menschen geprüft“;
// solange das nicht geschehen ist, sagt die App es ehrlich: Entscheidung Max 22а). Statische Prüfung der Nutzerdateien einer App:
// index.html, eltern.html, .mjs (ohne Kommentare) und daten/*.json. README und GDD zählen nicht.
// Der Stand docs/seitenmarke-stand.json führt die Apps, die Seitenangaben ohne Marke zeigen; er schrumpft nur.
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ohneKommentare } from './bewertung-stand.mjs';

/** Eine Seitenangabe im Text: „S. 12“, „S. 12–14“, „Seite 12“, „стр. 12“. */
// „S. 3“ nach „Abs. 2“ ist ein Satz („Art. 28 Abs. 3 S. 1“), keine Seite. „с. 300“ ist die kurze russische Form.
export const SEITENANGABE = /(?<![\p{L}\p{N}])(?:(?<!Abs\.\s?\d+\s?)S\.\s?\d+(?:\s?[–-]\s?\d+)?|Seiten?\s+\d+|(?:стр|с)\.\s?\d+)/u;
/** Die Marke: „nicht von einem Menschen geprüft“ in einer der gebräuchlichen Formen. */
export const MARKE = /(?:nicht|noch nicht)\s+(?:von\s+einem\s+Menschen|durch\s+Menschen|von\s+Menschen)\s+geprüft/i;

/** Hat der Text eine Seitenangabe / die Marke? */
export const hatSeitenangabe = (text) => SEITENANGABE.test(text);
export const hatMarke = (text) => MARKE.test(text);

/** Nutzerdateien einer App als { name: Text }, Code ohne Kommentare. */
export async function nutzerDateien(appDir) {
  const out = {};
  const wurzel = await readdir(appDir, { withFileTypes: true }).catch(() => []);
  for (const e of wurzel) {
    if (e.isFile() && /^(?:index\.html|eltern\.html|.*\.mjs)$/.test(e.name)) {
      const t = await readFile(join(appDir, e.name), 'utf8');
      out[e.name] = e.name.endsWith('.mjs') ? ohneKommentare(t) : t;
    }
  }
  for (const e of await readdir(join(appDir, 'daten'), { withFileTypes: true }).catch(() => [])) {
    if (e.isFile() && e.name.endsWith('.json')) out[`daten/${e.name}`] = await readFile(join(appDir, 'daten', e.name), 'utf8');
  }
  return out;
}

/** Befund einer App: { seiten: [Dateien mit Seitenangabe], marke: ob irgendeine Nutzerdatei die Marke trägt }. */
export async function appBefund(appDir) {
  const d = await nutzerDateien(appDir);
  return {
    seiten: Object.entries(d).filter(([, t]) => hatSeitenangabe(t)).map(([n]) => n),
    marke: Object.values(d).some((t) => hatMarke(t)),
  };
}

/** Apps mit Seitenangaben ohne Marke: { app: [Dateien] }. */
export async function appsOhneMarke(wurzel) {
  const appsDir = join(wurzel, 'apps');
  const out = {};
  for (const e of (await readdir(appsDir, { withFileTypes: true })).filter((e) => e.isDirectory())) {
    const b = await appBefund(join(appsDir, e.name));
    if (b.seiten.length && !b.marke) out[e.name] = b.seiten;
  }
  return out;
}

/**
 * Vergleich mit dem Stand: Probleme als Text, leer heißt ok. `ausnahmen` sind Apps, deren Seitenangaben nirgends angezeigt oder
 * gedruckt werden (nur in Daten, die ein Validator liest): eine Marke hätte nichts zu kennzeichnen. Der Grund steht im Stand.
 */
export function vergleiche(stand, aktuell, ausnahmen = {}) {
  const probleme = [];
  const betroffen = Object.keys(aktuell).filter((a) => !(a in ausnahmen));
  for (const a of betroffen) if (!(a in stand)) probleme.push(`${a}: Seitenangaben ohne Marke (neu)`);
  for (const a of Object.keys(stand)) if (!betroffen.includes(a)) probleme.push(`${a}: Marke vorhanden oder keine Seitenangabe mehr, aus docs/seitenmarke-stand.json streichen`);
  for (const a of Object.keys(ausnahmen)) if (!(a in aktuell)) probleme.push(`Ausnahme ${a}: keine Seitenangabe ohne Marke mehr, Ausnahme streichen`);
  return probleme;
}
