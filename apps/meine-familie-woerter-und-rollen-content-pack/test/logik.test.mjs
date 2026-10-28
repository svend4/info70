import { test } from 'node:test';
import assert from 'node:assert/strict';
import rollenDatei from '../daten/rollen.json' with { type: 'json' };
import haushaltDatei from '../daten/haushalt.json' with { type: 'json' };
import hoeflichkeitDatei from '../daten/hoeflichkeit.json' with { type: 'json' };
import budgetDatei from '../daten/budget.json' with { type: 'json' };
import texte from '../daten/texte.json' with { type: 'json' };
import {
  FRAGEN_PRO_RUNDE, MAX_PRO_DURCHGANG, MODUL_REIHENFOLGE, OPTIONEN_PRO_FRAGE, PFLICHTFELDER,
  alleKartenIds, beantworteQuizFrage, blattText, druckeKarte, erzeugeQuizFrage, erzeugeRunde, findeKarte, findeModul,
  fragenAnzahlText, gewaehlteKarten, kannDrucken, kartenAnzahlText, kartenPosition, ladeModule, mischen, quellenText,
  rueckmeldungText, startZeilen, umschalten, vermerkZeile, vorlesetextAntwort, vorlesetextFrage, vorlesetextKarte,
  vorlesetextPause, vorlesetextStart, waehleAlle, zufallsIndex,
} from '../logik.mjs';

// Prüft Daten und Logik. Die Regeln der Umgebung (Eingabefelder, Speicherung, Netz, Druckzeichen,
// Namenszeile, Zufall nur in app.mjs, Fokus, Testzahl) stehen in test/regeln.test.mjs.
//
// Die Zitate und Seiten sind in der Bauarbeit maschinell gegen die Textkopie der Quelle geprüft
// (außerhalb des Repos). Dieser Test prüft, dass die Daten dem entsprechen, was dort geprüft wurde.

const DATEIEN = [rollenDatei, haushaltDatei, hoeflichkeitDatei, budgetDatei];
const alleModule = ladeModule(DATEIEN);
const alleKarten = alleModule.flatMap((m) => m.karten);
const rollen = findeModul(alleModule, 'rollen').karten;

const ROLLEN_REIHENFOLGE = ['rolle-sohn', 'rolle-tochter', 'rolle-enkel', 'rolle-schwester', 'rolle-bruder', 'rolle-neffe'];

// Die Begriffe der Quelle je Karte, wörtlich aus S. 117 (und S. 103 für das Blumengießen), je höchstens sechs Wörter.
const ZITATE = {
  'rolle-sohn': ['S. 117', 'сын, дочь, внук'],
  'rolle-tochter': ['S. 117', 'сын, дочь, внук'],
  'rolle-enkel': ['S. 117', 'сын, дочь, внук'],
  'rolle-schwester': ['S. 117', 'сестра, брат, племянник'],
  'rolle-bruder': ['S. 117', 'сестра, брат, племянник'],
  'rolle-neffe': ['S. 117', 'сестра, брат, племянник'],
  'haushalt-alle-helfen': ['S. 117', 'распределении домашнего труда'],
  'haushalt-aufraeumen': ['S. 117', 'домашнем труде'],
  'haushalt-tisch-decken': ['S. 117', 'домашнем труде'],
  'haushalt-blumen-giessen': ['S. 103', 'полить цветы'],
  'hoeflichkeit-danke': ['S. 117', 'благодарить'],
  'hoeflichkeit-entschuldigung': ['S. 117', 'просить прощения'],
  'hoeflichkeit-mitfuehlen': ['S. 117', 'высказывать сочувствие'],
  'hoeflichkeit-toll-finden': ['S. 117', 'восхищение'],
  'budget-brauchen-wuenschen': ['S. 117', 'семейном бюджете'],
  'budget-sparen': ['S. 117', 'семейном бюджете'],
  'budget-sorgsam': ['S. 117', 'бережливым'],
};

// Eine feste Zufallsfolge: liefert die Werte der Reihe nach und beginnt dann von vorn.
const folge = (werte) => {
  let i = 0;
  return () => werte[i++ % werte.length];
};

// Ein Zufall, der bei jedem Aufruf um einen festen Schritt weiterläuft; mit verschiedenen Schritten ergeben sich viele Ziehungen.
const lauf = (schritt, start = 0) => {
  let x = start;
  return () => {
    x = (x + schritt) % 1;
    return x;
  };
};

const SCHRITTE = [0.0137, 0.0731, 0.1111, 0.2718, 0.3141, 0.4142, 0.5772, 0.6180, 0.7071, 0.8660, 0.9301];
const kopie = (daten) => structuredClone(daten);

