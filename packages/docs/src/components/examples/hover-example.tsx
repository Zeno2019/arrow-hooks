import React, { useRef } from 'react';
import { useHover } from 'arrow-hooks';

export function HoverExample() {
  const basicRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const isBasicHovered = useHover(basicRef);
  const isCardHovered = useHover(cardRef);
  const isButtonHovered = useHover(buttonRef);
  const isImageHovered = useHover(imageRef);

  return (
    <div style={{ padding: '1rem', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
      <h4 style={{ margin: '0 0 1rem 0' }}>useHover 演示</h4>

      {/* 基础悬停效果 */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h5>🎯 基础悬停效果</h5>
        <div
          ref={basicRef}
          style={{
            padding: '1rem',
            backgroundColor: isBasicHovered ? '#e6f7ff' : '#f5f5f5',
            border: `2px solid ${isBasicHovered ? '#1890ff' : '#d9d9d9'}`,
            borderRadius: '4px',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            textAlign: 'center',
          }}
        >
          {isBasicHovered ? '🌟 鼠标悬停中！' : '👋 将鼠标悬停在此处'}
        </div>
      </div>

      {/* 卡片悬停效果 */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h5>💳 卡片悬停效果</h5>
        <div
          ref={cardRef}
          style={{
            padding: '1.5rem',
            backgroundColor: '#ffffff',
            boxShadow: isCardHovered
              ? '0 8px 24px rgba(0, 0, 0, 0.15)'
              : '0 2px 8px rgba(0, 0, 0, 0.08)',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            transform: isCardHovered ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
            cursor: 'pointer',
            border: '1px solid #f0f0f0',
          }}
        >
          <h6 style={{ margin: '0 0 0.5rem 0', color: isCardHovered ? '#1890ff' : '#333' }}>
            ✨ 交互式卡片
          </h6>
          <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
            悬停时会有阴影、上移和缩放效果
          </p>
        </div>
      </div>

      {/* 按钮悬停效果 */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h5>🔘 按钮悬停效果</h5>
        <button
          ref={buttonRef}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            backgroundColor: isButtonHovered ? '#096dd9' : '#1890ff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            transform: isButtonHovered ? 'scale(1.05)' : 'scale(1)',
            boxShadow: isButtonHovered
              ? '0 4px 12px rgba(24, 144, 255, 0.3)'
              : '0 2px 4px rgba(24, 144, 255, 0.1)',
          }}
        >
          {isButtonHovered ? '🚀 点击发射！' : '🎯 悬停试试'}
        </button>
      </div>

      {/* 图片悬停效果 */}
      <div>
        <h5>🖼️ 图片悬停效果</h5>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <img
            ref={imageRef}
            src="https://picsum.photos/200/120"
            alt="示例图片"
            style={{
              width: '200px',
              height: '120px',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              filter: isImageHovered ? 'brightness(1.1) saturate(1.2)' : 'brightness(1) saturate(1)',
              transform: isImageHovered ? 'scale(1.05)' : 'scale(1)',
              cursor: 'pointer',
            }}
          />
          {isImageHovered && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                fontSize: '0.9rem',
                pointerEvents: 'none',
              }}
            >
              🔍 查看大图
            </div>
          )}
        </div>
      </div>
    </div>
  );
}