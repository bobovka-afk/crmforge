import { api } from '@/lib/api-client'
import type { DataResponse, SyncJob } from '@/types/api'

export async function triggerSync(full = false) {
  const { data } = await api.post<DataResponse<SyncJob>>('/sync/amocrm/leads', { full })
  return data.data
}

export async function fetchSyncJob(id: string) {
  const { data } = await api.get<DataResponse<SyncJob>>(`/sync/jobs/${id}`)
  return data.data
}

export async function fetchSyncJobs() {
  const { data } = await api.get<DataResponse<SyncJob[]>>('/sync/jobs')
  return data.data
}
