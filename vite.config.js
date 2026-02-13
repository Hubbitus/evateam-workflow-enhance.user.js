const { defineConfig } = require('vite');
const { svelte } = require('@sveltejs/vite-plugin-svelte');

// https://vitejs.dev/config/
module.exports = defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        // Enable run-time checks in development
        dev: true,
        // Generate a CSS file during component compilation
        css: false
      }
    })
  ],
  root: 'dev', // Serve from the dev directory for development
  server: {
    port: 3000,
    open: true,
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..'],
      // Serve files from both dev and root directories
      strict: false
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
