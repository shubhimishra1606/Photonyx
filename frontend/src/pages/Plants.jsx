import { useMemo, useState } from 'react'
import { Sprout } from 'lucide-react'
import Header from '../components/Header'
import SearchBar from '../components/SearchBar'
import PlantCard from '../components/PlantCard'
import EmptyState from '../components/EmptyState'
import { plants } from '../data/mockData'

export default function Plants() {
  const [search, setSearch] = useState('')

  const filtered = useMemo(
    () => plants.filter((plant) => plant.name.toLowerCase().includes(search.toLowerCase())),
    [search]
  )

  return (
    <div className="space-y-6">
      <Header
        eyebrow="Plant Library"
        title="Plant Library"
        subtitle="Browse supported plants and the conditions PlantDx can detect."
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
