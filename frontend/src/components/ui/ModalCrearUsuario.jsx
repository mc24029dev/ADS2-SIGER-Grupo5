import { useState } from "react";
import { X, Save, Loader2, User, Mail, Lock, Shield } from "lucide-react";
import api from "../../api/client";

export default function ModalCrearUsuario({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    email: "",
    contrasena: "",
    rol: "ORGANIZADOR"
  });
  
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [erroresCampos, setErroresCampos] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (erroresCampos[e.target.name]) {
      setErroresCampos({ ...erroresCampos, [e.target.name]: null });
    }
  };

  const validar = () => {
    let errs = {};
    if (!formData.nombres.trim()) errs.nombres = "Obligatorio";
    if (!formData.apellidos.trim()) errs.apellidos = "Obligatorio";
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errs.email = "Obligatorio";
    } else if (!emailRegex.test(formData.email)) {
      errs.email = "Correo inválido";
    }

    if (!formData.contrasena) {
      errs.contrasena = "Obligatorio";
    } else if (formData.contrasena.length < 8) {
      errs.contrasena = "Mínimo 8 caracteres";
    }

    setErroresCampos(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;

    try {
      setCargando(true);
      setError(null);
    
      const endpoint = formData.rol === "ADMINISTRADOR" 
        ? "/usuarios/administradores" 
        : "/usuarios/organizadores";

      await api.post(endpoint, {
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        email: formData.email,
        contrasena: formData.contrasena
      });
      
      onSuccess();
    } catch (err) {
      setError(err.message || "Error al crear el usuario. Verifica si el correo ya existe.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md my-8">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Agregar Nuevo Usuario</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 cursor-pointer">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4" noValidate>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nombres</label>
              <input type="text" name="nombres" value={formData.nombres} onChange={handleChange} className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg focus:ring-2 ${erroresCampos.nombres ? 'border-red-500' : 'border-gray-300'}`} />
              {erroresCampos.nombres && <p className="text-red-500 text-xs mt-1">{erroresCampos.nombres}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Apellidos</label>
              <input type="text" name="apellidos" value={formData.apellidos} onChange={handleChange} className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg focus:ring-2 ${erroresCampos.apellidos ? 'border-red-500' : 'border-gray-300'}`} />
              {erroresCampos.apellidos && <p className="text-red-500 text-xs mt-1">{erroresCampos.apellidos}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Rol del Usuario</label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <select name="rol" value={formData.rol} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] appearance-none cursor-pointer">
                <option value="ORGANIZADOR">Organizador (Crear eventos)</option>
                <option value="ADMINISTRADOR">Administrador (Control total)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="usuario@correo.com" className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-lg focus:ring-2 ${erroresCampos.email ? 'border-red-500' : 'border-gray-300'}`} />
            </div>
            {erroresCampos.email && <p className="text-red-500 text-xs mt-1">{erroresCampos.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Contraseña Temporal</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" name="contrasena" value={formData.contrasena} onChange={handleChange} placeholder="Ej. Siger2026!" className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-lg focus:ring-2 ${erroresCampos.contrasena ? 'border-red-500' : 'border-gray-300'}`} />
            </div>
            {erroresCampos.contrasena && <p className="text-red-500 text-xs mt-1">{erroresCampos.contrasena}</p>}
            <p className="text-xs text-gray-500 mt-1">El usuario podrá cambiarla después desde su perfil.</p>
          </div>

          {error && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">{error}</p>}

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer">
              Cancelar
            </button>
            <button type="submit" disabled={cargando} className="flex-1 bg-[#3B82F6] hover:bg-[#2563EB] text-white py-2.5 rounded-lg font-medium transition-colors flex justify-center items-center gap-2 cursor-pointer">
              {cargando ? <Loader2 className="animate-spin" size={20}/> : <><Save size={18}/> Crear Usuario</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}