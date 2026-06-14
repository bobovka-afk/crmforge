import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/input'
import { AuthLocaleSwitch } from '@/components/layout/AuthLocaleSwitch'
import { GoogleButton } from '@/components/layout/GoogleButton'
import { useLogin } from '@/features/auth/hooks'
import { getApiErrorMessage } from '@/lib/api-client'

type LoginForm = {
  email: string
  password: string
}

export default function LoginPage() {
  const { t, i18n } = useTranslation()
  const locale = (i18n.language === 'en' ? 'en' : 'ru') as 'ru' | 'en'
  const navigate = useNavigate()
  const login = useLogin()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>()

  const onSubmit = handleSubmit((values) => {
    login.mutate(values, {
      onSuccess: () => navigate('/'),
      onError: (err) => toast.error(getApiErrorMessage(err)),
    })
  })

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <div className="flex flex-1 flex-col justify-center bg-[var(--primary)] px-10 py-12 text-[var(--primary-text)] md:px-12">
        <h2 className="text-3xl font-bold tracking-tight">CRMForge</h2>
        <p className="mt-3 text-sm opacity-90">CRM + amoCRM sync</p>
        <p className="mt-1 text-sm opacity-75">Portfolio-ready dashboard</p>
        <ul className="mt-8 space-y-2 text-sm opacity-85">
          <li className="border-b border-white/15 py-1.5 before:content-['✓_']">Deals overview</li>
          <li className="border-b border-white/15 py-1.5 before:content-['✓_']">amoCRM integration</li>
          <li className="py-1.5 before:content-['✓_']">Background sync</li>
        </ul>
      </div>

      <div className="flex flex-1 flex-col justify-center px-10 py-12 md:px-14">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-6 flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold">{t('auth.login')}</h1>
            <AuthLocaleSwitch value={locale} />
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                className="mt-1.5"
                {...register('email', { required: true })}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-[var(--danger)]">{t('auth.email')}</p>
              )}
            </div>
            <div>
              <Label htmlFor="password">{t('auth.password')}</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                className="mt-1.5"
                {...register('password', { required: true })}
              />
            </div>
            <Button type="submit" variant="primary" className="w-full" disabled={login.isPending}>
              {t('auth.login')}
            </Button>
          </form>

          <div className="my-4 flex items-center gap-3 text-xs lowercase text-[var(--text-muted)]">
            <span className="h-px flex-1 bg-[var(--border)]" />
            <span>{t('auth.or')}</span>
            <span className="h-px flex-1 bg-[var(--border)]" />
          </div>

          <GoogleButton label={t('auth.google')} />

          <p className="mt-4 text-xs text-[var(--text-muted)]">
            {t('auth.noAccount')}{' '}
            <Link to="/register" className="font-medium text-[var(--primary)] hover:underline">
              {t('auth.register')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
