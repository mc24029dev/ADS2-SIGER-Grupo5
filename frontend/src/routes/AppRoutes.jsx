import { Route, Routes } from "react-router-dom"
import Login from "../pages/auth/Login"
import Registro from "../pages/auth/Registro"
import CatalogoEventos from "../pages/participante/CatalogoEventos"
import ParticipanteLayout from "../components/layout/ParticipanteLayout"

import AdminLayout from "../components/layout/AdminLayout"
import DashboardAdmin from "../pages/admin/DashboardAdmin"
import GestionUsuarios from "../pages/admin/GestionUsuarios"
import GestionEventos from "../pages/admin/GestionEventos"

import ProtectedRoute from "./ProtectedRoute"
import RutaPublica from "./RutaPublica"
import RedirigirInicio from "./RedirigirInicio"

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RedirigirInicio />} />

      {/* PÚBLICAS: si ya hay sesión, redirigen al inicio del rol */}
      <Route element={<RutaPublica />}>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
      </Route>

      {/* PARTICIPANTE (el Organizador entra aquí temporalmente,
          hasta que exista su propio panel) */}
      <Route element={<ProtectedRoute roles={["PARTICIPANTE", "ORGANIZADOR"]} />}>
        <Route element={<ParticipanteLayout />}>
          <Route path="/eventos" element={<CatalogoEventos />} />
        </Route>
      </Route>

      {/* ADMINISTRADOR */}
      <Route element={<ProtectedRoute roles={["ADMINISTRADOR"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardAdmin />} />
          <Route path="usuarios" element={<GestionUsuarios />} />
          <Route path="eventos" element={<GestionEventos />} />
          {/* Rutas de ubicaciones y reportes las agrego luego */}
        </Route>
      </Route>

      <Route path="*" element={<RedirigirInicio />} />
    </Routes>
  )
}