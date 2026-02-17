/**
 * Основной конфигурационный файл для режима разработки Vite
 * 
 * Этот файл настраивает сервер разработки для работы с проектом.
 * Он использует директорию 'dev' как корневую для разработки,
 * что позволяет изолировать разработку от остальной части проекта.
 * 
 * Основные особенности:
 * - Запускает сервер на порту 3003
 * - Включает проверки времени выполнения для отладки
 * - Компилирует файлы в директорию ../dist
 */

import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        // Enable run-time checks in development
        dev: true,
        // Don't generate a separate CSS file during component compilation
        css: 'external',
        // Svelte 5 component API
        compatibility: {
          componentApi: 5,
        },
      }
    })
  ],
  root: 'dev', // Serve from the dev directory for development
  server: {
    port: 3003,
    host: '0.0.0.0',
    open: false, // Open page in browser on server start!
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..'],
      // Serve files from both dev and root directories
      strict: false
    }
  },
  optimizeDeps: {
    include: ['@xyflow/svelte'],
  },
  // Suppress source map warnings in Firefox
  css: {
    devSourcemap: false
  },
  build: {
    outDir: '../dist',
    sourcemap: false,
    rollupOptions: {
      external: [],
      output: {
        globals: {}
      }
    }
  }
});