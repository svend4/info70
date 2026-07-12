export const childSafetyPrinciples = [
  'age-appropriate content',
  'data minimisation and no unnecessary permissions',
  'no manipulative monetisation or dark patterns',
  'clear child-friendly language',
  'safe defaults with parent/educator guidance',
  'participation of children in design and testing'
];

export const vettedResources = [
  { name: 'fragFINN', type: 'safe search / whitelist', url: 'https://www.fragfinn.de' },
  { name: 'Blinde Kuh', type: 'children search', url: 'https://www.blinde-kuh.de' },
  { name: 'Internet-ABC', type: 'learning portal', url: 'https://www.internet-abc.de' },
  { name: 'jugend.support', type: 'help and reporting guide', url: 'https://www.jugend.support' },
  { name: 'Nummer gegen Kummer', type: 'counselling', url: 'https://www.nummergegenkummer.de' }
];

export const opportunityScores = [
  { id: 'safe-search', title: 'KinderSafe Search Companion', demandScore: 95, rationale: 'Search and video discovery are weekly habits for children; parents need a safer first layer before open platforms.' },
  { id: 'media-time', title: 'Family Media Time Planner', demandScore: 89, rationale: 'Daily online time is rising; families and schools need shared routines, not just blocking.' },
  { id: 'help-bridge', title: 'Youth Help Bridge', demandScore: 86, rationale: 'Cyberbullying, hate speech, fake news, and unwanted contact require fast escalation to trusted services.' },
  { id: 'ai-literacy', title: 'AI Literacy Lab for Teens', demandScore: 84, rationale: 'AI is now mainstream among teenagers, making explainability and verification skills urgent.' }
];

export const appConfigs = {
  'safe-search': {
    title: 'KinderSafe Search Companion',
    audience: '6–12 Jahre + Eltern',
    promise: 'Ein kuratierter Startpunkt für Hausaufgaben, Kinderfragen und sichere Entdeckung.',
    primaryAction: 'Sichere Suche starten',
    cards: [
      { title: 'Themenräume', body: 'Tiere, Schule, Nachrichten und Hobbys werden mit geprüften Kinderseiten verbunden.' },
      { title: 'Eltern-Freigaben', body: 'Erwachsene können Themenlisten vorbereiten, ohne Kinderkonten oder Tracking anzulegen.' },
      { title: 'Warum nicht offen?', body: 'Jede Suche erklärt kindgerecht, warum manche Treffer ausgeblendet werden.' }
    ],
    checklist: ['Keine offenen Kommentare', 'Keine Werbung im MVP', 'Whitelist-first navigation', 'Offline druckbare Familienregeln'],
    nextSprint: ['URL-Prüfung gegen fragFINN-ähnliche Positivlisten simulieren', 'Suchthemen mit Kindern testen', 'Leichte Sprache auf Deutsch ergänzen'],
    flowSteps: ['Themenraum auswählen', 'Geprüfte Treffer öffnen', 'Blockiergrund kindgerecht erklären'],
    demoItems: [{ label: 'Hausaufgabenfrage', value: 'AI misinformation' }, { label: 'Unbekannter Kontakt', value: 'Unwanted contact' }]
  },
  'media-time': {
    title: 'Family Media Time Planner',
    audience: 'Familien, Grundschulen, Ganztag',
    promise: 'Ein gemeinsamer Wochenplan, der Lernen, Spielen, Bewegung und Ruhe sichtbar ausbalanciert.',
    primaryAction: 'Medienvertrag planen',
    cards: [
      { title: 'Tagesrhythmus', body: 'Kinder wählen Slots für Lernen, Kreativität, Gaming, Bewegung und Schlafenszeit.' },
      { title: 'Gespräch statt Sperre', body: 'Reflexionsfragen helfen Eltern, Regeln gemeinsam mit Kindern auszuhandeln.' },
      { title: 'Schulmodus', body: 'Pädagoginnen können Vorlagen für Elternabende und Klassenprojekte exportieren.' }
    ],
    checklist: ['Keine Dauerüberwachung', 'Kind erklärt eigene Ziele', 'Altersband statt starre Minuten', 'Mehrsprachige Familienkarten'],
    nextSprint: ['Planer als Drag-and-drop-Prototyp bauen', 'PDF-Export entwerfen', 'Altersbänder 6–9, 10–12, 13–16 ausarbeiten'],
    flowSteps: ['Altersband und Ziel wählen', 'Medien-Slots gemeinsam verteilen', 'Familienvertrag ausdrucken'],
    demoItems: [{ label: 'Gaming-Regel', value: 'Cybermobbing' }, { label: 'Recherche-Regel', value: 'AI misinformation' }]
  },
  'help-bridge': {
    title: 'Youth Help Bridge',
    audience: '12–17 Jahre + Vertrauenspersonen',
    promise: 'Ruhige Soforthilfe bei Cybermobbing, Hass, Belästigung, Sextortion oder Falschinformation.',
    primaryAction: 'Problem einordnen',
    cards: [
      { title: 'Triage ohne Panik', body: 'Ein kurzer Fragenpfad trennt Notfall, Beratung, Meldung und Beweissicherung.' },
      { title: 'Beweise sichern', body: 'Checklisten erklären Screenshots, Links, Zeiten und sichere Aufbewahrung.' },
      { title: 'Weiterleitung', body: 'Nächste Schritte führen zu jugend.support, Nummer gegen Kummer oder einer Vertrauensperson.' }
    ],
    checklist: ['Notfallhinweise sichtbar', 'Keine Speicherung sensibler Fälle', 'Traumasensible Sprache', 'Meldewege pro Risikotyp'],
    nextSprint: ['Risikotypen modellieren', 'Notfallbanner juristisch prüfen lassen', 'Beratungslinks aktuell halten'],
    flowSteps: ['Problemtyp auswählen', 'Notfall oder Beratung unterscheiden', 'Beweise sichern und Hilfe öffnen'],
    demoItems: [{ label: 'Cybermobbing', value: 'Cybermobbing' }, { label: 'Ungewollter Kontakt', value: 'Unwanted contact' }, { label: 'Hassrede', value: 'Hate speech' }]
  },
  'ai-literacy': {
    title: 'AI Literacy Lab for Teens',
    audience: '12–19 Jahre + Lehrkräfte',
    promise: 'Mini-Lektionen, mit denen Jugendliche KI-Antworten prüfen, Quellen bewerten und Bias erkennen.',
    primaryAction: 'Quellen-Check üben',
    cards: [
      { title: 'Prompt sichtbar machen', body: 'Jugendliche sehen, welche Frage gestellt wurde und welche Annahmen darin stecken.' },
      { title: 'Quellenampel', body: 'Antworten werden nach Beleg, Aktualität, Perspektive und Risiko bewertet.' },
      { title: 'Lehrkraft-Modus', body: 'Unterrichtsimpulse für Recherche, Demokratiebildung und Desinformation.' }
    ],
    checklist: ['KI immer kennzeichnen', 'Keine emotionalen Bindungsmechaniken', 'Quellen vor Meinung', 'Bias-Reflexion nach jeder Aufgabe'],
    nextSprint: ['Drei Beispielaufgaben schreiben', 'Fact-check Rubric implementieren', 'Klassenraum-Export konzipieren'],
    flowSteps: ['Prompt und KI-Antwort lesen', 'Quellenampel ausfüllen', 'Bias und Perspektive reflektieren'],
    demoItems: [{ label: 'KI-Faktencheck', value: 'AI misinformation' }, { label: 'Hate-Speech-Erkennung', value: 'Hate speech' }]
  }
};

