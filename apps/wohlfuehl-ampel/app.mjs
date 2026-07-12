// Wohlfühl-Ampel Gruppe: Tages-Ampel zum emotionalen Wohlbefinden.
// Zielgruppe: FACHKRÄFTE (Kita/Krippe, Kinder 1-7). Die Fachkraft legt
// Kinder als selbstgewählte Kürzel an (max 3 Zeichen, KEINE Namen) und
// tippt pro Kind und Tag eine Ampel plus optionales Kontext-Tag aus einer
// festen Liste (kein Freitext - Datensparsamkeit). Wochenansicht je Kind,
// sanfter Handlungs-Impuls bei >= 3 Rot in Folge.
// Bewusst OHNE Score, OHNE Ranking, OHNE Kind-Vergleich: Beobachtung,
// keine Diagnose. Alles bleibt lokal; Export/Import nur als Datei.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import {
  AMPELN, KONTEXTE, MAX_KINDER, MAX_KUERZEL_LAENGE, IMPULS_SCHWELLE,
  tagesSchluessel, wochenSicht, brauchtImpuls, pruefeKuerzel,
} from './logik.mjs';
import { packeKoffer, pruefeKoffer, vereinigeKoffer } from './ampel-koffer.mjs';

installiereNetzwerkWaechter();

const DATEN_SCHLUESSEL = 'wa.daten';
const app = document.getElementById('app');

const lade = () => JSON.parse(localStorage.getItem(DATEN_SCHLUESSEL) ?? 'null') ?? { kinder: [], eintraege: {} };
const speichere = (d) => localStorage.setItem(DATEN_SCHLUESSEL, JSON.stringify(d));

const WOCHENTAGE = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
const PUNKTE = { gruen: '🟢', gelb: '🟡', rot: '🔴' };
const IMPULSE = [
  'Feste Bezugsperson-Zeit einplanen: kurze 1:1-Momente beim Ankommen, Spielen oder Abholen.',
  'Elterngespräch anbieten: Was hat sich zu Hause verändert? Was hilft dem Kind gerade?',
  'Dem Kind seinen Beschwerdeweg zeigen: Wem kann es sagen, wenn etwas nicht gut ist? (Beschwerdeverfahren für Kinder nach § 45 SGB VIII)',
  'Im Team besprechen und gemeinsam weiter beobachten; bei anhaltender Sorge Fachberatung hinzuziehen.',
];

let gewaehlterTag = tagesSchluessel();
let meldung = null; // {ok, text} für Import/Export/Anlegen

function wochentag(tagKey) {
  const [j, m, t] = tagKey.split('-').map(Number);
  return WOCHENTAGE[new Date(j, m - 1, t).getDay()];
}

function setzeAmpel(kuerzel, farbe) {
  const d = lade();
  const tage = d.eintraege[kuerzel] ?? {};
  const aktuell = tage[gewaehlterTag];
  if (aktuell?.ampel === farbe) delete tage[gewaehlterTag]; // nochmal tippen = Eintrag entfernen
  else tage[gewaehlterTag] = { ampel: farbe, kontext: aktuell?.kontext ?? null };
  d.eintraege[kuerzel] = tage;
  speichere(d);
  render();
}

function setzeKontext(kuerzel, kontext) {
  const d = lade();
  const eintrag = d.eintraege[kuerzel]?.[gewaehlterTag];
  if (!eintrag) return;
  eintrag.kontext = eintrag.kontext === kontext ? null : kontext;
  speichere(d);
  render();
}

function entferneKind(kuerzel) {
  if (!confirm(`Kürzel „${kuerzel}" und alle zugehörigen Einträge löschen?`)) return;
  const d = lade();
  d.kinder = d.kinder.filter((k) => k !== kuerzel);
  delete d.eintraege[kuerzel];
  speichere(d);
  render();
}

