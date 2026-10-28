# 🕊️ Kinderrechte-Entdecker — Kurz-GDD

> GDD задним числом (решение Max 26а, Stand 27.10.2026). Описано, что приложение делает на самом деле: по `README.md`,
> `index.html`, `eltern.html`, `manifest.webmanifest`, `app.mjs`, `daten/fragen.json`, `test/` и по движку
> `packages/quiz-kern`, в котором лежит весь ход игры; плюс прогоны в браузере при 360 px (Playwright:
> `tools/quiz-durchlauf.mjs`, `tools/browser-tor.mjs` и одноразовые скрипты вне репозитория) и расчёт состава раунда
> (вне репозитория). Чего здесь не проверить, помечено «(offen)». Расхождения и вопросы — в п. 10. README, код и данные
> этим документом не менялись. Исправлено 28.10.2026 после независимой проверки: учтён коммит fc252fa (Befunde Strang Г,
> ошибка в k02), уточнены формулировки в п. 1, 3, 6, 7, 9 и 10, добавлен Sharenting-Block.

## 1. Феномен / потребность (Warum)
Тематика — права ребёнка по UN-Kinderrechtskonvention, включая права в цифровой среде. По README (Z.13–20) и docs/05
(Z.22) идея выросла из трёх сигналов: фокус BzKJ 2026 «Demokratiefähigkeit», проект министерства Kinder-Ministerium для
7–11 лет и General Comment No. 25 (2021) о правах ребёнка в цифровой среде (Quelle: README, docs/05; сами источники
вне репозитория, не перепроверены — offen). По замыслу авторов, без такого приложения «свои права» остаются для ребёнка
8–12 лет общим словом, не связанным ни с классным советом, ни с чатом, ни с вопросом «кому позвонить» (116 111); это
предположение, а не измерение (проверяет Kindertest, п. 9). Здесь ребёнок решает, верно ли утверждение («✅ Stimmt» /
«❌ Stimmt nicht»), или выбирает из трёх вариантов, после каждого ответа читает короткое объяснение и узнаёт, что права
действуют и в интернете.
Развитие: Welle 3 (12.07.2026) — движок и 12 вопросов (k01–k12); в тот же день +8 «Digital» (k13–k20), всего 20;
Welle 32 (18.07.2026) — паки Schutz, Förderung, Beteiligung (k21–k51), всего 51 (Quelle: git-история, docs/09 Z.66);
A7 (20.10.2026) — движок без Rekord и Ränge; 9б (27.10.2026) — Service Worker убран, вместо него очистка старых
регистраций.

## 2. Игрок и обещание (Wer + Kernerlebnis)
**Zielgruppe: Kinder (Alter 8–12).** Belege:
- `README.md` Z.3 «для 8–12 лет»; `daten/fragen.json` Z.3 `"zielgruppe": "8-12"`; `app.mjs` Z.1 «(8-12 Jahre)»;
  `package.json` («fuer 8-12 Jahre»); Hub `index.html` Z.63: раздел «Stark werden (Kinder)», ссылка на приложение Z.65.
- Обращение «du» («Du hast Rechte. Kennst du sie?»); полей ввода нет; приложения нет ни в `docs/erwachsenen-apps.json`,
  ни в `docs/kinder-apps-mit-eingabe.json`; тест hilfe-insel-abdeckung требует Hilfe-Insel у него как у детского
  приложения (раздел «Kinderrechte, Beschwerde, Teilhabe»).
- Родители: страница `eltern.html` («So begleiten Sie Ihr Kind»). Совместная игра — только необязательные режимы движка
  на стартовом экране: «Duett» (двое по очереди, «z. B. Eltern und Kind, Enkel und Oma»), «Geschwister-Staffel» и
  «Klassen-Modus» (одна проекция для класса); основной сценарий — один ребёнок сам. По решению Max 34а README и этот GDD
  называют детей пользователями → Kinder-App: действуют Vorlesen (28а) и правило «ребёнок не оценивается»
  (docs/02 Z. 141–146).

