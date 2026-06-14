import { setLocale } from '@/i18n'
import { cn } from '@/lib/utils'

export function AuthLocaleSwitch({
  value,
  onChange,
}: {
  value: 'ru' | 'en'
  onChange?: (next: 'ru' | 'en') => void
}) {
  function switchLocale(next: 'ru' | 'en') {
    setLocale(next)
    onChange?.(next)
  }

  return (
    <div className="flex rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-hover)] p-0.5">
      {(['ru', 'en'] as const).map((lng) => (
        <button
          key={lng}
          type="button"
          onClick={() => switchLocale(lng)}
          className={cn(
            'rounded-md px-2.5 py-1.5 text-[11px] font-semibold uppercase',
            value === lng
              ? 'bg-[var(--bg-card)] text-[var(--text)] shadow-[var(--shadow)]'
              : 'text-[var(--text-muted)]',
          )}
        >
          {lng}
        </button>
      ))}
    </div>
  )
}
