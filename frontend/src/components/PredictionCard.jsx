import { motion } from 'framer-motion'
import { Sparkles, AlertCircle, MessageCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ConfidenceMeter from './ConfidenceMeter'
import StatusBadge from './StatusBadge'
import DiseaseInfo from './DiseaseInfo'
import RecommendationCard from './RecommendationCard'
import EmptyState from './EmptyState'
import { CONFIDENCE_THRESHOLD } from '../utils/constants'

export default function PredictionCard({ result }) {
  const navigate = useNavigate()
  if (!result) {
    return (
      <EmptyState
        icon={Sparkles}
        title="Your prediction will appear here"
        description="Upload a leaf image and run detection to see the plant, disease, and confidence score."
      />
    )
  }

  const isLowConfidence = result.confidence < CONFIDENCE_THRESHOLD
  const status = isLowConfidence ? 'low' : result.isHealthy ? 'healthy' : 'diseased'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="text-center sm:text-left">
          <p className="text-xs font-medium uppercase tracking-wide text-muted dark:text-muted-dark">
            Plant
          </p>
          <p className="text-xl font-semibold text-ink dark:text-ink-dark">{result.plant}</p>

          <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted dark:text-muted-dark">
            {result.isHealthy ? 'Status' : 'Disease'}
          </p>
          <p className="text-xl font-semibold text-ink dark:text-ink-dark">{result.disease}</p>

          <div className="mt-3">
            <StatusBadge status={status} />
          </div>
        </div>

        <ConfidenceMeter confidence={result.confidence} />
      </div>

      {isLowConfidence && (
        <div className="flex items-start gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 px-4 py-3">
          <AlertCircle size={18} className="mt-0.5 shrink-0 text-slate-500 dark:text-slate-300" />
          <div>
            <p className="text-sm font-medium text-ink dark:text-ink-dark">
              Low confidence prediction
            </p>
            <p className="mt-0.5 text-sm text-muted dark:text-muted-dark">
              Try uploading a clearer image with the affected leaf centered in the frame.
            </p>
          </div>
        </div>
      )}

      <div className="border-t border-black/5 dark:border-white/10 pt-5">
        <DiseaseInfo description={result.description} />
      </div>

      <div>
        <h3 className="text-sm font-semibold text-ink dark:text-ink-dark">
          Recommended Actions
        </h3>
        <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {result.actions.map((action, i) => (
            <RecommendationCard key={i} index={i} action={action} />
          ))}
        </div>
      </div>

      {!result.isHealthy && !isLowConfidence && (
        <button
          type="button"
          onClick={() => navigate('/advice', { state: { diagnosis: result } })}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-forest-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-forest-700 sm:w-auto"
        >
          <MessageCircle size={17} />
          Get advice
        </button>
      )}

      <p className="rounded-xl bg-forest-50/60 dark:bg-white/3 px-4 py-3 text-xs leading-relaxed text-muted dark:text-muted-dark">
        AI predictions are for informational purposes and should be verified by an
        agricultural expert.
      </p>
    </motion.div>
  )
}
