import { test } from 'node:test';
import assert from 'node:assert/strict';
import { leistungsTreffer } from '../src/leistungs-woerter.mjs';

// Entscheidung Max 37в: neutraler Zähler des Gefundenen ist erlaubt, Bewertung der Ausführung nicht.
const gruppen = (text, name = 'index.html') => leistungsTreffer(name, text).map((t) => t.gruppe);

test('Neutraler Zähler des Gefundenen: kein Treffer', () => {
  for (const text of ['Gefunden: 3 von 8', '2 Datenkraken entdeckt', 'Gesammelt: 5 Karten', 'Frage 4 von 12', 'Treffpunkt und Aussichtspunkte', 'Der Punkt auf der Karte']) {
    assert.deepEqual(gruppen(text), [], text);
  }
});

test('Bewertung der Ausführung wird gefunden, je Gruppe mit einem Beispiel', () => {
  const faelle = {
    punkte: 'Du hast 5 Punkte', rekord: 'Dein Rekord: 7', serie: '5 Tage in Folge', prozent: '80 % geschafft',
    richtigVon: '7 richtig von 10', geschafft: 'Geschafft!', sterneUndPokale: '⭐⭐⭐', vergleich: 'Wochenübersicht',
  };
  for (const [gruppe, text] of Object.entries(faelle)) {
    assert.ok(gruppen(text).includes(gruppe), `${gruppe}: ${text}`);
  }
});

test('Verneinung hebt den Treffer auf (höchstens drei Wörter davor), Kommentare zählen nicht', () => {
  assert.deepEqual(gruppen('Es gibt keine Punkte und keinen Rekord.'), []);
  assert.deepEqual(gruppen('// Punkte und Rekord\nconst a = 1;', 'app.mjs'), []);
  assert.ok(gruppen('Es gibt Punkte, aber keine Pause').includes('punkte'), 'Kontrolle: ohne Verneinung vor dem Wort bleibt es ein Treffer');
});

// Seit 29.10.2026 (Plan-Tor 1, Befund B-21): „Rang“ gehört zur Wortliste. Ein Bezeichner wie STATUS_RANG
// ist keine Bewertung eines Kindes, „keine Ränge“ ist eine Verneinung und zählt nicht.
test('Rang (Plan-Tor 1): Rang, Ränge, Rangliste und Rangfolge sind Treffer; Verneinung und Bezeichner nicht', () => {
  for (const text of ['Dein Rang: Entdecker', 'Die Rangliste der Apps', 'Rangfolge der Schritte', 'Ränge der Stufen']) {
    assert.ok(gruppen(text).includes('rang'), text);
  }
  assert.deepEqual(gruppen('Es gibt keine Ränge.'), []);
  assert.deepEqual(gruppen('const STATUS_RANG = 3;', 'logik.mjs'), []);
  assert.deepEqual(gruppen('Vorrang haben die Kinder'), []);
});
