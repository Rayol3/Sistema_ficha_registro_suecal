import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import FormularioPage from "./pages/FormularioPage"
import LoginAdmin        from "./pages/admin/LoginAdmin"
import DashboardAdmin    from "./pages/admin/DashboardAdmin"
import FichaDetalleAdmin  from "./pages/admin/FichaDetalleAdmin"
import SolicitudesAdmin   from "./pages/admin/SolicitudesAdmin"

// ── Guard: redirige al login si no hay token ───────────────
function RutaProtegida({ children }) {
  const token = localStorage.getItem("admin_token")
  if (!token) return <Navigate to="/admin/login" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Formulario público */}
        <Route path="/"            element={<FormularioPage />} />

        {/* Panel admin */}
        <Route path="/admin/login" element={<LoginAdmin />} />
        <Route path="/admin"       element={
          <RutaProtegida>
            <DashboardAdmin />
          </RutaProtegida>
        } />
        <Route path="/admin/ficha/:id" element={
          <RutaProtegida>
            <FichaDetalleAdmin />
          </RutaProtegida>
        } />
        <Route path="/admin/solicitudes" element={
          <RutaProtegida>
            <SolicitudesAdmin />
          </RutaProtegida>
        } />

        {/* Cualquier ruta desconocida → formulario */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}