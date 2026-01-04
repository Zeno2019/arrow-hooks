import { useIndexedDBClient } from 'arrow-hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';

export function IndexedDBClientExample() {
  const client = useIndexedDBClient({
    dbName: 'arrow-hooks-docs',
    storeName: 'keyval',
    channelName: 'arrow-hooks-docs:keyval',
  });

  const [key, setKey] = useState('demo:note');
  const [value, setValue] = useState('Hello IndexedDB');
  const [keys, setKeys] = useState<IDBValidKey[]>([]);
  const [error, setError] = useState<unknown | null>(null);

  const isSupported = client.isSupported;

  const refreshKeys = useCallback(async () => {
    if (!client.isSupported) return;
    const list = await client.keys();
    setKeys(list);
  }, [client]);

  useEffect(() => {
    refreshKeys();
  }, [refreshKeys]);

  useEffect(() => {
    if (!client.isSupported) return;
    return client.subscribe(() => {
      refreshKeys();
    });
  }, [client, refreshKeys]);

  const write = async () => {
    setError(null);
    try {
      await client.set(key, value);
      await refreshKeys();
    } catch (error) {
      setError(error);
    }
  };

  const read = async () => {
    setError(null);
    try {
      const stored = await client.get<string>(key);
      setValue(stored ?? '');
    } catch (error) {
      setError(error);
    }
  };

  const remove = async () => {
    setError(null);
    try {
      await client.delete(key);
      await refreshKeys();
    } catch (error) {
      setError(error);
    }
  };

  const clear = async () => {
    setError(null);
    try {
      await client.clear();
      await refreshKeys();
    } catch (error) {
      setError(error);
    }
  };

  const errorMessage = useMemo(() => {
    if (!error) return null;
    if (error instanceof Error) return error.message;
    return String(error);
  }, [error]);

  return (
    <div>
      <div
        style={{
          padding: '1rem',
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: '#fafafa',
        }}
      >
        <p style={{ margin: '0 0 0.75rem 0', color: '#666' }}>
          状态：{isSupported ? '就绪' : '不支持 IndexedDB'}
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span>Key</span>
            <input
              value={key}
              onChange={(e) => setKey(e.target.value)}
              style={{ padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid #ccc' }}
            />
          </label>

          <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span>Value</span>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              style={{ padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid #ccc' }}
            />
          </label>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
          <button
            onClick={write}
            style={{ padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #ccc' }}
          >
            set
          </button>
          <button
            onClick={read}
            style={{ padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #ccc' }}
          >
            get
          </button>
          <button
            onClick={remove}
            style={{ padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #ccc' }}
          >
            delete
          </button>
          <button
            onClick={clear}
            style={{ padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #ccc' }}
          >
            clear
          </button>
        </div>

        {errorMessage ? (
          <p style={{ marginTop: '0.75rem', color: '#ff4d4f' }}>错误：{errorMessage}</p>
        ) : null}
      </div>

      <div style={{ marginTop: '1rem' }}>
        <h4 style={{ margin: '0 0 0.5rem 0' }}>Keys（自动刷新）</h4>
        <pre
          style={{
            margin: 0,
            padding: '0.75rem',
            background: '#fff',
            border: '1px solid #eee',
            borderRadius: '6px',
            overflowX: 'auto',
          }}
        >
          {JSON.stringify(keys, null, 2)}
        </pre>
      </div>
    </div>
  );
}
