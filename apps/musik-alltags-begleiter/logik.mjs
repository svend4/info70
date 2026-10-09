// Musik-Alltags-Begleiter für Eltern (Praleska docs/10, Eltern-Werkzeuge
// Nr. 57, Quelle S. 87-88 «Музыка в повседневной жизни»).
//
// TRAGENDE ENTSCHEIDUNGEN
//
// 1. NOTIERT WIRD DAS TUN DES ERWACHSENEN. Eine gespeicherte Notiz traegt
//    genau drei Angaben: Tag, Gelegenheit, Art. Es gibt KEIN Feld fuer die
//    Reaktion des Kindes - `pruefeNotiz` weist jede weitere Angabe ab. Mit
//    der Frage „hat es gefallen?" wuerde aus einem Zettel ueber mich eine
//    Beobachtung ueber ein Kind, und dafuer ist `apps/meilenstein-begleiter`
//    zustaendig. Genau an diesem Unterschied haengt, dass diese App neben
//    `apps/musikmomente-1-3` stehen darf, die das Protokollieren eines
//    Hoer-Rituals ablehnt: dort ginge es um das Kind, hier um mich.
//
// 2. KEINE AMPEL, KEINE ROTE STUFE, KEINE SERIE. Der Katalogeintrag wollte
//    „Ampel und Tagesstatistik". Eine Ampel ueber sieben Tage ist eine Note
//    fuer den Erwachsenen; eine Serie bestraft den Tag, an dem nichts ging.
//    Gezaehlt wird nur beschreibend: an wie vielen der letzten sieben Tage
//    eine Notiz steht. Kein Anteil, kein „von sieben", kein Soll.
//
// 3. EINE DER SECHS ARTEN IST STILLE. Das ist der strukturelle Grund, warum
//    die Liste nicht als „mehr ist besser" zu lesen ist: wer den Ton
//    ausmacht, hat auch etwas getan.
//
// 4. SIEBEN TAGE, DANN WEG. `beschneide` laeuft beim Laden UND beim
//    Speichern. Ein Jahresverlauf des Familienalltags muesste nirgends
//    liegen; aelteres wird geloescht, nicht archiviert.
//
// 5. KEINE LIEDER. Die Werke stehen in `apps/musikmomente-1-3`, die Reime
//    und Wiegenlieder in `apps/familienschatz-reime`. Zwei Listen waeren
//    zwei Wahrheiten ueber dasselbe, und fremdsprachige Titel ohne
//    Gegenlesen waeren eine Behauptung.

/** Die Arten - geschlossene Liste, und `a-stille` gehoert dazu. */
export const ARTEN = Object.freeze(['a-gesungen', 'a-gesummt', 'a-mitgehoert', 'a-klang', 'a-mitbewegt', 'a-stille']);

/** Das Fenster. Sieben Tage, mehr nicht. */
export const TAGE_FENSTER = 7;

/** Die Schluessel, die eine gespeicherte Notiz tragen darf. Mehr nicht. */
export const NOTIZ_SCHLUESSEL = Object.freeze(['tag', 'gelegenheit', 'art']);

/** Die acht Quellziele. Jedes muss in den Daten vorkommen - als Ritual, als
 *  Art oder als begruendeter Ausschluss (Bauart aus Nr. 49). */
export const ZIELE_QUELLE = 8;

/**
 * Bewertung des Erwachsenen. Laeuft ueber Rituale und Arten, NICHT ueber die
 * Absagefelder: `keineAmpel` muss die Ampel nennen, um sie auszuschliessen.
 */
export const BEWERTUNG = /\bAmpel\b|\brote Stufe\b|🔴|\bPunkte\b|\bScore\b|\bNote\b|\bProzent\b|\d+\s*von\s*\d+|\bSoll\b|\bZiel erreicht\b|\bSerie\b|\bStreak\b|\bSträhne\b|\bin Folge\b/i;

