import { Navigate, Route, Routes } from 'react-router'
import Layout from './components/Layout'
import DashboardPage from './pages/DashboardPage'
import ProcesosPage from './pages/ProcesosPage'
import CalendarioPage from './pages/CalendarioPage'
import PerfilPage from './pages/PerfilPage'
import EnlacesPage from './pages/EnlacesPage'
import PreferenciasPage from './pages/PreferenciasPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="procesos" element={<ProcesosPage />} />
        <Route path="calendario" element={<CalendarioPage />} />
        <Route path="perfil" element={<PerfilPage />} />
        <Route path="enlaces" element={<EnlacesPage />} />
        <Route path="preferencias" element={<PreferenciasPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
