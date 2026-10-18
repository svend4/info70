import { test } from 'node:test';
import assert from 'node:assert/strict';
import daten from '../daten/karten.json' with { type: 'json' };
import {
  VERBOTENE_ZEICHEN, begriffZeilen, druckBlaetter, kartenFuerThemen, kartenText, kartenZeilen,
  pruefeEintrag, versuchKarteAusDaten,
} from '../logik.mjs';

// Prüft Daten und Logik. Die Regeln der Umgebung (Eingabefelder, Speicherung, Netz,
// Druckzeichen, Namenszeile, Pflichtmarkierung, Fokus, Testzahl) stehen in test/regeln.test.mjs.
//
// Die Zitate sind gegen den Quelltext geprüft (maschinell, lokal, nicht im Repo). Dieser Test
// prüft, dass die Daten dem Bauauftrag PRI-8 entsprechen.

const THEMEN_REIHENFOLGE = ['sand-trocken', 'sand-nass', 'ton', 'wasser', 'stapeln', 'ineinanderlegen', 'werkzeug'];

// Die Zitate je Karte, wörtlich wie im Bauauftrag (Abschnitt 1).
const ZITATE = {
  'sand-trocken': ['сухой и влажный песок'],
  'sand-nass': ['сухой и влажный песок'],
  ton: ['песок, глина, камушки'],
  wasser: [],
  stapeln: ['пирамидок из колечек'],
  ineinanderlegen: [],
  werkzeug: ['достать палочкой', 'совочком', 'Я сам'],
};

const SEITEN = {
  'sand-trocken': 'S. 63',
  'sand-nass': 'S. 63',
  ton: 'S. 63',
  wasser: 'S. 63',
  stapeln: 'S. 64',
  ineinanderlegen: 'S. 63',
  werkzeug: 'S. 64',
};

const PFLICHT = 'Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.';

test('Daten: sieben Karten in fester Reihenfolge, Kennungen eindeutig', () => {
  assert.deepEqual(daten.karten.map((k) => k.id), THEMEN_REIHENFOLGE);
  assert.equal(new Set(daten.karten.map((k) => k.id)).size, daten.karten.length, 'doppelte Kennungen');
});

test('Daten: jede Karte hat Titel, Material, Lernziel und einen Sicherheitshinweis von mindestens 30 Zeichen', () => {
  for (const k of daten.karten) {
    assert.ok(k.titel.trim(), `${k.id}: Titel fehlt`);
    assert.ok(k.material.trim(), `${k.id}: Material fehlt`);
    assert.ok(k.lernziel.trim(), `${k.id}: Lernziel fehlt`);
    assert.ok(k.sicherheit.length >= 30, `${k.id}: Sicherheitshinweis zu kurz`);
  }
});

test('Daten: jede Quelle hat die Form „S. n“ mit Seitenzahl aus dem Bauauftrag', () => {
  for (const k of daten.karten) {
    assert.equal(k.quelle.seite, SEITEN[k.id], `${k.id}: Seite weicht vom Bauauftrag ab`);
    assert.match(k.quelle.seite, /^S\. \d+$/);
  }
});

test('Daten: die Zitate stehen wörtlich und in der Reihenfolge des Bauauftrags', () => {
  for (const k of daten.karten) {
    assert.deepEqual(k.begriffe.map((b) => b.quelltext), ZITATE[k.id], `${k.id}: Zitate weichen ab`);
  }
});

test('Daten: jedes Zitat hat höchstens 6 Wörter und eine deutsche Übertragung (Eigenentwurf)', () => {
  for (const k of daten.karten) {
    for (const b of k.begriffe) {
      assert.ok(b.quelltext.split(/\s+/).length <= 6, `${k.id}: Zitat über 6 Wörter`);
      assert.ok(b.deutsch?.trim(), `${k.id}: Übertragung fehlt bei „${b.quelltext}“`);
    }
  }
});

test('Daten: die Zitate der Quelle stehen nicht in Sätzen, nur als Begriffe', () => {
  for (const k of daten.karten) {
    for (const b of k.begriffe) {
      assert.ok(!/[.!?]$/.test(b.quelltext), `${k.id}: Zitat wie ein Satz`);
    }
  }
});

test('Daten: die Quellenzeile nennt Abschnitt und Gruppe ohne Seitenzahl', () => {
  assert.match(daten.quelleKurz, /ПОЗНАВАТЕЛЬНО-ПРАКТИЧЕСКАЯ ДЕЯТЕЛЬНОСТЬ/);
  assert.match(daten.quelleKurz, /МАЛЫШИ/);
  assert.doesNotMatch(daten.quelleKurz, /S\. \d/);
});

test('Daten: die Pflichtmarkierung ist die vorgeschriebene', () => {
  assert.equal(daten.pflichtmarkierung, PFLICHT);
});

test('Daten: jede Beschriftung für Eigenentwurf ist gesetzt', () => {
  const b = daten.beschriftung;
  for (const feld of ['kopf', 'begriffe', 'material', 'lernziel', 'sicherheit']) {
    assert.ok(b[feld]?.trim(), `Beschriftung fehlt: ${feld}`);
  }
  assert.match(b.kopf, /Eigenentwurf/);
  assert.match(b.material, /Eigenentwurf/);
  assert.match(b.lernziel, /Eigenentwurf/);
  assert.match(b.sicherheit, /Eigenentwurf/);
});

