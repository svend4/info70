// quiz-kern: wiederverwendbarer Quiz-Ablauf für die Lernspiele des Monorepos.
// Entstanden nach der "Regel der zwei": als das zweite Quiz (Kinderrechte-
// Entdecker) den Ablauf der Nachrichten-Detektive brauchte, wurde der Kern
// hierher extrahiert (docs/05, Methoden). Die Apps liefern nur noch Daten
// und Texte. Politik (docs/02) bleibt Sache der App: Netzwerk-Wächter und
// CSP werden dort installiert; der Kern macht keine Netzwerkanfragen.
import { el, vorlesen, mischen } from '../../kinder-ui/js/komponenten.mjs';

const STANDARD_TEXTE = {
  titel: 'Quiz',
  untertitel: '',
  intro: 'Bist du bereit?',
  startKnopf: '▶️ Los geht’s!',
  vorlesenKnopf: '🔊 Vorlesen',
  datenHinweis: '🧹 Hier gibt es keine Werbung und keine Anmeldung. Gespeichert wird nur dein Rekord – auf diesem Gerät.',
  datenLoeschen: 'Meine Daten löschen',
  fallWort: 'Frage',
  binaerFrage: 'Stimmt das?',
  binaerJa: '✅ Stimmt',
  binaerNein: '❌ Stimmt nicht',
  richtigTitel: 'Richtig! 🎉',
  falschTitel: 'Nicht ganz …',
  weiterKnopf: 'Weiter ➡️',
  ergebnisKnopf: 'Zum Ergebnis 🏁',
  fertigTitel: 'Geschafft!',
  ergebnisSatz: (punkte, von, rekord) => `${punkte} von ${von} richtig · Rekord: ${rekord}`,
  nochmalKnopf: '🔁 Noch einmal',
  zumStartKnopf: '🏠 Zum Start',
};

/**
 * Startet ein Quiz im gegebenen Wurzel-Element.
 * @param {{
 *   wurzel: HTMLElement,
 *   daten: { fragen: Array<object>, raenge?: Array<{ab:number,titel:string,emoji:string}> },
 *   rekordSchluessel: string,
 *   rundenGroesse?: number,
 *   texte?: Partial<typeof STANDARD_TEXTE>,
 * }} konfig
 */
export function starteQuiz(konfig) {
  const { wurzel, daten, rekordSchluessel } = konfig;
  const rundenGroesse = Math.min(konfig.rundenGroesse ?? daten.fragen.length, daten.fragen.length);
  const t = { ...STANDARD_TEXTE, ...konfig.texte };

  let fragen = [];
  let index = 0;
  let punkte = 0;

  const fuss = () =>
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · Daten bleiben auf diesem Gerät · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz'));

  const zeige = (...knoten) => {
    wurzel.replaceChildren(
      el('h1', { class: 'k-titel' }, t.titel),
      el('p', { class: 'k-untertitel' }, t.untertitel),
      ...knoten,
      fuss());
    wurzel.querySelector('button')?.focus();
  };

  const vorlesenKnopf = (text) =>
    el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', 'aria-label': 'Text vorlesen', onclick: () => vorlesen(text) }, t.vorlesenKnopf);

  function start() {
    const rekord = Number(localStorage.getItem(rekordSchluessel) ?? 0);
    zeige(
      el('section', { class: 'k-karte' },
        el('p', {}, t.intro),
        rekord > 0 ? el('p', {}, `⭐ ${t.ergebnisSatz(rekord, rundenGroesse, rekord).split('·')[0].trim()}`) : '',
        el('div', { class: 'k-antworten' },
          el('button', { class: 'k-knopf', onclick: starteRunde }, t.startKnopf),
          vorlesenKnopf(`${t.titel}. ${t.untertitel} ${t.intro}`))),
      el('section', { class: 'k-karte' },
        el('p', { style: 'font-weight:600;margin-top:0' }, '👩‍🏫 Für den Unterricht'),
        el('p', { style: 'font-size:0.9rem' }, 'Klassen-Modus: eine Anzeige für die ganze Klasse (Beamer/Tafel). Alle raten laut mit, dann wird gemeinsam aufgelöst – ohne Punkte, ohne Geräte der Kinder, ohne Daten.'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: starteKlassenRunde }, '👩‍🏫 Klassen-Modus starten')),
      el('section', { class: 'k-karte' },
        el('p', {}, t.datenHinweis),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => { localStorage.clear(); start(); } }, t.datenLoeschen)));
  }

  function starteRunde() {
    fragen = mischen(daten.fragen).slice(0, rundenGroesse);
    index = 0;
    punkte = 0;
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
    if (richtig) punkte++;
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
    const rekord = Math.max(punkte, Number(localStorage.getItem(rekordSchluessel) ?? 0));
    localStorage.setItem(rekordSchluessel, String(rekord));
    const raenge = daten.raenge ?? [{ ab: 0, titel: '', emoji: '🎉' }];
    const rang = [...raenge].reverse().find((r) => punkte >= r.ab) ?? raenge[0];
    zeige(
      el('section', { class: 'k-karte' },
        el('p', { class: 'k-gross' }, rang.emoji),
        rang.titel ? el('p', { class: 'k-untertitel', style: 'font-weight:700' }, rang.titel) : '',
        el('p', { style: 'text-align:center' }, t.ergebnisSatz(punkte, fragen.length, rekord)),
        vorlesenKnopf(`${t.fertigTitel} ${t.ergebnisSatz(punkte, fragen.length, rekord)}. ${rang.titel}`),
        el('div', { class: 'k-antworten' },
          el('button', { class: 'k-knopf', onclick: starteRunde }, t.nochmalKnopf),
          el('button', { class: 'k-knopf k-knopf--neutral', onclick: start }, t.zumStartKnopf))));
  }

  start();
}
