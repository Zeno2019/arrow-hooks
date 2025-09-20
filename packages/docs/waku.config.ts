import mdx from 'fumadocs-mdx/vite';
import { defineConfig } from 'waku/config';
import * as MdxConfig from './source.config';

export default defineConfig({
  vite: {
    plugins: [mdx(MdxConfig)],
  },
});
