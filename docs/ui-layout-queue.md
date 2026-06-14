# CRMForge — UI Layout Queue

> Очередь экранов и UI-блоков, для которых нужна **отдельная вёрстка** (mock HTML с 5–10 вариантами → выбор → фиксация).  
> Глобальная тема уже зафиксирована: [`design-system.md`](design-system.md) (Dark Vercel + Light Stripe).

---

## Как работаем

1. Берём экран из таблицы ниже (по **№** или ID).
2. Генерируем `docs/presets/{letter}-{slug}.html` — 7 вариантов layout, переключатели сверху + «Далее →».
3. Выбираем номер варианта → обновляем колонку **Выбор** и создаём `{id}-{slug}.md` со спекой (опционально).
4. При реализации frontend — ссылка на зафиксированный mock.

### Статусы

| Статус | Значение |
|--------|----------|
| ⬜ | Не начато |
| 🎨 | Mock с вариантами готов |
| ✅ | Вариант выбран и зафиксирован |
| ⏭️ | Общий layout / без отдельного mock |

---

## Уже зафиксировано

| № | ID | Что | Назначение | Выбор | Файлы |
|---|-----|-----|------------|-------|-------|
| 0 | T00 | **Глобальная тема** | Цвета, типографика и токены для light/dark режима во всём приложении | Dark Vercel · Light Stripe L3 | `presets/design-variants.html` |
| 1 | L01 | **App Shell** | Постоянный layout после входа | **v5** — BC · orb profile · prefs BL | `presets/a-l01-app-shell.html` |
| 2 | L02 | **404 / Not Found** | Страница ошибки | **v2** — Hero 404 | `presets/b-l02-404.html` |
| 3 | A01 | **Login** | Вход в аккаунт | **v2** — Split · email first (Google снизу) | `presets/c-a01-login.html` |
| 4 | A02 | **Register** | Регистрация | **v2** — Split promo + Google | `presets/d-a02-register.html` |
| 5 | A03 | **Check Email** | Письмо после регистрации | **v1** — Card + steps | `presets/e-a03-check-email.html` |
| 6 | A04 | **Verify Email** | Подтверждение по ссылке | **v1** — Loading card | `presets/f-a04-verify-email.html` |
| 7 | D01 | **Dashboard** | Главная после входа | **v1** — Classic grid | `presets/g-d01-dashboard.html` |
| 8 | DL01 | **Deals List** | Список сделок | **v2** — Filters sidebar | `presets/h-dl01-deals-list.html` |
| 9 | DL02 | **Deal Detail** | Карточка сделки | **v3** — Tabs + hero | `presets/i-dl02-deal-detail.html` |
| 10 | I01 | **Integrations Hub** | Список CRM-провайдеров | **v2** — List rows | `presets/j-i01-integrations.html` |
| 11 | I02 | **amoCRM Setup** | Настройка amoCRM | **v5** — Center connect | `presets/k-i02-amocrm-setup.html` |
| 12 | S01 | **Settings** | Профиль и настройки | **v3** — Sidebar nav | `presets/l-s01-settings.html` |
| 13 | U01 | **Sync Progress** | Прогресс синхронизации | **v7** — Floating panel | `presets/m-u01-sync-progress.html` |
| 14 | U02 | **Header User Menu** | Меню пользователя | **v3** — Grouped menu | `presets/n-u02-user-menu.html` |
| 15 | U03 | **Toast / Notifications** | Всплывающие уведомления | **v5** — Rich toast | `presets/o-u03-toast.html` |
| 16 | U04 | **Deal Status Badge** | Метка статуса сделки | **v5** — Soft fill (в таблице) | `presets/p-u04-status-badge.html` |
| 17 | U05 | **Empty States** | Заглушка без данных | **v1** — Center illustration | `presets/q-u05-empty-states.html` |

---

## Очередь экранов

### 1. Layout & Shell

> **Общая оболочка приложения** — каркас, в котором живут все защищённые страницы, плюс служебные экраны ошибок.