test('Daten: vier Module in der Reihenfolge des Startbildschirms, 17 Karten, Kennungen eindeutig', () => {
  assert.deepEqual(MODUL_REIHENFOLGE, ['rollen', 'haushalt', 'hoeflichkeit', 'budget']);
  assert.deepEqual(alleModule.map((m) => m.id), MODUL_REIHENFOLGE);
  assert.deepEqual(alleModule.map((m) => m.titel), ['Rollen', 'Haushalt', 'Höflichkeit', 'Familienbudget']);
  assert.deepEqual(alleModule.map((m) => m.karten.length), [6, 4, 4, 3]);
  assert.equal(alleKarten.length, 17);
  assert.equal(new Set(alleKarten.map((k) => k.id)).size, 17, 'doppelte Kennungen');
});

test('Rollen: genau die sechs Rollen der Quelle (Sohn, Tochter, Enkel, Schwester, Bruder, Neffe), je eine Karte in dieser Reihenfolge', () => {
  assert.deepEqual(rollen.map((k) => k.id), ROLLEN_REIHENFOLGE);
  assert.deepEqual(rollen.map((k) => k.titel), ['Sohn', 'Tochter', 'Enkel', 'Schwester', 'Bruder', 'Neffe']);
  assert.ok(!alleKarten.some((k) => /^Nichte$|^Tante$|^Onkel$|^Oma$|^Opa$/.test(k.titel)), 'eine Rolle, die die Quelle auf S. 117 nicht nennt, steht als eigene Karte da');
});

test('Pflichtfelder: id, titel, modul, erklaerung; das Modul stimmt mit der Datei überein; Rollen tragen eine Frage', () => {
  assert.deepEqual(PFLICHTFELDER, ['id', 'titel', 'modul', 'erklaerung']);
  for (const m of alleModule) {
    for (const k of m.karten) {
      for (const feld of PFLICHTFELDER) {
        assert.ok(typeof k[feld] === 'string' && k[feld].trim() !== '', `${k.id}: ${feld} fehlt`);
      }
      assert.equal(k.modul, m.id, `${k.id}: Modul weicht ab`);
      assert.ok(k.gespraech && k.gespraech.endsWith('?'), `${k.id}: der Gesprächsimpuls soll eine Frage sein`);
    }
  }
  for (const k of rollen) assert.ok(k.frage && k.frage.endsWith('?'), `${k.id}: die Rollenfrage fehlt`);
});

test('Quelle je Karte: Seite S. 117 (Blumen gießen: S. 103) oder Eigenentwurf; alle Texte sind als Eigenentwurf gekennzeichnet', () => {
  for (const k of alleKarten) {
    assert.ok(k.quelle?.seite || k.eigenentwurf === true, `${k.id}: weder Seite noch Eigenentwurf`);
    assert.equal(k.eigenentwurf, true, `${k.id}: der Text ist Eigenentwurf und trägt die Kennung`);
    assert.match(k.vermerk, /^\(Eigenentwurf(, fachlich nicht geprüft)?\)$/, `${k.id}: Vermerk`);
  }
  const mit103 = alleKarten.filter((k) => k.quelle.seite === 'S. 103').map((k) => k.id);
  assert.deepEqual(mit103, ['haushalt-blumen-giessen']);
  assert.ok(alleKarten.filter((k) => k.quelle.seite !== 'S. 103').every((k) => k.quelle.seite === 'S. 117'));
});

test('Zitate: je Karte genau der geprüfte Begriff der Quelle mit Seite, höchstens sechs Wörter', () => {
  assert.deepEqual(alleKarten.map((k) => k.id).sort(), Object.keys(ZITATE).sort());
  for (const k of alleKarten) {
    assert.deepEqual([k.quelle.seite, k.quelle.begriff], ZITATE[k.id], `${k.id}: Zitat weicht von der geprüften Fassung ab`);
    const woerter = k.quelle.begriff.trim().split(/\s+/).length;
    assert.ok(woerter <= 6, `${k.id}: „${k.quelle.begriff}“ hat ${woerter} Wörter`);
  }
});

test('ladeModule lehnt einen Eintrag ohne Quelle und ohne Eigenentwurf-Kennung ab, nimmt jeden der beiden Wege an', () => {
  const ohne = kopie(DATEIEN);
  delete ohne[1].karten[0].quelle;
  delete ohne[1].karten[0].eigenentwurf;
  assert.throws(() => ladeModule(ohne), /weder quelle\.seite noch eigenentwurf/);
  const nurEigen = kopie(DATEIEN);
  delete nurEigen[1].karten[0].quelle;
  assert.equal(ladeModule(nurEigen)[1].karten[0].id, 'haushalt-alle-helfen');
  const nurSeite = kopie(DATEIEN);
  delete nurSeite[1].karten[0].eigenentwurf;
  assert.equal(ladeModule(nurSeite)[1].karten[0].id, 'haushalt-alle-helfen');
  const leereSeite = kopie(DATEIEN);
  leereSeite[1].karten[0].quelle = { seite: '  ' };
  delete leereSeite[1].karten[0].eigenentwurf;
  assert.throws(() => ladeModule(leereSeite), /Seitenangabe|weder/);
});

