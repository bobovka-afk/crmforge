import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { NAV_ITEMS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { SidebarPrefs } from './SidebarPrefs'

export function Sidebar() {
  const { t } = useTranslation()

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--bg-sidebar)] px-2.5 py-4">
      <div className="mb-4 flex items-center gap-2 px-2 font-bold text-sm">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--primary)] text-xs font-extrabold text-[var(--primary-text)]">
          CF
        </span>
        CRMForge
      </div>
      <nav className="flex flex-1 flex-col gap-0.5">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === '/'}
            className={({ isActive }) =>
              cn(
                'rounded-[var(--radius)] px-2.5 py-2 text-sm',
                isActive
                  ? 'bg-[var(--accent-bg)] font-semibold text-[var(--primary)]'
                  : 'text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text)]',
              )
            }
          >
            {t(item.labelKey)}
          </NavLink>
        ))}
      </nav>
      <SidebarPrefs />
    </aside>
  )
}
