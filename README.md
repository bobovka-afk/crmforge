# CRMForge

Portfolio-grade CRM-интегратор: подключение **amoCRM**, синхронизация лидов, современный dashboard.

## Структура репозитория

```
crmforge/
├── README.md          ← ты здесь (проект + команды)
├── docs/
│   └── START-HERE.md  ← документация, планы, стек
├── src/               ← NestJS backend
├── prisma/            ← схема БД и миграции
├── test/              ← unit + e2e тесты
└── apps/web/          ← React frontend (Vite + nginx in Docker)
```

> **Документация и планы:** [docs/START-HERE.md](./docs/START-HERE.md)

## Стек

| Backend | Frontend |
|---------|----------|
| NestJS · Prisma · PostgreSQL | React 19 · Vite 6 · TypeScript |
| Redis · BullMQ · Joi · JWT | shadcn/ui · TanStack Query · i18n |
| Google OAuth · bcrypt · SendGrid | — |
| Pino · Loki · Grafana · Swagger | — |

Подробнее: [docs/tech-stack.md](./docs/tech-stack.md)

## Быстрый старт (Docker)

```bash
cp .env.example .env   # JWT секреты — свои
npm run docker:up      # postgres + redis + api + web + loki + grafana
```

| URL | Сервис |
|-----|--------|
| http://localhost:5173 | **Frontend** (React) |
| http://localhost:3000/api/docs | Swagger API |
| http://localhost:3001 | Grafana (admin / admin) |
| http://localhost:3100 | Loki |

Подробнее: [docs/local-development.md](./docs/local-development.md) · переменные: [docs/env.md](./docs/env.md)

## Локальная разработка (без Docker для API)

```bash
npm run docker:infra   # только postgres + redis
npx prisma migrate dev
npm run start:dev
```

## Статус

- [x] Backend фазы 0–8 (auth, users, integrations, deals, sync)
- [x] Frontend F0–F8 — [frontend-plan.md](./docs/frontend-plan.md)

## Скрипты

| Команда | Описание |
|---------|----------|
| `npm run start:dev` | Backend в watch mode |
| `npm run build` | Production build |
| `npm run test` | Unit tests |
| `npm run test:e2e` | E2E tests (нужны postgres + redis) |
| `npm run docker:up` | Полный стек в Docker |
| `npm run lint` | ESLint |

## API

- Swagger: `/api/docs`
- Карта маршрутов: [docs/route-map.md](./docs/route-map.md)
