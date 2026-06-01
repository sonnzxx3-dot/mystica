# 🔮 Мистика — комплект для публикации в Google Play

Полный набор файлов-заготовок для сборки приложения через Capacitor.

## С чего начать

Есть два пути сборки — выбери удобный:

- **Через GitHub (рекомендую, проще)** → читай **`GITHUB-сборка.md`**. GitHub соберёт APK и AAB на своих серверах, локальный Android Studio не нужен.
- **Локально на своём ПК** → читай **`SETUP-сборка.md`** (нужен установленный Android Studio).

Для деталей по подпискам и публикации смотри **`GUIDE-Android-сборка.md`** (в корне outputs).

## Что внутри

```
mystica-project/
├── package.json              ← зависимости (React, Vite, Capacitor, биллинг)
├── vite.config.js            ← конфиг сборки веб-части
├── capacitor.config.json     ← appId = ru.mystica.app, название, splash
├── index.html                ← точка входа
├── .gitignore                ← защита ключей от попадания в git
├── SETUP-сборка.md           ← ⭐ ГЛАВНАЯ инструкция со скриптом команд
├── src/
│   ├── main.jsx              ← запуск React
│   ├── MysticApp.jsx         ← наше приложение (готовое)
│   └── billing.js            ← подписки basic/pro через RevenueCat
├── android-files/            ← заготовки для android/ (применить по SETUP)
│   ├── strings.xml
│   ├── build.gradle.fragment
│   └── key.properties.example
└── assets-icons/             ← графика для карточки Google Play
    ├── icon-512.png          ← иконка для карточки магазина
    ├── feature-graphic-1024x500.png  ← баннер карточки
    └── *.svg                 ← исходники (можно редактировать)
```

> **Про иконку приложения:** она генерируется автоматически из `resources/icon.png`
> и `resources/splash.png` командой `npx @capacitor/assets generate` (этот шаг уже
> встроен в оба GitHub-workflow и в локальную инструкцию). Заменишь файлы в `resources/`
> — поменяется иконка. `assets-icons/` — это отдельные картинки для карточки магазина.

## Что НЕ входит (делается на твоём ПК)

- Папка `android/` — создастся командой `npx cap add android`
- Ключ подписи `.keystore` — создаёшь сам командой `keytool` (Шаг 7 в SETUP)
- Сам файл `.aab` — собирается командой `./gradlew bundleRelease`

Это нормально: эти вещи по соображениям безопасности создаются только на твоей машине.

## Порядок действий кратко

```bash
npm install                    # 1. зависимости
npm run build                  # 2. сборка веб
npx cap add android            # 3. добавить Android
npx cap sync                   # 4. синхронизация
# применить файлы из android-files/ (см. SETUP)
# создать ключ keytool (см. SETUP, Шаг 7)
cd android && ./gradlew bundleRelease   # 5. собрать .aab
```

Готовый `.aab` будет в `android/app/build/outputs/bundle/release/`.

Удачи! 🌙
