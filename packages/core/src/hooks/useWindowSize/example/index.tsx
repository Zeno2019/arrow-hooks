import React from 'react';
import useWindowSize from '../index';

const WindowSizeExample = () => {
  const { width, height } = useWindowSize();

  return (
    <div>
      <h2>Window Size Example</h2>
      <div style={{ marginBottom: '1rem' }}>
        <p>Try resizing your browser window:</p>
        <div
          style={{
            padding: '1rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: '#f5f5f5',
          }}
        >
          <p>
            Width: <strong>{width}px</strong>
          </p>
          <p>
            Height: <strong>{height}px</strong>
          </p>
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3>Responsive Layout Demo</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: width > 768 ? 'repeat(3, 1fr)' : '1fr',
            gap: '1rem',
          }}
        >
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              style={{
                padding: '1rem',
                backgroundColor: '#e1e1e1',
                borderRadius: '4px',
                textAlign: 'center',
              }}
            >
              Card {item}
            </div>
          ))}
        </div>
        <p style={{ marginTop: '1rem', color: '#666' }}>
          {width > 768
            ? '👆 Currently showing a 3-column layout'
            : '👆 Currently showing a single-column layout'}
        </p>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3>Custom Debounce Demo by 500ms</h3>
        <div
          style={{
            padding: '1rem',
            border: '1px dashed #999',
            borderRadius: '4px',
          }}
        >
          <WindowSizeWithCustomDebounce />
        </div>
      </div>
    </div>
  );
};

// 使用自定义防抖时间的示例
const WindowSizeWithCustomDebounce = () => {
  const { width, height } = useWindowSize(500); // 500ms 的防抖延迟

  return (
    <div>
      <p>
        Width: <strong>{width}px</strong>
      </p>
      <p>
        Height: <strong>{height}px</strong>
      </p>
    </div>
  );
};

export default WindowSizeExample;
