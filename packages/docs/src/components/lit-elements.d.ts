// Lit-element 组件类型声明集中管理
// 用于为所有自定义元素提供 TypeScript 类型支持

import type { LitThemeSwitcher } from './examples/lit-theme-switcher';

declare global {
  interface HTMLElementTagNameMap {
    'lit-theme-switcher': LitThemeSwitcher;
    // 后续添加更多 lit-element 组件类型声明
  }
}
