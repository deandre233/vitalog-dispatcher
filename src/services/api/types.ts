
import { Database } from "@/integrations/supabase/types";

// Valid table names from database schema
export type TableName = keyof Database['public']['Tables'] | 'employee_locations';

// Operator types
export type FilterOperator = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'ilike' | 'in' | 'is';

// Filter definition with proper typing
export interface QueryFilter {
  column: string;
  operator: FilterOperator;
  value: unknown;
}

// Interface for query parameters with improved type safety
export interface QueryParams {
  select?: string;
  orderBy?: {
    column: string;
    ascending?: boolean;
  };
  limit?: number;
  offset?: number;
  filters?: QueryFilter[];
  [key: string]: unknown;
}
