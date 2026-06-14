import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useLogout, useMe } from '@/features/auth/hooks'
import { getInitials } from '@/lib/utils'

export function ProfileMenu() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data: user } = useMe()
  const logout = useLogout()

  const initials = getInitials(user?.name, user?.email)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Profile menu"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius)] border border-[var(--border)] bg-[var(--accent-bg)] text-xs font-extrabold text-[var(--primary)] hover:border-[var(--primary)]"
        >
          {initials}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start" className="mb-1">
        <DropdownMenuLabel>
          <div className="flex items-center gap-3 py-1">
            <span className="flex h-8 w-8 items-center justify-center rounded-[var(--radius)] bg-[var(--accent-bg)] text-xs font-bold text-[var(--primary)]">
              {initials}
            </span>
            <div>
              <div className="font-semibold">{user?.name ?? user?.email}</div>
              <div className="text-xs font-normal text-[var(--text-muted)]">{user?.email}</div>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
          {t('profileMenu.account')}
        </div>
        <DropdownMenuItem onSelect={() => navigate('/settings')}>{t('profileMenu.profile')}</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => navigate('/settings/security')}>
          {t('profileMenu.security')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-[var(--danger)] focus:text-[var(--danger)]"
          onSelect={() => logout.mutate(undefined, { onSuccess: () => navigate('/login') })}
        >
          {t('profileMenu.logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1.5 text-xs text-[var(--text-muted)]">
      {items.map((item, i) => (
        <span key={item.label} className="flex items-center gap-1.5">
          {i > 0 && <span>/</span>}
          {item.href ? (
            <Link to={item.href} className="hover:text-[var(--primary)]">
              {item.label}
            </Link>
          ) : (
            <span>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
