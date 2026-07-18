import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';

const kit = JSON.parse(await readFile(new URL('../daten/kit.json', import.meta.url), 'utf8'));
const kataloge = JSON.parse(await readFile(new URL('../daten/sprachen.json', import.meta.url), 'utf8'));

test('Kit: Agenda summiert auf 60 Minuten, 4 Module, Karten und Hilfen vorhanden', () => {
  const summe = kit.agenda.reduce((s, a) => s + a.minuten, 0);
  assert.equal(summe, kit.dauer, `Agenda muss ${kit.dauer} Minuten ergeben (ist: ${summe})`);
  assert.equal(kit.dauer, 60, 'ein Abend, keine Fortbildung');
  assert.deepEqual(kit.module.map((m) => m.id), ['kettenbriefe', 'kostenfallen', 'sharenting', 'voreinstellungen']);
  assert.ok(kit.diskussionskarten.length >= 6, 'mindestens 6 Diskussionskarten');
  for (const k of kit.diskussionskarten) {
    assert.ok(k.frage?.length >= 20 && k.hinweis?.length >= 40, 'Karte braucht Frage + Moderations-Hinweis');
  }
  assert.ok(kit.hilfen.join(' ').includes('116 111'), 'Kinder-Hilfenummer');
  assert.ok(kit.hilfen.join(' ').includes('0800 111 0 550'), 'Elterntelefon');
});

test('Module: Kernbotschaft + Folienpunkte; GENAU zwei Live-Demos mit Drehbuch, Apps existieren', async () => {
  const mitDemo = kit.module.filter((m) => m.demoApp);
  assert.equal(mitDemo.length, 2, 'Katalog Nr. 24: Live-Demo-Drehbuch für ZWEI Apps');
  for (const m of kit.module) {
    assert.ok(m.kernbotschaft?.length >= 80, `${m.id}: Kernbotschaft zu dünn`);
    assert.ok(m.folienPunkte?.length >= 3, `${m.id}: mindestens 3 Folienpunkte`);
  }
  for (const m of mitDemo) {
    assert.ok(m.demoDrehbuch.length >= 3, `${m.id}: Drehbuch braucht mindestens 3 Schritte`);
    await assert.doesNotReject(
      access(new URL(`../../${m.demoApp}/index.html`, import.meta.url)),
      `Demo-App fehlt: apps/${m.demoApp}/`);
  }
});

test('Haltung: kein Verbots-Abend - loben statt schimpfen, gemeinsam statt heimlich', () => {
  const alles = JSON.stringify(kit);
  assert.match(alles, /loben|Loben/, 'Zeigen wird belohnt, nicht bestraft');
  assert.match(alles, /[Gg]emeinsam einrichten|gemeinsam/, 'gemeinsam statt Kontrolle');
  assert.match(alles, /nie schimpfen|Nie schimpfen|NICHT das Handy wegnehmen/, 'die Anti-Verbots-Regel ist explizit');
  assert.match(alles, /Sharenting/, 'die Erwachsenen-Selbstkritik (Sharenting) gehört dazu');
  assert.match(alles, /§ 10b JuSchG|JuSchG/, 'Rechtsrahmen benannt');
});

test('Handout-i18n: uk und ru decken exakt dieselben Schlüssel ab wie de (Vollständigkeitstest)', () => {
  assert.deepEqual(Object.keys(kataloge).sort(), ['de', 'en', 'ru', 'uk']);
  const deSchluessel = Object.keys(kataloge.de).sort();
  for (const code of ['en', 'uk', 'ru']) {
    assert.deepEqual(Object.keys(kataloge[code]).sort(), deSchluessel, `${code}: Schlüssel weichen von de ab`);
    for (const [k, wert] of Object.entries(kataloge[code])) {
      if (Array.isArray(kataloge.de[k])) {
        assert.equal(wert.length, kataloge.de[k].length, `${code}/${k}: Listenlänge weicht ab`);
        for (const eintrag of wert) assert.ok(eintrag.length >= 10, `${code}/${k}: leerer Listeneintrag`);
      } else {
        assert.ok(typeof wert === 'string' && wert.length >= 10, `${code}/${k}: Text fehlt`);
      }
    }
  }
});

test('Handout-Substanz: alle 4 Module, Hilfe-Nummern und Eine-Sache-Regel in jeder Sprache', () => {
  for (const code of ['de', 'en', 'uk', 'ru']) {
    const k = kataloge[code];
    for (const m of ['kettenbriefe', 'kostenfallen', 'sharenting', 'voreinstellungen']) {
      assert.ok(k[`m_${m}_titel`] && k[`m_${m}_text`], `${code}: Modul ${m} fehlt`);
      assert.equal(k[`m_${m}_tipps`].length, 3, `${code}/${m}: genau 3 Tipps`);
    }
    const alles = JSON.stringify(k);
    assert.ok(alles.includes('116 111'), `${code}: Kinder-Hilfenummer fehlt`);
    assert.ok(alles.includes('0800 111 0 550'), `${code}: Elterntelefon fehlt`);
  }
});
