# 🚀 Сборка через GitHub Actions (без локального Android Studio)

GitHub соберёт приложение на своих серверах. Тебе не нужен мощный компьютер — только аккаунт GitHub.

Есть два автоматических сценария:
- **Debug APK** — собирается при каждом пуше. Для теста на телефоне.
- **Release AAB** — собирается по тегу `v1.0.0`. Подписанный, для Google Play.

---

## ЧАСТЬ 1. Загрузка проекта на GitHub

1. Создай репозиторий на github.com (кнопка **New repository**). Назови, например, `mystica`. Сделай его **приватным** (Private).

2. На своём компьютере, в папке `mystica-project`:

```bash
git init
git add .
git commit -m "Мистика — первая версия"
git branch -M main
git remote add origin https://github.com/ТВОЙ_ЛОГИН/mystica.git
git push -u origin main
```

3. После пуша зайди на GitHub → вкладка **Actions**. Workflow «Build Debug APK» запустится автоматически.

---

## ЧАСТЬ 2. Скачать debug-APK

1. GitHub → вкладка **Actions** → выбери последний запуск «Build Debug APK»
2. Дождись зелёной галочки (сборка ~5 минут)
3. Внизу страницы в разделе **Artifacts** скачай `mystica-debug-apk`
4. Внутри — `app-debug.apk`. Перекинь на телефон и установи (разреши установку из неизвестных источников)

> Debug-APK работает для теста интерфейса. Подписки в нём не работают — для них нужен release в Google Play.

---

## ЧАСТЬ 3. Подготовка к release-сборке (.aab)

Для подписанного `.aab` нужен ключ. Создай его один раз на любом компьютере с Java:

```bash
keytool -genkey -v -keystore mystica-release.keystore \
  -alias mystica -keyalg RSA -keysize 2048 -validity 10000
```

Запомни: пароль хранилища, пароль ключа, alias (`mystica`).
**Сохрани файл `.keystore`** — без него не обновить приложение!

Теперь преврати keystore в текст (base64), чтобы положить в секреты GitHub:

```bash
# Linux/Mac:
base64 -i mystica-release.keystore | tr -d '\n' > keystore-base64.txt
# Windows (PowerShell):
[Convert]::ToBase64String([IO.File]::ReadAllBytes("mystica-release.keystore")) > keystore-base64.txt
```

---

## ЧАСТЬ 4. Добавить секреты в GitHub

GitHub → твой репозиторий → **Settings → Secrets and variables → Actions → New repository secret**.

Создай 4 секрета:

| Имя секрета | Значение |
|---|---|
| `KEYSTORE_BASE64` | содержимое файла keystore-base64.txt |
| `KEYSTORE_PASSWORD` | пароль хранилища |
| `KEY_PASSWORD` | пароль ключа |
| `KEY_ALIAS` | `mystica` |

> Секреты зашифрованы и не видны в логах. Это безопасный способ хранить ключ.

---

## ЧАСТЬ 5. Запустить release-сборку и скачать .aab

Создай тег версии и запушь его:

```bash
git tag v1.0.0
git push origin v1.0.0
```

GitHub → **Actions** → «Build Release AAB» запустится автоматически. После завершения:
- Раздел **Artifacts** → скачай `mystica-release-aab`
- Внутри `app-release.aab` — это файл для загрузки в Google Play Console

> Для следующих версий: подними `versionCode` в коде, создай новый тег (`v1.0.1`) и запушь.

---

## Частые вопросы

**Workflow не запустился?** Проверь, что файлы лежат в `.github/workflows/` именно в корне репозитория.

**Сборка упала на подписи?** Проверь, что все 4 секрета созданы и `KEY_ALIAS` совпадает с тем, что ты указал в keytool.

**Хочу собрать вручную без тега?** В Actions выбери workflow → кнопка **Run workflow**.

**Бесплатно ли это?** Да, для приватных репозиториев GitHub даёт 2000 минут сборки в месяц бесплатно — этого с запасом хватит.
