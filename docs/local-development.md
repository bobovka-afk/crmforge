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

### Режим 2 — Полный стек (тестирование observability)

Всё в Docker, приложения всё равно локально:

```bash
npm run docker:full
# или: ./scripts/docker-full.sh

# В .env включить отправку логов в Loki:
# LOKI_ENABLED=true
# LOKI_URL=http://localhost:3100

npm run dev
```

Открыть Grafana: http://localhost:3001 (admin / admin) → Explore → Loki.

---

## Скрипты

| Команда | Что делает |
|---------|------------|
| `npm run docker:infra` | Postgres + Redis |
| `npm run docker:full` | Postgres + Redis + Loki + Grafana |
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
