import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { onAuthStateChanged, reload } from 'firebase/auth'
import { auth } from './firebase'
import { ThemeProvider } from './contexts/ThemeContext'
import { ToastProvider } from './contexts/ToastContext'
import MainLayout from './layouts/MainLayout'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Detect from './pages/Detect'
import History from './pages/History'
import Plants from './pages/Plants'
import PlantDetail from './pages/PlantDetail'
import Settings from './pages/Settings'
import Advice from './pages/Advice'
import Auth from "./pages/Auth";

import { wakeBackend } from './services/api'

function VerifiedRoute() {
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setStatus('signed-out')
        return
      }

      try {
        await reload(user)
        // Phone sign-in proves control of the number during OTP confirmation.
        setStatus(user.emailVerified || user.phoneNumber ? 'verified' : 'signed-out')
      } catch {
        setStatus('signed-out')
      }
    })
  }, [])

  if (status === 'loading') return null
  if (status !== 'verified') return <Navigate to="/auth" replace />
  return <Outlet />
}

export default function App() {

   useEffect(() => {
    wakeBackend()
  }, [])
  
  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route element={<VerifiedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/detect" element={<Detect />} />
                <Route path="/advice" element={<Advice />} />
                <Route path="/history" element={<History />} />
                <Route path="/plants" element={<Plants />} />
                <Route path="/plants/:plantName" element={<PlantDetail />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  )
}
