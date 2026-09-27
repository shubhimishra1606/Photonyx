export default function Logo({ size =65 , showWordmark = true, className = '' }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img
        src="/logo2.png"
        alt="Photonyx logo"
        width={size}
        height={size}
        className="object-contain"
      />
      {showWordmark && (
        <span className="font-display text-lg font-semibold tracking-tight text-ink dark:text-ink-dark">
          Photonyx 
        </span>
      )}
    </div>
  )
}
