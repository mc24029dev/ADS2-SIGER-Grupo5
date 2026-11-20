import { Navigate, Route, Routes } from "react-router-dom"

// Autenticación
import Login from "../pages/auth/Login"
import Registro from "../pages/auth/Registro"
import ProtectedRoute from "./ProtectedRoute"
import RutaPublica from "./RutaPublica"
import RedirigirInicio from "./RedirigirInicio"

// Vistas Públicas
import PublicLayout from "../components/layout/PublicLayout"
import LandingPage from "../pages/public/LandingPage"
import Contacto from "../pages/public/Contacto"
import AcercaDe from "../pages/public/AcercaDe"
import EventosPublicos from "../pages/public/EventosPublicos"

// Participante
import ParticipanteLayout from "../components/layout/ParticipanteLayout"
import CatalogoEventos from "../pages/participante/CatalogoEventos"
import MisReservaciones from "../pages/participante/MisReservaciones"
import MiPerfil from "../pages/participante/MiPerfil"

// Admin y Organizador
import AdminLayout from "../components/layout/AdminLayout"
import DashboardAdmin from "../pages/admin/DashboardAdmin"
import GestionUsuarios from "../pages/admin/GestionUsuarios"
import GestionEventos from "../pages/admin/GestionEventos"
import GestionAsistencias from "../pages/admin/GestionAsistencias"
import GestionReportes from "../pages/admin/GestionReportes"
import MiPerfilAdmin from "../pages/admin/MiPerfilAdmin"
import OrganizadorLayout from "../components/layout/OrganizadorLayout"

export default function AppRoutes() {
  return (
    <Routes>
      {/* 1. RUTAS PÚBLICAS */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/eventos" element={<EventosPublicos />} />
        <Route path="/acerca" element={<AcercaDe />} />
        <Route path="/contacto" element={<Contacto />} />
      </Route>

      {/* 2. RUTAS DE AUTH (Login y Registro) */}
      <Route element={<RutaPublica />}>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
      </Route>

      {/* 3. RUTAS DEL PARTICIPANTE (Protegidas) */}
      <Route element={<ProtectedRoute roles={["PARTICIPANTE"]} />}>
        <Route element={<ParticipanteLayout />}>
          <Route path="/participante/eventos" element={<CatalogoEventos />} />
          <Route path="/participante/mis-reservaciones" element={<MisReservaciones />} />
          <Route path="/participante/perfil" element={<MiPerfil />} />
        </Route>
      </Route>

      {/* 4. RUTAS DEL ADMINISTRADOR (Protegidas) */}
      <Route element={<ProtectedRoute roles={["ADMINISTRADOR"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardAdmin />} />
          <Route path="usuarios" element={<GestionUsuarios />} />
          <Route path="eventos" element={<GestionEventos />} />
          <Route path="asistencias" element={<GestionAsistencias />} />
          <Route path="reportes" element={<GestionReportes />} />
          <Route path="perfil" element={<MiPerfilAdmin />} />
        </Route>
      </Route>

      {/* 5. RUTAS DEL ORGANIZADOR (Protegidas) */}
      <Route element={<ProtectedRoute roles={["ORGANIZADOR"]} />}>
        <Route path="/organizador" element={<OrganizadorLayout />}>
          <Route index element={<Navigate to="/organizador/eventos" replace />} />
          <Route path="eventos" element={<GestionEventos />} />
          <Route path="asistencias" element={<GestionAsistencias />} />
          <Route path="reportes" element={<GestionReportes />} />
          <Route path="perfil" element={<MiPerfilAdmin />} />
        </Route>
      </Route>

      {/* 6. REDIRECCIONES */}
      <Route path="*" element={<RedirigirInicio />} />
    </Routes>
  )
}