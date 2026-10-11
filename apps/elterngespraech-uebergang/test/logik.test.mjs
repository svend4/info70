import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  BUNDESLAENDER, MERKMALE_INSGESAMT, FELDER_DER_QUELLE, VORBEDINGUNGEN, SCHULSTOFF,
  KINDFRAGE, BEWERTUNG, DIAGNOSE_ZUGESCHRIEBEN, VORHERSAGE, SCHULFAEHIG_ALS_URTEIL,
  KOENNENSALTER, LESEN_ERWARTET, NETZE, NICHT_GEPRUEFT, NICHT_GEPRUEFT_FELDER,
  AUSNAHME_MUSS_ENTHALTEN, OHNE_NETZGRUND, NETZ_AUSNAHMEN, angebotsTexte, elternfragen, feldVon, rechtVon,
  merkmaleGezaehlt, pruefeDaten,
} from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/gespraech.json', import.meta.url), 'utf8'));
const kopie = () => JSON.parse(JSON.stringify(daten));

test('die Daten sind in Ordnung', () => {
  assert.deepEqual(pruefeDaten(daten), []);
});

test('die Zählung der Quelle geht auf: zwölf Felder plus acht Vorbedingungen = 139', () => {
  assert.equal(daten.gespraechsfelder.length, FELDER_DER_QUELLE - 1);
  assert.equal(daten.lernvoraussetzungen.length, VORBEDINGUNGEN);
  assert.equal(MERKMALE_INSGESAMT, 139);
  assert.equal(merkmaleGezaehlt(daten), MERKMALE_INSGESAMT);
  // Eine verschobene Zahl faellt auf.
  const d = kopie();
  d.gespraechsfelder[0].quellPunkte += 1;
  assert.ok(pruefeDaten(d).some((f) => /nachgezählt sind 139/.test(f)));
});

test('die Bilanz ist keine Probe auf sich selbst mehr', () => {
  // Die erste Fassung zaehlte 141 und war damit in zwei Feldern um je eins zu
  // hoch; die Summe stimmte trotzdem, weil die Konstante dazu passte. Jetzt
  // muessen drei unabhaengig geschriebene Stellen uebereinstimmen: die
  // Konstante, die Zahl an jedem Feld und die Aufzaehlung im Quellfeld.
  const folge = daten.gespraechsfelder.map((f) => f.quellPunkte).join(', ');
  assert.ok(daten.quelle.nachgezaehlt.includes(folge), folge);
  // Verschieben zwischen zwei Feldern laesst die Summe gleich - und faellt auf.
  const d = kopie();
  d.gespraechsfelder[0].quellPunkte = 8;
  d.gespraechsfelder[1].quellPunkte = 6;
  assert.equal(merkmaleGezaehlt(d), MERKMALE_INSGESAMT);
  assert.ok(pruefeDaten(d).some((f) => /die Aufzählung und die Zahlen an den Feldern laufen auseinander/.test(f)));
});

test('JEDE Ausnahme ist verdient, und jedes Netz läuft über jedes Feld, von dem es nicht ausgenommen ist', () => {
  // `nichtUebernommen` war pauschal von ALLEN acht Netzen ausgenommen, obwohl
  // nur zwei begruendet sind (Review Welle 83).
  assert.deepEqual(Object.keys(NETZ_AUSNAHMEN), ['nichtUebernommen']);
  assert.deepEqual(Object.keys(NETZ_AUSNAHMEN.nichtUebernommen).sort(), ['BEWERTUNG', 'KINDFRAGE']);
  assert.deepEqual(OHNE_NETZGRUND, {});
  for (const feld of Object.keys(NICHT_GEPRUEFT)) assert.ok(feld in AUSNAHME_MUSS_ENTHALTEN, feld);
  // Eine Vorhersage im ausgenommenen Feld faellt jetzt auf.
  const d = kopie();
  feldVon(d, 'f-spiel').nichtUebernommen += ' Das Risiko für Leseschwierigkeiten ist dann höher.';
  assert.ok(pruefeDaten(d).some((f) => /Vorhersage/.test(f)));
});

test('die Kennungen der Rechtsfragen kollidieren nicht mit denen der Felder', () => {
  // Beide landen in derselben Auswahlliste im Speicher.
  const feldIds = new Set(daten.gespraechsfelder.map((f) => f.id));
  for (const r of daten.rechtliches) assert.ok(!feldIds.has(r.id), r.id);
  const d = kopie();
  d.rechtliches[0].id = 'f-spiel';
  assert.ok(pruefeDaten(d).some((f) => /dieselbe id gibt es schon als Gesprächsfeld/.test(f)));
});

