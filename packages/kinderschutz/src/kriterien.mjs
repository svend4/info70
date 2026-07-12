// Maschinenlesbarer Kriterienkatalog der Monorepo-Politik (docs/02-anforderungen.md).
// Quellen der Kriterien: fragFINN-Kriterienkatalog und Prüfpraxis, Seitenstark-
// Qualitätskriterien, BzKJ-Förderprogramm "Kindgerechte digitale Angebote",
// DSGVO Art. 8, JuSchG/JMStV. Die "hilfe"-Texte destillieren die Prüfpraxis
// in konkrete Handgriffe - sie speisen den Kriterien-Check.

export const KRITERIEN = Object.freeze([
  {
    id: 'werbefrei',
    quelle: 'fragFINN: Werbung',
    text: 'Keine Werbung, kein Sponsoring im Kinderbereich',
    hilfe: 'fragFINN erlaubt Werbung nur klar gekennzeichnet („Werbung“/„Anzeige“) und vom Inhalt getrennt - dieses Monorepo geht weiter: gar keine. Prüfe: keine Banner, keine gesponserten Inhalte, keine Affiliate-Links, keine Produktplatzierung im Kinderbereich; Sponsoren höchstens im Erwachsenenbereich nennen.',
  },
  {
    id: 'keine-kaeufe',
    quelle: 'fragFINN: Shops und Abonnements',
    text: 'Keine Käufe, Abos, Shops, Spenden im Kinderbereich',
    hilfe: 'Seitenstark verlangt die Trennung von Shops über eine Zwischenseite; fragFINN prüft Shops/Abos als eigene Kategorie. Prüfe: keine In-App-Käufe, keine „Premium“-Knöpfe, keine Spendenaufrufe im Kinder-UI; falls es je einen Shop gibt, nur im Erwachsenenbereich hinter einer deutlichen Zwischenseite.',
  },
  {
    id: 'keine-konten',
    quelle: 'DSGVO Art. 8',
    text: 'Keine Registrierung/Konten für Kinder; keine Verarbeitung personenbezogener Daten',
    hilfe: 'In Deutschland können Kinder erst ab 16 selbst in Datenverarbeitung einwilligen - darunter braucht es die Eltern. Der einfachste rechtssichere Weg: gar keine personenbezogenen Daten erheben. Prüfe: kein Login, keine Namens-/Altersabfrage, Bestenlisten nur mit lokalen Spitznamen.',
  },
  {
    id: 'keine-tracker',
    quelle: 'fragFINN: Datenschutz',
    text: 'Keine Tracker, keine Drittanbieter-Cookies, kein Fingerprinting',
    hilfe: 'Auch „nur Statistik“ ist Tracking. Prüfe: keine Analytics-Skripte, keine Social-Media-Widgets/Share-Buttons (laden Tracker von Drittplattformen), keine Werbenetzwerke, kein Canvas-Fingerprinting. Cookie-Banner werden überflüssig, wenn es nichts einzuwilligen gibt.',
  },
  {
    id: 'keine-externen-anfragen',
    quelle: 'Monorepo-Politik',
    text: 'Keine Netzwerkanfragen an fremde Hosts (kein CDN, keine Web-Fonts, keine Dritt-APIs)',
    hilfe: 'Jede Anfrage an fremde Server verrät IP-Adresse und Nutzungszeitpunkt des Kindes. Prüfe im DevTools-Netzwerk-Tab: ausschließlich die eigene Domain. Technisch erzwingen: CSP default-src \'self\' + kinderschutz.installiereNetzwerkWaechter(); Schriften und Bilder lokal ausliefern.',
  },
  {
    id: 'lokale-daten-loeschbar',
    quelle: 'DSGVO',
    text: 'Lokale Daten (localStorage) jederzeit per Knopf löschbar',
    hilfe: 'Auch lokale Spielstände gehören dem Kind. Prüfe: sichtbarer Knopf „Meine Daten löschen“ auf dem Startbildschirm, der localStorage vollständig leert; im Eltern-Bereich dokumentieren, WAS gespeichert wird (z. B. nur ein Rekord-Wert).',
  },
  {
    id: 'privacy-by-default',
    quelle: 'BzKJ 2026',
    text: 'Sicherste Einstellung ist Voreinstellung',
    hilfe: 'Das BzKJ-Förderprogramm bevorzugt Angebote, die sichere Voreinstellungen aktiv fördern. Prüfe: kein Berechtigungs-Dialog beim ersten Start (Push, Standort, Kamera), optionale Funktionen standardmäßig AUS, die Einschalt-Entscheidung liegt bei Kind/Eltern.',
  },
  {
    id: 'keine-offenen-chats',
    quelle: 'fragFINN: Chats',
    text: 'Keine offenen Chats; Austausch nur in geschlossenen, moderierten Gruppen',
    hilfe: 'Seitenstark-Standard: Foren/Chats „nach Möglichkeit sogar vorab“ moderieren; fragFINN prüft Kommunikationsfunktionen besonders streng. Alternative ganz ohne Risikozone: Datei-Austausch über eine erwachsene Person (Klassen-Koffer-Muster der Mitmach-Arena).',
  },
  {
    id: 'altersgerecht',
    quelle: 'fragFINN: Inhalte / JMStV',
    text: 'Sprache und Inhalte passend für 8-12 Jahre, keine entwicklungsbeeinträchtigenden Inhalte',
    hilfe: 'Kurze Sätze, bekannte Wörter, keine Angst- oder Gewaltinhalte (JMStV § 5). Sensible Themen (z. B. Mobbing) mit Handlungsanweisung und Hilfeadresse (116 111) statt Drastik erzählen. Vorlesen-Knopf einbauen - er trägt schwache Leser*innen durch die App.',
  },
  {
    id: 'lernziele-dokumentiert',
    quelle: 'NRW Games-Leitlinie (pädagogisch wertvoll)',
    text: 'Lernziele im README des jeweiligen Apps dokumentiert',
    hilfe: 'Die NRW-Leitlinie erhöht den Zuschuss für „pädagogisch wertvolle, vorrangig an Kinder gerichtete“ Spiele auf bis zu 80 % - dokumentierte Lernziele sind der Nachweis. Prüfe: jedes App-README hat einen Lernziele-Abschnitt mit prüfbaren Aussagen („Kind kann X erkennen/anwenden“).',
  },
  {
    id: 'mobile-first',
    quelle: 'BzKJ 2026',
    text: 'Mobile First ab 360 px, Touch-Ziele >= 48 px',
    hilfe: 'BzKJ 2026 fordert Umsetzung nach dem Mobile-First-Prinzip. Prüfe bei 360 px Breite: kein horizontales Scrollen, alle Knöpfe mindestens 48 px hoch, Text ohne Zoomen lesbar; erst danach die Desktop-Ansicht verfeinern.',
  },
  {
    id: 'offline-faehig',
    quelle: 'Monorepo-Politik',
    text: 'Nach dem ersten Laden offline nutzbar',
    hilfe: 'Kinder haben oft kein stabiles Netz oder begrenztes Datenvolumen. Prüfe: Service Worker (Cache-first für eigene Ressourcen) oder zumindest keine Pflicht-Netzanfragen nach dem ersten Laden; Flugmodus-Test durchführen.',
  },
  {
    id: 'barrierearm',
    quelle: 'WCAG AA',
    text: 'Kontrast AA, Tastaturbedienung, Vorlesen-Funktion, prefers-reduced-motion',
    hilfe: 'Prüfe: Kontrastverhältnis mindestens 4,5:1, sichtbarer Fokusring auf jedem Bedienelement, komplette Bedienung per Tastatur, Animationen respektieren prefers-reduced-motion, Vorlesen über Web Speech API (läuft lokal, offline).',
  },
  {
    id: 'impressum-datenschutz',
    quelle: 'fragFINN: formale Kriterien / § 5 DDG',
    text: 'Impressum (Name, Ansprechpartner, Adresse, E-Mail, Telefon) und Datenschutzerklärung vor Veröffentlichung',
    hilfe: 'Formales K.-o.-Kriterium bei fragFINN: Das Impressum muss leicht auffindbar sein und Name, Ansprechpartner*in, Anschrift, E-Mail UND Telefonnummer enthalten; dazu eine Datenschutzerklärung nach DSGVO. Ohne beides scheitert die Whitelist-Aufnahme unabhängig von der Qualität des Angebots.',
  },
  {
    id: 'links-gepflegt',
    quelle: 'fragFINN: Pflege/Erreichbarkeit; Seitenstark-Qualitätskriterien',
    text: 'Seite wird gepflegt: externe Links regelmäßig geprüft, Angebot erreichbar und aktuell',
    hilfe: 'Die fragFINN-Positivliste ist dynamisch: gelistete Seiten werden wiedergeprüft und bei Verwahrlosung entfernt. Seitenstark verlangt regelmäßige Linkprüfung. Prüfe: Termin für Link-/Erreichbarkeits-Check (z. B. monatlich), tote Links sofort entfernen, Betreiber-Verpflichtungserklärung ernst nehmen.',
  },
  {
    id: 'kinder-einbeziehen',
    quelle: 'BzKJ 2026',
    text: 'Tests mit Kindern der Zielgruppe vor Major-Releases, dokumentiert in docs/',
    hilfe: 'BzKJ bevorzugt Projekte, die Kinder aktiv einbeziehen. Prüfe: Kindertest nach Protokoll (docs/05, Methode 5) vor jedem Major-Release - 5-8 Kinder der Zielgruppe, Aufgaben beobachten, Zitate ohne Namen festhalten, Erkenntnisse als Backlog-Einträge; die Protokolle sind zugleich Nachweis für Förderanträge.',
  },
]);

/** @param {string} id @returns {boolean} */
export function istBekanntesKriterium(id) {
  return KRITERIEN.some((k) => k.id === id);
}
