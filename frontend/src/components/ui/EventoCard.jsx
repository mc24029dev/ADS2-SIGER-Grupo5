import { Calendar, MapPin, Users } from "lucide-react";

export default function EventoCard({ titulo, fecha, lugar, cupos, estado }) {
  // Lógica para saber si está disponible
  const estaActivo = estado === "Activo";
  const hayCupos = cupos > 0;
  const puedeReservar = estaActivo && hayCupos;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">

        <span className={`text-xs font-bold uppercase tracking-wider ${
          estado === "Activo" ? "text-[#3B82F6]" : 
          estado === "Cancelado" ? "text-red-500" : "text-gray-500"
        }`}>
          {estado}
        </span>

        <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md ${
          !hayCupos ? "bg-red-50 text-red-600" : 
          cupos <= 10 ? "bg-orange-50 text-orange-600" : 
          "bg-green-50 text-green-600"
        }`}>
          <Users size={14} />
          {!hayCupos ? "Agotado" : `${cupos} Cupos`}
        </span>
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-4 line-clamp-2 leading-tight">
        {titulo}
      </h3>

      <div className="mt-auto space-y-2 mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar size={16} className="text-gray-400 shrink-0" />
          <span className="truncate">{fecha}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <MapPin size={16} className="text-gray-400 shrink-0" />
          <span className="truncate">{lugar}</span>
        </div>
      </div>

      <button 
        disabled={!puedeReservar}
        className={`w-full font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 ${
          puedeReservar 
            ? "bg-[#3B82F6] hover:bg-[#2563EB] text-white" 
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
        }`}
      >
        {puedeReservar ? "Ver detalles / Reservar" : "No disponible"}
      </button>
    </div>
  );
}