import React from 'react';
// import useHook from '../src/hooks/useHook';

const HookExample = () => {
  // 在这里使用 hook
  // const result = useHook();

  return (
    <div className='example-container'>
      <h2>useHook 示例</h2>

      <div className='example-section'>
        <h3>基本用法</h3>
        <p>描述基本用法...</p>
        <div className='result-box'>
          结果展示: <strong>{'示例结果'}</strong>
        </div>
      </div>

      <div className='example-section'>
        <h3>进阶用法</h3>
        <p>描述进阶用法...</p>
        <div className='result-box'>
          结果展示: <strong>{'示例结果'}</strong>
        </div>
      </div>

      <div className='code-section'>
        <h3>使用示例：</h3>
        <pre>
          {`
            // 基本用法
            const result = useHook();

            // 进阶用法
            const result = useHook({
              // 配置选项
            });
          `}
        </pre>
      </div>
    </div>
  );
};

export default HookExample;
