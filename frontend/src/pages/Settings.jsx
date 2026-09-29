import { useEffect, useState } from 'react'
import { Moon, Sun, Bell, Globe, Cpu, Info, Leaf } from 'lucide-react'
import Header from '../components/Header'
import { modelInfo } from '../data/mockData'
import { formatDate } from '../utils/validators'
import { useTheme } from '../contexts/ThemeContext'
import { useToast } from '../contexts/ToastContext'
import { cn } from '../utils/classNames'
import { auth } from '../firebase'
import { getUserProfile, saveUserProfile } from '../services/firestone'

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
          checked ? 'translate-x-5.5' : 'translate-x-0.5'
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
  const [name, setName] = useState('')
  const [email, setEmail] = useState(auth.currentUser?.email || '')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [farmName, setFarmName] = useState('')
  const [farmLocation, setFarmLocation] = useState('')
  const [farmSize, setFarmSize] = useState('')
  const [crops, setCrops] = useState('')
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let active = true
    const loadProfile = async () => {
      try {
        const user = auth.currentUser
        if (!user) return
        const profile = await getUserProfile(user.uid)
        if (!active || !profile) return
        setName(profile.personal?.name || '')
        setEmail(user.email || profile.personal?.email || '')
        setPhone(profile.personal?.phone || '')
        setAddress(profile.personal?.address || '')
        setFarmName(profile.farm?.farmName || '')
        setFarmLocation(profile.farm?.location || '')
        setFarmSize(profile.farm?.size || '')
        setCrops((profile.farm?.crops || []).join(', '))
      } catch (error) {
        console.error('Could not load farmer profile:', error)
        if (active) showToast('Could not load your saved profile.', 'error')
      } finally {
        if (active) setLoadingProfile(false)
      }
    }
    loadProfile()
    return () => { active = false }
  }, [])

  const handleSave = async () => {
    const user = auth.currentUser
    if (!user) {
      showToast('Please log in again to save your profile.', 'error')
      return
    }
    setSaving(true)
    try {
      await saveUserProfile(user.uid, {
        personal: { name: name.trim(), phone: phone.trim(), address: address.trim(), email: user.email || email },
        farm: {
          farmName: farmName.trim(),
          location: farmLocation.trim(),
          size: farmSize.trim(),
          crops: crops.split(',').map((crop) => crop.trim()).filter(Boolean),
        },
        updatedAt: new Date().toISOString(),
      })
      showToast('Profile and farm details updated.', 'success')
    } catch (error) {
      console.error('Could not save farmer profile:', error)
      showToast('Could not save changes. Check your connection and Firestore rules.', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <Header eyebrow="Settings" title="Settings" subtitle="Manage your profile, preferences, and model behavior." />
      <div className="lg:hidden">
        <h1 className="text-2xl font-semibold tracking-tight text-ink dark:text-ink-dark">Settings</h1>
      </div>

      <SectionCard title="Profile">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-forest-500 to-teal-500 text-lg font-semibold text-white">
            {(name || email || 'F').split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}
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
              readOnly
              title="Email address is managed by Firebase Authentication"
              className="mt-1.5 w-full rounded-xl border border-black/10 dark:border-white/10 bg-surface dark:bg-surface-dark px-3.5 py-2.5 text-sm text-ink dark:text-ink-dark focus:border-forest-400"
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-muted dark:text-muted-dark">Phone</span>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1.5 w-full rounded-xl border border-black/10 dark:border-white/10 bg-surface dark:bg-surface-dark px-3.5 py-2.5 text-sm text-ink dark:text-ink-dark" />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-xs font-medium text-muted dark:text-muted-dark">Address / village</span>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1.5 w-full rounded-xl border border-black/10 dark:border-white/10 bg-surface dark:bg-surface-dark px-3.5 py-2.5 text-sm text-ink dark:text-ink-dark" />
          </label>
        </div>
      </SectionCard>

      <SectionCard title="Farm Details">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-medium text-muted dark:text-muted-dark">Farm name</span>
            <input type="text" value={farmName} onChange={(e) => setFarmName(e.target.value)} className="mt-1.5 w-full rounded-xl border border-black/10 dark:border-white/10 bg-surface dark:bg-surface-dark px-3.5 py-2.5 text-sm text-ink dark:text-ink-dark" />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-muted dark:text-muted-dark">Farm location</span>
            <input type="text" value={farmLocation} onChange={(e) => setFarmLocation(e.target.value)} className="mt-1.5 w-full rounded-xl border border-black/10 dark:border-white/10 bg-surface dark:bg-surface-dark px-3.5 py-2.5 text-sm text-ink dark:text-ink-dark" />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-muted dark:text-muted-dark">Farm size</span>
            <input type="text" placeholder="e.g. 2 acres" value={farmSize} onChange={(e) => setFarmSize(e.target.value)} className="mt-1.5 w-full rounded-xl border border-black/10 dark:border-white/10 bg-surface dark:bg-surface-dark px-3.5 py-2.5 text-sm text-ink dark:text-ink-dark" />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-muted dark:text-muted-dark">Crops (comma separated)</span>
            <input type="text" placeholder="Wheat, rice, tomato" value={crops} onChange={(e) => setCrops(e.target.value)} className="mt-1.5 w-full rounded-xl border border-black/10 dark:border-white/10 bg-surface dark:bg-surface-dark px-3.5 py-2.5 text-sm text-ink dark:text-ink-dark" />
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
            <p className="text-sm font-semibold text-ink dark:text-ink-dark">Photonyx AI</p>
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
          disabled={saving || loadingProfile}
          className="rounded-full bg-forest-600 px-6 py-2.5 text-sm font-medium text-white shadow-softer hover:bg-forest-700"
        >
          {loadingProfile ? 'Loading profile…' : saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
