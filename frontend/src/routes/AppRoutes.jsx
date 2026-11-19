import { Navigate, Route, Routes } from "react-router-dom"
import Login from "../pages/auth/Login"
import Registro from "../pages/auth/Registro"
import CatalogoEventos from "../pages/participante/CatalogoEventos"

// TODO: proteger rutas por rol (ProtectedRoute) cuando exista el contexto de autenticación.
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/eventos" element={<CatalogoEventos />} />
      {/* participante: /mis-reservaciones | organizador: /organizador/eventos, /organizador/asistencia | admin: /admin/usuarios, /admin/reportes */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
