import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CreateIndexedDBClientOptions, IndexedDBKey } from '../../util';
import useIndexedDBClient from '../useIndexedDBClient';

export interface UseIndexedDBStatus {
  loading: boolean;
  error: unknown | null;
  isSupported: boolean;
}

/**
 * 用于 IndexedDB KV 存取的 Hook（基于 createIndexedDBClient 的薄封装）
 * @param key - IndexedDB key
 * @param options - IndexedDB client 配置
 * @returns [value, setValue, removeValue, status]
 */
const useIndexedDB = <T>(
  key: IndexedDBKey,
  options: CreateIndexedDBClientOptions = {},
): [T | undefined, (value: T) => Promise<void>, () => Promise<void>, UseIndexedDBStatus] => {
  const client = useIndexedDBClient(options);

  const [value, setValueState] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(client.isSupported);
  const [error, setError] = useState<unknown | null>(null);

  const requestIdRef = useRef(0);

  const refresh = useCallback(async () => {
    if (!client.isSupported) {
      setLoading(false);
      setError(null);
      setValueState(undefined);
      return;
    }

    requestIdRef.current += 1;
    const requestId = requestIdRef.current;
    setLoading(true);
    setError(null);

    try {
      const nextValue = await client.get<T>(key);
      if (requestIdRef.current !== requestId) return;
      setValueState(nextValue);
    } catch (error) {
      if (requestIdRef.current !== requestId) return;
      setError(error);
    } finally {
      if (requestIdRef.current === requestId) {
        setLoading(false);
      }
    }
  }, [client, key]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!client.isSupported) return;

    return client.subscribeKey(key, () => {
      refresh();
    });
  }, [client, key, refresh]);

  const setValue = useCallback(
    async (nextValue: T) => {
      requestIdRef.current += 1;
      setValueState(nextValue);
      setError(null);

      try {
        await client.set(key, nextValue);
      } catch (error) {
        setError(error);
        throw error;
      }
    },
    [client, key],
  );

  const removeValue = useCallback(async () => {
    requestIdRef.current += 1;
    setValueState(undefined);
    setError(null);

    try {
      await client.delete(key);
    } catch (error) {
      setError(error);
      throw error;
    }
  }, [client, key]);

  const status = useMemo<UseIndexedDBStatus>(() => {
    return {
      loading,
      error,
      isSupported: client.isSupported,
    };
  }, [loading, error, client.isSupported]);

  return [value, setValue, removeValue, status];
};

export default useIndexedDB;
