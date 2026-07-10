import preact from '@preact/preset-vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [preact()],
  build: {
    codeSplitting: false,
    copyPublicDir: false,
    emptyOutDir: false,
    lib: {
      entry: 'src/directors-admin-app.jsx',
      fileName: 'directors-admin-app',
      formats: ['es']
    },
    outDir: 'assets',
    rollupOptions: {
      output: {
        entryFileNames: 'directors-admin-app.js'
      }
    }
  }
});
