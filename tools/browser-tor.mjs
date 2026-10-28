// Delta-Tor der Browser-Prüfung (Entscheidung Max 31а): misst die genannten Apps in der Browser-Prüfung und vergleicht je
// Kategorie mit docs/browser-basislinie.json. Eine Erhöhung (oder eine neue App mit Verletzung) ist ein Fehler; bestehende
// Verletzungen bleiben als Schuld, die Basislinie wird nur kleiner (tools/browser-basislinie.mjs --schreiben, nur Integrator).
// Zufall im Spiel kann die Druckzeichen schwanken lassen (schatzkarten-generator: 1 bis 3 Zeichen je Zufallskarte). Darum wird eine App mit
// Erhöhung bis zu --versuche mal (Standard 3) neu gemessen und je Kategorie der kleinste Wert gezählt: eine echte Verschlechterung hebt
// jeden Lauf, ein Zufallstreffer nur einzelne.
// Aufruf: node tools/browser-tor.mjs <app> [<app> …] [--parallel N] [--versuche N] [--ausgabe <ordner>]
// Exit: 0 keine Erhöhung, 1 mindestens eine Erhöhung, 2 eine App wurde nicht gemessen, 64 Aufruf falsch.
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { erhoehungen, zaehleKategorien } from '../packages/kinderschutz/src/browser-basislinie.mjs';

const WURZEL = fileURLToPath(new URL('../', import.meta.url));
const args = process.argv.slice(2);
const wert = (flag) => { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : null; };
const parallel = Number(wert('--parallel') ?? 4);
const versuche = Number(wert('--versuche') ?? 3);
const ausgabe = wert('--ausgabe') ?? mkdtempSync(join(tmpdir(), 'browser-tor-'));
const flagWerte = new Set(['--parallel', '--versuche', '--ausgabe'].flatMap((f) => (args.includes(f) ? [args[args.indexOf(f) + 1]] : [])));
const apps = args.filter((a) => !a.startsWith('--') && !flagWerte.has(a));
if (!apps.length || !Number.isInteger(parallel) || parallel < 1 || !Number.isInteger(versuche) || versuche < 1) {
  console.error('Aufruf: node tools/browser-tor.mjs <app> [<app> …] [--parallel N] [--versuche N] [--ausgabe <ordner>]');
  process.exit(64);
}
mkdirSync(ausgabe, { recursive: true });

const messe = (app) => new Promise((fertig) => {
  const k = spawn(process.execPath, [join(WURZEL, 'tools', 'browser-pruefung.mjs'), app, '-', ausgabe], { cwd: WURZEL, stdio: 'ignore' });
  k.on('close', () => fertig());
});
const warte = [...apps];
await Promise.all(Array.from({ length: Math.min(parallel, apps.length) }, async () => {
  while (warte.length) await messe(warte.shift());
}));

const basisPfad = join(WURZEL, 'docs', 'browser-basislinie.json');
const basis = existsSync(basisPfad) ? JSON.parse(readFileSync(basisPfad, 'utf8')) : { apps: {} };
const aktuell = {};
const fehlen = [];
for (const a of apps) {
  const datei = join(ausgabe, `${a}.json`);
  if (!existsSync(datei)) { fehlen.push(a); continue; }
  aktuell[a] = zaehleKategorien(JSON.parse(readFileSync(datei, 'utf8')));
}
let liste = erhoehungen(basis, aktuell);
// Wiederholung für Apps mit Erhöhung: kleinster Wert je Kategorie über alle Versuche.
for (let v = 2; v <= versuche && liste.length; v += 1) {
  const wieder = [...new Set(liste.map((e) => e.app))];
  const kopie = join(ausgabe, `versuch-${v}`);
  mkdirSync(kopie, { recursive: true });
  const rest = [...wieder];
  await Promise.all(Array.from({ length: Math.min(parallel, wieder.length) }, async () => {
    while (rest.length) {
      const app = rest.shift();
      await new Promise((fertig) => {
        const k = spawn(process.execPath, [join(WURZEL, 'tools', 'browser-pruefung.mjs'), app, '-', kopie], { cwd: WURZEL, stdio: 'ignore' });
        k.on('close', () => fertig());
      });
    }
  }));
  for (const a of wieder) {
    const datei = join(kopie, `${a}.json`);
    if (!existsSync(datei)) continue;
    const neu = zaehleKategorien(JSON.parse(readFileSync(datei, 'utf8')));
    for (const k of Object.keys(neu)) aktuell[a][k] = Math.min(aktuell[a][k], neu[k]);
  }
  liste = erhoehungen(basis, aktuell);
}
for (const e of liste) console.log(`${e.app}: ${e.kategorie} ${e.basis} → ${e.aktuell}`);
for (const a of fehlen) console.log(`${a}: nicht gemessen (keine Ausgabe in ${ausgabe})`);
console.log(`${Object.keys(aktuell).length} App(s) gemessen, ${liste.length} Erhöhung(en) gegenüber der Basislinie; Messdateien: ${ausgabe}`);
process.exit(fehlen.length ? 2 : liste.length ? 1 : 0);
