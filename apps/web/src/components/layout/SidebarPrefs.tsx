import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useTranslation } from 'react-i18next'
import { setLocale } from '@/i18n'
import { cn } from '@/lib/utils'
import { useUpdateProfile, useMe } from '@/features/auth/hooks'
import { ProfileMenu } from './ProfileMenu'

export function SidebarPrefs() {
  const { theme, setTheme } = useTheme()
  const { i18n } = useTranslation()
  const { data: user } = useMe()
  const updateProfile = useUpdateProfile()
  const locale = (i18n.language === 'en' ? 'en' : 'ru') as 'ru' | 'en'

  function switchLocale(next: 'ru' | 'en') {
    setLocale(next)
    if (user) updateProfile.mutate({ locale: next })
  }

  return (
    <div className="mt-auto border-t border-[var(--border)] px-2 pt-3">
      <div className="flex items-center gap-2">
        <div className="flex rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-hover)] p-0.5">
          {(['ru', 'en'] as const).map((lng) => (
            <button
              key={lng}
              type="button"
              onClick={() => switchLocale(lng)}
              className={cn(
                'rounded-md px-2.5 py-1.5 text-[11px] font-semibold uppercase',
                locale === lng
                  ? 'bg-[var(--bg-card)] text-[var(--text)] shadow-[var(--shadow)]'
                  : 'text-[var(--text-muted)]',
              )}
            >
              {lng}
            </button>
          ))}
        </div>
        <button
          type="button"
          aria-label="Toggle theme"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text)]"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <ProfileMenu />
      </div>
    </div>
  )
}
