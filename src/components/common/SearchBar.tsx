import React, { useState, useCallback, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { searchString } from '@/utils/stringUtils';
import debounce from 'lodash/debounce';

interface SearchableItem {
  id: string;
  [key: string]: any;
}

interface SearchBarProps<T extends SearchableItem> {
  items: T[];
  searchFields: (keyof T)[];
  onResultsChange: (results: T[]) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar<T extends SearchableItem>({
  items,
  searchFields,
  onResultsChange,
  placeholder = "Search...",
  className = ""
}: SearchBarProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');

  const filterItems = useCallback((term: string) => {
    if (!term.trim()) {
      onResultsChange(items);
      return;
    }

    const filtered = items.filter(item =>
      searchFields.some(field => {
        const value = item[field];
        return typeof value === 'string' && searchString(term, value);
      })
    );

    onResultsChange(filtered);
  }, [items, searchFields, onResultsChange]);

  const debouncedFilter = useMemo(
    () => debounce(filterItems, 300),
    [filterItems]
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTerm = e.target.value;
    setSearchTerm(newTerm);
    debouncedFilter(newTerm);
  };

  return (
    <Input
      type="text"
      value={searchTerm}
      onChange={handleSearch}
      placeholder={placeholder}
      className={className}
    />
  );
}