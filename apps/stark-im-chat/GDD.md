# 💪 Stark im Chat — Kurz-GDD

> GDD задним числом (решение Max 26а, Stand 27.10.2026). Описано, что приложение делает на самом деле: по `README.md`,
> `index.html`, `eltern.html`, `app.mjs`, `daten/szenarien.json` и `test/szenarien.test.mjs` (`logik.mjs`, `manifest`
> и `sw.js` в папке нет), плюс прогоны в браузере при 360 px (`tools/browser-tor.mjs` и одноразовые скрипты
> Playwright вне репозитория — в репо их нет) и подсчёт по данным (скрипт вне репозитория). Чего здесь не проверить,
> помечено «(offen)». Расхождения и вопросы — в п. 10. README, код и данные этим документом не менялись.

## 1. Феномен / потребность (Warum)
Тематика — кибербуллинг (Cybermobbing) и роль свидетеля (Bystander). По README (Z.11–17) идея выросла из одного
сигнала: Cybermobbing — одно из центральных явлений риска в «Gefährdungsatlas» BzKJ, и эта тема не была покрыта ни
одним приложением линейки (Quelle: README, docs/06 Z.46–53; сам атлас вне репозитория, не перепроверен — offen).
Место в линейке (README Z.15–17): Kettenbrief-Stopper учит останавливать страх, Stark im Chat — останавливать травлю.
По замыслу авторов (README Z.3–5) большинство детей — не агрессоры и не жертвы, а «публика», и именно она решает,
разрастётся травля или остановится; это допущение, а не измерение (проверяет Kindertest, п. 9). Здесь ребёнок в 28
чат-ситуациях выбирает свой ход и после каждого выбора читает, чем ход силён или почему он делает хуже.
Развитие (Quelle: git, docs/09 Z.56, Z.58, Z.64): Fifth wave (12.07.2026) — 10 ситуаций (c01–c10); Welle 33
(18.07.2026), Chat-Rechte-Pack — 16 (c11–c16); Welle 36, Stopp Hassrede — 22 (c17–c22); Welle 37, Game-Chat-Training —
28 (c23–c28). Lauf C (27.10.2026, решения 34а–37в, git 96a1f89) убрал «очки смелости», ранги (Chat-Neuling …
Chat-Held*in), Rekord и Löschknopf; старый ключ `sic.rekord` теперь один раз удаляется при запуске.

## 2. Игрок и обещание (Wer + Kernerlebnis)
**Zielgruppe: Kinder (Alter 8–12).** Belege:
- `README.md` Z.3 «для 8–12 лет»; `daten/szenarien.json` Z.3 `"zielgruppe": "8-12"`; `app.mjs` Z.1 «(8-12 Jahre)»;
  `package.json` Z.5 «fuer 8-12 Jahre»; Hub `index.html` Z.18: раздел «Sicher im Netz (Kinder 8–12)», ссылка на
  приложение Z.47.
- Обращение «du» (`app.mjs` Z.40: «entscheidest du, was du tust»; Z.45: «Das ist NIE deine Schuld»); полей ввода нет;
  приложения нет ни в `docs/erwachsenen-apps.json`, ни в `docs/kinder-apps-mit-eingabe.json`; тест
  hilfe-insel-abdeckung требует Hilfe-Insel у него как у детского приложения (список «Risikothemen»).
- Родители: страница `eltern.html` («So begleiten Sie Ihr Kind»; Z.30 главная фраза: за рассказ о травле ребёнок не
  получит «Ärger»). Режима для двоих, второго экрана, хода взрослого или режима для класса в коде нет → Ko-Nutzung не
  предусмотрена: одно устройство, один ребёнок; общее с родителями — только упражнения вне приложения (Z.31).
- По решению Max 34а (README и этот GDD называют детей пользователями) приложение — Kinder-App: действуют Vorlesen
  (28а) и правило «ребёнок не оценивается» (docs/02 Z. 141–146); до Lauf C в приложении были очки и ранги (п. 1).

Соседи: `stark-im-chat-mini` (6–8, два варианта), `stark-im-chat-plus` (13–15), `chat-rechte`, `chat-check`,
`spiral-stopper`, `kettenbrief-stopper`, `rechte-kompass`. Используют это приложение: `stundenentwurf-chat`,
`projektwoche` (день 4), `rechte-stationen` (станция 1), `starke-zuege-poster`.
Одно предложение: «Ребёнок проходит 28 чат-ситуаций в случайном порядке, в каждой выбирает один из трёх ходов, читает
объяснение и уходит с тремя ходами: не участвовать · сообщить (Melden) и рассказать взрослому · написать пострадавшему,
что он не один».

