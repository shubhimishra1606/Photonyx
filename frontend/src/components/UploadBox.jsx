import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { UploadCloud, Camera } from 'lucide-react'
import { cn } from '../utils/classNames'

export default function UploadBox({ onFileSelected, compact = false }) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) onFileSelected(file)
  }

  const handleInputChange = (e) => {
    const file = e.target.files?.[0]
    if (file) onFileSelected(file)
    e.target.value = ''
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={cn(
        'relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 text-center transition-colors',
        compact ? 'py-8' : 'py-14',
        isDragging
          ? 'border-forest-500 bg-forest-50 dark:bg-forest-900/20'
          : 'border-black/10 dark:border-white/10 bg-forest-50/40 dark:bg-white/[0.02] hover:border-forest-300 dark:hover:border-forest-700'
      )}
    >
      <motion.div
        animate={isDragging ? { scale: 1.08 } : { scale: 1 }}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-forest-500 to-teal-500 text-white shadow-glow"
      >
        <UploadCloud size={24} />
      </motion.div>

      <p className="mt-4 text-sm font-medium text-ink dark:text-ink-dark">
        Upload a clear leaf image
      </p>
      <p className="text-sm text-muted dark:text-muted-dark">or drag &amp; drop here</p>
      <p className="mt-1 text-xs text-muted dark:text-muted-dark">
        JPG, JPEG or PNG • Max 10MB
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="rounded-full bg-forest-600 px-5 py-2.5 text-sm font-medium text-white shadow-softer transition-colors hover:bg-forest-700"
        >
          Upload Image
        </button>
        <button
          onClick={() => cameraInputRef.current?.click()}
          className="flex items-center gap-2 rounded-full border border-black/10 dark:border-white/10 bg-surface dark:bg-surface-dark px-5 py-2.5 text-sm font-medium text-ink dark:text-ink-dark transition-colors hover:border-forest-300"
          aria-label="Use camera to take a photo"
        >
          <Camera size={16} />
          Camera
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        className="hidden"
        onChange={handleInputChange}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        capture="environment"
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  )
}
