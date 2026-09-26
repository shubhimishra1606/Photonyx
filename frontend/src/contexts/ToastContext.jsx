import { createContext, useCallback, useContext, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

const ICONS = {
  success: CheckCircle2,
  error: AlertTriangle,
  info: Info,
}

const ACCENTS = {
  success: 'border-forest-200 dark:border-forest-800 text-forest-700 dark:text-forest-300',
  error: 'border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400',
  info: 'border-teal-200 dark:border-teal-900/60 text-teal-700 dark:text-teal-400',
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    (message, type = 'info', duration = 3200) => {
      const id = `${Date.now()}-${Math.random()}`
      setToasts((prev) => [...prev, { id, message, type }])
      if (duration) {
        setTimeout(() => removeToast(id), duration)
      }
      return id
    },
    [removeToast]
  )

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-100 flex flex-col gap-2 sm:bottom-6 sm:right-6">
        <AnimatePresence>
          {toasts.map((toast) => {
            const Icon = ICONS[toast.type] ?? Info
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className={`flex max-w-xs items-start gap-2.5 rounded-xl border bg-surface dark:bg-surface-dark px-4 py-3 shadow-soft ${ACCENTS[toast.type]}`}
                role="status"
              >
                <Icon size={18} className="mt-0.5 shrink-0" />
                <p className="text-sm text-ink dark:text-ink-dark">{toast.message}</p>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="ml-auto shrink-0 text-muted dark:text-muted-dark hover:text-ink dark:hover:text-ink-dark"
                  aria-label="Dismiss notification"
                >
                  <X size={14} />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}
