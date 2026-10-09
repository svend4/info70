// Reim- und Klanggeschichten-Erzeuger (Praleska docs/10, Eltern-Werkzeuge
// Nr. 59, Quelle S. 81 «Пение» und S. 86 «Игра на музыкальных инструментах»).
//
// TRAGENDE ENTSCHEIDUNGEN
//
// 1. ALLES EIGENPRODUKTION. Der Erzeuger setzt Texte aus Bausteinen zusammen,
//    die fuer diese App geschrieben wurden. Kein ueberliefertes Fingerspiel,
//    kein Liedtext, keine Strophe - auch nicht in Teilen. Das ist pruefbar
//    gemacht: `alleTexte` zaehlt den GESAMTEN Ausgaberaum auf, und ein Test
//    vergleicht ihn gegen `bekannteAnfaenge`, eine Liste bekannter deutscher
//    Reim- und Liedanfaenge. Ein Erzeuger, der irgendwann eine ueberlieferte
//    Zeile ausspuckt, faellt damit auf, bevor jemand sie ausdruckt.
//
// 2. DETERMINISTISCH. Gleiche Auswahl, gleicher Text - sonst findet niemand
//    den Reim wieder, der gestern gut lief. `Math.random` kommt nicht vor;
//    der Zufall haengt an (Stoff, Form, Umfang, Variante).
//
// 3. KEINE EINTEILUNG VON KINDERN. Die Quelle markiert zwei der zehn Ziele
//    dieser Abschnitte mit einem Zeichen, das in ihrer Fussnote „Aufgaben
//    fuer Kinder mit relativ hohem Niveau der Musikalitaet" bedeutet -
//    darunter gerade die Maerchen-Improvisation, auf die der Katalogeintrag
//    zielt. Uebernommen ist die Aufgabe, nicht die Einteilung: jede Form
//    nennt `woranSieSehen`, also eine beobachtbare Handlung, und `pruefeDaten`
//    weist jedes Wort ab, das ein Kind einordnet. Gleiche Loesung wie Nr. 55.
//
// 4. KEIN WIRKVERSPRECHEN, KEINE DAUER, KEINE DEZIBELZAHL. Wie in Nr. 55 und
//    Nr. 57: beschrieben wird, was Kinder dieses Alters TUN, nicht was es
//    bewirkt; aufgehoert wird, wenn das Kind sich abwendet; die Lautstaerke
//    ist die Zimmerstimme.
//
// 5. DIE APP SPEICHERT NICHTS. Kein Schluessel, kein Merkzettel, kein
//    Lieblingstext - wer einen Text behalten will, druckt ihn. Vorbild
//    Nr. 55: ein Erzeuger ist ein Katalog, kein Tagebuch.

/** Die drei Formen - geschlossene Liste. */
export const FORMEN = Object.freeze(['klanggeschichte', 'frage-antwort', 'kettenreim']);

/** Wie viele Varianten je Auswahl erreichbar sind. Endlich, damit der
 *  gesamte Ausgaberaum aufzaehlbar und pruefbar bleibt. */
export const VARIANTEN = 8;

/**
 * Einordnung eines Kindes. Laeuft ueber Formen, Stoffe und Vorlagen, NICHT
 * ueber `keinNiveau`: dieses Feld muss die Einteilung nennen, um sie
 * auszuschliessen. Falle A, sechzehntes Mal in diesem Projekt.
 *
 * OHNE abschliessendes `\b` bei den Adjektiven: `musikalisch\b` kann
 * „musikalische" gar nicht treffen, weil zwischen „h" und „e" keine
 * Wortgrenze liegt - dieselbe Falle wie `\b` neben einem Umlaut (docs/02).
 * Beim Bau hat der Test genau das gefunden: das Netz liess „fuer musikalische
 * Kinder" durch.
 */
export const EINTEILUNG = /(?:un)?musikalisch\w*|(?:un)?begabt\w*|talentiert\w*|\b(?:Begabung|Talent|Niveau|Stufe \d|förderbedürftig\w*|auffällig\w*|normal für)/i;

