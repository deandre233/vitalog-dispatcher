
import { cache, CACHE_TTL, logger } from './apiClient';
import { TableName } from './types';

/**
 * Check if data exists in cache and is valid
 */
export function getCachedData<T>(cacheKey: string | null): T[] | null {
  if (!cacheKey || !cache.has(cacheKey)) {
    return null;
  }

  const cachedData = cache.get(cacheKey);
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
    logger.info(`Cache hit for key: ${cacheKey}`);
    return cachedData.data as T[];
  }

  // Cache expired, remove it
  cache.delete(cacheKey);
  return null;
}

/**
 * Store data in cache with the current timestamp
 */
export function setCacheData<T>(cacheKey: string | null, data: T[]): void {
  if (cacheKey) {
    cache.set(cacheKey, { data, timestamp: Date.now() });
  }
}

/**
 * Clear cache for a specific table or all tables
 */
export function invalidateCache(table?: TableName): void {
  if (table) {
    // Delete all cache entries for this table
    const keysToDelete: string[] = [];
    cache.forEach((_, key) => {
      if (key.startsWith(`${table}-`)) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => cache.delete(key));
    logger.info(`Cache invalidated for table: ${table}`);
  } else {
    // Clear the entire cache
    cache.clear();
    logger.info('Complete cache invalidated');
  }
}
