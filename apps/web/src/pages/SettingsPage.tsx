import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input, Label, Select } from '@/components/ui/input'
import {
  useChangePassword,
  useMe,
  useResendVerification,
  useUpdateProfile,
} from '@/features/auth/hooks'
import { useDisconnectAmoCrm } from '@/features/integrations/hooks'
import { getApiErrorMessage } from '@/lib/api-client'
import { SETTINGS_SECTIONS, type SettingsSection } from '@/lib/constants'
import { cn } from '@/lib/utils'

function SettingsNav({ section }: { section: SettingsSection }) {
  const { t } = useTranslation()

  return (
    <nav className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-card)] p-2">
      {SETTINGS_SECTIONS.map((item) => (
        <Link
          key={item.id}
          to={`/settings/${item.id}`}
          className={cn(
            'mb-0.5 block rounded-[var(--radius)] px-3 py-2.5 text-sm text-[var(--text-muted)] hover:bg-[var(--bg-hover)]',
            section === item.id && 'bg-[var(--accent-bg)] font-semibold text-[var(--primary)]',
          )}
        >
          {t(item.labelKey)}
        </Link>
      ))}
    </nav>
  )
}

function ProfileSection() {
  const { t } = useTranslation()
  const { data: user } = useMe()
  const updateProfile = useUpdateProfile()
  const resend = useResendVerification()
  const { register, handleSubmit, reset } = useForm<{ name: string; email: string }>()

  useEffect(() => {
    if (user) reset({ name: user.name ?? '', email: user.email })
  }, [user, reset])

  const onSubmit = handleSubmit((values) => {
    updateProfile.mutate(
      { name: values.name },
      {
        onSuccess: () => toast.success(t('settings.save')),
        onError: (err) => toast.error(getApiErrorMessage(err)),
      },
    )
  })

  const handleResend = () => {
    if (!user?.email) return
    resend.mutate(user.email, {
      onSuccess: () => toast.success(t('auth.resendSuccess')),
      onError: (err) => toast.error(getApiErrorMessage(err)),
    })
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h2 className="text-base font-semibold">{t('settings.profile')}</h2>
      <div>
        <Label htmlFor="profile-name" className="normal-case">
          {t('auth.name')}
        </Label>
        <Input id="profile-name" className="mt-1.5" {...register('name')} />
      </div>
      <div>
        <Label htmlFor="profile-email" className="normal-case">
          {t('auth.email')}
        </Label>
        <Input id="profile-email" type="email" disabled className="mt-1.5 opacity-70" {...register('email')} />
      </div>
      {user && user.authProvider === 'local' && (
        <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-hover)] px-4 py-3">
          <p className="text-sm font-medium">{t('settings.emailVerification')}</p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            {user.emailVerified ? t('settings.emailVerified') : t('settings.emailNotVerified')}
          </p>
          {!user.emailVerified && (
            <Button
              type="button"
              variant="default"
              className="mt-3"
              disabled={resend.isPending}
              onClick={handleResend}
            >
              {t('auth.resend')}
            </Button>
          )}
        </div>
      )}
      <Button type="submit" variant="primary" disabled={updateProfile.isPending}>
        {t('settings.save')}
      </Button>
    </form>
  )
}

function SecuritySection() {
  const { t } = useTranslation()
  const changePassword = useChangePassword()
  const { register, handleSubmit, reset, watch } = useForm<{
    currentPassword: string
    newPassword: string
    confirmPassword: string
  }>()

  const newPassword = watch('newPassword')

  const onSubmit = handleSubmit((values) => {
    if (values.newPassword !== values.confirmPassword) {
      toast.error(t('settings.confirmPassword'))
      return
    }
    changePassword.mutate(
      { currentPassword: values.currentPassword, newPassword: values.newPassword },
      {
        onSuccess: () => {
          toast.success(t('settings.updatePassword'))
          reset()
        },
        onError: (err) => toast.error(getApiErrorMessage(err)),
      },
    )
  })

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h2 className="text-base font-semibold">{t('settings.security')}</h2>
      <div>
        <Label htmlFor="current-password" className="normal-case">
          {t('settings.currentPassword')}
        </Label>
        <Input id="current-password" type="password" className="mt-1.5" {...register('currentPassword', { required: true })} />
      </div>
      <div>
        <Label htmlFor="new-password" className="normal-case">
          {t('settings.newPassword')}
        </Label>
        <Input id="new-password" type="password" className="mt-1.5" {...register('newPassword', { required: true, minLength: 8 })} />
      </div>
      <div>
        <Label htmlFor="confirm-password" className="normal-case">
          {t('settings.confirmPassword')}
        </Label>
        <Input
          id="confirm-password"
          type="password"
          className="mt-1.5"
          {...register('confirmPassword', {
            required: true,
            validate: (v) => v === newPassword || 'mismatch',
          })}
        />
      </div>
      <Button type="submit" variant="primary" disabled={changePassword.isPending}>
        {t('settings.updatePassword')}
      </Button>
    </form>
  )
}

