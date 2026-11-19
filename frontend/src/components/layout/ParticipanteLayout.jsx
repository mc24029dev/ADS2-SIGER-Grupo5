import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Calendar, Ticket, LogOut, Bell, Compass } from "lucide-react";

export default function ParticipanteLayout() {
  const navigate = useNavigate();

  // Datos falsos por ahora (luego vendrán del contexto de Auth)
  const usuario = { nombres: "Sofía", apellidos: "Henríquez", rol: "PARTICIPANTE" };

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between md:flex">
        <div>
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-gray-100">
            <div className="bg-[#3B82F6] p-1.5 rounded-lg text-white mr-3">
              <Calendar size={20} />
            </div>
            <span className="font-bold text-xl text-gray-800">SIGER</span>
            <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
              Part.
            </span>
          </div>

          {/* Navegación */}
          <nav className="p-4 space-y-1">
            <NavLink
              to="/eventos"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-50 text-[#2563EB] font-semibold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              <Compass size={20} />
              Explorar Eventos
            </NavLink>
            <NavLink
              to="/mis-reservaciones"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-50 text-[#2563EB] font-semibold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              <Ticket size={20} />
              Mis Reservaciones
            </NavLink>
          </nav>
        </div>

        {/* Cerrar Sesión */}
        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={() => navigate("/login")}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={20} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TOPBAR */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Rol: Participante</span>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="text-gray-400 hover:text-gray-600 relative">
              <Bell size={22} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 border-l border-gray-200 pl-6">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-800">{usuario.nombres} {usuario.apellidos}</p>
                <p className="text-xs text-gray-500">sofia.henriquez@correo.com</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#3B82F6] flex items-center justify-center text-white font-bold">
                SH
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}