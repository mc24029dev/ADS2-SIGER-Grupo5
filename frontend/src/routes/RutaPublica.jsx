import { Navigate, Outlet } from "react-router-dom"
import PantallaCarga from "../components/ui/PantallaCarga"
import useAuth from "../hooks/useAuth"
import { rutaInicio } from "../utils/roles"

/**
 * Para /login y /registro: si ya hay sesión, no tiene sentido mostrarlos,
 * así que se redirige al inicio del rol.
 */
export default function RutaPublica() {
  const { usuario, cargando } = useAuth()

  if (cargando) return <PantallaCarga />

  if (usuario) {
    const destino = rutaInicio(usuario.rol)
    // Si el rol fuera desconocido, rutaInicio devuelve /login: no se redirige
    // para evitar un bucle.
    if (destino !== "/login") return <Navigate to={destino} replace />
  }

  return <Outlet />
}