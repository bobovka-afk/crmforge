export const ACCESS_TOKEN_KEY = 'crmforge_access_token'

export const API_BASE = import.meta.env.VITE_API_URL ?? '/api'

export const NAV_ITEMS = [
  { labelKey: 'nav.dashboard', href: '/' },
  { labelKey: 'nav.deals', href: '/deals' },
  { labelKey: 'nav.integrations', href: '/integrations' },
  { labelKey: 'nav.settings', href: '/settings' },
] as const

export const SETTINGS_SECTIONS = [
  { id: 'profile', labelKey: 'settings.profile' },
  { id: 'security', labelKey: 'settings.security' },
  { id: 'language', labelKey: 'settings.language' },
  { id: 'danger', labelKey: 'settings.danger' },
] as const

export type SettingsSection = (typeof SETTINGS_SECTIONS)[number]['id']
