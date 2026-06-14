export interface User {
  id: string
  email: string
  name: string | null
  locale: string
  authProvider: string
  emailVerified: boolean
  createdAt: string
}

export interface AuthResponse {
  user: User
  accessToken: string
}

export interface PaginatedMeta {
  page: number
  limit: number
  total: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginatedMeta
}

export interface DataResponse<T> {
  data: T
}

export interface Deal {
  id: string
  userId: string
  externalId: string | null
  title: string
  amount: string | null
  currency: string | null
  status: string
  stage: string | null
  contactName: string | null
  syncedAt: string | null
  rawPayload: unknown
  createdAt: string
  updatedAt: string
}

export interface AmoCrmStatus {
  connected: boolean
  provider: 'amocrm'
  subdomain?: string
  status: string
  expiresAt?: string
}

export interface Integration {
  id: string
  provider: string
  status: string
  metadata: unknown
  createdAt: string
  updatedAt: string
}

export interface SyncJob {
  id: string
  userId: string
  provider: string
  type: string
  status: string
  progress: number
  total: number | null
  error: string | null
  startedAt: string | null
  completedAt: string | null
  createdAt: string
}

export type DealStatus = 'won' | 'open' | 'lost' | string
