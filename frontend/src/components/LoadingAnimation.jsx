import { motion } from 'framer-motion'
import { Leaf } from 'lucide-react'

export default function LoadingAnimation({ label = 'Analyzing your plant...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-14 text-center">
      <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-forest-50 dark:bg-white/5 overflow-hidden">
        <Leaf className="text-forest-500 dark:text-forest-300" size={30} />
        <motion.span
          className="absolute inset-x-0 h-8 bg-linear-to-b from-teal-400/0 via-teal-400/40 to-teal-400/0"
          animate={{ y: ['-100%', '100%'] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      <div>
        <p className="text-sm font-medium text-ink dark:text-ink-dark">{label}</p>
        <p className="mt-1 text-xs text-muted dark:text-muted-dark">
          Running inference through Photonyx's vision model
        </p>
      </div>
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-forest-400"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }}
          />
        ))}
      </div>
    </div>
  )
}
