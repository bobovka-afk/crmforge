import { Outlet } from 'react-router-dom'
import { EmailVerificationBanner } from './EmailVerificationBanner'
import { Sidebar } from './Sidebar'
import { SyncFloatingPanel } from './SyncFloatingPanel'

export function AppShell() {
  return (
    <div className="flex min-h-screen bg-[var(--bg)]">
      <Sidebar />
      <div className="relative flex min-w-0 flex-1 flex-col">
        <main className="flex-1 px-7 py-5 pt-4">
          <EmailVerificationBanner />
          <Outlet />
        </main>
        <SyncFloatingPanel />
      </div>
    </div>
  )
}
