'use client';

import React, { useEffect, useRef, useState } from 'react';

interface MdxLitBridgeProps {
  tagName: string;
  [key: string]: any;
}

/**
 * MDX到Lit-Element桥接组件
 * 用于在MDX(React 19)环境中使用lit-element组件
 * 主要处理：组件动态导入、属性传递、客户端渲染
 */
export function MdxLitBridge({ tagName, ...props }: MdxLitBridgeProps) {
  const ref = useRef<HTMLElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // 确保只在客户端运行
    setIsClient(true);

    // 动态导入lit组件确保在客户端注册
    if (tagName === 'lit-theme-switcher') {
      import('@/components/examples/lit-theme-switcher').catch((err) => {
        console.error('lit组件导入失败:', err);
      });
    }

    // 设置lit-element属性
    if (ref.current) {
      Object.entries(props).forEach(([key, value]) => {
        if (key !== 'children') {
          (ref.current as any)[key] = value;
        }
      });
    }
  }, [props, tagName]);

  // 只在客户端渲染自定义元素
  if (!isClient) {
    return <div>Loading...</div>;
  }

  return React.createElement(tagName, { ref });
}

// 向后兼容的别名
export const LitComponent = MdxLitBridge;
