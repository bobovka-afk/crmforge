import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAmoCrmStatus } from '@/features/integrations/hooks'
import { cn } from '@/lib/utils'

type IntegrationRow = {
  id: string
  name: string
  logo: string
  logoClass?: string
  subtitle: string
  soon?: boolean
  href?: string
  connected?: boolean
}

export default function IntegrationsPage() {
  const { t } = useTranslation()
  const { data: amoStatus, isLoading } = useAmoCrmStatus()

  const rows: IntegrationRow[] = [
    {
      id: 'amocrm',
      name: 'amoCRM',
      logo: 'a',
      logoClass: 'bg-[var(--amocrm-brand)]',
      subtitle: amoStatus?.connected
        ? `${t('integrations.connected')}${amoStatus.subdomain ? ` · ${amoStatus.subdomain}` : ''}`
        : 'OAuth · demo mode',
      connected: amoStatus?.connected,
      href: '/integrations/amocrm',
    },
    {
      id: 'bitrix',
      name: 'Bitrix24',
      logo: 'B',
      logoClass: 'bg-[#2fc6f6]',
      subtitle: 'CRM & tasks',
      soon: true,
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      logo: 'H',
      logoClass: 'bg-[#ff7a59]',
      subtitle: 'Marketing & sales',
      soon: true,
    },
    {
      id: 'salesforce',
      name: 'Salesforce',
      logo: 'S',
      logoClass: 'bg-[#00a1e0]',
      subtitle: 'Enterprise CRM',
      soon: true,
    },
  ]

  return (
    <div>
      <header className="mb-5">
        <h1 className="text-[22px] font-bold tracking-tight">{t('integrations.title')}</h1>
        <p className="text-sm text-[var(--text-muted)]">{t('integrations.subtitle')}</p>
      </header>

      <div className="space-y-2.5">
        {isLoading ? (
          Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-[72px] w-full" />)
        ) : (
          rows.map((row) => (
            <div
              key={row.id}
              className={cn(
                'flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-card)] px-5 py-4 shadow-[var(--shadow)]',
                row.soon && 'opacity-55',
              )}
            >
              <div className="flex min-w-[200px] flex-1 items-center gap-3.5">
                <span
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius)] text-sm font-extrabold',
                    row.logoClass ?? 'bg-[var(--primary)] text-[var(--primary-text)]',
                    row.logoClass && 'text-white',
                  )}
                >
                  {row.logo}
                </span>
                <div>
                  <div className="text-sm font-semibold">{row.name}</div>
                  <p className="text-xs text-[var(--text-muted)]">{row.subtitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {row.connected && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[color-mix(in_srgb,var(--success)_12%,transparent)] px-2.5 py-1 text-[11px] font-semibold text-[var(--success)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
                    {t('integrations.connected')}
                  </span>
                )}
                {row.soon ? (
                  <span className="rounded-full border border-[var(--border)] bg-[var(--bg-hover)] px-2.5 py-1 text-[11px] font-semibold text-[var(--text-muted)]">
                    {t('integrations.soon')}
                  </span>
                ) : row.href ? (
                  <Button asChild variant="default" size="sm">
                    <Link to={row.href}>{t('integrations.configure')}</Link>
                  </Button>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
