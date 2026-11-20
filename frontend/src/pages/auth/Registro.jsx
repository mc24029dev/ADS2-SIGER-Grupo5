import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  Eye,
  EyeOff,
  LoaderCircle,
  Lock,
  Mail,
  TriangleAlert,
  User,
  UserPlus,
} from "lucide-react"
import CampoConIcono from "../../components/ui/CampoConIcono"
import useAuth from "../../hooks/useAuth"
import { registrarParticipante } from "../../api/auth"
import { rutaInicio } from "../../utils/roles"

// Nivel de seguridad: 0 = vacía, 1 = corta, 2 = media, 3 = robusta.
function nivelDeSeguridad(valor) {
  if (!valor) return 0
  if (valor.length < 8) return 1
  if (!/[A-Z]/.test(valor) || !/[0-9]/.test(valor)) return 2
  return 3
}

const FUERZA = {
  0: { texto: "Mínimo 8 caracteres", textoClase: "text-tertiary", barra: "" },
  1: { texto: "Demasiado corta", textoClase: "text-error", barra: "bg-error" },
  2: { texto: "Seguridad media", textoClase: "text-secondary-container", barra: "bg-secondary-container" },
  3: { texto: "Contraseña robusta", textoClase: "text-primary", barra: "bg-primary" },
}

function mensajeDeError(err) {
  if (err.sinConexion) return "No se pudo conectar con el servidor. Intenta de nuevo."
  return err.message
}

