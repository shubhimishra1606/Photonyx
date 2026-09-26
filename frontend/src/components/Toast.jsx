import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react'

const ICONS = {
  success: CheckCircle2,
  error: AlertTriangle,
  info: Info,
}

const ACCENTS = {
  success: 'border-forest-200 dark:border-forest-800 text-forest-700 dark:text-forest-300',
  error: 'border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400',
  info: 'border-teal-200 dark:border-teal-900/60 text-teal-700 dark:text-teal-400',
}

export default function Toast({ message, type = 'info', onDismiss }) {
  const Icon = ICONS[type] ?? Info
  return (
    <div
      className={`flex max-w-xs items-start gap-2.5 rounded-xl border bg-surface dark:bg-surface-dark px-4 py-3 shadow-soft ${ACCENTS[type]}`}
      role="status"
    >
      <Icon size={18} className="mt-0.5 shrink-0" />
      <p className="text-sm text-ink dark:text-ink-dark">{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="ml-auto shrink-0 text-muted dark:text-muted-dark hover:text-ink dark:hover:text-ink-dark"
          aria-label="Dismiss notification"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}