test('ladeModule lehnt fehlende Pflichtfelder, doppelte Kennungen, falsches oder fehlendes Modul und falsche Seitenform ab', () => {
  for (const feld of ['id', 'titel', 'modul', 'erklaerung']) {
    const d = kopie(DATEIEN);
    delete d[2].karten[1][feld];
    assert.throws(() => ladeModule(d), new RegExp(`${feld} fehlt|Modul`), `Feld ${feld}`);
  }
  const doppelt = kopie(DATEIEN);
  doppelt[3].karten[1].id = doppelt[3].karten[0].id;
  assert.throws(() => ladeModule(doppelt), /Kennung doppelt/);
  const falschesModul = kopie(DATEIEN);
  falschesModul[1].karten[0].modul = 'rollen';
  assert.throws(() => ladeModule(falschesModul), /gehört nicht in die Datei/);
  assert.throws(() => ladeModule(DATEIEN.slice(0, 3)), /Modul fehlt: budget/);
  assert.throws(() => ladeModule([...DATEIEN, DATEIEN[0]]), /Modul doppelt/);
  const unbekannt = kopie(DATEIEN);
  unbekannt[0].modul = 'schule';
  assert.throws(() => ladeModule(unbekannt), /unbekanntes Modul/);
  const seite = kopie(DATEIEN);
  seite[0].karten[0].quelle.seite = '117';
  assert.throws(() => ladeModule(seite), /Form/);
  const ohneFrage = kopie(DATEIEN);
  delete ohneFrage[0].karten[2].frage;
  assert.throws(() => ladeModule(ohneFrage), /frage fehlt/);
  assert.throws(() => ladeModule({}), TypeError);
});

test('ladeModule: die Reihenfolge der Eingabe ist gleich, das Ergebnis folgt dem Startbildschirm, die Eingabe bleibt unverändert', () => {
  const eingabe = kopie([budgetDatei, hoeflichkeitDatei, rollenDatei, haushaltDatei]);
  const vorher = JSON.stringify(eingabe);
  const geladen = ladeModule(eingabe);
  assert.deepEqual(geladen.map((m) => m.id), MODUL_REIHENFOLGE);
  assert.equal(JSON.stringify(eingabe), vorher, 'die Eingabe wurde verändert');
  geladen[0].karten[0].titel = 'verändert';
  assert.equal(eingabe[2].karten[0].titel, 'Sohn', 'das Ergebnis teilt Karten mit der Eingabe');
});

test('Startbildschirm: je Modul Titel und Anzahl der Karten; die Anzahl steht als neutraler Text', () => {
  assert.deepEqual(startZeilen(alleModule).map((z) => [z.id, z.titel, z.anzahl, z.anzahlText]), [
    ['rollen', 'Rollen', 6, '6 Karten'],
    ['haushalt', 'Haushalt', 4, '4 Karten'],
    ['hoeflichkeit', 'Höflichkeit', 4, '4 Karten'],
    ['budget', 'Familienbudget', 3, '3 Karten'],
  ]);
  assert.equal(kartenAnzahlText(1), '1 Karte');
  assert.equal(kartenAnzahlText(0), '0 Karten');
  // Der Eintrag für die Runde Fragen steht neben den Themen; seine Zahl ist die der Runde, neutral als Text.
  assert.equal(fragenAnzahlText(FRAGEN_PRO_RUNDE), '6 Fragen');
  assert.equal(fragenAnzahlText(1), '1 Frage');
  assert.equal(texte.start.fragen, 'Fragen zu den Rollen');
  assert.equal(findeModul(alleModule, 'budget').titel, 'Familienbudget');
  assert.equal(findeModul(alleModule, 'gibtsnicht'), undefined);
  assert.equal(findeKarte(alleModule, 'budget-sparen').titel, 'Sparen');
  assert.deepEqual(kartenPosition(findeModul(alleModule, 'rollen'), 0), { nummer: 1, gesamt: 6, erste: true, letzte: false });
  assert.deepEqual(kartenPosition(findeModul(alleModule, 'budget'), 2), { nummer: 3, gesamt: 3, erste: false, letzte: true });
});

