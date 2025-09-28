import React, { useRef, useState } from 'react';
import { useEventListener } from 'arrow-hooks';

export function EventListenerExample() {
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [clicks, setClicks] = useState(0);
  const [keyPresses, setKeyPresses] = useState<string[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // 监听全局鼠标移动
  useEventListener('mousemove', (e: MouseEvent) => {
    setCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  });

  // 监听按钮点击
  useEventListener(
    'click',
    () => {
      setClicks((prev) => prev + 1);
    },
    buttonRef.current ?? undefined,
  );

  // 监听键盘按键
  useEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setKeyPresses([]);
    } else {
      setKeyPresses((prev) => [...prev.slice(-4), e.key]);
    }
  });

  return (
    <div style={{ padding: '1rem', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
      <h4 style={{ margin: '0 0 1rem 0' }}>useEventListener 演示</h4>

      {/* 鼠标位置跟踪 */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h5>🖱️ 鼠标位置跟踪</h5>
        <div
          style={{
            padding: '0.5rem',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
            fontFamily: 'monospace',
          }}
        >
          X: {coordinates.x}px, Y: {coordinates.y}px
        </div>
        <p style={{ fontSize: '0.9rem', color: '#666', margin: '0.5rem 0 0 0' }}>
          移动鼠标查看坐标变化
        </p>
      </div>

      {/* 元素点击事件 */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h5>👆 元素点击事件</h5>
        <button
          ref={buttonRef}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            backgroundColor: '#1890ff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          点击我 ({clicks} 次)
        </button>
      </div>

      {/* 键盘事件 */}
      <div>
        <h5>⌨️ 键盘事件</h5>
        <div
          style={{
            padding: '0.5rem',
            backgroundColor: '#f0f8ff',
            border: '1px dashed #1890ff',
            borderRadius: '4px',
            minHeight: '2rem',
            fontFamily: 'monospace',
          }}
        >
          最近按键: {keyPresses.join(' → ') || '未检测到按键'}
        </div>
        <p style={{ fontSize: '0.9rem', color: '#666', margin: '0.5rem 0 0 0' }}>
          按任意键查看效果，按 ESC 清除记录
        </p>
      </div>
    </div>
  );
}