
import { createClient } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// Define the allowed table names based on what exists in your Supabase instance
export type TableNames = 
  | 'patients' 
  | 'employees' 
  | 'partners'
  | 'transport_records' 
  | 'incidents';

export interface QueryParams {
  limit?: number;
  offset?: number;
  order?: {
    column: string;
    direction: 'asc' | 'desc';
  };
  filters?: {
    column: string;
    operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'ilike' | 'is';
    value: any;
  }[];
  search?: {
    column: string;
    query: string;
  };
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
  count?: number;
}

export interface ListResponse<T> {
  items: T[];
  count: number;
}

export async function fetchFromSupabase<T>(
  table: TableNames,
  options: {
    id?: string;
    query?: any;
    queryParams?: QueryParams;
  } = {}
): Promise<ApiResponse<T>> {
  try {
    const { id, query, queryParams } = options;
    let supabaseQuery = supabase.from(table);

    if (id) {
      const { data, error } = await supabaseQuery.select('*').eq('id', id).single();
      return {
        data: data as unknown as T,
        error: error ? error.message : null,
        status: error ? 400 : 200
      };
    } else if (query) {
      const result = await query(supabaseQuery);
      return {
        data: result.data as unknown as T,
        error: result.error ? result.error.message : null,
        status: result.error ? 400 : 200,
        count: result.count
      };
    } else {
      let query = supabaseQuery.select('*', { count: 'exact' });

      if (queryParams) {
        // Apply ordering
        if (queryParams.order) {
          const { column, direction } = queryParams.order;
          query = query.order(column, { ascending: direction === 'asc' });
        }

        // Apply filters
        if (queryParams.filters && queryParams.filters.length > 0) {
          queryParams.filters.forEach(filter => {
            const { column, operator, value } = filter;
            switch (operator) {
              case 'eq':
                query = query.eq(column, value);
                break;
              case 'neq':
                query = query.neq(column, value);
                break;
              case 'gt':
                query = query.gt(column, value);
                break;
              case 'gte':
                query = query.gte(column, value);
                break;
              case 'lt':
                query = query.lt(column, value);
                break;
              case 'lte':
                query = query.lte(column, value);
                break;
              case 'like':
              case 'ilike':
                query = query.ilike(column, `%${value}%`);
                break;
              case 'is':
                query = query.is(column, value);
                break;
            }
          });
        }

        // Apply search
        if (queryParams.search) {
          const { column, query: searchQuery } = queryParams.search;
          query = query.ilike(column, `%${searchQuery}%`);
        }

        // Apply pagination
        if (queryParams.limit !== undefined && queryParams.offset !== undefined) {
          query = query.range(
            queryParams.offset, 
            queryParams.offset + queryParams.limit - 1
          );
        }
      }

      const { data, error, count } = await query;

      return {
        data: data as unknown as T,
        error: error ? error.message : null,
        status: error ? 400 : 200,
        count
      };
    }
  } catch (error: any) {
    return {
      data: null,
      error: error.message || 'An unknown error occurred',
      status: 500
    };
  }
}

// Simple API wrapper for CRUD operations
export const api = {
  async get<T>(table: TableNames, id: string): Promise<T> {
    const response = await fetchFromSupabase<T>(table, { id });
    if (response.error) {
      throw new Error(response.error);
    }
    return response.data as T;
  },
  
  async list<T>(table: TableNames, queryParams?: QueryParams): Promise<ListResponse<T>> {
    const response = await fetchFromSupabase<T[]>(table, { queryParams });
    if (response.error) {
      throw new Error(response.error);
    }
    return {
      items: response.data as T[],
      count: response.count || 0
    };
  },
  
  async create<T>(table: TableNames, data: any): Promise<T> {
    const { data: result, error } = await supabase.from(table).insert(data).select().single();
    if (error) {
      throw new Error(error.message);
    }
    return result as unknown as T;
  },
  
  async update<T>(table: TableNames, id: string, data: any): Promise<T> {
    const { data: result, error } = await supabase.from(table).update(data).eq('id', id).select().single();
    if (error) {
      throw new Error(error.message);
    }
    return result as unknown as T;
  },
  
  async delete(table: TableNames, id: string): Promise<void> {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) {
      throw new Error(error.message);
    }
  }
};

export const fetchData = async <T>(endpoint: string): Promise<ApiResponse<T>> => {
  try {
    return { data: null, error: null, status: 200 } as ApiResponse<T>;
  } catch (error: any) {
    return {
      data: null,
      error: error.message || 'An unknown error occurred',
      status: 500
    };
  }
};
