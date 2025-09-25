import { docs } from '../../source.generated';

// 页面树结构（来自之前的 page-tree.ts）
const pageTree = {
  name: 'Arrow Hooks',
  children: [
    {
      type: 'page' as const,
      name: '开始使用',
      url: '/',
    },
    {
      type: 'folder' as const,
      name: '状态管理',
      children: [
        {
          type: 'page' as const,
          name: 'useCookie',
          url: '/hooks/use-cookie',
        },
      ],
    },
  ],
};

// 创建完整的 fumadocs source 对象
export const source = {
  // 保留原有的 docs 功能
  ...docs,

  // 实现 LoaderOutput 接口的必要方法
  getPages: () => {
    // 返回所有页面的数组，格式符合 fumadocs 要求
    return [
      {
        url: '/',
        slugs: [],
        data: {
          title: '开始使用',
          description: 'Arrow Hooks - 一个实用的 React Hooks 集合，专注于提供高质量、类型安全的 React Hooks',
          structuredData: {
            headings: [
              { id: 'getting-started', content: '开始使用', level: 1 },
              { id: 'introduction', content: '介绍', level: 2 },
            ],
            contents: [
              {
                heading: 'getting-started',
                content: 'Arrow Hooks - 一个实用的 React Hooks 集合，专注于提供高质量、类型安全的 React Hooks。我们致力于提供易用、高效的 React Hooks 工具库。'
              },
              {
                heading: 'introduction',
                content: '本库包含各种实用的 React Hooks，包括状态管理、副作用处理、数据获取等常见场景的解决方案。'
              },
            ],
          },
        },
      },
      {
        url: '/hooks/use-cookie',
        slugs: ['hooks', 'use-cookie'],
        data: {
          title: 'useCookie',
          description: '用于操作浏览器 Cookie 的 React Hook，提供类型安全的 Cookie 读写功能，支持完整的 Cookie 选项配置',
          structuredData: {
            headings: [
              { id: 'usecookie', content: 'useCookie', level: 1 },
              { id: 'usage', content: '使用方法', level: 2 },
              { id: 'api', content: 'API 参考', level: 2 },
            ],
            contents: [
              {
                heading: 'usecookie',
                content: 'useCookie 是一个用于操作浏览器 Cookie 的 React Hook，提供类型安全的 Cookie 读写功能。'
              },
              {
                heading: 'usage',
                content: '支持完整的 Cookie 选项配置，包括过期时间、域名、路径等设置。可以方便地读取、设置和删除 Cookie。'
              },
              {
                heading: 'api',
                content: '提供 getCookie、setCookie、removeCookie 等方法，支持 TypeScript 类型推断。'
              },
            ],
          },
        },
      },
    ];
  },

  getPageTree: () => {
    return pageTree;
  },

  getPageByHref: (href: string) => {
    const pages = source.getPages();
    return pages.find(page => page.url === href) || null;
  },

  getPage: (slugs: string[]) => {
    const url = slugs.length === 0 ? '/' : `/${slugs.join('/')}`;
    return source.getPageByHref(url);
  },

  getLanguages: () => {
    // 返回单语言配置
    return [{ language: 'zh-CN', pages: source.getPages() }];
  },

  // 其他可能需要的方法
  getNodeFromHref: (href: string) => {
    return source.getPageByHref(href);
  },

  getNodePage: (slugs: string[]) => {
    return source.getPage(slugs);
  },

  getNodeMeta: (_slugs: string[]) => {
    // 返回页面的元数据，通常来自 _meta.json 文件
    return null;
  },

  generateParams: () => {
    // 生成路由参数，返回所有可能的路由组合
    return [
      { slug: [] }, // 首页
      { slug: ['hooks', 'use-cookie'] }, // useCookie 页面
    ];
  },

  // 提供访问页面树的方法
  pageTree,
};
