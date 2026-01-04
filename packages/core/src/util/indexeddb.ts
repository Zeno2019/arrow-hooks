import { isBrowser } from './env';

export type IndexedDBKey = IDBValidKey;
export type IndexedDBChangeType = 'set' | 'delete' | 'clear';

export interface IndexedDBChangeEvent {
  type: IndexedDBChangeType;
  key?: IndexedDBKey;
  origin: 'local' | 'remote';
  sourceId: string;
}

export interface CreateIndexedDBClientOptions {
  dbName?: string;
  storeName?: string;
  version?: number;
  channelName?: string;
  broadcast?: boolean;
}

export interface IndexedDBClient {
  readonly isSupported: boolean;
  readonly dbName: string;
  readonly storeName: string;
  readonly version: number;

  get<T>(key: IndexedDBKey): Promise<T | undefined>;
  set<T>(key: IndexedDBKey, value: T): Promise<void>;
  delete(key: IndexedDBKey): Promise<void>;
  clear(): Promise<void>;
  keys(): Promise<IndexedDBKey[]>;

  subscribe(listener: (event: IndexedDBChangeEvent) => void): () => void;
  subscribeKey(key: IndexedDBKey, listener: (event: IndexedDBChangeEvent) => void): () => void;

  close(): void;
}

const isEqualArrayBuffer = (a: ArrayBuffer, b: ArrayBuffer): boolean => {
  if (a.byteLength !== b.byteLength) return false;

  const viewA = new Uint8Array(a);
  const viewB = new Uint8Array(b);

  for (let i = 0; i < viewA.length; i += 1) {
    if (viewA[i] !== viewB[i]) return false;
  }

  return true;
};

const isEqualArrayBufferView = (a: ArrayBufferView, b: ArrayBufferView): boolean => {
  if (a.byteLength !== b.byteLength) return false;

  const viewA = new Uint8Array(a.buffer, a.byteOffset, a.byteLength);
  const viewB = new Uint8Array(b.buffer, b.byteOffset, b.byteLength);

  for (let i = 0; i < viewA.length; i += 1) {
    if (viewA[i] !== viewB[i]) return false;
  }

  return true;
};

const isEqualIndexedDBKey = (a: IndexedDBKey, b: IndexedDBKey): boolean => {
  if (a === b) return true;

  const typeA = typeof a;
  const typeB = typeof b;
  if (typeA !== typeB) return false;

  if (typeA === 'number' && typeB === 'number') {
    // `NaN` is the only JS number that is not equal to itself.
    // We treat `NaN` keys as equal here so `subscribeKey(NaN, ...)` works as expected.
    return Number.isNaN(a) && Number.isNaN(b);
  }

  if (typeA === 'string' && typeB === 'string') {
    return a === b;
  }

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  if (typeof ArrayBuffer !== 'undefined') {
    if (a instanceof ArrayBuffer && b instanceof ArrayBuffer) {
      return isEqualArrayBuffer(a, b);
    }

    if (ArrayBuffer.isView(a) && ArrayBuffer.isView(b)) {
      return isEqualArrayBufferView(a, b);
    }
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; i += 1) {
      if (!isEqualIndexedDBKey(a[i], b[i])) return false;
    }

    return true;
  }

  return false;
};

const requestToPromise = <T>(request: IDBRequest<T>): Promise<T> => {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const transactionDone = (transaction: IDBTransaction): Promise<void> => {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onabort = () => reject(transaction.error);
    transaction.onerror = () => reject(transaction.error);
  });
};

