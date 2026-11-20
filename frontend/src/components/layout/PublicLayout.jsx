import { Link, Outlet } from "react-router-dom";
import { Calendar, Lock } from "lucide-react";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-gray-800 font-sans flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-[#3B82F6] p-1.5 rounded-lg text-white">
              <Calendar size={22} />
            </div>
            <span className="font-bold text-2xl text-gray-900">SIGER</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <Link to="/" className="hover:text-[#2563EB] transition-colors">Inicio</Link>
            <Link to="/eventos" className="hover:text-[#2563EB] transition-colors">Eventos</Link>
            <Link to="/acerca" className="hover:text-[#2563EB] transition-colors">Nosotros</Link>
            <Link to="/contacto" className="hover:text-[#2563EB] transition-colors">Contacto</Link>
          </nav>

          <Link 
            to="/login" 
            className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Lock size={16} />
            Iniciar Sesión
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-gray-200 py-8 text-center text-sm text-gray-500">
        <p>© 2026 SIGER — Sistema Inteligente de Gestión de Eventos y Reservaciones</p>
        <p className="mt-1">Universidad de El Salvador - Facultad Multidisciplinaria de Occidente</p>
      </footer>
    </div>
  );
}