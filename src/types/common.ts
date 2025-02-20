
// Remove the duplicate SearchableItem export and import it from dispatch
export { SearchableItem } from './dispatch';

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

export interface SortOrder {
  field: string;
  direction: 'asc' | 'desc';
}

export interface FilterOptions {
  field: string;
  value: string | number | boolean;
  operator: 'eq' | 'neq' | 'gt' | 'lt' | 'contains';
}
