const { defineConfig } = require('vite');

// https://vitejs.dev/config/
module.exports = defineConfig({
  root: 'dev', // Serve from the dev directory for development
  server: {
    port: 3000,
    open: true,
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..']
    }
  },
  build: {
    outDir: '../dist',
    rollupOptions: {
      // Externalize SvelteFlow for Tampermonkey usage
      external: [],
      output: {
        globals: {}
      }
    }
  }
});