Соседи: `mini-rechte-entdecker` (6–8), `plattform-rechte-13` (13–15), `rechte-kompass` (произнести своё право),
`rechte-lexikon`, `mitmach-arena`, `kinderrat`.
Одно предложение: «Ребёнок за 12 вопросов (из 51) разбирает, что ему положено — защита, развитие, участие и права в
сети, — после каждого ответа читает объяснение и уходит с мыслью «у меня есть права, и я могу позвать на помощь: 116 111»».

## 3. Движок и петля (Wie)
Движок: `quiz-kern` (`starteQuiz`, `packages/quiz-kern/src/quiz.mjs`, 393 строки). Приложение — тонкая оболочка в 32
строки: данные `daten/fragen.json`, тексты, политика (`installiereNetzwerkWaechter()` Z.6, `hilfeInsel: true` Z.13,
`rundenGroesse: 12` Z.15).
Основная петля (Einzel, прогнана в браузере): старт (заголовок, «Du hast Rechte. Kennst du sie?», вступление, «▶️
Entdeckungsreise starten», «🔊 Vorlesen», три карточки режимов, «🆘 Ich brauche Hilfe») → 12 раз [«Frage n von 12 ·
Kategorie» и полоса прогресса, вопрос: binaer — утверждение в кавычках и две кнопки «✅ Stimmt» / «❌ Stimmt nicht» (текста
«Stimmt das?» на экране нет: он звучит только в «🔊 Vorlesen», `quiz.mjs` Z.195–203, текст Vorlesen Z.200; в Duett и Staffel
по коду так же, Z.276 и Z.343; на общем экране Klassen-Modus он виден, Z.147. В браузере: Einzel — ни на одном из 5
binaer-экранов раунда, Klassen-Modus — на 8 из 12 экранов) либо wahl с тремя перемешанными вариантами → Rückmeldung
«Richtig! 🎉» (зелёная рамка) или «Nicht ganz …» (красная) + объяснение + «🔊
Vorlesen» → «Nächste Frage ➡️»] → финал «Entdeckungsreise geschafft!», «Du hast alle Fragen durchgearbeitet.», «🔁 Noch
einmal», «🏠 Zum Start». Итоговой суммы, рекорда и рангов нет; «Frage n von 12» — только ход раунда.
Режимы движка: «Klassen-Modus» (вопрос и варианты на общем экране, «🔍 Auflösung zeigen», затем объяснение; в конце «Alle
12 Fragen gemeinsam besprochen!»), «Duett» (двое по 12 вопросов подряд на одном устройстве, «Spieler 1/2 ist dran»),
«Geschwister-Staffel» (вопросы по очереди, после ответа младшего «Große*r, erkläre es kurz mit eigenen Worten!»).
Прогон `node tools/quiz-durchlauf.mjs kinderrechte-entdecker --modus alle`: Einzel 12 ответов, Duett 24 (по 12 на
человека), Staffel 12; все проверки конца (нет «Zahl von Zahl», Rekord, Punkte, Rang, Stern/Pokal, Druck-Symbole, старый
ключ удалён, нет Löschknopf) — ok.
Реиграбельность: каждый раунд — новая случайная выборка 12 из 51 (`mischen` + `slice`, `quiz.mjs` Z.125–126), порядок
вариантов в wahl тоже перемешан. Между раундами вопросы повторяются: ожидаемо 2,8 из 12 общих, раунд без повторов
возможен лишь примерно в 2,5 % случаев (расчёт, гипергеометрическое распределение; Quelle: eigene Rechnung, nicht im Repo).

## 4. Lernziele (проверяемые!)
По README (Z.24–27) с привязкой к данным:
1. Ребёнок объясняет, что Конвенция существует и касается лично его, и называет 2–3 права своими словами. В данных
   названы 15 статей UN-KRK: 2, 5, 6, 7, 12, 13, 16, 17, 19, 23, 24, 28, 29, 31, 32 (Quelle: daten/fragen.json).
2. Ребёнок знает право быть услышанным (Art. 12) и называет место участия: Klassenrat, Jugendparlament, Mitmach-Arena,
   Kinderrat (k03, k04, k41–k51).
