# CRMForge — Frontend Plan

> **Старт:** только после завершения backend (фазы 0–8 в `backend-plan.md`).  
> **Цель:** современный production-look UI для portfolio — чистый, быстрый, без лишнего.

---

## Цели frontend

1. Auth flow (login, register, protected routes)
2. Dashboard с ключевыми метриками
3. Deals — таблица с фильтрами, пагинацией, детальной карточкой
4. Integrations — подключение **amoCRM** (OAuth), статус, test connection
5. Sync — кнопка синхронизации + статус job
6. Responsive layout
7. **Light / Dark theme** — переключатель (дизайн и цвета позже, см. чеклист ниже)

---

## Чеклист — темы (без дизайна пока)

```
[ ] next-themes Provider (class on <html>)
[ ] ThemeToggle в Header (sun/moon icon)
[ ] Сохранение выбора в localStorage
[ ] CSS variables shadcn (default light + dark) — без кастомных цветов
[ ] Все страницы читаемы в обеих темах
```

> **Позже (не сейчас):** кастомная палитра, brand colors, градиенты.

---

## Библиотеки

### Core

| Package | Назначение |
|---------|------------|
| `react` ^19 | UI |
| `react-dom` ^19 | DOM |
| `typescript` ^5.7 | Types |
| `vite` ^6 | Build tool |
| `@vitejs/plugin-react` | React plugin |

### UI & Styling

| Package | Назначение |
|---------|------------|
| `tailwindcss` ^4 | Utility CSS |
| `@tailwindcss/vite` | Vite integration |
| `shadcn/ui` components | Button, Card, Table, Dialog, Input, etc. |
| `lucide-react` | Icons |
| `class-variance-authority`, `clsx`, `tailwind-merge` | shadcn deps |
| `next-themes` | Dark/light mode |

### Data & Routing

| Package | Назначение |
|---------|------------|
| `@tanstack/react-query` ^5 | Server state, cache, mutations |
| `react-router-dom` ^7 | Client routing |
| `axios` ^1 | HTTP client с interceptors |

### Forms

| Package | Назначение |
|---------|------------|
| `react-hook-form` ^7 | Form state |
| `@hookform/resolvers` | Опционально; backend валидирует Joi, фронт — lightweight rules |

### Client state

| Package | Назначение |
|---------|------------|
| `zustand` ^5 | Sidebar, UI prefs, locale |
| `react-i18next`, `i18next` | i18n RU + EN |

### Dev

| Package | Назначение |
|---------|------------|
| `eslint`, `prettier` | Lint/format |
| `@types/react`, `@types/react-dom` | Types |

### Не используем

- Redux / MobX
- Next.js (нет SSR-требования)
- MUI, Ant Design (shadcn выглядит современнее для portfolio)

---

## Структура проекта

```
apps/web/
├── public/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css              # Tailwind imports
│   ├── components/
│   │   ├── ui/                # shadcn primitives
│   │   └── layout/
│   │       ├── AppShell.tsx
│   │       ├── Sidebar.tsx
│   │       ├── Header.tsx
│   │       └── ThemeToggle.tsx
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── DealsPage.tsx
│   │   ├── DealDetailPage.tsx
│   │   ├── IntegrationsPage.tsx
│   │   ├── AmoCrmSetupPage.tsx
│   │   └── SettingsPage.tsx
│   ├── features/
│   │   ├── auth/
│   │   │   ├── api.ts
│   │   │   ├── hooks.ts
│   │   │   └── AuthProvider.tsx
│   │   ├── deals/
│   │   │   ├── api.ts
│   │   │   └── hooks.ts
│   │   ├── integrations/
│   │   │   ├── api.ts
│   │   │   └── hooks.ts
│   │   └── sync/
│   │       ├── api.ts
│   │       └── hooks.ts
│   ├── lib/
│   │   ├── api-client.ts      # axios instance + interceptors
│   │   ├── query-client.ts
│   │   └── utils.ts           # cn()
│   ├── i18n/
│   │   ├── index.ts
│   │   └── locales/
│   │       ├── en.json
│   │       └── ru.json
│   ├── hooks/
│   │   └── useAuth.ts
│   ├── stores/
│   │   └── ui-store.ts
│   └── routes/
│       ├── index.tsx
│       ├── ProtectedRoute.tsx
│       └── PublicRoute.tsx
├── components.json            # shadcn config
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Дизайн-система

### Визуальный язык

- **Стиль:** clean SaaS dashboard (референсы: Linear, Vercel Dashboard, Resend)
- **Шрифт:** Inter (Google Fonts)
- **Radius:** `0.5rem` (shadcn default)
- **Spacing:** generous whitespace, card-based layout

### Цвета (CSS variables, shadcn default с кастомизацией)

| Token | Light | Dark |
|-------|-------|------|
| Primary | Indigo/Violet accent | Same, adjusted luminance |
| Background | White / slate-50 | slate-950 |
| Card | White with subtle border | slate-900 |
| Muted text | slate-500 | slate-400 |

### Компоненты shadcn (минимальный набор)

- Button, Input, Label, Card
- Table, Badge, Skeleton
- Dialog, Dropdown Menu, Sheet (mobile sidebar)
- Toast (sonner)
- Tabs, Select
- Avatar

---

## API client

### `lib/api-client.ts`

```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
});

