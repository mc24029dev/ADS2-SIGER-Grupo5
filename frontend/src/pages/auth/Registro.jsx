import { useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  Eye,
  EyeOff,
  Lock,
  Mail,
  TriangleAlert,
  User,
  UserPlus,
} from "lucide-react"
import CampoConIcono from "../../components/ui/CampoConIcono"

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

export default function Registro() {
  const [contrasena, setContrasena] = useState("")
  const [verContrasena, setVerContrasena] = useState(false)
  // TEMPORAL (solo para comparar con Stitch): en la fase 2 inicia en false.
  const [conflicto, setConflicto] = useState(true)

  const nivel = nivelDeSeguridad(contrasena)
  const fuerza = FUERZA[nivel]

  const handleSubmit = (e) => {
    e.preventDefault()
    // Fase 2: validación y llamada a la API.
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

        <form onSubmit={handleSubmit} className="space-y-4">
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
              className="w-full h-12 cursor-pointer bg-primary hover:bg-secondary active:scale-[0.99] text-on-primary text-label-md rounded-lg shadow-md shadow-primary/25 flex items-center justify-center gap-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              <UserPlus size={20} aria-hidden="true" />
              <span>Registrarse</span>
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
