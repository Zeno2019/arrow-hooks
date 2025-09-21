// TOC Debug Script - 在浏览器控制台中运行
// 用于检查当前TOC的DOM结构和行为

console.debug('=== TOC Debug Script ===');

// 1. 查找TOC相关元素
const tocElements = [
  ...document.querySelectorAll('[data-toc]'),
  ...document.querySelectorAll('.toc'),
  ...document.querySelectorAll('[class*="toc"]'),
  ...document.querySelectorAll('[class*="table-of-contents"]'),
  ...document.querySelectorAll('nav[aria-label*="目录"]'),
  ...document.querySelectorAll('nav[aria-label*="Table"]'),
];

console.debug('Found TOC elements:', tocElements);

// 2. 查找TOC链接
const tocLinks = document.querySelectorAll('a[href^="#"]');
console.debug('Found TOC links:', tocLinks);

// 3. 查找页面标题元素
const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
console.debug('Found headings:', headings);

// 4. 测试手动滚动到第一个标题
if (headings.length > 1) {
  const firstHeading = headings[1]; // 跳过主标题
  console.debug('Testing scroll to:', firstHeading);

  // 测试scrollIntoView
  firstHeading.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });

  console.debug('Manual scroll test completed');
}

// 5. 监听TOC点击事件（调试用）
tocLinks.forEach((link, index) => {
  link.addEventListener('click', (e) => {
    console.debug(`TOC link ${index} clicked:`, {
      href: link.href,
      hash: link.hash,
      defaultPrevented: e.defaultPrevented,
      target: e.target,
    });
  });
});

console.debug('TOC debug setup completed. Click any TOC link to see debug info.');
