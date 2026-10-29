// Wortliste der Leistungsbewertung (Entscheidung Max 37в). Erlaubt ist ein neutraler Zähler des Gesammelten oder
// Gefundenen („Gefunden: 3 von 8“, „2 Tricks entdeckt“). Verboten ist, was die Ausführung des Kindes bewertet:
// Punkte, Rekord, Serien („N Tage in Folge“), Prozent, „richtig von“, „geschafft“, Sterne und Pokale, der Vergleich
// von Tagen und Wochen. Die Liste ist ein Bericht je App (tools/leistungs-woerter.mjs), kein Tor: Treffer
// sind zu beurteilen, bevor etwas geändert wird. Verneinung wie im Wertungs-Stand: höchstens drei Wörter davor.
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ohneKommentare, zaehleTreffer } from './bewertung-stand.mjs';

const G = '(?<![a-zäöüß])';
const E = '(?![a-zäöüß])';
/** Gruppe → Muster. Zeichen und Wörter, die eine Leistung des Kindes bewerten. */
export const LEISTUNGS_MUSTER = {
  punkte: new RegExp(`${G}(?:punkte|punktestand|punktzahl|gesamtpunkte|detektiv-punkte)${E}`, 'gi'),
  rekord: new RegExp(`rekord|${G}(?:bestwert|bestenliste|bestleistung)`, 'gi'),
  serie: new RegExp(`${G}streak${E}|in folge${E}|hintereinander${E}|${G}(?:tages|sieges|glücks)serie|\\d+\\s*tage\\s+am\\s+stück`, 'gi'),
  prozent: /\d\s*%|\bprozent\b/gi,
  richtigVon: /\b(?:richtig\w*|treffer)\b[^.\n]{0,20}\bvon\b|\bvon\b[^.\n]{0,20}\brichtig/gi,
  geschafft: new RegExp(`${G}(?:geschafft|gemeistert|bestanden|durchgefallen)${E}`, 'gi'),
  sterneUndPokale: /⭐|🌟|★|☆|🏆|🥇|🥈|🥉|🏅|🎖|\bpokal|\bmedaille|\bsterne?\b/gi,
  vergleich: /wochenübersicht|wochenvergleich|tagesvergleich|(?:besser|mehr|weniger) als (?:gestern|letzte woche|vorige woche)/gi,
  // Seit 29.10.2026 (Plan-Tor 1 nennt „Rang“, Befund B-21). Ein Unterstrich davor zählt als Teil eines Bezeichners
  // (STATUS_RANG in foerder-navigator ist eine Sortierkonstante, kein Rang eines Kindes).
  rang: new RegExp(`(?<![a-zäöüß_])(?:rangliste|rangfolge|rangordnung|rangplatz|ränge|rang)${E}`, 'gi'),
};

/** Treffer in einem Text: [{ gruppe, wort }]. Wörter hinter einer Verneinung zählen nicht. */
export function leistungsTreffer(name, text) {
  const js = /\.m?js$/.test(name);
  const quelle = js ? ohneKommentare(text) : text;
  const treffer = [];
  for (const zeile of quelle.split('\n')) {
    for (const [gruppe, muster] of Object.entries(LEISTUNGS_MUSTER)) {
      for (const m of zeile.matchAll(new RegExp(muster.source, muster.flags))) {
        if (zaehleTreffer(zeile.slice(0, m.index + m[0].length), new RegExp(`${muster.source}$`, muster.flags.replace('g', '')))) {
          treffer.push({ gruppe, wort: m[0].trim() });
        }
      }
    }
  }
  return treffer;
}

/** Treffer je App aus index.html, allen .mjs und daten/*.json: { app: [{ datei, gruppe, wort }] }. */
export async function appLeistungsTreffer(wurzel, slugs) {
  const appsDir = join(wurzel, 'apps');
  const apps = slugs ?? (await readdir(appsDir, { withFileTypes: true })).filter((e) => e.isDirectory()).map((e) => e.name).sort();
  const out = {};
  for (const slug of apps) {
    const dir = join(appsDir, slug);
    const dateien = [
      ...(await readdir(dir, { withFileTypes: true }).catch(() => [])).filter((e) => e.isFile() && /^(?:index\.html|.*\.mjs)$/.test(e.name)).map((e) => e.name),
      ...(await readdir(join(dir, 'daten'), { withFileTypes: true }).catch(() => [])).filter((e) => e.isFile() && e.name.endsWith('.json')).map((e) => `daten/${e.name}`),
    ];
    const liste = [];
    for (const d of dateien) for (const t of leistungsTreffer(d, await readFile(join(dir, d), 'utf8'))) liste.push({ datei: d, ...t });
    if (liste.length) out[slug] = liste;
  }
  return out;
}
