import path from 'node:path';
import mdx from 'fumadocs-mdx/vite';
import { defineConfig } from 'waku/config';
import * as MdxConfig from './source.config';

export default defineConfig({
  vite: {
    plugins: [mdx(MdxConfig)],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },
  },
});
