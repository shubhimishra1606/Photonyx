import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function PlantCard({ plant }) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Link
        to={`/plants/${plant.id}`}
        className="card group flex flex-col gap-3 p-5 transition-shadow hover:shadow-glow"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-forest-50 to-teal-50 dark:from-white/5 dark:to-white/5 text-3xl">
          {plant.image}
        </div>
        <div>
          <h3 className="text-base font-semibold text-ink dark:text-ink-dark">{plant.name}</h3>
          <p className="text-sm text-muted dark:text-muted-dark">
            {plant.conditions.length} detectable condition
            {plant.conditions.length !== 1 ? 's' : ''}
          </p>
        </div>
        <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-forest-600 dark:text-forest-300">
          View diseases
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </Link>
    </motion.div>
  )
}
