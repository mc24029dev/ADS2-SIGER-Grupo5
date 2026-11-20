import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import EventoCard from "../../components/ui/EventoCard";
import api from "../../api/client";

export default function EventosPublicos() {
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const cargarEventos = async () => {
      try {
        setCargando(true);
        const response = await api.get("/eventos");
        setEventos(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };
    cargarEventos();
  }, []);

  const formatearFecha = (fechaString) => {
    if (!fechaString) return "";
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-ES', { 
      day: '2-digit', month: 'long', year: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    });
  };

  const eventosFiltrados = eventos.filter((evento) => 
    evento.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    evento.lugar.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 space-y-8 bg-[#F8FAFC]">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Catálogo de Eventos</h1>
          <p className="text-gray-500 mt-2">Descubre las actividades que tenemos preparadas para ti.</p>
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

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center border border-red-100">
          {error}
        </div>
      )}

      {!cargando && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventosFiltrados.map((evento) => (
            <EventoCard 
              key={evento.idEvento} 
              titulo={evento.nombre}
              fecha={formatearFecha(evento.fecha)}
              lugar={`${evento.lugar} - ${evento.sede}`}
              cupos={evento.cupoDisponible}
              estado={evento.estado}
              esPublico={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}