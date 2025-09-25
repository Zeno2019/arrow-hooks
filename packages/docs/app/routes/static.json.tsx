export default function StaticJson() {
  // fumadocs 搜索索引数据格式
  const indexes = [
    {
      _id: '/',
      title: '开始使用',
      url: '/',
      structured: {
        headings: [
          {
            id: 'getting-started',
            content: '开始使用',
            level: 1,
          },
        ],
        contents: [
          {
            heading: '开始使用',
            content: 'Arrow Hooks - 一个实用的 React Hooks 集合，专注于提供高质量、类型安全的 React Hooks',
          },
        ],
      },
    },
    {
      _id: '/hooks/use-cookie',
      title: 'useCookie',
      url: '/hooks/use-cookie',
      structured: {
        headings: [
          {
            id: 'use-cookie',
            content: 'useCookie',
            level: 1,
          },
          {
            id: 'api',
            content: 'API 参考',
            level: 2,
          },
        ],
        contents: [
          {
            heading: 'useCookie',
            content: '用于操作浏览器 Cookie 的 React Hook，提供类型安全的 Cookie 读写功能',
          },
          {
            heading: 'API 参考',
            content: 'useCookie API 接口文档和使用方法',
          },
        ],
      },
    },
  ];

  return new Response(JSON.stringify(indexes), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}