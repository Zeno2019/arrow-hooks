import { defineConfig, defineDocs } from 'fumadocs-mdx/config';
import remarkEmoji from 'remark-emoji';
import remarkGfm from 'remark-gfm';

export const docs = defineDocs({
  dir: 'src/content',
});

export default defineConfig({
  mdxOptions: {
    // 使用函数形式保留默认插件并添加自定义插件
    remarkPlugins: (v) => [
      ...v,
      remarkGfm, // GitHub风格Markdown：表格、删除线、任务列表、自动链接
      remarkEmoji, // Emoji支持 :smile: -> 😊
    ],
    rehypePlugins: (v) => [...v],
    // 启用代码选项卡功能 - 这个选项配置 remarkCodeTab 插件
    remarkCodeTabOptions: {
      parseMdx: true,
    },
    // 自定义内置插件选项
    rehypeCodeOptions: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
});
