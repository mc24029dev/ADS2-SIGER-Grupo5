import { useState, useEffect } from "react";
import { Search, Loader2, CheckCircle, Download } from "lucide-react";
import EventoCard from "../../components/ui/EventoCard";
import ModalReserva from "../../components/ui/ModalReserva";
import api from "../../api/client";
import useAuth from "../../hooks/useAuth";

export default function CatalogoEventos() {
  const { usuario } = useAuth();
  const [eventos, setEventos] = useState([]);
  const [misReservas, setMisReservas] = useState([]); 
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [reservaExitosa, setReservaExitosa] = useState(null);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      const [resEventos, resReservas] = await Promise.all([
        api.get("/eventos"),
        api.get("/reservaciones/mis-reservaciones")
      ]);
      setEventos(resEventos.data);
      setMisReservas(resReservas.data);
    } catch (err) {
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleReservaExitosa = (reserva) => {
    setEventoSeleccionado(null);
    setReservaExitosa(reserva);
    cargarDatos();
  };

  const descargarComprobante = async (idReservacion) => {
    try {
      const response = await api.get(`/reservaciones/${idReservacion}/comprobante`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `comprobante-${idReservacion}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert("Error al descargar el comprobante.");
    }
  };

  const eventosFiltrados = eventos.filter((evento) => 
    evento.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    evento.lugar.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Eventos Disponibles</h1>
          <p className="text-gray-500 text-sm mt-1">Explora las actividades programadas y reserva tus accesos oficiales.</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por título o lugar..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          />
        </div>
      </div>

      {cargando && (
        <div className="flex flex-col items-center justify-center py-20 text-[#3B82F6]">
          <Loader2 className="animate-spin mb-4" size={40} />
          <p className="text-gray-500 font-medium">Cargando catálogo...</p>
        </div>
      )}

      {!cargando && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventosFiltrados.map((evento) => {
            const yaInscrito = misReservas.some(
              r => r.idEvento === evento.idEvento && r.estado !== "Cancelada"
            );

            return (
              <EventoCard 
                key={evento.idEvento} 
                titulo={evento.nombre}
                fecha={evento.fecha}
                lugar={`${evento.lugar} - ${evento.sede}`}
                cupos={evento.cupoDisponible}
                estado={evento.estado}
                esPublico={false}
                yaInscrito={yaInscrito}
                onReservar={() => setEventoSeleccionado(evento)}
              />
            );
          })}
        </div>
      )}

      {eventoSeleccionado && (
        <ModalReserva 
          evento={eventoSeleccionado} 
          idParticipante={usuario.idUsuario}
          onClose={() => setEventoSeleccionado(null)}
          onSuccess={handleReservaExitosa}
        />
      )}

      {reservaExitosa && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
         <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center">
           <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
           <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Reserva Exitosa!</h2>
           <p className="text-gray-500 mb-6">Tu código de reservación es:</p>
           <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-8">
             <span className="font-mono text-xl font-bold text-[#2563EB]">{reservaExitosa.codigoReservacion}</span>
           </div>
           
           <div className="space-y-3">
             <button 
               onClick={() => descargarComprobante(reservaExitosa.idReservacion)}
               className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white py-3 rounded-lg font-medium flex justify-center items-center gap-2 cursor-pointer"
             >
               <Download size={20} /> Descargar Comprobante (PDF)
             </button>
             <button 
               onClick={() => setReservaExitosa(null)}
               className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium cursor-pointer"
             >
               Volver al Catálogo
             </button>
           </div>
         </div>
       </div>
      )}
    </div>
  );
}