// Der Stand der 131 Einheiten der Gruppe 2 (Pralęska) als Ableitung aus den Quellen im Repository:
//   docs/plan-praleska-umsetzung.md, Abschnitt 6 (Stand 18.10.2026, alle 131 Zeilen),
//   docs/bauauftraege/index.json (Stand 27.10.2026: Einheiten mit „teilweise“ und die Bilanz),
//   docs/bauauftraege/stand-2026-10-29.json (Ergänzung 29.10.2026, Entscheidung 63),
//   docs/plan-neue-welle.md, Abschnitt 2 (Stufen 1 bis 3, unklar, nicht bauen).
// Der Stand ist keine Quelle. Er zeigt, wie der Stand aus den Quellen folgt, und nennt jede Stelle, an der sie
// einander widersprechen. Werkzeug: tools/gruppe-2-stand.mjs. Der Test prüft die Datei docs/status-gruppe-2-2026-10-29.json
// und die Statuszeilen in docs/10 gegen diese Ableitung.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

/** Abschnittsnamen aus dem Plan 18.10 (und dem Index) auf die Kennung der Einheit. */
export const KENNUNG = {
  'Kinder-Apps 5–7 / 8–12 (docs/10 Z. 279–290 …)': 'KIN',
  'Gemeinsame Apps 3–5': 'GEM',
  'Eltern-Werkzeuge': 'ELT',
  'Kita-Werkzeuge (Fachkräfte)': 'KIT',
  'Content-Pakete, Funktionen, Dokumente': 'CON',
  'Printmaterialien Kita': 'PRI',
};

/** Reihenfolge der Abschnitte im Katalog docs/10 (für die Reihenfolge der Stufe 3). */
export const ABSCHNITT_REIHE = ['KIN', 'GEM', 'ELT', 'KIT', 'CON', 'PRI'];

/** Abschnitte in docs/10: Überschrift und Zahl der Nummern (Nr. 1 entspricht der ersten Zahl). */
export const DOCS10_NUMMERN = { KIN: 0, GEM: 0, ELT: 45, KIT: 66, CON: 0, PRI: 0 };

// Stufen laut docs/plan-neue-welle.md, Abschnitt 2 (Stand 27.10.2026). Stufe 3 folgt aus dem Index: alle Einheiten
// mit Status „teilweise“, die nicht in Stufe 1 oder 2 stehen.
export const STUFE_1 = ['CON-3', 'CON-6', 'CON-9', 'CON-10'];
export const STUFE_2 = ['KIN-17', 'GEM-8', 'GEM-13', 'GEM-14', 'GEM-16', 'GEM-19', 'CON-1', 'CON-4', 'CON-7'];
export const UNKLAR = ['CON-13', 'CON-15', 'PRI-6'];
export const NICHT_BAUEN = ['KIT-18', 'KIT-20', 'CON-17'];

const FAKTEN_REIHE = { faktengeprüft: 1, 'nur Katalogtext': 2, 'Quelle nicht im Repo prüfbar': 3 };

