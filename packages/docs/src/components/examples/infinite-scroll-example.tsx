import React, { useCallback, useRef, useState } from 'react';
import { useInfiniteScroll } from 'arrow-hooks';

interface Item {
  id: number;
  content: string;
  color: string;
}

export function InfiniteScrollExample() {
  const [items, setItems] = useState<Item[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);

  // 生成随机颜色
  const getRandomColor = () => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const loadMoreItems = useCallback(async () => {
    // 模拟 API 请求延迟
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newItems = Array.from({ length: 10 }, (_, i) => ({
      id: items.length + i,
      content: `Item ${items.length + i + 1}`,
      color: getRandomColor(),
    }));

    setItems((prev) => [...prev, ...newItems]);

    // 模拟数据上限为 100 条
    if (items.length + newItems.length >= 100) {
      setHasMore(false);
    }
  }, [items.length]);

  const isLoading = useInfiniteScroll(loaderRef, loadMoreItems, {
    hasMore,
    threshold: 0.5,
    rootMargin: '50px',
  });

  return (
    <div style={{ padding: '1rem', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
      <h4 style={{ margin: '0 0 1rem 0' }}>useInfiniteScroll 演示</h4>

      {/* 状态信息 */}
      <div style={{ marginBottom: '1rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.5rem',
            fontSize: '0.875rem',
          }}
        >
          <div
            style={{
              padding: '0.5rem',
              backgroundColor: '#f0f8ff',
              borderRadius: '4px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontWeight: 'bold', color: '#1890ff' }}>{items.length}</div>
            <div style={{ color: '#666' }}>已加载</div>
          </div>
          <div
            style={{
              padding: '0.5rem',
              backgroundColor: isLoading ? '#fff7e6' : '#f6ffed',
              borderRadius: '4px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontWeight: 'bold', color: isLoading ? '#fa8c16' : '#52c41a' }}>
              {isLoading ? '加载中' : '就绪'}
            </div>
            <div style={{ color: '#666' }}>状态</div>
          </div>
          <div
            style={{
              padding: '0.5rem',
              backgroundColor: hasMore ? '#f6ffed' : '#fff2f0',
              borderRadius: '4px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontWeight: 'bold', color: hasMore ? '#52c41a' : '#ff4d4f' }}>
              {hasMore ? '有更多' : '已结束'}
            </div>
            <div style={{ color: '#666' }}>数据</div>
          </div>
        </div>
      </div>

      {/* 滚动容器 */}
      <div
        style={{
          height: '400px',
          overflowY: 'auto',
          border: '1px solid #e0e0e0',
          borderRadius: '4px',
          backgroundColor: '#fafafa',
        }}
      >
        {/* 列表项 */}
        <div style={{ padding: '0.5rem' }}>
          {items.length === 0 && !isLoading && (
            <div
              style={{
                padding: '2rem',
                textAlign: 'center',
                color: '#999',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📜</div>
              <div>开始滚动加载数据...</div>
            </div>
          )}

          {items.map((item) => (
            <div
              key={item.id}
              style={{
                padding: '1rem',
                margin: '0.5rem',
                backgroundColor: 'white',
                borderRadius: '6px',
                border: `2px solid ${item.color}`,
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: item.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.875rem',
                }}
              >
                {item.id + 1}
              </div>
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                  {item.content}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#666' }}>
                  这是第 {item.id + 1} 个项目的描述内容
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 加载指示器 */}
        <div
          ref={loaderRef}
          style={{
            padding: '1.5rem',
            textAlign: 'center',
            color: '#666',
          }}
        >
          {isLoading ? (
            <div>
              <div
                style={{
                  display: 'inline-block',
                  width: '20px',
                  height: '20px',
                  border: '2px solid #f3f3f3',
                  borderTop: '2px solid #1890ff',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  marginRight: '0.5rem',
                }}
              />
              正在加载更多项目...
            </div>
          ) : hasMore ? (
            <div>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>👇</div>
              <div>继续滚动加载更多</div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🎉</div>
              <div>没有更多数据了</div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <div style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: '#666' }}>
        💡 向下滚动到底部自动加载更多数据（模拟最多100项）
      </div>
    </div>
  );
}