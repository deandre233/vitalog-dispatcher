
import { Filter, RefreshCw, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface DispatchControlsProps {
  onRefresh: () => void;
  statsVisible: boolean;
  setStatsVisible: (visible: boolean) => void;
  filtersVisible: boolean;
  setFiltersVisible: (visible: boolean) => void;
}

export function DispatchControls({ 
  onRefresh, 
  statsVisible, 
  setStatsVisible, 
  filtersVisible, 
  setFiltersVisible 
}: DispatchControlsProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    onRefresh();
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Dispatch board refreshed");
    }, 1000);
  };

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => setStatsVisible(!statsVisible)}
        className="glass-panel hover:bg-white/5"
      >
        <BarChart3 className="h-4 w-4 text-blue-300" />
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => setFiltersVisible(!filtersVisible)}
        className="glass-panel hover:bg-white/5"
      >
        <Filter className="h-4 w-4 text-purple-300" />
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleRefresh} 
        disabled={isRefreshing}
        className="glass-panel hover:bg-white/5"
      >
        <RefreshCw className={`h-4 w-4 text-green-300 ${isRefreshing ? 'animate-spin' : ''}`} />
      </Button>
    </div>
  );
}
