import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { EmptyState } from '@/components/layout/EmptyState'
import { SyncButton } from '@/components/layout/SyncFloatingPanel'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { DealStatusBadge } from '@/components/ui/deal-status-badge'
import { Input, Label, Select } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useDeals } from '@/features/deals/hooks'
import { formatDate, formatMoney, cn } from '@/lib/utils'

const PAGE_SIZE = 8

export default function DealsPage() {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 300)
    return () => window.clearTimeout(timer)
  }, [search])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, status])

  const { data, isLoading, isFetching } = useDeals({
    page,
    limit: PAGE_SIZE,
    search: debouncedSearch || undefined,
    status: status || undefined,
    sort: 'syncedAt',
    order: 'desc',
  })

  const deals = data?.data ?? []
  const meta = data?.meta
  const totalPages = meta ? Math.max(1, Math.ceil(meta.total / meta.limit)) : 1
  const empty = !isLoading && deals.length === 0

  return (
    <div>
      <header className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight">{t('deals.title')}</h1>
          <p className="text-sm text-[var(--text-muted)]">
            {meta?.total ?? 0} {t('deals.subtitle')}
          </p>
        </div>
        <SyncButton />
      </header>

      <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
        <aside className="sticky top-4 h-fit rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-card)] p-4 shadow-[var(--shadow)]">
          <h3 className="mb-3 text-sm font-semibold">{t('deals.status')}</h3>
          <div className="space-y-3">
            <div>
              <Label htmlFor="deal-search" className="normal-case">
                {t('deals.search')}
              </Label>
              <Input
                id="deal-search"
                placeholder={t('deals.search')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mt-1 normal-case"
              />
            </div>
            <div>
              <Label htmlFor="deal-status" className="normal-case">
                {t('deals.status')}
              </Label>
              <Select
                id="deal-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 normal-case"
              >
                <option value="">{t('deals.allStatuses')}</option>
                <option value="open">Open</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </Select>
            </div>
            {meta && (
              <p className="text-xs text-[var(--text-muted)]">
                {meta.total} {t('deals.title').toLowerCase()}
              </p>
            )}
          </div>
        </aside>

        <div>
          {empty ? (
            <Card>
              <EmptyState
                title={t('deals.emptyTitle')}
                description={t('deals.emptyDesc')}
                action={t('dashboard.connect')}
                actionHref="/integrations/amocrm"
              />
            </Card>
          ) : (
            <Card className="overflow-hidden p-0">
              {isLoading ? (
                <div className="space-y-2 p-5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <>
                  <div className={cn('overflow-x-auto', isFetching && 'opacity-60')}>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[var(--border)] bg-[var(--bg-card)] text-left text-[11px] uppercase text-[var(--text-muted)]">
                          <th className="px-4 py-2.5 font-semibold">{t('deals.title')}</th>
                          <th className="px-4 py-2.5 font-semibold">{t('deals.amount')}</th>
                          <th className="px-4 py-2.5 font-semibold">{t('deals.status')}</th>
                          <th className="px-4 py-2.5 font-semibold">{t('deals.contact')}</th>
                          <th className="px-4 py-2.5 font-semibold">{t('deals.syncedAt')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {deals.map((deal) => (
                          <tr
                            key={deal.id}
                            className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-hover)]"
                          >
                            <td className="px-4 py-2.5">
                              <Link to={`/deals/${deal.id}`} className="block font-medium hover:text-[var(--primary)]">
                                {deal.title}
                              </Link>
                              {deal.externalId && (
                                <div className="text-[11px] text-[var(--text-muted)]">ID {deal.externalId}</div>
                              )}
                            </td>
                            <td className="px-4 py-2.5">{formatMoney(deal.amount, deal.currency ?? 'RUB')}</td>
                            <td className="px-4 py-2.5">
                              <DealStatusBadge status={deal.status} />
                            </td>
                            <td className="px-4 py-2.5">{deal.contactName ?? '—'}</td>
                            <td className="whitespace-nowrap px-4 py-2.5 text-xs text-[var(--text-muted)]">
                              {formatDate(deal.syncedAt)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {meta && meta.total > PAGE_SIZE && (
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] px-4 py-3">
                      <span className="text-xs text-[var(--text-muted)]">
                        {page} / {totalPages} · {deals.length} / {meta.total}
                      </span>
                      <div className="flex gap-1">
                        <Button
                          type="button"
                          size="sm"
                          variant="default"
                          disabled={page <= 1}
                          onClick={() => setPage((p) => p - 1)}
                        >
                          ←
                        </Button>
                        <Button type="button" size="sm" variant={page === 1 ? 'primary' : 'default'} disabled>
                          {page}
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="default"
                          disabled={page >= totalPages}
                          onClick={() => setPage((p) => p + 1)}
                        >
                          →
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
