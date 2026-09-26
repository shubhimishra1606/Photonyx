import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ScanLine, History, Sprout, Settings } from 'lucide-react'
import { cn } from '../utils/classNames'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { to: '/detect', label: 'Detect', icon: ScanLine },
  { to: '/history', label: 'History', icon: History },
  { to: '/plants', label: 'Plants', icon: Sprout },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function MobileNavbar() {
  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-black/5 dark:border-white/5 bg-surface/95 dark:bg-surface-dark/95 backdrop-blur px-2 pb-[env(safe-area-inset-bottom,0px)]"
      aria-label="Primary"
    >
      <div className="flex items-stretch justify-between">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors',
                isActive ? 'text-forest-600 dark:text-forest-300' : 'text-muted dark:text-muted-dark'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={19} strokeWidth={isActive ? 2.3 : 2} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
