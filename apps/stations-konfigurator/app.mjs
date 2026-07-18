// Stations-Konfigurator (für LEHRKRÄFTE, docs/09 Ось E). Die Lehrkraft stellt
// Lernstationen zusammen; daraus entstehen Deep-Links (App auf ein Modul
// festgepinnt), ein druckbarer Laufzettel und ein teilbarer Konfig-Link
// (URL-Hash). Läuft rein lokal, keine externen Anfragen (NetzwerkWaechter).
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { baueStation, pruefeStation, stationsLink, konfigLink, ausHash, gesamtdauer, baueLaufzettel } from './konfigurator.mjs';

installiereNetzwerkWaechter();

const SCHLUESSEL = 'sk.stationen';
const app = document.getElementById('app');
const APP_VORSCHLAEGE = ['nachrichten-detektive', 'feed-forscher', 'daten-schatz', 'stark-im-chat', 'lootbox-labor', 'dark-pattern-labyrinth', 'kettenbrief-stopper', 'sog-maschine', 'passwort-pruefstand', 'deepfake-spuernase'];

let stationen = ladeStart();

function ladeStart() {
  const ausLink = ausHash(location.hash);
  if (ausLink.length) return ausLink;
  try { return (JSON.parse(localStorage.getItem(SCHLUESSEL) ?? '[]')).map(baueStation); }
  catch (e) { return []; }
}
function speichere() { localStorage.setItem(SCHLUESSEL, JSON.stringify(stationen)); }

function kopiere(text) {
  if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => fallbackKopie(text));
  else fallbackKopie(text);
}
function fallbackKopie(text) {
  const ta = el('textarea', { style: 'position:fixed;left:-9999px' }); ta.value = text;
  document.body.appendChild(ta); ta.select();
  try { document.execCommand('copy'); } catch (e) { /* ignore */ }
  ta.remove();
}

function stationsKarte(st, i) {
  return el('div', { style: 'padding:0.4rem 0;border-bottom:1px solid var(--k-rand)' },
    el('div', { style: 'display:flex;justify-content:space-between;gap:0.5rem;align-items:baseline' },
      el('span', { style: 'font-weight:700' }, `Station ${i + 1}: ${st.name}`),
      el('span', { style: 'color:#4b5563;font-size:0.9rem' }, `${st.app}${st.minuten ? ` · ${st.minuten} min` : ''}`)),
    st.aufgabe ? el('p', { style: 'margin:0.2rem 0' }, st.aufgabe) : '',
    el('div', { class: 'sk-nur-bildschirm', style: 'display:flex;gap:0.4rem;flex-wrap:wrap;margin-top:0.2rem' },
      el('a', { class: 'k-knopf k-knopf--klein k-knopf--neutral', style: 'text-decoration:none', href: stationsLink(st, '../..') }, '▶️ Station öffnen'),
      el('button', { class: 'k-knopf k-knopf--klein k-knopf--neutral', onclick: () => { stationen.splice(i, 1); speichere(); render(); } }, '🗑️ Entfernen')));
}

function render(meldung = '') {
  const nameFeld = el('input', { style: feldStil(), placeholder: 'z. B. Detektiv-Ecke', maxlength: 60, 'aria-label': 'Stationsname' });
  const appListe = el('datalist', { id: 'sk-apps' }, ...APP_VORSCHLAEGE.map((a) => el('option', { value: a })));
  const appFeld = el('input', { style: feldStil(), placeholder: 'z. B. nachrichten-detektive', list: 'sk-apps', 'aria-label': 'App-Ordner' });
  const modulFeld = el('input', { style: feldStil(), placeholder: 'optional, z. B. werbung', maxlength: 40, 'aria-label': 'Modul (optional)' });
  const aufgabeFeld = el('input', { style: feldStil(), placeholder: 'z. B. 3 Meldungen prüfen', maxlength: 120, 'aria-label': 'Aufgabe' });
  const minutenFeld = el('input', { type: 'number', min: 0, max: 90, value: 15, style: 'width:6rem;padding:0.5rem;border:2px solid var(--k-rand);border-radius:0.5rem', 'aria-label': 'Minuten' });

  const zettel = stationen.length ? baueLaufzettel(stationen) : '';
  const teilen = stationen.length ? konfigLink(stationen, location.href.split('#')[0]) : '';

  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🧭 Stations-Konfigurator'),
    el('p', { class: 'k-untertitel' }, 'Lernstationen zusammenstellen: Deep-Links, druckbarer Laufzettel und teilbarer Konfig-Link – alles lokal.'),
    appListe,
    el('section', { class: 'k-karte sk-nur-bildschirm' },
      el('p', { style: 'font-weight:600;margin-top:0' }, 'Neue Station'),
      feldZeile('Name', nameFeld), feldZeile('App-Ordner', appFeld), feldZeile('Modul (optional)', modulFeld),
      feldZeile('Aufgabe', aufgabeFeld), feldZeile('Minuten', minutenFeld),
      el('button', { class: 'k-knopf', style: 'margin-top:0.5rem', onclick: () => {
        const st = baueStation({ name: nameFeld.value, app: appFeld.value, modul: modulFeld.value, aufgabe: aufgabeFeld.value, minuten: minutenFeld.value });
        const fehler = pruefeStation(st);
        if (fehler.length) { alert(fehler.join('\n')); return; }
        stationen.push(st); speichere(); render(`„${st.name}“ hinzugefügt.`);
      } }, '➕ Station hinzufügen'),
      meldung ? el('p', { style: 'color:#166534;font-size:0.9rem' }, meldung) : ''),
    stationen.length ? el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, `📋 Laufzettel (${stationen.length} Stationen · ${gesamtdauer(stationen)} min)`),
      ...stationen.map(stationsKarte),
      el('div', { class: 'sk-nur-bildschirm', style: 'display:flex;gap:0.4rem;flex-wrap:wrap;margin-top:0.6rem' },
        el('button', { class: 'k-knopf k-knopf--klein', onclick: () => window.print() }, '🖨️ Laufzettel drucken'),
        el('button', { class: 'k-knopf k-knopf--klein k-knopf--neutral', onclick: () => kopiere(zettel) }, '📋 Laufzettel kopieren'),
        el('button', { class: 'k-knopf k-knopf--klein k-knopf--neutral', onclick: () => kopiere(teilen) }, '🔗 Konfig-Link kopieren'),
        el('button', { class: 'k-knopf k-knopf--klein k-knopf--neutral', onclick: () => { if (confirm('Alle Stationen löschen?')) { stationen = []; speichere(); render('Alle Stationen gelöscht.'); } } }, '🧹 Alles löschen'))) :
      el('section', { class: 'k-karte' }, el('p', { style: 'margin:0;color:#4b5563' }, 'Noch keine Stationen. Lege oben die erste an – oder öffne einen geteilten Konfig-Link.')),
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'für Lehrkräfte · werbefrei · läuft offline · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

function feldStil() { return 'width:100%;padding:0.5rem;border:2px solid var(--k-rand);border-radius:0.5rem'; }
function feldZeile(label, feld) {
  return el('label', { style: 'display:block;margin-top:0.4rem' }, el('span', { style: 'font-weight:600;display:block' }, label), feld);
}

render();
