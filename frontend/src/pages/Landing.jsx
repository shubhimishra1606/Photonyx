import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  UploadCloud,
  ScanLine,
  BookOpenText,
  ClipboardCheck,
  Sparkles,
  Gauge,
  MessageSquareText,
  ImageIcon,
  ArrowRight,
} from 'lucide-react'
import Logo from '../components/Logo'

import { plants } from '../data/mockData'
import { useTheme } from '../contexts/ThemeContext'
import { Moon, Sun } from 'lucide-react'

const STEPS = [
  { icon: UploadCloud, title: 'Upload', description: 'Add a photo of any leaf showing signs of stress.' },
  { icon: ScanLine, title: 'Analyze', description: "Photonyx's model scans the leaf for disease patterns." },
  { icon: BookOpenText, title: 'Understand', description: 'Get the disease name, confidence, and context.' },
  { icon: ClipboardCheck, title: 'Act', description: 'Follow clear, prioritized recommendations.' },
]

const WHY_CARDS = [
  {
    icon: Sparkles,
    title: 'AI-powered detection',
    description: 'A vision model trained to recognize disease patterns across common crops.',
  },
  {
    icon: Gauge,
    title: 'Fast predictions',
    description: 'Results in seconds, not days — scan in the field or from your desk.',
  },
  {
    icon: ClipboardCheck,
    title: 'Confidence-aware results',
    description: 'Every prediction comes with a confidence score, so you know how much to trust it.',
  },
  {
    icon: MessageSquareText,
    title: 'Easy-to-understand recommendations',
    description: 'Plain-language next steps instead of dense agronomy jargon.',
  },
  {
    icon: ImageIcon,
    title: 'Designed for real-world images',
    description: 'Built to handle ordinary phone photos, not just lab-quality samples.',
  },
]

export default function Landing() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen bg-canvas dark:bg-canvas-dark">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
        <Logo />
        <div className="flex items-center gap-3">
          <Link
            to="/auth"
            className="rounded-full bg-forest-600 px-5 py-2.5 text-sm font-medium text-white shadow-softer hover:bg-forest-700"
          >
            Login / Sign Up
          </Link>
          <button
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/5 dark:border-white/10 text-muted dark:text-muted-dark hover:text-forest-600 dark:hover:text-forest-300"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl gap-12 px-5 pb-20 pt-8 sm:px-8 lg:grid-cols-2 lg:items-center lg:pt-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="inline-flex items-center gap-2 rounded-full border border-forest-200 dark:border-forest-800 bg-forest-50 dark:bg-forest-900/30 px-3.5 py-1.5 text-xs font-medium text-forest-700 dark:text-forest-300">
            <Sparkles size={13} />
            Photonyx AI
          </p>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.1] tracking-tight text-ink dark:text-ink-dark sm:text-5xl">
            See the disease.
            <br />
            Understand the plant.
            <br />
            <span className="text-gradient">Act faster.</span>
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted dark:text-muted-dark">
            AI-powered plant disease detection from a single leaf image.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/auth"
              className="flex items-center gap-2 rounded-full bg-forest-600 px-6 py-3 text-sm font-medium text-white shadow-softer hover:bg-forest-700"
            >
              Detect a Disease
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/auth"
              className="rounded-full border border-black/10 dark:border-white/10 px-6 py-3 text-sm font-medium text-ink dark:text-ink-dark hover:border-forest-300"
            >
              Explore Plants
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative"
        >
          <div className="card relative overflow-hidden p-6">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-muted dark:text-muted-dark">
                Live scan preview
              </p>
              <span className="flex items-center gap-1.5 rounded-full bg-forest-50 dark:bg-forest-900/30 px-2.5 py-1 text-[11px] font-medium text-forest-700 dark:text-forest-300">
                <span className="h-1.5 w-1.5 rounded-full bg-forest-500 animate-pulseSoft" />
                Analyzing
              </span>
            </div>

            <div className="relative mt-4 flex h-44 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-forest-50 to-teal-50 dark:from-forest-900/20 dark:to-teal-900/10 text-6xl">
              🍅
              <motion.span
                className="absolute inset-x-0 h-10 bg-linear-to-b from-teal-300/0 via-teal-300/60 to-teal-300/0"
                animate={{ y: ['-10%', '400%'] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
              />
            </div>

            <div className="mt-4 space-y-2.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted dark:text-muted-dark">Plant</span>
                <span className="font-medium text-ink dark:text-ink-dark">Tomato</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted dark:text-muted-dark">Disease</span>
                <span className="font-medium text-ink dark:text-ink-dark">Late Blight</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted dark:text-muted-dark">Confidence</span>
                <span className="font-medium text-forest-600 dark:text-forest-300">96.8%</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <h2 className="text-2xl font-semibold tracking-tight text-ink dark:text-ink-dark">
          How Photonyx works
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ icon: Icon, title, description }, i) => (
            <div key={title} className="card p-5">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-50 dark:bg-white/5 text-forest-600 dark:text-forest-300">
                  <Icon size={16} />
                </span>
                <span className="text-xs font-medium text-muted dark:text-muted-dark">
                  Step {i + 1}
                </span>
              </div>
              <h3 className="mt-3 text-base font-semibold text-ink dark:text-ink-dark">{title}</h3>
              <p className="mt-1 text-sm text-muted dark:text-muted-dark">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Supported plants
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-semibold tracking-tight text-ink dark:text-ink-dark">
            Supported plants
          </h2>
          <Link
            to="/plants"
            className="text-sm font-medium text-forest-600 dark:text-forest-300 hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {plants.map((plant) => (
            <div
              key={plant.id}
              className="card flex flex-col items-center gap-2 px-4 py-6 text-center"
            >
              <span className="text-3xl">{plant.image}</span>
              <span className="text-sm font-medium text-ink dark:text-ink-dark">{plant.name}</span>
            </div>
          ))}
        </div>
      </section> */}

      {/* Why Photonyx */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <h2 className="text-2xl font-semibold tracking-tight text-ink dark:text-ink-dark">
          Why Photonyx?
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_CARDS.map(({ icon: Icon, title, description }) => (
            <div key={title} className="card p-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-forest-500 to-teal-500 text-white">
                <Icon size={16} />
              </span>
              <h3 className="mt-3 text-base font-semibold text-ink dark:text-ink-dark">{title}</h3>
              <p className="mt-1 text-sm text-muted dark:text-muted-dark">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-5 pb-20 pt-4 sm:px-8">
        <div className="card relative overflow-hidden bg-linear-to-br from-forest-600 to-teal-600 px-8 py-14 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-white">
            Start your first scan
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-white/80">
            Upload a leaf photo and see what Photonyx detects in seconds.
          </p>
          <Link
            to="/auth"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-forest-700 hover:bg-white/90"
          >
            Start Your First Scan
            <ArrowRight size={16} />
          </Link>
        </div>
        <p className="mt-8 text-center text-xs text-muted dark:text-muted-dark">
          Photonyx AI — AI-powered plant disease detection system.
        </p>
      </section>
    </div>
  )
}
