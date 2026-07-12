// Kita-Wochenplaner: Bildungsangebote ausgewogen über die Woche planen.
// Zielgruppe: FACHKRÄFTE (Erzieher*innen, Kita-Leitung) - kein Kinder-Screen.
// Konzept aus Katalog Nr. 2 (docs/10, Praleska-Ableitung): Richtwerte für
// Dauer und Anzahl von Angeboten - hier bewusst als EMPFEHLUNG formuliert,
// Freispiel hat Vorrang (deutsche Kita-Praxis). Geplant werden Angebote,
// nie Kinder: kein Score, kein Ranking, keine Kindernamen.
// Politik docs/02: keine externen Anfragen; localStorage nur 'kwp.plan';
// Austausch nur als Datei (koffer.mjs); Aushang über die Druckansicht.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { TAGE, minutenJeBereich, angeboteFuerTag, pruefePlan, neueId } from './logik.mjs';
import { packeKoffer, pruefeKoffer, vereinigeKoffer } from './koffer.mjs';

installiereNetzwerkWaechter();

const PLAN_SCHLUESSEL = 'kwp.plan';
const app = document.getElementById('app');
const daten = await fetch('daten/bereiche.json').then((r) => r.json());

const bereichIds = daten.bereiche.map((b) => b.id);
const alterIds = daten.altersgruppen.map((g) => g.id);

const ladePlan = () => {
  const roh = JSON.parse(localStorage.getItem(PLAN_SCHLUESSEL) ?? 'null');
  return roh && Array.isArray(roh.angebote) ? roh : { woche: '', angebote: [] };
};
const speicherePlan = (plan) => localStorage.setItem(PLAN_SCHLUESSEL, JSON.stringify(plan));

const bereichVon = (id) => daten.bereiche.find((b) => b.id === id);
const alterVon = (id) => daten.altersgruppen.find((g) => g.id === id);

// Formular-Entwurf überlebt Re-Renders; Meldung wird einmal angezeigt.
const entwurf = { tag: 'mo', bereich: bereichIds[0], alter: '3-5', dauer: '15', titel: '' };
let meldung = null;

const eingabeStil = 'width:100%;font:inherit;padding:0.6rem;border-radius:0.5rem;border:2px solid var(--k-rand);background:#fff;margin-top:0.25rem';
const feldStil = 'display:block;font-weight:600;margin-top:0.75rem';

function auswahlFeld(beschriftung, optionen, wert, beiWahl) {
  const select = el('select', { style: eingabeStil });
  for (const [w, text] of optionen) {
    const option = el('option', { value: w }, text);
    if (w === wert) option.selected = true;
    select.append(option);
  }
  select.addEventListener('change', () => beiWahl(select.value));
  return el('label', { style: feldStil }, beschriftung, select);
}

function kopfKarte(plan) {
  const wocheFeld = el('input', {
    type: 'text', maxlength: '60', value: plan.woche,
    placeholder: 'z. B. KW 29 · Igelgruppe', style: eingabeStil,
    'aria-label': 'Überschrift für Woche und Gruppe',
  });
  wocheFeld.addEventListener('change', () => {
    const p = ladePlan();
    p.woche = wocheFeld.value.trim();
    speicherePlan(p);
  });
  return el('section', { class: 'k-karte kwp-nur-bildschirm' },
    el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🗓️ Woche & Gruppe'),
    wocheFeld,
    el('p', { style: 'font-size:0.85rem;color:#4b5563;margin:0.5rem 0 0' },
      'Erscheint als Überschrift auf dem Aushang. Bitte keine Kindernamen - der Plan beschreibt Angebote, nicht Kinder.'));
}

