import React, { useState } from 'react';
import { useKeyboardEvent } from 'arrow-hooks';

export function KeyboardEventExample() {
  const [lastKey, setLastKey] = useState('');
  const [keyHistory, setKeyHistory] = useState<string[]>([]);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  // 监听所有按键按下
  useKeyboardEvent('keydown', (e) => {
    setLastKey(e.key);
    setKeyHistory(prev => [...prev.slice(-9), e.key]);
    setPressedKeys(prev => new Set([...prev, e.key]));
  });

  // 监听按键释放
  useKeyboardEvent('keyup', (e) => {
    setPressedKeys(prev => {
      const newSet = new Set(prev);
      newSet.delete(e.key);
      return newSet;
    });
  });

  // 监听特定按键 - Escape
  useKeyboardEvent('keydown', () => {
    setKeyHistory([]);
    setPressedKeys(new Set());
  }, 'Escape');

  return (
    <div style={{ padding: '1rem', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
      <h4 style={{ margin: '0 0 1rem 0' }}>useKeyboardEvent 演示</h4>

      {/* 最后按下的键 */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h5>⌨️ 最后按下的键</h5>
        <div
          style={{
            padding: '1rem',
            backgroundColor: '#f0f8ff',
            border: '2px solid #1890ff',
            borderRadius: '8px',
            textAlign: 'center',
            fontSize: '1.5rem',
            fontFamily: 'monospace',
            minHeight: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {lastKey || '按任意键开始'}
        </div>
      </div>

      {/* 当前按下的键 */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h5>🔥 当前按下的键</h5>
        <div
          style={{
            padding: '1rem',
            backgroundColor: '#f6ffed',
            border: '1px solid #b7eb8f',
            borderRadius: '4px',
            minHeight: '60px',
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          {pressedKeys.size === 0 ? (
            <span style={{ color: '#999' }}>无按键按下</span>
          ) : (
            Array.from(pressedKeys).map((key) => (
              <span
                key={key}
                style={{
                  padding: '0.25rem 0.5rem',
                  backgroundColor: '#52c41a',
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  fontFamily: 'monospace',
                }}
              >
                {key}
              </span>
            ))
          )}
        </div>
      </div>

      {/* 按键历史 */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h5>📜 按键历史 (最近10个)</h5>
        <div
          style={{
            padding: '1rem',
            backgroundColor: '#fff7e6',
            border: '1px solid #ffd591',
            borderRadius: '4px',
            minHeight: '60px',
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          {keyHistory.length === 0 ? (
            <span style={{ color: '#999' }}>暂无按键历史</span>
          ) : (
            keyHistory.map((key, index) => (
              <span
                key={`${key}-${index}`}
                style={{
                  padding: '0.25rem 0.5rem',
                  backgroundColor: '#fa8c16',
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  fontFamily: 'monospace',
                  opacity: 0.6 + (index / keyHistory.length) * 0.4,
                }}
              >
                {key}
              </span>
            ))
          )}
        </div>
      </div>

      {/* 快捷键示例 */}
      <div>
        <h5>⚡ 特殊功能</h5>
        <div
          style={{
            padding: '1rem',
            backgroundColor: '#f9f0ff',
            border: '1px solid #d3adf7',
            borderRadius: '4px',
          }}
        >
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Escape</strong> - 清除所有记录
          </div>
          <div style={{ fontSize: '0.875rem', color: '#666' }}>
            按下 ESC 键可以清除按键历史和当前按下的键
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#666' }}>
        💡 在此页面按任意键试试，观察各种键盘事件的实时响应
      </div>
    </div>
  );
}