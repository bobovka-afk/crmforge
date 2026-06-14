import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useMe, useResendVerification } from '@/features/auth/hooks'
import { getApiErrorMessage } from '@/lib/api-client'

export function EmailVerificationBanner() {
  const { t } = useTranslation()
  const { data: user } = useMe()
  const resend = useResendVerification()

  if (!user || user.emailVerified || user.authProvider !== 'local') {
    return null
  }

  const handleResend = () => {
    resend.mutate(user.email, {
      onSuccess: () => toast.success(t('auth.resendSuccess')),
      onError: (err) => toast.error(getApiErrorMessage(err)),
    })
  }

  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius)] border border-[color-mix(in_srgb,var(--warning,#f59e0b)_35%,transparent)] bg-[color-mix(in_srgb,var(--warning,#f59e0b)_8%,transparent)] px-4 py-3 text-sm">
      <p className="text-[var(--text-muted)]">
        {t('auth.verifyLaterBanner')}{' '}
        <Link to="/settings/profile" className="font-medium text-[var(--primary)] hover:underline">
          {t('auth.verifyLaterLink')}
        </Link>
      </p>
      <Button type="button" variant="default" size="sm" disabled={resend.isPending} onClick={handleResend}>
        {t('auth.resend')}
      </Button>
    </div>
  )
}
