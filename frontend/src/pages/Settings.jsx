import { useState } from 'react'
import { Moon, Sun, Bell, Globe, Cpu, Info, Leaf } from 'lucide-react'
import Header from '../components/Header'
import { currentUser, modelInfo } from '../data/mockData'
import { formatDate } from '../utils/validators'
import { useTheme } from '../contexts/ThemeContext'
import { useToast } from '../contexts/ToastContext'
import { cn } from '../utils/classNames'

function ToggleSwitch({ checked, onChange, label }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={cn(
        'relative h-6 w-11 shrink-0 rounded-full transition-colors',
        checked ? 'bg-forest-600' : 'bg-black/10 dark:bg-white/15'
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-softer transition-transform',
          checked ? 'translate-x-[22px]' : 'translate-x-0.5'
        )}
      />
    </button>
  )
}

function SectionCard({ title, children }) {
  return (
    <div className="card p-6">
      <h2 className="text-base font-semibold text-ink dark:text-ink-dark">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  )
}

function Row({ label, description, children }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-ink dark:text-ink-dark">{label}</p>
        {description && <p className="text-xs text-muted dark:text-muted-dark">{description}</p>}
      </div>
      {children}
    </div>
  )
}

export default function Settings() {
  const { theme, toggleTheme } = useTheme()
  const { showToast } = useToast()
  const [notifications, setNotifications] = useState(true)
  const [language, setLanguage] = useState('English')
  const [threshold, setThreshold] = useState(modelInfo.defaultConfidenceThreshold)
  const [name, setName] = useState(currentUser.name)
  const [email, setEmail] = useState(currentUser.email)

  const handleSave = () => {
    showToast('Settings saved', 'success')
  }

  return (
    <div className="space-y-8">
      <Header eyebrow="Settings" title="Settings" subtitle="Manage your profile, preferences, and model behavior." />
      <div className="lg:hidden">
        <h1 className="text-2xl font-semibold tracking-tight text-ink dark:text-ink-dark">Settings</h1>
      </div>

      <SectionCard title="Profile">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-forest-500 to-teal-500 text-lg font-semibold text-white">
            {currentUser.avatarInitials}
          </div>
          <button className="rounded-full border border-black/10 dark:border-white/10 px-4 py-2 text-sm font-medium text-ink dark:text-ink-dark hover:border-forest-300">
            Change photo
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-medium text-muted dark:text-muted-dark">Name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-black/10 dark:border-white/10 bg-surface dark:bg-surface-dark px-3.5 py-2.5 text-sm text-ink dark:text-ink-dark focus:border-forest-400"
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-muted dark:text-muted-dark">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-black/10 dark:border-white/10 bg-surface dark:bg-surface-dark px-3.5 py-2.5 text-sm text-ink dark:text-ink-dark focus:border-forest-400"
            />
          </label>
        </div>
      </SectionCard>

      <SectionCard title="Preferences">
        <Row label="Dark mode" description="Switch between light and dark appearance.">
          <div className="flex items-center gap-2">
            {theme === 'dark' ? (
              <Moon size={16} className="text-muted dark:text-muted-dark" />
            ) : (
              <Sun size={16} className="text-muted dark:text-muted-dark" />
            )}
            <ToggleSwitch checked={theme === 'dark'} onChange={toggleTheme} label="Toggle dark mode" />
          </div>
        </Row>
        <Row label="Notifications" description="Get notified when a scan finishes processing.">
          <div className="flex items-center gap-2">
            <Bell size={16} className="text-muted dark:text-muted-dark" />
            <ToggleSwitch
              checked={notifications}
              onChange={() => setNotifications((v) => !v)}
              label="Toggle notifications"
            />
          </div>
        </Row>
        <Row label="Language" description="Choose your preferred interface language.">
          <div className="flex items-center gap-2">
            <Globe size={16} className="text-muted dark:text-muted-dark" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="rounded-xl border border-black/10 dark:border-white/10 bg-surface dark:bg-surface-dark px-3 py-2 text-sm text-ink dark:text-ink-dark focus:border-forest-400"
            >
              <option>English</option>
              <option>Hindi</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
        </Row>
      </SectionCard>

      <SectionCard title="Model Settings">
        <Row label="Model version" description="Currently deployed detection model.">
          <span className="flex items-center gap-1.5 rounded-full bg-forest-50 dark:bg-forest-900/30 px-3 py-1 text-xs font-medium text-forest-700 dark:text-forest-300">
            <Cpu size={13} />
            {modelInfo.version}
          </span>
        </Row>
        <Row
          label="Confidence threshold"
          description="Predictions below this score are flagged as low confidence."
        >
          <div className="flex w-40 items-center gap-3">
            <input
              type="range"
              min={30}
              max={90}
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-full accent-forest-600"
            />
            <span className="w-10 text-right text-sm font-medium text-ink dark:text-ink-dark">
              {threshold}%
            </span>
          </div>
        </Row>
        <Row label="Last updated" description="When the model was last retrained.">
          <span className="text-sm text-muted dark:text-muted-dark">
            {formatDate(modelInfo.lastUpdated)}
          </span>
        </Row>
      </SectionCard>

      <SectionCard title="About">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest-50 dark:bg-white/5 text-forest-600 dark:text-forest-300">
            <Info size={16} />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink dark:text-ink-dark">PlantDx AI</p>
            <p className="mt-0.5 text-sm text-muted dark:text-muted-dark">
              AI-powered plant disease detection system.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted dark:text-muted-dark">
          <Leaf size={13} />
          Built for demonstration purposes with mock prediction data.
        </div>
      </SectionCard>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="rounded-full bg-forest-600 px-6 py-2.5 text-sm font-medium text-white shadow-softer hover:bg-forest-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  )
}
