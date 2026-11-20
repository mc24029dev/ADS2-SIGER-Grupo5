import { useState, useEffect } from "react";
import { Download, XCircle, Loader2, AlertCircle } from "lucide-react";
import api from "../../api/client";

export default function MisReservaciones() {
  const [reservaciones, setReservaciones] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarMisReservaciones = async () => {
    try {
      setCargando(true);
      const res = await api.get("/reservaciones/mis-reservaciones");
      setReservaciones(res.data);
    } catch (error) {
      console.error("Error al cargar", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarMisReservaciones();
  }, []);

  const handleCancelar = async (id) => {
    if (!window.confirm("¿Estás seguro de cancelar esta reservación? El cupo será liberado.")) return;
    
    try {
      await api.patch(`/reservaciones/${id}/cancelar`);
      alert("Reservación cancelada con éxito. (Revisa tu correo de Mailtrap)");
      cargarMisReservaciones(); 
    } catch (error) {
      alert(error.message || "Error al cancelar");
    }
  };

  const descargarComprobante = async (idReservacion) => {
    try {
      const response = await api.get(`/reservaciones/${idReservacion}/comprobante`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `comprobante-${idReservacion}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert("Solo puedes descargar comprobantes confirmados y activos.");
    }
  };

  const formatearFechaSoloDia = (fechaString) => {
    if (!fechaString) return "-";
    return new Date(fechaString).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "Confirmada": return "text-green-600 bg-green-50";
      case "Pendiente": return "text-orange-600 bg-orange-50";
      case "Cancelada": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  if (cargando) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#3B82F6]" size={40}/></div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <p className="text-[#3B82F6] text-xs font-bold tracking-widest uppercase mb-1">Panel de Usuario</p>
        <h1 className="text-2xl font-bold text-gray-900">Historial de Reservaciones</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {reservaciones.length === 0 ? (
          <div className="p-10 text-center text-gray-500 flex flex-col items-center">
            <AlertCircle size={40} className="text-gray-300 mb-4" />
            Aún no tienes reservaciones registradas.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase">
                <th className="px-6 py-4 font-semibold">Código</th>
                <th className="px-6 py-4 font-semibold">Evento</th>
                <th className="px-6 py-4 font-semibold">Fecha de Reservación</th>
                <th className="px-6 py-4 font-semibold">Fecha del Evento</th>
                <th className="px-6 py-4 font-semibold">Estado</th>
                <th className="px-6 py-4 font-semibold text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {reservaciones.map((res) => {
                const hoy = new Date();
                hoy.setHours(0, 0, 0, 0);
                const fechaEvt = new Date(res.fechaEvento);
                fechaEvt.setHours(0, 0, 0, 0);
                
                const esHoyOPasado = fechaEvt <= hoy;

                return (
                  <tr key={res.idReservacion} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-bold text-[#3B82F6]">{res.codigoReservacion}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{res.nombreEvento}</td>
                    <td className="px-6 py-4 text-gray-600">{formatearFechaSoloDia(res.fechaReservacion)}</td>
                    <td className="px-6 py-4 text-gray-600">{formatearFechaSoloDia(res.fechaEvento)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getEstadoColor(res.estado)}`}>
                        {res.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {esHoyOPasado ? (
                        <span className="text-xs font-medium text-gray-400 bg-gray-100 px-3 py-1.5 rounded-lg">
                          Finalizado
                        </span>
                      ) : res.estado === "Confirmada" ? (
                        <div className="flex justify-center gap-2">
                          <button 
                            onClick={() => descargarComprobante(res.idReservacion)} 
                            className="p-2 text-gray-500 hover:text-[#3B82F6] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer" 
                            title="Descargar PDF"
                          >
                            <Download size={18} />
                          </button>
                          <button 
                            onClick={() => handleCancelar(res.idReservacion)} 
                            className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <XCircle size={14} /> Cancelar
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">Sin acciones</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}