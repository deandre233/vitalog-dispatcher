
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  SlidersHorizontal,
  MapPin,
  BadgeCheck,
  Grid3X3,
  List,
  Table as TableIcon,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";

interface DirectoryFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  certFilter: string;
  setCertFilter: (filter: string) => void;
  stationFilter: string;
  setStationFilter: (filter: string) => void;
  viewMode: "grid" | "list" | "table";
  setViewMode: (mode: "grid" | "list" | "table") => void;
  certificationLevels: string[];
  stations: string[];
  resetFilters: () => void;
  onShowAIInsights: () => void;
}

export function DirectoryFilters({
  searchQuery,
  setSearchQuery,
  certFilter,
  setCertFilter,
  stationFilter,
  setStationFilter,
  viewMode,
  setViewMode,
  certificationLevels,
  stations,
  resetFilters,
  onShowAIInsights
}: DirectoryFiltersProps) {
  return (
    <motion.div 
      className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-[#E5DEFF]"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search personnel..."
            className="pl-9 border-[#E5DEFF] focus:border-[#8B5CF6] transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Select value={certFilter} onValueChange={setCertFilter}>
          <SelectTrigger className="border-[#E5DEFF] transition-all">
            <div className="flex items-center gap-2">
              <BadgeCheck className="h-4 w-4 text-[#8B5CF6]" />
              <SelectValue placeholder="Certification Level" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Certifications</SelectItem>
            {certificationLevels.map(cert => (
              <SelectItem key={cert} value={cert}>{cert}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={stationFilter} onValueChange={setStationFilter}>
          <SelectTrigger className="border-[#E5DEFF] transition-all">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#8B5CF6]" />
              <SelectValue placeholder="Station" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stations</SelectItem>
            {stations.map(station => (
              <SelectItem key={station} value={station}>{station}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 border-[#E5DEFF] hover:bg-[#F1F0FB] transition-all"
          >
            <Filter className="h-3.5 w-3.5 mr-1" />
            More Filters
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 border-[#E5DEFF] hover:bg-[#F1F0FB] transition-all"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 mr-1" />
            Sort
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 text-[#8B5CF6] border-[#E5DEFF] hover:bg-[#F1F0FB] transition-all"
            onClick={onShowAIInsights}
          >
            <Sparkles className="h-3.5 w-3.5 mr-1" />
            AI Insights
          </Button>
        </div>
        
        <div className="border rounded-md p-0.5 bg-gray-50">
          <Button 
            variant={viewMode === "grid" ? "default" : "ghost"} 
            size="sm" 
            className={`h-7 ${viewMode === "grid" ? "bg-white shadow-sm" : ""}`}
            onClick={() => setViewMode("grid")}
          >
            <Grid3X3 className="h-3.5 w-3.5" />
          </Button>
          <Button 
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm" 
            className={`h-7 ${viewMode === "list" ? "bg-white shadow-sm" : ""}`}
            onClick={() => setViewMode("list")}
          >
            <List className="h-3.5 w-3.5" />
          </Button>
          <Button 
            variant={viewMode === "table" ? "default" : "ghost"}
            size="sm" 
            className={`h-7 ${viewMode === "table" ? "bg-white shadow-sm" : ""}`}
            onClick={() => setViewMode("table")}
          >
            <TableIcon className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
