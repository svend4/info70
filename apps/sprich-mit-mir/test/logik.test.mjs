import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  PERIODEN_ANZAHL, QUELLZIELE, MERK_STATUS, RAT_GEGEN_DIE_FAMILIENSPRACHE, BERUHIGUNG,
  periodeVon, impulsVon, impulseFuer, signaleIn, naechsterImpuls, impulsText, pruefeDaten,
} from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/impulse.json', import.meta.url), 'utf8'));
const kopie = () => JSON.parse(JSON.stringify(daten));
const app = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
// Ohne Kommentare: die Kommentare nennen, was nicht vorkommen darf.
const code = app.replace(/^\s*\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
const paket = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const seite = await readFile(new URL('../index.html', import.meta.url), 'utf8');

test('Daten sind gültig', () => {
  assert.deepEqual(pruefeDaten(daten), []);
  assert.ok(daten.impulse.length >= 12);
});

test('geordnet nach Signal, nicht nach Lebenswoche', () => {
  // Der Katalog sagt „Wochen-Impulse“. Als „Impuls für Lebenswoche N“
  // gelesen behauptet das einen Entwicklungsfahrplan, den es nicht gibt –
  // und verlangt ein gespeichertes Geburtsdatum, also personenbezogene
  // Daten über einen identifizierbaren Säugling.
  assert.doesNotMatch(code, /Geburtsdatum|geburt|alterInMonaten|lebenswoche/i);
  assert.doesNotMatch(code, /new Date|Date\.now/);
  assert.doesNotMatch(code, /<input|<textarea/);
  for (const i of daten.impulse) {
    assert.ok(i.signal, i.id);
    assert.doesNotMatch(`${i.titel} ${i.erwachsenenText}`, /(^|[^a-zäöüß])(mit \d|ab \d|\d Monat|\d Woche)/, i.id);
  }
  const mut = kopie();
  mut.impulse[0].erwachsenenText = `In der 12. Woche gilt: ${mut.impulse[0].erwachsenenText}`;
  assert.ok(pruefeDaten(mut).some((f) => /Lebenswoche/.test(f)));
  assert.match(daten.hinweis, /kein Geburtsdatum/);
  // `abbruch` war ein Pflichtfeld des Validators und stand auf keinem
  // Bildschirm: eine geprüfte Zusage, die niemand liest.
  assert.match(daten.abbruch, /jederzeit aufhören/);
  assert.match(code, /daten\.abbruch/);
  assert.match(daten.hinweis, /nicht nach Lebenswoche/);
});

test('die drei Perioden überlappen ausdrücklich', () => {
  // Scharfe Grenzen behaupten eine Präzision, die die Daten nicht haben:
  // allein das kanonische Lallen streut über Monate.
  assert.equal(daten.perioden.length, PERIODEN_ANZAHL);
  for (const [i, p] of daten.perioden.entries()) {
    assert.ok(p.bisMonat - p.vonMonat >= 3, p.id);
    assert.match(p.ueberlappung, /überlapp/i);
    assert.ok(p.passtWenn.length > 20, p.id);
    const n = daten.perioden[i + 1];
    if (n) assert.ok(p.bisMonat > n.vonMonat, `${p.id} überlappt ${n.id} nicht`);
  }
  const eng = kopie();
  eng.perioden[0].bisMonat = 2;
  assert.ok(pruefeDaten(eng).some((f) => /unter drei Monaten/.test(f)));
  const getrennt = kopie();
  getrennt.perioden[1].vonMonat = 4;
  assert.ok(pruefeDaten(getrennt).some((f) => /überlappt die nächste nicht/.test(f)));
});

test('alle zehn Kommunikationsziele der Quelle sind belegt', () => {
  // Die Quelle nennt eines für die Neugeborenenzeit, drei für den 2. bis
  // 6. und sechs für den 6. bis 12. Monat – nachgezählt in PRALESKA.pdf,
  // S. 37-39.
  assert.equal(QUELLZIELE, 10);
  const belegt = new Set(daten.impulse.flatMap((i) => i.quellZiel));
  assert.deepEqual([...belegt].sort((a, b) => a - b), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const mut = kopie();
  mut.impulse = mut.impulse.filter((i) => !i.quellZiel.includes(7));
  assert.ok(pruefeDaten(mut).some((f) => /fehlend: 7/.test(f)));
  assert.match(daten.quelle.abschnitt, /10 Kommunikationsziele/);
  // Die Ziele der Quelle sind an die Fachkraft gerichtet, nicht an das Kind
  // – genau diese Form ist übernommen.
  assert.match(daten.quelle.form, /an die Fachkraft gerichtet/);
});

test('angekreuzt wird ein eigenes Vorhaben, nie ein Zustand des Kindes', () => {
  // apps/meilenstein-begleiter besitzt die Beobachtung des Kindes, mit
  // U3-U6-Mapping. Eine zweite Liste über das Sprachverhalten eines Babys
  // wäre ein unverankertes Screening.
  for (const m of daten.merkliste) assert.match(m.satz, /^Ich /, m.id);
  assert.deepEqual([...MERK_STATUS], ['moechte-ich', 'schon-probiert']);
  const mut = kopie();
  mut.merkliste[0].satz = 'Mein Kind lallt mit Silben.';
  assert.ok(pruefeDaten(mut).some((f) => /muss mit „Ich “ beginnen/.test(f)));
  // Und in der App hängt der Haken an der Merkliste, nicht an einem Impuls.
  assert.match(code, /smm\.merkliste/);
  // Der zugängliche Name nennt den Stand auf Deutsch. Vorher stand dort der
  // rohe Enum-Wert, und eine Sprachausgabe las „moechte-ich“ vor – von der
  // Browser-Prüfung gefunden, von keinem Unit-Test.
  assert.match(code, /'möchte ich'/);
  assert.match(code, /'schon probiert'/);
  assert.match(code, /'aria-pressed'/);
  // Der Stand liegt im Arbeitsspeicher und der Speicher ist die Kopie –
  // sonst tut jedes Antippen bei gesperrtem localStorage sichtbar nichts.
  assert.match(code, /let merkStand =/);
  assert.match(code, /speicherSperre/);
  assert.match(code, /kann gerade nichts behalten/);
  // Und der Fokus bleibt auf der getippten Zeile.
  assert.match(code, /render\(m\.id\)/);
  assert.match(code, /getElementById\(`smm-\$\{fokusId\}`\)\?\.focus\(\)/);
  const merkTeil = code.slice(code.indexOf('function merkKarte('), code.indexOf('function render('));
  assert.doesNotMatch(merkTeil, /Status: \$\{stand\}/, 'der Enum-Wert darf nicht vorgelesen werden');
  for (const roh of MERK_STATUS) {
    assert.ok(!new RegExp(`aria-label[^\n]*${roh}`).test(merkTeil), `${roh} steht im zugänglichen Namen`);
  }
  assert.doesNotMatch(code, /beobachtet|meilenstein\w*\s*=/i);
});

test('die Botschaft zur Familiensprache steht nie ohne ihre Sicherung', () => {
  const m = daten.bloecke.mehrsprachig;
  assert.match(m.sicherung, /kein Grund, die Familiensprache aufzugeben/);
  assert.match(m.sicherung, /in allen Sprachen/);
  assert.match(m.quelle, /Mercator/);
  const ohne = kopie();
  delete ohne.bloecke.mehrsprachig.sicherung;
  assert.ok(pruefeDaten(ohne).some((f) => /sicherung fehlt/.test(f)));
  // Im Markup stehen Text und Sicherung im SELBEN Block – sie können nicht
  // auf zwei Bildschirme fallen.
  assert.match(code, /b\.sicherung \? el\('p'/);
});

test('kein Rat, zu Hause Deutsch zu sprechen – auch nicht zum Widerlegen', () => {
  // Leser überfliegen: der Rat überlebt den Hedge, die Einordnung nicht.
  assert.ok(RAT_GEGEN_DIE_FAMILIENSPRACHE.test('Manche empfehlen, zu Hause Deutsch zu sprechen.'));
  assert.ok(RAT_GEGEN_DIE_FAMILIENSPRACHE.test('Sollen wir lieber Deutsch reden?'));
  assert.ok(!RAT_GEGEN_DIE_FAMILIENSPRACHE.test(JSON.stringify(daten)));
  const mut = kopie();
  mut.bloecke.mehrsprachig.text += ' Manche empfehlen, zu Hause Deutsch zu sprechen – besser ist aber die Familiensprache.';
  assert.ok(pruefeDaten(mut).some((f) => /in keiner Form vorkommen/.test(f)));
  // Positiv formuliert kommt die Botschaft trotzdem an.
  assert.match(daten.bloecke.mehrsprachig.text, /Sprich mit deinem Baby in der Sprache/);
  // Neugeborene sehen bei etwa zwanzig bis dreißig Zentimetern scharf – eine
  // Armlänge ist das Doppelte, und die Begründung „da sieht ein Baby am
  // besten scharf“ war damit falsch.
  assert.doesNotMatch(JSON.stringify(daten), /Armlänge/);
  assert.match(impulsVon(daten, 'i01').erwachsenenText, /zwanzig bis dreißig Zentimeter/);
});

test('keine erfundenen Wortlisten – kyrillisch nur in der Quellenangabe', () => {
  // Die Projektregel verbietet erfundene uk/ru-Wortlisten. Hier ist sie
  // mechanisch: die App gibt überhaupt keine Wortliste, sondern eine Lücke
  // für das eigene Wort der Familie.
  const kyrillisch = /[Ѐ-ӿ]/;
  for (const [k, v] of Object.entries(daten)) {
    if (k === 'quelle') continue;
    assert.ok(!kyrillisch.test(JSON.stringify(v)), `${k} enthält kyrillische Schrift`);
  }
  assert.ok(kyrillisch.test(JSON.stringify(daten.quelle)), 'die Quelle darf und soll sie nennen');
  const mut = kopie();
  mut.impulse[0].erwachsenenText += ' Sag dazu: вода.';
  assert.ok(pruefeDaten(mut).some((f) => /kyrillisch/.test(f)));
  assert.match(daten.bloecke.eigeneWorte.text, /keine Wortlisten/);
  // Wo das eigene Wort hingehört, steht eine Lücke – und die ist Pflicht.
  const mitLuecke = daten.impulse.filter((i) => i.eigeneWorte);
  assert.ok(mitLuecke.length >= 2);
  for (const i of mitLuecke) assert.match(i.erwachsenenText, /______/, i.id);
  const falsch = kopie();
  falsch.impulse.find((i) => i.eigeneWorte).erwachsenenText = 'Sag einfach das Wort.';
  assert.ok(pruefeDaten(falsch).some((f) => /ohne Lücke/.test(f)));
});

test('der Warnzeichen-Block ist fest, nicht ausblendbar und ohne Beruhigung', () => {
  // Der schlimmste Satz, den diese App enthalten könnte, ist eine
  // Beruhigung am fehlenden Lallen oder am fehlenden Reagieren auf Töne.
  const w = daten.warnzeichen;
  assert.ok(w.punkte.length >= 3);
  assert.ok(w.punkte.some((p) => /nicht auf Stimmen/.test(p)));
  assert.ok(w.punkte.some((p) => /verliert/.test(p)));
  assert.match(w.wasTun, /Kinderarztpraxis|U-Untersuchung/);
  // In der gesetzlichen Versorgung besteht kein Anspruch auf Sprachmittlung.
  // Als Recht behauptet setzt der Satz Eltern genau der Abweisung aus, die
  // dieser Abschnitt verhindern soll – gesagt wird darum, was wirklich geht.
  assert.doesNotMatch(w.wasTun, /Recht auf Sprachmittlung|Anspruch auf Sprachmittlung/);
  assert.match(w.wasTun, /Du darfst jemanden mitbringen/);
  assert.match(w.wasTun, /verlassen kannst du dich darauf nicht/);
  const warnText = [w.vorspann, ...w.punkte, w.wasTun].join(' ');
  assert.ok(!BERUHIGUNG.test(warnText));
  // `nichtBeruhigen` MUSS die Formulierung nennen, um sie auszuschließen –
  // ein Netz über das ganze Objekt träfe die Ausschlussklausel selbst.
  assert.ok(BERUHIGUNG.test(w.nichtBeruhigen));
  const mut = kopie();
  mut.warnzeichen.punkte.push('Meistens ist das kein Grund zur Sorge.');
  assert.ok(pruefeDaten(mut).some((f) => /enthält eine Beruhigung/.test(f)));
  // In der App steht der Block in jeder Ansicht und hat keinen Schalter.
  assert.match(code, /warnBlock\(\)/);
  assert.equal((code.match(/warnBlock\(\)/g) ?? []).length, 2, 'einmal definiert, einmal gerendert – ohne Bedingung');
  const renderTeil = code.slice(code.indexOf('function render('));
  assert.match(renderTeil, /\n\s*warnBlock\(\),/, 'der Block darf nicht hinter einer Bedingung stehen');
});

test('Hören: was bleibt, nicht wie das Verfahren heute heißt', () => {
  // Der Ablauf des Neugeborenen-Hörscreenings wurde im August 2026
  // geändert. Verfahrensdetails in einer Eltern-App veralten; was bleibt,
  // ist: es gibt ein Screening, ein unauffälliges Ergebnis schließt eine
  // später auftretende Hörstörung nicht aus, und der Weg ist die Praxis.
  const h = daten.bloecke.hoeren;
  assert.match(h.text, /Hörscreening/);
  assert.match(h.text, /nicht aus/);
  assert.match(h.text, /nicht für mehr Üben/);
  for (const detail of ['TEOAE', 'AABR', 'Konfirmationsdiagnostik', 'Kontroll-AABR']) {
    assert.ok(!JSON.stringify(daten).includes(detail), `${detail} gehört nicht in eine Eltern-App`);
    const mut = kopie();
    mut.bloecke.hoeren.text += ` Dabei wird ${detail} gemacht.`;
    assert.ok(pruefeDaten(mut).some((f) => /Verfahrensdetail/.test(f)), detail);
  }
});

test('Bildschirm: die Behörde heißt aktuell BIÖG, mit dem alten Namen dazu', () => {
  // Die BZgA ist seit dem 13. Februar 2025 das Bundesinstitut für
  // Öffentliche Gesundheit. Eine 2026 ausgelieferte App, die „BZgA“ als
  // aktuelle Quelle nennt, ist bereits veraltet – der frühere Name gehört
  // aber dazu, sonst findet niemand die Empfehlung wieder.
  assert.match(daten.bloecke.bildschirm.quelle, /BIÖG/);
  assert.match(daten.bloecke.bildschirm.quelle, /BZgA/);
  assert.match(daten.bloecke.bildschirm.quelle, /WHO/);
  for (const q of ['BIÖG', 'BZgA']) {
    const mut = kopie();
    mut.bloecke.bildschirm.quelle = mut.bloecke.bildschirm.quelle.replace(q, 'X');
    assert.ok(pruefeDaten(mut).length > 0, q);
  }
  assert.match(daten.bloecke.bildschirm.text, /nicht empfohlen/);
  assert.match(daten.bloecke.bildschirm.text, /antwortet nicht/, 'der Grund muss mit Sprache zu tun haben');
});

test('jeder Impuls hat einen Alltagsmoment und beschreibt eine Erwachsenenhandlung', () => {
  // Deutsche Praxis für 0-1 ist alltagsintegriert: Wickeln, Füttern,
  // Tragen, Anziehen SIND die Sprachsituationen. Ein Übungsduktus würde
  // Sprache in einen Extra-Termin verschieben.
  const ankerIds = new Set(daten.anker.map((a) => a.id));
  for (const i of daten.impulse) {
    assert.ok(ankerIds.has(i.anker), i.id);
    assert.ok(i.erwachsenenText.length >= 80, i.id);
  }
  const mut = kopie();
  delete mut.impulse[0].anker;
  assert.ok(pruefeDaten(mut).some((f) => /anker.*fehlt/.test(f)));
  assert.doesNotMatch(JSON.stringify(daten.impulse), /Übung|Beschäftigung|Lehrziel|Artikulation/);
});

test('Vorlesen nur mit Gerätestimme, nichts vom Kind geht durch', () => {
  // Die Zusage ist nicht „eine lokale Stimme wird GESUCHT", sondern „sie
  // wird BENUTZT": `lokaleStimme()` liegt jetzt in kinder-ui, und die
  // gefundene Stimme wird an `vorlesen()` uebergeben, das sie auf die
  // Utterance setzt. Vorher steuerte sie nur die Sichtbarkeit des Knopfes,
  // und der Browser nahm die Standardstimme - auf Android typischerweise
  // die netzbasierte. Das war ein echter Defekt (Review der Welle 78).
  assert.match(code, /lokaleStimme\('de'\)/);
  assert.match(code, /vorlesen\(text, 'de-DE', stimme\)/);
  // getVoices() und die Sprachprüfung liegen jetzt in kinder-ui; dort
  // werden sie auch geprüft (packages/kinder-ui/test/vorlesen.test.mjs).
  assert.match(code, /keine deutsche Stimme/);
  // Vorgelesen wird nur fester Erwachsenentext.
  assert.match(impulsText(daten, daten.impulse[0]), new RegExp(daten.impulse[0].titel.slice(0, 12)));
  assert.equal(impulsText(daten, null), '');
});

test('nur ein Schlüssel, löschbar, nichts über das Kind', () => {
  assert.equal((code.match(/localStorage\.setItem/g) ?? []).length, 1);
  assert.match(code, /localStorage\.removeItem\(SCHLUESSEL\)/);
  assert.doesNotMatch(code, /localStorage\.clear/);
  assert.match(code, /Meine Vorhaben löschen/);
  // Geprüft wird die SCORING-Konstruktion, nicht das Wort: „Wenige Punkte,
  // bei denen Abwarten nicht richtig ist“ sind Gesichtspunkte und kein
  // Punktestand. Ein Netz auf /Punkte/ hätte den eigenen Warnblock
  // getroffen – dieselbe Wortsinn-Kollision, die in Welle 76 viermal
  // zugeschlagen hat.
  assert.doesNotMatch(JSON.stringify(daten),
    /\d+\s*Punkte|Punktestand|Punkte (sammeln|verdienen|geben)|Prozent|%|Ampel|(^|[^a-zäöüß])Rang(|liste|stufe)($|[^a-zäöüß])|Sterne/);
  // Keine Hilfe-Insel: in einem Erwachsenen-Werkzeug adressiert die 116 111
  // niemanden. Das Elterntelefon steht als Text in den Daten.
  assert.doesNotMatch(code, /hilfeInsel|hilfe-insel|116\s?111/);
  assert.match(daten.erwachsener, /0800 111 0 550/);
});

test('Abgrenzung, Seite und Politik', () => {
  assert.match(code, /vorlese-kompass/);
  assert.match(code, /meilenstein-begleiter/);
  assert.match(paket.description, /meilenstein-begleiter/);
  // vorlese-kompass besitzt Buch und Vorlesen ab 1 Jahr.
  assert.doesNotMatch(JSON.stringify(daten.impulse), /Bilderbuch|vorlesen|Pappbilderbuch/i);
  assert.match(seite, /lang="de"/);
  assert.match(seite, /<title>/);
  assert.match(seite, /width=device-width/);
  assert.match(seite, /default-src 'self'/);
  assert.match(seite, /<main/);
  assert.match(seite, /<noscript>/);
  assert.match(seite, /aria-live/);
  assert.match(code, /installiereNetzwerkWaechter\(\)/);
  assert.match(code, /impressum\.html/);
  assert.doesNotMatch(JSON.stringify(daten), /https?:\/\//);
});

test('Hilfsfunktionen', () => {
  assert.equal(periodeVon(daten, 'p1').vonMonat, 0);
  assert.equal(periodeVon(daten, 'x'), null);
  assert.ok(impulsVon(daten, 'i01'));
  assert.equal(impulsVon(daten, 'x'), null);
  assert.ok(impulseFuer(daten, 'p3').length >= 4);
  assert.ok(signaleIn(daten, 'p1').length >= 2);
  const liste = impulseFuer(daten, 'p3');
  assert.equal(naechsterImpuls(liste, liste[liste.length - 1].id).id, liste[0].id, 'rotiert im Kreis');
  assert.equal(naechsterImpuls([], 'x'), null);
});
