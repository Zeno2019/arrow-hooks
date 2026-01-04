import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createIndexedDBClient } from '../../../util';
import useIndexedDB from '../index';

type InMemoryStore = Map<IDBValidKey, unknown>;

type InMemoryDb = {
  version: number;
  stores: Map<string, InMemoryStore>;
};

type GlobalWithIndexedDB = Omit<typeof globalThis, 'indexedDB' | 'BroadcastChannel'> & {
  indexedDB?: IDBFactory;
  BroadcastChannel?: typeof BroadcastChannel;
};

const globalWithIndexedDB = globalThis as GlobalWithIndexedDB;

const createMockIndexedDB = () => {
  const databases = new Map<string, InMemoryDb>();

  const toDomException = (error: unknown): DOMException => {
    if (error instanceof DOMException) return error;
    return new DOMException(typeof error === 'string' ? error : 'Unknown error');
  };

  const makeRequest = <T>(run: () => T, transaction?: IDBTransaction) => {
    const request: Partial<IDBRequest<T>> & { result?: T; error?: DOMException | null } = {
      result: undefined,
      error: undefined,
    };

    setTimeout(() => {
      try {
        request.result = run();
        request.onsuccess?.call(request as IDBRequest<T>, new Event('success'));
        if (transaction) {
          setTimeout(() => {
            transaction.oncomplete?.call(transaction, new Event('complete'));
          }, 0);
        }
      } catch (error) {
        request.error = toDomException(error);
        request.onerror?.call(request as IDBRequest<T>, new Event('error'));
        if (transaction) {
          setTimeout(() => {
            transaction.onerror?.call(transaction, new Event('error'));
          }, 0);
        }
      }
    }, 0);

    return request as IDBRequest<T>;
  };

  const createDatabase = (dbName: string, version: number) => {
    const record: InMemoryDb = databases.get(dbName) ?? { version: 0, stores: new Map() };
    record.version = version;
    databases.set(dbName, record);

    const database: Partial<IDBDatabase> = {
      close: vi.fn(),
      objectStoreNames: {
        contains: (name: string) => record.stores.has(name),
      } as unknown as DOMStringList,
      createObjectStore: (name: string) => {
        if (!record.stores.has(name)) {
          record.stores.set(name, new Map());
        }
        return {} as unknown as IDBObjectStore;
      },
      transaction: (storeName: string, _mode: IDBTransactionMode) => {
        const store = record.stores.get(storeName);
        if (!store) {
          throw new Error(`Store not found: ${storeName}`);
        }

        const transaction: Partial<IDBTransaction> = {
          abort: vi.fn(),
          objectStore: () => {
            const objectStore: Partial<IDBObjectStore> = {
              get: (key: IDBValidKey) =>
                makeRequest(() => store.get(key), transaction as IDBTransaction),
              put: (value: unknown, key: IDBValidKey) =>
                makeRequest(() => {
                  store.set(key, value);
                  return key;
                }, transaction as IDBTransaction),
              delete: (key: IDBValidKey) =>
                makeRequest(() => {
                  store.delete(key);
                  return undefined;
                }, transaction as IDBTransaction),
              clear: () =>
                makeRequest(() => {
                  store.clear();
                  return undefined;
                }, transaction as IDBTransaction),
              getAllKeys: () =>
                makeRequest(() => Array.from(store.keys()), transaction as IDBTransaction),
              openCursor: () =>
                makeRequest(() => null as IDBCursorWithValue | null, transaction as IDBTransaction),
            };

            return objectStore as IDBObjectStore;
          },
        };

        return transaction as IDBTransaction;
      },
    };

    return database as IDBDatabase;
  };

  const indexedDb: Partial<IDBFactory> = {
    open: (dbName: string, version?: number) => {
      const request: Partial<IDBOpenDBRequest> & {
        result?: IDBDatabase;
        error?: DOMException | null;
      } = {
        result: undefined,
        error: undefined,
      };

      const nextVersion = version ?? 1;

      setTimeout(() => {
        try {
          request.result = createDatabase(dbName, nextVersion);
          request.onupgradeneeded?.call(
            request as IDBOpenDBRequest,
            new Event('upgradeneeded') as unknown as IDBVersionChangeEvent,
          );
          setTimeout(() => {
            request.onsuccess?.call(request as IDBOpenDBRequest, new Event('success'));
          }, 0);
        } catch (error) {
          request.error = toDomException(error);
          request.onerror?.call(request as IDBOpenDBRequest, new Event('error'));
        }
      }, 0);

      return request as IDBOpenDBRequest;
    },
  };

  return { indexedDb };
};

