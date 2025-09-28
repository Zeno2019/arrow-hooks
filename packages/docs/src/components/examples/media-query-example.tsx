import React from 'react';
import { useMediaQuery } from 'arrow-hooks';

export function MediaQueryExample() {
  // 屏幕尺寸查询
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');
  const isMediumScreen = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
  const isSmallScreen = useMediaQuery('(max-width: 767px)');

  // 系统偏好查询
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const prefersHighContrast = useMediaQuery('(prefers-contrast: high)');

  // 设备特征查询
  const isRetina = useMediaQuery('(min-resolution: 2dppx)');
  const isLandscape = useMediaQuery('(orientation: landscape)');
  const canHover = useMediaQuery('(hover: hover)');

  // 打印媒体查询
  const isPrint = useMediaQuery('print');

  return (
    <div style={{ padding: '1rem', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
      <h4 style={{ margin: '0 0 1rem 0' }}>useMediaQuery 演示</h4>

      {/* 屏幕尺寸检测 */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h5>📱 屏幕尺寸检测</h5>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <StatusCard
            label="大屏幕 (≥1024px)"
            isActive={isLargeScreen}
            icon="🖥️"
            color="#1890ff"
          />
          <StatusCard
            label="中屏幕 (768-1023px)"
            isActive={isMediumScreen}
            icon="💻"
            color="#52c41a"
          />
          <StatusCard
            label="小屏幕 (≤767px)"
            isActive={isSmallScreen}
            icon="📱"
            color="#fa8c16"
          />
        </div>
      </div>

      {/* 系统偏好设置 */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h5>⚙️ 系统偏好设置</h5>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <StatusCard
            label="深色模式"
            isActive={prefersDarkMode}
            icon="🌙"
            color="#722ed1"
          />
          <StatusCard
            label="减少动画"
            isActive={prefersReducedMotion}
            icon="⏸️"
            color="#eb2f96"
          />
          <StatusCard
            label="高对比度"
            isActive={prefersHighContrast}
            icon="🔆"
            color="#f5222d"
          />
        </div>
        <p style={{ fontSize: '0.875rem', color: '#666', margin: '0.5rem 0 0 0' }}>
          💡 在系统设置中切换这些选项查看变化
        </p>
      </div>

      {/* 设备特征 */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h5>🔧 设备特征</h5>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <StatusCard
            label="高分辨率屏幕"
            isActive={isRetina}
            icon="✨"
            color="#13c2c2"
          />
          <StatusCard
            label="横屏模式"
            isActive={isLandscape}
            icon="📐"
            color="#a0d911"
          />
          <StatusCard
            label="支持悬停"
            isActive={canHover}
            icon="👆"
            color="#fadb14"
          />
        </div>
      </div>

      {/* 响应式内容演示 */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h5>🎨 响应式内容演示</h5>
        <div
          style={{
            padding: '1rem',
            backgroundColor: isLargeScreen ? '#f0f8ff' : isMediumScreen ? '#f6ffed' : '#fff7e6',
            border: `2px solid ${isLargeScreen ? '#1890ff' : isMediumScreen ? '#52c41a' : '#fa8c16'}`,
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
            {isLargeScreen ? '🖥️' : isMediumScreen ? '💻' : '📱'}
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            {isLargeScreen ? '桌面布局' : isMediumScreen ? '平板布局' : '移动布局'}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#666' }}>
            当前显示适合{isLargeScreen ? '大屏幕' : isMediumScreen ? '中等屏幕' : '小屏幕'}的内容
          </div>
        </div>
      </div>

      {/* 打印模式 */}
      <div>
        <h5>🖨️ 打印模式</h5>
        <div
          style={{
            padding: '1rem',
            backgroundColor: isPrint ? '#f6ffed' : '#f5f5f5',
            border: `2px solid ${isPrint ? '#52c41a' : '#d9d9d9'}`,
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
            {isPrint ? '📄' : '🖨️'}
          </div>
          <div style={{ fontWeight: 'bold' }}>
            {isPrint ? '当前处于打印模式' : '当前处于屏幕模式'}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem' }}>
            {isPrint ? '页面正在准备打印' : '按 Ctrl+P (Cmd+P) 进入打印预览'}
          </div>
        </div>
      </div>
    </div>
  );
}

// 状态卡片组件
function StatusCard({
  label,
  isActive,
  icon,
  color
}: {
  label: string;
  isActive: boolean;
  icon: string;
  color: string;
}) {
  return (
    <div
      style={{
        padding: '0.75rem',
        backgroundColor: isActive ? color + '15' : '#f5f5f5',
        border: `2px solid ${isActive ? color : '#e0e0e0'}`,
        borderRadius: '6px',
        textAlign: 'center',
        minWidth: '120px',
        opacity: isActive ? 1 : 0.6,
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>
        {icon}
      </div>
      <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: isActive ? color : '#666' }}>
        {label}
      </div>
      <div style={{ fontSize: '0.625rem', color: '#999', marginTop: '0.25rem' }}>
        {isActive ? '✓ 匹配' : '✗ 不匹配'}
      </div>
    </div>
  );
}