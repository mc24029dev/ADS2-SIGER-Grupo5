import { X, Calendar, MapPin, CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import api from "../../api/client";

export default function ModalReserva({ evento, idParticipante, onClose, onSuccess }) {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const handleReservar = async () => {
    try {
      setCargando(true);
      setError(null);
      
      const res = await api.post("/reservaciones", {
        idEvento: evento.idEvento,
        idParticipante: idParticipante
      });

      onSuccess(res.data); 
    } catch (err) {
      setError(err.message || "Ocurrió un error al reservar.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
        
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Confirmar Reservación</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors cursor-pointer">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <h3 className="font-bold text-lg text-[#2563EB] mb-4">{evento.nombre}</h3>
          
          <div className="space-y-3 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <p className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar size={18} className="text-gray-400" />
              {new Date(evento.fecha).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin size={18} className="text-gray-400" />
              {evento.lugar} - {evento.sede}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center">
              {error}
            </div>
          )}

          <p className="text-sm text-gray-500 text-center mb-6">
            Al confirmar, se te enviará un correo electrónico con los detalles de tu reservación.
          </p>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg font-medium text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button 
            onClick={handleReservar}
            disabled={cargando}
            className="flex-1 bg-[#3B82F6] hover:bg-[#2563EB] text-white py-2.5 rounded-lg font-medium transition-colors flex justify-center items-center gap-2 cursor-pointer"
          >
            {cargando ? <Loader2 className="animate-spin" size={20}/> : "Confirmar Reserva"}
          </button>
        </div>

      </div>
    </div>
  );
}