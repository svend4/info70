import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const daten = JSON.parse(await readFile(new URL('../daten/szenarien.json', import.meta.url), 'utf8'));
const appQuelle = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');

test('Szenarienbank: Grundstruktur, IDs, erreichbare Ränge', () => {
  assert.equal(daten.version, 1);
  assert.ok(daten.szenarien.length >= 10, 'mindestens 10 Szenarien');
  const ids = daten.szenarien.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(daten.raenge[0].ab, 0);
  assert.ok(Math.max(...daten.raenge.map((r) => r.ab)) <= daten.szenarien.length * 2);
});

test('jedes Szenario: 2/1/0-Muster mit genau je einem 0/1/2, Mechanik + Tipp', () => {
  for (const s of daten.szenarien) {
    assert.ok(s.situation?.length >= 40, `${s.id}: Situation fehlt/zu kurz`);
    assert.ok(s.mechanik?.length >= 25, `${s.id}: FOMO-Mechanik muss benannt sein`);
    assert.ok(s.tipp?.length >= 60, `${s.id}: Tipp zu kurz (dort passiert das Lernen)`);
    assert.ok(Array.isArray(s.optionen) && s.optionen.length === 3, `${s.id}: genau 3 Optionen`);
    const werte = s.optionen.map((o) => o.wert).sort();
    assert.deepEqual(werte, [0, 1, 2], `${s.id}: Werte müssen genau 0, 1 und 2 sein`);
    for (const o of s.optionen) assert.ok(o.text?.length >= 10, `${s.id}: Optionstext fehlt`);
  }
});

test('Mechanik-Breite: Streak, Autoplay/Endlos, Countdown/Verknappung, Lesebestätigung, Likes, Benachrichtigung', () => {
  const alles = JSON.stringify(daten.szenarien).toLowerCase();
  for (const [name, muster] of [
    ['Streak', /streak/],
    ['Autoplay/Endlos', /autoplay|endlos/],
    ['Countdown/Verknappung', /countdown|verknappung|einmalig/],
    ['Lesebestätigung', /gelesen|lesebest/],
    ['Likes', /like/],
    ['Benachrichtigung', /benachrichtigung/],
  ]) {
    assert.match(alles, muster, `Mechanik fehlt: ${name}`);
  }
});

test('Didaktik: stärkster Zug ist Grenze/Selbstschutz, nie Rückzug aus Wut; Hilfe 116 111', () => {
  for (const s of daten.szenarien) {
    const beste = s.optionen.find((o) => o.wert === 2).text.toLowerCase();
    assert.ok(!/(dumm|hasse|rache|löschen aus wut)/.test(beste), `${s.id}: stärkster Zug soll ruhig/selbstbestimmt sein`);
  }
  assert.ok(appQuelle.includes('116 111'), 'Hilfeadresse in der App');
  assert.match(appQuelle, /jetzt oder nie/i, 'Kernbotschaft „fast nichts ist jetzt oder nie“');
});
