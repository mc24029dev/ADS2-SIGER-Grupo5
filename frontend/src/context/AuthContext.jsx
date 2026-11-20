import { createContext, useCallback, useEffect, useState } from "react"
import { obtenerPerfil, verificarCredenciales } from "../api/auth"
import { EVENTO_SESION_EXPIRADA } from "../api/client"
import {
  borrarCredenciales,
  codificarBasic,
  guardarCredenciales,
  leerCredenciales,
} from "../utils/sesion"

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  // Si hay credenciales guardadas, hay que validarlas antes de decidir nada.
  const [cargando, setCargando] = useState(() => Boolean(leerCredenciales()))

  // Al abrir la app o recargar: recupera el perfil con las credenciales guardadas.
  useEffect(() => {
    if (!leerCredenciales()) return

    let cancelado = false
    obtenerPerfil()
      .then((perfil) => {
        if (!cancelado) setUsuario(perfil)
      })
      .catch(() => {
        borrarCredenciales()
      })
      .finally(() => {
        if (!cancelado) setCargando(false)
      })

    return () => {
      cancelado = true
    }
  }, [])

  // Si el servidor rechaza las credenciales guardadas, se cierra la sesión.
  useEffect(() => {
    const alExpirar = () => setUsuario(null)
    window.addEventListener(EVENTO_SESION_EXPIRADA, alExpirar)
    return () => window.removeEventListener(EVENTO_SESION_EXPIRADA, alExpirar)
  }, [])

  const login = useCallback(async (correo, contrasena) => {
    const basic = codificarBasic(correo, contrasena)
    const perfil = await verificarCredenciales(basic) // lanza error si falla
    guardarCredenciales(basic) // solo se guarda si el servidor las aceptó
    setUsuario(perfil)
    return perfil
  }, [])

  const logout = useCallback(() => {
    borrarCredenciales()
    setUsuario(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{ usuario, cargando, estaAutenticado: usuario !== null, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}
