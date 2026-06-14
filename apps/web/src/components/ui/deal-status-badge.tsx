import { cn } from '@/lib/utils'

const styles: Record<string, string> = {
  won: 'bg-[color-mix(in_srgb,var(--success)_12%,transparent)] text-[var(--success)] border border-[color-mix(in_srgb,var(--success)_25%,transparent)]',
  open: 'bg-[var(--accent-bg)] text-[var(--primary)] border border-[color-mix(in_srgb,var(--primary)_20%,transparent)]',
  lost: 'bg-[color-mix(in_srgb,var(--danger)_10%,transparent)] text-[var(--danger)] border border-[color-mix(in_srgb,var(--danger)_20%,transparent)]',
}

const labels: Record<string, string> = {
  won: 'Выиграна',
  open: 'В работе',
  lost: 'Проиграна',
}

export function DealStatusBadge({ status, className }: { status: string; className?: string }) {
  const key = status.toLowerCase()
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
        styles[key] ?? styles.open,
        className,
      )}
    >
      {labels[key] ?? status}
    </span>
  )
}
