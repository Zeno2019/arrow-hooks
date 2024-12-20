import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src/hooks/**/*.ts', 'src/hooks/**/*.tsx', 'src/index.ts'],
      exclude: ['src/hooks/**/example/**', 'src/hooks/**/__tests__/**'],
      rollupTypes: true,
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ArrowHooks',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : format}`,
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
    },
  },
});
