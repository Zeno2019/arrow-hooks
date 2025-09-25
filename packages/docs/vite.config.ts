import path from 'node:path';
import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import mdx from 'fumadocs-mdx/vite';
import { defineConfig } from 'vite';
import * as MdxConfig from './source.config';

export default defineConfig({
  plugins: [reactRouter(), tailwindcss(), mdx(MdxConfig)],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
      '~': path.resolve(import.meta.dirname, '.'),
      'arrow-hooks': path.resolve(import.meta.dirname, '../core/src'),
    },
  },
  optimizeDeps: {
    exclude: ['fsevents', 'lightningcss', 'fumadocs-mdx/vite'],
  },

  // 明确的 SPA 模式配置
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },

  // 开发服务器配置
  server: {
    hmr: true,
  },
});
