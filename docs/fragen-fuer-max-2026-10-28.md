# Вопросы и предложения для Макса

Состояние на 28.10.2026, перед длинной паузой. Составил интегратор. Все цифры взяты из репозитория (ветка `claude/children-network-programs-germany-hr0jh9`, база `968c622`).

**Как отвечать:** номер и буква, например «1а, 2а, 10в», или «все ★». ★ — мой совет. **Если на пункт нет ответа, ничего не меняется** (приложения, реестры и правила остаются как есть). Ничего не удаляется без отдельного списка для вас.

**Что уже сделано.** Все 37 ответов Макса выполнены в той части, которая не ждёт решения (протокол: `docs/fragen-und-hinweise.md`, раздел «Entscheidungen des Nutzers (27.10.2026)»). Полный прогон: 3231 тест зелёные (было 2960 до ступени 1), 26 квиз-приложений × 3 режима зелёные, стенды `bewertung-stand`, `speicher-stand`, `seitenmarke-stand`, `browser-basislinie`, `externe-fakten-stand` только сокращались. Ни одна проверка не красная.

**Ступень 1 готова (запуск E, 16 агентов, 4 ч 15 мин).** Четыре новых приложения построены, дважды проверены независимыми проверяющими и внесены в Hub, README, Impressum, docs/10, каталог и индекс Bauaufträge: CON-3 `meine-familie-woerter-und-rollen-content-pack` (63 теста), CON-6 `himmelsgucker-sonne-mond-und-sterne` (73), CON-9 `farbwoerter-schatz` (68), CON-10 `musik-woerter-bilderlexikon` (67). Все четыре — собственные карточные приложения (путь B), не на quiz-kern; без хранения данных, без оценки ребёнка, Browser-Tor без нарушений. Первая проверка не прошла ни одна из четырёх (нашлось настоящее: обход границы сессии в CON-3, запас печатного листа 2,3 мм в CON-6, перенос слова посреди слова в CON-9, отсутствие пометок «Eigenentwurf» в CON-10); после доработки CON-3, CON-6, CON-10 прошли, а замечания второй проверки по CON-9 я исправил сам и перемерил. Решения по ним — пункты 31 и 44–47. Новых заданий я не запускал.

**Предлагаемая очередь после паузы (если приняты все ★).** 1) Решения по ступени 1 (пункты 31 и 44–47) и мелкая доработка по ним. 2) Пункты 1–3 (ошибки в содержании): малое задание. 3) Поток Г порциями (4–8). 4) Пункты 9–20 малыми заданиями, по одному ответу — одно задание. 5) Техника 21–30, сначала 21–22 (quiz-kern), затем остальное. 6) Ступень 2, затем ступень 3 (32–33). 7) Draft pull request после пункта 23 и приёмки ступени 1 (38). Каждый шаг заканчивается полным прогоном в чистой копии, push и одной строкой отчёта.

## А. Ошибки в содержании (решить первыми: это видят дети)

1. **notruf-held, сцена n07** (`apps/notruf-held/daten/situationen.json:22`, «Im Treppenhaus ist dichter Rauch»). Приложение советует «Raus gehen und von draußen die 112 rufen». BBK советует не уходить через задымлённые помещения и лестницы. Для ребёнка один дома совет может оказаться неверным.
   а) убрать сцену, пока пожарные не проверят текст ★ (останется 7 из 8, тест требует не меньше 6; README и GDD поправлю);
   б) оставить как есть;
   в) заменить текст формулировкой BBK (нужна проверка специалистом).

2. **kinderrechte-entdecker** (`daten/fragen.json:24`): «Deutschland hat ihn 1992 unterschrieben» неверно. Подписано 26.01.1990, ратификационная грамота сдана 06.03.1992, в силе с 05.04.1992 (BGBl. 1992 II S. 990).
   а) «Deutschland hat ihn 1990 unterschrieben und 1992 bestätigt» ★; б) другая формулировка (продиктует Макс).

3. **stark-im-chat-plus** (`daten/szenarien.json:127`): платформы якобы «блокируют» ложных жалобщиков. По Art. 23 Abs. 2 DSA приостанавливается обработка их жалоб, а не сам человек. **barriere-spuernasen** (`logik.mjs:54`): «Genau das verlangt …» сильнее, чем Art. 23 UN-KRK (там речь об участии детей с инвалидностью в жизни общества).
   а) обе фразы поправить ближе к источнику ★; б) оставить.

## Б. Внешние факты (поток Г: 326 строк в 96 приложениях)

Файлы: `docs/externe-fakten-liste-1-recht-geld.md`, `…-2-gesundheit.md`, `…-3-sonstiges.md`; полный текст каждого предложения — `docs/externe-fakten-vorschlaege.json`. Действия в списках: *Quelle ergänzen* (добавить источник), *Quelle und Vermerk* (источник и пометка «maschinell nachgelesen, nicht durch Menschen geprüft»), *Vermerk Eigenentwurf* («(Eigenentwurf, fachlich nicht geprüft)» к предложению), *Streichen* (удалить предложение), *Fehlalarm* (счётчик ошибся: приложение не меняется, уточняется счётчик с тестами). Независимая проверка уже понизила 19 предложений.

4. **Список 1, право и деньги:** 210 строк, 70 приложений. Quelle und Vermerk 104, Fehlalarm 69, Eigenentwurf 14, Quelle 12, Streichen 11.
   а) «да» ко всему, кроме 11 удалений; удаления вы подтверждаете отдельным коротким списком ★;
   б) «да» ко всему, включая удаления;
   в) нет, оставить как есть.

