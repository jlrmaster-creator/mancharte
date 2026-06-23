import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/mancharte/',
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'docs',
  },
  define: {
    __APP_VERSION__: JSON.stringify('1.0.20'),
  },
})
