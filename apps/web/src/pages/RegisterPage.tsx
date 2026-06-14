import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/input'
import { AuthLocaleSwitch } from '@/components/layout/AuthLocaleSwitch'
import { GoogleButton } from '@/components/layout/GoogleButton'
import { useRegister, useLogin } from '@/features/auth/hooks'
import { getApiErrorMessage } from '@/lib/api-client'

type RegisterForm = {
  email: string
  name: string
  password: string
  locale: 'ru' | 'en'
}

export default function RegisterPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const registerMutation = useRegister()
  const loginMutation = useLogin()
  const locale = (i18n.language === 'en' ? 'en' : 'ru') as 'ru' | 'en'
  const { register, handleSubmit, setValue } = useForm<RegisterForm>({
    defaultValues: { locale },
  })

  const onSubmit = handleSubmit((values) => {
    registerMutation.mutate(values, {
      onSuccess: () => {
        loginMutation.mutate(
          { email: values.email, password: values.password },
          {
            onSuccess: () => {
              toast.success(t('auth.verificationEmailSent'))
              navigate('/')
            },
            onError: (err) => toast.error(getApiErrorMessage(err)),
          },
        )
      },
      onError: (err) => toast.error(getApiErrorMessage(err)),
    })
  })

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <div className="flex flex-1 flex-col justify-center bg-[var(--primary)] px-10 py-12 text-[var(--primary-text)] md:px-12">
        <h2 className="text-3xl font-bold tracking-tight">CRMForge</h2>
        <p className="mt-3 text-sm opacity-90">Start syncing deals from amoCRM</p>
        <p className="mt-1 text-sm opacity-75">Free to try · demo mode available</p>
      </div>

      <div className="flex flex-1 flex-col justify-center px-10 py-12 md:px-14">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-6 flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold">{t('auth.register')}</h1>
            <AuthLocaleSwitch
              value={locale}
              onChange={(next) => setValue('locale', next)}
            />
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <input type="hidden" {...register('locale')} />
            <div>
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input id="email" type="email" autoComplete="email" className="mt-1.5" {...register('email', { required: true })} />
            </div>
            <div>
              <Label htmlFor="name">{t('auth.name')}</Label>
              <Input id="name" type="text" autoComplete="name" className="mt-1.5" {...register('name')} />
            </div>
            <div>
              <Label htmlFor="password">{t('auth.password')}</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                className="mt-1.5"
                {...register('password', { required: true, minLength: 8 })}
              />
            </div>
            <Button type="submit" variant="primary" className="w-full" disabled={registerMutation.isPending || loginMutation.isPending}>
              {t('auth.register')}
            </Button>
          </form>

          <div className="my-4 flex items-center gap-3 text-xs lowercase text-[var(--text-muted)]">
            <span className="h-px flex-1 bg-[var(--border)]" />
            <span>{t('auth.or')}</span>
            <span className="h-px flex-1 bg-[var(--border)]" />
          </div>

          <GoogleButton label={t('auth.google')} />

          <p className="mt-4 text-xs text-[var(--text-muted)]">
            {t('auth.hasAccount')}{' '}
            <Link to="/login" className="font-medium text-[var(--primary)] hover:underline">
              {t('auth.login')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
