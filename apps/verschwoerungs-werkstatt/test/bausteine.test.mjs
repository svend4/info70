import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const daten = JSON.parse(await readFile(new URL('../daten/bausteine.json', import.meta.url), 'utf8'));

test('Baukasten: genug Bausteine für Varianz', () => {
  assert.ok(daten.gruppen.length >= 6, 'mindestens 6 fiktive Gruppen');
  assert.ok(daten.ereignisse.length >= 6, 'mindestens 6 Alltags-Ereignisse');
  assert.ok(daten.wuerze.length >= 5, 'mindestens 5 Rhetorik-Zutaten');
  assert.ok(daten.checkliste.length >= 4, 'Erkennungs-Checkliste');
});

test('Würze: jede Zutat trägt Typ und Wirkungs-Erklärung (dort passiert das Lernen)', () => {
  for (const w of daten.wuerze) {
    assert.ok(['bruecke', 'immunisierung', 'rhetorik'].includes(w.typ), `unbekannter Typ: ${w.typ}`);
    assert.ok(w.wirkung?.length >= 50, `${w.text}: Wirkungs-Erklärung fehlt/zu kurz`);
  }
  const typen = new Set(daten.wuerze.map((w) => w.typ));
  assert.equal(typen.size, 3, 'alle drei Rhetorik-Typen vertreten');
});

test('Schutz-Leitplanke: nur absurde Fiktion, keine realen Gruppen oder aufgeladenen Themen', () => {
  const inhalt = JSON.stringify([daten.gruppen, daten.ereignisse, daten.wuerze.map((w) => w.text)]).toLowerCase();
  for (const wort of daten.stoppliste) {
    assert.ok(!inhalt.includes(wort), `Stopplisten-Begriff in Bausteinen gefunden: ${wort}`);
  }
});

test('Checkliste deckt die Kern-Erkennungsmerkmale ab', () => {
  const text = daten.checkliste.join(' ');
  assert.ok(/widerlegbar|Gegenbeweis/.test(text), 'Falsifizierbarkeit');
  assert.ok(/verdient|Klicks/.test(text), 'Geschäftsmodell der Erzählung');
  assert.ok(/einfachere Erklärung|Einfachheits/.test(text), 'Ockham');
  assert.ok(/Journalist/.test(text), 'echte Skandale vs. anonyme Posts');
});
