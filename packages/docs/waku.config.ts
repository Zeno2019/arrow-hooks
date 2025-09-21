import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import mdx from 'fumadocs-mdx/vite';
import { defineConfig } from 'waku/config';
import * as MdxConfig from './source.config';

export default defineConfig({
  vite: {
    plugins: [tailwindcss() as any, mdx(MdxConfig)],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
        '~': path.resolve(import.meta.dirname, '.'),
      },
    },
  },
});
