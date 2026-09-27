import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ScanLine,
  Leaf,
  AlertTriangle,
  Target,
  ArrowRight,
  Clock3,
} from 'lucide-react'
import Header from '../components/Header'
import StatCard from '../components/StatCard'
import UploadBox from '../components/UploadBox'
import ScanHistoryItem from '../components/ScanHistoryItem'
import { dashboardStats, scanHistory } from '../data/mockData'
import { validateImageFile } from '../utils/validators'
import { useToast } from '../contexts/ToastContext'

export default function Dashboard() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const recentScans = scanHistory.slice(0, 4)

  const handleQuickUpload = (file) => {
    const { valid, message } = validateImageFile(file)
    if (!valid) {
      showToast(message, 'error')
      return
    }
    // Hand off to the full Detect page, which owns the actual upload state.
    navigate('/detect', { state: { pendingFile: file } })
  }

  return (
    <div className="space-y-8">
      <Header
        eyebrow="Dashboard"
        title="Good morning 👋"
        subtitle="Detect plant diseases faster with Photonyx AI."
        action={
          <Link
            to="/detect"
            className="hidden items-center gap-2 rounded-full bg-forest-600 px-4 py-2.5 text-sm font-medium text-white shadow-softer hover:bg-forest-700 sm:flex"
          >
            <ScanLine size={16} />
            Scan a Plant
          </Link>
        }
      />

      <div className="lg:hidden">
        <h1 className="text-2xl font-semibold tracking-tight text-ink dark:text-ink-dark">
          Good morning 👋
        </h1>
        <p className="mt-1 text-sm text-muted dark:text-muted-dark">
          Detect plant diseases faster with Photonyx AI.
        </p>
        <Link
          to="/detect"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-forest-600 px-4 py-3 text-sm font-medium text-white shadow-softer"
        >
          <ScanLine size={16} />
          Scan a Plant
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Target} label="Total Scans" value={dashboardStats.totalScans} tint="forest" />
        <StatCard icon={Leaf} label="Healthy Plants" value={dashboardStats.healthyPlants} tint="teal" />
        <StatCard
          icon={AlertTriangle}
          label="Diseases Detected"
          value={dashboardStats.diseasesDetected}
          tint="amber"
        />
        <StatCard
          icon={Target}
          label="Model Accuracy"
          value={dashboardStats.modelAccuracy}
          suffix="%"
          tint="slate"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="card p-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-ink dark:text-ink-dark">
            Quick Disease Detection
          </h2>
          <Link
            to="/detect"
            className="hidden items-center gap-1 text-sm font-medium text-forest-600 dark:text-forest-300 sm:flex"
          >
            Full detection page
            <ArrowRight size={14} />
          </Link>
        </div>
        <div className="mt-4">
          <UploadBox onFileSelected={handleQuickUpload} compact />
        </div>
      </motion.div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-base font-semibold text-ink dark:text-ink-dark">
            <Clock3 size={17} className="text-muted dark:text-muted-dark" />
            Recent Scans
          </h2>
          <Link
            to="/history"
            className="text-sm font-medium text-forest-600 dark:text-forest-300 hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="mt-4 space-y-3">
          {recentScans.map((scan) => (
            <ScanHistoryItem key={scan.id} scan={scan} onView={() => navigate('/history')} />
          ))}
        </div>
      </div>
    </div>
  )
}
