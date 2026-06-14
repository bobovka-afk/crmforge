import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  connectAmoDemo,
  disconnectAmoCrm,
  fetchAmoCrmStatus,
  fetchIntegrations,
  getOAuthUrl,
  testAmoCrm,
} from './api'

export function useIntegrations() {
  return useQuery({ queryKey: ['integrations'], queryFn: fetchIntegrations })
}

export function useAmoCrmStatus() {
  return useQuery({ queryKey: ['amocrm-status'], queryFn: fetchAmoCrmStatus })
}

export function useConnectAmoDemo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (subdomain?: string) => connectAmoDemo(subdomain),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['amocrm-status'] })
      void qc.invalidateQueries({ queryKey: ['integrations'] })
    },
  })
}

export function useTestAmoCrm() {
  return useMutation({ mutationFn: testAmoCrm })
}

export function useDisconnectAmoCrm() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: disconnectAmoCrm,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['amocrm-status'] })
      void qc.invalidateQueries({ queryKey: ['integrations'] })
    },
  })
}

export function useOAuthUrl() {
  return useMutation({ mutationFn: getOAuthUrl })
}
