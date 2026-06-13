# CRMForge — Scrap UI (тестовый фронт)

> **Когда:** после backend фаз 0–8, **до** красивого фронта (`frontend-plan.md`).  
> **Цель:** протестировать API руками без дизайна.

## Что это

Минимальный HTML/JS без стилей — «костыльный» UI для проверки:

- Register / Login (email + password)
- Verify email (ссылка / token input)
- Google OAuth (кнопка-ссылка)
- Me / Logout
- Integrations (amoCRM mock connect)
- Sync + список deals

**Не делаем:** Tailwind, shadcn, темы, i18n, адаптив.

## Где лежит

```
apps/scrap-ui/
├── index.html       # все формы на одной странице или несколько html
├── app.js           # fetch к API, без фреймворка
└── package.json     # опционально: vite --host для dev server
```

Запуск: `npm run dev:scrap` (порт `5174`, proxy → `:3000/api`)

## Фаза T — чеклист

```
[ ] T0: scaffold scrap-ui (vanilla HTML) ✅ index.html в scrap-ui/
[ ] T1: auth forms (register, login, verify, me) ✅
[ ] T2: integrations + sync + deals list
[ ] T3: smoke checklist пройден вручную
```

## Commit

```
feat(scrap-ui): minimal test forms for backend API
```

## После scrap-ui

Когда все flows проверены → `frontend-plan.md` (красивый UI + **light/dark theme**).
