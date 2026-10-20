// quiz-kern: wiederverwendbarer Quiz-Ablauf für die Lernspiele des Monorepos.
// Entstanden nach der "Regel der zwei": als das zweite Quiz (Kinderrechte-
// Entdecker) den Ablauf der Nachrichten-Detektive brauchte, wurde der Kern
// hierher extrahiert (docs/05, Methoden). Die Apps liefern nur noch Daten
// und Texte. Politik (docs/02) bleibt Sache der App: Netzwerk-Wächter und
// CSP werden dort installiert; der Kern macht keine Netzwerkanfragen.
import { el, vorlesen, mischen } from '../../kinder-ui/js/komponenten.mjs';
import { boot as bootAnzeige } from '../../kinder-ui/js/anzeige.mjs';
import { loescheDaten } from '../../kinder-ui/js/daten-karte.mjs';
import { hilfeInsel } from '../../kinder-ui/js/hilfe-insel.mjs';
import { duettWertung, duettSatz } from './duett.mjs';
import { amZug, staffelWertung, staffelSatz } from './staffel.mjs';

const STANDARD_TEXTE = {
  titel: 'Quiz',
  untertitel: '',
  intro: 'Bist du bereit?',
  startKnopf: '▶️ Los geht’s!',
  vorlesenKnopf: '🔊 Vorlesen',
  datenHinweis: '🧹 Hier gibt es keine Werbung und keine Anmeldung. Gespeichert wird nichts.',
  datenLoeschen: 'Meine Daten löschen',
  hilfeKnopf: '🆘 Ich brauche Hilfe',
  fallWort: 'Frage',
  binaerFrage: 'Stimmt das?',
  binaerJa: '✅ Stimmt',
  binaerNein: '❌ Stimmt nicht',
  richtigTitel: 'Richtig! 🎉',
  falschTitel: 'Nicht ganz …',
  weiterKnopf: 'Weiter ➡️',
  ergebnisKnopf: 'Zum Ergebnis 🏁',
  fertigTitel: 'Geschafft!',
  fertigSatz: 'Du hast alle Fragen durchgearbeitet.',
  nochmalKnopf: '🔁 Noch einmal',
  zumStartKnopf: '🏠 Zum Start',
};

/**
 * Startet ein Quiz im gegebenen Wurzel-Element.
 * @param {{
 *   wurzel: HTMLElement,
 *   daten: { fragen: Array<object> },
 *   rekordSchluessel: string, // früherer Schlüssel der App; wird beim Start einmal entfernt
 *   rundenGroesse?: number,
 *   texte?: Partial<typeof STANDARD_TEXTE>,
 *   elternSeite?: boolean,
 *   hilfeInsel?: boolean,
 * }} konfig
 */
