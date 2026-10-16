import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as logik from '../logik.mjs';
import {
  BLOECKE, ANTWORTEN, ANLAUFSTELLEN, AUSGESCHLOSSEN, TEILWEISE_AUSGESCHLOSSEN,
  zaehleBlock, zaehlText, offeneAufgaben, berichtText, standText,
} from '../logik.mjs';

const alle = BLOECKE.flatMap((b) => b.aufgaben);

test('vier Blöcke mit den Überschriften der Quelle', () => {
  assert.deepEqual(BLOECKE.map((b) => b.quelle), [
    'Приоритетные задачи педагога-психолога',
    'Работа с детьми',
    'Работа с родителями',
    'Работа с педагогами',
  ]);
});

test('übernommene Aufgaben je Block: 4, 5, 5 und 10', () => {
  assert.deepEqual(BLOECKE.map((b) => b.aufgaben.length), [4, 5, 5, 10]);
  assert.equal(alle.length, 24);
});

test('jede übernommene Aufgabe trägt ihre Seite des Anhangs, exakt wie geprüft', () => {
  assert.deepEqual(BLOECKE.map((b) => b.aufgaben.map((a) => a.seite)), [
    [312, 313, 313, 313],
    [313, 314, 314, 314, 314],
    [315, 315, 315, 315, 315],
    [315, 316, 316, 316, 316, 316, 316, 317, 317, 317],
  ]);
});

test('Kennungen sind eindeutig', () => {
  const ids = alle.map((a) => a.id);
  assert.equal(new Set(ids).size, ids.length, 'doppelte Kennung');
});

test('jede Frage ist eine Frage an die Einrichtung („Ist geregelt …“ oder „Gibt es …“)', () => {
  for (const a of alle) {
    assert.match(a.frage, /^(Ist geregelt|Gibt es)[ ,].*\?$/, a.frage);
  }
});

test('keine Frage betrifft einzelne Kinder, Familien oder Fachkräfte', () => {
  const ausgeschlossen = /soziometr|schulreife|begabung|kategor|diagnos|analyse|verwaltung|verträglich|förderbedarf|konkret|\bTyp\b/i;
  for (const a of alle) {
    assert.ok(!ausgeschlossen.test(a.frage), `Ausschlussbegriff in: ${a.frage}`);
  }
});

test('die Burnout-Aufgabe steht nur auf Einrichtungsebene, mit Hinweis', () => {
  const treffer = alle.filter((a) => a.frage === 'Gibt es Bedingungen, die dem emotionalen Ausbrennen von Fachkräften vorbeugen?');
  assert.equal(treffer.length, 1);
  assert.equal(treffer[0].seite, 317);
  assert.equal(treffer[0].hinweis, 'Hinweis: Bei Überlastung einzelner Personen entscheiden Leitung und Träger. Dieses Werkzeug bewertet keine Person.');
  assert.ok(BLOECKE[3].aufgaben.includes(treffer[0]), 'nicht im Block Arbeit mit dem Team');
});

test('die vier Antworten sind genau diese', () => {
  assert.deepEqual(ANTWORTEN, ['geregelt', 'teilweise', 'nicht geregelt', 'Träger oder extern']);
});

test('Anlaufstellen: fünf Kategorien ohne Kontaktdaten', () => {
  assert.deepEqual(ANLAUFSTELLEN, [
    'Kita-Fachberatung',
    'Erziehungsberatungsstelle für Familien',
    'Frühförderstelle',
    'Schulpsychologischer Dienst',
    'Fachberatung des Trägers',
  ]);
});

test('Ausschlüsse: acht ganz ausgeschlossen mit Seite, eine teilweise (S. 317)', () => {
  assert.deepEqual(AUSGESCHLOSSEN.map((x) => x.seite), [313, 314, 314, 314, 314, 315, 316, 316]);
  assert.deepEqual(TEILWEISE_AUSGESCHLOSSEN.map((x) => x.seite), [317]);
  for (const x of [...AUSGESCHLOSSEN, ...TEILWEISE_AUSGESCHLOSSEN]) {
    assert.ok(x.grund.length > 0, `ohne Begründung: ${x.thema}`);
  }
});

