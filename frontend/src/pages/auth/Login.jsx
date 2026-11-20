import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  CalendarCheck,
  Eye,
  EyeOff,
  LoaderCircle,
  LogIn,
  Lock,
  Mail,
  TriangleAlert,
} from "lucide-react"
import CampoConIcono from "../../components/ui/CampoConIcono"
import useAuth from "../../hooks/useAuth"
import { rutaInicio } from "../../utils/roles"

function mensajeDeError(err) {
  if (err.status === 401) return "Credenciales inválidas. Verifica tu correo y contraseña."
  if (err.sinConexion) return "No se pudo conectar con el servidor. Intenta de nuevo."
  return err.message
}

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [correo, setCorreo] = useState("")
  const [contrasena, setContrasena] = useState("")
  const [verContrasena, setVerContrasena] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setCargando(true)

    try {
      const perfil = await login(correo, contrasena)
      navigate(rutaInicio(perfil.rol), { replace: true })
    } catch (err) {
      setError(mensajeDeError(err))
      setCargando(false)
    }
  }

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-margin-mobile sm:p-margin bg-surface-container-low">
      <div className="w-full max-w-[420px] bg-surface-container-lowest rounded-2xl p-6 sm:p-10 shadow-md">
        <div className="flex flex-col items-center text-center">
          <div className="w-[60px] h-[60px] bg-primary rounded-xl flex items-center justify-center shadow-sm mb-4 transition-transform hover:scale-105 duration-200">
            <CalendarCheck size={32} aria-hidden="true" className="text-on-primary" />
          </div>
          <h1 className="text-headline-lg text-on-surface mb-1">SIGER</h1>
          <p className="text-body-md text-on-surface-variant max-w-[280px] mb-8">
            Sistema Integral de Gestión de Eventos y Reservaciones
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col">
          <div className="mb-5">
            <CampoConIcono
              id="correo"
              etiqueta="Correo electrónico"
              icono={Mail}
              type="email"
              name="correo"
              autoComplete="email"
              placeholder="usuario@correo.com"
              required
              disabled={cargando}
              value={correo}
              onChange={(e) => {
                setCorreo(e.target.value)
                setError("")
              }}
            />
          </div>

          <div className="mb-6">
            <CampoConIcono
              id="contrasena"
              etiqueta="Contraseña"
              icono={Lock}
              type={verContrasena ? "text" : "password"}
              name="contrasena"
              autoComplete="current-password"
              placeholder="••••••••••••"
              required
              disabled={cargando}
              value={contrasena}
              onChange={(e) => {
                setContrasena(e.target.value)
                setError("")
              }}
              derecha={
                <button
                  type="button"
                  onClick={() => setVerContrasena((v) => !v)}
                  aria-label={verContrasena ? "Ocultar contraseña" : "Mostrar contraseña"}
                  aria-pressed={verContrasena}
                  className="text-outline hover:text-on-surface flex items-center justify-center p-1 rounded-md transition-colors focus:outline-none focus-visible:text-primary"
                >
                  {verContrasena ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              }
            />
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 p-3 rounded-r-md rounded-l bg-error-container border-l-4 border-error text-on-error-container text-[13px] flex items-center gap-2 shadow-sm"
            >
              <TriangleAlert size={18} aria-hidden="true" className="shrink-0 text-error" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="w-full h-[48px] cursor-pointer bg-primary hover:bg-secondary active:scale-[0.99] text-on-primary text-label-md rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:opacity-90 disabled:cursor-not-allowed"
          >
            {cargando ? (
              <LoaderCircle size={20} aria-hidden="true" className="animate-spin" />
            ) : (
              <LogIn size={20} aria-hidden="true" />
            )}
            <span>{cargando ? "Verificando..." : "Iniciar sesión"}</span>
          </button>
        </form>

        <p className="mt-6 text-center text-body-md text-on-surface-variant">
          ¿No tienes cuenta?{" "}
          <Link
            to="/registro"
            className="text-label-md text-primary hover:text-secondary transition-colors"
          >
            Crear cuenta
          </Link>
        </p>
      </div>
    </main>
  )
}