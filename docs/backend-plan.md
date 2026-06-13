# CRMForge — Backend Plan

> **Главный roadmap backend — этот файл.**  
> **Порядок:** фазы 0→8 (backend) → фаза T ([scrap-ui-plan.md](./scrap-ui-plan.md)) → [frontend-plan.md](./frontend-plan.md).  
> **Коммиты:** одна фаза = один коммит (см. таблицу ниже).

---

## Roadmap — фазы и коммиты

| Фаза | Статус | Пример коммита | Что входит |
|------|--------|----------------|------------|
| **0** | ✅ | `feat(backend): phase 0 — infra, config, bootstrap` | env, Config+Joi, Prisma init, main.ts, Swagger stub |
| **1** | ✅ | `feat(backend): phase 1 — prisma schema, common, health` | schema, migrate, PrismaService, Joi pipe, health/ready |
| **2** | ✅ | `feat(backend): phase 2 — auth jwt google email` | auth, mail/SendGrid, bcrypt, refresh cookie |
| **3** | ✅ | `feat(backend): phase 3 — users module` | profile, change password |
| **2b** | ✅ | `feat(backend): phase 2b — pino loki logging` | nestjs-pino, optional pino-loki |
| **4** | ✅ | `feat(backend): phase 4 — redis cache` | cache-manager, ioredis |
| **5** | ✅ | `feat(backend): phase 5 — amocrm integrations` | mock client, OAuth, encryption |
| **6** | ✅ | `feat(backend): phase 6 — deals crud` | list, filters, pagination |
| **7** | ✅ | `feat(backend): phase 7 — sync bullmq` | BullMQ jobs, sync status |
| **8** | ✅ | `feat(backend): phase 8 — e2e tests and polish` | e2e, swagger tags, README |
| **T** | ⬜ | `feat(scrap-ui): minimal test forms` | см. [scrap-ui-plan.md](./scrap-ui-plan.md) |

**Тестирование без дизайна:** фаза **T** (scrap-ui), не Swagger alone.  
**Красивый фронт:** после T → `frontend-plan.md`.

---

## Цели backend

1. REST API для auth, users, integrations (**amoCRM**), deals, sync
2. PostgreSQL как source of truth для пользователей и сделок
3. Redis для кэша CRM-ответов и refresh-token blacklist
4. Joi-валидация на всех входах
5. Swagger-документация из коробки
6. Docker Compose для локального старта одной командой

---

## Библиотеки и зависимости

### Production dependencies

| Package | Версия (ориентир) | Назначение |
|---------|-------------------|------------|
| `@nestjs/common`, `core`, `platform-express` | ^11 | Framework |
| `@nestjs/config` | ^4 | Env configuration |
| `@nestjs/jwt` | ^11 | JWT tokens |
| `@nestjs/passport` | ^11 | Auth strategies |
| `passport`, `passport-jwt`, `passport-google-oauth20` | latest | JWT + Google strategies |
| `@sendgrid/mail` | ^8 | Email (verification, notifications) |
| `nestjs-pino`, `pino-http` | latest | Structured logging |
| `pino-loki` | latest | Pino → Loki transport (dev/docker) |
| `@nestjs/throttler` | ^6 | Rate limiting |
| `@nestjs/bullmq`, `bullmq` | latest | Job queue для sync |
| `@nestjs/swagger` | ^11 | OpenAPI |
| `@prisma/client` | ^6 | DB client |
| `joi` | ^17 | Request/env validation |
| `bcrypt` | ^5 | Password hashing |
| `cache-manager` | ^6 | Cache abstraction |
| `@nestjs/cache-manager` | ^3 | Nest cache module |
| `ioredis` | ^5 | Redis client |
| `cache-manager-ioredis-yet` | ^2 | Redis store for cache-manager |
| `axios` | ^1 | HTTP client для amoCRM API |
| `helmet` | ^8 | Security headers |
| `compression` | ^1 | Response compression |
| `cookie-parser` | ^1 | Refresh token cookie (optional) |