| № | ID | Экран | Назначение | Route | API | Статус | Выбор | Ключевые решения |
|---|-----|-------|------------|-------|-----|--------|-------|------------------|
| 1 | L01 | **App Shell** | Постоянный layout после входа: боковое меню, шапка, контентная область, переключатель темы и языка | `*` (layout) | `GET /auth/me` | ✅ | **v5** BC · orb profile · prefs BL | Sidebar; **RU/EN + тема** — sidebar bottom-left; **профиль** — orb top-right (N3 menu); breadcrumbs; `/settings` = профиль |
| 2 | L02 | **404 / Not Found** | Показывается при неверном URL; объясняет, что страница не найдена, и ведёт обратно в приложение | `*` | — | ✅ | **v2** Hero 404 | Illustration vs minimal text; CTA «На dashboard» |

---

### 2. Auth (public)

> **Авторизация и регистрация** — экраны для гостей (без JWT). Пользователь создаёт аккаунт, входит, подтверждает email или восстанавливает доступ к верификации.

| № | ID | Экран | Назначение | Route | API | Статус | Выбор | Ключевые решения |
|---|-----|-------|------------|-------|-----|--------|-------|------------------|
| 3 | A01 | **Login** | Вход в аккаунт по email и паролю или через Google; после успеха — редирект на dashboard | `/login` | `POST /auth/login`, `GET /auth/google` | ✅ | **v2** Split · email first | Centered card vs split-screen; Google button placement; link register; error states (401, unverified email) |
| 4 | A02 | **Register** | Регистрация нового пользователя (email, пароль, имя); выбор языка RU/EN; после отправки — переход на «Проверьте почту» | `/register` | `POST /auth/register` | ✅ | **v2** Split promo + Google | Поля (email, password, name); language RU/EN; password hints; link login |
| 5 | A03 | **Check Email** | Промежуточный экран после регистрации: «мы отправили письмо, перейдите по ссылке»; опция повторной отправки | `/check-email` | `POST /auth/resend-verification` | ✅ | **v1** Card + steps | Иконка/иллюстрация; текст «проверьте почту»; кнопка resend |
| 6 | A04 | **Verify Email** | Landing по ссылке из письма: подтверждает email по token, показывает успех или ошибку (просрочен/невалиден token) | `/verify-email?token=` | `GET /auth/verify-email` | ✅ | **v1** Loading card | Loading → success / error; auto-redirect login; invalid/expired token UI |

> **Без отдельного mock:** `GET /auth/google`, `GET /auth/google/callback` — редиректы OAuth; при необходимости минимальная страница «Signing in…» (⏭️).

---

### 3. Dashboard

> **Главная страница** после входа — быстрый обзор состояния CRM: сколько сделок, что с интеграцией, когда была синхронизация.

| № | ID | Экран | Назначение | Route | API | Статус | Выбор | Ключевые решения |
|---|-----|-------|------------|-------|-----|--------|-------|------------------|
| 7 | D01 | **Dashboard** | Сводка по сделкам (всего / выиграно / в работе / pipeline), таблица последних сделок, статус amoCRM, кнопка «Синхронизировать»; если интеграция не подключена — CTA на setup | `/` | `GET /deals?limit=1`, `GET /integrations/amocrm`, `GET /sync/jobs?limit=1`, `POST /sync/amocrm/leads` | ✅ | **v1** Classic grid | 4 stat cards layout; recent deals table (5 rows); «Sync now» placement; **empty state** без интеграции → CTA amoCRM |

---

### 4. Deals

> **Сделки** — основной CRM-раздел: список лидов/сделок, импортированных из amoCRM, с фильтрацией и детальным просмотром.

