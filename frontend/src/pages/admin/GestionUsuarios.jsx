import { Search, MoreVertical } from "lucide-react";

export default function GestionUsuarios() {
  const usuarios = [
    { id: 1, nombres: "Carlos Alberto", apellidos: "Mejía Rivas", email: "carlos.mejia@siger.edu.sv", rol: "ADMINISTRADOR", estado: true },
    { id: 3, nombres: "Roberto José", apellidos: "Martínez Cruz", email: "roberto.martinez@siger.edu.sv", rol: "ORGANIZADOR", estado: true },
    { id: 6, nombres: "Daniela Michelle", apellidos: "Flores Castillo", email: "daniela.flores@siger.edu.sv", rol: "PARTICIPANTE", estado: true },
    { id: 12, nombres: "Gabriela Nicole", apellidos: "Rivera Quintanilla", email: "gabriela.rivera@siger.edu.sv", rol: "PARTICIPANTE", estado: false },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="text-gray-500 text-sm mt-1">Administra los accesos y roles del sistema.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Buscador */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar usuario por nombre o correo..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            />
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white border-b border-gray-200 text-sm text-gray-500">
              <th className="px-6 py-4 font-medium">Usuario</th>
              <th className="px-6 py-4 font-medium">Rol</th>
              <th className="px-6 py-4 font-medium">Estado</th>
              <th className="px-6 py-4 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {usuarios.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-semibold text-gray-900">{user.nombres} {user.apellidos}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    user.rol === 'ADMINISTRADOR' ? 'bg-purple-100 text-purple-700' :
                    user.rol === 'ORGANIZADOR' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {user.rol}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`flex items-center gap-1.5 text-sm font-medium ${user.estado ? 'text-green-600' : 'text-red-600'}`}>
                    <span className={`w-2 h-2 rounded-full ${user.estado ? 'bg-green-600' : 'bg-red-600'}`}></span>
                    {user.estado ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-gray-400 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100">
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}