### Dev dependencies

| Package | Назначение |
|---------|------------|
| `prisma` | Migrations, studio |
| `@types/bcrypt`, `@types/passport-jwt`, `@types/passport-google-oauth20` | Types |
| `dotenv` | Local env (если нужен вне Nest) |

### Фаза 2 (очередь)

_Перенесено в production dependencies: BullMQ, Throttler_

### Явно НЕ используем

- `class-validator` / `class-transformer` — заменяем на Joi
- TypeORM — используем Prisma
- MongoDB driver

---

## Фаза 0 — Инфраструктура и конфиг

### 0.1 Docker Compose

```yaml
services:
  postgres:
    image: postgres:16-alpine
    ports: ["5432:5432"]
    environment:
      POSTGRES_USER: crmforge
      POSTGRES_PASSWORD: crmforge
      POSTGRES_DB: crmforge
    volumes: [postgres_data:/var/lib/postgresql/data]

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

  loki:
    image: grafana/loki:3.0.0
    ports: ["3100:3100"]
    command: -config.file=/etc/loki/local-config.yaml

  grafana:
    image: grafana/grafana:11.0.0
    ports: ["3001:3000"]
    environment:
      GF_SECURITY_ADMIN_PASSWORD: admin
    depends_on: [loki]
```

### 0.2 Environment variables

`.env.example`:

```env
NODE_ENV=development
PORT=3000
API_PREFIX=api

DATABASE_URL=postgresql://crmforge:crmforge@localhost:5432/crmforge

REDIS_HOST=localhost
REDIS_PORT=6379

JWT_ACCESS_SECRET=change-me-access
JWT_REFRESH_SECRET=change-me-refresh
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

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

AMOCRM_MOCK=true            # true = mock client, false = real API
AMOCRM_CLIENT_ID=
AMOCRM_CLIENT_SECRET=
AMOCRM_REDIRECT_URI=http://localhost:3000/api/integrations/amocrm/oauth/callback
ENCRYPTION_KEY=32-byte-hex  # для credentials at rest
```

### 0.3 Config module

- `ConfigModule.forRoot({ isGlobal: true })`
- Joi-схема валидации env при старте (`config/env.schema.ts`)
- При невалидном env — приложение не стартует

### 0.4 Prisma init

```bash
npx prisma init
```

### 0.5 Global app setup (`main.ts`)

- Global prefix `/api`
- `ValidationPipe` — **не** Nest default; только наш `JoiValidationPipe` per-route
- `HttpExceptionFilter` — единый формат ошибок
- Swagger: `/api/docs`
- `helmet()`, `compression()`, CORS для frontend origin
- `enableShutdownHooks()` для Prisma

**Критерий готовности:** `docker compose up` + `npm run start:dev` + `GET /api/health` → 200

---

## Фаза 1 — Prisma schema и common layer

### 1.1 Database schema

```prisma
model User {
  id                       String    @id @default(cuid())
  email                    String    @unique
  passwordHash             String?   // null для Google-only
  name                     String?
  authProvider             String    @default("local") // "local" | "google"
  googleId                 String?   @unique
  emailVerified            Boolean   @default(false)
  emailVerificationToken   String?
  emailVerificationExpires DateTime?
  createdAt                DateTime  @default(now())
  updatedAt                DateTime  @updatedAt

  integrations  Integration[]
  deals         Deal[]
  refreshTokens RefreshToken[]
  syncJobs      SyncJob[]
}

model RefreshToken {
  id        String   @id @default(cuid())
  tokenHash String   @unique
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt DateTime
  createdAt DateTime @default(now())
}

model Integration {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  provider    String   // "amocrm"
  status      String   // "connected" | "disconnected" | "error"
  credentials Json     // encrypted: access/refresh tokens, subdomain
  metadata    Json?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([userId, provider])
}

model Deal {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  externalId      String?  // ID в amoCRM (lead/deal)
  title           String
  amount          Decimal? @db.Decimal(12, 2)
  currency        String?  @default("RUB")
  status          String   // "new" | "in_progress" | "won" | "lost"
  stage           String?
  contactName     String?
  syncedAt        DateTime?
  rawPayload      Json?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  deletedAt       DateTime?

  @@unique([userId, externalId])
  @@index([userId, status])
}

model SyncJob {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  provider    String
  type        String   // "deals_full" | "deals_incremental"
  status      String   // "pending" | "running" | "completed" | "failed"
  progress    Int      @default(0)
  total       Int?
  error       String?
  startedAt   DateTime?
  completedAt DateTime?
  createdAt   DateTime @default(now())
}
```

