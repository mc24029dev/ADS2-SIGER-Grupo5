// Cliente HTTP base. El backend usa Basic Auth (Spring Security) y context path /siger/api/v1.
const API_URL = import.meta.env.VITE_API_URL

export async function api(path, { method = "GET", body, credenciales } = {}) {
  const headers = { "Content-Type": "application/json" }
  if (credenciales) {
    headers.Authorization = "Basic " + btoa(`${credenciales.email}:${credenciales.contrasena}`)
  }

  const respuesta = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!respuesta.ok) {
    const error = await respuesta.json().catch(() => ({}))
    throw new Error(error.mensaje ?? error.message ?? "Error en la solicitud")
  }
  return respuesta.status === 204 ? null : respuesta.json()
}
