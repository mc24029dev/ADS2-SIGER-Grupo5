import { useState, useEffect } from "react";
import { Search, Loader2, CheckCircle2, UserCheck, QrCode, ClipboardList } from "lucide-react";
import api from "../../api/client";
import useAuth from "../../hooks/useAuth";

export default function GestionAsistencias() {
  const { usuario } = useAuth();
  const [eventos, setEventos] = useState([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState("");
  
  const [asistencias, setAsistencias] = useState([]);
  const [cargandoEventos, setCargandoEventos] = useState(true);
  const [cargandoAsistencias, setCargandoAsistencias] = useState(false);
  
  const [busqueda, setBusqueda] = useState("");
  const [codigoInput, setCodigoInput] = useState("");
  const [procesandoId, setProcesandoId] = useState(null);

  useEffect(() => {
    const cargarEventos = async () => {
      try {
        const res = await api.get("/eventos");
        
        let eventosAMostrar = res.data.filter(e => e.estado !== "Cancelado");
        if (usuario.rol === "ORGANIZADOR") {
          eventosAMostrar = eventosAMostrar.filter(ev => ev.idOrganizador === usuario.idUsuario);
        }
        
        setEventos(eventosAMostrar);
      } catch (error) {
        console.error("Error al cargar eventos", error);
      } finally {
        setCargandoEventos(false);
      }
    };
    cargarEventos();
  }, [usuario]);

  const cargarAsistencias = async (idEvento) => {
    try {
      setCargandoAsistencias(true);
      setAsistencias([]);
      const res = await api.get(`/eventos/${idEvento}/asistencias`);
      setAsistencias(res.data);
    } catch (error) {
      console.error("Error al cargar asistencias", error);
    } finally {
      setCargandoAsistencias(false);
    }
  };

  const handleEventoChange = (e) => {
    const id = e.target.value;
    setEventoSeleccionado(id);
    setBusqueda("");
    setCodigoInput("");
    if (id) cargarAsistencias(id);
  };

  const handleRegistrarPorCodigo = async (e) => {
    e.preventDefault();
    if (!codigoInput.trim()) return;

    try {
      await api.post(`/eventos/${eventoSeleccionado}/asistencias/codigo`, { codigo: codigoInput.trim() });
      setCodigoInput("");
      cargarAsistencias(eventoSeleccionado);
    } catch (error) {
      alert(error.message || "Código inválido o ya registrado.");
    }
  };

  const handleRegistrarManual = async (idReservacion) => {
    try {
      setProcesandoId(idReservacion);
      await api.post(`/eventos/${eventoSeleccionado}/asistencias/reservaciones/${idReservacion}`);
      cargarAsistencias(eventoSeleccionado);
    } catch (error) {
      alert(error.message || "Error al registrar asistencia");
    } finally {
      setProcesandoId(null);
    }
  };

  const asistenciasFiltradas = asistencias.filter(a => 
    a.nombres.toLowerCase().includes(busqueda.toLowerCase()) ||
    a.apellidos.toLowerCase().includes(busqueda.toLowerCase()) ||
    a.codigoReservacion.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      <div>
        <p className="text-[#3B82F6] text-xs font-bold tracking-widest uppercase mb-1">Panel de Administración</p>
        <h1 className="text-2xl font-bold text-gray-900">Control de Asistencias</h1>
        <p className="text-gray-500 text-sm mt-1">Gestiona el ingreso de participantes a los eventos activos.</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Selecciona un Evento para supervisar</label>
        {cargandoEventos ? (
          <div className="flex items-center gap-2 text-gray-500"><Loader2 className="animate-spin" size={18}/> Cargando eventos...</div>
        ) : (
          <select 
            value={eventoSeleccionado} 
            onChange={handleEventoChange}
            className="w-full max-w-md px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] font-medium text-gray-800 cursor-pointer"
          >
            <option value="">-- Elige un evento --</option>
            {eventos.map(ev => (
              <option key={ev.idEvento} value={ev.idEvento}>
                {ev.nombre} ({ev.fecha.split('T')[0]})
              </option>
            ))}
          </select>
        )}
      </div>

      {eventoSeleccionado && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-4 text-[#3B82F6]">
                <QrCode size={24} />
                <h2 className="text-lg font-bold">Registro Rápido</h2>
              </div>
              <p className="text-sm text-gray-500 mb-4">Escanea el QR del participante o ingresa su código manualmente.</p>
              
              <form onSubmit={handleRegistrarPorCodigo} className="space-y-3">
                <input
                  type="text"
                  placeholder="Ej. RES-2026-F2CCA965"
                  value={codigoInput}
                  onChange={(e) => setCodigoInput(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] font-mono text-sm uppercase"
                />
                <button 
                  type="submit"
                  className="w-full bg-[#10B981] hover:bg-[#059669] text-white py-2.5 rounded-lg font-medium transition-colors cursor-pointer"
                >
                  Registrar Asistencia
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center gap-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Buscar por nombre o código..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />
              </div>
              <div className="text-sm font-medium text-gray-500 whitespace-nowrap">
                {asistenciasFiltradas.length} registros
              </div>
            </div>

            <div className="overflow-y-auto max-h-125">
              {cargandoAsistencias ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#3B82F6]" size={40}/></div>
              ) : asistenciasFiltradas.length === 0 ? (
                <div className="p-10 text-center text-gray-500 flex flex-col items-center">
                  <ClipboardList size={40} className="text-gray-300 mb-4" />
                  No hay reservaciones confirmadas para este evento.
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-white shadow-sm z-10">
                    <tr className="text-xs text-gray-500 uppercase tracking-wider border-b border-gray-200">
                      <th className="px-6 py-3 font-semibold">Participante</th>
                      <th className="px-6 py-3 font-semibold">Código</th>
                      <th className="px-6 py-3 font-semibold text-center">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {asistenciasFiltradas.map((a) => (
                      <tr key={a.idReservacion} className={`hover:bg-gray-50 ${a.asistio ? 'bg-green-50/30' : ''}`}>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-900">{a.nombres} {a.apellidos}</p>
                          {a.asistio && a.fechaRegistro && (
                            <p className="text-xs text-green-600 mt-0.5">Ingresó: {new Date(a.fechaRegistro).toLocaleTimeString()}</p>
                          )}
                        </td>
                        <td className="px-6 py-4 font-mono text-gray-600">{a.codigoReservacion}</td>
                        <td className="px-6 py-4 text-center">
                          {a.asistio ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-green-700 bg-green-100">
                              <CheckCircle2 size={14} /> Asistió
                            </span>
                          ) : (
                            <button
                              onClick={() => handleRegistrarManual(a.idReservacion)}
                              disabled={procesandoId === a.idReservacion}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#3B82F6] bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer"
                            >
                              {procesandoId === a.idReservacion ? <Loader2 size={14} className="animate-spin" /> : <UserCheck size={14} />}
                              Registrar
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}