import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Projektregeln für diese App. Vorlage: apps/puppentheater-werkstatt/test/regeln.test.mjs, angepasst.
// Die eine Migrationszeile (removeItem des alten Rekord-Schlüssels, Entscheidung 33а) ist die einzige
// Ausnahme bei der Speicherregel. Verneinte Nennungen („keine Punkte“, „kein Rekord“) zählen nicht.
// Die Wertungsprüfung ist eine Stichprobe mit Wortlisten, kein Beweis; neue Texte liest ein Mensch nach.
// Bekannte Grenzen der Wertungsprüfung. Die Liste ist nicht vollständig; sie nennt die Fälle, die bei der Prüfung
// gefunden wurden, und die Richtung, in die die Regel irrt.
// - Nicht erkannt (unsichere Richtung):
//   · Wörter außerhalb der Liste (Lob, Urkunde, Sieger, gewonnen, Auszeichnung, Bestleistung) und Zeichen außerhalb
//     von WERTUNG (✨, 💯).
//   · Brüche („3/5“), weil Brüche in Sachtexten normal sind („1/2 Stunde“).
//   · Prozentangaben im Code, denen ein CSS-Zeichen vorausgeht oder folgt: „(70% richtig)“, „(70%) geschafft“,
//     „Quote:70% richtig“, „Du hast 70%; super“, und vor einem geraden Anführungszeichen oder Backtick (im Code etwa
//     "Quote: 90%"). Mit typografischem Anführungszeichen („Quote: 90%“) wird gemeldet. Die Ausnahmen schützen vor
//     CSS-Werten wie „translate(50%“, „top:50%“ und „font-size: 100%;“. In den Daten werden alle erkannt.
//   · Prozentangaben mit Minuszeichen nach Leerraum („-70% richtig“).
//   · Eine Verneinung mit einem Verb dazwischen („Kein Kind bekommt keine Punkte“) gilt als verneint.
// - Fehlalarme (sichere Richtung; ein Mensch entscheidet): harmlose Wörter mit einem Stamm aus der Liste (Spielplatz,
//   Sternzeichen, Platz nehmen, Punkt zwölf), Verneinung nach der Nennung („Punkte gibt es nicht“), Verneinung über
//   eine Präposition hinweg („keine Lust auf Punkte“), „weder Punkte noch Sterne“, „Keine Punkte oder Sterne.“,
//   „Nicht ein einziger Punkt.“, „Nie wieder Punkte!“, „Zwei von drei Kindern bekommen Punkte.“, „Null von Null ist
//   Null.“, „Kein jeder Punkt.“. Prozentangaben mit einem Leerzeichen oder Komma davor („hsl(120, 50%, 50%)“,
//   „hsl(120,50%,50%)“, „top: 50%“, „width: 50% !important“, „70%px“, „width: 50%“ am Zeilenende) werden gemeldet,
//   wenn danach kein gerades Anführungszeichen oder Backtick, kein Semikolon, keine schließende Klammer und keine
//   Ziffer folgt.
// - Füllwörter zwischen Verneinung und Nennung: „und“, „oder“, „sowie“, „noch“, „mehr“, „einmal“, „überhaupt“ sowie
//   „ein“, „einen“, „einem“, „einer“, „eine“ werden immer übersprungen; „einzige“ und „ganze“ nur nach „kein“ oder
//   „ohne“; „jeden“ nur nach „ohne“. Zwei Verneinungen heben sich auf: „nicht ohne Punkte“ und „Kein Tag ohne Punkte“
//   sind bejaht und werden gemeldet; „Keine Punkte ohne Hilfe“ ebenso (das „ohne“ danach).
// - Netz: erkannt werden die Schnittstellen aus NETZ, jedes Protokoll mit „://“ und fetch nur mit einem Pfad in
//   Anführungszeichen, der mit ./ oder daten/ beginnt; jeder andere fetch-Aufruf (auch mit einer Variablen) wird gemeldet.
//   Nicht erkannt: Schnittstellen außerhalb von NETZ und ein Aufruf über einen Umweg (window['fetch']).

const APP = new URL('../', import.meta.url);
const CODE_DATEIEN = ['index.html', 'app.mjs', 'logik.mjs', 'eltern.html', 'daten/fragen.json'];
const DOKU_DATEIEN = ['README.md', 'GDD.md'];
const PFLICHT = 'Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.';
const MIGRATION = "try { localStorage.removeItem('uhr.rekord'); } catch {}";

