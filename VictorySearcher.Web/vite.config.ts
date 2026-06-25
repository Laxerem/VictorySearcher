import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Backend target for the /api proxy. Overridable so the same config works
// locally (default) and in Docker (VITE_API_PROXY_TARGET=http://api:8080).
const apiTarget = process.env.VITE_API_PROXY_TARGET ?? 'http://localhost:5183'

const proxy = {
  '/api': {
    target: apiTarget,
    changeOrigin: true,
  },
}

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    proxy,
  },
  preview: {
    host: true,
    port: 5173,
    proxy,
  },
})
