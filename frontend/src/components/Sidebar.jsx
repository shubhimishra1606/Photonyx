import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  ScanLine,
  History,
  Sprout,
  Settings,
  Cpu,
} from 'lucide-react'
import Logo from './Logo'
import { currentUser, modelInfo } from '../data/mockData'
import { cn } from '../utils/classNames'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/detect', label: 'Disease Detection', icon: ScanLine },
  { to: '/history', label: 'Scan History', icon: History },
  { to: '/plants', label: 'Plant Library', icon: Sprout },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:border-r lg:border-black/5 dark:border-white/5 bg-surface dark:bg-surface-dark">
      <div className="px-6 py-6">
        <Logo />
      </div>

      <nav className="flex-1 px-3 space-y-1" aria-label="Primary">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-forest-600 text-white shadow-softer'
                  : 'text-muted dark:text-muted-dark hover:bg-forest-50 dark:hover:bg-white/5 hover:text-forest-700 dark:hover:text-forest-300'
              )
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-5 pt-3 border-t border-black/5 dark:border-white/5 mx-3 space-y-3">
        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-forest-500 to-teal-500 text-xs font-semibold text-white">
            {currentUser.avatarInitials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink dark:text-ink-dark">
              {currentUser.name}
            </p>
            <p className="truncate text-xs text-muted dark:text-muted-dark">
              {currentUser.role}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-forest-50 dark:bg-white/5 px-3 py-2 text-xs font-medium text-forest-700 dark:text-forest-300">
          <Cpu size={14} />
          AI Model: {modelInfo.version}
        </div>
      </div>
    </aside>
  )
}