3. Ребёнок знает, что права действуют и в интернете — приватность, защита, удаление данных, жалоба на платформу, метка
   у контента от ИИ — и говорит, что можно потребовать у приложения (k07, k12–k20, k24, k29, k30).
4. Ребёнок называет, куда обратиться за помощью: взрослый, которому доверяет, или Nummer gegen Kummer 116 111; «Hilfe holen
   ist kein Petzen» (k10, k21, k23, k25, k30).
5. Из данных, README не называет: защита от насилия, мобинга, «плохих секретов» и принуждения к фото (k21–k30); право на
   образование, здоровье, игру и отдых (k31–k40).
Состав раунда случаен, гарантий по темам нет: примерно в каждом двадцатом раунде нет ни одного вопроса «Digital», примерно
в каждом четвёртом ни одно объяснение не называет 116 111 (оно стоит в 5 объяснениях из 51); вопрос k02 («Was ist die
UN-Kinderrechtskonvention?») попадает в раунд с вероятностью 12 из 51 (Quelle: eigene Rechnung, nicht im Repo).
Как проверяется (Quelle: test/fragen.test.mjs): 6 тестов проверяют схему (≥ 50 вопросов), размеры паков Schutz, Förderung
и Mitbestimmung (по ≥ 10), темы паков по ключевым словам, пакет «Digital» (≥ 10), наличие и «ja», и «nein» среди binaer,
наличие 116 111 хотя бы в одном вопросе, но не усвоение. Усвоение проверяет только Kindertest (п. 9, «объясни своими
словами»).

## 5. Контент-план
Единица контента: вопрос. MVP: 51 вопрос в `daten/fragen.json` (`version` 1, `"zielgruppe": "8-12"`): 30 `binaer`
(21 «ja», 9 «nein») и 21 `wahl` (всегда три варианта). Схема общая для quiz-kern: `id, typ (binaer|wahl), kategorie,
aussage|frage, korrekt (ja|nein либо индекс), antworten[], erklaerung`; объяснения от 122 до 238 знаков, медиана 176.
Категории (Quelle: daten/fragen.json): Mitbestimmung 13, Schutz 11, Digital 10, Förderung 10, Deine Rechte 3 и по одному
вопросу Privatsphäre, Gleichheit, Information, Hilfe holen.
Происхождение: k01–k12 базовые; k13–k20 пак «Digital»; k21–k30 Schutz; k31–k40 Förderung; k41–k51 Beteiligung (Quelle: git-история, docs/09 Z.66).
Перекрёстные ссылки в текстах: Mitmach-Arena (k04, k42, k50), Kinderrat (k42, k50), takt-pause (k33), Spiel-Recht-Balance (k34).
Дидактический анти-шаблон: тест требует лишь, чтобы среди binaer встречались и «ja», и «nein». В данных 21 «ja» против
9 «nein» (в раунде в среднем 4,9 против 2,1); во всех 21 wahl верный вариант — единственный самый длинный по знакам (по
словам в 20 из 21; медиана отношения к самому длинному неверному 1,63), то есть угадывать можно по длине. Порядок
вариантов перемешивается, индекс правильного ответа ребёнку не виден. Тесты этого не ловят (п. 10).

## 6. Политика соответствия (Pflicht, docs/02 Z. 22–24, Z. 79–82, Z. 141–146)
Легенда: [x] проверено на коде или замером; [ ] не выполнено или не предусмотрено — с причиной.
- [x] **Werbefrei / без покупок:** в `app.mjs`, `index.html`, `eltern.html`, `manifest.webmanifest`, `daten/fragen.json` нет
  `http(s)://`, `<img>`, `<iframe>`, чужих скриптов; `eltern.html` Z.20: «Keine Werbung, keine Käufe, keine Anmeldung».
- [x] **Без аккаунтов и ввода:** нет `<input>`, `<form>`, `<textarea>`; только кнопки.
- [x] **Без внешних запросов (docs/02 Z. 22–24):** CSP `default-src 'self'; style-src 'self' 'unsafe-inline'` в `index.html`
  и `eltern.html` (Z.6); `installiereNetzwerkWaechter()` (`app.mjs` Z.6); единственный `fetch` — относительный
  `daten/fragen.json` (Z.8). Замер (старт, полный раунд Einzel, Hilfe-Insel): ни одного запроса к чужому хосту;
  `browser-pruefung`: `fremdeHosts` 0, ошибок консоли нет.