export const riskRoutes = [
  { risk: 'Cybermobbing', immediateStep: 'Screenshot sichern und Vertrauensperson einbeziehen', support: 'jugend.support' },
  { risk: 'Unwanted contact', immediateStep: 'Nicht antworten, blockieren, Beweise sichern', support: 'Nummer gegen Kummer' },
  { risk: 'Hate speech', immediateStep: 'Melden, dokumentieren, nicht alleine diskutieren', support: 'jugend.support' },
  { risk: 'AI misinformation', immediateStep: 'Quelle prüfen und zweite unabhängige Quelle suchen', support: 'Internet-ABC' }
];

export const domainExperiences = {
  'safe-search': {
    title: 'Themenräume für sichere Entdeckung',
    items: [
      { label: 'Schule & Hausaufgaben', detail: 'Startet bei kindgerechten Lexika, Internet-ABC und redaktionellen Lernseiten.' },
      { label: 'Nachrichten verstehen', detail: 'Führt zu Kinder-Nachrichten und erklärt schwierige Begriffe in einfacher Sprache.' },
      { label: 'Hobbys & Kreativität', detail: 'Bietet Basteln, Tiere, Sport und Musik ohne offene Kommentarbereiche.' }
    ]
  },
  'media-time': {
    title: 'Wochenplan-Bausteine',
    items: [
      { label: 'Lernen', detail: 'Recherche, Vokabeltraining oder schulische Medienarbeit mit klarem Ende.' },
      { label: 'Kreativzeit', detail: 'Video schneiden, Musik machen, zeichnen oder programmieren statt nur konsumieren.' },
      { label: 'Offline-Ausgleich', detail: 'Bewegung, Freunde, Schlaf und Familienzeit werden gleichwertig sichtbar.' }
    ]
  },
  'help-bridge': {
    title: 'Beruhigende Erste-Hilfe-Pfade',
    items: [
      { label: 'Ich werde beleidigt', detail: 'Nicht antworten, Screenshot sichern, blockieren und mit einer Vertrauensperson sprechen.' },
      { label: 'Jemand will Bilder', detail: 'Sofort stoppen, keine weiteren Inhalte senden, Beweise sichern und Hilfe holen.' },
      { label: 'Ich sehe Hass', detail: 'Melden, dokumentieren und nicht alleine in eskalierende Diskussionen gehen.' }
    ]
  },
  'ai-literacy': {
    title: 'KI-Check Übungen',
    items: [
      { label: 'Beleg finden', detail: 'Welche Quelle stützt die Antwort und ist sie aktuell genug?' },
      { label: 'Perspektive prüfen', detail: 'Welche Gruppe, Sprache oder Meinung fehlt in der Antwort?' },
      { label: 'Prompt verbessern', detail: 'Die Frage wird so umformuliert, dass Unsicherheit und Quellen verlangt werden.' }
    ]
  }
};
