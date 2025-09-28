import React, { useRef, useState } from 'react';
import { useResizeObserver } from 'arrow-hooks';

export function ResizeObserverExample() {
  const [elementSize, setElementSize] = useState({ width: 0, height: 0 });
  const resizableRef = useRef<HTMLDivElement>(null);

  useResizeObserver(resizableRef, (entry) => {
    const { width, height } = entry.contentRect;
    setElementSize({ width, height });
  });

  return (
    <div style={{ padding: '1rem', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
      <h4 style={{ margin: '0 0 1rem 0' }}>useResizeObserver 演示</h4>

      {/* 尺寸信息显示 */}
      <div style={{ marginBottom: '1rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0.5rem',
            marginBottom: '1rem',
          }}
        >
          <div
            style={{
              padding: '0.75rem',
              backgroundColor: '#f0f8ff',
              borderRadius: '4px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1890ff' }}>
              {Math.round(elementSize.width)}px
            </div>
            <div style={{ fontSize: '0.875rem', color: '#666' }}>宽度</div>
          </div>
          <div
            style={{
              padding: '0.75rem',
              backgroundColor: '#f6ffed',
              borderRadius: '4px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#52c41a' }}>
              {Math.round(elementSize.height)}px
            </div>
            <div style={{ fontSize: '0.875rem', color: '#666' }}>高度</div>
          </div>
        </div>
      </div>

      {/* 可调整大小的元素 */}
      <div style={{ marginBottom: '1rem' }}>
        <h5>📐 可调整大小的元素</h5>
        <div
          ref={resizableRef}
          style={{
            width: '300px',
            height: '200px',
            backgroundColor: '#f5f5f5',
            border: '2px solid #d9d9d9',
            borderRadius: '8px',
            resize: 'both',
            overflow: 'auto',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            cursor: 'nw-resize',
          }}
        >
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📏</div>
          <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>拖拽右下角调整大小</div>
          <div style={{ fontSize: '0.875rem', color: '#666' }}>
            当前: {Math.round(elementSize.width)} × {Math.round(elementSize.height)}
          </div>
        </div>
        <p style={{ fontSize: '0.875rem', color: '#666', margin: '0.5rem 0 0 0' }}>
          💡 拖拽右下角来调整元素大小，观察尺寸实时变化
        </p>
      </div>

      {/* 响应式内容示例 */}
      <div>
        <h5>🎨 响应式内容</h5>
        <ResponsiveContentExample />
      </div>
    </div>
  );
}

// 响应式内容组件
function ResponsiveContentExample() {
  const [contentSize, setContentSize] = useState({ width: 0, height: 0 });
  const contentRef = useRef<HTMLDivElement>(null);

  useResizeObserver(contentRef, (entry) => {
    const { width, height } = entry.contentRect;
    setContentSize({ width, height });
  });

  // 根据容器宽度决定布局
  const isNarrow = contentSize.width < 400;
  const columns = isNarrow ? 1 : 2;

  return (
    <div
      ref={contentRef}
      style={{
        width: '100%',
        minHeight: '200px',
        backgroundColor: '#f9f9f9',
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
        padding: '1rem',
        resize: 'horizontal',
        overflow: 'auto',
      }}
    >
      <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
        <div style={{ fontSize: '0.875rem', color: '#666' }}>
          容器尺寸: {Math.round(contentSize.width)} × {Math.round(contentSize.height)}
        </div>
        <div style={{ fontSize: '0.875rem', color: '#666' }}>
          当前布局: {isNarrow ? '单列' : '双列'}
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: '1rem',
        }}
      >
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            style={{
              padding: '1rem',
              backgroundColor: 'white',
              borderRadius: '4px',
              textAlign: 'center',
              border: '1px solid #e0e0e0',
            }}
          >
            <div style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>📦</div>
            <div style={{ fontSize: '0.875rem' }}>卡片 {item}</div>
          </div>
        ))}
      </div>

      <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '1rem', textAlign: 'center' }}>
        📱 水平拖拽调整容器宽度，观察布局自动切换
      </p>
    </div>
  );
}