// Request: attach access token
// Response: on 401 → try refresh → retry or redirect login
```

### Token storage

| Token | Storage |
|-------|---------|
| Access | `localStorage` (MVP) или memory + refresh flow |
| Refresh | httpOnly cookie если backend так настроен |

### TanStack Query defaults

```typescript
{
  staleTime: 30_000,
  retry: 1,
  refetchOnWindowFocus: false,
}
```

---

## Фаза F0 — Scaffold

### Задачи

1. `npm create vite@latest apps/web -- --template react-ts`
2. Install Tailwind v4 + shadcn init
3. Add base shadcn components
4. Setup `next-themes` Provider
5. Setup `react-i18next` — **fallbackLng: `ru`**, EN secondary
6. Vite proxy: `/api` → `http://localhost:3000`

### `vite.config.ts` proxy

```typescript
server: {
  proxy: {
    '/api': 'http://localhost:3000',
  },
},
```

**Критерий:** dev server стартует, пустой AppShell с sidebar рендерится

---

## Фаза F1 — Routing и layout

### Routes

| Path | Component | Guard |
|------|-----------|-------|
| `/login` | LoginPage | Public only |
| `/register` | RegisterPage | Public only |
| `/` | DashboardPage | Protected |
| `/deals` | DealsPage | Protected |
| `/deals/:id` | DealDetailPage | Protected |
| `/integrations` | IntegrationsPage | Protected |
| `/integrations/amocrm` | AmoCrmSetupPage | Protected |
| `/settings` | SettingsPage | Protected |

### AppShell

- Collapsible sidebar (desktop)
- Sheet menu (mobile)
- Header: user menu, theme toggle, **language switcher (RU/EN)**, sync indicator
- Breadcrumbs на внутренних страницах

**Критерий:** navigation работает, protected redirect на `/login`

---

## Фаза F2 — Auth

### Pages

**LoginPage**
- email, password
- **«Continue with Google»** button → `GET /api/auth/google`
- link to register
- error toast (unverified email → link resend)

**RegisterPage**
- email, password, name (optional)
- **language selector (RU / EN)** — сохраняется в localStorage + опционально в user profile
- redirect to `/check-email` (не в dashboard)

**CheckEmailPage** / **VerifyEmailPage**
- сообщение «проверьте почту»
- `/verify-email?token=` — подтверждение по ссылке из SendGrid

### AuthProvider

- `useAuth()` → `{ user, isLoading, login, logout, register }`
- Bootstrap: on mount → `GET /auth/me` if token exists
- Logout clears tokens + query cache

### Hooks

```typescript
useLogin()    // mutation
useRegister() // mutation
useMe()       // query
useLogout()   // mutation
```

**Критерий:** full auth cycle against real backend

---

## Фаза F3 — Dashboard

### Widgets (cards)

| Widget | Data source |
|--------|-------------|
| Total deals | `GET /deals?limit=1` → meta.total |
| Won / Lost | aggregate by status (или отдельный endpoint фаза 2) |
| Integration status | `GET /integrations/amocrm` |
| Last sync | `GET /sync/jobs?limit=1` |

### UI

