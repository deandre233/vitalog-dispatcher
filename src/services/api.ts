
import { createClient } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export type TableNames = 
  | 'users' 
  | 'dispatches' 
  | 'patients' 
  | 'employees' 
  | 'partners'
  | 'authorizations' 
  | 'certificates'
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

// Use a simpler type to avoid excessive recursion
type SimplePartial<T> = {
  [P in keyof T]?: unknown;
};

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
    let supabaseQuery: any = supabase.from(table);

    if (id) {
      supabaseQuery = supabaseQuery.select('*').eq('id', id).single();
    } else if (query) {
      supabaseQuery = query(supabaseQuery);
    } else {
      supabaseQuery = supabaseQuery.select('*', { count: 'exact' });

      if (queryParams) {
        // Apply ordering
        if (queryParams.order) {
          const { column, direction } = queryParams.order;
          supabaseQuery = supabaseQuery.order(column, { ascending: direction === 'asc' });
        }

        // Apply filters
        if (queryParams.filters && queryParams.filters.length > 0) {
          queryParams.filters.forEach(filter => {
            const { column, operator, value } = filter;
            if (operator === 'like' || operator === 'ilike') {
              supabaseQuery = supabaseQuery[operator](column, `%${value}%`);
            } else {
              supabaseQuery = supabaseQuery[operator](column, value);
            }
          });
        }

        // Apply search
        if (queryParams.search) {
          const { column, query } = queryParams.search;
          supabaseQuery = supabaseQuery.ilike(column, `%${query}%`);
        }

        // Apply pagination
        if (queryParams.limit !== undefined && queryParams.offset !== undefined) {
          supabaseQuery = supabaseQuery.range(
            queryParams.offset, 
            queryParams.offset + queryParams.limit - 1
          );
        }
      }
    }

    const { data, error, count } = await supabaseQuery;

    return {
      data: data as T,
      error: error ? error.message : null,
      status: error ? 400 : 200,
      count
    };
  } catch (error: any) {
    return {
      data: null,
      error: error.message || 'An unknown error occurred',
      status: 500
    };
  }
}

// Fixing the delete function to return void instead of string
export const api = {
  async get<T>(table: TableNames, id?: string): Promise<T> {
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
    return result as T;
  },
  
  async update<T>(table: TableNames, id: string, data: any): Promise<T> {
    const { data: result, error } = await supabase.from(table).update(data).eq('id', id).select().single();
    if (error) {
      throw new Error(error.message);
    }
    return result as T;
  },
  
  async delete(table: TableNames, id: string): Promise<void> {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) {
      throw new Error(error.message);
    }
    // Return void explicitly
    return;
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