## 3. Движок и петля (Wie)
Движок: собственный мини-ход сценария в `app.mjs` (106 строк): `startBildschirm` → `starteRunde` →
`szenarioBildschirm` → `antworte` → `weiter` → `endBildschirm`. `quiz-kern` и `logik.mjs` не используются; выбор
заголовка и рамки стоит прямо в `antworte()` (Z.71–84). Осознанно без общего «szenario-движка» (README Z.38–41,
`app.mjs` Z.3–5; правило двух, docs/05 метод 0) — см. п. 10.
Основная петля (прогнана в браузере целиком): старт («💪 Stark im Chat», «Hinschauen. Nicht mitmachen. Helfen.»,
вступление с числом ситуаций из данных, «▶️ Training starten», «🔊 Vorlesen», карточка «💛 Wichtig: Wirst du selbst
gemobbt? … Nummer gegen Kummer 116 111.», «🆘 Ich brauche Hilfe») → 28 раз [«Situation n von 28» и полоса прогресса;
ситуация жирным, «🔊 Vorlesen», три хода в случайном порядке → Rückmeldung: заголовок «Starker Zug! 💪💪» (wert 2,
зелёная рамка) / «Okay – aber da geht mehr! 💪» (wert 1, жёлтая) / «Das macht es schlimmer …» (wert 0, красная) +
объяснение + при wert < 2 строка «Stärkster Zug: …» + «🔊 Vorlesen» → «Nächste Situation ➡️» (перед последней — «Zum
Schluss 🏁»)] → «Ende der Runde» (💪, «🔊 Vorlesen», «🔁 Noch einmal», «🏠 Zum Start», карточка «📌 Merk dir drei Züge:
Nicht mitmachen · Melden & Erwachsenen erzählen · Der betroffenen Person schreiben, dass sie nicht allein ist.»).
Итоговой суммы, рекорда и рангов нет; «Situation n von 28» — только ход раунда.
Раунд — весь банк: `mischen(daten.szenarien)` без `slice` (Z.51), то есть 28 ситуаций и 56 нажатий (ход + «дальше»).
Реиграбельность: в каждом раунде новый порядок ситуаций и ходов (Z.51, Z.58), но те же 28 ситуаций. Во время раунда
есть только «Vorlesen», три хода и «Nächste Situation»; кнопок «Zum Start»/«Abbrechen» и «Ich brauche Hilfe» нет
(замер), выйти можно ссылками в Fuß или перезагрузкой.
Прогон: в одном раунде показаны 28 разных ситуаций, у каждой ровно 3 хода; заголовок Rückmeldung совпал с `wert` во
всех 28 случаях (всегда первый показанный ход); «Stärkster Zug: …» показан при wert 0 и 1 и не показан при wert 2.

## 4. Lernziele (проверяемые!)
По README (Z.21–31) с привязкой к данным; цель 3 в README не названа (источник — `daten/szenarien.json` и
`test/szenarien.test.mjs` Z.37):
1. Ребёнок называет три «сильных хода» свидетеля: не участвовать · сообщить (Melden) и рассказать взрослому ·
   поддержать пострадавшего (README Z.21–22; итоговая карточка `app.mjs` Z.93, Z.103). В сильном ходе слово «melde…»
   стоит у 12 из 28 сценариев, взрослый или помощь — у 13 (Quelle: eigene Rechnung nach daten/szenarien.json; считаются «Lehrkraft»,
   «Klassenleitung», «Vertrauensperson» и «Hilfe»; только «Erwachsen*» — у 9).
2. Ребёнок знает меры самозащиты: сохранить доказательство (Screenshot), заблокировать, «сначала пауза, потом ответ»,
   Nummer gegen Kummer 116 111 (README Z.23–24; в данных: Screenshot/Beweis — c07, c08, c18, c28 (c03 — только слово «Screenshot»: полученная приманка, не доказательство); Blockieren —
   c06, c07, c19, c23, c28; 116 111 в объяснениях c10, c22, c27, c28).
3. Ребёнок объясняет своими словами, чем «Melden» отличается от «Petzen» (c02, c12, c13), и знает, что у платформ и игр
   есть Melde-Weg (c06, c19, c21, c23).
