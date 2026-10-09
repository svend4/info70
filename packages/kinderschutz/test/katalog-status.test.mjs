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
// Darum wird hier geprueft, dass jeder genannte Name auch als Eintrag
// desselben Abschnitts existiert.
const docsDir = new URL('../../../docs/', import.meta.url);

// „> **Построено 13 из 21** (…). Следующие несобранные …: №59 (NAME), №60 (NAME) …"
const STATUSZEILE = /^>\s*\*\*Построено\s+(\d+)\s+из\s+(\d+)\*\*/;
const GENANNTE_EINHEIT = /№\d+\s*\(([^)]{6,120})\)/g;
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

const befunde = [];
let geprueft = 0;

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
    if (!STATUSZEILE.test(zeilen[i])) continue;
    // Der Abschnitt, in dem die Statuszeile steht.
    const abschnitt = [...abschnitte].reverse().find((a) => a.von < i);
    if (!abschnitt) continue;
    const vorhanden = abschnitt.eintraege.map(normal);
    // Gelesen wird nur die Aufzaehlung der naechsten Einheiten, nicht der
    // ganze Absatz: dahinter stehen Anmerkungen in Kursiv, und eine Klammer
    // darin ist kein Einheitenname.
    const nachSatz = zeilen[i].split(/Следующие несобранные[^:]*:/)[1] ?? '';
    const aufzaehlung = nachSatz.split(/\s\*/)[0];
    for (const m of aufzaehlung.matchAll(GENANNTE_EINHEIT)) {
      geprueft += 1;
      const genannt = normal(m[1]);
      // Ein Eintrag gilt als getroffen, wenn der genannte Name in ihm steckt
      // oder er im genannten Namen - Kurzformen sind erlaubt, Erfindungen nicht.
      const treffer = vorhanden.some((e) => e.includes(genannt) || genannt.includes(e));
      if (!treffer) {
        befunde.push(`docs/${doc}:${i + 1} nennt „${m[1]}“ – diesen Eintrag gibt es im Abschnitt `
          + `„${abschnitt.titel.replace(/^###\s*/, '').slice(0, 40)}“ nicht`);
      }
    }
    // Und die Bilanz muss aufgehen: „gebaut von insgesamt" gegen die Zahl der Eintraege.
    const [, , gesamt] = zeilen[i].match(STATUSZEILE);
    if (Number(gesamt) !== abschnitt.eintraege.length) {
      befunde.push(`docs/${doc}:${i + 1} nennt ${gesamt} Einheiten, der Abschnitt hat `
        + `${abschnitt.eintraege.length} Eintraege`);
    }
  }
}

test('jede in einer Statuszeile genannte Einheit gibt es wirklich', () => {
  assert.deepEqual(befunde, [], befunde.join(' | '));
  // Plausibilitaet: die Regel darf nicht gruen werden, weil sie nichts findet.
  assert.ok(geprueft >= 3, `nur ${geprueft} genannte Einheiten gefunden – greift das Muster noch?`);
});
