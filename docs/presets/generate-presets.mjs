import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const DIR = dirname(fileURLToPath(import.meta.url));

const SCREENS = [
  { letter: 'A', num: 1, id: 'L01', slug: 'l01-app-shell', title: 'App Shell', route: 'layout' },
  { letter: 'B', num: 2, id: 'L02', slug: 'l02-404', title: '404 Not Found', route: '/404' },
  { letter: 'C', num: 3, id: 'A01', slug: 'a01-login', title: 'Login', route: '/login' },
  { letter: 'D', num: 4, id: 'A02', slug: 'a02-register', title: 'Register', route: '/register' },
  { letter: 'E', num: 5, id: 'A03', slug: 'a03-check-email', title: 'Check Email', route: '/check-email' },
  { letter: 'F', num: 6, id: 'A04', slug: 'a04-verify-email', title: 'Verify Email', route: '/verify-email' },
  { letter: 'G', num: 7, id: 'D01', slug: 'd01-dashboard', title: 'Dashboard', route: '/' },
  { letter: 'H', num: 8, id: 'DL01', slug: 'dl01-deals-list', title: 'Deals List', route: '/deals' },
  { letter: 'I', num: 9, id: 'DL02', slug: 'dl02-deal-detail', title: 'Deal Detail', route: '/deals/:id' },
  { letter: 'J', num: 10, id: 'I01', slug: 'i01-integrations', title: 'Integrations Hub', route: '/integrations' },
  { letter: 'K', num: 11, id: 'I02', slug: 'i02-amocrm-setup', title: 'amoCRM Setup', route: '/integrations/amocrm' },
  { letter: 'L', num: 12, id: 'S01', slug: 's01-settings', title: 'Settings', route: '/settings' },
  { letter: 'M', num: 13, id: 'U01', slug: 'u01-sync-progress', title: 'Sync Progress', route: 'component' },
  { letter: 'N', num: 14, id: 'U02', slug: 'u02-user-menu', title: 'User Menu', route: 'component' },
  { letter: 'O', num: 15, id: 'U03', slug: 'u03-toast', title: 'Toast', route: 'component' },
  { letter: 'P', num: 16, id: 'U04', slug: 'u04-status-badge', title: 'Status Badge', route: 'component' },
  { letter: 'Q', num: 17, id: 'U05', slug: 'u05-empty-states', title: 'Empty States', route: 'component' },
];

const VARIANT_LABELS = {
  A: ['Sidebar слева', 'Узкий sidebar', 'Top navigation', 'Sidebar справа', 'BC · orb profile · prefs BL', 'Wide + stats', 'Grouped nav'],
  B: ['Минимальный', 'Hero 404', 'Split экран', 'В App Shell', 'Карточка', 'С поиском', 'Ссылки навигации'],
  C: ['Center card', 'Split · email first', 'Split · Google first', 'Email | Google cols', 'Brand panel', 'Google hero', 'Compact stack'],
  D: ['Центр карточка', 'Split promo', 'Compact', 'Steps hint', 'Wide fields', 'Side illustration', 'Minimal stack'],
  E: ['Card + steps', 'Split mail art', 'Card minimal', 'Full width message', 'With resend box', 'Illustration top', 'Inline banner'],
  F: ['Loading card', 'Success card', 'Error card', 'Split status', 'Minimal text', 'With redirect timer', 'Icon hero'],
  G: ['Classic grid', '2×2 stats', 'Sidebar metrics', 'Metrics strip', 'Deals first', 'Empty CTA', 'Hero + grid'],
  H: ['Full table', 'Filters sidebar', 'Card grid', 'Sticky header', 'Dense table', 'Top filters', 'Kanban board'],
  I: ['Single card', 'Two columns', 'Tabs + hero', 'Summary sidebar', 'Timeline', 'JSON split', 'Accordion'],
  J: ['Card grid', 'List rows', 'Featured amoCRM', 'Table list', 'Large cards', 'Horizontal scroll', 'Active / Soon'],
  K: ['Wizard steps', 'Full setup panel', 'Tabs connected', 'Split + help', 'Center connect', 'Checklist flow', 'Connected state'],
  L: ['Tabs profile', 'Single scroll', 'Sidebar nav', 'Two columns', 'Accordion', 'Stacked cards', 'Profile + danger'],
  M: ['Inline banner', 'Header chip', 'Modal center', 'Bottom bar', 'Toast + bar', 'Sidebar widget', 'Floating panel'],
  N: ['Classic dropdown', 'Avatar trigger', 'Grouped menu', 'Icon links', 'Profile header', 'Mobile sheet', 'Text trigger'],
  O: ['Top right stack', 'Bottom right', 'Top center', 'Inline banner', 'Rich toast', 'Minimal pill', 'With action btn'],
  P: ['Pill badges', 'Outlined', 'Dot + text', 'Square tags', 'Soft fill', 'Bold solid', 'With icon'],
  Q: ['Center illustration', 'Compact inline', 'Card in table', 'Split CTA', 'Minimal text', 'Large hero', 'Side by side'],
};

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

function shell(content, opts = {}) {
  const { sidebar = 'left', topNav = false, collapsed = false, breadcrumbs = false, wide = false, activeNav = 0 } = opts;
  const navItems = ['Dashboard', 'Сделки', 'Интеграции', 'Настройки'];
  const nav = navItems.map((n, i) =>
    `<div class="nav-item${i === activeNav ? ' active' : ''}">${n}</div>`
  ).join('');
  const bc = breadcrumbs ? '<div class="bc">CRMForge / Dashboard</div>' : '';
  const side = `<aside class="sidebar${collapsed ? ' collapsed' : ''}${sidebar === 'right' ? ' right' : ''}"><div class="logo"><span class="logo-i">CF</span>${collapsed ? '' : ' CRMForge'}</div>${nav}</aside>`;
  const mainCls = `main${wide ? ' wide' : ''}`;

  if (topNav) {
    const top = `<header class="topnav">${nav.replace(/nav-item/g, 'top-item')}</header>`;
    return `<div class="shell top-only">${top}<main class="${mainCls}">${bc}${content}</main></div>`;
  }
  if (sidebar === 'right') {
    return `<div class="shell"><div class="shell-main"><main class="${mainCls}">${bc}${content}</main>${side}</div></div>`;
  }
  return `<div class="shell">${side}<main class="${mainCls}">${bc}${content}</main></div>`;
}

function profileCornerMenu(open = true) {
  const panel = userMenuPanel(
    `<div class="menu-user-block"><span class="avatar sm">IK</span><div><b>Igor K.</b><small>igor@example.com</small></div></div><div class="menu-sep"></div><div class="menu-group"><span class="menu-group-lbl">Аккаунт</span><a class="menu-item linkish" href="l-s01-settings.html">Профиль</a><a class="menu-item linkish" href="l-s01-settings.html">Безопасность</a></div><div class="menu-sep"></div><a class="menu-item linkish danger" href="c-a01-login.html">Выйти</a>`,
    'wide'
  );
  return `<div class="user-menu profile-corner${open ? ' open' : ''}"><button class="profile-orb" type="button" aria-label="Меню профиля"><span>IK</span></button>${panel}</div>`;
}

function shellA5(content, activeNav = 0) {
  const navItems = [
    { label: 'Dashboard', href: 'g-d01-dashboard.html' },
    { label: 'Сделки', href: 'h-dl01-deals-list.html' },
    { label: 'Интеграции', href: 'j-i01-integrations.html' },
    { label: 'Настройки', href: 'l-s01-settings.html' },
  ];
  const nav = navItems.map((n, i) =>
    `<a class="nav-item${i === activeNav ? ' active' : ''}" href="${n.href}">${n.label}</a>`
  ).join('');
  return `<div class="shell shell-a5"><aside class="sidebar sidebar-a5"><div class="logo"><span class="logo-i">CF</span> CRMForge</div><nav class="sidebar-nav">${nav}</nav><div class="sidebar-prefs"><div class="pref-group"><button class="pref-btn on" type="button">RU</button><button class="pref-btn" type="button">EN</button></div><button class="pref-btn pref-theme" type="button" aria-label="Тема">🌙</button></div></aside><div class="shell-main-col"><header class="shell-top-corner">${profileCornerMenu(true)}</header><main class="main main-a5">${content}</main></div></div>`;
}

function dashPageA5(activeNav = 0) {
  return shellA5(`<nav class="page-bc" aria-label="Breadcrumb"><a href="g-d01-dashboard.html">CRMForge</a><span>/</span><span>Dashboard</span></nav>${dashHeader()}${dashStats('r4')}<div class="dash-grid">${dashDealsTable()}${dashIntegration()}</div>`, activeNav);
}

const AUTH_HINT = '<p class="hint">Нет аккаунта? <a href="#">Регистрация</a></p>';
const AUTH_DIVIDER = '<div class="auth-divider"><span>или</span></div>';

function googleBtn(size = '', label = 'Войти через Google') {
  return `<button class="btn btn-google full${size ? ` ${size}` : ''}" type="button"><span class="g-icon" aria-hidden="true"></span>${label}</button>`;
}

function loginFields() {
  return '<input class="input" type="email" placeholder="Email" /><input class="input" type="password" placeholder="Пароль" /><button class="btn btn-p full" type="button">Войти</button>';
}

function loginBlock(order = 'email-first') {
  if (order === 'google-first') {
    return googleBtn() + AUTH_DIVIDER + loginFields() + AUTH_HINT;
  }
  return loginFields() + AUTH_DIVIDER + googleBtn() + AUTH_HINT;
}

const REGISTER_HINT = '<p class="hint">Уже есть аккаунт? <a href="c-a01-login.html">Войти</a></p>';

function registerFields() {
  return '<input class="input" type="email" placeholder="Email" /><input class="input" placeholder="Имя (optional)" /><input class="input" type="password" placeholder="Пароль" /><select class="input"><option>RU</option><option>EN</option></select><button class="btn btn-p full" type="button">Создать аккаунт</button>';
}

function registerBlock(order = 'email-first') {
  const google = googleBtn('', 'Зарегистрироваться через Google');
  if (order === 'google-first') {
    return google + AUTH_DIVIDER + registerFields() + REGISTER_HINT;
  }
  return registerFields() + AUTH_DIVIDER + google + REGISTER_HINT;
}

function dashHeader(subtitle = 'Обзор сделок и статус интеграции amoCRM') {
  return `<header class="dash-hdr"><div><h1>Dashboard</h1><p class="sub">${subtitle}</p></div><button class="btn btn-p sm" type="button">↻ Синхронизировать</button></header>`;
}

function dashStats(layout = 'r4') {
  const cards = `
    <div class="stat-card"><span class="stat-lbl">Всего сделок</span><span class="stat-val">248</span><span class="stat-delta up">↑ 12% за месяц</span></div>
    <div class="stat-card"><span class="stat-lbl">Выиграно</span><span class="stat-val">64</span><span class="stat-delta up">↑ 8 новых</span></div>
    <div class="stat-card"><span class="stat-lbl">В работе</span><span class="stat-val">142</span><span class="stat-delta muted">без изменений</span></div>
    <div class="stat-card"><span class="stat-lbl">Pipeline</span><span class="stat-val">₽4.2M</span><span class="stat-delta up">↑ ₽320K</span></div>`;
  if (layout === 'strip') {
    return `<div class="stats-strip"><span><b>248</b> сделок</span><span><b>64</b> won</span><span><b>142</b> open</span><span><b>₽4.2M</b> pipeline</span></div>`;
  }
  if (layout === 'sidebar') {
    return `<div class="stats-side">${cards.replace(/stat-card/g, 'stat-card compact')}</div>`;
  }
  const cls = layout === 'g2' ? 'stats g2' : 'stats r4';
  return `<div class="${cls}">${cards}</div>`;
}

function dashDealsTable() {
  return `<div class="card dash-card"><div class="card-hdr"><span class="card-title">Последние сделки</span><a class="card-link" href="h-dl01-deals-list.html">Все сделки →</a></div><table class="tbl"><thead><tr><th>Сделка</th><th>Сумма</th><th>Статус</th><th>Контакт</th></tr></thead><tbody>
    <tr><td><div class="cell-main">Внедрение CRM — ООО Альфа</div><div class="cell-sub">Синхр. 2 мин назад</div></td><td>₽450 000</td><td><span class="badge open">В работе</span></td><td>Иван Петров</td></tr>
    <tr><td><div class="cell-main">Лицензия Enterprise</div><div class="cell-sub">Синхр. 15 мин назад</div></td><td>₽1 200 000</td><td><span class="badge won">Выиграна</span></td><td>Мария Сидорова</td></tr>
    <tr><td><div class="cell-main">Поддержка Q2</div><div class="cell-sub">Синхр. 3 ч назад</div></td><td>₽210 000</td><td><span class="badge open">В работе</span></td><td>Елена Волкова</td></tr>
  </tbody></table></div>`;
}

function dashIntegration() {
  return `<div class="card dash-card"><div class="card-hdr"><span class="card-title">Интеграции</span></div><div class="int-widget"><div class="int-row-live"><span class="amo-badge">a</span><div><b>amoCRM</b><span class="ok-line"><i class="dot"></i>Подключено · demo</span></div></div><div class="sync-box"><p>Последняя синхронизация: сегодня, 14:32</p><button class="btn btn-p full sm" type="button">↻ Синхронизировать</button></div></div></div>`;
}

function dashEmptyBanner() {
  return `<div class="dash-banner"><div><b>Интеграция не подключена</b><p class="sub">Подключите amoCRM для импорта сделок</p></div><button class="btn btn-p sm" type="button">Connect amoCRM</button></div>`;
}

function checkEmailBody(v) {
  if (v === 1) {
    return `<div class="auth-wrap"><div class="auth-card email-card"><div class="mail-icon" aria-hidden="true"></div><h1>Проверьте почту</h1><p class="sub">Мы отправили ссылку подтверждения на <strong>user@example.com</strong></p><div class="steps-hint"><span class="done">1. Регистрация</span><span class="on">2. Email</span><span>3. Вход</span></div><button class="btn full" type="button">Отправить письмо снова</button><p class="hint"><a href="c-a01-login.html">Вернуться ко входу</a></p></div></div>`;
  }
  return null;
}

function verifyEmailBody(v) {
  if (v === 1) {
    return `<div class="auth-wrap"><div class="auth-card verify-card"><div class="verify-spinner" aria-hidden="true"></div><h1>Подтверждаем email</h1><p class="sub">Проверяем token из ссылки…</p><div class="prog verify-prog"><div class="fill indeterminate"></div></div><p class="hint muted-xs">Обычно занимает несколько секунд</p></div></div>`;
  }
  return null;
}

