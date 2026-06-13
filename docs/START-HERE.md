# CRMForge — Документация (начни отсюда)

> Это **главный индекс документации проекта**.  
> Файл `README.md` в **корне** репозитория — краткое описание проекта и команды запуска.

## Навигация по docs/

| Документ | Когда открывать |
|----------|-----------------|
| [tech-stack.md](./tech-stack.md) | Посмотреть финальный стек |
| [local-development.md](./local-development.md) | Локальный запуск: docker, скрипты, env |
| [env.md](./env.md) | **Все переменные .env** — что где взять, пошагово |
| [backend-plan.md](./backend-plan.md) | **Roadmap backend** — фазы 0–8, коммиты |
| [scrap-ui-plan.md](./scrap-ui-plan.md) | Тестовый UI без стилей (фаза T) |
| [frontend-plan.md](./frontend-plan.md) | Реализация frontend (фазы F0→F8) |
| [route-map.md](./route-map.md) | API endpoints и страницы UI |
| [agent-context.md](./agent-context.md) | Контекст для AI-агента (статус, инварианты) |
| [stack-review.md](./stack-review.md) | Обзор стека: что ок, что обсудить |

## Порядок работы

```
1. ~~open-questions.md~~ ✅
2. backend-plan.md (фазы 0→8)     ← коммит на каждую фазу
3. scrap-ui-plan.md (фаза T)      ← тест API формами
4. frontend-plan.md (F0→F8)       ← красивый UI + темы
```

## Быстрый старт

```bash
cp .env.example .env
# Заполнение ключей: docs/env.md
npm run docker:infra   # postgres + redis
npm run dev            # backend (+ frontend когда появится)
```

Полный стек (Loki + Grafana): `npm run docker:full`  
Подробнее: [local-development.md](./local-development.md)

## Стек (кратко)

**Backend:** NestJS · Prisma · PostgreSQL · Redis · BullMQ · Joi · JWT · Google OAuth · bcrypt · SendGrid · Pino · Loki · Grafana · Swagger  
**Frontend:** React 19 · Vite 6 · Tailwind · shadcn/ui · TanStack Query · i18n · TypeScript strict  
**External:** amoCRM REST API (OAuth 2.0, mock mode для разработки)
