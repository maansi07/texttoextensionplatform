import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // Proxy API calls to Node.js backend on port 8080
    proxy: {
      '/api': 'http://localhost:8080'
    }
  }
})