import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const daten = JSON.parse(await readFile(new URL('../daten/stationen.json', import.meta.url), 'utf8'));
const appQuelle = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
const alle = daten.stufen.flatMap((s) => s.stationen);

test('Stufen: zwei Altersstufen (6–8 und 8–12), eindeutige IDs, Urkundentext', () => {
  assert.equal(daten.stufen.length, 2, 'genau zwei Stufen');
  const ids = daten.stufen.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length, 'doppelte Stufen-IDs');
  assert.match(daten.stufen.map((s) => s.alter).join(' '), /6.*8/, 'Stufe 6–8');
  assert.match(daten.stufen.map((s) => s.alter).join(' '), /8.*12/, 'Stufe 8–12');
  for (const s of daten.stufen) {
    assert.ok(s.name && s.emoji, `${s.id}: Name/Emoji fehlt`);
    assert.ok(s.urkundeText?.length >= 30, `${s.id}: Urkundentext fehlt`);
    assert.ok(s.stationen.length >= 4, `${s.id}: zu wenige Stationen`);
  }
});

test('jede Station: eindeutige ID, kindgerechter Text + Tipp (vorlesbar)', () => {
  const ids = alle.map((st) => st.id);
  assert.equal(new Set(ids).size, ids.length, 'doppelte Stations-IDs');
  for (const st of alle) {
    assert.ok(st.emoji, `${st.id}: Emoji fehlt`);
    assert.ok(st.text?.length >= 20, `${st.id}: Text zu kurz`);
    assert.ok(st.tipp?.length >= 30, `${st.id}: Tipp zu kurz`);
  }
});

test('inhaltliche Abdeckung: die Netz-Kompetenz-Essentials', () => {
  const text = JSON.stringify(alle).toLowerCase();
  assert.match(text, /erwachsen|vertrauensperson/, 'Erwachsene fragen / Vertrauensperson');
  assert.match(text, /geheim|persönlich|preis|daten/, 'wenig persönliche Daten preisgeben');
  assert.match(text, /werbung|passwort|bot|ki|erfunden|echt/, 'kritische Netz-Themen');
  assert.match(text, /116 111/, 'Nummer gegen Kummer als Hilfe');
});

test('Datenvermeidung: der Kindername wird nur gedruckt, NIE gespeichert', () => {
  // Zusage muss im Code stehen ...
  assert.match(appQuelle, /NIE in localStorage|nicht gespeichert|nur ins Druckformular/i, 'Zusage im Code');
  // ... und der Name-Variable darf nirgends in einen setItem/speichere-Aufruf fließen.
  assert.ok(!/setItem\([^)]*kindName/i.test(appQuelle), 'kindName nie in setItem');
  assert.ok(!/speichere\w*\([^)]*kindName/i.test(appQuelle), 'kindName nie in speichere-Funktion');
  assert.ok(!/kindName[^;\n]*localStorage/i.test(appQuelle), 'kindName nie neben localStorage');
});

test('Sicherheit: Stationsdaten enthalten keine externen Links', () => {
  assert.ok(!/https?:\/\//.test(JSON.stringify(daten)), 'keine externen Links in den Daten');
});
