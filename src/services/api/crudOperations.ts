
import { supabase } from './apiClient';
import { TableName, QueryParams } from './types';
import { applyFilters } from './filter-helpers';
import { getCachedData, setCacheData, invalidateCache, logger } from './cache-utils';
import { handleApiError } from './error-handler';

/**
 * Fetch records from a table with optional filtering
 */
export async function get<T>(table: TableName, query: QueryParams = {}, useCache = false): Promise<T[]> {
  try {
    const cacheKey = useCache ? `${table}-${JSON.stringify(query)}` : null;
    
    // Check cache if enabled
    const cachedData = getCachedData<T>(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    
    logger.info(`Fetching data from ${table}`, query);
    let dbQuery = supabase.from(table).select(query.select || '*');

    // Apply filters, ordering, pagination
    dbQuery = applyFilters(dbQuery, query);

    const { data, error } = await dbQuery;

    if (error) throw error;
    
    // Store in cache if caching is enabled
    setCacheData(cacheKey, data);
    
    return data as T[];
  } catch (error) {
    return handleApiError(error, `get(${table})`);
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
    return handleApiError(error, `getById(${table}, ${id})`);
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
    return handleApiError(error, `create(${table})`);
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
    return handleApiError(error, `update(${table}, ${id})`);
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
    handleApiError(error, `deleteRecord(${table}, ${id})`);
  }
}

// Re-export invalidateCache for external use
export { invalidateCache };
