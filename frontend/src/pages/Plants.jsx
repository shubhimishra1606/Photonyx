import { useEffect, useMemo, useState } from 'react'
import { Sprout } from 'lucide-react'
import Header from '../components/Header'
import SearchBar from '../components/SearchBar'
import PlantCard from '../components/PlantCard'
import EmptyState from '../components/EmptyState'
import { plants } from '../data/mockData'
import { loadPlantCatalog } from '../services/plantCatalog'

export default function Plants() {
  const [search, setSearch] = useState('')
  const [catalog, setCatalog] = useState(plants)
  const [loadingCatalog, setLoadingCatalog] = useState(true)
  const [catalogError, setCatalogError] = useState(false)

  useEffect(() => {
    let active = true
    loadPlantCatalog()
      .then((supportedPlants) => { if (active) setCatalog(supportedPlants) })
      .catch((error) => {
        console.error('Could not load model plant catalog:', error)
        if (active) setCatalogError(true)
      })
      .finally(() => { if (active) setLoadingCatalog(false) })
    return () => { active = false }
  }, [])

  const filtered = useMemo(
    () => catalog.filter((plant) => plant.name.toLowerCase().includes(search.toLowerCase())),
    [catalog, search]
  )

  return (
    <div className="space-y-6">
      <Header
        eyebrow="Plant Library"
        title="Plant Library"
        subtitle={loadingCatalog
          ? 'Loading plants supported by the current detection model…'
          : catalogError
            ? 'Showing the saved plant list. Start the backend to load the current model’s full catalog.'
            : `Browse ${catalog.length} plants supported by the current detection model.`}
      />
      <div className="lg:hidden">
        <h1 className="text-2xl font-semibold tracking-tight text-ink dark:text-ink-dark">
          Plant Library
        </h1>
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Search plants..." className="sm:max-w-xs" />

      {filtered.length === 0 ? (
        <EmptyState
          icon={Sprout}
          title="No plants found"
          description="Try searching for a different plant name."
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((plant) => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
        </div>
      )}
    </div>
  )
}