/** Ein Wirkversprechen. */
export const WIRKVERSPRECHEN = /(fördert|trainiert|verbessert|steigert|entwickelt|schult|stärkt)\s[^.!?]{0,30}(Sprache|Sprachentwicklung|Entwicklung|Intelligenz|Gehirn|Wortschatz|Konzentration)|(fördert|unterstützt)\s+die\s+(Sprach|Entwicklung)/i;

/** Eine Vorgabe in Zeit oder Anzahl. Die Zahl der Bilder beschreibt den TEXT
 *  und ist darum keine Vorgabe - gemeint sind Anweisungen an das Kind. */
export const VORGABE = /(täglich|jeden Tag|mindestens|wenigstens|\bmal am Tag\b|\bMinuten\b|\bSekunden\b|\bdB\b|\bDezibel\b)/i;

/** Ein fremder Liedtext hat eine Strophe. Diese App hat keine. */
export const FREMDTEXT = /\bliedtext\b|\bstrophe\b|\brefrain\b|\büberliefert[er]*\s+(text|reim)\b/i;

const nichtLeer = (s) => typeof s === 'string' && s.trim().length > 0;

/** Das letzte Wort eines Satzes, klein und ohne Satzzeichen. */
export function letztesWort(satz) {
  const w = String(satz ?? '').toLowerCase().replace(/[^a-zäöüß\s]/g, '').trim().split(/\s+/);
  return w[w.length - 1] ?? '';
}

/**
 * Reimen sich zwei Zeilen? Die gemeinsame Endung der letzten Woerter muss
 * mindestens zwei Zeichen lang sein und einen Vokal enthalten.
 *
 * Das ist keine Verslehre, sondern eine Stolperdraht: es faengt das Paar, das
 * sich beim Schreiben NICHT reimt, obwohl die App „die zweite Zeile reimt
 * sich" verspricht. Beim Bau hat es zwei Paare gefunden („schaut/kaum",
 * „mit/Schritt"), und eine erste, strengere Fassung der Regel hat
 * „rauf/drauf" faelschlich verworfen - darum zaehlt der Vokal irgendwo in
 * der Endung, nicht an ihrem Anfang.
 */
export function reimtSich(a, b) {
  const x = letztesWort(a);
  const y = letztesWort(b);
  // Dasselbe Wort ist kein Reim, sondern eine Wiederholung.
  if (!x || !y || x === y) return false;
  let n = 0;
  while (n < x.length && n < y.length && x[x.length - 1 - n] === y[y.length - 1 - n]) n += 1;
  const endung = x.slice(x.length - n);
  return endung.length >= 2 && /[aeiouäöü]/.test(endung);
}

/** Der Artikel eines Nominalausdrucks („die Katze" -> „die"). */
export const artikelVon = (s) => String(s ?? '').trim().split(/\s+/)[0] ?? '';

export function stoffVon(daten, id) {
  return (daten?.stoffe ?? []).find((s) => s.id === id) ?? null;
}

export function formVon(daten, id) {
  return (daten?.formen ?? []).find((f) => f.id === id) ?? null;
}

/**
 * Ein kleiner, reproduzierbarer Zufall. `Math.random` waere hier ein Fehler:
 * derselbe Knopf muesste denselben Text geben, und ein Test muesste den
 * Ausgaberaum aufzaehlen koennen.
 */
