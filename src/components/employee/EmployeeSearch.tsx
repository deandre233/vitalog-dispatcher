
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface EmployeeSearchProps {
  searchQuery: string;
  onSearch: (query: string) => void;
}

export function EmployeeSearch({ searchQuery, onSearch }: EmployeeSearchProps) {
  return (
    <div className="flex-1 w-full md:w-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search employees..."
          className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400 h-12 rounded-xl"
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
    </div>
  );
}
