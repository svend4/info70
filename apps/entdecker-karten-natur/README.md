# Entdecker-Karten: Tiere und Pflanzen vor der Tür

Ein Druck-Kartenset für Fachkräfte in der Kita. Die Karten gehören zu einem Beobachtungsgang draußen, den die Fachkraft begleitet. Altersgruppe 1 bis 3, fachkraftgeleitet, offline. Es ist kein Kinderbildschirm: Das Werkzeug ist für die Fachkraft.

**Status: erster Stand (MVP).** Kartendaten, Filter nach Gruppe und der Druck mit sechs Karten je Blatt sind gebaut. Die Prüfung im Browser steht noch aus.

## Was drin ist

Das Kartenset hat 19 Karten in vier Gruppen:

- **Tiere** (7): Katze, Hund, Kuh, Huhn, Fuchs, Hase, Bär. Je Karte drei Anregungen: sehen, hören, bewegen.
- **Pflanzen** (3): Baum, Strauch, Gras. Benennen und draußen suchen. Keine Bewegungs- oder Lautanregung.
- **Stoffe** (6): Wasser, Schnee, Eis, Sand, Ton, Steine. Anfassen, beobachten.
- **Jahreszeiten** (3): Herbstlaub, Schnee, Blüte. Beobachten.

Auf dem Bildschirm wählt die Fachkraft eine Gruppe, sieht die Vorschau und druckt den Kartenbogen. Der Druck enthält einen Blattkopf (Titel, Gruppe, Blattnummer, Ziel und Hinweis für die Fachkraft; auf Blättern mit Steinen, Sand oder Ton zusätzlich ein Sicherheitssatz) und die Karten. Die Bedienelemente fehlen im Druck. Gedruckt werden sechs Karten je A4-Blatt mit gestrichelten Schneidelinien.

## Was belegt ist

Die Inhalte stammen aus der Praleska: das Ziel auf S. 50 (Tiere und Pflanzen der nächsten Umgebung mit allen Sinnen wahrnehmen) und die Begriffe und Beobachtungsmerkmale auf S. 51. Jede Karte und jede Anregung trägt eine Seitenangabe. Die Formulierungen der Anregungen sind Eigenentwurf und so gekennzeichnet.

## Was nicht belegt ist oder nicht gebaut wurde

- Das Kartenformat ist Eigenentwurf. Die Quelle hat keine Karten und keinen Kartenkanon.
- Aus dem Katalogvorschlag nicht übernommen: Igel, Eichhörnchen, Amsel und Reh (die Quelle nennt sie nicht); Pflanzen an Bewegung oder Lauten erkennen (die Quelle nennt das nicht); NABU-, BNE- und Bildungsplan-Bezüge als Quellenaussage.
- Keine Bilder, Fotos oder Tonaufnahmen. Die Laute macht die Fachkraft selbst.
- Der Sicherheitssatz zu Steinen, Sand und Ton (Kleinteile, 1 bis 3 Jahre) ist Eigenentwurf, keine Quellenaussage.
- Keine Speicherung, keine Konten, keine Verbindung nach außen.

## Einsatz

Nicht jedes Tier ist draußen zu sehen. Dann zeigt die Fachkraft ein Bild oder ahmt den Laut nach (Eigenentwurf).

## Tests

Die Prüfung umfasst 34 Tests in zwei Dateien: `test/logik.test.mjs` (Daten und reine Logik) und `test/regeln.test.mjs` (Projektregeln am Quelltext).

```bash
node --test apps/entdecker-karten-natur/test/*.test.mjs
```

## Dateien

- `index.html`, `app.mjs`, `logik.mjs`, `daten/karten.json`, `druck.css`, `package.json`
- `GDD.md` (Entscheidungen und offene Punkte), `test/`