4. Из данных, README не называет: высказать мнение или критику без оскорблений и попросить слова (c11, c14, c16);
   не называть незнакомцу имя, возраст и адрес, поставить чат на «nur Freunde» (c24, c25); не поддаваться давлению
   покупок (c26); «секретный чат без родителей» — предупреждающий знак (c27); Hassrede можно и нужно сообщать (c15,
   c17, c19–c21).
Как проверяется (Quelle: test/szenarien.test.mjs): 8 тестов проверяют схему и размер банка (≥ 28 сценариев), по одному
сильному ходу и хотя бы одному плохому в каждом, ключевые слова трёх паков и слов «melde», «screenshot/beweis»,
«116 111», «blockier», отсутствие оценки в коде и правило Speicher; ясность разницы между ходами и усвоение они не
проверяют. Усвоение проверяет только Kindertest (п. 9).

## 5. Контент-план
Единица контента: сценарий (ситуация + три хода + объяснение). MVP: 28 сценариев в `daten/szenarien.json` (`version` 1,
`"zielgruppe": "8-12"`). Схема: `id (c01–c28), situation, optionen[3] {text, wert 0|1|2}, erklaerung`; полей очков и
рангов нет (тест: нет `raenge`). Блоки (границы по git и docs/09):

| Блок | id | Содержание |
|---|---|---|
| Базовый (Fifth wave) | c01–c10 | Foto в Klassengruppe, злой комментарий под видео, скриншот и злость, группа «Alle gegen Tim», Fake-Profil, оскорбления в игровом чате, анонимные сообщения, Erpressung, опрос «nervigste Person», подруга просит молчать |
| Chat-Rechte-Pack (Welle 33) | c11–c16 | своё мнение (Art. 13), ложь о тебе и Melden (DSA), «Melden = Petzen?», быть услышанным (Art. 12), Hassrede по происхождению, критика правила |
| Stopp Hassrede (Welle 36) | c17–c22 | Hasskommentar по цвету кожи, угроза «Solche Leute wie DICH …», игровой чат и религия, «крутой» подстрекает, сомнение «melden?», замкнувшийся ребёнок (116 111) |
| Game-Chat-Training (Welle 37) | c23–c28 | Voice-Chat, чужой спрашивает имя/возраст/адрес, чат открыт для всех → «nur Freunde», Kaufdruck «Skin», «секретный чат», угроза в игре |

Схема ходов (Quelle: eigene Rechnung): в 24 из 28 сценариев ходы 2 / 1 / 0; в c02, c03, c07, c08 — 2 / 0 / 0, нейтрального
хода нет. Длина: ситуация 68–135 знаков (медиана 93,5), объяснение 157–200 (медиана 181). Тест требует только «ровно один
wert 2 и хотя бы один wert 0», `situation` ≥ 20 и `erklaerung` ≥ 40 знаков, три хода по ≥ 5 знаков, уникальные `id`.
Дидактический анти-шаблон: порядок ходов перемешивается при показе (Z.58), индекс правильного хода ребёнку не виден;
но сильный ход — самый длинный по знакам в 28 из 28 сценариев, то есть угадывать можно по длине (п. 10). Тесты этого
не ловят.

## 6. Политика соответствия (Pflicht, docs/02 Z. 22–24, Z. 79–82, Z. 141–146)
Легенда: [x] проверено на коде или замером; [ ] не выполнено или не предусмотрено — с причиной.
- [x] **Werbefrei / без покупок:** в `app.mjs`, `index.html`, `eltern.html`, `daten/szenarien.json` нет `http(s)://`,
  `<img>`, `<iframe>` и чужих скриптов; подключены только `app.mjs`, общий `kinder.css` и (с git aaa39a8, решение Max 21а)
  общий `favicon.svg` из `packages/kinder-ui/img/` — тот же origin (`<link rel="icon">`: `index.html` Z.9, `eltern.html`
  Z.8); `eltern.html` Z.20: «Keine Werbung, keine Käufe, keine Anmeldung; kein echter Chat». Покупки — только
  содержание сценария c26.
- [x] **Без аккаунтов и ввода, privacy by default:** нет `<input>`, `<form>`, `<textarea>`; только кнопки. Вызовов
  Notification, geolocation, mediaDevices, clipboard, cookie нет (grep пуст).
