import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { clearAuthTokens } from '@/lib/api-client'
import {
  changePassword,
  fetchMe,
  login,
  logout,
  register,
  resendVerification,
  updateProfile,
  verifyEmail,
} from './api'

export function useMe(enabled = true) {
  return useQuery({
    queryKey: ['me'],
    queryFn: fetchMe,
    enabled,
    retry: false,
  })
}

export function useLogin() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => login(email, password),
    onSuccess: (data) => {
      qc.setQueryData(['me'], data.user)
    },
  })
}

export function useRegister() {
  return useMutation({
    mutationFn: register,
  })
}

export function useLogout() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      clearAuthTokens()
      qc.clear()
    },
  })
}

export function useVerifyEmail() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: verifyEmail,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['me'] })
    },
  })
}

export function useResendVerification() {
  return useMutation({ mutationFn: resendVerification })
}

export function useUpdateProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (user) => qc.setQueryData(['me'], user),
  })
}

export function useChangePassword() {
  return useMutation({ mutationFn: changePassword })
}
