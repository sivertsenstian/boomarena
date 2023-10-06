import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [],
  resolve: {
    alias: [{ find: '@', replacement: '/src' }],
  },
  server: {
    host: '0.0.0.0',
    hmr: {
      clientPort: 3000,
    },
    port: 3000,
    watch: {
      usePolling: true,
    },
  },
});
