/**
 * Examples 组件汇总
 * 这里导出所有 hooks 的示例组件，方便在文档页面中使用
 */

// Hook 示例组件
export { CookieDemo } from './cookie-demo';
export { ThemeSwitcherExample } from './theme-switcher-example';

// Lit-element Runtime 隔离组件 - 移除SSR导入，改为动态导入
// 注释掉：import './lit-theme-switcher';
export { LitComponent } from '@/components/lit-wrapper';

// 可以在这里添加更多的示例组件
// export { EventListenerDemo } from './event-listener-demo';
// export { HoverDemo } from './hover-demo';
// export { MediaQueryDemo } from './media-query-demo';
// export { WindowSizeDemo } from './window-size-demo';