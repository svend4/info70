import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import * as logik from '../logik.mjs';
import { zeigerWinkel, uhrText, uhrOptionen, pruefeFragen } from '../logik.mjs';
import { kalenderBeziehungen, pruefeKalenderFragen, tageszeitFrage } from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/fragen.json', import.meta.url), 'utf8'));
const appQuelle = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
const elternSeite = await readFile(new URL('../eltern.html', import.meta.url), 'utf8');

test('zeigerWinkel: Stunden- und Minutenzeiger stimmen', () => {
  assert.deepEqual(zeigerWinkel(3, 0), { minute: 0, stunde: 90 });
  assert.deepEqual(zeigerWinkel(6, 30), { minute: 180, stunde: 195 });
  assert.deepEqual(zeigerWinkel(9, 45), { minute: 270, stunde: 292.5 });
  assert.deepEqual(zeigerWinkel(12, 0), { minute: 0, stunde: 0 });
});

test('uhrText: kindgerechte Sprache (voll, halb, Viertel nach/vor)', () => {
  assert.equal(uhrText(3, 0), '3 Uhr');
  assert.equal(uhrText(4, 30), 'halb 5');
  assert.equal(uhrText(2, 15), 'Viertel nach 2');
  assert.equal(uhrText(5, 45), 'Viertel vor 6');
  assert.equal(uhrText(12, 30), 'halb 1', 'Übergang über 12');
  assert.equal(uhrText(12, 0), '12 Uhr');
});

test('Fragenbank gültig: beide Typen, Uhr-Minuten nur 0/15/30/45, Optionen eindeutig', () => {
  assert.deepEqual(pruefeFragen(daten), []);
  assert.ok(daten.fragen.filter((q) => q.typ === 'uhr').length >= 5);
  assert.ok(daten.fragen.filter((q) => q.typ === 'kalender').length >= 5);
});

test('uhrOptionen: erste Option ist die richtige Zeit', () => {
  const q = daten.fragen.find((x) => x.id === 'u03');
  const opt = uhrOptionen(q);
  assert.equal(opt[0], 'halb 5');
  assert.equal(opt.length, 3);
  assert.equal(new Set(opt).size, 3);
});

test('Kalender-Wissen stimmt (Stichproben)', () => {
  const woche = daten.fragen.find((q) => /Tage hat eine Woche/.test(q.frage ?? ''));
  assert.equal(woche.antworten[woche.korrekt], 'Sieben');
  const dienstag = daten.fragen.find((q) => /nach dem Dienstag/.test(q.frage ?? ''));
  assert.equal(dienstag.antworten[dienstag.korrekt], 'Der Mittwoch');
  const jahreszeiten = daten.fragen.find((q) => /Jahreszeiten/.test(q.frage ?? ''));
  assert.equal(jahreszeiten.antworten[jahreszeiten.korrekt], 'Vier');
});

test('pruefeFragen erkennt kaputte Uhr-Frage (Ablenker == richtige Zeit)', () => {
  const kaputt = { fragen: [...daten.fragen, { id: 'x', typ: 'uhr', zeit: { stunde: 3, minute: 0 }, ablenker: [{ stunde: 3, minute: 0 }, { stunde: 5, minute: 0 }], erklaerung: 'Ablenker gleich richtige Zeit – ungültig' }] };
  assert.ok(pruefeFragen(kaputt).some((f) => /klingt wie die richtige/.test(f)));
});

test('Kinder werden nicht bewertet: keine Rang-Funktion, keine Ränge in den Daten, kein Zähler im App-Code', () => {
  assert.equal(logik.rangFuer, undefined, 'logik.mjs hat keine Rang-Funktion mehr');
  assert.ok(!('raenge' in daten), 'die Daten haben keine Rang- oder Punkteschwellen');
  assert.doesNotMatch(appQuelle, /punkte|rangFuer|raenge|von \$\{fragen\.length\} richtig/i, 'app.mjs zählt nichts und zeigt keinen Rang');
  assert.doesNotMatch(appQuelle, /Geschafft|🏆|🌟/, 'kein Geschafft-Titel, kein Pokal, kein Stern');
  assert.match(appQuelle, /Ende der Runde/, 'am Ende steht ein neutraler Titel');
});

