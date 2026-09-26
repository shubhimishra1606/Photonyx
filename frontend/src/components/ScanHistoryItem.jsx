import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import StatusBadge from './StatusBadge'
import { formatDate } from '../utils/validators'
import { CONFIDENCE_THRESHOLD } from '../utils/constants'

export default function ScanHistoryItem({ scan, onView }) {
  const status = scan.confidence < CONFIDENCE_THRESHOLD ? 'low' : scan.isHealthy ? 'healthy' : 'diseased'

  return (
    <motion.div
      whileHover={{ x: 2 }}
      className="flex items-center gap-4 rounded-xl border border-black/5 dark:border-white/10 bg-surface dark:bg-surface-dark px-4 py-3.5"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-forest-50 dark:bg-white/5 text-2xl">
        {scan.image}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-ink dark:text-ink-dark">{scan.plant}</p>
          <StatusBadge status={status} />
        </div>
        <p className="truncate text-sm text-muted dark:text-muted-dark">{scan.disease}</p>
      </div>

      <div className="hidden shrink-0 text-right sm:block">
        <p className="text-sm font-medium text-ink dark:text-ink-dark">
          {scan.confidence.toFixed(1)}%
        </p>
        <p className="text-xs text-muted dark:text-muted-dark">{formatDate(scan.date)}</p>
      </div>

      <button
        onClick={() => onView?.(scan)}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted dark:text-muted-dark hover:bg-forest-50 dark:hover:bg-white/10 hover:text-forest-600 dark:hover:text-forest-300"
        aria-label={`View details for ${scan.plant} scan`}
      >
        <ChevronRight size={17} />
      </button>
    </motion.div>
  )
}
