/// <reference types="vitest" />
import { fileURLToPath, URL } from 'node:url'
import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  // Configuración para GitHub Pages
  base: process.env.NODE_ENV === 'production' ? '/VueDex/' : '/',
  test: {
    globals: true,
    environment: 'jsdom',
    // Optional: if you need a global setup file for tests
    // setupFiles: './tests/setup.js',
  },
})