function kindKarte(kuerzel, eintraege) {
  const eintrag = eintraege[gewaehlterTag] ?? null;
  const woche = wochenSicht(eintraege, gewaehlterTag);
  const impuls = brauchtImpuls(woche);

  return el('section', { class: 'k-karte' },
    el('div', { style: 'display:flex;justify-content:space-between;align-items:baseline;gap:0.5rem' },
      el('h2', { style: 'margin:0;font-size:1.15rem' }, `🧒 ${kuerzel}`),
      el('button', {
        class: 'k-knopf k-knopf--neutral k-knopf--klein',
        'aria-label': `Kürzel ${kuerzel} löschen`,
        onclick: () => entferneKind(kuerzel),
      }, '🗑️')),

    el('p', { style: 'font-weight:600;margin:0.6rem 0 0.4rem' },
      `Wie geht es ${kuerzel} ${gewaehlterTag === tagesSchluessel() ? 'heute' : `am ${gewaehlterTag}`}?`),
    el('div', { style: 'display:flex;gap:0.5rem;flex-wrap:wrap' },
      ...AMPELN.map((a) =>
        el('button', {
          class: `k-knopf k-knopf--klein ${eintrag?.ampel === a.code ? '' : 'k-knopf--neutral'}`,
          'aria-pressed': String(eintrag?.ampel === a.code),
          onclick: () => setzeAmpel(kuerzel, a.code),
        }, `${a.punkt} ${a.name}`))),

    eintrag
      ? el('div', {},
          el('p', { style: 'font-size:0.85rem;margin:0.6rem 0 0.3rem;color:#4b5563' }, 'Kontext (optional, feste Liste - kein Freitext):'),
          el('div', { style: 'display:flex;gap:0.4rem;flex-wrap:wrap' },
            ...KONTEXTE.map((k) =>
              el('button', {
                class: `k-knopf k-knopf--klein ${eintrag.kontext === k.code ? '' : 'k-knopf--neutral'}`,
                'aria-pressed': String(eintrag.kontext === k.code),
                onclick: () => setzeKontext(kuerzel, k.code),
              }, k.name))))
      : '',

    el('p', { style: 'font-size:0.85rem;margin:0.8rem 0 0.3rem;color:#4b5563' }, 'Letzte 7 Tage:'),
    el('div', { style: 'display:flex;gap:0.35rem;justify-content:space-between;max-width:22rem' },
      ...woche.map((t) => {
        const kontextName = KONTEXTE.find((k) => k.code === t.kontext)?.name;
        const ampelName = AMPELN.find((a) => a.code === t.ampel)?.name ?? 'kein Eintrag';
        return el('div', {
          style: 'text-align:center;font-size:0.75rem;color:#4b5563',
          title: `${t.datum}: ${ampelName}${kontextName ? ` (${kontextName})` : ''}`,
          role: 'img',
          'aria-label': `${wochentag(t.datum)} ${t.datum}: ${ampelName}${kontextName ? `, Kontext ${kontextName}` : ''}`,
        },
        el('div', {}, wochentag(t.datum)),
        el('div', { style: 'font-size:1.1rem' }, PUNKTE[t.ampel] ?? '⚪'));
      })),

    impuls
      ? el('div', { class: 'k-hinweis', style: 'margin-top:0.8rem' },
          el('p', { style: 'margin:0 0 0.4rem;font-weight:600' }, `💛 ${kuerzel} zeigt seit mindestens ${IMPULS_SCHWELLE} dokumentierten Tagen Rot - sanfte Impulse:`),
          el('ul', { style: 'margin:0;padding-left:1.2rem;font-size:0.9rem' },
            ...IMPULSE.map((i) => el('li', {}, i))),
          el('p', { style: 'margin:0.4rem 0 0;font-size:0.8rem;color:#4b5563' }, 'Dies ist ein Beobachtungs-Impuls, keine Diagnose und keine Bewertung des Kindes.'))
      : '');
}

function anlegenKarte(daten) {
  const eingabe = el('input', {
    id: 'wa-kuerzel',
    maxlength: MAX_KUERZEL_LAENGE,
    autocomplete: 'off',
    placeholder: 'z. B. MO',
    style: 'width:6rem;font:inherit;padding:0.6rem;border-radius:0.5rem;border:2px solid var(--k-rand);text-transform:uppercase',
    'aria-describedby': 'wa-kuerzel-hinweis',
  });
  const tagFeld = el('input', {
    type: 'date',
    value: gewaehlterTag,
    max: tagesSchluessel(),
    style: 'font:inherit;padding:0.5rem;border-radius:0.5rem;border:2px solid var(--k-rand)',
    'aria-label': 'Tag der Einschätzung',
  });
  tagFeld.addEventListener('change', () => {
    if (tagFeld.value) { gewaehlterTag = tagFeld.value; render(); }
  });

  return el('section', { class: 'k-karte' },
    el('p', { style: 'font-weight:600;margin-top:0' }, `Kinder der Gruppe (${daten.kinder.length} von ${MAX_KINDER})`),
    el('div', { style: 'display:flex;gap:0.5rem;flex-wrap:wrap;align-items:center' },
      el('label', { for: 'wa-kuerzel', style: 'font-size:0.9rem' }, 'Neues Kürzel:'),
      eingabe,
      el('button', {
        class: 'k-knopf k-knopf--klein',
        onclick: () => {
          const kuerzel = eingabe.value.trim().toUpperCase();
          const fehler = pruefeKuerzel(kuerzel, daten.kinder);
          if (fehler) { meldung = { ok: false, text: fehler }; return render(); }
          daten.kinder.push(kuerzel);
          speichere(daten);
          meldung = null;
          render();
        },
      }, '➕ Anlegen')),
    el('p', { id: 'wa-kuerzel-hinweis', style: 'font-size:0.85rem;color:#4b5563;margin:0.5rem 0 0.8rem' },
      `⚠️ Nur ein selbstgewähltes Kürzel mit höchstens ${MAX_KUERZEL_LAENGE} Zeichen - keine Namen! (Datensparsamkeit)`),
    el('div', { style: 'display:flex;gap:0.5rem;flex-wrap:wrap;align-items:center' },
      el('span', { style: 'font-size:0.9rem;font-weight:600' }, 'Tag:'), tagFeld));
}