5. **Список 2, здоровье:** 105 строк, 25 приложений. Eigenentwurf 43, Fehlalarm 40, Quelle und Vermerk 19, Quelle 2, Streichen 1. Варианты как в пункте 4 (★ а). Для строк о здоровье уже решено: пометка «(Eigenentwurf, fachlich nicht geprüft)» (13а); spielzeug-check-u3 сохраняет 54 % и 95 % с той же пометкой (14в).

6. **Список 3, прочее:** 11 строк, 8 приложений (Fehlalarm 8, Quelle и Vermerk 2, Eigenentwurf 1). Варианты как в пункте 4 (★ а).

7. **Утверждения о праве, которые сильнее источника или ложны** (`docs/externe-fakten-befunde.md`, разделы B и C; 14 приложений и безопасность детей до трёх лет). Примеры: «§ 10b JuSchG» для безопасных предустановок (elternabend-kit, kria-check; верно § 24a Abs. 2 Nr. 6 JuSchG и Art. 28 DSA), «BFSG-konform» (leichte-sprache-werkstatt), «Kostenlos in jeder Bibliothek» (vorlese-kompass), «geprüfte» данные (foerder-navigator), Art. 16 UN-KRK как «право на собственное изображение» (sharenting-spiegel, elternabend-kit), «DSGVO gilt auch für Fotos unter Schüler*innen» (lehrkraefte-szenariotraining), «Fachprüfung» для spielzeug-check-u3, erste-kuenstler и ещё трёх приложений для малышей.
   а) исправить формулировки до уровня источника; где нужен юрист или специалист, убрать утверждение или поставить пометку «(Eigenentwurf, fachlich nicht geprüft)» ★;
   б) только пометки, формулировки не менять;
   в) нет.
   Вопрос к пункту: кто делает профессиональную проверку (юрист по праву, пожарная охрана, специалист по безопасности игрушек)? Сделать эту проверку я не могу.

8. **Порядок исполнения потока Г** после паузы. Предлагаю порции по 4–5 приложений (около 15 порций), у каждой писатель и независимый проверяющий, после каждой порции полный прогон и push; сначала пункты 1–3, затем список 1, затем 2, затем 3. Ориентир по затратам (не обещание): предыдущие запуски стоили 2,4 млн (Lauf B), 6,5 млн (C), 5,8 млн (D), 3,8 млн (составление списков Г) токенов; на весь поток Г, по моей оценке, порядка 5–10 млн. Реально идут два агента одновременно (4 процессора), а не восемь.
   а) так ★; б) другой порядок или размер порции; в) начать только с пунктов 1–3 и списка 1.

## В. Оценка ребёнка, счётчики, тексты

9. **staerken-tagebuch** — единственная вещь, которая ещё «vorgeschlagen» в `docs/bewertung-stand.json`. Функция `haeufigsteFelder` сравнивает поля и берёт два самых частых для идей игр. Это противоречит условию исключения 7а («нет сравнения полей»).
   а) подтвердить исключение как есть;
   б) изменить подбор идей (все поля или по кругу, без сравнения), тогда исключение не нужно ★.

10. **Скрытые «счета»** (число зависит от верных ответов): chat-rechte «Deine Merksätze (N)» (`app.mjs:102`), dark-pattern-detektiv «Deine entlarvten Tricks (N)» (`app.mjs:100`), rechte-kompass «Deine gesammelten Mut-Sätze (N)» (`app.mjs:105`).
    а) оставить как нейтральный счётчик (37в разрешает «Gefunden: N»);
    б) убрать число, оставить список собранного;
    в) показывать все фразы, не зависящие от ответов, без числа ★.

11. **challenge-druck**: «🧲 Druck-Messer: N von 100» (`app.mjs:36`) — шкала «из 100», по сути процент. а) убрать шкалу, оставить словесную подсказку ★; б) оставить.

12. **takt-pause**: в Лауфе C вместе с недельным обзором ушёл нейтральный блок «🤔 Denk mal nach» (три открытых вопроса и кнопка «Vorlesen»); к оценке он отношения не имеет. а) вернуть блок на стартовый экран без недельных столбцов ★; б) не возвращать.

13. **Похвальные заголовки конца раунда** («Super gemacht!», «Toll gerechnet!», «Fall gelöst!», «Toll gemacht!», «Super gebrückt!», «Ermittlung abgeschlossen!», «Du bist ein guter Gast …») в 12 приложениях: fake-shop-fahnder, gefuehle-entdecker, herkunftssprachen-bruecke, impressum-detektive, mathe-entdecker, mini-rechte-entdecker, nachrichten-detektive (+junior, +profi), reim-radar, wer-dahinter, wer-wohnt-wo. Это похвала всем, но не оценка. а) заменить на «Ende der Runde» ★; б) оставить.

14. **Трёхступенчатая обратная связь** (`wert` 2/1/0: «Starker Zug!», «Okay – aber da geht mehr!» …) в 15 приложениях: autonomiephase-navigator, chat-check, chat-rechte, dark-pattern-detektiv, fomo-kompass, formular-falle, gefuehle-entdecker, ich-schaff-das, lehrkraefte-szenariotraining, rechte-kompass, sharenting-spiegel, stark-im-chat, stark-im-chat-mini, stark-im-chat-plus, tier-zu-gast (три из них — инструменты для взрослых). Ребёнку число не показывается, но три ступени — это градация ответа. а) оставить: это обучающая обратная связь по ситуации, не оценка ребёнка ★; б) заменить одной нейтральной ступенью («Das kannst du auch sagen:»).

