import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import AmoCrmSetupPage from '@/pages/AmoCrmSetupPage'
import AuthCallbackPage from '@/pages/AuthCallbackPage'
import CheckEmailPage from '@/pages/CheckEmailPage'
import DashboardPage from '@/pages/DashboardPage'
import DealDetailPage from '@/pages/DealDetailPage'
import DealsPage from '@/pages/DealsPage'
import IntegrationsPage from '@/pages/IntegrationsPage'
import LoginPage from '@/pages/LoginPage'
import NotFoundPage from '@/pages/NotFoundPage'
import RegisterPage from '@/pages/RegisterPage'
import SettingsPage from '@/pages/SettingsPage'
import VerifyEmailPage from '@/pages/VerifyEmailPage'
import { ProtectedRoute, PublicRoute } from '@/routes/guards'

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/check-email', element: <CheckEmailPage /> },
      { path: '/verify-email', element: <VerifyEmailPage /> },
      { path: '/auth/callback', element: <AuthCallbackPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'deals', element: <DealsPage /> },
          { path: 'deals/:id', element: <DealDetailPage /> },
          { path: 'integrations', element: <IntegrationsPage /> },
          { path: 'integrations/amocrm', element: <AmoCrmSetupPage /> },
          { path: 'settings', element: <SettingsPage /> },
          { path: 'settings/:section', element: <SettingsPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