test('jedes Feld hat seine sieben Angaben und eine Frage an die Fachkraft', () => {
  for (const f of daten.gespraechsfelder) {
    for (const feld of ['id', 'zeichen', 'name', 'quellFrage', 'nichtUebernommen', 'ihreFrage',
      'wasSieErzaehlen', 'wohinEsGehoert']) {
      assert.ok((f[feld] ?? '').length > 0, `${f.id}.${feld}`);
    }
    assert.ok(Number.isInteger(f.quellPunkte) && f.quellPunkte >= 1, f.id);
    assert.ok(f.ihreFrage.trim().endsWith('?'), f.id);
  }
});

test('DIE AUSNAHME MUSS SICH VERDIENEN: jedes nichtUebernommen zitiert die abgelehnte Frage', () => {
  // `nichtUebernommen` ist vom Netz KINDFRAGE ausgenommen, weil es die
  // abgelehnte Frage nennen muss (Falle A). Die Gegenrichtung: es MUSS sie
  // nennen - sonst ist die Ausnahme eine Luecke.
  assert.ok('nichtUebernommen' in NICHT_GEPRUEFT_FELDER);
  for (const f of daten.gespraechsfelder) {
    assert.ok(KINDFRAGE.test(f.nichtUebernommen), `${f.id} zitiert keine Frage über das Kind`);
  }
  const d = kopie();
  d.gespraechsfelder[3].nichtUebernommen = 'Das steht hier nicht, weil es nicht passt.';
  assert.ok(pruefeDaten(d).some((f) => /eine Ausnahme ohne Grund ist eine Lücke/.test(f)));
});

test('die Gegenrichtung gilt auch für die Absätze', () => {
  for (const [feld, netze] of Object.entries(AUSNAHME_MUSS_ENTHALTEN)) {
    assert.ok(feld in NICHT_GEPRUEFT || feld in NICHT_GEPRUEFT_FELDER, feld);
    for (const name of netze) assert.ok(name in NETZE, `${feld}: Netz ${name} gibt es nicht`);
  }
  // Nimmt man dem Absatz die Konstruktion, verliert er seine Ausnahme.
  const d = kopie();
  d.keinBericht = 'Dieses Werkzeug erzeugt nichts über Ihr Kind.';
  assert.ok(pruefeDaten(d).some((f) => /keinBericht ist von BEWERTUNG ausgenommen/.test(f)));
});

test('keine Frage der App fragt über das Kind', () => {
  const fragen = elternfragen(daten);
  assert.equal(fragen.length, daten.gespraechsfelder.length + daten.rechtliches.length);
  for (const [wo, text] of fragen) {
    assert.ok(text.trim().endsWith('?'), wo);
    assert.ok(!KINDFRAGE.test(text), `${wo}: ${text}`);
  }
  // Eine eingeschmuggelte Checklistenfrage faellt auf.
  const d = kopie();
  feldVon(d, 'f-spiel').ihreFrage = 'Kann Ihr Kind schon ein Rollenspiel planen?';
  assert.ok(pruefeDaten(d).some((f) => /fragt über das Kind/.test(f)));
});

test('das Netz trennt „Ihr Kind" von „mein Kind"', () => {
  // Verboten ist die Anrede: die App fragt die Eltern nichts ueber das Kind.
  assert.ok(KINDFRAGE.test('Kann Ihr Kind sich allein anziehen?'));
  assert.ok(KINDFRAGE.test('Liegt Ihr Kind im Normbereich?'));
  assert.ok(KINDFRAGE.test('Weiß Ihr Kind, wo es wohnt?'));
  assert.ok(KINDFRAGE.test('Ihr Kind sollte bis dahin zählen können.'));
  assert.ok(KINDFRAGE.test('Kann mein Kind schon lesen?'));
  // Erlaubt ist, wie Eltern selbst von ihrem Kind sprechen.
  assert.ok(!KINDFRAGE.test('Was macht mein Kind bei Ihnen allein?'));
  assert.ok(!KINDFRAGE.test('Worauf freut sich mein Kind, wenn von der Schule die Rede ist?'));
  assert.ok(!KINDFRAGE.test('Wie geht es meinem Kind in der Gruppe?'));
});