export function starteQuiz(konfig) {
  bootAnzeige(); // gespeicherte Anzeige-Einstellung (Kontrast/Schrift) anwenden (BFSG)
  // Fachkräfte-Quizze haben keine eltern.html. Der Eltern-Link ist deshalb
  // abschaltbar – sonst stünde im Fuß ein Link, der ins Nichts führt.
  const { wurzel, daten, rekordSchluessel, elternSeite = true,
    hilfeInsel: mitHilfeInsel = false } = konfig;
  const rundenGroesse = Math.min(konfig.rundenGroesse ?? daten.fragen.length, daten.fragen.length);
  const t = { ...STANDARD_TEXTE, ...konfig.texte };

  // Der frühere Schlüssel der App (Rekord) wird einmal entfernt. Nur dieser eine Schlüssel, nie clear().
  if (rekordSchluessel) {
    try { localStorage.removeItem(rekordSchluessel); } catch { /* gesperrter Speicher: nichts zu entfernen */ }
  }

  let fragen = [];
  let index = 0;

  // Duett-Modus (Familie): zwei Spieler*innen nacheinander am selben Gerät.
  let duettFragen = [];
  let duettIndex = 0;
  let duettSpieler = 1;
  let antwortenA = [];
  let antwortenB = [];

  // Geschwister-Staffel (kooperativ): zwei Geschwister abwechselnd, ein Team.
  let staffelFragen = [];
  let staffelIndex = 0;
  let staffelEintraege = [];

  const fuss = () =>
    el('footer', { class: 'k-fuss' },
      ...[
        el('span', {}, 'Werbefrei · ohne Anmeldung · Daten bleiben auf diesem Gerät · '),
        elternSeite ? el('a', { href: 'eltern.html' }, '👪 Für Eltern') : null,
        elternSeite ? el('span', {}, ' · ') : null,
        el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz'),
      ].filter(Boolean));

  const zeige = (...knoten) => {
    // replaceChildren filtert NICHT: ein null aus einem Ternär (etwa eine
    // abgeschaltete Karte) würde einen TypeError werfen. Deshalb hier.
    wurzel.replaceChildren(...[
      el('h1', { class: 'k-titel' }, t.titel),
      el('p', { class: 'k-untertitel' }, t.untertitel),
      ...knoten,
      fuss(),
    ].filter((k) => k != null));
    wurzel.querySelector('button')?.focus();
  };

  const vorlesenKnopf = (text) =>
    el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', 'aria-label': 'Text vorlesen', onclick: () => vorlesen(text) }, t.vorlesenKnopf);

  function start() {
    zeige(
      el('section', { class: 'k-karte' },
        el('p', {}, t.intro),
        el('div', { class: 'k-antworten' },
          el('button', { class: 'k-knopf', onclick: starteRunde }, t.startKnopf),
          vorlesenKnopf(`${t.titel}. ${t.untertitel} ${t.intro}`))),
      el('section', { class: 'k-karte' },
        el('p', { style: 'font-weight:600;margin-top:0' }, '👩‍🏫 Für den Unterricht'),
        el('p', { style: 'font-size:0.9rem' }, 'Klassen-Modus: eine Anzeige für die ganze Klasse (Beamer/Tafel). Alle raten laut mit, dann wird gemeinsam aufgelöst – ohne Wertung, ohne Geräte der Kinder, ohne Daten.'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: starteKlassenRunde }, '👩‍🏫 Klassen-Modus starten')),
      el('section', { class: 'k-karte' },
        el('p', { style: 'font-weight:600;margin-top:0' }, '👪 Zu zweit spielen'),
        el('p', { style: 'font-size:0.9rem' }, 'Duett-Modus: Zwei (z. B. Eltern und Kind, Enkel und Oma) antworten nacheinander verdeckt am selben Gerät – danach vergleicht ihr eure Antworten. Nichts wird gespeichert.'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: starteDuett }, '👪 Duett-Modus starten')),
      el('section', { class: 'k-karte' },
        el('p', { style: 'font-weight:600;margin-top:0' }, '🧑‍🤝‍🧒 Für Geschwister'),
        el('p', { style: 'font-size:0.9rem' }, 'Staffel-Modus: Ihr löst abwechselnd Fragen als EIN Team. Nach der Frage des jüngeren Kindes darf das ältere kurz erklären. Kooperativ, nichts wird gespeichert.'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: starteStaffel }, '🧑‍🤝‍🧒 Geschwister-Staffel starten')),
      mitHilfeInsel
        ? el('section', { class: 'k-karte' },
          el('button', {
            class: 'k-knopf k-knopf--neutral k-knopf--klein',
            onclick: () => zeige(hilfeInsel({ zurueck: start })),
          }, t.hilfeKnopf))
        : null,
      el('section', { class: 'k-karte' },
        el('p', {}, t.datenHinweis),
        el('button', {
          class: 'k-knopf k-knopf--neutral k-knopf--klein',
          // Gezielt nur die eigenen Schlüssel der App. localStorage.clear() würde auch
          // die Anzeige-Einstellungen (hoher Kontrast, Schriftgröße) und die
          // Daten der Nachbar-Apps wegwerfen – für ein Kind, das Kontrast
          // braucht, mitten im Spiel ein Rückschritt.
          onclick: () => { loescheDaten(rekordSchluessel); start(); },
        }, t.datenLoeschen)));
  }

  function starteRunde() {
    fragen = mischen(daten.fragen).slice(0, rundenGroesse);
    index = 0;
    frage();
  }

  // Klassen-Modus: eine Anzeige fuer alle, muendliches Raten, gemeinsame
  // Aufloesung - keine Punkte, kein Rekord, keine Geraete der Kinder.
  function starteKlassenRunde() {
    fragen = mischen(daten.fragen).slice(0, rundenGroesse);
    index = 0;
    klassenFrage();
  }

  function klassenFrage() {
    const f = fragen[index];
    const istBinaer = f.typ === 'binaer';
    const antwortListe = istBinaer ? [t.binaerJa, t.binaerNein] : mischen(f.antworten);
    zeige(
      el('section', { class: 'k-karte' },
        el('p', { class: 'k-untertitel' }, `👩‍🏫 Klassen-Modus · ${t.fallWort} ${index + 1} von ${fragen.length} · ${f.kategorie}`),
        el('p', { style: 'font-weight:700;font-size:1.25rem' }, istBinaer ? `„${f.aussage}“` : f.frage),
        istBinaer ? el('p', { style: 'font-weight:600' }, t.binaerFrage) : '',
        el('ul', { style: 'padding-left:1.2rem' },
          ...antwortListe.map((a) => el('li', { style: 'margin:0.4rem 0;font-size:1.1rem' }, a))),
        vorlesenKnopf(istBinaer ? `${f.aussage}. ${t.binaerFrage}` : `${f.frage} Die Möglichkeiten sind: ${antwortListe.join('. Oder: ')}`),
        el('div', { class: 'k-antworten' },
          el('button', { class: 'k-knopf', onclick: () => klassenAufloesung(f) }, '🔍 Auflösung zeigen'))));
  }

  function klassenAufloesung(f) {
    const richtige = f.typ === 'binaer' ? (f.korrekt === 'ja' ? t.binaerJa : t.binaerNein) : f.antworten[f.korrekt];
    zeige(
      el('section', { class: 'k-karte' },
        el('p', { class: 'k-untertitel' }, `👩‍🏫 Klassen-Modus · ${t.fallWort} ${index + 1} von ${fragen.length}`),
        el('div', { class: 'k-hinweis k-hinweis--richtig' },
          el('p', { style: 'font-weight:700;margin-top:0' }, `Richtig ist: ${richtige}`),
          el('p', { style: 'margin-bottom:0' }, f.erklaerung)),
        vorlesenKnopf(`Richtig ist: ${richtige}. ${f.erklaerung}`),
        el('div', { class: 'k-antworten' },
          el('button', {
            class: 'k-knopf',
            onclick: () => {
              index++;
              if (index < fragen.length) klassenFrage();
              else klassenEnde();
            },
          }, index + 1 < fragen.length ? t.weiterKnopf : 'Fertig 🏁'))));
  }

  function klassenEnde() {
    zeige(
      el('section', { class: 'k-karte' },
        el('p', { class: 'k-gross' }, '👩‍🏫'),
        el('p', { style: 'text-align:center;font-weight:700' }, `Alle ${fragen.length} ${t.fallWort === 'Fall' ? 'Fälle' : 'Fragen'} gemeinsam besprochen!`),
        el('div', { class: 'k-antworten' },
          el('button', { class: 'k-knopf', onclick: starteKlassenRunde }, '🔁 Neue Klassen-Runde'),
          el('button', { class: 'k-knopf k-knopf--neutral', onclick: start }, t.zumStartKnopf))));
  }

  function kopf(f) {
    return [
      el('p', { class: 'k-untertitel' }, `${t.fallWort} ${index + 1} von ${fragen.length} · ${f.kategorie}`),
      el('div', { class: 'k-fortschritt', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': fragen.length, 'aria-valuenow': index },
        el('div', { style: `width:${(index / fragen.length) * 100}%` })),
    ];
  }

  function frage() {
    const f = fragen[index];
    if (f.typ === 'binaer') {
      zeige(
        el('section', { class: 'k-karte' },
          ...kopf(f),
          el('p', { style: 'font-weight:600' }, `„${f.aussage}“`),
          vorlesenKnopf(`${f.aussage}. ${t.binaerFrage}`),
          el('div', { class: 'k-antworten' },
            el('button', { class: 'k-knopf', onclick: () => aufloesung(f, f.korrekt === 'ja') }, t.binaerJa),
            el('button', { class: 'k-knopf', onclick: () => aufloesung(f, f.korrekt === 'nein') }, t.binaerNein))));
    } else {
      const richtige = f.antworten[f.korrekt];
      const gemischt = mischen(f.antworten);
      zeige(
        el('section', { class: 'k-karte' },
          ...kopf(f),
          el('p', { style: 'font-weight:600' }, f.frage),
          vorlesenKnopf(`${f.frage} Die Möglichkeiten sind: ${gemischt.join('. Oder: ')}`),
          el('div', { class: 'k-antworten' },
            ...gemischt.map((a) =>
              el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => aufloesung(f, a === richtige) }, a)))));
    }
  }

  function aufloesung(f, richtig) {
    const titel = richtig ? t.richtigTitel : t.falschTitel;
    zeige(
      el('section', { class: 'k-karte' },
        el('div', { class: `k-hinweis ${richtig ? 'k-hinweis--richtig' : 'k-hinweis--falsch'}` },
          el('p', { style: 'font-weight:700;margin-top:0' }, titel),
          el('p', { style: 'margin-bottom:0' }, f.erklaerung)),
        vorlesenKnopf(`${titel} ${f.erklaerung}`),
        el('div', { class: 'k-antworten' },
          el('button', { class: 'k-knopf', onclick: weiter }, index + 1 < fragen.length ? t.weiterKnopf : t.ergebnisKnopf))));
  }

  function weiter() {
    index++;
    if (index < fragen.length) frage();
    else ergebnis();
  }

  function ergebnis() {
    zeige(
      el('section', { class: 'k-karte' },
        el('p', { style: 'text-align:center;font-weight:700;font-size:1.25rem' }, t.fertigTitel),
        el('p', { style: 'text-align:center' }, t.fertigSatz),
        vorlesenKnopf(`${t.fertigTitel} ${t.fertigSatz}`),
        el('div', { class: 'k-antworten' },
          el('button', { class: 'k-knopf', onclick: starteRunde }, t.nochmalKnopf),
          el('button', { class: 'k-knopf k-knopf--neutral', onclick: start }, t.zumStartKnopf))));
  }

  // --- Duett-Modus (Familie): additiv, berührt den Einzel-/Klassen-Ablauf nicht.
  function starteDuett() {
    duettFragen = mischen(daten.fragen).slice(0, rundenGroesse);
    antwortenA = [];
    antwortenB = [];
    duettSpielerStart(1);
  }

  function duettSpielerStart(spieler) {
    duettSpieler = spieler;
    duettIndex = 0;
    zeige(
      el('section', { class: 'k-karte', style: 'text-align:center' },
        el('p', { class: 'k-gross' }, '🙈'),
        el('p', { style: 'font-weight:700' }, `Spieler ${spieler} ist dran!`),
        el('p', {}, spieler === 2 ? 'Gib das Gerät an die zweite Person. Die erste schaut jetzt bitte weg.' : 'Die zweite Person schaut bitte weg. Los geht’s!'),
        el('div', { class: 'k-antworten' },
          el('button', { class: 'k-knopf', onclick: duettFrage }, '▶️ Los'))));
  }

  function duettKopf() {
    return el('p', { class: 'k-untertitel' }, `👪 Duett · Spieler ${duettSpieler} · ${t.fallWort} ${duettIndex + 1} von ${duettFragen.length}`);
  }

  function duettFrage() {
    const f = duettFragen[duettIndex];
    if (f.typ === 'binaer') {
      zeige(
        el('section', { class: 'k-karte' },
          duettKopf(),
          el('p', { style: 'font-weight:600' }, `„${f.aussage}“`),
          vorlesenKnopf(`${f.aussage}. ${t.binaerFrage}`),
          el('div', { class: 'k-antworten' },
            el('button', { class: 'k-knopf', onclick: () => duettAufloesung(f, f.korrekt === 'ja') }, t.binaerJa),
            el('button', { class: 'k-knopf', onclick: () => duettAufloesung(f, f.korrekt === 'nein') }, t.binaerNein))));
    } else {
      const richtige = f.antworten[f.korrekt];
      const gemischt = mischen(f.antworten);
      zeige(
        el('section', { class: 'k-karte' },
          duettKopf(),
          el('p', { style: 'font-weight:600' }, f.frage),
          vorlesenKnopf(`${f.frage} Die Möglichkeiten sind: ${gemischt.join('. Oder: ')}`),
          el('div', { class: 'k-antworten' },
            ...gemischt.map((a) =>
              el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => duettAufloesung(f, a === richtige) }, a)))));
    }
  }

  function duettAufloesung(f, richtig) {
    (duettSpieler === 1 ? antwortenA : antwortenB).push(richtig);
    const titel = richtig ? t.richtigTitel : t.falschTitel;
    zeige(
      el('section', { class: 'k-karte' },
        el('div', { class: `k-hinweis ${richtig ? 'k-hinweis--richtig' : 'k-hinweis--falsch'}` },
          el('p', { style: 'font-weight:700;margin-top:0' }, titel),
          el('p', { style: 'margin-bottom:0' }, f.erklaerung)),
        vorlesenKnopf(`${titel} ${f.erklaerung}`),
        el('div', { class: 'k-antworten' },
          el('button', { class: 'k-knopf', onclick: duettWeiter }, duettIndex + 1 < duettFragen.length ? t.weiterKnopf : (duettSpieler === 1 ? '➡️ Fertig – nächste Person' : t.ergebnisKnopf)))));
  }

  function duettWeiter() {
    duettIndex++;
    if (duettIndex < duettFragen.length) duettFrage();
    else if (duettSpieler === 1) duettSpielerStart(2);
    else duettErgebnis();
  }

  function duettErgebnis() {
    const w = duettWertung(antwortenA, antwortenB);
    const zeile = (nr, ok) => el('span', { style: `display:inline-block;width:1.5rem;text-align:center` }, ok ? '✅' : '⬜');
    zeige(
      el('section', { class: 'k-karte' },
        el('p', { class: 'k-gross' }, w.fuehrung === 'gleich' ? '🤝' : '🏆'),
        el('p', { style: 'text-align:center;font-weight:700' }, duettSatz(w)),
        el('div', { style: 'margin:0.5rem 0' },
          el('div', { style: 'display:flex;justify-content:space-between;font-weight:600' },
            el('span', {}, `Spieler 1: ${w.punkteA}`), el('span', {}, `Spieler 2: ${w.punkteB}`)),
          el('p', { style: 'margin:0.3rem 0;color:#4b5563' }, `Gemeinsam als Team: ${w.team} von ${w.gesamt} · beide richtig: ${w.beide}`)),
        ...w.zeilen.map((z) => el('div', { style: 'display:flex;justify-content:space-between;border-bottom:1px solid var(--k-rand);padding:0.15rem 0' },
          el('span', {}, `${t.fallWort} ${z.nr}`),
          el('span', {}, zeile(z.nr, z.a), ' ', zeile(z.nr, z.b)))),
        vorlesenKnopf(duettSatz(w)),
        el('div', { class: 'k-antworten' },
          el('button', { class: 'k-knopf', onclick: starteDuett }, '🔁 Noch einmal zu zweit'),
          el('button', { class: 'k-knopf k-knopf--neutral', onclick: start }, t.zumStartKnopf))));
  }

  // --- Geschwister-Staffel (kooperativ): additiv, berührt Einzel-/Klassen-/Duett nicht.
  const staffelName = (seite) => (seite === 'jung' ? 'jüngeres Kind' : 'älteres Kind');

  function starteStaffel() {
    staffelFragen = mischen(daten.fragen).slice(0, rundenGroesse);
    staffelIndex = 0;
    staffelEintraege = [];
    staffelFrage();
  }

  function staffelFrage() {
    const f = staffelFragen[staffelIndex];
    const seite = amZug(staffelIndex);
    const kopfEl = el('p', { class: 'k-untertitel' }, `🧑‍🤝‍🧒 Staffel · ${staffelName(seite)} ist dran · ${t.fallWort} ${staffelIndex + 1} von ${staffelFragen.length}`);
    if (f.typ === 'binaer') {
      zeige(
        el('section', { class: 'k-karte' },
          kopfEl,
          el('p', { style: 'font-weight:600' }, `„${f.aussage}“`),
          vorlesenKnopf(`${f.aussage}. ${t.binaerFrage}`),
          el('div', { class: 'k-antworten' },
            el('button', { class: 'k-knopf', onclick: () => staffelAufloesung(f, f.korrekt === 'ja', seite) }, t.binaerJa),
            el('button', { class: 'k-knopf', onclick: () => staffelAufloesung(f, f.korrekt === 'nein', seite) }, t.binaerNein))));
    } else {
      const richtige = f.antworten[f.korrekt];
      const gemischt = mischen(f.antworten);
      zeige(
        el('section', { class: 'k-karte' },
          kopfEl,
          el('p', { style: 'font-weight:600' }, f.frage),
          vorlesenKnopf(`${f.frage} Die Möglichkeiten sind: ${gemischt.join('. Oder: ')}`),
          el('div', { class: 'k-antworten' },
            ...gemischt.map((a) =>
              el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => staffelAufloesung(f, a === richtige, seite) }, a)))));
    }
  }

  function staffelAufloesung(f, richtig, seite) {
    staffelEintraege.push({ spieler: seite, richtig });
    const titel = richtig ? t.richtigTitel : t.falschTitel;
    zeige(
      el('section', { class: 'k-karte' },
        el('div', { class: `k-hinweis ${richtig ? 'k-hinweis--richtig' : 'k-hinweis--falsch'}` },
          el('p', { style: 'font-weight:700;margin-top:0' }, titel),
          el('p', { style: 'margin-bottom:0' }, f.erklaerung)),
        seite === 'jung' ? el('p', { style: 'font-weight:600' }, '🧑 Große*r, erkläre es kurz mit eigenen Worten!') : '',
        vorlesenKnopf(`${titel} ${f.erklaerung}`),
        el('div', { class: 'k-antworten' },
          el('button', { class: 'k-knopf', onclick: staffelWeiter }, staffelIndex + 1 < staffelFragen.length ? t.weiterKnopf : t.ergebnisKnopf))));
  }

  function staffelWeiter() {
    staffelIndex++;
    if (staffelIndex < staffelFragen.length) staffelFrage();
    else staffelErgebnis();
  }

  function staffelErgebnis() {
    const w = staffelWertung(staffelEintraege);
    zeige(
      el('section', { class: 'k-karte' },
        el('p', { class: 'k-gross' }, '🧑‍🤝‍🧒'),
        el('p', { style: 'text-align:center;font-weight:700' }, staffelSatz(w)),
        el('p', { style: 'text-align:center;color:#4b5563' }, 'Zusammen seid ihr stark – als Team gewinnt ihr immer!'),
        vorlesenKnopf(staffelSatz(w)),
        el('div', { class: 'k-antworten' },
          el('button', { class: 'k-knopf', onclick: starteStaffel }, '🔁 Noch eine Staffel'),
          el('button', { class: 'k-knopf k-knopf--neutral', onclick: start }, t.zumStartKnopf))));
  }

  start();
}
