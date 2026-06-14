import { useQuery } from '@tanstack/react-query'
import { fetchDeal, fetchDeals, fetchDealStats, type DealsQuery } from './api'

export function useDeals(params: DealsQuery) {
  return useQuery({
    queryKey: ['deals', params],
    queryFn: () => fetchDeals(params),
  })
}

export function useDeal(id: string | undefined) {
  return useQuery({
    queryKey: ['deal', id],
    queryFn: () => fetchDeal(id!),
    enabled: Boolean(id),
  })
}

export function useDealStats() {
  return useQuery({
    queryKey: ['deal-stats'],
    queryFn: fetchDealStats,
  })
}
