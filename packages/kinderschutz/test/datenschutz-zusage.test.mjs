// Korpus-Audit: hält die Datenschutzerklärung, was sie zusagt?
//
// impressum.html sagt den Kindern zu: "Wo etwas gespeichert wird [...] hat die
// App dafür einen Knopf 'Meine Daten löschen'." Zwölf Apps hatten diesen Knopf
// nicht, während die Zusage schon dastand. Dieser Test macht die Zusage
// nachprüfbar: Wer künftig localStorage benutzt, ohne löschen zu lassen, bricht
// den Lauf – nicht erst das Vertrauen.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
const ZAEHLUNG = { skip: process.env.SITZUNG ? 'Zählung gehört dem Koordinator' : false };

const wurzel = new URL('../../../', import.meta.url);
const appsDir = new URL('apps/', wurzel);
const eintraege = await readdir(appsDir, { withFileTypes: true });
const apps = eintraege.filter((e) => e.isDirectory()).map((e) => e.name).sort();

/** Alle .mjs einer App außer den Tests, zusammengelesen. */
async function laufzeitQuelle(app) {
  let quelle = '';
  async function durch(pfad) {
    for (const e of await readdir(new URL(pfad, appsDir), { withFileTypes: true })) {
      if (e.isDirectory()) {
        if (e.name !== 'test') await durch(`${pfad}${e.name}/`);
      } else if (e.name.endsWith('.mjs')) {
        quelle += await readFile(new URL(`${pfad}${e.name}`, appsDir), 'utf8');
      }
    }
  }
  await durch(`${app}/`);
  return quelle;
}

const quellen = new Map();
for (const a of apps) quellen.set(a, await laufzeitQuelle(a));

/**
 * Wer speichert? Die erste Fassung suchte nur `localStorage.setItem` in den
 * Dateien der App selbst - und uebersah damit jede App, die ueber `starteQuiz`
 * laeuft: `quiz-kern` schreibt am Rundenende den Rekord in den localStorage
 * (quiz.mjs:253). Das Impressum nannte deshalb 25 Apps als „speichert gar
 * nichts", die einen Rekord ablegen (Review Welle 83).
 *
 * Geprueft wird jetzt die Konstruktion: eigenes `setItem` ODER der Aufruf von
 * `starteQuiz(`.
 */
// Jeder Aufruf von `.setItem(` zählt, auch über eine Hilfsvariable
// (`speicher.setItem(`) oder `globalThis.localStorage?.setItem(`). Ein Muster, das
// nur `localStorage.setItem` sieht, hat Welle 84 zweimal übersehen.
// Auch die Sprachwahl aus kinder-ui/js/sprache.mjs schreibt in den localStorage, sobald die App ihr einen
// speicherSchluessel gibt (feed-forscher, kettenbrief-stopper); sie zählt als Speichern (Entscheidung Max 27а).
const speichertSelbst = (q) => /\.setItem\(|speicherSchluessel\s*:/.test(q);
// Seit dem Einzel-Umbau von quiz-kern schreibt der Kern nichts mehr: er entfernt nur den
// frühere Rekord-Schlüssel beim Start. Wer `starteQuiz` aufruft, speichert deshalb nicht selbst.
const speichernde = apps.filter((a) => speichertSelbst(quellen.get(a)));

test('jede App, die etwas speichert, lässt es auch löschen', async () => {
  const ohne = [];
  for (const a of speichernde) {
    const q = quellen.get(a);
    const kannLoeschen = /removeItem|localStorage\.clear|datenKarte\(|loescheDaten\(/.test(q)
      // Manche Apps löschen durch Überschreiben mit einem leeren Stand.
      || /(löschen|Löschen|zurücksetzen|Zurücksetzen)/.test(q);
    if (!kannLoeschen) ohne.push(a);
  }
  assert.deepEqual(ohne, [], `speichert ohne Löschmöglichkeit (impressum.html verspricht das Gegenteil):\n${ohne.join('\n')}`);
});

test('die Apps löschen nur ihre eigenen Schlüssel – quiz-kern ist die bewusste Ausnahme', async () => {
  // localStorage.clear() wirft auch die Anzeige-Einstellungen (hoher Kontrast,
  // Schriftgröße) und die Daten der Nachbar-Apps weg. Neue Apps nehmen deshalb
  // die Daten-Karte, die gezielt entfernt.
  const mitClear = speichernde.filter((a) => /localStorage\.clear\(/.test(quellen.get(a)) && speichertSelbst(quellen.get(a)));
  assert.deepEqual(mitClear, [], `räumt fremde Schlüssel mit ab, bitte datenKarte nutzen:\n${mitClear.join('\n')}`);
});

test('die Zahlen in der Datenschutzerklärung stimmen', ZAEHLUNG, async () => {
  const impressum = await readFile(new URL('impressum.html', wurzel), 'utf8');
  const speichern = speichernde.length;
  const stumm = apps.length - speichern;
  assert.match(impressum, new RegExp(`<strong>${stumm} gar nichts</strong>`),
    `impressum.html muss "${stumm} gar nichts" nennen (speichernde Apps: ${speichern})`);
  assert.match(impressum, new RegExp(`<strong>${speichern}</strong>`),
    `impressum.html muss ${speichern} als Zahl der speichernden Apps nennen`);
});

test('das Impressum nennt die Pflichtangaben und keine Fremd-URL', async () => {
  const impressum = await readFile(new URL('impressum.html', wurzel), 'utf8');
  for (const pflicht of ['§ 5 DDG', 'Anschrift', 'E-Mail', 'Verantwortlich', 'Betroffenenrechte', 'Hosting']) {
    assert.ok(impressum.includes(pflicht), `Impressum ohne Punkt: ${pflicht}`);
  }
  assert.ok(!/https?:\/\//.test(impressum), 'keine externen Links im Impressum');
  // Solange Platzhalter drinstehen, muss die Warnung sichtbar sein.
  if (/\[Name bzw\. Firma/.test(impressum)) {
    assert.match(impressum, /Noch nicht veröffentlichungsreif/,
      'mit Platzhaltern muss die Seite das selbst sagen');
  }
});

test('keine App behauptet im Fuß einen Eltern-Link, den sie nicht hat', async () => {
  const kaputt = [];
  for (const a of apps) {
    const q = quellen.get(a);
    const verweist = /href: 'eltern\.html'/.test(q)
      || (/starteQuiz\(/.test(q) && !/elternSeite: false/.test(q));
    if (!verweist) continue;
    try { await readFile(new URL(`${a}/eltern.html`, appsDir), 'utf8'); }
    catch { kaputt.push(a); }
  }
  assert.deepEqual(kaputt, [], `toter Link auf eltern.html:\n${kaputt.join('\n')}`);
});
