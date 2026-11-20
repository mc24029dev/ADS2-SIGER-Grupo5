import { useState, useEffect } from "react";
import { X, Save, Loader2, Calendar, MapPin, AlignLeft, Users, UserCheck } from "lucide-react";
import api from "../../api/client";
import useAuth from "../../hooks/useAuth";

export default function ModalEvento({ eventoAEditar, onClose, onSuccess }) {
  const { usuario } = useAuth();
  
  const [formData, setFormData] = useState({
    nombre: "",
    fecha: "",
    idUbicacion: "",
    capacidadMaxima: "",
    descripcion: "",
    idOrganizador: ""
  });
  const [ubicaciones, setUbicaciones] = useState([]);
  const [organizadores, setOrganizadores] = useState([]); 
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const promesas = [api.get("/ubicaciones")];
        
        if (usuario.rol === "ADMINISTRADOR") {
          promesas.push(api.get("/usuarios"));
        }

        const [resUbi, resUsers] = await Promise.all(promesas);
        
        setUbicaciones(resUbi.data);
        
        if (resUsers) {
          setOrganizadores(resUsers.data.filter(u => u.rol === "ORGANIZADOR"));
        }

        if (eventoAEditar) {
          const fechaObj = new Date(eventoAEditar.fecha);
          fechaObj.setMinutes(fechaObj.getMinutes() - fechaObj.getTimezoneOffset());
          const fechaFormat = fechaObj.toISOString().slice(0, 16);

          setFormData({
            nombre: eventoAEditar.nombre,
            fecha: fechaFormat,
            idUbicacion: resUbi.data.find(u => u.lugar === eventoAEditar.lugar && u.sede === eventoAEditar.sede)?.idUbicacion || "",
            capacidadMaxima: eventoAEditar.capacidadMaxima,
            descripcion: eventoAEditar.descripcion || "",
            idOrganizador: eventoAEditar.idOrganizador || ""
          });
        }
      } catch (err) {
        console.error("Error al cargar datos", err);
      }
    };
    init();
  }, [eventoAEditar, usuario.rol]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre || !formData.fecha || !formData.idUbicacion || !formData.capacidadMaxima) {
      return setError("Todos los campos excepto la descripción son obligatorios.");
    }
    if (usuario.rol === "ADMINISTRADOR" && !formData.idOrganizador) {
      return setError("Debes seleccionar un organizador para el evento.");
    }

    try {
      setCargando(true);
      setError(null);
      
      const payload = {
        ...formData,
        capacidadMaxima: parseInt(formData.capacidadMaxima),
        idUbicacion: parseInt(formData.idUbicacion),
        idOrganizador: formData.idOrganizador ? parseInt(formData.idOrganizador) : null
      };

      if (eventoAEditar) {
        await api.put(`/eventos/${eventoAEditar.idEvento}`, payload);
      } else {
        await api.post("/eventos", payload);
      }
      
      onSuccess();
    } catch (err) {
      setError(err.message || "Error al guardar el evento");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl my-8">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            {eventoAEditar ? "Editar Evento" : "Nuevo Evento"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 cursor-pointer">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4" noValidate>
          
          {usuario.rol === "ADMINISTRADOR" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Organizador Asignado</label>
              <div className="relative">
                <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <select name="idOrganizador" value={formData.idOrganizador} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] appearance-none cursor-pointer">
                  <option value="">Selecciona un organizador...</option>
                  {organizadores.map(org => (
                    <option key={org.idUsuario} value={org.idUsuario}>{org.nombres} {org.apellidos}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre del Evento</label>
            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ej. Congreso de Ingeniería 2026" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha y Hora</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="datetime-local" name="fecha" value={formData.fecha} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6]" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Capacidad Máxima</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="number" name="capacidadMaxima" value={formData.capacidadMaxima} onChange={handleChange} min="1" placeholder="Ej. 150" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6]" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Ubicación</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <select name="idUbicacion" value={formData.idUbicacion} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] appearance-none cursor-pointer">
                <option value="">Selecciona un lugar...</option>
                {ubicaciones.map(u => (
                  <option key={u.idUbicacion} value={u.idUbicacion}>{u.lugar} - {u.sede}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción (Opcional)</label>
            <div className="relative">
              <AlignLeft className="absolute left-3 top-3 text-gray-400" size={18} />
              <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows="3" placeholder="Breve descripción del evento..." className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6]"></textarea>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">{error}</p>}

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer">
              Cancelar
            </button>
            <button type="submit" disabled={cargando} className="flex-1 bg-[#3B82F6] hover:bg-[#2563EB] text-white py-2.5 rounded-lg font-medium transition-colors flex justify-center items-center gap-2 cursor-pointer">
              {cargando ? <Loader2 className="animate-spin" size={20}/> : <><Save size={18}/> Guardar Evento</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}