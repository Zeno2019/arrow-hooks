import type { Config } from '@react-router/dev/config';

export default {
  // 强制禁用 SSR
  ssr: false,

  // 明确设置为 SPA 模式
  appDirectory: 'app',

  // 设置构建输出目录
  buildDirectory: 'dist',

  // 优化配置
  future: {
    unstable_optimizeDeps: true,
  },

  // 确保没有预渲染
  prerender: false,
} satisfies Config;