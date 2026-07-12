// Maschinenlesbarer Kriterienkatalog der Monorepo-Politik (docs/02-anforderungen.md).
// Quellen der Kriterien: fragFINN-Kriterienkatalog, BzKJ-Förderprogramm
// "Kindgerechte digitale Angebote", DSGVO Art. 8, JuSchG/JMStV.

export const KRITERIEN = Object.freeze([
  { id: 'werbefrei', quelle: 'fragFINN: Werbung', text: 'Keine Werbung, kein Sponsoring im Kinderbereich' },
  { id: 'keine-kaeufe', quelle: 'fragFINN: Shops und Abonnements', text: 'Keine Käufe, Abos, Shops, Spenden im Kinderbereich' },
  { id: 'keine-konten', quelle: 'DSGVO Art. 8', text: 'Keine Registrierung/Konten für Kinder; keine Verarbeitung personenbezogener Daten' },
  { id: 'keine-tracker', quelle: 'fragFINN: Datenschutz', text: 'Keine Tracker, keine Drittanbieter-Cookies, kein Fingerprinting' },
  { id: 'keine-externen-anfragen', quelle: 'Monorepo-Politik', text: 'Keine Netzwerkanfragen an fremde Hosts (kein CDN, keine Web-Fonts, keine Dritt-APIs)' },
  { id: 'lokale-daten-loeschbar', quelle: 'DSGVO', text: 'Lokale Daten (localStorage) jederzeit per Knopf löschbar' },
  { id: 'privacy-by-default', quelle: 'BzKJ 2026', text: 'Sicherste Einstellung ist Voreinstellung' },
  { id: 'keine-offenen-chats', quelle: 'fragFINN: Chats', text: 'Keine offenen Chats; Austausch nur in geschlossenen, moderierten Gruppen' },
  { id: 'altersgerecht', quelle: 'fragFINN: Inhalte / JMStV', text: 'Sprache und Inhalte passend für 8-12 Jahre, keine entwicklungsbeeinträchtigenden Inhalte' },
  { id: 'lernziele-dokumentiert', quelle: 'NRW Games-Leitlinie (pädagogisch wertvoll)', text: 'Lernziele im README des jeweiligen Apps dokumentiert' },
  { id: 'mobile-first', quelle: 'BzKJ 2026', text: 'Mobile First ab 360 px, Touch-Ziele >= 48 px' },
  { id: 'offline-faehig', quelle: 'Monorepo-Politik', text: 'Nach dem ersten Laden offline nutzbar' },
  { id: 'barrierearm', quelle: 'WCAG AA', text: 'Kontrast AA, Tastaturbedienung, Vorlesen-Funktion, prefers-reduced-motion' },
  { id: 'impressum-datenschutz', quelle: 'fragFINN: formale Kriterien / TMG', text: 'Impressum und Datenschutzerklärung vor Veröffentlichung' },
  { id: 'kinder-einbeziehen', quelle: 'BzKJ 2026', text: 'Tests mit Kindern der Zielgruppe vor Major-Releases, dokumentiert in docs/' },
]);

/** @param {string} id @returns {boolean} */
export function istBekanntesKriterium(id) {
  return KRITERIEN.some((k) => k.id === id);
}
