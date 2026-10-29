import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { erhoehungen, KATEGORIEN, pruefeSchreibort, pruefeSchreiben, zaehleKategorien } from '../src/browser-basislinie.mjs';

const WURZEL = fileURLToPath(new URL('../../../', import.meta.url));
const TOOL = join(WURZEL, 'tools', 'browser-basislinie.mjs');
const DATEI = join(WURZEL, 'docs', 'browser-basislinie.json');

const ergebnis = (verletzungen, extra = {}) => ({ status: 1, verletzungen, druck: { zeichen: [] }, beruehrung: { zuKleine: [] }, konsole: { fehler: [], seitenfehler: [] }, antwortFehler: [], netz: { fremd: [] }, ...extra });

test('zaehlt Verletzungen je Kategorie', () => {
  const e = ergebnis([
    'Keine Knöpfe mit data-kennung auf dem Startbildschirm: Klicks nicht gemessen.',
    'Klick auf „x“ nicht möglich: Timeout',
    'Überlauf bei 360 px: 12 px (scrollWidth 372, Bildschirm „A“, Schritt 1)',
    'Druck: 2× „·“ (U+00B7) im sichtbaren Text, z. B. „…“',
  ], { druck: { zeichen: [{ zeichen: '·', anzahl: 2 }] }, beruehrung: { zuKleine: [{}, {}] }, netz: { fremd: ['cdn.example'] } });
  assert.deepEqual(zaehleKategorien(e), {
    nichtGemessen: 0, ohneKennung: 1, klickFehler: 1, ueberlauf: 1, beruehrung: 2, druck: 1, konsole: 0, fremdeHosts: 1,
  });
});

test('nicht gemessen (Status 2) zählt als eine Verletzung', () => {
  assert.equal(zaehleKategorien({ status: 2, verletzungen: [] }).nichtGemessen, 1);
});

test('Kontrolle: eine Erhöhung wird gemeldet, eine Senkung nicht', () => {
  const basis = { apps: { app: { druck: 3 } } };
  assert.deepEqual(erhoehungen(basis, { app: { druck: 4 } }), [{ app: 'app', kategorie: 'druck', basis: 3, aktuell: 4 }], 'Kontrolle: ein neuer Druckfund');
  assert.deepEqual(erhoehungen(basis, { app: { druck: 2 } }), []);
});

test('eine neue App mit Verletzung ist eine Erhöhung, eine neue saubere App nicht', () => {
  const basis = { apps: {} };
  const liste = erhoehungen(basis, { neu: { ...Object.fromEntries(KATEGORIEN.map((k) => [k, 0])), beruehrung: 1 } });
  assert.deepEqual(liste.map((x) => x.kategorie), ['beruehrung']);
  assert.deepEqual(erhoehungen(basis, { sauber: Object.fromEntries(KATEGORIEN.map((k) => [k, 0])) }), []);
});

test('Schreiben: nur Senkungen ohne --erweitern; eine Anlage ohne Vorgänger ist erlaubt', () => {
  const basis = { apps: { app: { druck: 3 } } };
  assert.equal(pruefeSchreiben(null, { app: { druck: 9 } }).erlaubt, true, 'Anlage');
  assert.equal(pruefeSchreiben(basis, { app: { druck: 2 } }).erlaubt, true, 'Senkung');
  const hoch = pruefeSchreiben(basis, { app: { druck: 4 } });
  assert.equal(hoch.erlaubt, false, 'Kontrolle: Erhöhung ohne --erweitern wird abgelehnt');
  assert.equal(hoch.erhoehungen.length, 1);
  assert.equal(pruefeSchreiben(basis, { app: { druck: 4 } }, { erweitern: true }).erlaubt, true);
});

test('Schreibort: nur mit --integrator und nur aus der Repo-Wurzel', () => {
  assert.equal(pruefeSchreibort({ cwd: WURZEL, wurzel: WURZEL, integrator: false }).erlaubt, false, 'ohne Flag: abgelehnt');
  assert.equal(pruefeSchreibort({ cwd: join(WURZEL, 'apps', 'chat-rechte'), wurzel: WURZEL, integrator: true }).erlaubt, false, 'aus einer App: abgelehnt');
  assert.equal(pruefeSchreibort({ cwd: join(WURZEL, 'apps'), wurzel: WURZEL, integrator: true }).erlaubt, false, 'aus einem Unterordner: abgelehnt');
  assert.equal(pruefeSchreibort({ cwd: WURZEL, wurzel: WURZEL, integrator: true }).erlaubt, true, 'Integrator aus der Wurzel: erlaubt');
});

test('Kontrollfall im Prozess: aus einer App-Sitzung verweigert das Werkzeug das Schreiben, die Datei bleibt', () => {
  const vorher = readFileSync(DATEI, 'utf8');
  const leer = mkdtempSync(join(tmpdir(), 'basis-kontrolle-'));
  try {
    const lauf = spawnSync(process.execPath, [TOOL, '--schreiben', leer, '--integrator'], { cwd: join(WURZEL, 'apps', 'chat-rechte'), encoding: 'utf8' });
    assert.equal(lauf.status, 64, lauf.stderr);
    assert.match(lauf.stderr, /nicht aus/);
    assert.equal(readFileSync(DATEI, 'utf8'), vorher, 'die Basislinie bleibt unverändert');
  } finally {
    rmSync(leer, { recursive: true, force: true });
  }
});

test('Kontrollfall im Prozess: ohne --integrator wird auch aus der Wurzel nicht geschrieben', () => {
  const vorher = readFileSync(DATEI, 'utf8');
  const leer = mkdtempSync(join(tmpdir(), 'basis-kontrolle-'));
  try {
    const lauf = spawnSync(process.execPath, [TOOL, '--schreiben', leer], { cwd: WURZEL, encoding: 'utf8' });
    assert.equal(lauf.status, 64, lauf.stderr);
    assert.match(lauf.stderr, /--integrator/);
    assert.equal(readFileSync(DATEI, 'utf8'), vorher, 'die Basislinie bleibt unverändert');
  } finally {
    rmSync(leer, { recursive: true, force: true });
  }
});

// Befund B-13 (29.10.2026): eine Messung mit --alle-knoepfe ist Auskunft. Sie darf die Basislinie nicht schreiben,
// auch nicht aus der Wurzel mit --integrator.
test('Kontrollfall im Prozess: eine Messung mit --alle-knoepfe verweigert das Schreiben, die Datei bleibt', () => {
  const vorher = readFileSync(DATEI, 'utf8');
  const messordner = mkdtempSync(join(tmpdir(), 'basis-alle-'));
  try {
    const messung = { ...ergebnis([]), status: 0, alleKnoepfe: true, zusammenfassung: { klicksInsgesamt: 1, beruehrziele: 1 } };
    writeFileSync(join(messordner, 'testapp.json'), JSON.stringify(messung));
    const lauf = spawnSync(process.execPath, [TOOL, '--schreiben', messordner, '--integrator'], { cwd: WURZEL, encoding: 'utf8' });
    assert.equal(lauf.status, 64, lauf.stderr);
    assert.match(lauf.stderr, /--alle-knoepfe/);
    assert.equal(readFileSync(DATEI, 'utf8'), vorher, 'die Basislinie bleibt unverändert');
  } finally {
    rmSync(messordner, { recursive: true, force: true });
  }
});
