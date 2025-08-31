import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,      // crucial inside Docker
    port: 5173,
    strictPort: true,
    watch: { usePolling: true },  // helpful on Windows/macOS
    // If HMR issues appear:
    // hmr: { clientPort: 5173, host: 'localhost' }
  }
})