15. **wahlkabine**: можно вписывать имена одноклассников (выборы старосты) без подсказки «Keine Namen eintragen», которая есть в mitmach-arena. а) добавить подсказку «Keine Namen» в wahlkabine ★; б) оставить.

16. **Проценты голосов** в ergebnis-plakat (`app.mjs:48`) и mitmach-arena (`app.mjs:128`, полоска доли) — это результат голосования группы, а не оценка ребёнка. а) оставить ★; б) убрать проценты, оставить «Meiste Stimmen: …».

17. **seiten-scanner** (`app.mjs:67`): «Alle Checks sicher – gut geprüft!» звучит как похвала. а) нейтрально: «Bei diesen Prüfungen: keine Warnung.» ★; б) оставить.

18. **Тексты движка quiz-kern** (общие для 26 приложений): «Richtig! 🎉», «Zum Ergebnis 🏁», подвал «Werbefrei · ohne Anmeldung · Daten bleiben auf diesem Gerät» (`packages/quiz-kern/src/quiz.mjs:76`). Подвал неверен для приложений, которые ничего не хранят. а) подвал → «Nichts wird gespeichert», «Richtig!» без эмодзи ★; б) оставить.

19. **Класс «Kind» (34а)** подтвердить для двух приложений, где адресат неочевиден: fachquiz-erstes-lebensjahr (адресат — специалисты) и stark-im-chat-plus (13–15 лет). а) да, Kind ★; б) Erwachsene/Fachkraft (тогда правила оценки к ним не применяются).

20. **Мелочи скопом.** (1) «🌟 Ja, genau!» осталось в 19 приложениях (например design-entdecker, dinge-des-alltags); в deutschland-kompass заменено на ✅. (2) deutschland-kompass: счётчик «Gefundene Wege: N» (считал только верные пути) убран. (3) Остаточные срабатывания словаря `tools/leistungs-woerter.mjs`, которые я считаю ложными: dark-pattern-labyrinth («rekord»), uhr-und-kalender-kind (проценты и «rekord» в коде), bot-oder-buddy (🥇 и «100 %» в репликах бота-льстеца — это материал урока), mathe-entdecker (⭐ как предмет счёта, вопрос m16). (4) «Starker Zug! 💪💪» (stark-im-chat). а) (1) заменить 🌟 на ✅ везде, (2) не возвращать, (3) оставить с записью в стенде как Fehlalarm, (4) оставить ★; б) показать списком перед правкой.

## Г. Техника

21. **31б, `data-kennung` в общих компонентах.** Патч (`docs/arbeitsweise/werkzeuge/31b-data-kennung.patch`) делает все кнопки измеримыми, и стенд показывает давно скрытые ошибки кликов. Замер (`docs/arbeitsweise/31b-messung.json`, 228 приложений): `ohneKennung` 204 → 0, но `klickFehler` 0 → 1298 (61 приложение без ошибок; больше всех familienrat 300, staerken-tagebuch 65), `ueberlauf` 0 → 3, `beruehrung` 32 → 95, `druck` 1511 → 1308. Базовая линия может расти только с вашим «да».
    а) принять и расширить базовую линию одним шагом;
    б) не вносить, `ohneKennung` 204 остаются;
    в) сначала только quiz-kern (26 приложений, у каждого 4 ошибки клика с одной причиной), потом остальные пакетами ★.

22. **Фокус после смены экрана.** Правило (docs/02 и новые Bauaufträge): после перехода на новый экран фокус стоит на заголовке с `tabindex="-1"`. У 73 приложений своя функция `zeige` без управления фокусом, общего помощника в `kinder-ui` нет; в `quiz-kern` фокус ставится на первую кнопку (`packages/quiz-kern/src/quiz.mjs:91`), а не на заголовок (отсюда, вероятно, 4 ошибки клика на каждое из 26 квиз-приложений в пункте 21). а) сначала исправить quiz-kern (одна правка для 26 приложений), затем добавить помощник в kinder-ui и подключать его пакетами ★; б) только новые приложения; в) всё сразу (дорого).

23. **Категория «ссылка в несколько строк».** Остались 32 случая `beruehrung` — ссылки внутри предложений; 48 пикселей к ним неприменимо. а) записать в docs/02 исключение по типу («ссылка внутри текста»), стенд пересчитать ★; б) оставить как долг.

24. **Метка «Seitenangaben nicht von einem Menschen geprüft.» на многостраничной печати** (kita-unterstuetzungs-navigator 6 страниц, musik-jahresplaner 6, mini-oper-baukasten 2): метка стоит только на первой странице. а) повторять на каждой странице (CSS `position: fixed` в печати) ★; б) оставить на первой.

25. **Правило измерения печати.** В `druck` 1511 нарушений, почти все — эмодзи и «·» на стартовых экранах приложений без печати. а) мерить печать только у приложений с печатью (druck.css или кнопка печати) ★; б) мерить все.

26. **Символы ☐ ☑ ✔ в 43 приложениях, не измеренных браузером**, и sprich-mit-mir (детский или взрослый лист?). а) выбрать и проверить измерением, детские листы переделать как mini-gaertner-begleiter, листы для взрослых оставить ★; б) отложить.

27. **Поле `quelle.geprueft: true`** (в данных ряда приложений) не говорит, кто проверил. а) переименовать в `quelle.maschinell` ★; б) оставить; в) убрать поле (удаление — только по вашему списку).

28. **Метка страниц в ~8 приложениях без видимых номеров страниц**: метка стоит в тексте источника, а номеров страниц не видно. а) оставить ★; б) убрать метку там, где страниц нет (удаление — только по вашему списку).