- [x] **Без внешних запросов (docs/02 Z. 22–24):** CSP `default-src 'self'; style-src 'self' 'unsafe-inline'` в
  `index.html` и `eltern.html` (Z.6); `installiereNetzwerkWaechter()` (`app.mjs` Z.13); единственный `fetch` —
  относительный `daten/szenarien.json` (Z.20). Замер (старт, Hilfe-Insel, полный раунд из 28, `eltern.html`): ни одного
  запроса не к своему origin; `browser-tor`: `fremdeHosts` 0; консоль пуста, ответов с кодом от 400 нет (замер повторён
  после git aaa39a8: с 21а у страниц общий `favicon.svg`, прежний 404 на `favicon.ico` снят — A3 в
  docs/fragen-und-hinweise.md стоит на «umgesetzt»).
- [x] **Speicher:** приложение ничего не пишет: `setItem`, `getItem`, `datenKarte`, `loescheDaten`, `speicherSchluessel`
  — grep пуст. Единственное обращение — одна строка `try { localStorage.removeItem('sic.rekord'); } catch {}`
  (`app.mjs` Z.17): в браузере при предзаданных `sic.rekord` и `andere.app` после загрузки остался только `andere.app`.
  После полного раунда localStorage, sessionStorage и cookies пусты (замер). Читается только `ui.anzeige`
  (Kontrast/Schrift через `boot()` из kinder-ui, Z.14); пишет его не это приложение. **Löschknopf: нет** — так и
  положено (решение 30б): «Meine Daten löschen» нет, тест speicher-regel зелёный, `docs/speicher-stand.json` пуст.
  Fuß каждого экрана говорит «diese App speichert nichts» (Z.31), `eltern.html` Z.22 — то же.
- [x] **Kein Service Worker:** нет `sw.js`, в коде нет `serviceWorker` (grep пуст); приложения нет в списке четырёх
  «früherer» Apps теста kein-service-worker (тест зелёный); в браузере регистраций 0, Caches 0 (решение Max 9б).
- [ ] **Offline:** нет; Neuladen без сети не удаётся (замер, `ERR_INTERNET_DISCONNECTED`). `manifest.webmanifest` нет.
- [x] **Vorlesen:** кнопка «🔊 Vorlesen» на старте (`app.mjs` Z.43), в каждой ситуации (Z.65), в каждой Rückmeldung
  (Z.81), в конце (Z.98) и в Hilfe-Insel; `vorlesen()` из kinder-ui берёт локальный голос устройства, если он есть.
  Читается: на старте — вступление (карточка «Wichtig … 116 111» не читается); в ситуации — «ситуация + Was machst du?
  + три хода через «Oder»»; в Rückmeldung — «заголовок + объяснение» (строка «Stärkster Zug: …» не читается); в конце —
  «Ende der Runde. Merk dir drei Züge …». Текст в ситуации проверен в браузере, остальное — по коду.
- [x] **eltern.html:** есть; ссылка «👪 Für Eltern» в Fuß каждого экрана (`app.mjs` Z.32, замер: старт, Hilfe-Insel,
  ситуация, конец).
- [x] **Impressum-Link в Fuß:** `../../impressum.html` (`app.mjs` Z.33, `eltern.html` Z.39); тест impressum-link зелёный.
  Сама страница называет себя «Noch nicht veröffentlichungsreif» (`impressum.html` Z.16) — п. 10.
- [x] **Hilfe-Insel (116 111):** `hilfeInselKnopf` на старте (`app.mjs` Z.46–47); экран показывает 116 111 и
  Elterntelefon, «↩️ Zurück» ведёт на старт (замер); приложение в списке обязательных у теста hilfe-insel-abdeckung.
  Во время раунда кнопки помощи нет (замер).
- [ ] **Druck:** не предусмотрен — нет `druck.css`, нет кнопки печати и `window.print` (grep «print|druck» в коде пуст;
  совпадения только в тексте данных: «Kaufdruck», «Gruppendruck», «unter Druck»). Печать из браузера: общий `kinder.css`
  скрывает только `.k-fuss` (`@media print`, Z.122–124; замер: Fuß скрыт, три кнопки печатаются), остальной экран
  печатается как есть. Базовая линия `druck` = 5 (Emoji стартового экрана: 💪 ▶ 🔊 💛 🆘; инструмент видит только
  старт), замер повторён: 5, 0 Erhöhungen. Требование docs/02 Z. 79–82 привязано к кнопке печати; её здесь нет.
