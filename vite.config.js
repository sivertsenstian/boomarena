import { defineConfig } from 'vite';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';
// https://vitejs.dev/config/
export default defineConfig({
    base: '/',
    plugins: [wasm(), topLevelAwait()],
    resolve: {
        alias: [{ find: '@', replacement: '/src' }],
    },
    server: {
        host: '0.0.0.0',
        hmr: {
            clientPort: 1337,
        },
        port: 1337,
        watch: {
            usePolling: true,
        },
    },
});
