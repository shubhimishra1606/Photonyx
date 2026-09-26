import { CircleCheck } from 'lucide-react'

export default function RecommendationCard({ index, action }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-black/5 dark:border-white/10 bg-forest-50/50 dark:bg-white/[0.03] px-4 py-3">
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-forest-100 dark:bg-forest-800 text-forest-700 dark:text-forest-300">
        <CircleCheck size={14} />
      </span>
      <p className="text-sm text-ink dark:text-ink-dark">{action}</p>
    </div>
  )
}
