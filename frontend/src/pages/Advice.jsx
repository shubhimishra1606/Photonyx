import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowLeft, Bot, CloudSun, Leaf, Send, ShieldAlert, Sprout } from 'lucide-react'
import Header from '../components/Header'
import { auth } from '../firebase'
import { getUserProfile } from '../services/firestone'
import { askPlantAdvice } from '../services/api'
import { describeWeatherCode, geocodeFarmLocation, getFarmWeather } from '../services/weather'
import { useToast } from '../contexts/ToastContext'

const SUGGESTED_QUESTIONS = [
  'What should I do first?',
  'How can I stop it spreading?',
  'Could the weather make it worse?',
  'Should I use fertilizer?',
]

export default function Advice() {
  const { state } = useLocation()
  const diagnosis = state?.diagnosis
  const { showToast } = useToast()
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([])
  const [sending, setSending] = useState(false)
  const [chatError, setChatError] = useState('')
  const [farmContext, setFarmContext] = useState({ region: null, size: null })
  const [weatherContext, setWeatherContext] = useState({})
  const [contextLoading, setContextLoading] = useState(true)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (!diagnosis) return undefined
    let active = true

    const loadFarmContext = async () => {
      try {
        const user = auth.currentUser
        if (!user) return
        const profile = await getUserProfile(user.uid)
        if (!active || !profile?.farm) return

        const farm = profile.farm
        let region = null
        let forecast = null
        if (farm.location?.trim()) {
          try {
            const coordinates = await geocodeFarmLocation(farm.location.trim())
            const regionParts = coordinates.location.split(',').map((part) => part.trim())
            region = regionParts.length > 1 ? regionParts.slice(-2).join(', ') : regionParts[0]
            forecast = await getFarmWeather(coordinates.latitude, coordinates.longitude)
          } catch (error) {
            console.warn('Farm weather is unavailable:', error)
          }
        }

        if (!active) return
        setFarmContext({ region, size: farm.size || null })
        if (forecast?.current) {
          const current = forecast.current
          const rainValues = (forecast.hourly?.precipitation_probability || [])
            .slice(0, 24)
            .filter((value) => Number.isFinite(value))
          const rainProbability = rainValues.length ? Math.max(...rainValues) : null
          setWeatherContext({
            summary: describeWeatherCode(current.weather_code),
            temperature_c: current.temperature_2m ?? null,
            humidity_percent: current.relative_humidity_2m ?? null,
            rain_probability_percent: rainProbability,
          })
        }
      } catch (error) {
        console.error('Could not load farm advice context:', error)
        if (active) showToast('Farm profile could not be loaded. You can still ask about the scan.', 'info')
      } finally {
        if (active) setContextLoading(false)
      }
    }

    loadFarmContext()
    return () => { active = false }
  }, [diagnosis, showToast])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, sending])

  const handleSend = async (event) => {
    event.preventDefault()
    const currentQuestion = question.trim()
    if (!currentQuestion || sending) return

    const priorMessages = messages
    setMessages((current) => [...current, { role: 'user', content: currentQuestion }])
    setQuestion('')
    setChatError('')
    setSending(true)

    try {
      const response = await askPlantAdvice({
        diagnosis: {
          plant: diagnosis.plant,
          disease: diagnosis.disease,
          confidence: Number(diagnosis.confidence),
        },
        farm: farmContext,
        weather: weatherContext,
        history: priorMessages,
        question: currentQuestion,
      })
      setMessages((current) => [...current, { role: 'assistant', content: response.answer }])
    } catch (error) {
      setMessages(priorMessages)
      setQuestion(currentQuestion)
      setChatError(error.message)
    } finally {
      setSending(false)
    }
  }

  if (!diagnosis) {
    return (
      <div className="space-y-6">
        <Header eyebrow="Plant Advice" title="Get advice" subtitle="Advice is linked to a recent disease scan." />
        <div className="card p-6 text-center sm:p-10">
          <Leaf className="mx-auto text-forest-600 dark:text-forest-300" size={30} />
          <h2 className="mt-4 text-lg font-semibold text-ink dark:text-ink-dark">Choose a diagnosis first</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted dark:text-muted-dark">
            Run a plant scan and select Get advice from an infected result to start a session with its diagnosis.
          </p>
          <Link to="/detect" className="mt-5 inline-flex rounded-xl bg-forest-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-forest-700">
            Go to disease detection
          </Link>
        </div>
      </div>
    )
  }

  const confidence = Number(diagnosis.confidence)

  return (
    <div className="space-y-6">
      <Header
        eyebrow="Plant Advice"
        title="Advice for your plant"
        subtitle="Ask questions about the diagnosis and your farm conditions."
        action={(
          <Link to="/detect" className="inline-flex h-10 items-center gap-2 rounded-full border border-black/5 bg-surface px-4 text-sm font-medium text-ink hover:border-forest-300 dark:border-white/10 dark:bg-surface-dark dark:text-ink-dark">
            <ArrowLeft size={15} /> <span className="hidden sm:inline">Back to scan</span>
          </Link>
        )}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <section className="card flex min-h-155 flex-col overflow-hidden">
          <div className="flex items-center gap-3 border-b border-black/5 px-5 py-4 dark:border-white/10">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-forest-50 text-forest-700 dark:bg-forest-900/40 dark:text-forest-300"><Bot size={20} /></span>
            <div>
              <h2 className="text-sm font-semibold text-ink dark:text-ink-dark">Photonyx Farm Assistant</h2>
              <p className="text-xs text-muted dark:text-muted-dark">Advice session for {diagnosis.plant}</p>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-5 sm:px-6">
            {!messages.length && (
              <div className="my-auto flex flex-col items-center justify-center py-8 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-forest-50 text-forest-700 dark:bg-forest-900/40 dark:text-forest-300"><Sprout size={26} /></span>
                <h3 className="mt-5 text-lg font-semibold text-ink dark:text-ink-dark">Let’s understand what’s happening</h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-muted dark:text-muted-dark">
                  Your scan found <span className="font-medium text-ink dark:text-ink-dark">{diagnosis.disease}</span> on <span className="font-medium text-ink dark:text-ink-dark">{diagnosis.plant}</span>. Ask a question to get advice using this result and available farm and weather context.
                </p>
                <div className="mt-6 flex max-w-xl flex-wrap justify-center gap-2">
                  {SUGGESTED_QUESTIONS.map((item) => (
                    <button key={item} type="button" onClick={() => setQuestion(item)} className="rounded-full border border-black/10 px-3.5 py-2 text-xs font-medium text-ink transition hover:border-forest-400 hover:bg-forest-50 dark:border-white/10 dark:text-ink-dark dark:hover:bg-forest-900/30">
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${message.role === 'user' ? 'rounded-br-md bg-forest-600 text-white' : 'rounded-bl-md bg-forest-50 text-ink dark:bg-white/5 dark:text-ink-dark'}`}>
                  {message.content}
                </div>
              </div>
            ))}
            {sending && <div className="flex justify-start"><div className="rounded-2xl rounded-bl-md bg-forest-50 px-4 py-3 text-sm text-muted dark:bg-white/5 dark:text-muted-dark">Preparing advice…</div></div>}
            <div ref={messagesEndRef} />
          </div>

          {!messages.length && (
            <div className="px-4 pb-4 text-center text-xs text-muted dark:text-muted-dark">
              {contextLoading ? 'Loading saved farm details and local forecast…' : 'Your question will include the diagnosis and available farm context.'}
            </div>
          )}

          <form onSubmit={handleSend} className="border-t border-black/5 p-4 dark:border-white/10 sm:p-5">
            <label htmlFor="advice-question" className="sr-only">Ask a question about your plant</label>
            <div className="flex items-end gap-2 rounded-2xl border border-black/10 bg-canvas p-2 dark:border-white/10 dark:bg-canvas-dark">
              <textarea
                id="advice-question"
                rows={2}
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault()
                    handleSend(event)
                  }
                }}
                disabled={sending}
                placeholder="Ask a question about this diagnosis…"
                className="max-h-32 min-h-11 flex-1 resize-y bg-transparent px-2 py-2 text-sm text-ink outline-none placeholder:text-muted dark:text-ink-dark dark:placeholder:text-muted-dark"
              />
              <button type="submit" disabled={!question.trim() || sending} aria-label="Send question" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest-600 text-white transition hover:bg-forest-700 disabled:cursor-not-allowed disabled:opacity-40">
                <Send size={17} />
              </button>
            </div>
            {chatError ? <p role="alert" className="mt-2 text-center text-xs text-rose-600 dark:text-rose-400">{chatError}</p> : <p className="mt-2 text-center text-xs text-muted dark:text-muted-dark">Your question and scan context are sent to Gemini. Don’t include names or contact details. Verify treatment advice locally.</p>}
          </form>
        </section>

        <aside className="space-y-4">
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-ink dark:text-ink-dark">Scan details</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-start justify-between gap-3"><dt className="text-muted dark:text-muted-dark">Crop</dt><dd className="text-right font-medium text-ink dark:text-ink-dark">{diagnosis.plant}</dd></div>
              <div className="flex items-start justify-between gap-3"><dt className="text-muted dark:text-muted-dark">Detected condition</dt><dd className="text-right font-medium text-ink dark:text-ink-dark">{diagnosis.disease}</dd></div>
              {Number.isFinite(confidence) && <div className="flex items-start justify-between gap-3"><dt className="text-muted dark:text-muted-dark">Model confidence</dt><dd className="text-right font-medium text-ink dark:text-ink-dark">{confidence.toFixed(1)}%</dd></div>}
            </dl>
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-2"><CloudSun size={17} className="text-forest-600 dark:text-forest-300" /><h2 className="text-sm font-semibold text-ink dark:text-ink-dark">Farm context</h2></div>
            <p className="mt-3 text-sm leading-relaxed text-muted dark:text-muted-dark">
              {contextLoading ? 'Loading your saved farm context…' : [farmContext.region, farmContext.size].filter(Boolean).join(' · ') || 'Add a farm location and size in Settings for more tailored advice.'}
            </p>
            {weatherContext.summary && <p className="mt-2 text-xs text-muted dark:text-muted-dark">Weather now: {weatherContext.summary}{weatherContext.temperature_c != null ? `, ${weatherContext.temperature_c}°C` : ''}{weatherContext.rain_probability_percent != null ? ` · rain chance ${weatherContext.rain_probability_percent}% in the next 24h` : ''}</p>}
            <Link to="/settings" className="mt-3 inline-flex text-sm font-medium text-forest-700 hover:underline dark:text-forest-300">Review farm details</Link>
          </div>

          <div className="flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900/60 dark:bg-amber-900/15">
            <ShieldAlert size={17} className="mt-0.5 shrink-0 text-amber-700 dark:text-amber-300" />
            <p className="text-xs leading-relaxed text-amber-900 dark:text-amber-200">Image-based results can be uncertain. Confirm serious or spreading symptoms with a local agricultural expert before applying treatments.</p>
          </div>
        </aside>
      </div>
    </div>
  )
}
