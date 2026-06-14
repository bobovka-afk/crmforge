import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

export default function NotFoundPage() {
  const { t } = useTranslation()

  return (
    <div className="relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden px-6 py-16 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex select-none items-center justify-center text-[min(28vw,200px)] font-black leading-none text-[var(--text)] opacity-[0.06]"
      >
        404
      </div>

      <p className="relative z-10 mb-2 text-5xl font-extrabold tracking-tight text-[var(--primary)]">404</p>
      <h1 className="relative z-10 mb-2 text-2xl font-bold">{t('notFound.title')}</h1>
      <p className="relative z-10 mb-6 max-w-md text-sm text-[var(--text-muted)]">{t('notFound.desc')}</p>

      <div className="relative z-10 flex flex-wrap justify-center gap-3">
        <Button asChild variant="primary">
          <Link to="/">{t('notFound.home')}</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link to="/deals">{t('nav.deals')}</Link>
        </Button>
      </div>
    </div>
  )
}
