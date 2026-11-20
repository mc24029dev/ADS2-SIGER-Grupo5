import api from "./client"

// Verifica unas credenciales nuevas (todavía no guardadas) pidiendo el perfil.
export async function verificarCredenciales(basic) {
  const { data } = await api.get("/auth/me", {
    headers: { Authorization: `Basic ${basic}` },
  })
  return data
}

// Perfil del usuario con las credenciales ya guardadas.
export async function obtenerPerfil() {
  const { data } = await api.get("/auth/me")
  return data
}