// Wortstämme, mit denen eine Wertung angezeigt würde. Davor und danach dürfen Buchstaben stehen, so werden
// Zusammensetzungen (Bonuspunkte, Tagesrekord, Leistungsstufe, Glückssterne) und Beugungen (benotet, eingestuft)
// erfasst. „Note“ und „Rang“ stehen nur am Wortanfang; „Rang“ ohne „Range“ (sonst träfe es RangeError und Range).
// Zahl-von-Zahl und Zahl-aus-Zahl („vier von fünf“, „4 aus 5“, „zwölf von zwanzig“) sind eigene Alternativen.
const WERTUNG = /\p{L}*(?:Punkt|Rekord|Stuf|Stern|Ergebnis|Prozent|Platz|Plätz|Pokal|Medaill|Bestenlist|bewert|benot|Schulnote|Bestnote)\p{L}*|\bNote\p{L}*|\bRäng\p{L}*|\bRang(?!e)\p{L}*|(?<!\p{L})(?:\d+|null|eins|zwei|drei|vier|fünf|fuenf|sechs|sieben|acht|neun|zehn|elf|zwölf|zwoelf|zwolf|dreizehn|vierzehn|fünfzehn|fuenfzehn|sechzehn|siebzehn|achtzehn|neunzehn|zwanzig|dreißig|dreissig|vierzig|fünfzig|fuenfzig|funfzig|sechzig|siebzig|siebenzig|achtzig|neunzig|hundert) (?:von|aus) (?:\d+|null|eins|zwei|drei|vier|fünf|fuenf|sechs|sieben|acht|neun|zehn|elf|zwölf|zwoelf|zwolf|dreizehn|vierzehn|fünfzehn|fuenfzehn|sechzehn|siebzehn|achtzehn|neunzehn|zwanzig|dreißig|dreissig|vierzig|fünfzig|fuenfzig|funfzig|sechzig|siebzig|siebenzig|achtzig|neunzig|hundert)(?!\p{L})|🏆|🌟|🥇|🥈|🥉|🏅|🎖|⭐|★|☆/giu;
// Prozentangaben. In den Daten jede Angabe („70%“). Im Code nur eine, vor der weder ein CSS-Zeichen steht (: ( oder ein
// Minuszeichen nach Leerraum oder Satzzeichen) noch eine Ziffer, und hinter der kein CSS-Zeichen (' " ` ; ) }) oder
// Ziffer folgt. So fallen „Du hast 70%.“, „7-70%“, „Wert-70%“, „70%ige“ und „90%, super!“ auf.
const PROZENT_DATEN = /\d+\s?%/g;
const PROZENT_TEXT = /(?<![:(\d])(?<!(?<![\p{L}\d])-)\d+\s?%(?!['"`;)}\d])/gmu;
// Verneinungswörter. Eine Nennung gilt als verneint, wenn das letzte Wort davor (ohne Füllwörter) eines davon ist.
const VERNEINT = /^(kein|keine|keinen|keinem|keiner|keines|ohne|nicht|nichts|nie|niemals|weder)$/i;
// Füllwörter, die zwischen Verneinung und Nennung immer übersprungen werden: „nie mehr Punkte“, „nicht einmal Punkte“.
// „jeden“ wird nur nach „ohne“ übersprungen (EINZIG-Regel unten), sonst bleibt „nicht jeden Punkt“ bejaht.
const FUELLWOERT = /^(ein|einen|einem|einer|eine|überhaupt|und|oder|sowie|noch|mehr|einmal)$/i;
// „einzige“ und „ganze“ werden nur nach „kein“ oder „ohne“ übersprungen: „keinen einzigen Stern“ ist verneint,
// „nicht einzig Punkte“ dagegen bejaht.
const EINZIG = /^(einzig|ganz)\p{L}*$/iu;
const VOR_EINZIG = /^(kein|keine|keinen|keinem|keiner|keines|ohne)$/i;
// Satzzeichen, die einen Satzteil beenden: eine Verneinung wirkt nur innerhalb des Satzteils.
const SATZTEIL_ENDE = /[.!?;:,()„“"–—]/;
// Adressen mit Protokoll (https, http, ws, wss, ftp …), ohne Protokoll („//cdn.example.com“) und „www.“.
const SCHEMA = /[a-z][a-z0-9+.-]*:\/\//i;
const OHNE_PROTOKOLL = /(?<![:\w])\/\/[\w-]+\.[a-z]{2,}|www\./i;
const IP_ADRESSE = /\b(?:\d{1,3}\.){3}\d{1,3}\b/;
// Netzaufrufe und eingebettete fremde Inhalte, in allen Dateien der App (ohne Beachtung der Groß- und Kleinschreibung).
const NETZ = /XMLHttpRequest|WebSocket|RTCPeerConnection|WebTransport|SharedWorker|sendBeacon|EventSource|importScripts|new Worker|<iframe|<embed|<object/i;

const lese = (datei) => readFile(new URL(datei, APP), 'utf8');
const code = Object.fromEntries(await Promise.all(CODE_DATEIEN.map(async (d) => [d, await lese(d)])));
const doku = Object.fromEntries(await Promise.all(DOKU_DATEIEN.map(async (d) => [d, await lese(d)])));
const paket = JSON.parse(await lese('package.json'));

// Der Quelltext ohne die eine Migrationszeile.
const ohneMigration = (text) => text.split('\n').filter((z) => z.trim() !== MIGRATION).join('\n');

// Ist eine Nennung verneint? davor sind die Wörter des Satzteils vor der Nennung, in Reihenfolge.
// Steht vor dem Verneinungswort noch eine Verneinung („nicht ohne Punkte“), heben sich beide auf: bejaht.
// „Kein Tag ohne Punkte“ ist ebenso bejaht: eine Verneinung vor dem „ohne“ hebt es auf.
const JEDER = /^jede[nrs]?$/i;
const VOR_JEDER = /^ohne$/i;
function istVerneint(davor) {
  const liste = davor.filter((w) => !FUELLWOERT.test(w));
  const letzt = liste.at(-1) ?? '';
  const vor = liste.at(-2) ?? '';
  if ((EINZIG.test(letzt) && VOR_EINZIG.test(vor)) || (JEDER.test(letzt) && VOR_JEDER.test(vor))) liste.pop();
  if (/^ohne$/i.test(liste.at(-1) ?? '') && liste.slice(0, -1).some((w) => VERNEINT.test(w) && !/^ohne$/i.test(w))) return false;
  return VERNEINT.test(liste.at(-1) ?? '') && !VERNEINT.test(liste.at(-2) ?? '');
}

// Die gängigen HTML-Entitäten (&auml;, &shy; …) und Zahlcodes (&#228;) werden gelesen, andere nicht.
const ENTITAETEN = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', shy: '', auml: 'ä', ouml: 'ö', uuml: 'ü', Auml: 'Ä', Ouml: 'Ö', Uuml: 'Ü', szlig: 'ß' };
function entitaeten(text) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, name) => {
    if (name[0] === '#') {
      const cp = name[1] === 'x' || name[1] === 'X' ? parseInt(name.slice(2), 16) : Number(name.slice(1));
      return cp <= 0x10ffff ? String.fromCodePoint(cp) : m;
    }
    return Object.hasOwn(ENTITAETEN, name) ? ENTITAETEN[name] : m;
  });
}

// Nennungen der Muster, die nicht verneint sind. Der Text wird vorher von HTML-Entitäten befreit, in NFC gebracht
// und von unsichtbaren Zeichen befreit, damit weiche Trennzeichen, Entitäten und zerlegte Umlaute die Erkennung nicht verändern.
function bejahteNennungen(roh, muster = [WERTUNG]) {
  const text = entitaeten(roh).normalize('NFC').replace(/\p{Cf}/gu, '');
  const nennungen = [];
  for (const regel of muster) {
    for (const m of text.matchAll(regel)) {
      const davor = text.slice(0, m.index).split(SATZTEIL_ENDE).pop().match(/\p{L}+/gu) ?? [];
      // „keine Punkte ohne Hilfe“: die Verneinung davor und ein „ohne“ danach heben sich auf: bejaht.
      const danach = text.slice(m.index + m[0].length).split(SATZTEIL_ENDE)[0].match(/\p{L}+/u);
      const idiom = /^ohne$/i.test(danach?.[0] ?? '') && istVerneint(davor);
      if (idiom || !istVerneint(davor)) nennungen.push(m[0]);
    }
  }
  return nennungen;
}

test('keine Eingabefelder: kein input, textarea, select, form, contenteditable', () => {
  const muster = /<\s*(input|textarea|select|form)\b|contenteditable|createElement\(\s*['"](input|textarea|select|form)['"]/i;
  for (const [d, text] of Object.entries(code)) assert.ok(!muster.test(text), `${d}: Eingabeelement`);
});

test('Speicher: die einzige Zeile mit localStorage ist die Migration des alten Rekord-Schlüssels', () => {
  const muster = /localStorage|sessionStorage|indexedDB|document\.cookie|\bcaches\b|navigator\.storage/;
  for (const [d, text] of Object.entries(code)) {
    const zeilen = text.split('\n').filter((z) => muster.test(z)).map((z) => z.trim());
    if (d === 'app.mjs') assert.deepEqual(zeilen, [MIGRATION], 'app.mjs: nur die Migrationszeile');
    else assert.deepEqual(zeilen, [], `${d}: Speicher-Zugriff`);
  }
});

// Ein fetch-Aufruf ist nur mit einem lokalen Pfad in Anführungszeichen erlaubt; jedes andere Argument fällt auf.
const FETCH_LOKAL = /^\s*['"`](?:\.\/|daten\/)[^'"`]*['"`]\s*(?:,[^)]*)?$/;
const fetchAufrufe = (text) => [...text.matchAll(/fetch\(([^)]*)\)/g)].map((m) => m[1]).filter((arg) => !FETCH_LOKAL.test(arg));

test('keine externen Adressen, keine Netzaufrufe; fetch nur mit lokalem Pfad', () => {
  for (const [d, text] of Object.entries(code)) {
    assert.ok(!SCHEMA.test(text), `${d}: Adresse mit Protokoll`);
    assert.ok(!OHNE_PROTOKOLL.test(text), `${d}: Adresse ohne Protokoll`);
    assert.ok(!IP_ADRESSE.test(text), `${d}: IP-Adresse`);
    assert.ok(!NETZ.test(text), `${d}: Netzaufruf oder fremder Inhalt`);
    assert.deepEqual(fetchAufrufe(text), [], `${d}: fetch ohne lokalen Pfad in Anführungszeichen`);
  }
  // Die Muster selbst: sie erkennen, was sie erkennen sollen, und lassen einen Kommentar durch.
  assert.ok(SCHEMA.test('<script src="wss://beispiel.example/x.js"></script>'), 'wss:// wird erkannt');
  assert.ok(SCHEMA.test('<a href="ftp://beispiel.example/">x</a>'), 'ftp:// wird erkannt');
  assert.ok(OHNE_PROTOKOLL.test('<script src="//cdn.example.com/x.js"></script>'), 'Adresse ohne Protokoll wird erkannt');
  assert.ok(!OHNE_PROTOKOLL.test('// Kommentar ohne Adresse'), 'ein Kommentar ist keine Adresse');
  assert.ok(IP_ADRESSE.test('Server 192.168.0.1'), 'IP-Adresse wird erkannt');
  assert.ok(NETZ.test('new WebSocket("x")') && NETZ.test('<IFRAME src="x">'), 'Netzaufruf und iframe, auch in Großbuchstaben');
  assert.ok(NETZ.test('new RTCPeerConnection()') && NETZ.test('new SharedWorker("x.js")'), 'WebRTC und SharedWorker werden erkannt');
  assert.deepEqual(fetchAufrufe("fetch('daten/fragen.json').then((r) => r.json())"), [], 'der lokale Pfad ist erlaubt');
  assert.deepEqual(fetchAufrufe("const h = 'cdn.example.com'; fetch(h + '/x.js');"), ["h + '/x.js'"], 'ein Pfad aus einer Variablen fällt auf');
});

test('kein Zufall in den Dateien der App: keine Zufallsquelle, das Mischen liegt in den Komponenten', () => {
  for (const [d, text] of Object.entries(code)) {
    assert.ok(!/Math\.random|crypto\.getRandomValues/.test(text), `${d}: Zufallsquelle`);
  }
});

test('keine Wertung: keine bejahten Punkte, Ränge, Rekorde, Sterne, Noten, Pokale, Medaillen im Code und in den Daten', () => {
  for (const [d, text] of Object.entries(code)) {
    const quelle = d === 'app.mjs' ? ohneMigration(text) : text;
    const muster = [WERTUNG, d === 'daten/fragen.json' ? PROZENT_DATEN : PROZENT_TEXT];
    assert.deepEqual(bejahteNennungen(quelle, muster), [], d);
  }
  // Die Prüfung selbst, mit den Fällen aus dem Kopf: Satzzeichen trennen, verneinte Nennungen gehen durch,
  // Zusammensetzungen, Beugungen und Symbole werden erkannt, Wörter ohne Wertung nicht.
  assert.deepEqual(bejahteNennungen('Kein Stress. Du bekommst Punkte.'), ['Punkte']);
  assert.deepEqual(bejahteNennungen('Keine Punkte, kein Rekord, keine Ränge.'), []);
  assert.deepEqual(bejahteNennungen('Das Kind wird nicht bewertet: keine Punkte, kein Rekord.'), []);
  assert.deepEqual(bejahteNennungen('Du bekommst keinen einzigen Stern.'), []);
  assert.deepEqual(bejahteNennungen('Ohne Punkte und ohne Rekorde.'), []);
  assert.deepEqual(bejahteNennungen('Du bekommst nicht mehr Punkte.'), []);
  assert.deepEqual(bejahteNennungen('Ohne jeden Punkt geht es.'), []);
  assert.deepEqual(bejahteNennungen('Du bekommst niemals Punkte.'), []);
  assert.deepEqual(bejahteNennungen('Es gibt nichts ohne Punkte.'), ['Punkte'], 'zwei Verneinungen heben sich auf');
  assert.deepEqual(bejahteNennungen('Nicht ohne Punkte geht es.'), ['Punkte'], 'zwei Verneinungen heben sich auf');
  assert.deepEqual(bejahteNennungen('Du bekommst nicht viele Punkte.'), ['Punkte']);
  assert.deepEqual(bejahteNennungen('Du bekommst nicht nur Punkte.'), ['Punkte']);
  assert.deepEqual(bejahteNennungen('Du bekommst nicht einzig Punkte.'), ['Punkte']);
  assert.deepEqual(bejahteNennungen('Du bekommst nicht ganz Punkte.'), ['Punkte']);
  assert.deepEqual(bejahteNennungen('Du bekommst Bonuspunkte und einen Tagesrekord.'), ['Bonuspunkte', 'Tagesrekord']);
  assert.deepEqual(bejahteNennungen('Du wirst benotet und eingestuft.'), ['benotet', 'eingestuft']);
  assert.deepEqual(bejahteNennungen('Das ist Ranghöchste und der Rangunterschied.'), ['Ranghöchste', 'Rangunterschied']);
  assert.deepEqual(bejahteNennungen('Am Ende zeigt die App eine Rangliste.'), ['Rangliste']);
  assert.deepEqual(bejahteNennungen('Dein Ergebnis steht unten.'), ['Ergebnis']);
  assert.deepEqual(bejahteNennungen('Du bekommst einen Stern.'), ['Stern']);
  assert.deepEqual(bejahteNennungen('Du bekommst Glückssterne ⭐ und eine Medaille.'), ['Glückssterne', '⭐', 'Medaille']);
  assert.deepEqual(bejahteNennungen('Der Notenspiegel und deine Schulnote stehen hier.'), ['Notenspiegel', 'Schulnote']);
  assert.deepEqual(bejahteNennungen('Du hast vier von fünf richtig.'), ['vier von fünf']);
  assert.deepEqual(bejahteNennungen('Du hast 70% richtig und 5 von 10.', [WERTUNG, PROZENT_TEXT]), ['5 von 10', '70%']);
  assert.deepEqual(bejahteNennungen('Du hast 70%.', [PROZENT_TEXT]), ['70%']);
  assert.deepEqual(bejahteNennungen('<p>Du hast 70%</p>', [PROZENT_TEXT]), ['70%'], 'ein HTML-Tag nach der Angabe');
  assert.deepEqual(bejahteNennungen('top:50%;left:13%; translate(-50%,-50%); transform-origin:50% 100%;', [PROZENT_TEXT]), [], 'CSS-Prozentwerte sind keine Angabe');
  assert.deepEqual(bejahteNennungen('Die Knoten im Netz zeigen nichts.'), [], '„Knoten“ ist keine Wertung');
  assert.deepEqual(bejahteNennungen('Die Orangen liegen im Range.'), [], 'Orange und Range sind keine Wertung');
  // Runde 5: Zahlen bis zwanzig, „aus“, Prozent mit Komma, „ohne“ nach einer Verneinung, „jeden“, Unsichtbares.
  assert.deepEqual(bejahteNennungen('Du hast zwölf von zwanzig richtig.'), ['zwölf von zwanzig']);
  assert.deepEqual(bejahteNennungen('Du hast 4 aus 5 richtig und drei aus fünf.'), ['4 aus 5', 'drei aus fünf']);
  assert.deepEqual(bejahteNennungen('Du hast 90%, super!', [PROZENT_TEXT]), ['90%']);
  assert.deepEqual(bejahteNennungen('Du hast 90 %, das ist toll.', [PROZENT_TEXT]), ['90 %']);
  assert.deepEqual(bejahteNennungen('Kein Tag ohne Punkte.'), ['Punkte'], 'zwei Verneinungen: bejaht');
  assert.deepEqual(bejahteNennungen('Keine Stunde ohne Sterne.'), ['Sterne']);
  assert.deepEqual(bejahteNennungen('Keine Punkte ohne Hilfe.'), ['Punkte']);
  assert.deepEqual(bejahteNennungen('Du gewinnst keine Medaille ohne Training.'), ['Medaille']);
  assert.deepEqual(bejahteNennungen('Es gibt keine Punkte ohne Sterne.'), ['Punkte', 'Sterne']);
  assert.deepEqual(bejahteNennungen('Ohne Sterne keine Punkte.'), [], 'verneint');
  assert.deepEqual(bejahteNennungen('Ohne Hilfe gibt es keine Punkte.'), [], 'verneint');
  assert.deepEqual(bejahteNennungen('Nicht jeden Punkt zählt.'), ['Punkt'], '„jeden“ verneint nur nach „ohne“');
  assert.deepEqual(bejahteNennungen('Ohne jeden Punkt geht es.'), [], 'verneint');
  assert.deepEqual(bejahteNennungen('Punk\u00ADte und Pla\u0308tze.'), ['Punkte', 'Plätze'], 'weiches Trennzeichen und zerlegter Umlaut');
  assert.deepEqual(bejahteNennungen('Pl&auml;tze und Punk&shy;te &#8211; Sterne.'), ['Plätze', 'Punkte', 'Sterne'], 'HTML-Entitäten');
  // Runde 6: Prozent mit Bindestrich, Buchstaben und Endung; Zahlwörter null, hundert und die Zehner.
  assert.deepEqual(bejahteNennungen('Du hast 7-70% richtig und eine 70%ige Quote.', [PROZENT_TEXT]), ['70%', '70%']);
  assert.deepEqual(bejahteNennungen('Wert-70% richtig. Du hast x70% und 4x70%.', [PROZENT_TEXT]), ['70%', '70%', '70%']);
  assert.deepEqual(bejahteNennungen('translate(-50%,-50%) left: -13%', [PROZENT_TEXT]), [], 'CSS mit Minuszeichen');
  assert.deepEqual(bejahteNennungen('Du hast null von zehn richtig.'), ['null von zehn']);
  assert.deepEqual(bejahteNennungen('Du hast hundert von hundert richtig.'), ['hundert von hundert']);
  assert.deepEqual(bejahteNennungen('Du hast dreißig von dreißig richtig.'), ['dreißig von dreißig']);
});

test('Pflichtmarkierung: wo eine Seitenangabe steht (Dokumente, Daten, Code), steht die Markierung in derselben Datei', () => {
  for (const [d, text] of [...Object.entries(doku), ...Object.entries(code)]) {
    if (/S\. \d+/.test(text)) assert.ok(text.includes(PFLICHT), `${d}: Seitenangabe ohne Pflichtmarkierung`);
  }
});

test('Testzahl: README und GDD nennen die Zahl der Tests, die in test/ stehen', async () => {
  let echt = 0;
  for (const d of ['logik.test.mjs', 'regeln.test.mjs']) {
    echt += ((await lese(`test/${d}`)).match(/^test\(/gm) ?? []).length;
  }
  for (const [d, text] of Object.entries(doku)) {
    const nennungen = [...text.matchAll(/(?<![\d,.])(\d+)\s+Tests?(?![\wäöüß])/g)].map((m) => Number(m[1]));
    assert.ok(nennungen.length >= 1, `${d} nennt keine Testzahl`);
    for (const n of nennungen) assert.equal(n, echt, `${d} nennt ${n} Tests, es sind ${echt}`);
  }
});

test('Testskript und Lernziele: das Skript führt beide Testdateien aus; README nennt die Lernziele als Liste', () => {
  assert.match(paket.scripts?.test ?? '', /test\/logik\.test\.mjs/);
  assert.match(paket.scripts?.test ?? '', /test\/regeln\.test\.mjs/);
  assert.match(doku['README.md'], /Lernziele/);
  assert.ok(doku['README.md'].split('\n').filter((z) => z.startsWith('- ')).length >= 3, 'die Lernziele fehlen als Liste');
});
