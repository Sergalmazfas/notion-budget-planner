# notion-budget-planner
🚀 buget planner based on notion api. Build with create-react-app and express

---

## 📄 **Правила деплоя проекта `notion-budget-planner`**

### 📝 **1️⃣ Куда деплоимся:**

* Google Cloud Run сервис:

  * Имя сервиса: `notion`
  * Регион: `us-east1`
  * URL сервиса: `https://notion-<PROJECT_NUMBER>.run.app`
    *(пример: [https://notion-1005781479849.us-east1.run.app](https://notion-1005781479849.us-east1.run.app))*

* Контейнер собирается из исходного кода в GitHub репозитории:

  ```
  https://github.com/Sergalmazfas/notion-budget-planner
  ```

---

### 🛠 **2️⃣ Как деплоимся (CI/CD):**

#### ⚡ **Автоматический деплой:**

* При любом push в ветку `main` автоматически срабатывает Cloud Build Trigger:

  * Шаг 1: Сборка Docker image.
  * Шаг 2: Публикация Docker image в Artifact Registry.
  * Шаг 3: Автоматический деплой в сервис `notion` в Cloud Run.

Все параметры деплоя зафиксированы в `cloudbuild.yaml`:

* Подключение Secrets из Google Cloud Secret Manager:

  * `NOTION_TOKEN`
  * `DATABASE_ID`
* Используется `service-account`:
  `1005781479849-compute@developer.gserviceaccount.com`

---

#### 🚀 **Ручной деплой (по запросу):**

Для ручного запуска пайплайна:

```bash
gcloud builds submit --config cloudbuild.yaml .
```

Это запустит тот же самый build + deploy workflow, что и Trigger.

---

### 🔒 **3️⃣ Подключение секретов:**

В Cloud Run сервисе `notion` гарантированно передаются следующие секреты из Google Cloud Secret Manager:

* `NOTION_TOKEN`: API токен интеграции Notion.
* `DATABASE_ID`: ID базы данных Notion.

Секреты **не хранятся в репозитории** — только в Secret Manager.

---

## 🔎 **Инструкция для проверки сервиса после деплоя:**

✅ **Шаг 1: Проверить статус деплоя**

* Перейти в Google Cloud Console → Cloud Run → сервис `notion`.
* Убедиться, что появилась новая ревизия (`Revision`) с последним временем деплоя.

---

✅ **Шаг 2: Проверить настройки секрета**

* В разделе "Environment variables & Secrets":

  * Должны быть подключены:

    * `NOTION_TOKEN`: из Secret Manager
    * `DATABASE_ID`: из Secret Manager
  * Должно быть установлено `NODE_ENV=production`.

---

✅ **Шаг 3: Проверить доступность сервиса**

* Открыть URL сервиса:

  ```
  https://notion-<PROJECT_NUMBER>.run.app
  ```

  Пример:

  ```
  https://notion-1005781479849.us-east1.run.app
  ```

* Сервис должен запускаться без ошибок (`HTTP 200` на главной странице или соответствующий API ответ).

---

✅ **Шаг 4: Проверить интеграцию с Notion**

* Должны создаваться или обновляться записи в базе данных в Notion,
  в соответствии с логикой приложения (`notion-budget-planner`).

---

## 💡 **Важные правила:**

* **Никогда не коммитить реальные токены в репозиторий**: они всегда хранятся только в Secret Manager.
* Все деплои в сервис `notion` должны идти через CI/CD pipeline (Trigger или ручной `gcloud builds submit`).
* Не использовать `PORT` в `--set-env-vars` — Cloud Run сам устанавливает эту переменную.
