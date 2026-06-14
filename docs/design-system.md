# CRMForge — Design System (зафиксировано)

> Выбор: **Dark — Vercel** · **Light — Stripe (L3)**  
> Mock: `docs/presets/` · Preview: `docs/presets/design-tokens.css`

---

## Визуальный язык

| Параметр | Значение |
|----------|----------|
| Стиль | Clean SaaS dashboard |
| Dark ref | [Vercel Dashboard](https://vercel.com/dashboard) — чёрно-белый, высокий контраст |
| Light ref | [Stripe Dashboard](https://dashboard.stripe.com) — светло-серый фон, indigo accent |
| Шрифт | Inter (Google Fonts) |
| Radius | `0.5rem` (`--radius: 0.5rem`) |
| Layout | Card-based, generous whitespace |

---

## Semantic tokens

### Dark — Vercel

| Token | Hex / value | Использование |
|-------|-------------|---------------|
| `--bg` | `#000000` | Page background |
| `--bg-sidebar` | `#0a0a0a` | Sidebar |
| `--bg-card` | `#0a0a0a` | Cards, inputs |
| `--bg-hover` | `#171717` | Hover rows, secondary surfaces |
| `--border` | `#333333` | Borders, dividers |
| `--text` | `#ededed` | Primary text |
| `--text-muted` | `#888888` | Secondary text, labels |
| `--primary` | `#ffffff` | Primary buttons, active nav |
| `--primary-hover` | `#e5e5e5` | Primary hover |
| `--primary-text` | `#000000` | Text on primary |
| `--accent-bg` | `rgba(255,255,255,0.06)` | Active nav, subtle highlights |
| `--success` | `#50e3c2` | Won deals, connected status |
| `--warning` | `#f5a623` | Warnings |
| `--danger` | `#ee0000` | Errors, lost deals |
| `--shadow` | `none` | No card elevation |

### Light — Stripe

| Token | Hex / value | Использование |
|-------|-------------|---------------|
| `--bg` | `#f6f9fc` | Page background |
| `--bg-sidebar` | `#ffffff` | Sidebar |
| `--bg-card` | `#ffffff` | Cards, inputs |
| `--bg-hover` | `#f0f4f8` | Hover rows, secondary surfaces |
| `--border` | `#e3e8ee` | Borders, dividers |
| `--text` | `#0a2540` | Primary text |
| `--text-muted` | `#697386` | Secondary text, labels |
| `--primary` | `#635bff` | Primary buttons, links, active nav |
| `--primary-hover` | `#7a73ff` | Primary hover |
| `--primary-text` | `#ffffff` | Text on primary |
| `--accent-bg` | `rgba(99,91,255,0.08)` | Active nav, subtle highlights |
| `--success` | `#30b566` | Won deals, connected status |
| `--warning` | `#df1b41` | Warnings (Stripe red) |
| `--danger` | `#df1b41` | Errors, lost deals |
| `--shadow` | `0 1px 3px rgba(50,50,93,0.08), 0 1px 0 rgba(0,0,0,0.02)` | Card elevation |

---

## shadcn/ui mapping

Готовый CSS: `docs/design-tokens.css` — скопировать в `apps/web/src/index.css` после Tailwind imports.

| shadcn token | Dark (Vercel) | Light (Stripe) |
|--------------|---------------|----------------|
| `--background` | `#000000` | `#f6f9fc` |
| `--foreground` | `#ededed` | `#0a2540` |
| `--card` | `#0a0a0a` | `#ffffff` |
| `--card-foreground` | `#ededed` | `#0a2540` |
| `--popover` | `#0a0a0a` | `#ffffff` |
| `--popover-foreground` | `#ededed` | `#0a2540` |
| `--primary` | `#ffffff` | `#635bff` |
| `--primary-foreground` | `#000000` | `#ffffff` |
| `--secondary` | `#171717` | `#f0f4f8` |
| `--secondary-foreground` | `#ededed` | `#0a2540` |
| `--muted` | `#171717` | `#f0f4f8` |
| `--muted-foreground` | `#888888` | `#697386` |
| `--accent` | `rgba(255,255,255,0.06)` | `rgba(99,91,255,0.08)` |
| `--accent-foreground` | `#ffffff` | `#635bff` |
| `--destructive` | `#ee0000` | `#df1b41` |
| `--destructive-foreground` | `#ffffff` | `#ffffff` |
| `--border` | `#333333` | `#e3e8ee` |
| `--input` | `#333333` | `#e3e8ee` |
| `--ring` | `#ffffff` | `#635bff` |
| `--radius` | `0.5rem` | `0.5rem` |

### Sidebar (custom, не shadcn)

```css
--sidebar-background: var(--bg-sidebar);
--sidebar-foreground: var(--text);
--sidebar-border: var(--border);
--sidebar-accent: var(--accent-bg);
--sidebar-accent-foreground: var(--primary);
```

### Status colors (Badge)

| Status | Dark | Light |
|--------|------|-------|
| Won | bg `rgba(80,227,194,0.15)`, text `#50e3c2` | bg `rgba(48,181,102,0.12)`, text `#30b566` |
| Open | bg `var(--accent-bg)`, text `var(--primary)` | same pattern |
| Lost | bg `rgba(238,0,0,0.12)`, text `#ee0000` | bg `rgba(223,27,65,0.1)`, text `#df1b41` |

---

## Компоненты

Минимальный набор shadcn: Button, Input, Label, Card, Table, Badge, Skeleton, Dialog, Dropdown Menu, Sheet, Toast (sonner), Tabs, Select, Avatar.

### Правила

- **Dark primary button:** белый фон, чёрный текст (инверсия Vercel)
- **Light primary button:** indigo `#635bff`, белый текст
- **Cards:** border always visible; shadow only in light theme
- **Active nav item:** `accent-bg` background + `primary` text color
- **Logo icon:** `primary` bg + `primary-text` color

---

## Theme toggle

- `next-themes`: class `dark` on `<html>`
- Default: `system` или `dark`
- Persist: localStorage (built-in next-themes)
- Header: sun/moon icon

---

## amoCRM brand (integration only)

Логотип и карточка интеграции amoCRM — фиксированный brand color, не зависит от темы:

```css
--amocrm-brand: #3390ec;
```

---

## Handoff для F0

При scaffold frontend:

1. Подключить Inter в `index.html`
2. Вставить `design-tokens.css` в `index.css`
3. `next-themes` + `attribute="class"` + `defaultTheme="system"`
4. Sidebar использует `--sidebar-*` переменные
5. Не менять палитру без обновления этого файла