/** Liest den Stand aus den Quellen unter `wurzel` (Pfad zur Repo-Wurzel). Gibt { ausgabe, fehler } zurück. */
export function erzeugeGruppe2Stand(wurzel) {
  const datei = (p) => join(wurzel, p);

  function planZeilen() {
    const teile = readFileSync(datei('docs/plan-praleska-umsetzung.md'), 'utf8').split('\n');
    const start = teile.findIndex((z) => z.startsWith('## 6. Einheiten im Detail'));
    const ende = teile.findIndex((z, i) => i > start && z.startsWith('## 7.'));
    const zeilen = [];
    for (const z of teile.slice(start, ende)) {
      if (!/^\| \d+ \|/.test(z)) continue;
      const [nr, abschnitt, einheit, status, app, faktenstand, naechster] = z.split('|').slice(1, -1).map((s) => s.trim());
      if (!KENNUNG[abschnitt]) throw new Error(`Unbekannter Abschnitt im Plan: ${abschnitt}`);
      zeilen.push({ nr: Number(nr), abschnitt, einheit, status18: status, app: app === '–' ? null : app, faktenstand, naechster });
    }
    return zeilen;
  }

  const idx = JSON.parse(readFileSync(datei('docs/bauauftraege/index.json'), 'utf8'));
  const indexEinheiten = new Map(idx.bauauftraege.map((e) => [e.id, e]));
  const stand = new Map(JSON.parse(readFileSync(datei('docs/bauauftraege/stand-2026-10-29.json'), 'utf8')).einheiten.map((e) => [e.id, e]));
  const ordnerBauauftraege = datei('docs/bauauftraege/');
  const bauauftragDatei = (id) => {
    const treffer = readdirSync(ordnerBauauftraege).filter((f) => f.startsWith(`${id}-`) && f.endsWith('.md'));
    return treffer.length ? `docs/bauauftraege/${treffer[0]}` : null;
  };

  const fehler = [];
  const hinweise = new Map();
  const hinweis = (id, text) => hinweise.set(id, [...(hinweise.get(id) ?? []), text]);

  const einheiten = planZeilen().map((z) => {
    const id = `${KENNUNG[z.abschnitt]}-${z.nr}`;
    const eintrag = indexEinheiten.get(id);
    if (eintrag && eintrag.einheit !== z.einheit && eintrag.app !== z.app) {
      fehler.push(`${id}: Name im Index („${eintrag.einheit}“) passt nicht zum Plan („${z.einheit}“)`);
    }
    // App: Plan 18.10 zuerst; sonst Index (27.10); sonst der Name des Bauauftrags, wenn dieser Ordner eine App hat.
    let app = z.app ?? eintrag?.app ?? null;
    let appQuelle = z.app ? 'Plan 18.10' : eintrag?.app ? 'Index 27.10' : null;
    const bauDatei = bauauftragDatei(id);
    if (!app && bauDatei) {
      const slug = bauDatei.replace(/^.*\//, '').replace(/^[A-Z]+-\d+-/, '').replace(/\.md$/, '');
      if (existsSync(datei(`apps/${slug}/index.html`))) {
        app = slug;
        appQuelle = 'Dateiname des Bauauftrags';
      }
    }
    return {
      id,
      abschnitt: z.abschnitt,
      kennung: KENNUNG[z.abschnitt],
      nr: z.nr,
      einheit: z.einheit,
      app,
      app_quelle: appQuelle,
      faktenstand: z.faktenstand,
      status_18_10: z.status18,
      status_27_10: eintrag ? eintrag.status : null,
      variante_a: /Variante A/.test(z.status18),
      naechster_schritt: z.naechster,
      _status18: z.status18.replace(/\s*\(.*\)$/, ''),
      bauauftrag: bauDatei,
    };
  });

  // Endstatus. Der Index (27.10) führt genau die 62 Einheiten mit „teilweise“; alles andere folgt der Bilanz.
  for (const e of einheiten) {
    if (e.status_27_10 === 'teilweise') {
      e.status = 'teilweise';
    } else if (e._status18 === 'offen') {
      e.status = 'gebaut';
      hinweis(e.id, 'Am 18.10 offen; seit 27.10 nicht mehr im Index mit „teilweise“, daher gebaut (Bilanz 27.10).');
    } else if (e._status18 === 'teilweise') {
      e.status = 'gebaut';
      e.abweichung_18_27 = true;
      hinweis(e.id, 'Abweichung: am 18.10 teilweise, im Index vom 27.10 nicht mehr unter „teilweise“; die Bilanz 27.10 zählt sie als gebaut. Der Grund des Wechsels steht in keiner Quelle.');
    } else {
      e.status = e._status18;
    }
    delete e._status18;
  }

  // Prüfung 1: jede Einheit, die der Index mit „teilweise“ führt, steht im Plan.
  for (const id of indexEinheiten.keys()) {
    if (!einheiten.some((e) => e.id === id)) fehler.push(`${id}: im Index, aber nicht in Abschnitt 6 des Plans`);
  }

  // Prüfung 2: Zählungen gegen die Bilanz des Index (27.10).
  const zaehle = (status) => einheiten.filter((e) => e.status === status).length;
  for (const [status, bilanzSchluessel] of [['gebaut', 'gebaut'], ['teilweise', 'teilweise'], ['unklar', 'unklar'], ['nicht bauen', 'nicht_bauen']]) {
    if (zaehle(status) !== idx.bilanz[bilanzSchluessel]) fehler.push(`Bilanz ${status}: ${zaehle(status)} gezählt, Index ${idx.bilanz[bilanzSchluessel]}`);
  }

  // Stufen
  for (const e of einheiten) {
    if (STUFE_1.includes(e.id)) e.stufe = 1;
    else if (STUFE_2.includes(e.id)) e.stufe = 2;
    else if (UNKLAR.includes(e.id)) e.stufe = 'unklar';
    else if (NICHT_BAUEN.includes(e.id)) e.stufe = 'nicht bauen';
    else if (e.status === 'teilweise') e.stufe = 3;
    else e.stufe = null;
    if (e.status === 'unklar' && !UNKLAR.includes(e.id)) fehler.push(`${e.id}: unklar, aber nicht in der Liste der Stufen`);
  }
  for (const id of [...STUFE_1, ...STUFE_2]) {
    const e = einheiten.find((x) => x.id === id);
    if (!e) fehler.push(`${id}: Stufe laut Plan 27.10, aber nicht in Abschnitt 6`);
    else if (e.status !== 'teilweise' && e.status !== 'gebaut') fehler.push(`${id}: Status ${e.status}`);
  }
  const stufe3 = einheiten.filter((e) => e.stufe === 3);
  if (stufe3.length !== 53) fehler.push(`Stufe 3: ${stufe3.length} Einheiten, Plan 27.10 nennt 53`);

  // Prüfung 3: Ordner und Bauauftrag.
  for (const e of einheiten) {
    const apps = e.app ? e.app.split(',').map((s) => s.trim()) : [];
    e.app_ordner = apps.map((a) => ({ app: a, vorhanden: existsSync(datei(`apps/${a}/index.html`)) }));
    for (const a of e.app_ordner) if (!a.vorhanden) fehler.push(`${e.id}: App-Ordner apps/${a.app} fehlt`);
    if (e.status === 'gebaut' && apps.length === 0) fehler.push(`${e.id}: gebaut, aber keine App genannt`);
    if (e.status === 'teilweise' && apps.length === 0) hinweis(e.id, 'Teilweise ohne App (Plan 18.10: „–“). Ort oder Art des Ergebnisses ist nicht entschieden (Frage 61 und Inventar, Abschnitt 4).');
    if (e.stufe === 3 && !e.bauauftrag) fehler.push(`${e.id}: Stufe 3 ohne Bauauftrag`);
    if (stand.has(e.id)) hinweis(e.id, `Stand 29.10: ${stand.get(e.id).stand_2026_10_29}`);
  }

  // Die Ergänzung 29.10 nennt den Index-Status der Einheit; er muss mit dem Index übereinstimmen.
  for (const [id, s] of stand) {
    const e = einheiten.find((x) => x.id === id);
    if (!e) fehler.push(`${id}: in der Ergänzung 29.10, aber nicht im Plan`);
    else if (s.status_index_27_10 !== e.status_27_10) fehler.push(`${id}: Ergänzung nennt Index-Status ${s.status_index_27_10}, Index hat ${e.status_27_10}`);
  }

  // Stufe 3: Reihenfolge nach Faktenstand (Plan 27.10, Abschnitt 2, Punkt 3), innerhalb nach Katalogreihenfolge.
  const reihenfolge = [...stufe3].sort((a, b) => (FAKTEN_REIHE[a.faktenstand] ?? 9) - (FAKTEN_REIHE[b.faktenstand] ?? 9)
    || ABSCHNITT_REIHE.indexOf(a.kennung) - ABSCHNITT_REIHE.indexOf(b.kennung) || a.nr - b.nr);
  reihenfolge.forEach((e, i) => { e.stufe3_reihenfolge = i + 1; });

  for (const e of einheiten) {
    const h = hinweise.get(e.id);
    if (h) e.hinweise = h;
    delete e.kennung;
  }

  const zahlen = {
    gesamt: einheiten.length,
    gebaut: zaehle('gebaut'),
    teilweise: zaehle('teilweise'),
    unklar: zaehle('unklar'),
    nicht_bauen: zaehle('nicht bauen'),
    davon_variante_a: einheiten.filter((e) => e.variante_a).length,
    stufe_1: einheiten.filter((e) => e.stufe === 1).length,
    stufe_2: einheiten.filter((e) => e.stufe === 2).length,
    stufe_3: stufe3.length,
    stufe_3_faktengeprueft: stufe3.filter((e) => e.faktenstand === 'faktengeprüft').length,
    stufe_3_nur_katalogtext: stufe3.filter((e) => e.faktenstand === 'nur Katalogtext').length,
    stufe_3_quelle_nicht_pruefbar: stufe3.filter((e) => e.faktenstand === 'Quelle nicht im Repo prüfbar').length,
  };

  const ausgabe = {
    erzeugt: 'tools/gruppe-2-stand.mjs (abgeleitet aus Plan 18.10 Abschnitt 6, Index 27.10 und Ergänzung 29.10)',
    hinweis: 'Abgeleiteter Stand, keine Quelle. Maßgeblich sind die Pläne, der Index und die Ergänzung (Entscheidung 63). Nicht von einem Menschen geprüft.',
    zahlen,
    stufe_3_reihenfolge: reihenfolge.map((e) => e.id),
    fehler,
    einheiten,
  };
  return { ausgabe, fehler };
}

/** Zwei Zeilen je Abschnitt für docs/10 (Serie D, Plan 18.10 Abschnitt 7): Stand und offene Einheiten. */
export function docs10Zeilen(ausgabe) {
  const zeilen = {};
  for (const kennung of ABSCHNITT_REIHE) {
    const liste = ausgabe.einheiten.filter((e) => e.kennung === kennung || e.id.startsWith(`${kennung}-`));
    const z = (s) => liste.filter((e) => e.status === s).length;
    const offen = liste.filter((e) => e.status !== 'gebaut');
    const nummer = (e) => (DOCS10_NUMMERN[kennung] ? ` (№${e.nr + DOCS10_NUMMERN[kennung]})` : '');
    const offenText = offen.map((e) => `${e.id}${nummer(e)} ${e.einheit}${e.status === 'teilweise' ? '' : ` [${e.status}]`}`).join('; ');
    zeilen[kennung] = [
      `> **Stand 29.10.2026 (Ableitung tools/gruppe-2-stand.mjs):** ${liste.length} Einheiten: gebaut ${z('gebaut')}, davon Variante A ${liste.filter((e) => e.variante_a).length}; teilweise ${z('teilweise')}; unklar ${z('unklar')}; nicht bauen ${z('nicht bauen')}.`,
      `> **Offen:** ${offenText || 'keine'}.`,
    ].join('\n');
  }
  return zeilen;
}
