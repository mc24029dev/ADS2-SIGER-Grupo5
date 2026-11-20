import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173, // el backend permite este origen en CorsConfig
    strictPort: true, // si el 5173 está ocupado, falla en vez de cambiar de puerto
  },
})