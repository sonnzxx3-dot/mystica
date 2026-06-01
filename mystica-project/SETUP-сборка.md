# 🔮 Мистика — сборка от прототипа до .aab (пошагово)

Инструменты у тебя уже есть (Node + Android Studio). Делай команды по порядку.

---

## ШАГ 1. Установка зависимостей проекта

Открой терминал в папке `mystica-project` и выполни:

```bash
npm install
```

Это поставит React, Vite, Capacitor и плагин подписок (всё уже прописано в package.json).

---

## ШАГ 2. Проверка в браузере (debug веб-версии)

```bash
npm run dev
```

Открой `http://localhost:5173` — приложение должно работать как в прототипе. Покупки в браузере симулируются (это нормально). Нажми Ctrl+C, чтобы остановить.

---

## ШАГ 3. Сборка веб-части

```bash
npm run build
```

Создаст папку `dist/` — это то, что попадёт внутрь приложения.

---

## ШАГ 4. Подключение Android

```bash
npx cap add android
```

Появится папка `android/` — это нативный Android-проект.

Теперь синхронизируй веб-сборку:

```bash
npx cap sync
```

---

## ШАГ 4.5. Генерация иконок и splash-экрана

Иконка приложения и заставка генерируются автоматически из папки `resources/`
(там уже лежат `icon.png` и `splash.png` в стиле приложения):

```bash
npx @capacitor/assets generate --android
```

Эта команда создаст все нужные размеры иконок в `android/app/src/main/res/`.
Без неё приложение будет со стандартной иконкой-заглушкой Capacitor.

> Хочешь свою иконку? Замени `resources/icon.png` (квадрат 1024×1024) и `resources/splash.png` своими, затем снова выполни команду.

---

## ШАГ 5. Применение наших заготовок

Скопируй файлы из папки `android-files/` в нужные места:

1. `strings.xml` → замени `android/app/src/main/res/values/strings.xml`
2. `key.properties.example` → переименуй в `key.properties`, положи в `android/`, впиши пароли (после Шага 7)
3. `build.gradle.fragment` → перенеси блоки в `android/app/build.gradle` (см. комментарии внутри файла)

---

## ШАГ 6. DEBUG-сборка (тест на телефоне/эмуляторе)

Открой проект в Android Studio:

```bash
npx cap open android
```

В Android Studio:
- Подключи телефон по USB (с включённой отладкой) или запусти эмулятор **с Google Play**
- Нажми зелёную кнопку ▶ Run

Или собери debug-APK из терминала:

```bash
cd android
./gradlew assembleDebug
# результат: android/app/build/outputs/apk/debug/app-debug.apk
cd ..
```

Этот APK можно установить на телефон для теста (но подписки заработают только после загрузки в Play — см. ГАЙД).

---

## ШАГ 7. Создание ключа подписи (ОДИН РАЗ, храни вечно!)

В папке `mystica-project`:

```bash
keytool -genkey -v -keystore mystica-release.keystore \
  -alias mystica -keyalg RSA -keysize 2048 -validity 10000
```

Придумай пароль, запомни его. **Сохрани файл `mystica-release.keystore` в надёжном месте** — без него нельзя обновлять приложение в Play!

Теперь впиши пароли в `android/key.properties` (см. Шаг 5).

---

## ШАГ 8. RELEASE-сборка .aab (для Google Play)

```bash
cd android
./gradlew bundleRelease
# результат: android/app/build/outputs/bundle/release/app-release.aab
```

Этот `.aab` — то, что загружается в Google Play Console.

Или через Android Studio: **Build → Generate Signed Bundle / APK → Android App Bundle**.

---

## ШАГ 9. После любых правок кода

Когда меняешь React-код:

```bash
npm run build && npx cap sync
```

И пересобираешь (Шаг 6 или 8).

---

## ⚠️ Перед публикацией не забудь

- [ ] Подключить RevenueCat и вписать ключ в `src/billing.js` (см. ГАЙД, Часть 4)
- [ ] Создать подписки `mystica_basic` и `mystica_pro` в Play Console
- [ ] Заполнить плейсхолдеры в документах (legal/)
- [ ] Разместить Политику конфиденциальности по публичному URL
- [ ] Подготовить иконку 512×512, фичер-графику 1024×500, скриншоты
- [ ] Увеличивать `versionCode` при каждой новой загрузке
- [ ] Оформить налоговый статус (самозанятость/ИП)

---

## Частые ошибки

**`./gradlew: Permission denied`** → выполни `chmod +x android/gradlew`

**`SDK location not found`** → в Android Studio открой проект один раз, он создаст `local.properties` с путём к SDK

**Кириллица в названии ломает сборку** → если возникнут проблемы с `Мистика` в strings.xml, временно поставь латиницей `Mystica`, а локализованное имя добавишь в Play Console
