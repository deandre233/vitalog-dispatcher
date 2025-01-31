export interface SearchFilters {
  searchTerm: string;
  filterType: 'vehicle' | 'location' | 'crew' | 'all';
  sortBy?: 'distance' | 'time' | 'priority';
  status?: 'active' | 'inactive' | 'maintenance';
}

export interface SearchResult {
  id: string;
  type: 'vehicle' | 'location' | 'crew';
  title: string;
  subtitle?: string;
  status?: string;
  priority?: number;
  distance?: number;
}