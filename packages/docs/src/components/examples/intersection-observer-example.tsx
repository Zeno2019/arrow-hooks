import React, { useCallback, useRef, useState } from 'react';
import { useIntersectionObserver } from 'arrow-hooks';

export function IntersectionObserverExample() {
  return (
    <div style={{ padding: '1rem', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
      <h4 style={{ margin: '0 0 1rem 0' }}>useIntersectionObserver 演示</h4>

      {/* 元素可见性跟踪示例 */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h5>👁️ 元素可见性跟踪</h5>
        <VisibilityTrackingExample />
      </div>

      {/* 图片懒加载示例 */}
      <div>
        <h5>🖼️ 图片懒加载</h5>
        <LazyImageExample />
      </div>
    </div>
  );
}

// 元素可见性跟踪组件
function VisibilityTrackingExample() {
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
    <div>
      <p style={{ fontSize: '0.875rem', color: '#666' }}>
        👇 向下滚动查看元素状态变化
      </p>
      <div style={{ height: '30vh' }}></div>
      <div
        ref={elementRef}
        style={{
          padding: '2rem',
          margin: '1rem 0',
          backgroundColor: isVisible ? '#e6f7ff' : '#f0f0f0',
          border: `2px solid ${isVisible ? '#1890ff' : '#d9d9d9'}`,
          borderRadius: '8px',
          transition: 'all 0.3s ease',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
          {isVisible ? '👁️' : '👁️‍🗨️'}
        </div>
        <h4 style={{ margin: '0 0 0.5rem 0' }}>观察目标元素</h4>
        <p style={{ margin: 0, color: isVisible ? '#1890ff' : '#666' }}>
          状态: {isVisible ? '✨ 可见 (50%+)' : '🔲 不可见'}
        </p>
      </div>
      <div style={{ height: '30vh' }}></div>
    </div>
  );
}

// 图片懒加载组件
function LazyImageExample() {
  const imageRef = useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];

      if (entry.isIntersecting && !isLoaded) {
        if (imageRef.current) {
          imageRef.current.src = 'https://picsum.photos/800/400';
          setIsLoaded(true);
        }
      }
    },
    [isLoaded],
  );

  useIntersectionObserver(imageRef, handleIntersect);

  return (
    <div>
      <p style={{ fontSize: '0.875rem', color: '#666' }}>
        👇 向下滚动查看图片懒加载效果
      </p>
      <div style={{ height: '50vh' }}></div>
      <div
        style={{
          width: '100%',
          height: '400px',
          backgroundColor: '#f0f0f0',
          border: '2px dashed #d9d9d9',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {!isLoaded && (
          <div style={{ textAlign: 'center', color: '#999' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📷</div>
            <div>图片将在进入视窗时加载</div>
          </div>
        )}
        <img
          ref={imageRef}
          alt="懒加载图片"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.5s ease',
            position: isLoaded ? 'static' : 'absolute',
          }}
        />
      </div>
      <div style={{ height: '30vh' }}></div>
    </div>
  );
}