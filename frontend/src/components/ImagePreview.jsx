import { useRef } from 'react'
import { motion } from 'framer-motion'
import { X, RefreshCw, ScanLine } from 'lucide-react'

export default function ImagePreview({
  imageUrl,
  fileName,
  onRemove,
  onReplace,
  onDetect,
  isAnalyzing,
}) {
  const inputRef = useRef(null)

  const handleReplace = (e) => {
    const file = e.target.files?.[0]
    if (file) onReplace(file)
    e.target.value = ''
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
    >
      <div className="relative overflow-hidden rounded-2xl border border-black/5 dark:border-white/10">
        <img
          src={imageUrl}
          alt={`Preview of uploaded leaf: ${fileName}`}
          className="h-64 w-full object-cover sm:h-80"
        />
        <button
          onClick={onRemove}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition-colors hover:bg-black/70"
          aria-label="Remove image"
        >
          <X size={15} />
        </button>
        {isAnalyzing && (
          <motion.span
            className="absolute inset-x-0 h-16 bg-linear-to-b from-teal-300/0 via-teal-300/50 to-teal-300/0"
            animate={{ y: ['-20%', '340%'] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
          />
        )}
      </div>

      <p className="mt-2 truncate text-xs text-muted dark:text-muted-dark">{fileName}</p>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          onClick={onDetect}
          disabled={isAnalyzing}
          className="flex items-center gap-2 rounded-full bg-forest-600 px-5 py-2.5 text-sm font-medium text-white shadow-softer transition-colors hover:bg-forest-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <ScanLine size={16} />
          {isAnalyzing ? 'Analyzing...' : 'Detect Disease'}
        </button>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={isAnalyzing}
          className="flex items-center gap-2 rounded-full border border-black/10 dark:border-white/10 bg-surface dark:bg-surface-dark px-5 py-2.5 text-sm font-medium text-ink dark:text-ink-dark transition-colors hover:border-forest-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw size={15} />
          Replace Image
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        className="hidden"
        onChange={handleReplace}
      />
    </motion.div>
  )
}