function kofferKarte(daten) {
  return el('section', { class: 'k-karte' },
    el('p', { style: 'font-weight:600;margin-top:0' }, '📦 Ampel-Koffer (Datei-Export/-Import)'),
    el('p', { style: 'font-size:0.9rem' }, 'Für Gerätewechsel, Sicherung oder Übergabe im Team: Daten als Datei exportieren und auf dem anderen Gerät importieren - ohne Server, ohne Cloud. Beim Import werden Kinder und Tage zusammengeführt; bei gleichem Kind und Tag bleibt der Eintrag dieses Geräts erhalten.'),
    el('div', { class: 'k-antworten' },
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => exportiere(daten) }, '📤 Daten exportieren'),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: importiere }, '📥 Daten importieren')));
}

function exportiere(daten) {
  const blob = new Blob([packeKoffer(daten)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anker = el('a', { href: url, download: 'wohlfuehl-ampel-gruppe.json' });
  document.body.append(anker);
  anker.click();
  anker.remove();
  URL.revokeObjectURL(url);
}

function importiere() {
  const eingabe = el('input', { type: 'file', accept: '.json,application/json', style: 'display:none' });
  eingabe.addEventListener('change', async () => {
    const datei = eingabe.files?.[0];
    eingabe.remove();
    if (!datei) return;
    let inhalt;
    try {
      inhalt = JSON.parse(await datei.text());
    } catch {
      meldung = { ok: false, text: 'Die Datei ließ sich nicht lesen.' };
      return render();
    }
    const fehler = pruefeKoffer(inhalt);
    if (fehler.length > 0) {
      meldung = { ok: false, text: `Import nicht möglich: ${fehler[0]}.` };
      return render();
    }
    const vereinigt = vereinigeKoffer(lade(), inhalt);
    if (!vereinigt) {
      meldung = { ok: false, text: `Import nicht möglich: zusammen wären es mehr als ${MAX_KINDER} Kinder.` };
      return render();
    }
    speichere(vereinigt);
    meldung = { ok: true, text: `Import fertig: jetzt ${vereinigt.kinder.length} Kinder in der Gruppe.` };
    render();
  });
  document.body.append(eingabe);
  eingabe.click();
}

function render() {
  const daten = lade();
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🚥 Wohlfühl-Ampel Gruppe'),
    el('p', { class: 'k-untertitel' }, 'Tages-Ampel zum emotionalen Wohlbefinden (für Fachkräfte, Kinder 1-7)'),

    el('section', { class: 'k-karte' },
      el('p', { style: 'margin:0;font-size:0.9rem' },
        '🧭 ', el('strong', {}, 'Beobachtung, keine Diagnose:'),
        ' Diese Ampel hält fest, wie sich ein Kind heute in der Gruppe zeigt - als Erinnerungs- und Gesprächshilfe. Es gibt bewusst keine Punkte, kein Ranking und keinen Vergleich zwischen Kindern. Alle Daten bleiben auf diesem Gerät; Kinder erscheinen nur als Kürzel.')),

    meldung
      ? el('div', { class: `k-hinweis ${meldung.ok ? 'k-hinweis--richtig' : 'k-hinweis--falsch'}` },
          el('p', { style: 'margin:0' }, meldung.text))
      : '',

    anlegenKarte(daten),

    ...(daten.kinder.length === 0
      ? [el('section', { class: 'k-karte' },
          el('p', { style: 'margin:0' }, 'Noch keine Kinder angelegt. Lege oben das erste Kürzel an - danach tippst du pro Kind und Tag einfach 🟢, 🟡 oder 🔴.'))]
      : daten.kinder.map((kuerzel) => kindKarte(kuerzel, daten.eintraege[kuerzel] ?? {}))),

    kofferKarte(daten),

    el('section', { class: 'k-karte' },
      el('p', { style: 'font-size:0.9rem;margin-top:0' }, 'Gespeichert wird nur diese Gruppe (Kürzel + Ampel-Einträge), ausschließlich auf diesem Gerät.'),
      el('button', {
        class: 'k-knopf k-knopf--neutral k-knopf--klein',
        onclick: () => {
          if (!confirm('Wirklich alle Kürzel und Einträge auf diesem Gerät löschen?')) return;
          localStorage.removeItem(DATEN_SCHLUESSEL);
          meldung = null;
          render();
        },
      }, '🧹 Alle Daten löschen')),

    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werkzeug für Fachkräfte · werbefrei · ohne Konto · Daten bleiben auf diesem Gerät · '),
      el('a', { href: 'eltern.html' }, 'ℹ️ Info für Träger & Leitung'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));

  meldung = null;
}

render();
