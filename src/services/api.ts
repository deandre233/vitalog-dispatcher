
import { createClient } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// Define the allowed table names based on what exists in your Supabase instance
export type TableNames = 
  | 'patients' 
  | 'employees' 
  | 'partners'
  | 'transport_records' 
  | 'agency_profiles'
  | 'authorization_requests'
  | 'medical_records'
  | 'insurance_records'
  | 'appointments'
  | 'dispatch_assignments'
  | 'claims'
  | 'payments'
  | 'invoices'
  | 'categories'
  | 'actions'
  | 'pages'
  | 'panels'
  | 'resources'
  | 'shift_records'
  | 'verification_queue'
  | 'centers'
  | 'workflows'
  | 'action_definitions'
  | 'action_instances'
  | 'agency_domains'
  | 'ai_analysis_results'
  | 'ai_configurations'
  | 'audit_logs'
  | 'billing_records'
  | 'billing_settings'
  | 'clearinghouse_configs'
  | 'content_templates'
  | 'content_versions'
  | 'corrective_actions'
  | 'corrective_action_documents'
  | 'dispatch_locations'
  | 'dispatch_patterns'
  | 'employee_navigation_settings'
  | 'employee_payroll_history'
  | 'employee_privileges'
  | 'employee_profiles'
  | 'employee_roles'
  | 'files'
  | 'historical_entries'
  | 'insurance_carriers'
  | 'insurance_groups'
  | 'insurance_policies'
  | 'medical_history'
  | 'medications'
  | 'navigation'
  | 'navigation_items'
  | 'notifications'
  | 'patient_care_reports'
  | 'patient_documents'
  | 'payer_database'
  | 'policy_types'
  | 'profiles'
  | 'qa_analysis_results'
  | 'route_optimizations'
  | 'schedule_recommendations'
  | 'service_requests'
  | 'subscription_tiers'
  | 'traffic_analysis'
  | 'transport_requests'
  | 'user_preferences'
  | 'user_roles'
  | 'workflow_logs';

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
    query?: (query: any) => Promise<any>;
    queryParams?: QueryParams;
  } = {}
): Promise<ApiResponse<T>> {
  try {
    const { id, query, queryParams } = options;
    
    // Explicit type casting to handle Supabase's typing issues
    let supabaseQuery = supabase.from(table as any);

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
      // Cast query to any to avoid TypeScript errors
      let query = supabaseQuery.select('*', { count: 'exact' }) as any;

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
    // Cast to any to avoid TypeScript errors with the table names
    const { data: result, error } = await (supabase.from(table as any).insert(data).select().single() as any);
    if (error) {
      throw new Error(error.message);
    }
    return result as unknown as T;
  },
  
  async update<T>(table: TableNames, id: string, data: any): Promise<T> {
    // Cast to any to avoid TypeScript errors with the table names
    const { data: result, error } = await (supabase.from(table as any).update(data).eq('id', id).select().single() as any);
    if (error) {
      throw new Error(error.message);
    }
    return result as unknown as T;
  },
  
  async delete(table: TableNames, id: string): Promise<void> {
    // Cast to any to avoid TypeScript errors with the table names
    const { error } = await supabase.from(table as any).delete().eq('id', id);
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
