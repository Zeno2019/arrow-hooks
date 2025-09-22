import React from "react";
import { createRoot as _createRoot, type Root } from "react-dom/client";

// React18 的基本导出
export { React };
export type { Root };

// 重新导出createRoot，确保使用React 18版本
export const createRoot = _createRoot;

// 一个简单的渲染函数（够用了）
export function render(element: React.ReactElement, container: HTMLElement): Root {
  const root = createRoot(container);
  root.render(element);
  return root;
}

// 工厂函数：把 hook + 渲染器组合成组件
export function createHookComponent<T extends Record<string, any>>(
  hook: (props: T) => any,
  render: (hookResult: any, props: T) => React.ReactElement
) {
  return (props: T) => {
    const result = hook(props);
    return render(result, props);
  };
}