test('Sitzungsgrenze: höchstens sechs Karten je Reihe und sechs Fragen je Runde, zwei Antworten je Frage', () => {
  assert.equal(MAX_PRO_DURCHGANG, 6);
  assert.equal(FRAGEN_PRO_RUNDE, 6);
  assert.equal(OPTIONEN_PRO_FRAGE, 2);
  for (const m of alleModule) assert.ok(m.karten.length <= MAX_PRO_DURCHGANG, `${m.id}: mehr als ${MAX_PRO_DURCHGANG} Karten`);
  assert.ok(FRAGEN_PRO_RUNDE <= MAX_PRO_DURCHGANG);
  assert.ok(FRAGEN_PRO_RUNDE <= rollen.length, 'mehr Fragen je Runde als Rollen');
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

test('mischen: erhält alle Einträge, verändert das Original nicht, gleicher Zufall ergibt dieselbe Reihenfolge', () => {
  const original = ['a', 'b', 'c', 'd', 'e', 'f'];
  for (const schritt of SCHRITTE) {
    const gemischt = mischen(original, lauf(schritt));
    assert.deepEqual([...gemischt].sort(), original, `Schritt ${schritt}: Einträge gingen verloren`);
    assert.deepEqual(mischen(original, lauf(schritt)), gemischt, 'derselbe Zufall muss dieselbe Reihenfolge liefern');
  }
  assert.deepEqual(original, ['a', 'b', 'c', 'd', 'e', 'f']);
  assert.deepEqual(mischen([], () => 0), []);
  assert.deepEqual(mischen(['x'], () => 0.7), ['x']);
  assert.ok(SCHRITTE.some((s) => mischen(original, lauf(s)).join('') !== original.join('')), 'es wird nie umgestellt');
});

test('Rollenfrage mit fester Zufallsfolge: erwartete Rolle, erwartete andere Antwort, erwartete Reihenfolge', () => {
  const erste = erzeugeQuizFrage(rollen, folge([0, 0, 0]));
  assert.equal(erste.id, 'rolle-sohn');
  assert.deepEqual(erste.optionen.map((o) => o.id), ['rolle-tochter', 'rolle-sohn']);
  assert.equal(erste.richtig, 'rolle-sohn');
  assert.equal(erste.titel, 'Sohn');
  assert.equal(erste.frage, rollen[0].frage);
  assert.equal(erste.erklaerung, rollen[0].erklaerung);
  assert.deepEqual(erste.optionen[0], { id: 'rolle-tochter', titel: 'Tochter' });
  const letzte = erzeugeQuizFrage(rollen, folge([0.99, 0.99, 0.99]));
  assert.equal(letzte.id, 'rolle-neffe');
  assert.deepEqual(letzte.optionen.map((o) => o.id), ['rolle-neffe', 'rolle-bruder']);
  const gleich = erzeugeQuizFrage(rollen, folge([0.2, 0.6, 0.4]));
  assert.deepEqual(erzeugeQuizFrage(rollen, folge([0.2, 0.6, 0.4])), gleich, 'derselbe Zufall muss dieselbe Frage liefern');
});

test('Rollenfrage: genau eine richtige Antwort, die anderen sind verschiedene Rollen ungleich der richtigen', () => {
  for (const schritt of SCHRITTE) {
    for (const start of [0, 0.25, 0.5, 0.75]) {
      for (const anzahl of [2, 3, 4, 6]) {
        const f = erzeugeQuizFrage(rollen, lauf(schritt, start), { anzahlOptionen: anzahl });
        const ids = f.optionen.map((o) => o.id);
        assert.equal(ids.length, anzahl);
        assert.equal(new Set(ids).size, anzahl, 'doppelte Antwort');
        assert.equal(ids.filter((id) => id === f.richtig).length, 1, 'nicht genau eine richtige Antwort');
        assert.ok(ids.every((id) => ROLLEN_REIHENFOLGE.includes(id)), 'Antwort ohne Rolle');
        assert.deepEqual(f.optionen.map((o) => o.titel), ids.map((id) => rollen.find((r) => r.id === id).titel));
      }
    }
  }
});

test('Rollenfrage: Voreinstellung zwei Antworten (Abschnitt 3 des Bauauftrags), vier Antworten mit drei anderen Rollen wie im Pseudocode', () => {
  assert.equal(erzeugeQuizFrage(rollen, lauf(0.31)).optionen.length, 2);
  const vier = erzeugeQuizFrage(rollen, lauf(0.31), { anzahlOptionen: 4 });
  assert.equal(vier.optionen.length, 4);
  assert.equal(vier.optionen.filter((o) => o.id !== vier.richtig).length, 3);
  assert.throws(() => erzeugeQuizFrage(rollen, lauf(0.3), { anzahlOptionen: 1 }), RangeError);
  assert.throws(() => erzeugeQuizFrage(rollen, lauf(0.3), { anzahlOptionen: 7 }), RangeError);
  assert.throws(() => erzeugeQuizFrage(rollen, lauf(0.3), { ausgeschlossen: ROLLEN_REIHENFOLGE }), RangeError);
  assert.throws(() => erzeugeQuizFrage(rollen, undefined), TypeError);
});

test('Anti-Muster: jede Rolle ist mindestens einmal die richtige Antwort und einmal ein falsches Angebot; der Platz der richtigen Antwort wechselt', () => {
  const alsRichtige = new Set();
  const alsAngebot = new Set();
  const plaetze = new Set();
  let laengste = 0;
  let kuerzeste = 0;
  let faelle = 0;
  for (const schritt of SCHRITTE) {
    for (const start of [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]) {
      const f = erzeugeQuizFrage(rollen, lauf(schritt, start));
      alsRichtige.add(f.richtig);
      for (const o of f.optionen.filter((x) => x.id !== f.richtig)) alsAngebot.add(o.id);
      plaetze.add(f.optionen.findIndex((o) => o.id === f.richtig));
      const richtigeLaenge = f.titel.length;
      const andere = f.optionen.filter((o) => o.id !== f.richtig).map((o) => o.titel.length);
      faelle += 1;
      if (andere.every((l) => richtigeLaenge > l)) laengste += 1;
      if (andere.every((l) => richtigeLaenge < l)) kuerzeste += 1;
    }
  }
  assert.deepEqual([...alsRichtige].sort(), [...ROLLEN_REIHENFOLGE].sort(), 'nicht jede Rolle war einmal die richtige Antwort');
  assert.deepEqual([...alsAngebot].sort(), [...ROLLEN_REIHENFOLGE].sort(), 'nicht jede Rolle war einmal ein falsches Angebot');
  assert.deepEqual([...plaetze].sort(), [0, 1], 'die richtige Antwort steht immer auf demselben Platz');
  assert.ok(laengste > 0 && laengste < faelle, 'die richtige Antwort ist immer oder nie die längste');
  assert.ok(kuerzeste > 0 && kuerzeste < faelle, 'die richtige Antwort ist immer oder nie die kürzeste');
});

test('Runde: sechs Fragen, jede Rolle höchstens einmal, in wechselnder Reihenfolge; ungültige Anzahl wirft', () => {
  const reihenfolgen = new Set();
  for (const schritt of SCHRITTE) {
    const runde = erzeugeRunde(rollen, lauf(schritt));
    assert.equal(runde.length, FRAGEN_PRO_RUNDE);
    assert.deepEqual(runde.map((f) => f.id).sort(), [...ROLLEN_REIHENFOLGE].sort(), 'jede Rolle genau einmal');
    for (const f of runde) assert.equal(f.optionen.length, 2);
    reihenfolgen.add(runde.map((f) => f.id).join());
  }
  assert.ok(reihenfolgen.size > 1, 'die Reihenfolge der Runde ist immer dieselbe');
  assert.equal(erzeugeRunde(rollen, lauf(0.3), 3).length, 3);
  assert.deepEqual(erzeugeRunde(rollen, lauf(0.3)), erzeugeRunde(rollen, lauf(0.3)), 'derselbe Zufall muss dieselbe Runde liefern');
  assert.throws(() => erzeugeRunde(rollen, lauf(0.3), 7), RangeError);
  assert.throws(() => erzeugeRunde(rollen, lauf(0.3), 0), RangeError);
});

test('Antwort: nur richtig und erklaerung, kein Zähler, keine Reihung; eine fremde Antwort wirft', () => {
  const frage = erzeugeQuizFrage(rollen, folge([0, 0, 0]));
  const getroffen = beantworteQuizFrage(frage, 'rolle-sohn');
  assert.deepEqual(Object.keys(getroffen).sort(), ['erklaerung', 'richtig']);
  assert.equal(getroffen.richtig, true);
  assert.equal(getroffen.erklaerung, rollen[0].erklaerung);
  const anderes = beantworteQuizFrage(frage, 'rolle-tochter');
  assert.deepEqual(anderes, { richtig: false, erklaerung: rollen[0].erklaerung });
  assert.deepEqual(Object.keys(anderes).sort(), ['erklaerung', 'richtig']);
  assert.throws(() => beantworteQuizFrage(frage, 'rolle-neffe'), /gehört nicht zur Frage/);
  const vorher = JSON.stringify(frage);
  beantworteQuizFrage(frage, 'rolle-tochter');
  assert.equal(JSON.stringify(frage), vorher, 'die Frage wurde durch die Antwort verändert');
});

test('Rückmeldung: ruhig und ohne Urteil über das Kind; bei einer anderen Wahl nennt sie das passende Wort', () => {
  const frage = erzeugeQuizFrage(rollen, folge([0, 0, 0]));
  const passt = rueckmeldungText(frage, beantworteQuizFrage(frage, 'rolle-sohn'), texte);
  const hier = rueckmeldungText(frage, beantworteQuizFrage(frage, 'rolle-tochter'), texte);
  assert.equal(passt, 'Ja, das passt.');
  assert.equal(hier, 'Schau mal: Hier passt das Wort Sohn.');
  for (const text of [passt, hier, texte.rueckmeldung.passt, texte.rueckmeldung.hier]) {
    assert.ok(!/falsch|leider|Fehler|nicht ganz|schade|nochmal|richtig|gut gemacht|super|bravo/i.test(text), `Urteil in: ${text}`);
  }
});

test('Vorlesetexte: Karte, Frage, Antwort, Start und Pause sind vollständig und ohne Reste wie undefined', () => {
  const frage = erzeugeQuizFrage(rollen, folge([0.5, 0.5, 0.5]));
  const ergebnis = beantworteQuizFrage(frage, frage.optionen[0].id);
  const alle = [
    ...alleKarten.map(vorlesetextKarte),
    vorlesetextFrage(frage),
    vorlesetextAntwort(frage, ergebnis, texte),
    vorlesetextStart(alleModule, texte),
    ...alleModule.map((m) => vorlesetextPause(m.schluss, texte)),
  ];
  for (const t of alle) assert.ok(t.length > 10 && !/undefined|null|\[object|NaN/.test(t), `Rest im Text: ${t}`);
  assert.equal(vorlesetextKarte(rollen[1]), 'Tochter. Ein Mädchen ist für ihre Mama oder ihren Papa die Tochter.');
  assert.equal(vorlesetextFrage(erzeugeQuizFrage(rollen, folge([0, 0, 0]))), 'Was ist ein Junge für seine Mama oder seinen Papa? Tochter oder Sohn?');
  assert.match(vorlesetextStart(alleModule, texte), /Rollen, Haushalt, Höflichkeit, Familienbudget oder Fragen zu den Rollen\.$/);
  assert.match(vorlesetextPause(alleModule[0].schluss, texte), /^Bildschirm aus\. /);
});

test('Quellenzeile: wo eine Seite steht, steht auch die Marke; jede Karte nennt, dass der Text Eigenentwurf ist', () => {
  for (const k of alleKarten) {
    const zeile = quellenText(k, texte.seitenmarke);
    assert.ok(/S\. \d+/.test(zeile), `${k.id}: keine Seite`);
    assert.ok(zeile.includes('Seitenangaben nicht von einem Menschen geprüft.'), `${k.id}: Seite ohne Marke`);
    assert.ok(zeile.includes(`„${k.quelle.begriff}“`), `${k.id}: Begriff fehlt`);
    assert.ok(zeile.endsWith(vermerkZeile(k)), `${k.id}: Vermerk fehlt`);
  }
  const ohneSeite = { id: 'x', titel: 'X', modul: 'haushalt', erklaerung: 'Ein Satz.', eigenentwurf: true };
  assert.equal(quellenText(ohneSeite, texte.seitenmarke), 'Text der Karte (Eigenentwurf).');
  assert.ok(!/S\. \d+/.test(quellenText(ohneSeite, texte.seitenmarke)));
  assert.equal(vermerkZeile(rollen[0], 'Frage'), 'Text der Frage (Eigenentwurf).');
  assert.match(quellenText(findeKarte(alleModule, 'budget-sparen'), texte.seitenmarke), /Text der Karte \(Eigenentwurf, fachlich nicht geprüft\)\.$/);
});

test('Auswahl: umschalten ändert nur die neue Menge, alle wählen, Reihenfolge fest, Unbekanntes ignoriert, n Auswahl ergibt n Karten', () => {
  const start = new Set(['rolle-sohn', 'budget-sparen']);
  const ohneSohn = umschalten(start, 'rolle-sohn');
  assert.equal(ohneSohn.has('rolle-sohn'), false);
  assert.equal(start.has('rolle-sohn'), true, 'das Original darf nicht verändert werden');
  assert.equal(umschalten(ohneSohn, 'rolle-sohn').has('rolle-sohn'), true);
  const gewaehlt = gewaehlteKarten(alleModule, ['budget-sparen', 'rolle-neffe', 'unbekannt', 'budget-sparen', 'haushalt-aufraeumen']);
  assert.deepEqual(gewaehlt.map((x) => x.karte.id), ['rolle-neffe', 'haushalt-aufraeumen', 'budget-sparen']);
  assert.deepEqual(gewaehlt.map((x) => x.modul.id), ['rollen', 'haushalt', 'budget']);
  const alle = alleKartenIds(alleModule);
  assert.equal(alle.length, 17);
  for (let n = 0; n <= alle.length; n++) {
    assert.equal(gewaehlteKarten(alleModule, alle.slice(0, n)).length, n, `bei ${n} gewählten Karten`);
  }
  assert.equal(waehleAlle(alleModule).size, 17);
  assert.equal(gewaehlteKarten(alleModule, waehleAlle(alleModule)).length, 17);
  assert.equal(kannDrucken(gewaehlteKarten(alleModule, [])), false, 'ohne Auswahl darf nicht gedruckt werden');
  assert.equal(kannDrucken(gewaehlteKarten(alleModule, ['rolle-sohn'])), true);
});

test('Blatt: Kopf, Titel, ein Satz und Vermerk; keine Seitenzahl, keine Namenszeile, keine Tagesfelder, keine Marke', () => {
  for (const m of alleModule) {
    for (const k of m.karten) {
      const blatt = druckeKarte(k, m.titel);
      assert.deepEqual(Object.keys(blatt), ['kopf', 'titel', 'satz', 'vermerk']);
      assert.equal(blatt.kopf, `Meine Familie: ${m.titel}`);
      assert.equal(blatt.titel, k.titel);
      assert.equal(blatt.satz, k.erklaerung);
      assert.equal(blatt.vermerk, vermerkZeile(k));
      const text = blattText(blatt);
      assert.ok(!/S\. ?\d|Seite \d|стр/.test(text), `${k.id}: Seitenangabe auf dem Blatt`);
      assert.ok(!/Name|Datum|Wochentag|Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag|Sonntag|\bTage?\b|_{3,}|…{2,}/.test(text), `${k.id}: Namenszeile oder Tagesfeld`);
      assert.ok(!/Menschen geprüft/.test(text), `${k.id}: die Marke gehört nicht aufs Blatt, es steht dort keine Seite`);
      assert.ok(!/undefined|null|\[object/.test(text), `${k.id}: Rest im Text`);
    }
  }
  assert.equal(druckeKarte(rollen[0]).kopf, 'Meine Familie');
});

test('Blatt weist Zeichen aus der Sperrliste, Emojis und Seitenangaben ab', () => {
  const basis = { id: 'x', titel: 'Titel', modul: 'haushalt', erklaerung: 'Ein Satz.', eigenentwurf: true };
  for (const zeichen of ['\u{2610}', '\u{2611}', '\u{2612}', '\u{2713}', '\u{2714}', '\u{2605}', '\u{2606}', '\u{1F600}', '\u{1F31F}', '\u{2B50}']) {
    assert.throws(() => druckeKarte({ ...basis, erklaerung: `Ein Satz ${zeichen}.` }, 'Haushalt'), /Zeichen/, `U+${zeichen.codePointAt(0).toString(16)}`);
    assert.throws(() => druckeKarte({ ...basis, titel: `Titel ${zeichen}` }, 'Haushalt'), /Zeichen/);
  }
  assert.throws(() => druckeKarte({ ...basis, erklaerung: 'Siehe S. 117.' }, 'Haushalt'), /Seitenangabe/);
  assert.doesNotThrow(() => druckeKarte(basis, 'Haushalt'));
});

test('Sätze: jede Karte hat genau einen Satz, die Rollenfrage genau eine Frage; kurz genug zum Vorlesen', () => {
  const saetze = (text) => (text.match(/[.!?](?=\s|$)/g) ?? []).length;
  for (const k of alleKarten) {
    assert.equal(saetze(k.erklaerung), 1, `${k.id}: nicht genau ein Satz: ${k.erklaerung}`);
    assert.match(k.erklaerung, /^[A-ZÄÖÜ].*\.$/, `${k.id}: Satz beginnt oder endet falsch`);
    assert.ok(k.erklaerung.split(/\s+/).length <= 25, `${k.id}: Satz zu lang`);
    assert.ok(k.erklaerung.length <= 120, `${k.id}: Satz zu lang`);
    assert.ok(!/ {2}/.test(k.erklaerung + k.titel + k.gespraech), `${k.id}: doppeltes Leerzeichen`);
  }
  for (const k of rollen) {
    assert.ok(saetze(k.frage) <= 2 && k.frage.endsWith('?'), `${k.id}: Frage`);
    assert.ok(!k.frage.includes(k.titel), `${k.id}: die Frage nennt schon die Antwort`);
  }
});

test('Rollenfragen eindeutig: jede Frage nennt die Beziehung, damit keine falsche Antwort auch zutrifft', () => {
  const erwartet = {
    'rolle-sohn': /Junge für seine Mama oder seinen Papa/,
    'rolle-tochter': /Mädchen für ihre Mama oder ihren Papa/,
    'rolle-enkel': /Kind für seine Oma oder seinen Opa/,
    'rolle-schwester': /Mädchen für das andere Kind/,
    'rolle-bruder': /Junge für das andere Kind/,
    'rolle-neffe': /Junge für seine Tante oder seinen Onkel/,
  };
  for (const k of rollen) assert.match(k.frage, erwartet[k.id], `${k.id}: Beziehung fehlt in der Frage`);
});

test('Inhalt Familienvielfalt: kein Bild einer Familie mit zwei Eltern, keine Vergleiche von Kindern oder Familien', () => {
  for (const k of alleKarten) {
    const text = [k.titel, k.erklaerung, k.frage ?? '', k.gespraech].join(' ');
    assert.ok(!/Mama und Papa|Mutter und Vater|Vater und Mutter|beide Eltern|deine Eltern|die Eltern(?! von)/.test(text), `${k.id}: setzt zwei Eltern voraus`);
    assert.ok(!/besser|schlechter|mehr als|weniger als|alle Kinder|jedes Kind hat|normal|richtige Familie|echte Familie|wie bei/i.test(text), `${k.id}: Vergleich oder Norm`);
  }
  assert.ok(rollen.every((k) => / oder /.test(k.erklaerung)), 'eine Rollenkarte sagt nicht „… oder …“ und nennt dann nur eine feste Besetzung');
});

test('Inhalt Haushalt, Höflichkeit und Familienbudget: ohne Geschlecht der Aufgabe, ohne Gefahren, Beträge, Preise und Marken', () => {
  const andere = alleModule.filter((m) => m.id !== 'rollen');
  const gefahr = /Messer|Herd|Backofen|Ofen|Bügeleisen|Reinigungsmittel|Putzmittel|Leiter|Steckdose|heiß|Feuer|Kerze|Schere|Staubsauger|Waschmaschine|kochen|Fenster/i;
  for (const m of andere) {
    for (const k of m.karten) {
      const text = [k.titel, k.erklaerung, k.gespraech].join(' ');
      assert.ok(!/Mama|Papa|Mutter|Vater|Frau|Mann|Junge|Mädchen|Tochter|Sohn|Oma|Opa|Bruder|Schwester/.test(text), `${k.id}: Aufgabe nach Geschlecht oder Rolle verteilt`);
      assert.ok(!gefahr.test(text), `${k.id}: Gefahr im Alltag eines Kindes von 3 bis 5`);
      assert.ok(!/\d|€|\b(Euro|Cent|Preis|teuer|billig|arm|reich|kaufen|Taschengeld|Sparschwein|Marke|Handy)\b/i.test(text), `${k.id}: Betrag, Preis oder Produkt`);
    }
    for (const idee of m.schluss.ideen) {
      assert.ok(!gefahr.test(idee) && !/\d|€|Euro|kaufen/i.test(idee), `${m.id}: Idee mit Gefahr oder Betrag: ${idee}`);
    }
  }
});

test('Familienbudget: jede Karte und die Pause tragen den Vermerk „Eigenentwurf, fachlich nicht geprüft“, die anderen Themen „Eigenentwurf“', () => {
  const budget = findeModul(alleModule, 'budget');
  for (const k of budget.karten) assert.equal(k.vermerk, '(Eigenentwurf, fachlich nicht geprüft)', k.id);
  assert.equal(budget.schluss.vermerk, '(Eigenentwurf, fachlich nicht geprüft)');
  for (const m of alleModule.filter((x) => x.id !== 'budget')) {
    for (const k of m.karten) assert.equal(k.vermerk, '(Eigenentwurf)', k.id);
    assert.equal(m.schluss.vermerk, '(Eigenentwurf)', m.id);
  }
});

test('Pause: je Thema mindestens drei Ideen ohne Bildschirm, jede ein Satz im Plural „ihr“, Titel und Hinweise vollständig', () => {
  for (const m of alleModule) {
    assert.ok(m.schluss.ideen.length >= 3, `${m.id}: weniger als drei Ideen`);
    for (const idee of m.schluss.ideen) {
      assert.match(idee, /^[A-ZÄÖÜ].*[.]$/, `${m.id}: ${idee}`);
      assert.ok(/\b(ihr|euch|euer|eure)\b|^(Spielt|Malt|Sucht|Räumt|Gießt|Deckt|Überlegt|Erzählt|Sprecht)/.test(idee), `${m.id}: Idee ohne Ansprache an beide: ${idee}`);
      assert.ok(!/Bildschirm|Tablet|Handy|App|Video|Internet|Film|Fernseher/i.test(idee), `${m.id}: Idee mit Bildschirm: ${idee}`);
    }
  }
  assert.equal(texte.pause.ueberschrift, 'Bildschirm aus');
  assert.ok(texte.hinweise.length >= 7 && texte.hinweise.every((h) => h.trim().length > 20));
});
