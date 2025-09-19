import React, { useRef, useState } from 'react';
import useEventListener from '../index';

const EventListenerExample = () => {
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [clicks, setClicks] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // 监听全局鼠标移动
  useEventListener('mousemove', (e: Event) => {
    const mouseEvent = e as MouseEvent;
    setCoordinates({
      x: mouseEvent.clientX,
      y: mouseEvent.clientY,
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

  return (
    <div>
      <h2>Event Listener Example</h2>

      <div style={{ marginBottom: '1rem' }}>
        <h3>全局鼠标位置：</h3>
        <p>
          X: {coordinates.x}, Y: {coordinates.y}
        </p>
      </div>

      <div>
        <h3>按钮点击次数：</h3>
        <button
          ref={buttonRef}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            cursor: 'pointer',
          }}
        >
          点击我 ({clicks} 次)
        </button>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <p>说明：</p>
        <ul>
          <li>移动鼠标可以看到坐标变化（全局事件）</li>
          <li>点击按钮可以看到计数增加（元素事件）</li>
        </ul>
      </div>
    </div>
  );
};

export default EventListenerExample;