test('Speicherregel: speichert die App (setItem), gibt es einen Löschknopf; speichert sie nichts, gibt es keine Karte', () => {
  const speichert = /\.setItem\(/.test(appQuelle);
  const hatKarte = /datenKarte\(|Meine Daten l(ö|oe)schen/.test(appQuelle);
  if (speichert) assert.ok(hatKarte || /removeItem/.test(appQuelle), 'wer speichert, lässt auch löschen');
  else assert.equal(hatKarte, false, 'ohne Speicher keine Karte „Meine Daten löschen“');
  assert.equal(speichert, false, 'diese App speichert nichts');
  assert.doesNotMatch(elternSeite, /Meine Daten l(ö|oe)schen/, 'auch die Eltern-Seite verspricht keinen Löschknopf');
  assert.match(elternSeite, /speichert <strong>nichts<\/strong>/, 'die Eltern-Seite sagt, dass nichts gespeichert wird');
  // Migration (Entscheidung 33а): der alte Rekord-Schlüssel wird beim Start einmal entfernt, in einer eigenen Zeile.
  assert.ok(appQuelle.split('\n').some((z) => z.trim() === "try { localStorage.removeItem('uhr.rekord'); } catch {}"));
});

// Kalenderbeziehungen, Tageszeit-Fragen und die neuen Fragen aus dem Bauauftrag KIN-17.
const BEGRIFFE = [
  { name: 'Sonnenaufgang', beschreibung: 'die Sonne am Morgen aufgeht' },
  { name: 'Sonnenuntergang', beschreibung: 'die Sonne am Abend untergeht' },
  { name: 'Dämmerung', beschreibung: 'es langsam hell oder dunkel wird' },
];

test('kalenderBeziehungen: Tag, Woche, Monat, Jahreszeit und Jahr mit den Zahlen aus S. 233', () => {
  const b = kalenderBeziehungen();
  assert.deepEqual(b.map((e) => `${e.von}-${e.nach}`), ['Tag-Woche', 'Woche-Monat', 'Monat-Jahreszeit', 'Jahreszeit-Jahr']);
  assert.deepEqual(b.map((e) => e.anzahl), [[7], [4, 5], [3], [4]]);
  assert.ok(b.every((e) => e.quelle === 'S. 233'));
});

test('pruefeKalenderFragen: die Fragenbank mit den Beziehungen besteht die Prüfung', () => {
  assert.deepEqual(pruefeKalenderFragen(daten.fragen, kalenderBeziehungen()), []);
});

test('pruefeKalenderFragen: falsche richtige Antworten (eine falsche Zahl, zwei Zahlen) werden abgelehnt', () => {
  const kaputt = { id: 'x', typ: 'kalender', beziehung: 'woche-monat', zahl: 3, antworten: ['Drei', 'Vier', 'Sechs'], korrekt: 0, erklaerung: 'Drei Wochen sind zu wenig für einen Monat.' };
  assert.ok(pruefeKalenderFragen([kaputt], kalenderBeziehungen()).some((f) => /Woche und Monat/.test(f)));
  const zweiZahlen = { id: 'z', typ: 'kalender', beziehung: 'monat-jahreszeit', zahl: 3, quelle: { seite: 'S. 233' }, antworten: ['Drei oder Vier', 'Zwei', 'Zwölf'], korrekt: 0, erklaerung: 'Drei oder vier Monate – die Antwort ist nicht eindeutig.' };
  assert.ok(pruefeKalenderFragen([zweiZahlen], kalenderBeziehungen()).some((f) => /ist nicht 3/.test(f)), 'eine richtige Antwort mit zwei Zahlen ist nicht eindeutig');
});

test('pruefeKalenderFragen: eine Beziehung, die es im Kalender nicht gibt, wird gemeldet', () => {
  const unbekannt = { id: 'y', typ: 'kalender', beziehung: 'tag-jahr', zahl: 365, antworten: ['Drei', 'Vier', 'Sechs'], korrekt: 1, erklaerung: 'Diese Beziehung gibt es im Kalender nicht.' };
  assert.ok(pruefeKalenderFragen([unbekannt], kalenderBeziehungen()).some((f) => /unbekannte Beziehung/.test(f)));
});

test('tageszeitFrage: gleiche Zufallsreihe ergibt dieselbe Frage; die richtige Antwort steht in den Optionen', () => {
  const reihe = [1, 0, 2, 1];
  const a = tageszeitFrage(BEGRIFFE, reihe);
  assert.deepEqual(a, tageszeitFrage(BEGRIFFE, reihe));
  assert.equal(a.richtig, 'Sonnenuntergang');
  assert.match(a.frage, /^Wie heißt es, wenn die Sonne am Abend untergeht\?$/);
  assert.ok(a.optionen.includes(a.richtig));
  assert.equal(new Set(a.optionen).size, 3);
});

test('tageszeitFrage: zu wenige Begriffe oder keine ganzen Zahlen werfen einen Fehler', () => {
  assert.throws(() => tageszeitFrage(BEGRIFFE.slice(0, 2), [0, 0, 0, 0]), RangeError);
  assert.throws(() => tageszeitFrage(BEGRIFFE, [0, 0, 0]), RangeError);
  assert.throws(() => tageszeitFrage(BEGRIFFE, [0.5, 0, 0, 0]), RangeError);
});

test('Tageszeiten: Dämmerung, Sonnenaufgang und Sonnenuntergang sind die richtigen Antworten in der Bank', () => {
  const richtige = daten.fragen.filter((q) => q.antworten).map((q) => q.antworten[q.korrekt]);
  for (const wort of ['Sonnenaufgang', 'Sonnenuntergang', 'Dämmerung']) {
    assert.ok(richtige.some((a) => a.includes(wort)), `${wort} ist in der Bank keine richtige Antwort`);
  }
});

test('Kalender: Monat (4 bis 5 Wochen) und Jahreszeit (3 Monate) sind als Fragen in der Bank', () => {
  const beziehungen = daten.fragen.filter((q) => q.beziehung).map((q) => q.beziehung);
  assert.ok(beziehungen.includes('woche-monat'));
  assert.ok(beziehungen.includes('monat-jahreszeit'));
});

test('pruefeKalenderFragen erkennt falsche Antworten in jeder Schreibweise: Ziffer, Zahlwort, Zusatz, Umlaut, „und“, unsichtbares Zeichen', () => {
  const falsche = ['4', '5', 'fünf', 'Fünf ', 'Fünf Wochen', 'Fu\u0308nf', 'Fuenf', '4 Wochen', 'Drei und Vier', 'Fünf und Sechs', '3 und 4', 'Acht und Vier', 'Drei oder Vier', 'Vi\u200Der', 'Fün\u00ADf', '4½', 'viereinhalb', 'Vierwochen', 'vierwöchig', '\u0664'];
  for (const falsch of falsche) {
    const probe = { id: 'p', typ: 'kalender', beziehung: 'woche-monat', zahl: 4, quelle: { seite: 'S. 233' }, antworten: [falsch, 'Sechs', 'Vier'], korrekt: 2, erklaerung: 'Probe für die Schreibweise.' };
    assert.ok(pruefeKalenderFragen([probe], kalenderBeziehungen()).some((f) => /passt auch zu/.test(f)), `„${falsch}“ wird nicht erkannt`);
  }
  assert.deepEqual(logik.zahlen('vier-und-zwanzig'), [24], 'eine Zusammensetzung mit „und“ ist eine Zahl');
  assert.deepEqual(logik.zahlen('Vierundzwanzig'), [24]);
  assert.deepEqual(logik.zahlen('Drei und Vier'), [3, 4], 'zwei Zahlen mit „und“ sind zwei Zahlen');
  assert.deepEqual(logik.zahlen('Fün\u00ADf Wochen'), [5], 'unsichtbare Zeichen zählen nicht');
  assert.deepEqual(logik.zahlen('Ein Monat'), [], '„ein“ ist ein Artikel');
  assert.deepEqual(logik.zahlen('ein und zwanzig'), [21], 'ein Einer in einer Zusammensetzung zählt');
  assert.deepEqual(logik.zahlen('einundzwanzig'), [21]);
  assert.deepEqual(logik.zahlen('funfzig'), [50]);
  assert.deepEqual(logik.zahlen('siebenzig'), [70]);
  assert.deepEqual(logik.zahlen('zwolf'), [12]);
  assert.deepEqual(logik.zahlen('4½'), [4, 5], 'ein halber Wert zählt als die beiden ganzen Zahlen daneben');
  assert.deepEqual(logik.zahlen('viereinhalb'), [4, 5]);
  assert.deepEqual(logik.zahlen('Vierwochen'), [4], 'eine Zahl, direkt an die Einheit geschrieben');
  assert.deepEqual(logik.zahlen('\u0664'), [4], 'eine Ziffer aus einer anderen Schrift');
  assert.deepEqual(logik.zahlen('dreimal'), [3], 'eine Zahl mit der Einheit „mal“');
  assert.deepEqual(logik.zahlen('siebentägig'), [7], 'eine Zahl mit der Einheit „tägig“');
  assert.deepEqual(logik.zahlen('Viertelstunde'), [], 'Viertel ist keine Vier');
  assert.deepEqual(logik.zahlen('Achtung'), [], 'acht im Wortanfang ist keine Acht');
  assert.deepEqual(logik.zahlen('einsam'), [], 'eins im Wortanfang ist keine Eins');
});

test('pruefeKalenderFragen: eine Kalenderfrage ohne Seitenangabe im Format „S. n“ wird gemeldet; ein eigener Entwurf braucht keine', () => {
  const ohne = { id: 'o', typ: 'kalender', antworten: ['Eins', 'Zwei', 'Drei'], korrekt: 0, erklaerung: 'Eine Frage ohne Quelle.' };
  assert.ok(pruefeKalenderFragen([ohne], kalenderBeziehungen()).some((f) => /Seitenangabe fehlt/.test(f)));
  const falschesFormat = { ...ohne, id: 'o3', quelle: { seite: 'Quelle X' } };
  assert.ok(pruefeKalenderFragen([falschesFormat], kalenderBeziehungen()).some((f) => /Seitenangabe fehlt/.test(f)), 'kein Format „S. n“');
  const eigen = { ...ohne, id: 'o2', eigenentwurf: true };
  assert.deepEqual(pruefeKalenderFragen([eigen], kalenderBeziehungen()), [], 'ein eigener Entwurf stammt aus keiner Seite');
});

test('tageszeitFrage: die Zufallsreihe wählt die Ablenker, jedes Paar ist möglich; negative Zahlen liefern einen gültigen Eintrag', () => {
  const vier = [...BEGRIFFE, { name: 'Mittag', beschreibung: 'die Sonne am höchsten steht' }];
  const a = tageszeitFrage(vier, [0, 0, 0, 0]);
  const b = tageszeitFrage(vier, [0, 1, 0, 0]);
  const ablenker = (x) => x.optionen.filter((o) => o !== x.richtig).sort();
  assert.notDeepEqual(ablenker(a), ablenker(b));
  // Bei fünf und sechs Begriffen sind alle Paare der übrigen möglich: C(4,2) = 6 und C(5,2) = 10.
  for (const n of [5, 6]) {
    const gross = Array.from({ length: n }, (_, i) => ({ name: `B${i}`, beschreibung: `die Beschreibung ${i}` }));
    const moeglich = (n - 1) * (n - 2) / 2;
    const paare = new Set();
    for (let z = 0; z < moeglich; z++) paare.add(ablenker(tageszeitFrage(gross, [0, z, 0, 0])).join('+'));
    assert.equal(paare.size, moeglich, `bei ${n} Begriffen sind alle ${moeglich} Paare der übrigen möglich`);
  }
  const neg = tageszeitFrage(BEGRIFFE, [-1, -2, -3, -4]);
  assert.ok(BEGRIFFE.some((x) => x.name === neg.richtig));
  assert.equal(new Set(neg.optionen).size, 3);
});

test('tageszeitFrage: gleiche Namen oder fehlende Beschreibungen werden abgelehnt', () => {
  assert.throws(() => tageszeitFrage([BEGRIFFE[0], BEGRIFFE[0], BEGRIFFE[2]], [0, 0, 0, 0]), RangeError);
  assert.throws(() => tageszeitFrage([BEGRIFFE[0], { name: 'Leer', beschreibung: '' }, BEGRIFFE[2]], [0, 0, 0, 0]), RangeError);
});
