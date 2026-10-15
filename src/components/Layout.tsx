import { useState } from 'react'
import { NavLink, Outlet } from 'react-router'
import { useTranslation } from 'react-i18next'
import {
  Bookmark,
  Briefcase,
  CalendarDays,
  LayoutDashboard,
  Menu,
  Settings,
  UserRound,
  X,
  BriefcaseBusiness,
} from 'lucide-react'

interface NavItem {
  to: string
  key: string
  icon: typeof LayoutDashboard
  end?: boolean
}

const navItems: NavItem[] = [
  { to: '/', key: 'nav.dashboard', icon: LayoutDashboard, end: true },
  { to: '/procesos', key: 'nav.procesos', icon: Briefcase },
  { to: '/calendario', key: 'nav.calendario', icon: CalendarDays },
  { to: '/perfil', key: 'nav.perfil', icon: UserRound },
  { to: '/enlaces', key: 'nav.enlaces', icon: Bookmark },
  { to: '/preferencias', key: 'nav.preferencias', icon: Settings },
]

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useTranslation()
  return (
    <nav className="flex flex-col gap-1 px-3">
      {navItems.map(({ to, key, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-slate-800 text-white'
                : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
            }`
          }
        >
          <Icon className="h-4 w-4 shrink-0" />
          {t(key)}
        </NavLink>
      ))}
    </nav>
  )
}

function Brand() {
  const { t } = useTranslation()
  return (
    <div className="flex items-center gap-2 px-6 py-5">
      <BriefcaseBusiness className="h-6 w-6 text-sky-400" />
      <span className="text-lg font-bold tracking-tight text-white">
        {t('app.title')}
      </span>
    </div>
  )
}

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen md:flex">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-slate-900 md:flex">
        <Brand />
        <NavLinks />
      </aside>

      {/* Sidebar móvil */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-slate-900/50"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-slate-900">
            <div className="flex items-center justify-between pr-3">
              <Brand />
              <button
                type="button"
                className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 hover:text-white"
                onClick={() => setMobileOpen(false)}
                aria-label="Cerrar menú"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <NavLinks onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Contenido */}
      <div className="flex min-h-screen flex-1 flex-col md:ml-64">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur md:hidden">
          <button
            type="button"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-semibold">Job Tracker</span>
        </header>
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
