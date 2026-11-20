import { useState } from "react";
import { Mail, User, Shield, MessageSquare, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import api from "../../api/client";

export default function Contacto() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    rol: "",
    motivo: ""
  });

  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errores[name]) {
      setErrores({ ...errores, [name]: null });
    }
  };

  const validarFormulario = () => {
    let nuevosErrores = {};
    if (!formData.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio.";
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      nuevosErrores.email = "El correo es obligatorio.";
    } else if (!emailRegex.test(formData.email)) {
      nuevosErrores.email = "Ingresa un correo electrónico válido.";
    }

    if (!formData.rol) nuevosErrores.rol = "Debes seleccionar un rol.";
    if (!formData.motivo.trim()) nuevosErrores.motivo = "Cuéntanos el motivo de tu solicitud.";

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0; 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    try {
      setEnviando(true);
      await api.post("/contacto", formData);
      setExito(true);
      setFormData({ nombre: "", email: "", rol: "", motivo: "" }); 
    } catch (error) {
      alert("Hubo un error al enviar la solicitud. Intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#F8FAFC] px-6 py-12">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Solicitar una Cuenta</h1>
          <p className="text-gray-500">
            El acceso al sistema es gestionado por administradores. Completa el formulario y nos pondremos en contacto contigo.
          </p>
        </div>

        {exito ? (
          <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-xl text-center flex flex-col items-center">
            <CheckCircle size={48} className="mb-4 text-green-500" />
            <h3 className="text-xl font-bold mb-2">¡Solicitud Enviada!</h3>
            <p>Tu petición ha sido enviada a los administradores. Recibirás un correo pronto.</p>
            <button onClick={() => setExito(false)} className="mt-6 text-sm text-green-700 underline hover:text-green-800">
              Enviar otra solicitud
            </button>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre Completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      errores.nombre ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-[#3B82F6]"
                    }`} 
                    placeholder="Ej. Juan Pérez" 
                  />
                </div>
                {errores.nombre && <p className="text-red-500 text-xs mt-1">{errores.nombre}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      errores.email ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-[#3B82F6]"
                    }`} 
                    placeholder="usuario@correo.com" 
                  />
                </div>
                {errores.email && <p className="text-red-500 text-xs mt-1">{errores.email}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de Rol Solicitado</label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <select 
                  name="rol"
                  value={formData.rol}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 appearance-none transition-all ${
                    errores.rol ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-[#3B82F6]"
                  }`}
                >
                  <option value="">Selecciona un rol...</option>
                  <option value="PARTICIPANTE">Participante (Asistir a eventos)</option>
                  <option value="ORGANIZADOR">Organizador (Crear eventos)</option>
                </select>
              </div>
              {errores.rol && <p className="text-red-500 text-xs mt-1">{errores.rol}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Motivo de la Solicitud</label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 text-gray-400" size={18} />
                <textarea 
                  name="motivo"
                  value={formData.motivo}
                  onChange={handleChange}
                  rows="4" 
                  className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errores.motivo ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-[#3B82F6]"
                  }`}
                  placeholder="Explica brevemente por qué necesitas acceso al sistema..."
                ></textarea>
              </div>
              {errores.motivo && <p className="text-red-500 text-xs mt-1">{errores.motivo}</p>}
            </div>

            <button 
              type="submit" 
              disabled={enviando}
              className="w-full bg-[#3B82F6] hover:bg-[#2563EB] disabled:bg-blue-300 text-white font-medium py-3 rounded-lg transition-colors flex justify-center items-center gap-2"
            >
              {enviando ? (
                <><Loader2 className="animate-spin" size={20} /> Enviando...</>
              ) : (
                "Enviar Solicitud"
              )}
            </button>
            <p className="text-xs text-center text-gray-400 mt-4">
              Al enviar, se notificará a los administradores por correo electrónico.
            </p>
          </form>
        )}

      </div>
    </div>
  );
}