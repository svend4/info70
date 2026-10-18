import { test } from 'node:test';
import assert from 'node:assert/strict';
import daten from '../daten/werkstatt.json' with { type: 'json' };
import {
  begriffZeilen, kartenText, kartenZeilen, neuerVorschlag, stueckanfangText, waehle, zufallsIndex,
} from '../logik.mjs';

// Prüft Daten und Logik. Die Regeln der Umgebung (Eingabefelder, Speicherung,
// Netz, Druckzeichen, Pflichtmarkierung je Blatt, Zufall nur in app.mjs, Testzahl)
// stehen in test/regeln.test.mjs.
//
// Die Zitate und Seiten sind gegen den Quelltext geprüft (maschinell, lokal, nicht im Repo).
// Dieser Test prüft, dass die Daten dem entsprechen, was dort geprüft wurde.

const GESTALTUNG_REIHENFOLGE = ['plakat', 'einladung', 'kulisse', 'puppe', 'kleidung'];

// Die Zitate je Gestaltungsauftrag, wörtlich aus dem Quelltext (S. 286 bis 288).
const ZITATE = {
  plakat: ['Афиша для выставки', 'создание афиши для музыкального «концерта»'],
  einladung: ['Пригласительные билеты для выставки'],
  kulisse: ['разработка элементов дизайна кукол, кулис, декораций'],
  puppe: ['элементов дизайна кукол'],
  kleidung: ['Одежда для кукол', 'одежды для кукол'],
};

// Die Seiten je Gestaltungsauftrag, wie sie in der Quellenzeile stehen.
const QUELLE_SEITEN = {
  plakat: 'S. 287 und S. 288',
  einladung: 'S. 288',
  kulisse: 'S. 288',
  puppe: 'S. 288',
  kleidung: 'S. 287 und S. 288',
};

const BAUSTEINE = ['figur', 'ort', 'problem', 'ende'];

test('Daten: fünf Gestaltungsaufträge in fester Reihenfolge, Kennungen eindeutig, Pflichtfelder gesetzt', () => {
  assert.deepEqual(daten.gestaltung.map((g) => g.id), GESTALTUNG_REIHENFOLGE);
  assert.equal(new Set(daten.gestaltung.map((g) => g.id)).size, daten.gestaltung.length, 'doppelte Kennungen');
  for (const g of daten.gestaltung) {
    assert.ok(g.titel && g.aufgabe && g.quelle, `${g.id}: Titel, Aufgabe oder Quelle fehlt`);
    assert.ok(Array.isArray(g.begriffe) && g.begriffe.length >= 1, `${g.id}: keine Begriffe`);
  }
  assert.equal(daten.titel, 'Puppentheater-Werkstatt', 'Titel weicht ab');
});

test('Zitate: je Gestaltungsauftrag genau die geprüften Wortlaute, in dieser Reihenfolge', () => {
  for (const g of daten.gestaltung) {
    assert.deepEqual(g.begriffe.map((b) => b.quelltext), ZITATE[g.id], `${g.id}: Zitate weichen ab`);
  }
});

test('Seitenangaben: jeder Begriff nennt S. 286 bis 288, und jede Seite steht in der Quellenzeile der Karte', () => {
  for (const g of daten.gestaltung) {
    for (const b of g.begriffe) {
      assert.match(b.seite, /^S\. (286|287|288)$/, `${g.id}: Seite „${b.seite}“ liegt außerhalb von S. 286 bis 288`);
      assert.ok(g.quelle.includes(b.seite), `${g.id}: ${b.seite} steht nicht in der Quellenzeile „${g.quelle}“`);
    }
  }
});

test('Quellenzeile: Seiten je Gestaltungsauftrag wie geprüft; Abschnitt und Gruppe stehen dabei', () => {
  for (const g of daten.gestaltung) {
    assert.ok(g.quelle.startsWith(`Praleska, ${QUELLE_SEITEN[g.id]} `), `${g.id}: Quellenzeile „${g.quelle}“`);
    assert.ok(g.quelle.includes('„Детский дизайн“') && g.quelle.includes('„ФАНТАЗЕРЫ“'), `${g.id}: Abschnitt oder Gruppe fehlt`);
  }
});

test('Russische Zitate höchstens 12 Wörter', () => {
  for (const g of daten.gestaltung) {
    for (const b of g.begriffe) {
      const woerter = b.quelltext.trim().split(/\s+/).length;
      assert.ok(woerter <= 12, `„${b.quelltext}“ hat ${woerter} Wörter`);
    }
  }
});

