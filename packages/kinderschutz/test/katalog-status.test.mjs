import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

// Die Statuszeile eines Katalog-Abschnitts nennt die naechsten ungebauten
// Einheiten mit NAMEN. In Welle 80 standen dort drei Namen, die es im
// Abschnitt gar nicht gibt - sie waren beim Fortschreiben der Zeile erfunden,
// ohne den Katalog neu zu lesen. Die Nummern waren richtig, die Namen nicht.
//
// Eine Statuszeile ist die Stelle, an der die naechste Welle anfaengt zu
// arbeiten; ein falscher Name dort schickt die Arbeit an die falsche Einheit.
//
// WELLE 83, zwei Lehren:
// 1. Der erste Abschnitt ist FERTIG geworden (21 von 21). Eine feste
//    Untergrenze „mindestens eine genannte Einheit" wird dadurch rot, obwohl
//    nichts falsch ist - die Zahl der genannten Einheiten sinkt zu Recht auf
//    null, wenn nichts mehr offen ist.
// 2. Die erste Reparatur verglich zwei Muster gegeneinander. Das war
//    wirkungslos: beide lesen aus DEMSELBEN ausgeschnittenen Teilstring, und
//    faellt der Ausschnitt aus, werden beide null. Seitdem hatte die Regel
//    ueberhaupt keinen Gegenstand mehr - es gibt nur eine Statuszeile im
//    Projekt, und die ist vollstaendig.
//
// Darum prueft diese Datei die Mechanik jetzt an einem FESTEN BEISPIEL mit:
// `lesStatuszeile` wird gegen erfundene Zeilen laufen gelassen, deren Ergebnis
// bekannt ist. Damit hat die Zusicherung immer einen Gegenstand, auch wenn im
// Projekt gerade kein Abschnitt offen ist.
const docsDir = new URL('../../../docs/', import.meta.url);