const DEALS = [
  { title: 'Внедрение CRM — ООО Альфа', amount: '₽450 000', status: 'open', label: 'В работе', contact: 'Иван Петров', synced: '2 мин назад' },
  { title: 'Лицензия Enterprise', amount: '₽1 200 000', status: 'won', label: 'Выиграна', contact: 'Мария Сидорова', synced: '15 мин назад' },
  { title: 'Консультация — стартап Beta', amount: '₽85 000', status: 'lost', label: 'Проиграна', contact: 'Алексей К.', synced: '1 ч назад' },
  { title: 'Поддержка Q2', amount: '₽210 000', status: 'open', label: 'В работе', contact: 'Елена Волкова', synced: '3 ч назад' },
  { title: 'Интеграция amoCRM', amount: '₽320 000', status: 'won', label: 'Выиграна', contact: 'Дмитрий Орлов', synced: 'вчера' },
  { title: 'Аудит CRM-процессов', amount: '₽175 000', status: 'open', label: 'В работе', contact: 'Ольга М.', synced: 'вчера' },
  { title: 'Пилот на 3 месяца', amount: '₽95 000', status: 'lost', label: 'Проиграна', contact: 'Павел Н.', synced: '2 дня назад' },
  { title: 'Обучение команды sales', amount: '₽140 000', status: 'open', label: 'В работе', contact: 'Анна Т.', synced: '3 дня назад' },
];

const SAMPLE_DEAL = {
  title: 'Внедрение CRM — ООО Альфа',
  amount: '₽450 000',
  status: 'open',
  label: 'В работе',
  contact: 'Иван Петров',
  phone: '+7 916 123-45-67',
  email: 'ivan@alfa.ru',
  company: 'ООО Альфа',
  synced: '2 мин назад',
  amoId: '28491631',
  created: '12 мар 2026',
  json: `{
  "id": 28491631,
  "name": "Внедрение CRM — ООО Альфа",
  "price": 450000,
  "status_id": 142,
  "pipeline_id": 512,
  "contact": { "id": 9912, "name": "Иван Петров" },
  "synced_at": "2026-03-14T14:30:00Z"
}`,
};

function dealShell(content) {
  return shell(content, { activeNav: 1 });
}

function badge(status, text) {
  return `<span class="badge ${status}">${esc(text)}</span>`;
}

function dealsPageHdr() {
  return `<header class="deals-hdr"><div><h1>Сделки</h1><p class="sub">248 сделок · синхронизировано из amoCRM</p></div><button class="btn btn-p sm" type="button">↻ Синхронизировать</button></header>`;
}

function dealsPagination() {
  return `<div class="pagination"><span class="pg-info">Страница 1 из 31 · 8 из 248</span><div class="pg-btns"><button class="btn sm" type="button" disabled>←</button><button class="btn sm active-pg" type="button">1</button><button class="btn sm" type="button">2</button><button class="btn sm" type="button">3</button><button class="btn sm" type="button">→</button></div></div>`;
}

function dealsTableRows(dense = false) {
  return DEALS.map((d) => {
    if (dense) {
      return `<tr><td><div class="cell-main">${esc(d.title)}</div></td><td>${esc(d.amount)}</td><td>${badge(d.status, d.label)}</td><td>${esc(d.contact)}</td><td class="muted-cell">${esc(d.synced)}</td></tr>`;
    }
    return `<tr><td><div class="cell-main">${esc(d.title)}</div><div class="cell-sub">ID amoCRM · ${esc(d.synced)}</div></td><td>${esc(d.amount)}</td><td>${badge(d.status, d.label)}</td><td>${esc(d.contact)}</td><td class="muted-cell">${esc(d.synced)}</td></tr>`;
  }).join('');
}

function dealsFullTable(opts = {}) {
  const { dense = false, sticky = false } = opts;
  const cls = ['card', 'dash-card', 'deals-tbl-wrap', sticky ? 'sticky-wrap' : ''].filter(Boolean).join(' ');
  return `<div class="${cls}"><table class="tbl full${dense ? ' dense' : ''}"><thead><tr><th>Сделка</th><th>Сумма</th><th>Статус</th><th>Контакт</th><th>Синхр.</th></tr></thead><tbody>${dealsTableRows(dense)}</tbody></table>${dealsPagination()}</div>`;
}

function dealsFilterSidebar() {
  return `<aside class="filters-panel"><h3>Фильтры</h3><label class="flbl">Поиск</label><input class="input" placeholder="Название, контакт..." /><label class="flbl">Статус</label><select class="input"><option>Все статусы</option><option>В работе</option><option>Выиграна</option><option>Проиграна</option></select><label class="flbl">Сортировка</label><select class="input"><option>Недавние</option><option>По сумме</option></select><button class="btn btn-p full sm" type="button">Применить</button><p class="hint">Найдено: 248</p></aside>`;
}

function dealsFilterBar() {
  return `<div class="deals-filter-bar"><input class="input search-inp" placeholder="Поиск сделок..." /><select class="input"><option>Все статусы</option><option>В работе</option><option>Выиграна</option><option>Проиграна</option></select><button class="btn btn-p sm" type="button">Фильтр</button><span class="filter-count">248 сделок</span></div>`;
}

function dealsCardGrid() {
  return `<div class="deal-cards-grid">${DEALS.map((d) =>
    `<div class="deal-card-rich"><div class="dc-top"><b>${esc(d.title)}</b>${badge(d.status, d.label)}</div><div class="dc-meta"><span>${esc(d.amount)}</span><span>${esc(d.contact)}</span></div><div class="dc-foot">Синхр. ${esc(d.synced)}</div></div>`
  ).join('')}</div>${dealsPagination()}`;
}

function dealsKanban() {
  const cols = [
    { key: 'open', title: 'В работе', items: DEALS.filter((d) => d.status === 'open') },
    { key: 'won', title: 'Выиграна', items: DEALS.filter((d) => d.status === 'won') },
    { key: 'lost', title: 'Проиграна', items: DEALS.filter((d) => d.status === 'lost') },
  ];
  return `<div class="kanban-board">${cols.map((c) =>
    `<div class="kanban-col"><div class="kanban-col-hdr"><h4>${c.title}</h4><span class="kanban-count">${c.items.length}</span></div>${c.items.map((d) =>
      `<div class="kanban-card"><b>${esc(d.title)}</b><span class="k-amt">${esc(d.amount)}</span><span class="k-contact">${esc(d.contact)}</span></div>`
    ).join('')}</div>`
  ).join('')}</div>`;
}

function dealFieldRows() {
  const d = SAMPLE_DEAL;
  return `
    <div class="field-row"><span class="flbl">Компания</span><span>${esc(d.company)}</span></div>
    <div class="field-row"><span class="flbl">Сумма</span><span class="fv">${esc(d.amount)}</span></div>
    <div class="field-row"><span class="flbl">Статус</span><span>${badge(d.status, d.label)}</span></div>
    <div class="field-row"><span class="flbl">Контакт</span><span>${esc(d.contact)}</span></div>
    <div class="field-row"><span class="flbl">Телефон</span><span>${esc(d.phone)}</span></div>
    <div class="field-row"><span class="flbl">Email</span><span>${esc(d.email)}</span></div>
    <div class="field-row"><span class="flbl">amoCRM ID</span><span class="mono">${esc(d.amoId)}</span></div>
    <div class="field-row"><span class="flbl">Создана</span><span>${esc(d.created)}</span></div>
    <div class="field-row"><span class="flbl">Синхронизация</span><span>${esc(d.synced)}</span></div>`;
}

function dealBackLink() {
  return '<a class="back" href="h-dl01-deals-list.html">← Все сделки</a>';
}

const INTEGRATIONS = [
  { name: 'amoCRM', slug: 'amocrm', logo: 'a', logoBg: '#3390ec', status: 'connected', label: 'Подключено', desc: '248 сделок · demo mode · синхр. сегодня 14:32', href: 'k-i02-amocrm-setup.html' },
  { name: 'Bitrix24', slug: 'bitrix', logo: 'B', logoBg: '#2fc6f6', status: 'soon', label: 'Скоро', desc: 'Импорт лидов и контактов', href: '#' },
  { name: 'HubSpot', slug: 'hubspot', logo: 'H', logoBg: '#ff7a59', status: 'soon', label: 'Скоро', desc: 'Marketing & sales CRM', href: '#' },
  { name: 'Salesforce', slug: 'salesforce', logo: 'S', logoBg: '#0176d3', status: 'soon', label: 'Скоро', desc: 'Enterprise CRM', href: '#' },
];

function intShell(content) {
  return shell(content, { activeNav: 2 });
}

function settingsShell(content) {
  return shell(content, { activeNav: 3 });
}

function intPageHdr() {
  return `<header class="deals-hdr"><div><h1>Интеграции</h1><p class="sub">Подключите CRM для синхронизации сделок</p></div><a class="btn btn-p sm" href="k-i02-amocrm-setup.html">amoCRM setup →</a></header>`;
}

function intStatusBadge(status, label) {
  if (status === 'connected') return `<span class="int-status ok"><i class="dot"></i>${esc(label)}</span>`;
  if (status === 'error') return `<span class="int-status err">Ошибка</span>`;
  return `<span class="int-status soon">${esc(label)}</span>`;
}

function intProviderLogo(item) {
  return `<span class="int-logo" style="background:${item.logoBg}">${esc(item.logo)}</span>`;
}

function intListRows() {
  return `<div class="int-list-rich">${INTEGRATIONS.map((item) => {
    const cls = item.status === 'soon' ? ' dim' : '';
    const action = item.status === 'connected'
      ? `<a class="btn sm" href="${item.href}">Настроить →</a>`
      : `<button class="btn sm" type="button" disabled>Скоро</button>`;
    return `<div class="int-list-item${cls}"><div class="int-list-left">${intProviderLogo(item)}<div><b>${esc(item.name)}</b><p class="sub">${esc(item.desc)}</p></div></div><div class="int-list-right">${intStatusBadge(item.status, item.label)}${action}</div></div>`;
  }).join('')}</div>`;
}

function intCardGrid(large = false) {
  const cls = large ? 'int-grid lg' : 'int-grid';
  return `<div class="${cls}">${INTEGRATIONS.map((item) => {
    const off = item.status === 'soon' ? ' off' : ' on';
    return `<div class="int-card${off}"><div class="int-card-top">${intProviderLogo(item)}${intStatusBadge(item.status, item.label)}</div><b>${esc(item.name)}</b><p class="sub">${esc(item.desc)}</p>${item.status === 'connected' ? `<a class="card-link" href="${item.href}">Настроить →</a>` : '<span class="hint">Недоступно</span>'}</div>`;
  }).join('')}</div>`;
}

function intTableList() {
  return `<div class="card dash-card"><table class="tbl full"><thead><tr><th>Провайдер</th><th>Описание</th><th>Статус</th><th></th></tr></thead><tbody>${INTEGRATIONS.map((item) =>
    `<tr${item.status === 'soon' ? ' class="dim-row"' : ''}><td><div class="cell-main">${intProviderLogo(item)} ${esc(item.name)}</div></td><td class="muted-cell">${esc(item.desc)}</td><td>${intStatusBadge(item.status, item.label)}</td><td>${item.status === 'connected' ? `<a class="card-link" href="${item.href}">Setup</a>` : '—'}</td></tr>`
  ).join('')}</tbody></table></div>`;
}

function intFeaturedBlock() {
  const amo = INTEGRATIONS[0];
  return `<div class="int-featured-rich">${intProviderLogo(amo)}<div class="int-featured-body"><div class="int-featured-top"><b>${esc(amo.name)}</b>${intStatusBadge('connected', amo.label)}</div><p class="sub">${esc(amo.desc)}</p><div class="int-featured-actions"><a class="btn btn-p sm" href="${amo.href}">Настроить</a><button class="btn sm" type="button">↻ Sync</button></div></div></div><div class="int-soon-list"><p class="flbl">Скоро</p>${INTEGRATIONS.slice(1).map((i) => `<div class="int-soon-item">${intProviderLogo(i)}<span>${esc(i.name)}</span></div>`).join('')}</div>`;
}

function intSplitSections() {
  const active = INTEGRATIONS.filter((i) => i.status === 'connected');
  const soon = INTEGRATIONS.filter((i) => i.status === 'soon');
  return `<div class="int-split-rich"><section><h3 class="sec-title">Активные</h3>${active.map((item) =>
    `<div class="int-card on"><div class="int-card-top">${intProviderLogo(item)}${intStatusBadge(item.status, item.label)}</div><b>${esc(item.name)}</b><p class="sub">${esc(item.desc)}</p><a class="btn btn-p sm" href="${item.href}">Открыть setup</a></div>`
  ).join('')}</section><section class="dim-sec"><h3 class="sec-title">Скоро</h3>${soon.map((item) =>
    `<div class="int-card off"><div class="int-card-top">${intProviderLogo(item)}${intStatusBadge(item.status, item.label)}</div><b>${esc(item.name)}</b><p class="sub">${esc(item.desc)}</p></div>`
  ).join('')}</section></div>`;
}

function intScrollRow() {
  return `<div class="int-scroll-rich">${INTEGRATIONS.map((item) =>
    `<div class="int-card scroll-card${item.status === 'soon' ? ' off' : ' on'}">${intProviderLogo(item)}<b>${esc(item.name)}</b>${intStatusBadge(item.status, item.label)}</div>`
  ).join('')}</div>`;
}

function amoSetupHdr(connected = true) {
  return `<a class="back" href="j-i01-integrations.html">← Интеграции</a><header class="setup-hdr"><div class="setup-hdr-left">${intProviderLogo(INTEGRATIONS[0])}<div><h1>amoCRM</h1><p class="sub">${connected ? 'demo.crmforge · подключено' : 'OAuth или demo mode'}</p></div></div>${connected ? intStatusBadge('connected', 'Подключено') : intStatusBadge('soon', 'Не подключено')}</header>`;
}

function amoConnectedPanel() {
  return `<div class="setup-status-card"><div class="setup-row"><span class="flbl">Subdomain</span><span class="mono">demo.crmforge</span></div><div class="setup-row"><span class="flbl">Режим</span><span>Demo (без OAuth)</span></div><div class="setup-row"><span class="flbl">Последняя синхр.</span><span>сегодня, 14:32 · 248 сделок</span></div><div class="setup-row"><span class="flbl">Статус</span><span class="int-status ok"><i class="dot"></i>Работает</span></div></div>`;
}

function amoActions(primary = 'full') {
  const full = primary === 'full';
  return `<div class="setup-actions${full ? ' col' : ''}"><button class="btn btn-p${full ? ' full' : ''}" type="button">Подключить через OAuth</button><button class="btn${full ? ' full' : ''}" type="button">Connect (demo)</button><button class="btn${full ? ' full' : ''}" type="button">Test connection</button><button class="btn danger${full ? ' full' : ''}" type="button">Disconnect</button></div>`;
}

