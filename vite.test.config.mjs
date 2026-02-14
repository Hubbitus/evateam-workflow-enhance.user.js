/**
 * Конфигурационный файл для тестирования Vite
 *
 * Этот файл настраивает сервер для тестирования финального бандла.
 * Он используется для проверки работоспособности собранного проекта
 * перед его использованием в реальных условиях.
 *
 * Основные особенности:
 * - Запускает сервер на порту 3004
 * - Компилирует файлы в директорию ./dist (так же, как и основная сборка)
 * - Позволяет тестировать финальный бандл в изолированной среде
 */

import { defineConfig } from 'vite';

// Configuration for testing the final bundle
export default defineConfig({
  root: '.', // Serve from the project root
  server: {
    port: 3004,
    host: '0.0.0.0',
    open: true,
    fs: {
      // Allow serving files from anywhere in the project
      allow: ['.'],
      strict: false
    }
  },
  build: {
    outDir: './dist',
    rollupOptions: {
      external: [],
      output: {
        globals: {}
      }
    }
  }
});