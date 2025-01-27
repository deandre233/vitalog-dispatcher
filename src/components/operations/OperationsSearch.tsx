import React, { useState, useCallback } from 'react';
import { Search, Filter, SortAsc } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';
import type { SearchFilters } from '@/types/search';

interface OperationsSearchProps {
  onSearch: (filters: SearchFilters) => void;
  className?: string;
}

export function OperationsSearch({ onSearch, className = "" }: OperationsSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: '',
    filterType: 'all',
    sortBy: 'distance'
  });

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...filters, searchTerm: e.target.value };
    setFilters(newFilters);
    onSearch(newFilters);
  }, [filters, onSearch]);

  const handleFilterChange = useCallback((filterType: SearchFilters['filterType']) => {
    const newFilters = { ...filters, filterType };
    setFilters(newFilters);
    onSearch(newFilters);
    toast.success(`Filter updated to: ${filterType}`);
  }, [filters, onSearch]);

  const handleSortChange = useCallback((sortBy: SearchFilters['sortBy']) => {
    const newFilters = { ...filters, sortBy };
    setFilters(newFilters);
    onSearch(newFilters);
    toast.success(`Sorting by: ${sortBy}`);
  }, [filters, onSearch]);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="Search vehicles, locations, or crew members..."
          value={filters.searchTerm}
          onChange={handleSearch}
          className="pl-10 pr-4 h-10 w-full bg-white/90 backdrop-blur-sm"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="bg-white/90 backdrop-blur-sm">
            <Filter className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleFilterChange('all')}>
            All
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleFilterChange('vehicle')}>
            Vehicles Only
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleFilterChange('location')}>
            Locations Only
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleFilterChange('crew')}>
            Crew Only
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="bg-white/90 backdrop-blur-sm">
            <SortAsc className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleSortChange('distance')}>
            Sort by Distance
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSortChange('time')}>
            Sort by Time
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSortChange('priority')}>
            Sort by Priority
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}