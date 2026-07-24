import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve the directory of this config file
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The actual source lives two levels up inside the main frontend tree.
// We use Vite's `root` option so we don't need to copy any files.
const sourceRoot = path.resolve(__dirname, '../../frontend/src/pages/admission');

export default defineConfig({
  // Vite will treat this path as the project root (where index.html lives)
  root: sourceRoot,

  plugins: [react()],

  server: {
    port: 5174,
    host: true,
    allowedHosts: true,
    // Proxy API calls to the backend — keeps axios baseURL clean in dev
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },

  build: {
    // Output goes to packages/admission-portal/dist (not inside the frontend tree)
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },

  resolve: {
    alias: {
      // Allow absolute imports starting with '@' from within the admission src
      '@': path.resolve(sourceRoot, 'src'),
    },
  },
});