test('zaehleBlock ohne Antworten: alles ohne Antwort', () => {
  const vorrang = BLOECKE[0];
  assert.deepEqual(zaehleBlock(vorrang, new Map()), {
    geregelt: 0, teilweise: 0, 'nicht geregelt': 0, 'Träger oder extern': 0, 'ohne Antwort': 4,
  });
  assert.equal(
    zaehlText(vorrang, new Map()),
    'geregelt: 0, teilweise: 0, nicht geregelt: 0, Träger oder extern: 0, ohne Antwort: 4',
  );
});

test('zaehleBlock zählt je Antwort; unbekannte Antworten und andere Blöcke zählen nicht mit', () => {
  const kinder = BLOECKE[1];
  const antworten = new Map([
    [kinder.aufgaben[0].id, 'geregelt'],
    [kinder.aufgaben[1].id, 'geregelt'],
    [kinder.aufgaben[2].id, 'nicht geregelt'],
    [kinder.aufgaben[3].id, 'ja'],
    [BLOECKE[3].aufgaben[0].id, 'geregelt'],
  ]);
  assert.deepEqual(zaehleBlock(kinder, antworten), {
    geregelt: 2, teilweise: 0, 'nicht geregelt': 1, 'Träger oder extern': 0, 'ohne Antwort': 2,
  });
});

test('Zählung je Block ergibt die Anzahl seiner Fragen, nie eine Summe über alle Blöcke', () => {
  const antworten = new Map(alle.map((a, i) => [a.id, ANTWORTEN[i % ANTWORTEN.length]]));
  for (const block of BLOECKE) {
    const zaehl = zaehleBlock(block, antworten);
    const summe = Object.values(zaehl).reduce((s, n) => s + n, 0);
    assert.equal(summe, block.aufgaben.length, block.quelle);
  }
});

test('offeneAufgaben liefert nur die Fragen mit „nicht geregelt“', () => {
  const team = BLOECKE[3];
  const antworten = new Map([
    [team.aufgaben[0].id, 'nicht geregelt'],
    [team.aufgaben[1].id, 'geregelt'],
    [team.aufgaben[2].id, 'nicht geregelt'],
  ]);
  assert.deepEqual(offeneAufgaben(team, antworten).map((a) => a.id), [team.aufgaben[0].id, team.aufgaben[2].id]);
});

test('standText: Tag, Monat und Jahr ausgeschrieben', () => {
  assert.equal(standText(new Date(2026, 9, 16)), '16. Oktober 2026');
  assert.equal(standText(new Date(2026, 0, 3)), '3. Januar 2026');
});

test('Bericht: Zählung je Block, Fragen mit „nicht geregelt“ mit Seite, ohne Prozentzeichen', () => {
  const vorrang = BLOECKE[0];
  const antworten = new Map([
    [vorrang.aufgaben[0].id, 'nicht geregelt'],
    [vorrang.aufgaben[1].id, 'geregelt'],
  ]);
  const text = berichtText(antworten, new Date(2026, 9, 16));
  assert.ok(text.startsWith('Kita-Unterstützungs-Navigator: Bericht'));
  assert.ok(text.includes('Stand: 16. Oktober 2026'));
  assert.ok(text.includes('Zählung: geregelt: 1, teilweise: 0, nicht geregelt: 1, Träger oder extern: 0, ohne Antwort: 2'));
  assert.ok(text.includes(`- ${vorrang.aufgaben[0].frage} (S. 312)`));
  assert.ok(!text.includes(vorrang.aufgaben[1].frage), 'geregelte Frage taucht im Bericht auf');
  assert.ok(!text.includes('%'), 'Prozentzeichen im Bericht');
});

test('Bericht: ohne markierte Fragen steht ein ausdrücklicher Satz', () => {
  const text = berichtText(new Map(), new Date(2026, 9, 16));
  assert.equal(text.split('Nicht geregelt: keine Frage in diesem Block.').length - 1, 4);
});

test('Bericht: Anlaufstellen-Kontakte stehen nicht drin', () => {
  const text = berichtText(new Map(), new Date(2026, 9, 16));
  for (const name of ANLAUFSTELLEN) assert.ok(!text.includes(name), `Anlaufstelle im Bericht: ${name}`);
});

test('Schnittstelle ohne Summen, Prozente, Ränge, Ampel und Urteile', () => {
  const verboten = /summe|gesamt|prozent|score|punkt|rang|ampel|urteil/i;
  for (const name of Object.keys(logik)) {
    assert.ok(!verboten.test(name), `verbotener Exportname: ${name}`);
  }
});
