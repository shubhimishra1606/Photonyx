import { Search } from 'lucide-react'

export default function SearchBar({ value, onChange, placeholder = 'Search...', className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <Search
        size={16}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted dark:text-muted-dark"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-black/10 dark:border-white/10 bg-surface dark:bg-surface-dark py-2.5 pl-10 pr-4 text-sm text-ink dark:text-ink-dark placeholder:text-muted dark:placeholder:text-muted-dark focus:border-forest-400"
        aria-label={placeholder}
      />
    </div>
  )
}
