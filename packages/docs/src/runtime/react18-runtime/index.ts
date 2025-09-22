// React 18 Runtime 入口文件
// 专门为 lit-element 提供 React 18 环境

// 重新导出 React 18 的 createRoot
export { createRoot } from 'react-dom/client'

// 导出 React 18 的核心模块
export { default as React } from 'react'

// 导出具体的演示组件
export { ThemeSwitcherDemo as Demo } from './theme-switcher'