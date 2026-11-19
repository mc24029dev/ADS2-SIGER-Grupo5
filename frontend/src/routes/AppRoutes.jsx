import { Navigate, Route, Routes } from "react-router-dom"
import Login from "../pages/auth/Login"
import Registro from "../pages/auth/Registro"
import CatalogoEventos from "../pages/participante/CatalogoEventos"
import ParticipanteLayout from "../components/layout/ParticipanteLayout";

import AdminLayout from "../components/layout/AdminLayout";
import DashboardAdmin from "../pages/admin/DashboardAdmin";
import GestionUsuarios from "../pages/admin/GestionUsuarios";
import GestionEventos from "../pages/admin/GestionEventos";

// TODO: proteger rutas por rol (ProtectedRoute) cuando exista el contexto de autenticación.
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      
      {/* RUTAS DEL PARTICIPANTE */}
      <Route path="/" element={<ParticipanteLayout />}>
        <Route path="eventos" element={<CatalogoEventos />} />
      </Route>

      {/* RUTAS DEL ADMINISTRADOR */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<DashboardAdmin />} />
        <Route path="usuarios" element={<GestionUsuarios />} />
        <Route path="eventos" element={<GestionEventos />} />
        {/* Rutas de ubicaciones y reportes las agrego luego */}
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
