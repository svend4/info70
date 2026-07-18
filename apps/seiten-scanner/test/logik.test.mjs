import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FRAGEN, MAX, sicherePunkte, warnungen, ampel } from '../logik.mjs';

test('Fragen: 8-10 kindgerechte Checks, eindeutige Codes, sichere Antwort definiert', () => {
  assert.ok(FRAGEN.length >= 8 && FRAGEN.length <= 10);
  assert.equal(MAX, FRAGEN.length);
  const codes = FRAGEN.map((f) => f.code);
  assert.equal(new Set(codes).size, codes.length, 'doppelte Codes');
  for (const f of FRAGEN) {
    assert.ok(f.frage?.length >= 15, `${f.code}: Frage fehlt`);
    assert.ok(['ja', 'nein'].includes(f.gut), `${f.code}: sichere Antwort muss ja/nein sein`);
    assert.ok(f.erklaerung?.length >= 20, `${f.code}: Erklärung fehlt`);
    assert.ok(f.tipp?.length >= 20, `${f.code}: Tipp bei unsicherer Antwort fehlt`);
  }
  // Kern-Kriterien aus der Idee
  for (const pflicht of ['impressum', 'name', 'werbung', 'fremdchat']) {
    assert.ok(codes.includes(pflicht), `Pflicht-Check fehlt: ${pflicht}`);
  }
});

test('sichere Antwort ist NICHT immer "ja" (sonst kein echtes Prüfen)', () => {
  const jaGut = FRAGEN.filter((f) => f.gut === 'ja').length;
  const neinGut = FRAGEN.filter((f) => f.gut === 'nein').length;
  assert.ok(jaGut >= 2 && neinGut >= 2, 'Mischung aus ja-gut und nein-gut Fragen');
});

test('sicherePunkte & warnungen: nur passende Antworten zählen', () => {
  const alleSicher = Object.fromEntries(FRAGEN.map((f) => [f.code, f.gut]));
  assert.equal(sicherePunkte(alleSicher), MAX);
  assert.equal(warnungen(alleSicher).length, 0);

  const eineFalsch = { ...alleSicher };
  eineFalsch.name = eineFalsch.name === 'ja' ? 'nein' : 'ja';
  assert.equal(sicherePunkte(eineFalsch), MAX - 1);
  assert.equal(warnungen(eineFalsch).length, 1);
  assert.equal(warnungen(eineFalsch)[0].code, 'name');
});

test('ampel: grün/gelb/rot mit klaren Grenzen', () => {
  assert.equal(ampel(MAX).stufe, 'gruen');
  assert.equal(ampel(0).stufe, 'rot');
  assert.equal(ampel(Math.round(MAX * 0.7)).stufe, 'gelb');
  for (const p of [0, 3, MAX]) assert.ok(ampel(p).emoji && ampel(p).text.length >= 20);
});
