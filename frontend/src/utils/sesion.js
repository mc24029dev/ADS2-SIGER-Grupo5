const CLAVE = "siger_auth"

/**
 * Arma el valor base64 de la cabecera Basic. Pasa por UTF-8 para que
 * tildes y ñ en la contraseña no rompan btoa, y normaliza el correo
 * igual que el backend (sin espacios y en minúsculas).
 */
export function codificarBasic(correo, contrasena) {
  const credenciales = `${correo.trim().toLowerCase()}:${contrasena}`
  const bytes = new TextEncoder().encode(credenciales)
  let binario = ""
  bytes.forEach((byte) => {
    binario += String.fromCharCode(byte)
  })
  return btoa(binario)
}

export function leerCredenciales() {
  try {
    return sessionStorage.getItem(CLAVE)
  } catch {
    return null // el navegador no permite usar sessionStorage
  }
}

export function guardarCredenciales(basic) {
  try {
    sessionStorage.setItem(CLAVE, basic)
  } catch {
    // sin almacenamiento: la sesión dura solo hasta recargar
  }
}

export function borrarCredenciales() {
  try {
    sessionStorage.removeItem(CLAVE)
  } catch {
    // nada que borrar
  }
}