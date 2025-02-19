
import { Search, Calendar, Tag, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function SearchBar({ searchQuery, setSearchQuery }: SearchBarProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 items-center bg-white/50 backdrop-blur-md p-4 rounded-xl shadow-sm">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search broadcasts..."
          className="pl-10 bg-white border-gray-200 focus:border-blue-500 transition-all duration-300"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="flex gap-3 w-full lg:w-auto">
        <Button variant="outline" className="flex-1 lg:flex-none bg-white hover:bg-gray-50">
          <Calendar className="h-4 w-4 mr-2" />
          Date
        </Button>
        <Button variant="outline" className="flex-1 lg:flex-none bg-white hover:bg-gray-50">
          <Tag className="h-4 w-4 mr-2" />
          Priority
        </Button>
        <Button variant="outline" className="flex-1 lg:flex-none bg-white hover:bg-gray-50">
          <Filter className="h-4 w-4 mr-2" />
          Status
        </Button>
      </div>
    </div>
  );
}
