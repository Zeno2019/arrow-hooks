import type { PageTree } from 'fumadocs-core/server';

// 按照 fumadocs 官方文档格式的页面树结构
export const pageTree: PageTree.Root = {
  name: 'Arrow Hooks',
  children: [
    {
      type: 'page',
      name: '开始使用',
      url: '/',
    },
    {
      type: 'separator',
      name: 'Hooks 文档',
    },
    {
      type: 'page',
      name: 'useCookie',
      url: '/hooks/use-cookie',
    },
  ],
};