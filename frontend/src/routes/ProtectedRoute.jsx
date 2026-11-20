import { Navigate, Outlet } from "react-router-dom"
import PantallaCarga from "../components/ui/PantallaCarga"
import useAuth from "../hooks/useAuth"
import { rutaInicio } from "../utils/roles"

/**
 * Protege un grupo de rutas.
 * - Sin sesión: manda al login.
 * - Con sesión pero rol no permitido: manda al inicio de su propio rol.
 * - `roles` es opcional; si no se pasa, basta con estar autenticado.
 */
export default function ProtectedRoute({ roles }) {
  const { usuario, cargando } = useAuth()

  if (cargando) return <PantallaCarga />

  if (!usuario) return <Navigate to="/login" replace />

  if (roles && !roles.includes(usuario.rol)) {
    return <Navigate to={rutaInicio(usuario.rol)} replace />
  }

  return <Outlet />
}