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
      type: 'folder',
      name: 'DOM',
      children: [
        {
          type: 'page',
          name: 'useEventListener',
          url: '/hooks/use-event-listener',
        },
        {
          type: 'page',
          name: 'useHover',
          url: '/hooks/use-hover',
        },
        {
          type: 'page',
          name: 'useKeyboardEvent',
          url: '/hooks/use-keyboard-event',
        },
        {
          type: 'page',
          name: 'useIntersectionObserver',
          url: '/hooks/use-intersection-observer',
        },
        {
          type: 'page',
          name: 'useResizeObserver',
          url: '/hooks/use-resize-observer',
        },
      ],
    },
    {
      type: 'folder',
      name: 'BOM',
      children: [
        {
          type: 'page',
          name: 'useWindowSize',
          url: '/hooks/use-window-size',
        },
        {
          type: 'page',
          name: 'useMediaQuery',
          url: '/hooks/use-media-query',
        },
      ],
    },
    {
      type: 'folder',
      name: '存储与数据',
      children: [
        {
          type: 'page',
          name: 'useCookie',
          url: '/hooks/use-cookie',
        },
      ],
    },
    {
      type: 'folder',
      name: '异步与性能优化',
      children: [
        {
          type: 'page',
          name: 'useInfiniteScroll',
          url: '/hooks/use-infinite-scroll',
        },
      ],
    },
  ],
};
