# CRMForge — Local Development

## Два режима работы

### Режим 1 — Ежедневная разработка (рекомендуется)

Инфра отдельно, приложения локально через npm:

```bash
# 1. Только Postgres + Redis
npm run docker:infra
# или: ./scripts/infra.sh

# 2. Env
cp .env.example .env

# 3. Backend + Frontend
npm run dev
# или: ./scripts/dev.sh
```

### Режим 2 — Полный стек в Docker (one command)

Postgres, Redis, API, **Web**, Loki, Grafana — всё в контейнерах:

```bash
cp .env.example .env
npm run docker:up
# или: ./scripts/docker-full.sh
```

| URL | Сервис |
|-----|--------|
| http://localhost:5173 | Frontend (nginx + React build) |
| http://localhost:3000/api/docs | Swagger |

Nginx во фронте проксирует `/api` → `api:3000`. Для hot reload используй **Режим 1**.

Опционально — логи в Loki: в `.env` задать `LOKI_ENABLED=true`, пересобрать api.

Открыть Grafana: http://localhost:3001 (admin / admin) → Explore → Loki.

---

## Скрипты

| Команда | Что делает |
|---------|------------|
| `npm run docker:infra` | Postgres + Redis |
| `npm run docker:up` | **Полный стек** (postgres, redis, api, web, loki, grafana) |
| `npm run docker:down` | Остановить все контейнеры |
| `npm run dev` | Nest API + Vite Web (watch mode) |
| `npm run start:dev` | Только Nest API |

---

## Порты

| Сервис | URL |
|--------|-----|
| API | http://localhost:3000/api |
| Swagger | http://localhost:3000/api/docs |
| Web | http://localhost:5173 |
| Postgres | localhost:5432 |
| Redis | localhost:6379 |
| Loki | http://localhost:3100 |
| Grafana | http://localhost:3001 |

---

## Env

Все переменные описаны в [`.env.example`](../.env.example).

Минимум для старта без внешних ключей:

```env
MAIL_MOCK=true
AMOCRM_MOCK=true
LOKI_ENABLED=false
```

SendGrid и Google OAuth — нужны только для теста реального auth flow.

---

## Типичный день

```bash
npm run docker:infra    # утром
npm run dev             # кодим
npm run docker:down     # вечером (опционально)
```
