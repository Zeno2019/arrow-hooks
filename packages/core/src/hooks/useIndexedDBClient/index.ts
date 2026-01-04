import { useEffect, useMemo } from 'react';
import {
  type CreateIndexedDBClientOptions,
  createIndexedDBClient,
  type IndexedDBClient,
} from '../../util';

const useIndexedDBClient = (options: CreateIndexedDBClientOptions = {}): IndexedDBClient => {
  const {
    dbName = 'arrow-hooks',
    storeName = 'keyval',
    version = 1,
    channelName,
    broadcast = true,
  } = options;

  const client = useMemo(() => {
    return createIndexedDBClient({ dbName, storeName, version, channelName, broadcast });
  }, [dbName, storeName, version, channelName, broadcast]);

  useEffect(() => {
    return () => {
      client.close();
    };
  }, [client]);

  return client;
};

export default useIndexedDBClient;
