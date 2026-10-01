import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Camera, X } from 'lucide-react'
import Cropper from 'react-easy-crop'

import Header from '../components/Header'
import UploadBox from '../components/UploadBox'
import ImagePreview from '../components/ImagePreview'
import LoadingAnimation from '../components/LoadingAnimation'
import PredictionCard from '../components/PredictionCard'
import { validateImageFile } from '../utils/validators'
import { predictDisease } from '../services/api'
import { useToast } from '../contexts/ToastContext'
import { auth } from '../firebase'
import { saveScan } from '../services/firestone'

const STATES = {
  IDLE: 'idle',
  SELECTED: 'selected',
  ANALYZING: 'analyzing',
  RESULT: 'result',
}

const createCroppedFile = async (imageSrc, pixelCrop) => {
  const image = new Image()
  image.src = imageSrc

  await new Promise((resolve) => {
    image.onload = resolve
  })

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  )

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      const file = new File(
        [blob],
        `cropped-leaf-${Date.now()}.jpg`,
        { type: 'image/jpeg' }
      )
      resolve(file)
    }, 'image/jpeg', 0.95)
  })
}

export default function Detect() {
  const location = useLocation()
  const { showToast } = useToast()

  const [status, setStatus] = useState(STATES.IDLE)
  const [imageFile, setImageFile] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [result, setResult] = useState(null)

  const [cameraOpen, setCameraOpen] = useState(false)
  const [cropOpen, setCropOpen] = useState(false)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)

  const objectUrlRef = useRef(null)
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  const handleFileSelected = (file) => {
    const { valid, message } = validateImageFile(file)

    if (!valid) {
      showToast(message, 'error')
      return
    }

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
    }

    const url = URL.createObjectURL(file)

    objectUrlRef.current = url

    setImageFile(file)
    setImageUrl(url)
    setResult(null)
    setStatus(STATES.SELECTED)
  }

  // ---------------- CAMERA ----------------

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
        },
        audio: false,
      })

      streamRef.current = stream
      setCameraOpen(true)

      // Give React time to render the video element
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play()
        }
      }, 100)
    } catch (error) {
      console.error(error)
      showToast(
        'Unable to access camera. Please allow camera permission.',
        'error'
      )
    }
  }

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    setCameraOpen(false)
  }

  const capturePhoto = () => {
    const video = videoRef.current

    if (!video || !video.videoWidth) {
      showToast('Camera is not ready yet.', 'error')
      return
    }

    const canvas = document.createElement('canvas')

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const context = canvas.getContext('2d')

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    )

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          showToast('Unable to capture photo.', 'error')
          return
        }

        const file = new File(
          [blob],
          `plant-scan-${Date.now()}.jpg`,
          {
            type: 'image/jpeg',
          }
        )

        closeCamera()
        handleFileSelected(file)
        setCropOpen(true)
      },
      'image/jpeg',
      0.9
    )
  }

  // ---------------- ROUTED FILE ----------------

  useEffect(() => {
    const pendingFile = location.state?.pendingFile

    if (pendingFile) {
      handleFileSelected(pendingFile)
      window.history.replaceState({}, document.title)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ---------------- CLEANUP ----------------

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  // ---------------- IMAGE REMOVE ----------------

  const handleRemove = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
    }

    setImageFile(null)
    setImageUrl(null)
    setResult(null)
    setStatus(STATES.IDLE)

    showToast('Image removed', 'info')
  }

  // ---------------- PREDICTION ----------------

  const handleDetect = async () => {
    setStatus(STATES.ANALYZING)

    try {
      const prediction = await predictDisease(imageFile)

    if (prediction.rejected) {
      showToast(prediction.message, 'error')
      setStatus(STATES.SELECTED)
      return
    }

      const user = auth.currentUser
      if (!user) throw new Error('Please log in again before saving this scan.')

      setResult(prediction)
      setStatus(STATES.RESULT)
      try {
        await saveScan(user.uid, {
          plant: prediction.plant,
          disease: prediction.disease,
          confidence: prediction.confidence,
          isHealthy: prediction.isHealthy,
          fileName: prediction.fileName,
        })
        showToast('Prediction completed and saved to scan history', 'success')
      } catch (saveError) {
        console.error('Could not save scan history:', saveError)
        showToast('Prediction completed, but scan history could not be saved.', 'error')
      }
    } catch (error) {
      console.error(error)

      showToast(
        'Something went wrong analyzing the image. Please try again.',
        'error'
      )

      setStatus(STATES.SELECTED)
    }
  }

  return (
    <>

    <AnimatePresence>
  {cropOpen && imageUrl && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
    >
      <div className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-gray-900">

        <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-700">
          <h2 className="font-semibold text-gray-900 dark:text-white">
            Crop Leaf
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            Adjust the box around the leaf, then click Use This Leaf.
          </p>
        </div>

        <div className="relative h-[60vh] bg-black">
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, croppedAreaPixels) => {
              window.croppedAreaPixels = croppedAreaPixels
            }}
          />
        </div>

        <div className="flex items-center gap-3 px-5 py-4">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Zoom
          </span>

          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1"
          />
        </div>

        <div className="flex justify-end gap-3 px-5 pb-5">
          <button
            type="button"
            onClick={() => setCropOpen(false)}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={async () => {
              const croppedFile = await createCroppedFile(
                imageUrl,
                window.croppedAreaPixels
              )

              setCropOpen(false)
              handleFileSelected(croppedFile)
            }}
            className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white"
          >
            Use This Leaf
          </button>
        </div>

      </div>
    </motion.div>
  )}
