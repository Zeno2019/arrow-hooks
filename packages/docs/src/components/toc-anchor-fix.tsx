'use client';

import { useEffect } from 'react';

export function TOCAnchorFix() {
  useEffect(() => {
    const handleTOCClick = (event: Event) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a[href^="#"]');

      if (link?.classList.contains('prose')) {
        const href = link.getAttribute('href');
        if (href?.startsWith('#')) {
          event.preventDefault();

          // 解码URL编码的hash
          const hash = decodeURIComponent(href.substring(1));
          const targetElement = document.getElementById(hash);

          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });

            // 更新URL hash（使用编码版本以保持URL正确性）
            window.history.replaceState(null, '', href);
          }
        }
      }
    };

    // 使用事件委托监听整个文档的点击事件
    document.addEventListener('click', handleTOCClick);

    return () => {
      document.removeEventListener('click', handleTOCClick);
    };
  }, []);

  return null; // 这是一个纯功能组件，不渲染任何内容
}
