import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/ui/card'
import { DealStatusBadge } from '@/components/ui/deal-status-badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useDeal } from '@/features/deals/hooks'
import { formatDate, formatMoney } from '@/lib/utils'

function FieldRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="grid gap-2 border-b border-[var(--border)] py-2.5 text-sm last:border-0 sm:grid-cols-[140px_1fr] sm:items-center">
      <span className="font-medium text-[var(--text-muted)]">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  )
}

export default function DealDetailPage() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const { data: deal, isLoading, isError } = useDeal(id)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  if (isError || !deal) {
    return (
      <div className="text-sm text-[var(--text-muted)]">
        <Link to="/deals" className="mb-4 inline-block text-[var(--primary)] hover:underline">
          ← {t('deals.back')}
        </Link>
        <p>{t('deals.emptyTitle')}</p>
      </div>
    )
  }

  return (
    <div>
      <Link to="/deals" className="mb-3 inline-block text-sm text-[var(--primary)] hover:underline">
        ← {t('deals.back')}
      </Link>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h1 className="text-[22px] font-bold tracking-tight">{deal.title}</h1>
        <DealStatusBadge status={deal.status} />
      </div>
      <p className="mb-5 text-3xl font-extrabold tracking-tight">
        {formatMoney(deal.amount, deal.currency ?? 'RUB')}
      </p>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="json">JSON</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardContent className="px-5 py-2">
              <FieldRow label={t('deals.title')} value={deal.title} />
              <FieldRow label={t('deals.amount')} value={formatMoney(deal.amount, deal.currency ?? 'RUB')} />
              <FieldRow label={t('deals.status')} value={<DealStatusBadge status={deal.status} />} />
              <FieldRow label={t('deals.contact')} value={deal.contactName ?? '—'} />
              <FieldRow label="Stage" value={deal.stage ?? '—'} />
              <FieldRow label="amoCRM ID" value={<span className="font-mono text-xs">{deal.externalId ?? '—'}</span>} />
              <FieldRow label="Created" value={formatDate(deal.createdAt)} />
              <FieldRow label={t('deals.syncedAt')} value={formatDate(deal.syncedAt)} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="json">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <pre className="max-h-[360px] overflow-auto bg-[var(--bg-hover)] p-4 text-[11px] leading-relaxed text-[var(--text-muted)]">
                {JSON.stringify(deal.rawPayload ?? deal, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
