# CRMForge — Tech Stack (финальный)

> Зафиксировано 2026-06-13. Изменения — через `open-questions.md`.

## Архитектура

```
┌─────────────┐     ┌─────────────────────────────────────────────────┐
│  React 19   │────▶│  NestJS 11 Monolith · TypeScript strict          │
│  Vite 6     │     │  Swagger · Joi · JWT · Google OAuth · bcrypt     │
│  shadcn/ui  │◀────│  Pino logs → Loki → Grafana                      │
└─────────────┘     └───┬──────────┬──────────┬────────────┬──────────┘
                        │          │          │            │
                ┌───────▼──┐ ┌─────▼────┐ ┌───▼───┐ ┌──────▼──────┐
                │PostgreSQL│ │  Redis   │ │SendGrid│ │  amoCRM API │
                │ (Prisma) │ │cache+jobs│ │ email  │ │ OAuth 2.0   │
                └──────────┘ └──────────┘ └────────┘ └─────────────┘
```

---

## Backend

| Категория | Технология | Зачем |
|-----------|------------|-------|
| Runtime | Node.js LTS | — |
| Framework | NestJS 11 | Модульная архитектура, DI, guards |
| Language | **TypeScript 5.7 strict** | Максимальная типизация backend + shared types |
| ORM | Prisma 6 | Миграции, типобезопасные запросы |
| Database | PostgreSQL 16 | Users, deals, integrations, sync jobs |
| Cache | Redis 7 + cache-manager | Кэш amoCRM ответов |
| Queue | BullMQ + @nestjs/bullmq | Фоновый sync лидов |
| Validation | Joi | Request + env validation |
| Auth | JWT + Passport | Access (15m) + Refresh (7d) |
| Social login | **Google OAuth 2.0** | `passport-google-oauth20` |
| Passwords | **bcrypt** (rounds=12) | Хеширование для email/password |
| Email | **SendGrid** | Подтверждение почты, уведомления |
| Refresh storage | httpOnly cookie | Защита от XSS |
| API docs | **Swagger** | OpenAPI, typed response schemas |
| Config | @nestjs/config | Env management |
| HTTP client | Axios | amoCRM REST calls |
| Security | helmet, CORS | Headers, policies |
| Rate limit | @nestjs/throttler | Brute-force / abuse protection |
| Logging | nestjs-pino | Structured JSON logs |
| Observability | **Loki + Grafana** | Визуализация и поиск логов |
| Encryption | AES-256-GCM | amoCRM tokens at rest |
| Testing | Jest + Supertest | E2E + unit |

### Auth способы входа

| Метод | Flow |
|-------|------|
| Email + password | Register → SendGrid verification link → Login |
| Google OAuth | Redirect → callback → JWT (email verified) |

### Не используем

class-validator · TypeORM · MongoDB · RabbitMQ · GraphQL · Microservices · Nodemailer (используем SendGrid)

---

## Frontend

| Категория | Технология | Зачем |
|-----------|------------|-------|
| UI library | React 19 | — |
| Build | Vite 6 | Fast HMR, modern bundling |
| Language | **TypeScript strict** | Типы API из Swagger / shared |
| Styling | Tailwind CSS 4 | Utility-first |
| Components | shadcn/ui | Modern SaaS look |
| Icons | lucide-react | — |
| Server state | TanStack Query 5 | Cache, mutations, polling sync |
| Routing | React Router 7 | SPA routes |
| Forms | React Hook Form | Login, register, settings |
| Client state | Zustand | Sidebar, theme, locale |
| i18n | react-i18next | RU + EN, **default RU** |
| Theme | next-themes | Dark / light |
| HTTP | Axios | Interceptors, withCredentials |
| Toasts | sonner | UX feedback |
| Social UI | Google Sign-In button | OAuth redirect |

### Не используем

Next.js · Redux · MUI / Ant Design

---

## Infrastructure (local)

| Service | Image | Port |
|---------|-------|------|
| PostgreSQL | postgres:16-alpine | 5432 |
| Redis | redis:7-alpine | 6379 |
| **Loki** | grafana/loki | 3100 |
| **Grafana** | grafana/grafana | 3001 |
| API | Nest (local) | 3000 |
| Web | Vite (local) | 5173 |

---

## Auth flows

### Email + password

```
1. POST /auth/register → user (emailVerified=false) + SendGrid email
2. GET  /auth/verify-email?token=... → emailVerified=true
3. POST /auth/login → JWT + refresh cookie (only if verified)
```

### Google OAuth

```
1. GET /auth/google → redirect to Google
2. GET /auth/google/callback → find/create user → JWT + refresh cookie
```

### JWT refresh

```
1. API calls: Authorization: Bearer <access>
2. On 401 → POST /auth/refresh (httpOnly cookie) → new access
3. Logout → clear cookie + invalidate refresh in DB
```

**CORS:** `credentials: true` на backend, `withCredentials: true` на axios.

---

## Observability flow

```
Request → Nest interceptor (requestId) → Pino JSON log
                                              ↓
                                    Loki (docker-compose)
                                              ↓
                              Grafana dashboards (errors, latency, auth)
```

Поля логов: `level`, `time`, `requestId`, `method`, `url`, `statusCode`, `userId`, `duration`.

---

## Модули backend

```
auth · users · mail · integrations/amocrm · deals · sync · health · prisma · common
```

---

## Docker services (compose)

```yaml
postgres + redis + loki + grafana
# api и web — локально через npm run dev
```

---

## Env (дополнительно)

```env
# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# SendGrid
SENDGRID_API_KEY=
SENDGRID_FROM_EMAIL=noreply@crmforge.local
APP_URL=http://localhost:5173

# Observability
LOKI_URL=http://localhost:3100
```
