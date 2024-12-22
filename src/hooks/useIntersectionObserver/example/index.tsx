import React, { useRef, useState, useCallback } from 'react';
import useIntersectionObserver from '../index';

const IntersectionObserverExample = () => {
  return (
    <div>
      <h2>Intersection Observer Examples</h2>

      {/* 元素可见性跟踪示例 */}
      <section>
        <h3>1. 元素可见性跟踪</h3>
        <VisibilityTrackingExample />
      </section>

      {/* 图片懒加载示例 */}
      <section style={{ marginBottom: '2rem' }}>
        <h3>2. 图片懒加载</h3>
        <LazyImageExample />
      </section>
    </div>
  );
};

// 图片懒加载组件
const LazyImageExample = () => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
    const entry = entries[0];

    if (entry.isIntersecting && !isLoaded) {
      if (imageRef.current) {
        imageRef.current.src = 'https://picsum.photos/800/400';
        setIsLoaded(true);
      }
    }
  }, [isLoaded]);

  useIntersectionObserver(imageRef, handleIntersect);

  return (
    <div>
      <p>👇 向下滚动查看图片加载效果</p>
      <div style={{ minHeight: '400px' }}>
        <img
          ref={imageRef}
          alt="Lazy loaded"
          style={{
            width: '100%',
            height: '400px',
            backgroundColor: '#f0f0f0',
            transition: 'opacity 0.3s',
            opacity: isLoaded ? 1 : 0,
          }}
        />
      </div>
    </div>
  );
};

// 元素可见性跟踪组件
const VisibilityTrackingExample = () => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
    const entry = entries[0];

    setIsVisible(entry.isIntersecting);
  }, []);

  useIntersectionObserver(elementRef, handleIntersect, {
    threshold: 0.5, // 当元素50%可见时触发
  });

  return (
    <div style={{ marginTop: '40vh', marginBottom: '40vh' }}>
      <p>👇 向下滚动查看元素状态变化</p>
      <div
        ref={elementRef}
        style={{
          padding: '2rem',
          margin: '1rem 0',
          backgroundColor: isVisible ? '#e6f7ff' : '#f0f0f0',
          border: `2px solid ${isVisible ? '#1890ff' : '#d9d9d9'}`,
          borderRadius: '4px',
          transition: 'all 0.3s',
        }}
      >
        <h4 style={{ margin: 0 }}>观察元素</h4>
        <p style={{ margin: '0.5rem 0 0' }}>
          状态: {isVisible ? '✨ 可见' : '🔲 不可见'}
        </p>
      </div>
    </div>
  );
};

export default IntersectionObserverExample;