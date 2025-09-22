'use client';

import React, { useEffect, useRef } from 'react';

interface LitComponentProps {
  tagName: string;
  [key: string]: any;
}

export function LitComponent({ tagName, ...props }: LitComponentProps) {
  const ref = useRef<HTMLElement>(null);

  console.log('🔧 LitComponent: 渲染', { tagName, props });

  useEffect(() => {
    console.log('🔧 LitComponent: useEffect', { ref: ref.current, tagName });

    // 动态导入lit组件确保在客户端注册
    if (tagName === 'lit-theme-switcher') {
      import('@/components/examples/lit-theme-switcher').then(() => {
        console.log('🔧 LitComponent: lit-theme-switcher 组件已导入');
      }).catch(err => {
        console.error('🔧 LitComponent: lit组件导入失败', err);
      });
    }

    if (ref.current) {
      console.log('🔧 LitComponent: 设置属性', props);
      Object.entries(props).forEach(([key, value]) => {
        if (key !== 'children') {
          (ref.current as any)[key] = value;
          console.log(`🔧 LitComponent: 设置属性 ${key} =`, value);
        }
      });
    }
  }, [props, tagName]);

  const element = React.createElement(tagName, {
    ref,
    style: {
      display: 'block',
      border: '3px solid blue', // 调试：确保wrapper可见
      padding: '10px',
      margin: '10px'
    }
  });

  console.log('🔧 LitComponent: 创建元素', element);
  return element;
}