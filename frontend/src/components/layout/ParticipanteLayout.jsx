import { Outlet, NavLink, Link, useNavigate } from "react-router-dom";
import { Calendar, Ticket, LogOut, Compass, User } from "lucide-react";
import useAuth from "../../hooks/useAuth"; 

export default function ParticipanteLayout() {
  const navigate = useNavigate();
  const { usuario, logout } = useAuth(); 

  if (!usuario) return null; 

  const iniciales = `${usuario.nombres?.charAt(0) || ""}${usuario.apellidos?.charAt(0) || ""}`;

  const handleLogout = () => {
    logout(); 
    navigate("/login"); 
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans">

      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between md:flex">
        <div>
          <Link to="/" className="h-16 flex items-center px-6 border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <div className="bg-[#3B82F6] p-1.5 rounded-lg text-white mr-3">
              <Calendar size={20} />
            </div>
            <span className="font-bold text-xl text-gray-800">SIGER</span>
            <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
              Part.
            </span>
          </Link>

          <nav className="p-4 space-y-1 mt-2">
            <NavLink
              to="/participante/eventos"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? "bg-blue-50 text-[#2563EB] font-semibold" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              <Compass size={20} />
              Explorar Eventos
            </NavLink>
            <NavLink
              to="/participante/mis-reservaciones"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? "bg-blue-50 text-[#2563EB] font-semibold" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              <Ticket size={20} />
              Mis Reservaciones
            </NavLink>

            <NavLink
              to="/participante/perfil"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? "bg-blue-50 text-[#2563EB] font-semibold" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              <User size={20} />
              Mi Perfil
          </NavLink>
          </nav>
        </div>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors font-medium"
          >
            <LogOut size={20} />
            Cerrar Sesión
          </button>
        </div>
      </aside>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between p-10">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Rol: {usuario.rol}</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 border-l border-gray-200 pl-6">
              <div className="text-right hidden sm:block">
                <p className="text-lg font-semibold text-gray-800">{usuario.nombres} {usuario.apellidos}</p>
                <p className="text-sm text-gray-500">{usuario.email}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#3B82F6] flex items-center justify-center text-white font-bold uppercase">
                {iniciales}
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