- [x] **Speicher:** приложение ничего не пишет: `setItem` нет ни в `app.mjs`, ни в `quiz-kern`. Старый ключ `kre.rekord`
  (`rekordSchluessel`, `app.mjs` Z.14) один раз удаляется при запуске (`quiz.mjs` Z.56–59, только этот ключ): в браузере
  при предзаданных `kre.rekord` и `andere.app` после загрузки остался только `andere.app`. После полного раунда localStorage,
  sessionStorage и cookies пусты. Читается только `ui.anzeige` (Kontrast/Schrift через `bootAnzeige()`, `quiz.mjs` Z.48);
  пишет его не это приложение. **Löschknopf: нет** — так и положено (решение 30б): «Meine Daten löschen» на старте нет
  (проверка quiz-durchlauf «kein Löschknopf»), тест speicher-regel зелёный, `docs/speicher-stand.json` пуст.
- [x] **Kein Service Worker:** нет `sw.js`, нет `register`; `app.mjs` Z.30–32 снимает старые регистрации и стирает Caches
  (тест kein-service-worker: приложение в списке «früherer» Apps); в браузере регистраций 0 (решение Max 9б).
- [ ] **Offline:** нет (9б); Neuladen ohne Netz не удаётся (замер). `manifest.webmanifest` остаётся (`index.html` Z.10,
  `display: standalone`, `icons: []`) — п. 10.
- [x] **Vorlesen:** прямых вызовов в `app.mjs` нет, кнопка «🔊 Vorlesen» приходит из движка (`vorlesenKnopf`, `quiz.mjs`
  Z.94–95): на старте, у каждого вопроса, у каждой Rückmeldung, в финале и в Hilfe-Insel (проверено в браузере), а в режимах
  Klassen-Modus, Duett и Staffel — по коду (`quiz.mjs` Z.150, 163, 276, 301, 343, 369); `vorlesen()` из kinder-ui берёт
  локальный голос устройства, если он есть. Читается «вопрос + варианты» и «заголовок + объяснение».
- [x] **eltern.html:** есть; ссылка «👪 Für Eltern» в Fuß каждого экрана (`quiz.mjs` Z.77).
- [x] **Impressum-Link в Fuß:** `../../impressum.html` (`quiz.mjs` Z.79, `eltern.html` Z.37); тест impressum-link зелёный.
  Сама страница — шаблон с заглушками (п. 10).
- [x] **Hilfe-Insel (116 111):** `hilfeInsel: true` (`app.mjs` Z.13) → кнопка «🆘 Ich brauche Hilfe» на старте; экран
  открывается, показывает 116 111 и Elterntelefon, возвращает на старт; приложение в списке обязательных у теста
  hilfe-insel-abdeckung. Во время раунда кнопки помощи на экранах вопросов нет.
- [ ] **Druck:** не предусмотрен — нет `druck.css`, нет кнопки печати и `window.print` (grep «print|druck» пуст). Печать из
  браузера: общий `kinder.css` скрывает только `.k-fuss` (`@media print`), остальной экран печатается как есть; Basislinie
  `druck` = 10 (Emoji и знаки в видимом тексте; инструмент видит только стартовый экран, у кнопок нет `data-kennung`),
  замер повторён: 0 Erhöhungen. Требование docs/02 Z. 79–82 привязано к кнопке печати, её здесь нет.
