import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAmoCrmStatus, useConnectAmoDemo, useOAuthUrl } from '@/features/integrations/hooks'
import { getApiErrorMessage } from '@/lib/api-client'

export default function AmoCrmSetupPage() {
  const { t } = useTranslation()
  const { data: status, isLoading } = useAmoCrmStatus()
  const oauth = useOAuthUrl()
  const connectDemo = useConnectAmoDemo()

  const handleOAuth = () => {
    oauth.mutate(undefined, {
      onSuccess: (url) => {
        window.location.href = url
      },
      onError: (err) => toast.error(getApiErrorMessage(err)),
    })
  }

  const handleDemo = () => {
    connectDemo.mutate(undefined, {
      onSuccess: () => toast.success(t('integrations.connected')),
      onError: (err) => toast.error(getApiErrorMessage(err)),
    })
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Skeleton className="h-64 w-full max-w-md" />
      </div>
    )
  }

  if (status?.connected) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-6">
        <Card className="w-full max-w-md text-center">
          <CardContent className="px-8 py-10">
            <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[var(--radius)] bg-[var(--amocrm-brand)] text-xl font-extrabold text-white">
              a
            </span>
            <h1 className="mb-2 text-xl font-bold">amoCRM</h1>
            <p className="mb-1 text-sm text-[var(--success)]">{t('integrations.connected')}</p>
            {status.subdomain && (
              <p className="text-xs text-[var(--text-muted)]">{status.subdomain}</p>
            )}
            <div className="mt-6 flex flex-col gap-2">
              <Button asChild variant="default">
                <Link to="/integrations">← {t('integrations.title')}</Link>
              </Button>
              <Button asChild variant="primary">
                <Link to="/">{t('nav.dashboard')}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-6">
      <Card className="w-full max-w-md text-center shadow-[var(--shadow)]">
        <CardContent className="px-8 py-10">
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[var(--radius)] bg-[var(--amocrm-brand)] text-xl font-extrabold text-white">
            a
          </span>
          <h1 className="mb-2 text-xl font-bold">amoCRM</h1>
          <p className="text-sm text-[var(--text-muted)]">{t('integrations.subtitle')}</p>

          <div className="my-6 flex flex-col gap-2">
            <Button type="button" variant="primary" className="w-full" disabled={oauth.isPending} onClick={handleOAuth}>
              Connect OAuth
            </Button>
            <Button type="button" variant="default" className="w-full" disabled={connectDemo.isPending} onClick={handleDemo}>
              Connect demo
            </Button>
          </div>

          <Link to="/integrations" className="text-sm font-medium text-[var(--primary)] hover:underline">
            ← {t('integrations.title')}
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