test('Begriffe: mit Übertragung nur mit „(Eigenentwurf)“, ohne Übertragung nur Zitat und Seite', () => {
  for (const g of daten.gestaltung) {
    const zeilen = begriffZeilen(g);
    g.begriffe.forEach((b, i) => {
      if (b.deutsch) {
        assert.ok(zeilen[i].endsWith(`${b.deutsch} (Eigenentwurf)`), `${g.id}: Übertragung ohne Kennzeichnung`);
      } else {
        assert.equal(zeilen[i], `„${b.quelltext}“ (${b.seite})`, `${g.id}: Zeile ohne Übertragung weicht ab`);
      }
    });
  }
  const plakat = daten.gestaltung.find((g) => g.id === 'plakat');
  assert.equal(begriffZeilen(plakat)[0], '„Афиша для выставки“ (S. 288): Plakat, Ankündigung (Eigenentwurf)');
});

test('Einladung: die Quelle meint eine Ausstellung; die Vorstellung steht nur als Übertragung da', () => {
  const einladung = daten.gestaltung.find((g) => g.id === 'einladung');
  assert.match(einladung.begriffe[0].deutsch, /Ausstellung/, 'die Übertragung verschweigt, dass die Quelle eine Ausstellung meint');
  assert.match(einladung.titel, /Vorstellung/);
});

test('Bausteine: vier Listen, je mindestens sechs eindeutige Sätze, als Eigenentwurf gekennzeichnet', () => {
  assert.equal(daten.bausteine.kennzeichnung, 'Eigenentwurf');
  for (const name of BAUSTEINE) {
    const liste = daten.bausteine[name];
    assert.ok(Array.isArray(liste) && liste.length >= 6, `${name}: weniger als sechs Einträge`);
    assert.equal(new Set(liste).size, liste.length, `${name}: doppelte Einträge`);
    for (const satz of liste) {
      assert.match(satz, /^[A-ZÄÖÜ]/, `${name}: Satz beginnt nicht mit einem Großbuchstaben: „${satz}“`);
      assert.match(satz, /[.?!]$/, `${name}: Satz endet ohne Satzzeichen: „${satz}“`);
      assert.ok(satz.length <= 110, `${name}: Satz zu lang: „${satz}“`);
      assert.ok(!/ {2}|\s$/.test(satz), `${name}: Leerzeichen zu viel: „${satz}“`);
    }
  }
});

test('Bausteine: keine Lieder, keine Märchenformel und keine Vorlage aus fremden Stücken', () => {
  const roh = JSON.stringify(daten.bausteine);
  assert.ok(!/Es war einmal|Lied|singt|Singen/i.test(roh), 'Märchenformel oder Liedbezug in den Bausteinen');
});

test('Zufallsindex: 0 liefert den ersten, knapp unter 1 den letzten Eintrag; Werte außerhalb werden begrenzt', () => {
  assert.equal(zufallsIndex(7, () => 0), 0);
  assert.equal(zufallsIndex(7, () => 0.5), 3);
  assert.equal(zufallsIndex(7, () => 0.9999999999), 6);
  assert.equal(zufallsIndex(7, () => 1), 6, 'der Wert 1 darf nicht außerhalb der Liste liegen');
  assert.equal(zufallsIndex(7, () => -0.3), 0, 'ein negativer Wert darf nicht außerhalb der Liste liegen');
  assert.equal(zufallsIndex(7, () => Number.NaN), 0, 'ein fehlender Wert ergibt den ersten Eintrag');
});

test('Zufallsindex: ungültige Eingaben werfen einen Fehler, statt still zu wählen', () => {
  assert.throws(() => zufallsIndex(0, () => 0), RangeError);
  assert.throws(() => zufallsIndex(2.5, () => 0), RangeError);
  assert.throws(() => zufallsIndex(3, undefined), TypeError);
});

test('waehle: jeder Eintrag jeder Liste ist erreichbar', () => {
  const listen = [daten.gestaltung, ...BAUSTEINE.map((n) => daten.bausteine[n])];
  for (const liste of listen) {
    for (let i = 0; i < liste.length; i++) {
      assert.equal(waehle(liste, () => (i + 0.5) / liste.length), liste[i], `Index ${i} nicht erreichbar`);
    }
  }
});