test('pruefeEintrag: fehlendes Pflichtfeld wird abgelehnt', () => {
  const gut = daten.karten[0];
  assert.doesNotThrow(() => pruefeEintrag(gut));
  assert.throws(() => pruefeEintrag({ ...gut, titel: '  ' }), /Feld fehlt: titel/);
  assert.throws(() => pruefeEintrag({ ...gut, material: undefined }), /Feld fehlt: material/);
  assert.throws(() => pruefeEintrag({ ...gut, lernziel: '' }), /Feld fehlt: lernziel/);
});

test('pruefeEintrag: zu kurzer Sicherheitshinweis wird abgelehnt', () => {
  assert.throws(() => pruefeEintrag({ ...daten.karten[0], sicherheit: 'Vorsicht.' }), /Sicherheitshinweis zu kurz/);
});

test('pruefeEintrag: Quelle ohne „S. n“ wird abgelehnt, außer bei eigenentwurf: true', () => {
  const gut = daten.karten[0];
  assert.throws(() => pruefeEintrag({ ...gut, quelle: { seite: '63' } }), /Quelle fehlt oder falsch/);
  assert.throws(() => pruefeEintrag({ ...gut, quelle: undefined }), /Quelle fehlt oder falsch/);
  assert.doesNotThrow(() => pruefeEintrag({ ...gut, quelle: undefined, eigenentwurf: true }));
});

test('versuchKarteAusDaten: gibt Titel, Material, Lernziel, Sicherheit und Quelle aus', () => {
  const karte = versuchKarteAusDaten(daten.karten[4]);
  assert.equal(karte.id, 'stapeln');
  assert.equal(karte.titel, 'Stapeln');
  assert.equal(karte.quelle.seite, 'S. 64');
  assert.equal(karte.begriffe.length, 1);
});

test('kartenFuerThemen: liefert die Karten in der Reihenfolge der Themen', () => {
  const liste = kartenFuerThemen(daten.karten, ['werkzeug', 'ton']);
  assert.deepEqual(liste.map((k) => k.id), ['werkzeug', 'ton']);
});

test('kartenFuerThemen: ein fehlendes Thema wirft „Thema fehlt“', () => {
  assert.throws(() => kartenFuerThemen(daten.karten, ['ton', 'gibt-es-nicht']), /Thema fehlt: gibt-es-nicht/);
});

test('kartenFuerThemen: eine leere Auswahl ergibt eine leere Liste', () => {
  assert.deepEqual(kartenFuerThemen(daten.karten, []), []);
});

test('begriffZeilen: Zitat in Anführungszeichen, Übertragung als Eigenentwurf, ohne Seite', () => {
  const zeilen = begriffZeilen(daten.karten[6]);
  assert.equal(zeilen.length, 3);
  assert.equal(zeilen[0], '„достать палочкой“: mit dem Stäbchen herausholen (Eigenentwurf)');
  for (const z of zeilen) {
    assert.doesNotMatch(z, /S\. \d/, 'Seitenzahl auf dem Blatt');
  }
});

test('begriffZeilen: eine Karte ohne Begriffe hat keine Zeilen', () => {
  assert.deepEqual(begriffZeilen(daten.karten[3]), []);
});

test('kartenZeilen: Pflichtmarkierung steht, wenn eine Seitenangabe gesetzt ist', () => {
  const z = kartenZeilen(daten, daten.karten[0]);
  assert.equal(z.pflicht, PFLICHT);
  assert.equal(z.kopf, 'Kleine Forscher ohne Bildschirm');
  assert.equal(z.quelle, `Quelle: ${daten.quelleKurz}`);
});

test('kartenZeilen: ohne Seitenangabe und ohne Eigenentwurf-Kennzeichnung keine Pflichtmarkierung', () => {
  const ohne = { ...daten.karten[0], quelle: undefined };
  assert.equal(kartenZeilen(daten, ohne).pflicht, null);
});

test('kartenText: jede Karte nennt die Kennzeichnung Eigenentwurf und hat keine Seitenzahl', () => {
  for (const k of daten.karten) {
    const text = kartenText(daten, k);
    assert.match(text, /Eigenentwurf/, `${k.id}: ohne Kennzeichnung`);
    assert.doesNotMatch(text, /S\. \d/, `${k.id}: Seitenzahl auf dem Blatt`);
  }
});

test('druckBlaetter: ein Blatt je gewählter Karte, in der Reihenfolge der Auswahl', () => {
  const karten = kartenFuerThemen(daten.karten, ['ton', 'wasser', 'werkzeug']);
  const blaetter = druckBlaetter(daten, karten);
  assert.equal(blaetter.length, karten.length);
  assert.deepEqual(blaetter.map((b) => b.id), ['ton', 'wasser', 'werkzeug']);
});

test('druckBlaetter: keine Auswahl ergibt keine Blätter', () => {
  assert.deepEqual(druckBlaetter(daten, []), []);
});

test('druckBlaetter: alle Karten sind frei von verbotenen Druckzeichen', () => {
  for (const b of druckBlaetter(daten, daten.karten)) {
    const text = JSON.stringify(b.zeilen);
    assert.ok(!VERBOTENE_ZEICHEN.test(text), `${b.id}: Druckzeichen`);
  }
});

test('druckBlaetter: ein verbotenes Zeichen in den Daten wird abgelehnt', () => {
  const kaputt = { ...daten.karten[0], material: 'Sand ✓ und Eimer, mit genug Text für die Prüfung' };
  assert.throws(() => druckBlaetter(daten, [kaputt]), /Druckzeichen im Blatt sand-trocken/);
});

test('die Beschriftungen der Blätter enthalten nie eine Seitenzahl', () => {
  for (const feld of Object.values(daten.beschriftung)) {
    assert.doesNotMatch(feld, /S\. \d/);
  }
});
