import { useState } from "react";
import { X, Save, Loader2, User, Mail, Shield } from "lucide-react";
import api from "../../api/client";

export default function ModalEditarUsuario({ usuario, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    nombres: usuario.nombres,
    apellidos: usuario.apellidos
  });
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombres.trim() || !formData.apellidos.trim()) {
      return setError("Todos los campos son obligatorios.");
    }

    try {
      setCargando(true);
      setError(null);
      await api.put(`/usuarios/${usuario.idUsuario}`, formData);
      onSuccess();
    } catch (err) {
      setError(err.message || "Error al actualizar el usuario");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Editar Usuario</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 cursor-pointer">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4" noValidate>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Correo (No editable)</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" value={usuario.email} disabled className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Rol (No editable)</label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" value={usuario.rol} disabled className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nombres</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" name="nombres" value={formData.nombres} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6]" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Apellidos</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" name="apellidos" value={formData.apellidos} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6]" />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">{error}</p>}

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer">
              Cancelar
            </button>
            <button type="submit" disabled={cargando} className="flex-1 bg-[#3B82F6] hover:bg-[#2563EB] text-white py-2.5 rounded-lg font-medium transition-colors flex justify-center items-center gap-2 cursor-pointer">
              {cargando ? <Loader2 className="animate-spin" size={20}/> : <><Save size={18}/> Guardar</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}