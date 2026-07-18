import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { ADRESSATEN, findeAdressat, fehlendeFelder, baueBrief } from '../logik.mjs';

const appQuelle = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');

test('Adressaten: die im Katalog genannten Anlaufstellen, eindeutige IDs', () => {
  const ids = ADRESSATEN.map((a) => a.id);
  assert.equal(new Set(ids).size, ids.length, 'doppelte IDs');
  for (const pflicht of ['schulleitung', 'petitionsausschuss', 'kinderkommission']) {
    assert.ok(ids.includes(pflicht), `Adressat fehlt: ${pflicht}`);
  }
  for (const a of ADRESSATEN) {
    assert.ok(a.name && a.anrede && a.schluss && a.hinweis, `${a.id}: Feld fehlt`);
  }
});

test('Petitionsausschuss-Hinweis: ohne Mindestalter', () => {
  const p = findeAdressat('petitionsausschuss');
  assert.match(p.hinweis, /ohne Mindestalter|Art\. 17 GG/);
});

test('fehlendeFelder erkennt leere Pflichtfelder', () => {
  assert.deepEqual(fehlendeFelder({}), ['Betreff', 'Anliegen', 'Begründung', 'Vorschlag']);
  assert.deepEqual(fehlendeFelder({ betreff: 'x', anliegen: 'y', begruendung: 'z', vorschlag: 'w' }), []);
});

test('baueBrief: vollständige Angaben erscheinen mit richtiger Anrede', () => {
  const brief = baueBrief({
    adressat: 'schulleitung', betreff: 'Mehr Pausenspiele',
    anliegen: 'wir uns mehr Spielgeräte auf dem Schulhof wünschen.',
    begruendung: 'in der Pause oft Langeweile herrscht.',
    vorschlag: 'ein Ausleih-System für Bälle und Springseile.',
    absender: 'Klasse 4b',
  });
  assert.match(brief, /An: Schulleitung/);
  assert.match(brief, /Sehr geehrte Schulleitung,/);
  assert.match(brief, /Betreff: Mehr Pausenspiele/);
  assert.match(brief, /mehr Spielgeräte/);
  assert.match(brief, /Langeweile/);
  assert.match(brief, /Ausleih-System/);
  assert.match(brief, /Klasse 4b/);
  assert.match(brief, /Art\. 12 und 13/, 'Kinderrechte-Bezug');
});

test('baueBrief: Adressat bestimmt Anrede und Schluss', () => {
  const petition = baueBrief({ adressat: 'petitionsausschuss' });
  assert.match(petition, /An: Petitionsausschuss/);
  assert.match(petition, /Petitionsausschusses,/);
  assert.match(petition, /Petitionsausschuss, sich mit unserem Anliegen/);
});

test('baueBrief: leere Angaben liefern Platzhalter, kein Absturz', () => {
  const brief = baueBrief({});
  assert.match(brief, /\[Worum geht es/);
  assert.match(brief, /\[Euer Name/);
  assert.ok(!/https?:\/\//.test(brief), 'keine externen Links');
});

test('Datensparsamkeit: der Absender-Name wird nicht gespeichert', () => {
  assert.match(appQuelle, /nicht gespeichert|nur im Brief|NICHT gespeichert/i, 'Zusage im Code');
  assert.ok(!/setItem\([^)]*absender/i.test(appQuelle), 'absender nie in setItem');
});