function LanguageSection() {
  const { t, i18n } = useTranslation()
  const { data: user } = useMe()
  const updateProfile = useUpdateProfile()
  const { register, handleSubmit, reset } = useForm<{ locale: string }>()

  useEffect(() => {
    reset({ locale: user?.locale ?? (i18n.language?.startsWith('ru') ? 'ru' : 'en') })
  }, [user, i18n.language, reset])

  const onSubmit = handleSubmit((values) => {
    updateProfile.mutate(
      { locale: values.locale },
      {
        onSuccess: () => {
          void i18n.changeLanguage(values.locale)
          toast.success(t('settings.save'))
        },
        onError: (err) => toast.error(getApiErrorMessage(err)),
      },
    )
  })

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h2 className="text-base font-semibold">{t('settings.language')}</h2>
      <div>
        <Label htmlFor="locale-select" className="normal-case">
          {t('settings.language')}
        </Label>
        <Select id="locale-select" className="mt-1.5" {...register('locale')}>
          <option value="en">English</option>
          <option value="ru">Русский</option>
        </Select>
      </div>
      <Button type="submit" variant="primary" disabled={updateProfile.isPending}>
        {t('settings.save')}
      </Button>
    </form>
  )
}

function DangerSection() {
  const { t } = useTranslation()
  const disconnect = useDisconnectAmoCrm()

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold text-[var(--danger)]">{t('settings.danger')}</h2>
      <p className="text-xs leading-relaxed text-[var(--text-muted)]">{t('settings.dangerDesc')}</p>
      <Button
        type="button"
        variant="danger"
        disabled={disconnect.isPending}
        onClick={() =>
          disconnect.mutate(undefined, {
            onSuccess: () => toast.success(t('settings.disconnectAmo')),
            onError: (err) => toast.error(getApiErrorMessage(err)),
          })
        }
      >
        {t('settings.disconnectAmo')}
      </Button>
    </div>
  )
}

const sectionContent: Record<SettingsSection, () => ReactNode> = {
  profile: ProfileSection,
  security: SecuritySection,
  language: LanguageSection,
  danger: DangerSection,
}

export default function SettingsPage() {
  const { t } = useTranslation()
  const { section: sectionParam } = useParams<{ section?: string }>()
  const navigate = useNavigate()

  const section = (sectionParam ?? 'profile') as SettingsSection
  const validSection = SETTINGS_SECTIONS.some((s) => s.id === section)

  useEffect(() => {
    if (sectionParam && !validSection) {
      navigate('/settings/profile', { replace: true })
    }
  }, [sectionParam, validSection, navigate])

  if (!sectionParam) {
    return <Navigate to="/settings/profile" replace />
  }

  if (!validSection) {
    return null
  }

  const Content = sectionContent[section]

  return (
    <div>
      <header className="mb-5">
        <h1 className="text-[22px] font-bold tracking-tight">{t('settings.title')}</h1>
        <p className="text-sm text-[var(--text-muted)]">{t('settings.subtitle')}</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[200px_1fr]">
        <SettingsNav section={section} />
        <Card className={cn(section === 'danger' && 'border-[color-mix(in_srgb,var(--danger)_35%,transparent)] bg-[color-mix(in_srgb,var(--danger)_4%,transparent)]')}>
          <CardContent className="px-6 py-6">
            <Content />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
