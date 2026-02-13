import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tampermonkeyHeaders from './plugins/tampermonkey-header-plugin.js';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        // Disable run-time checks in production
        dev: false,
        // Use 'external' instead of false for css option in Svelte 5
        css: 'external'
      }
    }),
    tampermonkeyHeaders()
  ],
  build: {
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
    minify: 'terser'
  },
  define: {
    // Define constants for build environment
    'process.env.NODE_ENV': JSON.stringify('production')
  }
});