### 1.2 PrismaService

- `src/prisma/prisma.service.ts` — extends `PrismaClient`, `OnModuleInit` connect, `OnModuleDestroy` disconnect
- Global module `PrismaModule`

### 1.3 Common module

```
src/common/
├── pipes/
│   └── joi-validation.pipe.ts
├── filters/
│   └── http-exception.filter.ts
├── guards/
│   └── jwt-auth.guard.ts
├── decorators/
│   ├── current-user.decorator.ts
│   └── public.decorator.ts
└── interfaces/
    └── paginated.interface.ts
```

### 1.4 JoiValidationPipe

```typescript
@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private readonly schema: ObjectSchema) {}

  transform(value: unknown) {
    const { error, value: validated } = this.schema.validate(value, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: error.details.map((d) => ({
          field: d.path.join('.'),
          message: d.message,
        })),
      });
    }
    return validated;
  }
}
```

### 1.5 Health module

- `GET /api/health` — always ok
- `GET /api/health/ready` — `$queryRaw` Postgres + Redis PING

**Критерий готовности:** миграции применены, health/ready зелёные

---

## Фаза 2 — Authentication (JWT + Google + Email verification)

### 2.1 Стратегия токенов

| Token | TTL | Хранение клиентом |
|-------|-----|-------------------|
| Access | 15 min | Memory / sessionStorage |
| Refresh | 7 days | httpOnly cookie |

### 2.2 Auth module structure

```
src/auth/
├── auth.module.ts
├── auth.controller.ts
├── auth.service.ts
├── strategies/
│   ├── jwt.strategy.ts
│   └── google.strategy.ts
└── schemas/
    ├── register.schema.ts
    ├── login.schema.ts
    └── resend-verification.schema.ts

src/mail/
├── mail.module.ts
├── mail.service.ts          # SendGrid wrapper
└── templates/
    ├── verify-email.hbs     # или inline HTML
    └── notification.hbs
```

### 2.3 Auth flows

**Email register:**
1. Validate Joi → bcrypt hash password
2. Create user (`emailVerified: false`, verification token + expiry 24h)
3. SendGrid → verification link `{APP_URL}/verify-email?token=...`
4. **Не выдавать JWT** до подтверждения

**Email login:**
1. Verify bcrypt password
2. Check `emailVerified === true` (иначе 403 + hint resend)
3. Issue JWT + refresh cookie

**Google OAuth:**
1. `GET /auth/google` → Passport redirect
2. Callback → find by `googleId` or create user (`emailVerified: true`)
3. Issue JWT + refresh cookie → redirect frontend `/auth/callback`

**Verify email:**
1. `GET /auth/verify-email?token=` → validate token + expiry
2. Set `emailVerified: true`, clear token

### 2.4 Swagger

- `@ApiTags('auth')` на контроллере
- `@ApiOperation`, `@ApiResponse` на каждый endpoint
- Схемы ответов типизированы (interfaces), валидация — Joi

### 2.5 TypeScript

- `strict: true` в tsconfig
- Типы для JWT payload, UserDto, AuthResponse
- Prisma-generated types для DB entities

### 2.6 Guards

- `JwtAuthGuard` — global, `@Public()` для open routes
- `EmailVerifiedGuard` — опционально на protected routes (или check в service)

