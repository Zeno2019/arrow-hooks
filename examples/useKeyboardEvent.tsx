import React, { useState } from 'react';
import useKeyboardEvent from '../src/hooks/useKeyboardEvent';

const KeyboardEventExample = () => {
  const [lastKey, setLastKey] = useState('');
  const [enterCount, setEnterCount] = useState(0);

  // 监听所有按键
  useKeyboardEvent('keydown', (e) => {
    setLastKey(e.key);
  });

  // 只监听 Enter 键
  useKeyboardEvent(
    'keydown',
    () => {
      setEnterCount((prev) => prev + 1);
    },
    'Enter'
  );

  return (
    <div className='example-container'>
      <h2>useKeyboardEvent 示例</h2>

      <div className='example-section'>
        <h3>基本用法</h3>
        <p>请按任意键，查看效果：</p>
        <div className='result-box'>
          最后按下的键: <strong>{lastKey}</strong>
        </div>
      </div>

      <div className='example-section'>
        <h3>监听特定按键</h3>
        <p>请按 Enter 键，计数器会增加：</p>
        <div className='result-box'>
          Enter 键按下次数: <strong>{enterCount}</strong>
        </div>
      </div>

      <div className='code-section'>
        <h3>使用示例：</h3>
        <pre>
          {`
            // 监听所有按键
            useKeyboardEvent('keydown', (e) => {
              console.log('按下的键：', e.key);
            });

            // 只监听特定按键（比如 Enter）
            useKeyboardEvent(
              'keydown',
              (e) => {
                console.log('按下了 Enter 键！');
              },
              'Enter'
            );
          `}
        </pre>
      </div>
    </div>
  );
};

export default KeyboardEventExample;