class MockBroadcastChannel {
  static readonly channels = new Map<string, Set<MockBroadcastChannel>>();

  readonly name: string;
  onmessage: ((event: MessageEvent) => void) | null = null;

  constructor(name: string) {
    this.name = name;

    const group = MockBroadcastChannel.channels.get(name) ?? new Set();
    group.add(this);
    MockBroadcastChannel.channels.set(name, group);
  }

  postMessage(data: unknown) {
    const group = MockBroadcastChannel.channels.get(this.name);
    if (!group) return;

    for (const instance of group) {
      if (instance === this) continue;
      setTimeout(() => instance.onmessage?.({ data } as MessageEvent), 0);
    }
  }

  close() {
    const group = MockBroadcastChannel.channels.get(this.name);
    if (!group) return;

    group.delete(this);
    if (group.size === 0) {
      MockBroadcastChannel.channels.delete(this.name);
    }
  }
}

const flush = async (times = 3) => {
  for (let i = 0; i < times; i += 1) {
    await Promise.resolve();
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
};

describe('useIndexedDB', () => {
  const originalIndexedDB = globalWithIndexedDB.indexedDB;
  const originalBroadcastChannel = globalWithIndexedDB.BroadcastChannel;

  beforeEach(() => {
    const { indexedDb } = createMockIndexedDB();
    globalWithIndexedDB.indexedDB = indexedDb as IDBFactory;
    globalWithIndexedDB.BroadcastChannel =
      MockBroadcastChannel as unknown as typeof BroadcastChannel;
  });

  afterEach(() => {
    globalWithIndexedDB.indexedDB = originalIndexedDB;

    globalWithIndexedDB.BroadcastChannel = originalBroadcastChannel;
    MockBroadcastChannel.channels.clear();

    vi.clearAllMocks();
  });

  it('should return undefined when key is missing', async () => {
    const { result } = renderHook(() =>
      useIndexedDB<string>('missing', {
        dbName: 'useIndexedDB-test',
        channelName: 'useIndexedDB-test',
      }),
    );

    expect(result.current[0]).toBeUndefined();
    expect(result.current[3].isSupported).toBe(true);

    await act(async () => flush());

    expect(result.current[0]).toBeUndefined();
    await waitFor(() => expect(result.current[3].loading).toBe(false));
    expect(result.current[3].error).toBeNull();
  });

  it('should set and persist value', async () => {
    const options = { dbName: 'useIndexedDB-test2', channelName: 'useIndexedDB-test2' };

    const { result } = renderHook(() => useIndexedDB<{ a: number }>('k1', options));

    await act(async () => flush());

    await act(async () => {
      await result.current[1]({ a: 1 });
      await flush();
    });

    await waitFor(() => expect(result.current[0]).toEqual({ a: 1 }));

    const client = createIndexedDBClient(options);
    expect(await client.get('k1')).toEqual({ a: 1 });
    client.close();
  });

  it('should remove value', async () => {
    const options = { dbName: 'useIndexedDB-test3', channelName: 'useIndexedDB-test3' };

    const { result } = renderHook(() => useIndexedDB<string>('k2', options));

    await act(async () => {
      await flush();
      await result.current[1]('hello');
      await flush();
    });

    await waitFor(() => expect(result.current[0]).toBe('hello'));

    await act(async () => {
      await result.current[2]();
      await flush();
    });

    await waitFor(() => expect(result.current[0]).toBeUndefined());

    const client = createIndexedDBClient(options);
    expect(await client.get('k2')).toBeUndefined();
    client.close();
  });

  it('should refresh on BroadcastChannel remote changes', async () => {
    const options = {
      dbName: 'useIndexedDB-test4',
      channelName: 'useIndexedDB-test4',
      broadcast: true,
    };

    const { result } = renderHook(() => useIndexedDB<string>('k3', options));

    await act(async () => flush());

    expect(result.current[0]).toBeUndefined();

    const remoteClient = createIndexedDBClient(options);

    await act(async () => {
      await remoteClient.set('k3', 'remote');
      await flush(6);
    });

    await waitFor(() => expect(result.current[0]).toBe('remote'));
    remoteClient.close();
  });
});
