import { motion } from 'framer-motion'
import { cn } from '../utils/classNames'

export default function StatCard({ icon: Icon, label, value, suffix = '', tint = 'forest' }) {
  const tints = {
    forest: 'from-forest-500 to-forest-600',
    teal: 'from-teal-500 to-teal-600',
    amber: 'from-amber-400 to-amber-500',
    slate: 'from-slate-500 to-slate-600',
  }

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="card p-5"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted dark:text-muted-dark">{label}</p>
        <span
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br text-white',
            tints[tint]
          )}
        >
          <Icon size={16} />
        </span>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-ink dark:text-ink-dark">
        {value}
        <span className="text-base font-medium text-muted dark:text-muted-dark">{suffix}</span>
      </p>
    </motion.div>
  )
}
