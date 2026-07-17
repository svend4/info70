import { test } from 'node:test';
import assert from 'node:assert/strict';
import { STUFEN, THEMEN, START_PROFIL, algorithmusZiel, neuesProfil, gegensteuern, feedStufen, blasenLage, LEKTIONEN } from '../logik.mjs';

test('Stufen-Modell: 5 Intensitätsstufen, jede Themenwelt hat alle 5 Schlagzeilen-Muster', () => {
  assert.deepEqual(STUFEN.map((s) => s.stufe), [1, 2, 3, 4, 5]);
  assert.ok(Object.keys(THEMEN).length >= 3, 'mehrere Themenwelten');
  for (const [code, t] of Object.entries(THEMEN)) {
    assert.ok(t.name && t.emoji, `${code}: Name/Emoji fehlt`);
    for (const s of [1, 2, 3, 4, 5]) {
      assert.ok(t.schlagzeilen[s]?.length >= 20, `${code}/${s}: Schlagzeilen-Muster fehlt`);
    }
  }
});

test('Kern-Mechanik: der Algorithmus zielt IMMER schärfer als der Klick (der Haken)', () => {
  for (const s of [1, 2, 3, 4]) {
    assert.ok(algorithmusZiel(s) > s, `Ziel muss über Klick-Stufe ${s} liegen`);
  }
  assert.equal(algorithmusZiel(5), 5, 'bei 5 ist Schluss (Klemme)');
  assert.ok(neuesProfil(2, 4) > 2, 'scharfer Klick zieht das Profil hoch');
  assert.ok(neuesProfil(4, 1) < 4, 'milder Klick senkt das Profil');
  assert.ok(neuesProfil(5, 5) <= 5 && neuesProfil(1, 1) >= 1, 'Profil bleibt in [1,5]');
});

test('Radikalisierungs-Treppe: wer immer den Köder klickt, ist in wenigen Runden in der geschlossenen Blase', () => {
  let profil = START_PROFIL;
  let runden = 0;
  while (blasenLage(profil).code !== 'geschlossen' && runden < 20) {
    const koeder = Math.min(5, Math.round(profil) + 1);
    profil = neuesProfil(profil, koeder);
    runden++;
  }
  assert.ok(runden <= 8, `Spirale muss schnell zuschnappen (brauchte ${runden} Runden)`);
  assert.equal(blasenLage(profil).code, 'geschlossen');
});

test('Feed-Karten: 4 Stück in [1,5], darunter immer ein Köder oberhalb des Profils (solange < 4.5)', () => {
  const zufall = () => 0.4;
  for (const profil of [1, 1.7, 2.4, 3.2, 4.4]) {
    const karten = feedStufen(profil, zufall);
    assert.equal(karten.length, 4);
    for (const k of karten) assert.ok(k >= 1 && k <= 5 && Number.isInteger(k));
    assert.ok(Math.max(...karten) > profil, `bei Profil ${profil} muss ein Köder oberhalb liegen`);
  }
});

test('Gegensteuern: beide Hebel senken, Mix stärker; aus der geschlossenen Blase kommt man wieder raus', () => {
  assert.ok(gegensteuern(3, 'nicht-interessiert') < 3);
  assert.ok(gegensteuern(3, 'mix') < gegensteuern(3, 'nicht-interessiert'), 'Mix wirkt stärker');
  let profil = 5;
  let schritte = 0;
  while (blasenLage(profil).code !== 'offen' && schritte < 10) { profil = gegensteuern(profil, 'mix'); schritte++; }
  assert.ok(schritte <= 3, `Ausstieg muss machbar sein (brauchte ${schritte} Schritte)`);
  assert.equal(gegensteuern(1, 'mix'), 1, 'Klemme unten');
});

test('Blasen-Lage: vier Zonen mit klaren Grenzen', () => {
  assert.equal(blasenLage(1).code, 'offen');
  assert.equal(blasenLage(2.5).code, 'einseitig');
  assert.equal(blasenLage(3.5).code, 'heiss');
  assert.equal(blasenLage(4.2).code, 'geschlossen');
});

test('Politik-Wächter: abstrakte Muster - keine echten Parteien, Gruppen, Plattformen oder Verschwörungsmythen', () => {
  const alleTexte = JSON.stringify(THEMEN) + LEKTIONEN.join(' ');
  for (const verboten of [/AfD|CDU|SPD|Grüne(?!r)|Linke/i, /QAnon|Illuminaten|Chemtrail|Great Reset/i, /tiktok|youtube|instagram|telegram|facebook/i]) {
    assert.ok(!verboten.test(alleTexte), `Stop-Liste verletzt: ${verboten}`);
  }
});

test('Lektionen: Spirale erklärt, DSA-Rechte (Art. 27/38, 34/35), Hebel, Geld-Frage', () => {
  const text = LEKTIONEN.join(' ');
  assert.match(text, /nicht.*WAHR.*sondern.*HÄLT|hält länger/i, 'Kernsatz der Spirale');
  assert.match(text, /Art\. 27/, 'Empfehlungs-Transparenz');
  assert.match(text, /Art\. 38/, 'Feed ohne Profiling');
  assert.match(text, /Art\. 34\/35/, 'systemische Risiken');
  assert.match(text, /Treppe/, 'Treppen-Bild');
  assert.match(text, /verdient/, 'die Geld-Frage als stärkste Frage');
});
