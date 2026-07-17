import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const daten = JSON.parse(await readFile(new URL('../daten/szenarien.json', import.meta.url), 'utf8'));
const appQuelle = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');

test('Szenarienbank: Grundstruktur, IDs, erreichbare Ränge', () => {
  assert.equal(daten.version, 1);
  assert.ok(daten.szenarien.length >= 8, 'mindestens 8 Verläufe');
  const ids = daten.szenarien.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(daten.raenge[0].ab, 0);
  assert.ok(Math.max(...daten.raenge.map((r) => r.ab)) <= daten.szenarien.length * 2);
});

test('jeder Verlauf: Gruppenchat-Optik + 2/1/0-Muster + Auflösung + DSA-Weg', () => {
  for (const s of daten.szenarien) {
    assert.ok(s.gruppe?.length >= 5, `${s.id}: Gruppenname fehlt`);
    assert.ok(Array.isArray(s.chat) && s.chat.length >= 3, `${s.id}: mindestens 3 Chat-Nachrichten`);
    for (const n of s.chat) assert.ok(n.von && n.text, `${s.id}: Nachricht braucht von+text`);
    assert.ok(s.frage?.length >= 20, `${s.id}: Frage fehlt`);
    assert.ok(s.aufloesung?.length >= 100, `${s.id}: Auflösung zu kurz (dort passiert das Lernen!)`);
    assert.ok(s.dsaWeg?.length >= 80, `${s.id}: konkreter Melde-/Hilfeweg fehlt (Kern der Jugendversion!)`);
    const werte = s.optionen.map((o) => o.wert).sort();
    assert.deepEqual(werte, [0, 1, 2], `${s.id}: Werte müssen genau 0, 1 und 2 sein`);
  }
});

test('DSA-Substanz: Meldeweg Art. 16, Widerspruch Art. 20, Minderjährigenschutz Art. 28', () => {
  const wege = daten.szenarien.map((s) => s.dsaWeg).join(' ');
  assert.match(wege, /DSA Art\. 16/, 'Meldeweg nach Art. 16');
  assert.match(wege, /Art\. 20/, 'Widerspruchsverfahren nach Art. 20');
  assert.match(wege, /Art\. 28/, 'Minderjährigenschutz Art. 28');
  assert.match(wege, /116 111/, 'Nummer gegen Kummer');
  assert.match(wege, /JUUUPORT/i, 'Peer-Beratung JUUUPORT');
});

test('Phänomen-Breite (Gefährdungsatlas): Bloßstellung, Hassrede, Ausschluss, Fake-Account, Doxxing, Rausekeln', () => {
  const alles = JSON.stringify(daten.szenarien);
  for (const muster of [/weiterleit/i, /[Ss]atire|rassist/i, /OHNE emma|Ausschluss/i, /fake account|Identität/i, /Doxxing|Adresse/i, /rauseke/i]) {
    assert.match(alles, muster, `Phänomen fehlt: ${muster}`);
  }
  assert.match(alles, /Screenshot/, 'Beweise sichern muss vorkommen');
  assert.match(alles, /„?Ist doch nur Spaß|ist doch nur satire/i, 'die Standard-Tarnung muss entlarvt werden');
});

test('Politik-Wächter: kein echter Chat, keine echten Plattform-/Personennamen in den Verläufen', () => {
  assert.match(appQuelle, /geskriptete Szenarien/, 'App dokumentiert: kein echter Chat');
  assert.ok(!/whatsapp|tiktok|instagram|snapchat|telegram/i.test(JSON.stringify(daten.szenarien)),
    'Szenarien bleiben plattformneutral (keine Markennamen)');
});
