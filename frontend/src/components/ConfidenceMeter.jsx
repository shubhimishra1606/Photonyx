import { motion } from 'framer-motion'

export default function ConfidenceMeter({ confidence, size = 128, strokeWidth = 10 }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (confidence / 100) * circumference

  const color =
    confidence >= 85 ? '#2F7D39' : confidence >= 60 ? '#238C80' : '#94A3B8'

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-black/5 dark:stroke-white/10"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-semibold tracking-tight text-ink dark:text-ink-dark">
          {confidence.toFixed(1)}%
        </span>
        <span className="text-[11px] text-muted dark:text-muted-dark">confidence</span>
      </div>
    </div>
  )
}
