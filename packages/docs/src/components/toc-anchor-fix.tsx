'use client';

import { useEffect } from 'react';

export function TOCAnchorFix() {
  useEffect(() => {
    const handleTOCClick = (event: Event) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a[href^="#"]');

      if (link) {
        // 更广泛地检查是否为 TOC 链接
        const tocContainer = link.closest(
          '[data-toc], .fd-toc, nav, aside, [class*="toc"], [class*="TOC"]',
        );

        // 或者检查链接是否在右侧（通常TOC在右侧）
        const linkRect = link.getBoundingClientRect();
        const isOnRight = linkRect.left > window.innerWidth * 0.6;

        if (tocContainer || isOnRight) {
          const href = link.getAttribute('href');
          if (href?.startsWith('#')) {
            event.preventDefault();

            console.debug('TOC 链接被点击:', href);

            // 解码URL编码的hash
            const hash = decodeURIComponent(href.substring(1));
            let targetElement = document.getElementById(hash);

            // 如果找不到确切匹配，尝试其他方法
            if (!targetElement) {
              // 尝试原始href（不解码）
              targetElement = document.getElementById(href.substring(1));
            }

            if (!targetElement) {
              // 尝试查找对应的标题元素
              const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
              for (const heading of headings) {
                const headingText = heading.textContent?.trim();
                const headingId = heading.id;

                if (
                  headingText === hash ||
                  headingId === hash ||
                  headingText?.includes(hash) ||
                  hash.includes(headingText || '')
                ) {
                  targetElement = heading as HTMLElement;
                  console.debug('找到标题匹配:', headingText, headingId);
                  break;
                }
              }
            }

            if (targetElement) {
              console.debug('滚动到目标元素:', targetElement);
              // 添加一个小的延迟以确保页面布局稳定
              setTimeout(() => {
                const offset = 80; // 考虑固定头部的偏移
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;

                window.scrollTo({
                  top: offsetPosition,
                  behavior: 'smooth',
                });

                // 更新URL hash
                window.history.replaceState(null, '', href);
              }, 100);
            } else {
              console.warn('TOC 锚点目标未找到:', hash);
              console.debug(
                '当前页面的所有ID:',
                Array.from(document.querySelectorAll('[id]')).map((el) => el.id),
              );
              console.debug(
                '当前页面的所有标题:',
                Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6')).map((el) => ({
                  text: el.textContent,
                  id: el.id,
                })),
              );
            }
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