test('die acht Vorbedingungen stehen vollständig da, jede mit ihrer Gegenrede', () => {
  assert.deepEqual([...daten.lernvoraussetzungen.map((v) => v.nr)].sort((a, b) => a - b),
    Array.from({ length: VORBEDINGUNGEN }, (_, i) => i + 1));
  for (const v of daten.lernvoraussetzungen) {
    assert.ok((v.wasHierGilt ?? '').length > 20, `Vorbedingung ${v.nr}`);
    // Wer Schulstoff verlangt, braucht fuer die Gegenrede eine Quelle.
    if (SCHULSTOFF.test(v.kurz)) assert.ok((v.quelle ?? '').length > 10, `Vorbedingung ${v.nr} ohne Quelle`);
  }
  // Mindestens die Lautanalyse, die Buchstaben und das Silbenlesen sind dabei.
  assert.ok(daten.lernvoraussetzungen.filter((v) => SCHULSTOFF.test(v.kurz)).length >= 3);
  const d = kopie();
  const mitStoff = d.lernvoraussetzungen.find((v) => SCHULSTOFF.test(v.kurz));
  delete mitStoff.quelle;
  assert.ok(pruefeDaten(d).some((f) => /Gegenrede hat keine Quelle/.test(f)));
});

test('der Hinweis sagt, dass nichts davon hier verlangt wird', () => {
  assert.match(daten.lernvoraussetzungenHinweis, /\b(?:keine?|nicht)\b/);
  const d = kopie();
  d.lernvoraussetzungenHinweis = 'Hier stehen die acht Punkte der Quelle.';
  assert.ok(pruefeDaten(d).some((f) => /sagt nicht, dass nichts davon hier verlangt wird/.test(f)));
});

test('der Rechtsteil trägt zu jeder Antwort ihre Quelle', () => {
  assert.ok(daten.rechtliches.length >= 5);
  for (const r of daten.rechtliches) {
    for (const feld of ['id', 'zeichen', 'frage', 'antwort', 'quelle']) {
      assert.ok((r[feld] ?? '').length > 0, `${r.id}.${feld}`);
    }
    assert.ok(r.frage.trim().endsWith('?'), r.id);
    // Eine Fundstelle nennt einen Paragrafen, einen Artikel oder eine
    // Veroeffentlichung - sonst ist sie keine.
    assert.match(r.quelle, /§|Art\.|Handbuch|Bericht|Gesundheitswesen|Verwaltungsvorschrift|Datenschutzinformation/, r.id);
  }
  const d = kopie();
  delete rechtVon(d, 'r-wer').quelle;
  assert.ok(pruefeDaten(d).some((f) => /ohne Quelle ist keine/.test(f)));
});

test('Landesrecht klingt nicht wie Bundesrecht: mindestens zwei Antworten nennen zwei Länder', () => {
  // Gezaehlt wird laengste zuerst und mit Ausblenden: „Sachsen" steckt in
  // „Sachsen-Anhalt" und zaehlte sonst doppelt (Review Welle 83).
  const laender = (t) => {
    let rest = t; const g = [];
    for (const l of [...BUNDESLAENDER].sort((a, b) => b.length - a.length)) {
      if (rest.includes(l)) { g.push(l); rest = rest.split(l).join(' '); }
    }
    return g;
  };
  assert.deepEqual(laender('In Sachsen-Anhalt gilt eigenes Recht.'), ['Sachsen-Anhalt']);
  const mitZwei = daten.rechtliches.filter((r) => laender(r.antwort).length >= 2);
  assert.ok(mitZwei.length >= 2, `nur ${mitZwei.length} Antworten mit zwei Ländern`);
  const d = kopie();
  for (const r of d.rechtliches) for (const l of BUNDESLAENDER) r.antwort = r.antwort.split(l).join('dort');
  assert.ok(pruefeDaten(d).some((f) => /zwei oder mehr Bundesländer/.test(f)));
});

test('wer entscheidet, steht da – und es ist die Schulleitung', () => {
  const r = daten.rechtliches.find((x) => /entscheidet/i.test(x.frage));
  assert.ok(r, 'die Frage fehlt');
  assert.match(r.antwort, /Schulleit/);
  // Und die Untersuchung spricht kein Urteil.
  const u = daten.rechtliches.find((x) => /schulfähig/i.test(x.frage));
  assert.ok(u, 'die Frage nach dem Urteil fehlt');
  assert.match(u.antwort, /Empfehlung|kein/);
});

test('die Begründung hängt an der klinischen Frage der Quelle', () => {
  assert.match(daten.warumKeineCheckliste, /Depressiv/);
  const d = kopie();
  d.warumKeineCheckliste = d.warumKeineCheckliste.split('Depressivität').join('Unruhe').split('Ängstlichkeit').join('Unruhe');
  assert.ok(pruefeDaten(d).some((f) => /klinische Frage der Quelle nicht/.test(f)));
});

test('die drei Sprachen des Katalogeintrags werden benannt, nicht verschwiegen', () => {
  for (const s of ['deutsch', 'ukrainisch', 'russisch']) assert.match(daten.dreiSprachen.toLowerCase(), new RegExp(s));
  const d = kopie();
  d.dreiSprachen = 'Dieses Werkzeug ist nur deutsch.';
  const f = pruefeDaten(d);
  assert.ok(f.some((x) => /ukrainisch/.test(x)));
  assert.ok(f.some((x) => /russisch/.test(x)));
});

