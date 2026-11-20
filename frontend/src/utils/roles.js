// Pantalla inicial de cada rol después de iniciar sesión.
export const RUTA_INICIO_POR_ROL = {
  ADMINISTRADOR: "/admin",
  ORGANIZADOR: "/eventos", // temporal: el panel del organizador aún no existe
  PARTICIPANTE: "/participante/eventos",
}

export function rutaInicio(rol) {
  return RUTA_INICIO_POR_ROL[rol] ?? "/login"
}