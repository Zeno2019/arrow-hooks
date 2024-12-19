# Arrow Hooks

一个现代化的 React Hooks 工具库，提供了一系列实用的自定义 Hooks。使用 TypeScript 编写，基于 Vite 构建。

## 技术栈

- ⚛️ React 18+
- 📦 Vite
- ✅ Vitest
- 🔷 TypeScript
- 📘 完整类型定义
- 🚀 完全支持 ESM
- ⚡️ 极致轻量

## 安装

```bash
# pnpm
pnpm add arrow-hooks

# npm
npm install arrow-hooks

# yarn
yarn add arrow-hooks
```

## 使用方法

```typescript
import { useExample } from 'arrow-hooks';

function MyComponent() {
  const result = useExample();
  return <div>{result}</div>;
}
```

## 开发

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 运行测试
pnpm test

# 测试覆盖率
pnpm coverage

# 类型检查
pnpm type-check

# 构建
pnpm build
```

## 项目结构

```
arrow-hooks/
├── src/
│   ├── hooks/       # hooks 源码
│   ├── __tests__/   # 测试文件
│   └── index.ts     # 入口文件
├── examples/        # 使用示例
├── dist/           # 构建输出
└── ...配置文件
```

## 许可
本项目遵循 MIT 许可证 - 详情请参阅 LICENSE 文件。