test('die Netze greifen', () => {
  assert.ok(BEWERTUNG.test('Danach können Sie das Feld abhaken.'));
  assert.ok(BEWERTUNG.test('ein Vergleich mit anderen Kindern'));
  assert.ok(BEWERTUNG.test('Punkte zu sammeln'));
  assert.ok(!BEWERTUNG.test('Drei oder vier Fragen sind genug.'));
  assert.ok(DIAGNOSE_ZUGESCHRIEBEN.test('Das sind Anzeichen für eine Störung.'));
  assert.ok(DIAGNOSE_ZUGESCHRIEBEN.test('Verdacht auf eine Entwicklungsverzögerung'));
  // Der Rechtsteil muss ueber Befunde und Empfehlungen reden koennen.
  assert.ok(!DIAGNOSE_ZUGESCHRIEBEN.test('Sie stellt einen Befund fest und gibt eine Empfehlung.'));
  assert.ok(VORHERSAGE.test('Daran erkennen Sie, ob es in der Schule mitkommt.'));
  assert.ok(VORHERSAGE.test('Das Risiko für Leseschwierigkeiten ist dann höher.'));
  // „prognostisch" steht NICHT im Netz: eine Quellenangabe darf die
  // prognostische Guete einer Studie nennen.
  assert.ok(!VORHERSAGE.test('Daseking u. a. zur prognostischen Güte, 2011.'));
  assert.ok(SCHULFAEHIG_ALS_URTEIL.test('Ihr Kind ist noch nicht schulfähig.'));
  assert.ok(!SCHULFAEHIG_ALS_URTEIL.test('Der Rechtsbegriff lautet gesundheitliche Schulfähigkeit.'));
  // Ausgeschriebene Zahlen gehoeren ins Netz (Lehre aus Welle 80).
  assert.ok(KOENNENSALTER.test('Mit sechs Jahren sollte ein Kind das können.'));
  assert.ok(KOENNENSALTER.test('Mit 6 Jahren sollte das gehen.'));
  assert.ok(KOENNENSALTER.test('Ab fünf Jahren muss das sitzen.'));
  assert.ok(!KOENNENSALTER.test('am Ende des siebten Lebensjahres'));
  assert.ok(LESEN_ERWARTET.test('Ihr Kind sollte bis dahin einfache Wörter lesen können.'));
  assert.ok(!LESEN_ERWARTET.test('Lesen und Schreiben beginnen in der Schule.'));
});

test('kein Text der App verletzt die Netze', () => {
  for (const [wo, text] of angebotsTexte(daten)) {
    assert.ok(!KINDFRAGE.test(text), `${wo}: Kindfrage`);
    assert.ok(!BEWERTUNG.test(text), `${wo}: Bewertung`);
    assert.ok(!DIAGNOSE_ZUGESCHRIEBEN.test(text), `${wo}: Diagnose`);
    assert.ok(!VORHERSAGE.test(text), `${wo}: Vorhersage`);
    assert.ok(!SCHULFAEHIG_ALS_URTEIL.test(text), `${wo}: Urteil`);
    assert.ok(!KOENNENSALTER.test(text), `${wo}: Könnensalter`);
    assert.ok(!LESEN_ERWARTET.test(text), `${wo}: Leseerwartung`);
  }
  // Die Pruefung ist umgedreht: geprueft wird der REST.
  assert.ok(angebotsTexte(daten).length > 160);
  for (const feld of Object.keys(NICHT_GEPRUEFT)) assert.ok(feld in daten, feld);
});

test('die Quelle ist geprüft und nennt ihre Zählung samt der Abweichung vom Katalog', () => {
  assert.equal(daten.quelle.geprueft, true);
  assert.match(daten.quelle.nachgezaehlt, /(?<!\d)139(?!\d)/);
  assert.match(daten.quelle.rechte, /НИО 2007/);
  // Der Katalogeintrag nennt S. 301-311 und „Учебная деятельность"; beides ist
  // ungenau, und das steht in der Abweichung.
  assert.match(daten.quelle.abweichung, /300/);
  assert.match(daten.quelle.abweichung, /ПРЕДПОСЫЛКИ|предпосылки/i);
});

test('feldVon und rechtVon finden und finden nicht', () => {
  assert.equal(feldVon(daten, 'f-seelisch').quellPunkte, 7);
  assert.equal(feldVon(daten, 'gibt-es-nicht'), null);
  assert.equal(feldVon(null, 'f-seelisch'), null);
  assert.ok(rechtVon(daten, 'r-wer').antwort.includes('Schulleit'));
  assert.equal(rechtVon(daten, 'gibt-es-nicht'), null);
});
