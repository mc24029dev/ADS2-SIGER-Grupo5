import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/auth/Login";
import Registro from "../pages/auth/Registro";
import ParticipanteLayout from "../components/layout/ParticipanteLayout";
import CatalogoEventos from "../pages/participante/CatalogoEventos";

// Public
import PublicLayout from "../components/layout/PublicLayout";
import LandingPage from "../pages/public/LandingPage";
import Contacto from "../pages/public/Contacto";
import AcercaDe from "../pages/public/AcercaDe";
import EventosPublicos from "../pages/public/EventosPublicos";

// Admin
import AdminLayout from "../components/layout/AdminLayout";
import DashboardAdmin from "../pages/admin/DashboardAdmin";
import GestionUsuarios from "../pages/admin/GestionUsuarios";
import GestionEventos from "../pages/admin/GestionEventos";

// TODO: proteger rutas por rol (ProtectedRoute) cuando exista el contexto de autenticación.
export default function AppRoutes() {
  return (
    <Routes>
      {/* RUTAS PÚBLICAS */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="eventos" element={<EventosPublicos />} />
        <Route path="acerca" element={<AcercaDe />} />
        <Route path="contacto" element={<Contacto />} />
      </Route>

      {/* AUTH */}
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />

      {/* RUTAS DEL PARTICIPANTE */}
      <Route path="/participante" element={<ParticipanteLayout />}>
        <Route path="eventos" element={<CatalogoEventos />} />
      </Route>

      {/* RUTAS DEL ADMINISTRADOR */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<DashboardAdmin />} />
        <Route path="usuarios" element={<GestionUsuarios />} />
        <Route path="eventos" element={<GestionEventos />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