</AnimatePresence>


      {/* CAMERA MODAL */}
      <AnimatePresence>
        {cameraOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-gray-900"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-700">
                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    Scan Plant
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    Position the plant leaf clearly inside the camera.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeCamera}
                  className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Camera */}
              <div className="relative bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="max-h-[65vh] min-h-75 w-full object-contain"
                />

                {/* Camera guide */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="h-56 w-72 rounded-xl border-2 border-white/80" />
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-3 px-5 py-5">
                <button
                  type="button"
                  onClick={closeCamera}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={capturePhoto}
                  className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700"
                >
                  <Camera size={18} />
                  Capture Photo
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN PAGE */}
      <div className="space-y-8">
        <Header
          eyebrow="Disease Detection"
          title="Disease Detection"
          subtitle="Upload a leaf image to get an instant AI-assisted diagnosis."
        />

        <div className="lg:hidden">
          <h1 className="text-2xl font-semibold tracking-tight text-ink dark:text-ink-dark">
            Disease Detection
          </h1>

          <p className="mt-1 text-sm text-muted dark:text-muted-dark">
            Upload a leaf image to get an instant AI-assisted diagnosis.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">

          {/* LEFT */}
          <div className="card p-6">
            <h2 className="text-base font-semibold text-ink dark:text-ink-dark">
              Leaf Image
            </h2>

            <div className="mt-4">
              <AnimatePresence mode="wait">

                {/* Upload */}
                {status === STATES.IDLE && (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <UploadBox
                      onFileSelected={handleFileSelected}
                    />

                    <div className="mt-4 flex justify-center">
                      <button
                        type="button"
                        onClick={openCamera}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                      >
                        <Camera size={18} />
                        Scan with Camera
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Preview */}
                {(status === STATES.SELECTED ||
                  status === STATES.ANALYZING ||
                  status === STATES.RESULT) && (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <ImagePreview
                      imageUrl={imageUrl}
                      fileName={imageFile?.name}
                      onRemove={handleRemove}
                      onReplace={handleFileSelected}
                      onDetect={handleDetect}
                      isAnalyzing={status === STATES.ANALYZING}
                    />
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT */}
          <div className="card p-6">
            <h2 className="text-base font-semibold text-ink dark:text-ink-dark">
              Prediction
            </h2>

            <div className="mt-4">
              <AnimatePresence mode="wait">

                {status === STATES.ANALYZING && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <LoadingAnimation />
                  </motion.div>
                )}

                {status === STATES.RESULT && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <PredictionCard result={result} />
                  </motion.div>
                )}

                {(status === STATES.IDLE ||
                  status === STATES.SELECTED) && (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <PredictionCard result={null} />
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