function formularKarte() {
  const dauerFeld = el('input', {
    type: 'number', min: '5', max: '120', step: '5', value: entwurf.dauer,
    inputmode: 'numeric', style: eingabeStil, 'aria-label': 'Dauer in Minuten',
  });
  dauerFeld.addEventListener('input', () => { entwurf.dauer = dauerFeld.value; });
  const titelFeld = el('input', {
    type: 'text', maxlength: '60', value: entwurf.titel,
    placeholder: 'z. B. Klanggeschichte „Regenwetter“', style: eingabeStil,
  });
  titelFeld.addEventListener('input', () => { entwurf.titel = titelFeld.value; });
  const beispiel = () => bereichVon(entwurf.bereich)?.beispiele ?? '';
  const beispielZeile = el('p', { style: 'font-size:0.85rem;color:#4b5563;margin:0.5rem 0 0' }, `💡 Ideen: ${beispiel()}`);

  return el('section', { class: 'k-karte kwp-nur-bildschirm' },
    el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '➕ Angebot hinzufügen'),
    auswahlFeld('Tag', TAGE.map((t) => [t.id, t.name]), entwurf.tag, (w) => { entwurf.tag = w; }),
    auswahlFeld('Bildungsbereich', daten.bereiche.map((b) => [b.id, `${b.emoji} ${b.name}`]), entwurf.bereich,
      (w) => { entwurf.bereich = w; beispielZeile.textContent = `💡 Ideen: ${beispiel()}`; }),
    auswahlFeld('Altersgruppe', daten.altersgruppen.map((g) => [g.id, `${g.name} (Empfehlung: bis ~${g.maxMinutenProAngebot} min)`]), entwurf.alter,
      (w) => { entwurf.alter = w; }),
    el('label', { style: feldStil }, 'Dauer in Minuten', dauerFeld),
    el('label', { style: feldStil }, 'Titel des Angebots (optional)', titelFeld),
    beispielZeile,
    el('div', { class: 'k-antworten' },
      el('button', {
        class: 'k-knopf',
        onclick: () => {
          const dauer = Math.round(Number(entwurf.dauer));
          if (!Number.isInteger(dauer) || dauer < 1 || dauer > 240) {
            meldung = { ok: false, text: 'Bitte eine Dauer zwischen 1 und 240 Minuten angeben.' };
            return render();
          }
          const plan = ladePlan();
          plan.angebote.push({
            id: neueId(),
            tag: entwurf.tag,
            bereich: entwurf.bereich,
            alter: entwurf.alter,
            dauer,
            titel: entwurf.titel.trim(),
          });
          speicherePlan(plan);
          entwurf.titel = '';
          meldung = { ok: true, text: 'Angebot eingeplant. ✔️' };
          render();
        },
      }, '✅ Zum Wochenplan hinzufügen')));
}

function tagesKarte(plan, tag) {
  const liste = angeboteFuerTag(plan.angebote, tag.id);
  return el('section', { class: 'k-karte' },
    el('h2', { style: 'margin-top:0;font-size:1.05rem' }, tag.name),
    liste.length === 0
      ? el('p', { style: 'margin:0;color:#4b5563' }, 'Noch nichts geplant - Zeit für Freispiel. 🌈')
      : el('ul', { style: 'list-style:none;padding:0;margin:0' },
          ...liste.map((a) => {
            const b = bereichVon(a.bereich);
            const g = alterVon(a.alter);
            const name = a.titel || b?.name || a.bereich;
            return el('li', { style: 'display:flex;gap:0.5rem;align-items:flex-start;justify-content:space-between;padding:0.4rem 0;border-bottom:1px solid var(--k-rand)' },
              el('div', {},
                el('span', { style: 'font-weight:600' }, `${b?.emoji ?? '❓'} ${name}`),
                el('small', { style: 'display:block;color:#4b5563' }, `${b?.name ?? a.bereich} · ${g?.name ?? a.alter} · ${a.dauer} min`)),
              el('button', {
                class: 'k-knopf k-knopf--neutral k-knopf--klein kwp-nur-bildschirm',
                'aria-label': `Angebot „${name}“ am ${tag.name} entfernen`,
                onclick: () => {
                  const p = ladePlan();
                  p.angebote = p.angebote.filter((x) => x.id !== a.id);
                  speicherePlan(p);
                  render();
                },
              }, '🗑️'));
          })));
}

function checkKarte(plan) {
  const summen = minutenJeBereich(plan.angebote);
  const maxMin = Math.max(1, ...Object.values(summen));
  const hinweise = pruefePlan(plan.angebote, daten);
  return el('section', { class: 'k-karte kwp-nur-bildschirm' },
    el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '⚖️ Ausgewogenheits-Check'),
    ...daten.bereiche.map((b) => {
      const min = summen[b.id] ?? 0;
      const anteil = Math.round((min / maxMin) * 100);
      return el('div', { style: 'margin:0.5rem 0' },
        el('p', { style: 'margin:0 0 0.25rem;font-size:0.9rem' }, `${b.emoji} ${b.name} - ${min} min`),
        el('div', { class: 'k-fortschritt', role: 'img', 'aria-label': `${b.name}: ${min} Minuten geplant` },
          el('div', { style: `width:${anteil}%` })));
    }),
    ...hinweise.map((h) =>
      el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
        el('p', { style: 'margin:0;font-size:0.9rem' }, `💡 ${h.text}`))),
    hinweise.length === 0 && plan.angebote.length > 0
      ? el('div', { class: 'k-hinweis k-hinweis--richtig', style: 'margin-top:0.6rem' },
          el('p', { style: 'margin:0;font-size:0.9rem' }, '👍 Sieht ausgewogen aus - alle Richtwerte eingehalten.'))
      : '',
    el('p', { style: 'font-size:0.85rem;color:#4b5563;margin-bottom:0' },
      'Alle Richtwerte sind Empfehlungen aus der Fachpraxis, keine Vorschrift. Dieses Werkzeug plant Angebote - es bewertet keine Kinder und erstellt keine Diagnosen.'));
}