test('neuerVorschlag: Ziehungen in fester Reihenfolge; Wert 0 liefert die ersten, Wert nahe 1 die letzten Einträge', () => {
  const ersterEintrag = neuerVorschlag(daten, () => 0);
  assert.equal(ersterEintrag.gestaltung, daten.gestaltung[0]);
  assert.equal(ersterEintrag.teile.figur, daten.bausteine.figur[0]);
  assert.equal(ersterEintrag.teile.ort, daten.bausteine.ort[0]);
  assert.equal(ersterEintrag.teile.problem, daten.bausteine.problem[0]);
  assert.equal(ersterEintrag.teile.ende, daten.bausteine.ende[0]);

  const letzter = neuerVorschlag(daten, () => 0.9999999999);
  assert.equal(letzter.gestaltung, daten.gestaltung[daten.gestaltung.length - 1]);
  assert.equal(letzter.teile.figur, daten.bausteine.figur[daten.bausteine.figur.length - 1]);
  assert.equal(letzter.teile.ende, daten.bausteine.ende[daten.bausteine.ende.length - 1]);
});

test('neuerVorschlag: gleicher Zufall ergibt denselben Vorschlag; der Stückanfang ist genau die vier Teile', () => {
  const folge = [0.11, 0.42, 0.87, 0.05, 0.66];
  const mit = (werte) => {
    let i = 0;
    return () => werte[i++ % werte.length];
  };
  const a = neuerVorschlag(daten, mit(folge));
  const b = neuerVorschlag(daten, mit(folge));
  assert.deepEqual(a, b, 'derselbe Zufall muss denselben Vorschlag liefern');
  assert.equal(a.stueckanfang, stueckanfangText(a.teile));
  assert.equal(a.stueckanfang, [a.teile.figur, a.teile.ort, a.teile.problem, a.teile.ende].join(' '));
});

test('stueckanfangText: vier Teile, durch ein Leerzeichen getrennt, endet mit Satzzeichen', () => {
  const text = stueckanfangText({ figur: 'A.', ort: 'B.', problem: 'C.', ende: 'D?' });
  assert.equal(text, 'A. B. C. D?');
  assert.match(text, /[.?!]$/);
});

test('Druckblatt: Kopf, Titel, Quellenzeile, Auftrag, Begriffe, Stückanfang und Pflichtmarkierung stehen drin', () => {
  const vorschlag = neuerVorschlag(daten, () => 0.3);
  const text = kartenText(daten, vorschlag);
  assert.ok(text.includes(daten.beschriftung.kopf));
  assert.ok(text.includes(vorschlag.gestaltung.titel));
  assert.ok(text.includes(`Quelle: ${vorschlag.gestaltung.quelle}`));
  assert.ok(text.includes(vorschlag.gestaltung.aufgabe));
  assert.ok(text.includes(daten.beschriftung.stueckanfang));
  assert.ok(text.includes(vorschlag.stueckanfang));
  assert.ok(text.includes(daten.pflichtmarkierung));
  assert.ok(!/undefined|null|\[object|UNBEKANNT/.test(text), 'Rest im Text');
});

test('kartenZeilen: liefert die Zeilen für den Druck; ohne Begriffe bleibt die Liste leer statt undefined', () => {
  const vorschlag = neuerVorschlag(daten, () => 0);
  const z = kartenZeilen(daten, vorschlag);
  assert.equal(z.titel, vorschlag.gestaltung.titel);
  assert.equal(z.pflicht, daten.pflichtmarkierung);
  assert.ok(Array.isArray(z.begriffe) && z.begriffe.length === vorschlag.gestaltung.begriffe.length);
  const ohne = { ...vorschlag, gestaltung: { ...vorschlag.gestaltung, begriffe: [] } };
  assert.deepEqual(kartenZeilen(daten, ohne).begriffe, []);
});

test('Keine uk- oder ru-Felder: in den Daten steht kein Schlüssel uk oder ru', () => {
  const schluessel = [];
  const sammle = (wert) => {
    if (Array.isArray(wert)) wert.forEach(sammle);
    else if (wert && typeof wert === 'object') {
      for (const [k, v] of Object.entries(wert)) {
        schluessel.push(k);
        sammle(v);
      }
    }
  };
  sammle(daten);
  assert.ok(!schluessel.some((k) => /^(uk|ru)(_|$)/i.test(k)), `Sprachfeld gefunden: ${schluessel.join(', ')}`);
});
