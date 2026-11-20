// Pantalla inicial de cada rol después de iniciar sesión.
export const RUTA_INICIO_POR_ROL = {
  ADMINISTRADOR: "/admin",
  ORGANIZADOR: "/organizador/eventos", 
  PARTICIPANTE: "/participante/eventos",
}

export function rutaInicio(rol) {
  return RUTA_INICIO_POR_ROL[rol] ?? "/login"
}