- [ ] **Keine Wertung des Kindes (docs/02 Z. 141–146):** суммы, очков, рекорда, процентов, рангов нет (quiz-durchlauf: все
  проверки конца ok; `node tools/bewertung-stand.mjs` → «Stand stimmt»; в `docs/bewertung-stand.json` приложения нет ни
  в `apps`, ни в `ausnahmen`). Но `node tools/leistungs-woerter.mjs kinderrechte-entdecker` даёт два Treffer, и один из них
  не снят: `geschafft` в `fertigTitel: 'Entdeckungsreise geschafft!'` (`app.mjs` Z.26) — слово из списка 37в. Второй Treffer,
  `rekord` в `rekordSchluessel: 'kre.rekord'` (Z.14), — строка Migration, не оценка. Rückmeldung je Antwort («Richtig! 🎉» /
  «Nicht ganz …», `quiz.mjs` Z.23–24) по коммиту A7 (56b2b22) осталась намеренно и в списке 37в не названа.
- [x] **Mobile First (замер, 360 px):** на старте 8 целей касания, ни одной меньше 48 px, нет переполнения; на экранах
  вопроса, Auflösung, Hilfe-Insel, Klassen-Modus, Duett и на `eltern.html` я тоже не нашёл ни переполнения, ни целей меньше
  48 px; Delta-Tor `tools/browser-tor.mjs`: 0 Erhöhungen. Клики и Fokus официальный инструмент не измеряет (нет
  `data-kennung`, Basislinie `ohneKennung` 1).

Особые риски темы: вопросы про насилие (k21), «плохие секреты» (k27), незнакомца в чате, просящего фото (k25), страх в сети
(k30), детский труд (k09, k26) и «права против родителей» (k05, k20, k51) могут тревожить или вызывать конфликт в семье. В
коде: объяснения заканчиваются действием («hol dir Hilfe», «Hilfe holen ist kein Petzen», 116 111), без подробных описаний; на старте
Hilfe-Insel. `eltern.html` предлагает говорить вместе только о праве на Privatsphäre (вопрос k05 про дневник, Z.28: «Familienregeln
gemeinsam besprechen») и сохранить 116 111 в телефоне ребёнка (Z.30); о насилии (k21), секретах (k27), фото в чате (k25) и
страхе в сети (k30) страница для родителей ничего не говорит (п. 10). Утверждения о праве, деньгах и здоровье в текстах без
источника — п. 10.
Повторить проверки: `node --test apps/kinderrechte-entdecker/test/*.test.mjs`, `node tools/leistungs-woerter.mjs
kinderrechte-entdecker`, `node tools/quiz-durchlauf.mjs kinderrechte-entdecker --modus alle`,
`node tools/browser-tor.mjs kinderrechte-entdecker`.

## 7. Стандарты и финансирование (Wofür)
Всё ниже взято из репозитория и юридически не перепроверено (Fachprüfung не проводилась — offen).
- UN-KRK (Quelle: daten/fragen.json, docs/11 Z.47): в объяснениях названы статьи 2, 5, 6, 7, 12, 13, 16, 17, 19, 23, 24, 28,
  29, 31, 32; docs/11 относит приложение к Art. 42 «Kinder kennen ihre Rechte». Номера статей без отметки «проверено
  человеком» — offen.
- General Comment No. 25 (2021) — по имени («General Comment 25») назван только в k19; k07 и k24 говорят лишь «Die UN haben
  2021 klargestellt» без названия документа — Quelle: daten/fragen.json.
- DSGVO Art. 15 и 17 (k13, k14), DSA (k15, k18), EU-KI-Gesetz (k16) — Quelle: daten/fragen.json; формулировки упрощены,
  Fachprüfung offen.
- Katalogtext (Quelle: docs/09 Z.184; не проверен): Pack Schutzrechte → «UN-KRK, JuSchG, JMStV».
- Katalogtext (Quelle: docs/09 Z.187; не проверен): Pack Digitale Rechte → «UN-KRK, DSGVO, DSA, AI Act».
- Förder-Fit: BzKJ 2026 «Demokratiefähigkeit» (Quelle: README Z.13–14, docs/05 Z.22); партнёр по теме — DKHW / kindersache.de
  (Quelle: docs/08 Z.15). Суммы, сроки и доли в GDD не приводятся (offen). Детали — foerder-navigator.

