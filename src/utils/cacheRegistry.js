const familyScopedCacheClearers = new Set();

export function registerFamilyScopedCacheClearer(clearer) {
  if (typeof clearer !== 'function') return () => {};

  familyScopedCacheClearers.add(clearer);
  return () => familyScopedCacheClearers.delete(clearer);
}

export function clearFamilyScopedCaches() {
  for (const clearer of familyScopedCacheClearers) {
    try {
      clearer();
    } catch (error) {
      console.error('Failed to clear family-scoped cache', error);
    }
  }
}
