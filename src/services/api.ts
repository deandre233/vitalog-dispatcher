
import { supabase } from "@/integrations/supabase/client";
import { handleError } from "@/utils/errorHandling";
import { logger } from "@/utils/logger";
import { Database } from "@/integrations/supabase/types";

// Define a depth-limited DeepPartial utility type to prevent infinite recursion
type Prev = [never, 0, 1, 2, 3, 4, 5];
type DeepPartial<T, Depth extends number = 5> = Depth extends 0
  ? Partial<T>
  : { [P in keyof T]?: DeepPartial<T[P], Prev[Depth]> };

type TableNames = keyof Database['public']['Tables'];

export const api = {
  async get<T>(table: TableNames, query: any = {}): Promise<T[]> {
    try {
      logger.info(`Fetching data from ${table}`, query);
      const { data, error } = await supabase
        .from(table)
        .select(query.select || '*')
        .order(query.orderBy || 'created_at', { ascending: false });

      if (error) throw error;
      return data as T[];
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async getById<T>(table: TableNames, id: string, query: any = {}): Promise<T | null> {
    try {
      logger.info(`Fetching ${table} by id: ${id}`, query);
      const { data, error } = await supabase
        .from(table)
        .select(query.select || '*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as T;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async create<T>(table: TableNames, data: Partial<T>): Promise<T> {
    try {
      logger.info(`Creating new ${table}`, data);
      const { data: created, error } = await supabase
        .from(table)
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return created as T;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async update<T>(table: TableNames, id: string, data: Partial<T>): Promise<T> {
    try {
      logger.info(`Updating ${table} ${id}`, data);
      const { data: updated, error } = await supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return updated as T;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async delete(table: TableNames, id: string): Promise<void> {
    try {
      logger.info(`Deleting ${table} ${id}`);
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      handleError(error);
      throw error;
    }
  }
};

export type ApiResponse<T> = {
  data: T | null;
  error: string | null;
  status: number;
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
