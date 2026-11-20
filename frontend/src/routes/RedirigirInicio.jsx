import { Navigate } from "react-router-dom"
import PantallaCarga from "../components/ui/PantallaCarga"
import useAuth from "../hooks/useAuth"
import { rutaInicio } from "../utils/roles"

// Para "/" y para cualquier ruta desconocida.
export default function RedirigirInicio() {
  const { usuario, cargando } = useAuth()

  if (cargando) return <PantallaCarga />

  return <Navigate to={usuario ? rutaInicio(usuario.rol) : "/login"} replace />
}