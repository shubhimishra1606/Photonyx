import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import MobileNavbar from '../components/MobileNavbar'

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-canvas dark:bg-canvas-dark">
      <Sidebar />
      <MobileNavbar />
      <main className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 pb-24 pt-6 sm:px-6 lg:px-10 lg:pb-12 lg:pt-10">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
