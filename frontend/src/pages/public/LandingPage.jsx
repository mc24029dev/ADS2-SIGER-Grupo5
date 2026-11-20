import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Clock, QrCode, Mail, BarChart3, ShieldCheck } from "lucide-react";
import api from "../../api/client";
import EventoCard from "../../components/ui/EventoCard";

import heroBg from "../../assets/hero-bg.jpeg"; 

export default function LandingPage() {
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    const cargarDestacados = async () => {
      try {
        const res = await api.get("/eventos");
        const activos = res.data.filter(e => e.estado === "Activo");
        setEventos(activos.slice(0, 3));
      } catch (error) {
        console.error("Error cargando destacados", error);
      }
    };
    cargarDestacados();
  }, []);

  const formatearFecha = (fechaString) => {
    if (!fechaString) return "";
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="flex flex-col bg-[#F8FAFC]">
      <section className="relative h-[85vh] flex items-center justify-center">

        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        ></div>
  
        <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/75 to-[#000000]"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <span className="text-[#60A5FA] text-sm font-bold tracking-widest uppercase mb-4 block">
            SIGER • Plataforma Inteligente de Gestión
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Gestión Inteligente de <br />
            <span className="text-[#3B82F6]">Eventos & Reservaciones</span>
          </h1>
          <p className="text-lg text-gray-200 mb-10 max-w-2xl mx-auto">
            Planifica, reserva y controla tus actividades académicas, empresariales y culturales desde una sola plataforma, segura y organizada.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/eventos" className="bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium px-8 py-3 rounded-lg transition-colors shadow-lg">
              Ver Eventos Disponibles
            </Link>
            <Link to="/contacto" className="bg-white/10 backdrop-blur-md border border-white/30 text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg transition-colors shadow-lg">
              Solicitar Cuenta
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-white py-8 relative z-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-8 md:gap-16 text-sm font-medium text-gray-600">
          <span className="flex items-center gap-2"><Calendar size={18} className="text-[#3B82F6]"/> Reservaciones en Línea</span>
          <span className="flex items-center gap-2"><QrCode size={18} className="text-[#3B82F6]"/> Validación QR</span>
          <span className="flex items-center gap-2"><Mail size={18} className="text-[#3B82F6]"/> Notificaciones</span>
          <span className="flex items-center gap-2"><BarChart3 size={18} className="text-[#3B82F6]"/> Reportes</span>
          <span className="flex items-center gap-2"><ShieldCheck size={18} className="text-[#3B82F6]"/> Acceso Seguro</span>
        </div>
      </section>

      <section className="py-24 px-6 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-12">
          <div>
            <p className="text-[#3B82F6] text-sm font-bold tracking-widest mb-2 uppercase">Próximas Actividades</p>
            <h2 className="text-3xl font-bold text-gray-900">Eventos Destacados</h2>
          </div>
          <Link to="/eventos" className="hidden md:flex items-center gap-2 text-[#3B82F6] hover:text-[#2563EB] font-medium transition-colors">
            Ver todos los eventos &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventos.map((evento) => (
            <EventoCard 
              key={evento.idEvento} 
              titulo={evento.nombre}
              fecha={formatearFecha(evento.fecha)}
              lugar={evento.lugar}
              cupos={evento.cupoDisponible}
              estado={evento.estado}
              esPublico={true}
            />
          ))}
        </div>
      </section>
    </div>
  );
}