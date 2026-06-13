# CRMForge — Agent Context

> **Читай этот файл в начале любой задачи по проекту.**  
> Обновляй его после изменений фаз, API, схемы БД или известных решений.

## Что это за проект

**CRMForge** — portfolio-grade CRM-интегратор: веб-приложение для подключения внешних CRM (первая — **amoCRM**), просмотра и синхронизации сделок.

Цель: выглядеть как production-проект — современный UI, чистая backend-архитектура, без over-engineering.

## Текущий статус

| Область | Статус |
|---------|--------|
| NestJS scaffold | ✅ Есть (`src/`, default boilerplate) |
| Prisma / Postgres | ✅ schema; migrate: `npx prisma migrate dev` (нужен Docker) |
| Config + Joi env | ✅ |
| Health `/api/health` + `/ready` | ✅ |
| Swagger `/api/docs` | ✅ |
| Auth (JWT, Google*, email verify) | ✅ фаза 2 |
| Mail (SendGrid + MAIL_MOCK) | ✅ |
| Users module | ✅ фаза 3 |
| Pino logging (+ Loki transport) | ✅ фаза 2b |
| Redis cache + JWT blacklist | ✅ фаза 4 |
| Integrations (amoCRM mock/OAuth) | ✅ фаза 5 |
| Deals CRUD | ✅ фаза 6 |
| Sync (BullMQ) | ✅ фаза 7 |
| E2E + README polish | ✅ фаза 8 |
| React frontend | ⬜ Не начато |
| Docker Compose | ✅ postgres, redis, api, loki, grafana |
| Grafana + Loki | ✅ datasource; `LOKI_ENABLED=true` для shipping |

**Текущая фаза:** backend **0–8 завершены** → следующая **фаза T** (scrap-ui).

## Зафиксированный стек

### Backend
- **Runtime:** Node.js (LTS)
- **Framework:** NestJS 11
- **ORM:** Prisma 6 — schema в `prisma/schema.prisma`, `PrismaService` глобальный модуль
- **DB:** PostgreSQL (единственная БД; MongoDB не используем)
- **Cache:** Redis (`cache-manager` + `ioredis`)
- **Language:** TypeScript strict — максимальная типизация
- **Validation:** Joi (кастомный `JoiValidationPipe`, не class-validator)
- **Auth:** JWT (access + refresh) + Passport
- **Social login:** Google OAuth 2.0 (`passport-google-oauth20`)
- **Passwords:** bcrypt (rounds=12) для email/password
- **Email:** SendGrid — подтверждение почты, уведомления
- **Refresh token:** httpOnly cookie (`cookie-parser`, SameSite=Lax)
- **Access token:** `Authorization: Bearer` header
- **API docs:** Swagger (`@nestjs/swagger`) — OpenAPI контракт
- **Config:** `@nestjs/config` + Joi-схема env
- **Logging:** Pino (`nestjs-pino`) — structured JSON
- **Observability:** Loki + Grafana — визуализация логов Pino
- **Rate limit:** `@nestjs/throttler` на auth и sync routes
- **Queue:** BullMQ (`@nestjs/bullmq`) — фоновая синхронизация amoCRM
- **Tests:** Jest — E2E (auth, sync) + unit (services)

### Frontend (после backend)
- **Build:** Vite 6 + React 19 + TypeScript
- **UI:** Tailwind CSS + shadcn/ui
- **i18n:** react-i18next (RU + EN), **default: RU**
- **Server state:** TanStack Query
- **Routing:** React Router
- **Forms:** React Hook Form
- **Client state:** Zustand (минимально)
- **Auth client:** access token в memory/localStorage; refresh — httpOnly cookie (withCredentials)

### External
- **CRM:** amoCRM REST API (OAuth 2.0; mock mode для разработки)

## Структура репозитория (целевая)

```
crmforge/
├── docs/                    # документация (этот каталог)
├── prisma/
│   └── schema.prisma
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── auth/
│   ├── users/
│   ├── mail/                # SendGrid
│   ├── integrations/
│   │   └── amocrm/
│   ├── deals/
│   ├── sync/
│   └── common/
│       ├── pipes/           # JoiValidationPipe
│       ├── filters/
│       ├── guards/
│       └── decorators/
├── apps/web/                # React (создаётся на фазе frontend)
├── docker-compose.yml
├── .env.example
└── package.json
```

> **Решение:** Flat structure — Nest в корне, `apps/web` на фазе frontend.

## Архитектурные инварианты

1. **Слои:** `Controller → Service → Prisma / External Client`. Без бизнес-логики в контроллерах.
2. **Валидация:** только Joi-схемы в `*.schema.ts`, pipe на уровне route/handler.
3. **Секреты:** только через env; `.env` в gitignore; `.env.example` актуален.
4. **CRM-токены:** шифровать at rest (или хранить в Redis с TTL — решение в backend-plan).
5. **Синхронизация:** идемпотентная; статус sync хранить в БД.
6. **Кэш amoCRM:** Redis, TTL 5–15 мин, инвалидация при webhook/manual sync.
7. **Email/password:** верификация через SendGrid обязательна перед login; Google OAuth — verified сразу.
8. **Логи:** Pino JSON → Loki → Grafana; не логировать пароли и токены.
9. **Не добавлять без запроса:** microservices, GraphQL, MongoDB, Kubernetes.

## Карта документов

| Файл | Назначение |
|------|------------|
| `START-HERE.md` | Индекс документации (точка входа в docs/) |
| `tech-stack.md` | Финальный стек backend + frontend |
| `agent-context.md` | Контекст для AI-агента (этот файл) |
| `backend-plan.md` | Пошаговый план backend |
| `frontend-plan.md` | Пошаговый план frontend |
| `route-map.md` | REST API routes |
| `stack-review.md` | Обзор технологий — согласие/альтернативы |
| `env.md` | Гайд по `.env` — сторонние ключи, пошаговые инструкции |

## Очередь работ (кратко)

### Backend (сейчас)
1. Инфра: docker-compose, Prisma, env
2. Common: Joi pipe, exception filter, Swagger
3. Auth: register, login, refresh, guards
4. Users: profile
5. Integrations: amoCRM OAuth connect/disconnect/status
6. Deals: CRUD + list из локальной БД
7. Sync: manual sync + статусы
8. E2E smoke tests

### Frontend (потом)
1. Vite + shadcn scaffold
2. Auth pages + API client + i18n setup
3. Dashboard
4. Deals table
5. Integrations page
6. Polish + deploy

## Команды разработки

```bash
# Backend (из корня crmforge)
npm run start:dev
npx prisma migrate dev
npx prisma studio

# Docker
docker compose up -d              # full stack
npm run docker:infra              # postgres + redis only
npm run docker:full               # + loki + grafana
npm run docker:down

# Apps (infra must be running)
npm run dev                       # API + Web
npm run start:dev                 # API only
```

## Известные ограничения amoCRM

- OAuth 2.0 Authorization Code Flow; URL зависит от subdomain аккаунта (`{subdomain}.amocrm.ru`).
- Refresh token ротируется при каждом refresh — всегда сохранять новый.
- Для разработки: mock client + тестовый аккаунт amoCRM (интеграция в amoMarket).

## Как обновлять этот файл

После завершения фазы:
- обновить таблицу «Текущий статус»;
- зафиксировать принятые решения из `open-questions.md`;
- добавить в «Известные баги / TODO» если появились.
