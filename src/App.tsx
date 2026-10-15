import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import Layout from './components/Layout'
import DashboardPage from './pages/DashboardPage'
import ProcesosPage from './pages/ProcesosPage'
import PerfilPage from './pages/PerfilPage'
import EnlacesPage from './pages/EnlacesPage'
import PreferenciasPage from './pages/PreferenciasPage'

const CalendarioPage = lazy(() => import('./pages/CalendarioPage'))

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="procesos" element={<ProcesosPage />} />
        <Route
          path="calendario"
          element={
            <Suspense
              fallback={
                <p className="p-8 text-center text-sm text-slate-500">
                  Cargando calendario…
                </p>
              }
            >
              <CalendarioPage />
            </Suspense>
          }
        />
        <Route path="perfil" element={<PerfilPage />} />
        <Route path="enlaces" element={<EnlacesPage />} />
        <Route path="preferencias" element={<PreferenciasPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
