import { LoaderCircle } from "lucide-react"

// Se muestra mientras se valida la sesión guardada al abrir o recargar la app.
export default function PantallaCarga() {
  return (
    <main
      role="status"
      aria-live="polite"
      className="min-h-screen w-full flex items-center justify-center bg-surface-container-low"
    >
      <LoaderCircle size={32} aria-hidden="true" className="animate-spin text-primary" />
      <span className="sr-only">Cargando...</span>
    </main>
  )
}