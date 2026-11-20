import { useState, useEffect } from "react";
import { Search, Loader2, Edit2, Power, UserPlus } from "lucide-react";
import api from "../../api/client";
import useAuth from "../../hooks/useAuth";
import ModalEditarUsuario from "../../components/ui/ModalEditarUsuario";

export default function GestionUsuarios() {
  const { usuario: usuarioLogueado } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState("TODOS");
  const [procesandoId, setProcesandoId] = useState(null);
  const [usuarioAEditar, setUsuarioAEditar] = useState(null);

  const cargarUsuarios = async () => {
    try {
      setCargando(true);
      const res = await api.get("/usuarios");
      setUsuarios(res.data);
    } catch (error) {
      console.error("Error al cargar usuarios", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const handleToggleEstado = async (id, estadoActual) => {
    const accion = estadoActual ? "desactivar" : "activar";
  
    if (!window.confirm(`¿Estás seguro de ${accion} a este usuario?`)) return;

    try {
      setProcesandoId(id);
      await api.patch(`/usuarios/${id}/estado`, { estado: !estadoActual });
      setUsuarios(usuarios.map(u => u.idUsuario === id ? { ...u, estado: !estadoActual } : u));
    } catch (error) {
      alert(error.message || "No se pudo cambiar el estado del usuario.");
    } finally {
      setProcesandoId(null);
    }
  };

  const usuariosFiltrados = usuarios.filter(u => {
    const coincideBusqueda = 
      u.nombres.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.apellidos.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.email.toLowerCase().includes(busqueda.toLowerCase());
    
    const coincideRol = filtroRol === "TODOS" || u.rol === filtroRol;
    
    return coincideBusqueda && coincideRol;
  });

  const getRolColor = (rol) => {
    if (rol === "ADMINISTRADOR") return "bg-purple-100 text-purple-700";
    if (rol === "ORGANIZADOR") return "bg-blue-100 text-blue-700";
    return "bg-gray-100 text-gray-700";
  };

  if (cargando) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#3B82F6]" size={40}/></div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
    
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <p className="text-[#3B82F6] text-xs font-bold tracking-widest uppercase mb-1">Panel de Administración</p>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="text-gray-500 text-sm mt-1">Administración de cuentas, asignación de roles y control de accesos.</p>
        </div>
        <button className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm cursor-pointer">
          <UserPlus size={18} /> Agregar nuevo usuario
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por nombre o correo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            />
          </div>
          
          <select
            value={filtroRol}
            onChange={(e) => setFiltroRol(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] text-sm font-medium text-gray-700 cursor-pointer"
          >
            <option value="TODOS">Todos los roles</option>
            <option value="ADMINISTRADOR">Administradores</option>
            <option value="ORGANIZADOR">Organizadores</option>
            <option value="PARTICIPANTE">Participantes</option>
          </select>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">Usuario</th>
              <th className="px-6 py-4 font-semibold">Rol</th>
              <th className="px-6 py-4 font-semibold">Estado</th>
              <th className="px-6 py-4 font-semibold text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {usuariosFiltrados.map((user) => {
              const esOtroAdmin = user.rol === "ADMINISTRADOR" && user.idUsuario !== usuarioLogueado.idUsuario;
              const noTienePermisos = user.rol === "ADMINISTRADOR"; 

              return (
                <tr key={user.idUsuario} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#3B82F6] flex items-center justify-center text-white font-bold text-sm uppercase">
                        {user.nombres.charAt(0)}{user.apellidos.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{user.nombres} {user.apellidos}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getRolColor(user.rol)}`}>
                      {user.rol}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1.5 text-sm font-medium ${user.estado ? 'text-green-600' : 'text-red-600'}`}>
                      <span className={`w-2 h-2 rounded-full ${user.estado ? 'bg-green-600' : 'bg-red-600'}`}></span>
                      {user.estado ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => setUsuarioAEditar(user)}
                        disabled={noTienePermisos}
                        className={`p-2 rounded-lg transition-colors ${
                          noTienePermisos ? "text-gray-200 cursor-not-allowed" : "text-gray-400 hover:text-[#3B82F6] hover:bg-blue-50 cursor-pointer"
                        }`}
                        title={noTienePermisos ? "No puedes editar a un Administrador" : "Editar usuario"}
                      >
                        <Edit2 size={18} />
                      </button>
                      
                      <button 
                        onClick={() => handleToggleEstado(user.idUsuario, user.estado)}
                        disabled={noTienePermisos || procesandoId === user.idUsuario}
                        className={`p-2 rounded-lg transition-colors ${
                          noTienePermisos 
                            ? "text-gray-200 cursor-not-allowed" 
                            : user.estado 
                              ? "text-gray-400 hover:text-red-600 hover:bg-red-50 cursor-pointer" 
                              : "text-gray-400 hover:text-green-600 hover:bg-green-50 cursor-pointer"
                        }`}
                        title={noTienePermisos ? "No puedes desactivar a un Administrador" : user.estado ? "Desactivar cuenta" : "Activar cuenta"}
                      >
                        {procesandoId === user.idUsuario ? <Loader2 size={18} className="animate-spin" /> : <Power size={18} />}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {usuarioAEditar && (
        <ModalEditarUsuario 
          usuario={usuarioAEditar} 
          onClose={() => setUsuarioAEditar(null)}
          onSuccess={() => {
            setUsuarioAEditar(null);
            cargarUsuarios();
          }}
        />
      )}
    </div>
  );
}