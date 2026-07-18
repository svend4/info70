import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pruefeFragen } from '../../../packages/quiz-kern/src/schema.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/fragen.json', import.meta.url), 'utf8'));

test('Fragenbank: Schema gültig (quiz-kern)', () => {
  assert.deepEqual(pruefeFragen(daten, { mindestFragen: 50 }), []);
});

test('Rechte-Packs vorhanden: Schutz, Förderung, Beteiligung (Katalog Nr. 128–130)', () => {
  const zaehle = (k) => daten.fragen.filter((f) => f.kategorie === k).length;
  // Pack Schutzrechte (№128)
  assert.ok(zaehle('Schutz') >= 10, `Schutz-Pack (ist: ${zaehle('Schutz')})`);
  // Pack Förderrechte (№129) – neue Kategorie
  assert.ok(zaehle('Förderung') >= 10, `Förder-Pack (ist: ${zaehle('Förderung')})`);
  // Pack Beteiligungsrechte (№130)
  assert.ok(zaehle('Mitbestimmung') >= 10, `Beteiligungs-Pack (ist: ${zaehle('Mitbestimmung')})`);
});

test('Pack-Inhalte treffen die Katalog-Themen', () => {
  const text = (k) => JSON.stringify(daten.fragen.filter((f) => f.kategorie === k));
  const schutz = text('Schutz');
  assert.ok(/Gewalt|schlagen|wehtun/.test(schutz), 'Schutz vor Gewalt (Art. 19)');
  assert.ok(/Ausbeut|ausnutzen|Arbeit/.test(schutz), 'Schutz vor Ausbeutung (Art. 32)');
  assert.ok(/Mobbing|gemein/.test(schutz), 'Mobbing/Cybermobbing');
  assert.ok(/116 111|kein Petzen|Hilfe/.test(schutz), 'Hilfe holen ist kein Petzen');
  const foerder = text('Förderung');
  assert.ok(/Bildung|Schule/.test(foerder), 'Recht auf Bildung (Art. 28)');
  assert.ok(/Gesundheit/.test(foerder), 'Recht auf Gesundheit (Art. 24)');
  assert.ok(/Spiel|Erholung|Pause|takt-pause/.test(foerder), 'Spiel/Erholung (Art. 31)');
  const beteiligung = text('Mitbestimmung');
  assert.ok(/Meinung/.test(beteiligung), 'Meinungsfreiheit (Art. 12/13)');
  assert.ok(/Klassenrat|Jugendparlament|Mitmach-Arena/.test(beteiligung), 'Beteiligungsorte');
});

test('Digitale-Rechte-Paket vorhanden (Katalog Nr.1 Top-17)', () => {
  const digital = daten.fragen.filter((f) => f.kategorie === 'Digital');
  assert.ok(digital.length >= 10, 'mindestens 10 Digital-Fragen (2 Basis + 8 Pack)');
  const inhalt = JSON.stringify(digital);
  assert.ok(/DSGVO|Auskunft|Löschung/.test(inhalt), 'Datenschutzrechte (DSGVO) abgedeckt');
  assert.ok(/DSA|digitale Dienste|Werbung/.test(inhalt), 'DSA-Rechte (Melden/Werbeverbot) abgedeckt');
  assert.ok(/KI|General Comment|2021/.test(inhalt), 'KI-Kennzeichnung / GC25 abgedeckt');
});

test('didaktische Balance: beide binaer-Antworten kommen vor', () => {
  const antworten = new Set(daten.fragen.filter((f) => f.typ === 'binaer').map((f) => f.korrekt));
  assert.ok(antworten.has('ja') && antworten.has('nein'), 'sonst lernt das Kind ein Muster statt Abwägen');
});

test('inhaltliche Abdeckung: Digital-Rechte und Hilfe-Angebot sind dabei', () => {
  const kategorien = new Set(daten.fragen.map((f) => f.kategorie));
  assert.ok(kategorien.has('Digital'), 'Kinderrechte im Netz (BzKJ-Fokus Demokratiefähigkeit digital)');
  assert.ok(kategorien.has('Mitbestimmung'), 'Beteiligung (Art. 12) muss vorkommen');
  const hilfe = daten.fragen.some((f) => JSON.stringify(f).includes('116 111'));
  assert.ok(hilfe, 'Nummer gegen Kummer (116 111) als konkretes Hilfeangebot');
});

test('Ränge sind mit einer 12er-Runde erreichbar', () => {
  const maxAb = Math.max(...daten.raenge.map((r) => r.ab));
  assert.ok(maxAb <= 12);
});
