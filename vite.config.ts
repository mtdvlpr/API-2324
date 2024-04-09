import { defineConfig } from 'vite'
import eslint from 'vite-plugin-eslint'
import legacy from '@vitejs/plugin-legacy'
import path from 'node:path'
const __dirname = import.meta.dirname

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    eslint({ exclude: ['**/node_modules/**', '**/dist/**', '**/*.min.*'] }),
    legacy(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@styles': path.resolve(__dirname, 'src/assets/css'),
    },
  },
  build: {
    minify: false,
    manifest: true,
    emptyOutDir: true,
    outDir: 'dist',
    rollupOptions: {
      input: path.resolve(__dirname, 'src/assets/js/main.js'),
    },
  },
})
