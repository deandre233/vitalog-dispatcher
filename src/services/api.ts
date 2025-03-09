
import { supabase } from "@/integrations/supabase/client";

export async function fetchPatients(params?: {
  search?: string;
  filters?: Record<string, any>;
  limit?: number;
  offset?: number;
}) {
  try {
    let query = supabase.from("patients").select("*");

    if (params?.search) {
      query = query.or(
        `first_name.ilike.%${params.search}%,last_name.ilike.%${params.search}%,email.ilike.%${params.search}%`
      );
    }

    if (params?.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value) {
          query = query.eq(key, value);
        }
      });
    }

    if (params?.limit) {
      query = query.limit(params.limit);
    }

    if (params?.offset) {
      query = query.range(params.offset, params.offset + (params.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching patients:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

// Simplified pagination params
export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface FetchResourceParams {
  search?: string;
  filters?: Record<string, any>;
  pagination?: PaginationParams;
  sort?: {
    field: string;
    direction: 'asc' | 'desc';
  };
}

// Fixed function with properly typed parameters to avoid excessive type instantiation
export async function fetchResource<T>(
  resourceName: string,
  params?: FetchResourceParams
): Promise<{ data: T[] | null; count: number | null; error: string | null }> {
  try {
    // Using type assertion to handle the dynamic table name
    // This bypasses TypeScript's type checking for the table name
    const query = supabase.from(resourceName as any).select("*", { count: "exact" });

    if (params?.search) {
      query.or(`name.ilike.%${params.search}%,description.ilike.%${params.search}%`);
    }

    if (params?.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query.eq(key, value);
        }
      });
    }

    if (params?.sort) {
      query.order(params.sort.field, {
        ascending: params.sort.direction === 'asc',
      });
    }

    if (params?.pagination) {
      const { page, pageSize } = params.pagination;
      const start = (page - 1) * pageSize;
      const end = start + pageSize - 1;
      query.range(start, end);
    }

    const { data, error, count } = await query;

    if (error) {
      throw new Error(error.message);
    }

    // Using type assertion to safely convert the dynamic data to the expected type
    return { 
      data: data as unknown as T[], 
      count, 
      error: null 
    };
  } catch (error) {
    console.error(`Error fetching ${resourceName}:`, error);
    return {
      data: null,
      count: null,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
