import { useEffect, useRef } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { ACCESS_TOKEN_KEY } from '@/lib/constants'
import { useVerifyEmail } from '@/features/auth/hooks'
import { getApiErrorMessage } from '@/lib/api-client'

export default function VerifyEmailPage() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const verify = useVerifyEmail()
  const token = searchParams.get('token')
  const started = useRef(false)

  useEffect(() => {
    if (!token || started.current) return
    started.current = true
    verify.mutate(token, {
      onSuccess: () => {
        toast.success(t('auth.verifySuccess'))
        const isLoggedIn = Boolean(localStorage.getItem(ACCESS_TOKEN_KEY))
        navigate(isLoggedIn ? '/' : '/login', { replace: true })
      },
      onError: (err) => toast.error(getApiErrorMessage(err)),
    })
  }, [token, verify, navigate, t])

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <Card className="w-full max-w-md text-center shadow-[var(--shadow)]">
        <CardContent className="px-8 py-10">
          <div
            className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-[3px] border-[var(--border)] border-t-[var(--primary)]"
            role="status"
            aria-label={t('common.loading')}
          />
          <h1 className="mb-2 text-xl font-bold">{t('auth.verifyTitle')}</h1>
          <p className="text-sm text-[var(--text-muted)]">{t('auth.verifyDesc')}</p>
          {!token && (
            <p className="mt-4 text-xs text-[var(--danger)]">
              <Link to="/login" className="text-[var(--primary)] underline hover:opacity-90">
                {t('auth.login')}
              </Link>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
