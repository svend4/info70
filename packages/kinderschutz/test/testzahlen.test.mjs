import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';

// Nennt ein README oder GDD die Zahl der Tests einer App, muss sie stimmen.
//
// In Welle 77 stand in GDD und README von tier-tanz-impulse 24, die Datei
// hatte 25, und die Aufzählung im GDD liess den letzten aus. Ein Dokument,
// das seine eigene Prüfmenge falsch angibt, ist genau dort nicht nachprüfbar,
// wo es Nachprüfbarkeit zusagt – und die Zahl wandert bei jeder Welle.
// Derselbe Fehler lag in drei älteren Apps (deutschland-kompass,
// erfinder-werkstatt, woerter-sortierer), jeweils um eins.
//
// Eine App MUSS die Zahl nicht nennen; 153 von 183 tun es nicht. Geprüft
// wird nur, wer sie nennt.
const appsDir = new URL('../../../apps/', import.meta.url);
const ZAHL_IM_BEFEHL = /#\s*(\d+)\s*(?:тест|Test)/g;
const ZAHL_AN_DER_DATEI = /\.test\.mjs`?\s*\((\d+)\)/g;

const vorhanden = async (url) => { try { await access(url); return true; } catch { return false; } };

const ordner = (await readdir(appsDir, { withFileTypes: true }))
  .filter((o) => o.isDirectory()).map((o) => o.name).sort();

const befunde = [];
let geprueft = 0;
for (const name of ordner) {
  const testDir = new URL(`${name}/test/`, appsDir);
  if (!(await vorhanden(testDir))) continue;
  const dateien = (await readdir(testDir)).filter((d) => d.endsWith('.test.mjs'));
  if (!dateien.length) continue;
  let echt = 0;
  for (const d of dateien) {
    const quelle = await readFile(new URL(d, testDir), 'utf8');
    echt += (quelle.match(/^test\(/gm) ?? []).length;
  }
  for (const doc of ['README.md', 'GDD.md']) {
    const url = new URL(`${name}/${doc}`, appsDir);
    if (!(await vorhanden(url))) continue;
    const s = await readFile(url, 'utf8');
    for (const muster of [ZAHL_IM_BEFEHL, ZAHL_AN_DER_DATEI]) {
      for (const m of s.matchAll(muster)) {
        geprueft += 1;
        if (Number(m[1]) !== echt) befunde.push(`apps/${name}/${doc} nennt ${m[1]} Tests, es sind ${echt}`);
      }
    }
  }
}

// Dieselbe Zahl steht ein zweites Mal in docs/: die Wellen-Berichte in
// docs/09 und docs/10 schliessen den Block zu einer App mit "N тестов" ab.
// Die Regel oben endet an der App-Ordnergrenze, und damit blieben drei
// Zahlen stehen, als die Tests wuchsen: bewegungs-kartei-erstes-jahr (17
// gegen 24) und sicherer-krabbelraum-check (16 gegen 17) nach dem
// Review-Durchgang der Welle 78, und gesunder-koerper-ampel (9 gegen 10)
// seit der Erweiterung in Welle 76. Ein Wellen-Bericht ist die
// Nachweisbasis des Projekts; eine falsche Zahl darin ist derselbe Fehler
// wie im GDD, nur schlechter auffindbar.
//
// Zuordnung: der App-Name steht fett (**name**), die Zahl folgt im selben
// Abschnitt bis zum naechsten fetten App-Namen. Gesamtzahlen des Korpus
// ("Полный прогон 746 тестов", "Статус 180 приложений, 1218 тестов")
// gehoeren keiner App und sind ausgenommen.
const docsDir = new URL('../../../docs/', import.meta.url);
const FETTER_APPNAME = /\*\*([a-z0-9][a-z0-9-]{3,})\*\*/g;
// `\w` ist in JavaScript ASCII: `приложени\w*,` kann die kyrillische Form
// „приложений," gar nicht treffen (nur „приложени," mit leerem `\w*`), und
// die Ausnahme fuer Korpus-Gesamtzahlen lief damit ins Leere – 13 Abschnitte
// galten faelschlich als mehrdeutig. Darum eine ausgeschriebene Zeichenklasse.
// Das ist dieselbe Falle wie `\b` neben einem Umlaut (docs/02).
const ZAHL_IM_TEXT = /(\d+)\s+тест[а-яё]*/g;
const KORPUS_GESAMT = /(?:прогон|приложени[а-яё]*,)\s*\d*\s*\d+\s+тест/i;

const echteZahl = new Map();
for (const name of ordner) {
  const testDir = new URL(`${name}/test/`, appsDir);
  if (!(await vorhanden(testDir))) continue;
  const dateien = (await readdir(testDir)).filter((d) => d.endsWith('.test.mjs'));
  if (!dateien.length) continue;
  let n = 0;
  for (const d of dateien) {
    n += ((await readFile(new URL(d, testDir), 'utf8')).match(/^test\(/gm) ?? []).length;
  }
  if (n) echteZahl.set(name, n);
}

const docBefunde = [];
let docGeprueft = 0;
let docMehrdeutig = 0;
for (const doc of (await readdir(docsDir)).filter((d) => d.endsWith('.md')).sort()) {
  const text = await readFile(new URL(doc, docsDir), 'utf8');
  const zeilen = text.split('\n');
  for (let i = 0; i < zeilen.length; i++) {
    const zeile = zeilen[i];
    const namen = [...zeile.matchAll(FETTER_APPNAME)]
      .filter((m) => echteZahl.has(m[1])).map((m) => ({ pos: m.index, name: m[1] }));
    if (!namen.length) continue;
    for (let k = 0; k < namen.length; k++) {
      const bis = k + 1 < namen.length ? namen[k + 1].pos : zeile.length;
      const abschnitt = zeile.slice(namen[k].pos, bis);
      const zahlen = [...abschnitt.matchAll(ZAHL_IM_TEXT)]
        .filter((m) => !KORPUS_GESAMT.test(abschnitt.slice(Math.max(0, m.index - 30), m.index + 12)))
        .map((m) => Number(m[1]));
      if (zahlen.length === 1) {
        docGeprueft += 1;
        const soll = echteZahl.get(namen[k].name);
        if (zahlen[0] !== soll) {
          docBefunde.push(`docs/${doc}:${i + 1} nennt für ${namen[k].name} ${zahlen[0]} Tests, es sind ${soll}`);
        }
      } else if (zahlen.length > 1) {
        docMehrdeutig += 1;
      }
    }
  }
}

// Die Gesamtzahl des Korpus („Полный прогон: 1601 тестов" in README.md) war
// bis Welle 81 die einzige Testzahl des Projekts, die ABSICHTLICH ausgenommen
// war - und damit die einzige, die ungestraft driften konnte. Beim Review der
// Welle 81 stand dort 1555 gegen 1601 echte. Jetzt wird sie gezaehlt:
// `^test(` ueber alle Testdateien in apps/ UND packages/.
const WURZEL = new URL('../../../', import.meta.url);
const PROGNOSE = /Полный\s+прогон:\s*\*\*(\d+)\s+тест/;

async function testeZaehlen(basis) {
  let n = 0;
  for (const o of await readdir(basis, { withFileTypes: true })) {
    if (!o.isDirectory()) continue;
    const testDir = new URL(`${o.name}/test/`, basis);
    if (!(await vorhanden(testDir))) continue;
    for (const d of (await readdir(testDir)).filter((x) => x.endsWith('.test.mjs'))) {
      n += ((await readFile(new URL(d, testDir), 'utf8')).match(/^test\(/gm) ?? []).length;
    }
  }
  return n;
}

const korpusEcht = (await testeZaehlen(appsDir)) + (await testeZaehlen(new URL('packages/', WURZEL)));
const korpusText = await readFile(new URL('README.md', WURZEL), 'utf8');
const korpusGenannt = korpusText.match(PROGNOSE);

test('die Gesamtzahl der Tests im README stimmt', () => {
  assert.ok(korpusGenannt, 'die Zeile „Полный прогон: **N тестов**" fehlt im README – greift das Muster noch?');
  assert.equal(Number(korpusGenannt[1]), korpusEcht,
    `README nennt ${korpusGenannt[1]} Tests, gezählt sind ${korpusEcht}`);
  // Plausibilität: die Zählung darf nicht grün werden, weil sie nichts findet.
  assert.ok(korpusEcht > 1000, `nur ${korpusEcht} Tests gezählt – greift das Muster noch?`);
});

test('jede genannte Testzahl stimmt mit der Testdatei überein', () => {
  assert.deepEqual(befunde, [], befunde.join(' | '));
  // Plausibilität: die Regel darf nicht dadurch grün werden, dass sie nichts
  // mehr findet (ein geänderter Wortlaut der Befehlszeile zum Beispiel).
  assert.ok(geprueft >= 25, `nur ${geprueft} Zahlangaben gefunden – greift das Muster noch?`);
});

test('auch die Wellen-Berichte in docs/ nennen die richtige Testzahl', () => {
  assert.deepEqual(docBefunde, [], docBefunde.join(' | '));
  // Dieselbe Plausibilitätsschranke: die Regel darf nicht grün werden, weil
  // sie nichts mehr zuordnet. Und kein Abschnitt darf mehrdeutig sein – sonst
  // wäre unklar, welche Zahl zu welcher App gehört, und die Regel schwiege
  // genau dort, wo es darauf ankommt.
  assert.ok(docGeprueft >= 50, `nur ${docGeprueft} Zuordnungen in docs/ gefunden – greift das Muster noch?`);
  assert.equal(docMehrdeutig, 0, `${docMehrdeutig} Abschnitte mit mehr als einer Testzahl – Zuordnung unklar`);
});
