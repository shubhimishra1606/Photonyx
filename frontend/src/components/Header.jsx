import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import Logo from './Logo'

export default function Header({ eyebrow, title, subtitle, action }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="lg:hidden">
        <Logo size={30} />
      </div>
      <div className="hidden lg:block">
        {eyebrow && (
          <p className="text-sm font-medium text-teal-600 dark:text-teal-400">{eyebrow}</p>
        )}
        <h1 className="text-2xl font-semibold tracking-tight text-ink dark:text-ink-dark">
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-sm text-muted dark:text-muted-dark">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2">
        {action}
        <button
          onClick={toggleTheme}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-black/5 dark:border-white/10 bg-surface dark:bg-surface-dark text-muted dark:text-muted-dark hover:text-forest-600 dark:hover:text-forest-300 transition-colors"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>
      </div>
    </div>
  )
}
