import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Warning threshold thoda badha diya (default 500kb → 1000kb)
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Bade libraries alag chunks mein — parallel load, better cache
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three')) return 'three';
            if (id.includes('gsap')) return 'gsap';
            if (id.includes('framer-motion')) return 'motion';
            if (id.includes('react-icons')) return 'icons';
            if (id.includes('react-dom') || id.includes('/react/')) return 'react';
          }
        },
      },
    },
  },
})
