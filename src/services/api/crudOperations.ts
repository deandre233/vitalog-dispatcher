
import { supabase, logger, cache, CACHE_TTL } from './apiClient';
import { TableName, QueryParams } from './types';
import { handleError } from "@/utils/errorHandling";

/**
 * Fetch records from a table with optional filtering
 */
export async function get<T>(table: TableName, query: QueryParams = {}, useCache = false): Promise<T[]> {
  try {
    const cacheKey = useCache ? `${table}-${JSON.stringify(query)}` : null;
    
    // Check cache if enabled
    if (cacheKey && cache.has(cacheKey)) {
      const cachedData = cache.get(cacheKey);
      if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
        logger.info(`Cache hit for ${table}`, { query });
        return cachedData.data as T[];
      }
      // Cache expired, remove it
      cache.delete(cacheKey);
    }
    
    logger.info(`Fetching data from ${table}`, query);
    let dbQuery = supabase.from(table).select(query.select || '*');

    // Apply ordering
    if (query.orderBy) {
      dbQuery = dbQuery.order(query.orderBy.column, { ascending: query.orderBy.ascending ?? false });
    }
    
    // Apply limit and offset for pagination
    if (query.limit) {
      dbQuery = dbQuery.limit(query.limit);
    }
    
    if (query.offset) {
      dbQuery = dbQuery.range(query.offset, query.offset + (query.limit || 10) - 1);
    }

    // Apply advanced filters
    if (query.filters && Array.isArray(query.filters)) {
      for (const filter of query.filters) {
        switch (filter.operator) {
          case 'eq':
            dbQuery = dbQuery.eq(filter.column, filter.value);
            break;
          case 'neq':
            dbQuery = dbQuery.neq(filter.column, filter.value);
            break;
          case 'gt':
            dbQuery = dbQuery.gt(filter.column, filter.value);
            break;
          case 'gte':
            dbQuery = dbQuery.gte(filter.column, filter.value);
            break;
          case 'lt':
            dbQuery = dbQuery.lt(filter.column, filter.value);
            break;
          case 'lte':
            dbQuery = dbQuery.lte(filter.column, filter.value);
            break;
          case 'like':
            dbQuery = dbQuery.like(filter.column, filter.value as string);
            break;
          case 'ilike':
            dbQuery = dbQuery.ilike(filter.column, filter.value as string);
            break;
          case 'in':
            dbQuery = dbQuery.in(filter.column, filter.value as any[]);
            break;
          case 'is':
            dbQuery = dbQuery.is(filter.column, filter.value as boolean | null);
            break;
        }
      }
    }

    // Filter out special keys and apply equals filter for the rest (backward compatibility)
    Object.entries(query).forEach(([key, value]) => {
      if (!['select', 'orderBy', 'limit', 'offset', 'filters'].includes(key) && value !== undefined) {
        dbQuery = dbQuery.eq(key, value);
      }
    });

    const { data, error } = await dbQuery;

    if (error) throw error;
    
    // Store in cache if caching is enabled
    if (cacheKey) {
      cache.set(cacheKey, { data, timestamp: Date.now() });
    }
    
    return data as T[];
  } catch (error) {
    handleError(error);
    throw error;
  }
}

/**
 * Fetch a single record by ID
 */
export async function getById<T>(table: TableName, id: string, query: QueryParams = {}): Promise<T | null> {
  try {
    logger.info(`Fetching ${table} by id: ${id}`, query);
    const { data, error } = await supabase
      .from(table)
      .select(query.select || '*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data as T;
  } catch (error) {
    handleError(error);
    throw error;
  }
}

/**
 * Create a new record
 */
export async function create<T>(table: TableName, data: Record<string, unknown>): Promise<T> {
  try {
    logger.info(`Creating new ${table}`, data);
    const { data: created, error } = await supabase
      .from(table)
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    
    // Invalidate any cached queries for this table
    invalidateCache(table);
    
    return created as T;
  } catch (error) {
    handleError(error);
    throw error;
  }
}

/**
 * Update an existing record
 */
export async function update<T>(table: TableName, id: string, data: Record<string, unknown>): Promise<T> {
  try {
    logger.info(`Updating ${table} ${id}`, data);
    const { data: updated, error } = await supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    // Invalidate any cached queries for this table
    invalidateCache(table);
    
    return updated as T;
  } catch (error) {
    handleError(error);
    throw error;
  }
}

/**
 * Delete a record
 */
export async function deleteRecord(table: TableName, id: string): Promise<void> {
  try {
    logger.info(`Deleting ${table} ${id}`);
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    // Invalidate any cached queries for this table
    invalidateCache(table);
  } catch (error) {
    handleError(error);
    throw error;
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
