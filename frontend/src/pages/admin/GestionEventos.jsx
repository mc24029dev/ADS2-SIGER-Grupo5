import { Search, MoreVertical, Plus } from "lucide-react";

export default function GestionEventos() {
  const eventos = [
    { id: 1, nombre: "Congreso de Ingeniería de Software 2026", fecha: "2026-11-20", lugar: "Auditorio Central", cupo: 149, estado: "Activo" },
    { id: 2, nombre: "Taller de Bases de Datos", fecha: "2026-11-12", lugar: "Laboratorio 3", cupo: 23, estado: "Activo" },
    { id: 3, nombre: "Feria de Emprendimiento", fecha: "2026-12-03", lugar: "Aula Magna", cupo: 200, estado: "Cancelado" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Eventos</h1>
          <p className="text-gray-500 text-sm mt-1">Supervisa todos los eventos del sistema.</p>
        </div>
        <button className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
          <Plus size={18} /> Nuevo Evento
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar evento..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            />
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white border-b border-gray-200 text-sm text-gray-500">
              <th className="px-6 py-4 font-medium">Evento</th>
              <th className="px-6 py-4 font-medium">Fecha</th>
              <th className="px-6 py-4 font-medium">Lugar</th>
              <th className="px-6 py-4 font-medium">Cupos</th>
              <th className="px-6 py-4 font-medium">Estado</th>
              <th className="px-6 py-4 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {eventos.map((ev) => (
              <tr key={ev.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-semibold text-gray-900">{ev.nombre}</td>
                <td className="px-6 py-4 text-gray-600">{ev.fecha}</td>
                <td className="px-6 py-4 text-gray-600">{ev.lugar}</td>
                <td className="px-6 py-4 text-gray-600">{ev.cupo}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    ev.estado === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {ev.estado}
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