## 8. Аджайл-оценка
Aufwand: S (дни): `app.mjs` 32 строки, `daten/fragen.json` 518 строк (51 вопрос), 6 тестов; весь ход игры в `quiz-kern`
(393 строки движка + схема 44 + `staffel.mjs` 8). Основная работа — тексты и баланс вопросов. Переиспользует: `quiz-kern`
(раунд, три режима, проверка схемы), `kinder-ui` через движок (`el`, `vorlesen`, `mischen`, `boot` Anzeige, `hilfeInsel`),
`kinderschutz` (`installiereNetzwerkWaechter`). Первый срез (playable) уже работает: полный раунд из 12 вопросов с
озвучиванием и без итоговой оценки. Расширение банка — вопросы в JSON; число «51» во вступлении набрано руками (п. 10).

## 9. Kindertest-гипотезы
Что проверяем на 5–8 детях 8–12 лет (протокол — docs/05, метод 5); это гипотезы, результатов нет:
1. Понимают ли дети объяснения без помощи взрослого, особенно слова «Auskunftsrecht», «Recht auf Vergessenwerden» и
   названия законов (k12–k19)? Объяснения 122–238 знаков: читают ли до конца, помогает ли «Vorlesen»?
2. Угадывают ли по длине: выбирают ли в wahl самый длинный вариант (он верен 21 раз из 21)? Отвечают ли «Stimmt» по умолчанию
   (21 из 30 binaer — «ja»)? Как меняется результат, если варианты выровнять по длине?
3. Могут ли пересказать своими словами одно право из каждой группы (защита, развитие, участие, цифровые права) и назвать,
   куда звонить (116 111)? Запоминают ли номер, если в раунде его нет (примерно каждый четвёртый раунд)? Находят ли
   «🆘 Ich brauche Hilfe»?
4. Тревожат ли темы Schutz (k21, k25, k27, k30)? Что делает ребёнок после «Nicht ganz …» — читает объяснение, пропускает,
   расстраивается? Как воспринимается красная рамка?
5. Права и родители (k05, k20, k51): рождается ли разговор дома (`eltern.html` Z.28 предлагает его только для k05) или
   ребёнок понимает это как «против родителей»?
6. Замечают ли повторы вопросов во втором раунде (ожидаемо 2,8 из 12) и мешает ли это играть «Noch einmal»?
7. Режимы: находят ли Duett, Staffel и Klassen-Modus; помогает ли Staffel («Große*r, erkläre …») старшему объяснить?

## 10. Offen / Zweifel
**Widersprüche (README ↔ Code ↔ Text ↔ Tests ↔ Doku)**
- **Ошибка в детском контенте, зафиксированная в репозитории (решить первой).** k02, `daten/fragen.json` Z.24 (`erklaerung`):
  «Deutschland hat ihn 1992 unterschrieben» ↔ `docs/externe-fakten-befunde.md`, раздел A («Kinder sehen eine falsche oder
  unsichere Aussage (zuerst entscheiden)»), строка kinderrechte-entdecker: это «stimmt nicht» — unterzeichnet am 26.01.1990,
  Ratifikationsurkunde am 06.03.1992 hinterlegt, in Kraft seit 05.04.1992 (BGBl. 1992 II S. 990); предложенная правка:
  «Deutschland hat ihn 1990 unterschrieben und 1992 bestätigt». Та же запись — в `docs/externe-fakten-liste-1-recht-geld.md`
  (раздел kinderrechte-entdecker, примечание у `daten/fragen.json:21`, «Nebenbefund Zeile 24») и в `docs/fragen-und-hinweise.md`
  Z.93. Приложение не менялось: правка ждёт «да» Max (Strang Г, решения 12а–15а). Даты и номер BGBl. я у первоисточника не
  проверял, GDD опирается на запись репозитория (offen). Пока текст не исправлен, ребёнок читает его после ответа на k02;
  k02 попадает в раунд с вероятностью 12 из 51 (п. 4).
- README (Welle 3) Z.31 «Банк расширен с 12 до 20 вопросов» ↔ `daten/fragen.json`, `app.mjs` Z.19 («Vorrat von 51») и
  Wurzel-README Z.145 («51 вопр.»): 51 (30 binaer + 21 wahl); три пака Welle 32 (защита, развитие, участие) в README
  не описаны. «Digital»: 10 (README: пак из 8 — «2 Basis + 8 Pack» верно).
