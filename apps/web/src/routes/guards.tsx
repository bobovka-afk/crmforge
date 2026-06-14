import { Link, Navigate, Outlet, useLocation } from 'react-router-dom'
import { useMe } from '@/features/auth/hooks'
import { ACCESS_TOKEN_KEY } from '@/lib/constants'
import { Skeleton } from '@/components/ui/skeleton'

export function ProtectedRoute() {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY)
  const { isLoading, isError } = useMe(Boolean(token))
  const location = useLocation()

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] p-8">
        <Skeleton className="h-10 w-64" />
      </div>
    )
  }

  if (isError) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export function PublicRoute() {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY)
  const { data: user, isLoading } = useMe(Boolean(token))

  if (token && isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg)]">
        <Skeleton className="h-10 w-48" />
      </div>
    )
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[var(--bg)]">{children}</div>
}

export function AuthLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="text-[var(--primary)] hover:underline">
      {children}
    </Link>
  )
}
