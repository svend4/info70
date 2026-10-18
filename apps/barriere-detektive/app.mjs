// Barriere-Detektive: Lieblings-Apps auf Fairness pruefen (8-12, Beteiligung).
// Kinder tragen ihre Lieblings-Apps ein (nur ein Spitzname, keine Daten),
// haken die Kinder-Checkliste zur Barrierefreiheit ab und kueren am Ende die
// fairste App. Lernziel: Barrierefreiheit als Fairness begreifen. Reine Logik
// in logik.mjs. Politik docs/02: keine externen Anfragen; Fortschritt lokal.
import { el, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { hilfeInsel, hilfeInselKnopf } from '../../packages/kinder-ui/js/hilfe-insel.mjs';
import { CHECKLISTE, MAX_PUNKTE, punkte, einordnung, rangliste, LEKTIONEN } from './logik.mjs';

installiereNetzwerkWaechter();

const SCHLUESSEL = 'bd.apps';
const app = document.getElementById('app');

const laden = () => JSON.parse(localStorage.getItem(SCHLUESSEL) ?? '[]');
const speichern = (apps) => localStorage.setItem(SCHLUESSEL, JSON.stringify(apps));

function zeige(...knoten) {
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🕵️ Barriere-Detektive'),
    el('p', { class: 'k-untertitel' }, 'Prüf deine Lieblings-Apps: Können ALLE Kinder mitmachen?'),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · Daten bleiben auf diesem Gerät · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
  app.querySelector('button, input')?.focus();
}

function render() {
  const apps = laden();
  const eingabe = el('input', {
    type: 'text',
    maxlength: '24',
    placeholder: 'Name der App oder Seite …',
    style: 'flex:1;min-height:44px;border:2px solid var(--k-rand);border-radius:0.5rem;padding:0 0.6rem;font-size:1rem',
    'aria-label': 'Name der App oder Seite',
    'aria-describedby': 'bd-name-hinweis',
  });
  const hinzufuegen = () => {
    const name = eingabe.value.trim();
    if (!name) return;
    const liste = laden();
    liste.push({ name, antworten: {} });
    speichern(liste);
    render();
  };
  eingabe.addEventListener('keydown', (e) => { if (e.key === 'Enter') hinzufuegen(); });

  zeige(
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, 'Eine Barriere ist eine Hürde, die manche Kinder aussperrt. Trag eine App oder Seite ein, die du magst, und prüfe sie mit der Detektiv-Checkliste. (Es reicht der Name – sonst nichts. Dein eigener Name ist nicht gemeint.)'),
      el('p', { id: 'bd-name-hinweis', style: 'margin:0 0 0.4rem;font-weight:700' }, 'Nur den Namen der App eintragen, keinen eigenen Namen.'),
      el('div', { style: 'display:flex;gap:0.5rem' },
        eingabe,
        el('button', { class: 'k-knopf k-knopf--klein', onclick: hinzufuegen }, '➕ Prüfen'))),
    ...apps.map((a, i) => appKarte(a, i)),
    apps.length >= 2 ? el('section', { class: 'k-karte' },
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: ranglisteBildschirm }, '🏆 Fairste App küren'))) : '',
    apps.length > 0 ? el('section', { class: 'k-karte' },
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => { localStorage.removeItem(SCHLUESSEL); render(); } }, '🧹 Alles löschen')) : '',
    el('section', { class: 'k-karte' },
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: lektionBildschirm }, '🎓 Warum ist das wichtig?')),
    el('section', { class: 'k-karte' },
      hilfeInselKnopf(() => zeige(hilfeInsel({ zurueck: render })))));
}

function appKarte(a, index) {
  const p = punkte(a.antworten);
  const e = einordnung(p);
  const anteil = Math.round((p / MAX_PUNKTE) * 100);
  const farbe = e.stufe === 'fair' ? 'var(--k-gruen)' : e.stufe === 'mittel' ? '#f59e0b' : 'var(--k-rot)';
  return el('section', { class: 'k-karte' },
    el('div', { style: 'display:flex;justify-content:space-between;align-items:center;gap:0.5rem' },
      el('h2', { style: 'margin:0;font-size:1.1rem' }, `${e.emoji} ${a.name}`),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', 'aria-label': `${a.name} entfernen`, onclick: () => { const l = laden(); l.splice(index, 1); speichern(l); render(); } }, '✕')),
    el('p', { style: 'margin:0.25rem 0' }, `Fairness: ${p} von ${MAX_PUNKTE}`),
    el('div', { class: 'k-fortschritt', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': MAX_PUNKTE, 'aria-valuenow': p },
      el('div', { style: `width:${anteil}%;background:${farbe}` })),
    el('p', { style: 'margin:0.25rem 0 0.5rem;font-size:0.9rem' }, e.text),
    ...CHECKLISTE.map((k) => {
      const box = el('input', { type: 'checkbox', id: `bd-${index}-${k.code}`, style: 'width:1.4rem;height:1.4rem;flex-shrink:0;margin-top:0.15rem' });
      box.checked = a.antworten[k.code] === true;
      box.addEventListener('change', () => {
        const l = laden();
        l[index].antworten[k.code] = box.checked;
        speichern(l);
        render();
      });
      return el('div', { style: 'display:flex;gap:0.5rem;align-items:flex-start;padding:0.25rem 0' },
        box,
        el('label', { for: `bd-${index}-${k.code}` },
          el('span', {}, `${k.fuer}: ${k.frage}`),
          el('small', { style: 'display:block;color:#4b5563' }, k.warum)));
    }));
}

function ranglisteBildschirm() {
  const r = rangliste(laden());
  zeige(
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0' }, '🏆 Eure Fairness-Rangliste'),
      el('ol', { style: 'padding-left:1.4rem' },
        ...r.map((x) => el('li', { style: 'margin:0.4rem 0;font-size:1.05rem' },
          `${x.emoji} ${x.name} – ${x.punkte} von ${MAX_PUNKTE} `,
          el('small', { style: 'color:#4b5563' }, `(${x.text})`)))),
      el('p', { style: 'margin-bottom:0' }, r.length ? `Die fairste App ist gerade: ${r[0].emoji} ${r[0].name}. Fair heißt: Hier können möglichst viele Kinder mitmachen.` : 'Prüf erst ein paar Apps.'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`Die fairste App ist gerade ${r[0]?.name ?? 'noch keine'}.`) }, '🔊 Vorlesen'),
        el('button', { class: 'k-knopf', onclick: render }, '↩️ Zurück'))));
}

function lektionBildschirm() {
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-weight:700;margin-top:0' }, '🎓 Barriere-Detektive – warum das zählt:'),
      ...LEKTIONEN.map((l) => el('p', { style: 'margin:0.5rem 0' }, l)),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(LEKTIONEN.join(' ')) }, '🔊 Vorlesen'),
        el('button', { class: 'k-knopf', onclick: render }, '↩️ Zurück'))));
}

render();