/**
 * Die Frage nach dem Kind. Gezielt auf die KONSTRUKTION (Frage oder
 * Zuschreibung an das Kind), damit `keineReaktion` sie nennen darf - Falle A,
 * zwoelftes Mal in diesem Projekt.
 */
export const REAKTION_DES_KINDES = /(hat|hatte|fand)\s+(es|Ihr Kind)\s+[^.?!]{0,20}(gefallen|Spaß|gut)|wie\s+(hat|reagiert)\s+(es|Ihr Kind)|\bIhr Kind\s+(lachte|freute|reagierte|machte mit|sang mit|wiegte sich|hörte zu)\b/i;

/** Eine Dauer als Vorgabe. Die Zahl der Quelle darf stehen, wo sie als
 *  Angabe der Quelle kenntlich ist - darum laeuft das Netz nur ueber die
 *  Ritual- und Artfelder, nicht ueber `minutenInDerQuelle`. */
export const DAUER_ALS_VORGABE = /(mindestens|wenigstens|täglich|jeden Tag|stell\w*|nimm\w*|hör\w* .{0,12})\s*\d+\s*(Minute|Min\.|Sekunde)/i;

/** Ein Liedtitel oder Liedtext. Hier steht kein Lied. */
export const LIED_IM_TEXT = /\bLiedtext\b|\bStrophe\b|„[A-ZÄÖÜ][^"„“]{4,40}“\s*(singen|anstimmen)/;

const nichtLeer = (s) => typeof s === 'string' && s.trim().length > 0;
const TAG_MUSTER = /^\d{4}-\d{2}-\d{2}$/;

/** Ein Tag als ISO-Datum. Kein Zeitstempel: die Uhrzeit braucht niemand. */
export function istTag(wert) {
  if (typeof wert !== 'string' || !TAG_MUSTER.test(wert)) return false;
  const d = new Date(`${wert}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === wert;
}

/**
 * Der Tag eines Zeitpunkts in LOKALER Zeit. `toISOString()` waere falsch:
 * um 1 Uhr nachts in Deutschland steht dort noch der Vortag, und gerade um
 * diese Uhrzeit notiert jemand das Einschlaflied.
 */
export function tagAus(datum) {
  if (!(datum instanceof Date) || Number.isNaN(datum.getTime())) return '';
  const j = datum.getFullYear();
  const m = String(datum.getMonth() + 1).padStart(2, '0');
  const t = String(datum.getDate()).padStart(2, '0');
  return `${j}-${m}-${t}`;
}

/** Die sieben Tage des Fensters, aelteste zuerst, `heute` zuletzt. */
export function fensterTage(heute) {
  if (!istTag(heute)) return [];
  const basis = new Date(`${heute}T00:00:00Z`).getTime();
  const tage = [];
  for (let i = TAGE_FENSTER - 1; i >= 0; i--) {
    tage.push(new Date(basis - i * 86400000).toISOString().slice(0, 10));
  }
  return tage;
}

/**
 * Prueft eine einzelne Notiz. Unbekannte Schluessel sind ein Fehler und
 * werden nicht stillschweigend mitgespeichert: genau so kaeme ein Feld fuer
 * das Kind durch die Hintertuer herein.
 */
export function pruefeNotiz(notiz, daten) {
  if (!notiz || typeof notiz !== 'object' || Array.isArray(notiz)) return false;
  const schluessel = Object.keys(notiz);
  if (schluessel.some((k) => !NOTIZ_SCHLUESSEL.includes(k))) return false;
  if (!NOTIZ_SCHLUESSEL.every((k) => schluessel.includes(k))) return false;
  if (!istTag(notiz.tag)) return false;
  if (!ARTEN.includes(notiz.art)) return false;
  const ids = (daten?.rituale ?? []).map((r) => r.id);
  return ids.includes(notiz.gelegenheit);
}

/**
 * Schneidet auf das Fenster zu und wirft weg, was nicht hineingehoert.
 * Laeuft beim Laden UND beim Speichern - sonst waechst der Speicher mit
 * jedem Tag weiter, auch wenn die Anzeige nur sieben Tage zeigt.
 */
export function beschneide(notizen, heute, daten) {
  const fenster = new Set(fensterTage(heute));
  if (!fenster.size || !Array.isArray(notizen)) return [];
  const gesehen = new Set();
  const raus = [];
  for (const n of notizen) {
    if (!pruefeNotiz(n, daten)) continue;
    if (!fenster.has(n.tag)) continue;
    // Dieselbe Gelegenheit mit derselben Art an einem Tag ist eine Notiz,
    // nicht zwei: doppelt Antippen darf keine Menge erzeugen.
    const schluessel = `${n.tag}|${n.gelegenheit}|${n.art}`;
    if (gesehen.has(schluessel)) continue;
    gesehen.add(schluessel);
    raus.push({ tag: n.tag, gelegenheit: n.gelegenheit, art: n.art });
  }
  return raus.sort((a, b) => (a.tag < b.tag ? -1 : a.tag > b.tag ? 1 : 0));
}

/** Die Notizen eines Tages. */
export function notizenAm(notizen, tag) {
  return (notizen ?? []).filter((n) => n.tag === tag);
}

/** An wie vielen Tagen des Fensters etwas notiert ist. Beschreibend. */
export function tageMitNotiz(notizen, heute) {
  const fenster = new Set(fensterTage(heute));
  return new Set((notizen ?? []).filter((n) => fenster.has(n.tag)).map((n) => n.tag)).size;
}

/** Welche Arten im Fenster vorkommen - eine Menge, keine Rangliste. */
export function artenImFenster(notizen, heute) {
  const fenster = new Set(fensterTage(heute));
  const drin = new Set((notizen ?? []).filter((n) => fenster.has(n.tag)).map((n) => n.art));
  return ARTEN.filter((a) => drin.has(a));
}

/**
 * Der Satz über das Fenster. Beschreibend, ohne Anteil und ohne Vergleich:
 * keine Quote „3 von 7", kein Durchschnitt, kein „nur", kein „schon wieder".
 */
export function fensterSatz(notizen, heute) {
  const tage = tageMitNotiz(notizen, heute);
  if (!tage) return 'In den letzten sieben Tagen steht hier keine Notiz. Das ist keine Lücke, die aufgefüllt werden muss.';
  const arten = artenImFenster(notizen, heute);
  const wie = tage === 1 ? 'an einem Tag' : `an ${tage} Tagen`;
  const womit = arten.length === 1 ? 'auf eine Art' : `auf ${arten.length} verschiedene Arten`;
  return `In den letzten sieben Tagen haben Sie ${wie} etwas notiert, ${womit}.`;
}

/** Ein Rückblick als Text. Ohne Wertung, mit den Absagen dabei. */
export function bericht(daten, notizen, heute) {
  const zeilen = ['Musik im Alltag – Notizen über mein eigenes Tun', fensterSatz(notizen, heute), ''];
  for (const tag of fensterTage(heute)) {
    const drin = notizenAm(notizen, tag);
    if (!drin.length) continue;
    zeilen.push(tag === heute ? `${tag} (heute)` : tag);
    for (const n of drin) {
      const r = (daten?.rituale ?? []).find((x) => x.id === n.gelegenheit);
      const a = (daten?.arten ?? []).find((x) => x.id === n.art);
      zeilen.push(`- ${r?.name ?? n.gelegenheit}: ${a?.name ?? n.art}`);
    }
    zeilen.push('');
  }
  zeilen.push(daten?.keinZiel ?? '', daten?.keineReaktion ?? '');
  return zeilen.join('\n');
}

/** Validiert die Daten. Alles Tragende steht hier, nicht in der Redaktion. */
export function pruefeDaten(daten) {
  const fehler = [];
  const rituale = daten?.rituale ?? [];
  const arten = daten?.arten ?? [];
  const aus = daten?.ausgeschlossen ?? [];

  if (rituale.length < 8) fehler.push('zu wenige Gelegenheiten');
  if (!aus.length) fehler.push('keine Ausschlussliste – was nicht übernommen ist, muss benannt sein');

  const ids = new Set();
  for (const r of rituale) {
    const wo = `Gelegenheit ${r.id ?? '?'}`;
    if (!r.id) fehler.push(`${wo}: id fehlt`);
    if (ids.has(r.id)) fehler.push(`${wo}: id doppelt`);
    ids.add(r.id);
    if (!nichtLeer(r.name)) fehler.push(`${wo}: name fehlt`);
    if (!nichtLeer(r.warumHier)) fehler.push(`${wo}: warumHier fehlt`);
    if (!nichtLeer(r.ohneGeraet)) fehler.push(`${wo}: ohneGeraet fehlt – ohne das wäre es eine Geräte-App`);
    if (!nichtLeer(r.wasDuTust)) fehler.push(`${wo}: wasDuTust fehlt`);
    // Der Erwachsene ist der Handelnde. Steht er nicht im Satz, beschreibt
    // die Zeile etwas anderes - und dieses Etwas wäre das Kind.
    else if (!/\bSie\b/.test(r.wasDuTust)) fehler.push(`${wo}: wasDuTust nennt nicht SIE als die Handelnde`);
    if (!Number.isInteger(r.quellZiel) || r.quellZiel < 1 || r.quellZiel > ZIELE_QUELLE) {
      fehler.push(`${wo}: quellZiel fehlt oder liegt außerhalb der acht Ziele`);
    }
  }

  const artIds = new Set();
  for (const a of arten) {
    const wo = `Art ${a.id ?? '?'}`;
    if (!ARTEN.includes(a.id)) fehler.push(`${wo}: nicht in der geschlossenen Liste`);
    artIds.add(a.id);
    if (!nichtLeer(a.name)) fehler.push(`${wo}: name fehlt`);
    if (!nichtLeer(a.wasSieTun)) fehler.push(`${wo}: wasSieTun fehlt`);
    else if (!/\bSie\b/.test(a.wasSieTun)) fehler.push(`${wo}: wasSieTun nennt nicht SIE als die Handelnde`);
    if (!nichtLeer(a.ohneKoennen)) fehler.push(`${wo}: ohneKoennen fehlt – niemand muss hier etwas können`);
    if (!Number.isInteger(a.quellZiel)) fehler.push(`${wo}: quellZiel fehlt`);
  }
  for (const id of ARTEN) if (!artIds.has(id)) fehler.push(`Art ${id} fehlt in den Daten`);
  // Die Stille ist keine Zierde, sondern die Sperre gegen „mehr ist besser“.
  const stille = arten.find((a) => a.id === 'a-stille');
  if (stille && !/mehr ist besser|kein leerer Tag/.test(`${stille.ohneKoennen}`)) {
    fehler.push('die Stille-Art muss sagen, warum sie dasteht');
  }

  // --- Jedes der acht Quellziele kommt vor: gebaut oder begründet nicht
  const gebaut = new Set([...rituale, ...arten].map((x) => x.quellZiel).filter(Number.isInteger));
  const abgelehnt = new Set(aus.map((a) => a.quellZiel).filter(Number.isInteger));
  // Ein Ziel kann von der App ALS GANZES eingelöst sein und in keiner Zeile
  // stehen - beim achten ist das so, denn es ist das einzige, das nicht der
  // Kita-Gruppe gilt, sondern den Eltern. Damit das keine Ausrede wird,
  // braucht es ein eigenes Feld mit Begründung.
  const alsGanzes = new Set();
  const ganz = daten?.zielAlsGanzes;
  if (ganz && Number.isInteger(ganz.ziel)) {
    if (!nichtLeer(ganz.warum)) fehler.push('zielAlsGanzes: warum fehlt – dann ist es eine Ausrede');
    else if (!/Einlösung|löst dieses Ziel/.test(ganz.warum)) {
      fehler.push('zielAlsGanzes: es muss dastehen, dass die App dieses Ziel einlöst');
    } else alsGanzes.add(ganz.ziel);
  }
  for (let z = 1; z <= ZIELE_QUELLE; z++) {
    if (!gebaut.has(z) && !abgelehnt.has(z) && !alsGanzes.has(z)) {
      fehler.push(`Quellziel ${z}: weder übernommen noch im Ausschluss begründet`);
    }
  }
  const soll = daten?.quelle?.zahlen ?? {};
  if (soll.zieleQuelle !== ZIELE_QUELLE) fehler.push(`quelle.zahlen: der Abschnitt trägt ${ZIELE_QUELLE} Ziele`);
  for (const z of soll.uebernommeneZiele ?? []) {
    if (!gebaut.has(z) && !alsGanzes.has(z)) {
      fehler.push(`quelle.zahlen nennt Ziel ${z} als übernommen, es steht aber in keiner Zeile`);
    }
  }
  for (const z of soll.nichtUebernommeneZiele ?? []) {
    if (!abgelehnt.has(z)) fehler.push(`quelle.zahlen nennt Ziel ${z} als nicht übernommen, es fehlt aber im Ausschluss`);
    if (gebaut.has(z)) fehler.push(`Ziel ${z} gilt als nicht übernommen und steht trotzdem in einer Zeile`);
  }

  // --- Textnetze über Rituale und Arten. Die Absagefelder sind ausgenommen,
  //     weil sie das Verbotene nennen MÜSSEN.
  const texte = [];
  const sammle = (o, pfad) => { for (const [k, v] of Object.entries(o ?? {})) {
    if (typeof v === 'string') texte.push([`${pfad}.${k}`, v]);
    else if (v && typeof v === 'object') sammle(v, `${pfad}.${k}`);
  } };
  for (const r of rituale) sammle(r, `Gelegenheit ${r.id}`);
  for (const a of arten) sammle(a, `Art ${a.id}`);
  for (const [wo, t] of texte) {
    if (BEWERTUNG.test(t)) fehler.push(`Bewertung in ${wo}: „${t.slice(0, 60)}“`);
    if (REAKTION_DES_KINDES.test(t)) fehler.push(`Reaktion des Kindes in ${wo}: „${t.slice(0, 60)}“`);
    if (DAUER_ALS_VORGABE.test(t)) fehler.push(`Dauer als Vorgabe in ${wo}: „${t.slice(0, 60)}“`);
    if (LIED_IM_TEXT.test(t)) fehler.push(`ein Lied in ${wo}: „${t.slice(0, 60)}“`);
  }

  // --- Die Zusagen stehen in den Daten, nicht nur im Dokument
  const pflicht = [
    ['hinweis', /Gerät ist in Ihrer Hand/, 'das Gerät gehört dem Erwachsenen'],
    ['wasEsIst', /über Ihr eigenes Tun|mein eigenes Tun/, 'der Gegenstand ist das eigene Tun'],
    ['keineReaktion', /kein Feld/, 'das fehlende Feld muss ausgesprochen sein'],
    ['keineReaktion', /Meilenstein-Begleiter/, 'und sagen, wohin die Beobachtung des Kindes gehört'],
    ['keineAmpel', /keine Ampel/, 'die fehlende Ampel muss ausgesprochen sein'],
    ['keineAmpel', /keine rote Stufe/, 'und die fehlende rote Stufe'],
    ['keineSerie', /Keine Serie/, 'die fehlende Serie muss ausgesprochen sein'],
    ['keinZiel', /kein Soll/, 'das fehlende Soll muss ausgesprochen sein'],
    ['keinZiel', /Stille/, 'und die Stille als Gegenbeweis zu „mehr ist besser“'],
    ['wasDasFensterIst', /sieben Tage/, 'das Fenster muss benannt sein'],
    ['wasDasFensterIst', /gelöscht, nicht archiviert/, 'und dass Älteres gelöscht wird'],
    ['minutenInDerQuelle', /Angabe der Quelle/, 'die Minutenzahl ist die der Quelle'],
    ['minutenInDerQuelle', /keine Dauer/, 'und diese App setzt keine'],
    ['minutenInDerQuelle', /abwendet/, 'das Maß ist das Abwenden, nicht die Uhr'],
    ['keineLiederliste', /Musikmomente 1–3/, 'die Werke stehen in der Nachbar-App'],
    ['keineLiederliste', /Familienschatz/, 'und die Reime in der anderen'],
    ['keineUebersetzung', /Behauptung/, 'eine ungegengelesene Übersetzung wäre eine Behauptung'],
    ['bildschirm', /unter drei Jahren ist Bildschirmzeit nicht empfohlen/, 'die Bildschirmaussage des Korpus'],
    ['elterntelefon', /0800 111 0 550/, 'das Elterntelefon gehört in ein Eltern-Werkzeug'],
  ];
  for (const [feld, muster, warum] of pflicht) {
    if (!muster.test(String(daten?.[feld] ?? ''))) fehler.push(`${feld}: ${warum}`);
  }

  // --- Die Gelegenheit, an der geschüttelt wird, nennt das Schütteln
  const troesten = rituale.find((r) => /Trösten/.test(r.name ?? ''));
  if (!troesten) fehler.push('keine Gelegenheit zum Trösten');
  else if (!/schütteln|Schütteln/.test(troesten.grenze ?? '')) {
    fehler.push('Trösten: ohne den Satz zum Schütteln ist diese Zeile nicht druckbar');
  }
  // Und die Hör-Insel nennt ihre fehlende Dauer selbst
  const insel = rituale.find((r) => /Hör-Insel/.test(r.name ?? ''));
  if (!insel) fehler.push('keine Hör-Insel');
  else if (!/Keine Dauer|keine Dauer/.test(insel.grenze ?? '')) {
    fehler.push('Hör-Insel: die fehlende Dauer muss an der Zeile selbst stehen');
  }

  // --- Die vier Ausschlüsse, die diese App tragen
  for (const [muster, name] of [[/Ampel/i, 'die Ampel des Katalogeintrags'],
    [/Serie|Strähne/i, 'die Serie'], [/Reaktion des Kindes/i, 'das Feld für die Reaktion'],
    [/Liederlisten/i, 'die Liederlisten']]) {
    if (!aus.some((a) => muster.test(a.was ?? ''))) fehler.push(`ausgeschlossen: ${name} muss zurückgewiesen werden`);
  }
  for (const a of aus) {
    if (!nichtLeer(a.was)) fehler.push('ausgeschlossen: was fehlt');
    if (!nichtLeer(a.warum)) fehler.push(`ausgeschlossen ${a.quellNr}: warum fehlt – ein Ausschluss ohne Grund ist Redaktion`);
  }
  if (!/Eigenproduktion/.test(daten?.quelle?.rechte ?? '')) fehler.push('quelle.rechte muss „Eigenproduktion“ aussprechen');
  if (!daten?.quelle?.geprueft) fehler.push('quelle.geprueft fehlt');

  // --- Kyrillisch nur in der Quellenangabe
  const erlaubt = new Set([daten?.quelle?.werk, daten?.quelle?.rechte,
    daten?.quelle?.nachgezaehlt, daten?.quelle?.abweichung].filter(Boolean));
  const suchen = (wert, pfad) => {
    if (typeof wert === 'string') {
      if (/[Ѐ-ӿ]/.test(wert) && !erlaubt.has(wert)) fehler.push(`${pfad}: kyrillische Schrift außerhalb der Quellenangabe`);
      return;
    }
    if (Array.isArray(wert)) { wert.forEach((x, i) => suchen(x, `${pfad}[${i}]`)); return; }
    if (wert && typeof wert === 'object') for (const [k, v] of Object.entries(wert)) suchen(v, `${pfad}.${k}`);
  };
  suchen(daten, 'daten');
  return fehler;
}
