import { api, saveAccessToken } from '@/lib/api-client'
import type { AuthResponse, DataResponse, User } from '@/types/api'

export async function login(email: string, password: string) {
  const { data } = await api.post<AuthResponse>('/auth/login', { email, password })
  saveAccessToken(data.accessToken)
  return data
}

export async function register(input: {
  email: string
  password: string
  name?: string
  locale?: string
}) {
  const { data } = await api.post<{ message: string }>('/auth/register', input)
  return data
}

export async function fetchMe() {
  const { data } = await api.get<User>('/auth/me')
  return data
}

export async function logout() {
  await api.post('/auth/logout')
}

export async function verifyEmail(token: string) {
  const { data } = await api.get<{ message: string }>('/auth/verify-email', { params: { token } })
  return data
}

export async function resendVerification(email: string) {
  const { data } = await api.post<{ message: string }>('/auth/resend-verification', { email })
  return data
}

export function googleAuthUrl() {
  return `${api.defaults.baseURL}/auth/google`
}

export async function updateProfile(body: { name?: string; locale?: string }) {
  const { data } = await api.patch<User>('/users/me', body)
  return data
}

export async function changePassword(body: { currentPassword: string; newPassword: string }) {
  const { data } = await api.patch<{ message: string }>('/users/me/password', body)
  return data
}

export type { User, AuthResponse, DataResponse }
