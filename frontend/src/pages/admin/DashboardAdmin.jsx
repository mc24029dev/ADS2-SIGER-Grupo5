import { useState, useEffect } from "react";
import { Users, Calendar, Ticket, Activity, Loader2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../api/client";
import useAuth from "../../hooks/useAuth";

export default function DashboardAdmin() {
  const { usuario } = useAuth();
  const [stats, setStats] = useState({ usuarios: 0, eventos: 0, reservas: 0, asistencias: 0 });
  const [proximosEventos, setProximosEventos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [resU, resE] = await Promise.all([
          api.get("/usuarios"),
          api.get("/eventos")
        ]);

        const usuariosTotales = resU.data.length;
        const eventosTotales = resE.data.length;
        
        let reservas = 0;
        resE.data.forEach(ev => {
          reservas += (ev.capacidadMaxima - ev.cupoDisponible);
        });

        setStats({
          usuarios: usuariosTotales,
          eventos: eventosTotales,
          reservas: reservas,
          asistencias: Math.floor(reservas * 0.8) // Estimado
        });

        const hoy = new Date();
        const eventosFuturos = resE.data
          .filter(ev => new Date(ev.fecha) >= hoy && ev.estado === "Activo")
          .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
          .slice(0, 4); // Traer solo los 4 más cercanos

        setProximosEventos(eventosFuturos);

      } catch (error) {
        console.error("Error al cargar datos del dashboard", error);
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, []);

  if (cargando) {
    return <div className="flex justify-center items-center h-[80vh]"><Loader2 className="animate-spin text-[#3B82F6]" size={48}/></div>;
  }

  const statsCards = [
    { label: "Usuarios Totales", value: stats.usuarios, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Eventos Registrados", value: stats.eventos, icon: Calendar, color: "text-green-600", bg: "bg-green-50" },
    { label: "Reservas Activas", value: stats.reservas, icon: Ticket, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Asistencias Estimadas", value: stats.asistencias, icon: Activity, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    
        <div className="bg-linear-to-br from-[#111827] via-[#1e3a8a] to-[#3B82F6] rounded-2xl p-8 text-white flex flex-col justify-center relative overflow-hidden shadow-lg min-h-60">

          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-3">¡Hola, {usuario.nombres}!</h1>
            <p className="text-blue-100/80 text-sm leading-relaxed max-w-sm">
              Bienvenido al panel de control de SIGER. Aquí puedes gestionar eventos, usuarios y monitorear la actividad del sistema en tiempo real.
            </p>
            <Link to="/admin/reportes" className="inline-flex items-center gap-2 mt-6 bg-white/20 hover:bg-white/30 transition-colors px-5 py-2.5 rounded-lg text-sm font-semibold backdrop-blur-sm">
              Ver Reportes <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">

          <div className="bg-blue-50/80 px-6 py-4 border-b border-blue-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-blue-900">Próximos Eventos</h2>
            <Link to="/admin/eventos" className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
              Ver todos <ArrowRight size={14} />
            </Link>
          </div>
          
          <div className="flex-1 p-2">
            {proximosEventos.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm py-8">
                No hay eventos próximos programados.
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {proximosEventos.map((ev) => (
                  <li key={ev.idEvento} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{ev.nombre}</p>
                      <p className="text-xs text-gray-500 mt-1 truncate">{ev.lugar} - {ev.sede}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-[#3B82F6]">
                        {new Date(ev.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(ev.fecha).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      
      <div className="space-y-4 pt-4">
        <h2 className="text-lg font-bold text-gray-800 px-1">Resumen General</h2>
        
        <div className="flex flex-col gap-4">
          {statsCards.map((card, i) => (
            <div 
              key={i} 
              className="bg-white px-6 py-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between hover:shadow-md hover:border-blue-200 transition-all cursor-default group"
            >
              <div className="flex items-center gap-5">
                <div className={`p-3 rounded-lg ${card.bg} ${card.color} group-hover:scale-110 transition-transform`}>
                  <card.icon size={24} />
                </div>
                <p className="text-base font-semibold text-gray-600">{card.label}</p>
              </div>
              <p className="text-3xl font-bold text-gray-900">{card.value}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}