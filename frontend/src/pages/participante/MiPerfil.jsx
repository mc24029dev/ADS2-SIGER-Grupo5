import { useState } from "react";
import { User, Lock, Loader2, Save } from "lucide-react";
import api from "../../api/client";
import useAuth from "../../hooks/useAuth";

export default function MiPerfil() {
  const { usuario, logout } = useAuth();
  
  const [perfilData, setPerfilData] = useState({
    nombres: usuario?.nombres || "",
    apellidos: usuario?.apellidos || ""
  });
  const [erroresPerfil, setErroresPerfil] = useState({});
  
  const [passData, setPassData] = useState({
    contrasenaActual: "",
    nuevaContrasena: "",
    confirmarContrasena: ""
  });
  const [erroresPass, setErroresPass] = useState({});

  const [cargandoPerfil, setCargandoPerfil] = useState(false);
  const [cargandoPass, setCargandoPass] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

  const handlePerfilChange = (e) => {
    setPerfilData({ ...perfilData, [e.target.name]: e.target.value });
    if (erroresPerfil[e.target.name]) {
      setErroresPerfil({ ...erroresPerfil, [e.target.name]: null });
    }
  };

  const validarPerfil = () => {
    let errs = {};
    if (!perfilData.nombres.trim()) errs.nombres = "El nombre es obligatorio.";
    if (!perfilData.apellidos.trim()) errs.apellidos = "El apellido es obligatorio.";
    setErroresPerfil(errs);
    return Object.keys(errs).length === 0;
  };

  const handleUpdatePerfil = async (e) => {
    e.preventDefault();
    if (!validarPerfil()) return;

    setCargandoPerfil(true);
    setMensaje({ tipo: "", texto: "" });
    try {
      await api.put("/auth/me/perfil", perfilData);
      setMensaje({ tipo: "exito", texto: "Perfil actualizado. Recarga la página para ver los cambios en el menú." });
    } catch (error) {
      setMensaje({ tipo: "error", texto: error.message });
    } finally {
      setCargandoPerfil(false);
    }
  };

  const handlePassChange = (e) => {
    setPassData({ ...passData, [e.target.name]: e.target.value });
    if (erroresPass[e.target.name]) {
      setErroresPass({ ...erroresPass, [e.target.name]: null });
    }
  };

  const validarPass = () => {
    let errs = {};
    if (!passData.contrasenaActual) {
      errs.contrasenaActual = "La contraseña actual es obligatoria.";
    }
    
    if (!passData.nuevaContrasena) {
      errs.nuevaContrasena = "La nueva contraseña es obligatoria.";
    } else if (passData.nuevaContrasena.length < 8) {
      errs.nuevaContrasena = "Debe tener al menos 8 caracteres.";
    }

    if (!passData.confirmarContrasena) {
      errs.confirmarContrasena = "Confirma tu nueva contraseña.";
    } else if (passData.nuevaContrasena !== passData.confirmarContrasena) {
      errs.confirmarContrasena = "Las contraseñas no coinciden.";
    }

    setErroresPass(errs);
    return Object.keys(errs).length === 0;
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!validarPass()) return;
    
    setCargandoPass(true);
    setMensaje({ tipo: "", texto: "" });
    try {
      await api.put("/auth/me/password", {
        contrasenaActual: passData.contrasenaActual,
        nuevaContrasena: passData.nuevaContrasena
      });
      
      setMensaje({ tipo: "exito", texto: "Contraseña cambiada con éxito. Cerrando sesión por seguridad..." });
      
      setTimeout(() => {
        logout();
      }, 2500);
      
    } catch (error) {
      setMensaje({ tipo: "error", texto: error.message });
      setCargandoPass(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
        <p className="text-gray-500 text-sm mt-1">Administra tu información personal y tu seguridad.</p>
      </div>

      {mensaje.texto && (
        <div className={`p-4 rounded-xl border text-sm font-medium ${
          mensaje.tipo === "exito" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"
        }`}>
          {mensaje.texto}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-50 p-2 rounded-lg text-[#3B82F6]"><User size={20} /></div>
            <h2 className="text-lg font-bold text-gray-900">Datos Personales</h2>
          </div>

          <form onSubmit={handleUpdatePerfil} className="space-y-4" noValidate>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nombres</label>
              <input 
                type="text" name="nombres" value={perfilData.nombres} onChange={handlePerfilChange} 
                className={`w-full px-4 py-2 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  erroresPerfil.nombres ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-[#3B82F6]"
                }`} 
              />
              {erroresPerfil.nombres && <p className="text-red-500 text-xs mt-1">{erroresPerfil.nombres}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Apellidos</label>
              <input 
                type="text" name="apellidos" value={perfilData.apellidos} onChange={handlePerfilChange} 
                className={`w-full px-4 py-2 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  erroresPerfil.apellidos ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-[#3B82F6]"
                }`} 
              />
              {erroresPerfil.apellidos && <p className="text-red-500 text-xs mt-1">{erroresPerfil.apellidos}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Correo Electrónico (No editable)</label>
              <input 
                type="email" value={usuario?.email || ""} disabled
                className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed" 
              />
            </div>
            <button 
              type="submit" disabled={cargandoPerfil}
              className="w-full mt-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white py-2.5 rounded-lg font-medium flex justify-center items-center gap-2 transition-colors cursor-pointer"
            >
              {cargandoPerfil ? <Loader2 className="animate-spin" size={20}/> : <><Save size={18}/> Guardar Cambios</>}
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-orange-50 p-2 rounded-lg text-orange-600"><Lock size={20} /></div>
            <h2 className="text-lg font-bold text-gray-900">Seguridad</h2>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-4" noValidate>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Contraseña Actual</label>
              <input 
                type="password" name="contrasenaActual" value={passData.contrasenaActual} onChange={handlePassChange} 
                className={`w-full px-4 py-2 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  erroresPass.contrasenaActual ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-[#3B82F6]"
                }`} 
              />
              {erroresPass.contrasenaActual && <p className="text-red-500 text-xs mt-1">{erroresPass.contrasenaActual}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nueva Contraseña</label>
              <input 
                type="password" name="nuevaContrasena" value={passData.nuevaContrasena} onChange={handlePassChange} 
                className={`w-full px-4 py-2 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  erroresPass.nuevaContrasena ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-[#3B82F6]"
                }`} 
              />
              {erroresPass.nuevaContrasena && <p className="text-red-500 text-xs mt-1">{erroresPass.nuevaContrasena}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Confirmar Nueva Contraseña</label>
              <input 
                type="password" name="confirmarContrasena" value={passData.confirmarContrasena} onChange={handlePassChange} 
                className={`w-full px-4 py-2 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  erroresPass.confirmarContrasena ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-[#3B82F6]"
                }`} 
              />
              {erroresPass.confirmarContrasena && <p className="text-red-500 text-xs mt-1">{erroresPass.confirmarContrasena}</p>}
            </div>
            
            <button 
              type="submit" disabled={cargandoPass}
              className="w-full mt-2 bg-gray-900 hover:bg-gray-800 text-white py-2.5 rounded-lg font-medium flex justify-center items-center gap-2 transition-colors cursor-pointer"
            >
              {cargandoPass ? <Loader2 className="animate-spin" size={20}/> : "Actualizar Contraseña"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}