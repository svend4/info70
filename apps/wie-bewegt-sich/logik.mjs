// Wie bewegen sich Tiere und Pflanzen? – reine Logik (ohne DOM).
// Ko-Nutzungs-App für 3-5. Praleska docs/10 (Ko-Nutzung Nr. 6).
//
// Die tragende Idee sind vier Aha-Regeln vom Körperbau zur Bewegung.
// Damit die Regeln etwas wert sind, MUSS jedes Tier zu seiner Regel
// passen – und wo eine Regel nicht greift, muss das ausdrücklich als
// Ausnahme markiert und erklärt sein. Der Validator setzt beides durch;
// eine Regel mit stillschweigenden Gegenbeispielen wäre gelogen.
import { mischen } from '../../packages/kinder-ui/js/komponenten.mjs';

/** Höchstens so viele Tiere pro Sitzung (BZgA: sparsame Bildschirmzeit ab 3). */
export const PRO_SESSION = 5;

export function regelFuer(daten, koerperbau) {
  return daten.regeln.find((r) => r.id === koerperbau) ?? null;
}

export function bewegungVon(daten, id) {
  return daten.bewegungen.find((b) => b.id === id) ?? null;
}

/** Passt das Tier zu seiner Regel – oder ist es eine erklärte Ausnahme? */
export function folgtRegel(daten, tier) {
  const regel = regelFuer(daten, tier.koerperbau);
  return Boolean(regel) && regel.bewegung === tier.bewegung;
}

/** Bis zu `limit` Tiere je Sitzung, gemischt und ohne Dubletten. */
export function waehleTiere(bank, limit = PRO_SESSION) {
  return mischen(bank).slice(0, limit);
}

/**
 * Eine Aufgabe. Angeboten werden IMMER alle Bewegungsarten, nur in
 * wechselnder Reihenfolge – eine Vorauswahl wäre schon die halbe Antwort.
 */
export function baueAufgabe(daten, tier, mischenFn = mischen) {
  return {
    tier,
    regel: regelFuer(daten, tier.koerperbau),
    loesung: bewegungVon(daten, tier.bewegung),
    optionen: mischenFn([...daten.bewegungen]),
  };
}

export function istRichtig(aufgabe, bewegungId) {
  return aufgabe.tier.bewegung === bewegungId;
}

/** Validiert die Daten. */
export function pruefeDaten(daten) {
  const fehler = [];
  const { bewegungen, regeln, tiere, pflanzen, schlussIdeen } = daten ?? {};

  if (!Array.isArray(bewegungen) || bewegungen.length < 4) fehler.push('bewegungen: mindestens 4 erwartet');
  const bewegungIds = new Set((bewegungen || []).map((b) => b.id));
  for (const b of bewegungen || []) {
    if (!b.id || !b.name || !b.emoji) fehler.push(`Bewegung ${b.id || '?'}: id/name/emoji fehlt`);
  }

  if (!Array.isArray(regeln) || regeln.length !== 4) fehler.push('regeln: genau 4 Aha-Regeln erwartet');
  const regelIds = new Set();
  for (const r of regeln || []) {
    const wo = `Regel ${r.id || '?'}`;
    if (!r.id || regelIds.has(r.id)) fehler.push(`${wo}: id fehlt oder doppelt`);
    regelIds.add(r.id);
    if (!r.koerper || !r.regel || !r.beispiel || !r.emoji) fehler.push(`${wo}: koerper/regel/beispiel/emoji fehlt`);
    if (!bewegungIds.has(r.bewegung)) fehler.push(`${wo}: Bewegung ${r.bewegung} gibt es nicht`);
  }

  if (!Array.isArray(tiere) || tiere.length < 8) fehler.push('tiere: mindestens 8 erwartet');
  if (Array.isArray(tiere) && Array.isArray(regeln)) {
    const ids = new Set();
    for (const t of tiere) {
      const wo = `Tier ${t.id || '?'}`;
      if (!t.id || ids.has(t.id)) fehler.push(`${wo}: id fehlt oder doppelt`);
      ids.add(t.id);
      if (!t.name || !t.emoji || !t.erklaerung || !t.gespraech) fehler.push(`${wo}: name/emoji/erklaerung/gespraech fehlt`);
      else if (!t.gespraech.trim().endsWith('?')) fehler.push(`${wo}: Gesprächsimpuls soll eine Frage sein`);
      if (!regelIds.has(t.koerperbau)) fehler.push(`${wo}: Körperbau ${t.koerperbau} passt zu keiner Regel`);
      if (!bewegungIds.has(t.bewegung)) fehler.push(`${wo}: Bewegung ${t.bewegung} gibt es nicht`);
      const passt = folgtRegel(daten, t);
      if (!passt && !t.ausnahme) {
        fehler.push(`${wo}: widerspricht seiner Regel, ist aber nicht als Ausnahme markiert`);
      }
      if (passt && t.ausnahme) fehler.push(`${wo}: als Ausnahme markiert, folgt der Regel aber`);
      // Eine Ausnahme muss erklären, warum die Regel hier nicht greift –
      // und zwar in den Daten, nicht im Code. Sonst müsste die App den
      // Grund raten, sobald jemand eine zweite Ausnahme einträgt.
      if (t.ausnahme && !/Regel/.test(t.erklaerung || '')) {
        fehler.push(`${wo}: Ausnahme ohne Erklärung, warum die Regel nicht gilt`);
      }
      if (t.ausnahme && (!t.ausnahmeGrund || t.ausnahmeGrund.length < 30)) {
        fehler.push(`${wo}: Ausnahme braucht einen eigenen ausnahmeGrund für die Anzeige`);
      }
      if (!t.ausnahme && t.ausnahmeGrund) fehler.push(`${wo}: ausnahmeGrund ohne Ausnahme`);
    }
    for (const r of regeln) {
      if (!tiere.some((t) => t.koerperbau === r.id && !t.ausnahme)) {
        fehler.push(`Regel ${r.id}: kein Tier, das sie zeigt`);
      }
    }
    if (!tiere.some((t) => t.ausnahme)) {
      fehler.push('tiere: keine einzige Ausnahme – eine Regel ohne Gegenbeispiel wirkt größer, als sie ist');
    }
  }

  if (!Array.isArray(pflanzen) || pflanzen.length < 3) fehler.push('pflanzen: mindestens 3 erwartet');
  for (const p of pflanzen || []) {
    if (!p.name || !p.emoji || !p.bewegung || !p.versuch) fehler.push(`Pflanze ${p.id || '?'}: unvollständig`);
    else if (p.versuch.length < 50) fehler.push(`Pflanze ${p.id}: Versuch zu knapp`);
  }

  if (!Array.isArray(schlussIdeen) || schlussIdeen.length < 3) {
    fehler.push('schlussIdeen: mindestens 3 erwartet (die Sitzung endet offline)');
  }
  return fehler;
}