- 4 stat cards top row
- Recent deals table (last 5)
- Quick action: "Sync now" button
- Empty state если нет интеграции → CTA "Connect amoCRM"

**Критерий:** dashboard meaningful с mock/real data

---

## Фаза F4 — Deals

### DealsPage

- DataTable (shadcn Table)
- Columns: Title, Amount, Status (Badge), Contact, Synced at
- Filters: status Select, search Input (debounced 300ms)
- Pagination controls
- Loading: Skeleton rows
- Empty state illustration

### DealDetailPage

- Card с полями сделки
- Raw sync metadata (collapsible JSON)
- Back navigation

### Hooks

```typescript
useDeals({ page, limit, status, search })
useDeal(id)
```

**Критерий:** list, filter, paginate, detail view

---

## Фаза F5 — Integrations

### IntegrationsPage

- Card per provider (amoCRM active, others "Coming soon" disabled)
- Status badge: Connected / Disconnected / Error

### AmoCrmSetupPage

- OAuth flow: кнопка "Connect amoCRM" → redirect → callback
- Mock mode: кнопка "Connect (demo)" без реального OAuth
- "Test connection" button
- "Disconnect"
- Help text с ссылкой на [amoCRM developers](https://www.amocrm.ru/developers/)

### Flow

1. User pastes webhook URL
2. Test → toast success/fail
3. Connect → redirect to dashboard with success toast

**Критерий:** connect amoCRM end-to-end через UI (или mock)

---

## Фаза F6 — Sync

### UI elements

- "Sync deals" button on Dashboard и Deals page
- Progress: polling `GET /sync/jobs/:id` every 2s while running
- Toast on complete / error
- Invalidate `deals` queries on success

### Hook

```typescript
useTriggerSync()    // mutation → POST /sync/amocrm/leads
useSyncJob(id)      // query with refetchInterval when running
```

**Критерий:** click sync → see progress → deals table updates

---

## Фаза F7 — Settings

- Update name
- Change password form
- **Language preference (RU / EN)** — переключение локали
- Danger zone: disconnect integration

**Критерий:** profile update reflects in header

---

## Фаза F8 — Polish & deploy

### UX polish

- Page transitions subtle (fade)
- Consistent loading/error states
- 404 page
- Form validation messages (client-side basic)
- Mobile responsive check

### Performance

- Route-based code splitting (`React.lazy`)
- Query prefetch on hover (optional)

### Deploy

| Target | Setup |
|--------|-------|
| Frontend | Vercel / Netlify / Cloudflare Pages |
| Env | `VITE_API_URL=https://api.crmforge.example/api` |

### Portfolio README section

- Screenshots (dashboard, deals, integrations)
- Live demo links
- Tech stack badges

**Критерий:** deployed URL + screenshots in README

---

## Порядок реализации (чеклист)

```
[ ] F0: Vite + Tailwind + shadcn scaffold
[ ] F1: Router + AppShell layout
[ ] F2: Auth pages + API client + guards
[ ] F3: Dashboard
[ ] F4: Deals list + detail
[ ] F5: Integrations + amoCRM setup
[ ] F6: Sync trigger + progress
[ ] F7: Settings
[ ] F8: Polish + deploy
```

---

## Оценка времени

| Фаза | Оценка |
|------|--------|
| F0–F1 | 3–4 ч |
| F2 | 3 ч |
| F3–F4 | 5–6 ч |
| F5–F6 | 4 ч |
| F7–F8 | 3–4 ч |
| **Итого** | **~18–21 ч** |

---

## Зависимости от backend

| Frontend feature | Backend endpoint | Backend phase |
|------------------|------------------|---------------|
| Auth | `/auth/*` | 2 |
| Dashboard stats | `/deals`, `/integrations`, `/sync/jobs` | 5–7 |
| Deals UI | `/deals/*` | 6 |
| amoCRM setup | `/integrations/amocrm/*` | 5 |
| Sync button | `/sync/amocrm/leads` | 7 |

---

## Handoff checklist (backend → frontend)

Перед стартом F0 убедиться:

- [ ] Swagger доступен и актуален
- [ ] CORS разрешает `http://localhost:5173`
- [ ] `.env.example` содержит все переменные
- [ ] Mock mode работает без реального amoCRM
- [ ] `route-map.md` совпадает с реальными endpoints
