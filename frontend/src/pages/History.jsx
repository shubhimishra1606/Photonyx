import { useEffect, useMemo, useState } from 'react'
import { History as HistoryIcon } from 'lucide-react'
import Header from '../components/Header'
import SearchBar from '../components/SearchBar'
import ScanHistoryItem from '../components/ScanHistoryItem'
import EmptyState from '../components/EmptyState'
import Modal from '../components/Modal'
import StatusBadge from '../components/StatusBadge'
import { formatDate } from '../utils/validators'
import { CONFIDENCE_THRESHOLD } from '../utils/constants'
import { cn } from '../utils/classNames'
import { auth } from '../firebase'
import { getUserScans } from '../services/firestone'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'healthy', label: 'Healthy' },
  { id: 'diseased', label: 'Diseased' },
]

const PAGE_SIZE = 6

export default function History() {
  const [scanHistory, setScanHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [selectedScan, setSelectedScan] = useState(null)

  useEffect(() => {
    let active = true
    const loadScans = async () => {
      try {
        const user = auth.currentUser
        if (!user) throw new Error('Not signed in')
        const scans = await getUserScans(user.uid)
        if (active) setScanHistory(scans.map((scan) => ({
          ...scan,
          date: scan.scannedAt,
          image: '🌿',
        })))
      } catch (error) {
        console.error('Could not load scan history:', error)
        if (active) setLoadError(true)
      } finally {
        if (active) setLoading(false)
      }
    }
    loadScans()
    return () => { active = false }
  }, [])

  const filtered = useMemo(() => {
      return scanHistory.filter((scan) => {
      const matchesSearch =
        scan.plant.toLowerCase().includes(search.toLowerCase()) ||
        scan.disease.toLowerCase().includes(search.toLowerCase())
      const matchesFilter =
        filter === 'all' ||
        (filter === 'healthy' && scan.isHealthy) ||
        (filter === 'diseased' && !scan.isHealthy)
      return matchesSearch && matchesFilter
    })
  }, [scanHistory, search, filter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const updateFilter = (id) => {
    setFilter(id)
    setPage(1)
  }

  const updateSearch = (value) => {
    setSearch(value)
    setPage(1)
  }

  return (
    <div className="space-y-6">
      <Header
        eyebrow="Scan History"
        title="Scan History"
        subtitle="Browse and search every scan Photonyx has recorded."
      />
      <div className="lg:hidden">
        <h1 className="text-2xl font-semibold tracking-tight text-ink dark:text-ink-dark">
          Scan History
        </h1>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar value={search} onChange={updateSearch} placeholder="Search plant or disease..." className="sm:max-w-xs" />
        <div className="flex gap-2">
          {FILTERS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => updateFilter(id)}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                filter === id
                  ? 'bg-forest-600 text-white'
                  : 'bg-surface dark:bg-surface-dark border border-black/10 dark:border-white/10 text-muted dark:text-muted-dark hover:text-ink dark:hover:text-ink-dark'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="py-8 text-center text-sm text-muted dark:text-muted-dark">Loading scan history...</p>
      ) : loadError ? (
        <p className="py-8 text-center text-sm text-red-600">Could not load scan history. Check your connection and Firestore rules.</p>
      ) : paginated.length === 0 ? (
        <EmptyState
          icon={HistoryIcon}
          title={scanHistory.length === 0 && filter === 'all' && !search ? 'No scans saved yet' : 'No scans found'}
          description={scanHistory.length === 0 && filter === 'all' && !search
            ? 'Run a plant scan while logged in. Its result will appear here.'
            : 'Try a different search term or filter to find what you’re looking for.'}
        />
      ) : (
        <div className="space-y-3">
          {paginated.map((scan) => (
            <ScanHistoryItem key={scan.id} scan={scan} onView={() => setSelectedScan(scan)} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={cn(
                'h-8 w-8 rounded-full text-sm font-medium transition-colors',
                page === i + 1
                  ? 'bg-forest-600 text-white'
                  : 'text-muted dark:text-muted-dark hover:bg-forest-50 dark:hover:bg-white/10'
              )}
              aria-label={`Go to page ${i + 1}`}
              aria-current={page === i + 1 ? 'page' : undefined}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      <Modal
        open={!!selectedScan}
        onClose={() => setSelectedScan(null)}
        title={selectedScan ? `${selectedScan.plant} scan` : ''}
      >
        {selectedScan && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {selectedScan.imageUrl ? (
                <img src={selectedScan.imageUrl} alt={`${selectedScan.plant} leaf scan`} className="h-16 w-16 rounded-2xl object-cover" />
              ) : (
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-forest-50 dark:bg-white/5 text-4xl">{selectedScan.image || '🌿'}</span>
              )}
              <div>
                <p className="text-lg font-semibold text-ink dark:text-ink-dark">
                  {selectedScan.plant}
                </p>
                <p className="text-sm text-muted dark:text-muted-dark">{selectedScan.disease}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-forest-50/60 dark:bg-white/3 px-4 py-3">
                <p className="text-muted dark:text-muted-dark">Confidence</p>
                <p className="mt-1 font-semibold text-ink dark:text-ink-dark">
                  {selectedScan.confidence.toFixed(1)}%
                </p>
              </div>
              <div className="rounded-xl bg-forest-50/60 dark:bg-white/3 px-4 py-3">
                <p className="text-muted dark:text-muted-dark">Date</p>
                <p className="mt-1 font-semibold text-ink dark:text-ink-dark">
                  {formatDate(selectedScan.date)}
                </p>
              </div>
            </div>
            <StatusBadge
              status={
                selectedScan.confidence < CONFIDENCE_THRESHOLD
                  ? 'low'
                  : selectedScan.isHealthy
                  ? 'healthy'
                  : 'diseased'
              }
            />
          </div>
        )}
      </Modal>
    </div>
  )
}