29. **Favicon:** общий SVG того же origin (`packages/kinder-ui/img/favicon.svg`) вместо `data:`, чтобы Content-Security-Policy осталась прежней. Подтвердить. а) да ★; б) встроить `data:` в каждую страницу.

30. **Vorlesen для kinderrat и regel-werkstatt** (единственные два из 100 детских приложений без озвучивания). а) добавить малым заданием ★; б) вписать в GDD «Vorlesen: nicht vorgesehen».

## Д. Новая волна

31. **Ступень 1 принята интегратором и внесена в репозиторий; ваши решения по ней.** Что построено: CON-3 `meine-familie-woerter-und-rollen-content-pack`, CON-6 `himmelsgucker-sonne-mond-und-sterne`, CON-9 `farbwoerter-schatz`, CON-10 `musik-woerter-bilderlexikon` — все как собственные карточные приложения (путь B), потому что движок quiz-kern не умеет картинки, выбор слов, печать по выбору и требует не меньше десяти вопросов (`docs/plan-neue-welle.md`, раздел 5, вопрос 1). Подробности и вопросы писателей: `docs/arbeitsweise/lauf-e-ergebnis.json`.
    а) путь B для всех четырёх подтвердить ★; б) переделать на quiz-kern (дороже, контент придётся ужать);
    в) возраст: CON-3 — 3–5 лет по Bauauftrag ★ или 5–7 (тот же заголовок раздела есть на S. 214 в группе ФАНТАЗЕРЫ); CON-6 — 5–7 по каталогу ★ или «четвёртый–пятый год» (S. 103); CON-10 — 5–9 по каталогу, в источнике 5–7: оставить «возраст открыт» до теста с детьми ★;
    г) Hilfe-Insel (116 111) в CON-3 при совместном использовании не добавлять ★, или добавить (тема семьи: потеря, расставание);
    д) записи CON-3, CON-6, CON-9, CON-10 в `BEWUSST_OHNE` (`packages/kinderschutz/test/hilfe-insel-abdeckung.test.mjs`: Fachlernen или совместное использование) ★ да — я не вносил, пока вы не ответите;
    е) CON-6: три ответа на лунные картинки (по Bauauftrag — два), два дополнительных вопроса про Солнце и звёзды, «Raumfahrt» не включена: оставить как построено ★.

32. **Ступень 2** (9 расширений: KIN-17, GEM-8, GEM-13, GEM-14, GEM-16, GEM-19, CON-1, CON-4, CON-7). а) начать после паузы и приёмки ступени 1 ★; б) отложить.

33. **Ступень 3** (53 расширения, порциями не больше 8, в порядке состояния фактов: сначала записи с проверенным источником). а) да, после ступени 2 и после потока Г по тем же приложениям ★; б) отложить; в) вычеркнуть часть (список пришлю).

34. **Три «unklar»:** CON-13 Trostvers-Generator, CON-15 Naturschutz-Rat, PRI-6 Frischluft-Rituale. Для каждого: а) строить, б) изменить задание (скажите как), в) отказаться. ★ без ответа не строить.

35. **PRI-8 «Kleine Forscher ohne Bildschirm»:** (1) карточка «Ineinanderlegen» ссылается на S. 63, а в источнике это начало S. 64 (`daten/karten.json`, `test/logik.test.mjs` Z. 34); (2) каталог говорит «11 Lernziele», построено 7 карточек; (3) профессиональная проверка текстов по безопасности ещё не сделана. а) исправить (1) и (2) малым заданием ★; б) оставить.

36. **Длина GDD.** Запуск GDD составил 14 документов за 5 часов и ~12 млн токенов; черновик для CON-3 был больше 30 КБ. Предлагаю Kurz-GDD не длиннее 14 КБ. а) да ★; б) без ограничения.

## Е. Организация

37. **17а, доступ на чтение для вашего окружения.** Вы ответили «да». Доступ выдаёт владелец сессии в настройках сессии; дать его себе я не могу. Напоминание, действий от меня нет.

38. **16а, draft pull request.** Вы ответили «пока не создавать, до зелёных A7 и 48 px». A7 выполнен; по 48 px остаётся 32 случая (пункт 23). Слияние в main в любом случае делаете вы. а) создать draft после пункта 23 и приёмки ступени 1 ★; б) создать сейчас; в) пока не создавать.

39. **18а, архив завершённых сессий.** Вы ответили «пока не трогать, до конца A7». A7 закончен. а) пока не трогать ★; б) заархивировать завершённые после вашего «да»; сначала покажу список.

40. **29а, мелкие пункты реестров.** Вы обещали прислать их отдельным пронумерованным списком, когда закончим срочное. Жду; сейчас срочное закончено, кроме ступени 1.

41. **Impressum:** на странице стоят заглушки «Noch nicht veröffentlichungsreif» (издатель, хостинг). Их заполняете вы (реквизиты я не придумываю). а) пришлите данные ★; б) оставить заглушки до публикации.

42. **Режим работы после паузы.** Реально параллельно идут два агента (4 процессора), поэтому ступень 1 занимает несколько часов; запуск GDD занял 5 часов. Предлагаю: одна ступень или одна порция потока Г за сессию, отчёт одной строкой (19в), push только после зелёного прогона. а) так ★; б) параллельно больше, если вы увеличите ресурсы контейнера.

43. **Снят.** Запуск E закончен, результат закоммичен и запушен; незащищённых папок в рабочем дереве нет.

## Ж. Новое после запуска E (решения проверяющих и писателей)

