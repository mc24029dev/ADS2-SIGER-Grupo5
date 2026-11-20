import axios from "axios"
import { borrarCredenciales, leerCredenciales } from "../utils/sesion"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/siger/api/v1"

// Evento que se dispara cuando el servidor rechaza las credenciales guardadas.
export const EVENTO_SESION_EXPIRADA = "siger:sesion-expirada"

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// PETICIONES: agrega las credenciales guardadas, salvo que la petición
// ya traiga su propia cabecera (el caso del intento de login).
api.interceptors.request.use((config) => {
  const guardadas = leerCredenciales()
  if (guardadas && !config.headers.Authorization) {
    config.headers.Authorization = `Basic ${guardadas}`
  }
  return config
})

// RESPUESTAS
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const respuesta = error.response

    // Solo es "sesión expirada" si el 401 llegó usando las credenciales
    // guardadas. Un 401 del intento de login no cierra nada ni recarga.
    if (respuesta?.status === 401) {
      const guardadas = leerCredenciales()
      const enviada = error.config?.headers?.Authorization
      if (guardadas && enviada === `Basic ${guardadas}`) {
        borrarCredenciales()
        window.dispatchEvent(new Event(EVENTO_SESION_EXPIRADA))
      }
    }

    const mensaje =
      respuesta?.data?.mensaje ||
      respuesta?.data?.message ||
      (respuesta ? "Error inesperado del servidor" : "No se pudo conectar con el servidor")

    // Conserva el código HTTP y si fue un problema de conexión.
    const err = new Error(mensaje)
    err.status = respuesta?.status
    err.sinConexion = !respuesta
    return Promise.reject(err)
  }
)

export default api