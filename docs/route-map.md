# CRMForge — Route Map

> Base URL: `http://localhost:3000/api` (prefix `/api` настраивается в `main.ts`)  
> Auth: `Authorization: Bearer <access_token>` unless marked **Public**

## Legend

| Symbol | Meaning |
|--------|---------|
| 🔓 | Public |
| 🔒 | JWT required |
| ✅ | Planned |
| 🚧 | In progress |
| ✔️ | Done |

---

## Health

| Method | Path | Auth | Status | Description |
|--------|------|------|--------|-------------|
| GET | `/health` | 🔓 | ✅ | Liveness: `{ status: "ok" }` |
| GET | `/health/ready` | 🔓 | ✅ | Readiness: DB + Redis ping |

---

## Auth (`/auth`)

| Method | Path | Auth | Status | Body / Response |
|--------|------|------|--------|-----------------|
| POST | `/auth/register` | 🔓 | ✅ | `{ email, password, name? }` → `{ message: "check email" }` |
| POST | `/auth/login` | 🔓 | ✅ | `{ email, password }` → tokens + user (requires verified email) |
| GET | `/auth/google` | 🔓 | ✅ | Redirect to Google OAuth |
| GET | `/auth/google/callback` | 🔓 | ✅ | OAuth callback → JWT + refresh cookie |
| GET | `/auth/verify-email` | 🔓 | ✅ | `?token=` → подтверждение почты |
| POST | `/auth/resend-verification` | 🔓 | ✅ | `{ email }` → повторная отправка SendGrid |
| POST | `/auth/refresh` | 🔓 | ✅ | refresh cookie → new access token |
| POST | `/auth/logout` | 🔒 | ✅ | Invalidate refresh token |
| GET | `/auth/me` | 🔒 | ✅ | Current user profile |

---

## Users (`/users`)

| Method | Path | Auth | Status | Description |
|--------|------|------|--------|-------------|
| GET | `/users/me` | 🔒 | ✅ | Alias profile (или только `/auth/me`) |
| PATCH | `/users/me` | 🔒 | ✅ | `{ name?, email? }` update profile |
| PATCH | `/users/me/password` | 🔒 | ✅ | `{ currentPassword, newPassword }` |

---

## Integrations (`/integrations`)

| Method | Path | Auth | Status | Description |
|--------|------|------|--------|-------------|
| GET | `/integrations` | 🔒 | ✅ | List user's integrations |
| GET | `/integrations/:provider` | 🔒 | ✅ | Status for provider (`amocrm`) |
| GET | `/integrations/amocrm/oauth/url` | 🔒 | ✅ | OAuth authorize URL для redirect |
| GET | `/integrations/amocrm/oauth/callback` | 🔓 | ✅ | OAuth callback (code → tokens) |
| POST | `/integrations/amocrm/connect` | 🔒 | ✅ | `{ subdomain, clientId, clientSecret }` или завершение OAuth |
| DELETE | `/integrations/amocrm` | 🔒 | ✅ | Disconnect |
| POST | `/integrations/amocrm/test` | 🔒 | ✅ | Test connection to amoCRM |

### amoCRM Webhook (incoming)

| Method | Path | Auth | Status | Description |
|--------|------|------|--------|-------------|
| POST | `/webhooks/amocrm/:integrationId` | 🔓* | ✅ | Incoming events (*verify signature) |

---

## Deals (`/deals`)

| Method | Path | Auth | Status | Query / Body |
|--------|------|------|--------|--------------|
| GET | `/deals` | 🔒 | ✅ | `?page&limit&status&search&sort` |
| GET | `/deals/:id` | 🔒 | ✅ | Deal detail + sync metadata |
| POST | `/deals` | 🔒 | ✅ | Create local deal (optional для MVP) |
| PATCH | `/deals/:id` | 🔒 | ✅ | Update local fields |
| DELETE | `/deals/:id` | 🔒 | ✅ | Soft delete |

---

## Sync (`/sync`)

| Method | Path | Auth | Status | Description |
|--------|------|------|--------|-------------|
| POST | `/sync/amocrm/leads` | 🔒 | ✅ | Trigger full/incremental leads/deals sync |
| GET | `/sync/jobs` | 🔒 | ✅ | List sync jobs for user |
| GET | `/sync/jobs/:id` | 🔒 | ✅ | Job status `{ status, progress, error? }` |

---

## API Documentation

| Method | Path | Auth | Status |
|--------|------|------|--------|
| GET | `/docs` | 🔓 | ✅ | Swagger UI |
| GET | `/docs-json` | 🔓 | ✅ | OpenAPI JSON |

---

## Response conventions

### Success

```json
{
  "data": { },
  "meta": { "page": 1, "limit": 20, "total": 100 }
}
```

### Error

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [{ "field": "email", "message": "..." }]
}
```

### HTTP codes

| Code | Usage |
|------|-------|
| 200 | OK |
| 201 | Created |
| 204 | No content (delete) |
| 400 | Joi validation / bad request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not found |
| 409 | Conflict (duplicate email) |
| 429 | Rate limit |
| 500 | Internal error |

---

## Frontend routes (preview)

> Детали в `frontend-plan.md`

| Path | Page |
|------|------|
| `/login` | Login (email + Google) |
| `/register` | Register |
| `/verify-email` | Email verification (token from link) |
| `/check-email` | «Проверьте почту» после register |
| `/` | Dashboard |
| `/deals` | Deals list |
| `/deals/:id` | Deal detail |
| `/integrations` | Integrations hub |
| `/integrations/amocrm` | amoCRM OAuth setup |
| `/settings` | Profile settings |
