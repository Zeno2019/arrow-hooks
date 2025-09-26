import { defineConfig, defineDocs } from 'fumadocs-mdx/config';

export const docs = defineDocs({
  dir: 'src/content',
});

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [],
    rehypePlugins: [],
    // 启用代码选项卡功能
    remarkCodeTabOptions: {
      parseMdx: true,
    },
  },
});