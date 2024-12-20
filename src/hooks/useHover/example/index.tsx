import React, { useRef } from 'react';
import useHover from '../index';

const HoverExample = () => {
  const basicRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const isBasicHovered = useHover(basicRef);
  const isCardHovered = useHover(cardRef);
  const isButtonHovered = useHover(buttonRef);

  return (
    <div>
      <h2>Hover Example</h2>

      {/* 基础示例 */}
      <div style={{ marginBottom: '2rem' }}>
        <h3>基础用法</h3>
        <div
          ref={basicRef}
          style={{
            padding: '1rem',
            backgroundColor: isBasicHovered ? '#e6f7ff' : '#ffffff',
            border: '1px solid #91d5ff',
            borderRadius: '4px',
            transition: 'all 0.3s',
          }}
        ></div>
        {isBasicHovered ? '鼠标悬停中！' : '将鼠标悬停在此处'}
      </div>

      {/* 卡片示例 */}
      <div style={{ marginBottom: '2rem' }}>
        <h3>卡片交互</h3>
        <div
          ref={cardRef}
          style={{
            padding: '1.5rem',
            backgroundColor: '#ffffff',
            boxShadow: isCardHovered
              ? '0 4px 12px rgba(0, 0, 0, 0.15)'
              : '0 1px 3px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            transition: 'all 0.3s',
            transform: isCardHovered ? 'translateY(-2px)' : 'none',
          }}
        ></div>
        <h4 style={{ margin: '0 0 1rem 0' }}>交互式卡片</h4>
        <p style={{ margin: 0, color: '#666' }}>
          悬停时会有阴影和上移效果
        </p>
      </div>

      {/* 按钮示例 */}
      < div >
        <h3>按钮状态</h3>
        <button
          ref={buttonRef}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            backgroundColor: isButtonHovered ? '#1890ff' : '#40a9ff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'all 0.3s',
          }}
        >
          {isButtonHovered ? '松开点击！' : '悬停试试'}
        </button>
      </div >

    </div >
  );
};

export default HoverExample;
