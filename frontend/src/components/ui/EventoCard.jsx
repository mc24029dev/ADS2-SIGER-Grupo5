import { Calendar, MapPin, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EventoCard({ titulo, fecha, lugar, cupos, estado, esPublico = false, onReservar, yaInscrito = false }) {
  const navigate = useNavigate();
  
  const fechaObj = new Date(fecha);
  const fechaMostrar = fechaObj.toLocaleDateString('es-ES', { 
    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' 
  });

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const fechaEventoDate = new Date(fecha);
  fechaEventoDate.setHours(0, 0, 0, 0);
  
  const esFechaValida = fechaEventoDate > hoy;

  const estaActivoYVigente = estado === "Activo" && esFechaValida;
  const hayCupos = cupos > 0;
  const puedeReservar = estaActivoYVigente && hayCupos && !yaInscrito;

  const handleClick = () => {
    if (esPublico) {
      navigate("/login"); 
    } else if (onReservar) {
      onReservar(); 
    }
  };

  const getBadgeColor = () => {
    if (!hayCupos) return "bg-red-50 text-red-600";
    if (cupos <= 10) return "bg-orange-50 text-orange-600";
    return "bg-green-50 text-green-600";
  };

  let buttonText = "No disponible";
  let buttonClass = "bg-gray-100 text-gray-400 cursor-not-allowed";

  if (estaActivoYVigente && yaInscrito) {
    buttonText = "Ya estás inscrito";
    buttonClass = "bg-blue-50 text-[#2563EB] border border-blue-200 cursor-default";
  } else if (puedeReservar) {
    buttonText = esPublico ? "Iniciar Sesión para Reservar" : "Ver detalles / Reservar";
    buttonClass = "bg-[#3B82F6] hover:bg-[#2563EB] text-white cursor-pointer";
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <span className={`text-xs font-bold uppercase tracking-wider ${
          estaActivoYVigente ? "text-[#3B82F6]" : "text-gray-500"
        }`}>
          {estado}
        </span>
        <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md ${getBadgeColor()}`}>
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
          <span className="truncate">{fechaMostrar}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <MapPin size={16} className="text-gray-400 shrink-0" />
          <span className="truncate">{lugar}</span>
        </div>
      </div>

      <button 
        type="button"
        disabled={!puedeReservar && !(estaActivoYVigente && yaInscrito)}
        onClick={handleClick}
        className={`w-full font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 ${buttonClass}`}
      >
        {buttonText}
      </button>
    </div>
  );
}