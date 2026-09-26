export default function Logo({ size = 36, showWordmark = true, className = '' }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="plantdx-grad" x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#2F7D39" />
            <stop offset="1" stopColor="#238C80" />
          </linearGradient>
        </defs>
        <rect x="1" y="1" width="38" height="38" rx="11" fill="url(#plantdx-grad)" />
        {/* Leaf */}
        <path
          d="M20 30c-6.5 0-11-4.7-11-11.5C9 12 14 8 20 8s11 4 11 10.5C31 25.3 26.5 30 20 30z"
          fill="white"
          fillOpacity="0.95"
        />
        <path d="M20 30V8" stroke="#2F7D39" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M20 14l-4 3M20 19l-4.5 3M20 24l-4 3" stroke="#2F7D39" strokeWidth="1.2" strokeLinecap="round" />
        {/* Circuit nodes */}
        <circle cx="27.5" cy="12.5" r="1.6" fill="#0B3833" />
        <circle cx="29.5" cy="20" r="1.2" fill="#0B3833" />
        <path d="M25 14l2.5-1.5M26.5 18.5L29 20" stroke="#0B3833" strokeWidth="1" strokeLinecap="round" />
      </svg>
      {showWordmark && (
        <span className="font-display text-lg font-semibold tracking-tight text-ink dark:text-ink-dark">
          PlantDx
        </span>
      )}
    </div>
  )
}