export default function Registro() {

  const { login } = useAuth()
  const navigate = useNavigate()

  const [contrasena, setContrasena] = useState("")
  const [verContrasena, setVerContrasena] = useState(false)
  
  const [conflicto, setConflicto] = useState(false)
  const [error, setError] = useState("")
  const [cargando, setCargando] = useState(false)

  const nivel = nivelDeSeguridad(contrasena)
  const fuerza = FUERZA[nivel]

  const limpiarAvisos = () => {
    setConflicto(false)
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (cargando) return
    limpiarAvisos()

    const form = new FormData(e.currentTarget)
    const nombres = form.get("nombres").trim()
    const apellidos = form.get("apellidos").trim()
    const email = form.get("correo").trim()

    if (!nombres || !apellidos) {
      setError("Los nombres y apellidos no pueden estar vacíos.")
      return
    }

    setCargando(true)
    
    try {
      await registrarParticipante({ nombres, apellidos, email, contrasena })
    } catch (err) {
      if (err.status === 409) setConflicto(true)
      else setError(mensajeDeError(err))
      setCargando(false)
      return
    }

    // Cuenta creada: inicia sesión con las mismas credenciales.
    try {
      const perfil = await login(email, contrasena)
      navigate(rutaInicio(perfil.rol), { replace: true })
    } catch {
      navigate("/login", { replace: true })
    }
  }

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-margin-mobile sm:p-margin bg-surface-container-low">
      <div className="relative w-full max-w-[480px] bg-surface-container-lowest rounded-2xl shadow-xl shadow-slate-900/5 p-8 sm:p-10 overflow-hidden">
        {/* Franja decorativa superior */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary-container to-secondary" />

        {/* Enlace de regreso */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/login"
            className="group inline-flex items-center gap-1.5 text-label-md text-tertiary hover:text-on-surface transition-colors"
          >
            <ArrowLeft
              size={18}
              aria-hidden="true"
              className="transition-all group-hover:-translate-x-0.5 group-hover:text-primary"
            />
            <span>Volver al inicio de sesión</span>
          </Link>
          <span className="text-label-caps tracking-widest text-outline uppercase">SIGER V2.4</span>
        </div>

        {/* Encabezado */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-md shadow-primary/20 shrink-0">
            <CalendarCheck size={26} aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-headline-md text-on-surface">Crear cuenta de Participante</h1>
            <p className="text-body-md text-on-surface-variant mt-0.5">
              Completa tus datos para registrarte en el sistema
            </p>
          </div>
        </div>

        {/* Banner de conflicto */}
        {conflicto && (
          <div
            role="alert"
            className="mb-5 bg-error-container/30 border-l-4 border-error p-3.5 rounded-r-lg flex items-start gap-2.5"
          >
            <TriangleAlert size={20} aria-hidden="true" className="text-error shrink-0 mt-0.5" />
            <div className="text-body-sm text-on-surface">
              <span className="font-medium text-error">Conflicto de registro:</span> Ya existe una
              cuenta con ese correo.
              <Link
                to="/login"
                className="font-medium text-primary hover:underline ml-1 inline-flex items-center gap-0.5"
              >
                ¿Deseas iniciar sesión?
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mb-5 p-3 rounded-r-md rounded-l bg-error-container border-l-4 border-error text-on-error-container text-[13px] flex items-center gap-2 shadow-sm"
          >
            <TriangleAlert size={18} aria-hidden="true" className="shrink-0 text-error" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} onChange={limpiarAvisos} className="space-y-4">
          {/* Nombres y apellidos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <CampoConIcono
              id="nombres"
              etiqueta="Nombres"
              icono={User}
              type="text"
              name="nombres"
              autoComplete="given-name"
              placeholder="Ej. Juan Carlos"
              maxLength={100}
              required
            />
            <CampoConIcono
              id="apellidos"
              etiqueta="Apellidos"
              icono={User}
              type="text"
              name="apellidos"
              autoComplete="family-name"
              placeholder="Ej. Pérez López"
              maxLength={100}
              required
            />
          </div>

          {/* Correo */}
          <CampoConIcono
            id="correo"
            etiqueta="Correo electrónico"
            icono={Mail}
            type="email"
            name="correo"
            autoComplete="email"
            placeholder="usuario@correo.com"
            maxLength={100}
            required
          />

          {/* Contraseña */}
          <div className="flex flex-col">
            <CampoConIcono
              id="contrasena"
              etiqueta="Contraseña"
              icono={Lock}
              type={verContrasena ? "text" : "password"}
              name="contrasena"
              autoComplete="new-password"
              placeholder="••••••••••••"
              minLength={8}
              maxLength={72}
              required
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
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

            {/* Barra de seguridad */}
            <div className="w-full h-1 rounded-full overflow-hidden mt-2 flex gap-1 bg-surface-container">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className={`h-full w-1/3 transition-all duration-300 ${
                    nivel >= n ? fuerza.barra : "bg-transparent"
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center justify-between pt-1">
              <p className="text-body-sm text-tertiary">Debe tener entre 8 y 72 caracteres.</p>
              <span className={`text-label-sm ${fuerza.textoClase}`}>{fuerza.texto}</span>
            </div>
          </div>

          {/* Términos */}
          <label className="flex items-start gap-2.5 cursor-pointer group pt-1">
            <input
              type="checkbox"
              id="terminos"
              required
              className="mt-1 w-4 h-4 rounded cursor-pointer accent-primary"
            />
            <span className="text-body-sm text-on-surface-variant group-hover:text-on-surface transition-colors select-none">
              Acepto las políticas de privacidad y los términos de uso de la plataforma
              institucional SIGER.
            </span>
          </label>

          {/* Botón */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={cargando}
              className="w-full h-12 cursor-pointer bg-primary hover:bg-secondary active:scale-[0.99] text-on-primary text-label-md rounded-lg shadow-md shadow-primary/25 flex items-center justify-center gap-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:opacity-90 disabled:cursor-not-allowed"
            >
              {cargando ? (
                <LoaderCircle size={20} aria-hidden="true" className="animate-spin" />
              ) : (
                <UserPlus size={20} aria-hidden="true" />
              )}
              <span>{cargando ? "Registrando..." : "Registrarse"}</span>

            </button>
          </div>
        </form>

        {/* Pie */}
        <div className="mt-8 text-center">
          <p className="text-body-md text-on-surface-variant">
            ¿Ya tienes una cuenta?{" "}
            <Link to="/login" className="text-label-md text-primary hover:text-secondary transition-colors">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
