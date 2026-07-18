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



export const impactMetrics = {
  'safe-search': [
    { label: 'Safe discovery rate', target: '80% of child sessions start from curated topic rooms during MVP tests.' },
    { label: 'Explainability', target: 'Children can repeat one reason why an unsafe result was hidden.' },
    { label: 'Adult confidence', target: 'Parents rate setup and supervision clarity at 4/5 or higher.' }
  ],
  'media-time': [
    { label: 'Agreement completion', target: 'Families complete a weekly plan and one reflection prompt in under 10 minutes.' },
    { label: 'Balance visibility', target: 'Every plan includes learning, creative time, rest, and offline activity.' },
    { label: 'Conflict reduction', target: 'Caregivers report fewer repeated rule negotiations after one week.' }
  ],
  'help-bridge': [
    { label: 'Time to next step', target: 'Young people identify a safe next action in under 90 seconds.' },
    { label: 'Support handoff', target: 'Each triage path ends with a trusted person or vetted help resource.' },
    { label: 'Data minimisation', target: 'No sensitive case narrative is required to receive guidance.' }
  ],
  'ai-literacy': [
    { label: 'Source-check habit', target: 'Learners identify at least two verification questions before trusting an AI answer.' },
    { label: 'Bias reflection', target: 'Each exercise captures one missing perspective or uncertainty.' },
    { label: 'Classroom reuse', target: 'Teachers can run a short exercise without accounts or data collection.' }
  ]
};

export const ageGuidance = {
  'safe-search': [
    { band: '6–9', guidance: 'Nur kuratierte Themenräume, kurze Texte und gemeinsame Begleitung durch Erwachsene.' },
    { band: '10–12', guidance: 'Mehr eigenständige Recherche mit sichtbaren Blockiergründen und Quellenhinweisen.' },
    { band: 'Eltern', guidance: 'Themen vorab auswählen, Freigaben erklären und keine offenen Plattformen als Standard setzen.' }
  ],
  'media-time': [
    { band: '6–9', guidance: 'Kurze Medienfenster mit direkter Anschlussaktivität wie Bewegung, Spiel oder Vorlesen.' },
    { band: '10–12', guidance: 'Gemeinsam Ziele definieren: Lernen, Kreativität, Kontakt und Pausen werden getrennt geplant.' },
    { band: '13–16', guidance: 'Mehr Selbstverantwortung mit Reflexion über Schlaf, Stress, soziale Medien und Gaming.' }
  ],
  'help-bridge': [
    { band: '12–14', guidance: 'Sehr kurze Fragen, sofort sichtbare Vertrauensperson und klare Notfall-Abgrenzung.' },
    { band: '15–17', guidance: 'Mehr Autonomie bei Beweissicherung, Meldewegen und Vorbereitung auf Beratungsgespräche.' },
    { band: 'Vertrauenspersonen', guidance: 'Nicht beschämen, Fall nicht weiterverbreiten, Sicherheit und Unterstützung priorisieren.' }
  ],
  'ai-literacy': [
    { band: '12–14', guidance: 'KI als Werkzeug erklären: Kennzeichnung, Quellenfrage und einfache Bias-Beispiele.' },
    { band: '15–19', guidance: 'Komplexere Checks zu Aktualität, Perspektiven, politischer Desinformation und Prompt-Qualität.' },
    { band: 'Lehrkräfte', guidance: 'Aufgaben mit Diskussionsfragen, Quellenrubrik und Reflexion statt reiner Verbotslogik planen.' }
  ]
};

export const localizedSummaries = {
  'safe-search': {
    de: 'Sichere Suche mit kuratierten Themenräumen und Eltern-Freigaben.',
    ru: 'Безопасный поиск с тематическими комнатами и родительским одобрением.',
    uk: 'Безпечний пошук із тематичними просторами та батьківським підтвердженням.',
    tr: 'Küratörlü konu alanları ve ebeveyn onayıyla güvenli arama.'
  },
  'media-time': {
    de: 'Gemeinsamer Medienzeitplan für Lernen, Kreativität, Bewegung und Ruhe.',
    ru: 'Семейный план экранного времени для учёбы, творчества, движения и отдыха.',
    uk: 'Сімейний план медіачасу для навчання, творчості, руху та відпочинку.',
    tr: 'Öğrenme, yaratıcılık, hareket ve dinlenme için aile medya zamanı planı.'
  },
  'help-bridge': {
    de: 'Ruhige Erste Hilfe bei Cybermobbing, Kontaktgefahren, Hass und Bilddruck.',
    ru: 'Спокойная первая помощь при кибербуллинге, опасных контактах, ненависти и давлении с изображениями.',
    uk: 'Спокійна перша допомога при кібербулінгу, небезпечних контактах, ненависті та тиску щодо зображень.',
    tr: 'Siber zorbalık, riskli temas, nefret ve görüntü baskısı için sakin ilk yardım.'
  },
  'ai-literacy': {
    de: 'KI-Antworten prüfen: Quellen, Perspektiven, Bias und bessere Prompts.',
    ru: 'Проверка ответов ИИ: источники, перспективы, предвзятость и лучшие промпты.',
    uk: 'Перевірка відповідей ШІ: джерела, перспективи, упередження та кращі промпти.',
    tr: 'Yapay zekâ yanıtlarını kontrol etme: kaynaklar, bakış açıları, önyargı ve daha iyi istemler.'
  }
};

export const supportedLocales = [
  { code: 'de', label: 'Deutsch' },
  { code: 'ru', label: 'Русский' },
  { code: 'uk', label: 'Українська' },
  { code: 'tr', label: 'Türkçe' }
];

export const privacyCommitments = [
  'No child account required in the prototype',
  'No analytics, tracking pixels, cookies, or local storage in the prototype',
  'No collection of names, exact locations, contact details, or case descriptions',
  'All demo decisions stay in the browser session and are not sent to a server'
];
