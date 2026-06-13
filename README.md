# CRMForge

Portfolio-grade CRM-интегратор: подключение **amoCRM**, синхронизация лидов, современный dashboard.

## Структура репозитория

```
crmforge/
├── README.md          ← ты здесь (проект + команды)
├── docs/
│   └── START-HERE.md  ← документация, планы, стек
├── src/               ← NestJS backend
├── prisma/            ← схема БД (появится на фазе 0)
└── apps/web/          ← React frontend (позже)
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

## Быстрый старт (всё в Docker)

```bash
cp .env.example .env   # JWT секреты — свои
npm run docker:up      # postgres + redis + api + web + loki + grafana
```

Открыть: **http://localhost:5173** — тестовая страница (register / login / logout)

| URL | Сервис |
|-----|--------|
| http://localhost:5173 | Test UI (scrap) |
| http://localhost:3002/api/docs | Swagger |
| http://localhost:3001 | Grafana |

Документация: [docs/local-development.md](./docs/local-development.md)

## Статус

- [x] NestJS scaffold
- [x] Документация и планы (`docs/`)
- [ ] Backend фазы 0–8 → см. [backend-plan.md](./docs/backend-plan.md)
- [ ] Frontend → см. [frontend-plan.md](./docs/frontend-plan.md)

## Скрипты

| Команда | Описание |
|---------|----------|
| `npm run start:dev` | Backend в watch mode |
| `npm run build` | Production build |
| `npm run test` | Unit tests |
| `npm run test:e2e` | E2E tests |
| `npm run lint` | ESLint |
