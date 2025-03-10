
import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, Clock, Star, Sparkles } from "lucide-react";

interface MessageFilterProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  onShowAITools?: () => void;
}

export function MessageFilter({ 
  activeFilter, 
  onFilterChange,
  onShowAITools
}: MessageFilterProps) {
  return (
    <div className="flex items-center justify-between w-full py-2">
      <Tabs 
        value={activeFilter} 
        onValueChange={onFilterChange}
        className="w-full max-w-md"
      >
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="all" className="flex items-center gap-1">
            <Filter className="h-3.5 w-3.5" />
            <span>All</span>
          </TabsTrigger>
          <TabsTrigger value="unread" className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5" />
            <span>Unread</span>
          </TabsTrigger>
          <TabsTrigger value="recent" className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>Recent</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="hidden md:flex items-center gap-2">
        {onShowAITools && (
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs border-orange-200 text-orange-600 hover:bg-orange-50"
            onClick={onShowAITools}
          >
            <Sparkles className="h-3.5 w-3.5 mr-1 text-orange-500" />
            AI Tools
          </Button>
        )}
        <Button variant="outline" size="sm" className="text-xs">
          <Filter className="h-3.5 w-3.5 mr-1" />
          More Filters
        </Button>
      </div>
    </div>
  );
}
