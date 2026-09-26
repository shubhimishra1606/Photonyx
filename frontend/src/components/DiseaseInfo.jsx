export default function DiseaseInfo({ description }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-ink dark:text-ink-dark">About the Disease</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted dark:text-muted-dark">
        {description}
      </p>
    </div>
  )
}
