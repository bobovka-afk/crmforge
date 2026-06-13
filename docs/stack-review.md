# CRMForge — Stack Review

> Мнение агента по выбранным технологиям для CRM portfolio-проекта.  
> Не блокеры — пункты для обсуждения, если захочешь заменить.

## ✅ Сильные решения (оставляем)

| Технология | Почему хорошо для CRM monolith |
|------------|-------------------------------|
| **NestJS + TypeScript strict** | Стандарт для Node backend, модульность под auth/integrations/sync |
| **Prisma + PostgreSQL** | Relations, транзакции, JSONB — идеально для CRM entities |
| **Redis + BullMQ** | Кэш amoCRM + фоновый sync — типичный паттерн |
| **JWT + Google OAuth + bcrypt** | Два входа, production-look auth |
| **Swagger** | Контракт API для фронта и portfolio |
| **React 19 + shadcn/ui** | Современный UI без тяжёлых UI-kit |
| **TanStack Query** | Server state для deals/sync — best practice |
| **amoCRM** | Сильный выбор для RU/CIS portfolio narrative |
| **Joi** | Работает; показывает, что не только class-validator |

## ⚠️ Обсудить (не ошибка, но нюансы)

### 1. Grafana + Loki локально

**Вердикт:** хорошо для portfolio demo, **не обязательно каждый день**.

- Плюс: впечатляет на собеседовании («observability stack»)
- Минус: +2 контейнера, на старте редко смотришь в Grafana

**Рекомендация:** `npm run docker:infra` ежедневно, `docker:full` — когда тестируешь логи. Уже так заложено.

**Альтернатива попроще:** только Pino + stdout (без Loki). Менее «enterprise», но быстрее.

---

### 2. SendGrid

**Вердикт:** отличный выбор для production email.

- Free tier: 100 emails/day — хватит для dev
- Для локалки добавлен **`MAIL_MOCK=true`** — не нужен ключ на старте

**Альтернатива:** Resend (популярнее в indie/SaaS 2025–2026), Mailgun. SendGrid — норм, менять не обязательно.

---

### 3. Joi вместо class-validator в Nest

**Вердикт:** допустимо, но **менее идиоматично** для Nest.

- Большинство Nest-проектов: class-validator + DTO decorators
- Joi: явные схемы, меньше magic — ты хотел попробовать

**Если цель — максимально «как в Nest ecosystem»:** class-validator.  
**Если цель — показать разнообразие:** Joi ок.

---

### 4. amoCRM vs «международная» CRM

**Вердикт:** amoCRM — **отлично для RU/СНГ** аудитории.

- Для **международного** portfolio иногда сильнее HubSpot (free developer tier, EN docs)
- Можно позже добавить второй provider (`integrations/hubspot`) за тем же `CrmProvider` interface

Менять не нужно, если целевая аудитория локальная.

---

### 5. i18n сразу

**Вердикт:** +1–2 дня работы на фронте.

- Плюс: RU + EN — сильный portfolio point
- Минус: все строки через `t()` с первого дня

**Альтернатива:** EN сначала, i18n фаза F8. Ты выбрал i18n сразу — ок, просто учти время.

---

## ❌ Не рекомендую менять

- MongoDB вместо Postgres — для CRM хуже
- RabbitMQ вместо BullMQ — overkill при Redis в стеке
- Next.js вместо Vite SPA — нет SSR-требования
- Redux — TanStack Query + Zustand достаточно

---

## Открытый вопрос

| # | Вопрос | Рекомендация |
|---|--------|--------------|
| 1 | Дефолтная локаль UI | **RU** — смена на Register + Settings |
| 2 | Grafana каждый день? | **Нет** — только `docker:full` по необходимости |

_Все открытые вопросы закрыты._