- [x] **Keine Wertung des Kindes (docs/02 Z. 141–146):** суммы, очков, рекорда, процентов, рангов нет ни в коде, ни в
  данных (тест «Kinder werden nicht bewertet»; `node tools/bewertung-stand.mjs` → «Stand stimmt.»; в
  `docs/bewertung-stand.json` приложения нет ни в `apps`, ни в `ausnahmen` — исключение не нужно и не заведено).
  `node tools/leistungs-woerter.mjs stark-im-chat` → один Treffer, не оценка: `rekord` в строке-миграции `app.mjs` Z.17.
  «Situation n von 28» (Z.61) — ход раунда, не результат; конец называется «Ende der Runde».
- [ ] **Rückmeldung je Antwort в три ступени и три цвета** (💪💪 зелёная / 💪 жёлтая / красная; `app.mjs` Z.72–73) —
  подпадает ли под «Ни светофора, ни ступени», не решено (п. 10).
- [x] **Mobile First (замер, 360 px):** на старте, в Hilfe-Insel, в первой ситуации, в первой Rückmeldung, в конце и на
  `eltern.html` нет переполнения и нет целей касания меньше 48 px (5 целей на старте); Delta-Tor `tools/browser-tor.mjs
  stark-im-chat`: 0 Erhöhungen. По коду (Z.34) фокус после смены экрана ставится на первую кнопку экрана; в ситуации это
  «🔊 Vorlesen» (замер), а не первый ход. Клики и Fokus официальный инструмент не измеряет (нет `data-kennung`,
  Basislinie `ohneKennung` 1).

Особые риски темы: травля, Drohung и Erpressung (c07, c08, c18, c28), Hassrede по происхождению, цвету кожи и религии
(c15, c17, c19), замкнувшийся ребёнок (c22), предупреждающий знак Grooming (c27) могут тревожить или напоминать
пережитое. В объяснениях тяжёлых сцен (c07, c08, c15, c17, c18, c19, c22, c27, c28) названо действие (сохранить, заблокировать,
сообщить, рассказать взрослому, 116 111); не каждое объяснение заканчивается действием (c01, c03, c05, c06, c11 и др.
заканчиваются выводом или поддержкой). «Без подробных описаний» — оценка автора GDD, не измерение; на старте карточка «Das ist NIE deine Schuld» и Hilfe-Insel; `eltern.html` Z.30–32 предлагает
говорить вместе и называет Elterntelefon. Утверждения о праве (strafbar, verboten, номера статей) в текстах без
источника — п. 10.
Повторить проверки: `node --test apps/stark-im-chat/test/*.test.mjs`, `node --test
packages/kinderschutz/test/testzahlen.test.mjs`, `node tools/bewertung-stand.mjs`, `node tools/leistungs-woerter.mjs
stark-im-chat`, `node tools/browser-tor.mjs stark-im-chat` (`tools/quiz-durchlauf.mjs` не применим: приложение не на
`quiz-kern`, инструмент отклоняет такие приложения).

## 7. Стандарты и финансирование (Wofür)
Всё ниже взято из репозитория и юридически не перепроверено (Fachprüfung не проводилась — offen).
- UN-KRK: в текстах названы Artikel 13 (c11, «der Kinderrechte»), Artikel 12 (c14), Artikel 12/13 (c16) и Artikel 2
  (c15) — в c14–c16 без названия закона; docs/11 Z.68–70 относит приложение (и `-mini`, `-plus`) к Art. 19 «Schutz vor
  Gewalt / gutes Miteinander» (docs/11 сам помечен «Kein Rechtsrat», Z.12).
- DSA: c12 («Artikel 20»), c13 («Artikel 16/20»), c15 и c17 («Hassrede … meldbar») — формулировки упрощены; тест
  `szenarien.test.mjs` Z.36 закрепляет «DSA Art. 16/20». Какие статьи верны, решает Fachprüfung (п. 10).
- Gefährdungsatlas BzKJ, 2-е издание, май 2022, JFF + Hans-Bredow-Institut, 43 феномена (Quelle: docs/06 Z.46–47):
  «Cybermobbing — ✅ stark-im-chat» (Z.53). README Z.13–15 называет атлас «основой практики JuSchG § 10b» — не проверено
  (offen). Атлас вне репозитория.
