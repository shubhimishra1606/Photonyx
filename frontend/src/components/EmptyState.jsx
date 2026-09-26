export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-black/10 dark:border-white/10 px-6 py-14 text-center">
      {Icon && (
        <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-forest-50 dark:bg-white/5 text-forest-600 dark:text-forest-300">
          <Icon size={22} />
        </span>
      )}
      <h3 className="text-base font-semibold text-ink dark:text-ink-dark">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-muted dark:text-muted-dark">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