44. **CON-3 (Meine Familie):** а) граница сессии (шесть карточек, затем пауза «Bildschirm aus», в паузу ведёт только «Fertig», выход только на старт) — это направляющая в ходе, не блокировка («Zum Start» и перезагрузка начинают заново) ★; б) жёсткий лимит (в docs/10 это «жёсткие лимиты сессий» для 3–5) потребует блокировки по состоянию; в) раунд вопросов о ролях — отдельная кнопка на стартовом экране (так обход границы закрыт; отклонение от Bauauftrag, раздел 3) ★; г) Gesprächsimpulse: 9 открытых вопросов, 4 приглашения, 4 вопроса «да/нет» — оставить ★ или сделать все открытыми; д) «ворот для взрослого» перед стартом нет (у соседних приложений 3–5 есть): добавить или оставить подсказку «только вместе» на старте и в подвале ★; е) новые слова (Oma, Opa, Tante, Onkel, Nichte) не добавлять: в S. 117 их нет ★.

45. **Число страниц печати.** `tools/browser-tor.mjs` считает карточки в DOM, а не страницы PDF. Проверяющий CON-6 показал, что лист из CON-6 при более широком шрифте (DejaVu Sans, около +8 %) переходит на вторую страницу, и ни один тест этого не видит; в CON-10 то же при увеличении картинки или шрифта (в CON-6 есть тест «Druckbudget», в CON-9 и CON-10 нет). а) добавить в `tools/browser-pruefung.mjs` проверку числа страниц PDF (по выбору с DejaVu Sans) для приложений с печатью, а в CON-9 и CON-10 добавить тест «Druckbudget» ★; б) только записать как известное ограничение. Связано с пунктом 25.

46. **CON-9 (Farbwörter-Schatz):** а) слова групп «Kontrast» (три пары) и «neutral» (три слова) и «eisblau», «nachtblau» — Eigenentwurf; оставить с пометкой, профпроверка по искусствоведению/педагогике ★; б) шесть слов за раунд (Eigenentwurf) как лимит для 3–5 и 5–7: оставить ★; в) каталог обещает «dreisprachig de/uk/ru», сделан только немецкий: вычеркнуть обещание из каталога ★ или перевести позже (кто переводит); г) минимальная ширина экрана 360 px (при 320 px четыре переноса слов): оставить 360 ★.

47. **CON-10 (Musik-Wörter-Bilderlexikon):** а) «7+ инструментов» из каталога: S. 161 называет скрипку, флейту, арфу, трубу «и др.»; оставить семь инструментов со S. 260 ★ или добавить эти четыре как Eigenentwurf; б) подсказку «нет немецкого голоса» показывать один раз вверху (сейчас на экране инструментов восемь раз) и не обещать озвучивание во вводном тексте, если голоса нет ★ да; в) пометка «Eigenentwurf» стоит мелко в подвале каждого экрана; достаточно ли (экран инструментов читает взрослый вслух) ★ достаточно; г) 23 собственных рисунка SVG (первая версия, без лиц людей): принять стиль и право на использование (авторские права на наши рисунки у проекта), нужна вычитка человеком ★ да, вычитка позже.

## З. Nachtrag 28.10.2026: Analyse der Pläne 18.10 und 27.10 (Stufe 2)

Grundlage: `docs/analyse-plaene-18-10-und-27-10.md`. Antworten wie bisher: Nummer und Buchstabe, ★ ist meine Empfehlung.

48. **Serien C und D.** Die Faktenprüfung bereits gebauter Apps (Serie C, 53 Einheiten) und die Statuszeilen in docs/10 (Serie D) stehen im Plan vom 27.10 nicht mehr. а) wieder einplanen, nach Stufe 3 ★; б) streichen; в) als eigene Welle direkt nach Stufe 2.

49. **Reihenfolge der Stufe 3.** 53 Ausbau-Einheiten: nach geprüftem Faktenstand (Plan vom 27.10) oder nach Altersstufen (Plan vom 18.10)? а) nach Faktenstand ★; б) nach Altersstufen.

50. **Entfernen von Wertungsresten (Stufe 2).** CON-1 und CON-7 haben Punkte, Rang und Rekord im Bestand; CON-4 hat einen Punktzähler in app.mjs (Zeilen 26, 155, 199). а) Entfernen jetzt freigeben, nach der Liste im Bauauftrag ★; б) erst nach Abschluss von Stufe 2; в) je App eine eigene Liste.
   Nachprüfung 29.10.2026: Die Zählerzeilen sind im Code schon entfernt. Commit 96a1f89 („Lauf C“, 27.10.2026) hat die Wertung aus 51 Kinder-Apps genommen; in `stark-und-gesund`, `herkunftssprachen-bruecke` und `deutschland-kompass` fehlen Punkte, Ränge und Rekord im Code. Übrig ist nur der Migrationsschlüssel `rekordSchluessel` (eine Zeile, nach der Regel erlaubt). Damit entfällt die Löschfreigabe nach a) bis c) für CON-1, CON-4 und CON-7. Die Aussagen dazu in den Bauaufträgen und im Brief sind veraltet; sie tragen Anmerkungen. Offen bleibt Frage 51 (Ränge im Katalog).
   Korrektur 29.10.2026 (Prüfung CON-4): Die Angabe „Übrig ist nur der Migrationsschlüssel rekordSchluessel“ gilt nicht für deutschland-kompass. Dort gibt es den Schlüssel weder im HEAD noch in der Arbeitskopie. Für diese App ist der Abbau der Zähler durch Commit 96a1f89 belegt (HEAD: Z. 26 und 155 leer, Z. 199 Kopf von laenderKarten()).

