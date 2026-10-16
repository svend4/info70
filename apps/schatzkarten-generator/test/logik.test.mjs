import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  ORTE, SYMBOLE, GITTER_MIN, GITTER_MAX, pruefeEingaben, erzeugeKarte, richtungZwischen,
  dreheRelativ, beschreibeWeg, satzZuSegment, wegkarten, rasterZellen, wegAlsRichtungen,
  loesungZeilen, alsTextdatei,
} from '../logik.mjs';

// Fester Zufallsgeber (mulberry32): dieselbe Saat ergibt dieselbe Folge von Zahlen
// von 0 bis unter 1. So sind alle Karten in diesen Tests nachvollziehbar.
function zufallsgeber(saat) {
  let a = saat;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), a | 1);
    t = (t + Math.imul(t ^ (t >>> 7), t | 61)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const schluessel = (c) => `${c.s},${c.z}`;
const gleich = (a, b) => a.s === b.s && a.z === b.z;
const abstand = (a, b) => Math.abs(a.s - b.s) + Math.abs(a.z - b.z);

test('pruefeEingaben: Gitter 4 bis 8, 0 bis 6 Zeichen, fester Ort; vier Orte', () => {
  assert.deepEqual(pruefeEingaben({ groesse: 5, ort: 'park', anzahlZeichen: 3 }), []);
  assert.equal(pruefeEingaben({ groesse: 3, ort: 'park', anzahlZeichen: 3 }).length, 1);
  assert.equal(pruefeEingaben({ groesse: 9, ort: 'park', anzahlZeichen: 3 }).length, 1);
  assert.equal(pruefeEingaben({ groesse: 5, ort: 'park', anzahlZeichen: 7 }).length, 1);
  assert.equal(pruefeEingaben({ groesse: 5, ort: 'schule', anzahlZeichen: 3 }).length, 1);
  assert.equal(pruefeEingaben({ groesse: 4.5, ort: 'park', anzahlZeichen: 0 }).length, 1);
  assert.deepEqual(ORTE.map((o) => o.name), ['Gruppenraum', 'Außengelände', 'Park', 'Wohnung']);
});

test('erzeugeKarte verlangt einen Zufallsgeber und gültige Eingaben', () => {
  assert.throws(() => erzeugeKarte({ groesse: 5, ort: 'park', anzahlZeichen: 3 }), /Zufallsgeber/);
  assert.throws(() => erzeugeKarte({ groesse: 2, ort: 'park', anzahlZeichen: 3, rng: zufallsgeber(1) }), /4 und 8/);
  // Ein Zufallsgeber, der 1 liefert, ist ungültig (das Intervall endet bei 1, ohne 1).
  assert.throws(() => erzeugeKarte({ groesse: 5, ort: 'park', anzahlZeichen: 3, rng: () => 1 }), /eingeschlossen/);
});

test('Start und Ziel liegen auf dem Gitter, sind verschieden und mindestens n−1 Schritte auseinander', () => {
  for (let groesse = GITTER_MIN; groesse <= GITTER_MAX; groesse++) {
    for (let saat = 1; saat <= 40; saat++) {
      const k = erzeugeKarte({ groesse, ort: 'park', anzahlZeichen: 2, rng: zufallsgeber(saat * 7919 + groesse) });
      for (const feld of [k.start, k.ziel]) {
        assert.ok(feld.s >= 0 && feld.s < groesse && feld.z >= 0 && feld.z < groesse, `außerhalb: ${JSON.stringify(feld)}`);
      }
      assert.ok(!gleich(k.start, k.ziel), 'Start und Ziel fallen zusammen');
      assert.ok(abstand(k.start, k.ziel) >= groesse - 1, `zu nah bei Gitter ${groesse}`);
    }
  }
});

test('der Weg läuft von Start nach Ziel über Nachbarfelder und ist ein kürzester Weg', () => {
  for (let groesse = GITTER_MIN; groesse <= GITTER_MAX; groesse++) {
    for (let saat = 1; saat <= 25; saat++) {
      const k = erzeugeKarte({ groesse, ort: 'wohnung', anzahlZeichen: 4, rng: zufallsgeber(saat + 1000 * groesse) });
      assert.ok(gleich(k.weg[0], k.start), 'Weg beginnt nicht am Start');
      assert.ok(gleich(k.weg.at(-1), k.ziel), 'Weg endet nicht am Ziel');
      for (let i = 1; i < k.weg.length; i++) richtungZwischen(k.weg[i - 1], k.weg[i]);
      assert.equal(k.weg.length - 1, abstand(k.start, k.ziel), 'Weg ist länger als nötig');
      assert.equal(new Set(k.weg.map(schluessel)).size, k.weg.length, 'Weg besucht ein Feld zweimal');
    }
  }
});

test('Zeichen: gewünschte Anzahl, verschiedene Arten, eigene Felder, nie auf Start oder Ziel', () => {
  for (const anzahl of [0, 1, 3, 6]) {
    const k = erzeugeKarte({ groesse: 4, ort: 'wohnung', anzahlZeichen: anzahl, rng: zufallsgeber(anzahl + 11) });
    assert.equal(k.zeichen.length, anzahl);
    assert.equal(new Set(k.zeichen.map((z) => z.art)).size, anzahl, 'eine Zeichenart kommt doppelt vor');
    assert.equal(new Set(k.zeichen.map(schluessel)).size, anzahl, 'zwei Zeichen auf einem Feld');
    for (const z of k.zeichen) {
      assert.ok(SYMBOLE.some((s) => s.id === z.art), `unbekannte Art ${z.art}`);
      assert.ok(!gleich(z, k.start), 'Zeichen auf dem Start');
      assert.ok(!gleich(z, k.ziel), 'Zeichen auf dem Ziel');
    }
  }
});

test('gleicher Zufallswert ergibt dieselbe Karte, ein anderer eine andere', () => {
  const a = erzeugeKarte({ groesse: 6, ort: 'park', anzahlZeichen: 4, rng: zufallsgeber(42) });
  const b = erzeugeKarte({ groesse: 6, ort: 'park', anzahlZeichen: 4, rng: zufallsgeber(42) });
  assert.deepEqual(b, a);
  const c = erzeugeKarte({ groesse: 6, ort: 'park', anzahlZeichen: 4, rng: zufallsgeber(43) });
  assert.notDeepEqual(c, a);
});

test('dreheRelativ: geradeaus, rechts, links und umdrehen aus jeder Blickrichtung', () => {
  const erwartet = {
    N: { N: 'geradeaus', O: 'rechts', S: 'umdrehen', W: 'links' },
    O: { O: 'geradeaus', S: 'rechts', W: 'umdrehen', N: 'links' },
    S: { S: 'geradeaus', W: 'rechts', N: 'umdrehen', O: 'links' },
    W: { W: 'geradeaus', N: 'rechts', O: 'umdrehen', S: 'links' },
  };
  for (const blick of Object.keys(erwartet)) {
    for (const richtung of Object.keys(erwartet[blick])) {
      assert.equal(dreheRelativ(blick, richtung), erwartet[blick][richtung], `${blick} nach ${richtung}`);
    }
  }
});

test('beschreibeWeg: Drehungen, Schritte und Einzahl „1 Feld“ in festen Beispielen', () => {
  // Vom Start aus nach Osten (rechts), dann nach Süden (vom Kind aus gesehen auch rechts).
  const rechts = beschreibeWeg([{ s: 0, z: 0 }, { s: 1, z: 0 }, { s: 2, z: 0 }, { s: 2, z: 1 }]);
  assert.deepEqual(rechts.map((x) => [x.drehung, x.schritte]), [['rechts', 2], ['rechts', 1]]);
  assert.equal(satzZuSegment(rechts[0]), 'Biege rechts ab und geh 2 Felder.');
  assert.equal(satzZuSegment(rechts[1]), 'Biege rechts ab und geh 1 Feld. Hier endet der Weg.');

  // Nach Süden, also hinter dem Kind: umdrehen.
  const umdrehen = beschreibeWeg([{ s: 0, z: 0 }, { s: 0, z: 1 }, { s: 0, z: 2 }, { s: 0, z: 3 }]);
  assert.equal(satzZuSegment(umdrehen[0]), 'Dreh dich um und geh 3 Felder. Hier endet der Weg.');

  // Geradeaus, nach vorn, also nach Norden.
  const geradeaus = beschreibeWeg([{ s: 0, z: 2 }, { s: 0, z: 1 }, { s: 0, z: 0 }]);
  assert.equal(satzZuSegment(geradeaus[0]), 'Geh 2 Felder geradeaus. Hier endet der Weg.');

  // Nach Westen, also links.
  const links = beschreibeWeg([{ s: 1, z: 0 }, { s: 0, z: 0 }]);
  assert.equal(satzZuSegment(links[0]), 'Biege links ab und geh 1 Feld. Hier endet der Weg.');
});

test('ein Zeichen auf dem Weg beendet den Abschnitt und wird genannt', () => {
  // Start nach Süden (hinten), Quadrat auf dem ersten Feld, dann weiter nach Süden, dann nach Osten.
  const weg = [{ s: 0, z: 0 }, { s: 0, z: 1 }, { s: 0, z: 2 }, { s: 1, z: 2 }];
  const zeichen = [{ art: 'quadrat', s: 0, z: 1 }];
  const segmente = beschreibeWeg(weg, zeichen);
  assert.equal(segmente.length, 3, 'das Zeichen muss den ersten Abschnitt beenden');
  assert.equal(satzZuSegment(segmente[0]), 'Dreh dich um und geh 1 Feld. Dort liegt das Quadrat.');
  // Vom Quadrat aus gesehen (Blick nach hinten/Süden) geht es weiter geradeaus.
  assert.equal(satzZuSegment(segmente[1]), 'Geh 1 Feld geradeaus.');
  // Nach Osten, vom Blick nach Süden aus links.
  assert.equal(satzZuSegment(segmente[2]), 'Biege links ab und geh 1 Feld. Hier endet der Weg.');
});

test('der Satz nennt jedes Zeichen mit dem richtigen Artikel', () => {
  for (const symbol of SYMBOLE) {
    const satz = satzZuSegment({ drehung: 'geradeaus', schritte: 2, zeichenArt: symbol.id, letzter: false });
    assert.equal(satz, `Geh 2 Felder geradeaus. Dort liegt ${symbol.artikel}.`);
  }
});

test('Wegkarten: die erste Karte ist die Startkarte, Nummern und Gesamtzahl stimmen', () => {
  const k = erzeugeKarte({ groesse: 5, ort: 'gruppenraum', anzahlZeichen: 2, rng: zufallsgeber(9) });
  const karten = wegkarten(k);
  assert.equal(karten.length, k.segmente.length + 1);
  assert.match(karten[0].text, /Start/);
  karten.forEach((w, i) => {
    assert.equal(w.nr, i + 1);
    assert.equal(w.gesamt, karten.length);
    assert.equal(w.titel, `Karte ${i + 1} von ${karten.length}`);
  });
  assert.match(karten.at(-1).text, /Hier endet der Weg\./);
});

test('die Raster-Karte zeigt weder Ziel noch Weg, die Lösung zeigt beides', () => {
  const k = erzeugeKarte({ groesse: 6, ort: 'park', anzahlZeichen: 3, rng: zufallsgeber(5) });
  const karte = rasterZellen(k, 'karte').flat();
  assert.equal(karte.filter((z) => z.inhalt === 'ziel' || z.inhalt === 'weg').length, 0);
  assert.equal(karte.filter((z) => z.inhalt === 'start').length, 1);
  assert.equal(karte.filter((z) => z.inhalt === 'zeichen').length, 3);

  const loesung = rasterZellen(k, 'loesung').flat();
  assert.equal(loesung.filter((z) => z.inhalt === 'ziel').length, 1);
  const aufWeg = k.zeichen.filter((z) => k.weg.some((w) => gleich(w, z))).length;
  // Wegfelder ohne Start, Ziel und ohne die Felder, die ein Zeichen zeigen.
  assert.equal(loesung.filter((z) => z.inhalt === 'weg').length, k.weg.length - 2 - aufWeg);
});

test('Lösungszeilen nennen Start, Ziel und den Weg in Himmelsrichtungen', () => {
  const weg = [{ s: 0, z: 0 }, { s: 1, z: 0 }, { s: 1, z: 1 }, { s: 1, z: 2 }];
  assert.equal(wegAlsRichtungen(weg), '1× O, 2× S');
  const k = { groesse: 3, ort: 'park', start: { s: 0, z: 0 }, ziel: { s: 1, z: 2 }, zeichen: [], weg, segmente: beschreibeWeg(weg, []) };
  const zeilen = loesungZeilen(k);
  assert.match(zeilen[0], /^Start: A1/);
  assert.match(zeilen[1], /^Ziel: B3/);
  assert.match(zeilen[2], /keine$/);
  assert.match(zeilen[3], /1× O, 2× S/);
});

test('die Textdatei für die Karten verrät weder Ziel noch Lösung noch Weg', () => {
  for (let saat = 1; saat <= 20; saat++) {
    const k = erzeugeKarte({ groesse: 4 + (saat % 5), ort: 'aussengelaende', anzahlZeichen: saat % 7, rng: zufallsgeber(saat) });
    const text = alsTextdatei(k, 'karten');
    assert.ok(!text.includes('Ziel'), 'das Wort Ziel steht im Kartentext');
    assert.ok(!text.includes('Lösung'), 'das Wort Lösung steht im Kartentext');
    const zeilen = text.split('\n').filter((z) => /^\s*\d+ \S/.test(z));
    assert.equal(zeilen.length, k.groesse, 'das Raster hat nicht die richtige Zeilenzahl');
    for (const z of zeilen) {
      assert.ok(!z.includes('Z'), `Ziel im Raster: ${z}`);
      assert.ok(!z.includes('+'), `Weg im Raster: ${z}`);
    }
  }
});

test('die Lösungs-Textdatei ist als nur für Erwachsene gekennzeichnet und zeigt Ziel und Weg', () => {
  const k = erzeugeKarte({ groesse: 5, ort: 'park', anzahlZeichen: 2, rng: zufallsgeber(77) });
  const text = alsTextdatei(k, 'loesung');
  assert.match(text, /nur für Erwachsene/);
  assert.match(text, /Ziel: /);
  const zeilen = text.split('\n').filter((z) => /^\s*\d+ \S/.test(z));
  assert.equal(zeilen.join('').split('Z').length - 1, 1, 'das Ziel muss genau einmal im Raster stehen');
  const erwartet = k.weg.slice(1, -1).filter((w) => !k.zeichen.some((z) => gleich(z, w))).length;
  assert.equal(zeilen.join('').split('+').length - 1, erwartet);
  assert.throws(() => alsTextdatei(k, 'quatsch'), /karten/);
});

test('keine Kästchen, Häkchen oder Namenszeilen in den Textausgaben', () => {
  const verboten = /[☐☒☑✓✔□]|Name\s*:\s*_|Namenszeile|Namensfeld/;
  for (let saat = 1; saat <= 15; saat++) {
    const k = erzeugeKarte({ groesse: 4 + (saat % 5), ort: 'wohnung', anzahlZeichen: saat % 7, rng: zufallsgeber(saat * 3) });
    for (const teil of ['karten', 'loesung']) {
      assert.doesNotMatch(alsTextdatei(k, teil), verboten);
    }
  }
});

test('Zeichen: sechs feste Arten, je mit Kürzel und Artikel, eindeutig und ohne Bilddateien', () => {
  assert.equal(SYMBOLE.length, 6);
  assert.equal(new Set(SYMBOLE.map((s) => s.id)).size, 6);
  assert.equal(new Set(SYMBOLE.map((s) => s.kuerzel)).size, 6);
  for (const s of SYMBOLE) {
    assert.match(s.artikel, /^(der|die|das) /);
    assert.ok(!['S', 'Z', '+', '.'].includes(s.kuerzel), `Kürzel kollidiert mit dem Raster: ${s.kuerzel}`);
    assert.ok(!/http|href|src|url/i.test(JSON.stringify(s)), `externe Verweise in ${s.id}`);
  }
});

test('Gitter 4 bis 8 mit 0 bis 6 Zeichen: die Grundregeln halten für jede Kombination', () => {
  let geprueft = 0;
  for (let groesse = GITTER_MIN; groesse <= GITTER_MAX; groesse++) {
    for (let anzahl = 0; anzahl <= SYMBOLE.length; anzahl++) {
      for (let saat = 1; saat <= 6; saat++) {
        const k = erzeugeKarte({ groesse, ort: 'gruppenraum', anzahlZeichen: anzahl, rng: zufallsgeber(saat * 101 + anzahl * 7 + groesse) });
        geprueft += 1;
        const summe = k.segmente.reduce((s, x) => s + x.schritte, 0);
        assert.equal(summe, k.weg.length - 1, 'die Schritte ergeben nicht die Weglänge');
        assert.equal(k.segmente.filter((x) => x.letzter).length, 1, 'genau ein Abschnitt endet am Ziel');
        assert.equal(k.segmente.at(-1).letzter, true);
        const genannt = k.segmente.filter((x) => x.zeichenArt).length;
        const aufWeg = k.zeichen.filter((z) => k.weg.some((w) => gleich(w, z))).length;
        assert.equal(genannt, aufWeg, 'ein Zeichen auf dem Weg wird nicht genannt');
      }
    }
  }
  assert.equal(geprueft, (GITTER_MAX - GITTER_MIN + 1) * (SYMBOLE.length + 1) * 6);
});
