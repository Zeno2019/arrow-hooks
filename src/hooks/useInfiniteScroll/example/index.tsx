import React, { useCallback, useRef, useState } from 'react';
import useInfiniteScroll from '../index';

interface Item {
  id: number;
  content: string;
}

const InfinityScrollExample = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);

  const loadMoreItems = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const newItems = Array.from({ length: 10 }, (_, i) => ({
      id: items.length + i,
      content: `Item ${items.length + i + 1}`,
    }));

    setItems((prev) => [...prev, ...newItems]);

    // 模拟数据上限为 50 条
    if (items.length + newItems.length >= 50) {
      setHasMore(false);
    }
  }, [items.length]);

  const isLoading = useInfiniteScroll(loaderRef, loadMoreItems, {
    hasMore,
    threshold: 0.5,
    rootMargin: '50px',
  });

  return (
    <div>
      <h2>Infinite Scroll Example</h2>
      <div style={{ maxHeight: '400px', overflow: 'auto' }}>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              padding: '20px',
              margin: '10px',
              backgroundColor: '#f0f0f0',
              borderRadius: '4px',
            }}
          >
            {item.content}
          </div>
        ))}

        <div ref={loaderRef} style={{ padding: '20px', textAlign: 'center' }}>
          {isLoading ? 'Loading more items...' : hasMore ? 'Scroll for more' : 'No more items'}
        </div>
      </div>
    </div>
  );
};

export default InfinityScrollExample;
