import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ScanLine, Leaf, AlertTriangle, Gauge, CloudSun, MapPin, ArrowRight } from 'lucide-react'
import Header from '../components/Header'
import StatCard from '../components/StatCard'
import { auth } from '../firebase'
import { getUserProfile, getUserScans, saveUserProfile } from '../services/firestone'
import { describeWeatherCode, geocodeFarmLocation, getFarmWeather } from '../services/weather'

function WeatherChart({ hourly }) {
  const temps = hourly.temperature_2m || []
  const rain = hourly.precipitation_probability || []
  if (!temps.length) return null

  const minTemp = Math.floor(Math.min(...temps) - 2)
  const maxTemp = Math.ceil(Math.max(...temps) + 2)
  const range = Math.max(maxTemp - minTemp, 1)
  const x = (index) => 42 + index * (636 / Math.max(temps.length - 1, 1))
  const y = (temp) => 24 + ((maxTemp - temp) / range) * 132
  const points = temps.map((temp, index) => `${x(index)},${y(temp)}`).join(' ')
  const labels = hourly.time || []

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted dark:text-muted-dark">
        <span className="inline-flex items-center gap-2"><i className="h-0.5 w-4 rounded bg-forest-600" />Temperature (°C)</span>
        <span className="inline-flex items-center gap-2"><i className="h-3 w-3 rounded-sm bg-sky-400/60" />Rain chance (%)</span>
      </div>
      <div className="overflow-x-auto">
        <svg viewBox="0 0 720 220" role="img" aria-label="24 hour temperature and rain chance forecast" className="min-w-150 w-full">
          {[0, 1, 2, 3].map((step) => {
            const gridY = 24 + step * 44
            const value = Math.round(maxTemp - (step * range) / 3)
            return <g key={step}><line x1="40" y1={gridY} x2="682" y2={gridY} stroke="currentColor" className="text-black/10 dark:text-white/10" strokeDasharray="4 5" /><text x="4" y={gridY + 4} className="fill-current text-muted dark:text-muted-dark" fontSize="11">{value}°</text></g>
          })}
          {temps.map((_, index) => (
            index % 4 === 0 && <g key={`rain-${index}`}>
              <rect x={x(index) - 7} y={190 - (Math.max(0, Number(rain[index] || 0)) * 0.55)} width="14" height={Math.max(0, Number(rain[index] || 0)) * 0.55} rx="4" className="fill-sky-400/55" />
              <text x={x(index)} y="210" textAnchor="middle" className="fill-current text-muted dark:text-muted-dark" fontSize="10">{labels[index]?.slice(11, 16) || ''}</text>
            </g>
          ))}
          <polyline points={points} fill="none" className="stroke-forest-600 dark:stroke-forest-300" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          {temps.filter((_, index) => index % 4 === 0).map((temp, pointIndex) => {
            const index = pointIndex * 4
            return <g key={`temp-${index}`}><circle cx={x(index)} cy={y(temp)} r="4" className="fill-white stroke-forest-600 dark:fill-surface-dark dark:stroke-forest-300" strokeWidth="2" /><text x={x(index)} y={y(temp) - 10} textAnchor="middle" className="fill-current text-ink dark:text-ink-dark" fontSize="11">{Math.round(temp)}°</text></g>
          })}
        </svg>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [scans, setScans] = useState([])
  const [farmerName, setFarmerName] = useState('')
  const [location, setLocation] = useState('')
  const [locationDraft, setLocationDraft] = useState('')
  const [weather, setWeather] = useState(null)
  const [weatherLocation, setWeatherLocation] = useState('')
  const [loading, setLoading] = useState(true)
  const [savingLocation, setSavingLocation] = useState(false)
  const [weatherError, setWeatherError] = useState('')
  const [dashboardError, setDashboardError] = useState('')

  useEffect(() => {
    let active = true
    const loadDashboard = async () => {
      try {
        const user = auth.currentUser
        if (!user) throw new Error('Not signed in')
        const [userScans, profile] = await Promise.all([
          getUserScans(user.uid),
          getUserProfile(user.uid),
        ])
        if (!active) return
        setScans(userScans)
        setFarmerName(profile?.personal?.name || user.displayName || '')
        const farm = profile?.farm || {}
        const savedLocation = farm.location || ''
        setLocation(savedLocation)
        setLocationDraft(savedLocation)

        if (savedLocation.trim()) {
          try {
            if (Number.isFinite(Number(farm.latitude)) && Number.isFinite(Number(farm.longitude))) {
              setWeatherLocation(savedLocation)
              const forecast = await getFarmWeather(farm.latitude, farm.longitude)
              if (active) setWeather(forecast)
            } else {
              const resolved = await geocodeFarmLocation(savedLocation)
              const forecast = await getFarmWeather(resolved.latitude, resolved.longitude)
              if (active) {
                setWeatherLocation(resolved.location)
                setWeather(forecast)
              }
            }
          } catch (error) {
            if (active) setWeatherError(error.message || 'Could not load weather for this farm location.')
          }
        }
      } catch (error) {
        console.error('Could not load dashboard data:', error)
        if (active) setDashboardError('Could not load your saved profile or scan records.')
      } finally {
        if (active) setLoading(false)
      }
    }
    loadDashboard()
    return () => { active = false }
  }, [])

  const saveLocation = async (event) => {
    event.preventDefault()
    const user = auth.currentUser
    if (!user) {
      setWeatherError('Please log in again to update your location.')
      return
    }
    if (!locationDraft.trim()) {
      setWeatherError('Enter a town, village, or district.')
      return
    }

    setSavingLocation(true)
    setWeatherError('')
    try {
      const resolved = await geocodeFarmLocation(locationDraft.trim())
      const forecast = await getFarmWeather(resolved.latitude, resolved.longitude)
      const profile = await getUserProfile(user.uid)
      await saveUserProfile(user.uid, {
        farm: {
          ...(profile?.farm || {}),
          location: resolved.location,
          latitude: resolved.latitude,
          longitude: resolved.longitude,
        },
        updatedAt: new Date().toISOString(),
      })
      setLocation(resolved.location)
      setLocationDraft(resolved.location)
      setWeatherLocation(resolved.location)
      setWeather(forecast)
    } catch (error) {
      setWeatherError(error.message || 'Could not update weather for this location.')
    } finally {
      setSavingLocation(false)
    }
  }

  const healthyCount = scans.filter((scan) => scan.isHealthy).length
  const diseaseCount = scans.filter((scan) => !scan.isHealthy).length
  const averageConfidence = scans.length
    ? (scans.reduce((total, scan) => total + Number(scan.confidence || 0), 0) / scans.length).toFixed(1)
    : '—'
  const current = weather?.current

  return (
    <div className="space-y-8">
      <Header
        eyebrow="Dashboard"
        title={farmerName ? `Welcome, ${farmerName}` : 'Welcome back'}
        subtitle="Your farm scans and local weather at a glance."
        action={
          <Link to="/detect" className="hidden items-center gap-2 rounded-full bg-forest-600 px-4 py-2.5 text-sm font-medium text-white shadow-softer hover:bg-forest-700 sm:flex">
            <ScanLine size={16} /> Scan a Plant
          </Link>
        }
      />

      <div className="lg:hidden">
        <h1 className="text-2xl font-semibold tracking-tight text-ink dark:text-ink-dark">{farmerName ? `Welcome, ${farmerName}` : 'Welcome back'}</h1>
        <p className="mt-1 text-sm text-muted dark:text-muted-dark">Your farm scans and local weather at a glance.</p>
        <Link to="/detect" className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-forest-600 px-4 py-3 text-sm font-medium text-white shadow-softer">
          <ScanLine size={16} /> Scan a Plant
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Gauge} label="Total Scans" value={loading ? '…' : scans.length} tint="forest" />
        <StatCard icon={Leaf} label="Healthy Scans" value={loading ? '…' : healthyCount} tint="teal" />
        <StatCard icon={AlertTriangle} label="Diseased Scans" value={loading ? '…' : diseaseCount} tint="amber" />
        <StatCard icon={Gauge} label="Avg. Confidence" value={loading ? '…' : averageConfidence} suffix="%" tint="slate" />
      </div>
      {dashboardError && <p role="alert" className="text-sm text-red-600">{dashboardError}</p>}

      <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="card p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-ink dark:text-ink-dark"><CloudSun size={18} className="text-forest-600" />Farm weather</p>
            <p className="mt-1 text-sm text-muted dark:text-muted-dark">{weatherLocation || location || 'Set a farm location to see the local forecast.'}</p>
          </div>
          {current && (
            <div className="flex items-center gap-4 rounded-2xl bg-forest-50/70 px-4 py-3 dark:bg-white/5">
              <span className="text-3xl">{Number(current.temperature_2m).toFixed(0)}°</span>
              <div>
                <p className="text-sm font-semibold text-ink dark:text-ink-dark">{describeWeatherCode(current.weather_code)}</p>
                <p className="text-xs text-muted dark:text-muted-dark">Humidity {current.relative_humidity_2m}% · Rain {current.precipitation} mm</p>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={saveLocation} className="mt-5 flex flex-col gap-2 sm:flex-row">
          <label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-black/10 px-3 dark:border-white/10">
            <MapPin size={16} className="shrink-0 text-muted" aria-hidden="true" />
            <input type="text" value={locationDraft} onChange={(event) => setLocationDraft(event.target.value)} placeholder="Enter village, town, or district" className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-ink outline-none dark:text-ink-dark" aria-label="Farm weather location" />
          </label>
          <button type="submit" disabled={savingLocation} className="rounded-xl bg-forest-600 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60">{savingLocation ? 'Updating…' : location ? 'Change location' : 'Set location'}</button>
        </form>

        {weatherError && <p role="alert" className="mt-3 text-sm text-red-600">{weatherError}</p>}
        {weather?.hourly ? (
          <div className="mt-5 border-t border-black/5 pt-5 dark:border-white/10">
            <p className="mb-3 text-sm font-medium text-ink dark:text-ink-dark">Next 24 hours</p>
            <WeatherChart hourly={weather.hourly} />
          </div>
        ) : !weatherError && (loading || location) ? (
          <p className="mt-5 text-sm text-muted dark:text-muted-dark">Loading local forecast…</p>
        ) : null}
        <p className="mt-4 text-right text-xs text-muted dark:text-muted-dark">Weather data by <a href="https://open-meteo.com/" target="_blank" rel="noreferrer" className="underline">Open-Meteo</a></p>
      </motion.section>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="card p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-ink dark:text-ink-dark">Quick Disease Detection</h2>
          <Link to="/detect" className="hidden items-center gap-1 text-sm font-medium text-forest-600 dark:text-forest-300 sm:flex">Open scanner <ArrowRight size={14} /></Link>
        </div>
        <p className="mt-2 text-sm text-muted dark:text-muted-dark">Ready to check a crop? Start a new scan and review the result in Scan History.</p>
        <Link to="/detect" className="mt-4 inline-flex items-center gap-2 rounded-full bg-forest-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-forest-700"><ScanLine size={16} /> Start a scan</Link>
      </motion.div>
    </div>
  )
}
