import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'
import tailwindcss from '@tailwindcss/vite'

export default mergeConfig(
  viteConfig,
  defineConfig({
    plugins: [
      tailwindcss(),
    ],
    test: {
      globals: true,
      environment: 'jsdom',
      environmentOptions: {
        jsdom: {
          url: 'http://localhost'
        }
      },
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      setupFiles: ['./vitest.setup.js'], // Optional setup file for global test configuration
    },
  }),
)
