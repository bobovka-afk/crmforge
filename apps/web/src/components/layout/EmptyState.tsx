import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function EmptyState({
  title,
  description,
  action,
  actionHref,
}: {
  title: string
  description: string
  action?: string
  actionHref?: string
  children?: ReactNode
}) {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-4 flex h-[88px] w-[88px] items-center justify-center rounded-full border border-[var(--border)] bg-[var(--accent-bg)]">
        <span className="relative h-7 w-9 rounded-md border-2 border-[var(--primary)] opacity-55 before:absolute before:-top-0.5 before:left-1/2 before:-translate-x-1/2 before:border-x-[18px] before:border-t-[16px] before:border-x-transparent before:border-t-[var(--primary)] before:opacity-45 before:content-['']" />
      </div>
      <h2 className="mb-2 text-xl font-bold tracking-tight">{title}</h2>
      <p className="mb-6 max-w-sm text-sm text-[var(--text-muted)]">{description}</p>
      {action && actionHref && (
        <Button asChild variant="primary">
          <Link to={actionHref}>{action}</Link>
        </Button>
      )}
    </div>
  )
}
