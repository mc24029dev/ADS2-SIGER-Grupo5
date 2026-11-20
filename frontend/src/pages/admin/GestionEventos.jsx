import { useState, useEffect } from "react";
import { Search, Loader2, Edit2, Plus, Lock } from "lucide-react";
import api from "../../api/client";
import ModalEvento from "../../components/ui/ModalEvento";

export default function GestionEventos() {
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("TODOS");
  
  const [modalAbierto, setModalAbierto] = useState(false);
  const [eventoAEditar, setEventoAEditar] = useState(null);

  const cargarEventos = async () => {
    try {
      setCargando(true);
      const res = await api.get("/eventos");
      setEventos(res.data);
    } catch (error) {
      console.error("Error al cargar eventos", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarEventos();
  }, []);

  const handleCambiarEstado = async (id, nuevoEstado) => {
    if (!window.confirm(`¿Estás seguro de cambiar el estado a ${nuevoEstado}?`)) return;
    
    try {
      await api.patch(`/eventos/${id}/estado`, { estado: nuevoEstado });
      cargarEventos();
    } catch (error) {
      alert(error.message || "Error al cambiar estado");
    }
  };

  const eventosFiltrados = eventos.filter(e => {
    const coincideBusqueda = 
      e.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      e.lugar.toLowerCase().includes(busqueda.toLowerCase());
    
    const coincideEstado = filtroEstado === "TODOS" || e.estado === filtroEstado;
    
    return coincideBusqueda && coincideEstado;
  });

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "Activo": return "text-green-600 bg-green-50";
      case "Cancelado": return "text-red-600 bg-red-50";
      case "Finalizado": return "text-gray-600 bg-gray-100";
      case "Reprogramado": return "text-orange-600 bg-orange-50";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const renderAccionesEstado = (evento) => {
    if (evento.estado === "Cancelado" || evento.estado === "Finalizado") {
      return (
        <span className="flex items-center justify-center gap-1 text-xs font-medium text-gray-400 bg-gray-50 py-1.5 px-3 rounded-lg border border-gray-100">
          <Lock size={12} /> Sin acciones
        </span>
      );
    }

    return (
      <select 
        onChange={(e) => {
          const valor = e.target.value;
          if (valor === "Reprogramar") {
            setEventoAEditar(evento);
            setModalAbierto(true);
          } else {
            handleCambiarEstado(evento.idEvento, valor);
          }
          e.target.value = "";
        }}
        value=""
        className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600 cursor-pointer focus:outline-none hover:bg-gray-50 transition-colors w-full max-w-[140px]"
      >
        <option value="" disabled>Acciones...</option>
        
        {evento.estado === "Activo" && (
          <>
            <option value="Reprogramar">Editar Fecha</option>
            <option value="Finalizado">Finalizar</option>
            <option value="Cancelado">Cancelar</option>
          </>
        )}

        {evento.estado === "Reprogramado" && (
          <option value="Cancelado">Cancelar</option>
        )}
      </select>
    );
  };

  if (cargando) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#3B82F6]" size={40}/></div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <p className="text-[#3B82F6] text-xs font-bold tracking-widest uppercase mb-1">Panel de Administración</p>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Eventos</h1>
          <p className="text-gray-500 text-sm mt-1">Supervisa todos los eventos del sistema.</p>
        </div>
        <button 
          onClick={() => { setEventoAEditar(null); setModalAbierto(true); }}
          className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
        >
          <Plus size={18} /> Nuevo Evento
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar evento por nombre o lugar..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            />
          </div>

          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] text-sm font-medium text-gray-700 cursor-pointer"
          >
            <option value="TODOS">Todos los estados</option>
            <option value="Activo">Activos</option>
            <option value="Reprogramado">Reprogramados</option>
            <option value="Finalizado">Finalizados</option>
            <option value="Cancelado">Cancelados</option>
          </select>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold w-1/3">Evento</th>
              <th className="px-6 py-4 font-semibold w-1/6">Fecha</th>
              <th className="px-6 py-4 font-semibold w-1/4">Lugar</th>
              <th className="px-6 py-4 font-semibold text-center">Cupos</th>
              <th className="px-6 py-4 font-semibold">Estado</th>
              <th className="px-6 py-4 font-semibold text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {eventosFiltrados.map((ev) => (
              <tr key={ev.idEvento} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-semibold text-gray-900 leading-tight">{ev.nombre}</td>
                <td className="px-6 py-4 text-gray-600 text-sm whitespace-nowrap">
                  {new Date(ev.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-6 py-4 text-gray-600 text-sm leading-tight">{ev.lugar} - {ev.sede}</td>
                <td className="px-6 py-4 text-gray-600 text-sm text-center whitespace-nowrap">
                  <span className="font-semibold text-[#2563EB]">{ev.cupoDisponible}</span> / {ev.capacidadMaxima}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${getEstadoColor(ev.estado)}`}>
                    {ev.estado}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center items-center gap-3">
                    <button 
                      onClick={() => { setEventoAEditar(ev); setModalAbierto(true); }}
                      className="p-2 text-gray-400 hover:text-[#3B82F6] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer" 
                      title="Editar evento"
                    >
                      <Edit2 size={18} />
                    </button>
                    {renderAccionesEstado(ev)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalAbierto && (
        <ModalEvento 
          eventoAEditar={eventoAEditar} 
          onClose={() => setModalAbierto(false)}
          onSuccess={() => {
            setModalAbierto(false);
            cargarEventos();
          }}
        />
      )}
    </div>
  );
}