- Katalogtext (Quelle: docs/09 Z.194, Z.289, Z.290; не проверен): Chat-Rechte-Pack → «UN-KRK, DSA, JMStV»; Stopp
  Hassrede → «DSA, JMStV, UN-KRK»; Game-Chat-Training → «JuSchG, DSA, fragFINN».
- Förder-Fit (Quelle: те же строки docs/09): BzKJ «Demokratiefähigkeit» (Z.194, Z.289) и «sichere Voreinstellungen»
  (Z.290); для урока «Worte wie Fäuste» на базе приложения каталог называет Preise «klicksafe Preis» и «Dieter Baacke
  Preis» (Z.249); jugendschutz.net назван «потенциальным рецензентом Stark im Chat» (docs/08 Z.23). Суммы, сроки и доли
  в GDD не приводятся (offen). Детали — foerder-navigator.

## 8. Аджайл-оценка
Aufwand: S (дни): `app.mjs` 106 строк, `daten/szenarien.json` 286 строк (28 сценариев), 8 тестов; основная работа —
тексты и баланс ходов. Переиспользует: `kinder-ui` (`el`, `vorlesen`, `mischen`, `boot` Anzeige, `hilfeInsel`,
`kinder.css`), `kinderschutz` (`installiereNetzwerkWaechter`); `quiz-kern` — нет, `logik.mjs` — нет, общего
сценарного ядра — нет (п. 10). Первый срез (playable) уже работает: полный раунд из 28 ситуаций с озвучиванием, без
итоговой оценки. Расширение банка — сценарии в JSON; число «28» набрано руками в `index.html` Z.7 и `eltern.html` Z.15
(п. 10). Тесты не покрывают `antworte()`, состав раунда и тексты Rückmeldung.

## 9. Kindertest-гипотезы
Что проверяем на 5–8 детях 8–12 лет (протокол — docs/05, метод 5); это гипотезы, результатов нет:
1. Угадывают ли по длине: выбирают ли дети самый длинный ход (он сильный в 28 из 28)? Меняется ли результат, если
   ходы выровнять по длине?
2. Понимают ли дети слова без помощи взрослого: Hassrede (c15, c17), Zivilcourage (c15, c17), Erpressung (c08),
   Identitätsklau (c05), Grooming (c27), Meinungsfreiheit (c11), Voreinstellungen (c25), «Artikel 12/13»? Читают ли
   объяснения (157–200 знаков) до конца, помогает ли «Vorlesen»?
3. Могут ли после раунда назвать три хода и своими словами сказать, чем «Melden» отличается от «Petzen»? Знают ли, где
   в игре или чате искать Melde-Knopf? Запоминают ли 116 111 (в объяснениях только 4 ситуации из 28, плюс старт)? Находят
   ли «🆘 Ich brauche Hilfe» на старте?
4. Длина: 28 ситуаций в одном раунде (56 нажатий) — на какой по счёту ситуации дети устают или бросают? Хотят ли «Noch
   einmal» (те же 28)? Нужен ли выход посреди раунда?
5. Как читаются заголовки и цвета: «Das macht es schlimmer …» (красная рамка), «Okay – aber da geht mehr!» (жёлтая) —
   как совет или как упрёк? Что делает ребёнок после красного экрана: читает объяснение, пропускает, расстраивается?
   Выбирают ли «плохой» ход из любопытства?
6. Тревожные темы (c07, c08, c18, c22, c27, c28): вызывают ли страх? Начинается ли разговор с родителями, как
   предполагает `eltern.html` Z.30 («keinen Ärger»), или ребёнок молчит?
7. Ходы с wert 1 в c10 (накричать на смеявшихся), c24 (назвать имя и город), c26 (давить на других), c27 («сначала
   посмотрю»): понимают ли дети, что «Okay» не значит «безопасно»?
8. Родители: читают ли `eltern.html`, помогает ли послание «Wenn dir so etwas passiert, bekommst du keinen Ärger»?

## 10. Offen / Zweifel
**Widersprüche (README ↔ Code ↔ Text ↔ Tests ↔ Doku)**
- README Z.5–6 «в каждой три хода: сильный, нейтральный и тот, что делает хуже» ↔ данные: так в 24 из 28 сценариев;
  в c02, c03, c07, c08 два плохих хода и нет нейтрального. Тест требует лишь «ровно один wert 2 и хотя бы один wert 0»
  (README Z.25–28 описывает это верно).
