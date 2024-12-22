import React, { useRef, useState, useCallback } from 'react';
import useResizeObserver from '../index';

const ResizeObserverExample = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [width, setWidth] = useState(200);

  const handleResize = useCallback((entry: ResizeObserverEntry) => {
    const { width, height } = entry.contentRect;
    setSize({ width, height });
    console.log('元素尺寸变化:', { width, height });
  }, []);

  useResizeObserver(ref, handleResize);

  return (
    <div>
      <h2>ResizeObserver Example</h2>
      
      <div style={{ marginBottom: '1rem' }}>
        <label>
          调整宽度：
          <input
            type="range"
            min="200"
            max="600"
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
          />
          {width}px
        </label>
      </div>

      <div
        ref={ref}
        style={{
          width: `${width}px`,
          padding: '20px',
          border: '2px solid #1890ff',
          borderRadius: '4px',
          transition: 'all 0.3s',
        }}
      >
        <p>调整滑块来改变这个元素的宽度</p>
        <div style={{ marginTop: '1rem', color: '#666' }}>
          <div>当前宽度: {Math.round(size.width)}px</div>
          <div>当前高度: {Math.round(size.height)}px</div>
        </div>
      </div>
    </div>
  );
};

export default ResizeObserverExample;
