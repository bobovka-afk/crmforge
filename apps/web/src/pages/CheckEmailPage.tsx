import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useResendVerification } from '@/features/auth/hooks'
import { getApiErrorMessage } from '@/lib/api-client'

export default function CheckEmailPage() {
  const { t } = useTranslation()
  const location = useLocation()
  const email = (location.state as { email?: string } | null)?.email ?? ''
  const resend = useResendVerification()

  const handleResend = () => {
    if (!email) {
      toast.error(t('auth.email'))
      return
    }
    resend.mutate(email, {
      onSuccess: () => toast.success(t('auth.resend')),
      onError: (err) => toast.error(getApiErrorMessage(err)),
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <Card className="w-full max-w-md text-center shadow-[var(--shadow)]">
        <CardContent className="px-8 py-10">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--accent-bg)] text-2xl">
            ✉
          </div>

          <div className="mb-5 flex justify-center gap-2 text-[11px]">
            <span className="rounded-full border border-[var(--primary)] bg-[var(--accent-bg)] px-2.5 py-1 font-semibold text-[var(--primary)]">
              1 · Register
            </span>
            <span className="rounded-full border border-[var(--primary)] bg-[var(--primary)] px-2.5 py-1 font-semibold text-[var(--primary-text)]">
              2 · Email
            </span>
            <span className="rounded-full border border-[var(--border)] px-2.5 py-1 text-[var(--text-muted)]">
              3 · Verify
            </span>
          </div>

          <h1 className="mb-2 text-xl font-bold">{t('auth.checkEmailTitle')}</h1>
          <p className="text-sm text-[var(--text-muted)]">
            {t('auth.checkEmailDesc')}{' '}
            {email ? <strong className="text-[var(--text)]">{email}</strong> : null}
          </p>

          <Button
            type="button"
            variant="default"
            className="mt-6 w-full"
            disabled={resend.isPending || !email}
            onClick={handleResend}
          >
            {t('auth.resend')}
          </Button>

          <p className="mt-4 text-xs text-[var(--text-muted)]">
            <Link to="/login" className="text-[var(--primary)] hover:underline">
              {t('auth.login')}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
