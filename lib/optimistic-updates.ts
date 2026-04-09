import { QueryClient } from '@tanstack/react-query';

/**
 * Update fn that receives whatever shape the cache currently holds
 */
export type UpdateFunction<T> = (oldData: T) => T | null;

/**
 * Snapshot type: pairs of [queryKey, prevData] for rollback
 */
export type QueryDataAny = [readonly unknown[], unknown][];

/**
 * Optional guard fn to limit which queries are opt updated
 */
export type Guard = (meta: { queryKey: readonly unknown[]; data: unknown }) => boolean;

/**
 * Await cancel, snapshot *all* shapes, apply updates with an optional guard
 * @param queryClient - The query client to use
 * @param queryKey - The query key to update
 * @param updateFn - The update function to apply
 * @param guard - The guard function to limit which queries are opt updated
 * @returns The previous data snapshot
 */
export async function handleOptimisticUpdateGuarded(
  queryClient: QueryClient,
  queryKey: readonly unknown[],
  updateFn: UpdateFunction<any>,
  guard?: Guard,
) {
  await queryClient.invalidateQueries({ queryKey });
  const prevData = queryClient.getQueriesData({ queryKey }); // any shape

  prevData.forEach(([k, d]) => {
    if (typeof d === 'undefined') return;
    if (guard && !guard({ queryKey: k, data: d })) return;
    queryClient.setQueryData(k, (curr: any) => updateFn(curr));
  });

  return { prevData };
}

/**
 * Rolls back the opt update to the previous snapshot
 * @param queryClient - The query client to use
 * @param prevData - The previous data snapshot
 */
export function handleOptimisticError(queryClient: QueryClient, prevData?: QueryDataAny) {
  prevData?.forEach(([key, old]) => {
    queryClient.setQueryData(key, old);
  });
}

/**
 * Safely update arrays or infinte queries. Leaves singletons alone unless you choose to handle them outside
 * @param mutateArray - The function to mutate the array
 * @returns The updated data
 */
export function updateInfiniteOrArray<T>(mutateArray: (arr: T[]) => T[]) {
  return (old: any) => {
    if (!old) return old;

    // Infinite queries: { pages: T[][] | t[], pagePrams: any[] }
    if (typeof old === 'object' && 'pages' in old && Array.isArray(old.pages)) {
      const nextPages = old.pages.map((p: any) => (Array.isArray(p) ? mutateArray(p) : p));
      return { ...old, pages: nextPages };
    }

    // Plain array lists
    if (Array.isArray(old)) return mutateArray(old);

    // Leave singletons alone (manage with a seperate update if needed)
    return old;
  };
}

/**
 * Upsert an item into an array by a key. Optionally sort the array.
 * @param key - The key to upsert by
 * @param item - The item to upsert
 * @param sort - The sort function to use
 * @returns The updated array
 */
export function upsertByKey<T, K extends keyof T>(key: K, item: T, sort?: (a: T, b: T) => number) {
  return (arr: T[]) => {
    const map = new Map<any, T>();
    map.set(item[key] as any, item);
    const next = Array.from(map.values());
    return sort ? next.sort(sort) : next;
  };
}

/**
 * Remove an item from an array by a key.
 * @param key - The key to remove by
 * @param value - The value to remove
 * @returns The updated array
 */
export function removeByKey<T, K extends keyof T>(key: K, value: T[K]) {
  return (arr: T[]) => {
    arr.filter((x) => x[key] !== value);
  };
}

export function replaceIdEverywhere<T, K extends keyof T>(key: K, tempId: T[K], realId: T[K]) {
  const swap = (x: T) => (x[key] === tempId ? { ...x, [key]: realId } : x);

  return (data: any) => {
    if (!data) return data;
    if (Array.isArray(data)) return data.map(swap);
    if (typeof data === 'object' && 'pages' in data && Array.isArray(data.pages)) {
      return {
        ...data,
        pages: data.pages.map((p: any) => (Array.isArray(p) ? p.map(swap) : swap(p))),
      };
    }
    if (typeof data === 'object' && data !== null && key in data) {
      return (data as T)[key] === tempId ? { ...(data as T), [key]: realId } : data;
    }
    return data;
  };
}

export function ActionFactory<T, K extends keyof T>(key: K) {
  return {
    create: (item: T) => (old: T[] | T | null | undefined) => {
      if (!old) return item;
      if (Array.isArray(old)) return [...old, item];
      //singleton
      return (old as T)[key] === item[key] ? item : old;
    },

    update: (item: T) => (old: T[] | T | null | undefined) => {
      if (!old) return old;
      if (Array.isArray(old)) return old.map((x) => (x[key] === item[key] ? item : x));
      //singleton
      return (old as T)[key] === item[key] ? item : old;
    },

    remove: (item: T) => (old: T[] | T | null | undefined) => {
      if (!old) return old;
      if (Array.isArray(old)) return old.filter((x) => x[key] !== item[key]);
      //singleton
      return (old as T)[key] === item[key] ? null : old;
    },
  };
}
