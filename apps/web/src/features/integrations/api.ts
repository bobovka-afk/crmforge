import { api } from '@/lib/api-client'
import type { AmoCrmStatus, DataResponse, Integration } from '@/types/api'

export async function fetchIntegrations() {
  const { data } = await api.get<DataResponse<Integration[]>>('/integrations')
  return data.data
}

export async function fetchAmoCrmStatus() {
  const { data } = await api.get<AmoCrmStatus>('/integrations/amocrm')
  return data
}

export async function connectAmoDemo(subdomain = 'demo') {
  const { data } = await api.post('/integrations/amocrm/connect', { subdomain })
  return data
}

export async function testAmoCrm() {
  const { data } = await api.post<{ ok: boolean; message?: string }>('/integrations/amocrm/test')
  return data
}

export async function disconnectAmoCrm() {
  const { data } = await api.delete('/integrations/amocrm')
  return data
}

export async function getOAuthUrl() {
  const { data } = await api.get<{ url: string }>('/integrations/amocrm/oauth/url')
  return data.url
}
