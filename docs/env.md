# CRMForge — Environment Variables Guide

> **Файл для тебя:** заполняй значения в секции [Мой локальный `.env`](#мой-локальный-env-черновик) внизу.  
> **В репозиторий не коммитить** — только `.env.example` (без секретов).

---

## Быстрый старт (минимум для локалки)

Без внешних сервисов можно стартовать **сразу**:

```env
# Скопируй .env.example → .env и оставь:
MAIL_MOCK=true
AMOCRM_MOCK=true
LOKI_ENABLED=false

# Google / SendGrid / amoCRM — пустые строки OK на старте
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
SENDGRID_API_KEY=
AMOCRM_CLIENT_ID=
AMOCRM_CLIENT_SECRET=
```

Инфра:

```bash
npm run docker:infra   # postgres + redis
npm run start:dev
```

| Что работает без ключей | Что не работает без ключей |
|-------------------------|----------------------------|
| API, health, Swagger | Google login |
| Postgres, Redis (docker) | Реальные письма SendGrid |
| JWT email auth (фаза 2+) | Реальный amoCRM OAuth |
| Письма в консоль (`MAIL_MOCK`) | — |
| amoCRM mock (`AMOCRM_MOCK`) | — |

---

## Легенда

| Метка | Значение |
|-------|----------|
| 🏠 **Локальное** | Придумать / сгенерировать самому, не регистрация |
| 🌐 **Сторонний сервис** | Нужен аккаунт и ключи с внешнего сайта |
| ✅ **Обязательно** | Без этого приложение не стартует |
| ⬜ **Опционально** | Можно пустым на старте |
| ⚠️ **Конфликт** | Должно совпадать с docker-compose / портами |

---

## 1. App — настройки приложения

| Переменная | Тип | По умолчанию | Локально |
|------------|-----|--------------|----------|
| `NODE_ENV` | 🏠 | `development` | Не трогай для dev |
| `PORT` | 🏠 ⚠️ | `3000` | Порт Nest API. Если занят — смени и обнови callback URL |
| `API_PREFIX` | 🏠 | `api` | Префикс: `http://localhost:3000/api` |
| `APP_URL` | 🏠 ⚠️ | `http://localhost:5173` | URL фронта/scrap-ui. В письмах верификации — ссылки сюда |
| `CORS_ORIGIN` | 🏠 ⚠️ | `http://localhost:5173` | Должен совпадать с URL, откуда открываешь фронт |

**Конфликты портов:**

| Сервис | Порт | Переменная |
|--------|------|------------|
| Nest API | 3000 | `PORT` |
| Grafana | 3001 | только docker, не в .env |
| Postgres | 5432 | в `DATABASE_URL` |
| Redis | 6379 | `REDIS_PORT` |
| Vite / scrap-ui | 5173 / 5174 | `APP_URL`, `CORS_ORIGIN` |

---

## 2. Database — PostgreSQL

| Переменная | Тип | Пример |
|------------|-----|--------|
| `DATABASE_URL` | 🏠 ✅ ⚠️ | `postgresql://crmforge:crmforge@localhost:5432/crmforge` |

**Откуда взять:** совпадает с `docker-compose.yml`:

```
postgresql://USER:PASSWORD@localhost:5432/DB
           │      │              │      └── POSTGRES_DB: crmforge
           │      │              └── порт 5432
           │      └── POSTGRES_PASSWORD: crmforge
           └── POSTGRES_USER: crmforge
```

**Если меняешь пароль в docker-compose** — меняй и в `DATABASE_URL`.

**Генерировать не нужно** — для локалки оставь как в `.env.example`.

Проверка:

```bash
npm run docker:infra
docker compose ps postgres   # должен быть running
```

---

## 3. Redis

| Переменная | Тип | По умолчанию |
|------------|-----|--------------|
| `REDIS_HOST` | 🏠 | `localhost` |
| `REDIS_PORT` | 🏠 ⚠️ | `6379` |

**Откуда взять:** docker-compose, сервис `redis`. Менять только если поднимаешь Redis на другом хосте/порту.

---

## 4. JWT — токены авторизации

| Переменная | Тип | Локально |
|------------|-----|----------|
| `JWT_ACCESS_SECRET` | 🏠 ✅ | **Придумай сам** — мин. 32 символа |
| `JWT_REFRESH_SECRET` | 🏠 ✅ | **Другой** секрет, тоже мин. 32 символа |
| `JWT_ACCESS_EXPIRES` | 🏠 | `15m` — можно не трогать |
| `JWT_REFRESH_EXPIRES` | 🏠 | `7d` — можно не трогать |

**Генерация (один раз):**

```bash
node -e "console.log('ACCESS:', require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('REFRESH:', require('crypto').randomBytes(32).toString('hex'))"
```

⚠️ **Не используй** значения из `.env.example` в «настоящем» dev — придумай свои.  
⚠️ **Не коммить** `.env` в git.

**Сторонний сервис:** нет.

---

## 5. Google OAuth — вход через Google

| Переменная | Тип | Локально |
|------------|-----|----------|
| `GOOGLE_CLIENT_ID` | 🌐 ⬜ | Client ID из Google Cloud |
| `GOOGLE_CLIENT_SECRET` | 🌐 ⬜ | Client Secret |
| `GOOGLE_CALLBACK_URL` | 🏠 ⚠️ | `http://localhost:3000/api/auth/google/callback` |

**Когда нужно:** фаза 2 (auth). До этого — пустые строки.

### Пошаговая инструкция — Google Cloud

1. Открой [Google Cloud Console](https://console.cloud.google.com/)
2. Создай проект (или выбери существующий)
3. **APIs & Services** → **OAuth consent screen**
   - User Type: **External** (для теста) или Internal (если Google Workspace)
   - Заполни: App name `CRMForge`, support email
   - Scopes: добавь `email`, `profile`, `openid`
   - Test users: добавь **свой Gmail** (пока app в Testing)
4. **APIs & Services** → **Credentials** → **Create Credentials** → **OAuth client ID**
   - Application type: **Web application**
   - Name: `CRMForge Local`
   - **Authorized JavaScript origins:**
     - `http://localhost:5173` (scrap-ui / vite)
     - `http://localhost:3000` (опционально)
   - **Authorized redirect URIs:**
     - `http://localhost:3000/api/auth/google/callback` ← **точно как в `.env`**
5. Скопируй **Client ID** → `GOOGLE_CLIENT_ID`
6. Скопируй **Client secret** → `GOOGLE_CLIENT_SECRET`

**Документация:** [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)

⚠️ `GOOGLE_CALLBACK_URL` в `.env` **должен буквально совпадать** с redirect URI в Google Console.

---

## 6. SendGrid — почта (верификация email)

| Переменная | Тип | Локально |
|------------|-----|----------|
| `SENDGRID_API_KEY` | 🌐 ⬜ | API Key из SendGrid |
| `SENDGRID_FROM_EMAIL` | 🌐 ⬜ | Verified sender email |
| `MAIL_MOCK` | 🏠 | `true` — **рекомендуется для старта** |

**Когда `MAIL_MOCK=true`:** письма не уходят наружу, текст пишется в консоль Nest. `SENDGRID_API_KEY` не нужен.

**Когда `MAIL_MOCK=false`:** нужен реальный SendGrid.

### Пошаговая инструкция — SendGrid

1. Регистрация: [SendGrid](https://signup.sendgrid.com/) (есть free tier)
2. **Settings** → **API Keys** → **Create API Key**
   - Name: `CRMForge Local`
   - Permissions: **Restricted** → Mail Send → Full Access (для dev)
3. Скопируй ключ **один раз** → `SENDGRID_API_KEY` (начинается с `SG.`)
4. **Settings** → **Sender Authentication**
   - **Single Sender Verification** — добавь свой email
   - Подтверди письмом от SendGrid
5. Verified email → `SENDGRID_FROM_EMAIL`

**Документация:** [SendGrid API Keys](https://docs.sendgrid.com/ui/account-and-settings/api-keys)

⚠️ Без verified sender SendGrid не отправит письма.

---

## 7. Encryption — шифрование токенов amoCRM в БД

| Переменная | Тип | Локально |
|------------|-----|----------|
| `ENCRYPTION_KEY` | 🏠 ⬜ | 64 hex-символа (32 байта) |

**Нужно с:** фазы 5 (integrations). До этого можно пустым.

**Генерация:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Сторонний сервис:** нет. **Не теряй ключ** — иначе не расшифруешь сохранённые credentials.

---

## 8. amoCRM — интеграция CRM

| Переменная | Тип | Локально |
|------------|-----|----------|
| `AMOCRM_MOCK` | 🏠 | `true` — **рекомендуется для старта** |
| `AMOCRM_CLIENT_ID` | 🌐 ⬜ | Integration ID |
| `AMOCRM_CLIENT_SECRET` | 🌐 ⬜ | Integration Secret |
| `AMOCRM_REDIRECT_URI` | 🏠 ⚠️ | `http://localhost:3000/api/integrations/amocrm/oauth/callback` |

**Когда `AMOCRM_MOCK=true`:** реальные ключи не нужны, API отдаёт фейковые лиды.

**Когда `AMOCRM_MOCK=false`:** нужен тестовый аккаунт amoCRM.

### Пошаговая инструкция — amoCRM

1. Регистрация / вход: [amoCRM](https://www.amocrm.ru/) или [Kommo](https://www.kommo.com/) (международная версия)
2. Создай **тестовый аккаунт** (trial) — API доступен на платных/trial планах
3. В аккаунте: **⋮** (меню) → **amoМаркет** / **Settings** → **Создать интеграцию**
   - Или: [документация — создание интеграции](https://www.amocrm.ru/developers/content/oauth/step-by-step)
4. Заполни форму:
   - Название: `CRMForge Local`
   - Redirect URI: `http://localhost:3000/api/integrations/amocrm/oauth/callback`
   - Ссылка для перенаправления — **точно как** `AMOCRM_REDIRECT_URI`
5. После создания скопируй:
   - **Integration ID** → `AMOCRM_CLIENT_ID`
   - **Secret key** → `AMOCRM_CLIENT_SECRET`
6. Запомни **subdomain** аккаунта: `https://ВАШ_SUBDOMAIN.amocrm.ru`

**Документация:**
- [OAuth пошагово](https://www.amocrm.ru/developers/content/oauth/step-by-step)
- [Платформа API](https://www.amocrm.ru/developers/content/crm_platform/platform-abilities)

⚠️ Redirect URI в amoCRM и в `.env` — **байт в байт**.  
⚠️ amoCRM refresh token **ротируется** при каждом refresh — это логика backend, не env.

---

## 9. Observability — логи (Loki / Grafana)

| Переменная | Тип | Локально |
|------------|-----|----------|
| `LOKI_URL` | 🏠 ⬜ | `http://localhost:3100` |
| `LOKI_ENABLED` | 🏠 | `false` — **рекомендуется для старта** |

**Когда `LOKI_ENABLED=false`:** логи только в терминал (Pino → stdout).

**Когда `LOKI_ENABLED=true`:**

```bash
npm run docker:full   # поднимает Loki + Grafana
```

Grafana: http://localhost:3001 (логин `admin` / `admin` из docker-compose)

**Сторонний сервис:** нет — всё локально в Docker.

---

## Сводная таблица — что заполнять когда

| Этап | Обязательно заполнить | Можно оставить пустым / mock |
|------|----------------------|------------------------------|
| Фаза 0 (сейчас) | `DATABASE_URL` | Всё остальное по defaults |
| Фаза 1 | то же | — |
| Фаза 2 (auth) | `JWT_*_SECRET` (свои!) | Google — если не тестируешь OAuth |
| Фаза 2 (email) | — | `MAIL_MOCK=true`, SendGrid пустой |
| Фаза 5 (amoCRM) | `ENCRYPTION_KEY` | `AMOCRM_MOCK=true` |
| Полный тест | Google + SendGrid + amoCRM ключи | — |

---

## Чеклист перед стартом

```
[ ] cp .env.example .env
[ ] npm run docker:infra
[ ] DATABASE_URL совпадает с docker-compose (crmforge/crmforge)
[ ] JWT секреты — свои, не из example
[ ] MAIL_MOCK=true (пока без SendGrid)
[ ] AMOCRM_MOCK=true (пока без amoCRM)
[ ] LOKI_ENABLED=false (пока без Grafana)
[ ] PORT=3000 свободен
[ ] .env в .gitignore (не коммитить!)
```

---

## Мой локальный `.env` (черновик)

> Заполни здесь свои значения. Потом перенесёшь в `.env`.  
> **Этот блок можно редактировать** — секреты в git не попадут, если не коммитишь заполненный файл (лучше заполнять только локальный `.env`).

```env
# === Сгенерировал сам ===
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
ENCRYPTION_KEY=

# === Google OAuth ===
# https://console.cloud.google.com/
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# === SendGrid ===
# https://app.sendgrid.com/
SENDGRID_API_KEY=
SENDGRID_FROM_EMAIL=

# === amoCRM ===
# https://www.amocrm.ru/ → amoМаркет → создать интеграцию
AMOCRM_CLIENT_ID=
AMOCRM_CLIENT_SECRET=
# Subdomain аккаунта (для справки, не env): ____________.amocrm.ru
```

### Заметки

```
Google redirect настроен:  [ ] да  [ ] нет
SendGrid sender verified:  [ ] да  [ ] нет
amoCRM integration создана: [ ] да  [ ] нет
```

---

## Связанные файлы

| Файл | Назначение |
|------|------------|
| `.env.example` | Шаблон для `cp .env.example .env` |
| `.env` | Твой локальный файл (gitignore) |
| `docker-compose.yml` | USER/PASSWORD/DB для `DATABASE_URL` |
| `docs/local-development.md` | Как поднимать docker и скрипты |