| № | ID | Экран | Назначение | Route | API | Статус | Выбор | Ключевые решения |
|---|-----|-------|------------|-------|-----|--------|-------|------------------|
| 8 | DL01 | **Deals List** | Таблица всех сделок пользователя: название, сумма, статус, контакт, дата синхронизации; поиск и фильтр по статусу, пагинация | `/deals` | `GET /deals?page&limit&status&search&sort` | ✅ | **v2** Filters sidebar | DataTable vs card list; filters (status, search); pagination; skeleton loading; empty state |
| 9 | DL02 | **Deal Detail** | Карточка одной сделки: все поля, контакт, статус, дата последней синхронизации; сырой JSON метаданных из amoCRM (collapsible) | `/deals/:id` | `GET /deals/:id` | ✅ | **v3** Tabs + hero | Field layout; status badge; contact block; collapsible raw JSON metadata; back nav; optional edit (`PATCH`) |

> **Опционально позже:** форма создания/редактирования сделки (`POST /deals`, `PATCH /deals/:id`) — отдельный mock или modal внутри №8 / №9.

---

### 5. Integrations

> **Интеграции с внешними CRM** — подключение amoCRM, проверка соединения, отключение; hub показывает все провайдеры.

| № | ID | Экран | Назначение | Route | API | Статус | Выбор | Ключевые решения |
|---|-----|-------|------------|-------|-----|--------|-------|------------------|
| 10 | I01 | **Integrations Hub** | Список CRM-провайдеров: amoCRM (активен), остальные «Скоро»; статус каждой интеграции (подключено / нет / ошибка); переход к настройке | `/integrations` | `GET /integrations` | ✅ | **v2** List rows | Card grid per provider; amoCRM active, others «Coming soon»; status badges (Connected / Disconnected / Error) |
| 11 | I02 | **amoCRM Setup** | Настройка amoCRM: OAuth «Подключить» или demo-mode без реального OAuth; тест соединения; отключение; справка и ссылка на документацию amoCRM | `/integrations/amocrm` | `GET /integrations/amocrm`, `GET /integrations/amocrm/oauth/url`, `POST /integrations/amocrm/connect`, `POST /integrations/amocrm/test`, `DELETE /integrations/amocrm` | ✅ | **v5** Center connect | OAuth «Connect» vs mock «Connect (demo)»; test/disconnect buttons; help + link developers; connected state |

> **Без отдельного mock:** `GET /integrations/amocrm/oauth/callback` — редирект после OAuth (⏭️).

---

### 6. Settings

> **Профиль и настройки** — личные данные пользователя, безопасность, язык интерфейса, опасные действия (отключение интеграции).

| № | ID | Экран | Назначение | Route | API | Статус | Выбор | Ключевые решения |
|---|-----|-------|------------|-------|-----|--------|-------|------------------|
| 12 | S01 | **Settings** | Редактирование имени, смена пароля, переключение языка RU/EN; danger zone — отключить amoCRM | `/settings` | `GET /auth/me`, `PATCH /users/me`, `PATCH /users/me/password` | ✅ | **v3** Sidebar nav | Tabs vs single scroll; profile (name); change password form; language RU/EN; danger zone (disconnect integration) |

---

### 7. Shared UI (не отдельные страницы)

> **Переиспользуемые UI-блоки** — не имеют своего route, но нуждаются в отдельном layout-решении; встраиваются в shell и страницы.

| № | ID | Блок | Назначение | Где используется | API | Статус | Выбор | Ключевые решения |
|---|-----|------|------------|------------------|-----|--------|-------|------------------|
| 13 | U01 | **Sync Progress** | Визуализация процесса синхронизации сделок: запуск, прогресс, успех или ошибка | Dashboard, Deals, Header | `POST /sync/amocrm/leads`, `GET /sync/jobs/:id` | ✅ | **v7** Floating panel | Inline banner vs modal vs toast; progress bar; polling state (running / done / error) |
| 14 | U02 | **Header User Menu** | Dropdown в шапке: имя пользователя, переход в настройки, выход из аккаунта | App Shell | `POST /auth/logout`, `GET /auth/me` | ✅ | **v3** Grouped menu | Dropdown: profile, settings, logout |
| 15 | U03 | **Toast / Notifications** | Всплывающие уведомления об успехе/ошибке (login failed, sync done, profile saved) | Global | — | ✅ | **v5** Rich toast | sonner placement; success/error styling под тему |
| 16 | U04 | **Deal Status Badge** | Цветная метка статуса сделки: выиграна / в работе / проиграна | Deals, Dashboard | — | ✅ | **v5** Soft fill | Won / Open / Lost — цвета из design-system |
| 17 | U05 | **Empty States** | Заглушка когда данных нет: нет сделок, нет интеграции, пустой список — с пояснением и CTA | Dashboard, Deals, Integrations | — | ✅ | **v1** Center illustration | Единый паттерн illustration + headline + CTA |

