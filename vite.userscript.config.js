const { defineConfig } = require('vite');
const { svelte } = require('@sveltejs/vite-plugin-svelte');

// https://vitejs.dev/config/
module.exports = defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        // Enable run-time checks when not in production
        dev: false,
        // Generate a CSS file during component compilation
        css: false
      }
    })
  ],
  build: {
    lib: {
      entry: './src/main.js',
      name: 'HuEvaFlowEnhancer',
      formats: ['iife'], // Immediately Invoked Function Expression for Tampermonkey
      fileName: 'evateam-workflow-enhance'
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