function streuung(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const waehle = (liste, wuerfel) => liste[Math.floor(wuerfel() * liste.length) % liste.length];

/** Mischt eine Kopie - reproduzierbar, weil der Wuerfel es ist. */
function mische(liste, wuerfel) {
  const a = [...liste];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(wuerfel() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Der erste Buchstabe einer Zeile gehoert gross. Die Figurennamen stehen mit
 *  Artikel in den Daten („die Kuh"), und eine Vorlage, die mit {figur}
 *  anfaengt, haette sonst einen kleinen Satzanfang - beim Bau sofort
 *  aufgefallen an „die Kuh kommt: muuuh." */
const grossAmAnfang = (z) => (z ? z[0].toUpperCase() + z.slice(1) : z);

const fuelle = (vorlage, werte) => grossAmAnfang(
  String(vorlage).replace(/\{(\w+)\}/g, (_, k) => werte[k] ?? `{${k}}`));

/** Die moeglichen Umfaenge einer Form. */
export function umfaengeVon(daten, form) {
  return formVon(daten, form)?.umfaenge ?? [];
}

/**
 * Erzeugt einen Text. Gleiche Auswahl, gleicher Text.
 * @returns {{form: string, stoff: string, titel: string, zeilen: string[], klaenge: string[]}|null}
 */
export function erzeuge(daten, { stoff, form, umfang, variante = 0 } = {}) {
  const s = stoffVon(daten, stoff);
  const f = formVon(daten, form);
  if (!s || !f) return null;
  const moeglich = f.umfaenge ?? [];
  const n = moeglich.includes(umfang) ? umfang : moeglich[0];
  if (!Number.isInteger(n)) return null;
  const v = Number.isInteger(variante) ? ((variante % VARIANTEN) + VARIANTEN) % VARIANTEN : 0;
  const wuerfel = streuung(`${stoff}|${form}|${n}|${v}`);
  const vorlagen = daten?.vorlagen?.[form] ?? {};
  const titel = `${f.zeichen} ${f.name}: ${s.name}`;

  if (form === 'klanggeschichte') {
    const figuren = mische(s.figuren, wuerfel).slice(0, n);
    const zeilen = [fuelle(waehle(vorlagen.anfang ?? [''], wuerfel), { ort: s.ort })];
    for (const fig of figuren) {
      zeilen.push(fuelle(waehle(vorlagen.bild ?? [''], wuerfel),
        { figur: fig.name, laut: fig.laut, klang: fig.koerperklang }));
    }
    zeilen.push(fuelle(waehle(vorlagen.schluss ?? [''], wuerfel),
      { alleLaute: figuren.map((x) => x.laut).join(', ') }));
    return { form, stoff, titel, zeilen, klaenge: figuren.map((x) => x.koerperklang) };
  }

  if (form === 'frage-antwort') {
    const paare = mische(s.reimpaare, wuerfel).slice(0, n);
    const zeilen = [waehle(vorlagen.anfang ?? [''], wuerfel)];
    for (const p of paare) zeilen.push(p.frage, p.antwort);
    zeilen.push(waehle(vorlagen.schluss ?? [''], wuerfel));
    return { form, stoff, titel, zeilen, klaenge: [] };
  }

  // kettenreim: jede Zeile nimmt die Zeile davor mit.
  const glieder = (s.kette?.glieder ?? []).slice(0, n);
  const zeilen = [fuelle(waehle(vorlagen.anfang ?? [''], wuerfel), { ding: s.kette?.ding ?? '' })];
  const bisher = [];
  for (const g of glieder) {
    bisher.unshift(g.satzteil);
    zeilen.push(fuelle(waehle(vorlagen.glied ?? [''], wuerfel), { wer: g.wer, kette: bisher.join(', ') }));
  }
  zeilen.push(waehle(vorlagen.schluss ?? [''], wuerfel));
  return { form, stoff, titel, zeilen, klaenge: [] };
}

/**
 * Der GESAMTE Ausgaberaum: jede Auswahl, jede Variante. Endlich und
 * aufzaehlbar - das ist die Voraussetzung dafuer, dass sich „alles ist
 * Eigenproduktion" pruefen laesst, statt es zu behaupten.
 */
export function alleTexte(daten) {
  const raus = [];
  for (const s of daten?.stoffe ?? []) {
    for (const f of daten?.formen ?? []) {
      for (const u of f.umfaenge ?? []) {
        for (let v = 0; v < VARIANTEN; v++) {
          const t = erzeuge(daten, { stoff: s.id, form: f.id, umfang: u, variante: v });
          if (t) raus.push(t);
        }
      }
    }
  }
  return raus;
}

/** Ein Text als Block - fuer die Zwischenablage und fuers Papier. */
export function textBlock(daten, auswahl) {
  const t = erzeuge(daten, auswahl);
  if (!t) return '';
  const zeilen = [t.titel, '', ...t.zeilen];
  if (t.klaenge.length) zeilen.push('', `Klänge: ${[...new Set(t.klaenge)].join(' · ')}`);
  zeilen.push('', daten?.keineDauer ?? '', daten?.lautstaerke ?? '', daten?.eigenproduktion ?? '');
  return zeilen.join('\n');
}

/** Validiert die Daten. Alles Tragende steht hier, nicht in der Redaktion. */
export function pruefeDaten(daten) {
  const fehler = [];
  const stoffe = daten?.stoffe ?? [];
  const formen = daten?.formen ?? [];
  const aus = daten?.ausgeschlossen ?? [];

  if (stoffe.length < 5) fehler.push('zu wenige Stoffe');
  if (!aus.length) fehler.push('keine Ausschlussliste – was nicht übernommen ist, muss benannt sein');

  const formIds = new Set();
  for (const f of formen) {
    const wo = `Form ${f.id ?? '?'}`;
    if (!FORMEN.includes(f.id)) fehler.push(`${wo}: nicht in der geschlossenen Liste`);
    formIds.add(f.id);
    if (!nichtLeer(f.name)) fehler.push(`${wo}: name fehlt`);
    if (!nichtLeer(f.zeichen)) fehler.push(`${wo}: zeichen fehlt – die App rendert es`);
    if (!nichtLeer(f.wasSieTun)) fehler.push(`${wo}: wasSieTun fehlt`);
    else if (!/\bSie\b/.test(f.wasSieTun)) fehler.push(`${wo}: wasSieTun nennt nicht SIE als die Vorlesende`);
    // Statt eines Niveaus: eine beobachtbare Handlung.
    if (!nichtLeer(f.woranSieSehen)) {
      fehler.push(`${wo}: woranSieSehen fehlt – an die Stelle der Niveau-Einteilung der Quelle gehört eine beobachtbare Handlung`);
    }
    if (!Array.isArray(f.umfaenge) || f.umfaenge.length < 2 || !f.umfaenge.every(Number.isInteger)) {
      fehler.push(`${wo}: umfaenge fehlt oder ist keine Liste ganzer Zahlen`);
    }
    if (!daten?.vorlagen?.[f.id]) fehler.push(`${wo}: keine Satzvorlagen`);
  }
  for (const id of FORMEN) if (!formIds.has(id)) fehler.push(`Form ${id} fehlt in den Daten`);

  const ids = new Set();
  for (const s of stoffe) {
    const wo = `Stoff ${s.id ?? '?'}`;
    if (!s.id) fehler.push(`${wo}: id fehlt`);
    if (ids.has(s.id)) fehler.push(`${wo}: id doppelt`);
    ids.add(s.id);
    if (!nichtLeer(s.name)) fehler.push(`${wo}: name fehlt`);
    if (!nichtLeer(s.zeichen)) fehler.push(`${wo}: zeichen fehlt`);
    if (!nichtLeer(s.ort)) fehler.push(`${wo}: ort fehlt – die Anfangszeile braucht ihn`);
    // Jeder Stoff muss jede Form tragen: sonst steht ein Knopf da, der nichts liefert.
    const genugFiguren = Math.max(...formen.filter((f) => f.id === 'klanggeschichte').flatMap((f) => f.umfaenge ?? [0]), 0);
    if ((s.figuren ?? []).length < genugFiguren) {
      fehler.push(`${wo}: ${(s.figuren ?? []).length} Figuren, die Klanggeschichte braucht ${genugFiguren}`);
    }
    for (const fig of s.figuren ?? []) {
      if (!nichtLeer(fig.name)) fehler.push(`${wo}: eine Figur ohne name`);
      if (!nichtLeer(fig.laut)) fehler.push(`${wo}: Figur ${fig.name} ohne laut`);
      if (!nichtLeer(fig.koerperklang)) fehler.push(`${wo}: Figur ${fig.name} ohne koerperklang – ohne ihn braucht es ein Instrument`);
    }
    const genugPaare = Math.max(...formen.filter((f) => f.id === 'frage-antwort').flatMap((f) => f.umfaenge ?? [0]), 0);
    if ((s.reimpaare ?? []).length < genugPaare) {
      fehler.push(`${wo}: ${(s.reimpaare ?? []).length} Reimpaare, Frage und Antwort braucht ${genugPaare}`);
    }
    // Die Zusage „die zweite Zeile reimt sich" muss stimmen.
    for (const r of s.reimpaare ?? []) {
      if (!nichtLeer(r.frage) || !nichtLeer(r.antwort)) { fehler.push(`${wo}: ein Reimpaar ist unvollständig`); continue; }
      if (!/\?$/.test(r.frage.trim())) fehler.push(`${wo}: „${r.frage.slice(0, 30)}“ ist keine Frage`);
      if (!reimtSich(r.frage, r.antwort)) {
        fehler.push(`${wo}: „${letztesWort(r.frage)}“ und „${letztesWort(r.antwort)}“ reimen sich nicht`);
      }
    }
    // Die Kette: Relativpronomen stimmt mit dem eigenen Artikel.
    const kette = s.kette ?? {};
    const genugGlieder = Math.max(...formen.filter((f) => f.id === 'kettenreim').flatMap((f) => f.umfaenge ?? [0]), 0);
    if (!nichtLeer(kette.ding)) fehler.push(`${wo}: kette.ding fehlt`);
    if ((kette.glieder ?? []).length < genugGlieder) {
      fehler.push(`${wo}: ${(kette.glieder ?? []).length} Kettenglieder, der Kettenreim braucht ${genugGlieder}`);
    }
    for (const g of kette.glieder ?? []) {
      if (!nichtLeer(g.wer) || !nichtLeer(g.satzteil)) { fehler.push(`${wo}: ein Kettenglied ist unvollständig`); continue; }
      if (artikelVon(g.satzteil) !== artikelVon(g.wer)) {
        fehler.push(`${wo}: „${g.wer}, ${g.satzteil}“ – das Relativpronomen passt nicht zum Artikel`);
      }
    }
  }

  // --- Textnetze über Stoffe, Formen und Vorlagen (die Absagefelder und die
  //     Ausschlussliste sind ausgenommen: sie müssen das Verbotene nennen).
  const texte = [];
  const sammle = (o, pfad) => { for (const [k, v] of Object.entries(o ?? {})) {
    if (typeof v === 'string') texte.push([`${pfad}.${k}`, v]);
    else if (v && typeof v === 'object') sammle(v, `${pfad}.${k}`);
  } };
  for (const s of stoffe) sammle(s, `Stoff ${s.id}`);
  for (const f of formen) sammle(f, `Form ${f.id}`);
  sammle(daten?.vorlagen, 'Vorlage');
  for (const [wo, t] of texte) {
    if (EINTEILUNG.test(t)) fehler.push(`Einteilung eines Kindes in ${wo}: „${t.slice(0, 60)}“`);
    if (WIRKVERSPRECHEN.test(t)) fehler.push(`Wirkversprechen in ${wo}: „${t.slice(0, 60)}“`);
    if (VORGABE.test(t)) fehler.push(`Vorgabe in ${wo}: „${t.slice(0, 60)}“`);
    if (FREMDTEXT.test(t)) fehler.push(`ein fremder Text in ${wo}: „${t.slice(0, 60)}“`);
  }

  // --- Die Zusagen stehen in den Daten
  const pflicht = [
    ['hinweis', /Gerät ist in Ihrer Hand/, 'das Gerät gehört dem Erwachsenen'],
    ['wasEsIst', /kein Liederbuch/, 'was die App nicht ist, muss dastehen'],
    ['eigenproduktion', /Eigenproduktion/, 'die Eigenproduktion muss ausgesprochen sein'],
    ['eigenproduktion', /auch nicht in Teilen/, 'und zwar ohne Hintertür'],
    ['keineUebersetzung', /Behauptung/, 'die fehlende Übersetzung muss begründet sein'],
    ['keinNiveau', /teilt Kinder nicht ein/, 'die fehlende Einteilung muss ausgesprochen sein'],
    ['keinNiveau', /Niveau der Musikalität/, 'und die Stelle der Quelle benannt sein'],
    ['keinWirkversprechen', /verspricht nichts/, 'das fehlende Wirkversprechen muss ausgesprochen sein'],
    ['keineDauer', /abwendet/, 'das Maß ist das Abwenden, nicht die Uhr'],
    ['lautstaerke', /Zimmerstimme|ohne Stimmheben/, 'die Lautstärkeregel ohne Zahl'],
    ['instrumente', /kein Instrument/, 'dass es kein Instrument braucht'],
    ['elterntelefon', /0800 111 0 550/, 'das Elterntelefon gehört in ein Eltern-Werkzeug'],
  ];
  for (const [feld, muster, warum] of pflicht) {
    if (!muster.test(String(daten?.[feld] ?? ''))) fehler.push(`${feld}: ${warum}`);
  }

  // --- Die Liste bekannter Anfänge ist die Sperre gegen Übernahmen
  const anfaenge = daten?.bekannteAnfaenge ?? [];
  if (anfaenge.length < 20) fehler.push(`bekannteAnfaenge: ${anfaenge.length} Einträge sind zu wenige für eine Sperre`);
  for (const a of anfaenge) {
    if (a !== a.toLowerCase()) fehler.push(`bekannteAnfaenge: „${a}“ muss klein geschrieben sein`);
  }

  // --- Die Ausschlüsse, die diese App tragen
  for (const [muster, name] of [[/Fingerspiele|Liedtexte/i, 'die überlieferten Texte'],
    [/Nachdichtung/i, 'die Nachdichtungen der Märchen'], [/ukrainische/i, 'die uk/ru-Fassungen'],
    [/Niveau/i, 'die Einteilung nach Niveau'], [/Wirkversprechen/i, 'das Wirkversprechen'],
    [/Dezibel/i, 'die Dezibelzahl'], [/Instrumentarium/i, 'die Instrumentenliste']]) {
    if (!aus.some((a) => muster.test(a.was ?? ''))) fehler.push(`ausgeschlossen: ${name} muss zurückgewiesen werden`);
  }
  for (const a of aus) {
    if (!nichtLeer(a.was)) fehler.push('ausgeschlossen: was fehlt');
    if (!nichtLeer(a.warum)) fehler.push(`ausgeschlossen ${a.quellNr}: warum fehlt – ein Ausschluss ohne Grund ist Redaktion`);
  }

  // --- Quellbilanz
  const z = daten?.quelle?.zahlen ?? {};
  if (z.zieleGesangskreativitaet !== 4) fehler.push('quelle.zahlen: der Abschnitt auf S. 81 trägt 4 Ziele');
  if (z.zieleInstrumente !== 6) fehler.push('quelle.zahlen: der Abschnitt auf S. 86 trägt 6 Ziele');
  if (z.zieleMitZeichen !== 2) fehler.push('quelle.zahlen: zwei dieser Ziele tragen das Niveau-Zeichen');
  if (!/Fußnote mit dieser Bedeutung steht auf S. 80/.test(daten?.quelle?.nachgezaehlt ?? '')) {
    fehler.push('quelle.nachgezaehlt muss sagen, wo die Fußnote zum Zeichen steht');
  }
  if (!/Eigenproduktion/.test(daten?.quelle?.rechte ?? '')) fehler.push('quelle.rechte muss „Eigenproduktion“ aussprechen');
  if (!daten?.quelle?.geprueft) fehler.push('quelle.geprueft fehlt');

  // --- Kyrillisch nur in der Quellenangabe
  const erlaubt = new Set([daten?.quelle?.werk, daten?.quelle?.rechte, daten?.quelle?.nachgezaehlt,
    daten?.quelle?.abweichung, ...(aus.map((a) => a.warum))].filter(Boolean));
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