---

## Без UI (не в очереди)

| Method | Path | Причина |
|--------|------|---------|
| GET | `/health`, `/health/ready` | DevOps / мониторинг |
| POST | `/auth/refresh` | Axios interceptor, без страницы |
| GET | `/auth/google`, `/auth/google/callback` | OAuth redirect |
| GET | `/integrations/amocrm/oauth/callback` | OAuth redirect |
| POST | `/webhooks/amocrm/:integrationId` | Backend-only |
| GET | `/docs`, `/docs-json` | Swagger UI |
| DELETE | `/deals/:id` | Confirm dialog внутри №8 / №9, не отдельный экран |

---

## Рекомендуемый порядок mock'ов

```
 0. T00 — Global theme          ✅ зафиксировано
 1. L01 — App Shell             — основа для всех страниц
 3. A01 — Login                 — первый экран пользователя
 4. A02 — Register              — парный с login
 7. D01 — Dashboard             — главный экран после входа
 8. DL01 — Deals List           — core CRM UI
 9. DL02 — Deal Detail          — детализация
10. I01 — Integrations Hub
11. I02 — amoCRM Setup          — интеграции (hub → setup)
12. S01 — Settings              — профиль
 5. A03 — Check Email
 6. A04 — Verify Email          — email flow
13–17. U01–U05                  — shared blocks (можно внутри №1)
 2. L02 — 404                   — в конце
```

---

## Шаблон записи после выбора варианта

```markdown
### №{N} — {ID} — {Название} ✅

- **Назначение:** {что делает экран для пользователя}
- **Выбор:** вариант N — {краткое описание}
- **Mock:** `docs/layout-mocks/{id}-{slug}.html`
- **Route:** `/path`
- **Endpoints:** `GET /...`, `POST /...`
- **Зафиксировано:** {дата}
- **Примечания:** ...
```

---

## Связанные файлы

| Файл | Назначение |
|------|------------|
| [`frontend-plan.md`](frontend-plan.md) | Фазы F0–F8, компоненты, hooks |
| [`route-map.md`](route-map.md) | Полный список API |
| [`design-system.md`](design-system.md) | Цвета, токены, shadcn |
| [`presets/README.md`](presets/README.md) | HTML mock'и A–Q, 7 вариантов каждый |

---

## Чеклист прогресса

> Дублируется в [`frontend-plan.md`](frontend-plan.md) (секция **Чеклист прогресса**) вместе с F0–F8.

```
[x]  0 — T00  Global theme
[x]  1 — L01  App Shell          v5
[x]  2 — L02  404                v2
[x]  3 — A01  Login              v2
[x]  4 — A02  Register           v2
[x]  5 — A03  Check Email        v1
[x]  6 — A04  Verify Email       v1
[x]  7 — D01  Dashboard          v1
[x]  8 — DL01 Deals List         v2
[x]  9 — DL02 Deal Detail        v3
[x] 10 — I01  Integrations Hub   v2
[x] 11 — I02  amoCRM Setup       v5
[x] 12 — S01  Settings           v3
[x] 13 — U01  Sync Progress      v7
[x] 14 — U02  User Menu          v3
[x] 15 — U03  Toasts             v5
[x] 16 — U04  Status Badges      v5
[x] 17 — U05  Empty States       v1
```
