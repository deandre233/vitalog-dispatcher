
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  resetFilters: () => void;
}

export function EmptyState({ resetFilters }: EmptyStateProps) {
  return (
    <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-200">
      <div className="max-w-md mx-auto">
        <h3 className="font-medium text-gray-900 mb-1">No personnel found</h3>
        <p className="text-gray-500 text-sm mb-4">
          Try adjusting your filters or search terms
        </p>
        <Button 
          variant="outline"
          onClick={resetFilters}
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );
}