- README Z.24 «ст. 2, 7, 12, 16, 17, 28, 31, 32» ↔ данные цитируют 15 статей UN-KRK и DSGVO Art. 15 и 17 (Quelle: daten/fragen.json),
  список статей — в п. 4.
- README Z.19–20 «вопросы k07, k12 связывают с General Comment No. 25» ↔ k12 — о правах по DSGVO; «General Comment 25» по
  имени назван только в k19, а k07 и k24 говорят «Die UN haben 2021 klargestellt» без названия документа (Quelle:
  daten/fragen.json).
- README Z.26 «мост к Daten-Schatz» ↔ в `fragen.json`, текстах и `eltern.html` Daten-Schatz не упомянут (grep пуст); связи
  есть с Mitmach-Arena, Kinderrat, takt-pause, Spiel-Recht-Balance.
- Katalog docs/09 Z.184: Pack Schutzrechte «12-15 Fragen», 116 111 «in jeder Erklaerung» ↔ в данных пак k21–k30 = 10 вопросов,
  116 111 в 4 из них (k21, k23, k25, k30); во всём банке — в 5 из 51 (с k10).
- Fuß движка «Daten bleiben auf diesem Gerät» (`quiz.mjs` Z.76, на каждом экране) ↔ `eltern.html` Z.22 «Gespeichert wird
  nichts» и код (приложение ничего не пишет). Не ложь, но читается как «данные есть».
- Wurzel-README Z.74–77 («в quiz-приложениях ту же роль играет кнопка самого `quiz-kern` (она удаляет рекорд)») и
  `packages/quiz-kern/README.md` Z.8–10 и Z.21–22 («результат/ранг/рекорд», «кнопка удаления данных», «в localStorage пишет
  только рекорд») ↔ код `quiz-kern`: ни рекорда, ни ранга, ни кнопки; только `removeItem` старого ключа.
- docs/11 Teil C (Z.122) и Teil D, пункт 3 (Z.152): «überall mit Lösch-Knopf» ↔ решение 30б: нет хранения — нет кнопки; у этого
  приложения её нет.
- `fertigTitel: 'Entdeckungsreise geschafft!'` (`app.mjs` Z.26) ↔ решение 37в (слово «geschafft» в списке) и Lauf C (git
  96a1f89): у квизов заголовки вида «… geschafft!» заменены на «Ende der Runde» (пример: koeder-quiz); здесь остался.
  Запасное значение движка `fertigTitel: 'Geschafft!'` (`quiz.mjs` Z.27) того же рода.
- Число «51» набрано руками в `app.mjs` Z.19; тест требует только ≥ 50 (`fragen.test.mjs` Z.9). При росте или сокращении банка
  вступление снова устареет, как устарел README.
- Altersangaben: README, JSON, `app.mjs`, `package.json` и Hub согласованы (8–12). Katalog предлагает варианты 6–8 и 13–15; оба
  существуют отдельными приложениями (`mini-rechte-entdecker`, `plattform-rechte-13`).

**Offene Fragen (für Max)**
- «Geschafft»: заменить `fertigTitel` на «Ende der Runde», как в других квизах, или оставить «Entdeckungsreise geschafft!»
  с записью в `docs/bewertung-stand.json`? Пока Treffer в отчёте не объяснён нигде.
- Подсказка по длине (верный wahl-вариант самый длинный в 21 из 21) и перекос «ja» 21 : «nein» 9: менять вопросы до
  Kindertest? Это контент, не код; тесты (`fragen.test.mjs`) такого не ловят. Для сравнения: в koeder-quiz верный вариант самый
  длинный в 7 из 8, в stark-und-gesund в 5 из 8 (мой подсчёт по `daten/fragen.json`, Quelle: eigene Rechnung).
