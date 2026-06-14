import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSyncStore } from '@/stores/sync-store'
import { fetchSyncJob, triggerSync } from './api'

export function useTriggerSync() {
  const qc = useQueryClient()
  const setActiveJobId = useSyncStore((s) => s.setActiveJobId)
  return useMutation({
    mutationFn: () => triggerSync(false),
    onSuccess: (job) => {
      setActiveJobId(job.id)
      void qc.invalidateQueries({ queryKey: ['sync-job', job.id] })
    },
  })
}

export function useSyncJob(id: string | null) {
  const isRunning = Boolean(id)
  return useQuery({
    queryKey: ['sync-job', id],
    queryFn: () => fetchSyncJob(id!),
    enabled: isRunning,
    refetchInterval: (query) => {
      const status = query.state.data?.status
      if (status === 'completed' || status === 'failed') return false
      return 2000
    },
  })
}