export function createIndexedDBClient(options: CreateIndexedDBClientOptions = {}): IndexedDBClient {
  const dbName = options.dbName ?? 'arrow-hooks';
  const storeName = options.storeName ?? 'keyval';
  const version = options.version ?? 1;
  const broadcast = options.broadcast ?? true;
  const channelName = options.channelName ?? `${dbName}:${storeName}`;

  const isSupported = isBrowser && typeof indexedDB !== 'undefined';

  const sourceId =
    isBrowser && typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const listeners = new Set<(event: IndexedDBChangeEvent) => void>();
  const keyListeners = new Set<{
    key: IndexedDBKey;
    listener: (event: IndexedDBChangeEvent) => void;
  }>();

  let warnedUnsupported = false;
  let warnedBroadcastUnsupported = false;

  const warnUnsupported = (message: string) => {
    if (process.env.NODE_ENV !== 'development') return;
    if (warnedUnsupported) return;
    warnedUnsupported = true;
    console.warn(message);
  };

  const warnBroadcastUnsupported = (message: string) => {
    if (process.env.NODE_ENV !== 'development') return;
    if (warnedBroadcastUnsupported) return;
    warnedBroadcastUnsupported = true;
    console.warn(message);
  };

  const emit = (event: IndexedDBChangeEvent) => {
    for (const listener of listeners) {
      try {
        listener(event);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('[createIndexedDBClient] listener error', error);
        }
      }
    }

    for (const entry of keyListeners) {
      if (event.type === 'clear') {
        entry.listener(event);
        continue;
      }

      if (event.key !== undefined && isEqualIndexedDBKey(event.key, entry.key)) {
        entry.listener(event);
      }
    }
  };

  let channel: BroadcastChannel | null = null;

  const ensureChannel = () => {
    if (!isSupported || !broadcast) return;
    if (channel) return;

    if (!isBrowser || typeof window.BroadcastChannel === 'undefined') {
      warnBroadcastUnsupported('[createIndexedDBClient] BroadcastChannel is not supported.');
      return;
    }

    try {
      channel = new BroadcastChannel(channelName);
      channel.onmessage = (event: MessageEvent) => {
        const data = event.data as Partial<{
          type: IndexedDBChangeType;
          key: IndexedDBKey;
          sourceId: string;
        }>;

        if (!data || typeof data !== 'object') return;
        if (data.sourceId === sourceId) return;

        if (data.type !== 'set' && data.type !== 'delete' && data.type !== 'clear') return;

        emit({
          type: data.type,
          key: data.key,
          origin: 'remote',
          sourceId: data.sourceId ?? 'unknown',
        });
      };
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[createIndexedDBClient] Failed to create BroadcastChannel', error);
      }
    }
  };

  const post = (type: IndexedDBChangeType, key?: IndexedDBKey) => {
    if (!broadcast) return;

    ensureChannel();
    if (!channel) return;

    try {
      channel.postMessage({ type, key, sourceId });
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[createIndexedDBClient] Failed to post message', error);
      }
    }
  };

  let db: IDBDatabase | null = null;
  let dbPromise: Promise<IDBDatabase> | null = null;

  const openDB = async (): Promise<IDBDatabase> => {
    if (!isSupported) {
      warnUnsupported('[createIndexedDBClient] IndexedDB is not supported in this environment.');
      throw new Error('IndexedDB is not supported in this environment.');
    }

    if (db) return db;
    if (dbPromise) return dbPromise;

    dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(dbName, version);

      request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains(storeName)) {
          database.createObjectStore(storeName);
        }
      };

      request.onsuccess = () => {
        db = request.result;

        db.onversionchange = () => {
          db?.close();
          db = null;
          dbPromise = null;
        };

        resolve(db);
      };

      request.onblocked = () => {
        if (process.env.NODE_ENV === 'development') {
          console.warn(
            `[createIndexedDBClient] indexedDB.open("${dbName}") is blocked. Close other tabs and retry.`,
          );
        }
      };

      request.onerror = () => {
        reject(request.error);
      };
    });

    try {
      return await dbPromise;
    } catch (error) {
      dbPromise = null;
      throw error;
    }
  };

  const withStore = async <T>(
    mode: IDBTransactionMode,
    fn: (store: IDBObjectStore) => Promise<T>,
  ): Promise<T> => {
    const database = await openDB();

    let transaction: IDBTransaction;
    try {
      transaction = database.transaction(storeName, mode);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error(
          `[createIndexedDBClient] Failed to create transaction for store "${storeName}". ` +
            'If you changed storeName, you likely need to bump version to trigger onupgradeneeded.',
          error,
        );
      }
      throw error;
    }

    const store = transaction.objectStore(storeName);

    let result: T;
    try {
      result = await fn(store);
    } catch (error) {
      try {
        transaction.abort();
      } catch {
        // ignore
      }
      throw error;
    }

    await transactionDone(transaction);
    return result;
  };

  const client: IndexedDBClient = {
    isSupported,
    dbName,
    storeName,
    version,

    async get<T>(key: IndexedDBKey): Promise<T | undefined> {
      if (!isSupported) {
        warnUnsupported('[createIndexedDBClient] IndexedDB is not supported in this environment.');
        return undefined;
      }

      return withStore('readonly', async (store) => {
        const value = await requestToPromise(store.get(key) as IDBRequest<T | undefined>);
        return value;
      });
    },

    async set<T>(key: IndexedDBKey, value: T): Promise<void> {
      if (!isSupported) {
        warnUnsupported('[createIndexedDBClient] IndexedDB is not supported in this environment.');
        return;
      }

      await withStore('readwrite', async (store) => {
        await requestToPromise(store.put(value as unknown, key));
      });

      const event: IndexedDBChangeEvent = { type: 'set', key, origin: 'local', sourceId };
      emit(event);
      post('set', key);
    },

    async delete(key: IndexedDBKey): Promise<void> {
      if (!isSupported) {
        warnUnsupported('[createIndexedDBClient] IndexedDB is not supported in this environment.');
        return;
      }

      await withStore('readwrite', async (store) => {
        await requestToPromise(store.delete(key));
      });

      const event: IndexedDBChangeEvent = { type: 'delete', key, origin: 'local', sourceId };
      emit(event);
      post('delete', key);
    },

    async clear(): Promise<void> {
      if (!isSupported) {
        warnUnsupported('[createIndexedDBClient] IndexedDB is not supported in this environment.');
        return;
      }

      await withStore('readwrite', async (store) => {
        await requestToPromise(store.clear());
      });

      const event: IndexedDBChangeEvent = { type: 'clear', origin: 'local', sourceId };
      emit(event);
      post('clear');
    },

    async keys(): Promise<IndexedDBKey[]> {
      if (!isSupported) {
        warnUnsupported('[createIndexedDBClient] IndexedDB is not supported in this environment.');
        return [];
      }

      return withStore('readonly', async (store) => {
        if (typeof store.getAllKeys === 'function') {
          const allKeys = await requestToPromise(store.getAllKeys());
          return allKeys as IndexedDBKey[];
        }

        const collected: IndexedDBKey[] = [];

        await new Promise<void>((resolve, reject) => {
          const request = store.openCursor();

          request.onsuccess = () => {
            const cursor = request.result;
            if (!cursor) {
              resolve();
              return;
            }

            collected.push(cursor.key);
            cursor.continue();
          };

          request.onerror = () => {
            reject(request.error);
          };
        });

        return collected;
      });
    },

    subscribe(listener: (event: IndexedDBChangeEvent) => void): () => void {
      ensureChannel();

      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },

    subscribeKey(key: IndexedDBKey, listener: (event: IndexedDBChangeEvent) => void): () => void {
      ensureChannel();

      const entry = { key, listener };
      keyListeners.add(entry);

      return () => {
        keyListeners.delete(entry);
      };
    },

    close(): void {
      listeners.clear();
      keyListeners.clear();

      if (channel) {
        try {
          channel.close();
        } catch {
          // ignore
        }
        channel = null;
      }

      if (db) {
        try {
          db.close();
        } catch {
          // ignore
        }
        db = null;
      }

      dbPromise = null;
    },
  };

  return client;
}
