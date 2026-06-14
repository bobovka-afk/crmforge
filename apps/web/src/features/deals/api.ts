import { api } from '@/lib/api-client'
import type { DataResponse, Deal, PaginatedResponse } from '@/types/api'

export interface DealsQuery {
  page?: number
  limit?: number
  status?: string
  search?: string
  sort?: 'createdAt' | 'amount' | 'syncedAt'
  order?: 'asc' | 'desc'
}

export async function fetchDeals(params: DealsQuery) {
  const { data } = await api.get<PaginatedResponse<Deal>>('/deals', { params })
  return data
}

export async function fetchDeal(id: string) {
  const { data } = await api.get<DataResponse<Deal>>(`/deals/${id}`)
  return data.data
}

export async function fetchDealStats() {
  const [all, won, open] = await Promise.all([
    fetchDeals({ page: 1, limit: 1 }),
    fetchDeals({ page: 1, limit: 1, status: 'won' }),
    fetchDeals({ page: 1, limit: 1, status: 'open' }),
  ])
  return {
    total: all.meta.total,
    won: won.meta.total,
    open: open.meta.total,
  }
}
