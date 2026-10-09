import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  REGISTER, REGISTER_MIT_DEMENTI, REGISTER_MIT_SPRACHGRUND, REGISTER_MIT_RATEN,
  WIRKVERSPRECHEN, PRUEFUNG, UEBUNG_AM_MUND,
  spielVon, spieleIm, registerMitSpielen, spielText, pruefeDaten,
} from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/kartei.json', import.meta.url), 'utf8'));
const kopie = () => JSON.parse(JSON.stringify(daten));
const app = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
const code = app.replace(/^\s*\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
const druck = await readFile(new URL('../druck.css', import.meta.url), 'utf8');
const druckRegeln = druck.replace(/\/\*[\s\S]*?\*\//g, '');
const seite = await readFile(new URL('../index.html', import.meta.url), 'utf8');

test('Daten sind gültig', () => {
  assert.deepEqual(pruefeDaten(daten), []);
  assert.ok(daten.spiele.length >= 9);
});

test('das Versprechen der Quelle ist zurückgenommen – wörtlich', () => {
  // Die Quelle wollte „Grundlagen der Artikulation" aus Pusten und
  // Lippenlecken. Für das Deutsche steht dem eine Empfehlung in der
  // stärksten Negativform entgegen.
  assert.match(daten.keinTrainingsversprechen, /verspricht keine bessere Aussprache/);
  assert.match(daten.keinTrainingsversprechen, /sollen nicht angewendet werden/);
  assert.match(daten.keinTrainingsversprechen, /ohne eine einzige Gegenstimme/);
  // Und die Ausschlussliste nennt die Empfehlung noch einmal beim Namen.
  assert.ok(daten.ausgeschlossen.some((a) => /nicht wirksam|sollen nicht angewendet/i.test(a.warum)));
  const ohne = kopie();
  ohne.keinTrainingsversprechen = 'Diese Spiele machen das Sprechen leichter.';
  const f = pruefeDaten(ohne);
  assert.ok(f.some((x) => /fehlende Versprechen/.test(x)));
  assert.ok(f.some((x) => /Negativempfehlung muss wörtlich dastehen/.test(x)));
});

test('eine Pustekarte ist ohne das Trainings-Dementi nicht ausdrückbar', () => {
  // Dieselbe Bauart wie die Bauchlage in Nr. 49: der tragende Satz ist
  // Pflichtfeld des Registers, nicht Sache der Redaktion.
  for (const s of spieleIm(daten, 'pustespiel')) {
    assert.ok(s.keinTraining, `${s.id}: ohne Dementi`);
    assert.match(s.keinTraining, /kein[e]? (Übung|Training)|trainiert nicht|übt kein|ist ein Spiel|keine Aussprache|nicht trainiert|nichts daran trainiert/i, s.id);
  }
  const ohne = kopie();
  delete ohne.spiele.find((s) => s.register === 'pustespiel').keinTraining;
  assert.ok(pruefeDaten(ohne).some((f) => /braucht den Satz, dass es nichts trainiert/.test(f)));
  // Ein schwaches Dementi genügt nicht.
  const schwach = kopie();
  schwach.spiele.find((s) => s.register === 'pustespiel').keinTraining = 'Viel Freude dabei.';
  assert.ok(pruefeDaten(schwach).some((f) => /sagt nicht deutlich/.test(f)));
  // Und das Dementi gehört NUR zum Pustespiel – sonst wäre es Dekoration.
  const falsch = kopie();
  falsch.spiele.find((s) => s.register === 'lautspiel').keinTraining = 'Trainiert nichts.';
  assert.ok(pruefeDaten(falsch).some((f) => /gehört nur zu einem Pustespiel/.test(f)));
});

test('ein Lautspiel sagt, warum Sprache darin vorkommt', () => {
  // Das ist der Unterschied, auf dem die Zulässigkeit beruht: die
  // Negativempfehlung betrifft ausdrücklich das NICHTsprachliche.
  for (const s of spieleIm(daten, 'lautspiel')) assert.ok(s.warumSprache, s.id);
  const ohne = kopie();
  delete ohne.spiele.find((s) => s.register === 'lautspiel').warumSprache;
  assert.ok(pruefeDaten(ohne).some((f) => /warum hier Sprache drin ist/.test(f)));
  assert.deepEqual([...REGISTER_MIT_SPRACHGRUND], ['lautspiel']);
  assert.deepEqual([...REGISTER_MIT_DEMENTI], ['pustespiel']);
  assert.deepEqual([...REGISTER_MIT_RATEN], ['lauschspiel']);
});

test('jedes Lauschspiel entschärft das Raten', () => {
  for (const s of spieleIm(daten, 'lauschspiel')) {
    assert.ok(s.keinRaten, `${s.id}: ohne Entschärfung`);
  }
  const ohne = kopie();
  delete ohne.spiele.find((s) => s.register === 'lauschspiel').keinRaten;
  assert.ok(pruefeDaten(ohne).some((f) => /muss das Raten entschärfen/.test(f)));
  const schwach = kopie();
  schwach.spiele.find((s) => s.register === 'lauschspiel').keinRaten = 'Viel Spaß beim Raten.';
  assert.ok(pruefeDaten(schwach).some((f) => /entschärft nicht/.test(f)));
  // Die Entschärfung darf verschieden klingen: eine Karte ohne etwas zu
  // Erratendes sagt es anders.
  const anders = kopie();
  anders.spiele.find((s) => s.id === 'h-leise-laut').keinRaten = 'Nichts zu erkennen, nichts zu schaffen.';
  assert.deepEqual(pruefeDaten(anders), []);
  assert.match(daten.keinQuiz, /keine Punkte/);
});

test('kein Wirkversprechen in einem Kartentext – auch nicht abgeschwächt', () => {
  assert.deepEqual(pruefeDaten(daten), []);
  const mut = kopie();
  mut.spiele[0].soGehts.push('Das trainiert die Aussprache ganz nebenbei.');
  assert.ok(pruefeDaten(mut).some((f) => /Wirkversprechen zur Sprache/.test(f)));
  const mut2 = kopie();
  mut2.spiele[3].warumSprache = 'Eine gute Vorstufe der Artikulation.';
  assert.ok(pruefeDaten(mut2).some((f) => /Wirkversprechen zur Sprache/.test(f)));
  assert.match('übt die Aussprache', WIRKVERSPRECHEN);
  assert.match('Grundlage der Artikulation', WIRKVERSPRECHEN);
  assert.doesNotMatch('ein Spiel mit Lauten', WIRKVERSPRECHEN);
  // Das Feld, das das Versprechen ZURÜCKWEIST, darf es nennen.
  assert.match(daten.keinTrainingsversprechen, /Grundlagen der Artikulation/);
});

test('keine Übung am Mund – aber die Abgrenzung darf sie nennen', () => {
  // Trap: `warumSprache` sagt „das ist keine Zungenübung". Ein Netz auf das
  // Wort traf die eigene Ausnahmeklausel. Darum läuft es nur auf den
  // Anweisungsfeldern.
  assert.ok(daten.spiele.some((s) => /Zungenübung/.test(s.warumSprache ?? '')));
  assert.deepEqual(pruefeDaten(daten), []);
  const mut = kopie();
  mut.spiele[0].soGehts.push('Machen Sie eine Zungenübung vor.');
  assert.ok(pruefeDaten(mut).some((f) => /Übung am Mund des Kindes in einer Anweisung/.test(f)));
  assert.match('Zungenübung', UEBUNG_AM_MUND);
  assert.match('Lippen spitzen', UEBUNG_AM_MUND);
});

test('kein Quiz, keine Punkte, kein Ergebnis', () => {
  const mut = kopie();
  mut.spiele[6].soGehts.push('Für jeden Treffer gibt es Punkte.');
  assert.ok(pruefeDaten(mut).some((f) => /Prüf- oder Punktevokabular/.test(f)));
  assert.match('drei Punkte', PRUEFUNG);
  assert.doesNotMatch('zeigt auf den Topf', PRUEFUNG);
  // Das Feld, das es ausschließt, darf es nennen.
  assert.ok(daten.spiele.some((s) => PRUEFUNG.test(s.keinRaten ?? '')));
  assert.deepEqual(pruefeDaten(daten), []);
});

test('die Lautfolge ist Beruhigung und kein Ziel – und für Vokale gibt es keine', () => {
  assert.match(daten.lauterwerb.hinweis, /nicht als Plan|Orientierung, nicht/);
  assert.match(daten.lauterwerb.hinweis, /keine belegte Reihenfolge|erfindet sie/);
  assert.match(daten.lauterwerb.keinZiel, /keine Aufgabe|kein Spiel, das einen bestimmten Laut/);
  // Die russische Lautliste der Quelle ist ausgeschlossen, mit Grund.
  assert.ok(daten.ausgeschlossen.some((a) => /Lautliste als Übungsplan/.test(a.was)));
  assert.ok(daten.ausgeschlossen.some((a) => /nicht übertragbar/.test(a.warum)));
  const ohne = kopie();
  ohne.lauterwerb.hinweis = 'So lernen Kinder die Laute.';
  const f = pruefeDaten(ohne);
  assert.ok(f.some((x) => /ausdrücklich kein Plan/.test(x)));
  assert.ok(f.some((x) => /für die Vokale keine Reihenfolge belegt/.test(x)));
  // Eine Vokalreihenfolge in einem anderen Feld wird abgewiesen.
  const vokale = kopie();
  vokale.lauterwerb.frueh = 'a, o, u, dann i';
  assert.ok(pruefeDaten(vokale).some((x) => /Vokalreihenfolge/.test(x)));
  // Und die Lautfolge gilt nicht für ein mehrsprachiges Kind.
  assert.match(daten.mehrsprachig, /gilt die deutsche Lautreihenfolge weiter unten nicht einfach so/);
});

test('die Beruhigungsliste sagt Normalität und fordert nichts', () => {
  assert.ok(daten.physiologisch.length >= 4);
  for (const p of daten.physiologisch) {
    assert.match(p.satz, /normal/i, p.id);
    assert.ok(p.normalBis, p.id);
    assert.ok(p.beispiel, p.id);
  }
  const mut = kopie();
  mut.physiologisch[0].satz = 'Das sollte man üben.';
  const f = pruefeDaten(mut);
  assert.ok(f.some((x) => /Normalität aussprechen/.test(x)));
  assert.ok(f.some((x) => /Übungsaufforderung in der Beruhigung/.test(x)));
  const wenig = kopie();
  wenig.physiologisch = wenig.physiologisch.slice(0, 2);
  assert.ok(pruefeDaten(wenig).some((x) => /zu wenige Zeilen/.test(x)));
});

test('Luftballon und Ballongas sind ausgeschlossen – ohne erfundenes Verbot', () => {
  const ballon = daten.ausgeschlossen.find((a) => /Luftballon/.test(a.was));
  assert.ok(ballon);
  // Der Mechanismus, der belegt ist: nicht aufgeblasene Ballons und Fetzen
  // legen sich an die Atemwege und schließen dicht ab.
  assert.match(ballon.warum, /anlegen und dicht abschließen|dicht abschließen/);
  // Und das, was NICHT belegt ist: ein Verbot gibt es nicht.
  assert.match(ballon.warum, /gibt es ausdrücklich NICHT/);
  assert.match(ballon.warum, /Vorsicht dieser Kartei|keine Rechtsfolge/);
  const gas = daten.ausgeschlossen.find((a) => /Ballongas/.test(a.was));
  assert.ok(gas, 'Ballongas fehlt – es war in der ersten Fassung gar nicht bedacht');
  assert.match(gas.warum, /farb- und geruchlos/);
  assert.match(gas.warum, /lebensgefährlich/);
  // Gegenprobe: ein Verbot zu behaupten wird abgewiesen.
  const mut = kopie();
  mut.ausgeschlossen.find((a) => /Luftballon/.test(a.was)).warum = 'Kinder unter acht dürfen Luftballons nicht aufpusten.';
  assert.ok(pruefeDaten(mut).some((f) => /sonst wird eine Rechtsfolge erfunden/.test(f)));
  const ohneGas = kopie();
  ohneGas.ausgeschlossen = ohneGas.ausgeschlossen.filter((a) => !/Ballongas/.test(a.was));
  assert.ok(pruefeDaten(ohneGas).some((f) => /Ballongas muss ausdrücklich ausgeschlossen/.test(f)));
});

test('Sicherheit steht auf jeder Karte, und keine erfundene Warnung', () => {
  for (const s of daten.spiele) {
    assert.ok(s.sicherheit, s.id);
    assert.ok(s.abbruchzeichen, s.id);
  }
  // Seifenblasen: der Weg, den die Giftinformationszentren nennen.
  const blasen = spielVon(daten, 'p-seifenblasen');
  assert.match(blasen.sicherheit, /Entschäumer/);
  assert.match(blasen.sicherheit, /Giftnotruf|112/);
  // Keine Hyperventilations-Warnung: dazu ist nichts belegbar, und eine
  // erfundene Warnung schwächt die echten.
  assert.doesNotMatch(JSON.stringify(daten), /Hyperventilation|zu viel Luft|Schwindel durch Pusten/i);
  // Lautstärke am Ohr ist benannt.
  assert.match(daten.lautstaerke, /nie neben dem Kopf/);
  const ohne = kopie();
  delete ohne.spiele[0].sicherheit;
  assert.ok(pruefeDaten(ohne).some((f) => /sicherheit fehlt/.test(f)));
});

test('nur auf Deutsch – und das ist ausgesprochen', () => {
  // Korpusregel: entweder geprüft oder ausdrücklich weggelassen. Schweigen
  // ist keine Option.
  assert.match(daten.keineUebersetzung, /nur auf Deutsch/);
  assert.match(daten.keineUebersetzung, /bewusste Entscheidung/);
  assert.match(daten.keineUebersetzung, /Familiensprache/);
  // Kyrillisch nur in der Quellenangabe und in der Ausschlussliste.
  const mut = kopie();
  mut.spiele[0].titel = 'Пузырь';
  assert.ok(pruefeDaten(mut).some((f) => /kyrillische Schrift außerhalb/.test(f)));
  assert.ok(/[Ѐ-ӿ]/.test(daten.quelle.nachgezaehlt), 'die Quelle zitiert die Originalnamen');
  assert.deepEqual(pruefeDaten(daten), []);
  assert.doesNotMatch(code, /vorlesen\([^)]*,\s*'(uk|ru|tr|ar|pl)/);
});

test('die Quellbilanz wird nachgerechnet', () => {
  assert.equal(daten.quelle.zahlen.zieleQuelle, 3);
  assert.equal(daten.quelle.zahlen.spieleQuelle, 6);
  assert.equal(daten.quelle.zahlen.spieleUebernommen + daten.quelle.zahlen.spieleNichtUebernommen, 6);
  assert.ok(daten.quelle.geprueft);
  assert.match(daten.quelle.rechte, /Eigenproduktion/);
  // Die Zweideutigkeit von «надуй пузырь» steht in der Abweichung.
  assert.match(daten.quelle.abweichung, /nicht eindeutig/);
  assert.match(daten.quelle.abweichung, /Seifenblase/);
  const falsch = kopie();
  falsch.quelle.zahlen.spieleUebernommen = 5;
  assert.ok(pruefeDaten(falsch).some((f) => /muss 6 ergeben/.test(f)));
  for (const a of daten.ausgeschlossen) assert.ok(a.warum, `${a.quellNr} ohne Begründung`);
  const ohneGrund = kopie();
  delete ohneGrund.ausgeschlossen[0].warum;
  assert.ok(pruefeDaten(ohneGrund).some((f) => /ohne Grund ist Redaktion/.test(f)));
});

test('jedes Register ist belegt, und die Gruppierung stimmt', () => {
  assert.deepEqual([...REGISTER], ['pustespiel', 'lautspiel', 'lauschspiel']);
  for (const r of REGISTER) assert.ok(spieleIm(daten, r).length > 0, r);
  assert.equal(registerMitSpielen(daten).length, REGISTER.length);
  assert.equal(spieleIm(daten, 'gibtsnicht').length, 0);
  const leer = kopie();
  leer.spiele = leer.spiele.filter((s) => s.register !== 'lautspiel');
  assert.ok(pruefeDaten(leer).some((f) => /Register lautspiel: kein Spiel/.test(f)));
});

test('Druckblatt und Politik', () => {
  assert.match(code, /window\.print\(\)/);
  assert.match(druck, /@media print/);
  assert.match(druckRegeln, /\.plk-nur-bildschirm \{ display: none !important/);
  assert.match(druckRegeln, /\.plk-nur-druck \{ display: block !important/);
  for (const verboten of ['Haken', 'Häkchen', 'Stern', 'Urkunde', 'Name:', 'Punkte']) {
    assert.ok(!druckRegeln.includes(verboten), `eine Druckregel erzeugt „${verboten}“`);
  }
  assert.doesNotMatch(druckRegeln, /content:\s*["'][^"']*[☐☑★⭐✔]/);
  // Was für jede Karte gilt, erreicht das Papier: das Vorwort wird nicht
  // mitgedruckt.
  assert.match(code, /plk-nur-druck/);
  assert.match(code, /daten\.keinTrainingsversprechen/);
  assert.match(code, /daten\.wennSorge/);
  // Politik
  assert.match(seite, /default-src 'self'; style-src 'self' 'unsafe-inline'/);
  assert.match(seite, /<html lang="de">/);
  assert.match(seite, /<noscript>/);
  assert.match(seite, /aria-live/);
  assert.match(code, /installiereNetzwerkWaechter\(\)/);
  assert.match(code, /impressum\.html/);
  assert.doesNotMatch(JSON.stringify(daten), /https?:\/\//);
  assert.doesNotMatch(code, /localStorage/);
  // Die Zusage ist nicht „eine lokale Stimme wird GESUCHT", sondern „sie
  // wird BENUTZT": `lokaleStimme()` liegt jetzt in kinder-ui, und die
  // gefundene Stimme wird an `vorlesen()` uebergeben, das sie auf die
  // Utterance setzt. Vorher steuerte sie nur die Sichtbarkeit des Knopfes,
  // und der Browser nahm die Standardstimme - auf Android typischerweise
  // die netzbasierte. Das war ein echter Defekt (Review der Welle 78).
  assert.match(code, /lokaleStimme\('de'\)/);
  assert.match(code, /vorlesen\(text, 'de-DE', stimme\)/);
  // Elterntelefon, nicht die Kindernummer.
  assert.match(daten.wennSorge, /0800 111 0 550/);
  assert.doesNotMatch(JSON.stringify(daten), /116 111/);
  for (const nachbar of ['sprachbruecken-impulskarten', 'erste-woerter-tagebuch', 'sprich-mit-mir', 'klang-detektive', 'bewegungs-schatzkiste']) {
    assert.match(code, new RegExp(nachbar), `Verweis auf ${nachbar} fehlt`);
  }
});

test('Hilfsfunktionen', () => {
  assert.equal(spielVon(daten, 'p-feder').titel, 'Die Feder über den Tisch');
  assert.equal(spielVon(daten, 'gibtsnicht'), null);
  assert.equal(spielText(null), '');
  const t = spielText(spielVon(daten, 'p-seifenblasen'));
  assert.match(t, /Seifenblasen/);
  assert.match(t, /Aufhören:/);
  assert.match(t, /Sicherheit:/);
  // Das Dementi geht mit in die Vorlesefunktion – es gehört zur Karte.
  assert.match(t, /Spiel und keine Übung/);
});