function werkzeugKarte(plan) {
  return el('section', { class: 'k-karte kwp-nur-bildschirm' },
    el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🧰 Team-Werkzeuge'),
    el('p', { style: 'font-size:0.9rem' },
      'Plan als Datei sichern oder mit Kolleg*innen zusammenführen - ganz ohne Server: hier exportieren, die Datei z. B. per USB-Stick weitergeben, dort importieren. Neue Angebote werden ergänzt, nichts wird überschrieben.'),
    el('div', { class: 'k-antworten' },
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => exportiere(plan) }, '📤 Plan exportieren (Datei)'),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: importiere }, '📥 Plan importieren'),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => window.print() }, '🖨️ Druckansicht (Aushang)'),
      el('button', {
        class: 'k-knopf k-knopf--neutral k-knopf--klein',
        onclick: () => {
          localStorage.removeItem(PLAN_SCHLUESSEL);
          meldung = { ok: true, text: 'Alle Daten wurden gelöscht.' };
          render();
        },
      }, '🧹 Alle Daten löschen')));
}

function exportiere(plan) {
  const blob = new Blob([packeKoffer(plan)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anker = el('a', { href: url, download: 'kita-wochenplan.json' });
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
    const fehler = pruefeKoffer(inhalt, { bereichIds, alterIds });
    if (fehler.length > 0) {
      meldung = { ok: false, text: `Import nicht möglich: ${fehler[0]}.` };
      return render();
    }
    const vorher = ladePlan();
    const vereinigt = vereinigeKoffer(vorher, inhalt);
    speicherePlan(vereinigt);
    const neu = vereinigt.angebote.length - vorher.angebote.length;
    meldung = { ok: true, text: `${neu} Angebot${neu === 1 ? '' : 'e'} importiert und ergänzt. 🎉` };
    render();
  });
  document.body.append(eingabe);
  eingabe.click();
}

function render() {
  const plan = ladePlan();
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🗓️ Kita-Wochenplaner'),
    el('p', { class: 'k-untertitel kwp-nur-bildschirm' }, 'Bildungsangebote ausgewogen planen - Freispiel hat Vorrang (für Fachkräfte)'),
    // Kopfzeilen nur für den gedruckten Aushang:
    el('p', { class: 'kwp-nur-druck', style: 'text-align:center;font-size:1.15rem;font-weight:700;margin:0' },
      plan.woche || 'Unser Wochenplan'),
    el('p', { class: 'kwp-nur-druck', style: 'text-align:center;font-size:0.9rem;margin:0' },
      'Feste Angebote dieser Woche - dazwischen hat das freie Spiel Vorrang.'),
    meldung
      ? el('div', { class: `k-hinweis ${meldung.ok ? 'k-hinweis--richtig' : 'k-hinweis--falsch'} kwp-nur-bildschirm`, role: 'status' },
          el('p', { style: 'margin:0' }, meldung.text))
      : '',
    kopfKarte(plan),
    formularKarte(),
    ...TAGE.map((t) => tagesKarte(plan, t)),
    checkKarte(plan),
    werkzeugKarte(plan),
    el('p', { class: 'kwp-nur-druck', style: 'text-align:center;font-size:0.75rem;color:#4b5563' },
      'Erstellt mit dem Kita-Wochenplaner - werbefrei, ohne Konto, alle Daten bleiben in der Kita.'),
    el('footer', { class: 'k-fuss kwp-nur-bildschirm' },
      el('span', {}, 'Werkzeug für Fachkräfte · werbefrei · Daten bleiben auf diesem Gerät · '),
      el('a', { href: 'eltern.html' }, '🏛️ Info für Träger & Leitung'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
  meldung = null;
}

render();
