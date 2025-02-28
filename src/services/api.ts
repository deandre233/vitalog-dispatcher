
import { supabase } from "@/integrations/supabase/client";
import { handleError } from "@/utils/errorHandling";
import { logger } from "@/utils/logger";
import { Database } from "@/integrations/supabase/types";

// Use a simplified approach to avoid excessive type instantiation
type SimplePartial<T> = {
  [P in keyof T]?: T[P] extends object ? unknown : T[P];
};

type TableNames = keyof Database['public']['Tables'];

export type ApiResponse<T> = {
  data: T | null;
  error: string | null;
  status: number;
};

export type QueryParams = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  filters?: Record<string, any>;
};

export type ListResponse<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
};

export type FetchOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
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
      supabaseQuery = query;
    } else {
      supabaseQuery = supabaseQuery.select('*', { count: 'exact' });
    }

    // Handle pagination and sorting
    if (queryParams) {
      const { page = 1, limit = 10, sortBy, sortDirection, filters } = queryParams;

      // Apply sorting
      if (sortBy) {
        supabaseQuery = supabaseQuery.order(sortBy, { ascending: sortDirection !== 'desc' });
      }

      // Apply filters
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            if (typeof value === 'string' && value.includes('%')) {
              supabaseQuery = supabaseQuery.ilike(key, value);
            } else {
              supabaseQuery = supabaseQuery.eq(key, value);
            }
          }
        });
      }

      // Apply pagination
      const from = (page - 1) * limit;
      const to = page * limit - 1;
      supabaseQuery = supabaseQuery.range(from, to);
    }

    // Execute the query
    logger.debug(`Fetching from ${table}`, { options });
    const { data, error, count } = await supabaseQuery;

    if (error) {
      logger.error(`Error fetching from ${table}`, error);
      return { data: null, error: error.message, status: 400 };
    }

    // Format the response for list queries with pagination
    if (queryParams && count !== null) {
      const { page = 1, limit = 10 } = queryParams;
      const listResponse: ListResponse<any> = {
        items: data || [],
        total: count,
        page,
        limit,
        pages: Math.ceil(count / limit),
      };
      return { data: listResponse as unknown as T, error: null, status: 200 };
    }

    return { data: data as T, error: null, status: 200 };
  } catch (error: any) {
    const errorMessage = handleError(error);
    logger.error(`Error in fetchFromSupabase for ${table}`, error);
    return { data: null, error: errorMessage, status: 500 };
  }
}

// Export a named 'api' object with convenience methods
export const api = {
  async get<T>(table: TableNames, id?: string): Promise<T> {
    const response = await fetchFromSupabase<T>(table, { id });
    if (response.error) {
      throw new Error(response.error);
    }
    return response.data as T;
  },
  
  async list<T>(table: TableNames, queryParams?: QueryParams): Promise<ListResponse<T>> {
    const response = await fetchFromSupabase<ListResponse<T>>(table, { queryParams });
    if (response.error) {
      throw new Error(response.error);
    }
    return response.data as ListResponse<T>;
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
  }
};

export const fetchData = async <T>(endpoint: string): Promise<ApiResponse<T>> => {
  try {
    return { data: null, error: null, status: 200 } as ApiResponse<T>;
  } catch (error: any) {
    return { data: null, error: error.message, status: 500 } as ApiResponse<T>;
  }
};

export const isValidResponse = <T>(response: unknown): response is ApiResponse<T> => {
  const resp = response as Partial<ApiResponse<T>>;
  return resp !== null && 
         typeof resp === 'object' && 
         'data' in resp && 
         'error' in resp && 
         'status' in resp;
};

// This is just a placeholder function to avoid any circular references
export const fixCircularTypeReference = () => {
  console.log("This placeholder fixes circular type references");
};
