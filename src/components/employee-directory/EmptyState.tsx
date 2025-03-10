
import { Button } from "@/components/ui/button";
import { Search, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

interface EmptyStateProps {
  resetFilters: () => void;
}

export function EmptyState({ resetFilters }: EmptyStateProps) {
  return (
    <motion.div 
      className="text-center py-16 bg-white/80 backdrop-blur-md rounded-lg border border-dashed border-[#E5DEFF]"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-md mx-auto">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-[#F1F0FB] rounded-full flex items-center justify-center">
            <Search className="h-8 w-8 text-[#8B5CF6]" />
          </div>
        </div>
        <h3 className="font-medium text-gray-900 text-xl mb-2">No personnel found</h3>
        <p className="text-gray-500 mb-6">
          Try adjusting your filters or search terms to find the personnel you're looking for
        </p>
        <Button 
          variant="outline"
          onClick={resetFilters}
          className="bg-white hover:bg-[#F1F0FB] border-[#E5DEFF]"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset Filters
        </Button>
      </div>
    </motion.div>
  );
}