51. **Ränge.** Der Katalog verlangt Ränge (CON-1, CON-4), docs/02 Z. 141–146 verbietet sie. а) keine Ränge bauen und den Katalogtext angleichen ★; б) Ränge ohne Vergleich, nachdem die Regel geprüft ist.

52. **Gesundheitsaussagen (CON-1).** Schlaf, Bildschirmpausen, Getränke und Hygiene sind im Quelltext (S. 13–20) nicht belegt; die Erklärungen sind Eigenentwurf und nicht geprüft. а) vor dem Ausbau fachlich prüfen lassen ★; б) diese Inhalte streichen; в) Ausbau ohne sie.

53. **Sprachen uk und ru.** Der Katalog nennt de, uk und ru in mehreren Einheiten (GEM-8, GEM-19, CON-7, CON-12, PRI-7). а) zunächst nur Deutsch, uk und ru später mit Prüfung durch eine Lehrkraft ★; б) jetzt mit Prüfung.

54. **Engine für die Ausbauten.** GEM-14 und GEM-16 nutzen ein eigenes Format, der Katalog nennt quiz-kern. а) eigenes Format behalten und den Katalog angleichen ★; б) auf quiz-kern umstellen.

55. **Altersgruppen.** GEM-19: Katalog 8–12, App 5–7 (Dublette zur geschichten-werkstatt). CON-7: Katalog 4–7 und Eltern, App 8–12. GEM-13: App 5–8, Katalog 5–7. CON-12: 5–7 (S. 199). а) je Einheit den Katalog angleichen, wenn die App stimmt ★; б) App anpassen.

56. **Bilder (GEM-13, GEM-16).** Wimmelbild, Foto- und Zeichenmaterial stehen im Katalog, in der App sind sie nicht belegt; die Bildrechte sind offen. а) in diesem Ausbau keine Bilder, nur Beschreibungen ★; б) eigene Zeichnungen mit Freigabe.

57. **Begriffe in GEM-14.** Der Katalog nennt „hinter“, die App verwendet eine gesperrte Form; vor den Zielen S. 141 und 142 stehen Sternchen ohne Erklärung (A11). а) App-Form behalten und den Katalog korrigieren, wenn die Quelle das stützt ★; б) Katalog übernehmen. Die Bedeutung der Sternchen klärt der Prüfer aus der Quelle.

58. **GEM-19: Abweichungen.** Der Name „Stimmungs-Werkstatt“ ist aus dem Anzeigenamen entfernt, „fröhliches Ende“ ist gestrichen, die Erzeugerfunktion (KI-bereit) ist nicht gebaut, das Muster „Uther 2004“ ist nicht in der Arbeitskopie geprüft. а) Abweichungen bestätigen ★, Erzeugerfunktion später; б) Name und Ende zurückholen.

59. **PRI-7 Fühl- und Sortier-Werkstatt.** Die App existiert (43 Tests); der Index sagt „neu bauen“. Altersangabe: Katalog 2–3, Quelle 1–3 (A20). а) Ausbau ★; б) Neubau. Altersangabe 1–3 nach der Quelle ★.

60. **CON-12 Puppentheater-Werkstatt.** Vertep und Batleika sind im Quelltext (S. 287–288) nicht belegt; „Eintrittskarten“ sind Einladungen zu einer Ausstellung. а) Vertep und Batleika streichen ★; б) mit anderer Quelle belegen. Eintrittskarten als Typ „einladung“ ★. Altersangabe 5–7 (S. 199) bestätigen.

61. **Unklare Einheiten ohne Bauauftrag: PRI-6, CON-13, CON-15.** а) PRI-6 Frischluft-Rituale: nur Rituale ohne Gesundheitsversprechen; б) CON-13 Trostvers: personenbezogen (Kindernamen); ★ nur ohne Namen oder mit Einwilligung; в) CON-15 Naturschutz-Rat: ★ als Klassen-Koffer ohne Wertung. Antwort je Einheit.

62. **Zitatgrenze (A10 b).** Werkzeug und Aufträge nutzen sechs Wörter; CON-2 und KIT-12 nennen die Frage „12 gelten sollen“. docs/10 Punkt 1 nennt keine Zahl. а) sechs Wörter ★; б) zwölf. Außerdem: die Herkunft der Zahl klärt der Koordinator.

63. **Index und Registrierung.** CON-18, CON-12 (Feld app), PRI-7 und KIN-17 sind im Index veraltet. (Nachprüfung 28.10: Das Feld app von CON-12 ist gesetzt; veraltet sind Status und „neu bauen (Welle)“.) а) der Koordinator korrigiert nach jedem Ausbau ★; б) Index aus den Registrierungsdateien erzeugen (tools/bauauftrag-index.mjs).

64. **Freigabe der Ausbauten.** а) Stufe 2 als Ganzes abschließen, sobald die Entscheidungen 50 bis 60 vorliegen ★; б) jede Einheit einzeln freigeben.

## И. Nachtrag 29.10.2026: Befunde aus GEM-13 (Fragen 65 bis 67)

Die drei Fragen betreffen den Bestand von `erzaehl-bruecke` und zugleich andere Apps. Stichwort-Zählungen (nicht von Hand geprüft, Stand 29.10.2026): „Stufe“ (ohne Groß- und Kleinschreibung) kommt in 45 Apps in `app.mjs`, `index.html` oder `daten/*.json` vor; `Math.random` steht in 27 Apps in den Haupt-Dateien (`*.mjs` im App-Ordner). Das Werkzeug `tools/leistungs-woerter.mjs` prüft das Wort „Stufe“ nicht. Der Ausbau-Brief hatte das Gegenteil angenommen; das ist korrigiert (Brief, Abschnitt Einheit CON-4, Punkt 1, Anmerkung vom 29.10.2026).

