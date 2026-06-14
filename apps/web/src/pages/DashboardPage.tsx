import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Breadcrumbs } from '@/components/layout/ProfileMenu'
import { SyncButton } from '@/components/layout/SyncFloatingPanel'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DealStatusBadge } from '@/components/ui/deal-status-badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { useDealStats, useDeals } from '@/features/deals/hooks'
import { useAmoCrmStatus } from '@/features/integrations/hooks'
import { formatDate, formatMoney } from '@/lib/utils'

function StatCard({ label, value, loading }: { label: string; value: string | number; loading?: boolean }) {
  return (
    <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-card)] px-5 py-4 shadow-[var(--shadow)]">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">{label}</span>
      {loading ? (
        <Skeleton className="mt-2 h-8 w-20" />
      ) : (
        <span className="mt-1 block text-2xl font-bold tracking-tight">{value}</span>
      )}
    </div>
  )
}

export default function DashboardPage() {
  const { t } = useTranslation()
  const { data: stats, isLoading: statsLoading } = useDealStats()
  const { data: dealsData, isLoading: dealsLoading } = useDeals({ page: 1, limit: 5, sort: 'syncedAt', order: 'desc' })
  const { data: amoStatus, isLoading: amoLoading } = useAmoCrmStatus()

  const connected = amoStatus?.connected ?? false
  const deals = dealsData?.data ?? []

  return (
    <div>
      <Breadcrumbs items={[{ label: 'CRMForge', href: '/' }, { label: t('dashboard.title') }]} />

      {!amoLoading && !connected && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius)] border border-[var(--primary)] bg-[var(--accent-bg)] px-5 py-3.5">
          <div>
            <div className="text-sm font-semibold">{t('dashboard.emptyIntegration')}</div>
            <p className="mt-0.5 text-xs text-[var(--text-muted)]">{t('dashboard.emptyIntegrationDesc')}</p>
          </div>
          <Button asChild variant="primary" size="sm">
            <Link to="/integrations/amocrm">{t('dashboard.connect')}</Link>
          </Button>
        </div>
      )}

      <header className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight">{t('dashboard.title')}</h1>
          <p className="text-sm text-[var(--text-muted)]">{t('dashboard.subtitle')}</p>
        </div>
        <SyncButton />
      </header>

      <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label={t('dashboard.statsTotal')} value={stats?.total ?? 0} loading={statsLoading} />
        <StatCard label={t('dashboard.statsWon')} value={stats?.won ?? 0} loading={statsLoading} />
        <StatCard label={t('dashboard.statsOpen')} value={stats?.open ?? 0} loading={statsLoading} />
        <StatCard label={t('dashboard.statsPipeline')} value="—" loading={statsLoading} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        <Card className="overflow-hidden p-0">
          <CardHeader>
            <CardTitle>{t('dashboard.recentDeals')}</CardTitle>
            <Link to="/deals" className="text-xs font-medium text-[var(--primary)] hover:underline">
              {t('dashboard.allDeals')} →
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {dealsLoading ? (
              <div className="space-y-3 px-5 pb-5">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : deals.length === 0 ? (
              <p className="px-5 pb-5 text-sm text-[var(--text-muted)]">{t('deals.emptyTitle')}</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] text-left text-[11px] uppercase text-[var(--text-muted)]">
                    <th className="px-4 py-2.5 font-semibold">{t('deals.title')}</th>
                    <th className="px-4 py-2.5 font-semibold">{t('deals.amount')}</th>
                    <th className="px-4 py-2.5 font-semibold">{t('deals.status')}</th>
                    <th className="hidden px-4 py-2.5 font-semibold sm:table-cell">{t('deals.contact')}</th>
                  </tr>
                </thead>
                <tbody>
                  {deals.map((deal) => (
                    <tr key={deal.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-hover)]">
                      <td className="px-4 py-2.5">
                        <Link to={`/deals/${deal.id}`} className="block">
                          <div className="font-medium">{deal.title}</div>
                          <div className="text-[11px] text-[var(--text-muted)]">
                            {deal.syncedAt ? formatDate(deal.syncedAt) : '—'}
                          </div>
                        </Link>
                      </td>
                      <td className="px-4 py-2.5">{formatMoney(deal.amount, deal.currency ?? 'RUB')}</td>
                      <td className="px-4 py-2.5">
                        <DealStatusBadge status={deal.status} />
                      </td>
                      <td className="hidden px-4 py-2.5 sm:table-cell">{deal.contactName ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden p-0">
          <CardHeader>
            <CardTitle>{t('dashboard.integrations')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {amoLoading ? (
              <Skeleton className="h-16 w-full" />
            ) : connected ? (
              <>
                <div className="flex items-center gap-3 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-hover)] p-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius)] bg-[var(--amocrm-brand)] text-sm font-extrabold text-white">
                    a
                  </span>
                  <div>
                    <div className="text-sm font-semibold">amoCRM</div>
                    <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-[var(--text-muted)]">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
                      {t('integrations.connected')}
                      {amoStatus?.subdomain ? ` · ${amoStatus.subdomain}` : ''}
                    </div>
                  </div>
                </div>
                <div className="rounded-[var(--radius)] border border-dashed border-[var(--border)] p-3.5 text-center">
                  <SyncButton className="w-full" />
                </div>
              </>
            ) : (
              <div className="rounded-[var(--radius)] border border-dashed border-[var(--border)] p-4 text-center">
                <p className="mb-3 text-xs text-[var(--text-muted)]">{t('dashboard.emptyIntegrationDesc')}</p>
                <Button asChild variant="primary" size="sm" className="w-full">
                  <Link to="/integrations/amocrm">{t('dashboard.connect')}</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
