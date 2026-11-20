import { Download, XCircle } from "lucide-react";

export default function MisReservaciones() {
    
  const reservaciones = [
    { id: 1, codigo: "RES-9824", evento: "Congreso de Ciberseguridad 2026", fecha: "15 Nov 2026", estado: "Confirmada" },
    { id: 2, codigo: "RES-7811", evento: "Taller de Innovación y Negocios", fecha: "22 Nov 2026", estado: "En Espera" },
    { id: 3, codigo: "RES-5510", evento: "Seminario de Cloud Computing", fecha: "10 Oct 2026", estado: "Finalizado" },
    { id: 4, codigo: "RES-4109", evento: "Encuentro de Liderazgo Femenino en Tech", fecha: "05 Sep 2026", estado: "Finalizado" },
  ];

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "Confirmada": return "text-green-600 bg-green-50";
      case "En Espera": return "text-orange-600 bg-orange-50";
      case "Cancelada": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-[#3B82F6] text-xs font-bold tracking-widest uppercase mb-1">Panel de Usuario</p>
          <h1 className="text-2xl font-bold text-gray-900">Historial de Reservaciones</h1>
          <p className="text-gray-500 text-sm mt-1">Consulta el estado de tus comprobantes y administra tus cupos activos.</p>
        </div>
        <p className="text-sm text-gray-500 font-medium">Total registradas: {reservaciones.length}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">Código</th>
              <th className="px-6 py-4 font-semibold">Evento</th>
              <th className="px-6 py-4 font-semibold">Fecha</th>
              <th className="px-6 py-4 font-semibold">Estado</th>
              <th className="px-6 py-4 font-semibold text-center">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {reservaciones.map((res) => (
              <tr key={res.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-bold text-[#3B82F6]">{res.codigo}</td>
                <td className="px-6 py-4 font-medium text-gray-900">{res.evento}</td>
                <td className="px-6 py-4 text-gray-600">{res.fecha}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getEstadoColor(res.estado)}`}>
                    {res.estado}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  {res.estado === "Confirmada" || res.estado === "En Espera" ? (
                    <div className="flex justify-center gap-2">
                      <button className="p-2 text-gray-400 hover:text-[#3B82F6] hover:bg-blue-50 rounded-lg transition-colors" title="Descargar Comprobante">
                        <Download size={18} />
                      </button>
                      <button className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-1">
                        <XCircle size={14} /> Cancelar
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">No disponible</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}