65. **Zufall im Bestand (GEM-13).** `Math.random` steht in `logik.mjs` (Standardwert der Auswahl) und in `app.mjs` („Überraschung einbauen“). Der Bauauftrag verlangt einen Zufallsimpuls; der Brief verlangt keinen Zufall im Code der App. Das Ersetzen der beiden Stellen wäre eine Löschung. а) Bestand bleibt; der Regeltest zählt die Stellen, neue kommen nicht hinzu ★; б) die Auswahl wird als Parameter aus `app.mjs` übergeben (zwei Zeilen ersetzen, erst nach Freigabe); в) der Zufallsimpuls entfällt (nach Freigabe).
   Betrifft auch CON-4: `apps/deutschland-kompass/app.mjs`, Funktion `zufall` (Modi 1 und 2), eine Stelle. Der Ausbau von CON-4 nutzt keinen neuen Zufall.
   Korrektur 29.10.2026 (Prüfung CON-4): „eine Stelle“ ist zu knapp. Im Bestand von deutschland-kompass steht `Math.random` einmal in der Funktion `zufall` (HEAD Z. 19). `mischen()` aus kinder-ui wird im Bestand importiert (HEAD Z. 7) und zweimal aufgerufen (Modus 1 und 2, HEAD Z. 93 und 146). Das ist Bestand. Der neue Modus 4 nutzt keinen Zufall. Die Zählung in test/regeln.test.mjs schreibt Variante a) fest, bis Max entscheidet.
   Nachtrag 29.10.2026: Der Zufall steckt auch in gemeinsamen Paketen. `packages/kinder-ui/js/komponenten.mjs` (Zeile 91) nutzt `Math.random` in `mischen()`. `packages/quiz-kern/src/quiz.mjs` importiert `mischen`; 28 Apps nutzen quiz-kern. 51 App-Dateien importieren `mischen` direkt (Zählung mit grep, Stand jetzt). GEM-8 hat im neuen Modus „Reihen legen“ den Zufall entfernt: zwölf feste Anordnungen mit Zähler. Der erste Entwurf nutzte `mischen()` in der App-Schicht; der Brief verbot das für neue Zeilen. Zu entscheiden: (a) Zufall über gemeinsame Pakete und in der Anzeige (Reihenfolge der Antworten) ist kein Zufall im Code der App; die Logik bleibt zufallsfrei ★; (b) die Regel gilt streng auch für Pakete: dann ist ein Umbau von `mischen()` und quiz-kern nötig (große Änderung, eigene Entscheidung).
   Korrektur 29.10.2026 (Prüfung GEM-8): Die Zahl „28 Apps nutzen quiz-kern“ zählt auch package.json mit. In app.mjs importieren 26 Apps quiz-kern; 51 App-Dateien importieren mischen. Die Bestands-Quizmodi von mathe-entdecker mischen über quiz-kern; das gehört zu dieser Frage.

