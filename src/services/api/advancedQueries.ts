
import { supabase } from './apiClient';
import { TableName } from './types';
import { handleError } from "@/utils/errorHandling";

/**
 * Execute a raw SQL query (use with caution)
 */
export async function executeRawQuery<T>(query: string, params: any[] = []): Promise<T[]> {
  try {
    logger.info(`Executing raw query`, { query, params });
    // Using a direct database query would be better but we don't have direct DB access
    // For now, we'll warn about this limitation
    logger.warn("Raw SQL execution is not available without a custom edge function");
    throw new Error("Raw SQL execution requires a custom edge function");
  } catch (error) {
    handleError(error);
    throw error;
  }
}

/**
 * Count records in a table with optional filtering
 */
export async function count(table: TableName, filters: Record<string, unknown> = {}): Promise<number> {
  try {
    logger.info(`Counting records in ${table}`, filters);
    let query = supabase.from(table).select('*', { count: 'exact', head: true });
    
    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        query = query.eq(key, value);
      }
    });
    
    const { count: resultCount, error } = await query;
    
    if (error) throw error;
    return resultCount || 0;
  } catch (error) {
    handleError(error);
    throw error;
  }
}

// Import logger
import { logger } from './cache-utils';