- README Z.21–22 «Три постоянных «сильных хода» через все сценарии» ↔ минимум в 7 из 28 сценариев сильный ход не
  относится к этим трём (c03 пауза, c11 высказать мнение, c14 попросить слова, c16 сдержанная критика, c24 ничего
  личного, c25 «nur Freunde», c26 не поддаваться давлению) — моя классификация по тексту. Три хода — это итоговая
  карточка (`app.mjs` Z.93, Z.103), а не схема каждого сценария.
- README Z.3–7 и Hub Z.47 («gemeinsam gegen Cybermobbing») ↔ часть банка не о травле: c11, c14, c16 — мнение и участие,
  c24–c27 — данные, настройки чата, Kaufdruck, предупреждающий знак. Wurzel-README Z.128 называет паки верно («свидетель +
  Rechte + Hassrede + Game-Chat»); README приложения паки Welle 33/36/37 не описывает.
- README Z.25–28 «ребёнок учится выбирать лучший ход, а не угадывать «правильный ответ»» ↔ сильный ход самый длинный по
  знакам в 28 из 28 сценариев (по словам строго больше всех в 24; медиана отношения к самому длинному из остальных 1,71,
  минимум 1,10, максимум 2,54; Quelle: eigene Rechnung nach daten/szenarien.json). Порядок ходов перемешан, длина видна.
- Ступень wert 1 («Okay – aber da geht mehr!») стоит и у ходов, которые трудно назвать нейтральными: c10 («Heimlich
  … alle anschreien»), c24 («Nur den Vornamen und die Stadt» незнакомцу; объяснение: «Echter Name, Alter und Wohnort
  gehen Fremde nichts an»), c26 («Andere … unter Druck setzen»; объяснение: «Kaufdruck ist unfair»), c27 («Erst mal
  hingehen» в секретный чат; объяснение: «Warnzeichen für Grooming»). Это моя оценка содержания, педагогически не
  проверена (offen); объяснение написано под сильный ход и ступень 1 отдельно не разбирает.
- `eltern.html` Z.24 называет чувствительной темой только Erpressung ↔ в данных также Drohungen (c18, c28), Hassrede
  (c15, c17, c19), анонимные сообщения (c07), замкнувшийся ребёнок (c22), предупреждающий знак Grooming (c27).
  `eltern.html` Z.23 «Ihr Kind wird nicht bewertet» не упоминает Rückmeldung в три ступени (см. ниже).
- Число «28» набрано руками в `index.html` Z.7 («Trainiere in 28 Situationen») и `eltern.html` Z.15; стартовый экран
  берёт его из данных (`app.mjs` Z.40); тест требует только ≥ 28 (`szenarien.test.mjs`, Z.43). При росте банка тексты
  снова устареют (так было до git 1f01eeb «Texte angeglichen»).
- README Z.38–41 и `app.mjs` Z.3–5 «общий szenario-движок появится при третьем тренажёре» ↔ docs/05 Z.54 тот же порог;
  `grep -l "wert === 2\|wert === 1" apps/*/app.mjs` находит 15 файлов (с этим): паттерн 2/1/0 давно скопирован, общее
  ядро не выделено.
- Katalog docs/09 Z.289 «10 neue Zeugen-Szenarien» (Stopp Hassrede) ↔ docs/09 Z.58 («16→22», 6 ситуаций) и данные
  (c17–c22, 6). Katalog Z.194 «DSA Art. 20» (Melden) ↔ Z.64 «DSA Art. 16/20»; данные: c12 «Artikel 20», c13 «Artikel
  16/20» — внутри каталога и данных статьи названы по-разному.
- Другие файлы про это приложение: `apps/stundenentwurf-chat/daten/stunde.json` Z.14 («am Beamer im Klassen-Modus») и Z.27
  («läuft offline im Browser») ↔ в приложении нет Klassen-Modus (он есть у quiz-приложений) и Neuladen без сети не
  удаётся (замер). Эти файлы мной не менялись.
- Altersangaben: в самом приложении расхождений нет (README, JSON, `app.mjs`, `package.json`, Hub — везде 8–12; `-mini` 6–8,
  `-plus` 13–15); `apps/stundenentwurf-chat/daten/stunde.json` Z.4 называет для урока с этим приложением «Klasse 5–7 (10–13 Jahre)».
