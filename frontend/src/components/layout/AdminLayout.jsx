import { Outlet, NavLink, Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Calendar, FileText, LogOut, Shield, ClipboardList, User } from "lucide-react";
import useAuth from "../../hooks/useAuth";

export default function AdminLayout() {
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();

  if (!usuario) return null;

  const iniciales = `${usuario.nombres?.charAt(0) || ""}${usuario.apellidos?.charAt(0) || ""}`;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { path: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
    { path: "/admin/usuarios", icon: Users, label: "Usuarios" },
    { path: "/admin/eventos", icon: Calendar, label: "Eventos" },
    { path: "/admin/asistencias", icon: ClipboardList, label: "Asistencias" },
    { path: "/admin/reportes", icon: FileText, label: "Reportes" },
    { path: "/admin/perfil", icon: User, label: "Mi Perfil" },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans">
      <aside className="w-64 bg-[#111827] text-gray-300 flex flex-col justify-between md:flex">
        <div>
          <Link to="/" className="h-16 flex items-center px-6 border-b border-gray-700 hover:bg-gray-800 transition-colors">
            <div className="bg-[#3B82F6] p-1.5 rounded-lg text-white mr-3">
              <Shield size={20} />
            </div>
            <span className="font-bold text-xl text-white">SIGER</span>
            <span className="ml-2 text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full font-semibold">
              Admin
            </span>
          </Link>

          <nav className="p-4 space-y-1 mt-4">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive ? "bg-[#3B82F6] text-white font-semibold" : "hover:bg-gray-800 hover:text-white"
                  }`
                }
              >
                <item.icon size={20} />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors cursor-pointer"
          >
            <LogOut size={20} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between p-10">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Panel de Administración</span>
          </div>
          
          <div className="flex items-center gap-4 border-l border-gray-200 pl-6">
            <div className="text-right hidden sm:block">
              <p className="text-lg font-semibold text-gray-800">{usuario.nombres} {usuario.apellidos}</p>
              <p className="text-sm text-gray-500">{usuario.email}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#111827] flex items-center justify-center text-white font-bold uppercase">
              {iniciales}
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