import React from 'react';
import { useWindowSize } from 'arrow-hooks';

export function WindowSizeExample() {
  const { width, height } = useWindowSize();
  const { width: customWidth, height: customHeight } = useWindowSize(500);

  // 计算屏幕分类
  const getScreenType = (w: number) => {
    if (w < 576) return { type: '手机', color: '#ff4d4f', icon: '📱' };
    if (w < 768) return { type: '平板', color: '#fa8c16', icon: '📱' };
    if (w < 992) return { type: '小屏幕', color: '#faad14', icon: '💻' };
    if (w < 1200) return { type: '中屏幕', color: '#52c41a', icon: '🖥️' };
    return { type: '大屏幕', color: '#1890ff', icon: '🖥️' };
  };

  const screenInfo = getScreenType(width);
  const aspectRatio = (width / height).toFixed(2);

  return (
    <div style={{ padding: '1rem', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
      <h4 style={{ margin: '0 0 1rem 0' }}>useWindowSize 演示</h4>

      {/* 当前窗口尺寸 */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h5>📏 当前窗口尺寸</h5>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
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
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1890ff' }}>
              {width}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#666' }}>宽度 (px)</div>
          </div>
          <div
            style={{
              padding: '0.75rem',
              backgroundColor: '#f6ffed',
              borderRadius: '4px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#52c41a' }}>
              {height}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#666' }}>高度 (px)</div>
          </div>
          <div
            style={{
              padding: '0.75rem',
              backgroundColor: '#fff7e6',
              borderRadius: '4px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fa8c16' }}>
              {aspectRatio}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#666' }}>宽高比</div>
          </div>
        </div>
        <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>
          💡 调整浏览器窗口大小查看实时变化
        </p>
      </div>

      {/* 屏幕类型识别 */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h5>📱 屏幕类型识别</h5>
        <div
          style={{
            padding: '1rem',
            backgroundColor: screenInfo.color + '15',
            border: `2px solid ${screenInfo.color}`,
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
            {screenInfo.icon}
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: screenInfo.color }}>
            {screenInfo.type}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem' }}>
            当前窗口宽度: {width}px
          </div>
        </div>
      </div>

      {/* 响应式布局演示 */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h5>📐 响应式布局演示</h5>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: width > 768 ? 'repeat(3, 1fr)' : width > 480 ? 'repeat(2, 1fr)' : '1fr',
            gap: '0.75rem',
          }}
        >
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              style={{
                padding: '1rem',
                backgroundColor: '#f5f5f5',
                borderRadius: '4px',
                textAlign: 'center',
                border: '1px solid #e0e0e0',
              }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📦</div>
              <div style={{ fontSize: '0.875rem', color: '#666' }}>卡片 {item}</div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.75rem', margin: 0 }}>
          {width > 768
            ? '🖥️ 当前显示 3 列布局'
            : width > 480
              ? '📱 当前显示 2 列布局'
              : '📱 当前显示单列布局'}
        </p>
      </div>

      {/* 自定义防抖时间演示 */}
      <div>
        <h5>⏱️ 自定义防抖时间 (500ms)</h5>
        <div
          style={{
            padding: '1rem',
            backgroundColor: '#f9f9f9',
            borderRadius: '4px',
            border: '1px dashed #d9d9d9',
          }}
        >
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ fontFamily: 'monospace' }}>
              <strong>防抖版本:</strong> {customWidth} × {customHeight}
            </div>
            <div style={{ fontFamily: 'monospace' }}>
              <strong>实时版本:</strong> {width} × {height}
            </div>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#666', margin: '0.5rem 0 0 0' }}>
            快速调整窗口大小，观察两个版本的更新差异
          </p>
        </div>
      </div>
    </div>
  );
}