function amoHelpAside() {
  return `<aside class="setup-help"><h3>Справка</h3><p>Для OAuth создайте интеграцию в кабинете amoCRM и укажите redirect URL.</p><ul class="help-list"><li>OAuth — production</li><li>Demo — без реального amoCRM</li><li>Test — проверка токена</li></ul><a class="text-link" href="https://www.amocrm.ru/developers/" target="_blank" rel="noopener">developers.amocrm.ru →</a></aside>`;
}

function amoWizard(steps) {
  const labels = ['Connect', 'Test', 'Sync'];
  return `<div class="setup-wizard">${labels.map((l, i) =>
    `<div class="wizard-step${steps > i ? ' done' : ''}${steps === i + 1 ? ' on' : ''}"><span class="wizard-num">${i + 1}</span>${l}</div>`
  ).join('')}</div>`;
}

function settingsPageHdr() {
  return `<header class="deals-hdr"><div><h1>Настройки</h1><p class="sub">Профиль, безопасность и язык интерфейса</p></div><span class="avatar lg">IK</span></header>`;
}

function settingsProfileFields() {
  return `<div class="settings-section"><h3 class="sec-title">Профиль</h3><label class="flbl">Имя</label><input class="input" value="Igor K." /><label class="flbl">Email</label><input class="input" value="igor@example.com" readonly /><p class="hint">Email меняется через поддержку</p><button class="btn btn-p sm" type="button">Сохранить</button></div>`;
}

function settingsPasswordFields() {
  return `<div class="settings-section"><h3 class="sec-title">Смена пароля</h3><label class="flbl">Текущий пароль</label><input class="input" type="password" placeholder="••••••••" /><label class="flbl">Новый пароль</label><input class="input" type="password" placeholder="мин. 8 символов" /><label class="flbl">Подтверждение</label><input class="input" type="password" placeholder="повторите пароль" /><button class="btn btn-p sm" type="button">Обновить пароль</button></div>`;
}

function settingsLanguageFields() {
  return `<div class="settings-section"><h3 class="sec-title">Язык интерфейса</h3><label class="flbl">Locale</label><select class="input"><option selected>Русский (RU)</option><option>English (EN)</option></select><p class="hint">Применяется ко всему UI и email-уведомлениям</p><button class="btn btn-p sm" type="button">Сохранить язык</button></div>`;
}

function settingsDangerZone() {
  return `<div class="settings-section danger-sec"><h3 class="sec-title danger-t">Опасная зона</h3><p class="sub">Отключение amoCRM удалит токены интеграции. Сделки в CRMForge останутся.</p><button class="btn danger sm" type="button">Отключить amoCRM</button></div>`;
}

function settingsNav(active = 'profile') {
  const items = [
    { id: 'profile', label: 'Профиль' },
    { id: 'security', label: 'Безопасность' },
    { id: 'language', label: 'Язык' },
    { id: 'danger', label: 'Danger zone' },
  ];
  return `<nav class="settings-nav">${items.map((i) =>
    `<div class="settings-nav-item${active === i.id ? ' on' : ''}">${esc(i.label)}</div>`
  ).join('')}</nav>`;
}

function dashPreviewMini() {
  return `<div class="dash-preview-mini"><div class="stats r4">${['248', '89', '142', '₽4.2M'].map((v, i) => {
    const labels = ['Всего', 'Выиграно', 'В работе', 'Pipeline'];
    return `<div class="stat-card compact"><span class="stat-lbl">${labels[i]}</span><span class="stat-val">${v}</span></div>`;
  }).join('')}</div><div class="card dash-card preview-fade"><table class="tbl dense"><tr><td>Внедрение CRM</td><td><span class="badge open">В работе</span></td></tr><tr><td>Лицензия Enterprise</td><td><span class="badge won">Выиграна</span></td></tr></table></div></div>`;
}

function appTopbar(menuHtml) {
  return `<header class="app-topbar"><div class="topbar-brand"><span class="logo-i sm">CF</span><span class="topbar-title">Dashboard</span></div><div class="topbar-actions"><button class="btn sm ghost" type="button">RU</button><button class="btn sm ghost" type="button">☀️</button><span class="sync-chip sm ok-chip">amoCRM ✓</span>${menuHtml}</div></header>`;
}

function userMenuPanel(items, extraClass = '') {
  return `<div class="user-menu-panel${extraClass ? ` ${extraClass}` : ''}">${items}</div>`;
}

function userMenuClassic() {
  const panel = userMenuPanel(`<div class="menu-item"><span class="menu-ico user"></span>Профиль</div><div class="menu-item"><span class="menu-ico gear"></span>Настройки</div><div class="menu-sep"></div><div class="menu-item danger"><span class="menu-ico out"></span>Выйти</div>`);
  return `<div class="user-menu open"><button class="user-menu-trigger" type="button"><span class="avatar sm">IK</span><span class="user-menu-name">Igor K.</span><span class="chev">▾</span></button>${panel}</div>`;
}

function userMenuShell(menuHtml) {
  return shell(`${appTopbar(menuHtml)}${dashPreviewMini()}`);
}

function userMenuAvatarOnly() {
  const panel = userMenuPanel(`<div class="menu-item">Настройки</div><div class="menu-item danger">Выйти</div>`, 'compact');
  return `<div class="user-menu open avatar-only"><button class="user-menu-trigger icon-only" type="button"><span class="avatar sm">IK</span></button>${panel}</div>`;
}

function userMenuSplit() {
  const panel = userMenuPanel(`<div class="menu-user-block"><span class="avatar sm">IK</span><div><b>Igor K.</b><small>igor@example.com</small></div></div><div class="menu-sep"></div><div class="menu-group"><span class="menu-group-lbl">Аккаунт</span><div class="menu-item">Профиль</div><div class="menu-item">Настройки</div></div><div class="menu-sep"></div><div class="menu-item danger">Выйти</div>`, 'wide');
  return `<div class="user-menu open"><button class="user-menu-trigger" type="button"><span class="avatar sm">IK</span><span class="chev">▾</span></button>${panel}</div>`;
}

function userMenuIcons() {
  const panel = userMenuPanel(`<a class="menu-item linkish"><span class="menu-ico user"></span>Профиль</a><a class="menu-item linkish"><span class="menu-ico gear"></span>Настройки</a><a class="menu-item linkish danger"><span class="menu-ico out"></span>Выйти</a>`, 'icons');
  return `<div class="user-menu open"><button class="user-menu-trigger" type="button"><span class="avatar sm">IK</span><span class="user-menu-name">Igor</span><span class="chev">▾</span></button>${panel}</div>`;
}

function userMenuProfileHeader() {
  const panel = userMenuPanel(`<div class="menu-profile-hdr"><span class="avatar lg">IK</span><div><b>Igor K.</b><small>igor@example.com</small><span class="menu-role">Admin</span></div></div><div class="menu-sep"></div><div class="menu-item">Настройки</div><div class="menu-item danger">Выйти</div>`, 'profile');
  return `<div class="user-menu open"><button class="user-menu-trigger" type="button"><span class="avatar sm">IK</span><span class="chev">▾</span></button>${panel}</div>`;
}

function userMenuSheet() {
  return shell(`<div class="user-menu-sheet-wrap">${appTopbar('<button class="user-menu-trigger icon-only" type="button"><span class="avatar sm">IK</span></button>')}${dashPreviewMini()}<div class="sheet-backdrop"></div><div class="user-sheet"><div class="sheet-handle"></div><div class="menu-profile-hdr"><span class="avatar lg">IK</span><div><b>Igor K.</b><small>igor@example.com</small></div></div><div class="menu-item">Профиль</div><div class="menu-item">Настройки</div><div class="menu-sep"></div><div class="menu-item danger">Выйти</div></div></div>`);
}

function userMenuMinimal() {
  const panel = userMenuPanel(`<div class="menu-item plain">Настройки</div><div class="menu-item plain danger">Выйти</div>`, 'minimal');
  return `<div class="user-menu open minimal"><button class="user-menu-trigger text" type="button">Igor K. ▾</button>${panel}</div>`;
}

function syncFloatingPanel() {
  return shell(`${dashHeader()}${dashStats('r4')}<div class="dash-preview-body">${dashDealsTable()}</div><div class="sync-float-card" role="status"><div class="sync-float-hdr"><span class="sync-float-spin">↻</span><div><b>Синхронизация amoCRM</b><p class="sub">17 / 28 сделок · ~30 сек</p></div><button class="btn sm ghost sync-float-close" type="button" aria-label="Свернуть">×</button></div><div class="prog sync-float-prog"><div class="fill" style="width:61%"></div></div><p class="hint sync-float-hint">Работа в приложении не блокируется</p></div>`);
}

function toastRichDemo() {
  return `<div class="toast-stage tr"><div class="toast rich toast-success"><div class="toast-icon ok">✓</div><div class="toast-body"><b>Синхронизация завершена</b><p>Импортировано 12 новых сделок из amoCRM</p><button class="btn btn-p sm" type="button">Открыть сделки</button></div><button class="toast-close" type="button" aria-label="Закрыть">×</button></div></div>`;
}

function badgeSoftDemo() {
  return shell(`${dealsPageHdr()}<div class="card dash-card deals-tbl-wrap"><table class="tbl full"><thead><tr><th>Сделка</th><th>Сумма</th><th>Статус</th><th>Контакт</th></tr></thead><tbody>${DEALS.slice(0, 5).map((d) =>
    `<tr><td><div class="cell-main">${esc(d.title)}</div></td><td>${esc(d.amount)}</td><td><span class="badge soft ${d.status}">${esc(d.label)}</span></td><td class="muted-cell">${esc(d.contact)}</td></tr>`
  ).join('')}</tbody></table></div>`);
}

function emptyStateCenter() {
  return dealShell(`<header class="deals-hdr"><div><h1>Сделки</h1><p class="sub">Пока нет импортированных сделок</p></div><button class="btn btn-p sm" type="button">↻ Синхронизировать</button></header><div class="empty-state-rich"><div class="empty-illus" aria-hidden="true"><span class="empty-illus-inbox"></span></div><h2>Нет сделок</h2><p class="sub">Подключите amoCRM и синхронизируйте лиды — они появятся здесь</p><div class="empty-actions"><button class="btn btn-p" type="button">↻ Синхронизировать</button><a class="btn sm" href="k-i02-amocrm-setup.html">Настроить amoCRM</a></div></div>`);
}

function notFoundBody(variant) {
  const home = '<button class="btn btn-p" type="button">На dashboard</button>';
  const loginLink = '<a class="btn btn-ghost sm" href="c-a01-login.html">Войти</a>';
  switch (variant) {
    case 1:
      return `<div class="center-page"><p class="err-code">404</p><h1>Страница не найдена</h1><p class="sub">Запрошенный URL не существует</p>${home}</div>`;
    case 2:
      return `<div class="center-page err-hero"><div class="mega-bg" aria-hidden="true">404</div><h1>Упс!</h1><p class="sub">Такой страницы нет в CRMForge</p><div class="row-actions">${home}${loginLink}</div></div>`;
    case 3:
      return `<div class="split-page"><div class="split-left art err-art"><span>404</span></div><div class="split-right"><h1>Не найдено</h1><p class="sub">Проверьте адрес или вернитесь на главную</p>${home}<p class="hint" style="margin-top:16px">Нужен доступ? <a class="text-link" href="c-a01-login.html">Войти</a></p></div></div>`;
    case 4:
      return shell(`<div class="err-in-shell"><p class="err-code sm">404</p><h1>Страница не найдена</h1><p class="sub">Вы остались в layout приложения</p>${home}</div>`);
    case 5:
      return `<div class="center-page"><div class="card-box err-card"><p class="err-code sm">404</p><h1>Не существует</h1><p class="sub">Возможно, ссылка устарела</p>${home}</div></div>`;
    case 6:
      return `<div class="center-page"><h1>404</h1><p class="sub">Попробуйте найти нужный раздел</p><input class="input search-404" placeholder="Поиск: сделки, интеграции..." />${home}</div>`;
    case 7:
      return `<div class="center-page"><div class="illus">🧭</div><h1>Потерялись?</h1><p class="sub">Страница не найдена</p><div class="links row-links"><a href="g-d01-dashboard.html">Dashboard</a><a href="h-dl01-deals-list.html">Сделки</a><a href="c-a01-login.html">Войти</a></div></div>`;
    default:
      return '';
  }
}

function variantsHtml(letter, labels, bodies) {
  return bodies.map((body, i) =>
    `<div class="variant${i === 0 ? ' active' : ''}" data-v="${i + 1}">
      <div class="variant-tag">Вариант ${i + 1} — ${esc(labels[i])}</div>
      ${body}
    </div>`
  ).join('\n');
}

