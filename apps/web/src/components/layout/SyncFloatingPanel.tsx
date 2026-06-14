import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useSyncJob, useTriggerSync } from '@/features/sync/hooks'
import { useSyncStore } from '@/stores/sync-store'
import { useQueryClient } from '@tanstack/react-query'

export function SyncFloatingPanel() {
  const { t } = useTranslation()
  const qc = useQueryClient()
  const activeJobId = useSyncStore((s) => s.activeJobId)
  const setActiveJobId = useSyncStore((s) => s.setActiveJobId)
  const { data: job } = useSyncJob(activeJobId)

  useEffect(() => {
    if (job?.status === 'completed') {
      toast.success(t('sync.done'), { description: t('sync.doneDesc') })
      void qc.invalidateQueries({ queryKey: ['deals'] })
      void qc.invalidateQueries({ queryKey: ['deal-stats'] })
      setActiveJobId(null)
    }
    if (job?.status === 'failed') {
      toast.error(job.error ?? 'Sync failed')
      setActiveJobId(null)
    }
  }, [job?.status, job?.error, qc, setActiveJobId, t])

  if (!activeJobId || !job || job.status === 'completed' || job.status === 'failed') {
    return null
  }

  const pct = job.total ? Math.round((job.progress / job.total) * 100) : job.progress

  return (
    <div
      role="status"
      className="fixed bottom-6 right-6 z-50 w-[min(360px,calc(100vw-3rem))] rounded-xl border border-[var(--primary)] bg-[var(--bg-card)] p-4 shadow-xl"
    >
      <div className="mb-3 flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 animate-spin items-center justify-center rounded-full border border-[var(--primary)] bg-[var(--accent-bg)] text-lg text-[var(--primary)]">
          ↻
        </span>
        <div className="flex-1">
          <div className="text-sm font-semibold">{t('sync.title')}</div>
          <div className="text-xs text-[var(--text-muted)]">
            {job.progress}
            {job.total ? ` / ${job.total}` : ''} · {pct}%
          </div>
        </div>
        <button type="button" aria-label="Dismiss" onClick={() => setActiveJobId(null)} className="text-[var(--text-muted)]">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-[var(--border)]">
        <div className="h-full rounded-full bg-[var(--primary)] transition-all" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-center text-[11px] text-[var(--text-muted)]">{t('sync.hint')}</p>
    </div>
  )
}

export function SyncButton({ className }: { className?: string }) {
  const trigger = useTriggerSync()
  const { t } = useTranslation()
  return (
    <Button variant="primary" size="sm" className={className} disabled={trigger.isPending} onClick={() => trigger.mutate()}>
      ↻ {t('dashboard.sync')}
    </Button>
  )
}