66. **Das Wort „Stufe“ im Bestand (GEM-13 und andere Apps).** In `app.mjs` (Zeile 61: „Erzähl Stufe für Stufe“) und in der Beschreibung von `index.html` nennen die Treppenschritte „Stufe“. Die Regel für Kinder zählt „Stufe“ zu den Wertungswörtern (Liste des Nutzers); der Bauauftrag GEM-13 nutzt es in Abschnitt 2 für die Treppe und nennt es in Abschnitt 6 verboten. Neue Texte für Kinder enthalten das Wort in GEM-13 nicht. а) Bestand ersetzen durch „Schritt“ (in GEM-13 zwei Stellen; in den übrigen Apps prüfen, Umfang 45 Stichwort-Treffer, erst nach Freigabe) ★; б) Bestand bleibt, neue Texte für Kinder ohne „Stufe“ (der Regeltest zählt die Stellen); в) die Liste des Werkzeugs `leistungs-woerter` um „Stufe“ erweitern; das meldet dann auch die 45 Apps (Bericht, kein Tor).
   Nachtrag 29.10.2026: Dasselbe Problem gibt es bei „Sterne“. In `apps/mathe-entdecker/daten/fragen.json` steht im Bestand (HEAD) die Frage m16: „In welcher Gruppe sind WENIGER Sterne? ⭐⭐⭐⭐⭐ oder ⭐⭐?“ mit den Antworten „Bei den fünf Sternen“ und „Bei den zwei Sternen“. Das Wort zählt Gegenstände, keine Leistung; die Nutzerregel nennt „Sterne“ trotzdem. Option ★: Frage und beide Antworten auf Äpfel umstellen (Ersatz einer Bestandszeile; die Erklärung bleibt wörtlich). Bis zur Entscheidung bleibt m16 unverändert; der Regeltest zählt „Sterne“ gegen den Bestand, wie bei „Stufe“.
   Korrektur 29.10.2026 (Prüfung GEM-13): „in GEM-13 zwei Stellen“ und „Umfang 45 Stichwort-Treffer“ in der Frage 66 oben sind falsch. In GEM-13 stehen die sichtbaren Stellen in app.mjs:61 (zwei Vorkommen) und index.html:7 (zwei Vorkommen), dazu die Fehlermeldung in logik.mjs:15 und die nicht sichtbare Eigenschaft `stufen` in logik.mjs:53. Die Zählung ergibt 45 Apps mit Treffern und insgesamt 331 Vorkommen (Stichwort in app.mjs, index.html und daten/*.json; nicht von Hand geprüft).
   Ergänzung 29.10.2026 (Prüfung GEM-13, Runde 5): Bei Option а) (Ersetzen durch „Schritt“) gehören zur Dokumentation auch die Stellen in README (Z. 12 und 25), GDD (Z. 9, 24, 45, 58 und 68) und eltern.html (Z. 15 bis 16). Der Umfang dieser Option ist damit größer, als die Entscheidung bisher nennt.
   Ergänzung 29.10.2026 (Prüfung GEM-8): Die Option „Äpfel“ für m16 macht nach Prüfung den Ratchet-Test in regeln.test.mjs (Z. 155 bis 156) rot, weil er auf Gleichheit statt auf Obergrenze prüft. Der Schreiber passt den Test auf „höchstens Bestand“ an; dann hängt die Entscheidung nicht mehr am Test.

67. **Fokus nach Klick im Bestand (GEM-13).** „Geschichte würfeln“, „Überraschung einbauen“, „Neue Geschichte“ und „Start“ setzen den Fokus auf den ersten Knopf (gemessen bei 360 px). Die neue Weil-Karte behält den Fokus. Ob das den Tor-Punkt „Fokus nach Klick“ (Plan vom 27.10, Abschnitt 3, Punkt 3) verletzt, ist nicht geklärt. а) Bestand so lassen; der Befund steht in der GDD (Abschnitt Offen) ★; б) Fokus nach dem Neuaufbau auf die Überschrift des neuen Bildschirms setzen (Änderung im Bestand, erst nach Freigabe).
   Korrektur 29.10.2026 (Prüfung GEM-13): „ob das den Tor-Punkt verletzt, ist nicht geklärt“ ist zu weit gefasst. Der Maßstab ist tools/browser-pruefung.mjs (Z. 19 bis 22 und 367 bis 374): Bei einem Bildschirmwechsel muss der Fokus auf einer Überschrift mit tabindex="-1" liegen. Die Vorlage puppentheater-werkstatt (test/regeln.test.mjs, Z. 179 bis 193) merkt den Fokus und setzt ihn nach dem Neuaufbau wieder. Nach diesem Maßstab erfüllt der Bestand den Punkt nicht (Fokus auf „🔊 Vorlesen“); die Weil-Karte erfüllt ihn. Dritte Option: в) den Fokus merken und nach dem Neuaufbau wieder setzen (Vorlage).
   Ergänzung 29.10.2026 (Prüfung GEM-8): Die Quiz-Schritte des gemeinsamen Motors quiz-kern (packages/quiz-kern/src/quiz.mjs, Z. 91) setzen den Fokus auf „🔊 Vorlesen“. Das betrifft alle Quiz-Apps, nicht nur mathe-entdecker. Das Werkzeug misst diese Knöpfe nicht.

68. **CON-4 „Vom Ort zur Erde“: Umfang des Modus.** Der Brief nennt vier Ebenen (Bundesland, Deutschland, Europa, Erde) ohne Frage-Ablauf. Der Bauauftrag (Abschnitte 1, 3 und 5) nennt Straße und Stadt als erste Stufe und Fragen mit Erklärung je Ebene. Der Bau folgt dem Brief. Abweichung auch beim Fokus: Nach einem Wechsel über die Kopfleiste bleibt er auf dem Knopf (Bauauftrag Abschnitt 8 verlangt die Überschrift). а) Umfang des Briefs annehmen und den Bauauftrag angleichen ★; б) Straße und Stadt und den Frage-Ablauf nachbauen (eigene Fragendatei; `daten/karte.json` bleibt unverändert). Der Commit von CON-4 wartet auf die Entscheidung.
   Ergänzung 29.10.2026 (Fokus, nach Prüfung CON-4): Der Fokus nach dem Kopfknopf ist eine eigene Entscheidung. Der Browser-Tor verlangt Knopf-Fokus, solange der Knopf stehen bleibt. Mit Überschrift-Fokus (Bauauftrag §8) meldet er einen Klickfehler und Exit 1. а) Knopf-Fokus, wie der Tor es verlangt ★ (so ist der Stand nach der Korrektur); б) Überschrift-Fokus wie im Bauauftrag; dann braucht das Werkzeug eine ausdrückliche Ausnahme (Änderung von tools/, Entscheidung Max).

69. **Testzahl-Regel und Klammer hinter einer Testdatei (CON-4).** `packages/kinderschutz/test/testzahlen.test.mjs` liest jede Zahl in Klammern hinter einer Testdatei (`test/…test.mjs (N)`) als Gesamtzahl der App und vergleicht sie mit allen Tests der App. Bei Apps mit mehreren Testdateien schlägt das fehl. Betroffen ist `apps/deutschland-kompass/GDD.md`, Abschnitt 6: die Bestandszeile „`test/logik.test.mjs` (13)“. Die 13 stimmen für diese Datei; die App hat 41 Tests. Im HEAD ist die Prüfung grün (102 von 102 Tests im Paket), mit den neuen Testdateien rot. а) Nur die Klammer ändern zu „(13 Prüfungen)“; die Zahl bleibt, die Prüfung liest sie dann nicht mehr als Gesamtzahl ★; б) die Regel in packages/ ändern, sodass sie die Klammer mit den Tests dieser Datei vergleicht (betrifft alle Apps). Bis zur Entscheidung wird CON-4 nicht committet.
   Korrektur 29.10.2026 (Prüfung CON-4): Die Frage nennt docs/10 nicht. docs/10 Z. 137 nennt für deutschland-kompass „13 тестов“ (Wellen-Bericht). Diese Zahl ist auf 41 gesetzt worden (Zählungsänderung, 29.10.2026). Damit bleibt nur die Klammer in GDD §6 offen. Option a) und b) machen die Prüfung dann grün.
