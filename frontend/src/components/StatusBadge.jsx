import { CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react'
import { cn } from '../utils/classNames'

const VARIANTS = {
  healthy: {
    label: 'Healthy',
    icon: CheckCircle2,
    classes:
      'bg-forest-50 text-forest-700 border-forest-200 dark:bg-forest-900/30 dark:text-forest-300 dark:border-forest-800',
  },
  diseased: {
    label: 'Disease Detected',
    icon: AlertTriangle,
    classes:
      'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-900/60',
  },
  low: {
    label: 'Low Confidence',
    icon: HelpCircle,
    classes:
      'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800/40 dark:text-slate-300 dark:border-slate-700',
  },
}

export default function StatusBadge({ status, label, className = '' }) {
  const variant = VARIANTS[status] ?? VARIANTS.diseased
  const Icon = variant.icon
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
        variant.classes,
        className
      )}
    >
      <Icon size={13} />
      {label ?? variant.label}
    </span>
  )
}