### 2.7 Security

- bcrypt rounds=12
- Password never logged
- Refresh token hash в DB (SHA-256)
- Rate limit: login, register, resend-verification (`@Throttle`)
- Google OAuth state parameter (CSRF)

**Критерий готовности:** register → verify email → login; Google OAuth → JWT; e2e проходит

---

## Фаза 2b — Observability (Pino + Loki + Grafana)

### 2b.1 Pino setup

```typescript
LoggerModule.forRoot({
  pinoHttp: {
    transport: process.env.LOKI_URL
      ? { target: 'pino-loki', options: { host: process.env.LOKI_URL } }
      : undefined, // stdout в dev без Loki
    customProps: (req) => ({ requestId: req.id }),
  },
});
```

### 2b.2 Log fields

`level`, `requestId`, `method`, `url`, `statusCode`, `responseTime`, `userId`

### 2b.3 Grafana

- Datasource: Loki (`http://loki:3100`)
- Dashboard: error rate, request duration, auth failures
- UI: `http://localhost:3001` (admin/admin local)

**Критерий готовности:** запросы видны в Grafana Explore

---

## Фаза 3 — Users module

```
src/users/
├── users.module.ts
├── users.controller.ts
├── users.service.ts
└── schemas/
    ├── update-profile.schema.ts
    └── change-password.schema.ts
```

- `PATCH /users/me` — update name/email (email unique check)
- `PATCH /users/me/password` — verify current, hash new

**Критерий готовности:** profile update + password change работают

---

## Фаза 4 — Redis и caching

### 4.1 Cache module

```typescript
CacheModule.registerAsync({
  isGlobal: true,
  useFactory: () => ({
    store: redisStore,
    host: config.get('REDIS_HOST'),
    port: config.get('REDIS_PORT'),
    ttl: 300, // 5 min default
  }),
}),
```

### 4.2 Use cases

| Key pattern | TTL | Purpose |
|-------------|-----|---------|
| `amo:leads:{userId}:{page}` | 10 min | Cached leads from CRM |
| `amo:status:{userId}` | 5 min | Connection status |
| `auth:blacklist:{jti}` | access TTL | Revoked access tokens |

### 4.3 Cache invalidation

- On manual sync complete → delete `amo:leads:{userId}:*`
- On disconnect integration → clear all user CRM cache keys

**Критерий готовности:** cache hit/miss observable in logs; sync invalidates cache

---

## Фаза 5 — Integrations (amoCRM)

### 5.1 Architecture

```
src/integrations/
├── integrations.module.ts
├── integrations.controller.ts
├── integrations.service.ts
├── interfaces/
│   └── crm-provider.interface.ts
└── amocrm/
    ├── amocrm.module.ts
    ├── amocrm.service.ts
    ├── amocrm.client.ts        # HTTP / mock
    ├── amocrm.mock.ts
    ├── amocrm-oauth.service.ts # OAuth code exchange + refresh
    └── schemas/
        └── connect.schema.ts
```

### 5.2 CRM Provider interface

```typescript
interface CrmProvider {
  testConnection(credentials: unknown): Promise<boolean>;
  fetchLeads(params: FetchLeadsParams): Promise<ExternalLead[]>;
  refreshTokensIfNeeded(integration: Integration): Promise<TokenPair>;
}
```

### 5.3 Connect flow (OAuth 2.0)

1. `GET /integrations/amocrm/oauth/url` → redirect user to amoCRM authorize
2. Callback `GET /integrations/amocrm/oauth/callback?code=...` → exchange code for tokens
3. Store `{ subdomain, accessToken, refreshToken, expiresAt }` encrypted in `integration.credentials`
4. **Важно:** при refresh amoCRM выдаёт новый refresh_token — всегда перезаписывать

### 5.4 Encryption at rest

- `EncryptionService` — AES-256-GCM для credentials JSON
- Key из `ENCRYPTION_KEY` env

### 5.5 Mock mode