function renderScreen(screen) {
  const L = VARIANT_LABELS[screen.letter];
  let bodies = [];

  switch (screen.letter) {
    case 'A':
      bodies = [
        shell('<div class="ph"><h1>Dashboard</h1><p>Контент страницы</p><div class="placeholder">Область контента</div></div>'),
        shell('<div class="ph"><h1>Dashboard</h1><div class="placeholder">Icon-only sidebar · 64px</div></div>', { collapsed: true }),
        shell('<div class="ph"><h1>Dashboard</h1><div class="placeholder">Top nav layout</div></div>', { topNav: true }),
        shell('<div class="ph"><h1>Dashboard</h1><div class="placeholder">Sidebar справа</div></div>', { sidebar: 'right' }),
        dashPageA5(0),
        shell(`<div class="stats r4"><div class="stat">248<span>сделок</span></div><div class="stat">64<span>won</span></div><div class="stat">142<span>open</span></div><div class="stat">₽4.2M<span>pipeline</span></div></div><div class="grid-2-sub"><div class="card placeholder flat">Recent deals</div><div class="card placeholder flat">Integration status</div></div>`, { collapsed: true, wide: true }),
        `<div class="shell dual-nav"><aside class="sidebar wide-nav"><div class="logo"><span class="logo-i">CF</span> CRMForge</div><div class="nav-group"><small>Main</small><div class="nav-item active">Dashboard</div><div class="nav-item">Сделки</div></div><div class="nav-group"><small>System</small><div class="nav-item">Интеграции</div><div class="nav-item">Настройки</div></div><div class="sidebar-foot">Sync: OK</div></aside><main class="main"><div class="ph"><h1>Dashboard</h1><div class="placeholder">Grouped nav · Main / System sections</div></div></main></div>`,
      ];
      break;
    case 'B':
      bodies = [1, 2, 3, 4, 5, 6, 7].map((n) => notFoundBody(n));
      break;
    case 'C':
      bodies = [
        `<div class="auth-wrap"><div class="auth-card"><h1>Вход в CRMForge</h1>${loginBlock('email-first')}</div></div>`,
        `<div class="split-page"><div class="split-left brand"><h2>CRMForge</h2><p>CRM + синхронизация amoCRM</p><p class="sub">Portfolio-ready dashboard</p></div><div class="split-right auth-panel"><h1>Вход</h1>${loginBlock('email-first')}</div></div>`,
        `<div class="split-page"><div class="split-left auth-panel"><h1>Welcome back</h1>${loginBlock('google-first')}</div><div class="split-right art brand-art"><span>CF</span></div></div>`,
        `<div class="auth-wrap wide"><div class="auth-card wide login-cols"><h1>Вход</h1><div class="login-split-cols"><div class="col-email"><p class="col-label">Email</p>${loginFields()}</div><div class="col-divider"><span>или</span></div><div class="col-google"><p class="col-label">Google</p>${googleBtn('lg')}</div></div>${AUTH_HINT}</div></div>`,
        `<div class="auth-wrap"><div class="auth-card with-brand"><div class="brand-strip">CF</div><div class="body"><h1>Вход</h1>${loginBlock('email-first')}</div></div></div>`,
        `<div class="auth-wrap"><div class="auth-card google-hero"><div class="logo-top"><span class="logo-i lg">CF</span><span>CRMForge</span></div>${googleBtn('xl')}${AUTH_DIVIDER}<h2 class="h2-sm">Email и пароль</h2>${loginFields()}${AUTH_HINT}</div></div>`,
        `<div class="auth-wrap"><div class="auth-card compact">${loginFields()}${AUTH_DIVIDER}${googleBtn()}${AUTH_HINT}<footer class="auth-foot">RU / EN</footer></div></div>`,
      ];
      break;
    case 'D':
      bodies = [
        `<div class="auth-wrap"><div class="auth-card"><h1>Регистрация</h1>${registerBlock('email-first')}</div></div>`,
        `<div class="split-page"><div class="split-left brand"><h2>Начните бесплатно</h2><p class="sub">CRM + amoCRM за минуты</p><ul class="feat-list"><li>Синхронизация сделок</li><li>Dashboard</li><li>Demo mode</li></ul></div><div class="split-right auth-panel"><h1>Регистрация</h1>${registerBlock('email-first')}</div></div>`,
        '<div class="auth-wrap"><div class="auth-card compact"><h1>Register</h1><input class="input" placeholder="email@..." /><input class="input" type="password" placeholder="••••••" /><button class="btn btn-p full">→</button></div></div>',
        '<div class="auth-wrap"><div class="auth-card"><div class="steps"><span class="on">1</span><span>2</span></div><h1>Аккаунт</h1><input class="input" placeholder="Email" /><button class="btn btn-p full">Далее</button></div></div>',
        '<div class="auth-wrap wide"><div class="auth-card wide"><h1>Регистрация</h1><input class="input" placeholder="Email" /><input class="input" placeholder="Имя (optional)" /><input class="input" type="password" placeholder="Пароль" /><button class="btn btn-p">Создать</button></div></div>',
        '<div class="split-page"><div class="split-left art">🚀</div><div class="split-right"><h1>Join CRMForge</h1><input class="input" placeholder="Email" /><button class="btn btn-p full">Sign up</button></div></div>',
        '<div class="auth-wrap"><div class="auth-card minimal"><h1>Register</h1><input class="input" placeholder="Email" /><input class="input" type="password" placeholder="Password" /><button class="btn btn-p full">Create</button><p class="hint"><a>Login</a></p></div></div>',
      ];
      break;
    case 'E':
      bodies = [
        checkEmailBody(1),
        '<div class="split-page"><div class="split-left art mail-art"><div class="mail-envelope"></div></div><div class="split-right auth-panel"><h1>Check your email</h1><p class="sub">Подтвердите регистрацию — ссылка отправлена</p><button class="btn btn-p full" type="button">Resend email</button><p class="hint"><a href="c-a01-login.html">Login</a></p></div></div>',
        '<div class="center-page"><div class="card-box"><h1>Почта отправлена</h1><p>Откройте письмо от CRMForge</p></div></div>',
        '<div class="banner-page"><div class="banner info"><strong>Проверьте email</strong> — ссылка действует 24 часа</div></div>',
        '<div class="center-page"><div class="card-box"><h1>Verify email</h1><input class="input" placeholder="your@email.com" /><button class="btn btn-p full">Resend link</button></div></div>',
        '<div class="center-page"><div class="illus lg">📧</div><h1>Almost there!</h1><p>Click the link in your inbox</p></div>',
        '<div class="banner-page inline"><div class="inline-bar">✉️ Проверьте почту · <button class="btn sm">Resend</button></div></div>',
      ];
      break;
    case 'F':
      bodies = [
        verifyEmailBody(1),
        '<div class="center-page"><div class="illus ok">✓</div><h1>Email подтверждён!</h1><button class="btn btn-p">Войти</button></div>',
        '<div class="center-page"><div class="illus err">✕</div><h1>Ссылка недействительна</h1><button class="btn btn-p">Запросить новую</button></div>',
        '<div class="split-page"><div class="split-left ok-bg">OK</div><div class="split-right"><h1>Verified</h1><p>Redirect in 3s...</p></div></div>',
        '<div class="center-page minimal-status"><p>Email verified. Redirecting...</p></div>',
        '<div class="center-page"><div class="card-box"><div class="spinner sm"></div><h1>Verifying...</h1><p>→ /login через 3 сек</p></div></div>',
        '<div class="center-page"><div class="hero-icon">✉️</div><h1>Success!</h1><p>Можно войти в аккаунт</p><button class="btn btn-p">Login</button></div>',
      ];
      break;
    case 'G':
      bodies = [
        shell(`${dashHeader()}${dashStats('r4')}<div class="dash-grid">${dashDealsTable()}${dashIntegration()}</div>`),
        shell(`${dashHeader()}${dashStats('g2')}<div class="dash-full">${dashDealsTable()}</div>`),
        shell(`${dashHeader()}<div class="dash-layout-side">${dashStats('sidebar')}${dashDealsTable()}</div>${dashIntegration()}`),
        shell(`${dashHeader()}${dashStats('strip')}${dashDealsTable()}`),
        shell(`${dashHeader()}${dashDealsTable()}${dashStats('r4')}`),
        shell(`${dashEmptyBanner()}${dashHeader('Подключите CRM для начала работы')}${dashStats('r4')}<div class="dash-grid">${dashDealsTable()}${dashIntegration()}</div>`),
        shell(`${dashHeader()}<div class="dash-hero-stat"><div class="hero-num">248</div><div class="hero-meta"><span class="up">↑ 12% за месяц</span><span>сделок в pipeline</span></div></div><div class="dash-grid">${dashDealsTable()}${dashIntegration()}</div>`),
      ];
      break;
    case 'H':
      bodies = [
        dealShell(`${dealsPageHdr()}${dealsFullTable()}`),
        dealShell(`${dealsPageHdr()}<div class="deals-layout-split">${dealsFilterSidebar()}${dealsFullTable()}</div>`),
        dealShell(`${dealsPageHdr()}${dealsCardGrid()}`),
        dealShell(`${dealsPageHdr()}${dealsFullTable({ sticky: true })}`),
        dealShell(`${dealsPageHdr()}${dealsFullTable({ dense: true })}`),
        dealShell(`${dealsPageHdr()}${dealsFilterBar()}${dealsFullTable()}`),
        dealShell(`${dealsPageHdr()}${dealsKanban()}`),
      ];
      break;
    case 'I':
      bodies = [
        dealShell(`${dealBackLink()}<header class="deal-title-hdr"><h1>${esc(SAMPLE_DEAL.title)}</h1>${badge(SAMPLE_DEAL.status, SAMPLE_DEAL.label)}</header><div class="card dash-card deal-fields-card">${dealFieldRows()}</div>`),
        dealShell(`${dealBackLink()}<div class="detail-2col"><div class="card dash-card"><div class="card-hdr"><span class="card-title">Детали сделки</span></div><div class="deal-fields-pad">${dealFieldRows()}</div></div><div class="card dash-card json-card"><div class="card-hdr"><span class="card-title">Sync metadata</span></div><pre class="json-pre">${esc(SAMPLE_DEAL.json)}</pre></div></div>`),
        dealShell(`${dealBackLink()}<div class="hero-deal"><h1>${esc(SAMPLE_DEAL.title)}</h1>${badge(SAMPLE_DEAL.status, SAMPLE_DEAL.label)}</div><div class="tabs deal-tabs"><span class="on">Информация</span><span>Контакт</span><span>JSON</span></div><div class="card dash-card deal-fields-card">${dealFieldRows()}</div>`),
        dealShell(`${dealBackLink()}<div class="detail-side"><aside class="sum-card"><div class="sum-big">${esc(SAMPLE_DEAL.amount)}</div>${badge(SAMPLE_DEAL.status, SAMPLE_DEAL.label)}<p class="sub">${esc(SAMPLE_DEAL.contact)}</p><p class="hint">Синхр. ${esc(SAMPLE_DEAL.synced)}</p></aside><div class="card dash-card deal-fields-card">${dealFieldRows()}</div></div>`),
        dealShell(`${dealBackLink()}<div class="card dash-card"><div class="card-hdr"><span class="card-title">${esc(SAMPLE_DEAL.title)}</span>${badge(SAMPLE_DEAL.status, SAMPLE_DEAL.label)}</div><div class="timeline deal-tl"><div class="tl-item"><b>Создана в amoCRM</b><span>${esc(SAMPLE_DEAL.created)}</span></div><div class="tl-item"><b>Последняя синхронизация</b><span>${esc(SAMPLE_DEAL.synced)}</span></div><div class="tl-item"><b>Контакт обновлён</b><span>1 ч назад</span></div><div class="tl-item"><b>Импортирована</b><span>14 мар 2026, 14:28</span></div></div></div><div class="card dash-card deal-fields-card">${dealFieldRows()}</div>`),
        dealShell(`${dealBackLink()}<div class="detail-json"><div class="card dash-card"><div class="card-hdr"><span class="card-title">Поля сделки</span></div><div class="deal-fields-pad">${dealFieldRows()}</div></div><div class="card dash-card json-card sticky-json"><div class="card-hdr"><span class="card-title">Raw JSON</span><button class="btn sm" type="button">Copy</button></div><pre class="json-pre">${esc(SAMPLE_DEAL.json)}</pre></div></div>`),
        dealShell(`${dealBackLink()}<div class="deal-accordion"><details open><summary>Основное</summary><div class="deal-fields-pad">${dealFieldRows()}</div></details><details><summary>Контакт</summary><div class="deal-fields-pad"><div class="field-row"><span class="flbl">Имя</span><span>${esc(SAMPLE_DEAL.contact)}</span></div><div class="field-row"><span class="flbl">Email</span><span>${esc(SAMPLE_DEAL.email)}</span></div></div></details><details><summary>Sync metadata (JSON)</summary><pre class="json-pre">${esc(SAMPLE_DEAL.json)}</pre></details></div>`),
      ];
      break;
    case 'J':
      bodies = [
        intShell(`${intPageHdr()}${intCardGrid()}`),
        intShell(`${intPageHdr()}${intListRows()}`),
        intShell(`${intPageHdr()}${intFeaturedBlock()}`),
        intShell(`${intPageHdr()}${intTableList()}`),
        intShell(`${intPageHdr()}${intCardGrid(true)}`),
        intShell(`${intPageHdr()}${intScrollRow()}`),
        intShell(`${intPageHdr()}${intSplitSections()}`),
      ];
      break;
    case 'K':
      bodies = [
        intShell(`${amoSetupHdr(true)}${amoWizard(1)}<div class="setup-layout"><div class="card dash-card setup-panel">${amoConnectedPanel()}${amoActions('full')}<p class="hint">Шаг 1: подключите amoCRM через OAuth или demo</p></div>${amoHelpAside()}</div>`),
        intShell(`${amoSetupHdr(true)}<div class="setup-layout"><div class="card dash-card setup-panel"><h2 class="sec-title">Подключение amoCRM</h2>${amoConnectedPanel()}${amoActions('full')}</div>${amoHelpAside()}</div>`),
        intShell(`${amoSetupHdr(true)}<div class="tabs deal-tabs"><span class="on">Connected</span><span>Disconnected</span></div><div class="card dash-card setup-panel">${amoConnectedPanel()}<div class="setup-actions col"><button class="btn" type="button">Test connection</button><button class="btn danger full" type="button">Disconnect</button></div></div>`),
        intShell(`${amoSetupHdr(false)}<div class="setup-layout"><div class="card dash-card setup-panel"><h2 class="sec-title">Настройка</h2><p class="sub">Подключите amoCRM для синхронизации сделок</p>${amoActions('full')}</div>${amoHelpAside()}</div>`),
        intShell(`<div class="auth-wrap"><div class="auth-card setup-connect-card">${intProviderLogo(INTEGRATIONS[0])}<h1>amoCRM</h1><p class="sub">Подключите интеграцию для импорта лидов</p>${amoActions('full')}<a class="text-link" href="j-i01-integrations.html">← Назад к интеграциям</a></div></div>`),
        intShell(`${amoSetupHdr(false)}<div class="card dash-card setup-panel"><div class="setup-checklist"><div class="check-item done"><span>✓</span> Аккаунт CRMForge создан</div><div class="check-item on"><span>2</span> Подключить amoCRM</div><div class="check-item"><span>3</span> Test connection & sync</div></div>${amoActions('full')}</div>`),
        intShell(`${amoSetupHdr(true)}<div class="setup-layout"><div class="card dash-card setup-connected-rich"><div class="connected-banner"><span class="int-status ok"><i class="dot"></i>Подключено</span><span class="hint">demo mode</span></div>${amoConnectedPanel()}<div class="setup-actions"><button class="btn btn-p sm" type="button">↻ Sync now</button><button class="btn sm" type="button">Test</button><button class="btn danger sm" type="button">Disconnect</button></div><p class="hint">Последний test: успешно · 14:30</p></div>${amoHelpAside()}</div>`),
      ];
      break;
    case 'L':
      bodies = [
        settingsShell(`${settingsPageHdr()}<div class="tabs deal-tabs settings-tabs"><span class="on">Профиль</span><span>Пароль</span><span>Язык</span></div><div class="card dash-card settings-card">${settingsProfileFields()}</div>`),
        settingsShell(`${settingsPageHdr()}<div class="card dash-card settings-card settings-scroll">${settingsProfileFields()}${settingsPasswordFields()}${settingsLanguageFields()}${settingsDangerZone()}</div>`),
        settingsShell(`${settingsPageHdr()}<div class="settings-layout">${settingsNav('profile')}<div class="card dash-card settings-card">${settingsProfileFields()}${settingsPasswordFields()}</div></div>`),
        settingsShell(`${settingsPageHdr()}<div class="settings-2col"><div class="card dash-card settings-card">${settingsProfileFields()}</div><div class="card dash-card settings-card">${settingsPasswordFields()}${settingsLanguageFields()}</div></div>`),
        settingsShell(`${settingsPageHdr()}<div class="settings-accordion"><details open><summary>Профиль</summary><div class="settings-section pad">${settingsProfileFields().replace(/<h3[^>]*>.*?<\/h3>/, '')}</div></details><details><summary>Пароль</summary><div class="settings-section pad">${settingsPasswordFields().replace(/<h3[^>]*>.*?<\/h3>/, '')}</div></details><details><summary>Язык</summary><div class="settings-section pad">${settingsLanguageFields().replace(/<h3[^>]*>.*?<\/h3>/, '')}</div></details><details><summary>Danger zone</summary><div class="settings-section pad">${settingsDangerZone().replace(/<h3[^>]*>.*?<\/h3>/, '')}</div></details></div>`),
        settingsShell(`${settingsPageHdr()}<div class="settings-stack"><div class="card dash-card settings-card">${settingsProfileFields()}</div><div class="card dash-card settings-card">${settingsLanguageFields()}</div><div class="card dash-card settings-card">${settingsPasswordFields()}</div></div>`),
        settingsShell(`${settingsPageHdr()}<div class="settings-layout-main"><div class="card dash-card settings-card">${settingsProfileFields()}${settingsPasswordFields()}${settingsLanguageFields()}</div><div class="card dash-card settings-card danger-card">${settingsDangerZone()}</div></div>`),
      ];
      break;
    case 'M':
      bodies = [
        shell('<div class="sync-bar">↻ Syncing deals... <div class="prog"><div class="fill" style="width:60%"></div></div></div><div class="ph"><h1>Dashboard</h1></div>'),
        shell('<header class="fake-header">CRMForge <span class="sync-chip">Syncing 60%</span></header><div class="ph">Content</div>', { topNav: true }),
        '<div class="modal-bg"><div class="modal"><h3>Синхронизация</h3><div class="prog"><div class="fill" style="width:45%"></div></div><p>12 / 28 deals</p></div></div>',
        '<div class="bottom-bar">↻ Importing leads... <div class="prog sm"><div class="fill" style="width:30%"></div></div></div>',
        '<div class="toast-demo ok">Sync complete!</div><div class="sync-bar">Running...</div>',
        shell('<div class="dash-split"><aside class="sync-widget"><h4>Sync</h4><div class="prog"><div class="fill" style="width:80%"></div></div></aside><div class="ph">Main</div></div>'),
        syncFloatingPanel(),
      ];
      break;
    case 'N':
      bodies = [
        userMenuShell(userMenuClassic()),
        userMenuShell(userMenuAvatarOnly()),
        userMenuShell(userMenuSplit()),
        userMenuShell(userMenuIcons()),
        userMenuShell(userMenuProfileHeader()),
        userMenuSheet(),
        userMenuShell(userMenuMinimal()),
      ];
      break;
    case 'O':
      bodies = [
        '<div class="toast-stage tr"><div class="toast ok">Sync complete</div><div class="toast err">Login failed</div></div>',
        '<div class="toast-stage br"><div class="toast ok">Profile saved</div></div>',
        '<div class="toast-stage tc"><div class="toast info">Syncing...</div></div>',
        '<div class="banner-page"><div class="banner ok">Deal imported successfully</div></div>',
        toastRichDemo(),
        '<div class="toast-stage br"><div class="toast pill ok">✓ Saved</div></div>',
        '<div class="toast-stage tr"><div class="toast ok">Success <button class="btn sm">Undo</button></div></div>',
      ];
      break;
    case 'P':
      bodies = [
        '<div class="badge-stage"><span class="badge won">Won</span><span class="badge open">Open</span><span class="badge lost">Lost</span></div>',
        '<div class="badge-stage"><span class="badge won out">Won</span><span class="badge open out">Open</span><span class="badge lost out">Lost</span></div>',
        '<div class="badge-stage"><span class="badge dot won">● Won</span><span class="badge dot open">● Open</span></div>',
        '<div class="badge-stage"><span class="badge sq won">WON</span><span class="badge sq open">OPEN</span></div>',
        badgeSoftDemo(),
        '<div class="badge-stage"><span class="badge solid won">Won</span><span class="badge solid lost">Lost</span></div>',
        '<div class="badge-stage"><span class="badge icon won">✓ Won</span><span class="badge icon lost">✕ Lost</span></div>',
      ];
      break;
    case 'Q':
      bodies = [
        emptyStateCenter(),
        shell('<div class="empty compact"><p>No deals yet · <a>Connect amoCRM</a></p></div>'),
        shell('<div class="card empty-in"><div class="empty sm"><p>Empty table</p><button class="btn btn-p sm">Add integration</button></div></div>'),
        shell('<div class="empty split-e"><div><h2>No integration</h2></div><button class="btn btn-p">Connect</button></div>'),
        shell('<div class="empty minimal"><p>— нет данных —</p></div>'),
        shell('<div class="empty hero"><h1>Welcome!</h1><p>Connect amoCRM to import deals</p><button class="btn btn-p">Get started</button></div>'),
        shell('<div class="empty row-e"><div class="illus sm">🔗</div><div><h3>Connect CRM</h3><button class="btn btn-p sm">Setup</button></div></div>'),
      ];
      break;
    default:
      bodies = Array(7).fill('<div class="placeholder">Variant</div>');
  }

  return bodies;
}

