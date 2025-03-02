
import { FilterOperator, QueryParams } from './types';

/**
 * Applies a filter to a query based on the operator and value
 */
export function applyFilter(query: any, column: string, operator: FilterOperator, value: unknown) {
  switch (operator) {
    case 'eq':
      return query.eq(column, value);
    case 'neq':
      return query.neq(column, value);
    case 'gt':
      return query.gt(column, value);
    case 'gte':
      return query.gte(column, value);
    case 'lt':
      return query.lt(column, value);
    case 'lte':
      return query.lte(column, value);
    case 'like':
      return query.like(column, value as string);
    case 'ilike':
      return query.ilike(column, value as string);
    case 'in':
      return query.in(column, value as any[]);
    case 'is':
      return query.is(column, value as boolean | null);
    default:
      return query;
  }
}

/**
 * Apply all filters from query params to a Supabase query
 */
export function applyFilters(dbQuery: any, query: QueryParams) {
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
      dbQuery = applyFilter(dbQuery, filter.column, filter.operator, filter.value);
    }
  }

  // Filter out special keys and apply equals filter for the rest (backward compatibility)
  Object.entries(query).forEach(([key, value]) => {
    if (!['select', 'orderBy', 'limit', 'offset', 'filters'].includes(key) && value !== undefined) {
      dbQuery = dbQuery.eq(key, value);
    }
  });

  return dbQuery;
}
