import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import { lokaleStimme, vorlesen } from '../js/komponenten.mjs';

// Der Defekt, den diese Datei festnagelt (Review der Welle 78, dritte Runde):
//
// Sechs Apps hatten eine eigene Funktion `lokaleStimme()`, die korrekt eine
// deutsche Stimme mit `localService === true` sucht - und benutzten das
// Ergebnis nur, um den Vorlese-Knopf überhaupt anzuzeigen. `vorlesen()` setzte
// `utterance.lang`, aber nie `utterance.voice`. Nach der Web Speech API wählt
// der Browser dann die Standardstimme der Sprache, und auf Android ist das für
// de-DE typischerweise die netzbasierte Google-Stimme. GDD und README
// versprachen dagegen „Vorlesen nur mit einer Stimme mit localService === true".
//
// Die Zusage ging also weiter als der Code - und zwar an der Stelle der harten
// Politik „keine externen Netzanfragen", denn `installiereNetzwerkWaechter()`
// patcht nur fetch, XMLHttpRequest und WebSocket; die Sprachausgabe geht daran
// vorbei.

const quelle = await readFile(new URL('../js/komponenten.mjs', import.meta.url), 'utf8');
const appsDir = new URL('../../../apps/', import.meta.url);
const vorhanden = async (u) => { try { await access(u); return true; } catch { return false; } };

/** Ein Minimal-Stub der Web Speech API mit zwei Stimmen. */
function stubbeSprachausgabe(stimmen) {
  const gesprochen = [];
  class Utterance {
    constructor(text) { this.text = text; this.lang = ''; this.rate = 1; this.voice = null; }
  }
  globalThis.SpeechSynthesisUtterance = Utterance;
  globalThis.speechSynthesis = {
    getVoices: () => stimmen,
    cancel: () => {},
    speak: (u) => gesprochen.push(u),
  };
  return gesprochen;
}
function raeumeAuf() {
  delete globalThis.SpeechSynthesisUtterance;
  delete globalThis.speechSynthesis;
}

const LOKAL = { name: 'Anna', lang: 'de-DE', localService: true };
const NETZ = { name: 'Google Deutsch', lang: 'de-DE', localService: false, default: true };

test('vorlesen() SETZT eine Stimme – eine Utterance ohne voice nimmt die Standardstimme', () => {
  // Genau das war der Defekt: ohne `voice` entscheidet der Browser, und die
  // Standardstimme für de-DE kann netzbasiert sein.
  const gesprochen = stubbeSprachausgabe([NETZ, LOKAL]);
  try {
    assert.equal(vorlesen('Guten Tag'), true);
    assert.equal(gesprochen.length, 1);
    assert.ok(gesprochen[0].voice, 'es muss eine Stimme gesetzt sein');
    assert.equal(gesprochen[0].voice.localService, true, 'und zwar eine geräteinterne');
    assert.equal(gesprochen[0].voice.name, 'Anna');
    // Auch wenn die netzbasierte Stimme zuerst in der Liste steht und
    // `default: true` trägt.
    assert.notEqual(gesprochen[0].voice.name, 'Google Deutsch');
  } finally { raeumeAuf(); }
});

test('eine ausdrücklich übergebene Stimme gewinnt', () => {
  const gesprochen = stubbeSprachausgabe([NETZ, LOKAL]);
  try {
    const andere = { name: 'Petra', lang: 'de-AT', localService: true };
    vorlesen('Hallo', 'de-DE', andere);
    assert.equal(gesprochen[0].voice.name, 'Petra');
    // Die Sprache der Stimme gewinnt über das Argument.
    assert.equal(gesprochen[0].lang, 'de-AT');
  } finally { raeumeAuf(); }
});

test('ohne geräteinterne Stimme bleibt voice leer – aber es wird nicht geschwiegen', () => {
  // Apps, die keine Zusage machen, sollen weiter vorlesen können; die sechs
  // Apps mit Zusage zeigen den Knopf in diesem Fall gar nicht an.
  const gesprochen = stubbeSprachausgabe([NETZ]);
  try {
    assert.equal(vorlesen('Hallo'), true);
    assert.equal(gesprochen[0].voice, null);
    assert.equal(gesprochen[0].lang, 'de-DE');
  } finally { raeumeAuf(); }
});

test('lokaleStimme(): null heißt keine, undefined heißt noch nicht geladen', () => {
  let g = stubbeSprachausgabe([]);
  try { assert.equal(lokaleStimme('de'), undefined, 'leere Liste = noch nicht geladen'); } finally { raeumeAuf(); }
  g = stubbeSprachausgabe([NETZ]);
  try { assert.equal(lokaleStimme('de'), null, 'nur netzbasiert = keine lokale'); } finally { raeumeAuf(); }
  g = stubbeSprachausgabe([NETZ, LOKAL]);
  try {
    assert.equal(lokaleStimme('de').name, 'Anna');
    assert.equal(lokaleStimme('de-DE').name, 'Anna', 'der Präfix genügt');
    assert.equal(lokaleStimme('uk'), null, 'andere Sprache, keine Stimme');
  } finally { raeumeAuf(); }
  // Ohne Sprachausgabe im Browser: null, und vorlesen() tut nichts.
  assert.equal(lokaleStimme('de'), null);
  assert.equal(vorlesen('x'), false);
});

test('keine App baut lokaleStimme() nachgebaut nach, und wer sie nutzt, gibt die Stimme weiter', async () => {
  // Eine eigene Kopie in der App ist der Weg, auf dem der Defekt entstanden
  // ist: die Suche war richtig, nur die Übergabe fehlte. Darum liegt die
  // Funktion jetzt genau einmal in kinder-ui.
  const ordner = (await readdir(appsDir, { withFileTypes: true }))
    .filter((o) => o.isDirectory()).map((o) => o.name).sort();
  const eigenbau = [];
  const ohneUebergabe = [];
  let mitZusage = 0;
  for (const name of ordner) {
    const url = new URL(`${name}/app.mjs`, appsDir);
    if (!(await vorhanden(url))) continue;
    const code = (await readFile(url, 'utf8')).replace(/^\s*\/\/.*$/gm, '');
    if (/function\s+lokaleStimme\s*\(/.test(code)) eigenbau.push(`apps/${name}/app.mjs`);
    if (!/lokaleStimme\(/.test(code)) continue;
    mitZusage += 1;
    // Wer die Stimme ermittelt, muss sie auch übergeben - sonst ist die
    // Ermittlung nur ein Türsteher und die Zusage falsch.
    if (!/vorlesen\([^)]*,\s*stimme\s*\)/.test(code)) ohneUebergabe.push(`apps/${name}/app.mjs`);
  }
  assert.deepEqual(eigenbau, [], `lokaleStimme() nachgebaut statt aus kinder-ui genommen:\n${eigenbau.join('\n')}`);
  assert.deepEqual(ohneUebergabe, [],
    `ermittelt eine Gerätestimme, übergibt sie aber nicht an vorlesen():\n${ohneUebergabe.join('\n')}`);
  assert.ok(mitZusage >= 6, `nur ${mitZusage} Apps mit Stimmen-Zusage gefunden – greift das Muster noch?`);
});

test('vorlesen() setzt voice im Quelltext und nicht nur im Test', () => {
  // Strukturelle Gegenprobe: die Zuweisung muss im Modul stehen, damit die
  // Zusage nicht an einem Stub hängt.
  assert.match(quelle, /aeusserung\.voice\s*=/);
  assert.match(quelle, /localService/);
  assert.match(quelle, /getVoices/);
});