function buildHtml(screen, idx) {
  const prev = idx > 0 ? SCREENS[idx - 1] : null;
  const next = idx < SCREENS.length - 1 ? SCREENS[idx + 1] : null;
  const prevHref = prev ? `${prev.letter.toLowerCase()}-${prev.slug}.html` : 'design-variants.html';
  const nextHref = next ? `${next.letter.toLowerCase()}-${next.slug}.html` : null;
  const labels = VARIANT_LABELS[screen.letter];
  const bodies = renderScreen(screen);
  const filename = `${screen.letter.toLowerCase()}-${screen.slug}.html`;

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${screen.letter} — ${screen.title} · CRMForge Presets</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{--font:'Inter',system-ui,sans-serif;--radius:8px;--picker-h:56px;--sidebar-w:220px;--transition:.2s}
    :root,[data-theme=light]{--bg:#f6f9fc;--bg-sidebar:#fff;--bg-card:#fff;--bg-hover:#f0f4f8;--border:#e3e8ee;--text:#0a2540;--text-muted:#697386;--primary:#635bff;--primary-hover:#7a73ff;--primary-text:#fff;--accent-bg:rgba(99,91,255,.08);--success:#30b566;--danger:#df1b41;--shadow:0 1px 3px rgba(50,50,93,.08)}
    [data-theme=dark]{--bg:#000;--bg-sidebar:#0a0a0a;--bg-card:#0a0a0a;--bg-hover:#171717;--border:#333;--text:#ededed;--text-muted:#888;--primary:#fff;--primary-hover:#e5e5e5;--primary-text:#000;--accent-bg:rgba(255,255,255,.06);--success:#50e3c2;--danger:#e00;--shadow:none}
    body{font-family:var(--font);background:var(--bg);color:var(--text);min-height:100vh}
    .picker{position:fixed;top:0;left:0;right:0;z-index:2000;height:var(--picker-h);background:#111;border-bottom:1px solid #333;display:flex;align-items:center;gap:10px;padding:0 14px;flex-wrap:wrap}
    .picker-letter{width:32px;height:32px;border-radius:8px;background:#fff;color:#111;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:15px}
    .picker-meta{color:#aaa;font-size:12px;white-space:nowrap}
    .picker-meta strong{color:#fff}
    .picker-meta em{color:#666;font-style:normal;font-size:11px}
    .v-btns{display:flex;gap:4px;flex-wrap:wrap}
    .v-btn{width:30px;height:30px;border-radius:6px;border:2px solid #333;background:#1a1a1a;color:#aaa;font-weight:700;font-size:12px;cursor:pointer;font-family:var(--font)}
    .v-btn:hover{border-color:#666;color:#fff}
    .v-btn.active{border-color:#635bff;background:#635bff;color:#fff}
    .nav-btn{padding:7px 14px;border-radius:999px;border:1px solid #444;background:#1a1a1a;color:#ccc;font-size:12px;font-weight:600;cursor:pointer;font-family:var(--font);text-decoration:none;display:inline-flex;align-items:center;gap:4px}
    .nav-btn:hover{border-color:#888;color:#fff}
    .nav-btn.primary{background:#fff;color:#111;border-color:#fff}
    .nav-btn.primary:hover{background:#e5e5e5}
    .nav-btn.disabled{opacity:.35;pointer-events:none}
    .theme-btn{padding:6px 10px;border-radius:6px;border:1px solid #444;background:#222;color:#ccc;font-size:11px;cursor:pointer;font-family:var(--font);margin-left:auto}
    .stage{padding-top:var(--picker-h);min-height:100vh}
    .variant{display:none;min-height:calc(100vh - var(--picker-h))}
    .variant.active{display:block}
    .variant-tag{position:fixed;bottom:12px;left:12px;z-index:100;background:#111;color:#aaa;border:1px solid #333;padding:6px 12px;border-radius:999px;font-size:11px}
    .shell{display:flex;min-height:calc(100vh - var(--picker-h))}
    .shell.top-only{flex-direction:column}
    .shell-main{display:flex;flex:1;width:100%}
    .sidebar{width:var(--sidebar-w);background:var(--bg-sidebar);border-right:1px solid var(--border);padding:16px 10px;flex-shrink:0}
    .sidebar-a5{display:flex;flex-direction:column;min-height:calc(100vh - var(--picker-h));padding-bottom:12px}
    .sidebar-nav{flex:1;display:flex;flex-direction:column;gap:2px}
    .sidebar-prefs{margin-top:auto;padding:12px 8px 4px;border-top:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:8px}
    .pref-group{display:flex;gap:2px;background:var(--bg-hover);padding:3px;border-radius:var(--radius);border:1px solid var(--border)}
    .pref-btn{padding:6px 10px;border:none;background:transparent;border-radius:6px;font-size:11px;font-weight:600;color:var(--text-muted);cursor:default;font-family:var(--font)}
    .pref-btn.on{background:var(--bg-card);color:var(--text);box-shadow:var(--shadow)}
    .pref-btn.pref-theme{width:36px;height:36px;border:1px solid var(--border);border-radius:var(--radius);background:var(--bg-card);font-size:16px;display:inline-flex;align-items:center;justify-content:center;padding:0;flex-shrink:0}
    .shell-a5 .shell-main-col{flex:1;display:flex;flex-direction:column;min-width:0;position:relative}
    .shell-top-corner{position:absolute;top:18px;right:24px;z-index:40}
    .main-a5{padding:24px 28px 28px;padding-top:20px}
    .shell-a5 .dash-hdr{padding-right:52px}
    .profile-orb{width:42px;height:42px;border-radius:50%;border:2px solid var(--border);background:var(--accent-bg);color:var(--primary);font-size:13px;font-weight:800;cursor:default;padding:0;display:inline-flex;align-items:center;justify-content:center;box-shadow:var(--shadow);font-family:var(--font)}
    .profile-orb:hover{border-color:var(--primary)}
    .profile-corner .user-menu-panel{top:calc(100% + 10px);right:0;min-width:220px}
    .page-bc{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text-muted);margin-bottom:18px;flex-wrap:wrap}
    .page-bc a{color:var(--text-muted);text-decoration:none}
    .page-bc a:hover{color:var(--primary)}
    .page-bc span{opacity:.7}
    a.nav-item{text-decoration:none;display:block;color:var(--text-muted)}
    a.nav-item:hover{color:var(--text)}
    a.nav-item.active{color:var(--primary)}
    .sidebar.right{border-right:none;border-left:1px solid var(--border);order:2}
    .sidebar.collapsed{width:64px}
    .logo{display:flex;align-items:center;gap:8px;font-weight:700;font-size:14px;padding:4px 8px 16px}
    .logo-i{width:28px;height:28px;border-radius:7px;background:var(--primary);color:var(--primary-text);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;flex-shrink:0}
    .nav-item,.top-item{padding:8px 10px;border-radius:var(--radius);font-size:13px;color:var(--text-muted);margin-bottom:2px;cursor:default}
    .nav-item.active,.top-item.active{background:var(--accent-bg);color:var(--primary);font-weight:600}
    .nav-group small{display:block;color:var(--text-muted);font-size:10px;text-transform:uppercase;padding:8px 10px 4px}
    .topnav{display:flex;gap:4px;padding:10px 16px;background:var(--bg-sidebar);border-bottom:1px solid var(--border)}
    .main{flex:1;padding:24px;min-width:0}
    .main.wide{padding:24px 40px}
    .bc{font-size:12px;color:var(--text-muted);margin-bottom:12px}
    .ph h1{font-size:20px;font-weight:700;margin-bottom:8px}
    .ph p{color:var(--text-muted);font-size:13px}
    .placeholder{background:var(--bg-hover);border:1px dashed var(--border);border-radius:var(--radius);padding:40px;margin-top:16px;color:var(--text-muted);text-align:center}
    .card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:16px;box-shadow:var(--shadow);margin-top:12px}
    .btn{display:inline-flex;align-items:center;justify-content:center;padding:8px 16px;border-radius:var(--radius);border:1px solid var(--border);background:var(--bg-card);color:var(--text);font-family:var(--font);font-size:13px;font-weight:500;cursor:default}
    .btn-p{background:var(--primary);color:var(--primary-text);border-color:var(--primary)}
    .btn.full{width:100%;margin-top:8px}
    .btn.sm{padding:4px 10px;font-size:11px}
    .btn.danger{border-color:var(--danger);color:var(--danger)}
    .input{width:100%;padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius);background:var(--bg-card);color:var(--text);font-family:var(--font);font-size:13px;margin-top:8px}
    .center-page{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:calc(100vh - var(--picker-h));padding:24px;text-align:center;gap:8px}
    .center-page.in-shell{min-height:50vh}
    .big{font-size:48px;font-weight:800;letter-spacing:-.04em}
    .mega{font-size:120px;font-weight:900;line-height:1;opacity:.15}
    .split-page{display:flex;min-height:calc(100vh - var(--picker-h))}
    .split-left,.split-right{flex:1;display:flex;flex-direction:column;justify-content:center;padding:40px}
    .split-left.art,.split-right.art{background:var(--accent-bg);align-items:center;font-size:48px;font-weight:800;color:var(--primary)}
    .split-left.brand{background:var(--primary);color:var(--primary-text)}
    .split-left.ok-bg{background:rgba(48,181,102,.15);color:var(--success);font-size:64px;font-weight:800;align-items:center}
    .auth-wrap{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:calc(100vh - var(--picker-h));padding:24px}
    .auth-card{background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:28px;width:100%;max-width:400px;box-shadow:var(--shadow)}
    .auth-card.wide{max-width:520px}
    .auth-card.compact{max-width:320px}
    .auth-card.minimal{max-width:340px}
    .auth-card.with-brand{display:flex;overflow:hidden;padding:0;max-width:440px}
    .auth-card.with-brand .brand-strip{width:80px;background:var(--primary);color:var(--primary-text);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:24px}
    .auth-card.with-brand .body{padding:24px;flex:1}
    .auth-top{padding:40px;max-width:560px;margin:0 auto}
    .auth-foot{margin-top:24px;font-size:12px;color:var(--text-muted)}
    .btn-google{display:inline-flex;align-items:center;justify-content:center;gap:10px;background:var(--bg-card);border:1px solid var(--border);font-weight:600}
    .btn-google:hover{background:var(--bg-hover)}
    .btn-google.lg{padding:12px 16px;font-size:14px}
    .btn-google.xl{padding:14px 18px;font-size:15px;margin-bottom:4px}
    .g-icon{width:18px;height:18px;flex-shrink:0;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Cpath fill='%234285F4' d='M44 24.5c0-1.6-.14-2.85-.45-4.09H24v7.41h11.28c-.6 3.18-2.4 5.88-5.1 7.69v6.35h8.26c4.83-4.45 7.61-11 7.61-18.36z'/%3E%3Cpath fill='%2334A853' d='M24 44c6.84 0 12.58-2.26 16.77-6.15l-8.26-6.35c-2.29 1.53-5.22 2.44-8.51 2.44-6.54 0-12.08-4.41-14.06-10.35H1.29v6.55C5.42 39.51 14.03 44 24 44z'/%3E%3Cpath fill='%23FBBC05' d='M9.94 23.49c-.5-1.53-.78-3.16-.78-4.84s.28-3.31.78-4.84V7.26H1.29C-.43 10.69-1.43 14.61-1.43 18.65s1 7.96 2.72 11.39l8.65-6.55z'/%3E%3Cpath fill='%23EA4335' d='M24 9.58c3.72 0 6.28 1.61 7.72 2.95l5.64-5.64C36.56 3.89 30.84 1.43 24 1.43 14.03 1.43 5.42 5.92 1.29 13.21l8.65 6.55c1.98-5.94 7.52-10.18 14.06-10.18z'/%3E%3C/svg%3E") center/contain no-repeat}
    .auth-divider{display:flex;align-items:center;gap:12px;margin:16px 0;color:var(--text-muted);font-size:12px;text-transform:lowercase}
    .auth-divider::before,.auth-divider::after{content:'';flex:1;height:1px;background:var(--border)}
    .auth-divider span{flex-shrink:0;padding:0 4px}
    .auth-panel{display:flex;flex-direction:column;justify-content:center;max-width:400px;width:100%}
    .auth-panel h1{margin-bottom:8px;font-size:24px;font-weight:700}
    .split-right.auth-panel,.split-left.auth-panel{padding:40px 48px}
    .brand-art{display:flex;align-items:center;justify-content:center;font-size:72px;font-weight:900;color:var(--primary);opacity:.25}
    .brand-art span{line-height:1}
    .login-cols h1{margin-bottom:16px}
    .login-split-cols{display:grid;grid-template-columns:1fr auto 1fr;gap:20px;align-items:start}
    .col-label{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:var(--text-muted);margin-bottom:8px}
    .col-divider{display:flex;align-items:center;justify-content:center;padding-top:32px;color:var(--text-muted);font-size:12px}
    .google-hero{text-align:center;max-width:420px}
    .google-hero .logo-top{display:flex;align-items:center;justify-content:center;gap:10px;font-weight:700;margin-bottom:20px}
    .logo-i.lg{width:36px;height:36px;font-size:14px}
    .h2-sm{font-size:14px;font-weight:600;color:var(--text-muted);margin:8px 0;text-align:left}
    .err-code{font-size:56px;font-weight:800;letter-spacing:-.04em;line-height:1;color:var(--primary);margin-bottom:8px}
    .err-code.sm{font-size:40px}
    .sub{color:var(--text-muted);font-size:14px;margin-bottom:16px}
    .err-hero{position:relative;overflow:hidden}
    .mega-bg{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:min(28vw,200px);font-weight:900;color:var(--text);opacity:.06;pointer-events:none;user-select:none;line-height:1}
    .err-hero h1,.err-hero .sub,.err-hero .row-actions{position:relative;z-index:1}
    .row-actions{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;align-items:center}
    .btn-ghost{background:transparent;border:1px solid var(--border)}
    .err-art span{font-size:80px;font-weight:900;opacity:.2}
    .err-in-shell{max-width:480px;margin:40px auto;text-align:center;padding:24px}
    .err-card{text-align:center}
    .search-404{max-width:360px;margin:12px 0 16px}
    .row-links{justify-content:center;gap:20px}
    .text-link{color:var(--primary);font-weight:500;text-decoration:none}
    @media(max-width:768px){.login-split-cols{grid-template-columns:1fr;gap:12px}.col-divider{padding:0}.col-divider::before,.col-divider::after{content:none}}
    .hint{font-size:12px;color:var(--text-muted);margin-top:12px}
    .row-2{display:grid;grid-template-columns:1fr 1fr;gap:8px}
    .steps{display:flex;gap:8px;margin-bottom:12px}
    .steps span{width:28px;height:28px;border-radius:50%;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:12px}
    .steps span.on{background:var(--primary);color:var(--primary-text);border-color:var(--primary)}
    .card-box{background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:32px;max-width:420px}
    .banner-page{padding:24px}
    .banner,.inline-bar{padding:14px 18px;border-radius:var(--radius);border:1px solid var(--border);background:var(--accent-bg)}
    .banner.info{border-color:var(--primary)}
    .banner.ok{border-color:var(--success)}
    .inline-bar{display:flex;align-items:center;gap:12px;justify-content:center;margin-top:40px}
    .illus{font-size:48px;margin-bottom:8px}
    .illus.lg{font-size:64px}
    .illus.ok{color:var(--success);font-size:56px;font-weight:800}
    .illus.err{color:var(--danger);font-size:56px;font-weight:800}
    .spinner{width:40px;height:40px;border:3px solid var(--border);border-top-color:var(--primary);border-radius:50%;animation:spin .8s linear infinite}
    .spinner.sm{width:24px;height:24px}
    @keyframes spin{to{transform:rotate(360deg)}}
    .links{display:flex;gap:16px;margin-top:12px;font-size:13px}
    .stats{display:grid;gap:12px;margin-bottom:16px}
    .stats.r4{grid-template-columns:repeat(4,1fr)}
    .stats.g2{grid-template-columns:repeat(2,1fr)}
    .stat-card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:16px 18px;box-shadow:var(--shadow)}
    .stat-card.compact{padding:12px 14px}
    .stat-lbl{display:block;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:var(--text-muted)}
    .stat-val{display:block;font-size:26px;font-weight:700;letter-spacing:-.03em;margin:6px 0 2px}
    .stat-delta{font-size:12px;font-weight:500}
    .stat-delta.up{color:var(--success)}
    .stat-delta.muted{color:var(--text-muted)}
    .stats-strip{display:flex;flex-wrap:wrap;gap:10px;padding:12px 16px;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);margin-bottom:16px;font-size:13px;color:var(--text-muted)}
    .stats-strip b{color:var(--text);font-weight:700}
    .stats-side{display:flex;flex-direction:column;gap:10px;min-width:200px}
    .dash-hdr{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:20px;flex-wrap:wrap}
    .dash-hdr h1{font-size:22px;font-weight:700;letter-spacing:-.03em}
    .dash-hdr .sub{margin-bottom:0}
    .dash-grid{display:grid;grid-template-columns:1fr 300px;gap:16px;align-items:start}
    .dash-full{margin-top:0}
    .dash-layout-side{display:grid;grid-template-columns:200px 1fr;gap:16px;margin-bottom:16px}
    .dash-card{margin-top:0}
    .card-hdr{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid var(--border)}
    .card-title{font-size:14px;font-weight:600}
    .card-link{font-size:12px;color:var(--primary);font-weight:500;text-decoration:none}
    .cell-main{font-weight:500;font-size:13px}
    .cell-sub{font-size:11px;color:var(--text-muted);margin-top:2px}
    .int-widget{padding:16px 18px}
    .int-row-live{display:flex;align-items:center;gap:12px;padding:12px;border:1px solid var(--border);border-radius:var(--radius);background:var(--bg-hover);margin-bottom:12px}
    .amo-badge{width:36px;height:36px;border-radius:var(--radius);background:#3390ec;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px;flex-shrink:0}
    .int-row-live b{display:block;font-size:13px}
    .ok-line{display:flex;align-items:center;gap:6px;font-size:11px;color:var(--text-muted);margin-top:2px}
    .ok-line .dot{width:7px;height:7px;border-radius:50%;background:var(--success);display:inline-block}
    .sync-box{padding:14px;border:1px dashed var(--border);border-radius:var(--radius);text-align:center}
    .sync-box p{font-size:12px;color:var(--text-muted);margin-bottom:10px}
    .btn.full.sm,.btn.sm{width:100%;justify-content:center}
    .dash-banner{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 18px;margin-bottom:16px;border:1px solid var(--primary);border-radius:var(--radius);background:var(--accent-bg);flex-wrap:wrap}
    .dash-banner .sub{margin:4px 0 0;font-size:12px}
    .dash-hero-stat{display:flex;align-items:center;gap:20px;padding:20px 24px;margin-bottom:16px;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}
    .hero-num{font-size:48px;font-weight:800;letter-spacing:-.04em;line-height:1}
    .hero-meta{display:flex;flex-direction:column;gap:4px;font-size:13px;color:var(--text-muted)}
    .hero-meta .up{color:var(--success);font-weight:600}
    .email-card,.verify-card{text-align:center;max-width:420px}
    .mail-icon{width:56px;height:56px;margin:0 auto 16px;border-radius:50%;background:var(--accent-bg);border:1px solid var(--border);position:relative}
    .mail-icon::after{content:'✉';position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:24px}
    .steps-hint{display:flex;justify-content:center;gap:8px;margin:20px 0;font-size:11px;flex-wrap:wrap}
    .steps-hint span{padding:6px 10px;border-radius:999px;border:1px solid var(--border);color:var(--text-muted)}
    .steps-hint span.done{background:var(--accent-bg);color:var(--primary);border-color:var(--primary)}
    .steps-hint span.on{background:var(--primary);color:var(--primary-text);border-color:var(--primary);font-weight:600}
    .verify-spinner{width:48px;height:48px;margin:0 auto 16px;border:3px solid var(--border);border-top-color:var(--primary);border-radius:50%;animation:spin .8s linear infinite}
    .verify-prog{margin:16px 0 8px}
    .prog.verify-prog .fill.indeterminate{width:40%;animation:indet 1.2s ease-in-out infinite}
    @keyframes indet{0%{margin-left:0}50%{margin-left:60%}100%{margin-left:0}}
    .muted-xs{font-size:11px;color:var(--text-muted)}
    .mail-art{display:flex;align-items:center;justify-content:center;background:var(--accent-bg)}
    .mail-envelope{width:120px;height:90px;border:3px solid var(--primary);border-radius:8px;position:relative;opacity:.35}
    .mail-envelope::before{content:'';position:absolute;top:-3px;left:50%;transform:translateX(-50%);border:45px solid transparent;border-top:50px solid var(--primary);opacity:.5}
    .feat-list{list-style:none;margin-top:16px;font-size:13px;color:rgba(255,255,255,.85)}
    .feat-list li{padding:6px 0;border-bottom:1px solid rgba(255,255,255,.15)}
    .feat-list li::before{content:'✓ ';opacity:.8}
    @media(max-width:960px){.dash-grid,.dash-layout-side{grid-template-columns:1fr}.stats.r4{grid-template-columns:repeat(2,1fr)}}
    .stats.strip .stat.s{padding:12px 16px;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius)}
    .stat{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:16px;font-size:22px;font-weight:700}
    .stat span{display:block;font-size:11px;font-weight:500;color:var(--text-muted);margin-top:4px}
    .stat.v{margin-bottom:8px}
    .stat.big{font-size:48px;padding:24px}
    .tbl{width:100%;font-size:13px;border-collapse:collapse}
    .tbl th,.tbl td{padding:10px 12px;text-align:left;border-bottom:1px solid var(--border)}
    .tbl th{font-size:11px;color:var(--text-muted);text-transform:uppercase}
    .tbl.dense td{padding:6px 8px;font-size:12px}
    .badge{display:inline-block;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:600}
    .badge.won{background:rgba(48,181,102,.15);color:var(--success)}
    .badge.open{background:var(--accent-bg);color:var(--primary)}
    .badge.lost{background:rgba(223,27,65,.12);color:var(--danger)}
    .badge.out{background:transparent;border:1px solid currentColor}
    .badge.sq{border-radius:4px}
    .badge.solid.won{background:var(--success);color:#fff}
    .badge.solid.lost{background:var(--danger);color:#fff}
    .badge.soft{padding:4px 12px}
    .deals-hdr{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:20px;flex-wrap:wrap}
    .deals-hdr h1{font-size:22px;font-weight:700;letter-spacing:-.03em}
    .deals-hdr .sub{margin-bottom:0}
    .deals-layout-split{display:grid;grid-template-columns:220px 1fr;gap:16px;align-items:start}
    .filters-panel{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:16px;position:sticky;top:calc(var(--picker-h) + 16px)}
    .filters-panel h3{font-size:14px;font-weight:600;margin-bottom:12px}
    .flbl{display:block;font-size:11px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:.04em;margin:10px 0 4px}
    .filters-panel .flbl:first-of-type{margin-top:0}
    .deals-filter-bar{display:flex;align-items:center;gap:10px;margin-bottom:16px;flex-wrap:wrap}
    .search-inp{flex:1;min-width:180px;margin-top:0!important}
    .filter-count{font-size:12px;color:var(--text-muted);margin-left:auto}
    .deals-tbl-wrap{overflow:hidden}
    .deals-tbl-wrap .tbl thead th{position:sticky;top:0;background:var(--bg-card);z-index:1}
    .sticky-wrap .tbl thead th{top:var(--picker-h)}
    .muted-cell{color:var(--text-muted);font-size:12px;white-space:nowrap}
    .pagination{display:flex;align-items:center;justify-content:space-between;padding:12px 18px;border-top:1px solid var(--border);flex-wrap:wrap;gap:10px}
    .pg-info{font-size:12px;color:var(--text-muted)}
    .pg-btns{display:flex;gap:4px}
    .pg-btns .btn.active-pg{background:var(--primary);color:var(--primary-text);border-color:var(--primary)}
    .deal-cards-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px}
    .deal-card-rich{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:14px 16px;box-shadow:var(--shadow);transition:border-color .15s}
    .deal-card-rich:hover{border-color:var(--primary)}
    .dc-top{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;margin-bottom:10px}
    .dc-top b{font-size:13px;font-weight:600;line-height:1.35;flex:1}
    .dc-meta{display:flex;justify-content:space-between;font-size:13px;font-weight:600;margin-bottom:8px}
    .dc-meta span:last-child{color:var(--text-muted);font-weight:500;font-size:12px}
    .dc-foot{font-size:11px;color:var(--text-muted)}
    .kanban-board{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;align-items:start}
    .kanban-col{background:var(--bg-hover);border:1px solid var(--border);border-radius:var(--radius);padding:12px;min-height:420px}
    .kanban-col-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid var(--border)}
    .kanban-col-hdr h4{font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:var(--text-muted)}
    .kanban-count{font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px;background:var(--bg-card);border:1px solid var(--border)}
    .kanban-card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:12px;margin-bottom:8px;box-shadow:var(--shadow)}
    .kanban-card b{display:block;font-size:13px;font-weight:600;margin-bottom:6px;line-height:1.35}
    .k-amt{display:block;font-size:13px;font-weight:700;margin-bottom:4px}
    .k-contact{font-size:11px;color:var(--text-muted)}
    .deal-title-hdr{display:flex;align-items:center;gap:12px;margin-bottom:16px;flex-wrap:wrap}
    .deal-title-hdr h1{font-size:22px;font-weight:700;letter-spacing:-.03em}
    .deal-fields-card,.deal-fields-pad{padding:16px 18px}
    .field-row{display:grid;grid-template-columns:140px 1fr;gap:12px;padding:10px 0;border-bottom:1px solid var(--border);font-size:13px;align-items:center}
    .field-row:last-child{border-bottom:none}
    .field-row .flbl{margin:0;text-transform:none;font-size:13px;font-weight:500;color:var(--text-muted)}
    .field-row .fv{font-weight:700;font-size:15px}
    .field-row .mono{font-family:ui-monospace,monospace;font-size:12px;color:var(--text-muted)}
    .json-card .json-pre,.deal-accordion .json-pre{margin:0;padding:16px 18px;font-size:11px;line-height:1.5;background:var(--bg-hover);color:var(--text-muted);overflow:auto;max-height:360px}
    .json-pre{white-space:pre-wrap;word-break:break-word}
    .deal-tabs{margin-bottom:16px}
    .sum-big{font-size:32px;font-weight:800;letter-spacing:-.03em;margin-bottom:8px}
    .deal-tl .tl-item{display:flex;justify-content:space-between;gap:16px;padding:12px 18px;border-bottom:1px solid var(--border);font-size:13px}
    .deal-tl .tl-item span{color:var(--text-muted);font-size:12px;white-space:nowrap}
    .detail-json{grid-template-columns:1fr 340px}
    .sticky-json{position:sticky;top:calc(var(--picker-h) + 16px);align-self:start}
    .deal-accordion details{margin-bottom:8px;border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;background:var(--bg-card)}
    .deal-accordion summary{padding:12px 16px;font-weight:600;font-size:13px;cursor:pointer;background:var(--bg-hover)}
    .deals-split{display:flex;gap:16px}
    .filters{width:200px;flex-shrink:0}
    .deal-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;margin-top:12px}
    .deal-card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:14px;display:flex;justify-content:space-between}
    .filter-bar{display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap}
    .kanban{display:flex;gap:12px;margin-top:12px}
    .kanban .col{flex:1;background:var(--bg-hover);border-radius:var(--radius);padding:10px;min-height:200px}
    .k-card{background:var(--bg-card);border:1px solid var(--border);border-radius:6px;padding:10px;margin-top:8px;font-size:13px}
    .back{font-size:13px;color:var(--primary);display:inline-block;margin-bottom:8px}
    .detail-2col,.detail-side,.detail-json,.dash-split,.setup-split,.set-split,.set-2col{display:grid;grid-template-columns:1fr 1fr;gap:16px}
    .detail-side{grid-template-columns:240px 1fr}
    .detail-json{grid-template-columns:1fr 280px}
    .dash-split{grid-template-columns:180px 1fr}
    .setup-split{grid-template-columns:1fr 200px}
    .set-split{grid-template-columns:180px 1fr}
    .sum-card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:20px;text-align:center}
    .sum-card .big{font-size:32px;font-weight:800}
    .hero-deal{display:flex;align-items:center;gap:12px;margin-bottom:12px}
    .tabs{display:flex;gap:4px;margin-bottom:12px}
    .tabs span,.step{padding:8px 14px;border-radius:var(--radius);font-size:13px;border:1px solid var(--border);color:var(--text-muted)}
    .tabs span.on,.step.on{background:var(--accent-bg);color:var(--primary);border-color:var(--primary);font-weight:600}
    .timeline .tl-item{padding:12px 0;border-bottom:1px solid var(--border);font-size:13px}
    pre{font-size:11px;background:var(--bg-hover);padding:12px;border-radius:6px;overflow:auto;color:var(--text-muted)}
    .json-panel pre{margin:0}
    details{padding:12px;border:1px solid var(--border);border-radius:var(--radius);margin-bottom:8px;font-size:13px}
    summary{cursor:pointer;font-weight:600}
    .int-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px;margin-top:4px}
    .int-grid.lg .int-card{min-height:140px;padding:24px}
    .int-grid.lg .int-card b{font-size:18px}
    .int-card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:16px 18px;box-shadow:var(--shadow);display:flex;flex-direction:column;gap:8px}
    .int-card.on{border-color:var(--primary);background:var(--accent-bg)}
    .int-card.off{opacity:.55}
    .int-card.scroll-card{min-width:180px;flex-shrink:0;align-items:center;text-align:center;gap:10px}
    .int-card-top{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:4px}
    .int-card b{font-size:15px;font-weight:700}
    .int-card .sub{font-size:12px;color:var(--text-muted);line-height:1.45;margin:0}
    .int-card .hint{font-size:11px;color:var(--text-muted)}
    .int-logo{width:40px;height:40px;border-radius:var(--radius);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:15px;flex-shrink:0}
    .int-status{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:600;padding:4px 10px;border-radius:999px;white-space:nowrap}
    .int-status.ok{background:rgba(48,181,102,.12);color:var(--success)}
    .int-status.ok .dot{width:6px;height:6px;border-radius:50%;background:var(--success)}
    .int-status.soon{background:var(--bg-hover);color:var(--text-muted);border:1px solid var(--border)}
    .int-status.err{background:rgba(223,27,65,.1);color:var(--danger)}
    .int-list-rich{display:flex;flex-direction:column;gap:10px;margin-top:4px}
    .int-list-item{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:16px 18px;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);flex-wrap:wrap}
    .int-list-item.dim{opacity:.55}
    .int-list-left{display:flex;align-items:center;gap:14px;flex:1;min-width:200px}
    .int-list-left b{display:block;font-size:14px;font-weight:600;margin-bottom:2px}
    .int-list-left .sub{font-size:12px;color:var(--text-muted);margin:0}
    .int-list-right{display:flex;align-items:center;gap:12px;flex-shrink:0}
    .int-featured-rich{display:flex;align-items:flex-start;gap:16px;padding:20px 22px;background:var(--accent-bg);border:1px solid var(--primary);border-radius:var(--radius);margin-bottom:16px;flex-wrap:wrap}
    .int-featured-body{flex:1;min-width:200px}
    .int-featured-top{display:flex;align-items:center;gap:10px;margin-bottom:6px;flex-wrap:wrap}
    .int-featured-top b{font-size:18px;font-weight:700}
    .int-featured-actions{display:flex;gap:8px;margin-top:12px;flex-wrap:wrap}
    .int-soon-list{margin-top:8px}
    .int-soon-list .flbl{margin-bottom:10px}
    .int-soon-item{display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border);font-size:13px;font-weight:500;color:var(--text-muted)}
    .int-soon-item:last-child{border-bottom:none}
    .int-scroll-rich{display:flex;gap:12px;overflow-x:auto;padding:4px 0 8px;margin-top:4px}
    .int-split-rich{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:4px}
    .int-split-rich .sec-title{font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:var(--text-muted);margin-bottom:12px}
    .int-split-rich .dim-sec{opacity:.65}
    .tbl.full .cell-main{display:flex;align-items:center;gap:10px;font-weight:600}
    .tbl .dim-row{opacity:.55}
    .setup-hdr{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:20px;flex-wrap:wrap}
    .setup-hdr-left{display:flex;align-items:center;gap:14px}
    .setup-hdr h1{font-size:22px;font-weight:700;letter-spacing:-.03em;margin-bottom:2px}
    .setup-hdr .sub{margin:0;font-size:13px}
    .setup-layout{display:grid;grid-template-columns:1fr 260px;gap:16px;align-items:start}
    .setup-panel{padding:20px 22px}
    .setup-panel .sec-title{margin-bottom:12px}
    .setup-status-card{display:flex;flex-direction:column;gap:0;margin-bottom:16px;border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;background:var(--bg-hover)}
    .setup-row{display:grid;grid-template-columns:140px 1fr;gap:12px;padding:12px 16px;border-bottom:1px solid var(--border);font-size:13px;align-items:center}
    .setup-row:last-child{border-bottom:none}
    .setup-row .mono{font-family:ui-monospace,monospace;font-size:12px;font-weight:600}
    .setup-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:4px}
    .setup-actions.col{flex-direction:column}
    .setup-actions.col .btn{width:100%;justify-content:center}
    .setup-help{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:18px 20px;font-size:13px;line-height:1.5}
    .setup-help h3{font-size:14px;font-weight:600;margin-bottom:10px}
    .setup-help p{color:var(--text-muted);margin-bottom:12px;font-size:12px}
    .help-list{list-style:none;margin:0 0 14px;padding:0;font-size:12px;color:var(--text-muted)}
    .help-list li{padding:4px 0;padding-left:14px;position:relative}
    .help-list li::before{content:'•';position:absolute;left:0;color:var(--primary)}
    .text-link{font-size:13px;color:var(--primary);font-weight:500;text-decoration:none}
    .text-link:hover{text-decoration:underline}
    .setup-wizard{display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap}
    .wizard-step{display:flex;align-items:center;gap:8px;padding:10px 14px;border:1px solid var(--border);border-radius:var(--radius);font-size:13px;color:var(--text-muted);background:var(--bg-card)}
    .wizard-step.on{border-color:var(--primary);background:var(--accent-bg);color:var(--primary);font-weight:600}
    .wizard-step.done{border-color:var(--success);color:var(--success)}
    .wizard-num{width:22px;height:22px;border-radius:50%;background:var(--bg-hover);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700}
    .wizard-step.on .wizard-num{background:var(--primary);color:var(--primary-text)}
    .wizard-step.done .wizard-num{background:var(--success);color:#fff}
    .setup-checklist{display:flex;flex-direction:column;gap:10px;margin-bottom:16px}
    .check-item{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--border);border-radius:var(--radius);font-size:13px;color:var(--text-muted)}
    .check-item span{width:24px;height:24px;border-radius:50%;background:var(--bg-hover);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0}
    .check-item.done{border-color:var(--success);color:var(--success);background:rgba(48,181,102,.06)}
    .check-item.done span{background:var(--success);color:#fff}
    .check-item.on{border-color:var(--primary);background:var(--accent-bg);color:var(--text);font-weight:500}
    .check-item.on span{background:var(--primary);color:var(--primary-text)}
    .setup-connected-rich{padding:20px 22px}
    .connected-banner{display:flex;align-items:center;gap:10px;margin-bottom:16px;flex-wrap:wrap}
    .setup-connect-card{text-align:center;max-width:400px}
    .setup-connect-card .int-logo{width:56px;height:56px;font-size:20px;margin:0 auto 16px}
    .setup-connect-card h1{font-size:22px;margin-bottom:8px}
    .setup-connect-card .setup-actions{margin:20px 0 16px}
    .settings-tabs{margin-bottom:16px}
    .settings-card{padding:20px 22px}
    .settings-scroll .settings-section{padding-bottom:20px;margin-bottom:20px;border-bottom:1px solid var(--border)}
    .settings-scroll .settings-section:last-child{border-bottom:none;margin-bottom:0;padding-bottom:0}
    .settings-section{margin-bottom:4px}
    .settings-section .flbl{margin-top:12px}
    .settings-section .flbl:first-child{margin-top:0}
    .settings-section .input{margin-bottom:4px}
    .settings-section .hint{margin:6px 0 12px;font-size:12px;color:var(--text-muted)}
    .settings-section .btn{margin-top:8px}
    .sec-title{font-size:15px;font-weight:600;margin-bottom:14px}
    .sec-title.danger-t{color:var(--danger)}
    .settings-layout{display:grid;grid-template-columns:200px 1fr;gap:16px;align-items:start}
    .settings-nav{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:8px}
    .settings-nav-item{padding:10px 12px;border-radius:var(--radius);font-size:13px;color:var(--text-muted);cursor:default;margin-bottom:2px}
    .settings-nav-item.on{background:var(--accent-bg);color:var(--primary);font-weight:600}
    .settings-2col{display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:start}
    .settings-stack{display:flex;flex-direction:column;gap:14px}
    .settings-layout-main{display:grid;grid-template-columns:1fr 320px;gap:16px;align-items:start}
    .danger-card{border-color:rgba(223,27,65,.35)!important;background:rgba(223,27,65,.04)}
    .danger-sec .sub{font-size:12px;color:var(--text-muted);margin-bottom:12px;line-height:1.45}
    .settings-accordion details{margin-bottom:10px;border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;background:var(--bg-card)}
    .settings-accordion summary{padding:14px 18px;font-weight:600;font-size:14px;cursor:pointer;background:var(--bg-hover)}
    .settings-accordion .pad{padding:16px 18px 18px}
    .ok{color:var(--success);font-size:12px;font-weight:600}
    .sync-bar,.bottom-bar{padding:12px 16px;background:var(--accent-bg);border-bottom:1px solid var(--border);font-size:13px;display:flex;align-items:center;gap:12px}
    .bottom-bar{position:fixed;bottom:0;left:0;right:0;border-top:1px solid var(--border);border-bottom:none;z-index:50}
    .sync-chip{font-size:11px;padding:4px 10px;border-radius:999px;background:var(--accent-bg);border:1px solid var(--primary);color:var(--primary)}
    .fake-header{display:flex;justify-content:space-between;padding:12px 20px;background:var(--bg-sidebar);border-bottom:1px solid var(--border);font-weight:600}
    .prog{flex:1;height:6px;background:var(--border);border-radius:999px;overflow:hidden;max-width:200px}
    .prog.sm{max-width:120px}
    .prog .fill{height:100%;background:var(--primary);border-radius:999px}
    .modal-bg{min-height:calc(100vh - var(--picker-h));display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.4)}
    [data-theme=light] .modal-bg{background:rgba(10,37,64,.2)}
    .modal{background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:28px;min-width:320px;box-shadow:var(--shadow)}
    .sync-widget{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:16px}
    .overlay-full{min-height:calc(100vh - var(--picker-h));display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px}
    .sync-float-card{position:fixed;bottom:24px;right:24px;width:min(360px,calc(100vw - 48px));background:var(--bg-card);border:1px solid var(--primary);border-radius:12px;padding:16px 18px;box-shadow:0 12px 40px rgba(0,0,0,.18);z-index:80}
    [data-theme=light] .sync-float-card{box-shadow:0 12px 40px rgba(10,37,64,.12)}
    .sync-float-hdr{display:flex;align-items:flex-start;gap:12px;margin-bottom:12px}
    .sync-float-spin{width:36px;height:36px;border-radius:50%;background:var(--accent-bg);border:1px solid var(--primary);display:flex;align-items:center;justify-content:center;font-size:18px;color:var(--primary);animation:spin 1s linear infinite;flex-shrink:0}
    .sync-float-hdr b{display:block;font-size:14px;margin-bottom:2px}
    .sync-float-hdr .sub{margin:0;font-size:12px}
    .sync-float-close{margin-left:auto;min-width:28px;padding:4px 8px}
    .sync-float-prog{max-width:none;margin-bottom:8px}
    .sync-float-hint{margin:0;font-size:11px;text-align:center}
    .dash-preview-body{position:relative}
    .app-topbar{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:12px 16px;margin:-4px -4px 16px;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}
    .topbar-brand{display:flex;align-items:center;gap:10px;font-weight:600;font-size:14px}
    .logo-i.sm{width:28px;height:28px;font-size:11px}
    .topbar-title{font-weight:600}
    .topbar-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-left:auto}
    .btn.ghost{background:transparent;border-color:transparent;color:var(--text-muted)}
    .sync-chip.sm{font-size:10px;padding:3px 8px}
    .sync-chip.ok-chip{border-color:var(--success);color:var(--success);background:rgba(48,181,102,.08)}
    .dash-preview-mini{opacity:.92}
    .preview-fade{opacity:.75;pointer-events:none}
    .user-menu{position:relative}
    .user-menu-trigger{display:inline-flex;align-items:center;gap:8px;padding:4px 8px 4px 4px;border:1px solid var(--border);border-radius:999px;background:var(--bg-hover);cursor:default;font:inherit;color:var(--text)}
    .user-menu-trigger.icon-only{padding:4px;border-radius:50%}
    .user-menu-trigger.text{border-radius:var(--radius);padding:6px 12px;background:var(--bg-card);font-size:13px;font-weight:500}
    .user-menu-name{font-size:13px;font-weight:600;max-width:100px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .chev{font-size:10px;color:var(--text-muted)}
    .user-menu-panel{display:none;position:absolute;top:calc(100% + 8px);right:0;min-width:200px;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);box-shadow:0 8px 30px rgba(0,0,0,.12);padding:6px;z-index:30}
    .user-menu.open .user-menu-panel{display:block}
    .menu-item,.menu-item.linkish{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:6px;font-size:13px;color:var(--text);text-decoration:none;cursor:default}
    .menu-item:hover,.menu-item.linkish:hover{background:var(--bg-hover)}
    .menu-item.danger,.menu-item.linkish.danger{color:var(--danger)}
    .menu-item.plain{padding:8px 12px}
    .menu-sep{height:1px;background:var(--border);margin:6px 4px}
    .menu-ico{width:16px;height:16px;border-radius:4px;background:var(--accent-bg);border:1px solid var(--border);flex-shrink:0;position:relative}
    .menu-ico.user{border-radius:50%}
    .menu-ico.gear{border-radius:3px}
    .menu-ico.out{border-radius:3px;background:rgba(223,27,65,.08);border-color:rgba(223,27,65,.2)}
    .menu-user-block,.menu-profile-hdr{display:flex;align-items:center;gap:12px;padding:12px}
    .menu-user-block b,.menu-profile-hdr b{display:block;font-size:13px}
    .menu-user-block small,.menu-profile-hdr small{display:block;font-size:11px;color:var(--text-muted);margin-top:2px}
    .menu-role{display:inline-block;margin-top:4px;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:var(--primary);background:var(--accent-bg);padding:2px 6px;border-radius:4px}
    .menu-group{padding:4px 0}
    .menu-group-lbl{display:block;padding:6px 12px 4px;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:var(--text-muted)}
    .user-menu-panel.wide{min-width:240px}
    .user-menu-panel.compact{min-width:160px}
    .user-menu-panel.minimal{min-width:140px;padding:4px}
    .user-menu-sheet-wrap{position:relative;min-height:420px}
    .sheet-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.35);border-radius:var(--radius);z-index:20}
    [data-theme=light] .sheet-backdrop{background:rgba(10,37,64,.15)}
    .user-sheet{position:absolute;left:0;right:0;bottom:0;background:var(--bg-card);border-top:1px solid var(--border);border-radius:16px 16px 0 0;padding:8px 16px 20px;z-index:25;box-shadow:0 -8px 30px rgba(0,0,0,.1)}
    .sheet-handle{width:36px;height:4px;border-radius:999px;background:var(--border);margin:8px auto 12px}
    .toast.rich{display:flex;align-items:flex-start;gap:12px;min-width:320px;max-width:380px;padding:14px 16px;border-left:3px solid var(--success)}
    .toast.rich.toast-success{border-left-color:var(--success)}
    .toast-icon{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;flex-shrink:0}
    .toast-icon.ok{background:rgba(48,181,102,.12);color:var(--success)}
    .toast-body{flex:1;min-width:0}
    .toast-body b{display:block;font-size:14px;margin-bottom:4px}
    .toast-body p{font-size:12px;color:var(--text-muted);margin:0 0 10px;line-height:1.45}
    .toast-close{background:transparent;border:none;color:var(--text-muted);font-size:18px;line-height:1;padding:0 4px;cursor:default;flex-shrink:0}
    .badge.soft.won{background:rgba(48,181,102,.12);color:var(--success);border:1px solid rgba(48,181,102,.25)}
    .badge.soft.open{background:var(--accent-bg);color:var(--primary);border:1px solid rgba(99,91,255,.2)}
    .badge.soft.lost{background:rgba(223,27,65,.1);color:var(--danger);border:1px solid rgba(223,27,65,.2)}
    .empty-state-rich{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;min-height:420px;padding:48px 24px;gap:10px}
    .empty-state-rich h2{font-size:22px;font-weight:700;letter-spacing:-.03em}
    .empty-state-rich .sub{max-width:360px;line-height:1.5;margin-bottom:8px}
    .empty-actions{display:flex;align-items:center;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:8px}
    .empty-illus{width:88px;height:88px;border-radius:50%;background:var(--accent-bg);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;margin-bottom:8px}
    .empty-illus-inbox{width:36px;height:28px;border:2px solid var(--primary);border-radius:6px;position:relative;opacity:.55}
    .empty-illus-inbox::before{content:'';position:absolute;top:-2px;left:50%;transform:translateX(-50%);border:18px solid transparent;border-top:16px solid var(--primary);opacity:.45}
    .menu-demo{position:relative;display:inline-block}
    .avatar{width:36px;height:36px;border-radius:50%;background:var(--accent-bg);border:1px solid var(--border);font-size:12px;font-weight:700;cursor:default;color:var(--primary)}
    .avatar.only{width:32px;height:32px}
    .avatar.lg{width:44px;height:44px;font-size:14px}
    .dropdown{position:absolute;top:44px;right:0;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);min-width:160px;box-shadow:var(--shadow);font-size:13px;display:none;z-index:10}
    .menu-demo.open .dropdown{display:block}
    .dropdown div,.dropdown a,.dropdown span{display:block;padding:10px 14px;border-bottom:1px solid var(--border);color:var(--text);text-decoration:none}
    .dropdown .logout{color:var(--danger)}
    .dropdown.wide{min-width:200px}
    .dropdown .row{display:flex;align-items:center;gap:10px}
    .av-row{display:flex!important;align-items:center;gap:10px}
    .sheet-demo{min-height:calc(100vh - var(--picker-h));position:relative;background:var(--bg-hover)}
    .bottom-sheet{position:absolute;bottom:0;left:0;right:0;background:var(--bg-card);border-top:1px solid var(--border);border-radius:16px 16px 0 0;padding:20px}
    .toast-stage{min-height:calc(100vh - var(--picker-h));position:relative;padding:24px}
    .toast-stage.tr .toast{position:absolute;top:24px;right:24px}
    .toast-stage.br .toast{position:absolute;bottom:24px;right:24px}
    .toast-stage.tc .toast{position:absolute;top:24px;left:50%;transform:translateX(-50%)}
    .toast{padding:12px 16px;border-radius:var(--radius);border:1px solid var(--border);background:var(--bg-card);box-shadow:var(--shadow);font-size:13px;margin-bottom:8px;min-width:200px}
    .toast.ok{border-color:var(--success)}
    .toast.err{border-color:var(--danger)}
    .toast.info{border-color:var(--primary)}
    .toast.rich{padding:16px}
    .toast.rich p{font-size:12px;color:var(--text-muted);margin:4px 0 8px}
    .toast.pill{border-radius:999px;padding:8px 16px;min-width:auto}
    .toast-demo{position:fixed;top:70px;right:20px;z-index:100}
    .badge-stage{display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:center;min-height:calc(100vh - var(--picker-h));padding:40px}
    .empty{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;min-height:300px;gap:8px;padding:40px}
    .empty.compact{min-height:120px;font-size:13px}
    .empty.sm{padding:24px}
    .empty.minimal{color:var(--text-muted)}
    .empty.hero h1{font-size:32px}
    .empty.row-e{flex-direction:row;text-align:left;gap:16px}
    .empty.split-e{flex-direction:row;justify-content:space-between;width:100%;max-width:560px;margin:40px auto}
    .empty-in .empty{border:none}
    .grid-2-sub{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .dash-asym{display:grid;grid-template-columns:1fr 2fr;gap:12px}
    .dual-nav .sidebar{width:240px}
    .dual-nav .sidebar.wide-nav{width:260px}
    .sidebar-foot{margin-top:auto;padding:12px 10px;font-size:11px;color:var(--text-muted);border-top:1px solid var(--border)}
    .page-hdr{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;margin-bottom:16px;flex-wrap:wrap}
    .page-hdr h1{font-size:20px;font-weight:700;margin-top:4px}
    .hdr-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
    .avatar.sm{width:28px;height:28px;font-size:10px;display:inline-flex;align-items:center;justify-content:center;border-radius:50%;background:var(--accent-bg);border:1px solid var(--border);color:var(--primary);font-weight:700}
    .placeholder.flat{margin-top:0;min-height:120px;display:flex;align-items:center;justify-content:center}
    .help{font-size:12px;color:var(--text-muted);padding:16px;background:var(--bg-hover);border-radius:var(--radius)}
    .minimal-status{color:var(--text-muted);font-size:14px}
    .hero-icon{font-size:56px}
    @media(max-width:960px){.deals-layout-split,.kanban-board,.detail-json{grid-template-columns:1fr}.filters-panel{position:static}}
    @media(max-width:768px){.stats.r4,.detail-2col,.detail-side,.kanban-board,.int-split-rich,.set-2col,.settings-2col,.settings-layout,.settings-layout-main,.setup-layout{grid-template-columns:1fr}.sidebar{display:none}.split-page{flex-direction:column}.field-row{grid-template-columns:1fr;gap:4px}.int-list-item{flex-direction:column;align-items:flex-start}.int-list-right{width:100%;justify-content:space-between}}
  </style>
</head>
<body data-theme="light">
  <div class="picker">
    <div class="picker-letter">${screen.letter}</div>
    <div class="picker-meta"><strong>№${screen.num} · ${screen.id}</strong> ${screen.title}<br><em>${screen.route} · 7 вариантов</em></div>
    <div class="v-btns">${[1,2,3,4,5,6,7].map(n => `<button class="v-btn${n===1?' active':''}" data-v="${n}">${n}</button>`).join('')}</div>
    <button class="theme-btn" id="theme-btn">☀️ Light</button>
    <a class="nav-btn" href="${prevHref}">← Назад</a>
    ${nextHref ? `<a class="nav-btn primary" href="${nextHref}">Далее →</a>` : '<span class="nav-btn disabled">Конец</span>'}
  </div>
  <div class="stage">
    ${variantsHtml(screen.letter, labels, bodies)}
  </div>
  <script>
    const btns=document.querySelectorAll('.v-btn');
    const variants=document.querySelectorAll('.variant');
    btns.forEach(b=>b.addEventListener('click',()=>{
      btns.forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      variants.forEach(v=>v.classList.toggle('active',v.dataset.v===b.dataset.v));
      localStorage.setItem('preset-${screen.letter.toLowerCase()}-v',b.dataset.v);
    }));
    const saved=localStorage.getItem('preset-${screen.letter.toLowerCase()}-v');
    if(saved){const b=document.querySelector('.v-btn[data-v="'+saved+'"]');if(b)b.click();}
    let theme=localStorage.getItem('crmforge-theme')||'light';
    const tb=document.getElementById('theme-btn');
    function applyTheme(t){theme=t;document.body.setAttribute('data-theme',t);tb.textContent=t==='dark'?'🌙 Dark':'☀️ Light';localStorage.setItem('crmforge-theme',t);}
    tb.addEventListener('click',()=>applyTheme(theme==='dark'?'light':'dark'));
    applyTheme(theme);
  </script>
</body>
</html>`;
}

SCREENS.forEach((screen, idx) => {
  const filename = `${screen.letter.toLowerCase()}-${screen.slug}.html`;
  writeFileSync(join(DIR, filename), buildHtml(screen, idx), 'utf8');
  console.log('✓', filename);
});

console.log(`\nGenerated ${SCREENS.length} preset files.`);
