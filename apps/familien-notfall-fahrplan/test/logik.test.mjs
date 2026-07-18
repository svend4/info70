import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { SCHRITTE, baueFahrplan } from '../logik.mjs';

const appQuelle = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');

test('Schritte: feste Wenn-dann-Kette, vollständig', () => {
  assert.ok(SCHRITTE.length >= 5, 'mindestens 5 Schritte');
  for (const s of SCHRITTE) {
    assert.ok(s.wenn?.length >= 10, 'Wenn-Text fehlt');
    assert.ok(s.dann?.length >= 20, 'Dann-Text fehlt');
  }
  const alles = JSON.stringify(SCHRITTE).toLowerCase();
  assert.match(alles, /screenshot|beweis/, 'Beweise sichern');
  assert.match(alles, /blockier/, 'Blockieren');
  assert.match(alles, /melde/, 'Melden');
  assert.match(alles, /vertrauensperson|bescheid/, 'Bescheid sagen');
});

test('baueFahrplan: Schritte + Kontakte + Hilfenummern', () => {
  const text = baueFahrplan({ vertrauensperson: 'Oma Rosa', vertrauenstel: '0170 000', elternkontakt: 'Mama: 0171 111', weitere: 'Herr Klein (Lehrer)' });
  assert.match(text, /FAMILIEN-NOTFALL-FAHRPLAN/);
  assert.match(text, /Oma Rosa/);
  assert.match(text, /0171 111/);
  assert.match(text, /Herr Klein/);
  assert.match(text, /116 111/, 'Nummer gegen Kummer');
  assert.match(text, /juuuport/, 'juuuport als Jugend-Angebot');
});

test('baueFahrplan: leere Angaben liefern Ausfülllinien', () => {
  const text = baueFahrplan({});
  assert.match(text, /_{6,}/, 'Linien zum Eintragen');
  assert.match(text, /116 111/);
});

test('Sicherheit: keine externen Links (URLs mit http)', () => {
  assert.ok(!/https?:\/\//.test(baueFahrplan({ vertrauensperson: 'x' })), 'keine http-Links');
});

test('Datenvermeidung: Kontakte werden nicht gespeichert', () => {
  assert.match(appQuelle, /nicht gespeichert|nur.*Ausdruck|NICHT gespeichert/i, 'Zusage im Code');
  assert.ok(!/setItem\(/i.test(appQuelle), 'kein localStorage.setItem – nichts wird gespeichert');
});
