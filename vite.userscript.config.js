const { defineConfig } = require('vite');
const { svelte } = require('@sveltejs/vite-plugin-svelte');
const tampermonkeyHeaderPlugin = require('./plugins/tampermonkey-header-plugin.js');

// https://vitejs.dev/config/
module.exports = defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        // Disable run-time checks in production
        dev: false,
        // Generate a CSS file during component compilation
        css: false
      }
    }),
    tampermonkeyHeaderPlugin()
  ],
  build: {
    lib: {
      entry: './src/main.js',
      name: 'HuEvaFlowEnhancer',
      formats: ['iife'], // Immediately Invoked Function Expression for Tampermonkey
      fileName: 'evateam-workflow-enhance.user.js'
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
