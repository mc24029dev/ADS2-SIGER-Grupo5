import { useState, useEffect } from "react";
import { FileText, Download, Calendar, Ticket, Activity, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from "../../api/client";

export default function GestionReportes() {
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [descargando, setDescargando] = useState(false);
  
  const [idEventoAsistencia, setIdEventoAsistencia] = useState("");
  const [idEventoReserva, setIdEventoReserva] = useState("");

  const [stats, setStats] = useState({ eventos: 0, reservas: 0, asistencia: 0 });

  const dataGrafico = [
    { mes: 'Ene', reservados: 40, asistencias: 32 },
    { mes: 'Feb', reservados: 55, asistencias: 48 },
    { mes: 'Mar', reservados: 70, asistencias: 65 },
    { mes: 'Abr', reservados: 90, asistencias: 85 },
    { mes: 'May', reservados: 65, asistencias: 50 },
    { mes: 'Jun', reservados: 100, asistencias: 95 },
  ];

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const resE = await api.get("/eventos");
        setEventos(resE.data);

        let totalReservas = 0;
        resE.data.forEach(ev => {
          totalReservas += (ev.capacidadMaxima - ev.cupoDisponible);
        });

        setStats({
          eventos: resE.data.length,
          reservas: totalReservas,
          asistencia: 87.5 
        });
      } catch (error) {
        console.error("Error al cargar datos", error);
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, []);

  const descargarPDF = async (endpoint, nombreArchivo) => {
    try {
      setDescargando(true);
      const response = await api.get(endpoint, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${nombreArchivo}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Error al generar el reporte.");
    } finally {
      setDescargando(false);
    }
  };

  if (cargando) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#3B82F6]" size={40}/></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <p className="text-[#3B82F6] text-xs font-bold tracking-widest uppercase mb-1">Analítica Institucional</p>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard de Reportes</h1>
          <p className="text-gray-500 text-sm mt-1">Visualización de métricas de reservaciones, asistencia efectiva y aforo global.</p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => descargarPDF("/reportes/reservaciones", "reporte-global-reservas")}
            disabled={descargando}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer"
          >
            {descargando ? <Loader2 className="animate-spin" size={16}/> : <FileText size={16}/>} Exportar PDF
          </button>

          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer">
            <FileText size={16}/> Exportar Excel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Total de Eventos</p>
          <p className="text-3xl font-bold text-gray-900">{stats.eventos}</p>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-100"><Calendar size={48}/></div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Total Reservaciones</p>
          <p className="text-3xl font-bold text-gray-900">{stats.reservas}</p>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-100"><Ticket size={48}/></div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Asistencia Promedio</p>
          <p className="text-3xl font-bold text-gray-900">{stats.asistencia}%</p>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-100"><Activity size={48}/></div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Afluencia y Reservaciones por Mes</h2>
            <p className="text-sm text-gray-500">Comparativa de cupos reservados versus validación física de entradas.</p>
          </div>
        </div>
        
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataGrafico} margin={{ top: 20, right: 30, left: 0, bottom: 5 }} barGap={8}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
              <Tooltip 
                cursor={{ fill: '#F3F4F6' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }}/>
              <Bar dataKey="reservados" name="Reservados" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={24} />
              <Bar dataKey="asistencias" name="Asistencias" fill="#10B981" radius={[4, 4, 0, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Descargar Reportes Detallados</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-gray-800 mb-1">Reporte de Eventos</h4>
              <p className="text-xs text-gray-500 mb-4">Listado general de eventos y cupos.</p>
            </div>
            <button 
              onClick={() => descargarPDF("/reportes/eventos", "reporte-eventos")}
              disabled={descargando}
              className="w-full bg-gray-50 hover:bg-gray-600 border border-gray-200 text-gray-700 hover:text-white py-2 rounded-lg text-sm font-medium transition-colors flex justify-center items-center gap-2 cursor-pointer"
            >
              <Download size={16}/> Descargar
            </button>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-gray-800 mb-1">Reporte de Asistencia</h4>
              <select 
                value={idEventoAsistencia} 
                onChange={(e) => setIdEventoAsistencia(e.target.value)}
                className="w-full mb-4 px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-sm cursor-pointer"
              >
                <option value="">Selecciona evento...</option>
                {eventos.map(ev => (
                  <option key={ev.idEvento} value={ev.idEvento}>{ev.nombre}</option>
                ))}
              </select>
            </div>
            <button 
              onClick={() => descargarPDF(`/reportes/asistencia?idEvento=${idEventoAsistencia}`, `asistencia-${idEventoAsistencia}`)}
              disabled={descargando || !idEventoAsistencia}
              className="w-full bg-gray-50 hover:bg-gray-600 border border-gray-200 text-gray-700 hover:text-white py-2 rounded-lg text-sm font-medium transition-colors flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Download size={16}/> Descargar
            </button>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-gray-800 mb-1">Reporte de Reservaciones</h4>
              <select 
                value={idEventoReserva} 
                onChange={(e) => setIdEventoReserva(e.target.value)}
                className="w-full mb-4 px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-sm cursor-pointer"
              >
                <option value="">Todos los eventos</option>
                {eventos.map(ev => (
                  <option key={ev.idEvento} value={ev.idEvento}>{ev.nombre}</option>
                ))}
              </select>
            </div>
            <button 
              onClick={() => descargarPDF(`/reportes/reservaciones${idEventoReserva ? `?idEvento=${idEventoReserva}` : ''}`, "reporte-reservas")}
              disabled={descargando}
              className="w-full bg-gray-50 hover:bg-gray-600 border border-gray-200 text-gray-700 hover:text-white py-2 rounded-lg text-sm font-medium transition-colors flex justify-center items-center gap-2 cursor-pointer"
            >
              <Download size={16}/> Descargar
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}