- Счётчик внешних фактов (`fundstellen`): в пользовательских файлах 0 блокирующих строк, в документации одна (README Z.14,
  JuSchG § 10b) — без этого GDD. С этим GDD счётчик считает 11 строк документации (10 из GDD.md, одна из README) и по-прежнему
  0 блокирующих: README.md и GDD.md не блокируют. Утверждения о праве в данных он не видит (строки с «kein/nicht» считаются
  отрицанием, слов «strafbar» и «verboten» в списке нет) — моя проверка `pruefeDatei` на примерах.

**Offene Fragen (für Max)**
- Rückmeldung je Antwort: три заголовка и три рамки — wert 2 «Starker Zug! 💪💪» (зелёная, `k-hinweis--richtig`), wert 1
  «Okay – aber da geht mehr! 💪» (жёлтая, класс по умолчанию), wert 0 «Das macht es schlimmer …» (красная,
  `k-hinweis--falsch`); `app.mjs` Z.72–73, `kinder.css` Z.105–112. Lauf C убрал ранги, очки и Rekord, а эту обратную
  связь оставил (README Z.25–28: значения «служат только обратной связью»); в списке слов 37в её нет, `bewertung-stand`
  её не видит. Явного решения о ней я в `docs/fragen-und-hinweise.md` и `docs/bewertung-stand.json` не нашёл. Оценивается
  ход в упражнении, не ребёнок — но подпадает ли это под «Ни светофора, ни ступени» (docs/02 Z. 141–146), решает Max. Для
  сравнения: тест takt-pause запрещает 💪 как Pokal-символ, здесь 💪💪 обозначает вторую ступень.
- Подсказка по длине и ступень wert 1 у c10, c24, c26, c27: менять тексты до Kindertest? Это контент, не код; тесты этого
  не ловят.
- Раунд = все 28 ситуаций без выхода и без Hilfe-Insel посреди раунда, при этом c07, c08, c22, c27, c28 затрагивают
  страх и угрозы. Достаточно ли кнопки помощи только на старте? Нужен ли размер раунда (как в других тренажёрах)?
- Факты без источника и без пометки «(Eigenentwurf, fachlich nicht geprüft)» в `daten/szenarien.json` (Recht; Fachprüfung
  offen): c05 («Fake-Profile sind verboten», «Identitätsklau … sogar strafbar»), c08 («Erpressung ist eine Straftat»,
  «strafbar»), c11–c16 (Artikel 12, 13, 2; DSA Art. 16/20, c14–c16 без названия закона), c15 и c17 («Hassrede ist
  verboten und meldbar»), c27 («Warnzeichen für Grooming»), c03 («30 Minuten warten» — совет без источника),
  `eltern.html` Z.37 («Recht am eigenen Bild»), номера 116 111 и 0800 111 0 550 с «kostenlos, anonym» (`eltern.html`
  Z.32, `hilfe-insel.mjs`) — источника в репо, кроме самих текстов, я не нашёл; сверка формулировок с Nummer gegen
  Kummer только запланирована (docs/08 Z.26).
- Vorlesen и «keine fremden Server»: без локального голоса (`localService`) браузер выбирает голос сам, он может быть
  сетевым (комментарий в `komponenten.mjs`); `installiereNetzwerkWaechter` перехватывает только fetch, XHR и WebSocket.
  Формулировка «technisch erzwungen» (`eltern.html` Z.21) относится к ним, не к Sprachausgabe. Нужна ли оговорка — offen.
- Пустая страница при сбое: если `localStorage` бросает SecurityError (в браузере симулировано init-скриптом, не
  настройкой), `boot()` (Z.14) падает раньше `try/catch` Z.17, на странице нет ни h1, ни кнопок. То же, если не
  загружается `daten/szenarien.json` (top-level `await fetch`, Z.20: «Failed to fetch», сообщения ребёнку нет). Тестов на
  эти случаи нет; какие реальные настройки это вызывают, не проверено (offen).
- `aria-live="polite"` на `#app` (`index.html` Z.12): общая находка docs/fragen-und-hinweise.md C4 — с реальной
  Hilfstechnik не проверена (offen).
- Szenario-Kern: выделять общее ядро 2/1/0 (15 копий паттерна) или оставить как есть?
- Impressum: страница, на которую ведёт ссылка в Fuß, сама называет себя «Noch nicht veröffentlichungsreif». Касается
  всех приложений.
- Browser: Fokus nach Klick и Klickfehler для этого приложения официальным инструментом не измерялись (нет
  `data-kennung`, Basislinie `ohneKennung` 1); мои прогоны это не заменяют.
