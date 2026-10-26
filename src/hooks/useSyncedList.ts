import { useCallback, useEffect, useRef, useState } from 'react';
import { CloudTable } from '../services/cloudSync';
import { reportError } from '../utils/reportError';
import { usePersistedState } from './usePersistedState';

/** "disabled" = no Supabase keys in .env; "offline" = last cloud request failed. */
export type CloudStatus = 'disabled' | 'syncing' | 'synced' | 'offline';

/**
 * A user's list saved on the device (AsyncStorage) and copied to the cloud (Supabase).
 * - The device copy loads first, so the app works offline and opens fast.
 * - Nothing saved on this device yet (new install): the list is restored from the cloud.
 * - Otherwise the device copy wins: it is uploaded and items removed on the device
 *   (even while offline) are removed from the cloud too.
 * - A cloud failure only changes `cloudStatus`; the device data keeps working.
 */
export function useSyncedList<T extends { id: string }>(
  storageKey: string | null,
  owner: string | null,
  table: CloudTable<T> | null,
  initialValue: T[],
) {
  const { value: items, setValue: setItems, isHydrating, hasSavedValue } = usePersistedState(
    storageKey,
    initialValue,
  );
  const [cloudStatus, setCloudStatus] = useState<CloudStatus>(table ? 'syncing' : 'disabled');

  // Latest items, read by the sync below without making it run on every change.
  const itemsRef = useRef(items);
  itemsRef.current = items;

  useEffect(() => {
    if (!table || !owner || isHydrating) return;
    let active = true;
    setCloudStatus('syncing');
    const sync = async () => {
      const cloudItems = await table.fetchAll(owner);
      if (!active) return;
      if (!hasSavedValue) {
        // Keeps anything the user added while the cloud was still loading.
        setItems((current) => {
          const currentIds = new Set(current.map((item) => item.id));
          return [...current, ...cloudItems.filter((item) => !currentIds.has(item.id))];
        });
        return;
      }
      const local = itemsRef.current;
      const localIds = new Set(local.map((item) => item.id));
      await table.saveAll(owner, local);
      await table.removeAll(
        owner,
        cloudItems.filter((item) => !localIds.has(item.id)).map((item) => item.id),
      );
    };
    sync()
      .then(() => {
        if (active) setCloudStatus('synced');
      })
      .catch((error: unknown) => {
        reportError('cloud: sync', error);
        if (active) setCloudStatus('offline');
      });
    return () => {
      active = false;
    };
  }, [table, owner, isHydrating, hasSavedValue, setItems]);

  const runInCloud = useCallback(
    (task: (cloud: CloudTable<T>, cloudOwner: string) => Promise<void>) => {
      if (!table || !owner) return;
      task(table, owner)
        .then(() => setCloudStatus('synced'))
        .catch((error: unknown) => {
          // The change is already saved on the device; the next sync sends it again.
          reportError('cloud: save change', error);
          setCloudStatus('offline');
        });
    },
    [table, owner],
  );

  const saveToCloud = useCallback(
    (item: T) => runInCloud((cloud, cloudOwner) => cloud.saveAll(cloudOwner, [item])),
    [runInCloud],
  );

  const removeFromCloud = useCallback(
    (id: string) => runInCloud((cloud, cloudOwner) => cloud.removeAll(cloudOwner, [id])),
    [runInCloud],
  );

  return { items, setItems, isHydrating, cloudStatus, saveToCloud, removeFromCloud };
}
