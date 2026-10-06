import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Leaf, ShieldCheck } from 'lucide-react'
import Header from '../components/Header'
import EmptyState from '../components/EmptyState'
import { plants } from '../data/mockData'
import { cn } from '../utils/classNames'
import { loadPlantCatalog } from '../services/plantCatalog'

const SEVERITY_STYLES = {
  low: 'bg-forest-50 text-forest-700 border-forest-200 dark:bg-forest-900/30 dark:text-forest-300 dark:border-forest-800',
  medium:
    'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-900/60',
  high: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-900/60',
}

export default function PlantDetail() {
  const { plantName } = useParams()
  const [catalog, setCatalog] = useState(plants)
  const [catalogLoaded, setCatalogLoaded] = useState(false)

  useEffect(() => {
    let active = true
    loadPlantCatalog()
      .then((supportedPlants) => { if (active) setCatalog(supportedPlants) })
      .catch((error) => console.error('Could not load model plant catalog:', error))
      .finally(() => { if (active) setCatalogLoaded(true) })
    return () => { active = false }
  }, [])

  const plant = catalog.find((p) => p.id === plantName)

  if (!plant && !catalogLoaded) {
    return <Header eyebrow="Plant Library" title="Loading plant details…" />
  }

  if (!plant) {
    return (
      <div className="space-y-6">
        <Header eyebrow="Plant Library" title="Plant not found" />
        <EmptyState
          icon={Leaf}
          title="We couldn't find that plant"
          description="It may have been removed from the library."
          action={
            <Link
              to="/plants"
              className="rounded-full bg-forest-600 px-5 py-2.5 text-sm font-medium text-white"
            >
              Back to Plant Library
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Link
        to="/plants"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted dark:text-muted-dark hover:text-ink dark:hover:text-ink-dark"
      >
        <ArrowLeft size={15} />
        Back to Plant Library
      </Link>

      <div className="flex items-center gap-4">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-forest-50 to-teal-50 dark:from-white/5 dark:to-white/5 text-4xl">
          {plant.image}
        </span>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink dark:text-ink-dark">
            {plant.name}
          </h1>
          <p className="text-sm text-muted dark:text-muted-dark">
            {plant.conditions.length} detectable condition{plant.conditions.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="card flex items-start gap-3 p-5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest-50 dark:bg-white/5 text-forest-600 dark:text-forest-300">
          <ShieldCheck size={17} />
        </span>
        <div>
          <h2 className="text-sm font-semibold text-ink dark:text-ink-dark">
            Healthy Appearance
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-muted dark:text-muted-dark">
            {plant.healthyAppearance}
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-base font-semibold text-ink dark:text-ink-dark">Conditions the model can detect</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {plant.conditions.map((condition) => (
            <div key={condition.id} className="card p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-semibold text-ink dark:text-ink-dark">
                  {condition.name}
                </h3>
                {condition.severity && <span
                  className={cn(
                    'shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium capitalize',
                    SEVERITY_STYLES[condition.severity]
                  )}
                >
                  {condition.severity} severity
                </span>}
              </div>

              <div className="mt-3">
                <p className="text-xs font-medium uppercase tracking-wide text-muted dark:text-muted-dark">
                  Symptoms
                </p>
                <p className="mt-1 text-sm leading-relaxed text-ink dark:text-ink-dark">
                  {condition.symptoms || 'This is a condition label the current detection model can recognize. Symptoms can vary; confirm the diagnosis if the plant is worsening.'}
                </p>
              </div>

              <div className="mt-3">
                <p className="text-xs font-medium uppercase tracking-wide text-muted dark:text-muted-dark">
                  Prevention Tips
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted dark:text-muted-dark">
                  {condition.prevention || 'Detailed prevention guidance is not yet available in the library. Ask the advice assistant or contact a local agricultural expert for crop-specific guidance.'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