const STATUSZEILE = /^>\s*\*\*Построено\s+(\d+)\s+из\s+(\d+)\*\*/;
const GENANNTE_EINHEIT = /№\d+\s*\(([^)]{6,120})\)/g;
const ANKER = /№\d+\s*\(/g;
const ABSCHNITT = /^### /;
const EINTRAG = /^-\s+\*\*(.+?)\*\*/;

/** Normalisiert einen Titel: Strichvarianten, Umlaut-Umschrift, Leerraum. */
const normal = (s) => s
  .replace(/[–—]/g, '-')
  .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
  .replace(/Ä/g, 'Ae').replace(/Ö/g, 'Oe').replace(/Ü/g, 'Ue')
  .replace(/\s+/g, ' ')
  .trim()
  .toLowerCase();

/**
 * Liest eine Statuszeile. Gibt zurueck, was daran zu pruefen ist:
 * `gebaut`/`gesamt`, die genannten Namen, die Zahl der Anker und die offene
 * Zahl. `null`, wenn die Zeile keine Statuszeile ist.
 */
export function lesStatuszeile(zeile) {
  const m = zeile.match(STATUSZEILE);
  if (!m) return null;
  const [, gebaut, gesamt] = m;
  // Gelesen wird nur die Aufzaehlung der naechsten Einheiten, nicht der ganze
  // Absatz: dahinter stehen Anmerkungen in Kursiv, und eine Klammer darin ist
  // kein Einheitenname.
  const nachSatz = zeile.split(/Следующие несобранные[^:]*:/)[1] ?? '';
  const aufzaehlung = nachSatz.split(/\s\*/)[0];
  return {
    gebaut: Number(gebaut),
    gesamt: Number(gesamt),
    offen: Math.max(Number(gesamt) - Number(gebaut), 0),
    namen: [...aufzaehlung.matchAll(GENANNTE_EINHEIT)].map((x) => x[1]),
    anker: [...aufzaehlung.matchAll(ANKER)].length,
  };
}

const befunde = [];
let statuszeilen = 0;

for (const doc of (await readdir(docsDir)).filter((d) => d.endsWith('.md')).sort()) {
  const zeilen = (await readFile(new URL(doc, docsDir), 'utf8')).split('\n');
  // Abschnittsgrenzen und die Eintraege je Abschnitt sammeln.
  const abschnitte = [];
  for (let i = 0; i < zeilen.length; i++) {
    if (ABSCHNITT.test(zeilen[i])) abschnitte.push({ von: i, titel: zeilen[i], eintraege: [] });
    else if (abschnitte.length) {
      const m = zeilen[i].match(EINTRAG);
      if (m) abschnitte.at(-1).eintraege.push(m[1]);
    }
  }
  for (let i = 0; i < zeilen.length; i++) {
    const zeile = lesStatuszeile(zeilen[i]);
    if (!zeile) continue;
    const abschnitt = [...abschnitte].reverse().find((a) => a.von < i);
    if (!abschnitt) continue;
    statuszeilen += 1;
    const vorhanden = abschnitt.eintraege.map(normal);
    for (const name of zeile.namen) {
      const genannt = normal(name);
      // Ein Eintrag gilt als getroffen, wenn der genannte Name in ihm steckt
      // oder er im genannten Namen - Kurzformen sind erlaubt, Erfindungen nicht.
      if (!vorhanden.some((e) => e.includes(genannt) || genannt.includes(e))) {
        befunde.push(`docs/${doc}:${i + 1} nennt „${name}“ – diesen Eintrag gibt es im Abschnitt `
          + `„${abschnitt.titel.replace(/^###\s*/, '').slice(0, 40)}“ nicht`);
      }
    }
    // Die Bilanz muss aufgehen: „gebaut von insgesamt" gegen die Eintraege.
    if (zeile.gesamt !== abschnitt.eintraege.length) {
      befunde.push(`docs/${doc}:${i + 1} nennt ${zeile.gesamt} Einheiten, der Abschnitt hat `
        + `${abschnitt.eintraege.length} Eintraege`);
    }
    // Die Konvention lautet „die naechsten drei" - solange es noch drei gibt.
    const erwartet = Math.min(3, zeile.offen);
    if (zeile.anker !== erwartet) {
      befunde.push(`docs/${doc}:${i + 1} nennt ${zeile.anker} naechste Einheiten, erwartet ${erwartet} `
        + `(${zeile.offen} von ${zeile.gesamt} sind offen)`);
    }
  }
}

test('jede in einer Statuszeile genannte Einheit gibt es wirklich', () => {
  assert.deepEqual(befunde, [], befunde.join(' | '));
  assert.ok(statuszeilen >= 1, 'keine Statuszeile gefunden – greift das Muster noch?');
});

test('die Mechanik greift – geprüft an festen Beispielen, nicht am Tagesstand', () => {
  // Offener Abschnitt mit zwei genannten Einheiten.
  const offen = lesStatuszeile('> **Построено 13 из 15** (№1–13). Следующие несобранные в порядке каталога: '
    + '№14 (Erste Einheit), №15 (Zweite Einheit). *Anmerkung mit (Klammer).*');
  assert.ok(offen, 'die Statuszeile wurde nicht erkannt');
  assert.equal(offen.offen, 2);
  assert.equal(offen.anker, 2);
  assert.deepEqual(offen.namen, ['Erste Einheit', 'Zweite Einheit']);

  // Fertiger Abschnitt: keine Namen, und das ist richtig.
  const fertig = lesStatuszeile('> **Построено 21 из 21** (№46–66) — раздел ЗАКРЫТ. '
    + '*Нумерация выверена от №46 (запись 1 = №46).*');
  assert.ok(fertig);
  assert.equal(fertig.offen, 0);
  assert.equal(fertig.anker, 0, 'die Kursiv-Anmerkung darf nicht als Aufzählung gelesen werden');

  // Faellt das Ausschneiden des Satzes aus, bleibt die Aufzaehlung leer - und
  // bei offenen Einheiten ist genau das der Fehler, den die Regel finden muss.
  const kaputt = lesStatuszeile('> **Построено 13 из 15** (№1–13). Als nächstes: №14 (Erste Einheit).');
  assert.ok(kaputt);
  assert.equal(kaputt.offen, 2);
  assert.equal(kaputt.anker, 0);
  assert.ok(Math.min(3, kaputt.offen) !== kaputt.anker,
    'eine Zeile mit offenen Einheiten und ohne erkannte Aufzählung muss auffallen');

  // Keine Statuszeile.
  assert.equal(lesStatuszeile('- **Irgendein Eintrag** (…)'), null);
});
