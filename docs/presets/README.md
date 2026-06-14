# CRMForge — Layout Presets

HTML mock'и с **7 вариантами** layout на каждый экран. Тема: Dark Vercel + Light Stripe.

## Как смотреть

Открой в браузере (начни с темы или сразу с экрана A):

```
file:///…/crmforge/docs/presets/design-variants.html
file:///…/crmforge/docs/presets/a-l01-app-shell.html
```

Сверху каждого файла:
- **Буква** (A–Q) + номер экрана
- Кнопки **1–7** — варианты layout
- **← Назад** / **Далее →** — переход между файлами
- Переключатель **Light / Dark**

## Файлы

| Буква | № | Файл | Экран |
|-------|---|------|-------|
| — | 0 | `design-variants.html` | Глобальная тема ✅ |
| A | 1 | `a-l01-app-shell.html` | App Shell |
| B | 2 | `b-l02-404.html` | 404 |
| C | 3 | `c-a01-login.html` | Login |
| D | 4 | `d-a02-register.html` | Register |
| E | 5 | `e-a03-check-email.html` | Check Email |
| F | 6 | `f-a04-verify-email.html` | Verify Email |
| G | 7 | `g-d01-dashboard.html` | Dashboard |
| H | 8 | `h-dl01-deals-list.html` | Deals List |
| I | 9 | `i-dl02-deal-detail.html` | Deal Detail |
| J | 10 | `j-i01-integrations.html` | Integrations Hub |
| K | 11 | `k-i02-amocrm-setup.html` | amoCRM Setup |
| L | 12 | `l-s01-settings.html` | Settings |
| M | 13 | `m-u01-sync-progress.html` | Sync Progress |
| N | 14 | `n-u02-user-menu.html` | User Menu |
| O | 15 | `o-u03-toast.html` | Toast |
| P | 16 | `p-u04-status-badge.html` | Status Badge |
| Q | 17 | `q-u05-empty-states.html` | Empty States |

## Регенерация

```bash
node docs/presets/generate-presets.mjs
```

## Связанные docs

- [`ui-layout-queue.md`](../ui-layout-queue.md) — очередь и статусы
- [`design-system.md`](../design-system.md) — зафиксированные цвета
