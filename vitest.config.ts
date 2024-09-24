import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      config: path.resolve(__dirname, './config'),
      components: path.resolve(__dirname, './components'),
      lib: path.resolve(__dirname, './lib'),
      styles: path.resolve(__dirname, './styles'),
      types: path.resolve(__dirname, './types'),
    },
  },
});
