// Stations-Konfigurator (für LEHRKRÄFTE, docs/09 Ось E): Reine Logik ohne DOM.
// Die Lehrkraft stellt Lernstationen zusammen (Name, App, Modul, Aufgabe,
// Minuten). Daraus entstehen (a) Deep-Links, die eine App auf genau ein Modul
// festpinnen (URL-Hash), (b) ein druckbarer Laufzettel und (c) eine als
// URL-Hash teilbare Gesamt-Konfiguration. Alles lokal, keine externen Anfragen.

export const KONFIG_VERSION = 1;

/** Baut ein sauberes Stations-Objekt (leere Felder werden zu ''). */
export function baueStation({ name = '', app = '', modul = '', aufgabe = '', minuten = 0 } = {}) {
  return {
    name: String(name).trim(),
    app: String(app).trim(),
    modul: String(modul).trim(),
    aufgabe: String(aufgabe).trim(),
    minuten: Math.max(0, Number(minuten) || 0),
  };
}

/** Fehlerliste einer Station (leer = gültig). */
export function pruefeStation(station) {
  const fehler = [];
  if (!station.name) fehler.push('Name der Station fehlt');
  if (!station.app) fehler.push('App fehlt');
  return fehler;
}

/**
 * Deep-Link auf eine App, die auf ein Modul festgepinnt und in der Navigation
 * gesperrt ist (die App liest den Hash; Umsetzung je App). basis endet ohne '/'.
 */
export function stationsLink(station, basis = '../..') {
  const params = new URLSearchParams();
  params.set('station', station.name);
  if (station.modul) params.set('modul', station.modul);
  params.set('gesperrt', '1');
  return `${basis}/apps/${station.app}/#${params.toString()}`;
}

/** UTF-8-sichere Base64-Kodierung eines Objekts (browser- und node-tauglich). */
export function kodiere(obj) {
  const bytes = new TextEncoder().encode(JSON.stringify(obj));
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

/** Umkehrung von kodiere(). Wirft bei ungültiger Eingabe. */
export function dekodiere(str) {
  const bin = atob(str);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

/** Kodiert die ganze Stationsliste in einen teilbaren URL-Hash. */
export function konfigLink(stationen, basis = '') {
  const daten = kodiere({ v: KONFIG_VERSION, stationen });
  return `${basis}#konfig=${daten}`;
}

/** Liest eine Stationsliste aus einem URL-Hash (leer/ungültig -> []). */
export function ausHash(hash = '') {
  const roh = hash.startsWith('#') ? hash.slice(1) : hash;
  const params = new URLSearchParams(roh);
  const daten = params.get('konfig');
  if (!daten) return [];
  try {
    const obj = dekodiere(daten);
    if (!obj || obj.v !== KONFIG_VERSION || !Array.isArray(obj.stationen)) return [];
    return obj.stationen.map(baueStation);
  } catch (e) {
    return [];
  }
}

/** Gesamtdauer aller Stationen in Minuten. */
export function gesamtdauer(stationen) {
  return stationen.reduce((s, st) => s + (Number(st.minuten) || 0), 0);
}

/** Druckbarer Laufzettel: eine Zeile pro Station mit Ankreuzfeld. */
export function baueLaufzettel(stationen, { titel = 'Stationen-Laufzettel' } = {}) {
  const zeilen = [titel, ''];
  stationen.forEach((st, i) => {
    const dauer = st.minuten ? ` (${st.minuten} min)` : '';
    zeilen.push(`[ ] Station ${i + 1}: ${st.name}${dauer}`);
    if (st.aufgabe) zeilen.push(`      Aufgabe: ${st.aufgabe}`);
  });
  zeilen.push('');
  zeilen.push(`Gesamt: ${stationen.length} Stationen · ${gesamtdauer(stationen)} min`);
  return zeilen.join('\n');
}
