/**
 * Конфигурационный файл для сборки проекта
 *
 * Этот файл настраивает сборку проекта в виде одного файла для использования
 * в качестве Tampermonkey-скрипта. Он создает IIFE (Immediately Invoked Function Expression)
 * бандл с необходимыми заголовками Tampermonkey.
 *
 * Основные особенности:
 * - Создает бандл в формате IIFE для Tampermonkey
 * - Добавляет Tampermonkey заголовки через плагин
 * - Встраивает CSS в JS-бандл для Tampermonkey
 * - Выходной файл: dist/evateam-workflow-enhance.user.js
 */

import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tampermonkeyHeaders from './plugins/tampermonkey-header-plugin.js';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Плагин для встраивания CSS в JS-бандл
function cssInlinePlugin() {
  return {
    name: 'css-inline',
    enforce: 'post',
    writeBundle(options, bundle) {
      const fs = require('fs');
      const outDir = options.dir || path.join(__dirname, 'dist');

      let cssContent = '';
      const cssFiles = [];

      // Читаем CSS-файлы из директории сборки
      if (fs.existsSync(outDir)) {
        const files = fs.readdirSync(outDir);
        for (const file of files) {
          if (file.endsWith('.css')) {
            const cssPath = path.join(outDir, file);
            cssContent += fs.readFileSync(cssPath, 'utf-8');
            cssFiles.push(file);
            // Удаляем CSS-файл
            fs.unlinkSync(cssPath);
          }
        }
      }

      // Если есть CSS, добавляем его в начало JS-файла
      if (cssContent) {
        const jsPath = path.join(outDir, 'evateam-workflow-enhance.user.js');
        if (fs.existsSync(jsPath)) {
          let jsContent = fs.readFileSync(jsPath, 'utf-8');
          const cssCode = `(function() {
            const style = document.createElement('style');
            style.textContent = ${JSON.stringify(cssContent)};
            (document.head || document.documentElement).appendChild(style);
          })();\n\n`;

          // Вставляем CSS после Tampermonkey заголовков
          const lines = jsContent.split('\n');
          let insertIndex = 0;
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].trim() === '// ==/UserScript==') {
              insertIndex = i + 1;
              break;
            }
          }

          if (insertIndex > 0) {
            lines.splice(insertIndex, 0, '', '', ...cssCode.split('\n'));
            jsContent = lines.join('\n');
            fs.writeFileSync(jsPath, jsContent);
            console.log('[css-inline] Embedded ' + cssFiles.length + ' CSS files into JS bundle');
          } else {
            // Если не нашли заголовки, просто добавляем в начало
            jsContent = cssCode + jsContent;
            fs.writeFileSync(jsPath, jsContent);
            console.log('[css-inline] Embedded ' + cssFiles.length + ' CSS files at the beginning of JS bundle');
          }
        }
      }
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        // Disable run-time checks in production
        dev: false,
        // Встроить CSS в компоненты
        css: 'injected',
        // Svelte 5 component API
        compatibility: {
          componentApi: 5,
        },
      }
    }),
    tampermonkeyHeaders(),
    cssInlinePlugin()
  ],
  build: {
    outDir: 'dist',
    lib: {
      entry: './src/main.js',
      name: 'HuEvaFlowEnhancer',
      formats: ['iife'], // Immediately Invoked Function Expression for Tampermonkey
      fileName: (format) => `evateam-workflow-enhance.user.js`
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {}
      }
    },
    minify: 'terser',
    // Отключаем CSS-хеширование и отдельные файлы
    cssCodeSplit: false,
  },
  define: {
    // Define constants for build environment
    'process.env.NODE_ENV': JSON.stringify('production')
  }
});