`AMOCRM_MOCK=true` → `AmoCrmMockClient` возвращает 20 фейковых лидов с realistic fields.

**Критерий готовности:** OAuth flow (или mock connect) → test → status endpoints работают

---

## Фаза 6 — Deals module

```
src/deals/
├── deals.module.ts
├── deals.controller.ts
├── deals.service.ts
└── schemas/
    ├── create-deal.schema.ts
    ├── update-deal.schema.ts
    └── list-deals.schema.ts
```

### 6.1 List deals

- Pagination: `page`, `limit` (max 100)
- Filters: `status`, `search` (title, contactName)
- Sort: `createdAt`, `amount`, `syncedAt`

### 6.2 Mapping external → local

`AmoCrmLeadMapper` — external payload → Prisma `Deal` fields.

### 6.3 Soft delete

`deletedAt` set, excluded from default queries.

**Критерий готовности:** CRUD + paginated list с фильтрами

---

## Фаза 7 — Sync module

```
src/sync/
├── sync.module.ts
├── sync.controller.ts
├── sync.service.ts
└── schemas/
    └── trigger-sync.schema.ts
```

### 7.1 Sync через BullMQ

1. `POST /sync/amocrm/leads` → create `SyncJob` + BullMQ job
2. `SyncProcessor` fetch leads from provider (paginated)
3. Upsert by `[userId, externalId]`
4. Update job `completed` / `failed`, progress in DB
5. Invalidate Redis cache
6. Retry with exponential backoff on failure

### 7.2 Idempotency

- Upsert, не blind insert
- `syncedAt` обновляется на каждый successful sync

**Критерий готовности:** trigger sync → deals появляются в БД → job status trackable

---

## Фаза 8 — Тесты, docs, polish

### 8.1 E2E tests (`test/`)

| Suite | Covers |
|-------|--------|
| `auth.e2e-spec.ts` | register, login, refresh |
| `deals.e2e-spec.ts` | list after sync |
| `health.e2e-spec.ts` | health endpoints |

### 8.2 Swagger

- `@ApiTags`, `@ApiBearerAuth` на protected routes
- DTO descriptions в schema decorators (для документации, не для validation)

### 8.3 Logging

- Nest `Logger` в services
- Log sync job start/complete/fail
- Не логировать credentials

### 8.4 README update

- Quick start с Docker
- Env table
- API link to Swagger

**Критерий готовности:** `npm run test:e2e` green, Swagger полный, README актуален

---

## Порядок реализации (чеклист)

```
[x] Фаза 0: Config, Prisma init, main.ts bootstrap, Swagger
[x] Фаза 1: Schema migrate, PrismaService, Joi pipe, health/ready
[x] Фаза 2: Auth (JWT + Google OAuth + SendGrid verification)
[x] Фаза 2b: Pino + optional Loki transport
[x] Фаза 3: Users module
[x] Фаза 4: Redis cache module
[x] Фаза 5: Integrations + amoCRM mock
[x] Фаза 6: Deals CRUD
[x] Фаза 7: Sync + BullMQ
[x] Фаза 8: E2E, Swagger polish, README
[ ] Фаза T: Scrap UI — формы без стилей (scrap-ui-plan.md)
[ ] Frontend F0–F8: Красивый UI (frontend-plan.md)
```

---

## Оценка времени

| Фаза | Оценка |
|------|--------|
| 0–1 | 2–3 ч |
| 2–3 | 3–4 ч |
| 4–5 | 3–4 ч |
| 6–7 | 4–5 ч |
| 8 | 2 ч |
| **Итого** | **~14–18 ч** |

---

## Backend complete → handoff

Когда фазы 0–8 закрыты:

1. Обновить `agent-context.md` (статус backend ✅)
2. **Фаза T:** [scrap-ui-plan.md](./scrap-ui-plan.md) — тест API формами без стилей
3. После smoke-test → [frontend-plan.md](./frontend-plan.md) — красивый UI
