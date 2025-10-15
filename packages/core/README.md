# Arrow Hooks

[中文](#中文) | [English](#english)

## 中文

> 一个实用的 React Hooks 集合，专注于提供高质量、类型安全的 React Hooks

### 在线文档

- 访问地址：[arrow-hooks-docs.pages.dev](https://arrow-hooks-docs.pages.dev)（暂时仅支持中文）

### 特性

- 🎯 **专注于实用性** - 聚焦于实际项目中的高频功能需求
- 📦 **基于 Vite 构建** - 提供快速的开发体验和优化产物
- ✅ **Vitest 单元测试** - 每个 Hook 都经过完整的测试验证
- 🔷 **TypeScript 支持** - 内置完善的类型定义和类型推断
- 🚀 **ESM 支持** - 现代化模块系统，支持 Tree Shaking
- ⚙️ **客户端优先** - 当前聚焦客户端渲染（SSR 支持正在计划中）

### Hook 列表

#### DOM 操作
- [useEventListener](https://arrow-hooks-docs.pages.dev/hooks/use-event-listener) - 类型安全的 DOM 事件监听器
- [useHover](https://arrow-hooks-docs.pages.dev/hooks/use-hover) - 检测元素悬停状态
- [useResizeObserver](https://arrow-hooks-docs.pages.dev/hooks/use-resize-observer) - 监听 DOM 元素尺寸变化
- [useIntersectionObserver](https://arrow-hooks-docs.pages.dev/hooks/use-intersection-observer) - 监听元素可见性变化

#### BOM 操作
- [useWindowSize](https://arrow-hooks-docs.pages.dev/hooks/use-window-size) - 监听窗口尺寸变化
- [useMediaQuery](https://arrow-hooks-docs.pages.dev/hooks/use-media-query) - 响应媒体查询变化

#### 存储与数据
- [useCookie](https://arrow-hooks-docs.pages.dev/hooks/use-cookie) - 操作浏览器 Cookie

#### 多媒体与交互
- [useKeyboardEvent](https://arrow-hooks-docs.pages.dev/hooks/use-keyboard-event) - 处理键盘事件
- [useInfiniteScroll](https://arrow-hooks-docs.pages.dev/hooks/use-infinite-scroll) - 实现无限滚动

### 开发进度 :rocket:

当前开发状态：

- [x] 基础 Hook 实现
- [x] TypeScript 类型定义
- [x] 单元测试覆盖
- [x] 文档站搭建
- [x] 丰富的 Hook 集合
- [ ] SSR 支持计划

### 快速开始

安装依赖：

```bash
pnpm add arrow-hooks
```

基础使用示例：

```tsx
import { useCookie, useWindowSize } from 'arrow-hooks'

function App() {
  const [theme, setTheme] = useCookie('theme', 'light')
  const { width, height } = useWindowSize()

  return (
    <div>
      <p>当前主题: {theme}</p>
      <p>窗口尺寸: {width} × {height}</p>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        切换主题
      </button>
    </div>
  )
}
```

### 开发理念

Arrow Hooks 专注于：

- **实用性优先** - 收录在真实项目高频场景下的 Hook
- **质量保证** - 每个 Hook 都拥有完善的测试覆盖
- **类型安全** - 提供完整的 TypeScript 支持
- **开箱即用** - 简单一致的 API 设计，即插即用

---

## English

> A practical React hooks collection focused on high-quality, type-safe utilities

### Documentation

- Visit: [arrow-hooks-docs.pages.dev](https://arrow-hooks-docs.pages.dev) (currently available in Chinese only)

### Features

- 🎯 **Utility-focused** – Targets high-frequency needs from real-world projects
- 📦 **Built with Vite** – Delivers fast development feedback and optimized bundles
- ✅ **Vitest coverage** – Every hook ships with comprehensive unit tests
- 🔷 **TypeScript ready** – Includes complete type definitions and inference
- 🚀 **ESM support** – Modern module format with Tree Shaking capability
- ⚙️ **Client-first** – Currently focuses on client rendering (SSR support is planned)

### Hook Catalog

#### DOM Utilities
- [useEventListener](https://arrow-hooks-docs.pages.dev/hooks/use-event-listener) – Type-safe DOM event listener
- [useHover](https://arrow-hooks-docs.pages.dev/hooks/use-hover) – Track an element’s hover state
- [useResizeObserver](https://arrow-hooks-docs.pages.dev/hooks/use-resize-observer) – Observe element size changes
- [useIntersectionObserver](https://arrow-hooks-docs.pages.dev/hooks/use-intersection-observer) – Monitor element visibility

#### Browser APIs
- [useWindowSize](https://arrow-hooks-docs.pages.dev/hooks/use-window-size) – Watch window size changes
- [useMediaQuery](https://arrow-hooks-docs.pages.dev/hooks/use-media-query) – React to media query updates

#### Storage & Data
- [useCookie](https://arrow-hooks-docs.pages.dev/hooks/use-cookie) – Work with browser cookies

#### Media & Interaction
- [useKeyboardEvent](https://arrow-hooks-docs.pages.dev/hooks/use-keyboard-event) – Handle keyboard interactions
- [useInfiniteScroll](https://arrow-hooks-docs.pages.dev/hooks/use-infinite-scroll) – Build infinite scrolling experiences

### Development Progress :rocket:

Current status:

- [x] Core hook implementations
- [x] TypeScript typings
- [x] Unit test coverage
- [x] Documentation site
- [x] Rich hook catalog
- [ ] Planned SSR support

### Quick Start

Install:

```bash
pnpm add arrow-hooks
```

Example usage:

```tsx
import { useCookie, useWindowSize } from 'arrow-hooks'

function App() {
  const [theme, setTheme] = useCookie('theme', 'light')
  const { width, height } = useWindowSize()

  return (
    <div>
      <p>Theme: {theme}</p>
      <p>Viewport: {width} × {height}</p>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle theme
      </button>
    </div>
  )
}
```

### Philosophy

Arrow Hooks is committed to:

- **Pragmatic utility** – Hooks curated from real-world scenarios
- **Assured quality** – Each hook is backed by thorough testing
- **Type safety** – Full TypeScript support out of the box
- **Plug-and-play APIs** – Simple, consistent APIs for quick adoption

### License

MIT
