# Arrow Hooks

> 一个实用的 React Hooks 集合。

[中文](#中文) | [English](#english)

## 中文

### 特性

- 🎯 专注于实用性
- 📦 基于 Vite 构建
- ✅ Vitest 单元测试
- 🔷 TypeScript 支持
- 🚀 支持 ESM
- ⚙️ 目前仅支持客户端渲染（SSR 支持正在计划中）

### 安装

```bash
# pnpm (推荐)
pnpm add arrow-hooks

# npm
npm install arrow-hooks
```

### 项目结构

```
src/
  hooks/                # hooks 目录
    useKeyboardEvent/   # 每个 hook 都是独立的目录
      index.ts         # hook 实现
      __tests__/       # 测试文件夹
        index.test.ts  # 测试文件
      example/         # 示例文件夹
        index.tsx      # 示例组件
  App.tsx              # 示例入口
  index.ts             # 库入口
```

### 使用方法

启动后查看未注释示例

### 开发

```bash
# 安装依赖
pnpm install

# 运行示例
pnpm dev

# 运行测试
pnpm test

# 构建
pnpm build
```

### 注意事项

- 当前版本暂不支持服务端渲染（SSR）
- 后续版本将添加 SSR 支持
- 所有的 hooks 都经过单元测试验证

### License

MIT

## English

### Features

- 🎯 Focus on utility
- 📦 Built with Vite
- ✅ Unit testing with Vitest
- 🔷 TypeScript support
- 🚀 ESM support
- ⚙️ Currently only supports client-side rendering (SSR support is planned)

### Installation

```bash
# pnpm (recommended)
pnpm add arrow-hooks

# npm
npm install arrow-hooks
```

### Project structure

```
src/
  hooks/                # hooks directory
    useKeyboardEvent/   # Each hook is an independent directory
      index.ts         # Hook implementation
      __tests__/       # Test folder
        index.test.ts  # Test file
      example/         # Example folder
        index.tsx      # Example component
  App.tsx              # Example entry point
  index.ts             # Library entry point
```

### Usage

After starting, view the unannotated example

### Development

```bash
# Install dependencies
pnpm install

# Run example
pnpm dev

# Run tests
pnpm test

# Build
pnpm build
```

### Notes

- Current version does not support server-side rendering (SSR)
- Future versions will add SSR support
- All hooks are tested with unit tests

### License

MIT