- Fakten ohne Quelle в `daten/fragen.json` (Recht und Geld; Fachprüfung offen):
  - шесть утверждений о праве: k12–k16 и k21 (Quelle: daten/fragen.json);
  - k01 и вступление: «fast alle Länder …» — не подтверждено (Quelle: daten/fragen.json); год в k02 («Deutschland hat ihn
    1992 unterschrieben») здесь не «не подтверждён»: репозиторий называет его ошибкой, см. первый пункт в «Widersprüche»;
  - k10: «montags bis samstags», «kostenlos»; k31: «Grundschule … kostenlos» (Quelle: daten/fragen.json);
  - k17: «Förderregeln in Deutschland»; k21: «im Gesetz … gewaltfreie Erziehung» (Quelle: daten/fragen.json);
  - формулировки k15 («große Plattformen»), k16 («für viele KI-Inhalte») и k18 требуют Fachprüfung (Quelle: daten/fragen.json);
  - счётчик внешних фактов (`docs/externe-fakten-stand.json`): 20 блокирующих строк на приложение — 7 по категории «recht» (6
    утверждений и вариант ответа k02), 12 попаданий на слово из названия категории (это права, не финансирование), 1 на слово
    из неверного варианта k32. Это долг Strang Г (решения 12а–15а: сначала список, правки после «да»).
- Sharenting-Block в `eltern.html` Z.33–36 («📸 Übrigens: Sharenting»; сквозной блок, не специфичный для этого приложения:
  по grep он стоит в 17 `eltern.html`, docs/05 Z.46 (идея №12) говорит «во всех 8»): правовая формулировка «Recht am eigenen
  Bild» без Fundstelle и ссылка на Gefährdungsatlas BzKJ как на источник (сам Atlas вне репозитория) — (offen, Fachprüfung).
  В список «Fakten ohne Quelle» выше блок не входит: тот список и счётчик (20 строк) относятся к `daten/fragen.json` и
  `app.mjs`, а строки этого блока счётчик внешних фактов (`packages/kinderschutz/src/externe-fakten.mjs`) не находит (в его
  списках слов нет «Recht am eigenen Bild» и «BzKJ»; проверено запуском `pruefeDatei` на `eltern.html`: ни одного Treffer).
  `docs/externe-fakten-befunde.md`, раздел B (строка sharenting-spiegel, `daten/szenarien.json:57`), называет ту же формулировку
  «Recht am eigenen Bild» (там вместе с Art. 16 UN-KRK) требующей юридической проверки.
- Vorlesen и «keine fremden Server»: без локального голоса (`localService`) браузер выбирает голос сам, он может быть
  сетевым (комментарий в `komponenten.mjs`); `installiereNetzwerkWaechter` перехватывает только fetch, XHR и WebSocket.
  Формулировка «technisch erzwungen» (`eltern.html` Z.21) относится к ним, не к Sprachausgabe. Нужна ли оговорка — offen.
- Заблокированный localStorage: если доступ к `localStorage` бросает SecurityError (в браузере симулировано init-скриптом, не
  настройкой), страница остаётся пустой (нет h1, нет кнопок). Причина — `boot()` в `kinder-ui/js/anzeige.mjs` (параметр по
  умолчанию `globalThis.localStorage`), вызываемый из `starteQuiz` (`quiz.mjs` Z.48) раньше `try/catch` вокруг
  `removeItem` (Z.58), который как раз рассчитан на «gesperrter Speicher». Тестов на этот случай нет; какие настройки
  реальных браузеров его вызывают, не проверено (offen).
- `manifest.webmanifest` (`display: standalone`, `icons: []`) остаётся после снятия Service Worker (9б): манифест говорит
  «приложение», а работы без сети нет (Neuladen ohne Netz не удаётся, замер). Оставить манифест или убрать ссылку?
- Hilfe-Insel только на старте; на экранах вопросов (k21–k30 про насилие, чат, секреты) кнопки помощи нет, 116 111 стоит лишь
  в 5 объяснениях. Достаточно ли этого?
- Impressum: страница, на которую ведёт ссылка в Fuß, сама пишет «Noch nicht veröffentlichungsreif» (поля — заглушки). Касается
  всех приложений.
- Browser: Fokus nach Klick и Klickfehler для этого приложения официальным инструментом никогда не измерялись (нет
  `data-kennung`); мои прогоны это не заменяют.
