# Открытые вопросы — CRMForge

> Ответы пользователя фиксируются здесь и переносятся в `agent-context.md`.

## Статус

| # | Вопрос | Варианты | Решение |
|---|--------|----------|---------|
| 1 | Структура репо | A) Flat B) Monorepo | ✅ **Flat** — Nest в корне, `apps/web` позже |
| 2 | Первая CRM-интеграция | A) amoCRM B) Bitrix24 C) Mock | ✅ **amoCRM** (+ mock client за feature flag) |
| 3 | Регистрация пользователей | A) Open register B) Admin C) Invite | ✅ **Open register** |
| 4 | Хранение CRM tokens | A) Postgres encrypted B) Redis + Postgres | ✅ **Postgres encrypted** (AES-256-GCM) |
| 5 | Очередь синхронизации | A) BullMQ B) RabbitMQ C) Sync в request (MVP) | ✅ **BullMQ** (`@nestjs/bullmq`, Redis) |
| 6 | Деплой для демо | A) Railway B) Render C) Локально | ✅ **Локально**, деплой потом |
| 7 | Язык UI | A) RU B) EN C) i18n | ✅ **i18n** (RU + EN) |
| 8 | Refresh token | A) httpOnly cookie B) body JSON | ✅ **httpOnly cookie** |
| 9 | Логирование | A) Pino B) Nest Logger | ✅ **Pino** (`nestjs-pino`) |
| 10 | Rate limiting | A) Throttler B) Нет | ✅ **@nestjs/throttler** |
| 11 | Тесты | A) E2E+unit B) E2E only C) minimal | ✅ **E2E ключевые flows + unit services** |
| 12 | React | A) 19 B) 18 | ✅ **React 19 + Vite 6** |
| 13 | ORM | A) Prisma B) TypeORM C) Drizzle | ✅ **Prisma 6** |
| 14 | API docs | Swagger | ✅ **Swagger** (`@nestjs/swagger`) |
| 15 | Язык | TypeScript strict | ✅ **TypeScript** — максимальная типизация |
| 16 | Social login | Google OAuth | ✅ **Google OAuth 2.0** (`passport-google-oauth20`) |
| 17 | Password hash | bcrypt | ✅ **bcrypt** (rounds=12) |
| 18 | Email | SendGrid + verification | ✅ **SendGrid** — подтверждение почты и уведомления |
| 19 | Observability | Pino + Grafana | ✅ **Pino** → **Loki** → **Grafana** |
| 20 | Env | `.env` + `.env.example` | ✅ Все секреты и конфиг через env |
| 21 | Docker | Compose full + infra split | ✅ **Compose full**; daily dev: **postgres+redis отдельно**, apps через `npm run dev` |
| 22 | Mail dev mode | MAIL_MOCK | ✅ **MAIL_MOCK=true** по умолчанию — письма в консоль без SendGrid |
| 23 | i18n default locale | RU / EN | ✅ **RU**; смена на Register + Settings |
| 24 | UI themes | light / dark | ✅ **Две темы**; палитра/дизайн — позже |
| 25 | Тест UI | scrap / swagger | ✅ **Scrap UI** после backend, до красивого фронта |

## Детали по вопросам

### 1. Структура репозитория

- **Flat** — Nest остаётся в корне, меньше миграции сейчас.
- **Monorepo** — чище для портфолио, npm workspaces, единый CI.

**Рекомендация агента:** Flat на старте (`src/` в корне + `apps/web` позже) — быстрее к первому working API.

### 2. amoCRM + Mock

- **Mock** — разработка без реального аккаунта amoCRM.
- **amoCRM OAuth** — production flow через amoMarket integration.

**Решение:** Mock client + реальный amoCRM OAuth adapter за `AMOCRM_MOCK` flag.

### 3. Auth model

**Open register** + два способа входа:
- Email/password (bcrypt) + **обязательная верификация** через SendGrid
- Google OAuth (email сразу verified)

### 4. Token storage

amoCRM OAuth tokens — хранить encrypted в Postgres (`integration.credentials` JSONB). Refresh token ротируется при каждом refresh.

### 5. BullMQ

**Решение:** BullMQ для фоновой синхронизации amoCRM. Подключаем в **фазе 7** (модуль sync), не в день 0 — но технология зафиксирована.

### 6. Deploy

**Railway** — простой monolith + Postgres + Redis в одном месте для демо-ссылки в резюме.

### 8. ORM — Prisma

**Решение:** Prisma как единственный ORM. TypeORM и Drizzle не используем.

| | Prisma | TypeORM | Drizzle |
|---|--------|---------|---------|
| DX | Отличный — schema, migrate, studio | Декораторы, больше boilerplate | SQL-like, легче, меньше magic |
| Nest | `PrismaService` — простой паттерн | Официальный `@nestjs/typeorm` | Ручная интеграция |
| Миграции | `prisma migrate` | typeorm migrations | drizzle-kit |
| Portfolio | Очень узнаваемо, современно | Классика, но тяжелее | Растёт, но менее mainstream |

Для CRMForge (Postgres, relations, JSONB для amoCRM payload) — Prisma оптимален.

### 9. Auth — Google + Email

**Два способа входа:**
1. **Email + password** (bcrypt) → обязательное **подтверждение почты** через SendGrid
2. **Google OAuth** → email считается verified, JWT сразу

Оба выдают одну пару JWT (access + refresh cookie).

### 10. Email — SendGrid

- Верификация при register (ссылка с token)
- Resend verification
- Уведомления (sync complete, integration error) — фаза 2

`SENDGRID_API_KEY`, `SENDGRID_FROM_EMAIL` в env.

### 11. Observability — Pino + Loki + Grafana

```
Nest (Pino JSON) → Loki (хранение) → Grafana (дашборды)
```

- Pino — structured logs в приложении
- Loki — агрегация логов (docker-compose)
- Grafana — визуализация, фильтры по level/requestId/userId
- Опционально: `pino-loki` transport в dev

Grafana UI: `http://localhost:3001`, Loki: `:3100`

### 12. Local dev workflow

```
Ежедневно:  npm run docker:infra  →  postgres + redis
            npm run dev            →  nest + vite (scripts/dev.sh)

Полный стек: npm run docker:full  →  + loki + grafana
```

Детали: `docs/local-development.md`

## Ответы пользователя (сводка)

- **CRM:** amoCRM (не Bitrix24)
- **Auth:** Open register
- **UI:** i18n RU + EN
- **Deploy:** локально на старте
- **Очередь:** **BullMQ**
- **Refresh token:** httpOnly cookie
- **Logging:** Pino
- **Rate limit:** Throttler
- **Tests:** E2E + unit
- **ORM:** **Prisma 6**
- **API docs:** Swagger
- **TypeScript:** strict typing end-to-end
- **Google OAuth:** да
- **bcrypt:** да
- **SendGrid:** email verification + notifications
- **Observability:** Pino + Loki + Grafana
- **i18n default:** **RU**; переключатель на Register + Settings
- **Themes:** light + dark (дизайн позже)
- **Test UI:** scrap-ui без стилей → потом frontend-plan
